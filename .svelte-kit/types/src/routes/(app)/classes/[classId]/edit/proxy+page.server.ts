// @ts-nocheck
import type { PageServerLoad } from './$types';
import { classesApi } from '$lib/api/classes';
import { schoolsApi } from '$lib/api/schools';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
  console.log('✏️ Edit class page server load - User:', locals.user?.email || 'none');
  console.log('✏️ Class ID:', params.classId);
  
  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  try {
    // Obtener la clase y los centros disponibles desde Firebase
    const [classData, schools] = await Promise.all([
      classesApi.getClass(params.classId, locals.user.id),
      schoolsApi.getMySchools(locals.user.id)
    ]);

    if (!classData) {
      throw error(404, 'Clase no encontrada');
    }

    // Horarios sugeridos por nivel
    const suggestedSchedules = {
      beginner: [
        'Lunes y Miércoles 10:00-11:00',
        'Martes y Jueves 16:00-17:00',
        'Viernes 17:00-18:00',
        'Sábados 10:00-11:30'
      ],
      intermediate: [
        'Lunes y Miércoles 17:00-18:30',
        'Martes y Jueves 17:00-18:30',
        'Viernes 18:00-19:30',
        'Sábados 11:30-13:00'
      ],
      advanced: [
        'Lunes y Miércoles 18:30-20:00',
        'Martes y Jueves 18:30-20:00',
        'Viernes 19:30-21:00',
        'Sábados 09:00-11:00'
      ],
      mixed: [
        'Miércoles 20:00-21:30',
        'Viernes 20:00-21:30',
        'Sábados 16:00-17:30',
        'Domingos 10:00-11:30'
      ]
    };

    // Capacidades sugeridas por nivel
    const suggestedCapacities = {
      beginner: { min: 8, max: 15, recommended: 12 },
      intermediate: { min: 6, max: 12, recommended: 10 },
      advanced: { min: 4, max: 10, recommended: 8 },
      mixed: { min: 8, max: 20, recommended: 15 }
    };

    return {
      user: locals.user,
      class: classData,
      schools: schools || [],
      suggestedSchedules,
      suggestedCapacities
    };

  } catch (err: any) {
    console.error('❌ Error in edit class page load:', err);
    if (err.status) {
      throw err;
    }
    throw error(500, 'Error interno del servidor');
  }
};
