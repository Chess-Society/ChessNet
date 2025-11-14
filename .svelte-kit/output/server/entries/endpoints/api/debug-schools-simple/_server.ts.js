import { json } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const POST = async ({ request, cookies }) => {
  console.log("🔍 Debug Schools Simple - Starting test...");
  try {
    const body = await request.json();
    console.log("🔍 Debug Schools Simple - Request body:", body);
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    console.log("🔍 Debug Schools Simple - Testing Supabase connection...");
    const { data: testData, error: testError } = await supabase.from("colleges").select("count").limit(1);
    console.log("🔍 Debug Schools Simple - Connection test:", {
      hasData: !!testData,
      error: testError?.message || "none"
    });
    console.log("🔍 Debug Schools Simple - Testing insert...");
    const testCollegeData = {
      name: "Test College Debug",
      city: "Madrid",
      country: "ES",
      user_id: "550e8400-e29b-41d4-a716-446655440000"
      // UUID de prueba
    };
    console.log("🔍 Debug Schools Simple - Insert data:", testCollegeData);
    const { data: insertData, error: insertError } = await supabase.from("colleges").insert(testCollegeData).select().single();
    console.log("🔍 Debug Schools Simple - Insert result:", {
      hasData: !!insertData,
      error: insertError?.message || "none",
      data: insertData
    });
    return json({
      success: true,
      receivedBody: body,
      connectionTest: {
        success: !testError,
        error: testError?.message || null
      },
      insertTest: {
        success: !insertError,
        error: insertError?.message || null,
        data: insertData
      },
      message: "Debug test completed"
    });
  } catch (error) {
    console.error("❌ Debug Schools Simple - Unexpected error:", error);
    return json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 });
  }
};
export {
  POST
};
