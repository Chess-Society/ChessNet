import { authenticate } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
import { ADMIN_EMAILS } from '$lib/constants';
import { json } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Poblar event.locals con la información del usuario desde la cookie __session
    await authenticate(event);
    
    // 2. Comprobar Modo Mantenimiento (Excepto para rutas de Assets y API de Admin/Auth)
    const isAsset = event.url.pathname.startsWith('/_app') || 
                    event.url.pathname.startsWith('/favicon') || 
                    event.url.pathname.includes('.');
    const isAdminRoute = event.url.pathname.startsWith('/admin');
    
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isAsset && !isAdminRoute && !isDev) {
        try {
            const configRef = adminDb.collection("system").doc("config");
            const configSnap = await configRef.get();
            const isMaintenance = configSnap.exists && configSnap.data()?.maintenanceMode === true;
            
            if (isMaintenance) {
                const isAdmin = event.locals.user && ADMIN_EMAILS.includes(event.locals.user.email || '');
                
                if (!isAdmin) {
                    // Si es una petición de datos (feth), devolvemos error 503
                    if (event.request.headers.get('accept')?.includes('application/json')) {
                        return json({ error: 'Sistema en mantenimiento' }, { status: 503 });
                    }
                    
                    // Si es navegación, podemos devolver una página de mantenimiento simple
                    return new Response(`
                        <div style="font-family: system-ui; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #09090b; color: white; text-align: center; padding: 20px;">
                            <h1 style="font-size: 3rem; margin-bottom: 0;">ChessNet</h1>
                            <p style="color: #a1a1aa; font-size: 1.25rem;">Estamos realizando mejoras en la plataforma.</p>
                            <div style="margin-top: 2rem; padding: 1rem 2rem; background: #18181b; border: 1px border #27272a; border-radius: 1rem;">
                                Mantenimiento programado - Volvemos pronto
                            </div>
                        </div>
                    `, {
                        headers: { 'Content-Type': 'text/html' },
                        status: 503
                    });
                }
            }
        } catch (error) {
            console.error('Error checking maintenance mode:', error);
            // Si falla la base de datos (ej: sin inicializar), permitimos la carga de la web
            // para que no sea un fallo crítico si no hay config.
        }
    }

    // Continuar con la petición
    const response = await resolve(event);
    return response;
};

