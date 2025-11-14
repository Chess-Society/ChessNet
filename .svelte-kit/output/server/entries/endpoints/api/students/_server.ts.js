import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
import { json } from "@sveltejs/kit";
const GET = async ({ cookies }) => {
  console.log("👥 API Students - Fetching students...");
  try {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/students GET - User not authenticated:", userError?.message);
      return json({ error: "Usuario no autenticado" }, { status: 401 });
    }
    const { data: students, error: studentsError } = await supabase.from("students").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (studentsError) {
      console.error("❌ Error fetching students:", studentsError);
      return json({ error: "Error al obtener los estudiantes" }, { status: 500 });
    }
    console.log("✅ Students fetched successfully:", students?.length || 0);
    return json({ students: students || [] });
  } catch (error) {
    console.error("❌ Error in GET students API:", error.message);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
const POST = async ({ request, cookies, url }) => {
  console.log("👥 API Students - Creating student...");
  try {
    const body = await request.json();
    console.log("📝 Request body received:", JSON.stringify(body, null, 2));
    const {
      name,
      first_name,
      last_name,
      date_of_birth,
      grade,
      parent_email,
      parent_phone,
      avatar,
      notes,
      settings,
      college_id
    } = body;
    if (parent_email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent_email)) {
      return json({ error: "El email del padre/madre no es válido" }, { status: 400 });
    }
    console.log("🌐 API /api/students POST - Creating student in Supabase");
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/students POST - User not authenticated:", userError?.message);
      return json({ error: "Usuario no autenticado" }, { status: 401 });
    }
    try {
      const studentData = {
        user_id: user.id,
        name: name?.trim() && name.trim() !== "" ? name.trim() : "Estudiante sin nombre",
        first_name: first_name?.trim() && first_name.trim() !== "" ? first_name.trim() : null,
        last_name: last_name?.trim() && last_name.trim() !== "" ? last_name.trim() : null,
        avatar: avatar?.trim() && avatar.trim() !== "" ? avatar.trim() : null,
        notes: notes?.trim() && notes.trim() !== "" ? notes.trim() : null,
        college_id: college_id?.trim() && college_id.trim() !== "" ? college_id.trim() : null
      };
      console.log("💾 Inserting student data:", JSON.stringify(studentData, null, 2));
      const { data: student, error: studentError } = await supabase.from("students").insert(studentData).select().single();
      if (studentError) {
        console.error("❌ Error creating student:", studentError);
        return json({ error: "Error al crear el estudiante" }, { status: 500 });
      }
      console.log("✅ Student created successfully:", student.id);
      return json({ student });
    } catch (error) {
      console.error("❌ Error in students API:", error.message);
      return json({ error: "Error al crear el estudiante" }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Error parsing request body:", error.message);
    return json({ error: "Datos de entrada inválidos" }, { status: 400 });
  }
};
const DELETE = async ({ request, cookies, url }) => {
  console.log("🗑️ API Students - Deleting student...");
  try {
    const body = await request.json();
    const { studentId } = body;
    if (!studentId) {
      return json({ error: "ID del estudiante requerido" }, { status: 400 });
    }
    console.log("🗑️ Deleting student with ID:", studentId);
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/students DELETE - User not authenticated:", userError?.message);
      return json({ error: "Usuario no autenticado" }, { status: 401 });
    }
    const { error: deleteError } = await supabase.from("students").delete().eq("id", studentId).eq("user_id", user.id);
    if (deleteError) {
      console.error("❌ Error deleting student:", deleteError);
      return json({ error: "Error al eliminar el estudiante" }, { status: 500 });
    }
    console.log("✅ Student deleted successfully:", studentId);
    return json({ success: true, message: "Estudiante eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error in delete student API:", error.message);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST
};
