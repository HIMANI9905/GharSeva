import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User, Wrench, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2,
  Mail, Lock, Phone
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') === 'provider' ? 'provider' : '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === 'provider' ? '/provider/dashboard' : user.role === 'admin' ? '/admin' : '/customer/dashboard');
  }, [user]);

  useEffect(() => {
    if (searchParams.get('role') === 'provider') {
      setSelectedRole('provider');
      setStep(2);
    }
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) { toast.error('Please fill all fields'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    const result = await register(name, email, password, phone, selectedRole);
    if (result?.success) {
      const dest = result.user.role === 'provider' ? '/provider/dashboard' : '/customer/dashboard';
      navigate(dest);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] flex items-center justify-center py-12 px-4 relative indian-motif-bg">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-[#2563EB] rounded-xl"><Wrench className="w-5 h-5 text-white" /></div>
            <span className="font-heading font-extrabold text-2xl text-[#1F2937]">Ghar<span className="text-[#E67E22]">Seva</span></span>
          </Link>
          <h1 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-1">
            {step === 1 ? 'Join GharSeva' : `Create ${selectedRole === 'provider' ? 'Helper' : 'Customer'} Account`}
          </h1>
          <p className="text-gray-600 text-xs font-medium">
            {step === 1 ? 'Select your account type to get started' : 'Enter your details to complete setup'}
          </p>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => handleRoleSelect('customer')}
              className="group text-left p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#2563EB] shadow-card hover:shadow-soft transition-all"
            >
              <div className="w-14 h-14 bg-[#2563EB]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#2563EB] transition-colors">
                <User className="w-7 h-7 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <h2 className="font-heading font-bold text-xl text-[#1F2937] mb-2">I'm a Customer</h2>
              <p className="text-gray-600 text-xs mb-5 leading-relaxed">Book trusted electricians, plumbers, AC technicians, and cleaners in minutes.</p>
              <ul className="space-y-2">
                {['Verified Local Experts', 'AI Price Estimates', 'Real-time Updates', '30-Day Guarantee'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-[#2563EB] font-button font-bold text-xs group-hover:gap-3 transition-all">
                Continue as Customer <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('provider')}
              className="group text-left p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#E67E22] shadow-card hover:shadow-soft transition-all"
            >
              <div className="w-14 h-14 bg-[#E67E22]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#E67E22] transition-colors">
                <Wrench className="w-7 h-7 text-[#E67E22] group-hover:text-white transition-colors" />
              </div>
              <h2 className="font-heading font-bold text-xl text-[#1F2937] mb-2">I'm a Helper</h2>
              <p className="text-gray-600 text-xs mb-5 leading-relaxed">Grow your independent service business with direct local customers.</p>
              <ul className="space-y-2">
                {['Direct Bookings', 'Zero Hidden Fees', 'Flexible Timings', 'Instant UPI Payouts'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-[#E67E22] font-button font-bold text-xs group-hover:gap-3 transition-all">
                Continue as Helper <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <div className="max-w-md mx-auto">
            <div className={`flex items-center gap-3 p-3.5 rounded-xl border mb-6 ${selectedRole === 'provider' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
              {selectedRole === 'provider' ? <Wrench className="w-5 h-5 text-[#E67E22]" /> : <User className="w-5 h-5 text-[#2563EB]" />}
              <span className="font-bold text-[#1F2937] text-xs">
                Registering as {selectedRole === 'provider' ? 'Service Helper' : 'Customer'}
              </span>
              <button onClick={() => setStep(1)} className="ml-auto text-xs text-[#2563EB] hover:underline font-bold">Change</button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FFF8EE]/50 focus-within:border-[#2563EB]">
                    <User className="w-4 h-4 text-gray-400" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Kumar" className="flex-1 bg-transparent outline-none text-[#1F2937] placeholder-gray-400 text-xs font-medium" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FFF8EE]/50 focus-within:border-[#2563EB]">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="rahul@example.com" className="flex-1 bg-transparent outline-none text-[#1F2937] placeholder-gray-400 text-xs font-medium" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FFF8EE]/50 focus-within:border-[#2563EB]">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="flex-1 bg-transparent outline-none text-[#1F2937] placeholder-gray-400 text-xs font-medium" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FFF8EE]/50 focus-within:border-[#2563EB]">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="flex-1 bg-transparent outline-none text-[#1F2937] placeholder-gray-400 text-xs font-medium" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FFF8EE]/50 focus-within:border-[#2563EB]">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="flex-1 bg-transparent outline-none text-[#1F2937] placeholder-gray-400 text-xs font-medium" required />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-button font-bold text-xs text-white transition-colors flex items-center justify-center gap-2 shadow-sm ${selectedRole === 'provider' ? 'bg-[#E67E22] hover:bg-orange-600' : 'bg-[#2563EB] hover:bg-blue-700'} disabled:opacity-50`}
                >
                  {loading ? 'Creating Account...' : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="text-center text-xs text-gray-500 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-[#2563EB] font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-gray-500 mt-8">
          By registering, you agree to GharSeva's <Link to="/" className="underline">Terms of Service</Link> and <Link to="/" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default Register;

