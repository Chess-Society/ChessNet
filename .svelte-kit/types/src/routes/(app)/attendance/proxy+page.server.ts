// @ts-nocheck
import type { PageServerLoad } from './$types';
import { schoolsServerApi } from '$lib/api/schools-server';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
  console.log('📊 Attendance Dashboard - User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Attendance Dashboard - Using mock data');
    
    // Mock data para desarrollo local
    const mockAttendanceData = {
      todayStats: {
        totalClasses: 8,
        classesWithAttendance: 5,
        totalStudents: 45,
        presentStudents: 38,
        absentStudents: 7,
        attendanceRate: 84.4
      },
      centersWithClasses: [
        {
          id: 'mock-school-1',
          name: 'Centro de Desarrollo Local',
          city: 'Madrid',
          totalClasses: 3,
          classesToday: 2,
          totalStudents: 20,
          attendanceRate: 85.0,
          nextClass: '2024-01-15T10:00:00Z',
          classes: [
            {
              id: 'mock-class-1',
              name: 'Principiantes Mañana',
              time: '10:00',
              students: 12,
              present: 10,
              absent: 2,
              attendanceRate: 83.3,
              attendanceTaken: true,
              lastAttendance: '2024-01-15T10:15:00Z'
            },
            {
              id: 'mock-class-2',
              name: 'Intermedios Tarde',
              time: '16:00',
              students: 8,
              present: 7,
              absent: 1,
              attendanceRate: 87.5,
              attendanceTaken: true,
              lastAttendance: '2024-01-15T16:10:00Z'
            }
          ]
        }
      ],
      recentAttendance: [
        {
          id: 'att-1',
          className: 'Principiantes Mañana',
          centerName: 'Centro de Desarrollo Local',
          date: '2024-01-15T10:15:00Z',
          students: 12,
          present: 10,
          absent: 2,
          attendanceRate: 83.3
        },
        {
          id: 'att-2',
          className: 'Intermedios Tarde',
          centerName: 'Centro de Desarrollo Local',
          date: '2024-01-15T16:10:00Z',
          students: 8,
          present: 7,
          absent: 1,
          attendanceRate: 87.5
        }
      ],
      upcomingClasses: [
        {
          id: 'mock-class-3',
          name: 'Avanzados Noche',
          centerName: 'Centro de Desarrollo Local',
          time: '19:00',
          students: 15,
          attendanceTaken: false
        }
      ]
    };
    
    return {
      user: locals.user,
      attendanceData: mockAttendanceData
    };
  }
  
  // ===== LÓGICA NORMAL PARA PRODUCCIÓN =====
  try {
    // Obtener centros del usuario
    const schools = await schoolsServerApi.getMySchools(locals.cookies);
    
    // Aquí iría la lógica para obtener datos de asistencia reales
    // Por ahora, devolvemos datos básicos
    const attendanceData = {
      todayStats: {
        totalClasses: 0,
        classesWithAttendance: 0,
        totalStudents: 0,
        presentStudents: 0,
        absentStudents: 0,
        attendanceRate: 0
      },
      centersWithClasses: schools.map(school => ({
        id: school.id,
        name: school.name,
        city: school.city,
        totalClasses: 0,
        classesToday: 0,
        totalStudents: 0,
        attendanceRate: 0,
        nextClass: null,
        classes: []
      })),
      recentAttendance: [],
      upcomingClasses: []
    };
    
    return {
      user: locals.user,
      attendanceData
    };
    
  } catch (error) {
    console.error('❌ Error loading attendance data:', error);
    return {
      user: locals.user,
      attendanceData: {
        todayStats: {
          totalClasses: 0,
          classesWithAttendance: 0,
          totalStudents: 0,
          presentStudents: 0,
          absentStudents: 0,
          attendanceRate: 0
        },
        centersWithClasses: [],
        recentAttendance: [],
        upcomingClasses: []
      }
    };
  }
};
