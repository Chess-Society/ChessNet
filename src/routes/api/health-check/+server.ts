import type { RequestHandler } from './$types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const GET: RequestHandler = async ({ cookies, locals, url }) => {
  try {
    // Información básica del entorno
    const healthInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'unknown',
        PUBLIC_SUPABASE_URL: PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        PUBLIC_SUPABASE_ANON_KEY: PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
        url: url.toString(),
        hostname: url.hostname
      },
      cookies: {
        total: cookies.getAll().length,
        supabase: cookies.getAll().filter(c => c.name.startsWith('sb-')).map(c => c.name)
      },
      locals: {
        hasUser: !!locals.user,
        userEmail: locals.user?.email || null
      },
      status: 'healthy'
    };

    return new Response(JSON.stringify(healthInfo, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: {
        message: error.message,
        stack: error.stack
      }
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
