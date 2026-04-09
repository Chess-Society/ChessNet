import { s as schoolsApi } from "../../../../chunks/schools.js";
import { s as studentsApi } from "../../../../chunks/students.js";
import { c as classesApi } from "../../../../chunks/classes.js";
import "../../../../chunks/firebase.js";
import "firebase/firestore";
import "@sveltejs/kit";
const load = async ({ locals }) => {
  console.log("📊 Attendance Dashboard - User:", locals.user?.email || "none");
  if (!locals.user) {
    return {
      user: null,
      attendanceData: {
        todayStats: { totalClasses: 0, classesWithAttendance: 0, totalStudents: 0, presentStudents: 0, absentStudents: 0, attendanceRate: 0 },
        centersWithClasses: [],
        recentAttendance: [],
        upcomingClasses: []
      }
    };
  }
  try {
    const userId = locals.user.id;
    const [schools, allStudents] = await Promise.all([
      schoolsApi.getMySchools(userId),
      studentsApi.getMyStudents(userId)
    ]);
    const allSchoolsWithClasses = await Promise.all(schools.map(async (school) => {
      const classes = await classesApi.getClassesBySchool(school.id, userId);
      const schoolStudents = allStudents.filter((s) => s.college_id === school.id);
      return {
        id: school.id,
        name: school.name,
        city: school.city,
        totalClasses: classes.length,
        classesToday: 0,
        // Simplificación: lógica de calendario no implementada aún
        totalStudents: schoolStudents.length,
        attendanceRate: 0,
        nextClass: null,
        classes: classes.map((c) => ({
          id: c.id,
          name: c.name,
          time: c.schedule || "Sin horario",
          students: 0,
          present: 0,
          absent: 0,
          attendanceRate: 0,
          attendanceTaken: false,
          lastAttendance: null
        }))
      };
    }));
    const attendanceData = {
      todayStats: {
        totalClasses: allSchoolsWithClasses.reduce((sum, s) => sum + s.totalClasses, 0),
        classesWithAttendance: 0,
        totalStudents: allStudents.length,
        presentStudents: 0,
        absentStudents: 0,
        attendanceRate: 0
      },
      centersWithClasses: allSchoolsWithClasses,
      recentAttendance: [],
      upcomingClasses: []
    };
    return {
      user: locals.user,
      attendanceData
    };
  } catch (err) {
    console.error("❌ Error loading attendance data:", err);
    return {
      user: locals.user,
      attendanceData: {
        todayStats: { totalClasses: 0, classesWithAttendance: 0, totalStudents: 0, presentStudents: 0, absentStudents: 0, attendanceRate: 0 },
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
