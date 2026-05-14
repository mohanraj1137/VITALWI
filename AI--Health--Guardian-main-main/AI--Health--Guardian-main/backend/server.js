/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║      VitalWise - Telemedicine Platform API Server          ║
 * ║                      v2.0.0                               ║
 * ╚═══════════════════════════════════════════════════════════╝
 *
 * Base URL: http://localhost:5001
 * API Prefix: /api
 *
 * New Endpoints:
 *   /api/auth             → Authentication (register, login, profile)
 *   /api/consultations    → Telemedicine consultations
 *   /api/health-data      → Real-time health data (MongoDB)
 *   /api/doctors          → Doctor directory (MongoDB)
 *
 * Legacy Endpoints (in-memory dataset):
 *   /api/patients, /api/vitals, /api/medications, etc.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// ─── App Setup ───────────────────────────────
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
const API_VERSION = 'v2';

// ─── Socket.IO Setup ─────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:9002'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
app.set('io', io);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Join patient health data room
  socket.on('join-health-room', (patientId) => {
    socket.join(`patient-${patientId}`);
    console.log(`  📊 Socket ${socket.id} joined health room: patient-${patientId}`);
  });

  // Join consultation room
  socket.on('join-consultation', (roomId) => {
    socket.join(`consultation-${roomId}`);
    console.log(`  🏥 Socket ${socket.id} joined consultation: ${roomId}`);
  });

  // Handle consultation chat messages
  socket.on('consultation-message', (data) => {
    io.to(`consultation-${data.roomId}`).emit('new-message', data);
  });

  // Handle real-time vitals update
  socket.on('vitals-update', (data) => {
    io.to(`patient-${data.patientId}`).emit('health-data-update', data);
  });

  // Simulate real-time vitals stream
  socket.on('start-vitals-stream', (patientId) => {
    const interval = setInterval(() => {
      const vitals = {
        patientId,
        heartRate: Math.round(68 + Math.random() * 12),
        pulse: Math.round(68 + Math.random() * 12),
        bloodPressure: {
          systolic: Math.round(115 + Math.random() * 20),
          diastolic: Math.round(72 + Math.random() * 14)
        },
        oxygenSaturation: Math.round(95 + Math.random() * 4),
        temperature: parseFloat((97.5 + Math.random() * 2).toFixed(1)),
        bloodGlucose: Math.round(90 + Math.random() * 40),
        timestamp: new Date().toISOString()
      };
      socket.emit('health-data-update', vitals);
    }, 3000);

    socket.on('stop-vitals-stream', () => clearInterval(interval));
    socket.on('disconnect', () => clearInterval(interval));
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─── MongoDB Connection ──────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/telemed-health';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.warn('   App will run with in-memory dataset only.');
    console.warn('   To use MongoDB features, start MongoDB and run: node data/seed.js');
  });

// ─── Security & Middleware ────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:9002'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-patient-id'],
    credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Rate Limiting ────────────────────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api', limiter);

// ─── NEW Routes (MongoDB) ────────────────────
const authRouter = require('./routes/auth');
const consultationsRouter = require('./routes/consultations');
const healthDataRouter = require('./routes/healthData');

app.use('/api/auth', authRouter);
app.use('/api/consultations', consultationsRouter);
app.use('/api/health-data', healthDataRouter);

// ─── Doctor directory route (MongoDB) ─────────
const User = require('./models/User');
const { auth } = require('./middleware/auth');

app.get('/api/doctors-db', async (req, res) => {
  try {
    const { specialty, search } = req.query;
    const query = { role: 'doctor', isActive: true };
    if (specialty && specialty !== 'all') query.specialty = specialty;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { hospital: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await User.find(query)
      .select('-password -allergies -chronicConditions -insuranceProvider -insuranceId -emergencyContact')
      .sort({ rating: -1 });

    res.json({ success: true, data: doctors, count: doctors.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch doctors.' });
  }
});

// ─── Legacy Routes (in-memory) ───────────────
const patientsRouter = require('./routes/patients');
const vitalsRouter = require('./routes/vitals');
const medicationsRouter = require('./routes/medications');
const appointmentsRouter = require('./routes/appointments');
const reportsRouter = require('./routes/reports');
const relativesRouter = require('./routes/relatives');
const activityRouter = require('./routes/activity');
const alertsRouter = require('./routes/alerts');
const doctorsRouter = require('./routes/doctors');

app.use('/api/patients', patientsRouter);
app.use('/api/vitals', vitalsRouter);
app.use('/api/medications', medicationsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/relatives', relativesRouter);
app.use('/api/activity', activityRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/doctors', doctorsRouter);

// ─── Root / Health Check ─────────────────────
app.get('/', (req, res) => {
    res.json({
        name: 'VitalWise API',
        version: API_VERSION,
        status: 'running',
        timestamp: new Date().toISOString(),
        docs: '/api/health',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        features: [
          'Authentication & User Profiles',
          'Telemedicine Consultations',
          'Real-time Health Data (WebSocket)',
          'Doctor Directory',
          'Video/Audio/Chat Consultations'
        ],
        endpoints: {
          auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me', 'PUT /api/auth/me'],
          consultations: ['GET /api/consultations', 'POST /api/consultations', 'PATCH /api/consultations/:id/start'],
          healthData: ['POST /api/health-data', 'GET /api/health-data/latest', 'GET /api/health-data/history'],
          doctors: ['GET /api/doctors-db'],
          legacy: ['GET /api/patients', 'GET /api/vitals', 'GET /api/medications', 'GET /api/appointments']
        }
    });
});

app.get('/api/health', (req, res) => {
    const { patients, medications, vitalsHistory, appointments, labReports, healthAlerts } = require('./data/health-dataset');
    res.json({
        status: 'healthy',
        uptime: process.uptime().toFixed(2) + 's',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        dataset: {
            patients: patients.length,
            medications: medications.length,
            vitalsRecords: vitalsHistory.length,
            appointments: appointments.length,
            labReports: labReports.length,
            alerts: healthAlerts.length
        },
        environment: process.env.NODE_ENV || 'development'
    });
});

// ─── 404 Handler ─────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        hint: 'Visit GET / to see all available endpoints'
    });
});

// ─── Global Error Handler ─────────────────────
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ─── Start Server (using http server for Socket.IO) ──
server.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║      VitalWise API Server v2.0            ║');
    console.log('╚═══════════════════════════════════════════╝');
    console.log(`\n🚀 Server running at: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket enabled for real-time health data`);
    console.log(`📋 API docs at:       http://localhost:${PORT}/`);
    console.log(`💊 Health check:      http://localhost:${PORT}/api/health`);
    console.log(`\n📊 Features: Auth | Consultations | Real-time Vitals | Doctor Directory`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = { app, server, io };
