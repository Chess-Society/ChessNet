// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  documentId
} from "firebase/firestore";

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
  const classId = params.classId;

  if (!locals.user) {
    return {
      user: null,
      class: null,
      students: [],
      recentAttendance: [],
      attendanceStats: []
    };
  }

  try {
    const classRef = doc(db, "classes", classId);
    const classSnap = await getDoc(classRef);

    if (!classSnap.exists() || classSnap.data().user_id !== locals.user.id) {
      return { user: locals.user, class: null, students: [], recentAttendance: [], attendanceStats: [] };
    }

    const classData = { id: classSnap.id, ...classSnap.data() };

    // Fetch all enrollments for this class
    const qEnrollments = query(
      collection(db, "class_students"),
      where("class_id", "==", classId)
    );
    const enrollmentsSnap = await getDocs(qEnrollments);
    const enrolledIds = enrollmentsSnap.docs.map(doc => doc.data().student_id);
    
    // Fetch enrolled students details
    let students: any[] = [];
    if (enrolledIds.length > 0) {
      for (let i = 0; i < enrolledIds.length; i += 10) {
        const chunk = enrolledIds.slice(i, i + 10);
        const qStudents = query(
          collection(db, "students"),
          where(documentId(), "in", chunk)
        );
        const studentsSnap = await getDocs(qStudents);
        students = [...students, ...studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))];
      }
    }
    
    return {
      user: locals.user,
      class: classData,
      students,
      recentAttendance: [],
      attendanceStats: []
    };

  } catch (err: any) {
    console.error('❌ Error in class attendance page load:', err);
    return { user: locals.user, class: null, students: [], recentAttendance: [], attendanceStats: [] };
  }
};
