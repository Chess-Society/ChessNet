import { requireUser, authenticate } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    await requireUser(event);
    const { user, isAdmin } = await authenticate(event);

    return {
        user,
        isAdmin
    };
}; 
