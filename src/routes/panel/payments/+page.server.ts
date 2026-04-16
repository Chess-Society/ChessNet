import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const { locals, url } = event;
  
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const uid = locals.user.uid;
  const isMock = uid === 'chessnet-dev-uid';

  // Modo desarrollo local o mock: devolver datos simulados
  if (isMock || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    const { mockPayments, mockStudents, mockSchools } = await import('$lib/utils/mockData');

    const enrichedPayments = mockPayments.map((p: any) => {
      const student = mockStudents.find((s: any) => s.id === p.student_id);
      const school = mockSchools.find((s: any) => s.id === p.school_id);
      return {
        ...p,
        student: student ? { id: student.id, name: student.name, email: student.parent_email } : null,
        school: school ? { id: school.id, name: school.name, city: school.city } : null
      };
    });

    const paymentStats = {
      total_revenue_this_month: enrichedPayments
        .filter((p: any) => p.status === 'paid')
        .reduce((sum: number, p: any) => sum + p.amount, 0),
      total_revenue_last_month: 980.00,
      pending_payments_count: enrichedPayments.filter((p: any) => p.status === 'pending').length,
      overdue_payments_count: enrichedPayments.filter((p: any) => p.status === 'overdue').length,
      overdue_amount: enrichedPayments
        .filter((p: any) => p.status === 'overdue')
        .reduce((sum: number, p: any) => sum + p.amount, 0),
      average_payment_amount: enrichedPayments.length > 0
        ? enrichedPayments.reduce((sum: number, p: any) => sum + p.amount, 0) / enrichedPayments.length
        : 0,
      revenue_growth_percentage: 15
    };

    return {
      user: locals.user,
      payments: enrichedPayments,
      paymentStats,
      studentSummaries: [],
      schoolSummaries: []
    };
  }

  try {
    const [studentsSnap, paymentsSnap, schoolsSnap] = await Promise.all([
      adminDb.collection('students').where('owner_id', '==', uid).get(),
      adminDb.collection('payments').where('owner_id', '==', uid).orderBy('created_at', 'desc').get(),
      adminDb.collection('schools').where('owner_id', '==', uid).get()
    ]);

    const payments = serializeRecord(paymentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
    
    const paidPayments = (payments as any[]).filter((p: any) => p.status === 'paid');
    const paymentStats = {
      total_revenue_this_month: paidPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      total_revenue_last_month: 0,
      pending_payments_count: (payments as any[]).filter((p: any) => p.status === 'pending').length,
      overdue_payments_count: (payments as any[]).filter((p: any) => p.status === 'overdue').length,
      overdue_amount: (payments as any[]).filter((p: any) => p.status === 'overdue').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      average_payment_amount: (payments as any[]).length > 0
        ? (payments as any[]).reduce((sum: number, p: any) => sum + (p.amount || 0), 0) / (payments as any[]).length
        : 0,
      revenue_growth_percentage: 0
    };

    return {
      user: locals.user,
      payments,
      paymentStats,
      studentSummaries: [],
      schoolSummaries: []
    };

  } catch (err: any) {
    console.error('❌ Error in payments page load:', err);
    return {
      user: locals.user,
      payments: [],
      paymentStats: {},
      studentSummaries: [],
      schoolSummaries: []
    };
  }
};
