const express = require('express');
const router = express.Router();
const { patients, currentVitals, dashboardAnalytics, healthAlerts } = require('../data/health-dataset');

// GET /api/patients - List all patients (summary)
router.get('/', (req, res) => {
    const summary = patients.map(({ id, name, age, gender, bloodType, chronicConditions, primaryPhysician, isActive }) => ({
        id, name, age, gender, bloodType, chronicConditions, primaryPhysician, isActive
    }));
    res.json({ success: true, count: summary.length, data: summary });
});

// GET /api/patients/:id - Get full patient profile
router.get('/:id', (req, res) => {
    const patient = patients.find(p => p.id === req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
});

// GET /api/patients/:id/dashboard - Patient dashboard summary
router.get('/:id/dashboard', (req, res) => {
    const patient = patients.find(p => p.id === req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const vitals = currentVitals[req.params.id];
    const analytics = dashboardAnalytics[req.params.id];
    const alerts = healthAlerts.filter(a => a.patientId === req.params.id && !a.isRead);

    res.json({
        success: true,
        data: {
            patient: { id: patient.id, name: patient.name, age: patient.age, avatarUrl: patient.avatarUrl },
            currentVitals: vitals || null,
            analytics: analytics || null,
            unreadAlerts: alerts,
            unreadAlertCount: alerts.length
        }
    });
});

// PUT /api/patients/:id - Update patient info
router.put('/:id', (req, res) => {
    const patientIdx = patients.findIndex(p => p.id === req.params.id);
    if (patientIdx === -1) return res.status(404).json({ success: false, message: 'Patient not found' });

    const allowedUpdates = ['phone', 'email', 'address', 'emergencyContact'];
    const updates = {};
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    patients[patientIdx] = { ...patients[patientIdx], ...updates };
    res.json({ success: true, message: 'Patient updated', data: patients[patientIdx] });
});

module.exports = router;
