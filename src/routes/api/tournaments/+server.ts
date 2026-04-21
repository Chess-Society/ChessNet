import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/auth';
import { serializeRecord } from '$lib/server/serialize';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const querySnapshot = await adminDb.collection('local_tournaments')
      .where('owner_id', '==', user.uid)
      .get();
    
    const tournaments = querySnapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
    
    return json({ items: tournaments });
  } catch (error: any) {
    console.error('❌ Error in GET /api/tournaments:', error.message);
    return json({ error: 'Error al obtener los torneos', details: error.message }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 });
    }
    
    const tournamentData = {
      owner_id: uid,
      school_id: body.school_id || null,
      name: body.name || 'Torneo sin nombre',
      description: body.description || null,
      format: body.format || 'swiss',
      time_control: body.time_control || '10+5',
      max_players: body.max_players || 16,
      entry_fee: body.entry_fee || 0,
      prize_pool: body.prize_pool || 0,
      startAt: body.startAt || body.start_date || null,
      endAt: body.endAt || body.end_date || null,
      registration_deadline: body.registration_deadline || null,
      status: body.status || 'draft',
      currentRound: body.currentRound || body.current_round || 0,
      roundsPlanned: body.roundsPlanned || body.total_rounds || 0,
      players_registered: 0,
      location: body.location || null,
      organizer: body.organizer || null,
      notes: body.notes || null,
      rules: body.rules || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection("local_tournaments").add(tournamentData);
    return json({ 
      success: true, 
      data: serializeRecord({ id: docRef.id, ...tournamentData })
    });
  } catch (error: any) {
    console.error('❌ Error in POST /api/tournaments:', error);
    return json({ error: error.message || 'Error al crear el torneo' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request, url } = event;
  const uid = user.uid;
  const id = url.searchParams.get('id');

  if (!id) {
    return json({ error: 'ID de torneo requerido' }, { status: 400 });
  }

  try {
    const docRef = adminDb.collection('local_tournaments').doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return json({ error: 'Torneo no encontrado' }, { status: 404 });
    }

    if (snap.data()?.owner_id !== uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    const updates = await request.json();
    const cleanUpdates = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    delete cleanUpdates.id;
    delete cleanUpdates.owner_id;
    delete cleanUpdates.created_at;
    delete cleanUpdates.createdAt;

    await docRef.update(cleanUpdates);

    return json({ 
      success: true, 
      data: { id, ...snap.data(), ...cleanUpdates } 
    });
  } catch (error: any) {
    console.error('❌ Error in PUT /api/tournaments:', error);
    return json({ error: error.message || 'Error al actualizar el torneo' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { url } = event;
  const uid = user.uid;
  const id = url.searchParams.get('id');

  if (!id) {
    return json({ error: 'ID de torneo requerido' }, { status: 400 });
  }

  try {
    const docRef = adminDb.collection('local_tournaments').doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      // Éxito silencioso si ya no existe
      return json({ success: true, message: 'Torneo ya eliminado' });
    }

    if (snap.data()?.owner_id !== uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    // El borrado en cascada (jugadores, rondas, pairings) es mejor manejarlo aquí 
    // para asegurar integridad sin depender del cliente.
    const batch = adminDb.batch();

    // 1. Borrar jugadores
    const players = await adminDb.collection('local_tournament_players').where('tournament_id', '==', id).get();
    players.docs.forEach((doc: any) => batch.delete(doc.ref));

    // 2. Borrar rondas
    const rounds = await adminDb.collection('local_tournament_rounds').where('tournament_id', '==', id).get();
    rounds.docs.forEach((doc: any) => batch.delete(doc.ref));

    // 3. Borrar pairings
    const pairings = await adminDb.collection('local_tournament_pairings').where('tournament_id', '==', id).get();
    pairings.docs.forEach((doc: any) => batch.delete(doc.ref));

    // 4. Borrar el torneo
    batch.delete(docRef);

    await batch.commit();

    return json({ success: true, message: 'Torneo y datos relacionados eliminados correctamente' });
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/tournaments:', error);
    return json({ error: error.message || 'Error al eliminar el torneo' }, { status: 500 });
  }
};
