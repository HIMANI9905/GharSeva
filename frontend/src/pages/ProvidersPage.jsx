import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Star, Shield, MapPin, Clock, Briefcase,
  SlidersHorizontal, X, Phone, ArrowRight, ShieldCheck, CheckCircle2
} from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ProvidersPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: '',
    maxPrice: '',
    minExperience: '',
    availability: '',
    verifiedOnly: false,
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/providers');
      if (res.data.success) {
        setProviders(res.data.data);
      }
    } catch (err) {
      toast.error('Could not load helpers');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProviders = () => {
    let result = [...providers];

    if (search.trim()) {
      result = result.filter(p =>
        p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.servicesOffered?.some(s => s.name?.toLowerCase().includes(search.toLowerCase())) ||
        p.user?.address?.city?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.minRating) {
      result = result.filter(p => (p.rating?.average || 0) >= parseFloat(filters.minRating));
    }

    if (filters.maxPrice) {
      result = result.filter(p => (p.hourlyRate || 499) <= parseInt(filters.maxPrice));
    }

    if (filters.minExperience) {
      result = result.filter(p => (p.experienceYears || 0) >= parseInt(filters.minExperience));
    }

    if (filters.availability === 'available') {
      result = result.filter(p => p.availability?.isAvailable !== false);
    }

    if (filters.verifiedOnly) {
      result = result.filter(p => p.status === 'approved');
    }

    if (filters.sortBy === 'rating') result.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    else if (filters.sortBy === 'price_low') result.sort((a, b) => (a.hourlyRate || 499) - (b.hourlyRate || 499));
    else if (filters.sortBy === 'experience') result.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    else if (filters.sortBy === 'jobs') result.sort((a, b) => (b.completedJobsCount || 0) - (a.completedJobsCount || 0));

    return result;
  };

  const filteredProviders = getFilteredProviders();

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF8EE] py-8 relative indian-motif-bg">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-[#E67E22] uppercase tracking-wider block mb-1">Background Verified Artisans</span>
          <h1 className="font-heading text-3xl font-extrabold text-[#1F2937] mb-2">Find Verified Service Helpers</h1>
          <p className="text-gray-600 text-sm mb-6 font-medium">Browse background-checked professionals near your area in India</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#FFF8EE]/60 rounded-xl border border-gray-200 px-4 focus-within:border-[#2563EB] transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by helper name, service (e.g. Electrician), or city..."
                className="flex-1 py-3 bg-transparent border-none outline-none text-[#1F2937] text-xs font-medium placeholder-gray-400"
              />
              {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-gray-400 hover:text-gray-700" /></button>}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-button font-bold text-xs transition-all ${showFilters ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-5 bg-[#FFF8EE]/40 rounded-xl border border-gray-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Min Rating</label>
                <select value={filters.minRating} onChange={e => setFilters(f => ({...f, minRating: e.target.value}))} className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none">
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.0">4.0+ ⭐</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Max Price (₹/hr)</label>
                <select value={filters.maxPrice} onChange={e => setFilters(f => ({...f, maxPrice: e.target.value}))} className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none">
                  <option value="">Any Price</option>
                  <option value="300">Under ₹300</option>
                  <option value="500">Under ₹500</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Min Experience</label>
                <select value={filters.minExperience} onChange={e => setFilters(f => ({...f, minExperience: e.target.value}))} className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none">
                  <option value="">Any Exp.</option>
                  <option value="1">1+ Years</option>
                  <option value="3">3+ Years</option>
                  <option value="5">5+ Years</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Sort By</label>
                <select value={filters.sortBy} onChange={e => setFilters(f => ({...f, sortBy: e.target.value}))} className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none">
                  <option value="rating">Top Rated</option>
                  <option value="price_low">Price: Low</option>
                  <option value="experience">Experience</option>
                  <option value="jobs">Most Jobs</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.verifiedOnly} onChange={e => setFilters(f => ({...f, verifiedOnly: e.target.checked}))} className="w-4 h-4 accent-[#2563EB]" />
                  <span className="text-xs font-semibold text-gray-700">Verified Only</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-xs font-medium">
            Showing <span className="font-bold text-[#1F2937]">{filteredProviders.length}</span> Verified Helpers
          </p>
          <div className="flex gap-2 text-xs font-bold text-[#15803D]">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Aadhaar & Skill Verified</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-[#FFF8EE] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#1F2937] mb-1">No Helpers Found</h3>
            <p className="text-gray-500 text-xs mb-4">Try clearing or adjusting your search filters</p>
            <button onClick={() => { setSearch(''); setFilters({ minRating: '', maxPrice: '', minExperience: '', availability: '', verifiedOnly: false, sortBy: 'rating' }); }} className="px-6 py-2.5 bg-[#2563EB] text-white font-button font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(provider => {
              const u = provider.user || {};
              const isAvailable = provider.availability?.isAvailable !== false;
              return (
                <div key={provider._id} className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-soft transition-all group">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'}
                          alt={u.name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-[#2563EB]"
                        />
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isAvailable ? 'bg-[#15803D]' : 'bg-gray-400'}`}></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="font-heading font-bold text-base text-[#1F2937] truncate">{u.name || 'Service Helper'}</h3>
                          {provider.status === 'approved' && (
                            <span className="flex items-center gap-0.5 text-[10px] bg-green-50 text-[#15803D] px-2 py-0.5 rounded-full font-bold shrink-0 border border-green-200">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#E67E22] font-bold mb-1.5 truncate">
                          {provider.servicesOffered?.[0]?.name || 'Home Service Expert'}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{u.address?.city || 'Mumbai'}, {u.address?.zipCode || '400001'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#E67E22] fill-[#E67E22]" />
                        <span className="font-bold text-xs text-[#1F2937]">{provider.rating?.average?.toFixed(1) || '4.8'}</span>
                        <span className="text-[10px] text-gray-400">({provider.rating?.count || 0})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Briefcase className="w-3 h-3" />
                        <span>{provider.completedJobsCount || 0} jobs</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{provider.experienceYears || 3} yrs exp</span>
                      </div>
                    </div>

                    {provider.servicesOffered?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {provider.servicesOffered.slice(0, 3).map(svc => (
                          <span key={svc._id} className="text-[10px] px-2 py-0.5 bg-[#FFF8EE] text-[#1F2937] border border-orange-100 rounded-md font-medium">{svc.name}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-gray-50">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Starting Rate</span>
                      <p className="font-heading font-extrabold text-[#1F2937] text-base">₹{provider.hourlyRate || 499}<span className="text-xs text-gray-500 font-normal">/hr</span></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-gray-100 px-2.5 py-1.5 rounded-lg" title="Phone number hidden until booking">
                        <Phone className="w-3 h-3" />
                        <span>Hidden</span>
                      </div>
                      <Link
                        to={`/book/${provider._id}`}
                        className="flex items-center gap-1 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-button font-bold text-xs transition-colors shadow-sm"
                      >
                        Book <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvidersPage;

