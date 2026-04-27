import admin from 'firebase-admin';
import { getFirestore, Filter } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

export { Filter };
export function ownerFilter(uid: string) {
    return Filter.or(
        Filter.where('owner_id', '==', uid),
        Filter.where('ownerId', '==', uid)
    );
}
import { env as privateEnv } from '$env/dynamic/private';
import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { building, dev } from '$app/environment';
import fs from 'fs';
import path from 'path';

let initialized = false;

function initializeAdmin() {
    if (initialized || admin.apps.length > 0) {
        initialized = true;
        return;
    }

    // Never initialize during build
    if (building) return;

    const projectId = privateEnv.FB_PROJECT_ID || PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = privateEnv.FB_CLIENT_EMAIL;
    let privateKey = privateEnv.FB_PRIVATE_KEY;

    if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n');
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.substring(1, privateKey.length - 1);
        }
    }

    try {
        if (clientEmail && privateKey && projectId) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            initialized = true;
            console.log('✅ [FirebaseAdmin] Initialized successfully with Service Account');
        } else if (dev && fs.existsSync(path.resolve('service-account.json'))) {
            try {
                const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('service-account.json'), 'utf8'));
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                initialized = true;
                console.log('✅ [FirebaseAdmin] Initialized successfully using local service-account.json');
            } catch (err) {
                console.error('❌ [FirebaseAdmin] Failed to load local service-account.json:', err);
            }
        } else if (projectId) {
            // Check if we are in a Google Cloud environment that might have ADC
            // If not, don't even try to initialize with just projectId as it triggers the "Default Credentials" error
            if (privateEnv.K_SERVICE || privateEnv.FUNCTIONS_EMULATOR || privateEnv.VERCEL_URL) {
                console.warn('⚠️ [FirebaseAdmin] Attempting Default Credentials fallback in cloud/emulator environment...');
                try {
                    admin.initializeApp({ projectId });
                    initialized = true;
                    console.log('✅ [FirebaseAdmin] Initialized with Default Credentials.');
                } catch (abc) {
                    console.error('❌ [FirebaseAdmin] Default Credentials fallback failed.');
                }
            } else {
                console.warn('⚠️ [FirebaseAdmin] Missing Service Account keys (FB_CLIENT_EMAIL/FB_PRIVATE_KEY) and no local service-account.json found. SDK remains uninitialized.');
            }
        }
    } catch (error) {
        console.error('❌ [FirebaseAdmin] Fatal error during SDK initialization:', error);
    }
}

export const isFirebaseAdminInitialized = () => {
    if (!initialized) initializeAdmin();
    return initialized;
};

// Proxies to handle lazy initialization and provide clear error messages
export const adminDb = new Proxy({} as any, {
    get(target, prop) {
        if (!initialized) initializeAdmin();
        
        if (!initialized || admin.apps.length === 0) {
            if (building) return undefined; // Silent failure during build
            
            const msg = '❌ [FirebaseAdmin] Error: adminDb se intentó usar pero el SDK no se inicializó correctamente. ' + 
                'Asegúrate de configurar FB_CLIENT_EMAIL y FB_PRIVATE_KEY en tu entorno de producción.';
            console.error(msg);
            throw new Error(msg);
        }
        
        const db = getFirestore();
        const value = (db as any)[prop];
        return typeof value === 'function' ? value.bind(db) : value;
    },
    apply(target, thisArg, argumentsList) {
        if (!initialized) initializeAdmin();
        const db = getFirestore();
        return (db as any).apply(thisArg, argumentsList);
    }
});

export const adminAuth = new Proxy({} as any, {
    get(target, prop) {
        if (!initialized) initializeAdmin();
        
        if (!initialized || admin.apps.length === 0) {
            if (building) return undefined;
            
            const msg = '❌ [FirebaseAdmin] Error: adminAuth se intentó usar pero el SDK no se inicializó correctamente. ' +
                'Asegúrate de configurar FB_CLIENT_EMAIL y FB_PRIVATE_KEY en tu entorno de producción.';
            console.error(msg);
            throw new Error(msg);
        }
        
        const auth = getAuth();
        const value = (auth as any)[prop];
        return typeof value === 'function' ? value.bind(auth) : value;
    },
    apply(target, thisArg, argumentsList) {
        if (!initialized) initializeAdmin();
        const auth = getAuth();
        return (auth as any).apply(thisArg, argumentsList);
    }
});
