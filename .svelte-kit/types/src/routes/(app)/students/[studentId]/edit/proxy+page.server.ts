// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { studentsApi } from '$lib/api/students';
import { schoolsApi } from '$lib/api/schools';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
  console.log('✏️ Edit student page server load - User:', locals.user?.email || 'none');
  const studentId = params.studentId;
  
  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  try {
    // Obtener datos del estudiante y centros del usuario desde Firebase API
    const [student, schools] = await Promise.all([
      studentsApi.getStudent(studentId, locals.user.id),
      schoolsApi.getMySchools(locals.user.id)
    ]);

    return { 
      user: locals.user, 
      student, 
      schools 
    };

  } catch (err: any) {
    console.error('❌ Error in edit student page:', err);
    if (err.status) throw err;
    throw error(404, 'Estudiante no encontrado o error al cargar los datos');
  }
};