import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  console.log('📊 Reports page server load - User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Reports page - Providing mock data');
    
    // Mock de estudiantes con datos de progreso
    const mockStudentsReports = [
      {
        student: {
          id: 'mock-student-1',
          name: 'Ana García Martín',
          email: 'ana.garcia@email.com',
          phone: '+34 666 111 222',
          date_of_birth: '2010-05-15',
          college_id: 'mock-college-1',
          created_at: '2024-01-15T00:00:00Z'
        },
        college: {
          id: 'mock-college-1',
          name: 'Escuela de Ajedrez Madrid Centro'
        },
        classes: [
          {
            id: 'mock-class-1',
            name: 'Principiantes Mañana',
            schedule: 'Lunes y Miércoles 10:00-11:00'
          }
        ],
        progress_summary: {
          enrollment_date: '2024-01-15',
          days_enrolled: 28,
          total_sessions: 16,
          attended_sessions: 14,
          late_sessions: 1,
          absent_sessions: 1,
          attendance_rate: 87.5,
          punctuality_rate: 92.8,
          skills_mastered: 8,
          skills_in_progress: 4,
          total_skills_assigned: 12,
          skill_completion_rate: 66.7,
          total_payments: 2,
          paid_payments: 2,
          pending_payments: 0,
          overdue_payments: 0,
          payment_compliance: 100,
          tournaments_participated: 1,
          tournament_wins: 0,
          tournament_draws: 2,
          tournament_losses: 3,
          current_rating: 1250,
          rating_change: 50,
          last_activity_date: '2024-02-10'
        },
        recent_activity: [
          {
            date: '2024-02-10',
            type: 'attendance',
            description: 'Asistió a clase Principiantes Mañana',
            status: 'positive'
          },
          {
            date: '2024-02-08',
            type: 'skill',
            description: 'Completó skill: Movimientos básicos del peón',
            status: 'positive'
          },
          {
            date: '2024-02-05',
            type: 'payment',
            description: 'Pago mensual febrero - Completado',
            status: 'positive'
          },
          {
            date: '2024-02-03',
            type: 'tournament',
            description: 'Participó en Torneo Principiantes (3 partidas)',
            status: 'neutral'
          }
        ]
      },
      {
        student: {
          id: 'mock-student-2',
          name: 'Carlos López Silva',
          email: 'carlos.lopez@email.com',
          phone: '+34 666 222 333',
          date_of_birth: '2011-03-20',
          college_id: 'mock-college-1',
          created_at: '2024-01-10T00:00:00Z'
        },
        college: {
          id: 'mock-college-1',
          name: 'Escuela de Ajedrez Madrid Centro'
        },
        classes: [
          {
            id: 'mock-class-1',
            name: 'Principiantes Mañana',
            schedule: 'Lunes y Miércoles 10:00-11:00'
          }
        ],
        progress_summary: {
          enrollment_date: '2024-01-10',
          days_enrolled: 33,
          total_sessions: 18,
          attended_sessions: 15,
          late_sessions: 3,
          absent_sessions: 0,
          attendance_rate: 83.3,
          punctuality_rate: 80.0,
          skills_mastered: 6,
          skills_in_progress: 3,
          total_skills_assigned: 12,
          skill_completion_rate: 50.0,
          total_payments: 2,
          paid_payments: 1,
          pending_payments: 0,
          overdue_payments: 1,
          payment_compliance: 50,
          tournaments_participated: 0,
          tournament_wins: 0,
          tournament_draws: 0,
          tournament_losses: 0,
          current_rating: 1180,
          rating_change: -20,
          last_activity_date: '2024-02-08'
        },
        recent_activity: [
          {
            date: '2024-02-08',
            type: 'attendance',
            description: 'Llegó tarde a clase Principiantes Mañana',
            status: 'warning'
          },
          {
            date: '2024-02-05',
            type: 'payment',
            description: 'Pago mensual febrero - Vencido',
            status: 'negative'
          },
          {
            date: '2024-02-01',
            type: 'skill',
            description: 'Inició skill: Táctica básica',
            status: 'neutral'
          }
        ]
      },
      {
        student: {
          id: 'mock-student-3',
          name: 'María Rodríguez Pérez',
          email: 'maria.rodriguez@email.com',
          phone: '+34 666 333 444',
          date_of_birth: '2009-08-12',
          college_id: 'mock-college-2',
          created_at: '2024-01-20T00:00:00Z'
        },
        college: {
          id: 'mock-college-2',
          name: 'Club de Ajedrez Barcelona'
        },
        classes: [
          {
            id: 'mock-class-3',
            name: 'Avanzados Sábados',
            schedule: 'Sábados 09:00-11:00'
          }
        ],
        progress_summary: {
          enrollment_date: '2024-01-20',
          days_enrolled: 23,
          total_sessions: 8,
          attended_sessions: 8,
          late_sessions: 0,
          absent_sessions: 0,
          attendance_rate: 100,
          punctuality_rate: 100,
          skills_mastered: 12,
          skills_in_progress: 2,
          total_skills_assigned: 15,
          skill_completion_rate: 80.0,
          total_payments: 2,
          paid_payments: 2,
          pending_payments: 0,
          overdue_payments: 0,
          payment_compliance: 100,
          tournaments_participated: 2,
          tournament_wins: 4,
          tournament_draws: 3,
          tournament_losses: 1,
          current_rating: 1480,
          rating_change: 180,
          last_activity_date: '2024-02-10'
        },
        recent_activity: [
          {
            date: '2024-02-10',
            type: 'attendance',
            description: 'Asistió a clase Avanzados Sábados',
            status: 'positive'
          },
          {
            date: '2024-02-09',
            type: 'skill',
            description: 'Completó skill: Finales de torres',
            status: 'positive'
          },
          {
            date: '2024-02-07',
            type: 'tournament',
            description: 'Ganó partida en Torneo Regional',
            status: 'positive'
          },
          {
            date: '2024-02-05',
            type: 'payment',
            description: 'Pago mensual febrero - Completado',
            status: 'positive'
          }
        ]
      }
    ];

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
