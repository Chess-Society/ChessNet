/**
 * Configuración global del sistema.
 */

export const PLANS = {
    FREE: 'free',
    PREMIUM: 'premium'
};

export const PUBLIC_ROUTES = ['/', '/login', '/pricing', '/planes', '/legal'];
export const MAINTENANCE_EXEMPT_ROUTES = ['/admin', '/login', '/api/stripe/webhook'];
