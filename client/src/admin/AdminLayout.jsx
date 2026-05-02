import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaImage, FaImages, FaEnvelope,
  FaCog, FaSchool, FaBars, FaSignOutAlt, FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
  { to: '/admin/banners',   icon: FaImage,         label: 'Banners' },
  { to: '/admin/gallery',   icon: FaImages,        label: 'Gallery' },
  { to: '/admin/messages',  icon: FaEnvelope,      label: 'Contact Messages' },
  { to: '/admin/settings',  icon: FaCog,           label: 'Settings' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin/login'); return; }
    const user = localStorage.getItem('adminUser');
    if (user) setAdminUser(JSON.parse(user));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-700">
        <div className="bg-white/20 rounded-lg p-2">
          <FaSchool className="text-white text-xl" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Future Minds School</p>
        <p className="text-white/70 text-xs">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`text-base flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                <span className="flex-1">{label}</span>
                {isActive && <FaChevronRight className="text-blue-400 text-xs" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-blue-700">
        {adminUser && (
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {adminUser.username?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{adminUser.username}</p>
              <p className="text-blue-300 text-xs truncate">{adminUser.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-blue-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-blue-800 z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
            >
              <FaBars className="text-lg" />
            </button>
            <div>
              <h1 className="text-gray-800 font-bold text-lg leading-tight">Admin Panel</h1>
          <p className="text-blue-100 text-xs hidden sm:block">Future Minds School Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {adminUser && (
              <span className="hidden sm:block text-sm text-gray-500">
                Welcome, <span className="font-semibold text-gray-700">{adminUser.username}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
