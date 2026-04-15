import type { PageServerLoad } from './$types';
import { tournamentsApi } from '$lib/api/tournaments';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { tournamentId } = params;
  
  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  try {
    const tournament = await tournamentsApi.getTournament(tournamentId);

    if (!tournament) {
      throw error(404, 'Torneo no encontrado');
    }

    // Verificar propiedad
    const ownerId = tournament.owner_id;
    if (ownerId && ownerId !== locals.user.id) {
      throw error(403, 'No tienes permiso para editar este torneo');
    }

    return {
      user: locals.user,
      tournament
    };

  } catch (err: any) {
    console.error('❌ Error in tournament edit page load:', err);
    if (err.status) throw err;
    throw error(500, 'Error interno del servidor');
  }
};
