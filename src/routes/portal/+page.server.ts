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
    const classIds = [...new Set(students.map((s: any) => s.classId).filter(Boolean))];

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
        if (ann.isGlobal || ann.isSystem) return false;
        
        const isFromMyTeacher = students.some((s: any) => s.ownerId === ann.ownerId);
        const isFromMySchool = ann.schoolId && ann.schoolId !== 'all' && schoolIds.includes(ann.schoolId);
        
        if (!isFromMyTeacher && !isFromMySchool) return false;

        if (ann.targetType === 'all') return true;
        if (ann.targetType === 'school') {
            return !ann.targetId || ann.targetId === 'all' || schoolIds.includes(ann.targetId);
        }
        if (ann.targetType === 'class') {
            return classIds.includes(ann.targetId);
        }
        if (ann.targetType === 'student' || ann.targetType === 'parent') {
            return students.some((s: any) => s.id === ann.targetId);
        }

        return false;
    });

    return {
        students,
        announcements: allAnnouncements
    };
};
