import { motion } from 'framer-motion';
import { FaEye, FaBullseye, FaHeart, FaStar, FaUsers, FaGraduationCap } from 'react-icons/fa';
import PageBanner from '../components/PageBanner';

const About = () => {
  const values = [
    { icon: <FaStar className="text-4xl" />,    title: 'Excellence', description: 'We strive for excellence in everything we do, from academics to character development.' },
    { icon: <FaHeart className="text-4xl" />,   title: 'Integrity',  description: 'We uphold the highest standards of honesty, ethics, and moral principles.' },
    { icon: <FaUsers className="text-4xl" />,   title: 'Community',  description: 'We foster a supportive and inclusive community where everyone belongs.' },
    { icon: <FaBullseye className="text-4xl" />,title: 'Innovation', description: 'We embrace new ideas and technologies to enhance learning experiences.' },
  ];

  return (
    <div className="pt-20">
      <PageBanner page="about" />

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Future Minds School, located in Nagpur, Maharashtra, has been at the forefront of 
                educational innovation and academic excellence. We are committed to nurturing young 
                minds and preparing them for a bright future.
              </p>
              <p className="text-gray-600 mb-4">
                Our journey has been marked by continuous growth, adaptation, and an unwavering commitment 
                to providing the best possible education to our students. We believe in nurturing not just 
                academic excellence, but also character, creativity, and critical thinking.
              </p>
              <p className="text-gray-600">
                Today, we stand proud as one of the leading educational institutions in Nagpur, 
                with alumni making their mark in various fields across the country and globe.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 h-96 flex items-center justify-center"
            >
              <div className="text-center">
                <FaGraduationCap className="text-8xl text-primary-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-800">30+ Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <FaEye className="text-4xl text-primary-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900 font-heading">Our Vision</h3>
              </div>
              <p className="text-gray-600">
                To be a globally recognized institution that empowers students to become innovative
                thinkers, compassionate leaders, and responsible global citizens who contribute
                positively to society.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <FaBullseye className="text-4xl text-primary-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900 font-heading">Our Mission</h3>
              </div>
              <p className="text-gray-600">
                To provide a nurturing and challenging learning environment that fosters academic
                excellence, critical thinking, creativity, and character development while preparing
                students for success in an ever-changing world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <div className="text-primary-600 mb-4 flex justify-center">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{v.title}</h3>
                <p className="text-gray-600">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
