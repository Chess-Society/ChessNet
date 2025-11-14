import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Validación mejorada de variables de entorno en el servidor
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  const missingVars = [];
  if (!PUBLIC_SUPABASE_URL) missingVars.push('PUBLIC_SUPABASE_URL');
  if (!PUBLIC_SUPABASE_ANON_KEY) missingVars.push('PUBLIC_SUPABASE_ANON_KEY');
  
  console.error(`❌ Variables de entorno de Supabase faltantes en el servidor: ${missingVars.join(', ')}`);
  throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`);
}

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
  const { pathname } = event.url;
  
  // ===== BYPASS DE AUTENTICACIÓN PARA DESARROLLO LOCAL =====
  const isLocalDev = event.url.hostname === 'localhost' || event.url.hostname === '127.0.0.1';
  
  // HABILITADO PARA DESARROLLO LOCAL
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Bypassing authentication for localhost');
    
    // Mock user para desarrollo local
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000', // UUID válido
      email: 'dev@localhost.com',
      user_metadata: {
        name: 'Developer User',
        avatar_url: null
      }
    };
    
    // Agregar usuario mock a locals
    event.locals.user = mockUser;
    event.locals.supabase = null; // No necesitamos Supabase en dev
    
    console.log('✅ DEV MODE: Mock user authenticated:', mockUser.email);
    
    return await resolve(event);
  }
  
  // ===== AUTENTICACIÓN NORMAL PARA PRODUCCIÓN =====
  console.log('🔒 PROD MODE: Using normal Supabase authentication');
  
  // Crear cliente de Supabase con manejo de cookies
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      flowType: 'pkce'
    },
    cookies: {
      get: (key) => {
        const cookie = event.cookies.get(key);
        return cookie;
      },
      set: (key, value, options) => {
        event.cookies.set(key, value, { 
          ...options, 
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        });
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' });
      },
    },
  });

  // Verificar si es una ruta pública, estática o API protegida
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isStaticRoute = STATIC_ROUTES.some(route => pathname.startsWith(route)) || 
                       pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/);
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route));

  // Si es ruta estática, continuar sin verificación de autenticación
  if (isStaticRoute) {
    return await resolve(event);
  }

  // Obtener sesión de Supabase - MÉTODO ROBUSTO
  let session = null;
  let error = null;

  // Debug: Verificar cookies de Supabase ANTES de intentar obtener sesión
  const supabaseCookies = event.cookies.getAll().filter(cookie => cookie.name.startsWith('sb-'));
  console.log('🍪 Supabase cookies found:', supabaseCookies.map(c => c.name));

  try {
    // Método principal: getUser() (más confiable en producción)
    const userResult = await supabase.auth.getUser();
    console.log('🔍 getUser() result:', {
      hasUser: !!userResult.data.user,
      userEmail: userResult.data.user?.email || 'none',
      error: userResult.error?.message || 'none'
    });
    
    if (userResult.data.user && !userResult.error) {
      // Crear sesión con el usuario encontrado
      session = { user: userResult.data.user };
      console.log('✅ User found via getUser():', userResult.data.user.email);
    } else {
      // Fallback: intentar getSession()
      console.log('🔄 getUser() failed, trying getSession()...');
      const sessionResult = await supabase.auth.getSession();
      session = sessionResult.data.session;
      error = sessionResult.error;
      
      console.log('🔍 getSession() result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email || 'none',
        error: error?.message || 'none'
      });
    }
  } catch (err) {
    console.error('❌ Error getting session/user:', err);
    error = err;
  }

  if (error) {
    console.error('❌ Error getting session:', error);
  }

  // Establecer usuario en locals si existe sesión
  if (session?.user) {
    event.locals.user = {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.user_metadata?.full_name || null,
      avatar_url: session.user.user_metadata?.avatar_url || null,
      created_at: session.user.created_at
    };
    console.log('✅ User session found:', session.user.email);
  } else {
    event.locals.user = null;
    console.log('❌ No user session found');
  }

  // Middleware de protección SSR - LÓGICA SIMPLIFICADA
  if (!isPublicRoute || isProtectedApiRoute) {
    // Si no hay usuario y es ruta protegida (página o API), verificar autenticación
    if (!session?.user) {
      if (isProtectedApiRoute) {
        // Para rutas de API, devolver error 401 en lugar de redirect
        console.log('🔒 Protected API route accessed without authentication');
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // Para páginas, redirigir a login
        console.log('🔒 Protected route accessed without authentication, redirecting to login');
        const redirectUrl = new URL('/login', event.url.origin);
        redirectUrl.searchParams.set('redirectTo', pathname + event.url.search);
        throw redirect(302, redirectUrl.toString());
      }
    } else {
      // Usuario autenticado - ACCESO COMPLETO a todas las funcionalidades
      console.log('✅ Authenticated user accessing protected route:', pathname);
    }
  } else if (pathname === '/login' && session?.user) {
    // Si hay usuario y está en login, redirigir a dashboard
    console.log('🔄 User already authenticated, redirecting from login to dashboard');
    throw redirect(302, '/dashboard');
  }

  // Debug logging
  console.log('🔍 Hooks Server Debug:', {
    pathname,
    hasSession: !!session,
    userEmail: session?.user?.email || 'none',
    isPublicRoute,
    isStaticRoute
  });

  const response = await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    },
  });

  return response;
};
