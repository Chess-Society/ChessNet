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
  writeBatch,
  type DocumentData
} from "firebase/firestore";
import type { Class, Student, ClassStudent, CreateClassForm } from "$lib/types";

// Helper to convert Firestore document to data with ID
const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

export const classesApi = {
  // Get all classes for the current user
  async getMyClasses(userId?: string): Promise<Class[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "classes"),
      where("user_id", "==", uid),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    const classes = querySnapshot.docs.map(doc => toData<Class>(doc));

    // Fetch college info for each class (Manual join)
    for (const cls of classes) {
      if (cls.college_id) {
        const collegeDoc = await getDoc(doc(db, "colleges", cls.college_id));
        if (collegeDoc.exists()) {
          (cls as any).colleges = toData<any>(collegeDoc);
        }
      }
    }

    return classes;
  },

  // Get classes for a specific school
  async getClassesBySchool(schoolId: string, userId?: string): Promise<Class[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "classes"),
      where("user_id", "==", uid),
      where("college_id", "==", schoolId),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Class>(doc));
  },

  // Get classes with occupancy info
  async getClassesWithOccupancy(): Promise<(Class & { enrolled?: number })[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const classes = await this.getMyClasses();
    
    for (const cls of classes) {
      const q = query(
        collection(db, "class_students"),
        where("class_id", "==", cls.id),
        where("status", "==", "active")
      );
      const snap = await getDocs(q);
      (cls as any).enrolled = snap.size;
    }

    return classes as any;
  },

  // Get a specific class
  async getClass(id: string, userId?: string): Promise<Class> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const docRef = doc(db, "classes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== uid) {
      throw new Error("Class not found or access denied");
    }

    const cls = toData<Class>(docSnap);

    // Fetch college info
    if (cls.college_id) {
      const collegeDoc = await getDoc(doc(db, "colleges", cls.college_id));
      if (collegeDoc.exists()) {
        (cls as any).colleges = toData<any>(collegeDoc);
      }
    }

    return cls;
  },

  // Create a new class
  async createClass(classData: CreateClassForm): Promise<Class> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "classes"), {
      user_id: user.uid,
      name: classData.name,
      college_id: classData.college_id,
      description: classData.description || "",
      level: classData.level || "",
      schedule: classData.schedule || "",
      max_students: classData.max_students || 20,
      active: classData.active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<Class>(docSnap);
  },

  // Update a class
  async updateClass(id: string, updates: Partial<CreateClassForm>): Promise<Class> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "classes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("Class not found or access denied");
    }

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const updatedSnap = await getDoc(docRef);
    return toData<Class>(updatedSnap);
  },

  // Delete a class
  async deleteClass(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "classes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("Class not found or access denied");
    }

    await deleteDoc(docRef);
  },

  // Get students in a class
  async getClassStudents(classId: string, userId?: string): Promise<Student[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "class_students"),
      where("owner_id", "==", uid),
      where("class_id", "==", classId),
      where("status", "==", "active")
    );

    const querySnapshot = await getDocs(q);
    const studentIds = querySnapshot.docs.map(doc => doc.data().student_id);

    const students: Student[] = [];
    for (const sid of studentIds) {
      const studentDoc = await getDoc(doc(db, "students", sid));
      if (studentDoc.exists()) {
        students.push(toData<Student>(studentDoc));
      }
    }

    return students;
  },

  // Get all enrollments for a class
  async getClassEnrollments(classId: string, userId?: string): Promise<ClassStudent[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "class_students"),
      where("owner_id", "==", uid),
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

  // Get class skills (temario)
  async getClassSkills(classId: string, userId?: string): Promise<any[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", uid),
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

  // Get class occupancy
  async getClassOccupancy(classId: string, userId?: string): Promise<number> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "class_students"),
      where("owner_id", "==", uid),
      where("class_id", "==", classId),
      where("status", "==", "active")
    );
    
    const snap = await getDocs(q);
    return snap.size;
  },

  // Get class attendance for a specific date
  async getClassAttendance(classId: string, date: string, userId?: string): Promise<any[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "attendance"),
      where("user_id", "==", uid),
      where("class_id", "==", classId),
      where("date", "==", date)
    );

    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const record of records) {
      const studentDoc = await getDoc(doc(db, "students", record.student_id));
      if (studentDoc.exists()) {
        (record as any).students = toData<any>(studentDoc);
      }
    }

    return records;
  },

  // Get class attendance summary
  async getClassAttendanceSummary(classId: string, startDate?: string, endDate?: string, userId?: string): Promise<any[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    let q = query(
      collection(db, "attendance"),
      where("user_id", "==", uid),
      where("class_id", "==", classId)
    );

    const querySnapshot = await getDocs(q);
    let records = querySnapshot.docs.map(doc => toData<any>(doc));

    if (startDate) {
      records = records.filter(r => r.date >= startDate);
    }
    if (endDate) {
      records = records.filter(r => r.date <= endDate);
    }

    // Map student names
    for (const record of records) {
      const studentDoc = await getDoc(doc(db, "students", record.student_id));
      if (studentDoc.exists()) {
        (record as any).students = { name: studentDoc.data().name };
      }
    }

    return records;
  },

  // Duplicate a class
  async duplicateClass(classId: string, newName: string): Promise<Class> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const originalClass = await this.getClass(classId);
    
    const newClass = await this.createClass({
      name: newName,
      college_id: originalClass.college_id,
      description: originalClass.description,
      level: originalClass.level,
      schedule: originalClass.schedule,
      max_students: originalClass.max_students,
      active: true
    });

    // Copy skills
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("class_id", "==", classId)
    );
    const skillsSnap = await getDocs(q);
    
    const batch = writeBatch(db);
    skillsSnap.docs.forEach(skillDoc => {
      const data = skillDoc.data();
      const newSkillRef = doc(collection(db, "class_skills"));
      batch.set(newSkillRef, {
        owner_id: user.uid,
        class_id: newClass.id,
        skill_id: data.skill_id,
        order_index: data.order_index,
        created_at: new Date().toISOString()
      });
    });

    await batch.commit();
    return newClass;
  },

  // Get class analytics
  async getClassAnalytics(classId: string, userId?: string): Promise<any> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const classInfo = await this.getClass(classId, uid);
    const occupancy = await this.getClassOccupancy(classId, uid);
    
    const skillsQuery = query(
      collection(db, "class_skills"),
      where("owner_id", "==", uid),
      where("class_id", "==", classId)
    );
    const skillsSnap = await getDocs(skillsQuery);

    const attendanceQuery = query(
      collection(db, "attendance"),
      where("user_id", "==", uid),
      where("class_id", "==", classId)
    );
    const attendanceSnap = await getDocs(attendanceQuery);
    const recentAttendance = attendanceSnap.docs.map(doc => doc.data());
    
    // Filter last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const filteredAttendance = recentAttendance.filter(a => a.date >= thirtyDaysAgo);

    const totalAttendanceRecords = filteredAttendance.length;
    const presentRecords = filteredAttendance.filter(a => a.status === 'P').length;
    const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

    return {
      class: classInfo,
      enrolled_students: occupancy,
      skills_count: skillsSnap.size,
      attendance_rate: Math.round(attendanceRate * 100) / 100
    };
  }
};