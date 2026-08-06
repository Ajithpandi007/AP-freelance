/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { Hero3D } from './components/Hero3D';
import { ServiceCatalog } from './components/ServiceCatalog';
import { AIScopeEstimator } from './components/AIScopeEstimator';
import { OrderWizardModal } from './components/OrderWizardModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DatabaseAdmin } from './components/DatabaseAdmin';
import { Footer } from './components/Footer';
import { ArrowRight } from 'lucide-react';
import {
  DEFAULT_SERVICES,
  DEFAULT_ORDERS,
  DEFAULT_ANALYTICS,
  DEFAULT_DB_STATUS
} from './data/defaultData';

export default function App() {
  const [activeView, setActiveView] = useState('client');
  const [clientTab, setClientTab] = useState('services');
  const [adminTab, setAdminTab] = useState('orders');

  // Backend Data with Default Fallbacks
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [orders, setOrders] = useState(DEFAULT_ORDERS);
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);
  const [dbStatus, setDbStatus] = useState(DEFAULT_DB_STATUS);
  const [loading, setLoading] = useState(false);

  // Modals
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState(null);
  const [initialAiRequirements, setInitialAiRequirements] = useState('');
  const [trackerOrderId, setTrackerOrderId] = useState(null);
  const [showTrackerModal, setShowTrackerModal] = useState(false);

  // Fetch initial data from Express backend API
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [srvRes, ordRes, anaRes, dbRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/orders'),
        fetch('/api/analytics'),
        fetch('/api/db/status'),
      ]);

      if (srvRes.ok) {
        const data = await srvRes.json();
        if (Array.isArray(data) && data.length > 0) setServices(data);
      }
      if (ordRes.ok) {
        const data = await ordRes.json();
        if (Array.isArray(data) && data.length > 0) setOrders(data);
      }
      if (anaRes.ok) {
        const data = await anaRes.json();
        if (data && typeof data === 'object') setAnalytics(data);
      }
      if (dbRes.ok) {
        const data = await dbRes.json();
        if (data && typeof data === 'object') setDbStatus(data);
      }
    } catch (err) {
      console.warn('Backend API fetch warning (using client fallback):', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSelectServiceForOrder = (service, customNotes) => {
    setSelectedServiceForOrder(service);
    if (customNotes) setInitialAiRequirements(customNotes);
  };

  const handleSelectRecommendedFromAi = (pkgId, customNotes) => {
    const found = services.find((s) => s.id === pkgId) || services[0];
    if (found) {
      handleSelectServiceForOrder(found, customNotes);
    }
  };

  const handleOpenTrackerForOrder = (orderId) => {
    setTrackerOrderId(orderId);
    setShowTrackerModal(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Interactive 3D WebGL Background Canvas */}
      <ThreeCanvas theme="cyber" interactive={true} />

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          clientTab={clientTab}
          setClientTab={setClientTab}
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          onOpenOrderTracker={() => {
            setTrackerOrderId('');
            setShowTrackerModal(true);
          }}
          dbStatus={dbStatus}
        />

        {/* VIEW 1: CLIENT PORTAL */}
        {activeView === 'client' && (
          <main className="flex-1 space-y-12">
            
            {/* Hero Section */}
            {clientTab === 'services' && (
              <Hero3D
                onExploreServices={() => {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenAiEstimator={() => setClientTab('estimator')}
                onOpenTracker={() => {
                  setTrackerOrderId('');
                  setShowTrackerModal(true);
                }}
              />
            )}

            {/* Service Catalog Section */}
            {clientTab === 'services' && (
              <div id="catalog-section">
                <ServiceCatalog
                  services={services}
                  onSelectService={(s) => handleSelectServiceForOrder(s)}
                />
              </div>
            )}

            {/* AI Scope Estimator Section */}
            {clientTab === 'estimator' && (
              <AIScopeEstimator
                services={services}
                onSelectRecommendedPackage={handleSelectRecommendedFromAi}
              />
            )}

            {/* Client Orders List View */}
            {clientTab === 'orders' && (
              <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    Client Portal
                  </span>
                  <h2 className="text-3xl font-extrabold text-white">Active Client Orders</h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Click any order code below to launch live 3D status progress and direct messenger.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => handleOpenTrackerForOrder(ord.id)}
                      className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl hover:shadow-2xl transition cursor-pointer space-y-4 group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-cyan-400">{ord.id}</span>
                          <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                            {ord.serviceTitle}
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Client:</span>
                          <span className="text-white font-medium">{ord.clientName}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Budget:</span>
                          <span className="text-emerald-400 font-bold">${ord.budget}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Progress</span>
                          <span className="font-bold text-cyan-400">{ord.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                            style={{ width: `${ord.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                        <span>Open Order Details & Chat</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </main>
        )}

        {/* VIEW 2: FREELANCER ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <main className="flex-1">
            {adminTab === 'database' ? (
              <DatabaseAdmin dbStatus={dbStatus} onRefresh={fetchAllData} />
            ) : (
              <AdminDashboard
                orders={orders}
                services={services}
                analytics={analytics}
                onRefreshData={fetchAllData}
                onOpenOrderMessages={(ordId) => handleOpenTrackerForOrder(ordId)}
                activeAdminTab={adminTab}
              />
            )}
          </main>
        )}

        {/* Footer */}
        <Footer
          onOpenOrderTracker={() => {
            setTrackerOrderId('');
            setShowTrackerModal(true);
          }}
          onSelectTab={setClientTab}
        />

      </div>

      {/* Order Creation Wizard Modal */}
      {selectedServiceForOrder && (
        <OrderWizardModal
          service={selectedServiceForOrder}
          initialRequirements={initialAiRequirements}
          onClose={() => {
            setSelectedServiceForOrder(null);
            setInitialAiRequirements('');
          }}
          onOrderCreated={() => {
            fetchAllData();
          }}
        />
      )}

      {/* Order Lookup & Communication Tracker Modal */}
      {showTrackerModal && (
        <OrderTrackerModal
          initialOrderId={trackerOrderId || ''}
          onClose={() => setShowTrackerModal(false)}
          isAdmin={activeView === 'admin'}
        />
      )}

    </div>
  );
}
