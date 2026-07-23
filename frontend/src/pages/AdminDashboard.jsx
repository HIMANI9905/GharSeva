import React, { useState, useEffect } from 'react';
import { Users, UserCheck, ShieldAlert, DollarSign, CheckCircle2, XCircle, TrendingUp, BarChart3, Wrench } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import API from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 128,
    totalProviders: 42,
    pendingProviders: 3,
    totalBookings: 312,
    completedBookings: 284,
    openComplaints: 2,
    totalRevenue: 148500
  });

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock analytics data for Recharts
  const revenueChartData = [
    { month: 'Jan', revenue: 24000, bookings: 45 },
    { month: 'Feb', revenue: 32000, bookings: 58 },
    { month: 'Mar', revenue: 45000, bookings: 82 },
    { month: 'Apr', revenue: 58000, bookings: 95 },
    { month: 'May', revenue: 72000, bookings: 120 },
    { month: 'Jun', revenue: 94000, bookings: 160 },
    { month: 'Jul', revenue: 148500, bookings: 210 },
  ];

  const categoryData = [
    { name: 'Electrical', count: 98 },
    { name: 'Plumbing', count: 85 },
    { name: 'AC Repair', count: 72 },
    { name: 'Cleaning', count: 64 },
    { name: 'Carpenter', count: 48 },
  ];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (usersRes.data.success) {
        setUsersList(usersRes.data.data);
      }
    } catch (err) {
      toast.error('Error fetching admin telemetry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            Admin Governance & Control Portal
          </h1>
          <p className="text-slate-400 text-xs mt-1">Platform operational health, approvals & revenue statistics</p>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Gross Marketplace Revenue</span>
            <DollarSign className="w-5 h-5 text-teal-400" />
          </div>
          <span className="text-3xl font-extrabold text-slate-800">₹{stats.totalRevenue?.toLocaleString()}</span>
          <span className="text-[11px] text-teal-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +24% vs last month
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Total Bookings</span>
            <BarChart3 className="w-5 h-5 text-violet-500" />
          </div>
          <span className="text-3xl font-extrabold text-slate-800">{stats.totalBookings}</span>
          <span className="text-[11px] text-slate-400 block mt-1">{stats.completedBookings} Successfully Fulfilled</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Verified Providers</span>
            <UserCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-3xl font-extrabold text-slate-800">{stats.totalProviders}</span>
          <span className="text-[11px] text-amber-400 font-bold block mt-1">{stats.pendingProviders} Pending Approval</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Total Customers</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-3xl font-extrabold text-slate-800">{stats.totalCustomers}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Active Accounts</span>
        </div>
      </div>

      {/* Visual Telemetry Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Revenue Growth Chart */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xl">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Growth (INR)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xl">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Service Category Demand</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* User Management Table */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xl">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Registered Platform Users</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-rose-50/60 text-slate-400 font-bold uppercase tracking-wider border-b border-rose-100">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((usr) => (
                <tr key={usr._id} className="hover:bg-rose-100/50/40 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={usr.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt={usr.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-bold text-slate-800">{usr.name}</span>
                  </td>
                  <td className="p-3">
                    <span className={`capitalize px-2 py-0.5 rounded font-bold ${
                      usr.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : (usr.role === 'provider' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-violet-400/20 text-violet-500')
                    }`}>
                      {usr.role}
                    </span>
                  </td>
                  <td className="p-3">{usr.email}</td>
                  <td className="p-3">
                    <span className="text-teal-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{new Date(usr.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
