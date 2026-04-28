import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/auth';

// Update result
export const PUT: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const { pairingId, result, pointsWhite, pointsBlack } = await request.json();

    if (!pairingId) {
      return json({ error: 'pairingId is required' }, { status: 400 });
    }

    const pairingRef = adminDb.collection('local_tournament_pairings').doc(pairingId);
    const snap = await pairingRef.get();

    if (!snap.exists || (snap.data()?.ownerId !== uid && snap.data()?.ownerId !== uid)) {
      return json({ error: 'Unauthorized or not found' }, { status: 403 });
    }

    await pairingRef.update({
      result,
      pointsWhite,
      pointsBlack,
      updatedAt: new Date().toISOString()
    });

    return json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in PUT /api/tournaments/pairings:', error);
    return json({ error: error.message }, { status: 500 });
  }
};

// Generate pairings
export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const { tournamentId, roundNo, pairings } = await request.json();

    if (!tournamentId || !roundNo || !pairings) {
       return json({ error: 'Missing data' }, { status: 400 });
    }

    // Verify tournament ownership
    const tournamentSnap = await adminDb.collection('local_tournaments').doc(tournamentId).get();
    if (!tournamentSnap.exists || (tournamentSnap.data()?.ownerId !== uid && tournamentSnap.data()?.ownerId !== uid)) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    const batch = adminDb.batch();
    
    for (const p of pairings) {
      const docRef = adminDb.collection('local_tournament_pairings').doc();
      batch.set(docRef, {
        ...p,
        ownerId: uid,
        createdAt: new Date().toISOString()
      });
    }

    await batch.commit();

    return json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in POST /api/tournaments/pairings:', error);
    return json({ error: error.message }, { status: 500 });
  }
};
