import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Move Maintenance Guard from hooks to here.
    // This avoids circular dependencies and build blockers in hooks.server.ts
    if (!locals.isAdmin) {
        try {
            if (adminDb) {
                const configDoc = await adminDb.collection('system').doc('config').get();
                const isMaintenance = configDoc.exists ? configDoc.data()?.maintenance_mode === true : false;
                
                if (isMaintenance) {
                    throw redirect(307, '/mantenimiento');
                }
            }
        } catch (error) {
            // Rethrow redirects, ignore other errors (like missing DB in local dev)
            if (error && typeof error === 'object' && 'status' in error) throw error;
            console.error('Error checking maintenance mode in layout:', error);
        }
    }

    return {
        user: locals.user,
        isAdmin: locals.isAdmin,
        impersonateEmail: locals.impersonateEmail
    };
};
