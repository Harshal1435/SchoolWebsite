import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaTimes, FaUpload, FaImages, FaFilter, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import api from './api';

const CATEGORIES = ['campus', 'academic', 'facilities', 'sports', 'activities', 'events'];
const defaultForm = { title: '', description: '', category: 'campus', order: 0, image: null };

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

const GalleryManager = () => {
  const [images, setImages]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setFilter] = useState('all');
  const [showForm, setShowForm]   = useState(false);
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

  const fetchImages = async () => {
    try {
      const res = await api.get('/gallery');
      setImages(res.data);
    } catch { showToast('Failed to load gallery images', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const closeForm = () => { setShowForm(false); setForm(defaultForm); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { showToast('Please select an image', 'error'); return; }
    setSubmit(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('category', form.category);
      data.append('order', form.order);
      data.append('image', form.image);
      await api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Image uploaded successfully');
      closeForm();
      fetchImages();
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally { setSubmit(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/gallery/${deleteId}`);
      setImages(images.filter(img => img._id !== deleteId));
      showToast('Image deleted successfully');
    } catch { showToast('Failed to delete image', 'error'); }
    finally { setDeleteId(null); }
  };

  const filtered = activeFilter === 'all' ? images : images.filter(img => img.category === activeFilter);
  const countByCategory = (cat) => images.filter(img => img.category === cat).length;

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
          <h2 className="text-2xl font-bold text-gray-800">Gallery Manager</h2>
          <p className="text-gray-500 text-sm mt-1">{images.length} image{images.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <FaPlus className="text-xs" /> Add Image
        </button>
      </motion.div>

      {/* Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-400 text-sm" />
          <span className="text-sm font-medium text-gray-600">Filter by Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All ({images.length})
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${activeFilter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat} ({countByCategory(cat)})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[...Array(10)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <FaImages className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{activeFilter === 'all' ? 'No images uploaded yet' : `No images in "${activeFilter}" category`}</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Image" to upload</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((img, i) => (
            <motion.div key={img._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
              <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold truncate">{img.title}</p>
                  <span className="text-white/70 text-xs capitalize">{img.category}</span>
                </div>
                <button onClick={() => setDeleteId(img._id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition">
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg">Add Gallery Image</h3>
                <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-lg transition"><FaTimes className="text-gray-500" /></button>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Image <span className="text-red-500">*</span></label>
                  <div onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl cursor-pointer transition overflow-hidden">
                    {preview ? (
                      <div className="relative h-48">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                          <p className="text-white text-sm font-medium flex items-center gap-2"><FaUpload /> Change Image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-36 flex flex-col items-center justify-center text-gray-400">
                        <FaUpload className="text-2xl mb-2" />
                        <p className="text-sm">Click to upload image</p>
                        <p className="text-xs mt-1">JPG, PNG, WebP</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                  <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                    placeholder="Image title"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3}
                    placeholder="Brief description"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize">
                      {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
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
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                    {submitting ? <><Spinner />Uploading...</> : 'Upload Image'}
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
              <h3 className="text-gray-800 font-bold text-lg mb-2">Delete Image?</h3>
              <p className="text-gray-500 text-sm mb-6">This will permanently delete the image from Cloudinary. This cannot be undone.</p>
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

export default GalleryManager;
