import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
import { json } from "@sveltejs/kit";
const GET = async ({ cookies, url }) => {
  console.log("🔍 Debug Classes Detailed - Getting detailed info...");
  try {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ Debug Classes Detailed - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    console.log("✅ Debug Classes Detailed - User:", user.email, "ID:", user.id);
    try {
      const { data: tableTest, error: tableError } = await supabase.from("classes").select("id").limit(1);
      console.log("📋 Table test result:", { tableTest, tableError });
      const { data: allClasses, error: allClassesError } = await supabase.from("classes").select("*").order("created_at", { ascending: false });
      console.log("📋 All classes result:", { allClasses, allClassesError });
      const { data: userClasses, error: userClassesError } = await supabase.from("classes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      console.log("📋 User classes result:", { userClasses, userClassesError });
      const { data: similarClasses, error: similarError } = await supabase.from("classes").select("*").ilike("name", "%Principiantes%").order("created_at", { ascending: false });
      console.log("📋 Similar classes result:", { similarClasses, similarError });
      return json({
        user: {
          id: user.id,
          email: user.email
        },
        tableTest: {
          exists: !tableError,
          error: tableError?.message
        },
        allClasses: allClasses || [],
        userClasses: userClasses || [],
        similarClasses: similarClasses || [],
        errors: {
          allClasses: allClassesError?.message,
          userClasses: userClassesError?.message,
          similar: similarError?.message
        }
      });
    } catch (error) {
      console.error("❌ Debug Classes Detailed - Error:", error.message);
      return json({
        error: error.message,
        user: {
          id: user.id,
          email: user.email
        }
      });
    }
  } catch (error) {
    console.error("❌ Debug Classes Detailed - Request error:", error.message);
    return json({ error: "Invalid request" }, { status: 400 });
  }
};
export {
  GET
};
