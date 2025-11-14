import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
function createSupabaseServerClient(cookies) {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      flowType: "pkce"
    },
    cookies: {
      get: (key) => {
        return cookies.get(key);
      },
      set: (key, value, options) => {
        cookies.set(key, value, {
          ...options,
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax"
        });
      },
      remove: (key, options) => {
        cookies.delete(key, { ...options, path: "/" });
      }
    }
  });
}
const schoolsServerApi = {
  // Get all schools for the current user
  async getMySchools(cookies) {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from("colleges").select("*").eq("user_id", user.id);
    if (error) throw error;
    return data || [];
  },
  // Get a specific school
  async getSchool(id, cookies) {
    const supabase = createSupabaseServerClient(cookies);
    const { data, error } = await supabase.from("colleges").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },
  // Create a new school
  async createSchool(name, cookies, city) {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    console.log("🏫 Creating school for user:", user.email, "with owner_id:", user.id);
    const { data, error } = await supabase.from("colleges").insert({
      name,
      city,
      user_id: user.id,
      // Usar user_id en lugar de owner_id
      created_by: user.id
      // También establecer created_by
    }).select().single();
    if (error) {
      console.error("❌ Error creating school:", error);
      throw error;
    }
    console.log("✅ School created successfully:", data.id);
    await this.addMember(data.id, user.id, "owner", cookies);
    try {
      await supabase.rpc("initialize_school_data", { school_uuid: data.id });
      console.log("✅ School data initialized successfully");
    } catch (initError) {
      console.warn("⚠️ Warning: Could not initialize school data:", initError);
    }
    return data;
  },
  // Update a school
  async updateSchool(id, updates, cookies) {
    const supabase = createSupabaseServerClient(cookies);
    const { data, error } = await supabase.from("colleges").update({
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  // Delete a school
  async deleteSchool(id, cookies) {
    const supabase = createSupabaseServerClient(cookies);
    const { error } = await supabase.from("colleges").delete().eq("id", id);
    if (error) throw error;
  },
  // Add a member to a school
  async addMember(schoolId, userId, role, cookies) {
    const supabase = createSupabaseServerClient(cookies);
    const { data, error } = await supabase.from("memberships").insert({
      school_id: schoolId,
      user_id: userId,
      role
    }).select().single();
    if (error) throw error;
    return data;
  },
  // Check if user is member of school
  async isMember(schoolId, cookies) {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data, error } = await supabase.from("memberships").select("id").eq("school_id", schoolId).eq("user_id", user.id).single();
    return !error && !!data;
  },
  // Get user's role in school
  async getUserRole(schoolId, cookies) {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from("memberships").select("role").eq("school_id", schoolId).eq("user_id", user.id).single();
    if (error) return null;
    return data.role;
  }
};
const load = async ({ locals, url }) => {
  console.log("📊 Attendance Dashboard - User:", locals.user?.email || "none");
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Attendance Dashboard - Using mock data");
    const mockAttendanceData = {
      todayStats: {
        totalClasses: 8,
        classesWithAttendance: 5,
        totalStudents: 45,
        presentStudents: 38,
        absentStudents: 7,
        attendanceRate: 84.4
      },
      centersWithClasses: [
        {
          id: "mock-school-1",
          name: "Centro de Desarrollo Local",
          city: "Madrid",
          totalClasses: 3,
          classesToday: 2,
          totalStudents: 20,
          attendanceRate: 85,
          nextClass: "2024-01-15T10:00:00Z",
          classes: [
            {
              id: "mock-class-1",
              name: "Principiantes Mañana",
              time: "10:00",
              students: 12,
              present: 10,
              absent: 2,
              attendanceRate: 83.3,
              attendanceTaken: true,
              lastAttendance: "2024-01-15T10:15:00Z"
            },
            {
              id: "mock-class-2",
              name: "Intermedios Tarde",
              time: "16:00",
              students: 8,
              present: 7,
              absent: 1,
              attendanceRate: 87.5,
              attendanceTaken: true,
              lastAttendance: "2024-01-15T16:10:00Z"
            }
          ]
        }
      ],
      recentAttendance: [
        {
          id: "att-1",
          className: "Principiantes Mañana",
          centerName: "Centro de Desarrollo Local",
          date: "2024-01-15T10:15:00Z",
          students: 12,
          present: 10,
          absent: 2,
          attendanceRate: 83.3
        },
        {
          id: "att-2",
          className: "Intermedios Tarde",
          centerName: "Centro de Desarrollo Local",
          date: "2024-01-15T16:10:00Z",
          students: 8,
          present: 7,
          absent: 1,
          attendanceRate: 87.5
        }
      ],
      upcomingClasses: [
        {
          id: "mock-class-3",
          name: "Avanzados Noche",
          centerName: "Centro de Desarrollo Local",
          time: "19:00",
          students: 15,
          attendanceTaken: false
        }
      ]
    };
    return {
      user: locals.user,
      attendanceData: mockAttendanceData
    };
  }
  try {
    const schools = await schoolsServerApi.getMySchools(locals.cookies);
    const attendanceData = {
      todayStats: {
        totalClasses: 0,
        classesWithAttendance: 0,
        totalStudents: 0,
        presentStudents: 0,
        absentStudents: 0,
        attendanceRate: 0
      },
      centersWithClasses: schools.map((school) => ({
        id: school.id,
        name: school.name,
        city: school.city,
        totalClasses: 0,
        classesToday: 0,
        totalStudents: 0,
        attendanceRate: 0,
        nextClass: null,
        classes: []
      })),
      recentAttendance: [],
      upcomingClasses: []
    };
    return {
      user: locals.user,
      attendanceData
    };
  } catch (error) {
    console.error("❌ Error loading attendance data:", error);
    return {
      user: locals.user,
      attendanceData: {
        todayStats: {
          totalClasses: 0,
          classesWithAttendance: 0,
          totalStudents: 0,
          presentStudents: 0,
          absentStudents: 0,
          attendanceRate: 0
        },
        centersWithClasses: [],
        recentAttendance: [],
        upcomingClasses: []
      }
    };
  }
};
export {
  load
};
