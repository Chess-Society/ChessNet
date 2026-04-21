import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const { tournament_id, round_no, action } = await request.json();

    if (!tournament_id || round_no === undefined) {
      return json({ error: 'tournament_id y round_no son requeridos' }, { status: 400 });
    }

    // Verificar propiedad del torneo
    const tournamentRef = adminDb.collection('local_tournaments').doc(tournament_id);
    const tournamentSnap = await tournamentRef.get();
    if (!tournamentSnap.exists || tournamentSnap.data()?.owner_id !== uid) {
      return json({ error: 'No autorizado o torneo no encontrado' }, { status: 403 });
    }

    if (action === 'reset') {
      const batch = adminDb.batch();
      
      // Borrar pairings de esta ronda
      const pairings = await adminDb.collection('local_tournament_pairings')
        .where('tournament_id', '==', tournament_id)
        .where('round_no', '==', round_no)
        .get();
      pairings.docs.forEach((doc: any) => batch.delete(doc.ref));

      // Borrar la ronda
      batch.delete(adminDb.collection('local_tournament_rounds').doc(`${tournament_id}_${round_no}`));

      // Actualizar el torneo (ronda actual)
      batch.update(tournamentRef, {
        currentRound: Math.max(0, round_no - 1),
        updatedAt: new Date().toISOString()
      });

      await batch.commit();
      return json({ success: true, message: 'Ronda reiniciada correctamente' });
    } else {
      // Crear ronda
      const docId = `${tournament_id}_${round_no}`;
      const roundData = {
        tournament_id,
        round_no,
        owner_id: uid,
        startedAt: new Date().toISOString()
      };

      await adminDb.collection('local_tournament_rounds').doc(docId).set(roundData);
      
      // Actualizar ronda actual en el torneo
      await tournamentRef.update({
        currentRound: round_no,
        updatedAt: new Date().toISOString()
      });

      return json({ success: true, data: { id: docId, ...roundData } });
    }
  } catch (error: any) {
    console.error('❌ Error in POST /api/tournaments/rounds:', error);
    return json({ error: error.message || 'Error al gestionar la ronda' }, { status: 500 });
  }
};
