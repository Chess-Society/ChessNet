import { s as studentsApi } from "../../../../chunks/students.js";
import { s as schoolsApi } from "../../../../chunks/schools.js";
const load = async ({ locals }) => {
  console.log("👥 Students page server load - User:", locals.user?.email || "none");
  if (!locals.user) {
    return {
      user: null,
      students: [],
      stats: { total: 0, schools: {}, newest: null },
      schools: []
    };
  }
  try {
    const [students, schools] = await Promise.all([
      studentsApi.getMyStudents(locals.user.id),
      schoolsApi.getMySchools(locals.user.id)
    ]);
    const schoolCounts = {};
    students.forEach((s) => {
      if (s.college_id) {
        schoolCounts[s.college_id] = (schoolCounts[s.college_id] || 0) + 1;
      }
    });
    const stats = {
      total: students.length,
      schools: schoolCounts,
      newest: students[0]?.created_at || null
    };
    return {
      user: locals.user,
      students,
      stats,
      schools
    };
  } catch (err) {
    console.error("❌ Error in students page load:", err);
    return {
      user: locals.user,
      students: [],
      stats: { total: 0, schools: {}, newest: null },
      schools: []
    };
  }
};
export {
  load
};
