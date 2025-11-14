import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "./public.js";
import { redirect } from "@sveltejs/kit";
const PUBLIC_ROUTES = [
  "/login",
  "/auth/callback",
  "/auth/success",
  "/debug",
  "/debug-auth"
];
const STATIC_ROUTES = [
  "/_app",
  "/favicon.ico"
];
const PROTECTED_API_ROUTES = [
  "/api/schools",
  "/api/classes",
  "/api/students",
  "/api/skills",
  "/api/tournaments",
  "/api/payments"
];
const handle = async ({ event, resolve }) => {
  const { pathname } = event.url;
  const isLocalDev = event.url.hostname === "localhost" || event.url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Bypassing authentication for localhost");
    const mockUser = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      // UUID válido
      email: "dev@localhost.com",
      user_metadata: {
        name: "Developer User",
        avatar_url: null
      }
    };
    event.locals.user = mockUser;
    event.locals.supabase = null;
    console.log("✅ DEV MODE: Mock user authenticated:", mockUser.email);
    return await resolve(event);
  }
  console.log("🔒 PROD MODE: Using normal Supabase authentication");
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      flowType: "pkce"
    },
    cookies: {
      get: (key) => {
        const cookie = event.cookies.get(key);
        return cookie;
      },
      set: (key, value, options) => {
        event.cookies.set(key, value, {
          ...options,
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax"
        });
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: "/" });
      }
    }
  });
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isStaticRoute = STATIC_ROUTES.some((route) => pathname.startsWith(route)) || pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/);
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route));
  if (isStaticRoute) {
    return await resolve(event);
  }
  let session = null;
  let error = null;
  const supabaseCookies = event.cookies.getAll().filter((cookie) => cookie.name.startsWith("sb-"));
  console.log("🍪 Supabase cookies found:", supabaseCookies.map((c) => c.name));
  try {
    const userResult = await supabase.auth.getUser();
    console.log("🔍 getUser() result:", {
      hasUser: !!userResult.data.user,
      userEmail: userResult.data.user?.email || "none",
      error: userResult.error?.message || "none"
    });
    if (userResult.data.user && !userResult.error) {
      session = { user: userResult.data.user };
      console.log("✅ User found via getUser():", userResult.data.user.email);
    } else {
      console.log("🔄 getUser() failed, trying getSession()...");
      const sessionResult = await supabase.auth.getSession();
      session = sessionResult.data.session;
      error = sessionResult.error;
      console.log("🔍 getSession() result:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email || "none",
        error: error?.message || "none"
      });
    }
  } catch (err) {
    console.error("❌ Error getting session/user:", err);
    error = err;
  }
  if (error) {
    console.error("❌ Error getting session:", error);
  }
  if (session?.user) {
    event.locals.user = {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.user_metadata?.full_name || null,
      avatar_url: session.user.user_metadata?.avatar_url || null,
      created_at: session.user.created_at
    };
    console.log("✅ User session found:", session.user.email);
  } else {
    event.locals.user = null;
    console.log("❌ No user session found");
  }
  if (!isPublicRoute || isProtectedApiRoute) {
    if (!session?.user) {
      if (isProtectedApiRoute) {
        console.log("🔒 Protected API route accessed without authentication");
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        console.log("🔒 Protected route accessed without authentication, redirecting to login");
        const redirectUrl = new URL("/login", event.url.origin);
        redirectUrl.searchParams.set("redirectTo", pathname + event.url.search);
        throw redirect(302, redirectUrl.toString());
      }
    } else {
      console.log("✅ Authenticated user accessing protected route:", pathname);
    }
  } else if (pathname === "/login" && session?.user) {
    console.log("🔄 User already authenticated, redirecting from login to dashboard");
    throw redirect(302, "/dashboard");
  }
  console.log("🔍 Hooks Server Debug:", {
    pathname,
    hasSession: !!session,
    userEmail: session?.user?.email || "none",
    isPublicRoute,
    isStaticRoute
  });
  const response = await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    }
  });
  return response;
};
export {
  handle
};
