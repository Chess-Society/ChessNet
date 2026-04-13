import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
  console.log('🔍 WhoAmI - Checking server-side authentication (Firebase Admin)...');
  
  const { user } = await authenticate(event);

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
      id: user.uid,
      email: user.email,
      full_name: user.displayName || null,
      avatar_url: user.photoURL || null,
      isAdmin: user.isAdmin || false
    },
    error: null
  });
};
