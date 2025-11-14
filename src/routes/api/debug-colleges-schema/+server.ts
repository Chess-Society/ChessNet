import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  console.log('🔍 Debug Colleges Schema - Starting...');
  
  try {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      auth: { flowType: 'pkce' },
      cookies: { 
        get: (key) => cookies.get(key), 
        set: (key, value, options) => cookies.set(key, value, options), 
        remove: (key, options) => cookies.delete(key, options) 
      },
    });

    // Get table schema information
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'colleges')
      .eq('table_schema', 'public');

    if (columnsError) {
      console.error('❌ Error getting columns:', columnsError);
      return json({ error: 'Failed to get columns', details: columnsError }, { status: 500 });
    }

    // Try to get a sample record to see what fields are actually returned
    const { data: sampleData, error: sampleError } = await supabase
      .from('colleges')
      .select('*')
      .limit(1);

    console.log('✅ Columns found:', columns);
    console.log('✅ Sample data:', sampleData);

    return json({
      success: true,
      columns: columns || [],
      sampleData: sampleData || [],
      columnCount: columns?.length || 0
    });

  } catch (error: any) {
    console.error('❌ Debug Colleges Schema - Unexpected error:', error);
    return json({ 
      error: error.message || 'Internal server error',
      stack: error.stack 
    }, { status: 500 });
  }
};
