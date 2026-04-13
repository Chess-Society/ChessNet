import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Si no hay usuario logueado o no es el admin específico, redirigir
    // Forzamos andreslgumuzio@gmail.com como único administrador total
    if (!locals.user || locals.user.email?.toLowerCase() !== "andreslgumuzio@gmail.com") {
        throw redirect(303, '/panel');
    }

    // Si llega aquí, es el super-admin.
    return {
        user: locals.user,
        isAdmin: true
    };
};
