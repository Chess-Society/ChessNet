import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies }) => {
  console.log('🔍 WhoAmI - Checking server-side authentication (Firebase)...');
  
  let user = locals.user;

  if (!user) {
    const session = cookies.get('sb-auth-token');
    if (session) {
      try {
        user = JSON.parse(decodeURIComponent(session));
      } catch (e) {
        user = null;
      }
    }
  }

  if (!user) {
    console.log('❌ WhoAmI - No user found');
    return json({ 
      user: null, 
      error: 'No user found'
    }, { status: 401 });
  }

  console.log('✅ WhoAmI - User authenticated:', user.email);
  return json({ 
    user: {
      id: user.id || user.uid,
      email: user.email,
      full_name: user.full_name || user.displayName || null,
      avatar_url: user.avatar_url || user.photoURL || null,
      created_at: user.created_at || new Date().toISOString()
    },
    error: null
  });
};
