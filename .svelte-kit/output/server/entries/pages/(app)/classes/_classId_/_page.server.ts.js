import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../../chunks/public.js";
const load = async ({ locals, url, params, cookies }) => {
  console.log("🎓 Individual class page server load - User:", locals.user?.email || "none");
  console.log("🎓 Class ID:", params.classId);
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Individual class page - Fetching from API");
    const classId = params.classId;
    const apiResponse = await fetch(`http://localhost:5173/api/classes`);
    const apiData = await apiResponse.json();
    const mockClasses = apiData.classes || [];
    const mockEnrolledStudents = [
      // Estudiantes en mock-class-1
      {
        id: "cs-001",
        owner_id: "dev-user-123",
        class_id: "mock-class-1",
        student_id: "mock-student-1",
        enrolled_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString(),
        status: "active",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString(),
        student: {
          id: "mock-student-1",
          user_id: "dev-user-123",
          name: "Ana García Martín",
          age: 8,
          level: "beginner",
          email: "ana.garcia@email.com",
          phone: "+34 666 111 111",
          emergency_contact: "Madre: Carmen Martín (+34 666 111 112)",
          school_id: "mock-school-1",
          active: true,
          notes: "Muy entusiasta, aprende rápido los movimientos básicos",
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1e3).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3).toISOString()
        }
      },
      {
        id: "cs-002",
        owner_id: "dev-user-123",
        class_id: "mock-class-1",
        student_id: "mock-student-2",
        enrolled_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString(),
        status: "active",
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString(),
        student: {
          id: "mock-student-2",
          user_id: "dev-user-123",
          name: "Carlos López Silva",
          age: 7,
          level: "beginner",
          email: "carlos.lopez@email.com",
          phone: "+34 666 222 222",
          emergency_contact: "Padre: José López (+34 666 222 223)",
          school_id: "mock-school-1",
          active: true,
          notes: "Necesita más práctica con las reglas básicas",
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1e3).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
        }
      },
      {
        id: "cs-003",
        owner_id: "dev-user-123",
        class_id: "mock-class-1",
        student_id: "mock-student-3",
        enrolled_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1e3).toISOString(),
        status: "active",
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1e3).toISOString(),
        student: {
          id: "mock-student-3",
          user_id: "dev-user-123",
          name: "María Rodríguez Pérez",
          age: 9,
          level: "beginner",
          email: "maria.rodriguez@email.com",
          phone: "+34 666 333 333",
          emergency_contact: "Madre: Isabel Pérez (+34 666 333 334)",
          school_id: "mock-school-1",
          active: true,
          notes: "Excelente concentración, ya domina movimientos básicos",
          created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1e3).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
        }
      }
    ];
    const mockClassSkills = [
      {
        id: "skill-class-001",
        owner_id: "dev-user-123",
        class_id: "mock-class-1",
        skill_id: "skill-001",
        order_index: 1,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString(),
        skill: {
          id: "skill-001",
          user_id: "dev-user-123",
          category_id: "cat-001",
          name: "Movimiento de Peones",
          description: "Aprender cómo se mueven los peones y sus reglas especiales",
          difficulty: 1,
          order_index: 1,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1e3).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3).toISOString(),
          category: { id: "cat-001", name: "Movimientos Básicos", color: "#10B981" }
        }
      },
      {
        id: "skill-class-002",
        owner_id: "dev-user-123",
        class_id: "mock-class-1",
        skill_id: "skill-002",
        order_index: 2,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString(),
        skill: {
          id: "skill-002",
          user_id: "dev-user-123",
          category_id: "cat-001",
          name: "Movimiento de Torres",
          description: "Cómo se mueven las torres: horizontal y vertical",
          difficulty: 1,
          order_index: 2,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1e3).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3).toISOString(),
          category: { id: "cat-001", name: "Movimientos Básicos", color: "#10B981" }
        }
      },
      {
        id: "skill-class-003",
        owner_id: "dev-user-123",
        class_id: "mock-class-1",
        skill_id: "skill-003",
        order_index: 3,
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString(),
        skill: {
          id: "skill-003",
          user_id: "dev-user-123",
          category_id: "cat-002",
          name: "Jaque y Jaque Mate",
          description: "Entender qué es jaque y cómo dar jaque mate",
          difficulty: 2,
          order_index: 1,
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1e3).toISOString(),
          updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1e3).toISOString(),
          category: { id: "cat-002", name: "Reglas Fundamentales", color: "#F59E0B" }
        }
      }
    ];
    const mockAttendanceStats = {
      total_sessions: 12,
      average_attendance_rate: 85,
      average_punctuality_rate: 92,
      most_attended_date: "2024-01-17",
      least_attended_date: "2024-01-15",
      last_session_date: "2024-01-22",
      next_session_date: "2024-01-24"
    };
    const currentClass = mockClasses.find((c) => c.id === classId);
    if (!currentClass) {
      throw new Error("Class not found");
    }
    const enrolledStudents = mockEnrolledStudents.filter((enrollment) => enrollment.class_id === classId && enrollment.status === "active").map((enrollment) => ({
      ...enrollment.student,
      enrollment_date: enrollment.enrolled_at,
      enrollment_status: enrollment.status
    }));
    const classSkills = mockClassSkills.filter((cs) => cs.class_id === classId).sort((a, b) => a.order_index - b.order_index);
    const classStats = {
      total_students: enrolledStudents.length,
      capacity: currentClass.max_students,
      occupancy_rate: Math.round(enrolledStudents.length / currentClass.max_students * 100),
      active_students: enrolledStudents.filter((s) => s.active).length,
      inactive_students: enrolledStudents.filter((s) => !s.active).length,
      total_skills: classSkills.length,
      skills_by_category: classSkills.reduce((acc, cs) => {
        const categoryName = cs.skill.category?.name || "Sin categoría";
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {}),
      average_age: enrolledStudents.length > 0 ? Math.round(enrolledStudents.reduce((sum, s) => sum + s.age, 0) / enrolledStudents.length) : 0,
      level_distribution: enrolledStudents.reduce((acc, s) => {
        acc[s.level] = (acc[s.level] || 0) + 1;
        return acc;
      }, {})
    };
    return {
      user: locals.user,
      class: currentClass,
      students: enrolledStudents,
      classSkills,
      classStats,
      attendanceStats: mockAttendanceStats
    };
  }
  console.log("🌐 PRODUCTION MODE: Individual class page - Fetching data from Supabase");
  if (!locals.user) {
    console.log("❌ No user found, redirecting to login");
    return {
      user: null,
      class: null,
      students: [],
      classSkills: [],
      classStats: { total_students: 0, capacity: 0, occupancy_rate: 0, active_students: 0, inactive_students: 0, total_skills: 0, skills_by_category: {}, average_age: 0, level_distribution: {} },
      attendanceStats: { total_sessions: 0, average_attendance_rate: 0, average_punctuality_rate: 0, most_attended_date: "", least_attended_date: "", last_session_date: "", next_session_date: "" }
    };
  }
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => cookies.get(name),
      set: (name, value, options) => cookies.set(name, value, options),
      remove: (name, options) => cookies.delete(name, options)
    }
  });
  try {
    const classId = params.classId;
    const { data: classData, error: classError } = await supabase.from("classes").select("*").eq("id", classId).eq("user_id", locals.user.id).single();
    if (classError || !classData) {
      console.error("❌ Error fetching class:", classError);
      return {
        user: locals.user,
        class: null,
        students: [],
        classSkills: [],
        classStats: { total_students: 0, capacity: 0, occupancy_rate: 0, active_students: 0, inactive_students: 0, total_skills: 0, skills_by_category: {}, average_age: 0, level_distribution: {} },
        attendanceStats: { total_sessions: 0, average_attendance_rate: 0, average_punctuality_rate: 0, most_attended_date: "", least_attended_date: "", last_session_date: "", next_session_date: "" }
      };
    }
    const { data: enrollments, error: enrollmentsError } = await supabase.from("class_students").select(`
        *,
        students (
          id,
          first_name,
          last_name,
          email,
          date_of_birth,
          chess_level,
          active,
          notes
        )
      `).eq("class_id", classId).eq("active", true);
    if (enrollmentsError) {
      console.error("❌ Error fetching enrollments:", enrollmentsError);
    }
    const students = enrollments?.map((enrollment) => ({
      ...enrollment.students,
      enrollment_date: enrollment.enrolled_at,
      enrollment_status: enrollment.status
    })) || [];
    const { data: classSkills, error: skillsError } = await supabase.from("class_skills").select(`
        *,
        skills (
          id,
          name,
          description,
          difficulty,
          order_index,
          categories (
            id,
            name,
            color
          )
        )
      `).eq("class_id", classId).order("order_index");
    if (skillsError) {
      console.error("❌ Error fetching class skills:", skillsError);
    }
    const classStats = {
      total_students: students.length,
      capacity: classData.max_students,
      occupancy_rate: Math.round(students.length / classData.max_students * 100),
      active_students: students.filter((s) => s.active).length,
      inactive_students: students.filter((s) => !s.active).length,
      total_skills: classSkills?.length || 0,
      skills_by_category: (classSkills || []).reduce((acc, cs) => {
        const categoryName = cs.skills?.categories?.name || "Sin categoría";
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {}),
      average_age: students.length > 0 ? Math.round(students.reduce((sum, s) => {
        if (s.date_of_birth) {
          const age = (/* @__PURE__ */ new Date()).getFullYear() - new Date(s.date_of_birth).getFullYear();
          return sum + age;
        }
        return sum + 8;
      }, 0) / students.length) : 0,
      level_distribution: students.reduce((acc, s) => {
        acc[s.chess_level] = (acc[s.chess_level] || 0) + 1;
        return acc;
      }, {})
    };
    const attendanceStats = {
      total_sessions: 0,
      average_attendance_rate: 0,
      average_punctuality_rate: 0,
      most_attended_date: "",
      least_attended_date: "",
      last_session_date: "",
      next_session_date: ""
    };
    console.log("✅ Individual class data loaded successfully");
    return {
      user: locals.user,
      class: classData,
      students,
      classSkills: classSkills || [],
      classStats,
      attendanceStats
    };
  } catch (err) {
    console.error("❌ Error in individual class page load:", err);
    return {
      user: locals.user,
      class: null,
      students: [],
      classSkills: [],
      classStats: { total_students: 0, capacity: 0, occupancy_rate: 0, active_students: 0, inactive_students: 0, total_skills: 0, skills_by_category: {}, average_age: 0, level_distribution: {} },
      attendanceStats: { total_sessions: 0, average_attendance_rate: 0, average_punctuality_rate: 0, most_attended_date: "", least_attended_date: "", last_session_date: "", next_session_date: "" }
    };
  }
};
export {
  load
};
