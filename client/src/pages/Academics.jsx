import { motion } from 'framer-motion';
import { FaBook, FaFlask, FaCalculator, FaGlobe, FaPalette, FaMusic, FaRunning, FaLaptopCode } from 'react-icons/fa';
import PageBanner from '../components/PageBanner';

const Academics = () => {
  const programs = [
    {
      level: 'Primary School', grades: 'Grades 1–5',
      description: 'Building strong foundations in core subjects with a focus on creativity and exploration.',
      subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'Arts', 'Physical Education']
    },
    {
      level: 'Middle School', grades: 'Grades 6–8',
      description: 'Developing critical thinking and analytical skills while exploring diverse subjects.',
      subjects: ['Advanced English', 'Algebra', 'Biology', 'History', 'Geography', 'Computer Science']
    },
    {
      level: 'High School', grades: 'Grades 9–12',
      description: 'Preparing students for college and career with rigorous academic programs.',
      subjects: ['Literature', 'Calculus', 'Physics', 'Chemistry', 'Economics', 'Advanced Programming']
    },
  ];

  const departments = [
    { icon: <FaBook className="text-4xl" />,       name: 'Languages & Literature', description: 'English, Spanish, French, and creative writing programs' },
    { icon: <FaCalculator className="text-4xl" />, name: 'Mathematics',            description: 'From basic arithmetic to advanced calculus and statistics' },
    { icon: <FaFlask className="text-4xl" />,      name: 'Sciences',               description: 'Physics, Chemistry, Biology with state-of-the-art labs' },
    { icon: <FaGlobe className="text-4xl" />,      name: 'Social Studies',         description: 'History, Geography, Economics, and Civics' },
    { icon: <FaLaptopCode className="text-4xl" />, name: 'Technology',             description: 'Computer Science, Robotics, and Digital Media' },
    { icon: <FaPalette className="text-4xl" />,    name: 'Arts',                   description: 'Visual Arts, Drama, and Creative Expression' },
    { icon: <FaMusic className="text-4xl" />,      name: 'Music',                  description: 'Instrumental, Vocal, and Music Theory programs' },
    { icon: <FaRunning className="text-4xl" />,    name: 'Physical Education',     description: 'Sports, Fitness, and Health Education' },
  ];

  return (
    <div className="pt-20">
      <PageBanner page="academics" />

      {/* Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">Our Programs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Age-appropriate learning experiences from primary through high school</p>
          </div>
          <div className="space-y-8">
            {programs.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-primary-50 to-white p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-900 font-heading">{p.level}</h3>
                <p className="text-primary-600 font-semibold mb-3">{p.grades}</p>
                <p className="text-gray-600 mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.subjects.map((s, idx) => (
                    <span key={idx} className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">Academic Departments</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Specialized departments with expert faculty and modern facilities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary-600 mb-4">{d.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{d.name}</h3>
                <p className="text-gray-600 text-sm">{d.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[['15:1','Student-Teacher Ratio'],['50+','Courses Offered'],['100%','Qualified Teachers']].map(([num, label], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 bg-primary-50 rounded-xl"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{num}</div>
                <p className="text-gray-700 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
