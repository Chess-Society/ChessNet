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
import type { School } from "$lib/types";
import { getOwnerId, getOwnedQuery } from "./base";

export const schoolsApi = {
  /**
   * Obtiene todos los centros (escuelas/colegios) del profesor actual.
   */
  async getMySchools(): Promise<School[]> {
    const ownerId = await getOwnerId();
    const q = query(getOwnedQuery("schools"), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<School>(doc));
  },

  /**
   * Obtiene centros filtrados por ciudad.
   */
  async getSchoolsByCity(city: string): Promise<School[]> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("schools"),
      where("city", "==", city),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<School>(doc));
  },

  /**
   * Obtiene un centro específico por ID.
   */
  async getSchool(id: string): Promise<School> {
    const docRef = doc(db, "schools", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Centro no encontrado");
    
    const data = toData<School>(docSnap);
    const ownerId = await getOwnerId();
    
    if (data.owner_id !== ownerId) {
      throw new Error("Acceso denegado");
    }
    
    return data;
  },

  /**
   * Busca centros por coincidencia parcial en el nombre.
   */
  async searchSchools(queryStr: string): Promise<School[]> {
    const allSchools = await this.getMySchools();
    return allSchools.filter(s => 
      s.name.toLowerCase().includes(queryStr.toLowerCase())
    ).slice(0, 20);
  },

  /**
   * Crea un nuevo centro.
   */
  async createSchool(schoolData: {
    name: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  }): Promise<School> {
    const ownerId = await getOwnerId();
    
    const data = {
      ...schoolData,
      owner_id: ownerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "schools"), data);
    const docSnap = await getDoc(docRef);
    return toData<School>(docSnap);
  },

  /**
   * Actualiza los datos de un centro.
   */
  async updateSchool(id: string, updates: Partial<School>): Promise<School> {
    const ownerId = await getOwnerId();
    const docRef = doc(db, "schools", id);
    
    // Verificación de seguridad previa a la actualización
    const current = await this.getSchool(id);
    if (current.owner_id !== ownerId) throw new Error("No autorizado");

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<School>(docSnap);
  },

  /**
   * Elimina un centro.
   */
  async deleteSchool(id: string): Promise<void> {
    const ownerId = await getOwnerId();
    const current = await this.getSchool(id);
    if (current.owner_id !== ownerId) throw new Error("No autorizado");
    
    await deleteDoc(doc(db, "schools", id));
  },

  /**
   * Obtiene centros junto con el recuento de clases asociadas.
   */
  async getSchoolsWithClassCount(): Promise<(School & { classes_count: number })[]> {
    const ownerId = await getOwnerId();
    const schools = await this.getMySchools();
    const result = [];

    for (const school of schools) {
      const classesQuery = query(
        getOwnedQuery("classes"),
        where("school_id", "==", school.id)
      );
      const classesSnap = await getDocs(classesQuery);
      result.push({
        ...school,
        classes_count: classesSnap.size
      });
    }

    return result;
  }
};
