import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return { user: null, schools: [] };
  }

  try {
    const uid = locals.user.uid;
    
    // Obtener centros del usuario usando Admin SDK
    const schoolsSnap = await adminDb.collection("schools")
      .where("owner_id", "==", uid)
      .get();
    
    const schools = schoolsSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Enriquecer con estadísticas (conteo de clases y alumnos)
    const enrichedSchools = await Promise.all(schools.map(async (school: any) => {
      const classesSnap = await adminDb.collection("classes")
        .where("school_id", "==", school.id)
        .get();
      
      const studentsSnap = await adminDb.collection("students")
        .where("school_id", "==", school.id)
        .get();

      return {
        ...school,
        classes_count: classesSnap.size,
        students_count: studentsSnap.size
      };
    }));

    return {
      user: locals.user,
      schools: serializeRecord(enrichedSchools)
    };

  } catch (err: any) {
    console.error('❌ Error in schools page load:', err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
