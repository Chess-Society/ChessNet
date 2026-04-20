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
