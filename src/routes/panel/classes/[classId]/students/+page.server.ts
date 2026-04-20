import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { error } from '@sveltejs/kit';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals, params }) => {
  const classId = params.classId;

  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  try {
    // Fetch class details with proper authorization check
    const classSnap = await adminDb.collection("classes").doc(classId).get();

    if (!classSnap.exists || classSnap.data()?.owner_id !== locals.user.uid) {
       console.warn(`[ClassStudents] Unauthorized access attempt for class ${classId} by user ${locals.user.uid}`);
       throw error(404, 'Clase no encontrada');
    }

    const classData = { id: classSnap.id, ...classSnap.data() };

    // Fetch all enrollments for this class
    const enrollmentsSnap = await adminDb.collection("class_students")
      .where("class_id", "==", classId)
      .where("owner_id", "==", locals.user.uid)
      .get();
      
    const enrolledIds = enrollmentsSnap.docs.map(doc => doc.data().student_id);
    
    // Fetch enrolled students details
    let enrolledStudents: any[] = [];
    if (enrolledIds.length > 0) {
      // Chunked fetch to avoid Firestore IN limit (10 items in JS SDK, 30 in Admin SDK usually, but 10 is safest)
      for (let i = 0; i < enrolledIds.length; i += 10) {
        const chunk = enrolledIds.slice(i, i + 10);
        const studentsSnap = await adminDb.collection("students")
          .where("__name__", "in", chunk)
          .get();
        enrolledStudents = [...enrolledStudents, ...studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))];
      }
    }

    // Fetch all students belonging to this owner to identify available ones
    const allStudentsSnap = await adminDb.collection("students")
      .where("owner_id", "==", locals.user.uid)
      .get();
      
    const allStudents = allStudentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Available students are those NOT in enrolledIds
    const availableStudents = allStudents.filter(s => !enrolledIds.includes(s.id));

    const stats = {
      enrolled: enrolledStudents.length,
      available: availableStudents.length,
      capacity: (classData as any).max_students || 10, // Default to 10 if not set
      occupancyRate: (classData as any).max_students ? Math.round((enrolledStudents.length / (classData as any).max_students) * 100) : 0
    };

    return serializeRecord({
      class: classData,
      enrolledStudents,
      availableStudents,
      stats
    });

  } catch (err: any) {
    if (err.status) throw err;
    console.error('❌ Error in class students page load:', err);
    throw error(500, 'Error al cargar la gestión de alumnos');
  }
};
