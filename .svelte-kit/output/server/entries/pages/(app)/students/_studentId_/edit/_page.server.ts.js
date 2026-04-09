import { error } from "@sveltejs/kit";
import { s as studentsApi } from "../../../../../../chunks/students.js";
import { s as schoolsApi } from "../../../../../../chunks/schools.js";
const load = async ({ locals, params }) => {
  console.log("✏️ Edit student page server load - User:", locals.user?.email || "none");
  const studentId = params.studentId;
  if (!locals.user) {
    throw error(401, "Usuario no autenticado");
  }
  try {
    const [student, schools] = await Promise.all([
      studentsApi.getStudent(studentId, locals.user.id),
      schoolsApi.getMySchools(locals.user.id)
    ]);
    return {
      user: locals.user,
      student,
      schools
    };
  } catch (err) {
    console.error("❌ Error in edit student page:", err);
    if (err.status) throw err;
    throw error(404, "Estudiante no encontrado o error al cargar los datos");
  }
};
export {
  load
};
