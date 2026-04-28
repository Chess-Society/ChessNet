import { db, auth, toData } from "$lib/firebase";
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

export const paymentsApi = {
  // Obtener todos los pagos con filtros
  async getPayments(filters?: PaymentFilters, userId?: string): Promise<PaymentWithDetails[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    try {
      let q = query(
        collection(db, "payments"),
        where("ownerId", "==", uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      let payments = querySnapshot.docs.map(doc => toData<PaymentWithDetails>(doc));

      // Apply additional filters in memory if necessary
      if (filters) {
        if (filters.paymentType) payments = payments.filter(p => p.paymentType === filters.paymentType);
        if (filters.status) payments = payments.filter(p => p.status === filters.status);
        if (filters.concept) payments = payments.filter(p => p.concept === filters.concept);
        if (filters.studentId) payments = payments.filter(p => p.studentId === filters.studentId);
        if (filters.schoolId) payments = payments.filter(p => p.schoolId === filters.schoolId);
        if (filters.classId) payments = payments.filter(p => p.classId === filters.classId);
        if (filters.dateFrom) payments = payments.filter(p => p.createdAt >= filters.dateFrom!);
        if (filters.dateTo) payments = payments.filter(p => p.createdAt <= filters.dateTo!);
        if (filters.dueDateFrom) payments = payments.filter(p => p.dueDate! >= filters.dueDateFrom!);
        if (filters.dueDateTo) payments = payments.filter(p => p.dueDate! <= filters.dueDateTo!);
        if (filters.amountMin) payments = payments.filter(p => p.amount >= filters.amountMin!);
        if (filters.amountMax) payments = payments.filter(p => p.amount <= filters.amountMax!);
      }

      // Manual join for details
      for (const payment of payments) {
        if (payment.studentId) {
          const studentSnap = await getDoc(doc(db, "students", payment.studentId));
          if (studentSnap.exists()) payment.student = toData<any>(studentSnap);
        }
        if (payment.schoolId) {
          const schoolSnap = await getDoc(doc(db, "schools", payment.schoolId));
          if (schoolSnap.exists()) payment.school = toData<any>(schoolSnap);
        }
        if (payment.classId) {
          const classSnap = await getDoc(doc(db, "classes", payment.classId));
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
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    try {
      const docSnap = await getDoc(doc(db, "payments", paymentId));
      if (!docSnap.exists()) return null;

      const payment = toData<PaymentWithDetails>(docSnap);
      
      if (payment.ownerId !== uid) return null;

      // Manual joins
      if (payment.studentId) {
        const studentSnap = await getDoc(doc(db, "students", payment.studentId));
        if (studentSnap.exists()) payment.student = toData<any>(studentSnap);
      }
      if (payment.schoolId) {
        const schoolSnap = await getDoc(doc(db, "schools", payment.schoolId));
        if (schoolSnap.exists()) payment.school = toData<any>(schoolSnap);
      }
      if (payment.classId) {
        const classSnap = await getDoc(doc(db, "classes", payment.classId));
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
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    try {
      const data = {
        ...paymentData,
        ownerId: uid,
        currency: 'EUR',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "payments"), data);
      const docSnap = await getDoc(docRef);
      return toData<Payment>(docSnap);
    } catch (error) {
      console.error('Error in createPayment:', error);
      throw error;
    }
  },

  // Actualizar un pago
  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      const docRef = doc(db, "payments", paymentId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
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
      paidDate: new Date().toISOString(),
      paymentMethod: paymentMethod || undefined,
      paymentReference: paymentReference || undefined
    };

    return this.updatePayment(paymentId, updates);
  },

  // Obtener estadísticas de pagos
  async getPaymentStats(userId?: string): Promise<PaymentStats> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    try {
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const q = query(
        collection(db, "payments"),
        where("ownerId", "==", uid)
      );
      const snapshot = await getDocs(q);
      const allPayments = snapshot.docs.map(doc => doc.data() as any);

      const thisMonthPayments = allPayments.filter(p => 
        p.status === 'paid' && p.paidDate && p.paidDate >= firstDayThisMonth
      );
      
      const totalThisMonth = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
      const overduePay = allPayments.filter(p => p.status === 'overdue');
      const pendingPay = allPayments.filter(p => p.status === 'pending');

      return {
        totalRevenueThisMonth: totalThisMonth,
        totalRevenueLastMonth: 0, 
        revenueGrowthPercentage: 0,
        pendingPaymentsCount: pendingPay.length,
        overduePaymentsCount: overduePay.length,
        overdueAmount: overduePay.reduce((sum, p) => sum + p.amount, 0),
        averagePaymentAmount: allPayments.length > 0 
          ? allPayments.reduce((sum, p) => sum + p.amount, 0) / allPayments.length 
          : 0,
        topPayingStudents: [],
        topPayingSchools: [],
        monthlyRevenueTrend: []
      };
    } catch (error) {
      console.error('Error in getPaymentStats:', error);
      throw error;
    }
  },

  async deletePayment(paymentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "payments", paymentId));
    } catch (error) {
      console.error('Error in deletePayment:', error);
      throw error;
    }
  }
};
