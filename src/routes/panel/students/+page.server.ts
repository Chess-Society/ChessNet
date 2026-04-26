import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
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
      const sId = s.school_id || s.schoolId;
      if (sId) {
        schoolCounts[sId] = (schoolCounts[sId] || 0) + 1;
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

export const actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) return { success: false, error: 'Unauthorized' };
    const data = await request.formData();
    const id = data.get('id') as string;

    try {
      await adminDb.collection('students').doc(id).delete();
      return { success: true };
    } catch (err) {
      console.error('Delete student failed:', err);
      return { success: false, error: 'Delete failed' };
    }
  },

  purge: async ({ locals }) => {
    if (!locals.user) return { success: false, error: 'Unauthorized' };
    const uid = locals.user.uid;

    try {
      const snap = await adminDb.collection('students').where('owner_id', '==', uid).get();
      const batch = adminDb.batch();
      snap.docs.forEach((doc: any) => batch.delete(doc.ref));
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Purge students failed:', err);
      return { success: false, error: 'Purge failed' };
    }
  }
};
