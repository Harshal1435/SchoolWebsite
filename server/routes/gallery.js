const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { cloudinary, uploadGallery } = require('../config/cloudinary');

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category, isActive: true } : { isActive: true };
    const images = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload new gallery image
router.post('/', uploadGallery.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const gallery = new Gallery({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      category: req.body.category,
      order: req.body.order || 0
    });

    const newImage = await gallery.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update gallery image
router.put('/:id', uploadGallery.single('image'), async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // If new image is uploaded, delete old one from cloudinary
    if (req.file) {
      await cloudinary.uploader.destroy(image.cloudinaryId);
      image.imageUrl = req.file.path;
      image.cloudinaryId = req.file.filename;
    }

    image.title = req.body.title || image.title;
    image.description = req.body.description || image.description;
    image.category = req.body.category || image.category;
    image.order = req.body.order !== undefined ? req.body.order : image.order;
    image.isActive = req.body.isActive !== undefined ? req.body.isActive : image.isActive;

    const updatedImage = await image.save();
    res.json(updatedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete gallery image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);
    
    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
