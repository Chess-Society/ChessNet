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
import { browser } from '$app/environment';
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
  Attendance,
  CreateSkillForm
} from '$lib/types';
import { 
  user as authStoreUser, 
  authInitialized as authStoreInit 
} from './auth';

import { CHESS_SYLLABUS_PRESETS } from '$lib/constants/chess-presets';
import { ADMIN_EMAILS } from '$lib/constants';


// Interfaces para el estado global
export interface AppSettings {
  plan: string;
  teacherName: string;
  teacherAvatar: string;
  teacherEmail?: string;
  featuredInsignias?: string[]; // IDs of up to 3 featured insignias
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
  unlockedInsignias: any[];
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
    teacherAvatar: '',
    featuredInsignias: []
  },
  dashboardLayout: []
};

function createAppStore() {
  const { subscribe, set, update } = writable(initialState);
  let isLoaded = false;
  let unsubscribes: (() => void)[] = [];

  // Suscribirse al store de autenticación
  authStoreUser.subscribe(async (user) => {
    if (!browser) return;
    
    unsubscribes.forEach(unsub => unsub());
    unsubscribes = [];

    if (user) {
      const isMock = user.uid === 'chessnet-dev-uid';

      if (!isMock) {
        const userRef = doc(db, 'users', user.uid);
        onSnapshot(userRef, 
          async (snap) => {
            const userEmail = (user.email || '').toLowerCase();
            
            if (!snap.exists()) {
              console.log('✨ [AppStore] Initializing new user profile...');
              await setDoc(userRef, {
                email: userEmail,
                createdAt: new Date().toISOString(),
                settings: {
                  plan: 'free',
                  teacherName: user.displayName || '',
                  teacherAvatar: user.photoURL || '',
                  teacherEmail: userEmail
                }
              });
              return;
            }

            const data = snap.data();
            
            // Backfill createdAt if missing
            if (!data.createdAt) {
              await updateDoc(userRef, { createdAt: new Date().toISOString() });
            }

            update(currentState => {
              const settings = { 
                ...currentState.settings, 
                ...(data.settings || {}),
                teacherEmail: userEmail, // Ensure email is in state
                featuredInsignias: data.settings?.featuredInsignias || []
              };
              
              if (ADMIN_EMAILS.includes(userEmail)) settings.plan = 'premium';
              return { 
                ...currentState, 
                settings, 
                dashboardLayout: data.dashboardLayout || [] 
              };
            });
          },
          (error) => console.error('❌ [AppStore] Settings error:', error)
        );
      } else {
        update(currentState => ({
          ...currentState,
          settings: { ...currentState.settings, plan: 'premium', teacherName: 'ChessNet Admin' }
        }));
      }

      const collectionsMap = [
        { key: 'schools', path: 'schools', api: '/api/schools' },
        { key: 'students', path: 'students', api: '/api/students' },
        { key: 'classes', path: 'classes', api: '/api/classes' },
        { key: 'skills', path: 'skills', api: '/api/skills' },
        { key: 'attendance', path: 'attendance', api: '/api/attendance' },
        { key: 'localTournaments', path: 'local_tournaments', api: '/api/local_tournaments' },
        { key: 'localTournamentPlayers', path: 'local_tournament_players', api: '/api/local_tournament_players' },
        { key: 'localTournamentRounds', path: 'local_tournament_rounds', api: '/api/local_tournament_rounds' },
        { key: 'localTournamentPairings', path: 'local_tournament_pairings', api: '/api/local_tournament_pairings' },
        { key: 'payments', path: 'payments', api: '/api/payments' },
        { key: 'unlockedInsignias', path: 'achievements', api: '/api/achievements' }
      ];

      collectionsMap.forEach(({ key, path, api }) => {
        if (!isMock) {
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
          const saved = localStorage.getItem(`chessnet_mock_${key}`);
          if (saved) {
            try {
              const items = JSON.parse(saved);
              update(currentState => ({ ...currentState, [key]: items }));
            } catch (e) {
              console.error(`❌ [AppStore] Error parsing mock data for ${key}:`, e);
            }
          } else {
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

    addLocalTournament: async (tournament: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      
      if (user.uid === 'chessnet-dev-uid') {
        const newTournament = { 
          id: 'mock-lt-' + Date.now(), 
          ...tournament, 
          owner_id: user.uid,
          status: tournament.status || 'upcoming',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        update(s => ({ ...s, localTournaments: [...s.localTournaments, newTournament] }));
        localStorage.setItem('chessnet_mock_local_tournaments', JSON.stringify(get(appStore).localTournaments));
        return newTournament.id;
      }

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
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ 
          ...s, 
          localTournaments: s.localTournaments.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t) 
        }));
        localStorage.setItem('chessnet_mock_local_tournaments', JSON.stringify(get(appStore).localTournaments));
        return;
      }
      const docRef = doc(db, 'local_tournaments', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeLocalTournament: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, localTournaments: s.localTournaments.filter(t => t.id !== id) }));
        localStorage.setItem('chessnet_mock_local_tournaments', JSON.stringify(get(appStore).localTournaments));
        return;
      }
      await deleteDoc(doc(db, 'local_tournaments', id));
    },

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

    importCurriculum: async (skills: CreateSkillForm[]) => {
      const user = get(authStoreUser);
      if (!user) return;
      const isMock = user.uid === 'chessnet-dev-uid';
      
      for (const skill of skills) {
        if (isMock) {
          const newSkill = { 
            id: 'mock-skill-' + Math.random().toString(36).substr(2, 9), 
            ...skill, 
            owner_id: user.uid, 
            active: true, 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          update(s => ({ ...s, skills: [...s.skills, newSkill] }));
        } else {
          try {
            await fetch('/api/skills', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...skill, active: true })
            });
          } catch (error) {
            console.error('Error importing skill:', error);
          }
        }
      }
      
      if (isMock) {
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(appStore).skills));
      }
    },

    importTournamentTemplates: async (templates: any[]) => {
      const user = get(authStoreUser);
      if (!user) return;
      const isMock = user.uid === 'chessnet-dev-uid';

      for (const template of templates) {
        const tournamentData = {
          ...template,
          status: 'upcoming',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (isMock) {
          const newT = {
            id: 'mock-lt-' + Math.random().toString(36).substr(2, 9),
            ...tournamentData,
            owner_id: user.uid
          };
          update(s => ({ ...s, localTournaments: [...s.localTournaments, newT] }));
        } else {
          try {
            const collRef = collection(db, 'local_tournaments');
            await addDoc(collRef, { 
              ...tournamentData, 
              owner_id: user.uid
            });
          } catch (error) {
            console.error('Error importing template:', error);
          }
        }
      }

      if (isMock) {
        localStorage.setItem('chessnet_mock_local_tournaments', JSON.stringify(get(appStore).localTournaments));
      }
    },

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
