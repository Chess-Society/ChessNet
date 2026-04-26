import { adminDb } from '$lib/server/firebase-admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const parentEmail = event.locals.user?.email?.toLowerCase();
    
    if (!parentEmail) return { students: [], announcements: [] };

    // 1. Fetch Students linked to this parent
    const studentsSnapshot = await adminDb.collection('students')
        .where('parentEmail', '==', parentEmail)
        .get();

    const students = studentsSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
    }));

    // 2. Extract School IDs to fetch specific announcements
    const schoolIds = [...new Set(students.map((s: any) => s.schoolId).filter(Boolean))];

    // 3. Fetch Announcements
    // - Global announcements
    // - School-specific announcements
    let announcementsQuery = adminDb.collection('announcements')
        .where('isPublished', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(10);

    const announcementsSnapshot = await announcementsQuery.get();
    
    // Filter announcements in memory because Firestore doesn't support complex OR queries easily with orderBy
    const allAnnouncements = announcementsSnapshot.docs.map((doc: any) => {
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

    return {
        students,
        announcements: allAnnouncements
    };
};
