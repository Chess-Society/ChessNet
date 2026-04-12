import { writable, get } from 'svelte/store';
import { db, auth } from '$lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Estado inicial idéntico al original de gh-pages
const initialState = {
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
    plan: 'free',
    teacherName: '',
    teacherAvatar: ''
  },
  dashboardLayout: []
};

function createAppStore() {
  const { subscribe, set, update } = writable(initialState);
  let isLoaded = false;
  let unsubscribeFirestore: (() => void) | null = null;
  let saveTimeout: any = null;

  // Sincronizar con Firestore cuando cambia el estado (con debounce)
  function persistToFirestore(data: any) {
    if (!isLoaded || !auth.currentUser) return;

    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser!.uid, 'appData', 'v1');
        await setDoc(userDocRef, data);
        console.log('✅ Datos sincronizados con Firestore');
      } catch (error) {
        console.error('❌ Error al sincronizar con Firestore:', error);
      }
    }, 1000); // 1 segundo de debounce
  }

  // Cargar datos al iniciar sesión
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log('👤 Usuario detectado:', user.email);
      const userDocRef = doc(db, 'users', user.uid, 'appData', 'v1');
      
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          set({ ...initialState, ...data });
          console.log('📥 Datos cargados desde Firestore');
        } else {
          console.log('✨ Usuario nuevo, inicializando datos...');
          await setDoc(userDocRef, initialState);
          set(initialState);
        }
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
      } finally {
        isLoaded = true;
      }

      // Opcional: Escuchar cambios en tiempo real desde otros dispositivos
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeFirestore = onSnapshot(userDocRef, (snap) => {
        if (snap.exists() && isLoaded) {
          // Solo actualizar si el cambio no vino de nosotros (esto es complejo con Svelte stores, 
          // simplificamos dejando que el setDoc sea el primario por ahora)
        }
      });

    } else {
      console.log('🚪 Sesión cerrada, limpiando store');
      set(initialState);
      isLoaded = false;
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }
    }
  });

  return {
    subscribe,
    set: (data: any) => {
      set(data);
      persistToFirestore(data);
    },
    update: (fn: any) => {
      update(state => {
        const newState = fn(state);
        persistToFirestore(newState);
        return newState;
      });
    },

    // Métodos CRUD (idénticos a gh-pages)
    addCenter: (center: any) => update((s: any) => ({ ...s, centers: [...s.centers, center] })),
    removeCenter: (id: string) => update((s: any) => ({ ...s, centers: s.centers.filter((c: any) => c.id !== id) })),
    
    addStudent: (student: any) => {
      const newStudent = { ...student, joinedAt: student.joinedAt || new Date().toISOString() };
      update((s: any) => ({ ...s, students: [...s.students, newStudent] }));
    },
    updateStudent: (student: any) => update((s: any) => ({ ...s, students: s.students.map((st: any) => st.id === student.id ? student : st) })),
    removeStudent: (id: string) => update((s: any) => ({ ...s, students: s.students.filter((st: any) => st.id !== id) })),
    
    addClass: (cls: any) => update((s: any) => ({ ...s, classes: [...s.classes, cls] })),
    updateClass: (cls: any) => update((s: any) => ({ ...s, classes: s.classes.map((c: any) => c.id === cls.id ? cls : c) })),
    removeClass: (id: string) => update((s: any) => ({ ...s, classes: s.classes.filter((c: any) => c.id !== id) })),
    
    addSkill: (skill: any) => update((s: any) => ({ ...s, skills: [...s.skills, skill] })),
    updateSkill: (id: string, data: any) => update((s: any) => ({ ...s, skills: s.skills.map((sk: any) => sk.id === id ? { ...sk, ...data } : sk) })),
    deleteSkill: (id: string) => update((s: any) => ({ 
      ...s, 
      skills: s.skills.filter((sk: any) => sk.id !== id),
      students: s.students.map((st: any) => ({ ...st, skills: st.skills?.filter((sci: any) => sci !== id) || [] }))
    })),
    
    addTournament: (tournament: any) => update((s: any) => ({ ...s, tournaments: [...s.tournaments, tournament] })),
    updateTournament: (tournament: any) => update((s: any) => ({ ...s, tournaments: s.tournaments.map((t: any) => t.id === tournament.id ? tournament : t) })),
    removeTournament: (id: string) => update((s: any) => ({ ...s, tournaments: s.tournaments.filter((t: any) => t.id !== id) })),
    
    saveAttendance: (record: any) => update((s: any) => {
      const otherRecords = s.attendance.filter((r: any) => !(r.classId === record.classId && r.date === record.date));
      return { ...s, attendance: [...otherRecords, record] };
    }),
    
    addPayment: (payment: any) => update((s: any) => ({ ...s, payments: [payment, ...s.payments] })),
    removePayment: (id: string) => update((s: any) => ({ ...s, payments: s.payments.filter((p: any) => p.id !== id) })),
    
    updateDashboardLayout: (layout: string[]) => update((s: any) => ({ ...s, dashboardLayout: layout })),
    updateSettings: (settings: any) => update((s: any) => ({ ...s, settings: { ...s.settings, ...settings } })),
    
    unlockAchievement: (slug: string) => update((s: any) => {
      if (s.unlockedAchievements.some((a: any) => a.id === slug)) return s;
      return { ...s, unlockedAchievements: [...s.unlockedAchievements, { id: slug, unlockedAt: new Date().toISOString() }] };
    })
  };
}

export const appStore = createAppStore();
