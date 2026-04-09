import type { PageServerLoad } from './$types';
import { studentsApi } from '$lib/api/students';
import { schoolsApi } from '$lib/api/schools';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('🏆 Create tournament page server load - User:', locals.user?.email || 'none');
  
  if (!locals.user) {
    return {
      user: null,
      availableStudents: [],
      availableLocations: []
    };
  }

  try {
    // Obtener estudiantes y centros del usuario desde Firebase
    const [students, schools] = await Promise.all([
      studentsApi.getMyStudents(locals.user.id),
      schoolsApi.getMySchools(locals.user.id)
    ]);

    // Formatear estudiantes para la UI
    const availableStudents = students.map(s => ({
      id: s.id,
      name: s.name,
      rating: 1200, // Rating base predeterminado
      college: (s as any).college_name || 'Sin centro',
      email: s.parent_email || ''
    }));

    // Formatear ubicaciones disponibles (nombres de los centros)
    const availableLocations = [
      ...schools.map(s => s.name),
      'Online - Plataforma ChessNet'
    ];

    return {
      user: locals.user,
      availableStudents,
      availableLocations
    };

  } catch (err: any) {
    console.error('❌ Error in tournament create page server load:', err);
    return {
      user: locals.user,
      availableStudents: [],
      availableLocations: []
    };
  }
};
