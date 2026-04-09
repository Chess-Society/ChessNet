import { s as schoolsApi } from "../../../../../chunks/schools.js";
const load = async ({ locals }) => {
  console.log("🎓 Classes create page server load - User:", locals.user?.email || "none");
  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }
  try {
    const schools = await schoolsApi.getMySchools(locals.user.id);
    console.log("✅ Schools loaded successfully:", schools?.length || 0);
    return {
      user: locals.user,
      schools: schools || []
    };
  } catch (err) {
    console.error("❌ Error in classes create page load:", err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
export {
  load
};
