import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
  console.log('💰 Create payment page server load - User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Create payment page - Providing mock data');
    
    // Mock de estudiantes disponibles
    const mockStudents = [
      {
        id: 'mock-student-1',
        name: 'Ana García Martín',
        email: 'ana.garcia@email.com',
        college_id: 'mock-college-1'
      },
      {
        id: 'mock-student-2',
        name: 'Carlos López Silva',
        email: 'carlos.lopez@email.com',
        college_id: 'mock-college-1'
      },
      {
        id: 'mock-student-3',
        name: 'María Rodríguez Pérez',
        email: 'maria.rodriguez@email.com',
        college_id: 'mock-college-2'
      },
      {
        id: 'mock-student-4',
        name: 'David González Torres',
        email: 'david.gonzalez@email.com',
        college_id: 'mock-college-2'
      }
    ];

    // Mock de centros disponibles
    const mockSchools = [
      {
        id: 'mock-college-1',
        name: 'Escuela de Ajedrez Madrid Centro',
        city: 'Madrid'
      },
      {
        id: 'mock-college-2',
        name: 'Club de Ajedrez Barcelona',
        city: 'Barcelona'
      }
    ];

    // Mock de clases disponibles
    const mockClasses = [
      {
        id: 'mock-class-1',
        name: 'Principiantes Mañana',
        schedule: 'Lunes y Miércoles 10:00-11:00',
        price: 45.00,
        college_id: 'mock-college-1'
      },
      {
        id: 'mock-class-2',
        name: 'Intermedios Tarde',
        schedule: 'Martes y Jueves 17:00-18:00',
        price: 55.00,
        college_id: 'mock-college-1'
      },
      {
        id: 'mock-class-3',
        name: 'Avanzados Sábados',
        schedule: 'Sábados 09:00-11:00',
        price: 75.00,
        college_id: 'mock-college-2'
      }
    ];

    return {
      user: locals.user,
      students: mockStudents,
      schools: mockSchools,
      classes: mockClasses
    };
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: Create payment page - Fetching data from Supabase');
  
  if (!locals.user) {
    return {
      user: null,
      students: [],
      schools: [],
      classes: []
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
    // Obtener estudiantes
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, first_name, last_name, email, college_id')
      .eq('user_id', locals.user.id)
      .order('first_name', { ascending: true });

    if (studentsError) {
      console.error('❌ Error fetching students:', studentsError);
    }

    // Obtener centros
    const { data: schools, error: schoolsError } = await supabase
      .from('colleges')
      .select('id, name, city')
      .eq('user_id', locals.user.id)
      .order('name', { ascending: true });

    if (schoolsError) {
      console.error('❌ Error fetching schools:', schoolsError);
    }

    // Obtener clases
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('id, name, schedule, price, school_id')
      .eq('user_id', locals.user.id)
      .eq('active', true)
      .order('name', { ascending: true });

    if (classesError) {
      console.error('❌ Error fetching classes:', classesError);
    }

    return {
      user: locals.user,
      students: students || [],
      schools: schools || [],
      classes: classes || []
    };

  } catch (error: any) {
    console.error('❌ Error in create payment page:', error);
    return {
      user: locals.user,
      students: [],
      schools: [],
      classes: []
    };
  }
};
