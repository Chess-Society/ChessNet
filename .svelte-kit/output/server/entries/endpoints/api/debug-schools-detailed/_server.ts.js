import { json } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const POST = async ({ request, cookies, locals }) => {
  console.log("🔍 Debug Schools Detailed - Starting detailed test...");
  try {
    const body = await request.json();
    console.log("🔍 Debug Schools Detailed - Request body:", body);
    const localsUser = locals.user;
    console.log("🔍 Debug Schools Detailed - locals.user:", localsUser ? `Found (${localsUser.email})` : "Not found");
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        flowType: "pkce"
      },
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
    console.log("🔍 Debug Schools Detailed - Supabase user:", supabaseUser ? `Found (${supabaseUser.email})` : "Not found", "Error:", userError?.message);
    if (userError || !supabaseUser) {
      return json({
        success: false,
        error: "Supabase authentication failed",
        details: {
          userError: userError?.message,
          hasUser: !!supabaseUser
        }
      }, { status: 401 });
    }
    const { name, city, country, address, phone, email, website } = body;
    const collegeData = {
      name: name?.trim() || "Centro sin nombre",
      city: city?.trim() || null,
      country: country?.trim() || "ES",
      address: address?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      website: website?.trim() || null,
      user_id: supabaseUser.id
    };
    console.log("🔍 Debug Schools Detailed - College data to insert:", collegeData);
    const { data, error } = await supabase.from("colleges").insert(collegeData).select().single();
    if (error) {
      console.error("❌ Debug Schools Detailed - Database error:", error);
      return json({
        success: false,
        error: "Database insertion failed",
        details: {
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      }, { status: 400 });
    }
    console.log("✅ Debug Schools Detailed - College created successfully:", data.id);
    return json({
      success: true,
      college: data,
      message: "College created successfully"
    });
  } catch (error) {
    console.error("❌ Debug Schools Detailed - Unexpected error:", error);
    return json({
      success: false,
      error: "Unexpected error",
      details: {
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 });
  }
};
export {
  POST
};
