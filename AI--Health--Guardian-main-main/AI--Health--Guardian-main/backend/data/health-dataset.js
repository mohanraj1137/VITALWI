/**
 * AI Health Guardian - Sample Health Dataset
 * Comprehensive dataset covering all health-monitoring aspects of the application
 */

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// ─────────────────────────────────────────────
// PATIENTS
// ─────────────────────────────────────────────
const patients = [
  {
    id: "pat-001",
    name: "Eleanor Vance",
    age: 72,
    gender: "Female",
    dob: "1952-04-15",
    bloodType: "A+",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Eleanor",
    email: "eleanor.vance@example.com",
    phone: "+1 (555) 201-4321",
    address: "12 Maple Lane, Springfield, IL 62701",
    allergies: ["Penicillin", "Shellfish"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes", "Hypercholesterolemia"],
    primaryPhysician: "Dr. Isabella Chen",
    insuranceProvider: "BlueCross Shield",
    insuranceId: "BC-7823491",
    emergencyContact: {
      name: "Arthur Vance",
      relationship: "Son",
      phone: "+1 (555) 123-4567"
    },
    createdAt: "2022-01-10T10:00:00Z",
    isActive: true
  },
  {
    id: "pat-002",
    name: "Robert Harmon",
    age: 65,
    gender: "Male",
    dob: "1959-08-22",
    bloodType: "O-",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Robert",
    email: "robert.harmon@example.com",
    phone: "+1 (555) 309-8812",
    address: "45 Oak Street, Denver, CO 80201",
    allergies: ["Aspirin", "Latex"],
    chronicConditions: ["COPD", "Atrial Fibrillation"],
    primaryPhysician: "Dr. Marcus Webb",
    insuranceProvider: "Aetna Health",
    insuranceId: "AE-4451239",
    emergencyContact: {
      name: "Susan Harmon",
      relationship: "Spouse",
      phone: "+1 (555) 987-1234"
    },
    createdAt: "2022-06-14T08:30:00Z",
    isActive: true
  },
  {
    id: "pat-003",
    name: "Maria Santos",
    age: 58,
    gender: "Female",
    dob: "1966-11-03",
    bloodType: "B+",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Maria",
    email: "maria.santos@example.com",
    phone: "+1 (555) 412-7630",
    address: "88 Cedar Avenue, Miami, FL 33101",
    allergies: ["Sulfa drugs"],
    chronicConditions: ["Rheumatoid Arthritis", "Osteoporosis"],
    primaryPhysician: "Dr. Sarah Kim",
    insuranceProvider: "United Health",
    insuranceId: "UH-9932156",
    emergencyContact: {
      name: "Carlos Santos",
      relationship: "Husband",
      phone: "+1 (555) 654-9876"
    },
    createdAt: "2023-02-20T14:00:00Z",
    isActive: true
  }
];

// ─────────────────────────────────────────────
// RELATIVES / CARE TEAM
// ─────────────────────────────────────────────
const relatives = [
  {
    id: "rel-001",
    patientId: "pat-001",
    name: "Arthur Vance",
    relationship: "Son",
    phone: "+1 (555) 123-4567",
    email: "arthur.vance@example.com",
    notificationsEnabled: true,
    lastContacted: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rel-002",
    patientId: "pat-001",
    name: "Dr. Isabella Chen",
    relationship: "Cardiologist",
    phone: "+1 (555) 987-6543",
    email: "dr.chen@healthclinic.com",
    notificationsEnabled: true,
    lastContacted: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rel-003",
    patientId: "pat-001",
    name: "Linda Park",
    relationship: "Home Nurse",
    phone: "+1 (555) 321-8899",
    email: "linda.park@careservices.com",
    notificationsEnabled: true,
    lastContacted: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// ─────────────────────────────────────────────
// MEDICATIONS
// ─────────────────────────────────────────────
const medications = [
  {
    id: "med-001",
    patientId: "pat-001",
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "ACE Inhibitor",
    dosage: "10mg Tablet",
    scheduleDescription: "Once daily in the morning",
    frequency: "daily",
    timesPerDay: 1,
    scheduledTimes: ["08:00"],
    nextDoseTimestamp: new Date(today.getTime() + 8 * 60 * 60 * 1000).getTime(),
    lastTakenTimestamp: new Date(today.getTime() - 16 * 60 * 60 * 1000).getTime(),
    isTaken: false,
    purpose: "Blood pressure control",
    sideEffects: ["Dry cough", "Dizziness", "Headache"],
    prescribedBy: "Dr. Isabella Chen",
    prescribedDate: "2022-01-15",
    refillDate: "2026-04-01",
    pillsRemaining: 14,
    pillsTotal: 30
  },
  {
    id: "med-002",
    patientId: "pat-001",
    name: "Metformin",
    genericName: "Metformin HCl",
    category: "Biguanide (Antidiabetic)",
    dosage: "500mg Tablet",
    scheduleDescription: "Twice daily with meals",
    frequency: "twice-daily",
    timesPerDay: 2,
    scheduledTimes: ["08:00", "18:00"],
    nextDoseTimestamp: new Date(today.getTime() + 18 * 60 * 60 * 1000).getTime(),
    lastTakenTimestamp: new Date(today.getTime() + 8 * 60 * 60 * 1000).getTime(),
    isTaken: false,
    purpose: "Blood glucose control",
    sideEffects: ["Nausea", "Stomach upset", "Diarrhea"],
    prescribedBy: "Dr. Marcus Webb",
    prescribedDate: "2022-03-10",
    refillDate: "2026-03-20",
    pillsRemaining: 8,
    pillsTotal: 60
  },
  {
    id: "med-003",
    patientId: "pat-001",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    category: "Statin",
    dosage: "20mg Tablet",
    scheduleDescription: "Once daily in the evening",
    frequency: "daily",
    timesPerDay: 1,
    scheduledTimes: ["20:00"],
    nextDoseTimestamp: new Date(today.getTime() + 20 * 60 * 60 * 1000).getTime(),
    lastTakenTimestamp: new Date(today.getTime() - 4 * 60 * 60 * 1000).getTime(),
    isTaken: false,
    purpose: "Cholesterol management",
    sideEffects: ["Muscle pain", "Liver enzyme elevation"],
    prescribedBy: "Dr. Isabella Chen",
    prescribedDate: "2022-01-15",
    refillDate: "2026-04-15",
    pillsRemaining: 22,
    pillsTotal: 30
  },
  {
    id: "med-004",
    patientId: "pat-001",
    name: "Metoprolol",
    genericName: "Metoprolol Succinate",
    category: "Beta-Blocker",
    dosage: "25mg Extended-Release Tablet",
    scheduleDescription: "Once daily with breakfast",
    frequency: "daily",
    timesPerDay: 1,
    scheduledTimes: ["08:30"],
    nextDoseTimestamp: new Date(today.getTime() + 8.5 * 60 * 60 * 1000).getTime(),
    lastTakenTimestamp: new Date(today.getTime() - 15.5 * 60 * 60 * 1000).getTime(),
    isTaken: false,
    purpose: "Heart rate regulation",
    sideEffects: ["Fatigue", "Cold hands", "Bradycardia"],
    prescribedBy: "Dr. Isabella Chen",
    prescribedDate: "2023-06-01",
    refillDate: "2026-03-28",
    pillsRemaining: 5,
    pillsTotal: 30
  },
  {
    id: "med-005",
    patientId: "pat-001",
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    category: "Antiplatelet",
    dosage: "81mg Tablet",
    scheduleDescription: "Once daily in the morning",
    frequency: "daily",
    timesPerDay: 1,
    scheduledTimes: ["08:00"],
    nextDoseTimestamp: new Date(today.getTime() + 8 * 60 * 60 * 1000).getTime(),
    lastTakenTimestamp: new Date(today.getTime() - 16 * 60 * 60 * 1000).getTime(),
    isTaken: false,
    purpose: "Blood clot prevention",
    sideEffects: ["Stomach irritation", "Increased bleeding risk"],
    prescribedBy: "Dr. Isabella Chen",
    prescribedDate: "2022-01-15",
    refillDate: "2026-05-01",
    pillsRemaining: 28,
    pillsTotal: 30
  }
];

// ─────────────────────────────────────────────
// VITALS HISTORY (30 days)
// ─────────────────────────────────────────────
const generateVitalsHistory = (patientId, days = 30) => {
  const history = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const baseHR = patientId === "pat-001" ? 72 : patientId === "pat-002" ? 68 : 74;
    const baseSBP = patientId === "pat-001" ? 128 : patientId === "pat-002" ? 135 : 118;
    const baseDBP = patientId === "pat-001" ? 82 : patientId === "pat-002" ? 88 : 76;
    history.push({
      id: `vitals-${patientId}-${i}`,
      patientId,
      timestamp: date.toISOString(),
      heartRate: Math.round(baseHR + (Math.random() - 0.5) * 10),
      pulse: Math.round(baseHR + (Math.random() - 0.5) * 8),
      bloodPressure: {
        systolic: Math.round(baseSBP + (Math.random() - 0.5) * 16),
        diastolic: Math.round(baseDBP + (Math.random() - 0.5) * 10)
      },
      oxygenSaturation: Math.round(96 + (Math.random() - 0.5) * 4),
      temperature: parseFloat((98.0 + (Math.random() - 0.5) * 1.5).toFixed(1)),
      weight: parseFloat((patientId === "pat-001" ? 145 + (Math.random() - 0.5) * 3 : 180 + (Math.random() - 0.5) * 4).toFixed(1)),
      bloodGlucose: Math.round(110 + (Math.random() - 0.5) * 40),
      recordedBy: i === 0 ? "Patient (Self)" : i % 7 === 0 ? "Home Nurse" : "Patient (Self)"
    });
  }
  return history;
};

const vitalsHistory = [
  ...generateVitalsHistory("pat-001", 30),
  ...generateVitalsHistory("pat-002", 30),
  ...generateVitalsHistory("pat-003", 30)
];

// Current vitals snapshot
const currentVitals = {
  "pat-001": {
    patientId: "pat-001",
    heartRate: 74,
    pulse: 74,
    bloodPressure: { systolic: 126, diastolic: 82 },
    oxygenSaturation: 97,
    temperature: 98.4,
    weight: 145.2,
    bloodGlucose: 118,
    recordedAt: now.toISOString()
  },
  "pat-002": {
    patientId: "pat-002",
    heartRate: 68,
    pulse: 70,
    bloodPressure: { systolic: 138, diastolic: 90 },
    oxygenSaturation: 94,
    temperature: 98.1,
    weight: 182.5,
    bloodGlucose: 105,
    recordedAt: now.toISOString()
  },
  "pat-003": {
    patientId: "pat-003",
    heartRate: 76,
    pulse: 76,
    bloodPressure: { systolic: 115, diastolic: 74 },
    oxygenSaturation: 98,
    temperature: 98.7,
    weight: 138.0,
    bloodGlucose: 98,
    recordedAt: now.toISOString()
  }
};

// ─────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────
const appointments = [
  {
    id: "apt-001",
    patientId: "pat-001",
    doctorName: "Dr. Isabella Chen",
    specialty: "Cardiology",
    date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    time: "10:30",
    location: "Springfield Heart Center, Room 204",
    type: "Follow-up",
    status: "scheduled",
    notes: "Quarterly blood pressure review and ECG monitoring",
    duration: 45,
    telehealth: false
  },
  {
    id: "apt-002",
    patientId: "pat-001",
    doctorName: "Dr. Marcus Webb",
    specialty: "Endocrinology",
    date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    time: "14:00",
    location: "Telehealth",
    type: "Check-up",
    status: "scheduled",
    notes: "HbA1c results review, diabetes management plan",
    duration: 30,
    telehealth: true
  },
  {
    id: "apt-003",
    patientId: "pat-001",
    doctorName: "Dr. Isabella Chen",
    specialty: "Cardiology",
    date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    time: "09:00",
    location: "Springfield Heart Center, Room 204",
    type: "Follow-up",
    status: "completed",
    notes: "Blood pressure well-controlled. Continue current medications. Next check in 3 months.",
    duration: 45,
    telehealth: false
  },
  {
    id: "apt-004",
    patientId: "pat-001",
    doctorName: "Dr. Paul Meyer",
    specialty: "Ophthalmology",
    date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    time: "11:00",
    location: "Vision Care Clinic, Floor 2",
    type: "Annual Screening",
    status: "scheduled",
    notes: "Annual diabetic eye screening",
    duration: 60,
    telehealth: false
  }
];

// ─────────────────────────────────────────────
// LAB REPORTS
// ─────────────────────────────────────────────
const labReports = [
  {
    id: "rpt-001",
    patientId: "pat-001",
    title: "Complete Blood Count (CBC)",
    date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    orderedBy: "Dr. Isabella Chen",
    lab: "Springfield Diagnostics Lab",
    status: "completed",
    results: [
      { test: "Hemoglobin", value: 12.8, unit: "g/dL", normalRange: "12.0-16.0", status: "normal" },
      { test: "WBC Count", value: 6.2, unit: "10³/μL", normalRange: "4.5-11.0", status: "normal" },
      { test: "Platelet Count", value: 245, unit: "10³/μL", normalRange: "150-400", status: "normal" },
      { test: "Hematocrit", value: 38.2, unit: "%", normalRange: "36-48", status: "normal" },
      { test: "MCV", value: 88, unit: "fL", normalRange: "80-100", status: "normal" }
    ],
    summary: "All CBC values within normal range. No significant findings.",
    followUpRequired: false
  },
  {
    id: "rpt-002",
    patientId: "pat-001",
    title: "HbA1c & Lipid Panel",
    date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    orderedBy: "Dr. Marcus Webb",
    lab: "Springfield Diagnostics Lab",
    status: "completed",
    results: [
      { test: "HbA1c", value: 7.2, unit: "%", normalRange: "<7.0", status: "above-normal" },
      { test: "Total Cholesterol", value: 195, unit: "mg/dL", normalRange: "<200", status: "normal" },
      { test: "LDL Cholesterol", value: 112, unit: "mg/dL", normalRange: "<100", status: "above-normal" },
      { test: "HDL Cholesterol", value: 52, unit: "mg/dL", normalRange: ">50", status: "normal" },
      { test: "Triglycerides", value: 148, unit: "mg/dL", normalRange: "<150", status: "normal" },
      { test: "Fasting Glucose", value: 126, unit: "mg/dL", normalRange: "70-99", status: "high" }
    ],
    summary: "HbA1c slightly elevated at 7.2%. LDL moderately elevated. Fasting glucose high. Recommend dietary changes and medication review.",
    followUpRequired: true
  },
  {
    id: "rpt-003",
    patientId: "pat-001",
    title: "Kidney Function Panel",
    date: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    orderedBy: "Dr. Isabella Chen",
    lab: "Springfield Diagnostics Lab",
    status: "completed",
    results: [
      { test: "Creatinine", value: 0.9, unit: "mg/dL", normalRange: "0.6-1.2", status: "normal" },
      { test: "BUN", value: 18, unit: "mg/dL", normalRange: "7-20", status: "normal" },
      { test: "eGFR", value: 72, unit: "mL/min/1.73m²", normalRange: ">60", status: "normal" },
      { test: "Potassium", value: 4.0, unit: "mEq/L", normalRange: "3.5-5.1", status: "normal" },
      { test: "Sodium", value: 139, unit: "mEq/L", normalRange: "136-145", status: "normal" }
    ],
    summary: "Kidney function within normal limits. eGFR stable at 72. Continue Lisinopril monitoring.",
    followUpRequired: false
  },
  {
    id: "rpt-004",
    patientId: "pat-001",
    title: "Thyroid Function Tests",
    date: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    orderedBy: "Dr. Marcus Webb",
    lab: "MedPath Labs",
    status: "completed",
    results: [
      { test: "TSH", value: 2.4, unit: "mIU/L", normalRange: "0.4-4.0", status: "normal" },
      { test: "Free T4", value: 1.1, unit: "ng/dL", normalRange: "0.8-1.8", status: "normal" },
      { test: "Free T3", value: 3.1, unit: "pg/mL", normalRange: "2.3-4.2", status: "normal" }
    ],
    summary: "Thyroid function normal. No thyroid disorder detected.",
    followUpRequired: false
  }
];

// ─────────────────────────────────────────────
// MOVEMENT / ACTIVITY TRACKING
// ─────────────────────────────────────────────
const generateActivityData = (days = 7) => {
  const activity = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    activity.push({
      date: date.toISOString().split("T")[0],
      steps: Math.round(3000 + Math.random() * 5000),
      activeMinutes: Math.round(20 + Math.random() * 40),
      caloriesBurned: Math.round(200 + Math.random() * 300),
      distanceKm: parseFloat((2 + Math.random() * 4).toFixed(2)),
      standHours: Math.round(6 + Math.random() * 6),
      restingHeartRate: Math.round(64 + Math.random() * 10),
      sleepHours: parseFloat((6 + Math.random() * 2).toFixed(1)),
      sleepQuality: ["poor", "fair", "good", "excellent"][Math.floor(Math.random() * 4)]
    });
  }
  return activity;
};

const activityData = {
  "pat-001": generateActivityData(30),
  "pat-002": generateActivityData(30),
  "pat-003": generateActivityData(30)
};

// ─────────────────────────────────────────────
// HEALTH ALERTS
// ─────────────────────────────────────────────
const healthAlerts = [
  {
    id: "alert-001",
    patientId: "pat-001",
    type: "medication",
    severity: "warning",
    title: "Low Medication Supply",
    message: "Metoprolol supply is running low (5 pills remaining). Refill needed before March 28.",
    timestamp: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionRequired: true,
    actionLabel: "Schedule Refill"
  },
  {
    id: "alert-002",
    patientId: "pat-001",
    type: "vitals",
    severity: "warning",
    title: "Blood Pressure Elevated",
    message: "Your systolic blood pressure reading of 142 mmHg is above the recommended range. Please monitor and contact your doctor if it remains elevated.",
    timestamp: new Date(today.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionRequired: true,
    actionLabel: "View Vitals"
  },
  {
    id: "alert-003",
    patientId: "pat-001",
    type: "lab",
    severity: "info",
    title: "Lab Results Available",
    message: "Your HbA1c & Lipid Panel results are ready for review.",
    timestamp: new Date(today.getTime() - 30 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
    actionLabel: "View Report"
  },
  {
    id: "alert-004",
    patientId: "pat-001",
    type: "appointment",
    severity: "info",
    title: "Upcoming Appointment",
    message: "You have a Cardiology appointment with Dr. Isabella Chen in 3 days.",
    timestamp: new Date(today.getTime() - 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionRequired: false,
    actionLabel: "View Appointment"
  },
  {
    id: "alert-005",
    patientId: "pat-001",
    type: "vitals",
    severity: "critical",
    title: "Low Blood Oxygen",
    message: "Oxygen saturation dropped to 93% at 02:30 AM. This is below the safe threshold. Immediate attention recommended.",
    timestamp: new Date(today.getTime() - 18 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionRequired: true,
    actionLabel: "Contact Doctor"
  }
];

// ─────────────────────────────────────────────
// ANALYTICS / DASHBOARD SUMMARY
// ─────────────────────────────────────────────
const dashboardAnalytics = {
  "pat-001": {
    patientId: "pat-001",
    medicationAdherence: {
      percentage: 87,
      streak: 6,
      missedThisWeek: 2,
      takenThisWeek: 13,
      totalScheduledThisWeek: 15
    },
    vitalsStatus: {
      overall: "fair",
      heartRate: "normal",
      bloodPressure: "elevated",
      oxygenSaturation: "normal",
      bloodGlucose: "borderline"
    },
    weeklyStepAverage: 5240,
    weeklyActiveMinutes: 142,
    upcomingAppointments: 2,
    unreadAlerts: 3,
    healthScore: 68,
    healthScoreTrend: "stable",
    lastUpdated: now.toISOString()
  }
};

// ─────────────────────────────────────────────
// DOCTORS
// ─────────────────────────────────────────────
const doctors = [
  {
    id: "doc-001",
    name: "Dr. Isabella Chen",
    specialty: "Cardiology",
    phone: "+1 (555) 987-6543",
    email: "dr.chen@healthclinic.com",
    hospital: "Springfield Heart Center",
    rating: 4.9,
    yearsExperience: 18,
    availableDays: ["Monday", "Wednesday", "Friday"],
    nextAvailable: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  },
  {
    id: "doc-002",
    name: "Dr. Marcus Webb",
    specialty: "Endocrinology",
    phone: "+1 (555) 456-7890",
    email: "dr.webb@medical.com",
    hospital: "Springfield General Hospital",
    rating: 4.7,
    yearsExperience: 14,
    availableDays: ["Tuesday", "Thursday"],
    nextAvailable: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  },
  {
    id: "doc-003",
    name: "Dr. Sarah Kim",
    specialty: "Rheumatology",
    phone: "+1 (555) 234-5678",
    email: "dr.kim@rheumacare.com",
    hospital: "Miami Medical Center",
    rating: 4.8,
    yearsExperience: 12,
    availableDays: ["Monday", "Tuesday", "Thursday"],
    nextAvailable: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  }
];

module.exports = {
  patients,
  relatives,
  medications,
  vitalsHistory,
  currentVitals,
  appointments,
  labReports,
  activityData,
  healthAlerts,
  dashboardAnalytics,
  doctors
};
