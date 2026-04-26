import { adminDb } from './firebase-admin';


export type UserRole = 'admin' | 'teacher' | 'parent' | 'student' | 'none';

export async function getUserRole(email: string): Promise<UserRole> {
    const cleanEmail = email.trim().toLowerCase();



    // 2. Check if Teacher/Director
    // Teachers are in the 'users' collection
    const userDoc = await adminDb.collection('users').doc(cleanEmail).get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData?.role === 'admin' || userData?.role === 'director') return 'admin';
        return 'teacher';
    }

    // 3. Check if Parent (Free Access)
    // Parent access is free as it is for informational purposes only.
    const studentsAsParent = await adminDb.collection('students')
        .where('parentEmail', '==', cleanEmail)
        .limit(1)
        .get();
    
    if (!studentsAsParent.empty) {
        return 'parent';
    }

    // 4. Check if Student (Adult student with their own email)
    // We might want to support students logging in with their own email too.
    // For now, let's stick to parents as requested.

    return 'none';
}
