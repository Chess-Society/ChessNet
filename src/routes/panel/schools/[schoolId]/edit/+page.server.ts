import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { schoolsApi } from '$lib/api/schools';

export const load: PageServerLoad = async ({ locals, params }) => {
  const schoolId = params.schoolId;
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const countries = [
    { code: 'ES', name: 'Spain' },
    { code: 'FR', name: 'France' },
    { code: 'PT', name: 'Portugal' },
    { code: 'IT', name: 'Italy' }
  ];

  const insuranceCompanies = [
    'Mapfre Seguros',
    'Allianz Seguros',
    'AXA Seguros'
  ];

  try {
    // Get school data from Firebase API
    const school = await schoolsApi.getSchool(schoolId);

    return { 
      user: locals.user, 
      school, 
      countries, 
      insuranceCompanies 
    };

  } catch (err: any) {
    console.error('❌ Error in edit school page:', err);
    if (err.status) throw err;
    throw error(404, 'School not found or error loading data');
  }
};
