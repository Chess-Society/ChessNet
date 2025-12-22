import { writable } from 'svelte/store';

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
    participants: number;
    format: 'Suizo' | 'Round Robin' | 'Eliminatoria';
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
    payments: []
};

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
            console.error('Error cargando datos', e);
        }
    }

    // Suscribirse a cambios para guardar automáticamente
    appStore.subscribe(value => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
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
    removeStudent: (id: string) => {
        appStore.update(s => ({ ...s, students: s.students.filter(stud => stud.id !== id) }));
    },
    addClass: (cls: ClassGroup) => {
        appStore.update(s => ({ ...s, classes: [...s.classes, cls] }));
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
    },
    updateTournament: (t: Tournament) => {
        appStore.update(s => ({
            ...s,
            tournaments: s.tournaments.map(curr => curr.id === t.id ? t : curr)
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
