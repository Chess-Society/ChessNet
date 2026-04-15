import type { Student, School, Class } from './school';

export type PaymentType = 'student' | 'school';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type PaymentConcept = 'monthly_fee' | 'registration' | 'tournament' | 'material' | 'private_lesson' | 'other';
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'paypal' | 'bizum' | 'other';

export interface Payment {
  id: string;
  owner_id: string;
  payment_type: PaymentType;
  student_id?: string;
  school_id?: string;
  class_id?: string;
  amount: number;
  currency: string;
  concept: PaymentConcept;
  description?: string;
  period_start?: string;
  period_end?: string;
  status: PaymentStatus;
  due_date: string;
  paid_date?: string;
  payment_method?: PaymentMethod;
  payment_reference?: string;
  invoice_number?: string;
  invoice_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentWithDetails extends Payment {
  student?: Student;
  school?: School;
  class?: Class;
}

export interface PaymentSummary {
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  total_payments: number;
  paid_payments: number;
  pending_payments: number;
  overdue_payments: number;
}

export interface StudentPaymentSummary extends PaymentSummary {
  student_id: string;
  student_name: string;
  last_payment_date?: string;
  next_due_date?: string;
}

export interface SchoolPaymentSummary extends PaymentSummary {
  school_id: string;
  school_name: string;
  last_payment_date?: string;
  next_due_date?: string;
}

export interface MonthlyRevenue {
  month: string; // YYYY-MM
  total_revenue: number;
  paid_revenue: number;
  pending_revenue: number;
  student_payments: number;
  school_payments: number;
  payment_count: number;
}

export interface PaymentFilters {
  payment_type?: PaymentType;
  status?: PaymentStatus;
  concept?: PaymentConcept;
  student_id?: string;
  school_id?: string;
  class_id?: string;
  date_from?: string;
  date_to?: string;
  due_date_from?: string;
  due_date_to?: string;
  amount_min?: number;
  amount_max?: number;
}

export interface CreatePaymentData {
  payment_type: PaymentType;
  student_id?: string;
  school_id?: string;
  class_id?: string;
  amount: number;
  currency?: string;
  concept: PaymentConcept;
  description?: string;
  period_start?: string;
  period_end?: string;
  status?: PaymentStatus;
  due_date: string;
  payment_method?: string;
  payment_reference?: string;
  invoice_number?: string;
  invoice_date?: string;
  notes?: string;
}

export interface PaymentStats {
  total_revenue_this_month: number;
  total_revenue_last_month: number;
  revenue_growth_percentage: number;
  pending_payments_count: number;
  overdue_payments_count: number;
  overdue_amount: number;
  average_payment_amount: number;
  top_paying_students: StudentPaymentSummary[];
  top_paying_schools: SchoolPaymentSummary[];
  monthly_revenue_trend: MonthlyRevenue[];
}
