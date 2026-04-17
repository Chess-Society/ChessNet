import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/auth';
import { serializeRecord } from '$lib/server/serialize';

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
  } catch (error) {
    console.error('❌ Error in GET /api/tournaments:', error);
    // En desarrollo local sin adminDb inicializado, devolvemos vacío
    return json({ items: [] });
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
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      registration_deadline: body.registration_deadline || null,
      status: body.status || 'draft',
      current_round: body.current_round || 0,
      total_rounds: body.total_rounds || 0,
      players_registered: 0,
      location: body.location || null,
      organizer: body.organizer || null,
      notes: body.notes || null,
      rules: body.rules || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const docRef = await adminDb.collection("local_tournaments").add(tournamentData);
      return json({ 
        success: true, 
        data: serializeRecord({ id: docRef.id, ...tournamentData })
      });
    } catch (dbError) {
      if (uid === 'chessnet-dev-uid') {
        return json({ 
          success: true, 
          data: { id: 'mock-lt-' + Date.now(), ...tournamentData }
        });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ Error in POST /api/tournaments:', error);
    return json({ error: error.message || 'Error al crear el torneo' }, { status: 500 });
  }
};
