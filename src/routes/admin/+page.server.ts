import type { PageServerLoad } from './$types';
import { ADMIN_EMAILS } from '$lib/constants';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const isAuthorized = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

    console.log(`🛡️ [Admin Load] User: ${user?.email || 'Guest'}, Authorized: ${isAuthorized}`);

    return {
        user,
        isAdmin: !!isAuthorized
    };
};
