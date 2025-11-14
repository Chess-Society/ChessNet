import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url, params, cookies }) => {
  console.log('🏫 School detail page server load - User:', locals.user?.email || 'none');
  console.log('🏫 School ID:', params.schoolId);
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: School detail page - Fetching from API');
    
    const schoolId = params.schoolId;
    
    // Obtener centros del API (que usa el almacén temporal)
    const apiResponse = await fetch(`http://localhost:5173/api/schools`);
    const apiData = await apiResponse.json();
    const mockSchools = apiData.schools || [];

    // Mock de clases del centro
    const mockClasses = [
      // Clases de mock-school-1 (Escuela de Ajedrez Madrid Centro)
      {
        id: 'mock-class-1',
        user_id: 'dev-user-123',
        school_id: 'mock-school-1',
        name: 'Principiantes Mañana',
        description: 'Grupo de iniciación para niños de 6-9 años',
        schedule: 'Lunes y Miércoles 10:00-11:00',
        max_students: 12,
        current_students: 8,
        level: 'beginner',
        active: true,
        room: 'Aula 1',
        instructor_notes: 'Grupo muy participativo, necesitan refuerzo en movimientos básicos',
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-class-2',
        user_id: 'dev-user-123',
        school_id: 'mock-school-1',
        name: 'Intermedios Tarde',
        description: 'Grupo intermedio para estudiantes con conocimientos básicos',
        schedule: 'Martes y Jueves 17:00-18:30',
        max_students: 10,
        current_students: 7,
        level: 'intermediate',
        active: true,
        room: 'Aula 2',
        instructor_notes: 'Trabajan bien las tácticas, empezar con estrategia básica',
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-class-3',
        user_id: 'dev-user-123',
        school_id: 'mock-school-1',
        name: 'Avanzados Fin de Semana',
        description: 'Grupo avanzado para preparación de torneos',
        schedule: 'Sábados 09:00-11:00',
        max_students: 8,
        current_students: 5,
        level: 'advanced',
        active: true,
        room: 'Sala Principal',
        instructor_notes: 'Preparación específica para competición, análisis de partidas',
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-class-6',
        user_id: 'dev-user-123',
        school_id: 'mock-school-1',
        name: 'Adultos Vespertino',
        description: 'Clase para adultos principiantes e intermedios',
        schedule: 'Miércoles 20:00-21:30',
        max_students: 15,
        current_students: 12,
        level: 'mixed',
        active: false,
        room: 'Aula 3',
        instructor_notes: 'Clase suspendida por baja asistencia en invierno',
        created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      
      // Clases de mock-school-2 (Club Ajedrez Infantil Retiro)
      {
        id: 'mock-class-4',
        user_id: 'dev-user-123',
        school_id: 'mock-school-2',
        name: 'Pequeños Ajedrecistas',
        description: 'Iniciación para los más pequeños (4-6 años)',
        schedule: 'Viernes 16:00-17:00',
        max_students: 8,
        current_students: 6,
        level: 'beginner',
        active: true,
        room: 'Sala Infantil',
        instructor_notes: 'Enfoque lúdico, juegos y cuentos de ajedrez',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-class-5',
        user_id: 'dev-user-123',
        school_id: 'mock-school-2',
        name: 'Jóvenes Talentos',
        description: 'Grupo para jóvenes con potencial competitivo',
        schedule: 'Martes y Viernes 18:00-19:30',
        max_students: 6,
        current_students: 4,
        level: 'intermediate',
        active: true,
        room: 'Sala de Competición',
        instructor_notes: 'Enfoque en táctica avanzada y preparación psicológica',
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Encontrar el centro
    const currentSchool = mockSchools.find(s => s.id === schoolId);
    if (!currentSchool) {
      throw new Error('School not found');
    }

    // Obtener clases del centro
    const schoolClasses = mockClasses.filter(c => c.school_id === schoolId);
    const activeClasses = schoolClasses.filter(c => c.active);
    const inactiveClasses = schoolClasses.filter(c => !c.active);

    // Calcular estadísticas
    const totalStudents = schoolClasses.reduce((sum, c) => sum + c.current_students, 0);
    const totalCapacity = schoolClasses.reduce((sum, c) => sum + c.max_students, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

    const levelCounts = {
      beginner: schoolClasses.filter(c => c.level === 'beginner' && c.active).length,
      intermediate: schoolClasses.filter(c => c.level === 'intermediate' && c.active).length,
      advanced: schoolClasses.filter(c => c.level === 'advanced' && c.active).length,
      mixed: schoolClasses.filter(c => c.level === 'mixed' && c.active).length
    };

    const stats = {
      totalClasses: schoolClasses.length,
      activeClasses: activeClasses.length,
      inactiveClasses: inactiveClasses.length,
      totalStudents,
      totalCapacity,
      occupancyRate,
      levels: levelCounts,
      averageClassSize: activeClasses.length > 0 ? Math.round(totalStudents / activeClasses.length) : 0
    };
    
    return {
      user: locals.user,
      school: currentSchool,
      classes: schoolClasses,
      stats
    };
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: School detail page - Fetching from Supabase');
  
  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options),
    },
  });

  try {
    // Obtener el colegio específico
    const { data: school, error: schoolError } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', params.schoolId)
      .eq('user_id', locals.user.id)
      .single();

    if (schoolError) {
      console.error('❌ Error fetching school:', schoolError);
      throw error(404, 'Centro no encontrado');
    }

    if (!school) {
      throw error(404, 'Centro no encontrado');
    }

    // Obtener clases del colegio desde Supabase
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .eq('college_id', school.id)  // CORREGIDO: usar college_id en lugar de school_id
      .eq('user_id', locals.user.id)
      .order('created_at', { ascending: false });

    if (classesError) {
      console.error('❌ Error fetching classes:', classesError);
      // Si hay error, usar array vacío en lugar de mock
      const classes = [];
    }

    const schoolClasses = classes || [];

    // Calcular estadísticas - SOLO con campos que existen en la tabla classes
    const stats = {
      totalClasses: schoolClasses.length,
      activeClasses: schoolClasses.length, // Todas las clases están activas por defecto
      inactiveClasses: 0, // No hay campo active en la tabla
      totalStudents: 0, // No hay campo current_students en la tabla
      totalCapacity: schoolClasses.reduce((sum, c) => sum + (c.max_students || 0), 0),
      occupancyRate: 0, // No se puede calcular sin current_students
      levels: {
        beginner: schoolClasses.filter(c => c.level === 'beginner').length,
        intermediate: schoolClasses.filter(c => c.level === 'intermediate').length,
        advanced: schoolClasses.filter(c => c.level === 'advanced').length,
        mixed: 0 // No hay nivel mixed en el esquema
      },
      averageClassSize: 0 // No se puede calcular sin current_students
    };

    return {
      user: locals.user,
      school,
      classes: schoolClasses,
      stats
    };

  } catch (err: any) {
    console.error('❌ Error in school detail page:', err);
    if (err.status) {
      throw err; // Re-throw SvelteKit errors
    }
    throw error(500, 'Error interno del servidor');
  }
};