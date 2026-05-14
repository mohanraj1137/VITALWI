export interface Patient {
  name: string;
  avatarUrl: string;
}

export interface Relative {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Vitals {
  heartRate: number;
  pulse: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  scheduleDescription: string;
  nextDoseTimestamp: number;
  lastTakenTimestamp: number | null;
  isTaken: boolean;
}
