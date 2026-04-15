import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('🎯 Skills create page server load - User:', locals.user?.email || 'none');
  
  return {
    user: locals.user,
  };
};
