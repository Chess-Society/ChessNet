import { redirect, type Handle } from '@sveltejs/kit';

// We hardcode these here to ensure the build NEVER fails due to complex imports in hooks.
// SvelteKit's build analysis can be sensitive to dynamic imports in this file.
const ADMIN_EMAILS = [
    'andreslgumuzio@gmail.com',
    'tomih@chess-society.com',
    'admin@chessnet.app'
];

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Session Handling
    // We use a simple cookie-based session for the server-side locals
	const session = event.cookies.get('session');
    const impersonate = event.cookies.get('impersonate_id');
    
	event.locals.user = session ? { email: session } : null;
    
    const userEmail = event.locals.user?.email?.toLowerCase();
	event.locals.isAdmin = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;
	event.locals.impersonateEmail = impersonate || null;

	// 2. Admin Security Guard
    // Protected routes for system administrators
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.isAdmin) {
			throw redirect(303, '/auth/login?error=unauthorized');
		}
	}

    // 3. Maintenance check is skipped here and handled in routes to avoid build blockers
    // if you need a global lock, it's better to use a dedicated API or layout load.

	return await resolve(event);
};
