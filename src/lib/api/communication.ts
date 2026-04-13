import { db, toData, getUserPath } from "$lib/firebase";
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

export const communicationApi = {
  // Get announcements by school
  async getAnnouncementsBySchool(
    schoolId: string,
    filters?: {
      type?: string;
      isPublished?: boolean;
      limit?: number;
      offset?: number;
    },
  ): Promise<Announcement[]> {
    const userPath = getUserPath();
    let q = query(
      collection(db, userPath, "announcements"),
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

    // Handle offset and limit manually
    if (filters?.offset !== undefined) {
      data = data.slice(filters.offset);
    }
    
    if (filters?.limit) {
      data = data.slice(0, filters.limit);
    }

    return data;
  },

  // Get a specific announcement
  async getAnnouncement(id: string): Promise<Announcement> {
    const userPath = getUserPath();
    const docSnap = await getDoc(doc(db, userPath, "announcements", id));
    if (!docSnap.exists()) throw new Error("Announcement not found");
    return toData<Announcement>(docSnap);
  },

  // Create a new announcement
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
    const userPath = getUserPath();

    const announcementData = {
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

    const docRef = await addDoc(collection(db, userPath, "announcements"), announcementData);
    const docSnap = await getDoc(docRef);
    return toData<Announcement>(docSnap);
  },

  // Update an announcement
  async updateAnnouncement(
    id: string,
    updates: Partial<Announcement>,
  ): Promise<Announcement> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "announcements", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<Announcement>(docSnap);
  },

  // Delete an announcement
  async deleteAnnouncement(id: string): Promise<void> {
    const userPath = getUserPath();
    await deleteDoc(doc(db, userPath, "announcements", id));
  },

  // Publish an announcement
  async publishAnnouncement(id: string): Promise<Announcement> {
    return this.updateAnnouncement(id, {
      is_published: true,
      published_at: new Date().toISOString(),
    });
  },

  // Unpublish an announcement
  async unpublishAnnouncement(id: string): Promise<Announcement> {
    return this.updateAnnouncement(id, {
      is_published: false,
      published_at: undefined,
    });
  },

  // Send message to parent
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
    const userPath = getUserPath();

    const messageData = {
      student_id: studentId,
      title,
      content,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, userPath, "parent_messages"), messageData);
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<any> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "parent_messages", messageId);
    await updateDoc(docRef, { is_read: true });
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },
};
