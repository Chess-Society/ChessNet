import { adminDb } from './firebase-admin';
import type { Announcement } from '$lib/types';

export const serverCommunicationApi = {
  async createAnnouncement(
    schoolId: string,
    title: string,
    content: string,
    type: "general" | "class" | "student" | "tournament" | "event" = "general",
    targetType: "all" | "class" | "student" | "parent" = "all",
    targetId?: string,
    priority: "low" | "normal" | "high" | "urgent" = "normal",
    isPublished: boolean = false,
    ownerId: string,
    expiresAt?: string,
  ): Promise<any> {
    const data = {
      owner_id: ownerId,
      ownerId: ownerId,
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

    const docRef = await adminDb.collection("announcements").add(data);
    return { id: docRef.id, ...data };
  },

  async deleteAnnouncement(id: string, ownerId: string): Promise<void> {
    const docRef = adminDb.collection("announcements").doc(id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) throw new Error("Anuncio no encontrado");
    if (docSnap.data()?.owner_id !== ownerId && docSnap.data()?.ownerId !== ownerId) {
      throw new Error("No autorizado");
    }
    
    await docRef.delete();
  },

  async publishAnnouncement(id: string, ownerId: string): Promise<void> {
    const docRef = adminDb.collection("announcements").doc(id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) throw new Error("Anuncio no encontrado");
    if (docSnap.data()?.owner_id !== ownerId && docSnap.data()?.ownerId !== ownerId) {
      throw new Error("No autorizado");
    }
    
    await docRef.update({
      isPublished: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
};
