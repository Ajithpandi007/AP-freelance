import React, { useState } from 'react';
import { Database, Search, Sparkles, UserCheck, Code2 } from 'lucide-react';
import { APLogoSymbol } from './APLogoSymbol';

export const Navbar = ({
  activeView,
  setActiveView,
  clientTab,
  setClientTab,
  adminTab,
  setAdminTab,
  onOpenOrderTracker,
  dbStatus,
}) => {
  const [showDbInfo, setShowDbInfo] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('client')}>
          <APLogoSymbol size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                AP Web<span className="text-indigo-400"> Development</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AP Symbol
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Modern UI/UX & All Types of Websites</p>
          </div>
        </div>

        {/* Center Nav Items */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          {activeView === 'client' ? (
            <>
              <button
                onClick={() => setClientTab('services')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  clientTab === 'services'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Services & 3D Packages
              </button>
              <button
                onClick={() => setClientTab('estimator')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  clientTab === 'estimator'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
                <span>AI Scope Estimator</span>
              </button>
              <button
                onClick={() => setClientTab('orders')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  clientTab === 'orders'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Client Order Hub
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAdminTab('orders')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  adminTab === 'orders'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setAdminTab('analytics')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  adminTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Analytics & Revenue
              </button>
              <button
                onClick={() => setAdminTab('services')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  adminTab === 'services'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Package Studio
              </button>
              <button
                onClick={() => setAdminTab('database')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  adminTab === 'database'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Firebase & DB</span>
              </button>
            </>
          )}
        </div>

        {/* Right Actions & View Switcher */}
        <div className="flex items-center space-x-3">
          
          {/* DB Indicator Pill */}
          <div className="relative">
            <button
              onClick={() => setShowDbInfo(!showDbInfo)}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition"
              title="Database status & driver details"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-medium truncate max-w-[120px]">
                Firebase Ready
              </span>
            </button>

            {/* DB Tooltip Card */}
            {showDbInfo && (
              <div className="absolute right-0 mt-2 w-80 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>Database Diagnostics</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {dbStatus?.database || 'freelance_db'}
                  </span>
                </div>
                <div className="mt-2 space-y-1.5 text-slate-300">
                  <p><strong className="text-slate-400">Active Engine:</strong> {dbStatus?.engine}</p>
                  <p><strong className="text-slate-400">Status Msg:</strong> {dbStatus?.message}</p>
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <span className="block text-indigo-400 font-bold">{dbStatus?.recordCounts?.services || 0}</span>
                      <span className="text-[10px] text-slate-500">Services</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <span className="block text-cyan-400 font-bold">{dbStatus?.recordCounts?.orders || 0}</span>
                      <span className="text-[10px] text-slate-500">Orders</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <span className="block text-pink-400 font-bold">{dbStatus?.recordCounts?.order_messages || 0}</span>
                      <span className="text-[10px] text-slate-500">Messages</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Track Order Quick Button */}
          <button
            onClick={onOpenOrderTracker}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 hover:border-slate-700 transition"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          {/* Perspective Switcher (Client vs Freelancer Admin) */}
          <button
            onClick={() => setActiveView(activeView === 'client' ? 'admin' : 'client')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
              activeView === 'client'
                ? 'bg-slate-900 border border-indigo-500/40 text-indigo-300 hover:bg-slate-800'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20'
            }`}
          >
            {activeView === 'client' ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Freelancer Admin</span>
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4 text-cyan-300" />
                <span>Client View</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Mobile Subnav Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900/90 py-2 px-3 border-t border-slate-800 text-xs font-medium">
        {activeView === 'client' ? (
          <>
            <button
              onClick={() => setClientTab('services')}
              className={`px-3 py-1.5 rounded-lg ${clientTab === 'services' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Services
            </button>
            <button
              onClick={() => setClientTab('estimator')}
              className={`px-3 py-1.5 rounded-lg ${clientTab === 'estimator' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              AI Scope
            </button>
            <button
              onClick={() => setClientTab('orders')}
              className={`px-3 py-1.5 rounded-lg ${clientTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Order Hub
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setAdminTab('orders')}
              className={`px-2.5 py-1.5 rounded-lg ${adminTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Orders
            </button>
            <button
              onClick={() => setAdminTab('analytics')}
              className={`px-2.5 py-1.5 rounded-lg ${adminTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Revenue
            </button>
            <button
              onClick={() => setAdminTab('services')}
              className={`px-2.5 py-1.5 rounded-lg ${adminTab === 'services' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Packages
            </button>
            <button
              onClick={() => setAdminTab('database')}
              className={`px-2.5 py-1.5 rounded-lg ${adminTab === 'database' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Firebase
            </button>
          </>
        )}
      </div>
    </header>
  );
};
