import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../../chunks/public.js";
import { json } from "@sveltejs/kit";
const PUT = async ({ request, cookies, url, params }) => {
  console.log("🏫 API Schools [id] - Updating school...");
  try {
    const body = await request.json();
    const schoolId = params.id;
    console.log("🏫 API Schools [id] - Update data:", { schoolId, body });
    if (!schoolId) {
      return json({ error: "School ID is required" }, { status: 400 });
    }
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev) {
      console.log("🔧 DEV MODE: API /api/schools/[id] PUT - Updating mock school for localhost");
      const updatedSchool = {
        id: schoolId,
        user_id: "dev-user-123",
        ...body,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log("✅ Mock school updated:", schoolId);
      return json({ school: updatedSchool });
    }
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/schools/[id] PUT - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    try {
      console.log("✅ API /api/schools/[id] PUT - Updating school for user:", user.email);
      const { data: school, error } = await supabase.from("colleges").update({
        ...body,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", schoolId).eq("user_id", user.id).select().single();
      if (error) {
        console.error("❌ API /api/schools/[id] PUT - Database error:", error.message);
        return json({ error: error.message }, { status: 400 });
      }
      if (!school) {
        return json({ error: "School not found" }, { status: 404 });
      }
      console.log("✅ API /api/schools/[id] PUT - School updated:", school.id);
      return json({ school });
    } catch (error) {
      console.error("❌ API /api/schools/[id] PUT - Error:", error.message);
      return json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ API /api/schools/[id] PUT - Request error:", error.message);
    return json({ error: "Invalid request" }, { status: 400 });
  }
};
export {
  PUT
};
