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
  setDoc,
  writeBatch
} from "firebase/firestore";
import type { Student, Attendance, CreateStudentForm } from "$lib/types";
import { getOwnerId, getOwnedQuery } from "./base";

export const studentsApi = {
  /**
   * Obtiene todos los alumnos del profesor actual.
   */
  async getMyStudents(): Promise<Student[]> {
    const q = query(getOwnedQuery("students"), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Student>(doc));
  },

  /**
   * Obtiene los alumnos de un centro específico.
   */
  async getStudentsBySchool(schoolId: string): Promise<Student[]> {
    const q = query(
      getOwnedQuery("students"),
      where("schoolId", "==", schoolId),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Student>(doc));
  },

  /**
   * Obtiene un alumno específico por ID.
   */
  async getStudent(id: string): Promise<Student> {
    const docRef = doc(db, "students", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Alumno no encontrado");

    const data = toData<Student>(docSnap);
    const ownerId = await getOwnerId();
    
    if (data.owner_id !== ownerId) {
      throw new Error("Acceso denegado");
    }

    return data;
  },

  /**
   * Crea un nuevo alumno.
   */
  async createStudent(studentData: CreateStudentForm): Promise<Student> {
    const ownerId = await getOwnerId();

    const data = {
      ...studentData,
      owner_id: ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "students"), data);
    const docSnap = await getDoc(docRef);
    return toData<Student>(docSnap);
  },

  /**
   * Actualiza un alumno.
   */
  async updateStudent(id: string, updates: Partial<CreateStudentForm>): Promise<Student> {
    const ownerId = await getOwnerId();
    const docRef = doc(db, "students", id);
    
    const current = await this.getStudent(id);
    if (current.owner_id !== ownerId) throw new Error("No autorizado");

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updatedSnap = await getDoc(docRef);
    return toData<Student>(updatedSnap);
  },

  /**
   * Elimina un alumno.
   */
  async deleteStudent(id: string): Promise<void> {
    const ownerId = await getOwnerId();
    const current = await this.getStudent(id);
    if (current.owner_id !== ownerId) throw new Error("No autorizado");

    await deleteDoc(doc(db, "students", id));
  },

  /**
   * Creación masiva de alumnos.
   */
  async bulkCreateStudents(students: CreateStudentForm[]): Promise<void> {
    const ownerId = await getOwnerId();
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    students.forEach(student => {
      const docRef = doc(collection(db, "students"));
      batch.set(docRef, {
        ...student,
        owner_id: ownerId,
        createdAt: now,
        updatedAt: now,
      });
    });

    await batch.commit();
  },

  // --- Asistencia ---

  /**
   * Guarda múltiples registros de asistencia.
   */
  async saveAttendance(classId: string, date: string, attendanceList: { studentId: string; status: string; notes?: string }[]): Promise<void> {
    const ownerId = await getOwnerId();
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    for (const item of attendanceList) {
      const attendanceId = `${item.studentId}_${classId}_${date}`;
      const docRef = doc(db, "attendance", attendanceId);
      
      batch.set(docRef, {
        owner_id: ownerId,
        classId: classId,
        studentId: item.studentId,
        date: date,
        status: item.status,
        notes: item.notes || "",
        updatedAt: now
      });
    }

    await batch.commit();
  },

  /**
   * Obtiene el historial de asistencia de un alumno.
   */
  async getStudentAttendance(studentId: string): Promise<Attendance[]> {
    const q = query(
      getOwnedQuery("attendance"),
      where("studentId", "==", studentId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Attendance>(doc));
  },

  /**
   * Resumen de asistencia de un alumno.
   */
  async getStudentAttendanceSummary(studentId: string): Promise<any> {
    const attendance = await this.getStudentAttendance(studentId);
    
    const presentCount = attendance.filter((a: any) => a.status === 'P').length;
    const absentCount = attendance.filter((a: any) => a.status === 'A').length;
    const lateCount = attendance.filter(a => a.status === 'T').length;
    const totalSessions = attendance.length;

    return {
      studentId: studentId,
      presentCount: presentCount,
      absentCount: absentCount,
      lateCount: lateCount,
      totalSessions: totalSessions,
      attendanceRate: totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0
    };
  },

  // --- Habilidades y Progreso ---

  /**
   * Obtiene el nivel de habilidades de un alumno.
   */
  async getStudentSkills(studentId: string): Promise<any[]> {
    const q = query(
      getOwnedQuery("student_skills"),
      where("studentId", "==", studentId)
    );

    const querySnapshot = await getDocs(q);
    const studentSkills = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const ss of studentSkills) {
      if (ss.skillId) {
        const skillDoc = await getDoc(doc(db, "skills", ss.skillId));
        if (skillDoc.exists()) {
          ss.skills = toData<any>(skillDoc);
        }
      }
    }

    return studentSkills;
  },

  /**
   * Actualiza el progreso de una habilidad.
   */
  async updateStudentSkill(
    studentId: string,
    skillId: string,
    level: number,
    mastered: boolean,
    notes?: string
  ): Promise<any> {
    const ownerId = await getOwnerId();
    const skillProgressId = `${studentId}_${skillId}`;
    const docRef = doc(db, "student_skills", skillProgressId);
    
    const data = {
      owner_id: ownerId,
      studentId: studentId,
      skillId: skillId,
      level,
      mastered,
      notes: notes || "",
      lastPracticed: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, data, { merge: true });
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },

  /**
   * Obtiene alumnos con su resumen de asistencia inyectado.
   */
  async getStudentsWithAttendance(): Promise<any[]> {
    const students = await this.getMyStudents();
    
    for (const s of students) {
      (s as any).v_student_attendance = await this.getStudentAttendanceSummary(s.id);
    }

    return students;
  }
};
