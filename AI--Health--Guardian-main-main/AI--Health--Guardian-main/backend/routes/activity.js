const express = require('express');
const router = express.Router();
const { activityData } = require('../data/health-dataset');

// GET /api/activity/:patientId - Activity for a patient
router.get('/:patientId', (req, res) => {
    const { days = 7 } = req.query;
    const data = activityData[req.params.patientId];
    if (!data) return res.status(404).json({ success: false, message: 'No activity data found' });

    const recent = data.slice(-parseInt(days));

    // Compute weekly summary
    const totalSteps = recent.reduce((s, d) => s + d.steps, 0);
    const totalActiveMin = recent.reduce((s, d) => s + d.activeMinutes, 0);
    const avgSleep = (recent.reduce((s, d) => s + d.sleepHours, 0) / recent.length).toFixed(1);
    const goalSteps = 7000;
    const goalActiveMins = 30;

    const summary = {
        period: `${recent.length} days`,
        totalSteps,
        avgSteps: Math.round(totalSteps / recent.length),
        totalActiveMinutes: totalActiveMin,
        avgActiveMinutes: Math.round(totalActiveMin / recent.length),
        avgSleepHours: parseFloat(avgSleep),
        stepGoalProgress: Math.round((totalSteps / recent.length / goalSteps) * 100),
        activeMinGoalProgress: Math.round((totalActiveMin / recent.length / goalActiveMins) * 100),
        daysGoalMet: recent.filter(d => d.steps >= goalSteps).length,
        bestDay: recent.reduce((best, d) => d.steps > best.steps ? d : best, recent[0])
    };

    res.json({ success: true, summary, data: recent });
});

// POST /api/activity/:patientId - Log new activity
router.post('/:patientId', (req, res) => {
    const { steps, activeMinutes, caloriesBurned, sleepHours, sleepQuality } = req.body;
    const patientId = req.params.patientId;

    if (!activityData[patientId]) activityData[patientId] = [];

    const today = new Date().toISOString().split('T')[0];
    const existingIdx = activityData[patientId].findIndex(d => d.date === today);

    const newEntry = {
        date: today,
        steps: parseInt(steps || 0),
        activeMinutes: parseInt(activeMinutes || 0),
        caloriesBurned: parseInt(caloriesBurned || 0),
        distanceKm: parseFloat(req.body.distanceKm || 0),
        standHours: parseInt(req.body.standHours || 0),
        restingHeartRate: parseInt(req.body.restingHeartRate || 0),
        sleepHours: parseFloat(sleepHours || 0),
        sleepQuality: sleepQuality || 'unknown'
    };

    if (existingIdx >= 0) {
        activityData[patientId][existingIdx] = { ...activityData[patientId][existingIdx], ...newEntry };
        return res.json({ success: true, message: 'Activity updated for today', data: activityData[patientId][existingIdx] });
    }

    activityData[patientId].push(newEntry);
    res.status(201).json({ success: true, message: 'Activity logged', data: newEntry });
});

module.exports = router;
