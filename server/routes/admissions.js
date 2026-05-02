const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

// Get all admission applications
router.get('/', async (req, res) => {
  try {
    const applications = await Admission.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit admission application
router.post('/', async (req, res) => {
  const admission = new Admission(req.body);
  try {
    const newAdmission = await admission.save();
    res.status(201).json({ 
      message: 'Application submitted successfully! We will contact you soon.',
      data: newAdmission 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single application
router.get('/:id', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
