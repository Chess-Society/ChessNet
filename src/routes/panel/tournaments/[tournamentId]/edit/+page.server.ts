import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { tournamentId } = params;
  
  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  const uid = locals.user.uid;

  try {
    const tournamentSnap = await adminDb.collection('local_tournaments').doc(tournamentId).get();

    if (!tournamentSnap.exists) {
      throw error(404, 'Torneo no encontrado');
    }

    const rawData = tournamentSnap.data() || {};
    const tournament = { 
        id: tournamentSnap.id, 
        ...rawData,
        ownerId: rawData.ownerId || rawData.owner_id,
        schoolId: rawData.schoolId || rawData.school_id,
        timeControl: rawData.timeControl || rawData.time_control,
        maxPlayers: rawData.maxPlayers || rawData.max_players,
        entryFee: rawData.entryFee || rawData.entry_fee,
        prizePool: rawData.prizePool || rawData.prize_pool,
        startAt: rawData.startAt || rawData.start_at || rawData.startDate || rawData.start_date,
        endAt: rawData.endAt || rawData.end_at || rawData.endDate || rawData.end_date,
        registrationDeadline: rawData.registrationDeadline || rawData.registration_deadline || rawData.registration_deadline,
        createdAt: rawData.createdAt || rawData.created_at,
        updatedAt: rawData.updatedAt || rawData.updated_at
    } as any;

    if (tournament.ownerId !== uid) {
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
