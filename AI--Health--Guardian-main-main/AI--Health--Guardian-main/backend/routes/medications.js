const express = require('express');
const router = express.Router();
const { medications } = require('../data/health-dataset');
const { v4: uuidv4 } = require('uuid');

// GET /api/medications - All medications (filtered by patientId query param)
router.get('/', (req, res) => {
    const { patientId } = req.query;
    let result = patientId ? medications.filter(m => m.patientId === patientId) : medications;

    const sorted = [...result].sort((a, b) => a.nextDoseTimestamp - b.nextDoseTimestamp);
    res.json({ success: true, count: sorted.length, data: sorted });
});

// GET /api/medications/:id - Single medication detail
router.get('/:id', (req, res) => {
    const med = medications.find(m => m.id === req.params.id);
    if (!med) return res.status(404).json({ success: false, message: 'Medication not found' });
    res.json({ success: true, data: med });
});

// GET /api/medications/patient/:patientId/schedule - Today's medication schedule
router.get('/patient/:patientId/schedule', (req, res) => {
    const patientMeds = medications.filter(m => m.patientId === req.params.patientId);
    const now = Date.now();

    const schedule = patientMeds.map(med => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        scheduledTimes: med.scheduledTimes,
        nextDoseAt: new Date(med.nextDoseTimestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        nextDoseTimestamp: med.nextDoseTimestamp,
        isOverdue: now > med.nextDoseTimestamp && !med.isTaken,
        isTaken: med.isTaken,
        pillsRemaining: med.pillsRemaining,
        isLowSupply: med.pillsRemaining <= 7
    }));

    const overdue = schedule.filter(s => s.isOverdue);
    const upcoming = schedule.filter(s => !s.isOverdue && !s.isTaken);
    const taken = schedule.filter(s => s.isTaken);

    res.json({
        success: true,
        summary: {
            total: schedule.length,
            taken: taken.length,
            upcoming: upcoming.length,
            overdue: overdue.length,
            lowSupply: schedule.filter(s => s.isLowSupply).map(s => ({ id: s.id, name: medications.find(m => m.id === s.id)?.name, pillsRemaining: s.pillsRemaining }))
        },
        data: { overdue, upcoming, taken }
    });
});

// POST /api/medications - Add new medication
router.post('/', (req, res) => {
    const { patientId, name, dosage, scheduleDescription, scheduledTimes, purpose, prescribedBy } = req.body;

    if (!patientId || !name || !dosage) {
        return res.status(400).json({ success: false, message: 'patientId, name, and dosage are required' });
    }

    const newMed = {
        id: `med-${uuidv4()}`,
        patientId,
        name,
        genericName: req.body.genericName || name,
        category: req.body.category || 'General',
        dosage,
        scheduleDescription: scheduleDescription || 'As directed',
        frequency: req.body.frequency || 'daily',
        timesPerDay: scheduledTimes?.length || 1,
        scheduledTimes: scheduledTimes || ['08:00'],
        nextDoseTimestamp: req.body.nextDoseTimestamp || Date.now() + 8 * 60 * 60 * 1000,
        lastTakenTimestamp: null,
        isTaken: false,
        purpose: purpose || '',
        sideEffects: req.body.sideEffects || [],
        prescribedBy: prescribedBy || 'Unknown',
        prescribedDate: new Date().toISOString().split('T')[0],
        refillDate: req.body.refillDate || null,
        pillsRemaining: req.body.pillsRemaining || 30,
        pillsTotal: req.body.pillsTotal || 30
    };

    medications.push(newMed);
    res.status(201).json({ success: true, message: 'Medication added successfully', data: newMed });
});

// PATCH /api/medications/:id/taken - Mark medication as taken
router.patch('/:id/taken', (req, res) => {
    const medIdx = medications.findIndex(m => m.id === req.params.id);
    if (medIdx === -1) return res.status(404).json({ success: false, message: 'Medication not found' });

    medications[medIdx].isTaken = true;
    medications[medIdx].lastTakenTimestamp = Date.now();
    if (medications[medIdx].pillsRemaining > 0) medications[medIdx].pillsRemaining--;

    res.json({
        success: true,
        message: `${medications[medIdx].name} marked as taken`,
        data: medications[medIdx]
    });
});

// PATCH /api/medications/:id/reset - Reset taken status (for new day)
router.patch('/:id/reset', (req, res) => {
    const medIdx = medications.findIndex(m => m.id === req.params.id);
    if (medIdx === -1) return res.status(404).json({ success: false, message: 'Medication not found' });

    medications[medIdx].isTaken = false;
    res.json({ success: true, message: 'Medication reset for new dose', data: medications[medIdx] });
});

// DELETE /api/medications/:id - Remove medication
router.delete('/:id', (req, res) => {
    const medIdx = medications.findIndex(m => m.id === req.params.id);
    if (medIdx === -1) return res.status(404).json({ success: false, message: 'Medication not found' });

    const removed = medications.splice(medIdx, 1)[0];
    res.json({ success: true, message: `${removed.name} removed from medication list`, data: removed });
});

module.exports = router;
