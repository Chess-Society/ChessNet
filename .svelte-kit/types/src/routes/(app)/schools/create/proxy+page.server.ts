// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  // El middleware en hooks.server.ts ya maneja la protección de rutas
  // Este load solo pasa los datos del usuario a los componentes
  console.log('🏫 Create school page server load - User:', locals.user?.email || 'none');
  
  return {
    user: locals.user,
  };
};
