import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Search, Wrench, Droplet, Zap, Hammer, Wind,
  ShieldCheck, Star, Clock, CheckCircle2, TrendingUp,
  ArrowRight, UserCheck, Bot, Paintbrush, Phone,
  ChevronDown, ChevronUp, MapPin, Calendar, HeartHandshake, Headphones
} from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const navigate = useNavigate();
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Floating Booking Widget state
  const [bookingService, setBookingService] = useState('Electrician');
  const [bookingLocation, setBookingLocation] = useState('Mumbai');
  const [bookingDate, setBookingDate] = useState('');

  const handleAiEstimate = async (e) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim()) {
      toast.error('Please describe your home issue (e.g. Kitchen sink pipe leakage)');
      return;
    }

    setAiLoading(true);
    try {
      const res = await API.post('/ai/estimate-price', { prompt: aiPrompt });
      if (res.data.success) {
        toast.success('AI Price Estimation Generated!');
        navigate('/ai-price-estimator', { state: { estimateResult: res.data.estimation, prompt: aiPrompt } });
      }
    } catch (err) {
      toast.error('Could not generate estimate');
    } finally {
      setAiLoading(false);
    }
  };

  const categories = [
    { name: 'Electrician', icon: Zap, desc: 'Wiring, switches, light fitting & MCB repair' },
    { name: 'Plumber', icon: Droplet, desc: 'Leakage fixing, pipe fitting & tap replacement' },
    { name: 'Cleaning', icon: Sparkles, desc: 'Deep home cleaning, kitchen & bathroom sanitization' },
    { name: 'Carpenter', icon: Hammer, desc: 'Furniture repair, door locks & custom woodwork' },
    { name: 'Painter', icon: Paintbrush, desc: 'Full home wall painting & texture polish' },
    { name: 'AC Repair', icon: Wind, desc: 'Foam jet servicing, gas refill & cooling fix' },
    { name: 'Pest Control', icon: ShieldCheck, desc: 'Herbal cockroach, termite & bed bug spray' },
    { name: 'Appliance Repair', icon: Wrench, desc: 'Washing machine, fridge & microwave fix' },
  ];

  const faqs = [
    { question: 'How are the professionals verified on GharSeva?', answer: 'Every professional undergoes strict background verification, identity check (Aadhaar & PAN card), police clearance, and practical skill assessment before joining our platform.' },
    { question: 'How does the AI Price Estimator work?', answer: 'Our AI model analyzes local market rates across Indian cities to give you an accurate cost breakdown for labor and materials before you confirm your booking.' },
    { question: 'Is there any warranty on home services?', answer: 'Yes! All services booked on GharSeva come with a 30-Day Service Guarantee. If any issue reoccurs within 30 days, we fix it completely free of charge.' },
    { question: 'How can local workers join as a GharSeva Helper?', answer: 'Workers can click on "Become a Helper", fill in their basic details, submit ID proof, and our local field officer will verify and onboard them within 24 hours.' }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EE] font-sans text-[#1F2937] overflow-x-hidden selection:bg-[#2563EB] selection:text-white relative indian-motif-bg">
      
      {/* Decorative Corner Mandalas */}
      <div className="mandala-corner-top-right"></div>
      <div className="mandala-corner-bottom-left"></div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E67E22]/30 text-[#1F2937] font-semibold text-xs mb-6 shadow-sm">
                <span className="text-base">🇮🇳</span>
                <span className="font-bold text-[#E67E22]">India's Trusted Home Service Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] leading-[1.15] mb-6">
                Har Ghar Ki Har Zarurat,<br/>
                <span className="text-[#2563EB]">Ek Click Door.</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Book verified electricians, plumbers, carpenters, cleaners, AC technicians and other trusted professionals in minutes.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Link to="/services" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-button font-bold text-base shadow-glow-blue transition-all flex items-center justify-center gap-2">
                  Book a Service <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/register?role=provider" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-orange-50 text-[#E67E22] border-2 border-[#E67E22] font-button font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm">
                  <UserCheck className="w-5 h-5" /> Become a Helper
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-amber-900/10 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1.5 text-[#15803D]"><CheckCircle2 className="w-4 h-4" /> Verified Helpers</span>
                <span className="flex items-center gap-1.5 text-[#15803D]"><CheckCircle2 className="w-4 h-4" /> Transparent Pricing</span>
                <span className="flex items-center gap-1.5 text-[#15803D]"><CheckCircle2 className="w-4 h-4" /> Same Day Service</span>
                <span className="flex items-center gap-1.5 text-[#15803D]"><CheckCircle2 className="w-4 h-4" /> AI Price Estimation</span>
                <span className="flex items-center gap-1.5 text-[#15803D]"><CheckCircle2 className="w-4 h-4" /> Secure Booking</span>
              </div>

            </div>

            {/* Right Side: Indian Household Photo & Floating Booking Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1000"
                    alt="Indian Home Service Professional"
                    className="w-full h-[380px] sm:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-heading font-bold text-lg">Trusted Local Experts</p>
                    <p className="text-xs text-gray-200">Across Electrician, Plumbing, Cleaning & Repairs</p>
                  </div>
                </div>

                {/* Floating Booking Card */}
                <div className="bg-white rounded-2xl p-5 shadow-2xl border border-gray-100 mt-6 lg:absolute lg:-bottom-10 lg:-left-12 lg:w-[360px] lg:mt-0 z-20">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <h3 className="font-heading font-bold text-sm text-[#1F2937] flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-[#2563EB]" /> Book a Home Service
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E67E22]/10 text-[#E67E22]">Instant</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-500 font-semibold mb-1">Select Service</label>
                      <select 
                        value={bookingService} 
                        onChange={(e) => setBookingService(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#FFF8EE]/50 font-medium text-[#1F2937] focus:outline-none focus:border-[#2563EB]"
                      >
                        {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-500 font-semibold mb-1">Location</label>
                        <div className="flex items-center px-2.5 py-2 rounded-xl border border-gray-200 bg-[#FFF8EE]/50">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 mr-1 shrink-0" />
                          <input 
                            type="text" 
                            value={bookingLocation} 
                            onChange={(e) => setBookingLocation(e.target.value)}
                            className="w-full bg-transparent outline-none font-medium text-[#1F2937]" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-500 font-semibold mb-1">Preferred Date</label>
                        <input 
                          type="date" 
                          value={bookingDate} 
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full p-2 rounded-xl border border-gray-200 bg-[#FFF8EE]/50 font-medium text-[#1F2937] focus:outline-none" 
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-600 font-medium flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5 text-[#2563EB]" /> AI Est. Price:
                      </span>
                      <span className="font-bold text-[#2563EB] text-xs">₹299 - ₹499</span>
                    </div>

                    <button 
                      onClick={() => navigate(`/services?category=${encodeURIComponent(bookingService)}`)}
                      className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-button font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICES */}
      <section className="py-16 bg-white relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-3">Popular Services</h2>
            <p className="text-gray-600 text-sm font-medium">Top-rated home services delivered by verified local experts with transparent pricing.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link 
                to={`/services?category=${encodeURIComponent(cat.name)}`} 
                key={idx} 
                className="group p-6 rounded-2xl bg-[#FFF8EE] border border-orange-100 hover:border-[#2563EB] hover:shadow-card transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4 group-hover:bg-[#2563EB] group-hover:border-[#2563EB] transition-all shadow-sm">
                  <cat.icon className="w-7 h-7 text-[#2563EB] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#1F2937] mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{cat.desc}</p>
                <span className="text-xs font-bold text-[#E67E22] group-hover:text-[#2563EB] flex items-center gap-1 transition-colors">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE GHARSEVA */}
      <section className="py-20 bg-[#FFF8EE] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-3">Why Choose GharSeva?</h2>
            <p className="text-gray-600 text-sm font-medium">Built specifically for Indian households with high safety standards and complete price clarity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Verified Professionals', desc: '100% Aadhaar and background checked helpers with proven work history.', icon: ShieldCheck, border: 'border-blue-500' },
              { title: 'Transparent Pricing', desc: 'Upfront rates with no hidden surprise costs or unexpected bargaining.', icon: TrendingUp, border: 'border-orange-500' },
              { title: 'AI Smart Pricing', desc: 'Instant price range estimation powered by machine learning for accurate labor estimates.', icon: Bot, border: 'border-blue-500' },
              { title: 'Same Day Service', desc: 'Quick turnaround time with helpers reaching your home within hours.', icon: Clock, border: 'border-orange-500' },
              { title: 'Secure Payments', desc: 'Pay online safely after work completion or choose cash after service.', icon: CheckCircle2, border: 'border-blue-500' },
              { title: '24×7 Customer Support', desc: 'Dedicated helpline to support you before, during, and after your booking.', icon: Headphones, border: 'border-orange-500' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl border border-gray-100 shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FFF8EE] flex items-center justify-center mb-5">
                    <item.icon className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#1F2937] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-3">How It Works</h2>
            <p className="text-gray-600 text-sm font-medium">Simple 7-step process to get your home repairs handled seamlessly.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { step: '1', title: 'Search Service', desc: 'Find required expert' },
              { step: '2', title: 'Choose Helper', desc: 'Compare profiles' },
              { step: '3', title: 'AI Estimate', desc: 'Check fair cost' },
              { step: '4', title: 'Book Service', desc: 'Pick slot' },
              { step: '5', title: 'Track Helper', desc: 'Live status update' },
              { step: '6', title: 'Completed', desc: 'Pay safely' },
              { step: '7', title: 'Rate Experience', desc: 'Share feedback' }
            ].map((s, i) => (
              <div key={i} className="bg-[#FFF8EE] p-4 rounded-2xl border border-orange-100 text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-heading font-bold text-sm flex items-center justify-center mb-3 shadow-md">
                  {s.step}
                </div>
                <h4 className="font-heading font-bold text-xs text-[#1F2937] mb-1">{s.title}</h4>
                <p className="text-[11px] text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED HELPERS */}
      <section className="py-20 bg-[#FFF8EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-2">Featured Verified Helpers</h2>
              <p className="text-gray-600 text-sm font-medium">Experienced local technicians recommended by customers.</p>
            </div>
            <Link to="/providers" className="mt-4 sm:mt-0 font-button font-bold text-xs text-[#2563EB] hover:text-blue-800 flex items-center gap-1">
              View All Helpers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Rajesh Kumar', role: 'Electrician', rating: 4.9, exp: '8 Yrs', area: 'Bandra, Mumbai', price: 349, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
              { name: 'Amit Singh', role: 'Plumber', rating: 4.8, exp: '6 Yrs', area: 'Andheri, Mumbai', price: 299, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
              { name: 'Suresh Sharma', role: 'AC Technician', rating: 4.9, exp: '10 Yrs', area: 'Powai, Mumbai', price: 499, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
              { name: 'Sunita Devi', role: 'Cleaning Expert', rating: 5.0, exp: '5 Yrs', area: 'Juhu, Mumbai', price: 399, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' }
            ].map((pro, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-soft transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img src={pro.img} alt={pro.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-[#2563EB]" />
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#1F2937]">{pro.name}</h3>
                    <p className="text-xs font-bold text-[#E67E22]">{pro.role}</p>
                    <span className="text-[11px] text-gray-500">{pro.area}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 px-3 rounded-xl bg-[#FFF8EE] mb-4">
                  <span className="flex items-center gap-1 font-bold text-gray-700">
                    <Star className="w-3.5 h-3.5 fill-[#E67E22] text-[#E67E22]" /> {pro.rating}
                  </span>
                  <span className="text-gray-500 font-medium">{pro.exp} Experience</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">Starting Price</span>
                    <span className="font-heading font-extrabold text-[#1F2937] text-base">₹{pro.price}<span className="text-xs font-normal text-gray-500">/hr</span></span>
                  </div>

                  <Link 
                    to="/providers" 
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-button font-bold text-xs shadow-sm transition-all"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STATISTICS */}
      <section className="py-16 bg-[#2563EB] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x-0 sm:divide-x divide-blue-400/30">
            <div>
              <p className="font-heading font-extrabold text-4xl sm:text-5xl text-[#E67E22] mb-1">15,000+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-100">Happy Customers</p>
            </div>
            <div>
              <p className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-1">500+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-100">Verified Helpers</p>
            </div>
            <div>
              <p className="font-heading font-extrabold text-4xl sm:text-5xl text-[#E67E22] mb-1">20+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-100">Cities Served</p>
            </div>
            <div>
              <p className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-1">4.9★</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-100">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-3">Customer Reviews</h2>
            <p className="text-gray-600 text-sm font-medium">Hear directly from homeowners who trust GharSeva every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The AI Price Estimator gave me an accurate idea of labor costs before booking. The electrician was punctual and fixed our DB box cleanly.", name: "Rohan Kapoor", city: "Mumbai", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop" },
              { text: "Emergency plumbing help at 9 PM! The helper arrived within 30 minutes and resolved the kitchen leak without overcharging.", name: "Priya Sharma", city: "Pune", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop" },
              { text: "Booked deep cleaning for my parents' home. Verified workers, super courteous behavior, and flawless cleaning quality.", name: "Anand Verma", city: "Delhi NCR", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop" }
            ].map((rev, idx) => (
              <div key={idx} className="bg-[#FFF8EE] p-7 rounded-2xl border border-orange-100 shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#E67E22] text-[#E67E22]" />)}
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-6 font-medium">"{rev.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-orange-200/40">
                  <img src={rev.img} alt={rev.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2563EB]" />
                  <div>
                    <p className="font-heading font-bold text-xs text-[#1F2937]">{rev.name}</p>
                    <p className="text-[11px] text-gray-500">{rev.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BECOME A HELPER */}
      <section className="py-20 bg-[#FFF8EE] border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-gray-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-lg text-center md:text-left">
              <span className="text-xs font-bold text-[#E67E22] uppercase tracking-wider mb-2 block">Join GharSeva Partner Network</span>
              <h2 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-4">Are You a Skilled Electrician, Plumber or Worker?</h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Register as a GharSeva Helper to get regular work, direct customer payments, flexible hours, and zero commission on your hard work.
              </p>
              <div className="space-y-2 mb-8 text-xs font-semibold text-gray-700">
                <p className="flex items-center justify-center md:justify-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#15803D]" /> Earn up to ₹35,000+ per month</p>
                <p className="flex items-center justify-center md:justify-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#15803D]" /> Work in your local neighborhood area</p>
                <p className="flex items-center justify-center md:justify-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#15803D]" /> Instant payouts directly to your UPI/Bank account</p>
              </div>
              <Link to="/register?role=provider" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#E67E22] hover:bg-orange-600 text-white font-button font-bold text-sm shadow-md transition-all">
                Register as Helper <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[#FFF8EE] border-4 border-[#E67E22] flex items-center justify-center p-6 shadow-inner">
                <Wrench className="w-24 h-24 text-[#E67E22]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-sm font-medium">Have questions? We have clear answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-[#1F2937] hover:bg-[#FFF8EE]/50 transition-colors text-sm"
                >
                  <span>{faq.question}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-[#2563EB]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-gray-600 text-xs leading-relaxed bg-[#FFF8EE]/30 border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;

