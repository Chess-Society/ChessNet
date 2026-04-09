// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
  console.log('📊 Reports page server load - User:', locals.user?.email || 'none');

  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  if (isLocalDev) {
    console.log('🔧 DEV MODE: Reports page - Providing centralized mock data');
    const { mockStudents, mockSchools, mockClasses, mockPayments } = await import('$lib/utils/mockData');

    // Generar reportes basados en los datos centralizados
    const mockStudentsReports = mockStudents.slice(0, 10).map(student => {
      const school = mockSchools.find(s => s.id === student.college_id);
      const studentClasses = mockClasses.filter(c => c.school_id === school?.id).slice(0, 2);
      const studentPayments = mockPayments.filter(p => p.student_id === student.id);

      return {
        student: {
          id: student.id,
          name: student.name,
          email: student.parent_email,
          phone: student.parent_phone,
          date_of_birth: student.date_of_birth,
          college_id: student.college_id,
          created_at: student.created_at
        },
        college: {
          id: school?.id || 'unknown',
          name: school?.name || 'Sin colegio'
        },
        classes: studentClasses.map(c => ({
          id: c.id,
          name: c.name,
          schedule: `${c.day_of_week} ${c.start_time}-${c.end_time}`
        })),
        progress_summary: {
          enrollment_date: student.created_at.split('T')[0],
          days_enrolled: Math.floor((Date.now() - new Date(student.created_at).getTime()) / (1000 * 60 * 60 * 24)),
          total_sessions: 20,
          attended_sessions: 15 + Math.floor(Math.random() * 5),
          late_sessions: Math.floor(Math.random() * 3),
          absent_sessions: Math.floor(Math.random() * 2),
          attendance_rate: 85 + Math.floor(Math.random() * 15),
          punctuality_rate: 90 + Math.floor(Math.random() * 10),
          skills_mastered: 5 + Math.floor(Math.random() * 10),
          skills_in_progress: Math.floor(Math.random() * 5),
          total_skills_assigned: 20,
          skill_completion_rate: 50 + Math.floor(Math.random() * 40),
          total_payments: studentPayments.length,
          paid_payments: studentPayments.filter(p => p.status === 'paid').length,
          pending_payments: studentPayments.filter(p => p.status === 'pending').length,
          overdue_payments: studentPayments.filter(p => p.status === 'overdue').length,
          payment_compliance: studentPayments.length > 0
            ? (studentPayments.filter(p => p.status === 'paid').length / studentPayments.length) * 100
            : 100,
          tournaments_participated: Math.floor(Math.random() * 3),
          tournament_wins: Math.floor(Math.random() * 5),
          tournament_draws: Math.floor(Math.random() * 5),
          tournament_losses: Math.floor(Math.random() * 5),
          current_rating: 1200 + Math.floor(Math.random() * 400),
          rating_change: Math.floor(Math.random() * 100) - 50,
          last_activity_date: new Date().toISOString().split('T')[0]
        },
        recent_activity: [
          {
            date: new Date().toISOString().split('T')[0],
            type: 'attendance',
            description: 'Asistió a clase',
            status: 'positive'
          },
          {
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            type: 'skill',
            description: 'Completó ejercicio táctico',
            status: 'positive'
          }
        ]
      };
    });

    // Estadísticas generales
    const generalStats = {
      total_students: mockStudentsReports.length,
      active_students: mockStudentsReports.filter(s =>
        new Date(s.progress_summary.last_activity_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      average_attendance_rate: mockStudentsReports.reduce((sum, s) => sum + s.progress_summary.attendance_rate, 0) / mockStudentsReports.length,
      average_skill_completion: mockStudentsReports.reduce((sum, s) => sum + s.progress_summary.skill_completion_rate, 0) / mockStudentsReports.length,
      students_with_overdue_payments: mockStudentsReports.filter(s => s.progress_summary.overdue_payments > 0).length,
      tournament_participants: mockStudentsReports.filter(s => s.progress_summary.tournaments_participated > 0).length
    };

    return {
      user: locals.user,
      studentsReports: mockStudentsReports,
      generalStats
    };
  }

  return {
    user: locals.user,
    studentsReports: [],
    generalStats: {}
  };
};
