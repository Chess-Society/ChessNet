import { s as studentsApi } from "../../../../../chunks/students.js";
import { s as schoolsApi } from "../../../../../chunks/schools.js";
const load = async ({ locals }) => {
  console.log("🏆 Create tournament page server load - User:", locals.user?.email || "none");
  if (!locals.user) {
    return {
      user: null,
      availableStudents: [],
      availableLocations: []
    };
  }
  try {
    const [students, schools] = await Promise.all([
      studentsApi.getMyStudents(locals.user.id),
      schoolsApi.getMySchools(locals.user.id)
    ]);
    const availableStudents = students.map((s) => ({
      id: s.id,
      name: s.name,
      rating: 1200,
      // Rating base predeterminado
      college: s.college_name || "Sin centro",
      email: s.parent_email || ""
    }));
    const availableLocations = [
      ...schools.map((s) => s.name),
      "Online - Plataforma ChessNet"
    ];
    return {
      user: locals.user,
      availableStudents,
      availableLocations
    };
  } catch (err) {
    console.error("❌ Error in tournament create page server load:", err);
    return {
      user: locals.user,
      availableStudents: [],
      availableLocations: []
    };
  }
};
export {
  load
};
