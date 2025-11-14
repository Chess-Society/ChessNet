import { json } from "@sveltejs/kit";
const POST = async ({ request, locals, cookies }) => {
  try {
    console.log("🔍 Debug Schools POST - Starting...");
    console.log("🔍 Debug Schools POST - locals.user:", locals.user);
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter((c) => c.name.includes("supabase"));
    console.log("🔍 Debug Schools POST - Cookies:", {
      total: allCookies.length,
      supabase: supabaseCookies.length,
      names: supabaseCookies.map((c) => c.name)
    });
    const body = await request.json();
    console.log("🔍 Debug Schools POST - Request body:", body);
    return json({
      success: true,
      debug: {
        hasUser: !!locals.user,
        userEmail: locals.user?.email || null,
        userId: locals.user?.id || null,
        cookies: {
          total: allCookies.length,
          supabase: supabaseCookies.length,
          names: supabaseCookies.map((c) => c.name)
        },
        requestBody: body
      }
    });
  } catch (error) {
    console.error("❌ Debug Schools POST - Error:", error);
    return json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
};
export {
  POST
};
