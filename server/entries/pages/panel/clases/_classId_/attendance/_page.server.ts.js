import { d as db } from "../../../../../../chunks/firebase.js";
import { doc, getDoc, query, collection, where, getDocs, documentId } from "firebase/firestore";
const load = async ({ locals, params }) => {
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
    const qEnrollments = query(
      collection(db, "class_students"),
      where("class_id", "==", classId)
    );
    const enrollmentsSnap = await getDocs(qEnrollments);
    const enrolledIds = enrollmentsSnap.docs.map((doc2) => doc2.data().student_id);
    let students = [];
    if (enrolledIds.length > 0) {
      for (let i = 0; i < enrolledIds.length; i += 10) {
        const chunk = enrolledIds.slice(i, i + 10);
        const qStudents = query(
          collection(db, "students"),
          where(documentId(), "in", chunk)
        );
        const studentsSnap = await getDocs(qStudents);
        students = [...students, ...studentsSnap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }))];
      }
    }
    return {
      user: locals.user,
      class: classData,
      students,
      recentAttendance: [],
      attendanceStats: []
    };
  } catch (err) {
    console.error("❌ Error in class attendance page load:", err);
    return { user: locals.user, class: null, students: [], recentAttendance: [], attendanceStats: [] };
  }
};
export {
  load
};
