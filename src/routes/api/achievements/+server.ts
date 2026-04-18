import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) return json({ error: 'No autorizado' }, { status: 401 });
  return json({ items: [] });
};
