import { adminAuth } from './firebase-admin';

/**
 * Grants admin custom claims to a user.
 * @param uid The user's UID
 * @returns Promise<void>
 */
export async function grantAdmin(uid: string) {
    try {
        await adminAuth.setCustomUserClaims(uid, { admin: true });
        console.log(`[AdminUtils] Successfully granted admin claims to user: ${uid}`);
    } catch (error) {
        console.error(`[AdminUtils] Error granting admin claims to user: ${uid}`, error);
        throw error;
    }
}

/**
 * Revokes admin custom claims from a user.
 * @param uid The user's UID
 * @returns Promise<void>
 */
export async function revokeAdmin(uid: string) {
    try {
        await adminAuth.setCustomUserClaims(uid, { admin: false });
        console.log(`[AdminUtils] Successfully revoked admin claims from user: ${uid}`);
    } catch (error) {
        console.error(`[AdminUtils] Error revoking admin claims from user: ${uid}`, error);
        throw error;
    }
}

/**
 * Lists all custom claims for a user.
 * @param uid The user's UID
 * @returns Promise<any>
 */
export async function getUserClaims(uid: string) {
    const user = await adminAuth.getUser(uid);
    return user.customClaims;
}
