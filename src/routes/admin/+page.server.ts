import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ADMIN_EMAILS } from '$lib/constants';

export const load: PageServerLoad = async ({ locals }) => {
    // Si no hay usuario logueado, a login
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // Si hay usuario, pero no es el admin, al panel normal
    const userEmail = locals.user.email?.toLowerCase();
    const isAuthorized = ADMIN_EMAILS.some(e => e.toLowerCase() === userEmail);

    if (!isAuthorized) {
        throw redirect(303, '/panel');
    }

    // Si llega aquí, es el admin. Pasamos luz verde.
    return {
        user: locals.user,
        isAdmin: true
    };
};
