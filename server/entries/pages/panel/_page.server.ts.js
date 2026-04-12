import { redirect } from "@sveltejs/kit";
import { s as schoolsApi } from "../../../chunks/schools.js";
import { s as studentsApi } from "../../../chunks/students.js";
import { c as classesApi } from "../../../chunks/classes.js";
const load = async ({ locals, url }) => {
  console.log("📊 Dashboard server load - User:", locals.user?.email || "none");
  const code = url.searchParams.get("code");
  if (code) {
    throw redirect(302, `/auth/callback?code=${code}`);
  }
  if (!locals.user) {
    return {
      user: null
    };
  }
  try {
    const [schools, students, classes] = await Promise.all([
      schoolsApi.getMySchools(locals.user.id),
      studentsApi.getMyStudents(locals.user.id),
      classesApi.getMyClasses(locals.user.id)
    ]);
    const dashboardStats = {
      totalCenters: schools.length,
      totalStudents: students.length,
      totalClasses: classes.length,
      activeStudents: students.filter((s) => s.active !== false).length,
      monthlyRevenue: 0,
      // Implementar cuando el sistema de pagos esté listo
      upcomingSessions: classes.filter((c) => c.active !== false).length
    };
    const centersWithStats = schools.map((school) => {
      const schoolClasses = classes.filter((c) => c.college_id === school.id);
      const schoolStudents = students.filter((s) => s.college_id === school.id);
      return {
        id: school.id,
        name: school.name,
        city: school.city || "Sin ciudad",
        totalClasses: schoolClasses.length,
        totalStudents: schoolStudents.length,
        occupancyRate: schoolClasses.length > 0 ? Math.round(schoolStudents.length / (schoolClasses.length * 15) * 100) : 0,
        attendanceRate: 0,
        // Implementar con sistema de asistencia
        monthlyRevenue: 0,
        lastActivity: school.updated_at || school.created_at
      };
    });
    console.log("✅ Dashboard loaded successfully from Firebase");
    return {
      user: locals.user,
      dashboardStats,
      centersWithStats,
      featuredClasses: classes.slice(0, 3),
      recentActivity: [],
      // Implementar log de actividades si es necesario
      upcomingSessionsToday: classes.slice(0, 4)
    };
  } catch (err) {
    console.error("❌ Error in dashboard load:", err);
    return {
      user: locals.user,
      dashboardStats: {
        totalCenters: 0,
        totalStudents: 0,
        totalClasses: 0,
        activeStudents: 0,
        monthlyRevenue: 0,
        upcomingSessions: 0
      },
      centersWithStats: [],
      featuredClasses: [],
      recentActivity: [],
      upcomingSessionsToday: []
    };
  }
};
export {
  load
};
