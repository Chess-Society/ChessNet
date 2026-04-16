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
    const isMock = uid === 'chessnet-dev-uid';

    if (isMock) {
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
    
    // Obtener clases y centros del usuario desde Firebase usando Admin SDK
    const [classesSnap, schoolsSnap] = await Promise.all([
      adminDb.collection("classes").where("owner_id", "==", uid).get(),
      adminDb.collection("schools").where("owner_id", "==", uid).get()
    ]);

    const classes = classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const schools = schoolsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Obtener alumnos matriculados para contar por clase
    const enrollmentsSnap = await adminDb.collection("class_students").where("owner_id", "==", uid).get();
    const enrollments = enrollmentsSnap.docs.map((doc: any) => doc.data());
    
    const countByClass: Record<string, number> = {};
    enrollments.forEach((e: any) => {
      countByClass[e.class_id] = (countByClass[e.class_id] || 0) + 1;
    });

    // Enriquecer clases con el conteo
    const enrichedClasses = classes.map((c: any) => ({
      ...c,
      studentCount: countByClass[c.id] || 0
    }));

    // Calcular estadísticas globales
    const schoolCounts: Record<string, number> = {};
    let totalCapacity = 0;
    let totalStudents = 0;
    
    enrichedClasses.forEach((c: any) => {
      if (c.school_id) {
        schoolCounts[c.school_id] = (schoolCounts[c.school_id] || 0) + 1;
      }
      totalCapacity += (c.max_students || 0);
      totalStudents += c.studentCount;
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
