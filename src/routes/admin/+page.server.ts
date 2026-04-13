import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const isSuperAdmin = user?.email?.toLowerCase() === "andreslgumuzio@gmail.com";

    console.log(`🛡️ [Admin Load] User: ${user?.email || 'Guest'}, Authorized: ${isSuperAdmin}`);

    return {
        user,
        isAdmin: isSuperAdmin
    };
};
