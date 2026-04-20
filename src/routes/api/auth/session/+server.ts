import { adminAuth } from '$lib/firebase-admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { token } = await request.json();
  
  if (!token) {
    return json({ error: 'No token provided' }, { status: 400 });
  }

  try {
    const isDev = process.env.NODE_ENV === 'development';
    
    // Definimos el tiempo de expiración (5 días)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Creamos la cookie de sesión de Firebase
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });

    // La guardamos en la cookie __session (estándar de Firebase Hosting/CDN)
    cookies.set('__session', sessionCookie, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: !isDev, // Desactivar secure en local para permitir HTTP
      maxAge: 60 * 60 * 24 * 5 // 5 días en segundos
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error creando cookie de sesión:', error);
    return json({ error: 'Error interno de autenticación' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete('__session', { path: '/' });
  return json({ success: true });
};
