import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  // Manejar sesión manualmente si hooks.server.ts no está disponible
  if (!locals.user) {
    const session = cookies.get('sb-auth-token');
    if (session) {
      try {
        locals.user = JSON.parse(decodeURIComponent(session));
      } catch (e) {
        locals.user = null;
      }
    }
  }

  console.log('🌍 Global Layout - User:', locals.user?.email || 'none');

  return {
    user: locals.user || null,
  };
};
