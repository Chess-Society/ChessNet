import { supabase } from '$lib/supabase';
import type { 
  Payment, 
  PaymentWithDetails, 
  PaymentFilters, 
  CreatePaymentData, 
  PaymentStats,
  StudentPaymentSummary,
  SchoolPaymentSummary,
  MonthlyRevenue
} from '$lib/types';

// ===== BYPASS PARA DESARROLLO LOCAL =====
const isLocalDev = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Mock data para desarrollo local
const mockPayments: PaymentWithDetails[] = [
  {
    id: 'pay-001',
    user_id: 'dev-user-123',
    payment_type: 'student',
    student_id: 'mock-student-1',
    school_id: undefined,
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
      user_id: 'dev-user-123',
      name: 'Ana García Martín',
      phone: '+34 666 111 222',
      college_id: 'mock-college-1',
      date_of_birth: '2010-05-15',
      emergency_contact: 'Madre: María Martín',
      emergency_phone: '+34 666 111 223',
      medical_notes: null,
      instructor_notes: 'Muy aplicada',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    class: {
      id: 'mock-class-1',
      user_id: 'dev-user-123',
      name: 'Principiantes Mañana',
      description: 'Clase para principiantes en horario matutino',
      college_id: 'mock-college-1',
      schedule: 'Lunes y Miércoles 10:00-11:00',
      max_students: 12,
      start_date: '2024-01-01',
      end_date: '2024-06-30',
      status: 'active',
      notes: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: 'pay-002',
    user_id: 'dev-user-123',
    payment_type: 'student',
    student_id: 'mock-student-2',
    school_id: undefined,
    class_id: 'mock-class-1',
    amount: 45.00,
    currency: 'EUR',
    concept: 'monthly_fee',
    description: 'Mensualidad febrero 2024 - Principiantes Mañana',
    period_start: '2024-02-01',
    period_end: '2024-02-29',
    status: 'overdue',
    due_date: '2024-02-05',
    paid_date: undefined,
    payment_method: undefined,
    payment_reference: undefined,
    invoice_number: 'INV-2024-002',
    invoice_date: '2024-02-01',
    notes: 'Recordar cobro',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    student: {
      id: 'mock-student-2',
      user_id: 'dev-user-123',
      name: 'Carlos López Silva',
      phone: '+34 666 222 333',
      college_id: 'mock-college-1',
      date_of_birth: '2011-03-20',
      emergency_contact: 'Padre: Juan López',
      emergency_phone: '+34 666 222 334',
      medical_notes: null,
      instructor_notes: 'Necesita más práctica',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    class: {
      id: 'mock-class-1',
      user_id: 'dev-user-123',
      name: 'Principiantes Mañana',
      description: 'Clase para principiantes en horario matutino',
      college_id: 'mock-college-1',
      schedule: 'Lunes y Miércoles 10:00-11:00',
      max_students: 12,
      start_date: '2024-01-01',
      end_date: '2024-06-30',
      status: 'active',
      notes: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
];

const mockStudentSummaries: StudentPaymentSummary[] = [
  {
    student_id: 'mock-student-1',
    student_name: 'Ana García Martín',
    total_amount: 135.00,
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
    total_amount: 90.00,
    paid_amount: 45.00,
    pending_amount: 0,
    overdue_amount: 45.00,
    total_payments: 2,
    paid_payments: 1,
    pending_payments: 0,
    overdue_payments: 1,
    last_payment_date: '2024-01-05',
    next_due_date: '2024-02-05'
  }
];

const mockSchoolSummaries: SchoolPaymentSummary[] = [
  {
    school_id: 'mock-school-1',
    school_name: 'Escuela de Ajedrez Madrid Centro',
    total_amount: 2400.00,
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

export const paymentsApi = {
  // Obtener todos los pagos con filtros
  async getPayments(filters?: PaymentFilters): Promise<PaymentWithDetails[]> {
    console.log('💰 Getting payments with filters:', filters);

    if (isLocalDev) {
      console.log('🔧 DEV MODE: Returning mock payments');
      return mockPayments;
    }

    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          student:students(*),
          school:colleges(*),
          class:classes(*)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters) {
        if (filters.payment_type) {
          query = query.eq('payment_type', filters.payment_type);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.concept) {
          query = query.eq('concept', filters.concept);
        }
        if (filters.student_id) {
          query = query.eq('student_id', filters.student_id);
        }
        if (filters.school_id) {
          query = query.eq('school_id', filters.school_id);
        }
        if (filters.class_id) {
          query = query.eq('class_id', filters.class_id);
        }
        if (filters.date_from) {
          query = query.gte('created_at', filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte('created_at', filters.date_to);
        }
        if (filters.due_date_from) {
          query = query.gte('due_date', filters.due_date_from);
        }
        if (filters.due_date_to) {
          query = query.lte('due_date', filters.due_date_to);
        }
        if (filters.amount_min) {
          query = query.gte('amount', filters.amount_min);
        }
        if (filters.amount_max) {
          query = query.lte('amount', filters.amount_max);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPayments:', error);
      throw error;
    }
  },

  // Obtener un pago específico
  async getPayment(paymentId: string): Promise<PaymentWithDetails | null> {
    console.log('💰 Getting payment:', paymentId);

    if (isLocalDev) {
      console.log('🔧 DEV MODE: Returning mock payment');
      return mockPayments.find(p => p.id === paymentId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(*),
          school:colleges(*),
          class:classes(*)
        `)
        .eq('id', paymentId)
        .single();

      if (error) {
        console.error('Error fetching payment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getPayment:', error);
      throw error;
    }
  },

  // Crear un nuevo pago
  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    console.log('💰 Creating payment:', paymentData);

    if (isLocalDev) {
      console.log('🔧 DEV MODE: Mock payment creation');
      const mockPayment: Payment = {
        id: `pay-${Date.now()}`,
        user_id: 'dev-user-123',
        ...paymentData,
        currency: 'EUR',
        status: 'pending',
        paid_date: undefined,
        payment_method: undefined,
        payment_reference: undefined,
        invoice_number: `INV-${Date.now()}`,
        invoice_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockPayment;
    }

    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createPayment:', error);
      throw error;
    }
  },

  // Actualizar un pago
  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<Payment> {
    console.log('💰 Updating payment:', paymentId, updates);

    if (isLocalDev) {
      console.log('🔧 DEV MODE: Mock payment update');
      const existingPayment = mockPayments.find(p => p.id === paymentId);
      if (!existingPayment) {
        throw new Error('Payment not found');
      }
      return {
        ...existingPayment,
        ...updates,
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updatePayment:', error);
      throw error;
    }
  },

  // Marcar pago como pagado
  async markAsPaid(paymentId: string, paymentMethod?: string, paymentReference?: string): Promise<Payment> {
    console.log('💰 Marking payment as paid:', paymentId);

    const updates: Partial<Payment> = {
      status: 'paid',
      paid_date: new Date().toISOString(),
      payment_method: paymentMethod || undefined,
      payment_reference: paymentReference || undefined
    };

    return this.updatePayment(paymentId, updates);
  },

  // Obtener estadísticas de pagos
  async getPaymentStats(): Promise<PaymentStats> {
    console.log('💰 Getting payment stats');

    if (isLocalDev) {
      console.log('🔧 DEV MODE: Returning mock payment stats');
      const currentMonth = new Date().getMonth();
      const thisMonthPayments = mockPayments.filter(p => 
        p.status === 'paid' && new Date(p.paid_date || p.created_at).getMonth() === currentMonth
      );
      
      const totalThisMonth = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalLastMonth = 980.00;
      const overduePay = mockPayments.filter(p => p.status === 'overdue');
      const pendingPay = mockPayments.filter(p => p.status === 'pending');
      
      return {
        total_revenue_this_month: totalThisMonth,
        total_revenue_last_month: totalLastMonth,
        revenue_growth_percentage: totalLastMonth > 0 
          ? Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100) 
          : 0,
        pending_payments_count: pendingPay.length,
        overdue_payments_count: overduePay.length,
        overdue_amount: overduePay.reduce((sum, p) => sum + p.amount, 0),
        average_payment_amount: mockPayments.length > 0 
          ? mockPayments.reduce((sum, p) => sum + p.amount, 0) / mockPayments.length 
          : 0,
        top_paying_students: mockStudentSummaries.slice(0, 5),
        top_paying_schools: mockSchoolSummaries.slice(0, 5),
        monthly_revenue_trend: [
          {
            month: '2024-01',
            total_revenue: 1200.00,
            paid_revenue: 1200.00,
            pending_revenue: 0,
            student_payments: 800.00,
            school_payments: 400.00,
            payment_count: 8
          },
          {
            month: '2024-02',
            total_revenue: totalThisMonth,
            paid_revenue: totalThisMonth,
            pending_revenue: pendingPay.reduce((sum, p) => sum + p.amount, 0),
            student_payments: thisMonthPayments.filter(p => p.payment_type === 'student').reduce((sum, p) => sum + p.amount, 0),
            school_payments: thisMonthPayments.filter(p => p.payment_type === 'school').reduce((sum, p) => sum + p.amount, 0),
            payment_count: thisMonthPayments.length
          }
        ]
      };
    }

    // Implementación real con Supabase (para producción)
    try {
      // Aquí iría la lógica real con queries complejas a Supabase
      // Por ahora devolvemos datos mock
      return {
        total_revenue_this_month: 0,
        total_revenue_last_month: 0,
        revenue_growth_percentage: 0,
        pending_payments_count: 0,
        overdue_payments_count: 0,
        overdue_amount: 0,
        average_payment_amount: 0,
        top_paying_students: [],
        top_paying_schools: [],
        monthly_revenue_trend: []
      };
    } catch (error) {
      console.error('Error in getPaymentStats:', error);
      throw error;
    }
  },

  // Obtener resúmenes por estudiante
  async getStudentPaymentSummaries(): Promise<StudentPaymentSummary[]> {
    console.log('💰 Getting student payment summaries');

    if (isLocalDev) {
      console.log('🔧 DEV MODE: Returning mock student summaries');
      return mockStudentSummaries;
    }

    // Implementación real (pendiente)
    return [];
  },

  // Obtener resúmenes por centro
  async getSchoolPaymentSummaries(): Promise<SchoolPaymentSummary[]> {
    console.log('💰 Getting school payment summaries');

    if (isLocalDev) {
      console.log('🔧 DEV MODE: Returning mock school summaries');
      return mockSchoolSummaries;
    }

    // Implementación real (pendiente)
    return [];
  },

  // Eliminar un pago
  async deletePayment(paymentId: string): Promise<void> {
    console.log('💰 Deleting payment:', paymentId);

    if (isLocalDev) {
      console.log('🔧 DEV MODE: Mock payment deletion');
      return;
    }

    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) {
        console.error('Error deleting payment:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deletePayment:', error);
      throw error;
    }
  }
};
