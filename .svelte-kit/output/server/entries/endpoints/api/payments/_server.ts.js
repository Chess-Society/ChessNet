import { json } from "@sveltejs/kit";
import { s as supabase } from "../../../../chunks/supabase.js";
const isLocalDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const mockPayments = [
  {
    id: "pay-001",
    user_id: "dev-user-123",
    payment_type: "student",
    student_id: "mock-student-1",
    school_id: void 0,
    class_id: "mock-class-1",
    amount: 45,
    currency: "EUR",
    concept: "monthly_fee",
    description: "Mensualidad enero 2024 - Principiantes Mañana",
    period_start: "2024-01-01",
    period_end: "2024-01-31",
    status: "paid",
    due_date: "2024-01-05",
    paid_date: "2024-01-03T10:30:00Z",
    payment_method: "transfer",
    payment_reference: "TRANS-240103-001",
    invoice_number: "INV-2024-001",
    invoice_date: "2024-01-03",
    notes: "Pago puntual",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString(),
    student: {
      id: "mock-student-1",
      user_id: "dev-user-123",
      name: "Ana García Martín",
      phone: "+34 666 111 222",
      college_id: "mock-college-1",
      date_of_birth: "2010-05-15",
      emergency_contact: "Madre: María Martín",
      emergency_phone: "+34 666 111 223",
      medical_notes: null,
      instructor_notes: "Muy aplicada",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    class: {
      id: "mock-class-1",
      user_id: "dev-user-123",
      name: "Principiantes Mañana",
      description: "Clase para principiantes en horario matutino",
      college_id: "mock-college-1",
      schedule: "Lunes y Miércoles 10:00-11:00",
      max_students: 12,
      start_date: "2024-01-01",
      end_date: "2024-06-30",
      status: "active",
      notes: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  },
  {
    id: "pay-002",
    user_id: "dev-user-123",
    payment_type: "student",
    student_id: "mock-student-2",
    school_id: void 0,
    class_id: "mock-class-1",
    amount: 45,
    currency: "EUR",
    concept: "monthly_fee",
    description: "Mensualidad febrero 2024 - Principiantes Mañana",
    period_start: "2024-02-01",
    period_end: "2024-02-29",
    status: "overdue",
    due_date: "2024-02-05",
    paid_date: void 0,
    payment_method: void 0,
    payment_reference: void 0,
    invoice_number: "INV-2024-002",
    invoice_date: "2024-02-01",
    notes: "Recordar cobro",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3).toISOString(),
    student: {
      id: "mock-student-2",
      user_id: "dev-user-123",
      name: "Carlos López Silva",
      phone: "+34 666 222 333",
      college_id: "mock-college-1",
      date_of_birth: "2011-03-20",
      emergency_contact: "Padre: Juan López",
      emergency_phone: "+34 666 222 334",
      medical_notes: null,
      instructor_notes: "Necesita más práctica",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    class: {
      id: "mock-class-1",
      user_id: "dev-user-123",
      name: "Principiantes Mañana",
      description: "Clase para principiantes en horario matutino",
      college_id: "mock-college-1",
      schedule: "Lunes y Miércoles 10:00-11:00",
      max_students: 12,
      start_date: "2024-01-01",
      end_date: "2024-06-30",
      status: "active",
      notes: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  }
];
const mockStudentSummaries = [
  {
    student_id: "mock-student-1",
    student_name: "Ana García Martín",
    total_amount: 135,
    paid_amount: 135,
    pending_amount: 0,
    overdue_amount: 0,
    total_payments: 3,
    paid_payments: 3,
    pending_payments: 0,
    overdue_payments: 0,
    last_payment_date: "2024-01-03",
    next_due_date: "2024-03-05"
  },
  {
    student_id: "mock-student-2",
    student_name: "Carlos López Silva",
    total_amount: 90,
    paid_amount: 45,
    pending_amount: 0,
    overdue_amount: 45,
    total_payments: 2,
    paid_payments: 1,
    pending_payments: 0,
    overdue_payments: 1,
    last_payment_date: "2024-01-05",
    next_due_date: "2024-02-05"
  }
];
const mockSchoolSummaries = [
  {
    school_id: "mock-school-1",
    school_name: "Escuela de Ajedrez Madrid Centro",
    total_amount: 2400,
    paid_amount: 1200,
    pending_amount: 1200,
    overdue_amount: 0,
    total_payments: 2,
    paid_payments: 1,
    pending_payments: 1,
    overdue_payments: 0,
    last_payment_date: "2024-01-12",
    next_due_date: "2024-02-15"
  }
];
const paymentsApi = {
  // Obtener todos los pagos con filtros
  async getPayments(filters) {
    console.log("💰 Getting payments with filters:", filters);
    if (isLocalDev) {
      console.log("🔧 DEV MODE: Returning mock payments");
      return mockPayments;
    }
    try {
      let query = supabase.from("payments").select(`
          *,
          student:students(*),
          school:colleges(*),
          class:classes(*)
        `).order("created_at", { ascending: false });
      if (filters) {
        if (filters.payment_type) {
          query = query.eq("payment_type", filters.payment_type);
        }
        if (filters.status) {
          query = query.eq("status", filters.status);
        }
        if (filters.concept) {
          query = query.eq("concept", filters.concept);
        }
        if (filters.student_id) {
          query = query.eq("student_id", filters.student_id);
        }
        if (filters.school_id) {
          query = query.eq("school_id", filters.school_id);
        }
        if (filters.class_id) {
          query = query.eq("class_id", filters.class_id);
        }
        if (filters.date_from) {
          query = query.gte("created_at", filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte("created_at", filters.date_to);
        }
        if (filters.due_date_from) {
          query = query.gte("due_date", filters.due_date_from);
        }
        if (filters.due_date_to) {
          query = query.lte("due_date", filters.due_date_to);
        }
        if (filters.amount_min) {
          query = query.gte("amount", filters.amount_min);
        }
        if (filters.amount_max) {
          query = query.lte("amount", filters.amount_max);
        }
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching payments:", error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("Error in getPayments:", error);
      throw error;
    }
  },
  // Obtener un pago específico
  async getPayment(paymentId) {
    console.log("💰 Getting payment:", paymentId);
    if (isLocalDev) {
      console.log("🔧 DEV MODE: Returning mock payment");
      return mockPayments.find((p) => p.id === paymentId) || null;
    }
    try {
      const { data, error } = await supabase.from("payments").select(`
          *,
          student:students(*),
          school:colleges(*),
          class:classes(*)
        `).eq("id", paymentId).single();
      if (error) {
        console.error("Error fetching payment:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error in getPayment:", error);
      throw error;
    }
  },
  // Crear un nuevo pago
  async createPayment(paymentData) {
    console.log("💰 Creating payment:", paymentData);
    if (isLocalDev) {
      console.log("🔧 DEV MODE: Mock payment creation");
      const mockPayment = {
        id: `pay-${Date.now()}`,
        user_id: "dev-user-123",
        ...paymentData,
        currency: "EUR",
        status: "pending",
        paid_date: void 0,
        payment_method: void 0,
        payment_reference: void 0,
        invoice_number: `INV-${Date.now()}`,
        invoice_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      return mockPayment;
    }
    try {
      const { data, error } = await supabase.from("payments").insert([paymentData]).select().single();
      if (error) {
        console.error("Error creating payment:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error in createPayment:", error);
      throw error;
    }
  },
  // Actualizar un pago
  async updatePayment(paymentId, updates) {
    console.log("💰 Updating payment:", paymentId, updates);
    if (isLocalDev) {
      console.log("🔧 DEV MODE: Mock payment update");
      const existingPayment = mockPayments.find((p) => p.id === paymentId);
      if (!existingPayment) {
        throw new Error("Payment not found");
      }
      return {
        ...existingPayment,
        ...updates,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    try {
      const { data, error } = await supabase.from("payments").update({
        ...updates,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", paymentId).select().single();
      if (error) {
        console.error("Error updating payment:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error in updatePayment:", error);
      throw error;
    }
  },
  // Marcar pago como pagado
  async markAsPaid(paymentId, paymentMethod, paymentReference) {
    console.log("💰 Marking payment as paid:", paymentId);
    const updates = {
      status: "paid",
      paid_date: (/* @__PURE__ */ new Date()).toISOString(),
      payment_method: paymentMethod || void 0,
      payment_reference: paymentReference || void 0
    };
    return this.updatePayment(paymentId, updates);
  },
  // Obtener estadísticas de pagos
  async getPaymentStats() {
    console.log("💰 Getting payment stats");
    if (isLocalDev) {
      console.log("🔧 DEV MODE: Returning mock payment stats");
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
      const thisMonthPayments = mockPayments.filter(
        (p) => p.status === "paid" && new Date(p.paid_date || p.created_at).getMonth() === currentMonth
      );
      const totalThisMonth = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalLastMonth = 980;
      const overduePay = mockPayments.filter((p) => p.status === "overdue");
      const pendingPay = mockPayments.filter((p) => p.status === "pending");
      return {
        total_revenue_this_month: totalThisMonth,
        total_revenue_last_month: totalLastMonth,
        revenue_growth_percentage: Math.round((totalThisMonth - totalLastMonth) / totalLastMonth * 100),
        pending_payments_count: pendingPay.length,
        overdue_payments_count: overduePay.length,
        overdue_amount: overduePay.reduce((sum, p) => sum + p.amount, 0),
        average_payment_amount: mockPayments.length > 0 ? mockPayments.reduce((sum, p) => sum + p.amount, 0) / mockPayments.length : 0,
        top_paying_students: mockStudentSummaries.slice(0, 5),
        top_paying_schools: mockSchoolSummaries.slice(0, 5),
        monthly_revenue_trend: [
          {
            month: "2024-01",
            total_revenue: 1200,
            paid_revenue: 1200,
            pending_revenue: 0,
            student_payments: 800,
            school_payments: 400,
            payment_count: 8
          },
          {
            month: "2024-02",
            total_revenue: totalThisMonth,
            paid_revenue: totalThisMonth,
            pending_revenue: pendingPay.reduce((sum, p) => sum + p.amount, 0),
            student_payments: thisMonthPayments.filter((p) => p.payment_type === "student").reduce((sum, p) => sum + p.amount, 0),
            school_payments: thisMonthPayments.filter((p) => p.payment_type === "school").reduce((sum, p) => sum + p.amount, 0),
            payment_count: thisMonthPayments.length
          }
        ]
      };
    }
    try {
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
      console.error("Error in getPaymentStats:", error);
      throw error;
    }
  },
  // Obtener resúmenes por estudiante
  async getStudentPaymentSummaries() {
    console.log("💰 Getting student payment summaries");
    if (isLocalDev) {
      console.log("🔧 DEV MODE: Returning mock student summaries");
      return mockStudentSummaries;
    }
    return [];
  },
  // Obtener resúmenes por centro
  async getSchoolPaymentSummaries() {
    console.log("💰 Getting school payment summaries");
    if (isLocalDev) {
      console.log("🔧 DEV MODE: Returning mock school summaries");
      return mockSchoolSummaries;
    }
    return [];
  },
  // Eliminar un pago
  async deletePayment(paymentId) {
    console.log("💰 Deleting payment:", paymentId);
    if (isLocalDev) {
      console.log("🔧 DEV MODE: Mock payment deletion");
      return;
    }
    try {
      const { error } = await supabase.from("payments").delete().eq("id", paymentId);
      if (error) {
        console.error("Error deleting payment:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in deletePayment:", error);
      throw error;
    }
  }
};
const GET = async ({ url, locals }) => {
  try {
    console.log("💰 API: GET /api/payments");
    console.log("User:", locals.user?.email || "none");
    const isLocalDev2 = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev2) {
      console.log("🔧 DEV MODE: Payments API - Returning mock data");
    }
    const filters = {};
    const paymentType = url.searchParams.get("payment_type");
    if (paymentType && (paymentType === "student" || paymentType === "school")) {
      filters.payment_type = paymentType;
    }
    const status = url.searchParams.get("status");
    if (status && ["pending", "paid", "overdue", "cancelled", "refunded"].includes(status)) {
      filters.status = status;
    }
    const concept = url.searchParams.get("concept");
    if (concept && ["monthly_fee", "registration", "tournament", "material", "private_lesson", "other"].includes(concept)) {
      filters.concept = concept;
    }
    const studentId = url.searchParams.get("student_id");
    if (studentId) filters.student_id = studentId;
    const schoolId = url.searchParams.get("school_id");
    if (schoolId) filters.school_id = schoolId;
    const classId = url.searchParams.get("class_id");
    if (classId) filters.class_id = classId;
    const dateFrom = url.searchParams.get("date_from");
    if (dateFrom) filters.date_from = dateFrom;
    const dateTo = url.searchParams.get("date_to");
    if (dateTo) filters.date_to = dateTo;
    const dueDateFrom = url.searchParams.get("due_date_from");
    if (dueDateFrom) filters.due_date_from = dueDateFrom;
    const dueDateTo = url.searchParams.get("due_date_to");
    if (dueDateTo) filters.due_date_to = dueDateTo;
    const amountMin = url.searchParams.get("amount_min");
    if (amountMin) filters.amount_min = parseFloat(amountMin);
    const amountMax = url.searchParams.get("amount_max");
    if (amountMax) filters.amount_max = parseFloat(amountMax);
    const payments = await paymentsApi.getPayments(filters);
    return json({
      success: true,
      data: payments,
      message: `Found ${payments.length} payments`
    });
  } catch (error) {
    console.error("❌ API Error in GET /api/payments:", error);
    return json({
      success: false,
      error: "Failed to fetch payments",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  try {
    console.log("💰 API: POST /api/payments");
    console.log("User:", locals.user?.email || "none");
    const isLocalDev2 = request.headers.get("host")?.includes("localhost") || request.headers.get("host")?.includes("127.0.0.1");
    if (isLocalDev2) {
      console.log("🔧 DEV MODE: Payments API - Creating mock payment");
    }
    const paymentData = await request.json();
    console.log("Payment data received:", paymentData);
    if (paymentData.amount && paymentData.amount <= 0) {
      return json({
        success: false,
        error: "El importe debe ser mayor a 0"
      }, { status: 400 });
    }
    if (paymentData.period_start && paymentData.period_end) {
      if (new Date(paymentData.period_start) >= new Date(paymentData.period_end)) {
        return json({
          success: false,
          error: "La fecha de inicio debe ser anterior a la fecha de fin"
        }, { status: 400 });
      }
    }
    const newPayment = await paymentsApi.createPayment(paymentData);
    return json({
      success: true,
      data: newPayment,
      message: "Payment created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("❌ API Error in POST /api/payments:", error);
    return json({
      success: false,
      error: "Failed to create payment",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
};
const PUT = async ({ request, url, locals }) => {
  try {
    console.log("💰 API: PUT /api/payments");
    console.log("User:", locals.user?.email || "none");
    const isLocalDev2 = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev2) {
      console.log("🔧 DEV MODE: Payments API - Updating mock payment");
    }
    const paymentId = url.searchParams.get("id");
    if (!paymentId) {
      return json({
        success: false,
        error: "Payment ID is required"
      }, { status: 400 });
    }
    const updates = await request.json();
    console.log("Payment updates received:", updates);
    const updatedPayment = await paymentsApi.updatePayment(paymentId, updates);
    return json({
      success: true,
      data: updatedPayment,
      message: "Payment updated successfully"
    });
  } catch (error) {
    console.error("❌ API Error in PUT /api/payments:", error);
    return json({
      success: false,
      error: "Failed to update payment",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
};
const DELETE = async ({ url, locals }) => {
  try {
    console.log("💰 API: DELETE /api/payments");
    console.log("User:", locals.user?.email || "none");
    const isLocalDev2 = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev2) {
      console.log("🔧 DEV MODE: Payments API - Deleting mock payment");
    }
    const paymentId = url.searchParams.get("id");
    if (!paymentId) {
      return json({
        success: false,
        error: "Payment ID is required"
      }, { status: 400 });
    }
    await paymentsApi.deletePayment(paymentId);
    return json({
      success: true,
      message: "Payment deleted successfully"
    });
  } catch (error) {
    console.error("❌ API Error in DELETE /api/payments:", error);
    return json({
      success: false,
      error: "Failed to delete payment",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
