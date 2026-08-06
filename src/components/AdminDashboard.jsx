import React, { useState } from 'react';
import { DollarSign, Clock, Search, Filter, MessageSquare, Plus, Trash2, Edit3, CheckCircle2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminDashboard = ({
  orders,
  services,
  analytics,
  onRefreshData,
  onOpenOrderMessages,
  activeAdminTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrderId, setEditingOrderId] = useState(null);

  // Edit fields for selected order
  const [editStatus, setEditStatus] = useState('in_progress');
  const [editProgress, setEditProgress] = useState(0);
  const [editDeliverableUrl, setEditDeliverableUrl] = useState('');
  const [editPrivateNotes, setEditPrivateNotes] = useState('');
  const [savingOrder, setSavingOrder] = useState(false);

  // Service package creation / edit state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'web',
    shortDescription: '',
    fullDescription: '',
    basePrice: 1200,
    turnaroundDays: 7,
    features: ['Responsive React Frontend', 'REST API Integration'],
    threeGeometry: 'icosahedron',
    color: '#6366f1',
    popular: false,
  });

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesQuery =
      o.clientName.toLowerCase().includes(q) ||
      o.clientEmail.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.serviceTitle.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const handleStartEditOrder = (o) => {
    setEditingOrderId(o.id);
    setEditStatus(o.status);
    setEditProgress(o.progressPercent);
    setEditDeliverableUrl(o.deliverableUrl || '');
    setEditPrivateNotes(o.privateNotes || '');
  };

  const handleSaveOrderUpdates = async (orderId) => {
    setSavingOrder(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          progressPercent: Number(editProgress),
          deliverableUrl: editDeliverableUrl,
          privateNotes: editPrivateNotes,
        }),
      });

      if (res.ok) {
        setEditingOrderId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setSavingOrder(false);
    }
  };

  const handleSaveService = async () => {
    if (!serviceForm.title || !serviceForm.basePrice) return;
    try {
      const isNew = !editingService;
      const id = editingService ? editingService.id : 'srv-' + Date.now();
      const method = isNew ? 'POST' : 'PUT';
      const endpoint = isNew ? '/api/services' : `/api/services/${id}`;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...serviceForm, id }),
      });

      if (res.ok) {
        setShowServiceModal(false);
        setEditingService(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Service save error:', err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Service delete error:', err);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Top Banner & Overview Metrics */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Freelancer Management Center</span>
            </div>
            <h2 className="text-3xl font-black text-white">Workspace Overview</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time status updates synced with Express & Firebase / SQL Storage</p>
          </div>

          <button
            onClick={onRefreshData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync Database</span>
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                ${analytics?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Active Projects</span>
              <p className="text-2xl font-black text-cyan-400 mt-1">{analytics?.activeOrdersCount || 0}</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Pending Quotes</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{analytics?.pendingOrdersCount || 0}</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Completed Orders</span>
              <p className="text-2xl font-black text-indigo-400 mt-1">{analytics?.completedOrdersCount || 0}</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: ORDERS MATRIX */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders by client name, email, or order code..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Order Code</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Service Package</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Status & Progress</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No client orders match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const isEditing = editingOrderId === ord.id;
                      return (
                        <React.Fragment key={ord.id}>
                          <tr className="hover:bg-slate-950/40 transition">
                            <td className="p-4 font-mono font-bold text-white">{ord.id}</td>
                            <td className="p-4">
                              <span className="block font-bold text-slate-100">{ord.clientName}</span>
                              <span className="block text-[10px] text-slate-400">{ord.clientEmail}</span>
                            </td>
                            <td className="p-4 font-semibold text-cyan-300">{ord.serviceTitle}</td>
                            <td className="p-4 font-bold text-emerald-400">${ord.budget}</td>
                            <td className="p-4 text-slate-300">{ord.deadline}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {ord.status.replace('_', ' ')}
                              </span>
                              <div className="mt-1.5 w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div
                                  className="h-full bg-cyan-400"
                                  style={{ width: `${ord.progressPercent}%` }}
                                />
                              </div>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleStartEditOrder(ord)}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition font-bold"
                              >
                                Edit / Update
                              </button>
                              <button
                                onClick={() => onOpenOrderMessages(ord.id)}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition inline-flex items-center"
                                title="Open chat thread"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Edit Form Row */}
                          {isEditing && (
                            <tr className="bg-slate-950/90 border-t border-b border-indigo-500/30">
                              <td colSpan={7} className="p-6 space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                  <h4 className="font-bold text-white text-sm">
                                    Updating Order #{ord.id} ({ord.clientName})
                                  </h4>
                                  <button
                                    onClick={() => setEditingOrderId(null)}
                                    className="text-xs text-slate-400 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                                    <select
                                      value={editStatus}
                                      onChange={(e) => setEditStatus(e.target.value)}
                                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="accepted">Accepted</option>
                                      <option value="in_progress">In Progress</option>
                                      <option value="review">Under Review</option>
                                      <option value="completed">Completed</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Progress % ({editProgress}%)</label>
                                    <input
                                      type="range"
                                      min={0}
                                      max={100}
                                      value={editProgress}
                                      onChange={(e) => setEditProgress(Number(e.target.value))}
                                      className="w-full mt-2"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deliverable URL / Staging Link</label>
                                    <input
                                      type="text"
                                      value={editDeliverableUrl}
                                      onChange={(e) => setEditDeliverableUrl(e.target.value)}
                                      placeholder="https://github.com/... or staging site"
                                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Freelancer Private Notes (Admin Only)</label>
                                  <input
                                    type="text"
                                    value={editPrivateNotes}
                                    onChange={(e) => setEditPrivateNotes(e.target.value)}
                                    placeholder="Internal notes, API credentials, milestones..."
                                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                                  />
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                  <button
                                    onClick={() => handleSaveOrderUpdates(ord.id)}
                                    disabled={savingOrder}
                                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                                  >
                                    {savingOrder ? 'Saving...' : 'Save Changes & Notify Client'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SERVICE PACKAGE STUDIO */}
      {activeAdminTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white">Manage Service Offerings</h3>
            <button
              onClick={() => {
                setEditingService(null);
                setServiceForm({
                  title: '',
                  category: 'web',
                  shortDescription: '',
                  fullDescription: '',
                  basePrice: 1200,
                  turnaroundDays: 7,
                  features: ['Custom Frontend', 'Express API Integration'],
                  threeGeometry: 'icosahedron',
                  color: '#6366f1',
                  popular: false,
                });
                setShowServiceModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service Tier</span>
            </button>
          </div>

          {/* Services List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400">{s.category}</span>
                    <h4 className="text-lg font-bold text-white mt-1">{s.title}</h4>
                  </div>
                  <span className="text-xl font-black text-emerald-400">${s.basePrice}</span>
                </div>

                <p className="text-xs text-slate-400">{s.shortDescription}</p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
                  <span className="text-slate-500">Geometry: {s.threeGeometry}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditingService(s);
                        setServiceForm(s);
                        setShowServiceModal(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Add/Edit Modal */}
          {showServiceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4">
                <h4 className="font-extrabold text-white text-base">
                  {editingService ? 'Edit Package' : 'Create New Service Package'}
                </h4>

                <input
                  type="text"
                  placeholder="Package Title"
                  value={serviceForm.title || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Base Price ($)"
                    value={serviceForm.basePrice || 1200}
                    onChange={(e) => setServiceForm({ ...serviceForm, basePrice: Number(e.target.value) })}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Days"
                    value={serviceForm.turnaroundDays || 7}
                    onChange={(e) => setServiceForm({ ...serviceForm, turnaroundDays: Number(e.target.value) })}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <textarea
                  rows={3}
                  placeholder="Short Description"
                  value={serviceForm.shortDescription || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setShowServiceModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveService}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Save Package
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
