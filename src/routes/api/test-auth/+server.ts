import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    console.log('🔍 Test Auth - Starting test...');
    
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    // Test 1: Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔍 Test Auth - Session check:', { 
      hasSession: !!session, 
      error: sessionError?.message 
    });

    // Test 2: Check user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('🔍 Test Auth - User check:', { 
      hasUser: !!user, 
      error: userError?.message 
    });

    // Test 3: Check cookies
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter(c => c.name.includes('supabase'));
    console.log('🔍 Test Auth - Cookies:', { 
      total: allCookies.length,
      supabase: supabaseCookies.length,
      names: supabaseCookies.map(c => c.name)
    });

    // Test 4: Try to access colleges table
    let dbTest = { success: false, error: null };
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id')
        .limit(1);
      
      dbTest = { success: !error, error: error?.message || null };
    } catch (err: any) {
      dbTest = { success: false, error: err.message };
    }

    return json({
      success: true,
      tests: {
        session: {
          exists: !!session,
          error: sessionError?.message || null
        },
        user: {
          exists: !!user,
          error: userError?.message || null,
          email: user?.email || null
        },
        cookies: {
          total: allCookies.length,
          supabase: supabaseCookies.length,
          names: supabaseCookies.map(c => c.name)
        },
        database: dbTest
      }
    });

  } catch (error: any) {
    console.error('❌ Test Auth - Error:', error);
    return json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
};
