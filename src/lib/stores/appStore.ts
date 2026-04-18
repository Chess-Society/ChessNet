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
  where,
  writeBatch
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
import { toast } from './toast';

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
  lobbySuggestions: any[];
  unlockedAchievements: any[];
  pendingAchievementIds: string[]; // Queue for sequential display
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
  lobbySuggestions: [],
  unlockedAchievements: [],
  pendingAchievementIds: [],
  settings: { 
    plan: 'free',
    teacherName: '',
    teacherAvatar: '',
    featuredInsignias: []
  },
  dashboardLayout: []
};

function createAppStore() {
  const store = writable(initialState);
  const { subscribe, set, update } = store;
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
        { key: 'unlockedAchievements', path: 'achievements', api: '/api/achievements' },
        { key: 'lobbySuggestions', path: 'lobby_suggestions', api: '/api/lobby_suggestions' }
      ];

      collectionsMap.forEach(({ key, path, api }) => {
        if (!isMock) {
          const collRef = collection(db, path);
          const q = query(collRef, where("owner_id", "==", user.uid));
          
          unsubscribes.push(onSnapshot(q, 
            (snap) => {
              const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
              
              if (key === 'unlockedAchievements' && isLoaded) {
                 const currentState = get(store);
                 const currentIds = currentState.unlockedAchievements.map((a: any) => a.id);
                 
                 // Detect newly added achievements that are NOT notified
                 const newAvailable = docs.filter((d: any) => 
                    !d.notified && !currentIds.includes(d.id)
                 );
                 
                 if (newAvailable.length > 0) {
                    update(s => ({ 
                      ...s, 
                      pendingAchievementIds: [
                        ...s.pendingAchievementIds, 
                        ...newAvailable.map((a: any) => a.id)
                      ]
                    }));
                 }
              }

              update(currentState => {
                const newState = { ...currentState, [key]: docs };
                
                // Achievement Checker (Automated Delivery)
                if (isLoaded) {
                   import('$lib/constants/insignias').then(({ INSIGNIAS }) => {
                      const stats = {
                        classesCount: newState.classes.length,
                        studentsCount: newState.students.length,
                        schoolsCount: newState.schools.length,
                        lessonsCreatedCount: newState.skills.length,
                        completedTournamentsCount: newState.localTournaments.filter(t => t.status === 'completed').length,
                        lobbyContributionsCount: newState.lobbySuggestions.filter(s => s.authorId === user.uid).length
                      };

                     INSIGNIAS.forEach(insignia => {
                       if (insignia.type === 'automatic' && insignia.condition?.(stats)) {
                         appStore.unlockAchievement(insignia.id);
                       }
                     });
                   });
                }

                return newState;
              });
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
      const state = get(store);
      const isPremium = state.settings?.plan === 'premium';
      
      if (!isPremium && state.schools.length >= 1) {
        toast.error(get(t)('pricing.limits.school_reached'));
        throw new Error('Limit reached');
      }

      if (user?.uid === 'chessnet-dev-uid') {
        const newSchool = { id: 'mock-school-' + Date.now(), ...school, owner_id: user.uid };
        update(s => ({ ...s, schools: [...s.schools, newSchool] }));
        localStorage.setItem('chessnet_mock_schools', JSON.stringify(get(store).schools));
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
        localStorage.setItem('chessnet_mock_schools', JSON.stringify(get(store).schools));
        return;
      }
      await deleteDoc(doc(db, 'schools', id));
    },
    
    addStudent: async (student: any) => {
      const user = get(authStoreUser);
      const state = get(store);
      const isPremium = state.settings?.plan === 'premium';

      if (!isPremium && state.students.length >= 10) {
        toast.error(get(t)('pricing.limits.student_reached'));
        throw new Error('Limit reached');
      }

      if (user?.uid === 'chessnet-dev-uid') {
        const newStudent = { id: 'mock-student-' + Date.now(), ...student, owner_id: user.uid };
        update(s => ({ ...s, students: [...s.students, newStudent] }));
        localStorage.setItem('chessnet_mock_students', JSON.stringify(get(store).students));
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
        localStorage.setItem('chessnet_mock_students', JSON.stringify(get(store).students));
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
        localStorage.setItem('chessnet_mock_students', JSON.stringify(get(store).students));
        return;
      }
      await deleteDoc(doc(db, 'students', id));
    },
    
    addClass: async (cls: any) => {
      const user = get(authStoreUser);
      const state = get(store);
      const isPremium = state.settings?.plan === 'premium';

      if (!isPremium && state.classes.length >= 1) {
        toast.error(get(t)('pricing.limits.class_reached'));
        throw new Error('Limit reached');
      }

      if (user?.uid === 'chessnet-dev-uid') {
        const newClass = { id: 'mock-class-' + Date.now(), ...cls, owner_id: user.uid };
        update(s => ({ ...s, classes: [...s.classes, newClass] }));
        localStorage.setItem('chessnet_mock_classes', JSON.stringify(get(store).classes));
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
        localStorage.setItem('chessnet_mock_classes', JSON.stringify(get(store).classes));
        return;
      }
      const { id, ...data } = cls;
      await setDoc(doc(db, 'classes', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeClass: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, classes: s.classes.filter(c => c.id !== id) }));
        localStorage.setItem('chessnet_mock_classes', JSON.stringify(get(store).classes));
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
        localStorage.setItem('chessnet_mock_localTournaments', JSON.stringify(get(store).localTournaments));
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
        localStorage.setItem('chessnet_mock_localTournaments', JSON.stringify(get(store).localTournaments));
        return;
      }
      const docRef = doc(db, 'local_tournaments', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeLocalTournament: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, localTournaments: s.localTournaments.filter(t => t.id !== id) }));
        localStorage.setItem('chessnet_mock_localTournaments', JSON.stringify(get(store).localTournaments));
        return;
      }
      await deleteDoc(doc(db, 'local_tournaments', id));
    },

    addLocalTournamentPlayer: async (player: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      
      if (user.uid === 'chessnet-dev-uid') {
          const newPlayer = { ...player, id: `${player.tournament_id}_${player.student_id}`, owner_id: user.uid, createdAt: new Date().toISOString() };
          update(s => ({ ...s, localTournamentPlayers: [...s.localTournamentPlayers, newPlayer] }));
          localStorage.setItem('chessnet_mock_localTournamentPlayers', JSON.stringify(get(store).localTournamentPlayers));
          return;
      }

      const docId = `${player.tournament_id}_${player.student_id}`;
      const docRef = doc(db, 'local_tournament_players', docId);
      await setDoc(docRef, { 
        ...player, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      }, { merge: true });
    },
    removeLocalTournamentPlayer: async (tournamentId: string, studentId: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
          const docId = `${tournamentId}_${studentId}`;
          update(s => ({ ...s, localTournamentPlayers: s.localTournamentPlayers.filter(p => p.id !== docId) }));
          localStorage.setItem('chessnet_mock_localTournamentPlayers', JSON.stringify(get(store).localTournamentPlayers));
          return;
      }
      await deleteDoc(doc(db, 'local_tournament_players', `${tournamentId}_${studentId}`));
    },

    updateLocalTournamentPlayer: async (tournamentId: string, studentId: string, updates: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
          const docId = `${tournamentId}_${studentId}`;
          update(s => ({ 
            ...s, 
            localTournamentPlayers: s.localTournamentPlayers.map(p => p.id === docId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p) 
          }));
          localStorage.setItem('chessnet_mock_localTournamentPlayers', JSON.stringify(get(store).localTournamentPlayers));
          return;
      }
      const docId = `${tournamentId}_${studentId}`;
      const docRef = doc(db, 'local_tournament_players', docId);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },

    addLocalTournamentPairing: async (pairing: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      
      if (user.uid === 'chessnet-dev-uid') {
          const newPairing = { 
            ...pairing, 
            id: 'mock-pair-' + Math.random().toString(36).substr(2, 9), 
            owner_id: user.uid, 
            createdAt: new Date().toISOString() 
          };
          update(s => ({ ...s, localTournamentPairings: [...s.localTournamentPairings, newPairing] }));
          localStorage.setItem('chessnet_mock_localTournamentPairings', JSON.stringify(get(store).localTournamentPairings));
          return;
      }

      const collRef = collection(db, 'local_tournament_pairings');
      await addDoc(collRef, { 
        ...pairing, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      });
    },
    updateLocalTournamentPairing: async (id: string, updates: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
          update(s => ({ 
            ...s, 
            localTournamentPairings: s.localTournamentPairings.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p) 
          }));
          localStorage.setItem('chessnet_mock_localTournamentPairings', JSON.stringify(get(store).localTournamentPairings));
          return;
      }
      const docRef = doc(db, 'local_tournament_pairings', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },

    addLocalTournamentRound: async (round: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      
      if (user.uid === 'chessnet-dev-uid') {
          const newRound = { ...round, id: `${round.tournament_id}_${round.round_no}`, owner_id: user.uid, createdAt: new Date().toISOString() };
          update(s => ({ ...s, localTournamentRounds: [...s.localTournamentRounds, newRound] }));
          localStorage.setItem('chessnet_mock_localTournamentRounds', JSON.stringify(get(store).localTournamentRounds));
          return;
      }

      const docId = `${round.tournament_id}_${round.round_no}`;
      const docRef = doc(db, 'local_tournament_rounds', docId);
      await setDoc(docRef, { 
        ...round, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      }, { merge: true });
    },
    updateLocalTournamentRound: async (id: string, updates: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
          update(s => ({ 
            ...s, 
            localTournamentRounds: s.localTournamentRounds.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r) 
          }));
          localStorage.setItem('chessnet_mock_localTournamentRounds', JSON.stringify(get(store).localTournamentRounds));
          return;
      }
      const docRef = doc(db, 'local_tournament_rounds', id);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeLocalTournamentRound: async (tournamentId: string, roundNo: number) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
          const docId = `${tournamentId}_${roundNo}`;
          update(s => ({ 
            ...s, 
            localTournamentRounds: s.localTournamentRounds.filter(r => r.id !== docId) 
          }));
          localStorage.setItem('chessnet_mock_localTournamentRounds', JSON.stringify(get(store).localTournamentRounds));
          return;
      }
      await deleteDoc(doc(db, 'local_tournament_rounds', `${tournamentId}_${roundNo}`));
    },
    removeLocalTournamentPairings: async (tournamentId: string, roundNo?: number) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
          update(s => ({ 
            ...s, 
            localTournamentPairings: s.localTournamentPairings.filter(p => {
              const matchT = p.tournament_id === tournamentId;
              const matchR = roundNo ? p.round_no === roundNo : true;
              return !(matchT && matchR);
            }) 
          }));
          localStorage.setItem('chessnet_mock_localTournamentPairings', JSON.stringify(get(store).localTournamentPairings));
          return;
      }
      // Note: Full firestore removal should be handled via batch/query in the API
    },
    
    saveAttendance: async (record: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      
      if (user.uid === 'chessnet-dev-uid') {
          const attendanceId = record.id || `${record.student_id}_${record.class_id}_${record.date}`;
          const newRecord = { ...record, id: attendanceId, owner_id: user.uid, createdAt: new Date().toISOString() };
          
          update(s => {
              const exists = s.attendance.find(a => a.id === attendanceId);
              const newAttendance = exists 
                ? s.attendance.map(a => a.id === attendanceId ? newRecord : a)
                : [...s.attendance, newRecord];
              return { ...s, attendance: newAttendance };
          });
          localStorage.setItem('chessnet_mock_attendance', JSON.stringify(get(store).attendance));
          return;
      }

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
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");

      if (user.uid === 'chessnet-dev-uid') {
        const newPayment = { 
          id: 'mock-pay-' + Date.now(), 
          ...payment, 
          owner_id: user.uid,
          createdAt: new Date().toISOString() 
        };
        update(s => ({ ...s, payments: [...s.payments, newPayment] }));
        localStorage.setItem('chessnet_mock_payments', JSON.stringify(get(store).payments));
        return newPayment;
      }

      const collRef = collection(db, 'payments');
      const docRef = await addDoc(collRef, { 
        ...payment, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      });
      return { id: docRef.id, ...payment };
    },
    updatePayment: async (payment: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");

      if (user.uid === 'chessnet-dev-uid') {
        update(s => ({ 
          ...s, 
          payments: s.payments.map(p => p.id === payment.id ? { ...p, ...payment, updatedAt: new Date().toISOString() } : p) 
        }));
        localStorage.setItem('chessnet_mock_payments', JSON.stringify(get(store).payments));
        return;
      }

      const { id, ...data } = payment;
      const docRef = doc(db, 'payments', id);
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removePayment: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, payments: s.payments.filter(p => p.id !== id) }));
        localStorage.setItem('chessnet_mock_payments', JSON.stringify(get(store).payments));
        return;
      }
      await deleteDoc(doc(db, 'payments', id));
    },

    addSkill: async (skill: any) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        const newSkill = { id: 'mock-skill-' + Date.now(), ...skill, owner_id: user.uid };
        update(s => ({ ...s, skills: [...s.skills, newSkill] }));
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(store).skills));
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
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(store).skills));
        return;
      }
      const { id, ...data } = skill;
      await setDoc(doc(db, 'skills', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeSkill: async (id: string) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, skills: s.skills.filter(sk => sk.id !== id) }));
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(store).skills));
        return;
      }
      await deleteDoc(doc(db, 'skills', id));
    },

    removeMultipleSkills: async (ids: string[]) => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, skills: s.skills.filter(sk => !ids.includes(sk.id)) }));
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(store).skills));
        return;
      }
      
      const batch = writeBatch(db);
      ids.forEach(id => {
        batch.delete(doc(db, 'skills', id));
      });
      await batch.commit();
    },

    clearSyllabus: async () => {
      const user = get(authStoreUser);
      if (user?.uid === 'chessnet-dev-uid') {
        update(s => ({ ...s, skills: [] }));
        localStorage.setItem('chessnet_mock_skills', JSON.stringify([]));
        return;
      }
      const skills = get(store).skills;
      if (skills.length === 0) return;
      
      const batch = writeBatch(db);
      skills.forEach(sk => {
        batch.delete(doc(db, 'skills', sk.id));
      });
      await batch.commit();
    },

    reorderSkills: async (reorderings: { id: string, order: number }[]) => {
      const user = get(authStoreUser);
      const isMock = user?.uid === 'chessnet-dev-uid';

      if (isMock) {
        update(s => ({
          ...s,
          skills: s.skills.map(sk => {
            const update = reorderings.find(r => r.id === sk.id);
            return update ? { ...sk, order: update.order } : sk;
          })
        }));
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(store).skills));
        return;
      }

      const batch = writeBatch(db);
      reorderings.forEach(({ id, order }) => {
        batch.update(doc(db, 'skills', id), { 
          order, 
          updatedAt: new Date().toISOString() 
        });
      });
      await batch.commit();
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
        localStorage.setItem('chessnet_mock_skills', JSON.stringify(get(store).skills));
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
        localStorage.setItem('chessnet_mock_localTournaments', JSON.stringify(get(store).localTournaments));
      }
    },

    updateSettings: async (settings: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const docRef = doc(db, 'users', user.uid);
      const current = get(store);
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

    unlockAchievement: async (achievementId: string) => {
      const user = get(authStoreUser);
      if (!user || user.uid === 'chessnet-dev-uid') return;

      const current = get(store).unlockedAchievements;
      if (current.find((a: any) => a.id === achievementId)) return;

      const collRef = collection(db, 'achievements');
      await addDoc(collRef, {
        id: achievementId,
        owner_id: user.uid,
        unlockedAt: new Date().toISOString(),
        notified: false
      });
      
      // Update local queue manually for immediate response if needed (snapshot will also catch it)
      update(s => ({
        ...s,
        pendingAchievementIds: [...s.pendingAchievementIds, achievementId]
      }));
    },

    markAchievementAsNotified: async (achievementId: string) => {
      const user = get(authStoreUser);
      if (!user) return;

      // Update state
      update(s => ({
        ...s,
        pendingAchievementIds: s.pendingAchievementIds.filter(id => id !== achievementId)
      }));

      if (user.uid === 'chessnet-dev-uid') return;

      // Importar getDocs dinámicamente si no está en el scope
      const { getDocs } = await import('firebase/firestore');

      // Update Firestore
      const q = query(
        collection(db, 'achievements'),
        where('owner_id', '==', user.uid),
        where('id', '==', achievementId)
      );
      const snap = await getDocs(q);
      const promises = snap.docs.map(d => updateDoc(doc(db, 'achievements', d.id), { notified: true }));
      await Promise.all(promises);
    },

    clearLastAchievement: () => {
      update(s => ({ ...s, lastUnlockedAchievement: null }));
    }
  };
}

export const appStore = createAppStore();
