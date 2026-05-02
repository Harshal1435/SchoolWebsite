import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCheckCircle, FaFileAlt, FaCalendar, FaUserGraduate } from 'react-icons/fa';
import PageBanner from '../components/PageBanner';

const Admissions = () => {
  const empty = { studentName:'', dateOfBirth:'', grade:'', parentName:'', email:'', phone:'', address:'', previousSchool:'' };
  const [formData, setFormData] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/admissions', formData);
      setSubmitted(true);
      setFormData(empty);
    } catch {
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: <FaFileAlt className="text-3xl" />,    title:'Submit Application', description:'Fill out the online application form with required information' },
    { icon: <FaCalendar className="text-3xl" />,   title:'Schedule Visit',     description:'Visit our campus and meet with our admissions team' },
    { icon: <FaUserGraduate className="text-3xl" />,title:'Assessment',        description:'Student assessment and parent interview' },
    { icon: <FaCheckCircle className="text-3xl" />, title:'Enrollment',        description:'Receive admission decision and complete enrollment' },
  ];

  const dates = [
    { label:'Application Deadline', value:'June 30, 2026' },
    { label:'Assessment Period',    value:'July 1–15, 2026' },
    { label:'Admission Results',    value:'July 20, 2026' },
    { label:'Academic Year Starts', value:'September 1, 2026' },
  ];

  return (
    <div className="pt-20">
      <PageBanner page="admissions" />

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">Admission Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Four simple steps to join our school</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">{s.icon}</div>
                <div className="text-primary-600 font-bold mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">Application Form</h2>
            <p className="text-xl text-gray-600">Fill out the form below to start your admission process</p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center"
            >
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600">Thank you for your interest. We will contact you within 2–3 business days.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label:'Student Name',         name:'studentName', type:'text' },
                  { label:'Date of Birth',         name:'dateOfBirth', type:'date' },
                  { label:'Parent/Guardian Name',  name:'parentName',  type:'text' },
                  { label:'Email',                 name:'email',       type:'email' },
                  { label:'Phone',                 name:'phone',       type:'tel' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-gray-700 font-medium mb-2">{f.label} *</label>
                    <input
                      type={f.type} name={f.name} value={formData[f.name]}
                      onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Grade Applying For *</label>
                  <select
                    name="grade" value={formData.grade} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Grade</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Address *</label>
                  <textarea
                    name="address" value={formData.address} onChange={handleChange}
                    required rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Previous School (Optional)</label>
                  <input
                    type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full mt-8 bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Submitting…' : 'Submit Application'}
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* Docs + Dates */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Required Documents</h2>
              <ul className="space-y-3">
                {['Birth Certificate','Previous School Records','Immunization Records','Proof of Residence','Parent/Guardian ID','Recent Passport Photos'].map((d, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />{d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Important Dates</h2>
              <div className="space-y-4">
                {dates.map((d, i) => (
                  <div key={i} className="bg-primary-50 p-4 rounded-lg">
                    <div className="font-bold text-primary-600">{d.label}</div>
                    <div className="text-gray-700">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;
