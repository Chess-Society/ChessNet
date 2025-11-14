import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  console.log('🔍 WhoAmI - Checking server-side authentication...');
  
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
    // Obtener usuario actual
    const { data: { user }, error } = await supabase.auth.getUser();
    
    console.log('🔍 WhoAmI - User check result:', {
      hasUser: !!user,
      userEmail: user?.email || 'none',
      userId: user?.id || 'none',
      error: error?.message || 'none'
    });

    // Verificar cookies de Supabase
    const supabaseCookies = cookies.getAll().filter(cookie => cookie.name.startsWith('sb-'));
    console.log('🍪 WhoAmI - Supabase cookies found:', supabaseCookies.map(c => c.name));

    if (error) {
      console.error('❌ WhoAmI - Error getting user:', error.message);
      return json({ 
        user: null, 
        error: error.message,
        cookies: supabaseCookies.map(c => c.name)
      }, { status: 401 });
    }

    if (!user) {
      console.log('❌ WhoAmI - No user found');
      return json({ 
        user: null, 
        error: 'No user found',
        cookies: supabaseCookies.map(c => c.name)
      }, { status: 401 });
    }

    console.log('✅ WhoAmI - User authenticated:', user.email);
    return json({ 
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: user.created_at
      },
      error: null,
      cookies: supabaseCookies.map(c => c.name)
    });

  } catch (error: any) {
    console.error('❌ WhoAmI - Unexpected error:', error);
    return json({ 
      user: null, 
      error: error.message || 'Unexpected error',
      cookies: []
    }, { status: 500 });
  }
};
