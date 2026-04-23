import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';

export async function POST({ request }) {
    try {
        const body = await request.json().catch(() => ({}));
        
        // Simple security check to prevent accidental runs
        if (body.secret !== 'migrate-now') {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const usersSnap = await adminDb.collection('users').get();
        let count = 0;
        let skipped = 0;

        const promises = usersSnap.docs.map(async (doc: any) => {
            const data = doc.data();
            
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

                await adminDb.collection('users').doc(doc.id).update({
                    'economy.battlePass': initialBattlePass
                });
                count++;
            } else {
                skipped++;
            }
        });

        await Promise.all(promises);

        return json({
            success: true,
            updated: count,
            skipped,
            total: usersSnap.size
        });
    } catch (error: any) {
        console.error('Migration error:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
