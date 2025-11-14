import { json } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const GET = async ({ cookies }) => {
  console.log("🔍 Debug Students Schema - Starting...");
  try {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      auth: { flowType: "pkce" },
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return json({ error: "Not authenticated", details: userError }, { status: 401 });
    }
    console.log("✅ User authenticated:", user.email);
    const testData = {
      user_id: user.id,
      name: "Test Student Schema",
      first_name: "Test",
      last_name: "Student",
      avatar: "https://example.com/avatar.jpg",
      notes: "Test notes"
    };
    console.log("🧪 Testing with data:", testData);
    const { data, error } = await supabase.from("students").insert(testData).select().single();
    if (error) {
      console.log("❌ Insert failed:", error);
      return json({
        error: "Insert failed",
        details: error,
        testData,
        message: "This shows which columns are causing issues"
      }, { status: 400 });
    }
    console.log("✅ Insert successful:", data);
    await supabase.from("students").delete().eq("id", data.id);
    return json({
      success: true,
      message: "All columns exist and are valid",
      insertedData: data
    });
  } catch (error) {
    console.error("❌ Debug Students Schema Error:", error);
    return json({
      error: "Debug failed",
      details: error.message
    }, { status: 500 });
  }
};
export {
  GET
};
