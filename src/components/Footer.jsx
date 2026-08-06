import React from 'react';
import { Sparkles } from 'lucide-react';
import { APLogoSymbol } from './APLogoSymbol';

export const Footer = ({ onOpenOrderTracker, onSelectTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center space-x-3">
            <APLogoSymbol size="sm" />
            <span className="text-lg font-extrabold text-white">
              AP Web<span className="text-indigo-400"> Development</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Professional AP Web Development freelance studio specializing in modern UI/UX design and all types of web development — from custom 3D web apps to scalable Express & Firebase backends.
          </p>
          <div className="flex items-center space-x-2 pt-2 text-[10px] font-mono text-slate-500">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">React 19</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">JavaScript</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">Express REST</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">Firebase Ready</span>
          </div>
        </div>

        {/* Client Links */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block mb-2">Navigation</span>
          <ul>
            <li>
              <button onClick={() => onSelectTab('services')} className="hover:text-cyan-300 py-1 transition">
                3D Service Packages
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('estimator')} className="hover:text-cyan-300 py-1 transition flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>AI Scope Calculator</span>
              </button>
            </li>
            <li>
              <button onClick={onOpenOrderTracker} className="hover:text-cyan-300 py-1 transition">
                Track Existing Order
              </button>
            </li>
          </ul>
        </div>

        {/* Database & Architecture */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block mb-2">Backend & Storage</span>
          <p className="text-slate-400 text-xs">
            Powered by a standalone Express.js server on port 3000, supporting direct Firebase Firestore schema export, JSON batch dump, and MySQL database persistence.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} Nexus3D Studio. All rights reserved.</p>
        <div className="flex items-center space-x-1">
          <span>Engineered with React 19, JavaScript, Three.js & Express.js</span>
        </div>
      </div>
    </footer>
  );
};
