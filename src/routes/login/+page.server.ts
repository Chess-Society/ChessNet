import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('🔄 Login page server load - Checking authentication');
  
  // If user is already authenticated, redirect to dashboard
  if (locals.user) {
    console.log('✅ User already authenticated, redirecting to dashboard');
    throw redirect(302, '/dashboard');
  }
  
  console.log('❌ User not authenticated, showing login page');
  return {
    user: null
  };
};
