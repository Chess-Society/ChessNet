import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
import { json } from "@sveltejs/kit";
import { s as supabase } from "../../../../chunks/supabase.js";
const classesApi = {
  // Get all classes for the current user
  async getMyClasses() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("classes").select(`
        *,
        colleges:college_id(*)
      `).eq("user_id", user.id).order("name", { ascending: true });
    if (error) throw error;
    return data || [];
  },
  // Get classes with occupancy info
  async getClassesWithOccupancy() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("classes").select(`
        *,
        colleges:college_id(*),
        v_class_occupancy!left(enrolled)
      `).eq("user_id", user.id).order("name", { ascending: true });
    if (error) throw error;
    return data?.map((cls) => ({
      ...cls,
      enrolled: cls.v_class_occupancy?.[0]?.enrolled || 0
    })) || [];
  },
  // Get a specific class
  async getClass(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("classes").select(`
        *,
        colleges:college_id(*)
      `).eq("id", id).eq("user_id", user.id).single();
    if (error) throw error;
    return data;
  },
  // Create a new class
  async createClass(classData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("classes").insert({
      user_id: user.id,
      name: classData.name,
      college_id: classData.college_id,
      description: classData.description,
      level: classData.level,
      schedule: classData.schedule,
      max_students: classData.max_students || 20,
      active: classData.active !== false
      // Por defecto true
    }).select().single();
    if (error) throw error;
    return data;
  },
  // Update a class
  async updateClass(id, updates) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("classes").update({
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw error;
    return data;
  },
  // Delete a class
  async deleteClass(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { error } = await supabase.from("classes").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw error;
  },
  // Get students in a class (using class_students bridge table)
  async getClassStudents(classId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("class_students").select(`
        students:student_id(*)
      `).eq("owner_id", user.id).eq("class_id", classId).eq("status", "active");
    if (error) throw error;
    return data?.map((item) => item.students).filter(Boolean) || [];
  },
  // Get all enrollments for a class (using class_students bridge table)
  async getClassEnrollments(classId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("class_students").select(`
        *,
        students:student_id(*)
      `).eq("owner_id", user.id).eq("class_id", classId);
    if (error) throw error;
    return data || [];
  },
  // Get class skills (temario)
  async getClassSkills(classId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("class_skills").select(`
        *,
        skills:skill_id(*)
      `).eq("owner_id", user.id).eq("class_id", classId).order("order_index", { ascending: true });
    if (error) throw error;
    return data || [];
  },
  // Get class occupancy (number of enrolled students)
  async getClassOccupancy(classId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("v_class_occupancy").select("enrolled").eq("owner_id", user.id).eq("class_id", classId).single();
    if (error) return 0;
    return data?.enrolled || 0;
  },
  // Get class attendance for a specific date
  async getClassAttendance(classId, date) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("attendance").select(`
        *,
        students:student_id(*)
      `).eq("user_id", user.id).eq("class_id", classId).eq("date", date);
    if (error) throw error;
    return data || [];
  },
  // Get class attendance summary
  async getClassAttendanceSummary(classId, startDate, endDate) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    let query = supabase.from("attendance").select(`
        student_id,
        students:student_id(name),
        status
      `).eq("user_id", user.id).eq("class_id", classId);
    if (startDate) {
      query = query.gte("date", startDate);
    }
    if (endDate) {
      query = query.lte("date", endDate);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  // Duplicate a class (copy structure)
  async duplicateClass(classId, newName) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const originalClass = await this.getClass(classId);
    const newClass = await this.createClass({
      name: newName,
      college_id: originalClass.college_id,
      description: originalClass.description,
      level: originalClass.level,
      schedule: originalClass.schedule,
      max_students: originalClass.max_students
    });
    const { data: skills, error: skillsError } = await supabase.from("class_skills").select("skill_id, order_index").eq("owner_id", user.id).eq("class_id", classId);
    if (skillsError) throw skillsError;
    if (skills && skills.length > 0) {
      const skillsToInsert = skills.map((skill) => ({
        owner_id: user.id,
        class_id: newClass.id,
        skill_id: skill.skill_id,
        order_index: skill.order_index
      }));
      const { error: insertError } = await supabase.from("class_skills").insert(skillsToInsert);
      if (insertError) throw insertError;
    }
    return newClass;
  },
  // Get class analytics
  async getClassAnalytics(classId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const classInfo = await this.getClass(classId);
    const occupancy = await this.getClassOccupancy(classId);
    const { count: skillsCount, error: skillsError } = await supabase.from("class_skills").select("*", { count: "exact", head: true }).eq("owner_id", user.id).eq("class_id", classId);
    if (skillsError) throw skillsError;
    const { data: recentAttendance, error: attendanceError } = await supabase.from("attendance").select("status").eq("user_id", user.id).eq("class_id", classId).gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0]);
    if (attendanceError) throw attendanceError;
    const totalAttendanceRecords = recentAttendance?.length || 0;
    const presentRecords = recentAttendance?.filter((a) => a.status === "P").length || 0;
    const attendanceRate = totalAttendanceRecords > 0 ? presentRecords / totalAttendanceRecords * 100 : 0;
    return {
      class: classInfo,
      enrolled_students: occupancy,
      skills_count: skillsCount || 0,
      attendance_rate: Math.round(attendanceRate * 100) / 100
    };
  }
};
let localClasses = [
  {
    id: "mock-class-1",
    user_id: "dev-user-123",
    school_id: "mock-school-1",
    name: "Principiantes Mañana",
    description: "Clase para estudiantes que están empezando con el ajedrez",
    schedule: "Lunes y Miércoles 10:00-11:30",
    max_students: 12,
    level: "beginner",
    active: true,
    room: "Aula 1",
    instructor_notes: "Enfoque en reglas básicas y movimientos fundamentales",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
  }
];
const GET = async ({ cookies, url }) => {
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: API /api/classes GET - Returning mock data for localhost");
    return json({ classes: localClasses });
  }
  try {
    const classes = await classesApi.getMyClasses();
    return json({ classes: classes || [] });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return json({ error: "Error al obtener las clases" }, { status: 500 });
  }
};
const DELETE = async ({ request, cookies, url }) => {
  console.log("🗑️ API Classes - Deleting class...");
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return json({ error: "Class ID is required" }, { status: 400 });
    }
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev) {
      console.log("🔧 DEV MODE: API /api/classes DELETE - Deleting from local storage");
      const initialLength = localClasses.length;
      localClasses = localClasses.filter((c) => c.id !== id);
      if (localClasses.length === initialLength) {
        return json({ error: "Class not found" }, { status: 404 });
      }
      console.log("✅ DEV MODE: Class deleted from local storage");
      return json({ success: true, message: "Class deleted successfully" });
    }
    const supabase2 = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase2.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/classes DELETE - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    try {
      const { data: classData, error: fetchError } = await supabase2.from("classes").select("id, user_id").eq("id", id).eq("user_id", user.id).single();
      if (fetchError || !classData) {
        console.error("❌ Class not found or access denied:", fetchError);
        return json({ error: "Class not found or access denied" }, { status: 404 });
      }
      const { error: deleteError } = await supabase2.from("classes").delete().eq("id", id).eq("user_id", user.id);
      if (deleteError) {
        console.error("❌ Error deleting class:", deleteError);
        return json({ error: "Failed to delete class" }, { status: 500 });
      }
      console.log("✅ API /api/classes DELETE - Class deleted successfully");
      return json({ success: true, message: "Class deleted successfully" });
    } catch (error) {
      console.error("❌ API /api/classes DELETE - Error:", error.message);
      return json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ API /api/classes DELETE - Request error:", error.message);
    return json({ error: "Invalid request" }, { status: 400 });
  }
};
const POST = async ({ request, cookies, url }) => {
  console.log("🎓 API Classes - Creating new class...");
  try {
    const body = await request.json();
    const { name, description, college_id, schedule, max_students, level, active, settings } = body;
    console.log("🎓 API Classes - Request data:", { name, college_id, level });
    if (max_students && (max_students < 1 || max_students > 100)) {
      return json({ error: "El número máximo de estudiantes debe estar entre 1 y 100" }, { status: 400 });
    }
    const supabase2 = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase2.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/classes POST - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    try {
      const { data: classData, error: insertError } = await supabase2.from("classes").insert({
        user_id: user.id,
        name: name?.trim() || "Clase sin nombre",
        college_id: college_id?.trim() || null
      }).select().single();
      if (insertError) {
        console.error("❌ Error creating class:", insertError);
        return json({ error: "Error al crear la clase: " + insertError.message }, { status: 500 });
      }
      console.log("✅ Class created successfully:", classData.name);
      return json({ class: classData });
    } catch (error) {
      console.error("❌ API /api/classes POST - Error:", error.message);
      return json({ error: "Error al crear la clase: " + error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Unexpected error in classes POST:", error);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST
};
