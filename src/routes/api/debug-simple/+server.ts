import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    console.log('🔍 Debug Simple - Starting auth check...');
    
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔍 Debug Simple - Session check:', { 
      hasSession: !!session, 
      error: sessionError?.message 
    });

    // Check user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('🔍 Debug Simple - User check:', { 
      hasUser: !!user, 
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message 
    });

    // Check cookies
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter(c => c.name.startsWith('sb-'));
    console.log('🔍 Debug Simple - Cookies:', {
      total: allCookies.length,
      supabase: supabaseCookies.length,
      supabaseNames: supabaseCookies.map(c => c.name)
    });

    return json({
      success: true,
      session: {
        exists: !!session,
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email
        } : null
      },
      user: {
        exists: !!user,
        id: user?.id,
        email: user?.email
      },
      cookies: {
        total: allCookies.length,
        supabase: supabaseCookies.length
      },
      errors: {
        session: sessionError?.message,
        user: userError?.message
      }
    });

  } catch (error: any) {
    console.error('❌ Debug Simple - Error:', error);
    return json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
};