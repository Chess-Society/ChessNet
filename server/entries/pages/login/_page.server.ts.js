import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  console.log("🔄 Login page server load - Checking authentication");
  if (locals.user) {
    console.log("✅ User already authenticated, redirecting to dashboard");
    throw redirect(302, "/dashboard");
  }
  console.log("❌ User not authenticated, showing login page");
  return {
    user: null
  };
};
export {
  load
};
