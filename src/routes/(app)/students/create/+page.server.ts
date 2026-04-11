import type { PageServerLoad } from './$types';
import { schoolsApi } from '$lib/api/schools';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('👥 Students create page server load - User:', locals.user?.email || 'none');
  
  if (!locals.user) {
    return { 
      user: null, 
      schools: [] 
    };
  }

  try {
    // Obtener centros del usuario desde Firebase API
    const schools = await schoolsApi.getMySchools(locals.user.id);

    return { 
      user: locals.user, 
      schools 
    };

  } catch (err: any) {
    console.error('❌ Error in students create page load:', err);
    return { 
      user: locals.user, 
      schools: [] 
    };
  }
};
