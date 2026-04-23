/**
 * scripts/set-admin-claims.ts
 *
 * Script para conceder privilegios de administrador (Custom Claims)
 * a los correos electrónicos autorizados en firestore.rules.
 *
 * USO:
 * 1. Asegúrate de tener las credenciales en .env (FB_CLIENT_EMAIL, FB_PRIVATE_KEY, FB_PROJECT_ID)
 * 2. Ejecuta: npx tsx scripts/set-admin-claims.ts
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

// Cargar variables de entorno
dotenv.config();
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const ADMIN_EMAILS = [
    "andreslgumuzio@gmail.com"
];

async function main() {
    const projectId = process.env.FB_PROJECT_ID || process.env.PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FB_CLIENT_EMAIL;
    let privateKey = process.env.FB_PRIVATE_KEY;

    if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // Intentar inicializar con variables de entorno o con archivo service-account.json
    const serviceAccountPath = resolve(process.cwd(), 'service-account.json');

    if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    } else if (existsSync(serviceAccountPath)) {
        console.log('📂 Usando archivo service-account.json para autenticación...');
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        console.error('❌ Error: Faltan credenciales de Firebase Admin (FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY) en el .env');
        console.log('Sugerencia: Descarga el JSON de tu cuenta de servicio desde Firebase Console -> Configuración -> Cuentas de servicio y guárdalo como "service-account.json" en la raíz.');
        process.exit(1);
    }

    console.log(`🚀 Iniciando proceso de asignación de Custom Claims para ${ADMIN_EMAILS.length} usuarios...`);

    const auth = admin.auth();

    for (const email of ADMIN_EMAILS) {
        try {
            const user = await auth.getUserByEmail(email);
            await auth.setCustomUserClaims(user.uid, { admin: true });
            console.log(`✅ [${email}] Custom Claim 'admin: true' asignado con éxito (UID: ${user.uid})`);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                console.warn(`⚠️  [${email}] El usuario aún no existe en Firebase Auth. Se saltará.`);
            } else {
                console.error(`❌ [${email}] Error al asignar claim:`, error.message);
            }
        }
    }

    console.log('\n✨ Proceso finalizado. Los usuarios deberán cerrar sesión y volver a entrar para refrescar sus tokens.');
}

main().catch(console.error);
