const load = async ({ params, locals, url }) => {
  const { studentId } = params;
  console.log("📊 Student report page server load - Student:", studentId, "User:", locals.user?.email || "none");
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Student report page - Providing mock data");
    const mockStudentReports = {
      "mock-student-1": {
        student: {
          id: "mock-student-1",
          name: "Ana García Martín",
          email: "ana.garcia@email.com",
          phone: "+34 666 111 222",
          date_of_birth: "2010-05-15",
          college_id: "mock-college-1",
          emergency_contact: "Madre: María Martín",
          emergency_phone: "+34 666 111 223",
          medical_notes: null,
          instructor_notes: "Estudiante muy aplicada y con gran potencial. Muestra especial interés en las tácticas.",
          created_at: "2024-01-15T00:00:00Z"
        },
        college: {
          id: "mock-college-1",
          name: "Escuela de Ajedrez Madrid Centro",
          city: "Madrid"
        },
        classes: [
          {
            id: "mock-class-1",
            name: "Principiantes Mañana",
            schedule: "Lunes y Miércoles 10:00-11:00",
            price: 45,
            start_date: "2024-01-15",
            end_date: "2024-06-30"
          }
        ],
        progress_summary: {
          enrollment_date: "2024-01-15",
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
          initial_rating: 1200,
          rating_change: 50,
          highest_rating: 1280,
          lowest_rating: 1180,
          last_activity_date: "2024-02-10"
        },
        attendance_history: [
          { date: "2024-01-15", class_id: "mock-class-1", status: "P", notes: "Primera clase" },
          { date: "2024-01-17", class_id: "mock-class-1", status: "P", notes: null },
          { date: "2024-01-22", class_id: "mock-class-1", status: "P", notes: null },
          { date: "2024-01-24", class_id: "mock-class-1", status: "T", notes: "Llegó 10 minutos tarde" },
          { date: "2024-01-29", class_id: "mock-class-1", status: "P", notes: null },
          { date: "2024-01-31", class_id: "mock-class-1", status: "P", notes: null },
          { date: "2024-02-05", class_id: "mock-class-1", status: "P", notes: null },
          { date: "2024-02-07", class_id: "mock-class-1", status: "A", notes: "Enfermedad justificada" },
          { date: "2024-02-12", class_id: "mock-class-1", status: "P", notes: null },
          { date: "2024-02-14", class_id: "mock-class-1", status: "P", notes: null }
        ],
        skills_progress: [
          {
            skill_id: "skill-1",
            skill_name: "Movimientos básicos del peón",
            category: "Fundamentos",
            status: "completed",
            level: 5,
            max_level: 5,
            completion_date: "2024-01-25",
            notes: "Domina completamente los movimientos básicos"
          },
          {
            skill_id: "skill-2",
            skill_name: "Movimientos de la torre",
            category: "Fundamentos",
            status: "completed",
            level: 5,
            max_level: 5,
            completion_date: "2024-01-30",
            notes: "Excelente comprensión"
          },
          {
            skill_id: "skill-3",
            skill_name: "Movimientos del alfil",
            category: "Fundamentos",
            status: "completed",
            level: 4,
            max_level: 5,
            completion_date: "2024-02-02",
            notes: "Necesita práctica en diagonales largas"
          },
          {
            skill_id: "skill-4",
            skill_name: "Táctica básica - Clavada",
            category: "Táctica",
            status: "in_progress",
            level: 3,
            max_level: 5,
            completion_date: null,
            notes: "Progreso constante, identificando patrones"
          },
          {
            skill_id: "skill-5",
            skill_name: "Táctica básica - Tenedor",
            category: "Táctica",
            status: "in_progress",
            level: 2,
            max_level: 5,
            completion_date: null,
            notes: "Iniciando el aprendizaje"
          },
          {
            skill_id: "skill-6",
            skill_name: "Finales básicos K+Q vs K",
            category: "Finales",
            status: "not_started",
            level: 0,
            max_level: 5,
            completion_date: null,
            notes: null
          }
        ],
        payment_history: [
          {
            id: "pay-001",
            amount: 45,
            concept: "monthly_fee",
            description: "Mensualidad enero 2024",
            due_date: "2024-01-05",
            paid_date: "2024-01-03T10:30:00Z",
            status: "paid",
            payment_method: "transfer",
            payment_reference: "TRANS-240103-001"
          },
          {
            id: "pay-002",
            amount: 45,
            concept: "monthly_fee",
            description: "Mensualidad febrero 2024",
            due_date: "2024-02-05",
            paid_date: "2024-02-02T14:20:00Z",
            status: "paid",
            payment_method: "cash",
            payment_reference: "CASH-240202"
          }
        ],
        tournament_history: [
          {
            id: "tournament-1",
            name: "Torneo Principiantes Enero",
            date: "2024-01-28",
            format: "swiss",
            rounds: 5,
            participants: 16,
            final_position: 8,
            points: 2.5,
            performance_rating: 1240,
            games: [
              { round: 1, opponent: "Carlos López", color: "white", result: "1-0", opponent_rating: 1180 },
              { round: 2, opponent: "María Santos", color: "black", result: "0-1", opponent_rating: 1320 },
              { round: 3, opponent: "Pedro Ruiz", color: "white", result: "½-½", opponent_rating: 1200 },
              { round: 4, opponent: "Laura Vega", color: "black", result: "½-½", opponent_rating: 1250 },
              { round: 5, opponent: "Diego Moreno", color: "white", result: "0-1", opponent_rating: 1300 }
            ]
          }
        ],
        rating_history: [
          { date: "2024-01-15", rating: 1200, change: 0, event: "Inscripción inicial" },
          { date: "2024-01-28", rating: 1240, change: 40, event: "Torneo Principiantes Enero" },
          { date: "2024-02-05", rating: 1250, change: 10, event: "Ajuste por progreso en clases" },
          { date: "2024-02-08", rating: 1280, change: 30, event: "Excelente rendimiento en práctica" },
          { date: "2024-02-10", rating: 1250, change: -30, event: "Ajuste tras evaluación" }
        ],
        activity_timeline: [
          {
            date: "2024-02-10",
            type: "attendance",
            title: "Asistió a clase",
            description: "Principiantes Mañana - Trabajó en táctica de clavada",
            status: "positive",
            details: { class: "Principiantes Mañana", duration: "60 min" }
          },
          {
            date: "2024-02-08",
            type: "skill",
            title: "Skill completada",
            description: "Movimientos básicos del peón - Nivel 5/5",
            status: "positive",
            details: { skill: "Movimientos básicos del peón", level: 5 }
          },
          {
            date: "2024-02-05",
            type: "payment",
            title: "Pago procesado",
            description: "Mensualidad febrero - €45.00",
            status: "positive",
            details: { amount: 45, method: "Efectivo" }
          },
          {
            date: "2024-02-02",
            type: "skill",
            title: "Progreso en skill",
            description: "Táctica básica - Clavada - Nivel 3/5",
            status: "neutral",
            details: { skill: "Táctica básica - Clavada", level: 3 }
          },
          {
            date: "2024-01-28",
            type: "tournament",
            title: "Participación en torneo",
            description: "Torneo Principiantes Enero - Posición 8/16",
            status: "neutral",
            details: { tournament: "Torneo Principiantes Enero", position: 8, points: 2.5 }
          }
        ]
      },
      "mock-student-2": {
        student: {
          id: "mock-student-2",
          name: "Carlos López Silva",
          email: "carlos.lopez@email.com",
          phone: "+34 666 222 333",
          date_of_birth: "2011-03-20",
          college_id: "mock-college-1",
          emergency_contact: "Padre: Juan López",
          emergency_phone: "+34 666 222 334",
          medical_notes: null,
          instructor_notes: "Necesita trabajar en la puntualidad y concentración. Tiene potencial pero se distrae fácilmente.",
          created_at: "2024-01-10T00:00:00Z"
        },
        college: {
          id: "mock-college-1",
          name: "Escuela de Ajedrez Madrid Centro",
          city: "Madrid"
        },
        classes: [
          {
            id: "mock-class-1",
            name: "Principiantes Mañana",
            schedule: "Lunes y Miércoles 10:00-11:00",
            price: 45,
            start_date: "2024-01-10",
            end_date: "2024-06-30"
          }
        ],
        progress_summary: {
          enrollment_date: "2024-01-10",
          days_enrolled: 33,
          total_sessions: 18,
          attended_sessions: 15,
          late_sessions: 3,
          absent_sessions: 0,
          attendance_rate: 83.3,
          punctuality_rate: 80,
          skills_mastered: 6,
          skills_in_progress: 3,
          total_skills_assigned: 12,
          skill_completion_rate: 50,
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
          initial_rating: 1200,
          rating_change: -20,
          highest_rating: 1220,
          lowest_rating: 1160,
          last_activity_date: "2024-02-08"
        },
        // ... más datos mock similares pero con peor rendimiento
        attendance_history: [
          { date: "2024-01-10", class_id: "mock-class-1", status: "P", notes: "Primera clase" },
          { date: "2024-01-12", class_id: "mock-class-1", status: "T", notes: "Llegó 15 minutos tarde" },
          { date: "2024-01-15", class_id: "mock-class-1", status: "P", notes: null },
          { date: "2024-01-17", class_id: "mock-class-1", status: "T", notes: "Llegó 20 minutos tarde" }
        ],
        skills_progress: [
          {
            skill_id: "skill-1",
            skill_name: "Movimientos básicos del peón",
            category: "Fundamentos",
            status: "completed",
            level: 4,
            max_level: 5,
            completion_date: "2024-02-01",
            notes: "Completado pero con algunas dudas"
          }
        ],
        payment_history: [
          {
            id: "pay-003",
            amount: 45,
            concept: "monthly_fee",
            description: "Mensualidad enero 2024",
            due_date: "2024-01-05",
            paid_date: "2024-01-08T16:30:00Z",
            status: "paid",
            payment_method: "transfer",
            payment_reference: "TRANS-240108-002"
          },
          {
            id: "pay-004",
            amount: 45,
            concept: "monthly_fee",
            description: "Mensualidad febrero 2024",
            due_date: "2024-02-05",
            paid_date: null,
            status: "overdue",
            payment_method: null,
            payment_reference: null
          }
        ],
        tournament_history: [],
        rating_history: [
          { date: "2024-01-10", rating: 1200, change: 0, event: "Inscripción inicial" },
          { date: "2024-01-25", rating: 1180, change: -20, event: "Ajuste por bajo rendimiento" }
        ],
        activity_timeline: [
          {
            date: "2024-02-08",
            type: "attendance",
            title: "Llegada tardía",
            description: "Principiantes Mañana - Llegó 15 minutos tarde",
            status: "warning",
            details: { class: "Principiantes Mañana", delay: "15 min" }
          },
          {
            date: "2024-02-05",
            type: "payment",
            title: "Pago vencido",
            description: "Mensualidad febrero - €45.00 - Vencido",
            status: "negative",
            details: { amount: 45, days_overdue: 3 }
          }
        ]
      }
    };
    const studentReport = mockStudentReports[studentId];
    if (!studentReport) {
      throw new Error(`Student not found: ${studentId}`);
    }
    return {
      user: locals.user,
      studentId,
      report: studentReport
    };
  }
  return {
    user: locals.user,
    studentId,
    report: null
  };
};
export {
  load
};
