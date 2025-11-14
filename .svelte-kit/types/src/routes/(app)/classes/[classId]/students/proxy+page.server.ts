// @ts-nocheck
import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ locals, url, params, cookies }: Parameters<PageServerLoad>[0]) => {
  console.log('👥 Class students page server load - User:', locals.user?.email || 'none');
  console.log('👥 Class ID:', params.classId);
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Class students page - Providing mock data');
    
    const classId = params.classId;
    
    // Mock de clases
    const mockClasses = [
      {
        id: 'mock-class-1',
        name: 'Principiantes Mañana',
        description: 'Grupo de iniciación para niños de 6-9 años',
        schedule: 'Lunes y Miércoles 10:00-11:00',
        max_students: 12,
        school_id: 'mock-school-1',
        level: 'beginner',
        room: 'Aula 1'
      },
      {
        id: 'mock-class-2',
        name: 'Intermedios Tarde',
        description: 'Grupo intermedio para estudiantes con conocimientos básicos',
        schedule: 'Martes y Jueves 17:00-18:30',
        max_students: 10,
        school_id: 'mock-school-1',
        level: 'intermediate',
        room: 'Aula 2'
      },
      {
        id: 'mock-class-3',
        name: 'Avanzados Fin de Semana',
        description: 'Grupo avanzado para preparación de torneos',
        schedule: 'Sábados 09:00-11:00',
        max_students: 8,
        school_id: 'mock-school-1',
        level: 'advanced',
        room: 'Sala Principal'
      }
    ];

    // Mock de estudiantes
    const mockStudents = [
      {
        id: 'mock-student-1',
        first_name: 'Ana',
        last_name: 'García López',
        email: 'ana.garcia@email.com',
        date_of_birth: '2010-03-15',
        chess_level: 'beginner',
        active: true
      },
      {
        id: 'mock-student-2',
        first_name: 'Carlos',
        last_name: 'Rodríguez Martín',
        email: 'carlos.rodriguez@email.com',
        date_of_birth: '2008-07-22',
        chess_level: 'intermediate',
        active: true
      },
      {
        id: 'mock-student-3',
        first_name: 'Lucía',
        last_name: 'Fernández Silva',
        email: 'lucia.fernandez@email.com',
        date_of_birth: '2012-11-08',
        chess_level: 'beginner',
        active: true
      },
      {
        id: 'mock-student-4',
        first_name: 'Miguel',
        last_name: 'Sánchez Torres',
        email: 'miguel.sanchez@email.com',
        date_of_birth: '2009-01-30',
        chess_level: 'advanced',
        active: true
      },
      {
        id: 'mock-student-5',
        first_name: 'Elena',
        last_name: 'Moreno Ruiz',
        email: 'elena.moreno@email.com',
        date_of_birth: '2011-05-12',
        chess_level: 'intermediate',
        active: true
      },
      {
        id: 'mock-student-6',
        first_name: 'David',
        last_name: 'López Jiménez',
        email: 'david.lopez@email.com',
        date_of_birth: '2013-09-03',
        chess_level: 'beginner',
        active: false
      }
    ];

    // Mock de inscripciones
    const mockEnrollments = [
      // Principiantes Mañana (mock-class-1)
      { id: 'cs-1', class_id: 'mock-class-1', student_id: 'mock-student-1', enrolled_at: '2024-01-15T10:00:00Z', active: true },
      { id: 'cs-2', class_id: 'mock-class-1', student_id: 'mock-student-3', enrolled_at: '2024-01-20T10:00:00Z', active: true },
      { id: 'cs-3', class_id: 'mock-class-1', student_id: 'mock-student-6', enrolled_at: '2024-02-01T10:00:00Z', active: true },
      
      // Intermedios Tarde (mock-class-2)
      { id: 'cs-4', class_id: 'mock-class-2', student_id: 'mock-student-2', enrolled_at: '2024-01-10T17:00:00Z', active: true },
      { id: 'cs-5', class_id: 'mock-class-2', student_id: 'mock-student-5', enrolled_at: '2024-01-25T17:00:00Z', active: true },
      
      // Avanzados Fin de Semana (mock-class-3)
      { id: 'cs-6', class_id: 'mock-class-3', student_id: 'mock-student-4', enrolled_at: '2024-01-05T09:00:00Z', active: true }
    ];

    // Encontrar la clase
    const currentClass = mockClasses.find(c => c.id === classId);
    if (!currentClass) {
      throw new Error('Class not found');
    }

    // Obtener estudiantes inscritos en esta clase
    const classEnrollments = mockEnrollments.filter(e => e.class_id === classId && e.active);
    const enrolledStudentIds = classEnrollments.map(e => e.student_id);
    const enrolledStudents = mockStudents
      .filter(s => enrolledStudentIds.includes(s.id))
      .map(student => ({
        ...student,
        enrolled_at: classEnrollments.find(e => e.student_id === student.id)?.enrolled_at
      }));

    // Obtener estudiantes disponibles para inscribir (activos y no inscritos)
    const availableStudents = mockStudents.filter(s => 
      s.active && !enrolledStudentIds.includes(s.id)
    );

    const stats = {
      enrolled: enrolledStudents.length,
      available: currentClass.max_students - enrolledStudents.length,
      capacity: currentClass.max_students,
      occupancyRate: Math.round((enrolledStudents.length / currentClass.max_students) * 100)
    };
    
    return {
      user: locals.user,
      class: currentClass,
      enrolledStudents,
      availableStudents,
      stats
    };
  }
  
  // ===== PRODUCCIÓN: Cargar datos reales =====
  console.log('🌐 PRODUCTION MODE: Class students page - Fetching data from Supabase');
  
  if (!locals.user) {
    console.log('❌ No user found, redirecting to login');
    return {
      user: null,
      class: null,
      enrolledStudents: [],
      availableStudents: [],
      stats: { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 }
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
    const classId = params.classId;
    
    // Obtener la clase
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .eq('user_id', locals.user.id)
      .single();
    
    if (classError || !classData) {
      console.error('❌ Error fetching class:', classError);
      return {
        user: locals.user,
        class: null,
        enrolledStudents: [],
        availableStudents: [],
        stats: { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 }
      };
    }
    
    // Obtener estudiantes inscritos en esta clase
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('class_students')
      .select(`
        *,
        students (
          id,
          first_name,
          last_name,
          email,
          date_of_birth,
          chess_level,
          active
        )
      `)
      .eq('class_id', classId)
      .eq('active', true);
    
    if (enrollmentsError) {
      console.error('❌ Error fetching enrollments:', enrollmentsError);
    }
    
    const enrolledStudents = enrollments?.map(enrollment => ({
      ...enrollment.students,
      enrolled_at: enrollment.enrolled_at
    })) || [];
    
    // Obtener estudiantes disponibles (activos y no inscritos)
    const enrolledStudentIds = enrolledStudents.map(s => s.id);
    const { data: availableStudents, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', locals.user.id)
      .eq('active', true)
      .not('id', 'in', `(${enrolledStudentIds.join(',')})`);
    
    if (studentsError) {
      console.error('❌ Error fetching available students:', studentsError);
    }
    
    const stats = {
      enrolled: enrolledStudents.length,
      available: Math.max(0, classData.max_students - enrolledStudents.length),
      capacity: classData.max_students,
      occupancyRate: Math.round((enrolledStudents.length / classData.max_students) * 100)
    };
    
    console.log('✅ Class students data loaded successfully');
    return {
      user: locals.user,
      class: classData,
      enrolledStudents,
      availableStudents: availableStudents || [],
      stats
    };
  } catch (err: any) {
    console.error('❌ Error in class students page load:', err);
    return {
      user: locals.user,
      class: null,
      enrolledStudents: [],
      availableStudents: [],
      stats: { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 }
    };
  }
};
