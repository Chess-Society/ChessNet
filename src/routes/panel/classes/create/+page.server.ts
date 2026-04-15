import type { PageServerLoad } from './$types';
import { schoolsApi } from '$lib/api/schools';

export const load: PageServerLoad = async ({ locals }) => {
  
  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }
  
  try {
    const schools = await schoolsApi.getMySchools();
    
    return {
      user: locals.user,
      schools: schools || []
    };
  } catch (err: any) {
    console.error('❌ Error in classes create page load:', err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
