import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
  // El middleware en hooks.server.ts ya maneja la protección de rutas
  console.log('👥 Students page server load - User:', locals.user?.email || 'none');
  
  if (!locals.user) {
    return {
      user: null,
      students: [],
      stats: { total: 0, active: 0, inactive: 0, levels: { beginner: 0, intermediate: 0, advanced: 0 }, schools: {}, averageAge: 0, newest: null },
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
    // Obtener estudiantes del usuario
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', locals.user.id)
      .order('created_at', { ascending: false });

    if (studentsError) {
      console.error('❌ Error fetching students:', studentsError);
      return {
        user: locals.user,
        students: [],
        stats: { total: 0, schools: {}, newest: null },
        schools: []
      };
    }

    // Obtener centros para el selector
    const { data: schools, error: schoolsError } = await supabase
      .from('colleges')
      .select('id, name')
      .eq('user_id', locals.user.id);

    if (schoolsError) {
      console.error('❌ Error fetching schools:', schoolsError);
    }

    // Calcular estadísticas simplificadas
    const schoolCounts = {};
    students?.forEach(s => {
      if (s.college_id) {
        schoolCounts[s.college_id] = (schoolCounts[s.college_id] || 0) + 1;
      }
    });

    const stats = {
      total: students?.length || 0,
      schools: schoolCounts,
      newest: students?.[0]?.created_at || null
    };

    return {
      user: locals.user,
      students: students || [],
      stats,
      schools: schools || []
    };

  } catch (err: any) {
    console.error('❌ Error in students production mode:', err);
    return {
      user: locals.user,
      students: [],
      stats: { total: 0, active: 0, inactive: 0, levels: { beginner: 0, intermediate: 0, advanced: 0 }, schools: {}, averageAge: 0, newest: null },
      schools: []
    };
  }
};
