import type { PageServerLoad } from './$types';
import { paymentsApi } from '$lib/api/payments';
import { schoolsApi } from '$lib/api/schools';
import { studentsApi } from '$lib/api/students';
import { classesApi } from '$lib/api/classes';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
  console.log('💰 Payments page server load - User:', locals.user?.email || 'none');

  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  if (isLocalDev) {
    console.log('🔧 DEV MODE: Payments page - Providing centralized mock data');
    const { mockPayments, mockStudents, mockSchools } = await import('$lib/utils/mockData');

    // Enriquecer pagos con datos de estudiantes y escuelas
    const enrichedPayments = mockPayments.map(p => {
      const student = mockStudents.find(s => s.id === p.student_id);
      const school = mockSchools.find(s => s.id === p.school_id);
      return {
        ...p,
        student: student ? { id: student.id, name: student.name, email: student.parent_email } : null,
        school: school ? { id: school.id, name: school.name, city: school.city } : null
      };
    });

    // Calcular estadísticas
    const paymentStats = {
      total_revenue_this_month: enrichedPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0),

      total_revenue_last_month: 980.00, // Mock del mes pasado

      pending_payments_count: enrichedPayments.filter(p => p.status === 'pending').length,

      overdue_payments_count: enrichedPayments.filter(p => p.status === 'overdue').length,

      overdue_amount: enrichedPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0),

      average_payment_amount: enrichedPayments.length > 0
        ? enrichedPayments.reduce((sum, p) => sum + p.amount, 0) / enrichedPayments.length
        : 0
    };

    const revenue_growth_percentage = 15; // Mock

    // Resumen por estudiantes
    const studentSummaries = mockStudents.map(student => {
      const studentPayments = enrichedPayments.filter(p => p.student_id === student.id);
      return {
        student_id: student.id,
        student_name: student.name,
        total_amount: studentPayments.reduce((sum, p) => sum + p.amount, 0),
        paid_amount: studentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
        pending_amount: studentPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
        overdue_amount: studentPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
        total_payments: studentPayments.length,
        paid_payments: studentPayments.filter(p => p.status === 'paid').length,
        pending_payments: studentPayments.filter(p => p.status === 'pending').length,
        overdue_payments: studentPayments.filter(p => p.status === 'overdue').length,
        last_payment_date: new Date().toISOString(),
        next_due_date: new Date().toISOString()
      };
    }).filter(s => s.total_payments > 0);

    // Resumen por centros
    const schoolSummaries = mockSchools.map(school => {
      const schoolPayments = enrichedPayments.filter(p => p.school_id === school.id || (p.student && mockStudents.find(s => s.id === p.student_id)?.school_id === school.id));
      return {
        school_id: school.id,
        school_name: school.name,
        total_amount: schoolPayments.reduce((sum, p) => sum + p.amount, 0),
        paid_amount: schoolPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
        pending_amount: schoolPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
        overdue_amount: schoolPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
        total_payments: schoolPayments.length,
        paid_payments: schoolPayments.filter(p => p.status === 'paid').length,
        pending_payments: schoolPayments.filter(p => p.status === 'pending').length,
        overdue_payments: schoolPayments.filter(p => p.status === 'overdue').length,
        last_payment_date: new Date().toISOString(),
        next_due_date: new Date().toISOString()
      };
    }).filter(s => s.total_payments > 0);

    return {
      user: locals.user,
      payments: enrichedPayments,
      paymentStats: { ...paymentStats, revenue_growth_percentage },
      studentSummaries,
      schoolSummaries
    };
  }

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const userId = locals.user.id;
    // Obtener centros y estudiantes del usuario desde Firebase API
    const [schools, allStudents] = await Promise.all([
      schoolsApi.getMySchools(),
      studentsApi.getMyStudents()
    ]);

    // Obtener todas las clases de todos los centros
    const allSchoolsWithClasses = await Promise.all(schools.map(async (school) => {
      const classes = await classesApi.getClassesBySchool(school.id);
      return { ...school, classes };
    }));

    // Obtener pagos y estadísticas desde Firebase API
    const [payments, stats] = await Promise.all([
      paymentsApi.getPayments({}, userId),
      paymentsApi.getPaymentStats(userId)
    ]);

    return {
      user: locals.user,
      payments,
      paymentStats: stats,
      studentSummaries: [], // Implementar si es necesario para la UI
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
