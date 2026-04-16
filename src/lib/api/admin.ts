import { db } from "$lib/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  getCountFromServer,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";

export const adminApi = {
  /**
   * Obtiene estadísticas globales de la plataforma.
   */
  async getGlobalStats() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      usersSnap,
      studentsSnap,
      schoolsSnap,
      classesSnap,
      premiumSnap,
      recentSnap
    ] = await Promise.all([
      getCountFromServer(collection(db, "users")),
      getCountFromServer(collection(db, "students")),
      getCountFromServer(collection(db, "schools")),
      getCountFromServer(collection(db, "classes")),
      getCountFromServer(query(collection(db, "users"), where("settings.plan", "==", "premium"))),
      getCountFromServer(query(collection(db, "users"), where("createdAt", ">=", sevenDaysAgo.toISOString())))
    ]);

    return {
      totalUsers: usersSnap.data().count,
      totalStudents: studentsSnap.data().count,
      totalSchools: schoolsSnap.data().count,
      totalClasses: classesSnap.data().count,
      premiumUsers: premiumSnap.data().count,
      recentUsers: recentSnap.data().count
    };
  },

  /**
   * Obtiene la lista de usuarios (profesores) con soporte para búsqueda.
   */
  async getUsersList(limitCount = 100, emailSearch = "") {
    let q;
    const usersRef = collection(db, "users");

    if (emailSearch) {
      // Búsqueda simple por prefijo (Firestore limitation: exact match or range)
      // Nota: Para búsquedas más potentes se usaría Algolia/ElasticSearch
      q = query(
        usersRef, 
        where("email", ">=", emailSearch),
        where("email", "<=", emailSearch + "\uf8ff"),
        limit(limitCount)
      );
    } else {
      q = query(usersRef, orderBy("createdAt", "desc"), limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  /**
   * Obtiene anuncios globales del sistema.
   */
  async getGlobalAnnouncements() {
    const q = query(
      collection(db, "announcements"), 
      where("is_global", "==", true),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async deleteAnnouncement(id: string) {
    await deleteDoc(doc(db, "announcements", id));
  },

  /**
   * Gestión del Estado de Mantenimiento
   */
  async getMaintenanceStatus() {
    const configRef = doc(db, "system", "config");
    const snap = await getDoc(configRef);
    if (!snap.exists()) return { maintenanceMode: false };
    return snap.data();
  },

  async toggleMaintenanceMode(enabled: boolean) {
    const configRef = doc(db, "system", "config");
    await setDoc(configRef, { 
      maintenanceMode: enabled,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  /**
   * Obtiene detalles profundos de un usuario (conteos de entidades).
   */
  async getUserDetails(userId: string) {
    const [schoolsSnap, classesSnap, studentsSnap] = await Promise.all([
      getCountFromServer(query(collection(db, "schools"), where("teacherId", "==", userId))),
      getCountFromServer(query(collection(db, "classes"), where("teacherId", "==", userId))),
      getCountFromServer(query(collection(db, "students"), where("teacherId", "==", userId)))
    ]);

    return {
      schools: schoolsSnap.data().count,
      classes: classesSnap.data().count,
      students: studentsSnap.data().count
    };
  },

  /**
   * Logs del Sistema
   */
  async getSystemLogs(limitCount = 50) {
    const q = query(
      collection(db, "system_logs"), 
      orderBy("timestamp", "desc"), 
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Lobby Moderation
   */
  async getLobbySuggestions() {
    const q = query(collection(db, "lobby_suggestions"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateSuggestionStatus(id: string, status: string) {
    const docRef = doc(db, "lobby_suggestions", id);
    await updateDoc(docRef, { status });
  },

  async getLobbyAnnouncements() {
    const q = query(collection(db, "lobby_announcements"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
