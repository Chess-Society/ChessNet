import { db } from "$lib/firebase";
import type { Firestore } from "firebase/firestore";
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
  addDoc,
  writeBatch,
  startAfter
} from "firebase/firestore";

export const adminApi = {
  /**
   * Obtiene estadísticas globales de la plataforma.
   */
  async getGlobalStats() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [
        usersSnap,
        studentsSnap,
        schoolsSnap,
        classesSnap,
        premiumSnap,
        recentSnap,
        missionsSnap,
        assignmentsSnap,
        paymentsSnap
      ] = await Promise.all([
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "students")),
        getCountFromServer(collection(db, "schools")),
        getCountFromServer(collection(db, "classes")),
        getCountFromServer(query(collection(db, "users"), where("settings.plan", "==", "premium"))),
        getCountFromServer(query(collection(db, "users"), where("createdAt", ">=", sevenDaysAgo.toISOString()))),
        getCountFromServer(collection(db, "missions")),
        getCountFromServer(collection(db, "student_missions")),
        getDocs(query(collection(db, "payments"), limit(500))) // Limit to prevent crash/slowdown
      ]);

      const totalRevenue = paymentsSnap.docs.reduce((acc, d) => acc + (d.data().amount || 0), 0);

      return {
        totalUsers: usersSnap.data().count,
        totalStudents: studentsSnap.data().count,
        totalSchools: schoolsSnap.data().count,
        totalClasses: classesSnap.data().count,
        premiumUsers: premiumSnap.data().count,
        recentUsers: recentSnap.data().count,
        totalMissions: missionsSnap.data().count,
        totalAssignments: assignmentsSnap.data().count,
        totalRevenue,
        activeSessions: 0, 
        serverLoad: 0
      };
    } catch (error) {
      console.error("[AdminAPI] Error getting global stats:", error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de usuarios (profesores) con soporte para búsqueda.
   */
  async getUsersList(limitCount = 100, emailSearch = "") {
    try {
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
    } catch (error) {
      console.error("[AdminAPI] Error getting users list:", error);
      throw error;
    }
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
    try {
      const configRef = doc(db, "system", "config");
      await setDoc(configRef, { 
        maintenanceMode: enabled,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Log action
      await addDoc(collection(db, "system_logs"), {
        type: 'maintenance_toggle',
        category: 'SYSTEM',
        action: 'Mantenimiento',
        message: `Modo mantenimiento ${enabled ? 'activado' : 'desactivado'}`,
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    } catch (error) {
      console.error("[AdminAPI] Error toggling maintenance:", error);
      throw error;
    }
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
    try {
      const q = query(
        collection(db, "system_logs"), 
        orderBy("timestamp", "desc"), 
        limit(limitCount)
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("[AdminAPI] Error getting system logs:", error);
      throw error;
    }
  },


  /**
   * Concede acceso premium temporal a un usuario.
   */
  async grantTrial(userId: string, days: number) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      
      let baseDate = new Date();
      const currentExpiry = userData?.settings?.planExpiresAt;
      
      // Si ya tiene premium y no ha caducado, sumamos a la fecha actual de expiración
      if (currentExpiry && new Date(currentExpiry) > new Date()) {
        baseDate = new Date(currentExpiry);
      }

      const expiresAt = new Date(baseDate);
      expiresAt.setDate(expiresAt.getDate() + days);

      await Promise.all([
        updateDoc(userRef, {
          "settings.plan": "premium",
          "settings.planExpiresAt": expiresAt.toISOString(),
          "settings.updatedAt": new Date().toISOString()
        }),
        addDoc(collection(db, "system_logs"), {
          type: 'trial_granted',
          category: 'SUBSCRIPTION',
          action: 'Concesión de Trial',
          message: `Premium trial de ${days} días concedido al usuario ${userId}. Nueva expiración: ${expiresAt.toLocaleDateString()}`,
          timestamp: new Date().toISOString(),
          status: 'success'
        })
      ]);

      return { expiresAt: expiresAt.toISOString() };
    } catch (error) {
      console.error("[AdminAPI] Error granting trial:", error);
      throw error;
    }
  },

  /**
   * Revoca totalmente el acceso premium de un usuario.
   */
  async revokePremium(userId: string) {
    try {
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

      await Promise.all([
        updateDoc(userRef, updates),
        addDoc(collection(db, "system_logs"), {
          type: 'premium_revoked',
          category: 'SUBSCRIPTION',
          action: 'Revocación Premium',
          message: `Acceso Premium revocado al usuario ${userId}`,
          timestamp: new Date().toISOString(),
          status: 'warning'
        })
      ]);

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
        // Silencioso para appData
      }
    } catch (error) {
      console.error("[AdminAPI] Error revoking premium:", error);
      throw error;
    }
  },

  /**
   * REPARACIÓN DE DATOS: 
   * Asegura que todos los documentos de usuario tengan createdAt
   */
  async repairUsersData() {
    const usersSnap = await getDocs(collection(db, "users"));
    
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

      // 2. Calcular insignias reales (Ya no es necesario, se omite)


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
  },

  /**
   * Promueve a un usuario al rol de Director y establece su escuela.
   */
  async promoteToDirector(identifier: string, schoolName: string = "Escuela de Ajedrez") {
    try {
      let userId = "";
      let userEmail = "";

      // Si parece un email, buscamos por email. Si no, asumimos que es un UID.
      if (identifier.includes("@")) {
        const q = query(collection(db, "users"), where("email", "==", identifier), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) throw new Error("Usuario no encontrado por email");
        userId = snap.docs[0].id;
        userEmail = identifier;
      } else {
        userId = identifier;
        const snap = await getDoc(doc(db, "users", userId));
        if (!snap.exists()) throw new Error("Usuario no encontrado por ID");
        userEmail = snap.data().email || "N/A";
      }

      // 2. Actualizar rol y escuela
      await Promise.all([
        updateDoc(doc(db, "users", userId), {
          "settings.role": "director",
          "settings.schoolName": schoolName,
          "settings.updatedAt": new Date().toISOString()
        }),
        addDoc(collection(db, "system_logs"), {
          type: 'role_changed',
          category: 'USERS',
          action: 'Promoción a Director',
          message: `Usuario ${userEmail} promovido a Director de ${schoolName}`,
          timestamp: new Date().toISOString(),
          status: 'success'
        })
      ]);

      return { userId };
    } catch (error) {
      console.error("[AdminAPI] Error promoting to director:", error);
      throw error;
    }
  },


};
