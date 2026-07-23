import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Clock, CheckCircle, ArrowRight, Wrench, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentCategory = searchParams.get('category') || '';
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('popular');

  const categories = [
    'All',
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'Cleaning',
    'AC Repair',
    'Appliance Repair',
    'Pest Control'
  ];

  useEffect(() => {
    fetchServices();
  }, [currentCategory, sortOption]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = `/services?sort=${sortOption}`;
      if (currentCategory && currentCategory !== 'All') {
        url += `&category=${encodeURIComponent(currentCategory)}`;
      }
      const res = await API.get(url);
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF8EE] py-10 relative indian-motif-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#E67E22] uppercase tracking-wider block mb-1">Guaranteed Quality Workmanship</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">Explore All Home Services</h1>
          <p className="text-gray-600 text-sm mt-1.5 font-medium">Transparent upfront pricing with 30-day GharSeva guarantee across all repairs.</p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Search Input */}
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search electrician, plumber, AC repair..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F2937] text-xs font-medium focus:outline-none focus:border-[#2563EB] shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat, i) => {
              const isActive = (cat === 'All' && !currentCategory) || currentCategory === cat;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (cat === 'All') searchParams.delete('category');
                    else searchParams.set('category', cat);
                    setSearchParams(searchParams);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-button font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:text-[#2563EB] border border-gray-200 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading verified services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1F2937]">No Services Found</h3>
            <p className="text-gray-500 text-xs mt-1">Try adjusting your search filter or category selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="rounded-2xl bg-white border border-gray-100 hover:border-[#2563EB] transition-all overflow-hidden flex flex-col group shadow-card hover:shadow-soft"
              >
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[#2563EB] text-[11px] font-bold shadow-sm">
                    {service.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1F2937] mb-1.5 group-hover:text-[#2563EB] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                        {service.estimatedDuration}
                      </span>
                      <span className="flex items-center gap-1 text-[#15803D] font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Pros
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Starts From</span>
                      <span className="text-xl font-extrabold text-[#1F2937]">
                        ₹{service.basePrice}
                      </span>
                      <span className="text-xs text-gray-500 font-normal">/{service.priceUnit}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/providers?category=${encodeURIComponent(service.category)}`)}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-button font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      Select Provider <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ServicesPage;

