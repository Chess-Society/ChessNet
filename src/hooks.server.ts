import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  '/login',
  '/auth/callback',
  '/auth/success',
  '/debug',
  '/debug-auth'
];

// Rutas estáticas que deben ser excluidas
const STATIC_ROUTES = [
  '/_app',
  '/favicon.ico'
];

// Rutas de API que requieren autenticación
const PROTECTED_API_ROUTES = [
  '/api/schools',
  '/api/classes',
  '/api/students',
  '/api/skills',
  '/api/tournaments',
  '/api/payments'
];

export const handle: Handle = async ({ event, resolve }) => {
  if (building) {
    return await resolve(event);
  }

  const { pathname } = event.url;
  
  // Recuperar sesión de la cookie (Token de Firebase o User cacheado)
  const sessionCookie = event.cookies.get('sb-auth-token');
  
  if (sessionCookie) {
    try {
      const user = JSON.parse(sessionCookie);
      event.locals.user = {
        id: user.uid || user.id,
        email: user.email,
        full_name: user.displayName || user.full_name || null,
        avatar_url: user.photoURL || user.avatar_url || null
      };
      
      console.log('✅ Session verified on server - User:', event.locals.user.email);
    } catch (error) {
      console.error('❌ Error parsing session cookie:', error);
      event.cookies.delete('sb-auth-token', { path: '/' });
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isStaticRoute = STATIC_ROUTES.some(route => pathname.startsWith(route)) || 
                       pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/);

  if (isStaticRoute) {
    return await resolve(event);
  }

  // Redirigir a login si intenta acceder a ruta protegida sin sesión
  // (Opcional, pero recomendado para escalabilidad en SSR)
  if (!event.locals.user && !isPublicRoute && pathname !== '/') {
    console.log('🔒 Protected route access denied - Redirecting to login');
    throw redirect(303, `/login?redirectTo=${pathname}`);
  }

  return await resolve(event);
};
