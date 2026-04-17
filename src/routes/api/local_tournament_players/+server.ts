import { json } from '@sveltejs/kit';

export async function GET() {
  return json([]);
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    console.log('Mock local_tournament_players POST:', data);
    return json({ success: true, id: 'mock-player-' + Date.now(), ...data });
  } catch (e) {
    return json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
