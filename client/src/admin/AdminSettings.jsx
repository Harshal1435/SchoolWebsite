import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLock, FaSchool, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaTwitter, FaInstagram, FaYoutube,
  FaUser, FaCheck, FaExclamationTriangle, FaTimes, FaSave
} from 'react-icons/fa';
import api from './api';

const SCHOOL_INFO_KEY = 'schoolInfo';
const defaultSchoolInfo = {
  name: 'Future Minds School',
  address: 'Nagpur, Maharashtra, India',
  phone: '+919563695857',
  email: 'info@futuremindschool.edu',
  facebook: '', twitter: '', instagram: '', youtube: '',
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

const AdminSettings = () => {
  const [adminUser, setAdminUser]     = useState(null);
  const [schoolInfo, setSchoolInfo]   = useState(defaultSchoolInfo);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPwdLoad] = useState(false);
  const [schoolLoading, setSchoolLoad]= useState(false);
  const [toast, setToast]             = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) setAdminUser(JSON.parse(user));
    const saved = localStorage.getItem(SCHOOL_INFO_KEY);
    if (saved) { try { setSchoolInfo(JSON.parse(saved)); } catch { /* use default */ } }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error'); return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error'); return;
    }
    setPwdLoad(true);
    try {
      await api.put('/admin/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showToast('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally { setPwdLoad(false); }
  };

  const handleSchoolInfoSave = (e) => {
    e.preventDefault();
    setSchoolLoad(true);
    setTimeout(() => {
      localStorage.setItem(SCHOOL_INFO_KEY, JSON.stringify(schoolInfo));
      showToast('School information saved');
      setSchoolLoad(false);
    }, 400);
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  const Spinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your admin account and school information</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 text-base mb-4 flex items-center gap-2">
          <FaUser className="text-blue-500" /> Admin Profile
        </h3>
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 rounded-full w-14 h-14 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {adminUser?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{adminUser?.username || '—'}</p>
            <p className="text-gray-500 text-sm">{adminUser?.email || '—'}</p>
            <span className="inline-block mt-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Administrator</span>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 text-base mb-5 flex items-center gap-2">
          <FaLock className="text-blue-500" /> Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input type="password" value={passwordForm.currentPassword} required placeholder="Enter current password"
              onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input type="password" value={passwordForm.newPassword} required placeholder="Min. 6 characters"
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <input type="password" value={passwordForm.confirmPassword} required placeholder="Repeat new password"
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className={inputClass} />
            </div>
          </div>
          <button type="submit" disabled={passwordLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
            {passwordLoading ? <><Spinner />Saving...</> : <><FaSave />Update Password</>}
          </button>
        </form>
      </motion.div>

      {/* School Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 text-base mb-5 flex items-center gap-2">
          <FaSchool className="text-blue-500" /> School Information
        </h3>
        <form onSubmit={handleSchoolInfoSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">School Name</label>
            <div className="relative">
              <FaSchool className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" value={schoolInfo.name} placeholder="School name"
                onChange={e => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-sm" />
              <textarea value={schoolInfo.address} rows={2} placeholder="School address"
                onChange={e => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="text" value={schoolInfo.phone} placeholder="+1 (555) 000-0000"
                  onChange={e => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="email" value={schoolInfo.email} placeholder="info@school.edu"
                  onChange={e => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Social Media Links</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key:'facebook',  Icon:FaFacebook,  placeholder:'Facebook URL',  color:'text-blue-600' },
                { key:'twitter',   Icon:FaTwitter,   placeholder:'Twitter URL',   color:'text-sky-500' },
                { key:'instagram', Icon:FaInstagram, placeholder:'Instagram URL', color:'text-pink-500' },
                { key:'youtube',   Icon:FaYoutube,   placeholder:'YouTube URL',   color:'text-red-500' },
              ].map(({ key, Icon, placeholder, color }) => (
                <div key={key} className="relative">
                  <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${color}`} />
                  <input type="url" value={schoolInfo[key]} placeholder={placeholder}
                    onChange={e => setSchoolInfo({ ...schoolInfo, [key]: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
          </div>
          <button type="submit" disabled={schoolLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
            {schoolLoading ? <><Spinner />Saving...</> : <><FaSave />Save Information</>}
          </button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>Note:</strong> School information is stored locally in your browser. To persist it across devices, connect it to a backend settings API.
      </motion.div>
    </div>
  );
};

export default AdminSettings;
