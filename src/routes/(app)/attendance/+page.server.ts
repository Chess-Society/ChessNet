import type { PageServerLoad } from './$types';
import { schoolsApi } from '$lib/api/schools';
import { studentsApi } from '$lib/api/students';
import { classesApi } from '$lib/api/classes';
import { attendanceApi } from '$lib/api/attendance';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('📊 Attendance Dashboard - User:', locals.user?.email || 'none');

  if (!locals.user) {
    return {
      user: null,
      attendanceData: {
        todayStats: { totalClasses: 0, classesWithAttendance: 0, totalStudents: 0, presentStudents: 0, absentStudents: 0, attendanceRate: 0 },
        centersWithClasses: [],
        recentAttendance: [],
        upcomingClasses: []
      }
    };
  }

  try {
    const userId = locals.user.id;
    // Obtener centros y estudiantes del usuario desde Firebase API
    const [schools, allStudents] = await Promise.all([
      schoolsApi.getMySchools(userId),
      studentsApi.getMyStudents(userId)
    ]);

    // Obtener todas las clases de todos los centros
    const allSchoolsWithClasses = await Promise.all(schools.map(async (school: any) => {
      const classes = await classesApi.getClassesBySchool(school.id, userId);
      const schoolStudents = allStudents.filter(s => s.college_id === school.id);

      return {
        id: school.id,
        name: school.name,
        city: school.city,
        totalClasses: classes.length,
        classesToday: 0, // Simplificación: lógica de calendario no implementada aún
        totalStudents: schoolStudents.length,
        attendanceRate: 0,
        nextClass: null,
        classes: classes.map(c => ({
          id: c.id,
          name: c.name,
          time: (c as any).schedule || 'Sin horario',
          students: 0,
          present: 0,
          absent: 0,
          attendanceRate: 0,
          attendanceTaken: false,
          lastAttendance: null
        }))
      };
    }));

    const attendanceData = {
      todayStats: {
        totalClasses: allSchoolsWithClasses.reduce((sum, s) => sum + s.totalClasses, 0),
        classesWithAttendance: 0,
        totalStudents: allStudents.length,
        presentStudents: 0,
        absentStudents: 0,
        attendanceRate: 0
      },
      centersWithClasses: allSchoolsWithClasses,
      recentAttendance: [],
      upcomingClasses: []
    };

    return {
      user: locals.user,
      attendanceData
    };

  } catch (err: any) {
    console.error('❌ Error loading attendance data:', err);
    return {
      user: locals.user,
      attendanceData: {
        todayStats: { totalClasses: 0, classesWithAttendance: 0, totalStudents: 0, presentStudents: 0, absentStudents: 0, attendanceRate: 0 },
        centersWithClasses: [],
        recentAttendance: [],
        upcomingClasses: []
      }
    };
  }
};
