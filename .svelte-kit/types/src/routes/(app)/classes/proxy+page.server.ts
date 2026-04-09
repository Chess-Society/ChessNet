// @ts-nocheck
import type { PageServerLoad } from './$types';
import { classesApi } from '$lib/api/classes';
import { schoolsApi } from '$lib/api/schools';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  console.log('🎓 Classes page server load - User:', locals.user?.email || 'none');

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
    // Obtener clases y centros del usuario desde Firebase
    const [classes, schools] = await Promise.all([
      classesApi.getMyClasses(locals.user.id),
      schoolsApi.getMySchools(locals.user.id)
    ]);

    // Calcular estadísticas
    const schoolCounts: Record<string, number> = {};
    let totalCapacity = 0;
    
    classes.forEach(c => {
      if (c.college_id) {
        schoolCounts[c.college_id] = (schoolCounts[c.college_id] || 0) + 1;
      }
      totalCapacity += (c.max_students || 0);
    });

    const stats = {
      total: classes.length,
      active: classes.filter(c => c.active).length,
      inactive: classes.filter(c => !c.active).length,
      levels: {
        beginner: (classes as any[]).filter(c => c.level === 'beginner').length,
        intermediate: (classes as any[]).filter(c => c.level === 'intermediate').length,
        advanced: (classes as any[]).filter(c => c.level === 'advanced').length,
        mixed: (classes as any[]).filter(c => (c as any).level === 'mixed').length
      },
      schools: schoolCounts,
      totalStudents: 0,
      totalCapacity,
      occupancyRate: 0,
      averageClassSize: classes.length > 0 ? 0 : 0
    };

    return {
      user: locals.user,
      classes,
      stats,
      schools
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
