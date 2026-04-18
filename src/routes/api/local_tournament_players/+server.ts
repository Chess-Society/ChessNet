import { json } from '@sveltejs/kit';
import { authenticate } from '$lib/server/auth';

export async function GET(event) {
  const { user } = await authenticate(event);
  if (!user) return json({ error: 'No autorizado' }, { status: 401 });
  return json([]);
}

export async function POST(event) {
  const { user } = await authenticate(event);
  if (!user) return json({ error: 'No autorizado' }, { status: 401 });
  
  try {
    const data = await event.request.json();
    console.log('Mock local_tournament_players POST:', data);
    return json({ success: true, id: 'mock-player-' + Date.now(), ...data });
  } catch (e) {
    return json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
