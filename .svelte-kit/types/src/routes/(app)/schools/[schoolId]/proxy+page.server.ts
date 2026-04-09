// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { schoolsApi } from '$lib/api/schools';
import { classesApi } from '$lib/api/classes';
import { studentsApi } from '$lib/api/students';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
  console.log('🏫 School detail page server load - User:', locals.user?.email || 'none');
  const schoolId = params.schoolId;

  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  try {
    // Obtener el colegio y sus clases desde Firebase API
    const [school, schoolClasses, schoolStudents] = await Promise.all([
      schoolsApi.getSchool(schoolId, locals.user.id),
      classesApi.getClassesBySchool(schoolId, locals.user.id),
      studentsApi.getStudentsBySchool(schoolId) // Nota: getStudentsBySchool no soporta userId aún, pero usa auth.currentUser
    ]);

    // Recalcular estadísticas basadas en datos reales
    const stats = {
      totalClasses: schoolClasses.length,
      activeClasses: schoolClasses.filter(c => c.active !== false).length,
      inactiveClasses: schoolClasses.filter(c => c.active === false).length,
      totalStudents: schoolStudents.length,
      totalCapacity: schoolClasses.reduce((sum, c: any) => sum + (c.max_students || 0), 0),
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
      school, 
      classes: schoolClasses, 
      stats 
    };

  } catch (err: any) {
    console.error('❌ Error in school detail page:', err);
    if (err.status) throw err;
    throw error(404, 'Centro no encontrado o error al cargar los datos');
  }
};