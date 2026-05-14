const express = require('express');
const router = express.Router();
const { vitalsHistory, currentVitals } = require('../data/health-dataset');
const { v4: uuidv4 } = require('uuid');

// GET /api/vitals/current/:patientId - Current vitals snapshot
router.get('/current/:patientId', (req, res) => {
    const vitals = currentVitals[req.params.patientId];
    if (!vitals) return res.status(404).json({ success: false, message: 'Vitals not found for this patient' });
    res.json({ success: true, data: vitals });
});

// GET /api/vitals/history/:patientId - Vitals history with optional filters
router.get('/history/:patientId', (req, res) => {
    const { days = 30, limit = 100 } = req.query;
    const cutoff = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    let history = vitalsHistory
        .filter(v => v.patientId === req.params.patientId && new Date(v.timestamp) >= cutoff)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-parseInt(limit));

    if (history.length === 0) {
        return res.status(404).json({ success: false, message: 'No vitals history found' });
    }

    // Calculate statistics
    const heartRates = history.map(h => h.heartRate);
    const systolics = history.map(h => h.bloodPressure.systolic);
    const diastolics = history.map(h => h.bloodPressure.diastolic);

    const stats = {
        heartRate: {
            avg: Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length),
            min: Math.min(...heartRates),
            max: Math.max(...heartRates)
        },
        bloodPressure: {
            avgSystolic: Math.round(systolics.reduce((a, b) => a + b, 0) / systolics.length),
            avgDiastolic: Math.round(diastolics.reduce((a, b) => a + b, 0) / diastolics.length),
            maxSystolic: Math.max(...systolics),
            minDiastolic: Math.min(...diastolics)
        },
        totalReadings: history.length,
        dateRange: {
            from: history[0]?.timestamp,
            to: history[history.length - 1]?.timestamp
        }
    };

    res.json({ success: true, stats, data: history });
});

// POST /api/vitals - Record new vitals reading
router.post('/', (req, res) => {
    const { patientId, heartRate, pulse, bloodPressure, oxygenSaturation, temperature, weight, bloodGlucose } = req.body;

    if (!patientId || !heartRate || !bloodPressure) {
        return res.status(400).json({ success: false, message: 'patientId, heartRate, and bloodPressure are required' });
    }

    const newReading = {
        id: `vitals-${uuidv4()}`,
        patientId,
        timestamp: new Date().toISOString(),
        heartRate: parseInt(heartRate),
        pulse: parseInt(pulse || heartRate),
        bloodPressure: {
            systolic: parseInt(bloodPressure.systolic),
            diastolic: parseInt(bloodPressure.diastolic)
        },
        oxygenSaturation: oxygenSaturation ? parseInt(oxygenSaturation) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        weight: weight ? parseFloat(weight) : null,
        bloodGlucose: bloodGlucose ? parseInt(bloodGlucose) : null,
        recordedBy: req.body.recordedBy || 'Patient (Self)'
    };

    vitalsHistory.push(newReading);

    // Update current vitals snapshot
    currentVitals[patientId] = {
        ...newReading,
        recordedAt: newReading.timestamp
    };

    res.status(201).json({ success: true, message: 'Vitals recorded successfully', data: newReading });
});

// GET /api/vitals/trends/:patientId - Weekly trend analysis
router.get('/trends/:patientId', (req, res) => {
    const sevenDaysCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recent = vitalsHistory
        .filter(v => v.patientId === req.params.patientId && new Date(v.timestamp) >= sevenDaysCutoff)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (!recent.length) {
        return res.status(404).json({ success: false, message: 'No recent vitals found' });
    }

    // Aggregate by day
    const byDay = {};
    recent.forEach(v => {
        const day = v.timestamp.split('T')[0];
        if (!byDay[day]) byDay[day] = { readings: [], day };
        byDay[day].readings.push(v);
    });

    const trendData = Object.values(byDay).map(({ day, readings }) => ({
        day,
        avgHeartRate: Math.round(readings.reduce((s, r) => s + r.heartRate, 0) / readings.length),
        avgSystolic: Math.round(readings.reduce((s, r) => s + r.bloodPressure.systolic, 0) / readings.length),
        avgDiastolic: Math.round(readings.reduce((s, r) => s + r.bloodPressure.diastolic, 0) / readings.length),
        avgOxygen: readings[0].oxygenSaturation || null,
        avgGlucose: readings[0].bloodGlucose || null,
        readingsCount: readings.length
    }));

    res.json({ success: true, period: '7 days', data: trendData });
});

module.exports = router;
