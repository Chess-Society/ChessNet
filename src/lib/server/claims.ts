/**
 * src/lib/server/claims.ts
 *
 * Utilidades para gestionar Firebase Custom Claims.
 *
 * STATUS: Preparado para futura migración (SEC-01).
 *
 * MIGRACIÓN A CUSTOM CLAIMS (cuando esté listo):
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Ejecutar `setAdminClaim(uid)` para cada admin existente en ADMIN_EMAILS
 * 2. Actualizar `firestore.rules`: cambiar `isSuperAdmin()` a usar
 *    `request.auth.token.admin == true` en lugar de la lista de emails
 * 3. Actualizar `hooks.server.ts` `authenticate()`: leer
 *    `decodedToken.admin === true` en lugar de comparar con ADMIN_EMAILS
 * 4. Eliminar ADMIN_EMAILS de constants.ts (solo mantener como fallback)
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
 * Verifica si un usuario tiene el claim de admin sin consultar la lista estática.
 * Usar esto en el futuro en lugar de ADMIN_EMAILS.includes(email).
 */
export async function hasAdminClaim(uid: string): Promise<boolean> {
    try {
        const claims = await getUserClaims(uid);
        return claims.admin === true;
    } catch {
        return false;
    }
}
