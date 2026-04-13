import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ADMIN_EMAILS } from '$lib/constants';

export const load: PageServerLoad = async ({ locals }) => {
    // Si no hay usuario logueado, a login
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // Si hay usuario, pero no es el admin, al panel normal
    if (!ADMIN_EMAILS.includes(locals.user.email)) {
        throw redirect(303, '/panel');
    }

    // Si llega aquí, es el admin. Pasamos luz verde.
    return {
        user: locals.user,
        isAdmin: true
    };
};
