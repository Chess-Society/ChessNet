import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    // El hook ya se encarga de verificar si es admin
    if (!locals.user || !locals.isAdmin) {
        throw error(403, 'Acceso denegado: Se requieren permisos de administrador');
    }

    console.log(`🛡️ [Admin Load] User: ${locals.user.email}, Authorized: true`);

    return {
        user: locals.user,
        isAdmin: true
    };
};
