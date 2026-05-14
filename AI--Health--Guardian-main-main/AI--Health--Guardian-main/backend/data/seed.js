/**
 * Database Seeder - Seeds MongoDB with initial doctors and sample patients
 * Run: node data/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const HealthData = require('../models/HealthData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/telemed-health';

const seedDoctors = [
  {
    name: 'Dr. Isabella Chen',
    email: 'dr.chen@telemedhealth.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 987-6543',
    specialty: 'Cardiology',
    hospital: 'Springfield Heart Center',
    yearsExperience: 18,
    rating: 4.9,
    consultationFee: 150,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Board-certified cardiologist with 18 years of experience. Specializing in preventive cardiology and heart failure management.',
    isOnline: true,
    gender: 'Female',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrChen'
  },
  {
    name: 'Dr. Marcus Webb',
    email: 'dr.webb@telemedhealth.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 456-7890',
    specialty: 'Endocrinology',
    hospital: 'Springfield General Hospital',
    yearsExperience: 14,
    rating: 4.7,
    consultationFee: 120,
    availableDays: ['Tuesday', 'Thursday'],
    bio: 'Experienced endocrinologist specializing in diabetes management, thyroid disorders, and metabolic health.',
    isOnline: true,
    gender: 'Male',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrWebb'
  },
  {
    name: 'Dr. Sarah Kim',
    email: 'dr.kim@telemedhealth.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 234-5678',
    specialty: 'Rheumatology',
    hospital: 'Miami Medical Center',
    yearsExperience: 12,
    rating: 4.8,
    consultationFee: 130,
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    bio: 'Compassionate rheumatologist focused on autoimmune diseases, arthritis management, and patient-centered care.',
    isOnline: false,
    gender: 'Female',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrKim'
  },
  {
    name: 'Dr. James Rodriguez',
    email: 'dr.rodriguez@telemedhealth.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 567-8901',
    specialty: 'Dermatology',
    hospital: 'City Skin Clinic',
    yearsExperience: 10,
    rating: 4.6,
    consultationFee: 100,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Dermatologist specializing in teledermatology consultations, skin cancer screening, and cosmetic dermatology.',
    isOnline: true,
    gender: 'Male',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrRodriguez'
  },
  {
    name: 'Dr. Amara Patel',
    email: 'dr.patel@telemedhealth.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 678-9012',
    specialty: 'Psychiatry',
    hospital: 'MindWell Institute',
    yearsExperience: 16,
    rating: 4.9,
    consultationFee: 175,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bio: 'Board-certified psychiatrist offering telepsychiatry services. Expert in anxiety, depression, and cognitive behavioral therapy.',
    isOnline: true,
    gender: 'Female',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrPatel'
  },
  {
    name: 'Dr. Robert Lee',
    email: 'dr.lee@telemedhealth.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1 (555) 789-0123',
    specialty: 'General Medicine',
    hospital: 'HealthFirst Clinic',
    yearsExperience: 20,
    rating: 4.8,
    consultationFee: 80,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bio: 'Family medicine physician with 20 years of experience. Passionate about primary care and preventive medicine through telemedicine.',
    isOnline: true,
    gender: 'Male',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrLee'
  }
];

const seedPatients = [
  {
    name: 'Eleanor Vance',
    email: 'eleanor@example.com',
    password: 'patient123',
    role: 'patient',
    phone: '+1 (555) 201-4321',
    gender: 'Female',
    dateOfBirth: new Date('1952-04-15'),
    bloodType: 'A+',
    address: '12 Maple Lane, Springfield, IL 62701',
    allergies: ['Penicillin', 'Shellfish'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Hypercholesterolemia'],
    emergencyContact: { name: 'Arthur Vance', relationship: 'Son', phone: '+1 (555) 123-4567' },
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Eleanor'
  },
  {
    name: 'Robert Harmon',
    email: 'robert@example.com',
    password: 'patient123',
    role: 'patient',
    phone: '+1 (555) 309-8812',
    gender: 'Male',
    dateOfBirth: new Date('1959-08-22'),
    bloodType: 'O-',
    address: '45 Oak Street, Denver, CO 80201',
    allergies: ['Aspirin', 'Latex'],
    chronicConditions: ['COPD', 'Atrial Fibrillation'],
    emergencyContact: { name: 'Susan Harmon', relationship: 'Spouse', phone: '+1 (555) 987-1234' },
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Robert'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await HealthData.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed doctors
    for (const doc of seedDoctors) {
      const user = new User(doc);
      await user.save();
      console.log(`  👨‍⚕️ Created doctor: ${doc.name}`);
    }

    // Seed patients
    for (const pat of seedPatients) {
      const user = new User(pat);
      await user.save();

      // Add some health data history
      const now = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const healthData = new HealthData({
          patient: user._id,
          heartRate: Math.round(70 + (Math.random() - 0.5) * 10),
          pulse: Math.round(70 + (Math.random() - 0.5) * 8),
          bloodPressure: {
            systolic: Math.round(120 + (Math.random() - 0.5) * 16),
            diastolic: Math.round(78 + (Math.random() - 0.5) * 10)
          },
          oxygenSaturation: Math.round(96 + (Math.random() - 0.5) * 4),
          temperature: parseFloat((98.0 + (Math.random() - 0.5) * 1.5).toFixed(1)),
          weight: parseFloat((150 + (Math.random() - 0.5) * 5).toFixed(1)),
          bloodGlucose: Math.round(105 + (Math.random() - 0.5) * 30),
          steps: Math.round(3000 + Math.random() * 5000),
          activeMinutes: Math.round(20 + Math.random() * 40),
          sleepHours: parseFloat((6 + Math.random() * 2).toFixed(1)),
          sleepQuality: ['poor', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 4)],
          source: 'system',
          recordedAt: date
        });
        await healthData.save();
      }
      console.log(`  👤 Created patient: ${pat.name} (with 30-day health history)`);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log(`   ${seedDoctors.length} doctors, ${seedPatients.length} patients created`);
    console.log('\n📋 Login credentials:');
    console.log('   Doctors:  dr.chen@telemedhealth.com / doctor123');
    console.log('   Patients: eleanor@example.com / patient123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
