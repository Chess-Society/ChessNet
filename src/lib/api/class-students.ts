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
  writeBatch
} from "firebase/firestore";
import type { ClassStudent, Student } from "$lib/types";
import { getOwnerId, getOwnedQuery } from "./base";

export const classStudentsApi = {
  /**
   * Obtiene todos los alumnos inscritos activamente en una clase.
   */
  async getClassStudents(classId: string): Promise<(ClassStudent & { student: Student })[]> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_students"),
      where("classId", "==", classId),
      where("status", "==", "active"),
      orderBy("enrolledAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const enrollment of enrollments) {
      if (enrollment.studentId) {
        const studentDoc = await getDoc(doc(db, "students", enrollment.studentId));
        if (studentDoc.exists()) {
          enrollment.student = toData<Student>(studentDoc);
        }
      }
    }

    return enrollments;
  },

  /**
   * Obtiene todas las clases en las que un alumno está inscrito.
   */
  async getStudentClasses(studentId: string): Promise<(ClassStudent & { class: any })[]> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_students"),
      where("studentId", "==", studentId),
      where("status", "==", "active"),
      orderBy("enrolledAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const enrollment of enrollments) {
      if (enrollment.classId) {
        const classDoc = await getDoc(doc(db, "classes", enrollment.classId));
        if (classDoc.exists()) {
          enrollment.class = toData<any>(classDoc);
        }
      }
    }

    return enrollments;
  },

  /**
   * Inscribe a un alumno en una clase.
   */
  async enrollStudent(classId: string, studentId: string): Promise<ClassStudent> {
    const ownerId = await getOwnerId();

    // Verificar si ya existe una inscripción
    const q = query(
      getOwnedQuery("class_students"),
      where("classId", "==", classId),
      where("studentId", "==", studentId)
    );
    const existingSnap = await getDocs(q);
    
    if (!existingSnap.empty) {
      const existing = existingSnap.docs[0];
      const data = existing.data();
      if ((data as any).status === "active") {
        throw new Error("El alumno ya está inscrito en esta clase");
      } else {
        // Reactivar inscripción
        return this.updateEnrollmentStatus(existing.id, "active");
      }
    }

    const docData = {
      owner_id: ownerId,
      classId: classId,
      studentId: studentId,
      status: "active",
      enrolledAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "class_students"), docData);
    const docSnap = await getDoc(docRef);
    return toData<ClassStudent>(docSnap);
  },

  /**
   * Inscribe a múltiples alumnos en una clase.
   */
  async enrollStudents(classId: string, studentIds: string[]): Promise<ClassStudent[]> {
    const ownerId = await getOwnerId();
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const newRefs: any[] = [];

    for (const studentId of studentIds) {
      const docRef = doc(collection(db, "class_students"));
      batch.set(docRef, {
        owner_id: ownerId,
        classId: classId,
        studentId: studentId,
        status: "active",
        enrolledAt: now
      });
      newRefs.push(docRef);
    }

    await batch.commit();

    const result: ClassStudent[] = [];
    for (const ref of newRefs) {
      const snap = await getDoc(ref);
      if (snap.exists()) result.push(toData<ClassStudent>(snap));
    }
    return result;
  },

  /**
   * Desinscribe (desactiva) a un alumno de una clase.
   */
  async unenrollStudent(classId: string, studentId: string): Promise<void> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_students"),
      where("classId", "==", classId),
      where("studentId", "==", studentId)
    );
    const snap = await getDocs(q);
    
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.update(d.ref, { status: "inactive" }));
    await batch.commit();
  },

  /**
   * Desinscribe a múltiples alumnos de una clase.
   */
  async unenrollStudents(classId: string, studentIds: string[]): Promise<void> {
    for (const studentId of studentIds) {
      await this.unenrollStudent(classId, studentId);
    }
  },

  /**
   * Actualiza el estado de una inscripción.
   */
  async updateEnrollmentStatus(
    enrollmentId: string, 
    status: "active" | "inactive" | "suspended"
  ): Promise<ClassStudent> {
    const ownerId = await getOwnerId();
    const docRef = doc(db, "class_students", enrollmentId);
    
    // Verificación de propiedad
    const snapBefore = await getDoc(docRef);
    if (snapBefore.exists() && snapBefore.data().owner_id !== ownerId) {
        throw new Error("No autorizado");
    }

    await updateDoc(docRef, { status });
    const docSnap = await getDoc(docRef);
    return toData<ClassStudent>(docSnap);
  },

  /**
   * Obtiene la ocupación actual de una clase.
   */
  async getClassOccupancy(classId: string): Promise<number> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_students"),
      where("classId", "==", classId),
      where("status", "==", "active")
    );
    
    const snap = await getDocs(q);
    return snap.size;
  },

  /**
   * Obtiene la ocupación de todas las clases del profesor.
   */
  async getAllClassOccupancies(): Promise<{ classId: string; enrolled: number }[]> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_students"),
      where("status", "==", "active")
    );
    
    const snap = await getDocs(q);
    const enrollments = snap.docs.map(doc => doc.data());
    
    const countMap = enrollments.reduce((acc: any, e: any) => {
      acc[e.classId] = (acc[e.classId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countMap).map(([classId, enrolled]) => ({ classId, enrolled: enrolled as number }));
  },

  /**
   * Obtiene alumnos que aún NO están inscritos en una clase específica.
   */
  async getAvailableStudents(classId: string): Promise<Student[]> {
    const ownerId = await getOwnerId();

    // Obtener todos los alumnos del profesor
    const studentsQuery = query(getOwnedQuery("students"));
    const studentsSnap = await getDocs(studentsQuery);
    const allStudents = studentsSnap.docs.map(doc => toData<Student>(doc));

    // Obtener IDs de alumnos ya inscritos
    const enrolledQuery = query(
      getOwnedQuery("class_students"),
      where("classId", "==", classId),
      where("status", "==", "active")
    );
    const enrolledSnap = await getDocs(enrolledQuery);
    const enrolledIds = new Set(enrolledSnap.docs.map(e => (e.data() as any).studentId));
    
    return allStudents.filter(student => !enrolledIds.has(student.id));
  },

  /**
   * Transfiere alumnos de una clase a otra.
   */
  async transferStudents(fromClassId: string, toClassId: string, studentIds: string[]): Promise<void> {
    await this.unenrollStudents(fromClassId, studentIds);
    await this.enrollStudents(toClassId, studentIds);
  },

  /**
   * Obtiene el historial de inscripciones de un alumno.
   */
  async getStudentEnrollmentHistory(studentId: string): Promise<ClassStudent[]> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_students"),
      where("studentId", "==", studentId),
      orderBy("enrolledAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const enrollment of enrollments) {
      if (enrollment.classId) {
        const classDoc = await getDoc(doc(db, "classes", enrollment.classId));
        if (classDoc.exists()) {
          enrollment.classes = toData<any>(classDoc);
        }
      }
    }

    return enrollments;
  }
};
