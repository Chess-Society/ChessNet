import { authenticate } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  await authenticate(event);
  return {
    user: event.locals.user,
    isAdmin: event.locals.isAdmin,
    impersonateEmail: event.cookies.get('impersonate_email') || null
  };
};
