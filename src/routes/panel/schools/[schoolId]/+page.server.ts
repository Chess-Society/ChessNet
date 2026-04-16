import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals, params }) => {
  const schoolId = params.schoolId;

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const uid = locals.user.uid;
  const isMock = uid === 'chessnet-dev-uid';

  if (isMock) {
    const schoolData = {
      id: schoolId,
      name: "Centro de Prueba (MOCK)",
      city: "Ciudad Real",
      owner_id: uid,
      created_at: new Date().toISOString()
    };
    
    return { 
      user: locals.user, 
      school: serializeRecord(schoolData), 
      classes: [], 
      stats: {
        totalClasses: 0,
        activeClasses: 0,
        inactiveClasses: 0,
        totalStudents: 0,
        totalCapacity: 0,
        occupancyRate: 0,
        levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 },
        averageClassSize: 0
      }
    };
  }

  try {
    // Intentar obtener el centro usando Admin SDK con reintentos
    let schoolSnap = await adminDb.collection("schools").doc(schoolId).get();
    
    // Reintentos con backoff progresivo (hasta ~7.5s total)
    // Necesario porque el cliente puede navegar antes de que Firestore propague la escritura
    let attempts = 0;
    const delays = [300, 500, 700, 1000, 1000, 1000, 1000, 1000, 1000, 1000]; // 10 intentos
    while (!schoolSnap.exists && attempts < 10 && !isMock) {
      console.log(`🔄 School ${schoolId} not found, retrying attempt ${attempts + 1}/10...`);
      await new Promise(resolve => setTimeout(resolve, delays[attempts] || 1000));
      schoolSnap = await adminDb.collection("schools").doc(schoolId).get();
      attempts++;
    }

    let schoolData: any;

    if (!schoolSnap.exists) {
      if (isMock) {
        // Mock fallback para desarrollo
        schoolData = {
          id: schoolId,
          name: "Centro de Prueba (MOCK)",
          city: "Ciudad Real",
          owner_id: uid,
          created_at: new Date().toISOString()
        };
      } else {
        throw error(404, 'Centro no encontrado');
      }
    } else {
      schoolData = { id: schoolSnap.id, ...schoolSnap.data() };
      
      // Verificación de propiedad
      if (schoolData.owner_id !== uid) {
        throw error(403, 'No tienes permiso para ver este centro');
      }
    }

    // Obtener clases vinculadas y su ocupación
    const classesSnap = await adminDb.collection("classes")
      .where("school_id", "==", schoolId)
      .where("owner_id", "==", uid)
      .get();
    
    const schoolClasses = await Promise.all(classesSnap.docs.map(async (doc: any) => {
      const classData = { id: doc.id, ...doc.data() as any };
      // Contar alumnos inscritos en esta clase
      const enrollmentsSnap = await adminDb.collection("class_students")
        .where("class_id", "==", classData.id)
        .where("status", "==", "active")
        .get();
      
      return {
        ...classData,
        students_count: enrollmentsSnap.size
      };
    }));

    // Obtener alumnos vinculados
    const studentsSnap = await adminDb.collection("students")
      .where("school_id", "==", schoolId)
      .where("owner_id", "==", uid)
      .get();
    
    const schoolStudents = studentsSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Recalcular estadísticas
    const stats = {
      totalClasses: schoolClasses.length,
      activeClasses: schoolClasses.filter((c: any) => c.active !== false).length,
      inactiveClasses: schoolClasses.filter((c: any) => c.active === false).length,
      totalStudents: schoolStudents.length,
      totalCapacity: schoolClasses.reduce((sum: number, c: any) => sum + (c.max_students || 15), 0),
      occupancyRate: schoolClasses.length > 0 ? Math.round((schoolStudents.length / (schoolClasses.length * 15)) * 100) : 0,
      levels: {
        beginner: schoolClasses.filter((c: any) => c.level === 'beginner').length,
        intermediate: schoolClasses.filter((c: any) => c.level === 'intermediate').length,
        advanced: schoolClasses.filter((c: any) => c.level === 'advanced').length,
        mixed: 0
      },
      averageClassSize: schoolClasses.length > 0 ? Math.round(schoolStudents.length / schoolClasses.length) : 0
    };

    return { 
      user: locals.user, 
      school: serializeRecord(schoolData), 
      classes: serializeRecord(schoolClasses), 
      stats 
    };

  } catch (err: any) {
    console.error('❌ Error in school detail page:', err);
    if (err.status) throw err;
    throw error(500, err.message || 'Error al cargar los datos del centro');
  }
};
