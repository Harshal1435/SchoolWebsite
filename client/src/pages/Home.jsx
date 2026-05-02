import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaGraduationCap, FaUsers, FaTrophy,
  FaBook, FaChalkboardTeacher, FaLaptop
} from 'react-icons/fa';
import useBanner from '../hooks/useBanner';

const Home = () => {
  const { banner, loading } = useBanner('home');

  const features = [
    { icon: <FaGraduationCap className="text-4xl" />, title: 'Quality Education',   description: 'Comprehensive curriculum designed to nurture academic excellence' },
    { icon: <FaChalkboardTeacher className="text-4xl" />, title: 'Expert Faculty',   description: 'Experienced and dedicated teachers committed to student success' },
    { icon: <FaLaptop className="text-4xl" />,           title: 'Modern Facilities', description: 'State-of-the-art classrooms and technology-enabled learning' },
    { icon: <FaTrophy className="text-4xl" />,           title: 'Sports & Activities',description: 'Wide range of extracurricular activities for holistic development' },
    { icon: <FaBook className="text-4xl" />,             title: 'Rich Library',      description: 'Extensive collection of books and digital resources' },
    { icon: <FaUsers className="text-4xl" />,            title: 'Community',         description: 'Strong parent-teacher collaboration and supportive environment' },
  ];

  const stats = [
    { number: '2000+', label: 'Students' },
    { number: '150+',  label: 'Teachers' },
    { number: '95%',   label: 'Success Rate' },
    { number: '30+',   label: 'Years of Excellence' },
  ];

  return (
    <div className="pt-20">
      {/* ── Hero / Banner ── */}
      <section className="relative text-white min-h-[88vh] flex items-center overflow-hidden">
        {/* Background image */}
        {!loading && banner?.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[8s] hover:scale-100"
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-primary-500/80 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase"
            >
              Welcome to Future Minds School
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight drop-shadow-xl">
              {banner?.title || 'Inspiring Future Minds'}
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed drop-shadow">
              {banner?.subtitle || 'Inspiring minds, shaping futures, and building tomorrow\'s leaders through quality education in Nagpur'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/admissions"
                className="bg-primary-500 hover:bg-primary-400 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-xl text-center"
              >
                Apply Now
              </Link>
              <Link
                to="/about"
                className="bg-white/15 backdrop-blur-sm border-2 border-white/60 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/25 transition-all text-center"
              >
                Learn More
              </Link>
              <Link
                to="/gallery"
                className="bg-white/15 backdrop-blur-sm border-2 border-white/60 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/25 transition-all text-center"
              >
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-1">{stat.number}</div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a nurturing environment that fosters academic excellence and personal growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary-600 mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Take the first step towards an excellent education. Apply today and become part of our family.
          </p>
          <Link
            to="/admissions"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Application
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
