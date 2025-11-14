import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
  console.log('🔍 Auth Callback - Processing OAuth callback');
  
  const code = url.searchParams.get('code');
  const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
  
  console.log('🔍 Auth Callback - Code received:', !!code);
  console.log('🔍 Auth Callback - Redirect to:', redirectTo);
  
  // Verificar variables de entorno
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Auth Callback - Missing Supabase environment variables');
    throw redirect(303, '/login?error=callback_failed');
  }

  // Si no hay código, redirigir a login con error
  if (!code) {
    console.log('❌ Auth Callback - No code provided');
    throw redirect(303, '/login?error=callback_failed');
  }

  // Crear cliente de Supabase con manejo de cookies
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      flowType: 'pkce'
    },
    cookies: {
      get: (key) => {
        return cookies.get(key);
      },
      set: (key, value, options) => {
        cookies.set(key, value, { 
          ...options, 
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        });
      },
      remove: (key, options) => {
        cookies.delete(key, { ...options, path: '/' });
      },
    },
  });

  try {
    console.log('🔄 Auth Callback - Exchanging code for session...');
    
    // Intercambiar código por sesión
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('❌ Auth Callback - Error exchanging code:', error.message);
      throw redirect(303, '/login?error=callback_failed');
    }

    if (!data.session) {
      console.error('❌ Auth Callback - No session created after exchange');
      throw redirect(303, '/login?error=callback_failed');
    }

    console.log('✅ Auth Callback - Session created successfully for user:', data.session.user.email);
    console.log('🔄 Auth Callback - Redirecting to:', redirectTo);
    
    // Las cookies se establecieron automáticamente por el cliente de Supabase
    // Redirigir al destino final
    throw redirect(303, redirectTo);
    
  } catch (error: any) {
    // Si es un redirect de SvelteKit, re-lanzarlo
    if (error?.status === 303) {
      throw error;
    }
    
    console.error('❌ Auth Callback - Unexpected error:', error);
    throw redirect(303, '/login?error=callback_failed');
  }
};
