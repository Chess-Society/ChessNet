import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  // Global layout - no authentication guard here
  // Authentication is handled by the (app) group layout
  console.log('🌍 Global Layout - No auth guard, user:', locals.user?.email || 'none');

  return {
    user: locals.user || null,
  };
};
