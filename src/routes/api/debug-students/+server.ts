import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
  console.log('🔍 Debug Students - Checking students table...');
  
  try {
    // ===== BYPASS PARA DESARROLLO LOCAL =====
    const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    
    if (isLocalDev) {
      console.log('🔧 DEV MODE: Debug Students - Using REAL data from Supabase');
      
      const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
          get: (key) => cookies.get(key),
          set: (key, value, options) => cookies.set(key, value, options),
          remove: (key, options) => cookies.delete(key, options),
        },
      });

      try {
        // Verificar si la tabla existe
        const { data: testData, error: testError } = await supabase
          .from('students')
          .select('id')
          .limit(1);

        if (testError) {
          console.error('❌ Error accessing students table:', testError);
          return json({ 
            error: 'Students table not accessible', 
            details: testError.message 
          }, { status: 500 });
        }

        // Obtener estructura de la tabla
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', '550e8400-e29b-41d4-a716-446655440000')
          .limit(5);

        if (studentsError) {
          console.error('❌ Error fetching students:', studentsError);
          return json({ 
            error: 'Error fetching students', 
            details: studentsError.message 
          }, { status: 500 });
        }

        console.log('✅ DEV MODE: Students table accessible, found:', students?.length || 0, 'students');
        return json({ 
          success: true,
          tableExists: true,
          studentsCount: students?.length || 0,
          sampleStudents: students || [],
          message: 'Students table is accessible'
        });

      } catch (err: any) {
        console.error('❌ Error in DEV MODE debug students:', err);
        return json({ 
          error: 'Error in debug students', 
          details: err.message 
        }, { status: 500 });
      }
    }
    
    // ===== LÓGICA PARA PRODUCCIÓN =====
    console.log('🌐 PRODUCTION MODE: Debug Students - Checking students table');
    
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('❌ Debug Students - User not authenticated:', userError?.message);
      return json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {
      // Verificar si la tabla existe
      const { data: testData, error: testError } = await supabase
        .from('students')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('❌ Error accessing students table:', testError);
        return json({ 
          error: 'Students table not accessible', 
          details: testError.message 
        }, { status: 500 });
      }

      // Obtener estructura de la tabla
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .limit(5);

      if (studentsError) {
        console.error('❌ Error fetching students:', studentsError);
        return json({ 
          error: 'Error fetching students', 
          details: studentsError.message 
        }, { status: 500 });
      }

      console.log('✅ Students table accessible, found:', students?.length || 0, 'students');
      return json({ 
        success: true,
        tableExists: true,
        studentsCount: students?.length || 0,
        sampleStudents: students || [],
        message: 'Students table is accessible'
      });

    } catch (error: any) {
      console.error('❌ Error in debug students:', error.message);
      return json({ 
        error: 'Error in debug students', 
        details: error.message 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Error in debug students endpoint:', error.message);
    return json({ 
      error: 'Error in debug students endpoint', 
      details: error.message 
    }, { status: 500 });
  }
};
