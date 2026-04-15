import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

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
      adminDb.collection("classes").where("owner_id", "==", uid).get(),
      adminDb.collection("schools").where("owner_id", "==", uid).get()
    ]);

    const classes = classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const schools = schoolsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Calcular estadísticas
    const schoolCounts: Record<string, number> = {};
    let totalCapacity = 0;
    
    classes.forEach((c: any) => {
      if (c.school_id) {
        schoolCounts[c.school_id] = (schoolCounts[c.school_id] || 0) + 1;
      }
      totalCapacity += (c.max_students || 0);
    });

    const stats = {
      total: classes.length,
      active: classes.filter((c: any) => c.active).length,
      inactive: classes.filter((c: any) => !c.active).length,
      levels: {
        beginner: classes.filter((c: any) => c.level === 'beginner').length,
        intermediate: classes.filter((c: any) => c.level === 'intermediate').length,
        advanced: classes.filter((c: any) => c.level === 'advanced').length,
        mixed: classes.filter((c: any) => c.level === 'mixed').length
      },
      schools: schoolCounts,
      totalStudents: 0,
      totalCapacity,
      occupancyRate: 0,
      averageClassSize: classes.length > 0 ? 0 : 0
    };

    return {
      user: locals.user,
      classes: serializeRecord(classes),
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
