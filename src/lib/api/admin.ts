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
  Timestamp,
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
   * Obtiene la lista de usuarios (profesores) con métricas básicas.
   */
  async getUsersList(limitCount = 100) {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(limitCount));
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
  }
};
