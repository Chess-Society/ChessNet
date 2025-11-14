import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const GET = async ({ cookies, locals }) => {
  try {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => {
          cookies.set(key, value, { ...options, path: "/" });
        },
        remove: (key, options) => {
          cookies.delete(key, { ...options, path: "/" });
        }
      }
    });
    const { data: { session }, error } = await supabase.auth.getSession();
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter((cookie) => cookie.name.startsWith("sb-"));
    const debugInfo = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: {
        PUBLIC_SUPABASE_URL: PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
        PUBLIC_SUPABASE_ANON_KEY: PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING"
      },
      session: {
        exists: !!session,
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at
        } : null,
        expires_at: session?.expires_at,
        access_token: session?.access_token ? "SET" : "MISSING",
        refresh_token: session?.refresh_token ? "SET" : "MISSING"
      },
      error: error ? {
        message: error.message,
        status: error.status
      } : null,
      cookies: {
        all: allCookies.map((c) => ({ name: c.name, value: c.value ? "SET" : "EMPTY" })),
        supabase: supabaseCookies.map((c) => ({ name: c.name, value: c.value ? "SET" : "EMPTY" }))
      },
      locals: {
        user: locals.user ? {
          id: locals.user.id,
          email: locals.user.email,
          full_name: locals.user.full_name
        } : null
      }
    };
    return new Response(JSON.stringify(debugInfo, null, 2), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: {
        message: error.message,
        stack: error.stack
      }
    }, null, 2), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
export {
  GET
};
