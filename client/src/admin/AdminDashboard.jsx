import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaImage, FaImages, FaEnvelope, FaCalendarAlt, FaPlus, FaEye, FaCircle } from 'react-icons/fa';
import api from './api';

const statusColors = {
  new:     'bg-blue-100 text-blue-700',
  read:    'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
};

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4"
  >
    <div className={`${color} rounded-xl p-3.5 flex-shrink-0`}>
      <Icon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 text-2xl font-bold mt-0.5">
        {value === null
          ? <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" />
          : value}
      </p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ banners: null, gallery: null, newMessages: null, events: null });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bannersRes, galleryRes, messagesRes, eventsRes] = await Promise.allSettled([
          api.get('/banners'),
          api.get('/gallery'),
          api.get('/admin/contact-messages'),
          api.get('/events'),
        ]);

        const banners  = bannersRes.status  === 'fulfilled' ? bannersRes.value.data  : [];
        const gallery  = galleryRes.status  === 'fulfilled' ? galleryRes.value.data  : [];
        const messages = messagesRes.status === 'fulfilled' ? messagesRes.value.data : [];
        const events   = eventsRes.status   === 'fulfilled' ? eventsRes.value.data   : [];

        setStats({
          banners: banners.length,
          gallery: gallery.length,
          newMessages: messages.filter(m => m.status === 'new').length,
          events: events.length,
        });
        setRecentMessages(messages.slice(0, 5));
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: FaImage,       label: 'Total Banners',   value: stats.banners,     color: 'bg-blue-500',   delay: 0 },
    { icon: FaImages,      label: 'Gallery Images',  value: stats.gallery,     color: 'bg-purple-500', delay: 0.1 },
    { icon: FaEnvelope,    label: 'New Messages',    value: stats.newMessages, color: 'bg-orange-500', delay: 0.2 },
    { icon: FaCalendarAlt, label: 'Total Events',    value: stats.events,      color: 'bg-green-500',  delay: 0.3 },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Overview of your school website</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-gray-800 font-semibold text-base mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/admin/banners')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
            <FaPlus className="text-xs" /> Upload Banner
          </button>
          <button onClick={() => navigate('/admin/gallery')}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
            <FaPlus className="text-xs" /> Add Gallery Image
          </button>
          <button onClick={() => navigate('/admin/messages')}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
            <FaEye className="text-xs" /> View Messages
          </button>
        </div>
      </motion.div>

      {/* Recent Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-semibold text-base">Recent Contact Messages</h3>
          <button onClick={() => navigate('/admin/messages')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition">
            View all →
          </button>
        </div>

        {loadingMessages ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FaEnvelope className="text-3xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4">Name</th>
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4">Subject</th>
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4 hidden sm:table-cell">Date</th>
                  <th className="text-left text-gray-500 font-medium pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentMessages.map(msg => (
                  <tr key={msg._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {msg.status === 'new' && <FaCircle className="text-blue-500 text-xs flex-shrink-0" />}
                        <span className="font-medium text-gray-700 truncate max-w-[120px]">{msg.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 truncate max-w-[160px]">{msg.subject}</td>
                    <td className="py-3 pr-4 text-gray-400 hidden sm:table-cell whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[msg.status]}`}>
                        {msg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
