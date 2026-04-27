import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb, Filter } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals, params }) => {
  const schoolId = params.schoolId;

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const uid = locals.user.uid;

  try {
    // Intentar obtener el centro usando Admin SDK
    let schoolSnap = await adminDb.collection("schools").doc(schoolId).get();
    
    // Un solo reintento corto (500ms) por si hay latencia en la propagación
    if (!schoolSnap.exists) {
      await new Promise(resolve => setTimeout(resolve, 500));
      schoolSnap = await adminDb.collection("schools").doc(schoolId).get();
    }

    let schoolData: any;

    if (!schoolSnap.exists) {
        throw error(404, 'Centro no encontrado');
    } else {
      schoolData = { id: schoolSnap.id, ...schoolSnap.data() };
      const isOwner = schoolData.owner_id === uid || schoolData.ownerId === uid;
      
      // Verificación de propiedad
      if (!isOwner) {
        throw error(403, 'No tienes permiso para ver este centro');
      }
    }

    // Obtener clases vinculadas y su ocupación
    const classesSnap = await adminDb.collection("classes")
      .where(Filter.or(
        Filter.where('school_id', '==', schoolId),
        Filter.where('schoolId', '==', schoolId)
      ))
      .where(Filter.or(
        Filter.where('owner_id', '==', uid),
        Filter.where('ownerId', '==', uid)
      ))
      .get();
    
    const schoolClasses = await Promise.all(classesSnap.docs.map(async (doc: any) => {
      const classData = { id: doc.id, ...doc.data() as any };
      // Contar alumnos inscritos en esta clase
      const enrollmentsSnap = await adminDb.collection("class_students")
        .where(Filter.or(
          Filter.where('class_id', '==', classData.id),
          Filter.where('classId', '==', classData.id)
        ))
        .get();
      
      return {
        ...classData,
        students_count: enrollmentsSnap.size
      };
    }));

    // Obtener alumnos vinculados
    const studentsSnap = await adminDb.collection("students")
      .where(Filter.or(
        Filter.where('school_id', '==', schoolId),
        Filter.where('schoolId', '==', schoolId)
      ))
      .where(Filter.or(
        Filter.where('owner_id', '==', uid),
        Filter.where('ownerId', '==', uid)
      ))
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
