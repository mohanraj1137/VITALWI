const express = require('express');
const router = express.Router();
const { relatives } = require('../data/health-dataset');
const { v4: uuidv4 } = require('uuid');

// GET /api/relatives - All relatives (filtered by patientId)
router.get('/', (req, res) => {
    const { patientId } = req.query;
    const result = patientId ? relatives.filter(r => r.patientId === patientId) : relatives;
    res.json({ success: true, count: result.length, data: result });
});

// GET /api/relatives/:id - Single relative
router.get('/:id', (req, res) => {
    const relative = relatives.find(r => r.id === req.params.id);
    if (!relative) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: relative });
});

// POST /api/relatives - Add new contact
router.post('/', (req, res) => {
    const { patientId, name, relationship, phone } = req.body;

    if (!patientId || !name || !relationship || !phone) {
        return res.status(400).json({ success: false, message: 'patientId, name, relationship, and phone are required' });
    }

    const newRelative = {
        id: `rel-${uuidv4()}`,
        patientId,
        name,
        relationship,
        phone,
        email: req.body.email || '',
        notificationsEnabled: req.body.notificationsEnabled ?? true,
        lastContacted: null,
        createdAt: new Date().toISOString()
    };

    relatives.push(newRelative);
    res.status(201).json({ success: true, message: 'Contact added', data: newRelative });
});

// PUT /api/relatives/:id - Update contact
router.put('/:id', (req, res) => {
    const relIdx = relatives.findIndex(r => r.id === req.params.id);
    if (relIdx === -1) return res.status(404).json({ success: false, message: 'Contact not found' });

    const allowed = ['name', 'relationship', 'phone', 'email', 'notificationsEnabled'];
    allowed.forEach(field => {
        if (req.body[field] !== undefined) relatives[relIdx][field] = req.body[field];
    });

    res.json({ success: true, message: 'Contact updated', data: relatives[relIdx] });
});

// POST /api/relatives/:id/notify - Simulate sending notification
router.post('/:id/notify', (req, res) => {
    const relative = relatives.find(r => r.id === req.params.id);
    if (!relative) return res.status(404).json({ success: false, message: 'Contact not found' });

    if (!relative.notificationsEnabled) {
        return res.status(403).json({ success: false, message: 'Notifications are disabled for this contact' });
    }

    const relIdx = relatives.findIndex(r => r.id === req.params.id);
    relatives[relIdx].lastContacted = new Date().toISOString();

    res.json({
        success: true,
        message: `Notification sent to ${relative.name}`,
        data: {
            recipient: relative.name,
            method: 'SMS + Email',
            sentAt: new Date().toISOString(),
            subject: req.body.subject || 'Health Guardian Alert',
            preview: req.body.message?.substring(0, 100) || 'A health alert has been generated.'
        }
    });
});

// DELETE /api/relatives/:id - Remove contact
router.delete('/:id', (req, res) => {
    const relIdx = relatives.findIndex(r => r.id === req.params.id);
    if (relIdx === -1) return res.status(404).json({ success: false, message: 'Contact not found' });

    const removed = relatives.splice(relIdx, 1)[0];
    res.json({ success: true, message: `${removed.name} removed from contacts`, data: removed });
});

module.exports = router;
