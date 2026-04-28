import { authenticate } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { json } from '@sveltejs/kit';
import { maintenanceHtml } from '$lib/server/templates/maintenance';

// Maintenance cache to avoid frequent Firestore queries
const MAINTENANCE_CACHE_TTL_MS = 5_000;
let maintenanceCacheValue: boolean = false;
let maintenanceCacheExpiry: number = 0;


export const handle: Handle = async ({ event, resolve }) => {
    // 1. Populate event.locals with user info
    await authenticate(event);
    
    // 2. Check Maintenance Mode (Except for Assets and Auth routes)
    const isAsset = event.url.pathname.startsWith('/_app') || 
                    event.url.pathname.startsWith('/favicon') || 
                    event.url.pathname.includes('.');
    const isAdminRoute = event.url.pathname.startsWith('/admin');
    const isAuthRoute = event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/auth');
    
    if (!isAsset && !isAdminRoute && !isAuthRoute) {
        try {
            const now = Date.now();
            let isMaintenance: boolean;

            if (now < maintenanceCacheExpiry) {
                isMaintenance = maintenanceCacheValue;
            } else {
                const configRef = adminDb.collection("system").doc("config");
                const configSnap = await Promise.race([
                    configRef.get(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 2500))
                ]) as any;
                
                isMaintenance = configSnap.exists && configSnap.data()?.maintenanceMode === true;
                maintenanceCacheValue = isMaintenance;
                maintenanceCacheExpiry = now + MAINTENANCE_CACHE_TTL_MS;
            }
            
            if (isMaintenance && !event.locals.isAdmin) {
                if (event.request.headers.get('accept')?.includes('application/json')) {
                    return json({ error: 'Sistema en mantenimiento' }, { status: 503 });
                }
                
                return new Response(maintenanceHtml, {
                    headers: { 'Content-Type': 'text/html' },
                    status: 503
                });
            }

            
            if (isMaintenance) {
                const response = await resolve(event);
                response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                response.headers.set('Pragma', 'no-cache');
                response.headers.set('Expires', '0');
                return response;
            }
        } catch (error) {
            console.error('Error checking maintenance mode:', error);
        }
    }

    const response = await resolve(event);
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    return response;
};
