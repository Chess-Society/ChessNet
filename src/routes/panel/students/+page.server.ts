import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return {
      user: null,
      students: [],
      stats: { total: 0, schools: {}, newest: null },
      schools: []
    };
  }

  try {
    const uid = locals.user.uid;
    const isMock = uid === 'chessnet-dev-uid';

    if (isMock) {
        return {
            user: locals.user,
            students: [],
            stats: { total: 0, schools: {}, newest: null },
            schools: []
        };
    }
    
    // Obtener estudiantes y centros del usuario desde Firebase usando Admin SDK
    const [studentsSnap, schoolsSnap] = await Promise.all([
      adminDb.collection("students").where("owner_id", "==", uid).get(),
      adminDb.collection("schools").where("owner_id", "==", uid).get()
    ]);

    const students = studentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const schools = schoolsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Calcular estadísticas
    const schoolCounts: Record<string, number> = {};
    students.forEach((s: any) => {
      if (s.school_id) {
        schoolCounts[s.school_id] = (schoolCounts[s.school_id] || 0) + 1;
      }
    });

    const stats = {
      total: students.length,
      schools: schoolCounts,
      newest: students[0]?.created_at || null
    };

    return {
      user: locals.user,
      students: serializeRecord(students),
      stats: serializeRecord(stats),
      schools: serializeRecord(schools)
    };

  } catch (err: any) {
    console.error('❌ Error in students page load:', err);
    return {
      user: locals.user,
      students: [],
      stats: { total: 0, schools: {}, newest: null },
      schools: []
    };
  }
};
