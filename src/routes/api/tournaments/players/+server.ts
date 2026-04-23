import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/auth';
import { serializeRecord } from '$lib/server/serialize';

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const { tournamentId, studentId, studentName, status } = await request.json();

    if (!tournamentId || !studentId) {
      return json({ error: 'tournamentId y studentId son requeridos' }, { status: 400 });
    }

    // Verificar propiedad del torneo
    const tournamentSnap = await adminDb.collection('local_tournaments').doc(tournamentId).get();
    if (!tournamentSnap.exists || (tournamentSnap.data()?.ownerId !== uid && tournamentSnap.data()?.owner_id !== uid)) {
      return json({ error: 'No autorizado o torneo no encontrado' }, { status: 403 });
    }

    const docId = `${tournamentId}_${studentId}`;
    const playerData = {
      tournamentId,
      studentId,
      studentName,
      ownerId: uid,
      status: status || 'active',
      createdAt: new Date().toISOString()
    };

    await adminDb.collection('local_tournament_players').doc(docId).set(playerData, { merge: true });

    return json({ 
      success: true, 
      data: serializeRecord({ id: docId, ...playerData }) 
    });
  } catch (error: any) {
    console.error('❌ Error in POST /api/tournaments/players:', error);
    return json({ error: error.message || 'Error al gestionar el jugador' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { url } = event;
  const uid = user.uid;
  const tournamentId = url.searchParams.get('tournamentId');
  const studentId = url.searchParams.get('studentId');

  if (!tournamentId || !studentId) {
    return json({ error: 'IDs requeridos' }, { status: 400 });
  }

  try {
    const docId = `${tournamentId}_${studentId}`;
    const docRef = adminDb.collection('local_tournament_players').doc(docId);
    const snap = await docRef.get();

    if (snap.exists && snap.data()?.ownerId !== uid && snap.data()?.owner_id !== uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    await docRef.delete();

    return json({ success: true, message: 'Jugador eliminado' });
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/tournaments/players:', error);
    return json({ error: error.message || 'Error al eliminar el jugador' }, { status: 500 });
  }
};
