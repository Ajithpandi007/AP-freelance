import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, DollarSign, Calendar, User, Mail, Building, Box, Send } from 'lucide-react';

export const OrderWizardModal = ({
  service,
  initialRequirements = '',
  onClose,
  onOrderCreated,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [requirements, setRequirements] = useState(initialRequirements);
  const [budget, setBudget] = useState(service?.basePrice || 1200);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + (service?.turnaroundDays || 10) * 86400000).toISOString().split('T')[0]
  );
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [createdOrder, setCreatedOrder] = useState(null);

  if (!service) return null;

  const handleSubmit = async () => {
    if (!clientName.trim() || !clientEmail.trim() || !requirements.trim()) {
      setError('Please fill in your name, email, and project requirements.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          companyName,
          serviceId: service.id,
          serviceTitle: service.title,
          category: service.category,
          budget: Number(budget),
          deadline,
          requirements,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit order to server.');
      }

      const newOrder = await res.json();
      setCreatedOrder(newOrder);
      setStep(5); // Success step
      onOrderCreated(newOrder);
    } catch (err) {
      console.error(err);
      setError('Failed to log order in Express backend. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">New Service Order</h3>
              <p className="text-xs text-slate-400">{service.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 5 && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>Step {step} of 4</span>
              <span>
                {step === 1 && 'Confirm Package'}
                {step === 2 && 'Requirements'}
                {step === 3 && 'Budget & Deadline'}
                {step === 4 && 'Client Details'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* STEP 1: Confirm Package */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {service.category}
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1">{service.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">${service.basePrice}</span>
                    <span className="block text-[11px] text-slate-400">Base Quote</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">{service.fullDescription}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <span className="font-bold text-slate-200">Included Deliverables:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Project Requirements */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Project Scope & Technical Requirements *
              </label>
              <textarea
                rows={5}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe your goals, features, target audience, brand color preferences, or any specific API integrations needed..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition resize-none placeholder-slate-500"
              />
              <p className="text-xs text-slate-400">
                Tip: The more details you provide, the faster our Express backend can initialize project milestones!
              </p>
            </div>
          )}

          {/* STEP 3: Budget & Deadline */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Target Budget (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold text-base focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-xs text-slate-400">Suggested base price for this tier is ${service.basePrice}.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Target Completion Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold text-base focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Client Contact Details */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">Your Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">Company / Organization (Optional)</label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Ventures"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION */}
          {step === 5 && createdOrder && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">ORDER LOGGED SUCCESSFULLY</span>
                <h3 className="text-3xl font-black text-white mt-1">Order Code: #{createdOrder.id}</h3>
                <p className="text-slate-300 text-xs mt-2 max-w-md mx-auto">
                  Your project requirements have been saved to the Express backend database. Save your order code to track live progress and message the freelancer!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-slate-400">
                  <span>Client:</span>
                  <span className="text-white font-medium">{createdOrder.clientName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service:</span>
                  <span className="text-cyan-400 font-medium">{createdOrder.serviceTitle}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Budget:</span>
                  <span className="text-emerald-400 font-bold">${createdOrder.budget}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-xl"
              >
                Done & Return to Hub
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-950/50">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={() => {
                  if (step === 2 && !requirements.trim()) {
                    setError('Please outline your project requirements before continuing.');
                    return;
                  }
                  setError(null);
                  setStep(step + 1);
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white text-xs font-extrabold transition shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
              >
                {loading ? (
                  <span>Logging Order...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit & Confirm Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
