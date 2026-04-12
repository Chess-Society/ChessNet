import { d as db, a as auth } from "./firebase.js";
import { deleteDoc, doc, query, collection, where, getDocs, updateDoc, getDoc, addDoc, orderBy } from "firebase/firestore";
const toData = (doc2) => {
  return { id: doc2.id, ...doc2.data() };
};
const paymentsApi = {
  // Obtener todos los pagos con filtros
  async getPayments(filters, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    try {
      let q = query(
        collection(db, "payments"),
        where("user_id", "==", uid),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);
      let payments = querySnapshot.docs.map((doc2) => toData(doc2));
      if (filters) {
        if (filters.payment_type) payments = payments.filter((p) => p.payment_type === filters.payment_type);
        if (filters.status) payments = payments.filter((p) => p.status === filters.status);
        if (filters.concept) payments = payments.filter((p) => p.concept === filters.concept);
        if (filters.student_id) payments = payments.filter((p) => p.student_id === filters.student_id);
        if (filters.school_id) payments = payments.filter((p) => p.school_id === filters.school_id);
        if (filters.class_id) payments = payments.filter((p) => p.class_id === filters.class_id);
        if (filters.date_from) payments = payments.filter((p) => p.created_at >= filters.date_from);
        if (filters.date_to) payments = payments.filter((p) => p.created_at <= filters.date_to);
        if (filters.due_date_from) payments = payments.filter((p) => p.due_date >= filters.due_date_from);
        if (filters.due_date_to) payments = payments.filter((p) => p.due_date <= filters.due_date_to);
        if (filters.amount_min) payments = payments.filter((p) => p.amount >= filters.amount_min);
        if (filters.amount_max) payments = payments.filter((p) => p.amount <= filters.amount_max);
      }
      for (const payment of payments) {
        if (payment.student_id) {
          const studentSnap = await getDoc(doc(db, "students", payment.student_id));
          if (studentSnap.exists()) payment.student = toData(studentSnap);
        }
        if (payment.school_id) {
          const schoolSnap = await getDoc(doc(db, "colleges", payment.school_id));
          if (schoolSnap.exists()) payment.school = toData(schoolSnap);
        }
        if (payment.class_id) {
          const classSnap = await getDoc(doc(db, "classes", payment.class_id));
          if (classSnap.exists()) payment.class = toData(classSnap);
        }
      }
      return payments;
    } catch (error) {
      console.error("Error in getPayments:", error);
      throw error;
    }
  },
  // Obtener un pago específico
  async getPayment(paymentId) {
    try {
      const docSnap = await getDoc(doc(db, "payments", paymentId));
      if (!docSnap.exists()) return null;
      const payment = toData(docSnap);
      if (payment.student_id) {
        const studentSnap = await getDoc(doc(db, "students", payment.student_id));
        if (studentSnap.exists()) payment.student = toData(studentSnap);
      }
      if (payment.school_id) {
        const schoolSnap = await getDoc(doc(db, "colleges", payment.school_id));
        if (schoolSnap.exists()) payment.school = toData(schoolSnap);
      }
      if (payment.class_id) {
        const classSnap = await getDoc(doc(db, "classes", payment.class_id));
        if (classSnap.exists()) payment.class = toData(classSnap);
      }
      return payment;
    } catch (error) {
      console.error("Error in getPayment:", error);
      throw error;
    }
  },
  // Crear un nuevo pago
  async createPayment(paymentData) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    try {
      const data = {
        ...paymentData,
        user_id: user.uid,
        currency: "EUR",
        status: "pending",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const docRef = await addDoc(collection(db, "payments"), data);
      const docSnap = await getDoc(docRef);
      return toData(docSnap);
    } catch (error) {
      console.error("Error in createPayment:", error);
      throw error;
    }
  },
  // Actualizar un pago
  async updatePayment(paymentId, updates) {
    try {
      const docRef = doc(db, "payments", paymentId);
      await updateDoc(docRef, {
        ...updates,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      const docSnap = await getDoc(docRef);
      return toData(docSnap);
    } catch (error) {
      console.error("Error in updatePayment:", error);
      throw error;
    }
  },
  // Marcar pago como pagado
  async markAsPaid(paymentId, paymentMethod, paymentReference) {
    const updates = {
      status: "paid",
      paid_date: (/* @__PURE__ */ new Date()).toISOString(),
      payment_method: paymentMethod || void 0,
      payment_reference: paymentReference || void 0
    };
    return this.updatePayment(paymentId, updates);
  },
  // Obtener estadísticas de pagos
  async getPaymentStats(userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    try {
      const now = /* @__PURE__ */ new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const q = query(
        collection(db, "payments"),
        where("user_id", "==", uid)
      );
      const snapshot = await getDocs(q);
      const allPayments = snapshot.docs.map((doc2) => doc2.data());
      const thisMonthPayments = allPayments.filter(
        (p) => p.status === "paid" && p.paid_date && p.paid_date >= firstDayThisMonth
      );
      const totalThisMonth = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
      const overduePay = allPayments.filter((p) => p.status === "overdue");
      const pendingPay = allPayments.filter((p) => p.status === "pending");
      return {
        total_revenue_this_month: totalThisMonth,
        total_revenue_last_month: 0,
        // Would need more complex query
        revenue_growth_percentage: 0,
        pending_payments_count: pendingPay.length,
        overdue_payments_count: overduePay.length,
        overdue_amount: overduePay.reduce((sum, p) => sum + p.amount, 0),
        average_payment_amount: allPayments.length > 0 ? allPayments.reduce((sum, p) => sum + p.amount, 0) / allPayments.length : 0,
        top_paying_students: [],
        top_paying_schools: [],
        monthly_revenue_trend: []
      };
    } catch (error) {
      console.error("Error in getPaymentStats:", error);
      throw error;
    }
  },
  async deletePayment(paymentId) {
    try {
      await deleteDoc(doc(db, "payments", paymentId));
    } catch (error) {
      console.error("Error in deletePayment:", error);
      throw error;
    }
  }
};
export {
  paymentsApi as p
};
