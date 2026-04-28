import { authenticate } from '$lib/server/auth';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    const { user, isAdmin } = await authenticate(event);
    
    if (!user || !isAdmin) {
        throw error(403, 'Acceso denegado: Se requieren permisos de administrador');
    }

    // Redirigir a la nueva ruta modular por defecto
    throw redirect(303, '/admin/dashboard');
};
