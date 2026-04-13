import { authenticate } from '$lib/server/auth';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    const { user, isAdmin } = await authenticate(event);
    
    if (!user || !isAdmin) {
        throw error(403, 'Acceso denegado: Se requieren permisos de administrador');
    }

    console.log(`🛡️ [Admin Load] User: ${user.email}, Authorized: true`);

    return {
        user,
        isAdmin
    };
};
