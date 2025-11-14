import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../../chunks/public.js";
import { json } from "@sveltejs/kit";
const PUT = async ({ params, request, cookies }) => {
  console.log("✏️ API Students - Updating student with ID:", params.studentId);
  try {
    const studentId = params.studentId;
    if (!studentId) {
      return json({ error: "ID del estudiante requerido" }, { status: 400 });
    }
    const body = await request.json();
    const { name, first_name, last_name, college_id, notes } = body;
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/students/[studentId] PUT - User not authenticated:", userError?.message);
      return json({ error: "Usuario no autenticado" }, { status: 401 });
    }
    const { data: updatedStudent, error: updateError } = await supabase.from("students").update({
      name: name?.trim() || null,
      first_name: first_name?.trim() || null,
      last_name: last_name?.trim() || null,
      college_id: college_id?.trim() || null,
      notes: notes?.trim() || null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", studentId).eq("user_id", user.id).select().single();
    if (updateError) {
      console.error("❌ Error updating student:", updateError);
      return json({ error: "Error al actualizar el estudiante: " + updateError.message }, { status: 500 });
    }
    console.log("✅ Student updated successfully:", studentId);
    return json({ success: true, student: updatedStudent, message: "Estudiante actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error in update student API:", error.message);
    return json({ error: "Error interno del servidor: " + error.message }, { status: 500 });
  }
};
const DELETE = async ({ params, cookies }) => {
  console.log("🗑️ API Students - Deleting student with ID:", params.studentId);
  try {
    const studentId = params.studentId;
    if (!studentId) {
      return json({ error: "ID del estudiante requerido" }, { status: 400 });
    }
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/students/[studentId] DELETE - User not authenticated:", userError?.message);
      return json({ error: "Usuario no autenticado" }, { status: 401 });
    }
    const { error: deleteError } = await supabase.from("students").delete().eq("id", studentId).eq("user_id", user.id);
    if (deleteError) {
      console.error("❌ Error deleting student:", deleteError);
      return json({ error: "Error al eliminar el estudiante: " + deleteError.message }, { status: 500 });
    }
    console.log("✅ Student deleted successfully:", studentId);
    return json({ success: true, message: "Estudiante eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error in delete student API:", error.message);
    return json({ error: "Error interno del servidor: " + error.message }, { status: 500 });
  }
};
export {
  DELETE,
  PUT
};
