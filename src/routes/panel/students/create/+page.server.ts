import type { PageServerLoad } from './$types';
import { schoolsApi } from '$lib/api/schools';
import { classesApi } from '$lib/api/classes';

export const load: PageServerLoad = async ({ locals }) => {
  
  if (!locals.user) {
    return { 
      user: null, 
      schools: [],
      classes: []
    };
  }

  try {
    // Obtener centros y clases del usuario desde Firebase API
    const [schools, classes] = await Promise.all([
      schoolsApi.getMySchools(),
      classesApi.getMyClasses()
    ]);

    return { 
      user: locals.user, 
      schools,
      classes
    };

  } catch (err: any) {
    console.error('❌ Error in students create page load:', err);
    return { 
      user: locals.user, 
      schools: [],
      classes: []
    };
  }
};
