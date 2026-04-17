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
  deleteDoc,
  addDoc
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
      recentSnap,
      insigniasSnap,
      paymentsSnap
    ] = await Promise.all([
      getCountFromServer(collection(db, "users")),
      getCountFromServer(collection(db, "students")),
      getCountFromServer(collection(db, "schools")),
      getCountFromServer(collection(db, "classes")),
      getCountFromServer(query(collection(db, "users"), where("settings.plan", "==", "premium"))),
      getCountFromServer(query(collection(db, "users"), where("createdAt", ">=", sevenDaysAgo.toISOString()))),
      getCountFromServer(collection(db, "achievements")),
      getDocs(collection(db, "payments"))
    ]);

    const totalRevenue = paymentsSnap.docs.reduce((acc, d) => acc + (d.data().amount || 0), 0);

    return {
      totalUsers: usersSnap.data().count,
      totalStudents: studentsSnap.data().count,
      totalSchools: schoolsSnap.data().count,
      totalClasses: classesSnap.data().count,
      premiumUsers: premiumSnap.data().count,
      recentUsers: recentSnap.data().count,
      totalInsignias: insigniasSnap.data().count,
      totalRevenue
    };
  },

  /**
   * Obtiene la lista de usuarios (profesores) con soporte para búsqueda.
   */
  async getUsersList(limitCount = 100, emailSearch = "") {
    let q;
    const usersRef = collection(db, "users");

    if (emailSearch) {
      q = query(
        usersRef, 
        where("email", ">=", emailSearch),
        where("email", "<=", emailSearch + "\uf8ff"),
        limit(limitCount)
      );
    } else {
      q = query(usersRef, orderBy("email"), limit(limitCount));
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
   * Obtiene las insignias desbloqueadas de un usuario.
   */
  async getUserInsignias(userId: string) {
    const q = query(collection(db, "achievements"), where("owner_id", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
  },

  /**
   * Concede una insignia especial a un usuario.
   */
  async awardInsignia(userId: string, insigniaId: string) {
    const collRef = collection(db, "achievements");
    const logRef = collection(db, "system_logs");
    const userRef = doc(db, "users", userId);
    
    // Importación dinámica para evitar conflictos si no está en el root
    const { increment } = await import('firebase/firestore');

    await Promise.all([
      addDoc(collRef, {
        id: insigniaId,
        owner_id: userId,
        unlockedAt: new Date().toISOString(),
        notified: false
      }),
      updateDoc(userRef, {
        badgesCount: increment(1)
      }),
      addDoc(logRef, {
        type: 'insignia_awarded',
        action: 'Concesión de Insignia',
        details: `Insignia ${insigniaId} concedida manualmente al usuario ${userId}`,
        timestamp: new Date().toISOString(),
        status: 'success'
      })
    ]);
  },

  /**
   * Revoca una insignia de un usuario.
   */
  async revokeInsignia(userId: string, insigniaId: string) {
    const q = query(
      collection(db, "achievements"), 
      where("owner_id", "==", userId),
      where("id", "==", insigniaId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map(d => deleteDoc(doc(db, "achievements", d.id)));
    
    const userRef = doc(db, "users", userId);
    const { increment } = await import('firebase/firestore');

    await Promise.all([
      ...promises,
      updateDoc(userRef, {
        badgesCount: increment(-1)
      })
    ]);
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

  async deleteSuggestion(id: string) {
    await deleteDoc(doc(db, "lobby_suggestions", id));
  },

  async getLobbyAnnouncements() {
    const q = query(collection(db, "lobby_announcements"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Concede acceso premium temporal a un usuario.
   */
  async grantTrial(userId: string, days: number) {
    const userRef = doc(db, "users", userId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await updateDoc(userRef, {
      "settings.plan": "premium",
      "settings.planExpiresAt": expiresAt.toISOString(),
      "settings.updatedAt": new Date().toISOString()
    });

    return { expiresAt: expiresAt.toISOString() };
  },

  /**
   * Revoca totalmente el acceso premium de un usuario.
   */
  async revokePremium(userId: string) {
    const userRef = doc(db, "users", userId);
    const appDataRef = doc(db, "users", userId, "appData", "v1");

    // Limpiamos TODAS las rutas posibles donde se guardaba el plan
    const updates: any = {
      "settings.plan": "free",
      "settings.planExpiresAt": null,
      "settings.updatedAt": new Date().toISOString(),
      // Limpieza de campos legacy si existen (usando dot notation)
      "config.settings.subscription.plan": null,
      "config.settings.subscription.status": null
    };

    await updateDoc(userRef, updates);

    // También limpiamos appData si existe
    try {
      const snap = await getDoc(appDataRef);
      if (snap.exists()) {
        await updateDoc(appDataRef, {
          "settings.plan": "free",
          "settings.planExpiresAt": null
        });
      }
    } catch (e) {
      console.warn("[AdminAPI] appData/v1 non-existent or inaccessible for user", userId);
    }
  },

  /**
   * REPARACIÓN DE DATOS: 
   * Asegura que todos los documentos de usuario tengan createdAt
   */
  async repairUsersData() {
    const usersSnap = await getDocs(collection(db, "users"));
    console.log(`[AdminAPI] Repairing ${usersSnap.size} users...`);
    
    let repairedCount = 0;
    const promises = usersSnap.docs.map(async (docSnap) => {
      const data = docSnap.data();
      let needsUpdate = false;
      const updates: any = {};

      // 1. Asegurar createdAt
      if (!data.createdAt) {
        updates.createdAt = new Date().toISOString();
        needsUpdate = true;
      }

      // 2. Calcular insignias reales
      const q = query(collection(db, "achievements"), where("owner_id", "==", docSnap.id));
      const achievementsSnap = await getDocs(q);
      const actualCount = achievementsSnap.size;

      if (data.badgesCount !== actualCount) {
        updates.badgesCount = actualCount;
        needsUpdate = true;
      }

      // 3. Marcar insignias antiguas como notificadas para evitar spam de popups
      const unnotified = achievementsSnap.docs.filter(d => !d.data().notified);
      if (unnotified.length > 0) {
        const resetPromises = unnotified.map(d => updateDoc(doc(db, "achievements", d.id), { notified: true }));
        await Promise.all(resetPromises);
      }

      // 3. Migrar/Limpiar plan legacy
      const legacyPlan = data.config?.settings?.subscription?.plan;
      if (legacyPlan) {
        if (!data.settings?.plan) {
          updates["settings.plan"] = legacyPlan;
          updates["settings.planExpiresAt"] = data.config?.settings?.subscription?.expiresAt || null;
        }
        updates["config.settings.subscription"] = null;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await updateDoc(doc(db, "users", docSnap.id), updates);
        repairedCount++;
      }
    });

    await Promise.all(promises);
    return { count: repairedCount, total: usersSnap.size };
  }
};
