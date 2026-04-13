import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

/**
 * IMPORTANTE: Para producción en Netlify/Vercel, debes configurar estas variables:
 * FB_CLIENT_EMAIL: El email de la cuenta de servicio
 * FB_PRIVATE_KEY: La clave privada (con los \n correctamente escapados)
 * PUBLIC_FIREBASE_PROJECT_ID: El ID de tu proyecto (ya existe en .env)
 */

if (!admin.apps.length) {
    const projectId = privateEnv.FB_PROJECT_ID || publicEnv.PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = privateEnv.FB_CLIENT_EMAIL;
    const privateKey = privateEnv.FB_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (clientEmail && privateKey) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            console.log('✅ Firebase Admin SDK inicializado');
        } catch (error) {
            console.error('❌ Error inicializando Firebase Admin SDK:', error);
        }
    } else {
        console.warn('⚠️ Firebase Admin no inicializado: Faltan credenciales.');
    }
}

// Exportamos proxies o getters para evitar el error "no-app" durante el build si no hay credenciales
export const adminDb = admin.apps.length ? getFirestore() : null as any as ReturnType<typeof getFirestore>;
export const adminAuth = admin.apps.length ? getAuth() : null as any as ReturnType<typeof getAuth>;

