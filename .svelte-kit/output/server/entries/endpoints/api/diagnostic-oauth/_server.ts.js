import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const GET = async ({ url, cookies, request }) => {
  try {
    const urlParams = Object.fromEntries(url.searchParams.entries());
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter((cookie) => cookie.name.startsWith("sb-"));
    const headers = Object.fromEntries(request.headers.entries());
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, { ...options, path: "/" }),
        remove: (key, options) => cookies.delete(key, { ...options, path: "/" })
      }
    });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const diagnostic = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: {
        PUBLIC_SUPABASE_URL: PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
        PUBLIC_SUPABASE_ANON_KEY: PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
        url: PUBLIC_SUPABASE_URL
      },
      request: {
        url: url.toString(),
        pathname: url.pathname,
        search: url.search,
        params: urlParams,
        method: request.method,
        headers: {
          "user-agent": headers["user-agent"],
          "referer": headers["referer"],
          "origin": headers["origin"],
          "host": headers["host"]
        }
      },
      cookies: {
        all: allCookies.map((c) => ({ name: c.name, value: c.value ? "SET" : "EMPTY" })),
        supabase: supabaseCookies.map((c) => ({ name: c.name, value: c.value ? "SET" : "EMPTY" })),
        count: allCookies.length,
        supabaseCount: supabaseCookies.length
      },
      auth: {
        session: session ? {
          user: session.user.email,
          expires_at: session.expires_at,
          access_token: session.access_token ? "SET" : "EMPTY",
          refresh_token: session.refresh_token ? "SET" : "EMPTY"
        } : null,
        user: user ? {
          email: user.email,
          id: user.id,
          created_at: user.created_at
        } : null,
        sessionError: sessionError?.message,
        userError: userError?.message,
        authSettings: null,
        // Not available in current Supabase version
        authError: null
      },
      oauth: {
        hasCode: !!urlParams.code,
        code: urlParams.code ? "PRESENT" : "MISSING",
        hasState: !!urlParams.state,
        state: urlParams.state ? "PRESENT" : "MISSING",
        hasError: !!urlParams.error,
        error: urlParams.error,
        errorDescription: urlParams.error_description,
        errorCode: urlParams.error_code
      }
    };
    return new Response(JSON.stringify(diagnostic, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: true,
      message: error.message,
      stack: error.stack,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, null, 2), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
export {
  GET
};
