import { writable } from 'svelte/store';
import { broadcastUpdate, onBroadcastMessage } from '$lib/utils/broadcast';
import { logger } from './logger';

// Tipos
export interface Center {
    id: string;
    name: string;
    location: string;
    description?: string;
}

export interface Student {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    level: string;
    centerId?: string;
    notes?: string;
    skills?: string[]; // IDs of acquired skills
    joinedAt?: string; // ISO Date string
}

export interface ClassGroup {
    id: string;
    name: string;
    centerId: string;
    schedule: string; // "L-X 17:00"
    level: string;
    students: string[]; // IDs de alumnos
    duration?: number; // Duración en minutos
}

export interface Skill {
    id: string;
    name: string;
    category: 'Tactics' | 'Strategy' | 'Endgame' | 'Openings';
    level: number;
    description: string;
    content?: string; // Contenido detallado de la habilidad
}

export interface AttendanceRecord {
    id: string;
    classId: string;
    date: string; // YYYY-MM-DD
    records: {
        studentId: string;
        status: 'present' | 'absent' | 'excused';
    }[];
    sessionNotes?: string; // Observaciones generales de la sesión
    skills?: string[]; // IDs de habilidades trabajadas en la sesión
}

export interface Payment {
    id: string;
    studentId: string;
    amount: number;
    concept: string;
    date: string;
    method: 'cash' | 'transfer' | 'bizum' | 'other';
    notes?: string;
}

export interface LessonSegment {
    id: string;
    type: 'opening' | 'tactics' | 'strategy' | 'endgame' | 'game' | 'analysis' | 'other';
    title: string;
    duration: number; // minutes
    notes?: string;
}

export interface LessonPlan {
    id: string;
    title: string;
    date?: string; // Intended date
    classId?: string; // Optional assignment
    segments: LessonSegment[];
    totalDuration: number;
    createdAt: string;
}

export interface AppData {
    centers: Center[];
    students: Student[];
    classes: ClassGroup[];
    skills: Skill[];
    tournaments: Tournament[];
    attendance: AttendanceRecord[];
    payments: Payment[];
    plans: LessonPlan[];
    leads: Lead[];
    reports: any[]; // Placeholder
    unlockedAchievements: { id: string; unlockedAt: string }[];
    settings: {
        plan: 'free' | 'profe' | 'club';
        academyName?: string;
        academyLogo?: string;
        currency?: string;
        theme?: 'dark' | 'light' | 'system';
        language?: 'es' | 'en';
        // Profile for Teachers
        teacherName?: string;
        teacherTitle?: string; // e.g. "Gran Maestro", "Entrenador FIDE"
        teacherBio?: string;
        teacherAvatar?: string;
    };
    dashboardLayout?: string[]; // IDs of quick actions in order
}

export interface Lead {
    id: string;
    name: string;
    contact: string;
    status: 'new' | 'contacted' | 'trial' | 'converted' | 'lost';
    source?: 'web' | 'referral' | 'flyer' | 'other';
    notes?: string;
    createdAt: string;
}

export interface Match {
    id: string;
    round: number;
    whiteId: string;
    blackId: string;
    result: '1-0' | '0-1' | '0.5-0.5' | null;
}

export interface Tournament {
    id: string;
    name: string;
    date: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    participants: string[]; // List of Student IDs
    matches: Match[];
    format: string;
}

// Estado Inicial (Vacío)
const initialState: AppData = {
    centers: [],
    students: [],
    classes: [],
    skills: [],
    tournaments: [],
    attendance: [],
    payments: [],
    plans: [],
    leads: [],
    reports: [],
    unlockedAchievements: [],
    settings: {
        plan: 'free'
    },
    dashboardLayout: [] // Empty means default order
};

// Limites del Plan
export const PLAN_LIMITS = {
    free: { centers: 1, classes: 2, students: 10, tournaments: false, reports: false },
    profe: { centers: 3, classes: 10, students: 50, tournaments: false, reports: true },
    club: { centers: Infinity, classes: Infinity, students: Infinity, tournaments: true, reports: true }
};

export function checkPlanLimit(store: AppData, resource: 'centers' | 'classes' | 'students' | 'tournaments' | 'reports'): boolean {
    const plan = store.settings.plan;
    const limit = PLAN_LIMITS[plan][resource];

    if (typeof limit === 'boolean') {
        return limit;
    }

    // Count current usage
    const usage = store[resource].length;
    return usage < limit;
}

// Store de Svelte
export const appStore = writable<AppData>(initialState);

// Clave para localStorage
const STORAGE_KEY = 'chessnet_data_v1';
let isInitialized = false;

// Función para inicializar (cargar datos)
export function initStore() {
    if (typeof localStorage === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Ensure compatibility if new fields added
            appStore.set({ ...initialState, ...parsed });
            logger.info('Data loaded successfully from localStorage', 'Storage', {
                studentCount: parsed.students?.length || 0,
                centerCount: parsed.centers?.length || 0,
                classCount: parsed.classes?.length || 0
            });
        } catch (e) {
            logger.error('Failed to load data from localStorage - data corrupted', 'Storage', e);
            console.error('Error cargando datos:', e);
            // If data is corrupted, reset to initial state
            if (typeof window !== 'undefined') {
                const shouldReset = confirm(
                    'Los datos guardados están corruptos. ¿Deseas resetear la aplicación?'
                );
                if (shouldReset) {
                    localStorage.removeItem(STORAGE_KEY);
                    appStore.set(initialState);
                    logger.warn('User chose to reset corrupted data', 'Storage');
                }
            }
        }
    } else {
        logger.info('No saved data found, using initial state', 'Storage');
    }

    // Listen for cross-tab updates via BroadcastChannel
    onBroadcastMessage((message) => {
        if (message.type === 'tournament-update') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Update store to reflect changes from other tabs
                    appStore.set({ ...initialState, ...parsed });
                } catch (e) {
                    console.error('Error syncing data from broadcast:', e);
                }
            }
        }
    });

    isInitialized = true;
}

// Suscribirse a cambios para guardar automáticamente
appStore.subscribe(value => {
    if (typeof localStorage !== 'undefined' && isInitialized) {
        try {
            const serialized = JSON.stringify(value);

            // Check localStorage quota (typically 5-10MB)
            const estimatedSize = new Blob([serialized]).size;
            if (estimatedSize > 5 * 1024 * 1024) { // 5MB warning
                console.warn('Los datos están ocupando mucho espacio. Considera exportar y limpiar datos antiguos.');
            }

            localStorage.setItem(STORAGE_KEY, serialized);
        } catch (e) {
            console.error('Error guardando datos:', e);

            // Handle quota exceeded error
            if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                if (typeof window !== 'undefined') {
                    alert(
                        'No hay suficiente espacio en el navegador para guardar los datos. ' +
                        'Por favor, exporta tus datos y limpia registros antiguos.'
                    );
                }
            }
        }
    }
});

// Helpers para CRUD
export const storeActions = {
    addCenter: (center: Center) => {
        appStore.update(s => ({ ...s, centers: [...s.centers, center] }));
    },
    removeCenter: (id: string) => {
        appStore.update(s => ({ ...s, centers: s.centers.filter(c => c.id !== id) }));
    },
    addStudent: (student: Student) => {
        const s = { ...student, joinedAt: student.joinedAt || new Date().toISOString() };
        appStore.update(s_store => ({ ...s_store, students: [...s_store.students, s] }));
    },
    updateStudent: (student: Student) => {
        appStore.update(s => ({
            ...s,
            students: s.students.map(curr => curr.id === student.id ? student : curr)
        }));
    },
    removeStudent: (id: string) => {
        appStore.update(s => ({ ...s, students: s.students.filter(stud => stud.id !== id) }));
    },
    toggleStudentSkill: (studentId: string, skillId: string) => {
        appStore.update(s => ({
            ...s,
            students: s.students.map(std => {
                if (std.id !== studentId) return std;
                const currentSkills = std.skills || [];
                const hasSkill = currentSkills.includes(skillId);
                return {
                    ...std,
                    skills: hasSkill
                        ? currentSkills.filter(id => id !== skillId)
                        : [...currentSkills, skillId]
                };
            })
        }));
    },
    addClass: (cls: ClassGroup) => {
        appStore.update(s => ({ ...s, classes: [...s.classes, cls] }));
    },
    updateClass: (cls: ClassGroup) => {
        appStore.update(s => ({
            ...s,
            classes: s.classes.map(curr => curr.id === cls.id ? cls : curr)
        }));
    },
    removeClass: (id: string) => {
        appStore.update(s => ({ ...s, classes: s.classes.filter(c => c.id !== id) }));
    },
    addClassMember: (classId: string, studentId: string) => {
        appStore.update(s => ({
            ...s,
            classes: s.classes.map(c =>
                c.id === classId && !c.students.includes(studentId)
                    ? { ...c, students: [...c.students, studentId] }
                    : c
            )
        }));
    },
    removeClassMember: (classId: string, studentId: string) => {
        appStore.update(s => ({
            ...s,
            classes: s.classes.map(c =>
                c.id === classId
                    ? { ...c, students: c.students.filter(id => id !== studentId) }
                    : c
            )
        }));
    },
    addSkill: (skill: Skill) => {
        appStore.update(s => ({ ...s, skills: [...s.skills, skill] }));
    },
    updateSkill: (id: string, updatedSkill: Partial<Skill>) => {
        appStore.update(s => ({
            ...s,
            skills: s.skills.map(skill => skill.id === id ? { ...skill, ...updatedSkill } : skill)
        }));
    },
    deleteSkill: (id: string) => {
        appStore.update(s => ({
            ...s,
            skills: s.skills.filter(skill => skill.id !== id),
            // Also remove this skill from all students
            students: s.students.map(student => ({
                ...student,
                skills: student.skills?.filter(skillId => skillId !== id) || []
            }))
        }));
    },
    addTournament: (t: Tournament) => {
        appStore.update(s => ({ ...s, tournaments: [...s.tournaments, t] }));
        broadcastUpdate({ type: 'tournament-update', tournamentId: t.id });
    },
    updateTournament: (t: Tournament) => {
        appStore.update(s => ({
            ...s,
            tournaments: s.tournaments.map(curr => curr.id === t.id ? t : curr)
        }));
        broadcastUpdate({ type: 'tournament-update', tournamentId: t.id });
    },
    removeTournament: (id: string) => {
        appStore.update(s => ({
            ...s,
            tournaments: s.tournaments.filter(t => t.id !== id)
        }));
    },
    saveAttendance: (record: AttendanceRecord) => {
        appStore.update(data => {
            // Remove existing record for same day and class if exists
            const filtered = data.attendance.filter(r => !(r.classId === record.classId && r.date === record.date));
            return { ...data, attendance: [...filtered, record] };
        });
    },
    addPayment: (payment: Payment) => {
        appStore.update(data => {
            return { ...data, payments: [payment, ...data.payments] };
        });
    },
    removePayment: (id: string) => {
        appStore.update(data => {
            return { ...data, payments: data.payments.filter(p => p.id !== id) };
        });
    },
    addLessonPlan: (plan: LessonPlan) => {
        appStore.update(data => ({ ...data, plans: [plan, ...data.plans] }));
    },
    removeLessonPlan: (id: string) => {
        appStore.update(data => ({ ...data, plans: data.plans.filter(p => p.id !== id) }));
    },
    addLead: (lead: Lead) => {
        appStore.update(data => ({ ...data, leads: [lead, ...data.leads] }));
    },
    updateLead: (lead: Lead) => {
        appStore.update(data => ({
            ...data,
            leads: data.leads.map(l => l.id === lead.id ? lead : l)
        }));
    },
    removeLead: (id: string) => {
        appStore.update(data => ({ ...data, leads: data.leads.filter(l => l.id !== id) }));
    },
    // Reset para pruebas
    reset: () => {
        appStore.set(initialState);
    },
    updateDashboardLayout: (layout: string[]) => {
        appStore.update(s => ({ ...s, dashboardLayout: layout }));
    },
    updateSettings: (newSettings: Partial<AppData['settings']>) => {
        appStore.update(s => ({ ...s, settings: { ...s.settings, ...newSettings } }));
    },
    unlockAchievement: (id: string) => {
        appStore.update(s => {
            // Check if already unlocked
            if (s.unlockedAchievements.some(a => a.id === id)) return s;
            return {
                ...s,
                unlockedAchievements: [
                    ...s.unlockedAchievements,
                    { id, unlockedAt: new Date().toISOString() }
                ]
            };
        });
    }
};
