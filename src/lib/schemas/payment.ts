import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.string().optional(),
  studentId: z.string().min(1, 'Entity is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paidDate: z.string().min(1, 'Date is required'),
  concept: z.enum(['monthly_fee', 'registration', 'tournament', 'material', 'other']).default('monthly_fee'),
  status: z.enum(['paid', 'pending', 'overdue']).default('paid'),
  paymentType: z.enum(['student', 'school']).default('student'),
  paymentMethod: z.enum(['transfer', 'cash', 'card']).default('transfer')
});

export type PaymentSchema = typeof paymentSchema;
