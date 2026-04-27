import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDb, ownerFilter } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const id = data.get('id') as string;

    if (!id) return fail(400, { message: 'Missing class ID' });

    try {
      // Security check: ensure user owns the class
      const doc = await adminDb.collection('classes').doc(id).get();
      const currentOwner = doc.data()?.owner_id || doc.data()?.ownerId;
      if (!doc.exists || currentOwner !== locals.user.uid) {
        return fail(403, { message: 'Unauthorized' });
      }

      const batch = adminDb.batch();
      
      // Delete the class
      batch.delete(adminDb.collection('classes').doc(id));
      
      // Delete enrollments
      const enrollmentsSnap = await adminDb.collection('class_students')
        .where('class_id', '==', id)
        .get();
      
      enrollmentsSnap.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error deleting class:', err);
      return fail(500, { message: 'Internal Server Error' });
    }
  },

  purge: async ({ locals }) => {
    if (!locals.user) return fail(401);

    try {
      const uid = locals.user.uid;
      const batch = adminDb.batch();
      
      const classesSnap = await adminDb.collection('classes')
        .where(ownerFilter(uid))
        .get();
      
      classesSnap.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      
      const enrollmentsSnap = await adminDb.collection('class_students')
        .where(ownerFilter(uid))
        .get();
      
      enrollmentsSnap.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error purging classes:', err);
      return fail(500, { message: 'Internal Server Error' });
    }
  }
};

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return {
      user: null,
      classes: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 },
        schools: {},
        totalStudents: 0,
        totalCapacity: 0,
        occupancyRate: 0,
        averageClassSize: 0
      },
      schools: []
    };
  }

  try {
    const uid = locals.user.uid;
    
    // Obtener clases y centros del usuario desde Firebase usando Admin SDK
    const [classesSnap, schoolsSnap] = await Promise.all([
      adminDb.collection("classes").where(ownerFilter(uid)).get(),
      adminDb.collection("schools").where(ownerFilter(uid)).get()
    ]);

    const classes = classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const schools = schoolsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Obtener alumnos matriculados para contar por clase
    const enrollmentsSnap = await adminDb.collection("class_students").where(ownerFilter(uid)).get();
    const enrollments = enrollmentsSnap.docs.map((doc: any) => doc.data());
    
    const countByClass: Record<string, number> = {};
    enrollments.forEach((e: any) => {
      const cId = e.class_id || e.classId;
      if (cId) {
        countByClass[cId] = (countByClass[cId] || 0) + 1;
      }
    });

    // Enriquecer clases con el conteo
    const enrichedClasses = classes.map((c: any) => ({
      ...c,
      studentCount: countByClass[c.id] || 0
    })).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

    // Calcular estadísticas globales
    const schoolCounts: Record<string, number> = {};
    let totalCapacity = 0;
    let totalStudents = 0;
    
    enrichedClasses.forEach((c: any) => {
      const sId = c.school_id || c.schoolId;
      if (sId) {
        schoolCounts[sId] = (schoolCounts[sId] || 0) + 1;
      }
      totalCapacity += (c.max_students || c.maxStudents || 0);
      totalStudents += (c.studentCount || 0);
    });

    const stats = {
      total: enrichedClasses.length,
      active: enrichedClasses.filter((c: any) => c.active).length,
      inactive: enrichedClasses.filter((c: any) => !c.active).length,
      levels: {
        beginner: enrichedClasses.filter((c: any) => c.level === 'beginner').length,
        intermediate: enrichedClasses.filter((c: any) => c.level === 'intermediate').length,
        advanced: enrichedClasses.filter((c: any) => c.level === 'advanced').length,
        mixed: enrichedClasses.filter((c: any) => c.level === 'mixed').length
      },
      schools: schoolCounts,
      totalStudents,
      totalCapacity,
      occupancyRate: totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0,
      averageClassSize: enrichedClasses.length > 0 ? parseFloat((totalStudents / enrichedClasses.length).toFixed(1)) : 0
    };

    return {
      user: locals.user,
      classes: serializeRecord(enrichedClasses),
      stats: serializeRecord(stats),
      schools: serializeRecord(schools)
    };

  } catch (err: any) {
    console.error('❌ Error in classes page load:', err);
    return {
      user: locals.user,
      classes: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 },
        schools: {},
        totalStudents: 0,
        totalCapacity: 0,
        occupancyRate: 0,
        averageClassSize: 0
      },
      schools: []
    };
  }
};
