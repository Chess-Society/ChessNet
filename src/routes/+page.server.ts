import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('🔄 Home page server load - Checking authentication');
  
  // Si el usuario está autenticado, redirigir a dashboard
  if (locals.user) {
    console.log('🔄 User authenticated, redirecting to dashboard');
    throw redirect(302, '/dashboard');
  }
  
  // Si no está autenticado, redirigir a login
  console.log('🔄 User not authenticated, redirecting to login');
  throw redirect(302, '/login');
};
