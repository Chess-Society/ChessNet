import { db } from "$lib/firebase";
import { doc, updateDoc, increment, arrayUnion, runTransaction, serverTimestamp } from "firebase/firestore";

export const battlepassApi = {
  /**
   * Grants XP to the user and recalculates their tier if they level up.
   */
  async grantXp(userId: string, xpAmount: number): Promise<void> {
    if (!userId) throw new Error("No user ID provided");
    const userRef = doc(db, 'users', userId);
    
    // Using transaction to safely increment XP and potentially increase tier
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw new Error("User not found");
      
      const data = userDoc.data();
      const bp = data?.economy?.battlePass;
      
      if (!bp) {
        // Initialize Battle Pass if not present
        transaction.update(userRef, {
          'economy.battlePass': {
            seasonId: 'season-1',
            currentXp: xpAmount,
            currentTier: 1,
            isPremium: false,
            claimedTiers: [],
            dailyChallenges: {},
            weeklyChallenges: {}
          }
        });
        return;
      }

      let newXp = (bp.currentXp || 0) + xpAmount;
      let newTier = bp.currentTier || 1;
      
      // Calculate new tier (e.g., 2000 XP per tier)
      const XP_PER_TIER = 2000;
      const expectedTier = Math.floor(newXp / XP_PER_TIER) + 1;
      
      if (expectedTier > newTier) {
        newTier = expectedTier;
      }

      transaction.update(userRef, {
        'economy.battlePass.currentXp': newXp,
        'economy.battlePass.currentTier': newTier
      });
    });
  },

  /**
   * Claims a reward for a specific tier.
   */
  async claimTier(userId: string, tierLevel: number, rewardNets: number = 0): Promise<void> {
    if (!userId) throw new Error("No user ID provided");
    const userRef = doc(db, 'users', userId);
    
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw new Error("User not found");
      
      const data = userDoc.data();
      const claimedTiers = data?.economy?.battlePass?.claimedTiers || [];
      
      if (claimedTiers.includes(tierLevel)) {
        throw new Error("Tier already claimed");
      }

      const updates: Record<string, any> = {
        'economy.battlePass.claimedTiers': arrayUnion(tierLevel)
      };

      if (rewardNets > 0) {
        updates['economy.netsBalance'] = increment(rewardNets);
        updates['economy.totalNetsEarned'] = increment(rewardNets);
      }

      transaction.update(userRef, updates);
    });
  },

  /**
   * Claims a completed challenge and awards XP.
   */
  async claimChallenge(userId: string, challengeId: string, type: 'daily' | 'weekly', xpReward: number): Promise<void> {
     if (!userId) throw new Error("No user ID provided");
     const userRef = doc(db, 'users', userId);
     
     // First mark as claimed
     await updateDoc(userRef, {
       [`economy.battlePass.${type}Challenges.${challengeId}.claimed`]: true,
     });

     // Then grant XP (which handles tier recalculation)
     await this.grantXp(userId, xpReward);
  }
};
