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
  addDoc
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
        totalInsignias: insigniasSnap.data().count,
        totalRevenue
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
   * Obtiene las insignias desbloqueadas de un usuario.
   */
  async getUserInsignias(userId: string) {
    try {
      const q = query(collection(db, "achievements"), where("owner_id", "==", userId));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("[AdminAPI] Error getting user insignias:", error);
      throw error;
    }
  },
  
  async awardInsignia(userId: string, insigniaId: string) {
    try {
      const collRef = collection(db, "achievements");
      const logRef = collection(db, "system_logs");
      const userRef = doc(db, "users", userId);
      
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
          category: 'RECOGNITION',
          action: 'Concesión de Insignia',
          message: `Insignia ${insigniaId} concedida manualmente al usuario ${userId}`,
          timestamp: new Date().toISOString(),
          status: 'success'
        })
      ]);
    } catch (error) {
      console.error("[AdminAPI] Error awarding insignia:", error);
      throw error;
    }
  },

  /**
   * Revoca una insignia de un usuario.
   */
  async revokeInsignia(userId: string, insigniaId: string) {
    try {
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
        }),
        addDoc(collection(db, "system_logs"), {
          type: 'insignia_revoked',
          category: 'RECOGNITION',
          action: 'Revocación de Insignia',
          message: `Insignia ${insigniaId} revocada al usuario ${userId}`,
          timestamp: new Date().toISOString(),
          status: 'success'
        })
      ]);
    } catch (error) {
      console.error("[AdminAPI] Error revoking insignia:", error);
      throw error;
    }
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
   * Lobby Moderation
   */
  async getLobbySuggestions() {
    try {
      const q = query(collection(db, "lobby_suggestions"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("[AdminAPI] Error getting lobby suggestions:", error);
      throw error;
    }
  },

  async updateSuggestionStatus(id: string, status: string) {
    try {
      const docRef = doc(db, "lobby_suggestions", id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error("[AdminAPI] Error updating suggestion:", error);
      throw error;
    }
  },

  async deleteSuggestion(id: string) {
    try {
      await deleteDoc(doc(db, "lobby_suggestions", id));
    } catch (error) {
      console.error("[AdminAPI] Error deleting suggestion:", error);
      throw error;
    }
  },

  async getLobbyAnnouncements() {
    try {
      const q = query(collection(db, "lobby_announcements"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("[AdminAPI] Error getting lobby announcements:", error);
      throw error;
    }
  },

  /**
   * Support Ticket Management
   */
  async getSupportTickets() {
    try {
      const q = query(collection(db, "lobby_reports"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("[AdminAPI] Error getting support tickets text:", error);
      throw error;
    }
  },

  async updateTicketStatus(id: string, status: string) {
    try {
      const docRef = doc(db, "lobby_reports", id);
      await updateDoc(docRef, { 
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("[AdminAPI] Error updating ticket status:", error);
      throw error;
    }
  },

  async respondToTicket(id: string, response: string) {
    try {
      const docRef = doc(db, "lobby_reports", id);
      await updateDoc(docRef, { 
        adminResponse: response,
        status: 'resolved',
        respondedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("[AdminAPI] Error responding to ticket:", error);
      throw error;
    }
  },

  async deleteTicket(id: string) {
    try {
      await deleteDoc(doc(db, "lobby_reports", id));
    } catch (error) {
      console.error("[AdminAPI] Error deleting ticket:", error);
      throw error;
    }
  },

  /**
   * Concede acceso premium temporal a un usuario.
   */
  async grantTrial(userId: string, days: number) {
    try {
      const userRef = doc(db, "users", userId);
      const expiresAt = new Date();
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
          message: `Premium trial de ${days} días concedido al usuario ${userId}`,
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
  },

  /**
   * Promueve a un usuario al rol de Director y establece su escuela.
   */
  async promoteToDirector(userEmail: string, schoolName: string) {
    try {
      // 1. Buscar usuario por email
      const q = query(collection(db, "users"), where("email", "==", userEmail), limit(1));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        throw new Error("Usuario no encontrado");
      }

      const userDoc = snap.docs[0];
      const userId = userDoc.id;

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

  /**
   * ECONOMÍA Y PRESTIGIO: Inicializa y gestiona Nets y Stakes.
   */
  async initUserEconomy(userId: string) {
    try {
      const userRef = doc(db, "users", userId);
      const economyData = {
        netsBalance: 100, // Bono inicial
        totalNetsEarned: 100,
        tier: 'BRONZE',
        lastEconomyUpdate: new Date().toISOString()
      };

      await updateDoc(userRef, {
        economy: economyData
      });

      await addDoc(collection(db, "nets_transactions"), {
        userId,
        amount: 100,
        type: 'EARN',
        reason: 'Bono de bienvenida ChessNet OS',
        createdAt: new Date().toISOString()
      });

      return economyData;
    } catch (error) {
      console.error("[AdminAPI] Error initializing economy:", error);
      throw error;
    }
  },

  async addNets(userId: string, amount: number, reason: string, status: 'confirmed' | 'pending' = 'confirmed', validatorId?: string) {
    try {
      const userRef = doc(db, "users", userId);
      const { increment } = await import('firebase/firestore');

      const promises: any[] = [
        addDoc(collection(db, "nets_transactions"), {
          userId,
          amount,
          type: amount > 0 ? 'EARN' : 'SPEND',
          reason,
          status,
          validatorId: validatorId || null,
          createdAt: new Date().toISOString()
        })
      ];

      // Only update balance if confirmed
      if (status === 'confirmed') {
        promises.push(updateDoc(userRef, {
          "economy.netsBalance": increment(amount),
          "economy.totalNetsEarned": increment(amount > 0 ? amount : 0),
          "economy.lastEconomyUpdate": new Date().toISOString()
        }));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("[AdminAPI] Error adding nets:", error);
      throw error;
    }
  },

  async confirmNetsTransaction(txId: string, userId: string, validatorId: string) {
    try {
      const { runTransaction } = await import('firebase/firestore');
      const userRef = doc(db, "users", userId);
      const txRef = doc(db, "nets_transactions", txId);

      await runTransaction(db, async (transaction) => {
        const txSnap = await transaction.get(txRef);
        if (!txSnap.exists()) throw new Error('Transacción no encontrada');
        
        const txData = txSnap.data();
        if (txData.status === 'confirmed') return; // Already confirmed

        const amount = txData.amount || 0;
        const userSnap = await transaction.get(userRef);
        
        transaction.update(txRef, {
          status: 'confirmed',
          validatorId,
          confirmedAt: new Date().toISOString()
        });

        if (userSnap.exists()) {
          transaction.update(userRef, {
            "economy.netsBalance": (userSnap.data()?.economy?.netsBalance || 0) + amount,
            "economy.totalNetsEarned": (userSnap.data()?.economy?.totalNetsEarned || 0) + (amount > 0 ? amount : 0),
            "economy.lastEconomyUpdate": new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error("[AdminAPI] Error confirming nets transaction:", error);
      throw error;
    }
  },

  async repairEconomyData() {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let initializedCount = 0;

      const promises = usersSnap.docs.map(async (uDoc) => {
        const data = uDoc.data();
        if (!data.economy) {
          await this.initUserEconomy(uDoc.id);
          initializedCount++;
        }
      });

      await Promise.all(promises);
      return { initializedCount, total: usersSnap.size };
    } catch (error) {
      console.error("[AdminAPI] Error repairing economy data:", error);
      throw error;
    }
  },


  /**
   * Sets the economy data for a specific user directly.
   */
  async updateUserEconomy(userId: string, data: { netsBalance?: number, tier?: string }): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const updates: any = {};
    if (data.netsBalance !== undefined) updates['economy.netsBalance'] = data.netsBalance;
    if (data.tier !== undefined) updates['economy.tier'] = data.tier;
    updates['economy.lastEconomyUpdate'] = new Date().toISOString();
    
    await updateDoc(userRef, updates);
  },

  /**
   * Updates an existing Nets transaction and adjusts the user's balance.
   */
  async updateNetsTransaction(txId: string, userId: string, oldAmount: number, newAmount: number, reason: string): Promise<void> {
    const { runTransaction } = await import('firebase/firestore');
    const userRef = doc(db, 'users', userId);
    const txRef = doc(db, 'nets_transactions', txId);

    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error('Usuario no encontrado');

      const difference = newAmount - oldAmount;

      transaction.update(userRef, {
        'economy.netsBalance': (userSnap.data()?.economy?.netsBalance || 0) + difference,
        'economy.lastEconomyUpdate': new Date().toISOString()
      });

      transaction.update(txRef, {
        amount: newAmount,
        reason: reason,
        updatedAt: new Date().toISOString()
      });
    });
  },

  /**
   * Deletes a Nets transaction and optionally reverts the user's balance.
   */
  async deleteNetsTransaction(txId: string, userId: string, amount: number, revertBalance: boolean = false): Promise<void> {
    const { runTransaction } = await import('firebase/firestore');
    const userRef = doc(db, 'users', userId);
    const txRef = doc(db, 'nets_transactions', txId);

    await runTransaction(db, async (transaction) => {
      if (revertBalance) {
        const userSnap = await transaction.get(userRef);
        if (userSnap.exists()) {
          transaction.update(userRef, {
            'economy.netsBalance': (userSnap.data()?.economy?.netsBalance || 0) - amount,
            'economy.lastEconomyUpdate': new Date().toISOString()
          });
        }
      }
      transaction.delete(txRef);
    });
  },

  /**
   * Obtiene la distribución de prestigio entre los profesores.
   */
  async getPrestigeDistribution() {
    try {
      const q = query(
        collection(db, "users"), 
        where("economy.prestige", ">", 0),
        orderBy("economy.prestige", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || data.full_name || "Profesor",
          prestige: data.economy?.prestige || 0,
          photoURL: data.photoURL || data.avatar_url
        };
      });
    } catch (error) {
      console.error("[AdminAPI] Error getting prestige distribution:", error);
      // Fallback: fetch some users if query fails (likely due to missing index)
      const qFallback = query(collection(db, "users"), limit(10));
      const snap = await getDocs(qFallback);
      return snap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().displayName || "Profesor",
        prestige: doc.data().economy?.prestige || 0,
        photoURL: doc.data().photoURL
      })).filter(u => u.prestige > 0);
    }
  },

  /**
   * Concede Nets directamente a un usuario.
   */
  async mintNets(userId: string, amount: number) {
    return this.addNets(userId, amount, 'Concesión administrativa de Nets (MINT)');
  },

  /**
   * Reinicia completamente la economía de un usuario (Nets, Pase de Batalla, Inventario).
   */
  async resetUserEconomy(userId: string) {
    try {
      const userRef = doc(db, "users", userId);
      const timestamp = new Date().toISOString();

      const initialEconomy = {
        netsBalance: 100,
        totalNetsEarned: 100,
        tier: 'BRONZE',
        prestige: 0,
        lastEconomyUpdate: timestamp,
        activeColor: 'none',
        activeFrame: 'none',
        activeFont: 'none',
        collection: {
          emotes: [],
          fonts: [],
          colors: [],
          badges: [],
          frames: [],
          themes: []
        },
        battlePass: {
          seasonId: 'season-1',
          currentXp: 0,
          currentTier: 1,
          isPremium: false,
          claimedTiers: [],
          dailyChallenges: {},
          weeklyChallenges: {}
        },
        inventory: {
          crates: {}
        }
      };

      await Promise.all([
        updateDoc(userRef, {
          economy: initialEconomy,
          "settings.updatedAt": timestamp
        }),
        addDoc(collection(db, "system_logs"), {
          type: 'economy_reset',
          category: 'ECONOMY',
          action: 'Reinicio de Economía',
          message: `Economía del usuario ${userId} reiniciada completamente por un administrador`,
          timestamp,
          status: 'warning'
        })
      ]);

      return initialEconomy;
    } catch (error) {
      console.error("[AdminAPI] Error resetting user economy:", error);
      throw error;
    }
  }
};
