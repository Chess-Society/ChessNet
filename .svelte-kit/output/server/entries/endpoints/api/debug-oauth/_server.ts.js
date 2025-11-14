import { json } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "../../../../chunks/public.js";
const GET = async ({ cookies, url }) => {
  console.log("🔍 Debug OAuth - Starting OAuth diagnostic...");
  try {
    const envCheck = {
      hasUrl: !!PUBLIC_SUPABASE_URL,
      hasKey: !!PUBLIC_SUPABASE_ANON_KEY,
      url: PUBLIC_SUPABASE_URL ? PUBLIC_SUPABASE_URL.substring(0, 30) + "..." : "MISSING",
      keyLength: PUBLIC_SUPABASE_ANON_KEY ? PUBLIC_SUPABASE_ANON_KEY.length : 0
    };
    console.log("🔍 Debug OAuth - Environment check:", envCheck);
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
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter((c) => c.name.startsWith("sb-"));
    console.log("🔍 Debug OAuth - Cookies:", {
      total: allCookies.length,
      supabase: supabaseCookies.length,
      names: supabaseCookies.map((c) => c.name)
    });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("🔍 Debug OAuth - Session check:", {
      hasSession: !!session,
      userEmail: session?.user?.email || "none",
      error: sessionError?.message || "none"
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("🔍 Debug OAuth - User check:", {
      hasUser: !!user,
      userEmail: user?.email || "none",
      userId: user?.id || "none",
      error: userError?.message || "none"
    });
    const urlParams = {
      code: url.searchParams.get("code"),
      error: url.searchParams.get("error"),
      state: url.searchParams.get("state"),
      allParams: Object.fromEntries(url.searchParams.entries())
    };
    console.log("🔍 Debug OAuth - URL params:", urlParams);
    return json({
      success: true,
      environment: envCheck,
      cookies: {
        total: allCookies.length,
        supabase: supabaseCookies.length,
        names: supabaseCookies.map((c) => c.name)
      },
      session: {
        exists: !!session,
        userEmail: session?.user?.email || null,
        error: sessionError?.message || null
      },
      user: {
        exists: !!user,
        email: user?.email || null,
        id: user?.id || null,
        error: userError?.message || null
      },
      urlParams,
      message: "OAuth diagnostic complete"
    });
  } catch (error) {
    console.error("❌ Debug OAuth - Unexpected error:", error);
    return json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 });
  }
};
export {
  GET
};
