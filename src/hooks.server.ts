import { authenticate } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Poblar event.locals con la información del usuario desde la cookie __session
    await authenticate(event);
    
    // Continuar con la petición
    const response = await resolve(event);
    return response;
};
