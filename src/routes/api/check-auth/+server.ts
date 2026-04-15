import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  const user = locals.user;
  return json({
    authenticated: !!user,
    user: user ?? null,
    error: null
  });
};
