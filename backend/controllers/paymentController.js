const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');

// @desc    Create Razorpay Order (Mock / Integration Ready)
// @route   POST /api/payments/razorpay-order
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const razorpayOrderId = 'order_mock_' + Date.now();

    res.status(200).json({
      success: true,
      order: {
        id: razorpayOrderId,
        amount: amount * 100, // in paise
        currency: 'INR',
        receipt: `receipt_${booking.bookingId}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const payment = await Payment.create({
      booking: booking._id,
      customer: booking.customer,
      provider: booking.provider,
      amount: booking.totalAmount,
      paymentMethod: 'razorpay',
      razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || 'pay_mock_' + Date.now(),
      status: 'success'
    });

    booking.paymentStatus = 'paid';
    await booking.save();

    // Auto generate invoice
    await Invoice.create({
      booking: booking._id,
      customer: booking.customer,
      provider: booking.provider,
      serviceName: 'Home Service',
      basePrice: booking.totalAmount,
      taxAmount: Math.round(booking.totalAmount * 0.18),
      discountAmount: 0,
      totalAmount: Math.round(booking.totalAmount * 1.18),
      paymentStatus: 'Paid'
    });

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};
