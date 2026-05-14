/**
 * AI Health Guardian - Backend API Client
 * Connects the Next.js frontend to the Express backend
 *
 * Usage:
 *   import { api } from '@/lib/api-client';
 *   const patients = await api.patients.getAll();
 *   const vitals = await api.vitals.getCurrent('pat-001');
 */

import process from "process";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

// ─── Generic Fetch Helper ─────────────────────
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorBody.message || `Request failed: ${response.status}`);
    }

    return response.json();
}

// ─── Type Definitions ─────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    dob: string;
    bloodType: string;
    avatarUrl: string;
    email: string;
    phone: string;
    address: string;
    allergies: string[];
    chronicConditions: string[];
    primaryPhysician: string;
    emergencyContact: { name: string; relationship: string; phone: string };
    isActive: boolean;
}

export interface VitalsSnapshot {
    patientId: string;
    heartRate: number;
    pulse: number;
    bloodPressure: { systolic: number; diastolic: number };
    oxygenSaturation: number;
    temperature: number;
    weight: number;
    bloodGlucose: number;
    recordedAt: string;
}

export interface VitalsRecord extends VitalsSnapshot {
    id: string;
    timestamp: string;
    recordedBy: string;
}

export interface Medication {
    id: string;
    patientId: string;
    name: string;
    dosage: string;
    scheduleDescription: string;
    scheduledTimes: string[];
    nextDoseTimestamp: number;
    lastTakenTimestamp: number | null;
    isTaken: boolean;
    purpose: string;
    pillsRemaining: number;
    prescribedBy: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    location: string;
    type: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes: string;
    telehealth: boolean;
}

export interface LabReport {
    id: string;
    patientId: string;
    title: string;
    date: string;
    orderedBy: string;
    lab: string;
    status: string;
    results: Array<{ test: string; value: number; unit: string; normalRange: string; status: string }>;
    summary: string;
    followUpRequired: boolean;
}

export interface Relative {
    id: string;
    patientId: string;
    name: string;
    relationship: string;
    phone: string;
    email: string;
    notificationsEnabled: boolean;
    lastContacted: string | null;
}

export interface HealthAlert {
    id: string;
    patientId: string;
    type: 'medication' | 'vitals' | 'lab' | 'appointment' | 'general';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionRequired: boolean;
    actionLabel: string | null;
}

export interface ActivityDay {
    date: string;
    steps: number;
    activeMinutes: number;
    caloriesBurned: number;
    distanceKm: number;
    sleepHours: number;
    sleepQuality: string;
}

// ─── API Client ───────────────────────────────
export const api = {
    /** Check if backend is running */
    healthCheck: () => fetchAPI<{ status: string; uptime: string; dataset: object }>('/api/health'),

    /** Patient endpoints */
    patients: {
        getAll: () => fetchAPI<ApiResponse<Patient[]>>('/api/patients'),
        getById: (id: string) => fetchAPI<ApiResponse<Patient>>(`/api/patients/${id}`),
        getDashboard: (id: string) => fetchAPI<ApiResponse<{
            patient: Partial<Patient>;
            currentVitals: VitalsSnapshot | null;
            analytics: object | null;
            unreadAlerts: HealthAlert[];
            unreadAlertCount: number;
        }>>(`/api/patients/${id}/dashboard`),
        update: (id: string, data: Partial<Patient>) =>
            fetchAPI<ApiResponse<Patient>>(`/api/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    },

    /** Vitals endpoints */
    vitals: {
        getCurrent: (patientId: string) => fetchAPI<ApiResponse<VitalsSnapshot>>(`/api/vitals/current/${patientId}`),
        getHistory: (patientId: string, days = 30) =>
            fetchAPI<ApiResponse<VitalsRecord[]> & { stats: object }>(`/api/vitals/history/${patientId}?days=${days}`),
        getTrends: (patientId: string) => fetchAPI<ApiResponse<object[]>>(`/api/vitals/trends/${patientId}`),
        record: (data: Partial<VitalsRecord>) =>
            fetchAPI<ApiResponse<VitalsRecord>>('/api/vitals', { method: 'POST', body: JSON.stringify(data) }),
    },

    /** Medication endpoints */
    medications: {
        getAll: (patientId?: string) =>
            fetchAPI<ApiResponse<Medication[]>>(`/api/medications${patientId ? `?patientId=${patientId}` : ''}`),
        getById: (id: string) => fetchAPI<ApiResponse<Medication>>(`/api/medications/${id}`),
        getSchedule: (patientId: string) =>
            fetchAPI<{ success: boolean; summary: object; data: { overdue: object[]; upcoming: object[]; taken: object[] } }>(
                `/api/medications/patient/${patientId}/schedule`
            ),
        add: (data: Partial<Medication>) =>
            fetchAPI<ApiResponse<Medication>>('/api/medications', { method: 'POST', body: JSON.stringify(data) }),
        markTaken: (id: string) =>
            fetchAPI<ApiResponse<Medication>>(`/api/medications/${id}/taken`, { method: 'PATCH' }),
        delete: (id: string) =>
            fetchAPI<ApiResponse<Medication>>(`/api/medications/${id}`, { method: 'DELETE' }),
    },

    /** Appointment endpoints */
    appointments: {
        getAll: (params?: { patientId?: string; status?: string; upcoming?: boolean }) => {
            const query = new URLSearchParams();
            if (params?.patientId) query.append('patientId', params.patientId);
            if (params?.status) query.append('status', params.status);
            if (params?.upcoming) query.append('upcoming', 'true');
            return fetchAPI<ApiResponse<Appointment[]>>(`/api/appointments?${query}`);
        },
        getById: (id: string) => fetchAPI<ApiResponse<Appointment>>(`/api/appointments/${id}`),
        book: (data: Partial<Appointment>) =>
            fetchAPI<ApiResponse<Appointment>>('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),
        cancel: (id: string, reason?: string) =>
            fetchAPI<ApiResponse<Appointment>>(`/api/appointments/${id}/cancel`, {
                method: 'PATCH', body: JSON.stringify({ reason })
            }),
        complete: (id: string, notes?: string) =>
            fetchAPI<ApiResponse<Appointment>>(`/api/appointments/${id}/complete`, {
                method: 'PATCH', body: JSON.stringify({ notes })
            }),
    },

    /** Lab Reports endpoints */
    reports: {
        getAll: (params?: { patientId?: string; followUpRequired?: boolean }) => {
            const query = new URLSearchParams();
            if (params?.patientId) query.append('patientId', params.patientId);
            if (params?.followUpRequired) query.append('followUpRequired', 'true');
            return fetchAPI<ApiResponse<LabReport[]>>(`/api/reports?${query}`);
        },
        getById: (id: string) => fetchAPI<ApiResponse<LabReport>>(`/api/reports/${id}`),
        getSummary: (patientId: string) => fetchAPI<ApiResponse<object[]>>(`/api/reports/patient/${patientId}/summary`),
        add: (data: Partial<LabReport>) =>
            fetchAPI<ApiResponse<LabReport>>('/api/reports', { method: 'POST', body: JSON.stringify(data) }),
    },

    /** Relatives endpoints */
    relatives: {
        getAll: (patientId?: string) =>
            fetchAPI<ApiResponse<Relative[]>>(`/api/relatives${patientId ? `?patientId=${patientId}` : ''}`),
        add: (data: Partial<Relative>) =>
            fetchAPI<ApiResponse<Relative>>('/api/relatives', { method: 'POST', body: JSON.stringify(data) }),
        notify: (id: string, message: string, subject?: string) =>
            fetchAPI<ApiResponse<object>>(`/api/relatives/${id}/notify`, {
                method: 'POST', body: JSON.stringify({ message, subject })
            }),
        delete: (id: string) =>
            fetchAPI<ApiResponse<Relative>>(`/api/relatives/${id}`, { method: 'DELETE' }),
    },

    /** Activity tracking */
    activity: {
        get: (patientId: string, days = 7) =>
            fetchAPI<{ success: boolean; summary: object; data: ActivityDay[] }>(`/api/activity/${patientId}?days=${days}`),
        log: (patientId: string, data: Partial<ActivityDay>) =>
            fetchAPI<ApiResponse<ActivityDay>>(`/api/activity/${patientId}`, {
                method: 'POST', body: JSON.stringify(data)
            }),
    },

    /** Health alerts */
    alerts: {
        getAll: (params?: { patientId?: string; severity?: string; isRead?: boolean }) => {
            const query = new URLSearchParams();
            if (params?.patientId) query.append('patientId', params.patientId);
            if (params?.severity) query.append('severity', params.severity);
            if (params?.isRead !== undefined) query.append('isRead', String(params.isRead));
            return fetchAPI<ApiResponse<HealthAlert[]>>(`/api/alerts?${query}`);
        },
        markRead: (id: string) =>
            fetchAPI<ApiResponse<HealthAlert>>(`/api/alerts/${id}/read`, { method: 'PATCH' }),
        markAllRead: (patientId: string) =>
            fetchAPI<{ success: boolean; message: string }>(`/api/alerts/patient/${patientId}/read-all`, { method: 'PATCH' }),
        dismiss: (id: string) =>
            fetchAPI<ApiResponse<HealthAlert>>(`/api/alerts/${id}`, { method: 'DELETE' }),
        create: (data: Partial<HealthAlert>) =>
            fetchAPI<ApiResponse<HealthAlert>>('/api/alerts', { method: 'POST', body: JSON.stringify(data) }),
    },

    /** Doctors directory */
    doctors: {
        getAll: (specialty?: string) =>
            fetchAPI<ApiResponse<object[]>>(`/api/doctors${specialty ? `?specialty=${specialty}` : ''}`),
        getById: (id: string) => fetchAPI<ApiResponse<object>>(`/api/doctors/${id}`),
    },
};

export default api;
