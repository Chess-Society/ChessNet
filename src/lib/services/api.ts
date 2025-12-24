import { get } from 'svelte/store';
import { appStore } from './storage';
import type {
    Student, Center, ClassGroup, Skill, AttendanceRecord,
    Payment, LessonPlan, Lead, Tournament, AppData
} from './storage';

// Base config
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const USE_MOCK_DATA = true; // Flag to easily switch between localStorage/Mock and Real API

// Generic Request Handler
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (USE_MOCK_DATA) {
        // En modo MOCK, devolvemos simulación o lanzamos error de "No implementado en backend real aún"
        // Para que la app funcione ahora mismo, muchos componentes usan 'storage.ts' directamente.
        // Este servicio es para cuando migres a backend.
        console.log(`[API MOCK] ${options.method || 'GET'} ${endpoint}`, options.body);
        return {} as T;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// ==========================================
// API Services
// ==========================================

export const api = {
    // --- Students ---
    students: {
        list: (params?: { centerId?: string; classId?: string }) =>
            request<{ students: Student[] }>(`/students?${new URLSearchParams(params as any)}`),

        get: (id: string) => request<Student>(`/students/${id}`),

        create: (data: Omit<Student, 'id'>) =>
            request<Student>('/students', { method: 'POST', body: JSON.stringify(data) }),

        update: (id: string, data: Partial<Student>) =>
            request<Student>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

        delete: (id: string) =>
            request<void>(`/students/${id}`, { method: 'DELETE' }),

        assignSkill: (studentId: string, skillId: string) =>
            request<void>(`/students/${studentId}/skills/${skillId}`, { method: 'POST' }),

        removeSkill: (studentId: string, skillId: string) =>
            request<void>(`/students/${studentId}/skills/${skillId}`, { method: 'DELETE' })
    },

    // --- Centers ---
    centers: {
        list: () => request<{ centers: Center[] }>('/centers'),
        create: (data: Omit<Center, 'id'>) =>
            request<Center>('/centers', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<Center>) =>
            request<Center>(`/centers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/centers/${id}`, { method: 'DELETE' })
    },

    // --- Classes ---
    classes: {
        list: (params?: { centerId?: string }) =>
            request<{ classes: ClassGroup[] }>(`/classes?${new URLSearchParams(params as any)}`),
        create: (data: Omit<ClassGroup, 'id'>) =>
            request<ClassGroup>('/classes', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<ClassGroup>) =>
            request<ClassGroup>(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/classes/${id}`, { method: 'DELETE' }),
        addStudent: (classId: string, studentId: string) =>
            request<void>(`/classes/${classId}/students/${studentId}`, { method: 'POST' }),
        removeStudent: (classId: string, studentId: string) =>
            request<void>(`/classes/${classId}/students/${studentId}`, { method: 'DELETE' })
    },

    // --- Skills ---
    skills: {
        list: (params?: { category?: string; level?: number }) =>
            request<{ skills: Skill[] }>(`/skills?${new URLSearchParams(params as any)}`),
        create: (data: Omit<Skill, 'id'>) =>
            request<Skill>('/skills', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<Skill>) =>
            request<Skill>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/skills/${id}`, { method: 'DELETE' })
    },

    // --- Attendance ---
    attendance: {
        list: (params?: { classId?: string; date?: string; studentId?: string }) =>
            request<{ attendance: AttendanceRecord[] }>(`/attendance?${new URLSearchParams(params as any)}`),
        save: (data: Omit<AttendanceRecord, 'id'>) =>
            request<AttendanceRecord>('/attendance', { method: 'POST', body: JSON.stringify(data) })
    },

    // --- Payments ---
    payments: {
        list: (params?: { studentId?: string; startDate?: string; endDate?: string }) =>
            request<{ payments: Payment[] }>(`/payments?${new URLSearchParams(params as any)}`),
        create: (data: Omit<Payment, 'id'>) =>
            request<Payment>('/payments', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/payments/${id}`, { method: 'DELETE' })
    },

    // --- Lesson Plans ---
    lessonPlans: {
        list: (params?: { classId?: string }) =>
            request<{ plans: LessonPlan[] }>(`/lesson-plans?${new URLSearchParams(params as any)}`),
        create: (data: Omit<LessonPlan, 'id'>) =>
            request<LessonPlan>('/lesson-plans', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/lesson-plans/${id}`, { method: 'DELETE' })
    },

    // --- Leads (CRM) ---
    leads: {
        list: (params?: { status?: string }) =>
            request<{ leads: Lead[] }>(`/leads?${new URLSearchParams(params as any)}`),
        create: (data: Omit<Lead, 'id'>) =>
            request<Lead>('/leads', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<Lead>) =>
            request<Lead>(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/leads/${id}`, { method: 'DELETE' })
    },

    // --- Tournaments ---
    tournaments: {
        list: (params?: { status?: string }) =>
            request<{ tournaments: Tournament[] }>(`/tournaments?${new URLSearchParams(params as any)}`),
        create: (data: Omit<Tournament, 'id'>) =>
            request<Tournament>('/tournaments', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<Tournament>) =>
            request<Tournament>(`/tournaments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/tournaments/${id}`, { method: 'DELETE' })
    },

    // --- Settings / Dashboard ---
    settings: {
        get: () => request<{ settings: AppData['settings'] }>('/settings'),
        update: (data: Partial<AppData['settings']>) =>
            request<{ settings: AppData['settings'] }>('/settings', { method: 'PUT', body: JSON.stringify(data) })
    },

    achievements: {
        list: () => request<{ unlockedAchievements: any[] }>('/achievements'),
        unlock: (id: string) => request<void>(`/achievements/${id}/unlock`, { method: 'POST' })
    }
};
