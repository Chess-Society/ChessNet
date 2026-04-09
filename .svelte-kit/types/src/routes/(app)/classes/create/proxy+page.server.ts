// @ts-nocheck
import type { PageServerLoad } from './$types';
import { schoolsApi } from '$lib/api/schools';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  console.log('🎓 Classes create page server load - User:', locals.user?.email || 'none');
  
  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }
  
  try {
    const schools = await schoolsApi.getMySchools(locals.user.id);
    
    console.log('✅ Schools loaded successfully:', schools?.length || 0);
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
