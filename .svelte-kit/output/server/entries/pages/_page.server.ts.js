import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  console.log("🔄 Home page server load - Checking authentication");
  if (locals.user) {
    console.log("🔄 User authenticated, redirecting to dashboard");
    throw redirect(302, "/dashboard");
  }
  console.log("🔄 User not authenticated, redirecting to login");
  throw redirect(302, "/login");
};
export {
  load
};
