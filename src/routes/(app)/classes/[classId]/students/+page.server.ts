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

export const load: PageServerLoad = async ({ locals, params }) => {
  const classId = params.classId;

  if (!locals.user) {
    return {
      user: null,
      class: null,
      enrolledStudents: [],
      availableStudents: [],
      stats: { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 }
    };
  }

  try {
    const classRef = doc(db, "classes", classId);
    const classSnap = await getDoc(classRef);

    if (!classSnap.exists() || classSnap.data().user_id !== locals.user.id) {
       return { user: locals.user, class: null, enrolledStudents: [], availableStudents: [], stats: { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 } };
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
    let enrolledStudents: any[] = [];
    if (enrolledIds.length > 0) {
      for (let i = 0; i < enrolledIds.length; i += 10) {
        const chunk = enrolledIds.slice(i, i + 10);
        const qStudents = query(
          collection(db, "students"),
          where(documentId(), "in", chunk)
        );
        const studentsSnap = await getDocs(qStudents);
        enrolledStudents = [...enrolledStudents, ...studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))];
      }
    }

    // Fetch all student details for the user to find available ones
    const qAllStudents = query(
      collection(db, "students"),
      where("user_id", "==", locals.user.id)
    );
    const allStudentsSnap = await getDocs(qAllStudents);
    const allStudents = allStudentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Available students are those NOT in enrolledIds
    const availableStudents = allStudents.filter(s => !enrolledIds.includes(s.id));

    const stats = {
      enrolled: enrolledStudents.length,
      available: availableStudents.length,
      capacity: (classData as any).max_students || 0,
      occupancyRate: (classData as any).max_students ? Math.round((enrolledStudents.length / (classData as any).max_students) * 100) : 0
    };

    return {
      user: locals.user,
      class: classData,
      enrolledStudents,
      availableStudents,
      stats
    };

  } catch (err: any) {
    console.error('❌ Error in class students page load:', err);
    return { user: locals.user, class: null, enrolledStudents: [], availableStudents: [], stats: { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 } };
  }
};
