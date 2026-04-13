import { adminDb } from '$lib/firebase-admin';
import { error, redirect } from '@sveltejs/kit';

export async function getUserPlan(uid: string) {
    try {
        const doc = await adminDb.collection('app_settings').doc(uid).get();
        if (!doc.exists) return 'free';
        return doc.data()?.settings?.plan || 'free';
    } catch (err) {
        console.error('Error fetching user plan:', err);
        return 'free';
    }
}

export async function checkPlanGating(event: any, requiredPlan: 'free' | 'premium') {
    if (!event.locals.user) {
        throw redirect(303, '/login');
    }

    const plan = await getUserPlan(event.locals.user.uid);
    
    if (requiredPlan === 'premium' && plan !== 'premium') {
        throw redirect(303, '/panel/planes?reason=premium_required');
    }
}

export async function checkStudentLimit(uid: string) {
    const plan = await getUserPlan(uid);
    if (plan === 'premium') return true;

    // Plan free: limit 12 students
    const snapshot = await adminDb.collection("students")
        .where("owner_id", "==", uid)
        .count()
        .get();
        
    const count = snapshot.data().count;
    return count < 12;
}
