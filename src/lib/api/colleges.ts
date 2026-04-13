import { db, auth, toData, getUserPath } from "$lib/firebase";
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

export const collegesApi = {
  // Get all colleges for current user
  async getColleges(): Promise<College[]> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "colleges"),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<College>(doc));
  },

  // Get colleges by city
  async getCollegesByCity(city: string): Promise<College[]> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "colleges"),
      where("city", "==", city),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<College>(doc));
  },

  // Get a specific college
  async getCollege(id: string): Promise<College> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "colleges", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("College not found");
    }

    return toData<College>(docSnap);
  },

  // Search colleges by name (Simplified since Firestore doesn't support ilike)
  async searchColleges(queryStr: string): Promise<College[]> {
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
    const userPath = getUserPath();

    const docRef = await addDoc(collection(db, userPath, "colleges"), {
      ...collegeData,
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
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "colleges", id);

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString()
    });

    const updatedSnap = await getDoc(docRef);
    return toData<College>(updatedSnap);
  },

  // Delete a college
  async deleteCollege(id: string): Promise<void> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "colleges", id);
    await deleteDoc(docRef);
  },

  // Get colleges with class count (Manual count)
  async getCollegesWithClassCount(): Promise<(College & { classes_count: number })[]> {
    const userPath = getUserPath();
    const colleges = await this.getColleges();
    const result = [];

    for (const college of colleges) {
      const classesQuery = query(
        collection(db, userPath, "classes"),
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
