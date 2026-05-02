import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import BannerManager from './admin/BannerManager';
import GalleryManager from './admin/GalleryManager';
import ContactMessages from './admin/ContactMessages';
import AdminSettings from './admin/AdminSettings';
import ProtectedRoute from './admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public routes (with Navbar + Footer) ── */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/"           element={<Home />} />
                  <Route path="/about"      element={<About />} />
                  <Route path="/academics"  element={<Academics />} />
                  <Route path="/admissions" element={<Admissions />} />
                  <Route path="/events"     element={<Events />} />
                  <Route path="/gallery"    element={<Gallery />} />
                  <Route path="/contact"    element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* ── Admin routes (no Navbar / Footer) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="banners"   element={<BannerManager />} />
          <Route path="gallery"   element={<GalleryManager />} />
          <Route path="messages"  element={<ContactMessages />} />
          <Route path="settings"  element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
