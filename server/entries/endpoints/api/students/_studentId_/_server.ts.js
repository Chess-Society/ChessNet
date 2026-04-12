import { json } from "@sveltejs/kit";
const PUT = async ({ params, request, locals }) => {
  console.log("✏️ API Students - Updating student with ID:", params.studentId);
  try {
    const studentId = params.studentId;
    if (!studentId) {
      return json({ error: "ID del estudiante requerido" }, { status: 400 });
    }
    if (!locals.user) {
      console.error("❌ API /api/students/[studentId] PUT - User not authenticated");
      return json({ error: "Usuario no autenticado" }, { status: 401 });
    }
    const body = await request.json();
    console.log("📝 Mock update with data:", body);
    return json({
      success: true,
      student: { id: studentId, ...body, updated_at: (/* @__PURE__ */ new Date()).toISOString() },
      message: "Estudiante actualizado correctamente (MOCK)"
    });
  } catch (error) {
    console.error("❌ Error in update student API:", error.message);
    return json({ error: "Error interno del servidor: " + error.message }, { status: 500 });
  }
};
const DELETE = async ({ params, locals }) => {
  console.log("🗑️ API Students - Deleting student with ID:", params.studentId);
  try {
    const studentId = params.studentId;
    if (!studentId) {
      return json({ error: "ID del estudiante requerido" }, { status: 400 });
    }
    if (!locals.user) {
      console.error("❌ API /api/students/[studentId] DELETE - User not authenticated");
      return json({ error: "Usuario no autenticado" }, { status: 401 });
    }
    console.log("🗑️ Mock deleting student:", studentId);
    return json({ success: true, message: "Estudiante eliminado correctamente (MOCK)" });
  } catch (error) {
    console.error("❌ Error in delete student API:", error.message);
    return json({ error: "Error interno del servidor: " + error.message }, { status: 500 });
  }
};
export {
  DELETE,
  PUT
};
