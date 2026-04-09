import { db, auth } from "$lib/firebase";
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
  setDoc,
  type DocumentData
} from "firebase/firestore";
import type { School, Membership } from "$lib/types";

// Helper to convert Firestore document to data with ID
const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

export const schoolsApi = {
  // Get all schools for the current user (where they are a member)
  async getMySchools(userId?: string): Promise<School[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    // First find memberships for this user
    const membershipsQuery = query(
      collection(db, "memberships"),
      where("user_id", "==", uid)
    );
    const membershipsSnapshot = await getDocs(membershipsQuery);
    const schoolIds = membershipsSnapshot.docs.map(doc => doc.data().school_id);

    if (schoolIds.length === 0) return [];

    // Then fetch the schools
    // Firestore 'in' matches are limited to 10 items, but for now we'll assume a user has < 10 schools
    // If more, we'd need to batch. 
    const schoolsQuery = query(
      collection(db, "colleges"),
      where("__name__", "in", schoolIds)
    );
    const schoolsSnapshot = await getDocs(schoolsQuery);
    return schoolsSnapshot.docs.map(doc => toData<School>(doc));
  },

  // Get a specific school
  async getSchool(id: string, userId?: string): Promise<School> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const docRef = doc(db, "colleges", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("School not found");
    
    // Check membership
    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", id),
      where("user_id", "==", uid)
    );
    const membershipSnap = await getDocs(q);
    
    if (membershipSnap.empty) {
      throw new Error("Access denied: Not a member of this school");
    }

    return toData<School>(docSnap);
  },

  // Create a new school
  async createSchool(
    name: string,
    city?: string,
  ): Promise<School> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const schoolData = {
      name,
      city: city || null,
      owner_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "colleges"), schoolData);
    
    // Create membership for the owner
    await this.addMember(docRef.id, user.uid, "owner");

    // Initialize default data logic would go here
    // In Firestore we can't easily run a PG function, so we'd either do it here in JS 
    // or rely on the UI/other APIs to lazy-init or have a Cloud Function.
    
    const docSnap = await getDoc(docRef);
    return toData<School>(docSnap);
  },

  // Update a school
  async updateSchool(id: string, updates: Partial<School>): Promise<School> {
    const docRef = doc(db, "colleges", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<School>(docSnap);
  },

  // Delete a school
  async deleteSchool(id: string): Promise<void> {
    await deleteDoc(doc(db, "colleges", id));
    // Note: Should also delete memberships and related data or use a Cloud Function for cascading delete
  },

  // Get school members
  async getSchoolMembers(schoolId: string): Promise<Membership[]> {
    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", schoolId)
    );

    const querySnapshot = await getDocs(q);
    const memberships = querySnapshot.docs.map(doc => toData<Membership>(doc));

    // Manually fetch profile data if needed (if profiles are in a separate collection)
    for (const membership of memberships) {
      const profileSnap = await getDoc(doc(db, "profiles", membership.user_id));
      if (profileSnap.exists()) {
        membership.profiles = toData<any>(profileSnap);
      }
    }

    return memberships;
  },

  // Add a member to a school
  async addMember(
    schoolId: string,
    userId: string,
    role: "owner" | "admin" | "teacher" | "assistant" | "viewer",
  ): Promise<Membership> {
    const membershipData = {
      school_id: schoolId,
      user_id: userId,
      role,
      created_at: new Date().toISOString()
    };

    // Use setDoc with a composite ID to avoid duplicates if needed, or addDoc
    const docRef = await addDoc(collection(db, "memberships"), membershipData);
    const docSnap = await getDoc(docRef);
    return toData<Membership>(docSnap);
  },

  // Update member role
  async updateMemberRole(
    membershipId: string,
    role: "owner" | "admin" | "teacher" | "assistant" | "viewer",
  ): Promise<Membership> {
    const docRef = doc(db, "memberships", membershipId);
    await updateDoc(docRef, { role });

    const docSnap = await getDoc(docRef);
    return toData<Membership>(docSnap);
  },

  // Remove a member from a school
  async removeMember(membershipId: string): Promise<void> {
    await deleteDoc(doc(db, "memberships", membershipId));
  },

  // Check if user is member of school
  async isMember(schoolId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", schoolId),
      where("user_id", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },

  // Get user's role in school
  async getUserRole(schoolId: string): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", schoolId),
      where("user_id", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data().role;
  },
};
