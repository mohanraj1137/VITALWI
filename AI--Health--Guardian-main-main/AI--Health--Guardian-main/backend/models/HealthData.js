const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: { type: Number },
  pulse: { type: Number },
  bloodPressure: {
    systolic: { type: Number },
    diastolic: { type: Number }
  },
  oxygenSaturation: { type: Number },
  temperature: { type: Number },
  weight: { type: Number },
  bloodGlucose: { type: Number },
  steps: { type: Number, default: 0 },
  activeMinutes: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  sleepQuality: { type: String, enum: ['poor', 'fair', 'good', 'excellent', ''], default: '' },
  source: { type: String, enum: ['manual', 'device', 'wearable', 'system'], default: 'manual' },
  recordedBy: { type: String, default: 'Patient (Self)' },
  recordedAt: { type: Date, default: Date.now },
}, { timestamps: true });

healthDataSchema.index({ patient: 1, recordedAt: -1 });
healthDataSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model('HealthData', healthDataSchema);
