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
    try {
        const projectId = publicEnv.PUBLIC_FIREBASE_PROJECT_ID;
        const clientEmail = privateEnv.FB_CLIENT_EMAIL;
        const privateKey = privateEnv.FB_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!clientEmail || !privateKey) {
            console.warn('⚠️ Firebase Admin no inicializado: Faltan FB_CLIENT_EMAIL o FB_PRIVATE_KEY');
        } else {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            console.log('✅ Firebase Admin SDK inicializado correctamente');
        }
    } catch (error) {
        console.error('❌ Error inicializando Firebase Admin SDK:', error);
    }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
