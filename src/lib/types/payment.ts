import type { Student, School, Class } from './school';

export type PaymentType = 'student' | 'school';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type PaymentConcept = 'monthly_fee' | 'registration' | 'tournament' | 'material' | 'private_lesson' | 'other';
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'paypal' | 'bizum' | 'other';

export interface Payment {
  id: string;
  owner_id: string;
  paymentType: PaymentType;
  studentId?: string;
  schoolId?: string;
  classId?: string;
  amount: number;
  currency: string;
  concept: PaymentConcept;
  description?: string;
  periodStart?: string;
  periodEnd?: string;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentWithDetails extends Payment {
  student?: Student;
  school?: School;
  class?: Class;
}

export interface PaymentSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  overduePayments: number;
}

export interface StudentPaymentSummary extends PaymentSummary {
  studentId: string;
  studentName: string;
  lastPaymentDate?: string;
  nextDueDate?: string;
}

export interface SchoolPaymentSummary extends PaymentSummary {
  schoolId: string;
  schoolName: string;
  lastPaymentDate?: string;
  nextDueDate?: string;
}

export interface MonthlyRevenue {
  month: string; // YYYY-MM
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  studentPayments: number;
  schoolPayments: number;
  paymentCount: number;
}

export interface PaymentFilters {
  paymentType?: PaymentType;
  status?: PaymentStatus;
  concept?: PaymentConcept;
  studentId?: string;
  schoolId?: string;
  classId?: string;
  dateFrom?: string;
  dateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

export interface CreatePaymentData {
  paymentType: PaymentType;
  studentId?: string;
  schoolId?: string;
  classId?: string;
  amount: number;
  currency?: string;
  concept: PaymentConcept;
  description?: string;
  periodStart?: string;
  periodEnd?: string;
  status?: PaymentStatus;
  dueDate: string;
  paymentMethod?: string;
  paymentReference?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  notes?: string;
}

export interface PaymentStats {
  totalRevenueThisMonth: number;
  totalRevenueLastMonth: number;
  revenueGrowthPercentage: number;
  pendingPaymentsCount: number;
  overduePaymentsCount: number;
  overdueAmount: number;
  averagePaymentAmount: number;
  topPayingStudents: StudentPaymentSummary[];
  topPayingSchools: SchoolPaymentSummary[];
  monthlyRevenueTrend: MonthlyRevenue[];
}
