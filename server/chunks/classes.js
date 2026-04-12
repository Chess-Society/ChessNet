import { a as auth, d as db } from "./firebase.js";
import { query, collection, where, getDocs, writeBatch, doc, getDoc, orderBy, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
const toData = (doc2) => {
  return { id: doc2.id, ...doc2.data() };
};
const classesApi = {
  // Get all classes for the current user
  async getMyClasses(userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "classes"),
      where("user_id", "==", uid),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    const classes = querySnapshot.docs.map((doc2) => toData(doc2));
    for (const cls of classes) {
      if (cls.college_id) {
        const collegeDoc = await getDoc(doc(db, "colleges", cls.college_id));
        if (collegeDoc.exists()) {
          cls.colleges = toData(collegeDoc);
        }
      }
    }
    return classes;
  },
  // Get classes for a specific school
  async getClassesBySchool(schoolId, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "classes"),
      where("user_id", "==", uid),
      where("college_id", "==", schoolId),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc2) => toData(doc2));
  },
  // Get classes with occupancy info
  async getClassesWithOccupancy() {
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
      cls.enrolled = snap.size;
    }
    return classes;
  },
  // Get a specific class
  async getClass(id, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const docRef = doc(db, "classes", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data()?.user_id !== uid) {
      throw new Error("Class not found or access denied");
    }
    const cls = toData(docSnap);
    if (cls.college_id) {
      const collegeDoc = await getDoc(doc(db, "colleges", cls.college_id));
      if (collegeDoc.exists()) {
        cls.colleges = toData(collegeDoc);
      }
    }
    return cls;
  },
  // Create a new class
  async createClass(classData) {
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
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Update a class
  async updateClass(id, updates) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docRef = doc(db, "classes", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("Class not found or access denied");
    }
    await updateDoc(docRef, {
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const updatedSnap = await getDoc(docRef);
    return toData(updatedSnap);
  },
  // Delete a class
  async deleteClass(id) {
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
  async getClassStudents(classId, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "class_students"),
      where("owner_id", "==", uid),
      where("class_id", "==", classId),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);
    const studentIds = querySnapshot.docs.map((doc2) => doc2.data().student_id);
    const students = [];
    for (const sid of studentIds) {
      const studentDoc = await getDoc(doc(db, "students", sid));
      if (studentDoc.exists()) {
        students.push(toData(studentDoc));
      }
    }
    return students;
  },
  // Get all enrollments for a class
  async getClassEnrollments(classId, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "class_students"),
      where("owner_id", "==", uid),
      where("class_id", "==", classId)
    );
    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map((doc2) => toData(doc2));
    for (const enrollment of enrollments) {
      const studentDoc = await getDoc(doc(db, "students", enrollment.student_id));
      if (studentDoc.exists()) {
        enrollment.students = toData(studentDoc);
      }
    }
    return enrollments;
  },
  // Get class skills (temario)
  async getClassSkills(classId, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", uid),
      where("class_id", "==", classId),
      orderBy("order_index", "asc")
    );
    const querySnapshot = await getDocs(q);
    const classSkills = querySnapshot.docs.map((doc2) => toData(doc2));
    for (const cs of classSkills) {
      if (cs.skill_id) {
        const skillDoc = await getDoc(doc(db, "skills", cs.skill_id));
        if (skillDoc.exists()) {
          cs.skills = toData(skillDoc);
        }
      }
    }
    return classSkills;
  },
  // Get class occupancy
  async getClassOccupancy(classId, userId) {
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
  async getClassAttendance(classId, date, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "attendance"),
      where("user_id", "==", uid),
      where("class_id", "==", classId),
      where("date", "==", date)
    );
    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map((doc2) => toData(doc2));
    for (const record of records) {
      const studentDoc = await getDoc(doc(db, "students", record.student_id));
      if (studentDoc.exists()) {
        record.students = toData(studentDoc);
      }
    }
    return records;
  },
  // Get class attendance summary
  async getClassAttendanceSummary(classId, startDate, endDate, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    let q = query(
      collection(db, "attendance"),
      where("user_id", "==", uid),
      where("class_id", "==", classId)
    );
    const querySnapshot = await getDocs(q);
    let records = querySnapshot.docs.map((doc2) => toData(doc2));
    if (startDate) {
      records = records.filter((r) => r.date >= startDate);
    }
    if (endDate) {
      records = records.filter((r) => r.date <= endDate);
    }
    for (const record of records) {
      const studentDoc = await getDoc(doc(db, "students", record.student_id));
      if (studentDoc.exists()) {
        record.students = { name: studentDoc.data().name };
      }
    }
    return records;
  },
  // Duplicate a class
  async duplicateClass(classId, newName) {
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
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("class_id", "==", classId)
    );
    const skillsSnap = await getDocs(q);
    const batch = writeBatch(db);
    skillsSnap.docs.forEach((skillDoc) => {
      const data = skillDoc.data();
      const newSkillRef = doc(collection(db, "class_skills"));
      batch.set(newSkillRef, {
        owner_id: user.uid,
        class_id: newClass.id,
        skill_id: data.skill_id,
        order_index: data.order_index,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    await batch.commit();
    return newClass;
  },
  // Get class analytics
  async getClassAnalytics(classId, userId) {
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
    const recentAttendance = attendanceSnap.docs.map((doc2) => doc2.data());
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
    const filteredAttendance = recentAttendance.filter((a) => a.date >= thirtyDaysAgo);
    const totalAttendanceRecords = filteredAttendance.length;
    const presentRecords = filteredAttendance.filter((a) => a.status === "P").length;
    const attendanceRate = totalAttendanceRecords > 0 ? presentRecords / totalAttendanceRecords * 100 : 0;
    return {
      class: classInfo,
      enrolled_students: occupancy,
      skills_count: skillsSnap.size,
      attendance_rate: Math.round(attendanceRate * 100) / 100
    };
  }
};
export {
  classesApi as c
};
