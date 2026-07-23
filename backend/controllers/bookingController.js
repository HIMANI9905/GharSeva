const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');

// Helper to filter sensitive data
const filterSensitiveData = (booking, currentUser) => {
  const b = booking.toObject ? booking.toObject() : booking;
  
  // If status is pending or cancelled/rejected, hide contact details from the OTHER party
  const canSeeContact = ['accepted', 'in_progress', 'completed'].includes(b.status);

  if (!canSeeContact) {
    if (b.provider && currentUser.role === 'customer') {
      b.provider.phone = undefined;
      b.provider.email = undefined;
    }
    if (b.customer && currentUser.role === 'provider') {
      b.customer.phone = undefined;
      b.customer.email = undefined;
      if (b.customer.address) {
        b.customer.address.street = undefined; // only keep city/zip if needed
      }
      if (b.serviceAddress) {
        b.serviceAddress.fullAddress = undefined;
        b.serviceAddress.street = undefined;
      }
    }
  }
  return b;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res, next) => {
  try {
    const {
      providerId,
      serviceId,
      scheduledDate,
      timeSlot,
      totalAmount,
      serviceAddress,
      paymentMethod,
      notes,
      aiEstimatedRange
    } = req.body;

    const booking = await Booking.create({
      customer: req.user.id,
      provider: providerId,
      service: serviceId,
      scheduledDate,
      timeSlot,
      totalAmount,
      serviceAddress,
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
      aiEstimatedRange
    });

    // Create Notification for Provider
    await Notification.create({
      recipient: providerId,
      title: 'New Service Booking Request',
      message: `You have received a new booking #${booking.bookingId} for ${scheduledDate} at ${timeSlot}.`,
      type: 'booking_update',
      link: '/provider/dashboard'
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings (Customer or Provider)
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'customer') {
      filter.customer = req.user.id;
    } else if (req.user.role === 'provider') {
      filter.provider = req.user.id;
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'name email phone avatar address')
      .populate('provider', 'name email phone avatar')
      .populate('service')
      .sort('-createdAt');

    const filteredBookings = bookings.map(b => filterSensitiveData(b, req.user));

    res.status(200).json({
      success: true,
      count: filteredBookings.length,
      data: filteredBookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone avatar address')
      .populate('provider', 'name email phone avatar')
      .populate('service');

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const filteredBooking = filterSensitiveData(booking, req.user);

    res.status(200).json({
      success: true,
      data: filteredBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (accept, reject, complete, cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, cancelReason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('service');

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    booking.status = status;
    if (cancelReason) {
      booking.cancelReason = cancelReason;
    }

    if (status === 'completed') {
      booking.paymentStatus = 'paid';

      // Auto Generate Invoice
      await Invoice.create({
        booking: booking._id,
        customer: booking.customer,
        provider: booking.provider,
        serviceName: booking.service ? booking.service.name : 'Home Service',
        basePrice: booking.totalAmount,
        taxAmount: Math.round(booking.totalAmount * 0.18),
        discountAmount: 0,
        totalAmount: Math.round(booking.totalAmount * 1.18),
        paymentStatus: 'Paid'
      });
    }

    await booking.save();

    // Create notification
    const recipient = req.user.role === 'customer' ? booking.provider : booking.customer;
    await Notification.create({
      recipient,
      title: `Booking ${status.toUpperCase().replace('_', ' ')}`,
      message: `Booking #${booking.bookingId} status has been updated to ${status}.`,
      type: 'booking_update',
      link: '/dashboard'
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
