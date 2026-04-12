import { w as writable } from "./index.js";
import { a as auth, d as db } from "./firebase.js";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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
    plan: "free",
    teacherName: "",
    teacherAvatar: ""
  },
  dashboardLayout: []
};
function createAppStore() {
  const { subscribe, set, update } = writable(initialState);
  let isLoaded = false;
  let unsubscribeFirestore = null;
  let saveTimeout = null;
  function persistToFirestore(data) {
    if (!isLoaded || !auth.currentUser) return;
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid, "appData", "v1");
        await setDoc(userDocRef, data);
        console.log("✅ Datos sincronizados con Firestore");
      } catch (error) {
        console.error("❌ Error al sincronizar con Firestore:", error);
      }
    }, 1e3);
  }
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("👤 Usuario detectado:", user.email);
      const userDocRef = doc(db, "users", user.uid, "appData", "v1");
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          set({ ...initialState, ...data });
          console.log("📥 Datos cargados desde Firestore");
        } else {
          console.log("✨ Usuario nuevo, inicializando datos...");
          await setDoc(userDocRef, initialState);
          set(initialState);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      } finally {
        isLoaded = true;
      }
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeFirestore = onSnapshot(userDocRef, (snap) => {
        if (snap.exists() && isLoaded) ;
      });
    } else {
      console.log("🚪 Sesión cerrada, limpiando store");
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
    set: (data) => {
      set(data);
      persistToFirestore(data);
    },
    update: (fn) => {
      update((state) => {
        const newState = fn(state);
        persistToFirestore(newState);
        return newState;
      });
    },
    // Métodos CRUD (idénticos a gh-pages)
    addCenter: (center) => update((s) => ({ ...s, centers: [...s.centers, center] })),
    removeCenter: (id) => update((s) => ({ ...s, centers: s.centers.filter((c) => c.id !== id) })),
    addStudent: (student) => {
      const newStudent = { ...student, joinedAt: student.joinedAt || (/* @__PURE__ */ new Date()).toISOString() };
      update((s) => ({ ...s, students: [...s.students, newStudent] }));
    },
    updateStudent: (student) => update((s) => ({ ...s, students: s.students.map((st) => st.id === student.id ? student : st) })),
    removeStudent: (id) => update((s) => ({ ...s, students: s.students.filter((st) => st.id !== id) })),
    addClass: (cls) => update((s) => ({ ...s, classes: [...s.classes, cls] })),
    updateClass: (cls) => update((s) => ({ ...s, classes: s.classes.map((c) => c.id === cls.id ? cls : c) })),
    removeClass: (id) => update((s) => ({ ...s, classes: s.classes.filter((c) => c.id !== id) })),
    addSkill: (skill) => update((s) => ({ ...s, skills: [...s.skills, skill] })),
    updateSkill: (id, data) => update((s) => ({ ...s, skills: s.skills.map((sk) => sk.id === id ? { ...sk, ...data } : sk) })),
    deleteSkill: (id) => update((s) => ({
      ...s,
      skills: s.skills.filter((sk) => sk.id !== id),
      students: s.students.map((st) => ({ ...st, skills: st.skills?.filter((sci) => sci !== id) || [] }))
    })),
    addTournament: (tournament) => update((s) => ({ ...s, tournaments: [...s.tournaments, tournament] })),
    updateTournament: (tournament) => update((s) => ({ ...s, tournaments: s.tournaments.map((t) => t.id === tournament.id ? tournament : t) })),
    removeTournament: (id) => update((s) => ({ ...s, tournaments: s.tournaments.filter((t) => t.id !== id) })),
    saveAttendance: (record) => update((s) => {
      const otherRecords = s.attendance.filter((r) => !(r.classId === record.classId && r.date === record.date));
      return { ...s, attendance: [...otherRecords, record] };
    }),
    addPayment: (payment) => update((s) => ({ ...s, payments: [payment, ...s.payments] })),
    removePayment: (id) => update((s) => ({ ...s, payments: s.payments.filter((p) => p.id !== id) })),
    updateDashboardLayout: (layout) => update((s) => ({ ...s, dashboardLayout: layout })),
    updateSettings: (settings) => update((s) => ({ ...s, settings: { ...s.settings, ...settings } })),
    unlockAchievement: (slug) => update((s) => {
      if (s.unlockedAchievements.some((a) => a.id === slug)) return s;
      return { ...s, unlockedAchievements: [...s.unlockedAchievements, { id: slug, unlockedAt: (/* @__PURE__ */ new Date()).toISOString() }] };
    })
  };
}
const appStore = createAppStore();
export {
  appStore as a
};
