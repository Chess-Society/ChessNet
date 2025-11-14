import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  console.log('🔍 Debug Classes Schema - Starting...');
  
  try {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      auth: { flowType: 'pkce' },
      cookies: { 
        get: (key) => cookies.get(key), 
        set: (key, value, options) => cookies.set(key, value, options), 
        remove: (key, options) => cookies.delete(key, options) 
      },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return json({ error: 'Not authenticated', details: userError }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    // Try to insert a test record to see what columns are accepted
    const testData = {
      user_id: user.id,
      name: 'Test Class Schema',
      college_id: 'test-college-id'
    };

    console.log('🧪 Testing with data:', testData);

    const { data, error } = await supabase
      .from('classes')
      .insert(testData)
      .select()
      .single();

    if (error) {
      console.log('❌ Insert error:', error);
      return json({ 
        error: 'Insert failed', 
        details: error,
        testData,
        message: 'This shows which columns are causing issues'
      });
    }

    // If successful, delete the test record
    await supabase
      .from('classes')
      .delete()
      .eq('id', data.id);

    return json({ 
      success: true, 
      message: 'All columns are valid',
      insertedData: data,
      testData
    });

  } catch (error: any) {
    console.error('❌ Debug Classes Schema - Error:', error);
    return json({ 
      error: 'Unexpected error', 
      details: error.message 
    }, { status: 500 });
  }
};
