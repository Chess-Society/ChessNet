import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  console.log('📊 Attendance API - GET request');

  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Attendance API - Providing mock data');
    
    const classId = url.searchParams.get('class_id');
    const studentId = url.searchParams.get('student_id');
    const date = url.searchParams.get('date');
    const dateFrom = url.searchParams.get('date_from');
    const dateTo = url.searchParams.get('date_to');

    // Mock attendance records
    const mockAttendance = [
      // Clase "Principiantes Mañana" - 2024-01-15
      {
        id: 'att-001',
        user_id: 'dev-user-123',
        student_id: 'mock-student-1',
        class_id: 'mock-class-1',
        date: '2024-01-15',
        status: 'P',
        notes: null,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        student: { id: 'mock-student-1', name: 'Ana García Martín', email: 'ana.garcia@email.com' },
        class: { id: 'mock-class-1', name: 'Principiantes Mañana', schedule: 'Lunes y Miércoles 10:00-11:00' }
      },
      {
        id: 'att-002',
        user_id: 'dev-user-123',
        student_id: 'mock-student-2',
        class_id: 'mock-class-1',
        date: '2024-01-15',
        status: 'T',
        notes: 'Llegó 10 minutos tarde',
        created_at: '2024-01-15T10:10:00Z',
        updated_at: '2024-01-15T10:10:00Z',
        student: { id: 'mock-student-2', name: 'Carlos López Silva', email: 'carlos.lopez@email.com' },
        class: { id: 'mock-class-1', name: 'Principiantes Mañana', schedule: 'Lunes y Miércoles 10:00-11:00' }
      },
      {
        id: 'att-003',
        user_id: 'dev-user-123',
        student_id: 'mock-student-3',
        class_id: 'mock-class-1',
        date: '2024-01-15',
        status: 'A',
        notes: 'Enfermo según madre',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        student: { id: 'mock-student-3', name: 'María Rodríguez Pérez', email: 'maria.rodriguez@email.com' },
        class: { id: 'mock-class-1', name: 'Principiantes Mañana', schedule: 'Lunes y Miércoles 10:00-11:00' }
      },
      // Clase "Principiantes Mañana" - 2024-01-17 (miércoles)
      {
        id: 'att-004',
        user_id: 'dev-user-123',
        student_id: 'mock-student-1',
        class_id: 'mock-class-1',
        date: '2024-01-17',
        status: 'P',
        notes: null,
        created_at: '2024-01-17T10:00:00Z',
        updated_at: '2024-01-17T10:00:00Z',
        student: { id: 'mock-student-1', name: 'Ana García Martín', email: 'ana.garcia@email.com' },
        class: { id: 'mock-class-1', name: 'Principiantes Mañana', schedule: 'Lunes y Miércoles 10:00-11:00' }
      },
      {
        id: 'att-005',
        user_id: 'dev-user-123',
        student_id: 'mock-student-2',
        class_id: 'mock-class-1',
        date: '2024-01-17',
        status: 'P',
        notes: null,
        created_at: '2024-01-17T10:00:00Z',
        updated_at: '2024-01-17T10:00:00Z',
        student: { id: 'mock-student-2', name: 'Carlos López Silva', email: 'carlos.lopez@email.com' },
        class: { id: 'mock-class-1', name: 'Principiantes Mañana', schedule: 'Lunes y Miércoles 10:00-11:00' }
      },
      {
        id: 'att-006',
        user_id: 'dev-user-123',
        student_id: 'mock-student-3',
        class_id: 'mock-class-1',
        date: '2024-01-17',
        status: 'P',
        notes: 'Ya recuperado',
        created_at: '2024-01-17T10:00:00Z',
        updated_at: '2024-01-17T10:00:00Z',
        student: { id: 'mock-student-3', name: 'María Rodríguez Pérez', email: 'maria.rodriguez@email.com' },
        class: { id: 'mock-class-1', name: 'Principiantes Mañana', schedule: 'Lunes y Miércoles 10:00-11:00' }
      },
      // Clase "Intermedios Tarde" - 2024-01-16
      {
        id: 'att-007',
        user_id: 'dev-user-123',
        student_id: 'mock-student-4',
        class_id: 'mock-class-2',
        date: '2024-01-16',
        status: 'P',
        notes: null,
        created_at: '2024-01-16T17:00:00Z',
        updated_at: '2024-01-16T17:00:00Z',
        student: { id: 'mock-student-4', name: 'David González Torres', email: 'david.gonzalez@email.com' },
        class: { id: 'mock-class-2', name: 'Intermedios Tarde', schedule: 'Martes y Jueves 17:00-18:30' }
      },
      {
        id: 'att-008',
        user_id: 'dev-user-123',
        student_id: 'mock-student-5',
        class_id: 'mock-class-2',
        date: '2024-01-16',
        status: 'P',
        notes: null,
        created_at: '2024-01-16T17:00:00Z',
        updated_at: '2024-01-16T17:00:00Z',
        student: { id: 'mock-student-5', name: 'Elena Fernández Ruiz', email: 'elena.fernandez@email.com' },
        class: { id: 'mock-class-2', name: 'Intermedios Tarde', schedule: 'Martes y Jueves 17:00-18:30' }
      }
    ];

    // Apply filters
    let filteredAttendance = mockAttendance;

    if (classId) {
      filteredAttendance = filteredAttendance.filter(att => att.class_id === classId);
    }

    if (studentId) {
      filteredAttendance = filteredAttendance.filter(att => att.student_id === studentId);
    }

    if (date) {
      filteredAttendance = filteredAttendance.filter(att => att.date === date);
    }

    if (dateFrom) {
      filteredAttendance = filteredAttendance.filter(att => att.date >= dateFrom);
    }

    if (dateTo) {
      filteredAttendance = filteredAttendance.filter(att => att.date <= dateTo);
    }

    return json({
      success: true,
      data: filteredAttendance,
      message: 'Mock attendance data retrieved successfully'
    });
  }

  return json({
    success: false,
    data: [],
    error: 'Attendance API not implemented for production yet'
  }, { status: 501 });
};

export const POST: RequestHandler = async ({ request, locals, url }) => {
  console.log('📊 Attendance API - POST request');

  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Attendance API - Mock attendance creation');
    
    try {
      const body = await request.json();
      console.log('📊 Mock attendance data:', body);

      // Simulate creating attendance record
      const mockAttendance = {
        id: `att-${Date.now()}`,
        user_id: 'dev-user-123',
        student_id: body.student_id,
        class_id: body.class_id,
        date: body.date,
        status: body.status,
        notes: body.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return json({
        success: true,
        data: mockAttendance,
        message: 'Mock attendance record created successfully'
      });
    } catch (error) {
      console.error('Error in mock attendance creation:', error);
      return json({
        success: false,
        error: 'Invalid request body'
      }, { status: 400 });
    }
  }

  return json({
    success: false,
    error: 'Attendance creation not implemented for production yet'
  }, { status: 501 });
};

export const PUT: RequestHandler = async ({ request, locals, url }) => {
  console.log('📊 Attendance API - PUT request (bulk update)');

  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Attendance API - Mock bulk attendance update');
    
    try {
      const body = await request.json();
      console.log('📊 Mock bulk attendance data:', body);

      // Simulate bulk attendance update
      const mockAttendanceRecords = (body.records || []).map((record: any, index: number) => ({
        id: `att-bulk-${Date.now()}-${index}`,
        user_id: 'dev-user-123',
        student_id: record.student_id,
        class_id: body.class_id,
        date: body.date,
        status: record.status,
        notes: record.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      return json({
        success: true,
        data: mockAttendanceRecords,
        message: `Mock bulk attendance updated for ${mockAttendanceRecords.length} students`
      });
    } catch (error) {
      console.error('Error in mock bulk attendance update:', error);
      return json({
        success: false,
        error: 'Invalid request body'
      }, { status: 400 });
    }
  }

  return json({
    success: false,
    error: 'Bulk attendance update not implemented for production yet'
  }, { status: 501 });
};
