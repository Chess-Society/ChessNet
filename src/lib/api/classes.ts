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
    const ownerId = await getOwnerId();
    const q = query(getOwnedQuery("classes"), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    const classes = querySnapshot.docs.map(doc => toData<Class>(doc));

    // Si falta school_name (datos antiguos), lo recuperamos manualmente
    for (const cls of classes) {
      if (cls.school_id) {
        try {
          const school = await schoolsApi.getSchool(cls.school_id);
          cls.school_name = school.name;
        } catch (e) {
          console.warn(`No se pudo obtener el nombre del centro para la clase ${cls.id}`);
        }
      }
    }

    return classes;
  },

  /**
   * Obtiene las clases de un centro específico.
   */
  async getClassesBySchool(schoolId: string): Promise<Class[]> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("classes"),
      where("school_id", "==", schoolId),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Class>(doc));
  },

  /**
   * Obtiene todas las clases con información de ocupación (alumnos inscritos).
   */
  async getClassesWithOccupancy(): Promise<(Class & { enrolled?: number })[]> {
    const ownerId = await getOwnerId();
    const classes = await this.getMyClasses();
    
    for (const cls of classes) {
      const q = query(
        getOwnedQuery("class_students"),
        where("class_id", "==", cls.id),
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
    if (cls.owner_id !== ownerId) throw new Error("Acceso denegado");

    // Asegurar school_name
    if (cls.school_id) {
      const school = await schoolsApi.getSchool(cls.school_id);
      cls.school_name = school.name;
    }

    return cls;
  },

  /**
   * Crea una nueva clase. 
   * Denormaliza el school_name para optimizar lecturas.
   */
  async createClass(classData: CreateClassForm): Promise<Class> {
    const ownerId = await getOwnerId();
    
    // Recuperamos el nombre del centro para denormalizar
    const school = await schoolsApi.getSchool(classData.school_id as string);

    const data = {
      owner_id: ownerId,
      name: classData.name,
      school_id: classData.school_id,
      school_name: school.name, // Denormalización
      description: classData.description || "",
      level: classData.level || "",
      schedule: classData.schedule || "",
      max_students: classData.max_students || 20,
      active: classData.active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
    if (current.owner_id !== ownerId) throw new Error("No autorizado");

    // Si cambia el school_id, actualizamos también el school_name
    if (updates.school_id && updates.school_id !== current.school_id) {
       const school = await schoolsApi.getSchool(updates.school_id);
       (updates as any).school_name = school.name;
    }

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
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
    if (current.owner_id !== ownerId) throw new Error("No autorizado");

    await deleteDoc(doc(db, "classes", id));
  },

  /**
   * Obtiene los alumnos activos en una clase.
   */
  async getClassStudents(classId: string): Promise<Student[]> {
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_students"),
      where("class_id", "==", classId),
      where("status", "==", "active")
    );

    const querySnapshot = await getDocs(q);
    const studentIds = querySnapshot.docs.map(doc => (doc.data() as any).student_id);

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
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_students"),
      where("class_id", "==", classId)
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(doc => toData<ClassStudent>(doc));

    for (const enrollment of enrollments) {
      const studentDoc = await getDoc(doc(db, "students", enrollment.student_id));
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
    const ownerId = await getOwnerId();
    const q = query(
      getOwnedQuery("class_skills"),
      where("class_id", "==", classId),
      orderBy("order_index", "asc")
    );

    const querySnapshot = await getDocs(q);
    const classSkills = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const cs of classSkills) {
      if (cs.skill_id) {
        const skillDoc = await getDoc(doc(db, "skills", cs.skill_id));
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
      school_id: originalClass.school_id,
      description: originalClass.description,
      level: originalClass.level,
      schedule: originalClass.schedule,
      max_students: originalClass.max_students,
      active: true
    });

    // Copiar habilidades
    const q = query(
      getOwnedQuery("class_skills"),
      where("class_id", "==", classId)
    );
    const skillsSnap = await getDocs(q);
    
    const batch = writeBatch(db);
    skillsSnap.docs.forEach(skillDoc => {
      const data = skillDoc.data();
      const newSkillRef = doc(collection(db, "class_skills"));
      batch.set(newSkillRef, {
        owner_id: ownerId,
        class_id: newClass.id,
        skill_id: (data as any).skill_id,
        order_index: (data as any).order_index,
        created_at: new Date().toISOString()
      });
    });

    await batch.commit();
    return newClass;
  },

  /**
   * Obtiene analíticas básicas de una clase.
   */
  async getClassAnalytics(classId: string): Promise<any> {
    const ownerId = await getOwnerId();
    const classInfo = await this.getClass(classId);
    
    // Ocupación
    const occupancyQ = query(
        getOwnedQuery("class_students"),
        where("class_id", "==", classId),
        where("status", "==", "active")
    );
    const occupancySnap = await getDocs(occupancyQ);
    
    // Habilidades
    const skillsSnap = await getDocs(query(
        getOwnedQuery("class_skills"),
        where("class_id", "==", classId)
    ));

    // Asistencia reciente (últimos 30 días)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const attendanceQ = query(
      getOwnedQuery("attendance"),
      where("class_id", "==", classId),
      where("date", ">=", thirtyDaysAgo)
    );
    const attendanceSnap = await getDocs(attendanceQ);
    const filteredAttendance = attendanceSnap.docs.map(doc => doc.data());

    const totalAttendanceRecords = filteredAttendance.length;
    const presentRecords = filteredAttendance.filter((a: any) => a.status === 'P').length;
    const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

    return {
      class: classInfo,
      enrolled_students: occupancySnap.size,
      skills_count: skillsSnap.size,
      attendance_rate: Math.round(attendanceRate * 100) / 100
    };
  }
};
