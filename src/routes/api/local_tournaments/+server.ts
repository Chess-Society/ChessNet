import { json } from '@sveltejs/kit';

export async function GET() {
  return json([]);
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    console.log('Mock local_tournaments POST:', data);
    return json({ success: true, id: 'mock-tournament-' + Date.now(), ...data });
  } catch (e) {
    return json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
