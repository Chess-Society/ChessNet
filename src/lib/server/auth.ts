import { adminAuth, isFirebaseAdminInitialized } from '$lib/server/firebase-admin';
import { redirect, type RequestEvent } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { env as privateEnv } from '$env/dynamic/private';

import { getUserRole, type UserRole } from './roles';

export async function authenticate(event: RequestEvent) {
    // Local AI Access Bypass (Development Only)
    // HIGH-01: Secret desde env var — nunca hardcodeado en código fuente
    // Definir DEV_AUTH_BYPASS_SECRET en .env para activar el bypass local
    if (dev) {
        const aiAccess = event.cookies.get('antigravity_access');
        const bypassSecret = privateEnv.DEV_AUTH_BYPASS_SECRET;
        if (bypassSecret && aiAccess === bypassSecret) {
            event.locals.user = {
                uid: 'antigravity-dev-worker',
                email: 'tomih@chess-society.com', // Recognized admin email
                name: 'Antigravity (Dev Mode)',
                picture: ''
            };
            event.locals.isAdmin = true;
            event.locals.role = 'admin';
            return event.locals;
        }
    }

    const sessionCookie = event.cookies.get('__session');
    
    // Si ya está en locals, no hacemos nada
    if (event.locals.user) return event.locals;

    if (!sessionCookie) {
        event.locals.user = null;
        event.locals.isAdmin = false;
        event.locals.role = 'none';
        return event.locals;
    }

    if (!isFirebaseAdminInitialized()) {
        if (!dev) console.warn('⚠️ [Auth] Admin SDK not initialized. Skipping session verification.');
        event.locals.user = null;
        event.locals.isAdmin = false;
        event.locals.role = 'none';
        return event.locals;
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        const userEmail = decodedClaims.email?.trim().toLowerCase();
        
        event.locals.user = {
            uid: decodedClaims.uid,
            email: userEmail || '',
            name: decodedClaims.name,
            picture: decodedClaims.picture
        };

        // SEC-01: Usar exclusivamente Custom Claims para privilegios de administrador
        event.locals.isAdmin = decodedClaims.admin === true;

        // Fetch role from DB/Logic
        if (userEmail) {
            event.locals.role = await getUserRole(userEmail);
        } else {
            event.locals.role = 'none';
        }

    } catch (err) {
        console.error('Auth helper error:', err);
        event.cookies.delete('__session', { path: '/' });
        event.locals.user = null;
        event.locals.isAdmin = false;
        event.locals.role = 'none';
    }

    return event.locals;
}

export async function requireUser(event: RequestEvent) {
    const { user } = await authenticate(event);
    if (!user) {
        throw redirect(303, '/login');
    }
    return user;
}

export async function requireAdmin(event: RequestEvent) {
    const { isAdmin, user } = await authenticate(event);
    if (!isAdmin) {
        throw redirect(303, user ? '/panel' : '/login');
    }
}
