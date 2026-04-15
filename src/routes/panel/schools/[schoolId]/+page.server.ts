import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { schoolsApi } from '$lib/api/schools';
import { classesApi } from '$lib/api/classes';
import { studentsApi } from '$lib/api/students';

export const load: PageServerLoad = async ({ locals, params }) => {
  const schoolId = params.schoolId;

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    // Get the school and its classes from Firebase API
    const [school, schoolClasses, schoolStudents] = await Promise.all([
      schoolsApi.getSchool(schoolId),
      classesApi.getClassesBySchool(schoolId),
      studentsApi.getStudentsBySchool(schoolId)
    ]);

    // Recalculate stats based on real data
    const stats = {
      totalClasses: schoolClasses.length,
      activeClasses: schoolClasses.filter((c: any) => c.active !== false).length,
      inactiveClasses: schoolClasses.filter((c: any) => c.active === false).length,
      totalStudents: schoolStudents.length,
      totalCapacity: schoolClasses.reduce((sum: number, c: any) => sum + (c.max_students || 0), 0),
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
    throw error(404, 'School not found or error loading data');
  }
};
