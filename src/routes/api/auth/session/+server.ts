import { adminAuth } from '$lib/firebase-admin';
import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  let token: string | undefined;
  
  try {
    const body = await request.json();
    token = body.token;
  } catch (e) {
    console.error('❌ [SessionAPI] Failed to parse request body:', e);
    return json({ error: 'Payload inválido' }, { status: 400 });
  }
  
  if (!token) {
    // Si estamos en dev y no hay token, pero hay bypass activado, devolvemos éxito
    const isDev = dev;
    if (isDev && cookies.get('antigravity_access')) {
        return json({ success: true, bypass: true });
    }
    return json({ error: 'No token provided' }, { status: 400 });
  }

  try {
    const isDev = dev;
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
    
    // Check if adminAuth is usable
    let authAvailable = false;
    try {
        if (adminAuth && typeof adminAuth.createSessionCookie === 'function') {
            authAvailable = true;
        }
    } catch (e) {
        authAvailable = false;
    }

    if (!authAvailable) {
        if (isDev) {
            console.warn('⚠️ [SessionAPI] Firebase Admin Auth not available. Bypassing in DEV mode.');
            return json({ success: true, bypass: true });
        }
        throw new Error('Servicio de autenticación no disponible');
    }

    try {
      const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });

      cookies.set('__session', sessionCookie, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: !isDev,
        maxAge: 60 * 60 * 24 * 5
      });

      console.log('✅ [SessionAPI] Session cookie created successfully');
      return json({ success: true });

    } catch (createErr: any) {
      console.error('❌ [SessionAPI] Firebase createSessionCookie error:', createErr.message);
      
      if (isDev) {
        console.warn('⚠️ [SessionAPI] Error skipped in DEV mode.');
        return json({ success: true, bypass: true });
      }
      
      return json({ error: 'Token inválido o expirado' }, { status: 401 });
    }

  } catch (error: any) {
    console.error('❌ [SessionAPI] Fatal error:', error);
    return json({ error: 'Error interno del servidor de sesión', details: error.message }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete('__session', { path: '/' });
  cookies.delete('antigravity_access', { path: '/' });
  return json({ success: true });
};
