import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-heading">Future Minds School</h3>
            <p className="text-sm mb-4">
              Providing quality education and nurturing future leaders. 
              We are committed to academic excellence and holistic development in Nagpur.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-primary-400 transition-colors">Academics</Link></li>
              <li><Link to="/admissions" className="hover:text-primary-400 transition-colors">Admissions</Link></li>
              <li><Link to="/events" className="hover:text-primary-400 transition-colors">Events</Link></li>
              <li><Link to="/gallery" className="hover:text-primary-400 transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-heading">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Primary School</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Middle School</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">High School</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Sports Programs</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Arts & Culture</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">STEM Programs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-heading">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-primary-400 flex-shrink-0" />
                <span>Nagpur, Maharashtra, India</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-primary-400 flex-shrink-0" />
                <a href="tel:+919563695857" className="hover:text-primary-400 transition-colors">+91 95636 95857</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@futuremindschool.edu" className="hover:text-primary-400 transition-colors">info@futuremindschool.edu</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Future Minds School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
