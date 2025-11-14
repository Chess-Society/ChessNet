import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
import { json } from "@sveltejs/kit";
let localSchools = [];
const GET = async ({ cookies, url }) => {
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: API /api/schools GET - Using REAL data from Supabase");
    const supabase2 = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    try {
      const { data: schools, error: schoolsError } = await supabase2.from("colleges").select("*").eq("user_id", "550e8400-e29b-41d4-a716-446655440000").order("created_at", { ascending: false });
      if (schoolsError) {
        console.error("❌ Error fetching schools in DEV MODE:", schoolsError);
        return json({ schools: [] });
      }
      console.log("✅ DEV MODE: Schools loaded with REAL data:", schools?.length || 0, "schools");
      return json({ schools: schools || [] });
    } catch (err) {
      console.error("❌ Error in DEV MODE schools API:", err);
      return json({ schools: [] });
    }
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
    console.error("❌ API /api/schools GET - User not authenticated:", userError?.message);
    return json({ error: "User not authenticated" }, { status: 401 });
  }
  try {
    console.log("✅ API /api/schools GET - Getting schools for user:", user.email);
    const { data: testData, error: testError } = await supabase.from("colleges").select("id").limit(1);
    if (testError) {
      console.error("❌ API /api/schools GET - Colleges table not accessible:", testError.message);
      return json({ schools: [], warning: "Colleges table not ready yet" });
    }
    const { data: schools, error } = await supabase.from("colleges").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) {
      console.error("❌ API /api/schools GET - Database error:", error.message);
      if (error.message.includes('column "user_id"') || error.message.includes("user_id")) {
        console.log("⚠️ API /api/schools GET - user_id column not found, returning empty array");
        return json({ schools: [], warning: "Database schema needs migration" });
      }
      console.log("⚠️ API /api/schools GET - Database error, returning empty array");
      return json({ schools: [], warning: "Database temporarily unavailable" });
    }
    console.log("✅ API /api/schools GET - Found schools:", schools?.length || 0);
    return json({ schools: schools || [] });
  } catch (error) {
    console.error("❌ API /api/schools GET - Error:", error.message);
    return json({ schools: [], warning: "Service temporarily unavailable" });
  }
};
const DELETE = async ({ request, cookies, url }) => {
  console.log("🗑️ API Schools - Deleting school...");
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return json({ error: "School ID is required" }, { status: 400 });
    }
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev) {
      console.log("🔧 DEV MODE: API /api/schools DELETE - Deleting from Supabase");
      const supabase2 = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
          get: (key) => cookies.get(key),
          set: (key, value, options) => cookies.set(key, value, options),
          remove: (key, options) => cookies.delete(key, options)
        }
      });
      try {
        const { data: school, error: fetchError } = await supabase2.from("colleges").select("id, user_id").eq("id", id).eq("user_id", "550e8400-e29b-41d4-a716-446655440000").single();
        if (fetchError || !school) {
          console.error("❌ School not found or access denied:", fetchError);
          return json({ error: "School not found or access denied" }, { status: 404 });
        }
        const { error: deleteError } = await supabase2.from("colleges").delete().eq("id", id).eq("user_id", "550e8400-e29b-41d4-a716-446655440000");
        if (deleteError) {
          console.error("❌ Error deleting school:", deleteError);
          return json({ error: "Failed to delete school" }, { status: 500 });
        }
        console.log("✅ DEV MODE: School deleted successfully");
        return json({ success: true, message: "School deleted successfully" });
      } catch (err) {
        console.error("❌ Error in DEV MODE delete school:", err);
        return json({ error: "Internal server error" }, { status: 500 });
      }
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
      console.error("❌ API /api/schools DELETE - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    try {
      const { data: school, error: fetchError } = await supabase.from("colleges").select("id, user_id").eq("id", id).eq("user_id", user.id).single();
      if (fetchError || !school) {
        console.error("❌ School not found or access denied:", fetchError);
        return json({ error: "School not found or access denied" }, { status: 404 });
      }
      const { error: deleteError } = await supabase.from("colleges").delete().eq("id", id).eq("user_id", user.id);
      if (deleteError) {
        console.error("❌ Error deleting school:", deleteError);
        return json({ error: "Failed to delete school" }, { status: 500 });
      }
      console.log("✅ API /api/schools DELETE - School deleted successfully");
      return json({ success: true, message: "School deleted successfully" });
    } catch (error) {
      console.error("❌ API /api/schools DELETE - Error:", error.message);
      return json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ API /api/schools DELETE - Request error:", error.message);
    return json({ error: "Invalid request" }, { status: 400 });
  }
};
const POST = async ({ request, cookies, url, locals }) => {
  console.log("🏫 API Schools - Creating new school...");
  try {
    const body = await request.json();
    const { name, city, country, address, phone, email, website } = body;
    console.log("🏫 API Schools - Request data:", { name, city, country });
    if (!name || !name.trim()) {
      return json({ error: "El nombre del centro es obligatorio" }, { status: 400 });
    }
    if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "El email debe tener un formato válido" }, { status: 400 });
    }
    if (!locals.user) {
      console.log("❌ API Schools - No user found in locals");
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    console.log("✅ API Schools - User authenticated:", locals.user.email, "ID:", locals.user.id);
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
    if (userError || !supabaseUser) {
      console.error("❌ API Schools - Supabase auth error:", userError);
      return json({ error: "Authentication failed" }, { status: 401 });
    }
    console.log("✅ API Schools - Supabase user authenticated:", supabaseUser.email);
    const collegeData = {
      name: name?.trim() || "Centro sin nombre",
      city: city?.trim() || null,
      user_id: supabaseUser.id,
      created_by: supabaseUser.id
    };
    console.log("🏫 API Schools - Inserting college data:", collegeData);
    const { data, error } = await supabase.from("colleges").insert(collegeData).select().single();
    if (error) {
      console.error("❌ API Schools - Database error:", error);
      return json({ error: error.message, details: error }, { status: 400 });
    }
    console.log("✅ API Schools - School created successfully:", data.id);
    console.log("✅ API Schools - College created successfully (no memberships table)");
    return json({
      success: true,
      school: data,
      message: "School created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("❌ API Schools - Unexpected error:", error);
    return json({
      error: error.message || "Internal server error"
    }, { status: 500 });
  }
};
const PUT = async ({ request, cookies, url, params }) => {
  console.log("🏫 API Schools - Updating school...");
  try {
    const body = await request.json();
    const schoolId = params.id;
    console.log("🏫 API Schools - Update data:", { schoolId, body });
    if (!schoolId) {
      return json({ error: "School ID is required" }, { status: 400 });
    }
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev) {
      console.log("🔧 DEV MODE: API /api/schools PUT - Updating mock school for localhost");
      const schoolIndex = localSchools.findIndex((s) => s.id === schoolId);
      if (schoolIndex === -1) {
        return json({ error: "School not found" }, { status: 404 });
      }
      const updatedSchool = {
        ...localSchools[schoolIndex],
        ...body,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      localSchools[schoolIndex] = updatedSchool;
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
      console.error("❌ API /api/schools PUT - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    try {
      console.log("✅ API /api/schools PUT - Updating school for user:", user.email);
      const { data: school, error } = await supabase.from("colleges").update({
        ...body,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", schoolId).eq("user_id", user.id).select().single();
      if (error) {
        console.error("❌ API /api/schools PUT - Database error:", error.message);
        return json({ error: error.message }, { status: 400 });
      }
      if (!school) {
        return json({ error: "School not found" }, { status: 404 });
      }
      console.log("✅ API /api/schools PUT - School updated:", school.id);
      return json({ school });
    } catch (error) {
      console.error("❌ API /api/schools PUT - Error:", error.message);
      return json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ API /api/schools PUT - Request error:", error.message);
    return json({ error: "Invalid request" }, { status: 400 });
  }
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
