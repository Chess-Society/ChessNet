import { json } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const GET = async ({ cookies }) => {
  console.log("🔍 Debug Colleges Test - Starting...");
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
    const { data: existingColleges, error: fetchError } = await supabase.from("colleges").select("*").eq("user_id", user.id).limit(1);
    if (fetchError) {
      console.error("❌ Error fetching colleges:", fetchError);
      return json({ error: "Failed to fetch colleges", details: fetchError }, { status: 500 });
    }
    console.log("✅ Existing colleges:", existingColleges);
    const testData = {
      name: "Test College",
      user_id: user.id
    };
    console.log("🧪 Testing insert with:", testData);
    const { data: insertData, error: insertError } = await supabase.from("colleges").insert(testData).select().single();
    if (insertError) {
      console.error("❌ Insert error:", insertError);
      return json({
        error: "Insert failed",
        details: insertError,
        testData,
        existingColleges: existingColleges || []
      }, { status: 400 });
    }
    console.log("✅ Insert successful:", insertData);
    const { error: deleteError } = await supabase.from("colleges").delete().eq("id", insertData.id);
    if (deleteError) {
      console.warn("⚠️ Could not delete test record:", deleteError);
    }
    return json({
      success: true,
      message: "Test insert successful",
      testData,
      insertResult: insertData,
      existingColleges: existingColleges || []
    });
  } catch (error) {
    console.error("❌ Debug Colleges Test - Unexpected error:", error);
    return json({
      error: error.message || "Internal server error",
      stack: error.stack
    }, { status: 500 });
  }
};
export {
  GET
};
