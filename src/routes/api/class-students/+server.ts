import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock data para desarrollo local - relación class_students
let mockClassStudents = [
  // Principiantes Mañana (mock-class-1) - 8 estudiantes
  { id: 'cs-1', class_id: 'mock-class-1', student_id: 'mock-student-1', owner_id: 'dev-user-123', enrolled_at: '2024-01-15T10:00:00Z', active: true },
  { id: 'cs-2', class_id: 'mock-class-1', student_id: 'mock-student-3', owner_id: 'dev-user-123', enrolled_at: '2024-01-20T10:00:00Z', active: true },
  { id: 'cs-3', class_id: 'mock-class-1', student_id: 'mock-student-6', owner_id: 'dev-user-123', enrolled_at: '2024-02-01T10:00:00Z', active: true },
  
  // Intermedios Tarde (mock-class-2) - 7 estudiantes
  { id: 'cs-4', class_id: 'mock-class-2', student_id: 'mock-student-2', owner_id: 'dev-user-123', enrolled_at: '2024-01-10T17:00:00Z', active: true },
  { id: 'cs-5', class_id: 'mock-class-2', student_id: 'mock-student-5', owner_id: 'dev-user-123', enrolled_at: '2024-01-25T17:00:00Z', active: true },
  
  // Avanzados Fin de Semana (mock-class-3) - 5 estudiantes
  { id: 'cs-6', class_id: 'mock-class-3', student_id: 'mock-student-4', owner_id: 'dev-user-123', enrolled_at: '2024-01-05T09:00:00Z', active: true },
  
  // Pequeños Ajedrecistas (mock-class-4) - 6 estudiantes
  { id: 'cs-7', class_id: 'mock-class-4', student_id: 'mock-student-1', owner_id: 'dev-user-123', enrolled_at: '2024-02-10T16:00:00Z', active: true },
  { id: 'cs-8', class_id: 'mock-class-4', student_id: 'mock-student-3', owner_id: 'dev-user-123', enrolled_at: '2024-02-15T16:00:00Z', active: true },
  
  // Jóvenes Talentos (mock-class-5) - 4 estudiantes
  { id: 'cs-9', class_id: 'mock-class-5', student_id: 'mock-student-2', owner_id: 'dev-user-123', enrolled_at: '2024-02-05T18:00:00Z', active: true },
  { id: 'cs-10', class_id: 'mock-class-5', student_id: 'mock-student-4', owner_id: 'dev-user-123', enrolled_at: '2024-02-08T18:00:00Z', active: true }
];

export const GET: RequestHandler = async ({ url, cookies }) => {
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: API /api/class-students GET - Returning mock data');
    
    const classId = url.searchParams.get('class_id');
    const studentId = url.searchParams.get('student_id');
    
    let filteredData = mockClassStudents.filter(cs => cs.owner_id === 'dev-user-123');
    
    if (classId) {
      filteredData = filteredData.filter(cs => cs.class_id === classId);
    }
    
    if (studentId) {
      filteredData = filteredData.filter(cs => cs.student_id === studentId);
    }
    
    return json({ class_students: filteredData });
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: API /api/class-students GET - Fetching from Supabase');
  
  const { createServerClient } = await import('@supabase/ssr');
  const { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } = await import('$env/static/public');
  
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options),
    },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('❌ API /api/class-students GET - User not authenticated:', userError?.message);
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const classId = url.searchParams.get('class_id');
    const studentId = url.searchParams.get('student_id');
    
    let query = supabase
      .from('class_students')
      .select('*')
      .eq('owner_id', user.id);
    
    if (classId) {
      query = query.eq('class_id', classId);
    }
    
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    
    const { data: classStudents, error } = await query;
    
    if (error) {
      console.error('❌ API /api/class-students GET - Database error:', error);
      return json({ error: error.message }, { status: 400 });
    }
    
    console.log('✅ API /api/class-students GET - Retrieved class students:', classStudents?.length || 0);
    return json({ class_students: classStudents || [] });
    
  } catch (error: any) {
    console.error('❌ API /api/class-students GET - Error:', error.message);
    return json({ error: error.message }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, url, cookies }) => {
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: API /api/class-students POST - Creating mock enrollment');
    
    try {
      const body = await request.json();
      const { class_id, student_id } = body;
      
      if (!class_id || !student_id) {
        return json({ error: 'class_id and student_id are required' }, { status: 400 });
      }
      
      // Verificar si ya existe la inscripción
      const existingEnrollment = mockClassStudents.find(
        cs => cs.class_id === class_id && cs.student_id === student_id && cs.active
      );
      
      if (existingEnrollment) {
        return json({ error: 'Student is already enrolled in this class' }, { status: 409 });
      }
      
      // Crear nueva inscripción
      const newEnrollment = {
        id: `cs-${Date.now()}`,
        class_id,
        student_id,
        owner_id: 'dev-user-123',
        enrolled_at: new Date().toISOString(),
        active: true
      };
      
      mockClassStudents.push(newEnrollment);
      
      console.log('✅ DEV MODE: Student enrolled successfully:', newEnrollment);
      return json({ class_student: newEnrollment });
      
    } catch (error) {
      console.error('❌ Error in class-students POST:', error);
      return json({ error: 'Invalid request body' }, { status: 400 });
    }
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: API /api/class-students POST - Creating enrollment in Supabase');
  
  const { createServerClient } = await import('@supabase/ssr');
  const { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } = await import('$env/static/public');
  
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options),
    },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('❌ API /api/class-students POST - User not authenticated:', userError?.message);
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { class_id, student_id } = body;
    
    if (!class_id || !student_id) {
      return json({ error: 'class_id and student_id are required' }, { status: 400 });
    }

    // Verificar que la clase pertenece al usuario
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, user_id')
      .eq('id', class_id)
      .eq('user_id', user.id)
      .single();

    if (classError || !classData) {
      console.error('❌ API /api/class-students POST - Class not found or not owned by user:', classError);
      return json({ error: 'Class not found' }, { status: 404 });
    }

    // Verificar que el estudiante pertenece al usuario
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id, user_id')
      .eq('id', student_id)
      .eq('user_id', user.id)
      .single();

    if (studentError || !studentData) {
      console.error('❌ API /api/class-students POST - Student not found or not owned by user:', studentError);
      return json({ error: 'Student not found' }, { status: 404 });
    }

    // Verificar si ya existe la inscripción (sin columna active)
    const { data: existingEnrollment, error: existingError } = await supabase
      .from('class_students')
      .select('id')
      .eq('class_id', class_id)
      .eq('student_id', student_id)
      .eq('owner_id', user.id)
      .single();

    if (existingEnrollment) {
      return json({ error: 'Student is already enrolled in this class' }, { status: 409 });
    }

    // Crear nueva inscripción (sin columna active que no existe)
    const { data: newEnrollment, error: insertError } = await supabase
      .from('class_students')
      .insert({
        class_id,
        student_id,
        owner_id: user.id,
        enrolled_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ API /api/class-students POST - Database error:', insertError);
      return json({ error: insertError.message }, { status: 400 });
    }

    console.log('✅ API /api/class-students POST - Student enrolled successfully:', newEnrollment.id);
    return json({ class_student: newEnrollment });

  } catch (error: any) {
    console.error('❌ API /api/class-students POST - Error:', error.message);
    return json({ error: error.message }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url }) => {
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: API /api/class-students DELETE - Removing mock enrollment');
    
    const classId = url.searchParams.get('class_id');
    const studentId = url.searchParams.get('student_id');
    
    if (!classId || !studentId) {
      return json({ error: 'class_id and student_id are required' }, { status: 400 });
    }
    
    // Encontrar y desactivar la inscripción
    const enrollmentIndex = mockClassStudents.findIndex(
      cs => cs.class_id === classId && cs.student_id === studentId && cs.active
    );
    
    if (enrollmentIndex === -1) {
      return json({ error: 'Enrollment not found' }, { status: 404 });
    }
    
    // Marcar como inactiva en lugar de eliminar
    mockClassStudents[enrollmentIndex].active = false;
    
    console.log('✅ DEV MODE: Student unenrolled successfully');
    return json({ message: 'Student unenrolled successfully' });
  }
  
  return json({ error: 'Not implemented for production' }, { status: 501 });
};
