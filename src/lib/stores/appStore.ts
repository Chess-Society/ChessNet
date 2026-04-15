import { writable, get, derived } from 'svelte/store';
import { t } from '$lib/i18n';
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
import { 
  user as authStoreUser, 
  authInitialized as authStoreInit 
} from './auth';

import { ADMIN_EMAILS } from '$lib/constants';


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



  // Suscribirse al store de autenticación (en lugar de onAuthStateChanged de Firebase)
  // Esto permite que el Mock Login también dispare la carga de datos
  authStoreUser.subscribe(async (user) => {
    // Limpiar suscripciones previas
    unsubscribes.forEach(unsub => unsub());
    unsubscribes = [];

    if (user) {
      const isMock = user.uid === 'chessnet-dev-uid';

      // 1. Cargar Settings
      if (!isMock) {
        // Modo Real: Suscripción Firestore Client
        const userRef = doc(db, 'users', user.uid);
        unsubscribes.push(onSnapshot(userRef, 
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              update(currentState => {
                const settings = { ...currentState.settings, ...(data.settings || {}) };
                const userEmail = (user.email || '').toLowerCase();
                if (ADMIN_EMAILS.includes(userEmail)) settings.plan = 'premium';
                return { ...currentState, settings, dashboardLayout: data.dashboardLayout || [] };
              });
            }
          },
          (error) => console.error('❌ [AppStore] Settings error:', error)
        ));
      } else {
        // Modo Mock: Carga manual (o settings por defecto)
        update(currentState => ({
          ...currentState,
          settings: { ...currentState.settings, plan: 'premium', teacherName: 'ChessNet Admin' }
        }));
      }

      // 2. Suscribirse/Cargar Colecciones
      const collectionsMap = [
        { key: 'schools', path: 'schools', api: '/api/schools' },
        { key: 'students', path: 'students', api: '/api/students' },
        { key: 'classes', path: 'classes', api: '/api/classes' },
        { key: 'skills', path: 'skills', api: '/api/skills' }
        // ... añadir más si es necesario
      ];

      collectionsMap.forEach(({ key, path, api }) => {
        if (!isMock) {
          // Suscripción Real-Time (solo si hay login real de Firebase para evitar Permission Denied)
          const collRef = collection(db, path);
          const q = query(collRef, where("owner_id", "==", user.uid));
          
          unsubscribes.push(onSnapshot(q, 
            (snap) => {
              const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
              update(currentState => ({ ...currentState, [key]: docs }));
            },
            (error) => console.error(`❌ [AppStore] Error en ${path}:`, error)
          ));
        } else {
          // Modo Mock: Carga vía localStorage (offline persistence)
          const saved = localStorage.getItem(`chessnet_mock_${key}`);
          if (saved) {
            try {
              const items = JSON.parse(saved);
              update(currentState => ({ ...currentState, [key]: items }));
            } catch (e) {
              console.error(`❌ [AppStore] Error parsing mock data for ${key}:`, e);
            }
          } else {
            // Intentar fetch por si hay algo en DB, pero no fallar si falla
            fetch(api)
              .then(res => res.json())
              .then(data => {
                const items = data[key] || data.items || [];
                update(currentState => ({ ...currentState, [key]: items }));
                localStorage.setItem(`chessnet_mock_${key}`, JSON.stringify(items));
              })
              .catch(() => {});
          }
        }
      });

      isLoaded = true;
    } else {
      set(initialState);
      isLoaded = false;
    }
  });

  return {
    subscribe,
    // Métodos CRUD que escriben directamente en las sub-colecciones
    
    // ==========================================
    // REGION: ESCUELAS / CENTROS
    // ==========================================
    addSchool: async (school: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        const newSchool = { id: 'mock-school-' + Date.now(), ...school, owner_id: user.uid };
        update(s => ({ ...s, schools: [...s.schools, newSchool] }));
        localStorage.setItem('chessnet_mock_schools', JSON.stringify(get(appStore).schools));
        return newSchool;
      }
      try {
        const response = await fetch('/api/schools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(school)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error adding school');
        return result.school;
      } catch (error: any) {
        console.error('❌ [AppStore] Error adding school:', error);
        throw error;
      }
    },
    removeSchool: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, schools: s.schools.filter(school => school.id !== id) }));
        localStorage.setItem('chessnet_mock_schools', JSON.stringify(get(appStore).schools));
        return;
      }
      await deleteDoc(doc(db, 'schools', id));
    },
    
    
    // ==========================================
    // REGION: ALUMNOS
    // ==========================================
    addStudent: async (student: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        const newStudent = { id: 'mock-student-' + Date.now(), ...student, owner_id: user.uid };
        update(s => ({ ...s, students: [...s.students, newStudent] }));
        localStorage.setItem('chessnet_mock_students', JSON.stringify(get(appStore).students));
        return newStudent;
      }
      try {
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error adding student');
        return result.student;
      } catch (error: any) {
        console.error('❌ [AppStore] Error adding student:', error);
        throw error;
      }
    },
    updateStudent: async (student: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, students: s.students.map(std => std.id === student.id ? { ...std, ...student } : std) }));
        localStorage.setItem('chessnet_mock_students', JSON.stringify(get(appStore).students));
        return;
      }
      const { id, ...data } = student;
      const docRef = doc(db, 'students', id);
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeStudent: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, students: s.students.filter(std => std.id !== id) }));
        localStorage.setItem('chessnet_mock_students', JSON.stringify(get(appStore).students));
        return;
      }
      await deleteDoc(doc(db, 'students', id));
    },
    
    
    // ==========================================
    // REGION: CLASES
    // ==========================================
    addClass: async (cls: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        const newClass = { id: 'mock-class-' + Date.now(), ...cls, owner_id: user.uid };
        update(s => ({ ...s, classes: [...s.classes, newClass] }));
        localStorage.setItem('chessnet_mock_classes', JSON.stringify(get(appStore).classes));
        return newClass;
      }
      try {
        const response = await fetch('/api/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cls)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error adding class');
        return result.class;
      } catch (error: any) {
        console.error('❌ [AppStore] Error adding class:', error);
        throw error;
      }
    },
    updateClass: async (cls: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, classes: s.classes.map(c => c.id === cls.id ? { ...c, ...cls } : c) }));
        localStorage.setItem('chessnet_mock_classes', JSON.stringify(get(appStore).classes));
        return;
      }
      const { id, ...data } = cls;
      await setDoc(doc(db, 'classes', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeClass: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, classes: s.classes.filter(c => c.id !== id) }));
        localStorage.setItem('chessnet_mock_classes', JSON.stringify(get(appStore).classes));
        return;
      }
      await deleteDoc(doc(db, 'classes', id));
    },
    
    
    // ==========================================
    // REGION: TORNEOS GLOBALES
    // ==========================================
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

    
    // ==========================================
    // REGION: TORNEOS GLOBALES
    // ========================================== Locales
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
    
    
    // ==========================================
    // REGION: PAGOS
    // ==========================================
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
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        const newSkill = { id: 'mock-skill-' + Date.now(), ...skill, owner_id: user.uid };
        update(s => ({ ...s, skills: [...s.skills, newSkill] }));
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(appStore).skills));
        return newSkill;
      }
      try {
        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skill)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error adding skill');
        return result.skill;
      } catch (error: any) {
        console.error('❌ [AppStore] Error adding skill:', error);
        throw error;
      }
    },
    updateSkill: async (skill: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, skills: s.skills.map(sk => sk.id === skill.id ? { ...sk, ...skill } : sk) }));
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(appStore).skills));
        return;
      }
      const { id, ...data } = skill;
      await setDoc(doc(db, 'skills', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeSkill: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, skills: s.skills.filter(sk => sk.id !== id) }));
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(appStore).skills));
        return;
      }
      await deleteDoc(doc(db, 'skills', id));
    },

    
    // ==========================================
    // REGION: SETTINGS
    // ==========================================
    updateSettings: async (settings: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const docRef = doc(db, 'users', user.uid);
      const current = get(appStore);
      await setDoc(docRef, { 
        settings: { ...current.settings, ...settings },
        updatedAt: new Date().toISOString()
      }, { merge: true });
    },
    
    updateDashboardLayout: async (layout: string[]) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const docRef = doc(db, 'users', user.uid);
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
