import type { PageServerLoad } from './$types';
import { ADMIN_EMAILS } from '$lib/constants';

export const load: PageServerLoad = async ({ cookies }) => {
    const session = cookies.get('sb-auth-token');
    let user = null;
    
    if (session) {
        try {
            user = JSON.parse(decodeURIComponent(session));
        } catch (e) {
            user = null;
        }
    }

    const isAuthorized = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

    console.log(`🛡️ [Admin Load] User: ${user?.email || 'Guest'}, Authorized: ${isAuthorized}`);

    return {
        user,
        isAdmin: !!isAuthorized
    };
};
