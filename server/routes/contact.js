const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get all contact messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit contact form
router.post('/', async (req, res) => {
  const contact = new Contact(req.body);
  try {
    const newContact = await contact.save();
    res.status(201).json({ 
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: newContact 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
