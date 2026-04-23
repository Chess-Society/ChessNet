import { json } from '@sveltejs/kit';
import { adminAuth } from '$lib/server/firebase-admin';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = url.searchParams.get('email');
  if (!email) {
    return json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const userRecord = await adminAuth.getUserByEmail(email.toLowerCase());

    // MED-03: Solo los admins reciben datos personales completos
    // Los usuarios regulares solo reciben el uid (suficiente para compartir recursos)
    if (locals.isAdmin) {
      return json({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      });
    }

    return json({ uid: userRecord.uid });

  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return json({ error: 'User not found' }, { status: 404 });
    }
    console.error('Error resolving email:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
