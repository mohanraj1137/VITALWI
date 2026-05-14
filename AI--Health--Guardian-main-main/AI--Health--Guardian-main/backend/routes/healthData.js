const express = require('express');
const HealthData = require('../models/HealthData');
const { auth } = require('../middleware/auth');
const router = express.Router();

// POST /api/health-data - Record new health data
router.post('/', auth, async (req, res) => {
  try {
    const data = new HealthData({
      patient: req.user._id,
      ...req.body,
      recordedAt: req.body.recordedAt || new Date()
    });
    await data.save();

    // Emit real-time update via socket.io if available
    const io = req.app.get('io');
    if (io) {
      io.to(`patient-${req.user._id}`).emit('health-data-update', data);
    }

    res.status(201).json({ success: true, data, message: 'Health data recorded.' });
  } catch (error) {
    console.error('Record health data error:', error);
    res.status(500).json({ success: false, message: 'Failed to record health data.' });
  }
});

// GET /api/health-data/latest - Get latest health data for current user
router.get('/latest', auth, async (req, res) => {
  try {
    const patientId = req.query.patientId || req.user._id;
    const data = await HealthData.findOne({ patient: patientId })
      .sort({ recordedAt: -1 });

    if (!data) {
      // Return simulated data if no real data exists
      return res.json({
        success: true,
        data: generateSimulatedVitals(patientId),
        simulated: true
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch health data.' });
  }
});

// GET /api/health-data/history - Get health data history
router.get('/history', auth, async (req, res) => {
  try {
    const patientId = req.query.patientId || req.user._id;
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    let data = await HealthData.find({
      patient: patientId,
      recordedAt: { $gte: since }
    }).sort({ recordedAt: -1 });

    // If no real data, generate simulated history
    if (data.length === 0) {
      data = generateSimulatedHistory(patientId, days);
    }

    // Calculate stats
    const stats = calculateStats(data);

    res.json({ success: true, data, stats, count: data.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch health history.' });
  }
});

// GET /api/health-data/realtime/:patientId - Get real-time stream info
router.get('/realtime/:patientId', auth, async (req, res) => {
  try {
    const latest = await HealthData.findOne({ patient: req.params.patientId })
      .sort({ recordedAt: -1 });

    res.json({
      success: true,
      data: latest || generateSimulatedVitals(req.params.patientId),
      socketRoom: `patient-${req.params.patientId}`,
      message: 'Subscribe to socket room for real-time updates'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch real-time data.' });
  }
});

// --- Helper functions ---
function generateSimulatedVitals(patientId) {
  return {
    patient: patientId,
    heartRate: Math.round(68 + Math.random() * 12),
    pulse: Math.round(68 + Math.random() * 12),
    bloodPressure: {
      systolic: Math.round(115 + Math.random() * 20),
      diastolic: Math.round(72 + Math.random() * 14)
    },
    oxygenSaturation: Math.round(95 + Math.random() * 4),
    temperature: parseFloat((97.5 + Math.random() * 2).toFixed(1)),
    weight: parseFloat((145 + Math.random() * 10).toFixed(1)),
    bloodGlucose: Math.round(90 + Math.random() * 40),
    steps: Math.round(3000 + Math.random() * 5000),
    activeMinutes: Math.round(20 + Math.random() * 40),
    source: 'system',
    recordedAt: new Date().toISOString()
  };
}

function generateSimulatedHistory(patientId, days) {
  const history = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    history.push({
      patient: patientId,
      heartRate: Math.round(70 + (Math.random() - 0.5) * 10),
      pulse: Math.round(70 + (Math.random() - 0.5) * 8),
      bloodPressure: {
        systolic: Math.round(120 + (Math.random() - 0.5) * 16),
        diastolic: Math.round(78 + (Math.random() - 0.5) * 10)
      },
      oxygenSaturation: Math.round(96 + (Math.random() - 0.5) * 4),
      temperature: parseFloat((98.0 + (Math.random() - 0.5) * 1.5).toFixed(1)),
      bloodGlucose: Math.round(110 + (Math.random() - 0.5) * 40),
      steps: Math.round(3000 + Math.random() * 5000),
      activeMinutes: Math.round(20 + Math.random() * 40),
      sleepHours: parseFloat((6 + Math.random() * 2).toFixed(1)),
      source: 'system',
      recordedAt: date.toISOString()
    });
  }
  return history;
}

function calculateStats(data) {
  if (!data.length) return null;
  const hrs = data.filter(d => d.heartRate).map(d => d.heartRate);
  const sys = data.filter(d => d.bloodPressure?.systolic).map(d => d.bloodPressure.systolic);
  const dia = data.filter(d => d.bloodPressure?.diastolic).map(d => d.bloodPressure.diastolic);
  const o2 = data.filter(d => d.oxygenSaturation).map(d => d.oxygenSaturation);

  const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const min = arr => arr.length ? Math.min(...arr) : 0;
  const max = arr => arr.length ? Math.max(...arr) : 0;

  return {
    heartRate: { avg: avg(hrs), min: min(hrs), max: max(hrs) },
    systolic: { avg: avg(sys), min: min(sys), max: max(sys) },
    diastolic: { avg: avg(dia), min: min(dia), max: max(dia) },
    oxygenSaturation: { avg: avg(o2), min: min(o2), max: max(o2) },
    totalRecords: data.length
  };
}

module.exports = router;
