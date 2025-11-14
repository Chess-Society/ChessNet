import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const GET = async ({ cookies }) => {
  try {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, { ...options, path: "/" }),
        remove: (key, options) => cookies.delete(key, { ...options, path: "/" })
      }
    });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    return new Response(JSON.stringify({
      success: true,
      config: {
        url: PUBLIC_SUPABASE_URL,
        hasAnonKey: !!PUBLIC_SUPABASE_ANON_KEY,
        anonKeyLength: PUBLIC_SUPABASE_ANON_KEY?.length || 0
      },
      session: {
        exists: !!session,
        user: session?.user?.email || null,
        error: sessionError?.message || null
      },
      user: {
        exists: !!user,
        email: user?.email || null,
        error: userError?.message || null
      },
      cookies: cookies.getAll().map((c) => ({ name: c.name, hasValue: !!c.value }))
    }, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
export {
  GET
};
