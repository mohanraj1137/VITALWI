const express = require('express');
const router = express.Router();
const { doctors } = require('../data/health-dataset');

// GET /api/doctors - All doctors (filter by specialty)
router.get('/', (req, res) => {
    const { specialty } = req.query;
    let result = specialty
        ? doctors.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()))
        : doctors;

    res.json({ success: true, count: result.length, data: result });
});

// GET /api/doctors/:id
router.get('/:id', (req, res) => {
    const doctor = doctors.find(d => d.id === req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
});

module.exports = router;
