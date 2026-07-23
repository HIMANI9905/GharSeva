import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Clock, Phone, MessageSquare,
  MapPin, Shield, Star, AlertCircle, Calendar, Copy,
  Truck, Wrench, ThumbsUp
} from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusSteps = [
  { key: 'pending', label: 'Booking Confirmed', icon: CheckCircle2 },
  { key: 'accepted', label: 'Helper Accepted', icon: ThumbsUp },
  { key: 'in_progress', label: 'On The Way', icon: Truck },
  { key: 'reached', label: 'Helper Reached', icon: MapPin },
  { key: 'started', label: 'Service Started', icon: Wrench },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const statusOrder = ['pending', 'accepted', 'in_progress', 'reached', 'started', 'completed'];

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [helperContact, setHelperContact] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await API.get(`/bookings/${bookingId}`);
      if (res.data.success) {
        setBooking(res.data.data);
        // Auto-reveal contact if booking is accepted or beyond
        const status = res.data.data.status;
        if (['accepted', 'in_progress', 'completed'].includes(status)) {
          setHelperContact(res.data.data.provider?.phone);
        }
      }
    } catch (err) {
      toast.error('Booking not found');
      navigate('/customer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    const idx = statusOrder.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const copyBookingId = () => {
    navigator.clipboard.writeText(booking?.bookingId || '');
    toast.success('Booking ID copied!');
  };

  const handleReviewSubmit = async () => {
    if (!review.trim()) { toast.error('Please write a review'); return; }
    setSubmittingReview(true);
    try {
      await API.post('/reviews', {
        booking: booking._id,
        provider: booking.provider._id,
        rating,
        review
      });
      toast.success('Review submitted! Thank you 🙏');
      setShowReview(false);
      fetchBooking();
    } catch (err) {
      toast.error('Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const currentStatusIdx = getStatusIndex(booking.status);
  const provider = booking.provider;
  const isCompleted = booking.status === 'completed';
  const canSeeContact = ['accepted', 'in_progress', 'completed'].includes(booking.status);

  return (
    <div className="min-h-screen bg-brand-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <button onClick={() => navigate('/customer/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-brand-primary mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> My Bookings
        </button>

        {/* Booking Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-heading font-bold text-xl text-slate-900">Booking Details</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  booking.status === 'completed' ? 'bg-brand-success/10 text-brand-success' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                  booking.status === 'accepted' ? 'bg-blue-100 text-brand-primary' :
                  'bg-amber-100 text-brand-secondary'
                }`}>
                  {booking.status === 'in_progress' ? 'On The Way' : booking.status?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span className="font-mono font-bold text-slate-700">{booking.bookingId}</span>
                <button onClick={copyBookingId} className="hover:text-brand-primary transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Scheduled for</p>
              <p className="font-bold text-slate-900">{booking.scheduledDate}</p>
              <p className="text-sm text-brand-primary font-semibold">{booking.timeSlot}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Status Timeline + Contact */}
          <div className="lg:col-span-2 space-y-6">

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <h3 className="font-heading font-bold text-slate-900 mb-6">Booking Status</h3>
              <div className="relative">
                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStatusIdx;
                  const isActive = idx === currentStatusIdx;
                  return (
                    <div key={step.key} className="flex items-start gap-4 mb-6 last:mb-0 relative">
                      {idx < statusSteps.length - 1 && (
                        <div className={`absolute left-4 top-8 w-0.5 h-10 ${isDone ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
                      )}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                        isDone ? 'bg-brand-primary border-brand-primary' : 'bg-white border-slate-200'
                      } ${isActive ? 'ring-4 ring-brand-primary/20' : ''}`}>
                        <step.icon className={`w-4 h-4 ${isDone ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-bold text-sm ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                        {isActive && <p className="text-xs text-brand-primary font-semibold mt-0.5 animate-pulse">● Current Status</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Helper Contact - ONLY after booking accepted */}
            {canSeeContact && provider && (
              <div className="bg-brand-primary/5 rounded-2xl p-6 border border-brand-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-heading font-bold text-slate-900">Helper Contact Details</h3>
                  <span className="text-xs bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-full font-bold">Booking Confirmed</span>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={provider.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'}
                    alt={provider.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-primary"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{provider.name}</p>
                    <p className="text-brand-primary font-semibold text-sm">Your Service Helper</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a href={`tel:${provider.phone || '+91 98765 43210'}`} className="flex items-center justify-center gap-2 py-3 bg-brand-success text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors">
                    <Phone className="w-4 h-4" /> Call Helper
                  </a>
                  <Link to={`/chat?userId=${provider._id}`} className="flex items-center justify-center gap-2 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                    <MessageSquare className="w-4 h-4" /> Chat
                  </Link>
                </div>
              </div>
            )}

            {!canSeeContact && (
              <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <p className="text-sm text-slate-600 font-medium">Helper contact details will be revealed once they accept your booking request.</p>
              </div>
            )}

            {/* Review Section */}
            {isCompleted && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
                <h3 className="font-heading font-bold text-slate-900 mb-4">Rate Your Experience</h3>
                {showReview ? (
                  <div>
                    <div className="flex gap-2 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setRating(s)}>
                          <Star className={`w-8 h-8 ${s <= rating ? 'text-brand-secondary fill-brand-secondary' : 'text-slate-300'} transition-colors`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={review}
                      onChange={e => setReview(e.target.value)}
                      rows={3}
                      placeholder="Share your experience with this service..."
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-brand-primary resize-none mb-4"
                    />
                    <button
                      onClick={handleReviewSubmit}
                      disabled={submittingReview}
                      className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowReview(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary font-bold rounded-xl hover:bg-brand-secondary/20 transition-colors"
                  >
                    <Star className="w-5 h-5" /> Write a Review
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Summary Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
              <h3 className="font-heading font-bold text-slate-900 mb-4">Payment Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Service</span>
                  <span className="font-bold text-slate-900">{booking.service?.name || 'Home Service'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Price</span>
                  <span className="font-bold">₹{booking.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Platform Fee</span>
                  <span className="font-bold">₹30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">GST (5%)</span>
                  <span className="font-bold">₹{Math.round((booking.totalAmount + 30) * 0.05)}</span>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between">
                  <span className="font-heading font-bold text-slate-900">Total Paid</span>
                  <span className="font-heading font-black text-brand-primary">₹{Math.round(booking.totalAmount + 30 + (booking.totalAmount + 30) * 0.05)}</span>
                </div>
              </div>
              <div className={`mt-4 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-wide ${
                booking.paymentStatus === 'paid' ? 'bg-brand-success/10 text-brand-success' : 'bg-amber-100 text-amber-700'
              }`}>
                {booking.paymentStatus === 'paid' ? '✓ Payment Complete' : 'Payment Pending'}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
              <h3 className="font-heading font-bold text-slate-900 mb-3">Service Location</h3>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                <span>{booking.serviceAddress?.fullAddress || `${booking.serviceAddress?.street || ''}, ${booking.serviceAddress?.city || 'Mumbai'}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
