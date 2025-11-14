// @ts-nocheck
import type { LayoutServerLoad } from "./$types";

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
  // El middleware en hooks.server.ts ya maneja la protección de rutas
  // Este layout solo pasa los datos del usuario a los componentes
  console.log('✅ App layout - User:', locals.user?.email || 'none');
  
  return {
    user: locals.user,
  };
};
