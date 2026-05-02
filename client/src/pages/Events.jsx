import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import PageBanner from '../components/PageBanner';

const sampleEvents = [
  { _id:'1', title:'Annual Science Fair',      description:'Students showcase innovative science projects. Join us for a day of discovery and learning.', date: new Date('2026-06-15'), time:'9:00 AM – 3:00 PM', location:'Main Auditorium',      category:'academic' },
  { _id:'2', title:'Spring Sports Day',        description:'Annual sports competition featuring track & field events, team sports, and fun activities.', date: new Date('2026-05-20'), time:'8:00 AM – 4:00 PM', location:'School Sports Complex', category:'sports'   },
  { _id:'3', title:'Cultural Festival',        description:'Celebrate diversity with performances, food, and exhibitions from cultures around the world.', date: new Date('2026-06-01'), time:'10:00 AM – 6:00 PM',location:'School Grounds',        category:'cultural' },
  { _id:'4', title:'Parent-Teacher Conference',description:'Meet teachers to discuss student progress and academic goals for the upcoming semester.',    date: new Date('2026-05-25'), time:'2:00 PM – 7:00 PM', location:'Classrooms',            category:'other'    },
  { _id:'5', title:'Math Olympiad',            description:'Inter-school mathematics competition for grades 6–12. Test your problem-solving skills!',   date: new Date('2026-06-10'), time:'9:00 AM – 1:00 PM', location:'Computer Lab',          category:'academic' },
  { _id:'6', title:'Summer Concert',           description:'End-of-year musical performance featuring our school band, choir, and individual performers.',date: new Date('2026-06-28'), time:'6:00 PM – 8:00 PM', location:'Main Auditorium',      category:'cultural' },
];

const categoryColors = {
  academic: 'bg-blue-100 text-blue-700',
  sports:   'bg-green-100 text-green-700',
  cultural: 'bg-purple-100 text-purple-700',
  other:    'bg-gray-100 text-gray-700',
};

const Events = () => {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    axios.get('/api/events/upcoming')
      .then(r => setEvents(r.data))
      .catch(() => setEvents(sampleEvents))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter);

  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div className="pt-20">
      <PageBanner page="events" />

      {/* Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {['all','academic','sports','cultural','other'].map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${filter === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading events…</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-600 text-lg py-12">No events found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((ev, i) => (
                <motion.div
                  key={ev._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <FaCalendar className="text-6xl text-white opacity-50" />
                  </div>
                  <div className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[ev.category] || categoryColors.other}`}>
                      {ev.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 font-heading">{ev.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ev.description}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center"><FaCalendar className="mr-2 text-primary-600" />{fmtDate(ev.date)}</div>
                      <div className="flex items-center"><FaClock className="mr-2 text-primary-600" />{ev.time}</div>
                      <div className="flex items-center"><FaMapMarkerAlt className="mr-2 text-primary-600" />{ev.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Never Miss an Event</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">Subscribe to our calendar to stay updated with all school events and activities</p>
          <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg">
            Subscribe to Calendar
          </button>
        </div>
      </section>
    </div>
  );
};

export default Events;
