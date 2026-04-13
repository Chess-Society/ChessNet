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
  updateDoc,
  where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { 
  School, 
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
  schools: School[];
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
  schools: [],
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



  // Cargar datos al iniciar sesión
  onAuthStateChanged(auth, async (user) => {
    // Limpiar suscripciones previas
    unsubscribes.forEach(unsub => unsub());
    unsubscribes = [];

    if (user) {
      console.log('👤 Usuario detectado (AppStore):', user.email);
      // 1. Cargar Settings (Documento único en colección raíz)
      const settingsRef = doc(db, 'app_settings', user.uid);
      unsubscribes.push(onSnapshot(settingsRef, 
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            console.log('📦 [AppStore] Settings loaded from app_settings');
            update(s => ({ 
              ...s, 
              settings: { ...s.settings, ...data.settings },
              dashboardLayout: data.dashboardLayout || []
            }));
          }
        },
        (error) => {
          console.error('❌ [AppStore] Error loading settings:', error);
        }
      ));

      // 2. Suscribirse a Colecciones (Colecciones raíz con filtro owner_id)
      const collectionsMap = [
        { key: 'schools', path: 'schools' },
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
        const collRef = collection(db, path);
        const q = query(collRef, where("owner_id", "==", user.uid));
        
        unsubscribes.push(onSnapshot(q, 
          (snap) => {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            update(s => ({ ...s, [key]: docs }));
          },
          (error) => {
            console.error(`❌ [AppStore] Error en colección raíz ${path}:`, error);
          }
        ));
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
    
    // Escuelas / Centros
    addSchool: async (school: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'schools');
      await addDoc(collRef, { 
        ...school, 
        owner_id: user.uid, 
        createdAt: new Date().toISOString() 
      });
    },
    removeSchool: async (id: string) => {
      await deleteDoc(doc(db, 'schools', id));
    },
    
    // Alumnos
    addStudent: async (student: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'students');
      await addDoc(collRef, { 
        ...student, 
        owner_id: user.uid,
        joinedAt: student.joinedAt || new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    },
    updateStudent: async (student: any) => {
      const { id, ...data } = student;
      const docRef = doc(db, 'students', id);
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeStudent: async (id: string) => {
      await deleteDoc(doc(db, 'students', id));
    },
    
    // Clases
    addClass: async (cls: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'classes');
      await addDoc(collRef, { 
        ...cls, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      });
    },
    updateClass: async (cls: any) => {
      const { id, ...data } = cls;
      await setDoc(doc(db, 'classes', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeClass: async (id: string) => {
      await deleteDoc(doc(db, 'classes', id));
    },
    
    // Torneos
    addTournament: async (tournament: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'tournaments');
      await addDoc(collRef, { 
        ...tournament, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      });
    },
    updateTournament: async (tournament: any) => {
      const { id, ...data } = tournament;
      await setDoc(doc(db, 'tournaments', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeTournament: async (id: string) => {
      await deleteDoc(doc(db, 'tournaments', id));
    },

    // Torneos Locales
    addLocalTournament: async (tournament: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'local_tournaments');
      const docRef = await addDoc(collRef, { 
        ...tournament, 
        owner_id: user.uid,
        school_id: tournament.school_id,
        createdAt: new Date().toISOString() 
      });
      return docRef.id;
    },
    updateLocalTournament: async (id: string, updates: any) => {
      const docRef = doc(db, 'local_tournaments', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeLocalTournament: async (id: string) => {
      await deleteDoc(doc(db, 'local_tournaments', id));
    },

    // Jugadores de Torneos Locales
    addLocalTournamentPlayer: async (player: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const docId = `${player.tournament_id}_${player.student_id}`;
      const docRef = doc(db, 'local_tournament_players', docId);
      await setDoc(docRef, { 
        ...player, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      }, { merge: true });
    },
    removeLocalTournamentPlayer: async (tournamentId: string, studentId: string) => {
      await deleteDoc(doc(db, 'local_tournament_players', `${tournamentId}_${studentId}`));
    },

    // Emparejamientos de Torneos Locales
    addLocalTournamentPairing: async (pairing: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'local_tournament_pairings');
      await addDoc(collRef, { 
        ...pairing, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      });
    },
    updateLocalTournamentPairing: async (id: string, updates: any) => {
      const docRef = doc(db, 'local_tournament_pairings', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },

    // Rondas de Torneos Locales
    addLocalTournamentRound: async (round: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const docId = `${round.tournament_id}_${round.round_no}`;
      const docRef = doc(db, 'local_tournament_rounds', docId);
      await setDoc(docRef, { 
        ...round, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      }, { merge: true });
    },
    updateLocalTournamentRound: async (id: string, updates: any) => {
      const docRef = doc(db, 'local_tournament_rounds', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    
    // Asistencia
    saveAttendance: async (record: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      if (record.id) {
        const { id, ...data } = record;
        await setDoc(doc(db, 'attendance', id), data, { merge: true });
      } else {
        const attendanceId = `${record.student_id}_${record.class_id}_${record.date}`;
        await setDoc(doc(db, 'attendance', attendanceId), { 
          ...record, 
          owner_id: user.uid,
          createdAt: new Date().toISOString() 
        });
      }
    },
    
    // Pagos
    addPayment: async (payment: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'payments');
      await addDoc(collRef, { 
        ...payment, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      });
    },
    removePayment: async (id: string) => {
      await deleteDoc(doc(db, 'payments', id));
    },

    // Habilidades (temario)
    addSkill: async (skill: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'skills');
      await addDoc(collRef, { 
        ...skill, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      });
    },
    updateSkill: async (skill: any) => {
      const { id, ...data } = skill;
      await setDoc(doc(db, 'skills', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeSkill: async (id: string) => {
      await deleteDoc(doc(db, 'skills', id));
    },

    // Settings
    updateSettings: async (settings: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const docRef = doc(db, 'app_settings', user.uid); // Cambiado a app_settings/{uid}
      const current = get(appStore);
      await setDoc(docRef, { 
        settings: { ...current.settings, ...settings },
        updatedAt: new Date().toISOString()
      }, { merge: true });
    },
    
    updateDashboardLayout: async (layout: string[]) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const docRef = doc(db, 'app_settings', user.uid);
      await setDoc(docRef, { dashboardLayout: layout }, { merge: true });
    },

    // Logros
    unlockAchievement: async (slug: string) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const current = get(appStore);
      if (current.unlockedAchievements.some((a: any) => a.id === slug)) return;
      const collRef = collection(db, 'achievements');
      await addDoc(collRef, { 
        id: slug, 
        owner_id: user.uid,
        unlockedAt: new Date().toISOString() 
      });
    }
  };
}

export const appStore = createAppStore();
