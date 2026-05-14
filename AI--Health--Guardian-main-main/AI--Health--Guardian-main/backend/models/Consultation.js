const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['text', 'system', 'prescription'], default: 'text' }
});

const consultationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  duration: { type: Number, default: 30 }, // in minutes
  type: { type: String, enum: ['video', 'audio', 'chat'], default: 'video' },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  reason: { type: String, default: '' },
  symptoms: [String],
  diagnosis: { type: String, default: '' },
  prescription: { type: String, default: '' },
  notes: { type: String, default: '' },
  messages: [messageSchema],
  vitalsDuringConsultation: {
    heartRate: Number,
    bloodPressure: { systolic: Number, diastolic: Number },
    oxygenSaturation: Number,
    temperature: Number,
    bloodGlucose: Number
  },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String, default: '' },
  roomId: { type: String, default: '' },
  startedAt: Date,
  endedAt: Date,
}, { timestamps: true });

consultationSchema.index({ patient: 1, scheduledDate: -1 });
consultationSchema.index({ doctor: 1, scheduledDate: -1 });
consultationSchema.index({ status: 1 });

module.exports = mongoose.model('Consultation', consultationSchema);
