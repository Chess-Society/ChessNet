import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Cargar variables de entorno locales
dotenv.config();

const projectId = process.env.FB_PROJECT_ID || process.env.PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FB_CLIENT_EMAIL;
let privateKey = process.env.FB_PRIVATE_KEY;

if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
    }
}

if (!projectId || !clientEmail || !privateKey) {
    console.error('Faltan credenciales de Firebase en el archivo .env');
    process.exit(1);
}

initializeApp({
    credential: cert({
        projectId,
        clientEmail,
        privateKey,
    }),
});

const db = getFirestore();

async function migrateBattlePass() {
    console.log('Iniciando migración de Battle Pass...');
    
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        
        let count = 0;
        let skipped = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            
            // Solo actualizar si tiene 'economy' pero NO tiene 'battlePass'
            if (data.economy && !data.economy.battlePass) {
                const initialBattlePass = {
                    seasonId: 'season_1',
                    currentXp: 0,
                    currentTier: 1,
                    isPremium: false,
                    claimedTiers: [],
                    dailyChallenges: {
                        "play_1": { progress: 0, total: 1, claimed: false, xp: 50, resetAt: null },
                        "win_1": { progress: 0, total: 1, claimed: false, xp: 100, resetAt: null }
                    },
                    weeklyChallenges: {
                        "play_10": { progress: 0, total: 10, claimed: false, xp: 500, resetAt: null }
                    }
                };

                await doc.ref.update({
                    'economy.battlePass': initialBattlePass,
                    'economy.lastUpdated': FieldValue.serverTimestamp()
                });

                count++;
                console.log(`Documento ${doc.id} actualizado.`);
            } else {
                skipped++;
            }
        }
        
        console.log(`\nMigración completada!`);
        console.log(`- Documentos actualizados: ${count}`);
        console.log(`- Documentos omitidos (ya tenían battlePass): ${skipped}`);
        console.log(`- Total de documentos: ${snapshot.size}`);

    } catch (error) {
        console.error('Error durante la migración:', error);
    }
}

migrateBattlePass();
