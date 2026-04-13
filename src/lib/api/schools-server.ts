import { db } from "$lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  type DocumentData
} from "firebase/firestore";
import type { School, Membership } from "$lib/types";
import type { Cookies } from "@sveltejs/kit";

// Helper to convert Firestore document to data with ID
const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

// Note: On the server, we typically use firebase-admin.
// Using the Web SDK on the server will not have an authenticated user by default.
// These functions are adapted to be used with the Web SDK, but authorization 
// should be handled by checking the user in locals (populated by hooks).

export const schoolsServerApi = {
  // Get all schools for a specific user
  async getMySchools(cookies: Cookies, userId?: string): Promise<School[]> {
    // In a real Firebase setup, userId would be retrieved from a session cookie verified in hooks.server.ts
    // For now, we'll try to use the userId if provided, or expect it to be handled by the caller.
    if (!userId) {
      console.warn("⚠️ getMySchools called without userId on server");
      return [];
    }

    // First find memberships for this user
    const membershipsQuery = query(
      collection(db, "memberships"),
      where("user_id", "==", userId)
    );
    const membershipsSnapshot = await getDocs(membershipsQuery);
    const schoolIds = membershipsSnapshot.docs.map(doc => doc.data().school_id);

    if (schoolIds.length === 0) return [];

    // Then fetch the schools
    const schoolsQuery = query(
      collection(db, "schools"),
      where("__name__", "in", schoolIds)
    );
    const schoolsSnapshot = await getDocs(schoolsQuery);
    return schoolsSnapshot.docs.map(doc => toData<School>(doc));
  },

  // Get a specific school
  async getSchool(id: string, cookies: Cookies): Promise<School> {
    const docSnap = await getDoc(doc(db, "schools", id));
    if (!docSnap.exists()) throw new Error("School not found");
    return toData<School>(docSnap);
  },

  // Create a new school
  async createSchool(
    name: string,
    cookies: Cookies,
    city?: string,
    userId?: string
  ): Promise<School> {
    if (!userId) throw new Error("User ID required for school creation on server");

    console.log('🏫 Creating school for user:', userId);

    const schoolData = {
      name,
      city: city || null,
      owner_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "schools"), schoolData);
    console.log('✅ School created successfully:', docRef.id);

    // Create membership for the owner
    await this.addMember(docRef.id, userId, "owner", cookies);

    const docSnap = await getDoc(docRef);
    return toData<School>(docSnap);
  },

  // Update a school
  async updateSchool(id: string, updates: Partial<School>, cookies: Cookies): Promise<School> {
    const docRef = doc(db, "schools", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<School>(docSnap);
  },

  // Delete a school
  async deleteSchool(id: string, cookies: Cookies): Promise<void> {
    await deleteDoc(doc(db, "schools", id));
  },

  // Add a member to a school
  async addMember(
    schoolId: string,
    userId: string,
    role: "owner" | "admin" | "teacher" | "assistant" | "viewer",
    cookies: Cookies
  ): Promise<Membership> {
    const membershipData = {
      school_id: schoolId,
      user_id: userId,
      role,
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "memberships"), membershipData);
    const docSnap = await getDoc(docRef);
    return toData<Membership>(docSnap);
  },

  // Check if user is member of school
  async isMember(schoolId: string, cookies: Cookies, userId?: string): Promise<boolean> {
    if (!userId) return false;

    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", schoolId),
      where("user_id", "==", userId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },

  // Get user's role in school
  async getUserRole(schoolId: string, cookies: Cookies, userId?: string): Promise<string | null> {
    if (!userId) return null;

    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", schoolId),
      where("user_id", "==", userId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data().role;
  },
};
