import React, { useState } from 'react';
import { Three3DCardViewer } from './Three3DCardViewer';
import { Check, Clock, Sparkles, ShoppingBag, Layers } from 'lucide-react';

export const ServiceCatalog = ({
  services,
  onSelectService,
  isAdmin = false,
  onEditService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'apweb', label: 'AP Web Dev' },
    { id: 'uiux', label: 'UI/UX Modern' },
    { id: '3d', label: '3D WebGL' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'ai', label: 'AI Solutions' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Interactive Service Menu</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Freelance Engineering <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-pink-400">Packages</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base font-light">
          Choose a service package below to inspect 3D geometry parameters, scope deliverables, and launch your order directly into our Express & Firebase / SQL pipeline.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No services found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`relative flex flex-col rounded-3xl bg-slate-900/90 backdrop-blur-xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden group ${
                service.popular
                  ? 'border-indigo-500/60 shadow-indigo-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Popular Ribbon */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-20 inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-[11px] font-extrabold shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              {/* 3D Geometry Canvas Container */}
              <div className="relative pt-4 pb-2 bg-gradient-to-b from-slate-950/80 to-transparent">
                <Three3DCardViewer
                  geometryType={service.threeGeometry}
                  color={service.color}
                  height={190}
                  interactive={true}
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="uppercase text-[10px] font-extrabold tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                      {service.category}
                    </span>
                    <div className="flex items-center space-x-1 text-slate-400 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{service.turnaroundDays} Days</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-300 text-xs mt-2 line-clamp-2 font-light">
                    {service.shortDescription}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <div className="text-xs text-slate-400 font-medium">Starting at</div>
                    <div className="text-3xl font-black text-white">
                      ${service.basePrice.toLocaleString()}
                      <span className="text-xs text-slate-400 font-normal ml-1">USD</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectService(service)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition transform active:scale-98 flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Service Now</span>
                  </button>

                  {isAdmin && onEditService && (
                    <button
                      onClick={() => onEditService(service)}
                      className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                    >
                      Admin: Edit Package
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
};
