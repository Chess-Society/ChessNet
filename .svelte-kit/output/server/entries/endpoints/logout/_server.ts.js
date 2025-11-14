import { json, redirect } from "@sveltejs/kit";
const POST = async ({ cookies, locals, url }) => {
  console.log("🚪 Logout POST - Starting logout process");
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Local logout - Clearing session");
    locals.user = null;
    console.log("✅ Local logout completed");
    return json({ success: true });
  }
  console.log("🌐 PROD MODE: Supabase logout - Clearing cookies and session");
  const allCookies = cookies.getAll();
  const supabaseCookies = allCookies.filter((cookie) => cookie.name.startsWith("sb-"));
  console.log("🚪 Logout - Clearing cookies:", supabaseCookies.map((c) => c.name));
  supabaseCookies.forEach((cookie) => {
    cookies.delete(cookie.name, { path: "/" });
  });
  cookies.delete("session", { path: "/" });
  cookies.delete("auth-token", { path: "/" });
  locals.user = null;
  console.log("✅ Production logout completed");
  return json({ success: true });
};
const GET = async ({ cookies, locals, url }) => {
  console.log("🚪 Logout GET - Direct logout redirect");
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    locals.user = null;
  } else {
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter((cookie) => cookie.name.startsWith("sb-"));
    supabaseCookies.forEach((cookie) => {
      cookies.delete(cookie.name, { path: "/" });
    });
    cookies.delete("session", { path: "/" });
    cookies.delete("auth-token", { path: "/" });
    locals.user = null;
  }
  console.log("✅ Logout redirect completed");
  throw redirect(302, "/login");
};
export {
  GET,
  POST
};
