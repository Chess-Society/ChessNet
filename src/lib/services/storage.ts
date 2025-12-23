import { writable } from 'svelte/store';
import { broadcastUpdate, onBroadcastMessage } from '$lib/utils/broadcast';

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
}

export interface ClassGroup {
    id: string;
    name: string;
    centerId: string;
    schedule: string; // "L-X 17:00"
    level: string;
    students: string[]; // IDs de alumnos
}

export interface Skill {
    id: string;
    name: string;
    category: 'Tactics' | 'Strategy' | 'Endgame' | 'Openings';
    level: number;
    description: string;
}

export interface AttendanceRecord {
    id: string;
    classId: string;
    date: string; // YYYY-MM-DD
    records: {
        studentId: string;
        status: 'present' | 'absent' | 'excused';
    }[];
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

export interface AppData {
    centers: Center[];
    students: Student[];
    classes: ClassGroup[];
    skills: Skill[];
    tournaments: Tournament[];
    attendance: AttendanceRecord[];
    payments: Payment[];
    reports: any[]; // Placeholder
    settings: {
        plan: 'free' | 'profe' | 'club';
    };
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
    reports: [],
    settings: {
        plan: 'free'
    }
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

// Función para inicializar (cargar datos)
export function initStore() {
    if (typeof localStorage === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Ensure compatibility if new fields added
            appStore.set({ ...initialState, ...parsed });
        } catch (e) {
            console.error('Error cargando datos:', e);
            // If data is corrupted, reset to initial state
            if (typeof window !== 'undefined') {
                const shouldReset = confirm(
                    'Los datos guardados están corruptos. ¿Deseas resetear la aplicación?'
                );
                if (shouldReset) {
                    localStorage.removeItem(STORAGE_KEY);
                    appStore.set(initialState);
                }
            }
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
    }

    // Suscribirse a cambios para guardar automáticamente
    appStore.subscribe(value => {
        if (typeof localStorage !== 'undefined') {
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
}

// Helpers para CRUD
export const storeActions = {
    addCenter: (center: Center) => {
        appStore.update(s => ({ ...s, centers: [...s.centers, center] }));
    },
    removeCenter: (id: string) => {
        appStore.update(s => ({ ...s, centers: s.centers.filter(c => c.id !== id) }));
    },
    addStudent: (student: Student) => {
        appStore.update(s => ({ ...s, students: [...s.students, student] }));
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
    // Reset para pruebas
    reset: () => {
        appStore.set(initialState);
    }
};
