import { error } from "@sveltejs/kit";
import { s as schoolsApi } from "../../../../../../chunks/schools.js";
const load = async ({ locals, params }) => {
  const schoolId = params.schoolId;
  if (!locals.user) {
    throw error(401, "Usuario no autenticado");
  }
  const countries = [
    { code: "ES", name: "España" },
    { code: "FR", name: "Francia" },
    { code: "PT", name: "Portugal" },
    { code: "IT", name: "Italia" }
  ];
  const insuranceCompanies = [
    "Mapfre Seguros",
    "Allianz Seguros",
    "AXA Seguros"
  ];
  try {
    const school = await schoolsApi.getSchool(schoolId, locals.user.id);
    return {
      user: locals.user,
      school,
      countries,
      insuranceCompanies
    };
  } catch (err) {
    console.error("❌ Error in edit school page:", err);
    if (err.status) throw err;
    throw error(404, "Centro no encontrado o error al cargar los datos");
  }
};
export {
  load
};
