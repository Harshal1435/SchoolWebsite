import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import PageBanner from '../components/PageBanner';

const Contact = () => {
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      setSubmitted(true);
      setFormData({ name:'', email:'', phone:'', subject:'', message:'' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: <FaMapMarkerAlt className="text-3xl" />, title:'Address',      content:'Nagpur, Maharashtra, India' },
    { icon: <FaPhone className="text-3xl" />,        title:'Phone',        content:'+91 95636 95857' },
    { icon: <FaEnvelope className="text-3xl" />,     title:'Email',        content:'info@futuremindschool.edu' },
    { icon: <FaClock className="text-3xl" />,        title:'Office Hours', content:'Mon–Sat: 8:00 AM – 5:00 PM' },
  ];

  return (
    <div className="pt-20">
      <PageBanner page="contact" />

      {/* Info cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {info.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
              >
                <div className="text-primary-600 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Send Us a Message</h2>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 flex items-center"
                >
                  <FaCheckCircle className="text-green-500 text-2xl mr-3" />
                  <p className="text-green-700 font-medium">Message sent! We'll get back to you soon.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { label:'Name',    name:'name',    type:'text',  placeholder:'Your full name' },
                  { label:'Email',   name:'email',   type:'email', placeholder:'your.email@example.com' },
                  { label:'Phone',   name:'phone',   type:'tel',   placeholder:'+1 (555) 123-4567' },
                  { label:'Subject', name:'subject', type:'text',  placeholder:'What is this regarding?' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-gray-700 font-medium mb-2">{f.label} *</label>
                    <input
                      type={f.type} name={f.name} value={formData[f.name]}
                      onChange={handleChange} required placeholder={f.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message *</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange}
                    required rows="5" placeholder="Tell us more about your inquiry…"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Map + links */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Visit Our Campus</h2>

              <div className="bg-gray-200 rounded-xl h-64 mb-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaMapMarkerAlt className="text-6xl mx-auto mb-4" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm">Nagpur, Maharashtra, India</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">Campus Tours</h3>
                <p className="text-gray-600 mb-4">We welcome prospective families to visit our campus. Tours are available by appointment.</p>
                <button className="w-full bg-primary-100 text-primary-700 py-3 rounded-xl font-semibold hover:bg-primary-200 transition-colors">
                  Schedule a Tour
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">Quick Links</h3>
                <ul className="space-y-2">
                  {['Admissions FAQ','School Calendar','Parent Portal','Employment Opportunities'].map(l => (
                    <li key={l}><a href="#" className="text-primary-600 hover:text-primary-700 font-medium">→ {l}</a></li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
