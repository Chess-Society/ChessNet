// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
  console.log('💰 Payments page server load - User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Payments page - Providing mock data');
    
    // Mock de pagos recientes
    const mockPayments = [
      // Pagos de estudiantes individuales
      {
        id: 'pay-001',
        user_id: 'dev-user-123',
        payment_type: 'student',
        student_id: 'mock-student-1',
        school_id: null,
        class_id: 'mock-class-1',
        amount: 45.00,
        currency: 'EUR',
        concept: 'monthly_fee',
        description: 'Mensualidad enero 2024 - Principiantes Mañana',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        status: 'paid',
        due_date: '2024-01-05',
        paid_date: '2024-01-03T10:30:00Z',
        payment_method: 'transfer',
        payment_reference: 'TRANS-240103-001',
        invoice_number: 'INV-2024-001',
        invoice_date: '2024-01-03',
        notes: 'Pago puntual',
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-1',
          name: 'Ana García Martín',
          email: 'ana.garcia@email.com'
        },
        class: {
          id: 'mock-class-1',
          name: 'Principiantes Mañana'
        }
      },
      {
        id: 'pay-002',
        user_id: 'dev-user-123',
        payment_type: 'student',
        student_id: 'mock-student-2',
        school_id: null,
        class_id: 'mock-class-1',
        amount: 45.00,
        currency: 'EUR',
        concept: 'monthly_fee',
        description: 'Mensualidad febrero 2024 - Principiantes Mañana',
        period_start: '2024-02-01',
        period_end: '2024-02-29',
        status: 'overdue',
        due_date: '2024-02-05',
        paid_date: null,
        payment_method: null,
        payment_reference: null,
        invoice_number: 'INV-2024-002',
        invoice_date: '2024-02-01',
        notes: 'Recordar cobro',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-2',
          name: 'Carlos López Silva',
          email: 'carlos.lopez@email.com'
        },
        class: {
          id: 'mock-class-1',
          name: 'Principiantes Mañana'
        }
      },
      // Pago de centro completo
      {
        id: 'pay-003',
        user_id: 'dev-user-123',
        payment_type: 'school',
        student_id: null,
        school_id: 'mock-school-1',
        class_id: null,
        amount: 1200.00,
        currency: 'EUR',
        concept: 'monthly_fee',
        description: 'Servicios enero 2024 - Escuela de Ajedrez Madrid Centro',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        status: 'paid',
        due_date: '2024-01-15',
        paid_date: '2024-01-12T14:20:00Z',
        payment_method: 'transfer',
        payment_reference: 'TRANS-240112-SCHOOL',
        invoice_number: 'INV-2024-003',
        invoice_date: '2024-01-12',
        notes: 'Pago mensual completo del centro',
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        school: {
          id: 'mock-school-1',
          name: 'Escuela de Ajedrez Madrid Centro',
          city: 'Madrid'
        }
      },
      {
        id: 'pay-004',
        user_id: 'dev-user-123',
        payment_type: 'student',
        student_id: 'mock-student-3',
        school_id: null,
        class_id: 'mock-class-2',
        amount: 55.00,
        currency: 'EUR',
        concept: 'monthly_fee',
        description: 'Mensualidad febrero 2024 - Intermedios Tarde',
        period_start: '2024-02-01',
        period_end: '2024-02-29',
        status: 'pending',
        due_date: '2024-02-10',
        paid_date: null,
        payment_method: null,
        payment_reference: null,
        invoice_number: 'INV-2024-004',
        invoice_date: '2024-02-01',
        notes: null,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-3',
          name: 'María Rodríguez Pérez',
          email: 'maria.rodriguez@email.com'
        },
        class: {
          id: 'mock-class-2',
          name: 'Intermedios Tarde'
        }
      },
      {
        id: 'pay-005',
        user_id: 'dev-user-123',
        payment_type: 'student',
        student_id: 'mock-student-4',
        school_id: null,
        class_id: 'mock-class-2',
        amount: 25.00,
        currency: 'EUR',
        concept: 'material',
        description: 'Libro de ajedrez y tablero',
        period_start: null,
        period_end: null,
        status: 'paid',
        due_date: '2024-01-20',
        paid_date: '2024-01-18T16:45:00Z',
        payment_method: 'cash',
        payment_reference: 'CASH-240118',
        invoice_number: 'INV-2024-005',
        invoice_date: '2024-01-18',
        notes: 'Material educativo',
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        student: {
          id: 'mock-student-4',
          name: 'David González Torres',
          email: 'david.gonzalez@email.com'
        },
        class: {
          id: 'mock-class-2',
          name: 'Intermedios Tarde'
        }
      }
    ];

    // Calcular estadísticas
    const paymentStats = {
      total_revenue_this_month: mockPayments
        .filter(p => p.status === 'paid' && new Date(p.paid_date || p.created_at).getMonth() === new Date().getMonth())
        .reduce((sum, p) => sum + p.amount, 0),
      
      total_revenue_last_month: 980.00, // Mock del mes pasado
      
      pending_payments_count: mockPayments.filter(p => p.status === 'pending').length,
      
      overdue_payments_count: mockPayments.filter(p => p.status === 'overdue').length,
      
      overdue_amount: mockPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0),
      
      average_payment_amount: mockPayments.length > 0 
        ? mockPayments.reduce((sum, p) => sum + p.amount, 0) / mockPayments.length 
        : 0
    };

    // Calcular crecimiento
    const revenue_growth_percentage = paymentStats.total_revenue_last_month > 0
      ? Math.round(((paymentStats.total_revenue_this_month - paymentStats.total_revenue_last_month) / paymentStats.total_revenue_last_month) * 100)
      : 0;

    // Resumen por estudiantes
    const studentSummaries = [
      {
        student_id: 'mock-student-1',
        student_name: 'Ana García Martín',
        total_amount: 135.00, // 3 meses
        paid_amount: 135.00,
        pending_amount: 0,
        overdue_amount: 0,
        total_payments: 3,
        paid_payments: 3,
        pending_payments: 0,
        overdue_payments: 0,
        last_payment_date: '2024-01-03',
        next_due_date: '2024-03-05'
      },
      {
        student_id: 'mock-student-2',
        student_name: 'Carlos López Silva',
        total_amount: 90.00, // 2 meses
        paid_amount: 45.00,
        pending_amount: 0,
        overdue_amount: 45.00,
        total_payments: 2,
        paid_payments: 1,
        pending_payments: 0,
        overdue_payments: 1,
        last_payment_date: '2024-01-05',
        next_due_date: '2024-02-05' // Vencido
      },
      {
        student_id: 'mock-student-3',
        student_name: 'María Rodríguez Pérez',
        total_amount: 110.00, // 2 meses
        paid_amount: 55.00,
        pending_amount: 55.00,
        overdue_amount: 0,
        total_payments: 2,
        paid_payments: 1,
        pending_payments: 1,
        overdue_payments: 0,
        last_payment_date: '2024-01-10',
        next_due_date: '2024-02-10'
      }
    ];

    // Resumen por centros
    const schoolSummaries = [
      {
        school_id: 'mock-school-1',
        school_name: 'Escuela de Ajedrez Madrid Centro',
        total_amount: 2400.00, // 2 meses
        paid_amount: 1200.00,
        pending_amount: 1200.00,
        overdue_amount: 0,
        total_payments: 2,
        paid_payments: 1,
        pending_payments: 1,
        overdue_payments: 0,
        last_payment_date: '2024-01-12',
        next_due_date: '2024-02-15'
      }
    ];

    return {
      user: locals.user,
      payments: mockPayments,
      paymentStats: { ...paymentStats, revenue_growth_percentage },
      studentSummaries,
      schoolSummaries
    };
  }
  
  return {
    user: locals.user,
    payments: [],
    paymentStats: {},
    studentSummaries: [],
    schoolSummaries: []
  };
};
