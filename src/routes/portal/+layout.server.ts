import { requireUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    const user = await requireUser(event);

    // Only allow parents (or admins for testing)
    if (event.locals.role !== 'parent' && event.locals.role !== 'admin') {
        throw redirect(303, '/panel');
    }

    return {
        user: event.locals.user,
        role: event.locals.role
    };
};
