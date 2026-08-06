import React, { useState, useEffect } from 'react';
import { Search, X, CheckCircle2, MessageSquare, Send, ExternalLink, Paperclip, Box, AlertCircle } from 'lucide-react';

export const OrderTrackerModal = ({
  initialOrderId = '',
  onClose,
  isAdmin = false,
}) => {
  const [searchCode, setSearchCode] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // New message input
  const [newMessageText, setNewMessageText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [postingMessage, setPostingMessage] = useState(false);

  const fetchOrderDetails = async (code) => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const formattedCode = code.trim().toUpperCase();
      const res = await fetch(`/api/orders/${formattedCode}`);
      if (!res.ok) {
        throw new Error('Order not found. Please check your order code.');
      }
      const data = await res.json();
      setOrder(data);

      // Fetch message thread
      const msgRes = await fetch(`/api/orders/${formattedCode}/messages`);
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Could not locate order in database.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchOrderDetails(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSendMessage = async () => {
    if (!order || !newMessageText.trim()) return;
    setPostingMessage(true);

    try {
      const senderType = isAdmin ? 'freelancer' : 'client';
      const senderName = isAdmin ? 'Freelance Studio' : order.clientName;

      const attachments = attachmentUrl.trim() ? [attachmentUrl.trim()] : [];

      const res = await fetch(`/api/orders/${order.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: senderType,
          senderName,
          text: newMessageText,
          attachments,
        }),
      });

      if (res.ok) {
        const postedMsg = await res.json();
        setMessages((prev) => [...prev, postedMsg]);
        setNewMessageText('');
        setAttachmentUrl('');
        setShowAttachmentInput(false);
      }
    } catch (err) {
      console.error('Message post error:', err);
    } finally {
      setPostingMessage(false);
    }
  };

  const getStatusStepClass = (stepName, currentStatus) => {
    const statuses = ['pending', 'accepted', 'in_progress', 'review', 'completed'];
    const currentIdx = statuses.indexOf(currentStatus);
    const stepIdx = statuses.indexOf(stepName);

    if (stepIdx < currentIdx) {
      return 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
    } else if (stepIdx === currentIdx) {
      return 'bg-indigo-600 text-white font-bold ring-4 ring-indigo-500/30 border-indigo-400';
    } else {
      return 'bg-slate-800 text-slate-500 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Client Order Tracker & Portal</h3>
              <p className="text-xs text-slate-400">Search by Order ID (e.g. ORD-7412)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-slate-950/30 border-b border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrderDetails(searchCode);
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Order Code e.g. ORD-7412 or ORD-8930..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-mono uppercase focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchCode.trim()}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
            >
              {loading ? 'Searching...' : 'Search Order'}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-xs text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Order Details Body */}
        {order ? (
          <div className="p-6 sm:p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            
            {/* Top Order Status Banner */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-900">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">ORDER CODE</span>
                  <h4 className="text-2xl font-black text-white font-mono">{order.id}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">STATUS</span>
                  <div className="mt-0.5">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>Project Progress</span>
                  <span className="font-bold text-cyan-400">{order.progressPercent}% Completed</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                    style={{ width: `${order.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Milestone Timeline Steps */}
              <div className="pt-2 grid grid-cols-5 gap-1 text-center text-[10px] font-semibold text-slate-400">
                {['pending', 'accepted', 'in_progress', 'review', 'completed'].map((st) => (
                  <div key={st} className="flex flex-col items-center space-y-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${getStatusStepClass(st, order.status)}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="capitalize hidden sm:inline">{st.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overview & Deliverable URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Client Information</span>
                <p className="text-white font-semibold">{order.clientName}</p>
                <p className="text-slate-400">{order.clientEmail}</p>
                {order.companyName && <p className="text-slate-400">Company: {order.companyName}</p>}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Deliverables & Links</span>
                {order.deliverableUrl ? (
                  <a
                    href={order.deliverableUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow"
                  >
                    <span>View Staging / Deliverable</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <p className="text-slate-500 italic">Deliverables will be posted here as work progresses.</p>
                )}
                <div className="pt-1 text-[11px] text-slate-400">
                  Target Deadline: <strong className="text-white">{order.deadline}</strong>
                </div>
              </div>
            </div>

            {/* Project Requirements text */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Logged Scope & Requirements</span>
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{order.requirements}</p>
            </div>

            {/* Direct Message Thread */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Order Communication Thread</span>
                </span>
                <span className="text-xs text-slate-500">{messages.length} messages</span>
              </div>

              {/* Chat List */}
              <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No messages yet. Send a note to the freelancer below.</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl max-w-lg text-xs space-y-1 ${
                        m.sender === 'freelancer'
                          ? 'ml-auto bg-indigo-600/20 border border-indigo-500/30 text-indigo-100'
                          : m.sender === 'system'
                          ? 'mx-auto bg-slate-950 border border-slate-800 text-slate-400 text-center italic'
                          : 'mr-auto bg-slate-950 border border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pb-1">
                        <span>{m.senderName}</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed">{m.text}</p>
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1">
                          {m.attachments.map((att, i) => (
                            <a
                              key={i}
                              href={att}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 text-[10px] text-cyan-300 underline"
                            >
                              <Paperclip className="w-3 h-3" />
                              <span>Attachment #{i + 1}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Send Message Box */}
              <div className="space-y-2 pt-2">
                {showAttachmentInput && (
                  <input
                    type="text"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="Attachment link e.g. https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                )}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAttachmentInput(!showAttachmentInput)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
                    title="Attach link"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message or requirement update..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={postingMessage || !newMessageText.trim()}
                    className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition disabled:opacity-50 flex items-center space-x-1"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Box className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm">Search by Order Code (e.g., <code className="text-indigo-400 font-mono">ORD-7412</code>) above to inspect live database status.</p>
          </div>
        )}

      </div>

    </div>
  );
};
