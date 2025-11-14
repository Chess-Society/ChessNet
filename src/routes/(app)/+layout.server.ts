import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  // El middleware en hooks.server.ts ya maneja la protección de rutas
  // Este layout solo pasa los datos del usuario a los componentes
  console.log('✅ App layout - User:', locals.user?.email || 'none');
  
  return {
    user: locals.user,
  };
};
