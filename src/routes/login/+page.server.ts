import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  
  // If user is already authenticated, redirect to dashboard
  if (locals.user) {
    if (locals.role === 'parent') {
      throw redirect(302, '/portal');
    }
    throw redirect(302, '/panel');
  }
  
  return {
    user: null
  };
};
