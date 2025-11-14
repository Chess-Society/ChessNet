// @ts-nocheck
import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ locals, url, cookies }: Parameters<PageServerLoad>[0]) => {
  console.log('🎓 Classes create page server load - User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Classes create page - Using REAL data from Supabase');
    
    // Usar datos reales de Supabase incluso en desarrollo local
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (name: string) => cookies.get(name),
        set: (name: string, value: string, options: any) => cookies.set(name, value, options),
        remove: (name: string, options: any) => cookies.delete(name, options)
      }
    });
    
    try {
      const { data: schools, error: schoolsError } = await supabase
        .from('colleges')
        .select('id, name, city')
        .eq('user_id', '550e8400-e29b-41d4-a716-446655440000') // Usar el UUID válido
        .order('created_at', { ascending: false });
      
      if (schoolsError) {
        console.error('❌ Error fetching schools in DEV MODE:', schoolsError);
        return {
          user: locals.user,
          schools: []
        };
      }
      
      console.log('✅ DEV MODE: Schools loaded successfully:', schools?.length || 0);
      return {
        user: locals.user,
        schools: schools || []
      };
    } catch (err: any) {
      console.error('❌ Error in DEV MODE classes create page load:', err);
      return {
        user: locals.user,
        schools: []
      };
    }
  }
  
  // ===== PRODUCCIÓN: Cargar centros reales =====
  console.log('🌐 PRODUCTION MODE: Classes create page - Fetching schools from Supabase');
  
  if (!locals.user) {
    console.log('❌ No user found, redirecting to login');
    return {
      user: null,
      schools: []
    };
  }
  
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name: string) => cookies.get(name),
      set: (name: string, value: string, options: any) => cookies.set(name, value, options),
      remove: (name: string, options: any) => cookies.delete(name, options)
    }
  });
  
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('colleges')
      .select('id, name, city')
      .eq('user_id', locals.user.id)
      .order('created_at', { ascending: false });
    
    if (schoolsError) {
      console.error('❌ Error fetching schools:', schoolsError);
      return {
        user: locals.user,
        schools: []
      };
    }
    
    console.log('✅ Schools loaded successfully:', schools?.length || 0);
    return {
      user: locals.user,
      schools: schools || []
    };
  } catch (err: any) {
    console.error('❌ Error in classes create page load:', err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
