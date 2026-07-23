import React, { useContext, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Wrench, Home, Sparkles, LayoutDashboard, LogOut,
  Menu, X, Camera, ArrowLeft, ShieldCheck, PhoneCall, HelpCircle
} from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'provider') return '/provider/dashboard';
    return '/customer/dashboard';
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64Url = ev.target.result;
        const res = await API.put('/auth/updateprofile', { avatar: base64Url });
        if (res.data.success) {
          setUser(res.data.user);
          toast.success('Profile photo updated successfully!');
        }
        setUploadingPhoto(false);
        setProfileMenuOpen(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error('Failed to update photo');
      setUploadingPhoto(false);
    }
  };

  const showBackButton = location.pathname !== '/';

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] shadow-soft border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Back Button & Logo */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 px-3 py-2 text-[#1F2937] hover:text-[#2563EB] bg-[#FFF8EE] hover:bg-[#2563EB]/10 border border-[#E67E22]/30 rounded-xl transition-all font-button font-bold text-xs shadow-sm"
                title="Peeche Jayein / Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            
            {/* Logo: House + Wrench + Roof in Blue (#2563EB) & Saffron (#E67E22) */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                {/* Roof accent in saffron */}
                <div className="absolute top-0 inset-x-0 h-2 bg-[#E67E22]"></div>
                {/* House & Wrench SVG */}
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M14.7 13.5L16.5 11.7a1.5 1.5 0 0 0-2.1-2.1L12.6 11.4" className="stroke-[#E67E22]" />
                  <path d="M9 21v-6a2 2 0 0 1 2-2h2" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-heading font-extrabold text-[#1F2937] tracking-tight">
                    Ghar<span className="text-[#E67E22]">Seva</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#E67E22]"></span>
                </div>
                <span className="block text-[10px] tracking-wider text-[#6B7280] font-semibold uppercase">
                  Har Ghar Ki Har Zarurat
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#374151]">
            <Link to="/" className={`hover:text-[#2563EB] transition-colors ${location.pathname === '/' ? 'text-[#2563EB] font-bold' : ''}`}>
              Home
            </Link>
            <Link to="/services" className={`hover:text-[#2563EB] transition-colors ${location.pathname === '/services' ? 'text-[#2563EB] font-bold' : ''}`}>
              Services
            </Link>
            <a href="#how-it-works" onClick={(e) => {
              if (location.pathname !== '/') {
                e.preventDefault();
                navigate('/#how-it-works');
              }
            }} className="hover:text-[#2563EB] transition-colors">
              How It Works
            </a>
            <Link to="/providers" className={`hover:text-[#2563EB] transition-colors flex items-center gap-1 ${location.pathname === '/providers' ? 'text-[#2563EB] font-bold' : ''}`}>
              <ShieldCheck className="w-4 h-4 text-[#15803D]" /> Verified Helpers
            </Link>
            <Link to="/register?role=provider" className="hover:text-[#E67E22] transition-colors">
              Become a Helper
            </Link>
            <Link to="/ai-price-estimator"
              className="text-[#E67E22] hover:bg-[#FFF8EE] transition-all flex items-center gap-1.5 bg-[#FFF8EE] border border-[#E67E22]/30 px-3 py-1.5 rounded-full font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" />
              AI Price Estimator
            </Link>
            <a href="#footer" className="hover:text-[#2563EB] transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Right — Auth & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] transition-all font-button font-bold text-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* User Dropdown */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200 relative">
                  <div className="relative group cursor-pointer" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2563EB] hover:ring-[#E67E22] transition-all"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {profileMenuOpen && (
                    <div className="absolute top-14 right-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-[#FFF8EE] text-center">
                        <p className="font-bold text-[#1F2937] text-sm">{user.name}</p>
                        <p className="text-gray-500 text-[11px] mb-2">{user.email}</p>
                        <span className="capitalize inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB]/10 text-[#2563EB]">
                          {user.role === 'provider' ? 'Service Helper' : 'Customer'}
                        </span>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#FFF8EE] text-xs font-semibold"
                      >
                        <Camera className="w-4 h-4 text-[#2563EB]" /> Change Profile Photo
                      </button>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#FFF8EE] text-xs font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#2563EB]" /> My Dashboard
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-xs font-semibold border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}

                  <div className="text-left text-xs">
                    <p className="font-bold text-[#1F2937]">{user.name}</p>
                    <span className="text-[10px] font-bold text-[#E67E22] capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-button font-bold text-[#1F2937] hover:text-[#2563EB] hover:bg-[#FFF8EE] transition-all">
                  Login
                </Link>
                <Link to="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-button font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-glow-blue transition-all">
                  Book Service
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#FFF8EE] text-[#2563EB] hover:bg-blue-50">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />

      {profileMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-4 pb-6 space-y-3 shadow-xl">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1F2937] font-semibold hover:text-[#2563EB]">Home</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1F2937] font-semibold hover:text-[#2563EB]">Services</Link>
          <Link to="/providers" onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1F2937] font-semibold hover:text-[#2563EB]">Verified Helpers</Link>
          <Link to="/register?role=provider" onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#E67E22] font-semibold">Become a Helper</Link>
          <Link to="/ai-price-estimator" onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#2563EB] font-bold">AI Price Estimator</Link>

          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#1F2937] font-bold">Dashboard</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-red-600 font-bold">Sign Out</button>
            </>
          ) : (
            <div className="pt-3 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 rounded-xl border border-gray-300 text-[#1F2937] font-bold">Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 rounded-xl bg-[#2563EB] text-white font-bold">Book Service</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

