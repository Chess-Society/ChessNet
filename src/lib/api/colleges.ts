import { db, auth } from "$lib/firebase";
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
  deleteDoc,
  limit,
  type DocumentData
} from "firebase/firestore";
import type { College } from "$lib/types";

// Helper to convert Firestore document to data with ID
const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

export const collegesApi = {
  // Get all colleges for current user
  async getColleges(): Promise<College[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "colleges"),
      where("user_id", "==", user.uid),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<College>(doc));
  },

  // Get colleges by city
  async getCollegesByCity(city: string): Promise<College[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "colleges"),
      where("user_id", "==", user.uid),
      where("city", "==", city),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<College>(doc));
  },

  // Get a specific college
  async getCollege(id: string): Promise<College> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "colleges", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("College not found or access denied");
    }

    return toData<College>(docSnap);
  },

  // Search colleges by name (Simplified since Firestore doesn't support ilike)
  async searchColleges(queryStr: string): Promise<College[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Basic implementation: fetch all and filter client-side 
    // or use a structured search if query is prefix-based.
    // For simplicity, we fetch recent and filter.
    const allColleges = await this.getColleges();
    const searchResult = allColleges.filter(c => 
      c.name.toLowerCase().includes(queryStr.toLowerCase())
    ).slice(0, 20);

    return searchResult;
  },

  // Create a new college
  async createCollege(collegeData: {
    name: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  }): Promise<College> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "colleges"), {
      ...collegeData,
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const docSnap = await getDoc(docRef);
    return toData<College>(docSnap);
  },

  // Update a college
  async updateCollege(
    id: string, 
    updates: Partial<Omit<College, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<College> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "colleges", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("College not found or access denied");
    }

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString()
    });

    const updatedSnap = await getDoc(docRef);
    return toData<College>(updatedSnap);
  },

  // Delete a college
  async deleteCollege(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "colleges", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("College not found or access denied");
    }

    await deleteDoc(docRef);
  },

  // Get colleges with class count (Manual count)
  async getCollegesWithClassCount(): Promise<(College & { classes_count: number })[]> {
    const colleges = await this.getColleges();
    const result = [];

    for (const college of colleges) {
      const classesQuery = query(
        collection(db, "classes"),
        where("college_id", "==", college.id)
      );
      const classesSnap = await getDocs(classesQuery);
      result.push({
        ...college,
        classes_count: classesSnap.size
      });
    }

    return result;
  },
};
