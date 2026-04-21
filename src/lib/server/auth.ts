import { adminAuth, isFirebaseAdminInitialized } from '$lib/firebase-admin';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$lib/constants';
import { dev } from '$app/environment';

export async function authenticate(event: RequestEvent) {
    // Local AI Access Bypass (Development Only)
    if (dev) {
        const aiAccess = event.cookies.get('antigravity_access');
        if (aiAccess === 'antigravity-dev-secret') {
            event.locals.user = {
                uid: 'antigravity-dev-worker',
                email: 'tomih@chess-society.com', // Recognized admin email
                name: 'Antigravity (Dev Mode)',
                picture: ''
            };
            event.locals.isAdmin = true;
            return event.locals;
        }
    }

    const sessionCookie = event.cookies.get('__session');
    
    // Si ya está en locals, no hacemos nada
    if (event.locals.user) return event.locals;

    if (!sessionCookie) {
        event.locals.user = null;
        event.locals.isAdmin = false;
        return event.locals;
    }

    if (!isFirebaseAdminInitialized) {
        if (!dev) console.warn('⚠️ [Auth] Admin SDK not initialized. Skipping session verification.');
        event.locals.user = null;
        event.locals.isAdmin = false;
        return event.locals;
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        event.locals.user = {
            uid: decodedClaims.uid,
            email: decodedClaims.email,
            name: decodedClaims.name,
            picture: decodedClaims.picture
        };

        const userEmail = event.locals.user.email?.trim().toLowerCase();
        const isEmailAdmin = userEmail 
            ? ADMIN_EMAILS.map(e => e.trim().toLowerCase()).includes(userEmail) 
            : false;
        
        event.locals.isAdmin = isEmailAdmin || (decodedClaims.admin === true);

    } catch (err) {
        console.error('Auth helper error:', err);
        event.cookies.delete('__session', { path: '/' });
        event.locals.user = null;
        event.locals.isAdmin = false;
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
