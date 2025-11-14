import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  console.log('🔍 Debug Colleges - Checking colleges table structure...');
  
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options),
    },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    // Try to get table structure
    console.log('🔍 Debug Colleges - Trying to query colleges table...');
    
    // First, try to get all colleges without user_id filter
    const { data: allColleges, error: allError } = await supabase
      .from('colleges')
      .select('*')
      .limit(5);

    console.log('🔍 Debug Colleges - All colleges query result:', { 
      success: !allError, 
      error: allError?.message,
      count: allColleges?.length || 0,
      sample: allColleges?.[0] || null
    });

    // Try with user_id filter
    const { data: userColleges, error: userError } = await supabase
      .from('colleges')
      .select('*')
      .eq('user_id', user.id)
      .limit(5);

    console.log('🔍 Debug Colleges - User colleges query result:', { 
      success: !userError, 
      error: userError?.message,
      count: userColleges?.length || 0
    });

    return json({
      user: {
        id: user.id,
        email: user.email
      },
      allColleges: {
        success: !allError,
        error: allError?.message,
        count: allColleges?.length || 0,
        sample: allColleges?.[0] || null
      },
      userColleges: {
        success: !userError,
        error: userError?.message,
        count: userColleges?.length || 0,
        data: userColleges || []
      }
    });

  } catch (error: any) {
    console.error('❌ Debug Colleges - Unexpected error:', error);
    return json({ error: error.message }, { status: 500 });
  }
};
