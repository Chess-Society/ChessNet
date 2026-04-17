import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { tournamentId } = params;
  
  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  const uid = locals.user.uid;
  const isMock = uid === 'chessnet-dev-uid';

  if (isMock) {
    return {
      user: locals.user,
      tournament: {
        id: tournamentId,
        name: 'Torneo Mock',
        owner_id: uid,
        status: 'draft',
        location: 'Mock Academy'
      }
    };
  }

  try {
    const tournamentSnap = await adminDb.collection('local_tournaments').doc(tournamentId).get();

    if (!tournamentSnap.exists) {
      throw error(404, 'Torneo no encontrado');
    }

    const tournament = { id: tournamentSnap.id, ...tournamentSnap.data() } as any;

    if (tournament.owner_id && tournament.owner_id !== uid) {
      throw error(403, 'No tienes permiso para editar este torneo');
    }

    return {
      user: locals.user,
      tournament: serializeRecord(tournament)
    };

  } catch (err: any) {
    console.error('❌ Error in tournament edit page load:', err);
    if (err.status) throw err;
    throw error(500, 'Error interno del servidor');
  }
};
