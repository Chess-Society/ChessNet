import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
import { redirect } from "@sveltejs/kit";
const GET = async ({ url, cookies }) => {
  console.log("🔍 Auth Callback - Processing OAuth callback");
  const code = url.searchParams.get("code");
  const redirectTo = url.searchParams.get("redirectTo") || "/dashboard";
  console.log("🔍 Auth Callback - Code received:", !!code);
  console.log("🔍 Auth Callback - Redirect to:", redirectTo);
  if (!code) {
    console.log("❌ Auth Callback - No code provided");
    throw redirect(303, "/login?error=callback_failed");
  }
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      flowType: "pkce"
    },
    cookies: {
      get: (key) => {
        return cookies.get(key);
      },
      set: (key, value, options) => {
        cookies.set(key, value, {
          ...options,
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax"
        });
      },
      remove: (key, options) => {
        cookies.delete(key, { ...options, path: "/" });
      }
    }
  });
  try {
    console.log("🔄 Auth Callback - Exchanging code for session...");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("❌ Auth Callback - Error exchanging code:", error.message);
      throw redirect(303, "/login?error=callback_failed");
    }
    if (!data.session) {
      console.error("❌ Auth Callback - No session created after exchange");
      throw redirect(303, "/login?error=callback_failed");
    }
    console.log("✅ Auth Callback - Session created successfully for user:", data.session.user.email);
    console.log("🔄 Auth Callback - Redirecting to:", redirectTo);
    throw redirect(303, redirectTo);
  } catch (error) {
    if (error?.status === 303) {
      throw error;
    }
    console.error("❌ Auth Callback - Unexpected error:", error);
    throw redirect(303, "/login?error=callback_failed");
  }
};
export {
  GET
};
