import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../../../chunks/public.js";
import { error } from "@sveltejs/kit";
const load = async ({ locals, url, params, cookies }) => {
  console.log("✏️ Edit student page server load - User:", locals.user?.email || "none");
  console.log("✏️ Student ID:", params.studentId);
  if (!locals.user) {
    throw error(401, "Usuario no autenticado");
  }
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options)
    }
  });
  try {
    const { data: student, error: studentError } = await supabase.from("students").select("*").eq("id", params.studentId).eq("user_id", locals.user.id).single();
    if (studentError) {
      console.error("❌ Error fetching student for edit:", studentError);
      throw error(404, "Estudiante no encontrado");
    }
    if (!student) {
      throw error(404, "Estudiante no encontrado");
    }
    const { data: schools, error: schoolsError } = await supabase.from("colleges").select("id, name, city").eq("user_id", locals.user.id);
    if (schoolsError) {
      console.error("❌ Error fetching schools:", schoolsError);
    }
    return {
      user: locals.user,
      student,
      schools: schools || []
    };
  } catch (err) {
    console.error("❌ Error in edit student page:", err);
    if (err.status) {
      throw err;
    }
    throw error(500, "Error interno del servidor");
  }
};
export {
  load
};
