import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaTrash, FaEdit, FaTimes, FaUpload,
  FaToggleOn, FaToggleOff, FaImage, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import api from './api';

const PAGES = ['home', 'about', 'academics', 'admissions', 'events', 'gallery', 'contact'];
const defaultForm = { title: '', subtitle: '', page: 'home', order: 0, image: null };

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

const BannerManager = () => {
  const [banners, setBanners]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editBanner, setEdit]     = useState(null);
  const [form, setForm]           = useState(defaultForm);
  const [preview, setPreview]     = useState(null);
  const [submitting, setSubmit]   = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [toast, setToast]         = useState(null);
  const fileRef = useRef();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners');
      setBanners(res.data);
    } catch { showToast('Failed to load banners', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const openCreate = () => { setEdit(null); setForm(defaultForm); setPreview(null); setShowForm(true); };
  const openEdit = (b) => {
    setEdit(b);
    setForm({ title: b.title, subtitle: b.subtitle || '', page: b.page, order: b.order, image: null });
    setPreview(b.imageUrl);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEdit(null); setForm(defaultForm); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editBanner && !form.image) { showToast('Please select an image', 'error'); return; }
    setSubmit(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('subtitle', form.subtitle);
      data.append('page', form.page);
      data.append('order', form.order);
      if (form.image) data.append('image', form.image);

      if (editBanner) {
        await api.put(`/banners/${editBanner._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Banner updated successfully');
      } else {
        await api.post('/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Banner uploaded successfully');
      }
      closeForm();
      fetchBanners();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally { setSubmit(false); }
  };

  const toggleActive = async (banner) => {
    try {
      await api.put(`/banners/${banner._id}`, { isActive: !banner.isActive });
      setBanners(banners.map(b => b._id === banner._id ? { ...b, isActive: !b.isActive } : b));
      showToast(`Banner ${!banner.isActive ? 'activated' : 'deactivated'}`);
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/banners/${deleteId}`);
      setBanners(banners.filter(b => b._id !== deleteId));
      showToast('Banner deleted successfully');
    } catch { showToast('Failed to delete banner', 'error'); }
    finally { setDeleteId(null); }
  };

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );

  return (
    <div className="space-y-6">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Banner Manager</h2>
          <p className="text-gray-500 text-sm mt-1">Manage page banners and hero images</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <FaPlus className="text-xs" /> Upload Banner
        </button>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-xl h-56 animate-pulse" />)}
        </div>
      ) : banners.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <FaImage className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No banners uploaded yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "Upload Banner" to get started</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((banner, i) => (
            <motion.div key={banner._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold text-sm truncate">{banner.title}</p>
                  {banner.subtitle && <p className="text-white/70 text-xs truncate mt-0.5">{banner.subtitle}</p>}
                </div>
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                  {banner.page}
                </span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Order: {banner.order}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(banner)} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500" title={banner.isActive ? 'Deactivate' : 'Activate'}>
                    {banner.isActive ? <FaToggleOn className="text-green-500 text-lg" /> : <FaToggleOff className="text-gray-400 text-lg" />}
                  </button>
                  <button onClick={() => openEdit(banner)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"><FaEdit /></button>
                  <button onClick={() => setDeleteId(banner._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"><FaTrash /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg">{editBanner ? 'Edit Banner' : 'Upload New Banner'}</h3>
                <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-lg transition"><FaTimes className="text-gray-500" /></button>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Banner Image {!editBanner && <span className="text-red-500">*</span>}
                  </label>
                  <div onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl cursor-pointer transition overflow-hidden">
                    {preview ? (
                      <div className="relative h-40">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                          <p className="text-white text-sm font-medium flex items-center gap-2"><FaUpload /> Change Image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center text-gray-400">
                        <FaUpload className="text-2xl mb-2" />
                        <p className="text-sm">Click to upload image</p>
                        <p className="text-xs mt-1">JPG, PNG, WebP — recommended 1920×1080</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                  <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                    placeholder="Banner title"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                  <input type="text" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Optional subtitle"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Page <span className="text-red-500">*</span></label>
                    <select value={form.page} onChange={e => setForm({ ...form, page: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize">
                      {PAGES.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Order</label>
                    <input type="number" value={form.order} min="0"
                      onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeForm}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                    {submitting ? <><Spinner />{editBanner ? 'Saving...' : 'Uploading...'}</> : (editBanner ? 'Save Changes' : 'Upload Banner')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
              <div className="bg-red-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-500 text-xl" />
              </div>
              <h3 className="text-gray-800 font-bold text-lg mb-2">Delete Banner?</h3>
              <p className="text-gray-500 text-sm mb-6">This will permanently delete the banner and its image from Cloudinary.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerManager;
