import type { PageServerLoad } from './$types';
import { adminDb, ownerFilter, Filter } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return { user: null, schools: [] };
  }

  try {
    const uid = locals.user.uid;
    
    // Obtener centros del usuario usando Admin SDK
    const schoolsSnap = await adminDb.collection("schools")
      .where(ownerFilter(uid))
      .get();
    
    const schools = schoolsSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })).sort((a: any, b: any) => {
      const dateA = (a.createdAt || a.created_at || '');
      const dateB = (b.createdAt || b.created_at || '');
      return dateB.localeCompare(dateA);
    });

    // Enriquecer con estadísticas (conteo de clases y alumnos)
    // Enrich schools with class and student counts efficiently
    const enrichedSchools = await Promise.all(schools.map(async (school: any) => {
      const [classesSnap, studentsSnap] = await Promise.all([
        adminDb.collection("classes")
          .where(ownerFilter(uid))
          .where(Filter.or(
            Filter.where('school_id', '==', school.id),
            Filter.where('schoolId', '==', school.id)
          ))
          .get(),
        adminDb.collection("students")
          .where(ownerFilter(uid))
          .where(Filter.or(
            Filter.where('school_id', '==', school.id),
            Filter.where('schoolId', '==', school.id)
          ))
          .get()
      ]);

      return {
        ...school,
        classes_count: classesSnap.size,
        students_count: studentsSnap.size
      };
    }));

    // Sort by name safely
    enrichedSchools.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

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

export const actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) return { success: false, error: 'Unauthorized' };
    const data = await request.formData();
    const id = data.get('id') as string;

    try {
      await adminDb.collection('schools').doc(id).delete();
      return { success: true };
    } catch (err) {
      console.error('Delete school failed:', err);
      return { success: false, error: 'Delete failed' };
    }
  },

  purge: async ({ locals }) => {
    if (!locals.user) return { success: false, error: 'Unauthorized' };
    const uid = locals.user.uid;

    try {
      const snap = await adminDb.collection('schools').where(ownerFilter(uid)).get();
      const batch = adminDb.batch();
      snap.docs.forEach((doc: any) => batch.delete(doc.ref));
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Purge schools failed:', err);
      return { success: false, error: 'Purge failed' };
    }
  }
};
