import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
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
    const body = await request.json();
    
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

    const docRef = await adminDb.collection("tournaments").add(tournamentData);

    return json({ 
      success: true, 
      data: serializeRecord({ id: docRef.id, ...tournamentData })
    });
  } catch (error: any) {
    console.error('❌ Error in POST /api/tournaments:', error);
    return json({ error: 'Error al crear el torneo' }, { status: 500 });
  }
};
