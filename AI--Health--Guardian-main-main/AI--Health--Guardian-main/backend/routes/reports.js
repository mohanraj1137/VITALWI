const express = require('express');
const router = express.Router();
const { labReports } = require('../data/health-dataset');
const { v4: uuidv4 } = require('uuid');

// GET /api/reports - All reports (optionally filtered by patientId)
router.get('/', (req, res) => {
    const { patientId, status, followUpRequired } = req.query;
    let result = [...labReports];

    if (patientId) result = result.filter(r => r.patientId === patientId);
    if (status) result = result.filter(r => r.status === status);
    if (followUpRequired === 'true') result = result.filter(r => r.followUpRequired === true);

    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ success: true, count: result.length, data: result });
});

// GET /api/reports/:id - Full report with results
router.get('/:id', (req, res) => {
    const report = labReports.find(r => r.id === req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
});

// GET /api/reports/patient/:patientId/summary - Summary with abnormal flags
router.get('/patient/:patientId/summary', (req, res) => {
    const reports = labReports.filter(r => r.patientId === req.params.patientId);
    if (!reports.length) return res.status(404).json({ success: false, message: 'No reports found' });

    const summary = reports.map(r => {
        const abnormalTests = r.results.filter(res => res.status !== 'normal');
        return {
            id: r.id,
            title: r.title,
            date: r.date,
            status: r.status,
            followUpRequired: r.followUpRequired,
            abnormalCount: abnormalTests.length,
            abnormalTests: abnormalTests.map(t => ({ test: t.test, value: t.value, unit: t.unit, status: t.status })),
            orderedBy: r.orderedBy
        };
    });

    res.json({
        success: true,
        count: reports.length,
        followUpPending: summary.filter(s => s.followUpRequired).length,
        data: summary
    });
});

// POST /api/reports - Add new lab report
router.post('/', (req, res) => {
    const { patientId, title, orderedBy, lab, results } = req.body;

    if (!patientId || !title || !orderedBy) {
        return res.status(400).json({ success: false, message: 'patientId, title, and orderedBy are required' });
    }

    const newReport = {
        id: `rpt-${uuidv4()}`,
        patientId,
        title,
        date: req.body.date || new Date().toISOString().split('T')[0],
        orderedBy,
        lab: lab || 'Unknown Lab',
        status: results ? 'completed' : 'pending',
        results: results || [],
        summary: req.body.summary || '',
        followUpRequired: req.body.followUpRequired || false,
        createdAt: new Date().toISOString()
    };

    labReports.push(newReport);
    res.status(201).json({ success: true, message: 'Lab report added', data: newReport });
});

// PATCH /api/reports/:id/results - Update report with lab results
router.patch('/:id/results', (req, res) => {
    const reportIdx = labReports.findIndex(r => r.id === req.params.id);
    if (reportIdx === -1) return res.status(404).json({ success: false, message: 'Report not found' });

    labReports[reportIdx].results = req.body.results || labReports[reportIdx].results;
    labReports[reportIdx].summary = req.body.summary || labReports[reportIdx].summary;
    labReports[reportIdx].status = 'completed';
    labReports[reportIdx].followUpRequired = req.body.followUpRequired ?? labReports[reportIdx].followUpRequired;
    labReports[reportIdx].updatedAt = new Date().toISOString();

    res.json({ success: true, message: 'Report updated with results', data: labReports[reportIdx] });
});

module.exports = router;
