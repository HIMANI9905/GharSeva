import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ShieldCheck, User } from 'lucide-react';

const MapWidget = ({ providerName = 'Rajesh Kumar', customerLocation = 'BKC, Mumbai', distance = '2.4 km' }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 19.0760, lng: 72.8777 }); // Mumbai default

  const handleDetectLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-2xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Compass className="w-5 h-5 text-violet-500" />
            Live Location & Distance Tracking
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Customer ({customerLocation}) • Provider ({distance} away)
          </p>
        </div>

        <button
          onClick={handleDetectLocation}
          className="px-3 py-1.5 rounded-xl bg-rose-100/50 hover:bg-rose-200/40 text-slate-600 text-xs font-semibold flex items-center gap-1.5"
        >
          <Navigation className={`w-3.5 h-3.5 text-violet-500 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Detect My Location'}</span>
        </button>
      </div>

      {/* Interactive Map Visualizer Canvas Simulation */}
      <div className="h-64 rounded-2xl bg-rose-50/60 border border-rose-100/80 relative overflow-hidden flex items-center justify-center">
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>

        {/* Customer Marker */}
        <div className="absolute top-1/3 left-1/3 flex flex-col items-center animate-bounce">
          <div className="p-2 rounded-full bg-violet-400 text-slate-800 shadow-lg shadow-violet-400/20">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-white/90 border border-rose-100 text-[10px] text-violet-500 font-bold">
            You (Customer)
          </span>
        </div>

        {/* Provider Marker */}
        <div className="absolute bottom-1/3 right-1/3 flex flex-col items-center">
          <div className="p-2 rounded-full bg-teal-400 text-slate-800 shadow-lg">
            <User className="w-5 h-5" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-white/90 border border-rose-100 text-[10px] text-teal-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {providerName}
          </span>
        </div>

        {/* Pulsing Radius Ring */}
        <div className="w-48 h-48 rounded-full border border-violet-400/30 bg-violet-400/5 animate-pulse absolute pointer-events-none"></div>

        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 border border-rose-100 text-[11px] text-slate-600 font-mono">
          Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
