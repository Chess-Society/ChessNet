import { adminDb, adminAuth, isFirebaseAdminInitialized } from '$lib/server/firebase-admin';
import { error, redirect } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$lib/constants';

export async function getUserPlan(uid: string) {
    try {
        // First check if the user is in the admin list by fetching their auth record
        // This is a bit expensive but ensures consistency for admins
        // Wrap in a sub-try/catch to avoid crashing the whole function if auth lookup fails
        if (!isFirebaseAdminInitialized()) {
            return 'free'; // Default to free if not initialized in production
        }

        try {
            const userRecord = await adminAuth.getUser(uid);
            if (userRecord.email && ADMIN_EMAILS.includes(userRecord.email.toLowerCase())) {
                return 'premium';
            }
        } catch (authErr) {
            // Continue to check database plan
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

    const plan = await getUserPlan(event.locals.user.uid);
    const isAdmin = event.locals.isAdmin;
    
    // Admins have full access
    if (isAdmin) return;
    
    if (requiredPlan === 'premium' && plan !== 'premium') {
        throw redirect(303, '/pricing?reason=premium_required');
    }
}

export async function checkStudentLimit(uid: string) {
    const plan = await getUserPlan(uid);
    if (plan === 'premium') return true;

    // Plan free: limit 10 students
    const snapshot = await adminDb.collection("students")
        .where("owner_id", "==", uid)
        .count()
        .get();
        
    const count = snapshot.data().count;
    return count < 10;
}

export async function checkSchoolLimit(uid: string) {
    const plan = await getUserPlan(uid);
    if (plan === 'premium') return true;

    // Plan free: limit 1 school
    const snapshot = await adminDb.collection("schools")
        .where("owner_id", "==", uid)
        .count()
        .get();
        
    const count = snapshot.data().count;
    return count < 1;
}

export async function checkClassLimit(uid: string) {
    const plan = await getUserPlan(uid);
    if (plan === 'premium') return true;

    // Plan free: limit 1 class
    const snapshot = await adminDb.collection("classes")
        .where("owner_id", "==", uid)
        .count()
        .get();
        
    const count = snapshot.data().count;
    return count < 1;
}
