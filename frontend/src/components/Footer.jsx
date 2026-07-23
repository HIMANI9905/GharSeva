import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="footer" className="bg-[#1F2937] text-gray-300 pt-16 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#2563EB]">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-extrabold text-white">
                Ghar<span className="text-[#E67E22]">Seva</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Har Ghar Ki Har Zarurat. India's trusted home service platform connecting Indian households with verified local electricians, plumbers, carpenters, and technicians.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-colors text-gray-400"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-colors text-gray-400"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E67E22] hover:text-white transition-colors text-gray-400"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-colors text-gray-400"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4 text-xs uppercase tracking-wider">Services & Tools</h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#E67E22]"/> Electrician & Plumbing</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#E67E22]"/> AC Repair & Servicing</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#E67E22]"/> Full House Cleaning</Link></li>
              <li><Link to="/ai-price-estimator" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#2563EB]"/> AI Price Estimator</Link></li>
              <li><Link to="/providers" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#15803D]"/> Verified Helpers</Link></li>
            </ul>
          </div>

          {/* Column 3: Company & Support */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4 text-xs uppercase tracking-wider">Company & Legal</h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#how-it-works" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gray-500"/> About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gray-500"/> Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gray-500"/> Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gray-500"/> Terms of Service</a></li>
              <li><Link to="/register?role=provider" className="text-[#E67E22] hover:underline font-bold flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#E67E22]"/> Join as a Helper</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4 text-xs uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>GharSeva Tech Hub, Bandra Kurla Complex (BKC), Mumbai, India 400051</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>+91 1800 123 4567 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>support@gharseva.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>&copy; {new Date().getFullYear()} GharSeva Home Solutions Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#15803D] font-medium"><ShieldCheck className="w-3.5 h-3.5" /> 100% Safe & Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

