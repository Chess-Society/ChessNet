/**
 * ADMIN_EMAILS — Lista de correos con permisos de superadministrador.
 *
 * ⚠️  IMPORTANTE — FUENTE DUAL:
 * Esta lista está DUPLICADA intencionalmente en `firestore.rules` (función `isSuperAdmin`).
 * Si añades o eliminas un email aquí, DEBES hacer lo mismo en firestore.rules y re-desplegar
 * las reglas con `firebase deploy --only firestore:rules`.
 *
 * TODO (futuro): Migrar a Firebase Custom Claims para tener una sola fuente de verdad.
 */
export const ADMIN_EMAILS = [
    'andreslgumuzio@gmail.com',
    'tomih@chess-society.com',
    'escuelatopchess@gmail.com',
    'tomihersan@gmail.com',
    'tomih@chessnet.pro',
    'admin@chessnet.pro'
];

export const PLANS = {
    FREE: 'free',
    PREMIUM: 'premium'
};

export const PUBLIC_ROUTES = ['/', '/login', '/pricing', '/planes', '/legal'];
export const MAINTENANCE_EXEMPT_ROUTES = ['/admin', '/login', '/api/stripe/webhook'];
