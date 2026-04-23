import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
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
    const { tournamentId, roundNo, action } = await request.json();

    if (!tournamentId || roundNo === undefined) {
      return json({ error: 'tournamentId y roundNo son requeridos' }, { status: 400 });
    }

    // Verificar propiedad del torneo
    const tournamentRef = adminDb.collection('local_tournaments').doc(tournamentId);
    const tournamentSnap = await tournamentRef.get();
    if (!tournamentSnap.exists || (tournamentSnap.data()?.ownerId !== uid && tournamentSnap.data()?.owner_id !== uid)) {
      return json({ error: 'No autorizado o torneo no encontrado' }, { status: 403 });
    }

    if (action === 'reset') {
      const batch = adminDb.batch();
      
      // Borrar pairings de esta ronda
      const pairings = await adminDb.collection('local_tournament_pairings')
        .where('tournamentId', '==', tournamentId)
        .where('roundNo', '==', roundNo)
        .get();
      pairings.docs.forEach((doc: any) => batch.delete(doc.ref));

      // Borrar la ronda
      batch.delete(adminDb.collection('local_tournament_rounds').doc(`${tournamentId}_${roundNo}`));

      // Actualizar el torneo (ronda actual)
      batch.update(tournamentRef, {
        currentRound: Math.max(0, roundNo - 1),
        updatedAt: new Date().toISOString()
      });

      await batch.commit();
      return json({ success: true, message: 'Ronda reiniciada correctamente' });
    } else {
      // Crear ronda
      const docId = `${tournamentId}_${roundNo}`;
      const roundData = {
        tournamentId,
        roundNo,
        ownerId: uid,
        startedAt: new Date().toISOString()
      };

      await adminDb.collection('local_tournament_rounds').doc(docId).set(roundData);
      
      // Actualizar ronda actual en el torneo
      await tournamentRef.update({
        currentRound: roundNo,
        updatedAt: new Date().toISOString()
      });

      return json({ success: true, data: { id: docId, ...roundData } });
    }
  } catch (error: any) {
    console.error('❌ Error in POST /api/tournaments/rounds:', error);
    return json({ error: error.message || 'Error al gestionar la ronda' }, { status: 500 });
  }
};
