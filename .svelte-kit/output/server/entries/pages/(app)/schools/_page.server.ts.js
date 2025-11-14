import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const load = async ({ locals, url, cookies }) => {
  console.log("📚 Schools page server load - User:", locals.user?.email || "none");
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Schools page - Using REAL data from Supabase (should be empty for new user)");
    const supabase2 = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    try {
      const { data: schools, error: schoolsError } = await supabase2.from("colleges").select("*").eq("user_id", locals.user.id).order("created_at", { ascending: false });
      if (schoolsError) {
        console.error("❌ Error fetching schools in DEV MODE:", schoolsError);
        return {
          user: locals.user,
          schools: []
        };
      }
      console.log("✅ DEV MODE: Schools loaded with REAL data:", schools?.length || 0, "schools");
      return {
        user: locals.user,
        schools: schools || []
      };
    } catch (err) {
      console.error("❌ Error in DEV MODE schools:", err);
      return {
        user: locals.user,
        schools: []
      };
    }
  }
  console.log("🌐 PRODUCTION MODE: Schools page - Fetching from Supabase");
  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options)
    }
  });
  try {
    const { data: schools, error: schoolsError } = await supabase.from("colleges").select("*").eq("user_id", locals.user.id).order("created_at", { ascending: false });
    if (schoolsError) {
      console.error("❌ Error fetching schools:", schoolsError);
      return {
        user: locals.user,
        schools: []
      };
    }
    return {
      user: locals.user,
      schools: schools || []
    };
  } catch (err) {
    console.error("❌ Error in schools production mode:", err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
export {
  load
};
