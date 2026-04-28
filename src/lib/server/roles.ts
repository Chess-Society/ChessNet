import { adminDb, Filter } from './firebase-admin';


export type UserRole = 'admin' | 'teacher' | 'parent' | 'student' | 'none';

// Simple in-memory cache for roles to prevent redundant Firestore hits on every request
const ROLE_CACHE_TTL = 60 * 1000; // 1 minute
const roleCache = new Map<string, { role: UserRole; expiry: number }>();

export async function getUserRole(email: string): Promise<UserRole> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Cache
    const cached = roleCache.get(cleanEmail);
    if (cached && cached.expiry > Date.now()) {
        return cached.role;
    }

    let role: UserRole = 'none';

    try {
        // 2. Check if Teacher/Director
        const userSnap = await adminDb.collection('users').where('email', '==', cleanEmail).limit(1).get();
        if (!userSnap.empty) {
            const userData = userSnap.docs[0].data();
            role = (userData?.role === 'admin' || userData?.role === 'director') ? 'admin' : 'teacher';
        } else {
            // 3. Check if Parent or Student (Informational Access)
            const studentsSnap = await adminDb.collection('students')
                .where(Filter.or(
                    Filter.where('parentEmail', '==', cleanEmail),
                    Filter.where('parentEmail', '==', cleanEmail),
                    Filter.where('email', '==', cleanEmail),
                    Filter.where('studentEmail', '==', cleanEmail)
                ))
                .limit(1)
                .get();
            
            if (!studentsSnap.empty) {
                const studentData = studentsSnap.docs[0].data();
                const isStudent = studentData.email?.toLowerCase() === cleanEmail || 
                                  studentData.studentEmail?.toLowerCase() === cleanEmail;
                role = isStudent ? 'student' : 'parent';
            }
        }
    } catch (err) {
        console.error(`[Roles] Error fetching role for ${cleanEmail}:`, err);
    }

    // Update Cache
    roleCache.set(cleanEmail, { role, expiry: Date.now() + ROLE_CACHE_TTL });
    return role;
}

