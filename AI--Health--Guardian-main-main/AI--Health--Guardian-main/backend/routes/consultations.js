const express = require('express');
const Consultation = require('../models/Consultation');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// GET /api/consultations - Get user's consultations
router.get('/', auth, async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    const query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    if (status) query.status = status;

    if (upcoming === 'true') {
      query.scheduledDate = { $gte: new Date() };
      query.status = { $in: ['scheduled', 'in-progress'] };
    }

    const consultations = await Consultation.find(query)
      .populate('patient', 'name email avatarUrl phone')
      .populate('doctor', 'name email avatarUrl specialty hospital consultationFee')
      .sort({ scheduledDate: -1 })
      .limit(50);

    res.json({ success: true, data: consultations, count: consultations.length });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch consultations.' });
  }
});

// GET /api/consultations/:id - Get single consultation
router.get('/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patient', 'name email avatarUrl phone allergies chronicConditions')
      .populate('doctor', 'name email avatarUrl specialty hospital');

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    res.json({ success: true, data: consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch consultation.' });
  }
});

// POST /api/consultations - Book a new consultation
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, scheduledDate, scheduledTime, type, reason, symptoms, duration } = req.body;

    if (!doctorId || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ success: false, message: 'Doctor, date, and time are required.' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const consultation = new Consultation({
      patient: req.user._id,
      doctor: doctorId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      type: type || 'video',
      reason: reason || '',
      symptoms: symptoms || [],
      duration: duration || 30,
      roomId: uuidv4(),
      status: 'scheduled'
    });

    await consultation.save();

    const populated = await Consultation.findById(consultation._id)
      .populate('patient', 'name email avatarUrl')
      .populate('doctor', 'name email avatarUrl specialty hospital');

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully.',
      data: populated
    });
  } catch (error) {
    console.error('Book consultation error:', error);
    res.status(500).json({ success: false, message: 'Failed to book consultation.' });
  }
});

// PATCH /api/consultations/:id/start - Start a consultation
router.patch('/:id/start', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    consultation.status = 'in-progress';
    consultation.startedAt = new Date();
    await consultation.save();

    const populated = await Consultation.findById(consultation._id)
      .populate('patient', 'name email avatarUrl')
      .populate('doctor', 'name email avatarUrl specialty');

    res.json({ success: true, data: populated, message: 'Consultation started.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to start consultation.' });
  }
});

// PATCH /api/consultations/:id/complete - Complete a consultation
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const { diagnosis, prescription, notes } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    consultation.status = 'completed';
    consultation.endedAt = new Date();
    if (diagnosis) consultation.diagnosis = diagnosis;
    if (prescription) consultation.prescription = prescription;
    if (notes) consultation.notes = notes;
    await consultation.save();

    res.json({ success: true, data: consultation, message: 'Consultation completed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to complete consultation.' });
  }
});

// PATCH /api/consultations/:id/cancel - Cancel a consultation
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', notes: req.body.reason || 'Cancelled by user' },
      { new: true }
    );
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }
    res.json({ success: true, data: consultation, message: 'Consultation cancelled.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel consultation.' });
  }
});

// POST /api/consultations/:id/message - Send a chat message in a consultation
router.post('/:id/message', auth, async (req, res) => {
  try {
    const { text, type } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    const message = {
      sender: req.user._id,
      text,
      type: type || 'text',
      timestamp: new Date()
    };

    consultation.messages.push(message);
    await consultation.save();

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// POST /api/consultations/:id/rate - Rate a consultation
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { rating, feedback },
      { new: true }
    );
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }
    res.json({ success: true, data: consultation, message: 'Thank you for your feedback!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to rate consultation.' });
  }
});

module.exports = router;
