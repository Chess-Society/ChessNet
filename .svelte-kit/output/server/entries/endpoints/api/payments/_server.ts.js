import { json } from "@sveltejs/kit";
import { p as paymentsApi } from "../../../../chunks/payments.js";
const GET = async ({ url, locals }) => {
  try {
    console.log("💰 API: GET /api/payments");
    console.log("User:", locals.user?.email || "none");
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev) {
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
    const isLocalDev = request.headers.get("host")?.includes("localhost") || request.headers.get("host")?.includes("127.0.0.1");
    if (isLocalDev) {
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
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev) {
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
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev) {
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
