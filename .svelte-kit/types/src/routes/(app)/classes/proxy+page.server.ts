// @ts-nocheck
import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ locals, url, cookies }: Parameters<PageServerLoad>[0]) => {
  // El middleware en hooks.server.ts ya maneja la protección de rutas
  console.log('🎓 Classes page server load - User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Classes page - Using REAL data from Supabase (should be empty for new user)');
    
    // Usar datos reales de Supabase incluso en desarrollo local
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    try {
      // Obtener clases del usuario
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('user_id', '550e8400-e29b-41d4-a716-446655440000') // Usar el UUID válido
        .order('created_at', { ascending: false });

      if (classesError) {
        console.error('❌ Error fetching classes in DEV MODE:', classesError);
        return {
          user: locals.user,
          classes: [],
          stats: { 
            total: 0, 
            active: 0, 
            inactive: 0, 
            levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, 
            schools: {}, 
            totalStudents: 0, 
            totalCapacity: 0, 
            occupancyRate: 0,
            averageClassSize: 0
          },
          schools: []
        };
      }

      // Obtener centros para el selector
      const { data: schools, error: schoolsError } = await supabase
        .from('colleges')
        .select('id, name')
        .eq('user_id', '550e8400-e29b-41d4-a716-446655440000') // Usar el UUID válido
        .order('created_at', { ascending: false });

      if (schoolsError) {
        console.error('❌ Error fetching schools in DEV MODE:', schoolsError);
      }

      // Calcular estadísticas (solo con campos que existen)
      const schoolCounts = {};
      classes?.forEach(c => {
        if (c.college_id) {
          schoolCounts[c.college_id] = (schoolCounts[c.college_id] || 0) + 1;
        }
      });

      const stats = {
        total: classes?.length || 0,
        active: classes?.length || 0, // Todas las clases se consideran activas
        inactive: 0,
        levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, // No hay campo level
        schools: schoolCounts,
        totalStudents: 0, // No hay campo current_students
        totalCapacity: 0, // No hay campo max_students
        occupancyRate: 0,
        averageClassSize: 0
      };

      console.log('✅ DEV MODE: Classes loaded with REAL data:', classes?.length || 0, 'classes');

      return {
        user: locals.user,
        classes: classes || [],
        stats,
        schools: schools || []
      };

    } catch (err: any) {
      console.error('❌ Error in DEV MODE classes:', err);
      return {
        user: locals.user,
        classes: [],
        stats: { 
          total: 0, 
          active: 0, 
          inactive: 0, 
          levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, 
          schools: {}, 
          totalStudents: 0, 
          totalCapacity: 0, 
          occupancyRate: 0,
          averageClassSize: 0
        },
        schools: []
      };
    }
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: Classes page - Fetching from Supabase');
  
  if (!locals.user) {
    return {
      user: null,
      classes: [],
      stats: { 
        total: 0, 
        active: 0, 
        inactive: 0, 
        levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, 
        schools: {}, 
        totalStudents: 0, 
        totalCapacity: 0, 
        occupancyRate: 0,
        averageClassSize: 0
      },
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
    // Obtener clases del usuario
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .eq('user_id', locals.user.id)
      .order('created_at', { ascending: false });

    if (classesError) {
      console.error('❌ Error fetching classes:', classesError);
      return {
        user: locals.user,
        classes: [],
        stats: { 
          total: 0, 
          active: 0, 
          inactive: 0, 
          levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, 
          schools: {}, 
          totalStudents: 0, 
          totalCapacity: 0, 
          occupancyRate: 0,
          averageClassSize: 0
        },
        schools: []
      };
    }

    // Obtener centros para el selector
    const { data: schools, error: schoolsError } = await supabase
      .from('colleges')
      .select('id, name')
      .eq('user_id', locals.user.id)
      .order('created_at', { ascending: false });

    if (schoolsError) {
      console.error('❌ Error fetching schools:', schoolsError);
    }

    // Calcular estadísticas (solo con campos que existen)
    const schoolCounts = {};
    classes?.forEach(c => {
      if (c.college_id) {
        schoolCounts[c.college_id] = (schoolCounts[c.college_id] || 0) + 1;
      }
    });

    const stats = {
      total: classes?.length || 0,
      active: classes?.length || 0, // Todas las clases se consideran activas
      inactive: 0,
      levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, // No hay campo level
      schools: schoolCounts,
      totalStudents: 0, // No hay campo current_students
      totalCapacity: 0, // No hay campo max_students
      occupancyRate: 0,
      averageClassSize: 0
    };

    return {
      user: locals.user,
      classes: classes || [],
      stats,
      schools: schools || []
    };

  } catch (err: any) {
    console.error('❌ Error in classes production mode:', err);
    return {
      user: locals.user,
      classes: [],
      stats: { 
        total: 0, 
        active: 0, 
        inactive: 0, 
        levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, 
        schools: {}, 
        totalStudents: 0, 
        totalCapacity: 0, 
        occupancyRate: 0,
        averageClassSize: 0
      },
      schools: []
    };
  }
};
