import type { RequestHandler } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const GET: RequestHandler = async ({ cookies, locals }) => {
  try {
    // Crear cliente de Supabase
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => {
          cookies.set(key, value, { ...options, path: '/' });
        },
        remove: (key, options) => {
          cookies.delete(key, { ...options, path: '/' });
        },
      },
    });

    // Obtener sesión
    const { data: { session }, error } = await supabase.auth.getSession();

    const response = {
      authenticated: !!session && !!locals.user,
      user: locals.user,
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email
        },
        expires_at: session.expires_at
      } : null,
      error: error?.message || null
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      authenticated: false,
      user: null,
      session: null,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
