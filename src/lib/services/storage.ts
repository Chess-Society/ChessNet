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

export interface AppData {
    centers: Center[];
    students: Student[];
    classes: ClassGroup[];
}

// Estado Inicial (Vacío)
const initialState: AppData = {
    centers: [],
    students: [],
    classes: []
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
            appStore.set(JSON.parse(saved));
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
    addClass: (cls: ClassGroup) => {
        appStore.update(s => ({ ...s, classes: [...s.classes, cls] }));
    },
    // Reset para pruebas
    reset: () => {
        appStore.set(initialState);
    }
};
