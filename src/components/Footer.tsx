import React from 'react';
import { useApp } from '../context/AppContext';
import { Landmark, Sparkles, MapPin, ExternalLink, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useApp();

  return (
    <footer className="bg-[#1C1917] text-white pt-12 pb-8 border-t border-natural-dark-secondary mt-16 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Foot grids */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="bg-[#F5F4EF] text-natural-text rounded-md px-2.5 py-1.5 font-mono text-sm tracking-widest font-black leading-none">
                PIF
              </div>
              <span className="font-sans font-bold text-base tracking-tight leading-none text-white">
                {t.app_title}
              </span>
            </div>
            <p className="text-xs text-stone-300 font-light leading-relaxed max-w-sm">
              An open, citizen-led civic engineering initiative logging localized urban assets, drainage obstruction nodes, and footpath compliance scores across major metropolitan ward divisions in India.
            </p>
          </div>

          {/* Col 2 - Inspirations / References */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] font-bold uppercase text-stone-500 tracking-wider">Inspirations</h4>
            <ul className="text-xs space-y-2 text-stone-300 font-light">
              <li>
                <a 
                  href="https://ptf.neocities.org/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center space-x-1"
                >
                  <span>Public Transport Forum</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">IRC Safety Codes</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Indian Cities GIS</a>
              </li>
            </ul>
          </div>

          {/* Col 3 - Contacts Coordinates */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] font-bold uppercase text-stone-500 tracking-wider">Coordinates</h4>
            <div className="text-xs text-stone-300 font-light space-y-1">
              <p className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-natural-primary" />
                <span>Lucknow / Bengaluru / Delhi</span>
              </p>
              <p className="font-mono text-[10px] mt-1 text-stone-500">pif-collective@sec.org.in</p>
            </div>
          </div>
        </div>

        {/* Foot note / design signature */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-stone-500">
          <div>
            © {new Date().getFullYear()} {t.app_title}. Built in React (Vite) & Google Firebase.
          </div>
          <div className="flex items-center space-x-2">
            <span>● SECURE SANDBOX CONNECTION</span>
            <span>•</span>
            <span>OPEN DATA RESOURCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
