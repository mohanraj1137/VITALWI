import type { Patient, Relative, Medication, Vitals } from './types';
import { PlaceHolderImages } from './placeholder-images';

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

export const mockPatient: Patient = {
  name: 'Eleanor Vance',
  avatarUrl: userAvatar?.imageUrl || 'https://picsum.photos/seed/101/100/100',
};

export const mockRelatives: Relative[] = [
  {
    name: 'Arthur Vance',
    relationship: 'Son',
    phone: '+1 (555) 123-4567',
    email: 'arthur.vance@example.com',
  },
  {
    name: 'Dr. Isabella Chen',
    relationship: 'Cardiologist',
    phone: '+1 (555) 987-6543',
    email: 'dr.chen@healthclinic.com',
  },
];

const now = new Date();

export const mockMedications: Medication[] = [
  {
    id: 'med1',
    name: 'Lisinopril',
    dosage: '10mg Tablet',
    scheduleDescription: 'Once daily in the morning',
    nextDoseTimestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0).getTime(),
    lastTakenTimestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 5, 0).getTime(),
    isTaken: false,
  },
  {
    id: 'med2',
    name: 'Metformin',
    dosage: '500mg Tablet',
    scheduleDescription: 'Twice daily with meals',
    nextDoseTimestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0).getTime(),
    lastTakenTimestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 2, 0).getTime(),
    isTaken: false,
  },
  {
    id: 'med3',
    name: 'Atorvastatin',
    dosage: '20mg Tablet',
    scheduleDescription: 'Once daily in the evening',
    nextDoseTimestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0).getTime(),
    lastTakenTimestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 3, 0).getTime(),
    isTaken: false,
  },
];

export const initialVitals: Vitals = {
  heartRate: 72,
  pulse: 72,
  bloodPressure: {
    systolic: 120,
    diastolic: 80,
  },
};
