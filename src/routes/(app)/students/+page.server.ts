import type { PageServerLoad } from './$types';
import { studentsApi } from '$lib/api/students';
import { schoolsApi } from '$lib/api/schools';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('👥 Students page server load - User:', locals.user?.email || 'none');

  if (!locals.user) {
    return {
      user: null,
      students: [],
      stats: { total: 0, schools: {}, newest: null },
      schools: []
    };
  }

  try {
    // Obtener estudiantes y centros del usuario desde Firebase
    const [students, schools] = await Promise.all([
      studentsApi.getMyStudents(locals.user.id),
      schoolsApi.getMySchools(locals.user.id)
    ]);

    // Calcular estadísticas
    const schoolCounts: Record<string, number> = {};
    students.forEach((s) => {
      if (s.college_id) {
        schoolCounts[s.college_id] = (schoolCounts[s.college_id] || 0) + 1;
      }
    });

    const stats = {
      total: students.length,
      schools: schoolCounts,
      newest: students[0]?.created_at || null
    };

    return {
      user: locals.user,
      students,
      stats,
      schools
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
