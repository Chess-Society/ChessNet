import { adminDb, Filter } from './firebase-admin';


export type UserRole = 'admin' | 'teacher' | 'parent' | 'student' | 'none';

export async function getUserRole(email: string): Promise<UserRole> {
    const cleanEmail = email.trim().toLowerCase();

    // 2. Check if Teacher/Director
    // Teachers are in the 'users' collection
    const userSnap = await adminDb.collection('users').where('email', '==', cleanEmail).limit(1).get();
    if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        if (userData?.role === 'admin' || userData?.role === 'director') return 'admin';
        return 'teacher';
    }

    // 3. Check if Parent or Student (Informational Access)
    const studentsSnap = await adminDb.collection('students')
        .where(Filter.or(
            Filter.where('parentEmail', '==', cleanEmail),
            Filter.where('parent_email', '==', cleanEmail),
            Filter.where('email', '==', cleanEmail),
            Filter.where('studentEmail', '==', cleanEmail)
        ))
        .limit(1)
        .get();
    
    if (!studentsSnap.empty) {
        const studentData = studentsSnap.docs[0].data();
        // If the email matches the student's own email, it's a 'student' role
        if (studentData.email?.toLowerCase() === cleanEmail || studentData.studentEmail?.toLowerCase() === cleanEmail) {
            return 'student';
        }
        return 'parent';
    }

    // 4. Check if Student (Adult student with their own email)
    // We might want to support students logging in with their own email too.
    // For now, let's stick to parents as requested.

    return 'none';
}
