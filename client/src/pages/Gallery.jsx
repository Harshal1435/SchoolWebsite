import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaImages } from 'react-icons/fa';
import axios from 'axios';
import PageBanner from '../components/PageBanner';

// Real working Pexels photos — used as fallback when no images are in the DB
const fallbackImages = [
  { _id:'f1',  imageUrl:'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800',   title:'Campus Building',      category:'campus',     description:'Our modern campus facilities' },
  { _id:'f2',  imageUrl:'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Students in Class',    category:'academic',   description:'Engaged learning environment' },
  { _id:'f3',  imageUrl:'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Science Lab',          category:'facilities', description:'State-of-the-art laboratory' },
  { _id:'f4',  imageUrl:'https://images.pexels.com/photos/159581/sports-football-ball-stadium-159581.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Sports Day', category:'sports', description:'Annual athletics competition' },
  { _id:'f5',  imageUrl:'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Library',              category:'facilities', description:'Extensive book collection' },
  { _id:'f6',  imageUrl:'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Basketball Court',     category:'sports',     description:'Indoor sports facilities' },
  { _id:'f7',  imageUrl:'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Group Study',          category:'academic',   description:'Collaborative learning spaces' },
  { _id:'f8',  imageUrl:'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800',   title:'School Entrance',      category:'campus',     description:'Main entrance and courtyard' },
  { _id:'f9',  imageUrl:'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=800',   title:'Music Class',          category:'activities', description:'Music and arts program' },
  { _id:'f10', imageUrl:'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Computer Lab',         category:'facilities', description:'Technology-enabled learning' },
  { _id:'f11', imageUrl:'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',   title:'Graduation Ceremony',  category:'events',     description:'Annual graduation celebration' },
  { _id:'f12', imageUrl:'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Art Exhibition',       category:'activities', description:'Student artwork showcase' },
  { _id:'f13', imageUrl:'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800',   title:'Cafeteria',            category:'facilities', description:'Modern dining facilities' },
  { _id:'f14', imageUrl:'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',   title:'Soccer Field',         category:'sports',     description:'Outdoor sports complex' },
  { _id:'f15', imageUrl:'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Science Fair',         category:'events',     description:'Annual science exhibition' },
  { _id:'f16', imageUrl:'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Chemistry Lab',        category:'facilities', description:'Advanced chemistry equipment' },
  { _id:'f17', imageUrl:'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Team Building',        category:'activities', description:'Student collaboration activities' },
  { _id:'f18', imageUrl:'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Campus Garden',        category:'campus',     description:'Beautiful outdoor spaces' },
  { _id:'f19', imageUrl:'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800', title:'School Auditorium',    category:'facilities', description:'Modern auditorium for events' },
  { _id:'f20', imageUrl:'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',   title:'Swimming Pool',        category:'sports',     description:'Olympic-size swimming pool' },
  { _id:'f21', imageUrl:'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Drama Performance',    category:'activities', description:'Annual drama production' },
  { _id:'f22', imageUrl:'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Robotics Lab',         category:'academic',   description:'STEM education facility' },
  { _id:'f23', imageUrl:'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Cultural Festival',    category:'events',     description:'Celebrating diversity' },
  { _id:'f24', imageUrl:'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=800', title:'Classroom', category:'campus', description:'Modern learning spaces' },
];

const categories = [
  { id:'all',        name:'All Photos' },
  { id:'campus',     name:'Campus' },
  { id:'academic',   name:'Academic' },
  { id:'facilities', name:'Facilities' },
  { id:'sports',     name:'Sports' },
  { id:'activities', name:'Activities' },
  { id:'events',     name:'Events' },
];

const Gallery = () => {
  const [images, setImages]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [selectedImage, setSelected]  = useState(null);
  const [imgError, setImgError]       = useState({});

  useEffect(() => {
    axios.get('/api/gallery')
      .then(r => setImages(r.data.length ? r.data : fallbackImages))
      .catch(() => setImages(fallbackImages))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? images : images.filter(img => img.category === filter);

  const navigate = dir => {
    const idx = filtered.findIndex(img => img._id === selectedImage._id);
    const next = dir === 'next'
      ? (idx + 1) % filtered.length
      : (idx - 1 + filtered.length) % filtered.length;
    setSelected(filtered[next]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;
    const handler = e => {
      if (e.key === 'ArrowRight') navigate('next');
      if (e.key === 'ArrowLeft')  navigate('prev');
      if (e.key === 'Escape')     setSelected(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedImage, filtered]);

  return (
    <div className="pt-20">
      <PageBanner page="gallery" />

      {/* Filter bar */}
      <section className="py-6 bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === cat.id
                    ? 'bg-primary-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary-600 border-t-transparent mb-4" />
              <p className="text-gray-500">Loading gallery…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <FaImages className="text-6xl mx-auto mb-4" />
              <p className="text-lg">No photos in this category yet.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filtered.map((img, i) => (
                  <motion.div
                    key={img._id}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all cursor-pointer aspect-square bg-gray-200"
                    onClick={() => setSelected(img)}
                  >
                    {!imgError[img._id] ? (
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={() => setImgError(prev => ({ ...prev, [img._id]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100">
                        <FaImages className="text-4xl text-primary-400" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-base leading-tight mb-1">{img.title}</h3>
                        <p className="text-xs text-gray-300 line-clamp-1">{img.description}</p>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <FaExpand className="text-white text-sm" />
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-primary-600/80 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.category}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all z-10"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); navigate('prev'); }}
              className="absolute left-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-4 transition-all z-10"
            >
              <FaChevronLeft className="text-2xl" />
            </button>

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); navigate('next'); }}
              className="absolute right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-4 transition-all z-10"
            >
              <FaChevronRight className="text-2xl" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage._id}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
              />
              <div className="text-white text-center mt-5">
                <h3 className="text-2xl font-bold mb-1">{selectedImage.title}</h3>
                <p className="text-gray-400 text-sm">{selectedImage.description}</p>
                <span className="inline-block mt-2 bg-primary-600/70 text-white text-xs px-3 py-1 rounded-full">
                  {selectedImage.category}
                </span>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/40 px-4 py-1.5 rounded-full">
              {filtered.findIndex(img => img._id === selectedImage._id) + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              [images.length + '+', 'Photos'],
              ['6', 'Categories'],
              ['50+', 'Events Captured'],
              ['1000+', 'Memories'],
            ].map(([num, label], i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="text-4xl font-bold text-primary-600 mb-2">{num}</div>
                <div className="text-gray-500">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
