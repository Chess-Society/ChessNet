import { db, toData, getUserPath } from "$lib/firebase";
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

export const classStudentsApi = {
  // Get all students enrolled in a class
  async getClassStudents(classId: string): Promise<(ClassStudent & { student: Student })[]> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "class_students"),
      where("class_id", "==", classId),
      where("status", "==", "active"),
      orderBy("enrolled_at", "asc")
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const enrollment of enrollments) {
      if (enrollment.student_id) {
        const studentDoc = await getDoc(doc(db, userPath, "students", enrollment.student_id));
        if (studentDoc.exists()) {
          enrollment.student = toData<Student>(studentDoc);
        }
      }
    }

    return enrollments;
  },

  // Get all classes where a student is enrolled
  async getStudentClasses(studentId: string): Promise<(ClassStudent & { class: any })[]> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "class_students"),
      where("student_id", "==", studentId),
      where("status", "==", "active"),
      orderBy("enrolled_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const enrollment of enrollments) {
      if (enrollment.class_id) {
        const classDoc = await getDoc(doc(db, userPath, "classes", enrollment.class_id));
        if (classDoc.exists()) {
          enrollment.class = toData<any>(classDoc);
        }
      }
    }

    return enrollments;
  },

  // Enroll a student in a class
  async enrollStudent(classId: string, studentId: string): Promise<ClassStudent> {
    const userPath = getUserPath();

    // Check if already enrolled
    const q = query(
      collection(db, userPath, "class_students"),
      where("class_id", "==", classId),
      where("student_id", "==", studentId)
    );
    const existingSnap = await getDocs(q);
    
    if (!existingSnap.empty) {
      const existing = existingSnap.docs[0];
      const data = existing.data();
      if (data.status === "active") {
        throw new Error("Student is already enrolled in this class");
      } else {
        // Reactivate enrollment
        return this.updateEnrollmentStatus(existing.id, "active");
      }
    }

    const docRef = await addDoc(collection(db, userPath, "class_students"), {
      class_id: classId,
      student_id: studentId,
      status: "active",
      enrolled_at: new Date().toISOString()
    });

    const docSnap = await getDoc(docRef);
    return toData<ClassStudent>(docSnap);
  },

  // Enroll multiple students in a class
  async enrollStudents(classId: string, studentIds: string[]): Promise<ClassStudent[]> {
    const userPath = getUserPath();
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const newRefs: any[] = [];

    for (const studentId of studentIds) {
      const docRef = doc(collection(db, userPath, "class_students"));
      batch.set(docRef, {
        class_id: classId,
        student_id: studentId,
        status: "active",
        enrolled_at: now
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

  // Remove a student from a class
  async unenrollStudent(classId: string, studentId: string): Promise<void> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "class_students"),
      where("class_id", "==", classId),
      where("student_id", "==", studentId)
    );
    const snap = await getDocs(q);
    
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.update(d.ref, { status: "inactive" }));
    await batch.commit();
  },

  // Remove multiple students from a class
  async unenrollStudents(classId: string, studentIds: string[]): Promise<void> {
    for (const studentId of studentIds) {
      await this.unenrollStudent(classId, studentId);
    }
  },

  // Update enrollment status
  async updateEnrollmentStatus(
    enrollmentId: string, 
    status: "active" | "inactive" | "suspended"
  ): Promise<ClassStudent> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "class_students", enrollmentId);
    await updateDoc(docRef, { status });

    const docSnap = await getDoc(docRef);
    return toData<ClassStudent>(docSnap);
  },

  // Get class occupancy
  async getClassOccupancy(classId: string): Promise<number> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "class_students"),
      where("class_id", "==", classId),
      where("status", "==", "active")
    );
    
    const snap = await getDocs(q);
    return snap.size;
  },

  // Get all class occupancies for user
  async getAllClassOccupancies(): Promise<{ class_id: string; enrolled: number }[]> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "class_students"),
      where("status", "==", "active")
    );
    
    const snap = await getDocs(q);
    const enrollments = snap.docs.map(doc => doc.data());
    
    const countMap = enrollments.reduce((acc, e) => {
      acc[e.class_id] = (acc[e.class_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countMap).map(([class_id, enrolled]) => ({ class_id, enrolled }));
  },

  // Get students not enrolled in a specific class
  async getAvailableStudents(classId: string): Promise<Student[]> {
    const userPath = getUserPath();

    // Get all user's students
    const studentsQuery = query(
      collection(db, userPath, "students")
    );
    const studentsSnap = await getDocs(studentsQuery);
    const allStudents = studentsSnap.docs.map(doc => toData<Student>(doc));

    // Get enrolled student IDs
    const enrolledQuery = query(
      collection(db, userPath, "class_students"),
      where("class_id", "==", classId),
      where("status", "==", "active")
    );
    const enrolledSnap = await getDocs(enrolledQuery);
    const enrolledIds = new Set(enrolledSnap.docs.map(e => e.data().student_id));
    
    // Filter out enrolled students
    return allStudents.filter(student => !enrolledIds.has(student.id));
  },

  // Transfer students from one class to another
  async transferStudents(fromClassId: string, toClassId: string, studentIds: string[]): Promise<void> {
    await this.unenrollStudents(fromClassId, studentIds);
    await this.enrollStudents(toClassId, studentIds);
  },

  // Get enrollment history for a student
  async getStudentEnrollmentHistory(studentId: string): Promise<ClassStudent[]> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "class_students"),
      where("student_id", "==", studentId),
      orderBy("enrolled_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const enrollment of enrollments) {
      if (enrollment.class_id) {
        const classDoc = await getDoc(doc(db, userPath, "classes", enrollment.class_id));
        if (classDoc.exists()) {
          enrollment.classes = toData<any>(classDoc);
        }
      }
    }

    return enrollments;
  }
};
