import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { user } = await request.json();
  
  if (!user) {
    return json({ error: 'No user data provided' }, { status: 400 });
  }

  // Set a secure, HTTP-only cookie with the user data
  cookies.set('sb-auth-token', JSON.stringify(user), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  return json({ success: true });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete('sb-auth-token', { path: '/' });
  return json({ success: true });
};
