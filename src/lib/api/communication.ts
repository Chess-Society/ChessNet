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
      where("school_id", "==", schoolId),
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map(doc => toData<Announcement>(doc));

    if (filters?.type) {
      data = data.filter(a => a.type === filters.type);
    }

    if (filters?.isPublished !== undefined) {
      data = data.filter(a => a.is_published === filters.isPublished);
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
    if (data.owner_id !== ownerId) throw new Error("Acceso denegado");

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
    expiresAt?: string,
  ): Promise<Announcement> {
    const ownerId = await getOwnerId();

    const data = {
      owner_id: ownerId,
      school_id: schoolId,
      title,
      content,
      type,
      target_type: targetType,
      target_id: targetId || null,
      priority,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      expires_at: expiresAt || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
    if (current.owner_id !== ownerId) throw new Error("No autorizado");

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
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
    if (current.owner_id !== ownerId) throw new Error("No autorizado");
    
    await deleteDoc(doc(db, "announcements", id));
  },

  /**
   * Publica un anuncio.
   */
  async publishAnnouncement(id: string): Promise<Announcement> {
    return this.updateAnnouncement(id, {
      is_published: true,
      published_at: new Date().toISOString(),
    });
  },

  /**
   * Despublica un anuncio.
   */
  async unpublishAnnouncement(id: string): Promise<Announcement> {
    return this.updateAnnouncement(id, {
      is_published: false,
      published_at: undefined,
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
      owner_id: ownerId,
      student_id: studentId,
      title,
      content,
      type,
      is_read: false,
      created_at: new Date().toISOString()
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
    if (docSnapBefore.exists() && docSnapBefore.data().owner_id !== ownerId) {
        throw new Error("No autorizado");
    }

    await updateDoc(docRef, { is_read: true });
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },
};
