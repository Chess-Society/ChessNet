import { s as schoolsApi } from "../../../../../chunks/schools.js";
const load = async ({ locals }) => {
  console.log("👥 Students create page server load - User:", locals.user?.email || "none");
  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }
  try {
    const schools = await schoolsApi.getMySchools(locals.user.id);
    return {
      user: locals.user,
      schools
    };
  } catch (err) {
    console.error("❌ Error in students create page load:", err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
export {
  load
};
