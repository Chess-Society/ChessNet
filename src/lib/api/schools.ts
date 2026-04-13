import { db, auth, toData, getUserPath } from "$lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy,
  addDoc, 
  updateDoc, 
  deleteDoc
} from "firebase/firestore";
import type { School } from "$lib/types";

export const schoolsApi = {
  // Obtener todos los colegios del usuario actual
  async getMySchools(userId?: string): Promise<School[]> {
    const userPath = getUserPath(userId);
    const q = query(
      collection(db, userPath, "colleges"),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<School>(doc));
  },

  // Obtener un colegio específico
  async getSchool(id: string, userId?: string): Promise<School> {
    const userPath = getUserPath(userId);
    const docRef = doc(db, userPath, "colleges", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Colegio no encontrado");
    return toData<School>(docSnap);
  },

  // Crear un nuevo colegio
  async createSchool(
    name: string,
    city?: string,
  ): Promise<School> {
    const userPath = getUserPath();
    
    const schoolData = {
      name,
      city: city || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, userPath, "colleges"), schoolData);
    const docSnap = await getDoc(docRef);
    return toData<School>(docSnap);
  },

  // Actualizar un colegio
  async updateSchool(id: string, updates: Partial<School>): Promise<School> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "colleges", id);
    
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<School>(docSnap);
  },

  // Eliminar un colegio
  async deleteSchool(id: string): Promise<void> {
    const userPath = getUserPath();
    await deleteDoc(doc(db, userPath, "colleges", id));
  },

  // Métodos de compatibilidad
  async getSchoolMembers(schoolId: string): Promise<any[]> {
    return [];
  },

  async isMember(schoolId: string): Promise<boolean> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "colleges", schoolId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  },

  async getUserRole(schoolId: string): Promise<string | null> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "colleges", schoolId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? "owner" : null;
  }
};
