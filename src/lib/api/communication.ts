import { db, toData } from "$lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc
} from "firebase/firestore";
import type { Announcement } from "$lib/types";
import { getOwnerId, getOwnedQuery } from "./base";

export const communicationApi = {
  /**
   * Obtiene anuncios filtrados por centro y otros criterios.
   */
  async getAnnouncementsBySchool(
    schoolId: string,
    filters?: {
      type?: string;
      isPublished?: boolean;
      limit?: number;
      offset?: number;
    },
  ): Promise<Announcement[]> {
    const ownerId = await getOwnerId();
    let q = query(
      getOwnedQuery("announcements"),
      where("schoolId", "==", schoolId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map(doc => toData<Announcement>(doc));

    if (filters?.type) {
      data = data.filter(a => a.type === filters.type);
    }

    if (filters?.isPublished !== undefined) {
      data = data.filter(a => a.isPublished === filters.isPublished);
    }

    if (filters?.offset !== undefined) {
      data = data.slice(filters.offset);
    }
    
    if (filters?.limit) {
      data = data.slice(0, filters.limit);
    }

    return data;
  },

  /**
   * Obtiene un anuncio específico.
   */
  async getAnnouncement(id: string): Promise<Announcement> {
    const ownerId = await getOwnerId();
    const docSnap = await getDoc(doc(db, "announcements", id));
    
    if (!docSnap.exists()) throw new Error("Anuncio no encontrado");
    
    const data = toData<Announcement>(docSnap);
    if (data.ownerId !== ownerId) throw new Error("Acceso denegado");

    return data;
  },

  /**
   * Crea un nuevo anuncio.
   */
  async createAnnouncement(
    schoolId: string,
    title: string,
    content: string,
    type: "general" | "class" | "student" | "tournament" | "event" = "general",
    targetType: "all" | "class" | "student" | "parent" = "all",
    targetId?: string,
    priority: "low" | "normal" | "high" | "urgent" = "normal",
    isPublished: boolean = false,
    ownerId?: string,
    expiresAt?: string,
  ): Promise<Announcement> {
    const finalOwnerId = ownerId || await getOwnerId();

    const data = {
      ownerId: finalOwnerId,
      schoolId: schoolId,
      title,
      content,
      type,
      targetType: targetType,
      targetId: targetId || null,
      priority,
      isPublished: isPublished,
      publishedAt: isPublished ? new Date().toISOString() : null,
      expiresAt: expiresAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "announcements"), data);
    const docSnap = await getDoc(docRef);
    return toData<Announcement>(docSnap);
  },

  /**
   * Actualiza un anuncio.
   */
  async updateAnnouncement(
    id: string,
    updates: Partial<Announcement>,
  ): Promise<Announcement> {
    const ownerId = await getOwnerId();
    const docRef = doc(db, "announcements", id);
    
    const current = await this.getAnnouncement(id);
    if (current.ownerId !== ownerId) throw new Error("No autorizado");

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<Announcement>(docSnap);
  },

  /**
   * Elimina un anuncio.
   */
  async deleteAnnouncement(id: string): Promise<void> {
    const ownerId = await getOwnerId();
    const current = await this.getAnnouncement(id);
    if (current.ownerId !== ownerId) throw new Error("No autorizado");
    
    await deleteDoc(doc(db, "announcements", id));
  },

  /**
   * Publica un anuncio.
   */
  async publishAnnouncement(id: string): Promise<Announcement> {
    return this.updateAnnouncement(id, {
      isPublished: true,
      publishedAt: new Date().toISOString(),
    });
  },

  /**
   * Despublica un anuncio.
   */
  async unpublishAnnouncement(id: string): Promise<Announcement> {
    return this.updateAnnouncement(id, {
      isPublished: false,
      publishedAt: undefined,
    });
  },

  /**
   * Envía un mensaje a los padres de un alumno.
   */
  async sendParentMessage(
    studentId: string,
    title: string,
    content: string,
    type:
      | "progress"
      | "attendance"
      | "behavior"
      | "achievement"
      | "general" = "general",
  ): Promise<any> {
    const ownerId = await getOwnerId();

    const messageData = {
      ownerId: ownerId,
      studentId: studentId,
      title,
      content,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "parent_messages"), messageData);
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },

  /**
   * Marca un mensaje como leído.
   */
  async markMessageAsRead(messageId: string): Promise<any> {
    const ownerId = await getOwnerId();
    const docRef = doc(db, "parent_messages", messageId);
    
    // Verificación de propiedad para mensajes
    const docSnapBefore = await getDoc(docRef);
    if (docSnapBefore.exists() && docSnapBefore.data().ownerId !== ownerId) {
        throw new Error("No autorizado");
    }

    await updateDoc(docRef, { isRead: true });
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },

  /**
   * Añade o quita una reacción a un anuncio.
   */
  async reactToAnnouncement(announcementId: string, emoji: string, userId: string): Promise<void> {
    const docRef = doc(db, "announcements", announcementId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) throw new Error("Anuncio no encontrado");
    
    const data = docSnap.data();
    const reactions = data.reactions || {};
    const users = reactions[emoji] || [];
    
    let newUsers;
    if (users.includes(userId)) {
      newUsers = users.filter((id: string) => id !== userId);
    } else {
      newUsers = [...users, userId];
    }
    
    const newReactions = { ...reactions, [emoji]: newUsers };
    
    await updateDoc(docRef, { 
      reactions: newReactions,
      updatedAt: new Date().toISOString()
    });
  },
};
