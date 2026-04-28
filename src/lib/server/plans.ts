import { adminDb, adminAuth, isFirebaseAdminInitialized, Filter } from '$lib/server/firebase-admin';
import { error, redirect } from '@sveltejs/kit';


export async function getUserPlan(uid: string, isAdmin?: boolean) {
    try {
        // Admins and Developer Bypass Handling
        if (isAdmin || uid === 'antigravity-dev-worker') {
            return 'premium';
        }

        // Check if the user is in the admin list by fetching their auth record (legacy check)
        if (isFirebaseAdminInitialized()) {
            try {
                const userRecord = await adminAuth.getUser(uid);
                if (userRecord.customClaims?.admin === true) {
                    return 'premium';
                }
            } catch (authErr) {
                // Continue to check database plan
            }
        }

        // The webhook updates the 'users' collection, settings.plan field
        const doc = await adminDb.collection('users').doc(uid).get();
        if (!doc.exists) return 'free';
        
        const userData = doc.data();
        const plan = userData?.settings?.plan || 'free';
        const expiresAt = userData?.settings?.planExpiresAt;

        // Si tiene fecha de expiración y ya pasó, revertir a free (lógicamente)
        if (plan === 'premium' && expiresAt) {
            const expiryDate = new Date(expiresAt);
            if (expiryDate < new Date()) {
                return 'free';
            }
        }

        return plan;
    } catch (err) {
        console.error('❌ [Plans] Fatal error fetching user plan:', err);
        return 'free';
    }
}

export async function checkPlanGating(event: any, requiredPlan: 'free' | 'premium') {
    if (!event.locals.user) {
        throw redirect(303, '/login');
    }

    const isAdmin = event.locals.isAdmin;
    if (isAdmin) return;

    const plan = await getUserPlan(event.locals.user.uid);
    
    if (requiredPlan === 'premium' && plan !== 'premium') {
        throw redirect(303, '/pricing?reason=premium_required');
    }
}

export async function checkStudentLimit(uid: string, isAdmin?: boolean) {
    if (isAdmin || uid === 'antigravity-dev-worker') return true;
    
    const plan = await getUserPlan(uid);
    if (plan === 'premium') return true;

    // Plan free: limit 10 students
    const snapshot = await adminDb.collection("students")
        .where(Filter.or(
            Filter.where('ownerId', '==', uid),
            Filter.where('ownerId', '==', uid)
        ))
        .count()
        .get();
        
    const count = snapshot.data().count;
    return count < 10;
}

export async function checkSchoolLimit(uid: string, isAdmin?: boolean) {
    if (isAdmin || uid === 'antigravity-dev-worker') return true;

    const plan = await getUserPlan(uid);
    if (plan === 'premium') return true;

    // Plan free: limit 1 school
    const snapshot = await adminDb.collection("schools")
        .where(Filter.or(
            Filter.where('ownerId', '==', uid),
            Filter.where('ownerId', '==', uid)
        ))
        .count()
        .get();
        
    const count = snapshot.data().count;
    return count < 1;
}

export async function checkClassLimit(uid: string, isAdmin?: boolean) {
    if (isAdmin || uid === 'antigravity-dev-worker') return true;

    const plan = await getUserPlan(uid);
    if (plan === 'premium') return true;

    // Plan free: limit 1 class
    const snapshot = await adminDb.collection("classes")
        .where(Filter.or(
            Filter.where('ownerId', '==', uid),
            Filter.where('ownerId', '==', uid)
        ))
        .count()
        .get();
        
    const count = snapshot.data().count;
    return count < 1;
}

export async function checkAnnouncementAccess(uid: string, isAdmin?: boolean) {
    if (isAdmin || uid === 'antigravity-dev-worker') return { allowed: true };

    const plan = await getUserPlan(uid);
    if (plan === 'premium') return { allowed: true };
    
    // Free plan users cannot send announcements
    return { 
        allowed: false, 
        reason: 'Solo los usuarios con plan Premium pueden realizar comunicados masivos.' 
    };
}
