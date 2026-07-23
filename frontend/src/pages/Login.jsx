import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wrench, Mail, Lock, ArrowRight, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Login state
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  // Forgot password flow state
  const [step, setStep]           = useState('login');
  const [fpEmail, setFpEmail]     = useState('');
  const [fpOtp, setFpOtp]         = useState('');
  const [devOtp, setDevOtp]       = useState('');
  const [newPass, setNewPass]     = useState('');
  const [confirmPass, setConfirm] = useState('');
  const [fpLoading, setFpLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      if (res.user.role === 'admin')         navigate('/admin');
      else if (res.user.role === 'provider') navigate('/provider/dashboard');
      else                                   navigate('/customer/dashboard');
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!fpEmail.trim()) { toast.error('Please enter your registered email'); return; }
    setFpLoading(true);
    try {
      const res = await API.post('/auth/forgotpassword', { email: fpEmail });
      if (res.data.success) {
        if (res.data.devOtp) {
          setDevOtp(res.data.devOtp);
          toast.success(`OTP sent! (Dev mode – OTP pre-filled below)`);
          setFpOtp(res.data.devOtp);
        } else {
          toast.success('OTP sent to your email address!');
        }
        setStep('forgot_otp');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not send OTP. Please check the email address.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!fpOtp.trim())                         { toast.error('Enter the OTP you received');           return; }
    if (newPass.length < 6)                    { toast.error('Password must be at least 6 characters'); return; }
    if (newPass !== confirmPass)               { toast.error('Passwords do not match');                return; }

    setFpLoading(true);
    try {
      const res = await API.post('/auth/resetpassword', {
        email: fpEmail,
        otp: fpOtp,
        newPassword: newPass
      });
      if (res.data.success) {
        toast.success('Password reset successful! Please sign in with your new password.');
        setStep('login');
        setEmail(fpEmail);
        setPassword('');
        setFpEmail(''); setFpOtp(''); setNewPass(''); setConfirm(''); setDevOtp('');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid or expired OTP. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-[#FFF8EE] relative overflow-hidden indian-motif-bg">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-gray-200 shadow-card relative z-10">

        {step === 'login' && (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Wrench className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[#1F2937]">Welcome Back</h2>
              <p className="text-gray-500 text-xs mt-1 font-medium">Sign in to GharSeva to manage your bookings</p>
            </div>

            <div className="mb-6 p-3.5 rounded-xl bg-[#FFF8EE] border border-orange-100">
              <span className="text-[10px] font-bold text-gray-500 block mb-2 uppercase tracking-wider">Quick Demo Login:</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => handleQuickLogin('customer@demo.com')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#2563EB]/10 text-[#2563EB] font-bold hover:bg-[#2563EB]/20 transition-colors">
                  Customer Demo
                </button>
                <button type="button" onClick={() => handleQuickLogin('provider1@demo.com')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#E67E22]/10 text-[#E67E22] font-bold hover:bg-[#E67E22]/20 transition-colors">
                  Helper Demo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF8EE]/50 border border-gray-200 text-[#1F2937] text-xs font-medium focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => { setFpEmail(email); setStep('forgot_email'); }}
                    className="text-xs text-[#2563EB] hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPass ? 'text' : 'password'} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFF8EE]/50 border border-gray-200 text-[#1F2937] text-xs font-medium focus:outline-none focus:border-[#2563EB]"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-button font-bold text-xs shadow-glow-blue flex items-center justify-center gap-2 transition-all">
                {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-gray-500 text-xs mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#2563EB] font-bold hover:underline">Register now</Link>
            </p>
          </>
        )}

        {step === 'forgot_email' && (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#E67E22] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[#1F2937]">Forgot Password?</h2>
              <p className="text-gray-500 text-xs mt-1 font-medium">Enter your registered email to receive OTP</p>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email" required value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF8EE]/50 border border-gray-200 text-[#1F2937] text-xs font-medium focus:outline-none focus:border-[#E67E22]"
                  />
                </div>
              </div>

              <button type="submit" disabled={fpLoading}
                className="w-full py-3 rounded-xl bg-[#E67E22] hover:bg-orange-600 text-white font-button font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all">
                {fpLoading ? 'Sending OTP...' : 'Send Reset OTP'} <ArrowRight className="w-4 h-4" />
              </button>

              <button type="button" onClick={() => setStep('login')}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors">
                ← Back to Sign In
              </button>
            </form>
          </>
        )}

        {step === 'forgot_otp' && (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#15803D] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[#1F2937]">Verify OTP</h2>
              <p className="text-gray-500 text-xs mt-1 font-medium">OTP sent to <span className="font-bold text-[#1F2937]">{fpEmail}</span></p>
            </div>

            {devOtp && (
              <div className="mb-4 p-3 rounded-xl bg-orange-50 border border-orange-200 text-[#E67E22] text-xs font-bold text-center">
                Dev OTP: <span className="text-[#1F2937] font-black tracking-widest">{devOtp}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">6-Digit OTP</label>
                <input
                  type="text" required maxLength={6} value={fpOtp}
                  onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="_ _ _ _ _ _"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8EE]/50 border border-gray-200 text-[#1F2937] text-lg font-black text-center tracking-[10px] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPass ? 'text' : 'password'} required value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFF8EE]/50 border border-gray-200 text-[#1F2937] text-xs font-medium focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password" required value={confirmPass}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8EE]/50 border border-gray-200 text-[#1F2937] text-xs font-medium focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <button type="submit" disabled={fpLoading}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-button font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all">
                {fpLoading ? 'Resetting...' : 'Reset Password & Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;

