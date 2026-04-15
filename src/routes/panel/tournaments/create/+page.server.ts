import type { PageServerLoad } from './$types';
import { studentsApi } from '$lib/api/students';
import { schoolsApi } from '$lib/api/schools';

export const load: PageServerLoad = async ({ locals }) => {
  
  if (!locals.user) {
    return {
      user: null,
      availableStudents: [],
      availableLocations: []
    };
  }

  try {
    // Fetch students and schools for the user from Firebase
    const [students, schools] = await Promise.all([
      studentsApi.getMyStudents(),
      schoolsApi.getMySchools()
    ]);

    // Format students for the UI
    const availableStudents = students.map(s => ({
      id: s.id,
      name: s.name,
      rating: 1200, // Default base rating
      school_name: (s as any).school_name || 'No school',
      email: s.parent_email || ''
    }));

    // Format available locations (school names)
    const availableLocations = [
      ...schools.map(s => s.name),
      'Online - ChessNet Platform'
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
