import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { schoolsApi } from '$lib/api/schools';
import { studentsApi } from '$lib/api/students';
import { classesApi } from '$lib/api/classes';

export const load: PageServerLoad = async ({ locals, url }) => {
  console.log('📊 Dashboard server load - User:', locals.user?.email || 'none');

  // Si hay un código de OAuth en la URL, redirigir al callback (Firebase maneja esto distinto pero mantenemos por compatibilidad)
  const code = url.searchParams.get('code');
  if (code) {
    throw redirect(302, `/auth/callback?code=${code}`);
  }

  if (!locals.user) {
    return {
      user: null
    };
  }

  try {
    // Obtener datos reales de Firebase usando las APIs consolidadas
    const [schools, students, classes] = await Promise.all([
      schoolsApi.getMySchools(locals.user.id),
      studentsApi.getMyStudents(locals.user.id),
      classesApi.getMyClasses(locals.user.id)
    ]);

    const dashboardStats = {
      totalCenters: schools.length,
      totalStudents: students.length,
      totalClasses: classes.length,
      activeStudents: students.filter(s => (s as any).active !== false).length,
      monthlyRevenue: 0, // Implementar cuando el sistema de pagos esté listo
      upcomingSessions: classes.filter(c => c.active !== false).length 
    };

    // Enriquecer centros con estadísticas básicas
    const centersWithStats = schools.map(school => {
      const schoolClasses = classes.filter(c => c.college_id === school.id);
      const schoolStudents = students.filter(s => s.college_id === school.id);

      return {
        id: school.id,
        name: school.name,
        city: school.city || 'Sin ciudad',
        totalClasses: schoolClasses.length,
        totalStudents: schoolStudents.length,
        occupancyRate: schoolClasses.length > 0 ? Math.round((schoolStudents.length / (schoolClasses.length * 15)) * 100) : 0,
        attendanceRate: 0, // Implementar con sistema de asistencia
        monthlyRevenue: 0,
        lastActivity: (school as any).updated_at || (school as any).created_at
      };
    });

    console.log('✅ Dashboard loaded successfully from Firebase');

    return {
      user: locals.user,
      dashboardStats,
      centersWithStats,
      featuredClasses: classes.slice(0, 3),
      recentActivity: [], // Implementar log de actividades si es necesario
      upcomingSessionsToday: classes.slice(0, 4)
    };

  } catch (err: any) {
    console.error('❌ Error in dashboard load:', err);
    return {
      user: locals.user,
      dashboardStats: {
        totalCenters: 0,
        totalStudents: 0,
        totalClasses: 0,
        activeStudents: 0,
        monthlyRevenue: 0,
        upcomingSessions: 0
      },
      centersWithStats: [],
      featuredClasses: [],
      recentActivity: [],
      upcomingSessionsToday: []
    };
  }
};
