// @ts-nocheck
import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ locals, url, params, cookies }: Parameters<PageServerLoad>[0]) => {
  console.log('📊 Class attendance page server load - User:', locals.user?.email || 'none');
  console.log('📊 Class ID:', params.classId);
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Class attendance page - Providing mock data');
    
    const classId = params.classId;
    
    // Mock de clases
    const mockClasses = [
      {
        id: 'mock-class-1',
        user_id: 'dev-user-123',
        school_id: 'mock-school-1',
        name: 'Principiantes Mañana',
        description: 'Grupo de iniciación para niños de 6-9 años',
        schedule: 'Lunes y Miércoles 10:00-11:00',
        max_students: 12,
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
        level: 'intermediate',
        active: true,
        room: 'Aula 2',
        instructor_notes: 'Trabajan bien las tácticas, empezar con estrategia básica',
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Mock de estudiantes inscritos en las clases
    const mockClassStudents = [
      // Estudiantes en mock-class-1 (Principiantes Mañana)
      {
        id: 'cs-001',
        owner_id: 'dev-user-123',
        class_id: 'mock-class-1',
        student_id: 'mock-student-1',
        enrolled_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-1',
          user_id: 'dev-user-123',
          name: 'Ana García Martín',
          age: 8,
          level: 'beginner',
          email: 'ana.garcia@email.com',
          phone: '+34 666 111 111',
          emergency_contact: 'Madre: Carmen Martín (+34 666 111 112)',
          school_id: 'mock-school-1',
          active: true,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'cs-002',
        owner_id: 'dev-user-123',
        class_id: 'mock-class-1',
        student_id: 'mock-student-2',
        enrolled_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-2',
          user_id: 'dev-user-123',
          name: 'Carlos López Silva',
          age: 7,
          level: 'beginner',
          email: 'carlos.lopez@email.com',
          phone: '+34 666 222 222',
          emergency_contact: 'Padre: José López (+34 666 222 223)',
          school_id: 'mock-school-1',
          active: true,
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'cs-003',
        owner_id: 'dev-user-123',
        class_id: 'mock-class-1',
        student_id: 'mock-student-3',
        enrolled_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-3',
          user_id: 'dev-user-123',
          name: 'María Rodríguez Pérez',
          age: 9,
          level: 'beginner',
          email: 'maria.rodriguez@email.com',
          phone: '+34 666 333 333',
          emergency_contact: 'Madre: Isabel Pérez (+34 666 333 334)',
          school_id: 'mock-school-1',
          active: true,
          created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      // Estudiantes en mock-class-2 (Intermedios Tarde)
      {
        id: 'cs-004',
        owner_id: 'dev-user-123',
        class_id: 'mock-class-2',
        student_id: 'mock-student-4',
        enrolled_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-4',
          user_id: 'dev-user-123',
          name: 'David González Torres',
          age: 12,
          level: 'intermediate',
          email: 'david.gonzalez@email.com',
          phone: '+34 666 444 444',
          emergency_contact: 'Padre: Miguel González (+34 666 444 445)',
          school_id: 'mock-school-1',
          active: true,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'cs-005',
        owner_id: 'dev-user-123',
        class_id: 'mock-class-2',
        student_id: 'mock-student-5',
        enrolled_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-5',
          user_id: 'dev-user-123',
          name: 'Elena Fernández Ruiz',
          age: 11,
          level: 'intermediate',
          email: 'elena.fernandez@email.com',
          phone: '+34 666 555 555',
          emergency_contact: 'Madre: Rosa Ruiz (+34 666 555 556)',
          school_id: 'mock-school-1',
          active: true,
          created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ];

    // Encontrar la clase
    const currentClass = mockClasses.find(c => c.id === classId);
    if (!currentClass) {
      console.log('❌ Class not found in mock data:', classId);
      return {
        user: locals.user,
        class: null,
        students: [],
        recentAttendance: [],
        attendanceStats: { total_sessions: 0, average_attendance_rate: 0, average_punctuality_rate: 0, most_attended_date: '', least_attended_date: '', last_session_date: '', next_session_date: '' }
      };
    }

    // Obtener estudiantes inscritos en la clase
    const enrolledStudents = mockClassStudents
      .filter(cs => cs.class_id === classId && cs.status === 'active')
      .map(cs => cs.student);

    // Mock de asistencia reciente (últimas 5 sesiones)
    const recentAttendance = [
      // Sesión del 2024-01-15 (Lunes)
      {
        date: '2024-01-15',
        records: [
          { student_id: 'mock-student-1', student_name: 'Ana García Martín', status: 'P', notes: null },
          { student_id: 'mock-student-2', student_name: 'Carlos López Silva', status: 'T', notes: 'Llegó 10 min tarde' },
          { student_id: 'mock-student-3', student_name: 'María Rodríguez Pérez', status: 'A', notes: 'Enfermo' }
        ]
      },
      // Sesión del 2024-01-17 (Miércoles)
      {
        date: '2024-01-17',
        records: [
          { student_id: 'mock-student-1', student_name: 'Ana García Martín', status: 'P', notes: null },
          { student_id: 'mock-student-2', student_name: 'Carlos López Silva', status: 'P', notes: null },
          { student_id: 'mock-student-3', student_name: 'María Rodríguez Pérez', status: 'P', notes: 'Ya recuperado' }
        ]
      },
      // Sesión del 2024-01-22 (Lunes)
      {
        date: '2024-01-22',
        records: [
          { student_id: 'mock-student-1', student_name: 'Ana García Martín', status: 'P', notes: null },
          { student_id: 'mock-student-2', student_name: 'Carlos López Silva', status: 'P', notes: null },
          { student_id: 'mock-student-3', student_name: 'María Rodríguez Pérez', status: 'T', notes: 'Llegó tarde del dentista' }
        ]
      }
    ];

    // Estadísticas de asistencia por estudiante
    const attendanceStats = enrolledStudents.map(student => {
      const studentRecords = recentAttendance.flatMap(session => 
        session.records.filter(record => record.student_id === student.id)
      );
      
      const totalSessions = studentRecords.length;
      const presentCount = studentRecords.filter(r => r.status === 'P').length;
      const lateCount = studentRecords.filter(r => r.status === 'T').length;
      const absentCount = studentRecords.filter(r => r.status === 'A').length;
      
      const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 0;
      const punctualityRate = (presentCount + lateCount) > 0 ? Math.round((presentCount / (presentCount + lateCount)) * 100) : 0;

      return {
        student_id: student.id,
        student_name: student.name,
        total_sessions: totalSessions,
        present_count: presentCount,
        late_count: lateCount,
        absent_count: absentCount,
        attendance_rate: attendanceRate,
        punctuality_rate: punctualityRate,
        last_attendance_date: studentRecords.length > 0 ? recentAttendance[recentAttendance.length - 1].date : undefined
      };
    });

    return {
      user: locals.user,
      class: currentClass,
      students: enrolledStudents,
      recentAttendance: recentAttendance,
      attendanceStats: attendanceStats
    };
  }
  
  // ===== PRODUCCIÓN: Cargar datos reales =====
  console.log('🌐 PRODUCTION MODE: Class attendance page - Fetching data from Supabase');
  
  if (!locals.user) {
    console.log('❌ No user found, redirecting to login');
    return {
      user: null,
      class: null,
      students: [],
      recentAttendance: [],
      attendanceStats: { total_sessions: 0, average_attendance_rate: 0, average_punctuality_rate: 0, most_attended_date: '', least_attended_date: '', last_session_date: '', next_session_date: '' }
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
        students: [],
        recentAttendance: [],
        attendanceStats: { total_sessions: 0, average_attendance_rate: 0, average_punctuality_rate: 0, most_attended_date: '', least_attended_date: '', last_session_date: '', next_session_date: '' }
      };
    }
    
    // Obtener estudiantes inscritos
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
    
    const students = enrollments?.map(enrollment => enrollment.students) || [];
    
    // Mock de datos de asistencia (por ahora)
    const recentAttendance = [];
    const attendanceStats = {
      total_sessions: 0,
      average_attendance_rate: 0,
      average_punctuality_rate: 0,
      most_attended_date: '',
      least_attended_date: '',
      last_session_date: '',
      next_session_date: ''
    };
    
    console.log('✅ Class attendance data loaded successfully');
    return {
      user: locals.user,
      class: classData,
      students,
      recentAttendance,
      attendanceStats
    };
  } catch (err: any) {
    console.error('❌ Error in class attendance page load:', err);
    return {
      user: locals.user,
      class: null,
      students: [],
      recentAttendance: [],
      attendanceStats: { total_sessions: 0, average_attendance_rate: 0, average_punctuality_rate: 0, most_attended_date: '', least_attended_date: '', last_session_date: '', next_session_date: '' }
    };
  }
};
