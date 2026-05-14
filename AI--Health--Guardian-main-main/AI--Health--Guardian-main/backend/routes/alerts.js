const express = require('express');
const router = express.Router();
const { healthAlerts } = require('../data/health-dataset');
const { v4: uuidv4 } = require('uuid');

// GET /api/alerts - All alerts (filter by patientId, severity, isRead)
router.get('/', (req, res) => {
    const { patientId, severity, isRead, type } = req.query;
    let result = [...healthAlerts];

    if (patientId) result = result.filter(a => a.patientId === patientId);
    if (severity) result = result.filter(a => a.severity === severity);
    if (type) result = result.filter(a => a.type === type);
    if (isRead !== undefined) result = result.filter(a => a.isRead === (isRead === 'true'));

    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ success: true, count: result.length, data: result });
});

// GET /api/alerts/:id - Single alert detail
router.get('/:id', (req, res) => {
    const alert = healthAlerts.find(a => a.id === req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, data: alert });
});

// POST /api/alerts - Create new alert
router.post('/', (req, res) => {
    const { patientId, type, severity, title, message } = req.body;

    if (!patientId || !title || !message) {
        return res.status(400).json({ success: false, message: 'patientId, title, and message are required' });
    }

    const validSeverities = ['info', 'warning', 'critical'];
    const validTypes = ['medication', 'vitals', 'lab', 'appointment', 'general'];

    const newAlert = {
        id: `alert-${uuidv4()}`,
        patientId,
        type: validTypes.includes(type) ? type : 'general',
        severity: validSeverities.includes(severity) ? severity : 'info',
        title,
        message,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionRequired: req.body.actionRequired || false,
        actionLabel: req.body.actionLabel || null
    };

    healthAlerts.push(newAlert);
    res.status(201).json({ success: true, message: 'Alert created', data: newAlert });
});

// PATCH /api/alerts/:id/read - Mark alert as read
router.patch('/:id/read', (req, res) => {
    const alertIdx = healthAlerts.findIndex(a => a.id === req.params.id);
    if (alertIdx === -1) return res.status(404).json({ success: false, message: 'Alert not found' });

    healthAlerts[alertIdx].isRead = true;
    healthAlerts[alertIdx].readAt = new Date().toISOString();
    res.json({ success: true, message: 'Alert marked as read', data: healthAlerts[alertIdx] });
});

// PATCH /api/alerts/patient/:patientId/read-all - Mark all alerts as read
router.patch('/patient/:patientId/read-all', (req, res) => {
    const now = new Date().toISOString();
    let count = 0;

    healthAlerts.forEach((alert, idx) => {
        if (alert.patientId === req.params.patientId && !alert.isRead) {
            healthAlerts[idx].isRead = true;
            healthAlerts[idx].readAt = now;
            count++;
        }
    });

    res.json({ success: true, message: `${count} alerts marked as read` });
});

// DELETE /api/alerts/:id - Dismiss alert
router.delete('/:id', (req, res) => {
    const alertIdx = healthAlerts.findIndex(a => a.id === req.params.id);
    if (alertIdx === -1) return res.status(404).json({ success: false, message: 'Alert not found' });

    const removed = healthAlerts.splice(alertIdx, 1)[0];
    res.json({ success: true, message: 'Alert dismissed', data: removed });
});

module.exports = router;
