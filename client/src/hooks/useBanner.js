import { useState, useEffect } from 'react';
import axios from 'axios';

// Fallback banner images from Pexels (always work, no API key needed)
const fallbackBanners = {
  home: {
    imageUrl: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Welcome to Excellence School',
    subtitle: 'Inspiring minds, shaping futures, and building tomorrow\'s leaders'
  },
  about: {
    imageUrl: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'About Our School',
    subtitle: 'Building a legacy of excellence in education for over three decades'
  },
  academics: {
    imageUrl: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Academic Programs',
    subtitle: 'Comprehensive curriculum designed to inspire learning and foster excellence'
  },
  admissions: {
    imageUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Admissions',
    subtitle: 'Join our community of learners and begin your journey to excellence'
  },
  events: {
    imageUrl: 'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Events & Activities',
    subtitle: 'Stay updated with our upcoming events, activities, and important dates'
  },
  gallery: {
    imageUrl: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Photo Gallery',
    subtitle: 'Explore our vibrant campus life, facilities, and memorable moments'
  },
  contact: {
    imageUrl: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Contact Us',
    subtitle: "We'd love to hear from you. Get in touch with us today!"
  }
};

const useBanner = (page) => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`/api/banners/page/${page}`);
        setBanner(res.data);
      } catch {
        // Use fallback if no banner uploaded yet
        setBanner(fallbackBanners[page] || fallbackBanners.home);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, [page]);

  return { banner, loading };
};

export default useBanner;
