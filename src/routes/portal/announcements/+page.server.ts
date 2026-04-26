import { adminDb } from '$lib/server/firebase-admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const parentEmail = event.locals.user?.email?.toLowerCase();
    if (!parentEmail) return { announcements: [] };

    // Fetch students to get school/class context
    const studentsSnapshot = await adminDb.collection('students')
        .where('parentEmail', '==', parentEmail)
        .get();

    const students = studentsSnapshot.docs.map((doc: any) => doc.data());
    const schoolIds = [...new Set(students.map((s: any) => s.schoolId).filter(Boolean))];

    // Fetch all active announcements
    const announcementsSnapshot = await adminDb.collection('announcements')
        .where('isPublished', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

    const announcements = announcementsSnapshot.docs.map((doc: any) => {
        const d = doc.data();
        return {
            id: doc.id,
            ...d,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt,
            isGlobal: !!(d.is_global || d.isGlobal)
        };
    }).filter((ann: any) => {
        if (ann.isGlobal) return true;
        if (ann.schoolId && schoolIds.includes(ann.schoolId)) return true;
        return false;
    });

    return { announcements };
};
