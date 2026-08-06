import React from 'react';
import { ArrowRight, Sparkles, Zap, CheckCircle2, Search } from 'lucide-react';
import { APLogoSymbol } from './APLogoSymbol';

export const Hero3D = ({
  onExploreServices,
  onOpenAiEstimator,
  onOpenTracker,
}) => {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24 lg:py-28 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>AP Web Development Freelance & Modern UI/UX Engineering</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              AP Web Development <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-pink-500">
                Modern UI/UX & All Types
              </span>{' '}
              of Websites
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Expert AP Web Development freelance services for any website type — E-commerce, Portfolios, SaaS, Corporate & Landing Pages. Designed with modern UI/UX aesthetics, high performance, and powered by an Express API & Firebase order backend.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreServices}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Browse Service Packages</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenAiEstimator}
                className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-base border border-slate-700/80 transition flex items-center space-x-2 shadow-lg backdrop-blur-md"
              >
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>AI Scope & Cost Calculator</span>
              </button>

              <button
                onClick={onOpenTracker}
                className="px-5 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white font-semibold text-sm border border-slate-800 transition flex items-center space-x-2"
              >
                <Search className="w-4 h-4 text-indigo-400" />
                <span>Track Existing Order</span>
              </button>
            </div>

            {/* Value Props Checklist */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Express.js & Firebase / SQL</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Live 3D WebGL Canvas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Order Tracking Code</span>
              </div>
            </div>

          </div>

          {/* Right Floating Stats Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-700/60 shadow-2xl space-y-6 relative group overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <APLogoSymbol size="md" />
                  <div>
                    <h3 className="font-bold text-white text-sm">AP Web Symbol & Studio</h3>
                    <p className="text-xs text-slate-400">AP Web Development Freelance</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AP Emblem Active
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Turnaround Time</span>
                  <p className="text-2xl font-black text-white mt-1">3–14 <span className="text-sm font-normal text-slate-400">Days</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Satisfaction Rate</span>
                  <p className="text-2xl font-black text-cyan-400 mt-1">100%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Database Backend</span>
                  <p className="text-lg font-bold text-amber-400 mt-1">Firebase / SQL</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Architecture</span>
                  <p className="text-lg font-bold text-pink-400 mt-1">React + Node JS</p>
                </div>
              </div>

              {/* Code Snippet Preview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-900 text-[10px]">
                  <span>server.js (REST API)</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>
                <p className="text-purple-400">app.post('/api/orders', async (req, res) =&gt; &#123;</p>
                <p className="text-slate-400 ml-3">const order = await db.createOrder(req.body);</p>
                <p className="text-slate-400 ml-3">res.status(201).json(order);</p>
                <p className="text-purple-400">&#125;);</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
