import { redirect, type Handle } from '@sveltejs/kit';

// We define these here to avoid any $lib import issues during SvelteKit build analysis
const ADMIN_EMAILS = [
    'andreslgumuzio@gmail.com',
    'tomih@chess-society.com',
    'admin@chessnet.app'
];

const MAINTENANCE_EXEMPT_ROUTES = ['/admin', '/auth/login', '/api/stripe/webhook', '/mantenimiento'];

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Session & Impersonation Handling
	const session = event.cookies.get('session');
	const impersonate = event.cookies.get('impersonate_id');

	event.locals.user = session ? { email: session } : null;
    
    const userEmail = event.locals.user?.email?.toLowerCase();
	event.locals.isAdmin = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;
	event.locals.impersonateEmail = impersonate || null;

	// 2. Admin Security Guard
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.isAdmin) {
			throw redirect(303, '/login?error=unauthorized');
		}
	}

	// 3. Maintenance Guard (Server-side check)
    const isExempt = MAINTENANCE_EXEMPT_ROUTES.some(route => event.url.pathname.startsWith(route));
    
    if (!isExempt) {
        try {
            // Lazy load the admin DB ONLY when needed and in a real request
            const { adminDb } = await import('./lib/firebase-admin');
            if (adminDb) {
                const configDoc = await adminDb.collection('system').doc('config').get();
                const isMaintenance = configDoc.exists ? configDoc.data()?.maintenance_mode === true : false;

                if (isMaintenance && !event.locals.isAdmin) {
                    throw redirect(307, '/mantenimiento');
                }
            }
        } catch (error) {
            // Rethrow redirects, ignore other errors (e.g. build-time missing DB)
            if (error && typeof error === 'object' && 'status' in error) throw error;
        }
    }

	return await resolve(event);
};
