import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

/**
 * IMPORTANTE: Para producción en Netlify/Vercel, debes configurar estas variables:
 * FB_CLIENT_EMAIL: El email de la cuenta de servicio
 * FB_PRIVATE_KEY: La clave privada (con los \n correctamente escapados)
 * FB_PROJECT_ID: El ID de tu proyecto (opcional si usas PUBLIC_FIREBASE_PROJECT_ID)
 */

let initialized = false;

if (!admin.apps.length) {
    const projectId = privateEnv.FB_PROJECT_ID || publicEnv.PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = privateEnv.FB_CLIENT_EMAIL;
    const privateKey = privateEnv.FB_PRIVATE_KEY?.replace(/\\n/g, '\n');

    try {
        if (clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        } else {
            // Intentar inicialización por defecto (útil en local con ADC o en entornos con permisos de IAM heredados)
            admin.initializeApp({
                projectId
            });
        }
        initialized = true;
    } catch (error) {
        console.error('❌ [FirebaseAdmin] Error inicializando SDK:', error);
    }
} else {
    initialized = true;
}

// Helper for development fallback
const isDev = process.env.NODE_ENV === 'development';

// Exportamos getters que lanzan un error claro si se usan sin estar inicializados
export const adminDb = initialized ? getFirestore() : new Proxy({} as any, {
    get(target, prop) {
        if (isDev && (prop === 'collection' || prop === 'doc' || prop === 'batch')) {
             if (prop === 'batch') return () => ({
                 set: () => ({}),
                 update: () => ({}),
                 delete: () => ({}),
                 commit: async () => ({})
             });
             return () => ({
                 get: async () => ({ exists: false, data: () => ({}), docs: [] }),
                 where: function() { return this; },
                 orderBy: function() { return this; },
                 limit: function() { return this; },
                 add: async () => ({ id: 'mock-id' }),
                 set: async () => ({}),
                 update: async () => ({}),
                 delete: async () => ({})
             });
        }
        throw new Error('❌ [FirebaseAdmin] adminDb utilizado pero el SDK no está inicializado. Verifica tus variables de entorno (FB_CLIENT_EMAIL, FB_PRIVATE_KEY).');
    }
});

export const adminAuth = initialized ? getAuth() : new Proxy({} as any, {
    get(target, prop) {
        if (isDev) {
            if (prop === 'createSessionCookie') return async () => 'mock-session-chessnet';
            if (prop === 'verifySessionCookie') return async () => ({
                uid: 'chessnet-dev-uid',
                email: 'admin@chessnet.pro',
                name: 'ChessNet Developer',
                picture: 'https://ui-avatars.com/api/?name=Chess+Net&background=7C3AED&color=fff',
                admin: true
            });
        }
        throw new Error('❌ [FirebaseAdmin] adminAuth utilizado pero el SDK no está inicializado. Verifica tus variables de entorno (FB_CLIENT_EMAIL, FB_PRIVATE_KEY).');
    }
});
