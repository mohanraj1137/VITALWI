const express = require('express');
const router = express.Router();
const { appointments } = require('../data/health-dataset');
const { v4: uuidv4 } = require('uuid');

// GET /api/appointments - All appointments (optionally filtered by patientId)
router.get('/', (req, res) => {
    const { patientId, status, upcoming } = req.query;
    let result = [...appointments];

    if (patientId) result = result.filter(a => a.patientId === patientId);
    if (status) result = result.filter(a => a.status === status);
    if (upcoming === 'true') {
        const now = new Date().toISOString().split('T')[0];
        result = result.filter(a => a.date >= now && a.status === 'scheduled');
    }

    result.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

    res.json({ success: true, count: result.length, data: result });
});

// GET /api/appointments/:id - Single appointment
router.get('/:id', (req, res) => {
    const apt = appointments.find(a => a.id === req.params.id);
    if (!apt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: apt });
});

// POST /api/appointments - Book appointment
router.post('/', (req, res) => {
    const { patientId, doctorName, specialty, date, time, type } = req.body;

    if (!patientId || !doctorName || !date || !time) {
        return res.status(400).json({ success: false, message: 'patientId, doctorName, date, and time are required' });
    }

    // Check for conflicts
    const conflict = appointments.find(a =>
        a.patientId === patientId &&
        a.date === date &&
        a.time === time &&
        a.status === 'scheduled'
    );

    if (conflict) {
        return res.status(409).json({ success: false, message: 'You already have an appointment at this time slot' });
    }

    const newApt = {
        id: `apt-${uuidv4()}`,
        patientId,
        doctorName,
        specialty: specialty || 'General Medicine',
        date,
        time,
        location: req.body.location || 'To be confirmed',
        type: type || 'Consultation',
        status: 'scheduled',
        notes: req.body.notes || '',
        duration: req.body.duration || 30,
        telehealth: req.body.telehealth || false,
        createdAt: new Date().toISOString()
    };

    appointments.push(newApt);
    res.status(201).json({ success: true, message: 'Appointment booked successfully', data: newApt });
});

// PATCH /api/appointments/:id/cancel - Cancel appointment
router.patch('/:id/cancel', (req, res) => {
    const aptIdx = appointments.findIndex(a => a.id === req.params.id);
    if (aptIdx === -1) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (appointments[aptIdx].status === 'completed') {
        return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment' });
    }

    appointments[aptIdx].status = 'cancelled';
    appointments[aptIdx].cancelledAt = new Date().toISOString();
    appointments[aptIdx].cancelReason = req.body.reason || 'No reason provided';

    res.json({ success: true, message: 'Appointment cancelled', data: appointments[aptIdx] });
});

// PATCH /api/appointments/:id/complete - Mark as completed
router.patch('/:id/complete', (req, res) => {
    const aptIdx = appointments.findIndex(a => a.id === req.params.id);
    if (aptIdx === -1) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointments[aptIdx].status = 'completed';
    appointments[aptIdx].completedAt = new Date().toISOString();
    if (req.body.notes) appointments[aptIdx].notes = req.body.notes;

    res.json({ success: true, message: 'Appointment marked as completed', data: appointments[aptIdx] });
});

module.exports = router;
