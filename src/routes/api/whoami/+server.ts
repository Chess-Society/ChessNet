import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  console.log('🔍 WhoAmI - Checking server-side authentication (Firebase)...');
  
  if (!locals.user) {
    console.log('❌ WhoAmI - No user found in locals');
    return json({ 
      user: null, 
      error: 'No user found'
    }, { status: 401 });
  }

  console.log('✅ WhoAmI - User authenticated:', locals.user.email);
  return json({ 
    user: {
      id: locals.user.id,
      email: locals.user.email,
      full_name: locals.user.full_name || null,
      avatar_url: locals.user.avatar_url || null,
      created_at: locals.user.created_at || new Date().toISOString()
    },
    error: null
  });
};
