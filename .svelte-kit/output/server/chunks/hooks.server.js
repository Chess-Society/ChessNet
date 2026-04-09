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
const handle = async ({ event, resolve }) => {
  const { pathname } = event.url;
  const sessionCookie = event.cookies.get("sb-auth-token");
  if (sessionCookie) {
    try {
      const user = JSON.parse(sessionCookie);
      event.locals.user = {
        id: user.uid || user.id,
        email: user.email,
        full_name: user.displayName || user.full_name || null,
        avatar_url: user.photoURL || user.avatar_url || null
      };
      console.log("✅ Session verified on server - User:", event.locals.user.email);
    } catch (error) {
      console.error("❌ Error parsing session cookie:", error);
      event.cookies.delete("sb-auth-token", { path: "/" });
    }
  }
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isStaticRoute = STATIC_ROUTES.some((route) => pathname.startsWith(route)) || pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/);
  if (isStaticRoute) {
    return await resolve(event);
  }
  if (!event.locals.user && !isPublicRoute && pathname !== "/") {
    console.log("🔒 Protected route access denied - Redirecting to login");
    throw redirect(303, `/login?redirectTo=${pathname}`);
  }
  return await resolve(event);
};
export {
  handle
};
