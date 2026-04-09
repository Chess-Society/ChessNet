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
  setDoc,
  writeBatch,
  type DocumentData
} from "firebase/firestore";
import type { Student, Attendance, CreateStudentForm } from "$lib/types";

// Helper to convert Firestore document to data with ID
const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

export const studentsApi = {
  // Get all students for the current user
  async getMyStudents(userId?: string): Promise<Student[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "students"),
      where("user_id", "==", uid),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Student>(doc));
  },

  // Get students by school
  async getStudentsBySchool(schoolId: string): Promise<Student[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "students"),
      where("user_id", "==", user.uid),
      where("school_id", "==", schoolId),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Student>(doc));
  },

  // Get a specific student
  async getStudent(id: string, userId?: string): Promise<Student> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const docRef = doc(db, "students", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== uid) {
      throw new Error("Student not found or access denied");
    }

    return toData<Student>(docSnap);
  },

  // Create a new student
  async createStudent(studentData: CreateStudentForm): Promise<Student> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "students"), {
      ...studentData,
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<Student>(docSnap);
  },

  // Update a student
  async updateStudent(id: string, updates: Partial<CreateStudentForm>): Promise<Student> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "students", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("Student not found or access denied");
    }

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const updatedSnap = await getDoc(docRef);
    return toData<Student>(updatedSnap);
  },

  // Delete a student
  async deleteStudent(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "students", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("Student not found or access denied");
    }

    await deleteDoc(docRef);
  },

  // Bulk create students
  async bulkCreateStudents(students: CreateStudentForm[]): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const batch = writeBatch(db);
    const now = new Date().toISOString();

    students.forEach(student => {
      const docRef = doc(collection(db, "students"));
      batch.set(docRef, {
        ...student,
        user_id: user.uid,
        created_at: now,
        updated_at: now,
      });
    });

    await batch.commit();
  },

  // --- Attendance ---

  // Save attendance for multiple students
  async saveAttendance(classId: string, date: string, attendanceList: { student_id: string; status: string; notes?: string }[]): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const batch = writeBatch(db);
    const now = new Date().toISOString();

    for (const item of attendanceList) {
      // Use composite ID for unique attendance record per student/class/date
      const attendanceId = `${item.student_id}_${classId}_${date}`;
      const docRef = doc(db, "attendance", attendanceId);
      
      batch.set(docRef, {
        user_id: user.uid,
        class_id: classId,
        student_id: item.student_id,
        date: date,
        status: item.status,
        notes: item.notes || "",
        updated_at: now
      });
    }

    await batch.commit();
  },

  // Get attendance records for a student
  async getStudentAttendance(studentId: string): Promise<Attendance[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "attendance"),
      where("user_id", "==", user.uid),
      where("student_id", "==", studentId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Attendance>(doc));
  },

  // Get student attendance summary (manual implementation)
  async getStudentAttendanceSummary(studentId: string): Promise<any> {
    const attendance = await this.getStudentAttendance(studentId);
    
    const present = attendance.filter(a => a.status === 'P').length;
    const absent = attendance.filter(a => a.status === 'A').length;
    const late = attendance.filter(a => a.status === 'T').length;
    const total = attendance.length;

    return {
      student_id: studentId,
      present_count: present,
      absent_count: absent,
      late_count: late,
      total_sessions: total,
      attendance_rate: total > 0 ? (present / total) * 100 : 0
    };
  },

  // --- Skills & Progress ---

  // Get student skill levels
  async getStudentSkills(studentId: string): Promise<any[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "student_skills"),
      where("user_id", "==", user.uid),
      where("student_id", "==", studentId)
    );

    const querySnapshot = await getDocs(q);
    const studentSkills = querySnapshot.docs.map(doc => toData<any>(doc));

    // Fetch skill details
    for (const ss of studentSkills) {
      if (ss.skill_id) {
        const skillDoc = await getDoc(doc(db, "skills", ss.skill_id));
        if (skillDoc.exists()) {
          ss.skills = toData<any>(skillDoc);
        }
      }
    }

    return studentSkills;
  },

  // Update student skill progress
  async updateStudentSkill(
    studentId: string,
    skillId: string,
    level: number,
    mastered: boolean,
    notes?: string
  ): Promise<any> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const skillProgressId = `${studentId}_${skillId}`;
    const docRef = doc(db, "student_skills", skillProgressId);
    
    const docData = {
      user_id: user.uid,
      student_id: studentId,
      skill_id: skillId,
      level,
      mastered,
      notes: notes || "",
      last_practiced: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await setDoc(docRef, docData, { merge: true });
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },

  // Get students with attendance summary (Simplificado)
  async getStudentsWithAttendance(): Promise<any[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const students = await this.getMyStudents();
    
    // Inyectamos un resumen manual para cada estudiante
    for (const s of students) {
      (s as any).v_student_attendance = await this.getStudentAttendanceSummary(s.id);
    }

    return students;
  }
};