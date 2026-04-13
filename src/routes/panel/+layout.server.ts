import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { ADMIN_EMAILS } from '$lib/constants';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const session = cookies.get('sb-auth-token');
    const impersonateEmail = cookies.get('impersonate_email') || null;
    let user = null;

    if (session) {
        try {
            user = JSON.parse(decodeURIComponent(session));
        } catch (e) {
            user = null;
        }
    }

    const isAdmin = !!(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

    // Maintenance Guard
    if (!isAdmin) {
        try {
            if (adminDb) {
                const configDoc = await adminDb.collection('system').doc('config').get();
                const isMaintenance = configDoc.exists ? configDoc.data()?.maintenance_mode === true : false;
                
                if (isMaintenance) {
                    throw redirect(307, '/mantenimiento');
                }
            }
        } catch (error) {
            if (error && typeof error === 'object' && 'status' in error) throw error;
            console.error('Error checking maintenance mode in layout:', error);
        }
    }

    return {
        user,
        isAdmin,
        impersonateEmail
    };
};
