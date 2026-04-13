import { writable, get } from 'svelte/store';
import { db, auth } from '$lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { 
  College, 
  Student, 
  Class, 
  Skill, 
  Category,
  Tournament, 
  LocalTournament, 
  Payment,
  Lead,
  Badge,
  StudentBadge,
  Attendance
} from '$lib/types';

// Interfaces para el estado global
export interface AppSettings {
  plan: string;
  teacherName: string;
  teacherAvatar: string;
  teacherEmail?: string;
  [key: string]: any;
}

export interface AppState {
  centers: College[];
  students: Student[];
  classes: Class[];
  skills: Skill[];
  categories: Category[];
  tournaments: Tournament[]; // Globales
  localTournaments: LocalTournament[]; // Locales/Clase
  localTournamentPlayers: any[]; 
  localTournamentRounds: any[];
  localTournamentPairings: any[];
  attendance: Attendance[];
  payments: Payment[];
  plans: any[];
  leads: Lead[];
  badges: Badge[];
  studentBadges: StudentBadge[];
  studentStats: any[];
  reports: any[];
  unlockedAchievements: any[];
  settings: AppSettings;
  dashboardLayout: string[];
}

const initialState: AppState = {
  centers: [],
  students: [],
  classes: [],
  skills: [],
  categories: [],
  tournaments: [],
  localTournaments: [],
  localTournamentPlayers: [],
  localTournamentRounds: [],
  localTournamentPairings: [],
  attendance: [],
  payments: [],
  plans: [],
  leads: [],
  badges: [],
  studentBadges: [],
  studentStats: [],
  reports: [],
  unlockedAchievements: [],
  settings: { 
    plan: 'free',
    teacherName: '',
    teacherAvatar: ''
  },
  dashboardLayout: []
};

function createAppStore() {
  const { subscribe, set, update } = writable(initialState);
  let isLoaded = false;
  let unsubscribes: (() => void)[] = [];

  // Helper para obtener el path base del usuario
  const getUserPath = () => {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    return `users/${user.uid}`;
  };

  // Cargar datos al iniciar sesión
  onAuthStateChanged(auth, async (user) => {
    // Limpiar suscripciones previas
    unsubscribes.forEach(unsub => unsub());
    unsubscribes = [];

    if (user) {
      console.log('👤 Usuario detectado (AppStore):', user.email);
      const userPath = `users/${user.uid}`;
      
      // 1. Cargar Settings (Documento único)
      const settingsRef = doc(db, userPath, 'appData', 'v1');
      unsubscribes.push(onSnapshot(settingsRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          update(s => ({ 
            ...s, 
            settings: { ...s.settings, ...data.settings },
            dashboardLayout: data.dashboardLayout || []
          }));
        }
      }));

      // 2. Suscribirse a Colecciones (Sub-colecciones escalables)
      const collectionsMap = [
        { key: 'centers', path: 'colleges' },
        { key: 'students', path: 'students' },
        { key: 'classes', path: 'classes' },
        { key: 'tournaments', path: 'tournaments' },
        { key: 'localTournaments', path: 'local_tournaments' },
        { key: 'localTournamentPlayers', path: 'local_tournament_players' },
        { key: 'localTournamentRounds', path: 'local_tournament_rounds' },
        { key: 'localTournamentPairings', path: 'local_tournament_pairings' },
        { key: 'payments', path: 'payments' },
        { key: 'attendance', path: 'attendance' },
        { key: 'skills', path: 'skills' },
        { key: 'categories', path: 'categories' },
        { key: 'badges', path: 'badges' },
        { key: 'studentBadges', path: 'student_badges' },
        { key: 'studentStats', path: 'student_stats' },
        { key: 'leads', path: 'leads' }
      ];

      collectionsMap.forEach(({ key, path }) => {
        const collRef = collection(db, userPath, path);
        unsubscribes.push(onSnapshot(collRef, (snap) => {
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          update(s => ({ ...s, [key]: docs }));
        }));
      });

      isLoaded = true;
    } else {
      console.log('🚪 Sesión cerrada, limpiando store');
      set(initialState);
      isLoaded = false;
    }
  });

  return {
    subscribe,
    // Métodos CRUD que escriben directamente en las sub-colecciones
    
    // Colegios / Centros
    addCenter: async (center: any) => {
      const collRef = collection(db, getUserPath(), 'colleges');
      await addDoc(collRef, { ...center, createdAt: new Date().toISOString() });
    },
    removeCenter: async (id: string) => {
      await deleteDoc(doc(db, getUserPath(), 'colleges', id));
    },
    
    // Alumnos
    addStudent: async (student: any) => {
      const collRef = collection(db, getUserPath(), 'students');
      await addDoc(collRef, { 
        ...student, 
        joinedAt: student.joinedAt || new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    },
    updateStudent: async (student: any) => {
      const { id, ...data } = student;
      const docRef = doc(db, getUserPath(), 'students', id);
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeStudent: async (id: string) => {
      await deleteDoc(doc(db, getUserPath(), 'students', id));
    },
    
    // Clases
    addClass: async (cls: any) => {
      const collRef = collection(db, getUserPath(), 'classes');
      await addDoc(collRef, { ...cls, createdAt: new Date().toISOString() });
    },
    updateClass: async (cls: any) => {
      const { id, ...data } = cls;
      await setDoc(doc(db, getUserPath(), 'classes', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeClass: async (id: string) => {
      await deleteDoc(doc(db, getUserPath(), 'classes', id));
    },
    
    // Torneos
    addTournament: async (tournament: any) => {
      const collRef = collection(db, getUserPath(), 'tournaments');
      await addDoc(collRef, { ...tournament, createdAt: new Date().toISOString() });
    },
    updateTournament: async (tournament: any) => {
      const { id, ...data } = tournament;
      await setDoc(doc(db, getUserPath(), 'tournaments', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeTournament: async (id: string) => {
      await deleteDoc(doc(db, getUserPath(), 'tournaments', id));
    },

    // Torneos Locales
    addLocalTournament: async (tournament: any) => {
      const collRef = collection(db, getUserPath(), 'local_tournaments');
      const docRef = await addDoc(collRef, { 
        ...tournament, 
        createdAt: new Date().toISOString() 
      });
      return docRef.id;
    },
    updateLocalTournament: async (id: string, updates: any) => {
      const docRef = doc(db, getUserPath(), 'local_tournaments', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeLocalTournament: async (id: string) => {
      await deleteDoc(doc(db, getUserPath(), 'local_tournaments', id));
    },

    // Jugadores de Torneos Locales
    addLocalTournamentPlayer: async (player: any) => {
      const docId = `${player.tournament_id}_${player.student_id}`;
      const docRef = doc(db, getUserPath(), 'local_tournament_players', docId);
      await setDoc(docRef, { ...player, createdAt: new Date().toISOString() }, { merge: true });
    },
    removeLocalTournamentPlayer: async (tournamentId: string, studentId: string) => {
      // Nota: En Firestore necesitamos el ID del documento, no el studentId
      // Pero para simplificar, buscaremos el documento en el store síncrono si es necesario, 
      // o usaremos un ID compuesto. Vamos a usar ID compuesto: tournamentId_studentId
      await deleteDoc(doc(db, getUserPath(), 'local_tournament_players', `${tournamentId}_${studentId}`));
    },

    // Emparejamientos de Torneos Locales
    addLocalTournamentPairing: async (pairing: any) => {
      const collRef = collection(db, getUserPath(), 'local_tournament_pairings');
      await addDoc(collRef, { ...pairing, createdAt: new Date().toISOString() });
    },
    updateLocalTournamentPairing: async (id: string, updates: any) => {
      const docRef = doc(db, getUserPath(), 'local_tournament_pairings', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },

    // Rondas de Torneos Locales
    addLocalTournamentRound: async (round: any) => {
      const docId = `${round.tournament_id}_${round.round_no}`;
      const docRef = doc(db, getUserPath(), 'local_tournament_rounds', docId);
      await setDoc(docRef, { ...round, createdAt: new Date().toISOString() }, { merge: true });
    },
    updateLocalTournamentRound: async (id: string, updates: any) => {
      const docRef = doc(db, getUserPath(), 'local_tournament_rounds', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    
    // Asistencia
    saveAttendance: async (record: any) => {
      const collRef = collection(db, getUserPath(), 'attendance');
      if (record.id) {
        const { id, ...data } = record;
        await setDoc(doc(db, getUserPath(), 'attendance', id), data, { merge: true });
      } else {
        const attendanceId = `${record.student_id}_${record.class_id}_${record.date}`;
        await setDoc(doc(db, getUserPath(), 'attendance', attendanceId), { ...record, createdAt: new Date().toISOString() });
      }
    },
    
    // Pagos
    addPayment: async (payment: any) => {
      const collRef = collection(db, getUserPath(), 'payments');
      await addDoc(collRef, { ...payment, createdAt: new Date().toISOString() });
    },
    removePayment: async (id: string) => {
      await deleteDoc(doc(db, getUserPath(), 'payments', id));
    },

    // Habilidades (temario)
    addSkill: async (skill: any) => {
      const collRef = collection(db, getUserPath(), 'skills');
      await addDoc(collRef, { ...skill, createdAt: new Date().toISOString() });
    },
    updateSkill: async (skill: any) => {
      const { id, ...data } = skill;
      await setDoc(doc(db, getUserPath(), 'skills', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeSkill: async (id: string) => {
      await deleteDoc(doc(db, getUserPath(), 'skills', id));
    },

    // Settings
    updateSettings: async (settings: any) => {
      const docRef = doc(db, getUserPath(), 'appData', 'v1');
      const current = get(appStore);
      await setDoc(docRef, { 
        settings: { ...current.settings, ...settings },
        updatedAt: new Date().toISOString()
      }, { merge: true });
    },
    
    updateDashboardLayout: async (layout: string[]) => {
      const docRef = doc(db, getUserPath(), 'appData', 'v1');
      await setDoc(docRef, { dashboardLayout: layout }, { merge: true });
    },

    // Logros (Sub-colección)
    unlockAchievement: async (slug: string) => {
      const current = get(appStore);
      if (current.unlockedAchievements.some((a: any) => a.id === slug)) return;
      const collRef = collection(db, getUserPath(), 'achievements');
      await addDoc(collRef, { id: slug, unlockedAt: new Date().toISOString() });
    }
  };
}

export const appStore = createAppStore();
