import React, { useState } from 'react';
import { Sparkles, Bot, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AIPriceEstimatorPage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [services, setServices] = useState([]);

  React.useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get('/services');
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error('Could not fetch services for estimator');
    }
  };

  const samplePrompts = [
    'Kitchen sink pipe leaking under counter',
    'AC gas charging and deep foam jet wash',
    'Short circuit in main switchboard and MCB tripping',
    'Full house deep cleaning 2BHK flat',
    'Wooden door lock replacement and hinge alignment'
  ];

  const handleEstimate = async (textToUse) => {
    const q = textToUse || prompt;
    if (!q.trim()) {
      toast.error('Please enter a description of the service required.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/ai/estimate-price', { prompt: q });
      if (res.data.success) {
        setResult(res.data.estimation);
        toast.success('AI Price Estimate Calculated!');
      }
    } catch (err) {
      toast.error('Calculation error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] py-12 relative indian-motif-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E67E22]/30 text-[#E67E22] text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#E67E22] animate-pulse" />
            <span>GharSeva Cost Prediction Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
            Instant AI Price Estimator
          </h1>
          <p className="text-gray-600 text-sm mt-2.5 max-w-xl mx-auto font-medium">
            Describe your home repair issue below to predict exact labor, material, and visit charges based on local market rates.
          </p>
        </div>

        {/* Input Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-card mb-10">
          
          {/* Service Select Dropdown */}
          <div className="mb-5">
            <label className="block text-[#1F2937] font-bold mb-2 text-xs uppercase tracking-wide">Or Select a Standard Service:</label>
            <select 
              className="w-full p-3 rounded-xl bg-[#FFF8EE]/60 border border-gray-200 text-[#1F2937] text-xs font-medium focus:outline-none focus:border-[#2563EB]"
              onChange={(e) => {
                if (e.target.value) {
                  const serviceName = e.target.value;
                  setPrompt(`I need help with: ${serviceName}`);
                }
              }}
            >
              <option value="">-- Choose a service from our catalog --</option>
              {services.map(s => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="relative mb-4">
            <label className="block text-[#1F2937] font-bold mb-2 text-xs uppercase tracking-wide">Describe Your Issue:</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your issue (e.g. Need electrician to fix flickering lights and install 2 ceiling fans in living room)..."
              className="w-full p-4 rounded-xl bg-[#FFF8EE]/60 border border-gray-200 text-[#1F2937] text-xs font-medium focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Quick Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[11px] font-bold text-gray-500">Quick Try:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p);
                  handleEstimate(p);
                }}
                className="text-[11px] px-3 py-1 rounded-full bg-[#FFF8EE] border border-orange-100 text-gray-700 hover:text-[#2563EB] hover:border-[#2563EB] transition-colors font-medium"
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleEstimate()}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-button font-bold text-sm shadow-glow-blue flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Analyzing Market Rates...' : 'Calculate AI Price Range'}
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#2563EB]/40 shadow-soft animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="text-[11px] text-[#E67E22] font-bold uppercase tracking-wider block">Estimated Service Category</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] capitalize">{result.category} Repair & Maintenance</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-50 text-[#15803D] text-xs font-bold border border-green-200">
                Complexity: {result.complexityLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[#FFF8EE] border border-orange-100 text-center">
                <span className="text-gray-500 text-[11px] font-semibold block mb-1">Estimated Cost Range</span>
                <span className="text-2xl font-extrabold text-[#2563EB]">
                  ₹{result.minPrice} - ₹{result.maxPrice}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8EE] border border-orange-100 text-center">
                <span className="text-gray-500 text-[11px] font-semibold block mb-1">Job Duration</span>
                <span className="text-lg font-bold text-[#1F2937]">{result.estimatedDuration}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8EE] border border-orange-100 text-center">
                <span className="text-gray-500 text-[11px] font-semibold block mb-1">Warranty Coverage</span>
                <span className="text-xs font-bold text-[#15803D] flex items-center justify-center gap-1 mt-1">
                  <ShieldCheck className="w-4 h-4" /> 30-Day Guarantee
                </span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-6 p-4 rounded-xl bg-[#FFF8EE]/50 border border-gray-200">
              <h4 className="text-xs font-bold text-[#1F2937] mb-3 uppercase tracking-wider">Itemized Cost Breakdown</h4>
              <div className="space-y-2 text-xs">
                {result.breakdown?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-600 py-1.5 border-b border-gray-200/60 last:border-0">
                    <span>{item.label}</span>
                    <span className="font-bold text-[#1F2937]">₹{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs italic">{result.aiTip}</p>
              <button
                onClick={() => navigate(`/providers?category=${encodeURIComponent(result.category)}`)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-button font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                Find Verified {result.category} Pros <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AIPriceEstimatorPage;

