// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  console.log('🎯 Skills create page server load - User:', locals.user?.email || 'none');
  
  return {
    user: locals.user,
  };
};
