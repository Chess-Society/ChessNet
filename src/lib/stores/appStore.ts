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
  writeBatch,
  getDocs
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
import { user as authStoreUser, authInitialized as authStoreInitialized } from './auth';
import { uiStore } from './uiStore';
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
  let initializedCollections = new Set<string>();
  let unsubscribes: (() => void)[] = [];
  let lastUid: string | null = null;
  let dataCache: Record<string, string> = {};

  // Centralized subscription to handle user changes and synchronization
  let authUnsub: any = null;
  
  if (browser) {
    authUnsub = derived([authStoreUser, authStoreInitialized], ([$u, $ai]) => ({ user: $u, initialized: $ai }))
      .subscribe(async ({ user, initialized }) => {
        if (!initialized) return;

        // Strict UID check to prevent redundant listener initializations
        if (user && lastUid !== user.uid) {
          lastUid = user.uid;
          console.log(`🚀 [AppStore] Initializing listeners for user: ${user.email}`);

          // Clear previous unsubs
          unsubscribes.forEach(unsub => typeof unsub === 'function' && unsub());
          unsubscribes = [];
          initializedCollections.clear();
          dataCache = {}; // Clear cache on user change

          const userRef = doc(db, 'users', user.uid);
          
          // Use a variable to track if we're already syncing
          let isSyncingSettings = false;

          const unsubSettings = onSnapshot(userRef, 
            async (snap) => {
              if (isSyncingSettings) return;
              isSyncingSettings = true;

              try {
                const userEmail = (user.email || '').toLowerCase();
                
                if (!snap.exists()) {
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
            } catch (err) {
              console.error('❌ [AppStore] Error processing settings:', err);
            } finally {
              isSyncingSettings = false;
            }
            },
            (error) => {
              isSyncingSettings = false;
              console.error('❌ [AppStore] Settings error:', error);
            }
          );
          unsubscribes.push(unsubSettings);

          const collectionsMap = [
            { key: 'schools', path: 'schools' },
            { key: 'students', path: 'students' },
            { key: 'classes', path: 'classes' },
            { key: 'skills', path: 'skills' },
            { key: 'unlockedAchievements', path: 'achievements' }
          ];

          collectionsMap.forEach(({ key, path }) => {
            const collRef = collection(db, path);
            const q = query(collRef, where("owner_id", "==", user.uid));
            
            unsubscribes.push(onSnapshot(q, 
              (snap) => {
                const docs = snap.docs.map(d => {
                  const data = d.data();
                  return {
                    id: d.id,
                    ...data,
                    // Normalize legacy field names to camelCase
                    ownerId: data.ownerId || data.owner_id,
                    schoolId: data.schoolId || data.school_id,
                    classId: data.classId || data.class_id,
                    studentId: data.studentId || data.student_id,
                    tournamentId: data.tournamentId || data.tournament_id,
                    createdAt: data.createdAt || data.created_at,
                    updatedAt: data.updatedAt || data.updated_at
                  };
                });
                
                // PERFORMANCE: Only update if the data has actually changed
                // This prevents redundant re-renders of the entire appStore
                const currentDataAsString = JSON.stringify(docs);
                
                // Using a local cache to avoid redundant JSON operations
                if (dataCache[key] === currentDataAsString) return;
                dataCache[key] = currentDataAsString;

                // Mark collection as initialized after the first snapshot
                const isFirstLoad = !initializedCollections.has(key);
                if (isFirstLoad) {
                  initializedCollections.add(key);
                }

                update(s => {
                  const newState = { ...s } as any;
                  newState[key] = docs;
                  
                  // Handle achievement notifications logic
                  if (key === 'unlockedAchievements') {
                    const notifiedIds = docs.filter((d: any) => d.notified).map((d: any) => d.id);
                    
                    // 1. Clear established notifications that are now marked as notified on server
                    const filteredPending = s.pendingAchievementIds.filter(id => !notifiedIds.includes(id));
                    
                    let nextPending = filteredPending;
                    
                    // 2. Add new available ones only if NOT the first load of this collection
                    if (!isFirstLoad) {
                       const previouslyUnlocked = s.unlockedAchievements.map(a => a.id);
                       const newlyAdded = docs.filter((d: any) => !d.notified && !previouslyUnlocked.includes(d.id));
                       
                       if (newlyAdded.length > 0) {
                         const freshIds = newlyAdded.map((a: any) => a.id).filter(id => !filteredPending.includes(id));
                         nextPending = [...filteredPending, ...freshIds];
                       }
                    }
                    
                    newState.pendingAchievementIds = nextPending;
                  }

                  return newState;
                });
              },
              (error) => {
                if (error.code === 'permission-denied') return;
                console.error(`❌ [AppStore] Error in ${key}:`, error);
              }
            ));
          });

          isLoaded = true;
        } else if (!user) {
          set(initialState);
          isLoaded = false;
          lastUid = null;
        }
      });
  }

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
      try {
        const response = await fetch('/api/schools', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error removing school');
      } catch (error: any) {
        console.error('❌ [AppStore] Error removing school:', error);
        throw error;
      }
    },
    updateSchool: async (school: any) => {
      try {
        const response = await fetch('/api/schools', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(school)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error updating school');
        return result.school;
      } catch (error: any) {
        console.error('❌ [AppStore] Error updating school:', error);
        throw error;
      }
    },
    
    addStudent: async (student: any) => {
      const user = get(authStoreUser);
      const state = get(store);
      const isPremium = state.settings?.plan === 'premium';

      if (!isPremium && state.students.length >= 10) {
        toast.error(get(t)('pricing.limits.student_reached'));
        throw new Error('Limit reached');
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
      try {
        const response = await fetch('/api/students', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error updating student');
        return result.student;
      } catch (error: any) {
        console.error('❌ [AppStore] Error updating student:', error);
        throw error;
      }
    },
    removeStudent: async (id: string) => {
      try {
        const response = await fetch('/api/students', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error removing student');
      } catch (error: any) {
        console.error('❌ [AppStore] Error removing student:', error);
        throw error;
      }
    },
    
    addClass: async (cls: any) => {
      const user = get(authStoreUser);
      const state = get(store);
      const isPremium = state.settings?.plan === 'premium';

      if (!isPremium && state.classes.length >= 1) {
        toast.error(get(t)('pricing.limits.class_reached'));
        throw new Error('Limit reached');
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
      try {
        const response = await fetch('/api/classes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cls)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error updating class');
        return result.class;
      } catch (error: any) {
        console.error('❌ [AppStore] Error updating class:', error);
        throw error;
      }
    },
    removeClass: async (id: string) => {
      try {
        const response = await fetch('/api/classes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error removing class');
      } catch (error: any) {
        console.error('❌ [AppStore] Error removing class:', error);
        throw error;
      }
    },
    
    enrollStudent: async (classId: string, studentId: string) => {
      try {
        const response = await fetch('/api/class-students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ class_id: classId, student_id: studentId })
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Error enrolling student');
        }
      } catch (error) {
        console.error('❌ [AppStore] Error enrolling student:', error);
        throw error;
      }
    },

    unenrollStudent: async (classId: string, studentId: string) => {
      try {
        const response = await fetch(`/api/class-students?class_id=${classId}&student_id=${studentId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Error unenrolling student');
        }
      } catch (error) {
        console.error('❌ [AppStore] Error unenrolling student:', error);
        throw error;
      }
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

    addLocalTournamentPlayer: async (player: any) => {
      const user = get(authStoreUser);
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

    updateLocalTournamentPlayer: async (tournamentId: string, studentId: string, updates: any) => {
      const docId = `${tournamentId}_${studentId}`;
      const docRef = doc(db, 'local_tournament_players', docId);
      await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },

    addLocalTournamentPairing: async (pairing: any) => {
      const user = get(authStoreUser);
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
      const user = get(authStoreUser);
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
    removeLocalTournamentRound: async (tournamentId: string, roundNo: number) => {
      await deleteDoc(doc(db, 'local_tournament_rounds', `${tournamentId}_${roundNo}`));
    },
    removeLocalTournamentPairings: async (tournamentId: string, roundNo?: number) => {
      // Note: Full firestore removal should be handled via batch/query in the API
    },
    
    saveAttendance: async (record: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      
      const { id, ...data } = record;

      if (id) {
        await setDoc(doc(db, 'attendance', id), data, { merge: true });
      } else {
        const attendanceId = `${record.student_id}_${record.class_id}_${record.date}`;
        await setDoc(doc(db, 'attendance', attendanceId), { 
          ...data,
          id: attendanceId,
          owner_id: user.uid,
          createdAt: new Date().toISOString() 
        }, { merge: true });
      }
    },
    
    addPayment: async (payment: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");



      // Usar API para bypassear las Firestore Rules (el cliente no puede escribir en /payments)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al crear pago');
      return result.data;
    },
    updatePayment: async (payment: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");



      // Usar API para bypassear las Firestore Rules (el cliente no puede editar en /payments)
      try {
        const response = await fetch(`/api/payments?id=${encodeURIComponent(payment.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payment)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error al actualizar pago');
        return result.data;
      } catch (error: any) {
        console.error('❌ [AppStore] Error updating payment via API:', error);
        throw error;
      }
    },
    removePayment: async (id: string) => {
      const user = get(authStoreUser);

      
      // Optimistic update para mejor UX
      update(s => ({ ...s, payments: s.payments.filter(p => p.id !== id) }));
      
      try {
        // Usar API para bypassear las Firestore Rules (el cliente no puede borrar en /payments)
        const response = await fetch(`/api/payments?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Error al eliminar pago');
        }
      } catch (error) {
        console.error('❌ [AppStore] Error removing payment via API:', error);
        // El onSnapshot se encargará de restablecerlo si falla
        throw error;
      }
    },

    addSkill: async (skill: any) => {
      const user = get(authStoreUser);

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

      try {
        const response = await fetch('/api/skills', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skill)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error updating skill');
        return result.skill;
      } catch (error: any) {
        console.error('❌ [AppStore] Error updating skill:', error);
        throw error;
      }
    },
    removeSkill: async (id: string) => {
      const user = get(authStoreUser);

      try {
        const response = await fetch('/api/skills', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error removing skill');
      } catch (error: any) {
        console.error('❌ [AppStore] Error removing skill:', error);
        throw error;
      }
    },

    removeMultipleSkills: async (ids: string[]) => {
      const user = get(authStoreUser);

      
      const batch = writeBatch(db);
      ids.forEach(id => {
        batch.delete(doc(db, 'skills', id));
      });
      await batch.commit();
    },

    clearSyllabus: async () => {
      const user = get(authStoreUser);

      const skills = get(store).skills;
      if (skills.length === 0) return;
      
      const batch = writeBatch(db);
      skills.forEach(sk => {
        batch.delete(doc(db, 'skills', sk.id));
      });
      await batch.commit();
    },

    reorderSkills: async (reorderings: { id: string, order: number }[]) => {
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
      
      try {
        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skills.map(s => ({ ...s, active: true })))
        });
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Error importing curriculum');
        }
        
        toast.success(get(t)('skills.import_success') || 'Curriculum importado con éxito');
      } catch (error: any) {
        console.error('❌ [AppStore] Error importing curriculum:', error);
        toast.error('Error al importar el currículo');
        throw error;
      }
    },

    importTournamentTemplates: async (templates: any[]) => {
      const user = get(authStoreUser);
      if (!user) return;

      for (const template of templates) {
        const tournamentData = {
          ...template,
          status: 'upcoming',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

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
      if (!user) return;

      const current = get(store).unlockedAchievements;
      if (current.find((a: any) => a.id === achievementId)) return;

      // Usar API para bypassear las Firestore Rules (solo admin puede escribir en /achievements)
      try {
        const response = await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ achievementId })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error al desbloquear logro');
        if (!result.alreadyUnlocked) {
          update(s => ({
            ...s,
            pendingAchievementIds: [...s.pendingAchievementIds, achievementId]
          }));
        }
      } catch (error) {
        console.error('❌ [AppStore] Error unlocking achievement via API:', error);
      }
    },

    markAchievementAsNotified: async (achievementId: string) => {
      const user = get(authStoreUser);
      if (!user) return;

      // Optimistically clear locally
      update(s => ({
        ...s,
        pendingAchievementIds: s.pendingAchievementIds.filter(id => id !== achievementId)
      }));

      // Usar API para bypassear las Firestore Rules al marcar como notificado
      try {
        await fetch('/api/achievements', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ achievementId })
        });
      } catch (error) {
        console.error('❌ [AppStore] Error marking achievement as notified via API:', error);
      }
    },

    clearLastAchievement: () => {
      update(s => ({ ...s, lastUnlockedAchievement: null }));
    },

    syncAll: async () => {
      // Data is reactive via onSnapshot, but we provide this to satisfy the UI
      // and optionally trigger a re-fetch of non-reactive endpoints
      return new Promise(resolve => setTimeout(resolve, 500));
    },

    removeAllStudents: async () => {
      const state = get(store);
      const studentIds = state.students.map(s => s.id);
      if (studentIds.length === 0) return;
      
      // We use parallel calls because the API handles side effects for each student
      const promises = studentIds.map(id => appStore.removeStudent(id));
      await Promise.all(promises);
      toast.success(get(t)('students.all_deleted_success') || 'Todos los alumnos han sido eliminados');
    },

    removeAllClasses: async () => {
      const state = get(store);
      const classIds = state.classes.map(c => c.id);
      if (classIds.length === 0) return;

      // We use parallel calls because the API handles side effects for each class
      const promises = classIds.map(id => appStore.removeClass(id));
      await Promise.all(promises);
      toast.success(get(t)('classes.all_deleted_success') || 'Todas las clases han sido eliminadas');
    },

    removeAllSchools: async () => {
      const state = get(store);
      const schoolIds = state.schools.map(s => s.id);
      if (schoolIds.length === 0) return;

      const promises = schoolIds.map(id => appStore.removeSchool(id));
      await Promise.all(promises);
      toast.success(get(t)('schools.all_deleted_success') || 'Todos los centros han sido eliminados');
    },

    deleteAccount: async () => {
      const currentUser = get(authStoreUser);
      if (!currentUser) throw new Error("No authenticated user");

      // Llamar al endpoint que borra TODOS los datos en batch y la cuenta de Auth
      const response = await fetch('/api/users/me', { method: 'DELETE' });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.details || err.error || 'Error al eliminar cuenta');
      }
    }
  };
}

export const appStore = createAppStore();

// --- Automated Achievement Checker Task ---
// Runs independently of the data syncing loop to prevent recursive updates and race conditions
if (browser) {
  let timer: any;
  appStore.subscribe(state => {
    const user = get(authStoreUser);
    const initialized = get(authStoreInitialized);
    
    // Only check if authenticated, initialized, and we have minimum data
    if (!initialized || !user || !state.settings || (state.students.length === 0 && state.classes.length === 0)) return;

    clearTimeout(timer);
    timer = setTimeout(async () => {
      const { INSIGNIAS } = await import('$lib/constants/insignias');
      const currentUnlocked = state.unlockedAchievements.map(a => a.id);
      
      const stats = {
        classesCount: state.classes.length,
        studentsCount: state.students.length,
        schoolsCount: state.schools.length,
        lessonsCreatedCount: (state.skills || []).length,
        completedTournamentsCount: (state.localTournaments || []).filter((t: any) => t.status === 'completed').length,
        lobbyContributionsCount: (state.lobbySuggestions || []).filter((s: any) => s.authorId === user.uid).length
      };

      INSIGNIAS.forEach(insignia => {
        // Redundancy check: only call unlock if NOT already in state
        if (insignia.type === 'automatic' && !currentUnlocked.includes(insignia.id) && insignia.condition?.(stats)) {
          appStore.unlockAchievement(insignia.id);
        }
      });
    }, 3000); // 3 seconds to let snapshots settle
  });
}
