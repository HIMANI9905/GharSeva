import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, MapPin, Phone, Star, Shield, Bell, ChevronRight,
  Package, CheckCircle2, XCircle, AlertCircle, ArrowRight,
  Wrench, LogOut, Home, FileText, TrendingUp, Clock,
  ToggleLeft, ToggleRight, IndianRupee, Calendar, Wifi, WifiOff
} from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const { user, providerDetails, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [availabilityStatus, setAvailabilityStatus] = useState('online');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, notifRes] = await Promise.all([
        API.get('/bookings'),
        API.get('/notifications').catch(() => ({ data: { data: [] } }))
      ]);
      if (bookRes.data.success) setBookings(bookRes.data.data);
      if (notifRes.data?.data) setNotifications(notifRes.data.data);
    } catch (err) {
      toast.error('Could not load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => ['accepted', 'in_progress'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const todayEarnings = completedBookings
    .filter(b => new Date(b.updatedAt).toDateString() === new Date().toDateString())
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const weekEarnings = completedBookings
    .filter(b => {
      const d = new Date(b.updatedAt);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    })
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const handleBookingAction = async (bookingId, status) => {
    try {
      const res = await API.put(`/bookings/${bookingId}/status`, { status });
      if (res.data.success) {
        toast.success(`Booking ${status}!`);
        fetchData();
      }
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const getStatusColor = (status) => {
    const map = { pending: 'bg-amber-100 text-amber-700', accepted: 'bg-blue-100 text-blue-700', in_progress: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600', rejected: 'bg-red-100 text-red-600' };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'requests', label: `Requests (${pendingBookings.length})`, icon: Bell },
    { id: 'jobs', label: 'My Jobs', icon: Package },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const helperProfile = providerDetails || {};
  const userAddress = user?.address || {};

  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen shrink-0">
        <div className="p-6 border-b border-slate-100">
          {/* Profile - Photo NOT clickable as per requirement */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'}
                alt={user?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-secondary"
              />
              {helperProfile.status === 'approved' && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-success rounded-full border-2 border-white flex items-center justify-center">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
              <p className="text-xs text-brand-primary font-semibold">Service Helper</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
            <span className="text-xs font-bold text-slate-600">Status</span>
            <div className="flex items-center gap-1">
              {['online', 'offline', 'busy'].map(s => (
                <button
                  key={s}
                  onClick={() => setAvailabilityStatus(s)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold capitalize transition-all ${availabilityStatus === s ?
                    s === 'online' ? 'bg-brand-success text-white' :
                    s === 'busy' ? 'bg-brand-secondary text-white' : 'bg-slate-500 text-white'
                    : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeSection === item.id ? 'bg-brand-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium text-sm transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading font-bold text-slate-900">Helper Dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-red-500 font-semibold">Sign Out</button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">

          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-bold text-slate-900">Welcome, {user?.name?.split(' ')[0]}! 🔧</h2>
                <p className="text-slate-500">Here's your service summary for today</p>
              </div>

              {/* Earnings Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Today's Earnings", value: `₹${todayEarnings}`, icon: IndianRupee, color: 'text-brand-success', bg: 'bg-brand-success/10' },
                  { label: 'This Week', value: `₹${weekEarnings}`, icon: TrendingUp, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
                  { label: 'Total Earned', value: `₹${totalEarnings}`, icon: IndianRupee, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
                  { label: 'Completed Jobs', value: completedBookings.length, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className={`font-heading font-black text-2xl ${stat.color}`}>{loading ? '-' : stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Pending Requests Alert */}
              {pendingBookings.length > 0 && (
                <div className="bg-brand-secondary/10 border border-brand-secondary/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <Bell className="w-6 h-6 text-brand-secondary animate-bounce" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">You have {pendingBookings.length} new booking request{pendingBookings.length > 1 ? 's' : ''}!</p>
                    <p className="text-sm text-slate-500">Accept quickly to secure the booking</p>
                  </div>
                  <button onClick={() => setActiveSection('requests')} className="px-4 py-2 bg-brand-secondary text-white font-bold rounded-xl text-sm hover:bg-orange-500 transition-colors">View</button>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-heading font-bold text-slate-900">Recent Jobs</h3>
                </div>
                {bookings.slice(0, 4).length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No bookings yet. Complete your profile to attract customers.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {bookings.slice(0, 4).map(b => (
                      <div key={b._id} className="flex items-center gap-4 p-5">
                        <img src={b.customer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-sm">{b.service?.name || 'Service'}</p>
                          <p className="text-xs text-slate-500">{b.customer?.name} · {b.scheduledDate}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(b.status)}`}>{b.status}</span>
                        <span className="font-bold text-brand-primary text-sm">₹{b.totalAmount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOOKING REQUESTS */}
          {activeSection === 'requests' && (
            <div className="animate-fade-in">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">New Booking Requests</h2>
              {pendingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700">No new requests</p>
                  <p className="text-slate-400 text-sm">New booking requests will appear here</p>
                </div>
              ) : pendingBookings.map(b => (
                <div key={b._id} className="bg-white rounded-2xl border border-brand-secondary/30 shadow-card p-5 mb-4">
                  <div className="flex items-start gap-4">
                    <img src={b.customer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{b.service?.name || 'Home Service'}</h3>
                      <p className="text-sm text-slate-600">Customer: <strong>{b.customer?.name}</strong></p>
                      <p className="text-sm text-slate-500">{b.scheduledDate} at {b.timeSlot}</p>
                      <p className="text-sm font-bold text-brand-primary mt-1">₹{b.totalAmount}</p>
                      {b.notes && <p className="text-xs text-slate-400 mt-1 italic">Note: {b.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleBookingAction(b._id, 'accepted')} className="flex-1 py-3 bg-brand-success text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Accept
                    </button>
                    <button onClick={() => handleBookingAction(b._id, 'rejected')} className="flex-1 py-3 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ALL JOBS */}
          {activeSection === 'jobs' && (
            <div className="animate-fade-in">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">All Jobs</h2>
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700">No jobs yet</p>
                  </div>
                ) : bookings.map(b => (
                  <div key={b._id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900">{b.service?.name || 'Home Service'}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(b.status)}`}>{b.status?.replace('_',' ')}</span>
                        </div>
                        <p className="text-sm text-slate-500">Customer: {b.customer?.name} · #{b.bookingId}</p>
                        <p className="text-sm text-slate-500">{b.scheduledDate} at {b.timeSlot}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-primary">₹{b.totalAmount}</p>
                        {b.status === 'accepted' && (
                          <button onClick={() => handleBookingAction(b._id, 'in_progress')} className="mt-2 text-xs px-3 py-1.5 bg-brand-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                            Mark Started
                          </button>
                        )}
                        {b.status === 'in_progress' && (
                          <button onClick={() => handleBookingAction(b._id, 'completed')} className="mt-2 text-xs px-3 py-1.5 bg-brand-success text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EARNINGS */}
          {activeSection === 'earnings' && (
            <div className="animate-fade-in max-w-3xl">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Earnings Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Today", value: todayEarnings, color: 'text-brand-success' },
                  { label: 'This Week', value: weekEarnings, color: 'text-brand-primary' },
                  { label: 'Total (All Time)', value: totalEarnings, color: 'text-brand-secondary' },
                ].map((e, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card text-center">
                    <p className="text-sm text-slate-500 font-medium mb-2">{e.label}</p>
                    <p className={`font-heading font-black text-3xl ${e.color}`}>₹{e.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-heading font-bold text-slate-900">Completed Job History</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {completedBookings.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No completed jobs yet</div>
                  ) : completedBookings.map(b => (
                    <div key={b._id} className="flex items-center justify-between p-5">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{b.service?.name || 'Service'}</p>
                        <p className="text-xs text-slate-500">{b.customer?.name} · {b.scheduledDate}</p>
                      </div>
                      <span className="font-bold text-brand-success">+₹{b.totalAmount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeSection === 'profile' && (
            <div className="animate-fade-in max-w-2xl">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">My Helper Profile</h2>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                {/* Photo - Display Only, NOT Clickable */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'}
                    alt={user?.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-secondary"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-xl text-slate-900">{user?.name}</h3>
                    <p className="text-brand-primary font-semibold text-sm">Service Helper · GharSeva Partner</p>
                    {helperProfile.status === 'approved' && (
                      <span className="text-xs bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit mt-1">
                        <Shield className="w-3 h-3"/> Verified Professional
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Star, label: 'Rating', value: `${helperProfile.rating?.average || 4.8} ⭐ (${helperProfile.rating?.count || 0} reviews)` },
                    { icon: Package, label: 'Jobs Completed', value: helperProfile.completedJobsCount || completedBookings.length || 0 },
                    { icon: Clock, label: 'Experience', value: `${helperProfile.experienceYears || 3} Years` },
                    { icon: IndianRupee, label: 'Service Rate', value: `₹${helperProfile.hourlyRate || 499}/hour` },
                    { icon: MapPin, label: 'Area', value: `${userAddress.city || 'Mumbai'}` },
                    { icon: MapPin, label: 'Pincode', value: userAddress.zipCode || '400001' },
                  ].map((field, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <field.icon className="w-5 h-5 text-brand-primary shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{field.label}</p>
                        <p className="font-bold text-slate-900 text-sm">{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-700 font-semibold">📌 Your phone number and full home address are kept private and are only shared with customers after a confirmed booking.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
