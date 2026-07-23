import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Bot, ArrowLeft, CheckCircle2,
  CreditCard, Smartphone, Banknote, Shield, Star, ArrowRight, User
} from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const PLATFORM_FEE = 30;
  const GST_RATE = 0.05;

  const preSelectedService = location.state?.serviceId || '';

  useEffect(() => {
    fetchProviderAndServices();
  }, [providerId]);

  const fetchProviderAndServices = async () => {
    try {
      const [provRes, svcRes] = await Promise.all([
        API.get(`/providers/${providerId}`),
        API.get('/services')
      ]);
      if (provRes.data.success) setProvider(provRes.data.data);
      if (svcRes.data.success) {
        setServices(svcRes.data.data);
        if (preSelectedService) setSelectedService(preSelectedService);
        else if (svcRes.data.data.length > 0) setSelectedService(svcRes.data.data[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const basePrice = provider?.providerDetails?.hourlyRate || provider?.hourlyRate || 499;
  const platformFee = PLATFORM_FEE;
  const gst = Math.round((basePrice + platformFee) * GST_RATE);
  const total = basePrice + platformFee + gst;

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedSlot) {
      toast.error('Please select service, date and time slot');
      return;
    }
    setSubmitting(true);
    try {
      const res = await API.post('/bookings', {
        providerId: provider?._id || provider?.user?._id || providerId,
        serviceId: selectedService,
        scheduledDate: selectedDate,
        timeSlot: selectedSlot,
        totalAmount: basePrice,
        serviceAddress: {
          street: user?.address?.street || '',
          city: user?.address?.city || 'Mumbai',
          state: user?.address?.state || 'Maharashtra',
          zipCode: user?.address?.zipCode || '400001',
          fullAddress: `${user?.address?.street || ''}, ${user?.address?.city || 'Mumbai'}`
        },
        paymentMethod,
        notes
      });
      if (res.data.success) {
        toast.success('Booking confirmed! 🎉');
        navigate(`/booking/${res.data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
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

  const providerUser = provider?.user || provider;
  const providerProfile = provider?.providerDetails || provider;

  return (
    <div className="min-h-screen bg-brand-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-brand-primary mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Helpers
        </button>

        <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">Complete Your Booking</h1>
        <p className="text-slate-500 mb-8">You're booking a service from a verified GharSeva professional</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Booking Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Provider Card */}
            {providerUser && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex items-center gap-4">
                <img
                  src={providerUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'}
                  alt={providerUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-secondary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-slate-900">{providerUser.name}</h3>
                    <span className="flex items-center gap-1 text-xs bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-full font-bold">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-brand-primary font-medium">{providerProfile?.bio?.split('.')[0] || 'Home Service Expert'}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-brand-secondary fill-brand-secondary" /> {providerProfile?.rating?.average || 4.8}</span>
                    <span>{providerProfile?.completedJobsCount || 0} Jobs</span>
                    <span>{providerProfile?.experienceYears || 3} Yrs Experience</span>
                  </div>
                </div>
              </div>
            )}

            {/* Select Service */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">1</span>
                Select Service
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {services.map(svc => (
                  <button
                    key={svc._id}
                    type="button"
                    onClick={() => setSelectedService(svc._id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedService === svc._id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="font-bold text-sm text-slate-900">{svc.name}</div>
                    <div className="text-xs text-slate-500 mt-1">Starting ₹{svc.basePrice || basePrice}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Date & Time */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">2</span>
                Choose Date & Time
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" /> Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={getTomorrowDate()}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary text-slate-900 bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-1" /> Preferred Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${selectedSlot === slot ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">3</span>
                Payment Method
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'razorpay', label: 'Online', icon: Smartphone },
                  { id: 'card', label: 'Card', icon: CreditCard }
                ].map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === pm.id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <pm.icon className={`w-6 h-6 ${paymentMethod === pm.id ? 'text-brand-primary' : 'text-slate-500'}`} />
                    <span className={`text-xs font-bold ${paymentMethod === pm.id ? 'text-brand-primary' : 'text-slate-600'}`}>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <h3 className="font-heading font-bold text-slate-900 mb-3">Special Instructions (Optional)</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Please bring your own tools. Doorbell doesn't work, please call."
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
          </div>

          {/* RIGHT: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card sticky top-24">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-heading font-bold text-slate-900 text-lg">Booking Summary</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Service Charge</span>
                  <span className="font-bold text-slate-900">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-1">
                    Platform Fee
                    <span className="text-xs text-slate-400">(GharSeva revenue)</span>
                  </span>
                  <span className="font-bold text-slate-900">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">GST (5%)</span>
                  <span className="font-bold text-slate-900">₹{gst}</span>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-heading font-bold text-slate-900 text-lg">Grand Total</span>
                    <span className="font-heading font-black text-brand-primary text-xl">₹{total}</span>
                  </div>
                </div>

                <div className="bg-brand-success/5 border border-brand-success/20 rounded-xl p-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-success shrink-0" />
                  <p className="text-xs text-brand-success font-semibold">30-Day Service Guarantee included</p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !selectedService || !selectedDate || !selectedSlot}
                  className="w-full py-4 bg-brand-primary hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-glow-blue"
                >
                  {submitting ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Confirming...</>
                  ) : (
                    <><CheckCircle2 className="w-5 h-5" /> Confirm Booking</>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  By confirming, you agree to our Terms of Service and Cancellation Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
