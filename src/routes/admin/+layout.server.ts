import { adminAuth } from '$lib/firebase-admin';
import { redirect } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$lib/constants';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const sessionCookie = cookies.get('__session');
    let user = null;
    let isAdmin = false;

    if (sessionCookie && adminAuth) {
        try {
            const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
            user = {
                uid: decodedClaims.uid,
                email: decodedClaims.email
            };

            const userEmail = user.email?.trim().toLowerCase();
            isAdmin = userEmail 
                ? ADMIN_EMAILS.map(e => e.trim().toLowerCase()).includes(userEmail) 
                : false;

        } catch (error) {
            cookies.delete('__session', { path: '/' });
        }
    }

    if (!isAdmin) {
        throw redirect(303, user ? '/panel' : '/login');
    }

    return {
        user,
        isAdmin
    };
}; 
