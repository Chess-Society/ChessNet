import type { LayoutServerLoad } from "./$types";
import { ADMIN_EMAILS } from "$lib/constants";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const session = cookies.get('sb-auth-token');
  const impersonateEmail = cookies.get('impersonate_email') || null;
  let user = null;

  if (session) {
    try {
      user = JSON.parse(decodeURIComponent(session));
    } catch (e) {
      user = null;
    }
  }

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  console.log('🌍 Global Layout - User:', user?.email || 'none', 'Admin:', isAdmin);

  return {
    user,
    isAdmin: !!isAdmin,
    impersonateEmail
  };
};
