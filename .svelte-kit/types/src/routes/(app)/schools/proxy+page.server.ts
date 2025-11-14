// @ts-nocheck
import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ locals, url, cookies }: Parameters<PageServerLoad>[0]) => {
  // El middleware en hooks.server.ts ya maneja la protección de rutas
  console.log('📚 Schools page server load - User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Schools page - Using REAL data from Supabase (should be empty for new user)');
    
    // Usar datos reales de Supabase incluso en desarrollo local
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    try {
      // Obtener centros del usuario
      const { data: schools, error: schoolsError } = await supabase
        .from('colleges')
        .select('*')
        .eq('user_id', locals.user.id)
        .order('created_at', { ascending: false });

      if (schoolsError) {
        console.error('❌ Error fetching schools in DEV MODE:', schoolsError);
        return {
          user: locals.user,
          schools: []
        };
      }

      console.log('✅ DEV MODE: Schools loaded with REAL data:', schools?.length || 0, 'schools');

      return {
        user: locals.user,
        schools: schools || []
      };

    } catch (err: any) {
      console.error('❌ Error in DEV MODE schools:', err);
      return {
        user: locals.user,
        schools: []
      };
    }
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: Schools page - Fetching from Supabase');
  
  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }

  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options),
    },
  });

  try {
    // Obtener centros del usuario
    const { data: schools, error: schoolsError } = await supabase
      .from('colleges')
      .select('*')
      .eq('user_id', locals.user.id)
      .order('created_at', { ascending: false });

    if (schoolsError) {
      console.error('❌ Error fetching schools:', schoolsError);
      return {
        user: locals.user,
        schools: []
      };
    }

    return {
      user: locals.user,
      schools: schools || []
    };

  } catch (err: any) {
    console.error('❌ Error in schools production mode:', err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
