import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
  console.log('🔍 Debug Classes - Getting all classes from Supabase...');
  
  try {
    // ===== BYPASS PARA DESARROLLO LOCAL =====
    const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    
    if (isLocalDev) {
      console.log('🔧 DEV MODE: Debug Classes - Using mock user ID');
      
      const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
          get: (key) => cookies.get(key),
          set: (key, value, options) => cookies.set(key, value, options),
          remove: (key, options) => cookies.delete(key, options),
        },
      });

      try {
        // Obtener todas las clases del usuario mock
        const { data: classes, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .eq('user_id', '550e8400-e29b-41d4-a716-446655440000') // Usar el UUID válido
          .order('created_at', { ascending: false });

        if (classesError) {
          console.error('❌ Error fetching classes in DEV MODE:', classesError);
          return json({ classes: [], error: classesError.message });
        }

        console.log('✅ DEV MODE: Classes loaded:', classes?.length || 0, 'classes');
        return json({ 
          classes: classes || [],
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          mode: 'dev'
        });

      } catch (err: any) {
        console.error('❌ Error in DEV MODE debug classes:', err);
        return json({ classes: [], error: err.message });
      }
    }
    
    // ===== LÓGICA NORMAL PARA PRODUCCIÓN =====
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('❌ Debug Classes - User not authenticated:', userError?.message);
      return json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {
      // Obtener todas las clases del usuario
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (classesError) {
        console.error('❌ Error fetching classes:', classesError);
        return json({ classes: [], error: classesError.message });
      }

      console.log('✅ Debug Classes - Found classes:', classes?.length || 0);
      return json({ 
        classes: classes || [],
        user_id: user.id,
        user_email: user.email,
        mode: 'production'
      });

    } catch (error: any) {
      console.error('❌ Debug Classes - Error:', error.message);
      return json({ classes: [], error: error.message });
    }
  } catch (error: any) {
    console.error('❌ Debug Classes - Request error:', error.message);
    return json({ error: 'Invalid request' }, { status: 400 });
  }
};