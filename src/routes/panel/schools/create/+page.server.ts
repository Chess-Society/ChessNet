import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // El middleware en hooks.server.ts ya maneja la protección de rutas
  // Este load solo pasa los datos del usuario a los componentes
  
  return {
    user: locals.user,
  };
};
