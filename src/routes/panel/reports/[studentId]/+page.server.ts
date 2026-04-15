import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const { studentId } = params;

  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  if (isLocalDev) {

    // Importar datos centralizados
    const { mockStudents, mockSchools, mockClasses, mockPayments } = await import('$lib/utils/mockData');

    // Buscar el estudiante
    const student = mockStudents.find(s => s.id === studentId);

    if (!student) {
      console.error(`Mock student not found: ${studentId}`);
      // Fallback para IDs que no coinciden exactamente (por si acaso) o error
      throw new Error(`Student not found: ${studentId}`);
    }

    const school = mockSchools.find(s => s.id === student.school_id);
    const studentClasses = mockClasses.filter(c => c.school_id === school?.id).slice(0, 2); // Simular clases
    const studentPayments = mockPayments.filter(p => p.student_id === student.id);

    // Generar datos detallados dinámicos
    const report = {
      student: {
        id: student.id,
        name: student.name,
        email: student.parent_email,
        phone: student.parent_phone,
        date_of_birth: student.date_of_birth || '2015-01-01',
        school_id: student.school_id,
        emergency_contact: 'Contacto de Emergencia',
        emergency_phone: student.parent_phone,
        medical_notes: null,
        instructor_notes: student.notes || 'Estudiante con buen progreso general.',
        created_at: student.created_at
      },
      school: {
        id: school?.id || 'unknown',
        name: school?.name || 'Sin colegio',
        city: school?.city || 'Ciudad'
      },
      classes: studentClasses.map(c => ({
        id: c.id,
        name: c.name,
        schedule: `${c.day_of_week} ${c.start_time}-${c.end_time}`,
        price: 45.00,
        start_date: '2024-01-10',
        end_date: '2024-06-30'
      })),
      progress_summary: {
        enrollment_date: student.created_at.split('T')[0],
        days_enrolled: Math.floor((Date.now() - new Date(student.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        total_sessions: 20,
        attended_sessions: 15,
        late_sessions: 2,
        absent_sessions: 3,
        attendance_rate: 75,
        punctuality_rate: 90,
        skills_mastered: 4,
        skills_in_progress: 3,
        total_skills_assigned: 10,
        skill_completion_rate: 40,
        total_payments: studentPayments.length,
        paid_payments: studentPayments.filter(p => p.status === 'paid').length,
        pending_payments: studentPayments.filter(p => p.status === 'pending').length,
        overdue_payments: studentPayments.filter(p => p.status === 'overdue').length,
        payment_compliance: studentPayments.length > 0
          ? (studentPayments.filter(p => p.status === 'paid').length / studentPayments.length) * 100
          : 0,
        tournaments_participated: 1,
        tournament_wins: 2,
        tournament_draws: 1,
        tournament_losses: 2,
        current_rating: 1200,
        initial_rating: 1200,
        rating_change: 0,
        highest_rating: 1220,
        lowest_rating: 1180,
        last_activity_date: new Date().toISOString()
      },
      attendance_history: [
        { date: '2024-02-01', class_id: 'mock-class-1', status: 'P', notes: null },
        { date: '2024-02-08', class_id: 'mock-class-1', status: 'P', notes: null },
        { date: '2024-02-15', class_id: 'mock-class-1', status: 'T', notes: 'Retraso leve' }
      ],
      skills_progress: [
        {
          skill_id: 'skill-1',
          skill_name: 'Movimiento de Piezas',
          category: 'Fundamentos',
          status: 'completed',
          level: 5,
          max_level: 5,
          completion_date: '2024-01-20',
          notes: 'Dominado'
        },
        {
          skill_id: 'skill-2',
          skill_name: 'Jaque Mate Básico',
          category: 'Táctica',
          status: 'in_progress',
          level: 3,
          max_level: 5,
          completion_date: null,
          notes: 'Practicando'
        }
      ],
      payment_history: studentPayments.map(p => ({
        id: p.id,
        amount: p.amount,
        concept: p.concept,
        description: p.concept,
        due_date: p.date,
        paid_date: p.status === 'paid' ? p.date : null,
        status: p.status,
        payment_method: p.payment_method,
        payment_reference: `REF-${p.id.substring(0, 6)}`
      })),
      tournament_history: [],
      rating_history: [
        { date: '2024-01-01', rating: 1200, change: 0, event: 'Inicio' }
      ],
      activity_timeline: [
        {
          date: new Date().toISOString(),
          type: 'attendance',
          title: 'Registro reciente',
          description: 'Actividad generada automáticamente',
          status: 'neutral',
          details: null
        }
      ]
    };

    return {
      user: locals.user,
      studentId,
      report
    };
  }

  return {
    user: locals.user,
    studentId,
    report: null
  };
};
