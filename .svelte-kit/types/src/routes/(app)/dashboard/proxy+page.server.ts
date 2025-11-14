// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ locals, url, cookies }: Parameters<PageServerLoad>[0]) => {
  console.log('📊 Dashboard server load - User:', locals.user?.email || 'none');
  
  // Si hay un código de OAuth en la URL, redirigir al callback
  const code = url.searchParams.get('code');
  if (code) {
    console.log('🔄 Dashboard: OAuth code detected, redirecting to callback');
    throw redirect(302, `/auth/callback?code=${code}`);
  }

  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Dashboard - Using REAL data from Supabase (should be zero for new user)');
    
    // Usar datos reales de Supabase incluso en desarrollo local
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    try {
      // Obtener estadísticas básicas de producción
      const [schoolsResult, studentsResult, classesResult] = await Promise.all([
        supabase.from('colleges').select('id, name, city, created_at').eq('user_id', locals.user.id),
        supabase.from('students').select('id').eq('user_id', locals.user.id),
        supabase.from('classes').select('id').eq('user_id', locals.user.id)
      ]);

      const dashboardStats = {
        totalCenters: schoolsResult.data?.length || 0,
        totalStudents: studentsResult.data?.length || 0,
        totalClasses: classesResult.data?.length || 0,
        activeStudents: studentsResult.data?.length || 0, // Asumimos que todos están activos por ahora
        monthlyRevenue: 0, // Se calculará cuando implementemos el sistema de pagos
        upcomingSessions: 0 // Se calculará cuando implementemos el sistema de clases
      };

      // Crear centersWithStats con los datos reales
      const centersWithStats = (schoolsResult.data || []).map(school => ({
        id: school.id,
        name: school.name,
        city: school.city || 'Sin ciudad',
        totalClasses: 0, // Se calculará cuando tengamos clases
        totalStudents: 0, // Se calculará cuando tengamos estudiantes
        occupancyRate: 0,
        attendanceRate: 0,
        monthlyRevenue: 0,
        lastActivity: school.created_at
      }));

      console.log('✅ DEV MODE: Dashboard loaded with REAL data:', {
        totalCenters: dashboardStats.totalCenters,
        totalStudents: dashboardStats.totalStudents,
        totalClasses: dashboardStats.totalClasses,
        centersWithStats: centersWithStats.length
      });

      return {
        user: locals.user,
        dashboardStats,
        centersWithStats,
        featuredClasses: [],
        recentActivity: [],
        upcomingSessionsToday: []
      };

    } catch (err: any) {
      console.error('❌ Error in DEV MODE dashboard:', err);
      // En caso de error, devolver datos básicos
      return {
        user: locals.user,
        dashboardStats: {
          totalCenters: 0,
          totalStudents: 0,
          totalClasses: 0,
          activeStudents: 0,
          monthlyRevenue: 0,
          upcomingSessions: 0
        },
        centersWithStats: [],
        featuredClasses: [],
        recentActivity: [],
        upcomingSessionsToday: []
      };
    }
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: Dashboard - Fetching from Supabase');
  
  if (!locals.user) {
    return {
      user: null
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
    // Obtener estadísticas básicas de producción
    const [schoolsResult, studentsResult, classesResult] = await Promise.all([
      supabase.from('colleges').select('id, name, city, created_at').eq('user_id', locals.user.id),
      supabase.from('students').select('id').eq('user_id', locals.user.id),
      supabase.from('classes').select('id').eq('user_id', locals.user.id)
    ]);

    const dashboardStats = {
      totalCenters: schoolsResult.data?.length || 0,
      totalStudents: studentsResult.data?.length || 0,
      totalClasses: classesResult.data?.length || 0,
      activeStudents: studentsResult.data?.length || 0, // Asumimos que todos están activos por ahora
      monthlyRevenue: 0, // Se calculará cuando implementemos el sistema de pagos
      upcomingSessions: 0 // Se calculará cuando implementemos el sistema de clases
    };

    // Crear centersWithStats con los datos reales
    const centersWithStats = (schoolsResult.data || []).map(school => ({
      id: school.id,
      name: school.name,
      city: school.city || 'Sin ciudad',
      totalClasses: 0, // Se calculará cuando tengamos clases
      totalStudents: 0, // Se calculará cuando tengamos estudiantes
      occupancyRate: 0,
      attendanceRate: 0,
      monthlyRevenue: 0,
      lastActivity: school.created_at
    }));

    console.log('✅ Dashboard loaded successfully:', {
      totalCenters: dashboardStats.totalCenters,
      centersWithStats: centersWithStats.length
    });

    return {
      user: locals.user,
      dashboardStats,
      centersWithStats,
      featuredClasses: [],
      recentActivity: [],
      upcomingSessionsToday: []
    };

  } catch (err: any) {
    console.error('❌ Error in dashboard production mode:', err);
    // En caso de error, devolver datos básicos
    return {
      user: locals.user,
      dashboardStats: {
        totalCenters: 0,
        totalStudents: 0,
        totalClasses: 0,
        activeStudents: 0,
        monthlyRevenue: 0,
        upcomingSessions: 0
      },
      centersWithStats: [],
      featuredClasses: [],
      recentActivity: [],
      upcomingSessionsToday: []
    };
  }
};
