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
            console.log('✅ [FirebaseAdmin] Initialized successfully with Service Account');
        } else if (projectId) {
            // En local, intentar usar ADC o simplemente avisar
            try {
                admin.initializeApp({ projectId });
                initialized = true;
                console.warn('⚠️ [FirebaseAdmin] Initialized with Default Credentials. This might fail if GOOGLE_APPLICATION_CREDENTIALS is not set.');
            } catch (abc) {
                console.error('❌ [FirebaseAdmin] Basic initialization failed. Requires FB_CLIENT_EMAIL and FB_PRIVATE_KEY in .env');
            }
        }
    } catch (error) {
        console.error('❌ [FirebaseAdmin] Fatal error initializing SDK:', error);
    }
} else {
    initialized = true;
}

export const isFirebaseAdminInitialized = initialized;

// Exportamos getters que lanzan un error claro si se usan sin estar inicializados
export const adminDb = initialized ? getFirestore() : new Proxy({} as any, {
    get(target, prop) {
        const msg = '❌ [FirebaseAdmin] Error: adminDb se intentó usar pero el SDK no se inicializó correctamente. ' + 
            'Asegúrate de configurar FB_CLIENT_EMAIL y FB_PRIVATE_KEY en tu entorno de producción.';
        
        if (publicEnv.PUBLIC_FIREBASE_PROJECT_ID && !initialized) {
            // console.warn('⚠️ [FirebaseAdmin] SDK no inicializado. Usando modo degradado.');
        }

        return (...args: any[]) => {
            console.error(msg);
            throw new Error(msg);
        };
    }
});

export const adminAuth = initialized ? getAuth() : new Proxy({} as any, {
    get(target, prop) {
        const msg = '❌ [FirebaseAdmin] Error: adminAuth se intentó usar pero el SDK no se inicializó correctamente. ' +
            'Asegúrate de configurar FB_CLIENT_EMAIL y FB_PRIVATE_KEY en tu entorno de producción.';
            
        return (...args: any[]) => {
            console.error(msg);
            throw new Error(msg);
        };
    }
});
