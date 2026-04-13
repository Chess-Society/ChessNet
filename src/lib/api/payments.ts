import { db, auth, toData, getUserPath } from "$lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  limit,
  type DocumentData
} from "firebase/firestore";
import type { 
  Payment, 
  PaymentWithDetails, 
  PaymentFilters, 
  CreatePaymentData, 
  PaymentStats,
  StudentPaymentSummary,
  SchoolPaymentSummary,
  MonthlyRevenue,
  PaymentMethod
} from '$lib/types';

// Check if we are in development environment
const isLocalDev = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const paymentsApi = {
  // Obtener todos los pagos con filtros
  async getPayments(filters?: PaymentFilters, userId?: string): Promise<PaymentWithDetails[]> {
    const userPath = getUserPath(userId);

    try {
      let q = query(
        collection(db, userPath, "payments"),
        orderBy("created_at", "desc")
      );

      const querySnapshot = await getDocs(q);
      let payments = querySnapshot.docs.map(doc => toData<PaymentWithDetails>(doc));

      // Apply additional filters in memory if necessary
      if (filters) {
        if (filters.payment_type) payments = payments.filter(p => p.payment_type === filters.payment_type);
        if (filters.status) payments = payments.filter(p => p.status === filters.status);
        if (filters.concept) payments = payments.filter(p => p.concept === filters.concept);
        if (filters.student_id) payments = payments.filter(p => p.student_id === filters.student_id);
        if (filters.school_id) payments = payments.filter(p => p.school_id === filters.school_id);
        if (filters.class_id) payments = payments.filter(p => p.class_id === filters.class_id);
        if (filters.date_from) payments = payments.filter(p => p.created_at >= filters.date_from!);
        if (filters.date_to) payments = payments.filter(p => p.created_at <= filters.date_to!);
        if (filters.due_date_from) payments = payments.filter(p => p.due_date! >= filters.due_date_from!);
        if (filters.due_date_to) payments = payments.filter(p => p.due_date! <= filters.due_date_to!);
        if (filters.amount_min) payments = payments.filter(p => p.amount >= filters.amount_min!);
        if (filters.amount_max) payments = payments.filter(p => p.amount <= filters.amount_max!);
      }

      // Manual join for details
      for (const payment of payments) {
        if (payment.student_id) {
          const studentSnap = await getDoc(doc(db, userPath, "students", payment.student_id));
          if (studentSnap.exists()) payment.student = toData<any>(studentSnap);
        }
        if (payment.school_id) {
          const schoolSnap = await getDoc(doc(db, userPath, "colleges", payment.school_id));
          if (schoolSnap.exists()) payment.school = toData<any>(schoolSnap);
        }
        if (payment.class_id) {
          const classSnap = await getDoc(doc(db, userPath, "classes", payment.class_id));
          if (classSnap.exists()) payment.class = toData<any>(classSnap);
        }
      }

      return payments;
    } catch (error) {
      console.error('Error in getPayments:', error);
      throw error;
    }
  },

  // Obtener un pago específico
  async getPayment(paymentId: string): Promise<PaymentWithDetails | null> {
    const userPath = getUserPath();
    try {
      const docSnap = await getDoc(doc(db, userPath, "payments", paymentId));
      if (!docSnap.exists()) return null;

      const payment = toData<PaymentWithDetails>(docSnap);

      // Manual joins
      if (payment.student_id) {
        const studentSnap = await getDoc(doc(db, userPath, "students", payment.student_id));
        if (studentSnap.exists()) payment.student = toData<any>(studentSnap);
      }
      if (payment.school_id) {
        const schoolSnap = await getDoc(doc(db, userPath, "colleges", payment.school_id));
        if (schoolSnap.exists()) payment.school = toData<any>(schoolSnap);
      }
      if (payment.class_id) {
        const classSnap = await getDoc(doc(db, userPath, "classes", payment.class_id));
        if (classSnap.exists()) payment.class = toData<any>(classSnap);
      }

      return payment;
    } catch (error) {
      console.error('Error in getPayment:', error);
      throw error;
    }
  },

  // Crear un nuevo pago
  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    const userPath = getUserPath();

    try {
      const data = {
        ...paymentData,
        currency: 'EUR',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, userPath, "payments"), data);
      const docSnap = await getDoc(docRef);
      return toData<Payment>(docSnap);
    } catch (error) {
      console.error('Error in createPayment:', error);
      throw error;
    }
  },

  // Actualizar un pago
  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<Payment> {
    const userPath = getUserPath();
    try {
      const docRef = doc(db, userPath, "payments", paymentId);
      await updateDoc(docRef, {
        ...updates,
        updated_at: new Date().toISOString()
      });

      const docSnap = await getDoc(docRef);
      return toData<Payment>(docSnap);
    } catch (error) {
      console.error('Error in updatePayment:', error);
      throw error;
    }
  },

  // Marcar pago como pagado
  async markAsPaid(paymentId: string, paymentMethod?: PaymentMethod, paymentReference?: string): Promise<Payment> {
    const updates: Partial<Payment> = {
      status: 'paid',
      paid_date: new Date().toISOString(),
      payment_method: paymentMethod || undefined,
      payment_reference: paymentReference || undefined
    };

    return this.updatePayment(paymentId, updates);
  },

  // Obtener estadísticas de pagos
  async getPaymentStats(userId?: string): Promise<PaymentStats> {
    const userPath = getUserPath(userId);

    try {
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const q = query(
        collection(db, userPath, "payments")
      );
      const snapshot = await getDocs(q);
      const allPayments = snapshot.docs.map(doc => doc.data() as Payment);

      const thisMonthPayments = allPayments.filter(p => 
        p.status === 'paid' && p.paid_date && p.paid_date >= firstDayThisMonth
      );
      
      const totalThisMonth = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
      const overduePay = allPayments.filter(p => p.status === 'overdue');
      const pendingPay = allPayments.filter(p => p.status === 'pending');

      return {
        total_revenue_this_month: totalThisMonth,
        total_revenue_last_month: 0, 
        revenue_growth_percentage: 0,
        pending_payments_count: pendingPay.length,
        overdue_payments_count: overduePay.length,
        overdue_amount: overduePay.reduce((sum, p) => sum + p.amount, 0),
        average_payment_amount: allPayments.length > 0 
          ? allPayments.reduce((sum, p) => sum + p.amount, 0) / allPayments.length 
          : 0,
        top_paying_students: [],
        top_paying_schools: [],
        monthly_revenue_trend: []
      };
    } catch (error) {
      console.error('Error in getPaymentStats:', error);
      throw error;
    }
  },

  async deletePayment(paymentId: string): Promise<void> {
    const userPath = getUserPath();
    try {
      await deleteDoc(doc(db, userPath, "payments", paymentId));
    } catch (error) {
      console.error('Error in deletePayment:', error);
      throw error;
    }
  }
};
