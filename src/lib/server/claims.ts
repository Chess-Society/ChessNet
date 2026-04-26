/**
 * src/lib/server/claims.ts
 *
 * Utilidades para gestionar Firebase Custom Claims.
 *
 * STATUS: Migración completada (SEC-01).
 *
 * MIGRACIÓN A CUSTOM CLAIMS:
 * ─────────────────────────────────────────────────────────────────────────
 * ✅ 1. Uso de Firebase Custom Claims (admin: true) como fuente de verdad.
 * ✅ 2. firestore.rules actualizado para usar request.auth.token.admin.
 * ✅ 3. hooks.server.ts actualizado para leer decodedToken.admin.
 * ✅ 4. Eliminada la lista ADMIN_EMAILS de constants.ts.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * USO ACTUAL (API admin):
 *   import { setAdminClaim, revokeAdminClaim, getUserClaims } from '$lib/server/claims';
 */

import { adminAuth, isFirebaseAdminInitialized } from '$lib/server/firebase-admin';

/**
 * Concede el Custom Claim `admin: true` a un usuario por UID.
 * El usuario debe cerrar sesión y volver a entrar para que el token se refresque.
 */
export async function setAdminClaim(uid: string): Promise<void> {
    if (!isFirebaseAdminInitialized()) {
        throw new Error('[Claims] Firebase Admin SDK no inicializado');
    }
    const user = await adminAuth.getUser(uid);
    const currentClaims = user.customClaims || {};
    await adminAuth.setCustomUserClaims(uid, { ...currentClaims, admin: true });
    console.log(`✅ [Claims] Admin claim concedido a ${uid} (${user.email})`);
}

/**
 * Revoca el Custom Claim `admin: true` de un usuario por UID.
 */
export async function revokeAdminClaim(uid: string): Promise<void> {
    if (!isFirebaseAdminInitialized()) {
        throw new Error('[Claims] Firebase Admin SDK no inicializado');
    }
    const user = await adminAuth.getUser(uid);
    const currentClaims = { ...(user.customClaims || {}) };
    delete currentClaims.admin;
    await adminAuth.setCustomUserClaims(uid, currentClaims);
    console.log(`🔒 [Claims] Admin claim revocado de ${uid} (${user.email})`);
}

/**
 * Devuelve los Custom Claims actuales de un usuario.
 */
export async function getUserClaims(uid: string): Promise<Record<string, unknown>> {
    if (!isFirebaseAdminInitialized()) {
        throw new Error('[Claims] Firebase Admin SDK no inicializado');
    }
    const user = await adminAuth.getUser(uid);
    return (user.customClaims || {}) as Record<string, unknown>;
}

/**
 * Verifica si un usuario tiene el claim de admin.
 */
export async function hasAdminClaim(uid: string): Promise<boolean> {
    try {
        const claims = await getUserClaims(uid);
        return claims.admin === true;
    } catch {
        return false;
    }
}
