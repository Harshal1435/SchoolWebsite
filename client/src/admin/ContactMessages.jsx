import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope, FaEnvelopeOpen, FaReply, FaFilter, FaCircle,
  FaTimes, FaUser, FaPhone, FaCalendarAlt, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import api from './api';

const STATUS_FILTERS = ['all', 'new', 'read', 'replied'];
const statusConfig = {
  new:     { label: 'New',     color: 'bg-blue-100 text-blue-700',   dot: 'text-blue-500' },
  read:    { label: 'Read',    color: 'bg-gray-100 text-gray-600',   dot: 'text-gray-400' },
  replied: { label: 'Replied', color: 'bg-green-100 text-green-700', dot: 'text-green-500' },
};

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
  >
    {type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100"><FaTimes className="text-xs" /></button>
  </motion.div>
);

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.get('/admin/contact-messages')
      .then(r => setMessages(r.data))
      .catch(() => showToast('Failed to load messages', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/admin/contact-messages/${id}`, { status });
      setMessages(messages.map(m => m._id === id ? res.data : m));
      showToast(`Message marked as ${status}`);
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleRowClick = async (msg) => {
    if (expanded === msg._id) { setExpanded(null); return; }
    setExpanded(msg._id);
    if (msg.status === 'new') await updateStatus(msg._id, 'read');
  };

  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter);
  const newCount = messages.filter(m => m.status === 'new').length;

  return (
    <div className="space-y-6">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
            {newCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{newCount} new</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">{messages.length} total messages</p>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-400 text-sm" />
          <span className="text-sm font-medium text-gray-600">Filter by Status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(s => {
            const count = s === 'all' ? messages.length : messages.filter(m => m.status === s).length;
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s} ({count})
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FaEnvelope className="text-4xl mx-auto mb-3 opacity-30" />
            <p className="font-medium">No messages found</p>
            <p className="text-sm mt-1">{filter !== 'all' ? `No ${filter} messages` : 'No contact messages yet'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((msg, i) => (
              <div key={msg._id}>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  onClick={() => handleRowClick(msg)}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition ${msg.status === 'new' ? 'bg-blue-50/40' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <FaCircle className={`text-xs flex-shrink-0 ${statusConfig[msg.status].dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${msg.status === 'new' ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</span>
                        <span className="text-gray-400 text-xs hidden sm:inline">·</span>
                        <span className="text-gray-500 text-xs hidden sm:inline truncate">{msg.email}</span>
                      </div>
                      <p className={`text-sm truncate mt-0.5 ${msg.status === 'new' ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{msg.subject}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-gray-400 text-xs hidden md:block whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusConfig[msg.status].color}`}>
                        {statusConfig[msg.status].label}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {expanded === msg._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 bg-gray-50 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaUser className="text-gray-400 flex-shrink-0" /><span>{msg.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaEnvelope className="text-gray-400 flex-shrink-0" />
                            <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline truncate">{msg.email}</a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaPhone className="text-gray-400 flex-shrink-0" /><span>{msg.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                          <FaCalendarAlt />
                          <span>{new Date(msg.createdAt).toLocaleString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Subject: {msg.subject}</p>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {msg.status !== 'read' && (
                            <button onClick={e => { e.stopPropagation(); updateStatus(msg._id, 'read'); }}
                              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition">
                              <FaEnvelopeOpen className="text-gray-500" /> Mark as Read
                            </button>
                          )}
                          {msg.status !== 'replied' && (
                            <button onClick={e => { e.stopPropagation(); updateStatus(msg._id, 'replied'); }}
                              className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition">
                              <FaReply className="text-green-500" /> Mark as Replied
                            </button>
                          )}
                          {msg.status !== 'new' && (
                            <button onClick={e => { e.stopPropagation(); updateStatus(msg._id, 'new'); }}
                              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition">
                              <FaCircle className="text-blue-500 text-xs" /> Mark as New
                            </button>
                          )}
                          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition">
                            <FaReply /> Reply via Email
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContactMessages;
