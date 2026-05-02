const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { cloudinary, uploadBanner } = require('../config/cloudinary');

// Get all banners
router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    const filter = page ? { page, isActive: true } : { isActive: true };
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get banner by page
router.get('/page/:page', async (req, res) => {
  try {
    const banner = await Banner.findOne({ 
      page: req.params.page, 
      isActive: true 
    }).sort({ order: 1 });
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found for this page' });
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload new banner
router.post('/', uploadBanner.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const banner = new Banner({
      title: req.body.title,
      subtitle: req.body.subtitle || '',
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      page: req.body.page,
      order: req.body.order || 0
    });

    const newBanner = await banner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update banner
router.put('/:id', uploadBanner.single('image'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // If new image is uploaded, delete old one from cloudinary
    if (req.file) {
      await cloudinary.uploader.destroy(banner.cloudinaryId);
      banner.imageUrl = req.file.path;
      banner.cloudinaryId = req.file.filename;
    }

    banner.title = req.body.title || banner.title;
    banner.subtitle = req.body.subtitle || banner.subtitle;
    banner.page = req.body.page || banner.page;
    banner.order = req.body.order !== undefined ? req.body.order : banner.order;
    banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete banner
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(banner.cloudinaryId);
    
    // Delete from database
    await Banner.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
