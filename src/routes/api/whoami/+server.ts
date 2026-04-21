import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
  
  const { user } = await authenticate(event);

  if (!user) {
    return json({ 
      user: null, 
      error: 'No user found'
    }, { status: 401 });
  }

  return json({ 
    user: {
      id: user.uid,
      email: user.email,
      fullName: user.displayName || null,
      avatarUrl: user.photoURL || null,
      isAdmin: user.isAdmin || false
    },
    error: null
  });
};
