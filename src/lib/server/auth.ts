import { adminAuth } from '$lib/firebase-admin';
import { redirect, error, type RequestEvent } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$lib/constants';

export async function authenticate(event: RequestEvent) {
    const sessionCookie = event.cookies.get('__session');
    
    // Si ya está en locals, no hacemos nada
    if (event.locals.user) return event.locals;

    if (!sessionCookie) {
        event.locals.user = null;
        event.locals.isAdmin = false;
        return event.locals;
    }

    try {
        // Bypass SOLO para desarrollo local — bloqueado en producción
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev && sessionCookie === 'mock-session-chessnet') {
            event.locals.user = {
                uid: 'chessnet-dev-uid',
                email: 'admin@chessnet.pro',
                name: 'ChessNet Developer',
                picture: 'https://ui-avatars.com/api/?name=Chess+Net&background=7C3AED&color=fff'
            };
            event.locals.isAdmin = true;
            return event.locals;
        }

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
