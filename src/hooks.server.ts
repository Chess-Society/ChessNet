import { redirect, type Handle } from '@sveltejs/kit';
import { ADMIN_EMAILS, MAINTENANCE_EXEMPT_ROUTES } from '$lib/constants';
import { adminDb } from '$lib/firebase-admin';

export const handle: Handle = async ({ event, resolve }) => {
    const { cookies, locals, url } = event;
    const path = url.pathname;

    // 1. Recuperar usuario de la sesión (cookie)
    const sessionCookie = cookies.get('sb-auth-token');
    if (sessionCookie) {
        try {
            locals.user = JSON.parse(decodeURIComponent(sessionCookie));
        } catch (e) {
            locals.user = null;
        }
    }

    const isAdmin = locals.user?.email && ADMIN_EMAILS.includes(locals.user.email.toLowerCase());

    // 2. Manejar Impersonación (Suplantación)
    if (isAdmin) {
        const impersonateId = cookies.get('impersonate_id');
        if (impersonateId) {
            locals.impersonateId = impersonateId;
            console.log(`👤 [Auth Hook] Admin ${locals.user?.email} suplantando a ${impersonateId}`);
        }
    }

    // 3. Proteger ruta /admin
    if (path.startsWith('/admin') && !isAdmin) {
        console.warn(`🚫 [Auth Hook] Intento de acceso no autorizado a /admin por ${locals.user?.email || 'Desconocido'}`);
        throw redirect(302, '/auth/login');
    }

    // 4. Verificar Modo Mantenimiento (Global pero con excepciones)
    const isExempt = MAINTENANCE_EXEMPT_ROUTES.some(route => path.startsWith(route));
    
    if (!isExempt) {
        try {
            // Intentamos obtener el estado de mantenimiento (esto podría cachearse)
            const configDoc = await adminDb.collection('system').doc('config').get();
            const maintenanceMode = configDoc.exists ? configDoc.data()?.maintenanceMode : false;

            if (maintenanceMode && !isAdmin) {
                console.log('🚧 [Auth Hook] Bloqueo por modo mantenimiento activo');
                // Podríamos redirigir a una página específica de mantenimiento
                return new Response('El sistema está en mantenimiento. Vuelve pronto.', { status: 503 });
            }
        } catch (err) {
            console.error('❌ [Auth Hook] Error verificando mantenimiento:', err);
        }
    }

    return await resolve(event);
};
