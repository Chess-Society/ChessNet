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
    const response = {
      authenticated: !!session && !!locals.user,
      user: locals.user,
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email
        },
        expires_at: session.expires_at
      } : null,
      error: error?.message || null
    };
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      authenticated: false,
      user: null,
      session: null,
      error: error.message
    }), {
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
