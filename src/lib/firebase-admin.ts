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
            initialized = true;
        } else if (projectId) {
            // Intentar inicialización por defecto (útil en local con ADC o en entornos con permisos de IAM heredados)
            admin.initializeApp({
                projectId
            });
            initialized = true;
        }
    } catch (error) {
        console.error('❌ [FirebaseAdmin] Error inicializando SDK:', error);
    }
} else {
    initialized = true;
}

// Exportamos getters que lanzan un error claro si se usan sin estar inicializados
export const adminDb = initialized ? getFirestore() : new Proxy({} as any, {
    get(target, prop) {
        throw new Error('❌ [FirebaseAdmin] Error: adminDb se intentó usar pero el SDK no se inicializó correctamente. ' + 
            'Asegúrate de configurar FB_CLIENT_EMAIL y FB_PRIVATE_KEY en tu entorno de producción.');
    }
});

export const adminAuth = initialized ? getAuth() : new Proxy({} as any, {
    get(target, prop) {
        throw new Error('❌ [FirebaseAdmin] Error: adminAuth se intentó usar pero el SDK no se inicializó correctamente. ' +
            'Asegúrate de configurar FB_CLIENT_EMAIL y FB_PRIVATE_KEY en tu entorno de producción.');
    }
});
