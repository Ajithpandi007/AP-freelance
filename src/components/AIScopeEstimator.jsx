import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, DollarSign, Calendar, Cpu, AlertCircle, RefreshCw } from 'lucide-react';

export const AIScopeEstimator = ({ onSelectRecommendedPackage }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const samplePrompts = [
    'I need an interactive 3D configurator website for luxury watches using WebGL and Three.js.',
    'Build a real-time order management dashboard with Node Express REST API and Firebase / MySQL database.',
    'Integrate Gemini AI into my existing app for auto-generating product descriptions and client proposals.',
    'Develop a cross-platform mobile app for iOS and Android with offline caching and order tracking.',
  ];

  const handleEstimate = async (textToSubmit) => {
    const input = textToSubmit || prompt;
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate AI proposal');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to Gemini AI engine. Using standard estimation heuristic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Container */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>Gemini AI Project Scope Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            AI Requirement & Cost <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">Architect</span>
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto font-light">
            Describe what you want to build in plain English. Our AI engine will analyze your tech stack needs, project scope, recommended package, estimated cost, and deliverables.
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I need a full-stack website with Express API, Firebase/MySQL database, client order tracking, and interactive 3D product showcase..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700/80 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition resize-none placeholder-slate-500 shadow-inner"
            />
            <button
              onClick={() => handleEstimate()}
              disabled={loading || !prompt.trim()}
              className="absolute bottom-4 right-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg flex items-center space-x-2 transition"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Scope...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Estimate</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-medium">Or select a sample requirement:</span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(sp);
                    handleEstimate(sp);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition text-left"
                >
                  "{sp.substring(0, 45)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Result Card */}
        {result && (
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-950 border border-indigo-500/40 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Recommended Package</span>
                <h3 className="text-2xl font-black text-white mt-1">{result.recommendedPackageName}</h3>
              </div>
              <button
                onClick={() => onSelectRecommendedPackage(result.recommendedPackageId, prompt)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
              >
                <span>Select Package & Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Estimated Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Estimated Budget</span>
                  <p className="text-lg font-bold text-white">
                    ${result.estimatedPriceMin} – ${result.estimatedPriceMax}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Target Delivery</span>
                  <p className="text-lg font-bold text-white">~{result.estimatedDays} Days</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Architecture</span>
                  <p className="text-sm font-bold text-slate-200">Express + React 19</p>
                </div>
              </div>
            </div>

            {/* Scope Reasoning */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
              <strong className="block text-indigo-300 font-bold mb-1">AI Reasoning:</strong>
              {result.reasoning}
            </div>

            {/* Deliverables & Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Key Deliverables</h4>
                <div className="space-y-2 text-xs text-slate-300">
                  {result.keyDeliverables?.map((d, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Suggested Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {result.techStack?.map((tech, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
