import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
import { json } from "@sveltejs/kit";
const GET = async ({ cookies }) => {
  console.log("🔍 Debug Colleges - Checking colleges table structure...");
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options)
    }
  });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }
  try {
    console.log("🔍 Debug Colleges - Trying to query colleges table...");
    const { data: allColleges, error: allError } = await supabase.from("colleges").select("*").limit(5);
    console.log("🔍 Debug Colleges - All colleges query result:", {
      success: !allError,
      error: allError?.message,
      count: allColleges?.length || 0,
      sample: allColleges?.[0] || null
    });
    const { data: userColleges, error: userError2 } = await supabase.from("colleges").select("*").eq("user_id", user.id).limit(5);
    console.log("🔍 Debug Colleges - User colleges query result:", {
      success: !userError2,
      error: userError2?.message,
      count: userColleges?.length || 0
    });
    return json({
      user: {
        id: user.id,
        email: user.email
      },
      allColleges: {
        success: !allError,
        error: allError?.message,
        count: allColleges?.length || 0,
        sample: allColleges?.[0] || null
      },
      userColleges: {
        success: !userError2,
        error: userError2?.message,
        count: userColleges?.length || 0,
        data: userColleges || []
      }
    });
  } catch (error) {
    console.error("❌ Debug Colleges - Unexpected error:", error);
    return json({ error: error.message }, { status: 500 });
  }
};
export {
  GET
};
