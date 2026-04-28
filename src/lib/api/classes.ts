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
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import type { Class, Student, ClassStudent, CreateClassForm } from "$lib/types";
import { getOwnerId, getOwnedQuery } from "./base";
import { schoolsApi } from "./schools";

export const classesApi = {
  /**
   * Obtiene todas las clases del profesor actual.
   * Incluye información del centro (denormalizada o vía join manual si falta).
   */
  async getMyClasses(): Promise<Class[]> {
    const q = query(getOwnedQuery("classes"), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    const classes = querySnapshot.docs.map(doc => toData<Class>(doc));

    // Si falta schoolName (datos antiguos), lo recuperamos manualmente
    for (const cls of classes) {
      if (cls.schoolId) {
        try {
          const school = await schoolsApi.getSchool(cls.schoolId);
          cls.schoolName = school.name;
        } catch (e) {
        }
      }
    }

    return classes;
  },

  /**
   * Obtiene las clases de un centro específico.
   */
  async getClassesBySchool(schoolId: string): Promise<Class[]> {
    const q = query(
      getOwnedQuery("classes"),
      where("schoolId", "==", schoolId),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Class>(doc));
  },

  /**
   * Obtiene todas las clases con información de ocupación (alumnos inscritos).
   */
  async getClassesWithOccupancy(): Promise<(Class & { enrolled?: number })[]> {
    const classes = await this.getMyClasses();
    
    for (const cls of classes) {
      const q = query(
        getOwnedQuery("class_students"),
        where("classId", "==", cls.id),
        where("status", "==", "active")
      );
      const snap = await getDocs(q);
      (cls as any).enrolled = snap.size;
    }

    return classes as any;
  },

  /**
   * Obtiene una clase específica por ID.
   */
  async getClass(id: string): Promise<Class> {
    const ownerId = await getOwnerId();
    const docRef = doc(db, "classes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Clase no encontrada");

    const cls = toData<Class>(docSnap);
    if (cls.ownerId !== ownerId) throw new Error("Acceso denegado");

    // Asegurar schoolName
    if (cls.schoolId) {
      const school = await schoolsApi.getSchool(cls.schoolId);
      cls.schoolName = school.name;
    }

    return cls;
  },

  /**
   * Crea una nueva clase. 
   * Denormaliza el schoolName para optimizar lecturas.
   */
  async createClass(classData: CreateClassForm): Promise<Class> {
    const ownerId = await getOwnerId();
    
    // Recuperamos el nombre del centro para denormalizar
    const school = await schoolsApi.getSchool(classData.schoolId as string);

    const data = {
      ownerId: ownerId,
      name: classData.name,
      schoolId: classData.schoolId,
      schoolName: school.name, // Denormalización
      description: classData.description || "",
      level: classData.level || "",
      schedule: classData.schedule || "",
      maxStudents: classData.maxStudents || 20,
      active: classData.active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "classes"), data);
    const docSnap = await getDoc(docRef);
    return toData<Class>(docSnap);
  },

  /**
   * Actualiza los datos de una clase.
   */
  async updateClass(id: string, updates: Partial<CreateClassForm>): Promise<Class> {
    const ownerId = await getOwnerId();
    const docRef = doc(db, "classes", id);
    
    const current = await this.getClass(id);
    if (current.ownerId !== ownerId) throw new Error("No autorizado");

    // Si cambia el schoolId, actualizamos también el schoolName
    if (updates.schoolId && updates.schoolId !== current.schoolId) {
       const school = await schoolsApi.getSchool(updates.schoolId);
       (updates as any).schoolName = school.name;
    }

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updatedSnap = await getDoc(docRef);
    return toData<Class>(updatedSnap);
  },

  /**
   * Elimina una clase.
   */
  async deleteClass(id: string): Promise<void> {
    const ownerId = await getOwnerId();
    const current = await this.getClass(id);
    if (current.ownerId !== ownerId) throw new Error("No autorizado");

    await deleteDoc(doc(db, "classes", id));
  },

  /**
   * Obtiene los alumnos activos en una clase.
   */
  async getClassStudents(classId: string): Promise<Student[]> {
    const q = query(
      getOwnedQuery("class_students"),
      where("classId", "==", classId),
      where("status", "==", "active")
    );

    const querySnapshot = await getDocs(q);
    const studentIds = querySnapshot.docs.map(doc => (doc.data() as any).studentId);

    const students: Student[] = [];
    for (const sid of studentIds) {
      const studentDoc = await getDoc(doc(db, "students", sid));
      if (studentDoc.exists()) {
        students.push(toData<Student>(studentDoc));
      }
    }

    return students;
  },

  /**
   * Obtiene todas las inscripciones (activas o no) de una clase.
   */
  async getClassEnrollments(classId: string): Promise<ClassStudent[]> {
    const q = query(
      getOwnedQuery("class_students"),
      where("classId", "==", classId)
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(doc => toData<ClassStudent>(doc));

    for (const enrollment of enrollments) {
      const studentDoc = await getDoc(doc(db, "students", enrollment.studentId));
      if (studentDoc.exists()) {
        (enrollment as any).students = toData<any>(studentDoc);
      }
    }

    return enrollments;
  },

  /**
   * Obtiene el temario (habilidades) de una clase.
   */
  async getClassSkills(classId: string): Promise<any[]> {
    const q = query(
      getOwnedQuery("class_skills"),
      where("classId", "==", classId),
      orderBy("orderIndex", "asc")
    );

    const querySnapshot = await getDocs(q);
    const classSkills = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const cs of classSkills) {
      if (cs.skillId) {
        const skillDoc = await getDoc(doc(db, "skills", cs.skillId));
        if (skillDoc.exists()) {
          (cs as any).skills = toData<any>(skillDoc);
        }
      }
    }

    return classSkills;
  },

  /**
   * Duplica una clase y su temario.
   */
  async duplicateClass(classId: string, newName: string): Promise<Class> {
    const ownerId = await getOwnerId();
    const originalClass = await this.getClass(classId);
    
    const newClass = await this.createClass({
      name: newName,
      schoolId: originalClass.schoolId,
      description: originalClass.description,
      level: originalClass.level,
      schedule: originalClass.schedule,
      maxStudents: originalClass.maxStudents,
      active: true
    });

    // Copiar habilidades
    const q = query(
      getOwnedQuery("class_skills"),
      where("classId", "==", classId)
    );
    const skillsSnap = await getDocs(q);
    
    const batch = writeBatch(db);
    skillsSnap.docs.forEach(skillDoc => {
      const data = skillDoc.data();
      const newSkillRef = doc(collection(db, "class_skills"));
      batch.set(newSkillRef, {
        ownerId: ownerId,
        classId: newClass.id,
        skillId: (data as any).skillId,
        orderIndex: (data as any).orderIndex,
        createdAt: new Date().toISOString()
      });
    });

    await batch.commit();
    return newClass;
  },

  /**
   * Obtiene analíticas básicas de una clase.
   */
  async getClassAnalytics(classId: string): Promise<any> {
    const classInfo = await this.getClass(classId);
    
    // Ocupación
    const occupancyQ = query(
        getOwnedQuery("class_students"),
        where("classId", "==", classId),
        where("status", "==", "active")
    );
    const occupancySnap = await getDocs(occupancyQ);
    
    // Habilidades
    const skillsSnap = await getDocs(query(
        getOwnedQuery("class_skills"),
        where("classId", "==", classId)
    ));

    // Asistencia reciente (últimos 30 días)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const attendanceQ = query(
      getOwnedQuery("attendance"),
      where("classId", "==", classId),
      where("date", ">=", thirtyDaysAgo)
    );
    const attendanceSnap = await getDocs(attendanceQ);
    const filteredAttendance = attendanceSnap.docs.map(doc => doc.data());

    const totalAttendanceRecords = filteredAttendance.length;
    const presentRecords = filteredAttendance.filter((a: any) => a.status === 'P').length;
    const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

    return {
      class: classInfo,
      enrolledStudents: occupancySnap.size,
      skillsCount: skillsSnap.size,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    };
  }
};
