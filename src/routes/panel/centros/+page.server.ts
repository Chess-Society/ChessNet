import type { PageServerLoad } from './$types';
import { schoolsApi } from '$lib/api/schools';
import { db } from '$lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('📚 Schools page server load - User:', locals.user?.email || 'none');

  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }

  try {
    // Usar la API de centros que ya maneja membresías
    const schools = await schoolsApi.getMySchools();

    // Enriquecer con estadísticas (conteo de clases y alumnos)
    const enrichedSchools = await Promise.all(schools.map(async (school) => {
      // Contar clases
      const qClasses = query(
        collection(db, "classes"),
        where("school_id", "==", school.id)
      );
      const snapClasses = await getDocs(qClasses);
      
      // Contar estudiantes
      const qStudents = query(
        collection(db, "students"),
        where("school_id", "==", school.id)
      );
      const snapStudents = await getDocs(qStudents);

      return {
        ...school,
        classes_count: snapClasses.size,
        students_count: snapStudents.size
      };
    }));

    return {
      user: locals.user,
      schools: enrichedSchools
    };

  } catch (err: any) {
    console.error('❌ Error in schools page load:', err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
