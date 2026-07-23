import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, MapPin, Phone, Mail, Calendar, Clock, Star, Shield,
  Bell, ChevronRight, Package, CheckCircle2, XCircle, AlertCircle,
  ArrowRight, Search, Zap, Droplet, Wind, Hammer, Sparkles,
  Wrench, Edit3, LogOut, Home, Heart, FileText, HelpCircle,
  TrendingUp, Bot
} from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [activeSection, setActiveSection] = useState('overview');

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

  const handleLogout = () => { logout(); navigate('/'); };

  const activeBookings = bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected');

  const getTabBookings = () => {
    if (activeTab === 'active') return activeBookings;
    if (activeTab === 'completed') return completedBookings;
    if (activeTab === 'cancelled') return cancelledBookings;
    return bookings;
  };

  const getStatusColor = (status) => {
    const map = { pending: 'bg-amber-100 text-amber-700', accepted: 'bg-blue-100 text-blue-700', in_progress: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600', rejected: 'bg-red-100 text-red-600' };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  const quickServices = [
    { name: 'Electrician', icon: Zap, path: '/providers?service=Electrician' },
    { name: 'Plumber', icon: Droplet, path: '/providers?service=Plumber' },
    { name: 'AC Repair', icon: Wind, path: '/providers?service=AC+Repair' },
    { name: 'Carpenter', icon: Hammer, path: '/providers?service=Carpenter' },
    { name: 'Cleaning', icon: Sparkles, path: '/providers?service=Cleaning' },
    { name: 'AI Estimate', icon: Bot, path: '/ai-price-estimator' },
  ];

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'bookings', label: 'My Bookings', icon: Package },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen shrink-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'} alt={user?.name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary" />
            <div>
              <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
              <p className="text-xs text-brand-primary font-semibold">Customer</p>
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
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading font-bold text-slate-900">My Dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-red-500 font-semibold">Sign Out</button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">

          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                <p className="text-slate-500 mt-1">What service do you need today?</p>
              </div>

              {/* Quick Service Cards */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
                {quickServices.map((svc, idx) => (
                  <Link key={idx} to={svc.path} className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-brand-primary/30 hover:shadow-card transition-all flex flex-col items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                      <svc.icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 text-center">{svc.name}</span>
                  </Link>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Bookings', value: bookings.length, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
                  { label: 'Active', value: activeBookings.length, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Completed', value: completedBookings.length, color: 'text-brand-success', bg: 'bg-brand-success/10' },
                  { label: 'Cancelled', value: cancelledBookings.length, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <Package className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className={`font-heading font-black text-2xl ${stat.color}`}>{loading ? '-' : stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-heading font-bold text-slate-900">Recent Bookings</h3>
                  <button onClick={() => setActiveSection('bookings')} className="text-sm text-brand-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3"/></button>
                </div>
                {loading ? (
                  <div className="p-10 text-center text-slate-400">Loading...</div>
                ) : bookings.length === 0 ? (
                  <div className="p-10 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700 mb-1">No bookings yet</p>
                    <p className="text-slate-400 text-sm mb-4">Book your first home service today!</p>
                    <Link to="/providers" className="px-5 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                      Find Helpers <ArrowRight className="w-4 h-4"/>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {bookings.slice(0, 4).map(b => (
                      <Link to={`/booking/${b._id}`} key={b._id} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                        <img src={b.provider?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{b.service?.name || 'Home Service'}</p>
                          <p className="text-sm text-slate-500">{b.provider?.name} · {b.scheduledDate}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(b.status)}`}>{b.status}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeSection === 'bookings' && (
            <div className="animate-fade-in">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">My Bookings</h2>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {[
                  { id: 'active', label: `Active (${activeBookings.length})` },
                  { id: 'completed', label: `Completed (${completedBookings.length})` },
                  { id: 'cancelled', label: `Cancelled (${cancelledBookings.length})` },
                  { id: 'all', label: `All (${bookings.length})` },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-brand-primary text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {getTabBookings().length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700">No bookings here</p>
                  </div>
                ) : getTabBookings().map(b => (
                  <Link to={`/booking/${b._id}`} key={b._id} className="block bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-soft transition-all p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <img src={b.provider?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'} alt="" className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-slate-900">{b.service?.name || 'Home Service'}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(b.status)}`}>{b.status?.replace('_',' ')}</span>
                        </div>
                        <p className="text-sm text-slate-500">Helper: {b.provider?.name} · #{b.bookingId}</p>
                        <p className="text-sm text-slate-500">{b.scheduledDate} at {b.timeSlot}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-primary text-lg">₹{b.totalAmount}</p>
                        <p className="text-xs text-slate-400 mt-1">View Details →</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="animate-fade-in">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Notifications</h2>
              {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700">All caught up!</p>
                  <p className="text-slate-400 text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n._id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-card flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{n.title}</p>
                        <p className="text-slate-500 text-sm">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeSection === 'profile' && (
            <div className="animate-fade-in max-w-2xl">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">My Profile</h2>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-primary" />
                  <div>
                    <h3 className="font-heading font-bold text-xl text-slate-900">{user?.name}</h3>
                    <p className="text-brand-primary font-semibold text-sm">Customer</p>
                    <span className="text-xs bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-full font-bold">Verified Account</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Mail, label: 'Email', value: user?.email },
                    { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
                    { icon: MapPin, label: 'City', value: user?.address?.city || 'Mumbai' },
                    { icon: MapPin, label: 'Pincode', value: user?.address?.zipCode || '400001' },
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
              </div>
            </div>
          )}

          {/* HELP & SUPPORT */}
          {activeSection === 'support' && (
            <div className="animate-fade-in max-w-2xl">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Help & Support</h2>
              <div className="space-y-4">
                {[
                  { title: 'Frequently Asked Questions', desc: 'Find answers to common questions', icon: HelpCircle, action: 'View FAQ' },
                  { title: 'Raise a Complaint', desc: 'Report an issue with a service', icon: AlertCircle, action: 'Submit' },
                  { title: 'Request Refund', desc: 'Apply for a refund on completed booking', icon: FileText, action: 'Apply' },
                  { title: 'Emergency Contact', desc: '24/7 support helpline', icon: Phone, action: '1800-123-4567' },
                  { title: 'Email Support', desc: 'support@gharseva.in', icon: Mail, action: 'Send Email' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <button className="px-4 py-2 text-brand-primary border border-brand-primary/30 rounded-xl text-sm font-bold hover:bg-brand-primary/5 transition-colors whitespace-nowrap">{item.action}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
