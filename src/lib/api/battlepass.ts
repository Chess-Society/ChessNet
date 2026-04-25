import { db } from "$lib/firebase";
import { doc, updateDoc, increment, arrayUnion, runTransaction, serverTimestamp } from "firebase/firestore";
import { XP_PER_TIER, possibleRewards } from "$lib/data/economy";

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
      
      // Calculate new tier
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
  async claimTier(userId: string, tierLevel: number, reward: { type: string, value: any }): Promise<void> {
    if (!userId) throw new Error("No user ID provided");
    const userRef = doc(db, 'users', userId);
    
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw new Error("User not found");
      
      const data = userDoc.data();
      const bp = data?.economy?.battlePass;
      const claimedTiers = bp?.claimedTiers || [];
      if (claimedTiers.includes(tierLevel)) {
        throw new Error("Tier already claimed");
      }
      
      if (tierLevel > (bp?.currentTier || 1)) {
        throw new Error("Tier not reached yet");
      }

      const updates: Record<string, any> = {
        'economy.battlePass.claimedTiers': arrayUnion(tierLevel)
      };

      // Handle different reward types
      const { type, value } = reward;
      
      if (type === 'nets') {
        updates['economy.netsBalance'] = increment(value);
        updates['economy.totalNetsEarned'] = increment(value);
      } else if (type === 'emote') {
        updates['economy.collection.emotes'] = arrayUnion(value);
      } else if (type === 'font') {
        updates['economy.collection.fonts'] = arrayUnion(value);
      } else if (type === 'color') {
        updates['economy.collection.colors'] = arrayUnion(value);
      } else if (type === 'badge') {
        updates['economy.collection.badges'] = arrayUnion(value);
      } else if (type === 'frame') {
        updates['economy.collection.frames'] = arrayUnion(value);
      } else if (type === 'theme') {
        updates['economy.collection.themes'] = arrayUnion(value);
      } else if (type === 'effect') {
        updates['economy.collection.effects'] = arrayUnion(value);
      } else if (type === 'crate') {
        // Logic for adding a crate could go here, or just increment a counter
        updates[`economy.inventory.crates.${value}`] = increment(1);
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
  },

  /**
   * Opens a crate, deducting nets and adding the item to collection.
   */
  async openCrate(userId: string, cost: number, crateType: string): Promise<any> {
    if (!userId) throw new Error("No user ID provided");
    const userRef = doc(db, 'users', userId);
    
    let finalWinner: any = null;

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw new Error("User not found");
      
      const data = userDoc.data();
      const nets = data?.economy?.netsBalance || 0;
      
      if (nets < cost) throw new Error("Insufficient Nets");

      const updates: Record<string, any> = {
        'economy.netsBalance': increment(-cost)
      };

      // --- Secure RNG Server-Side ---
      // Selection logic based on crate type
      let itemsPool = [];
      if (crateType === 'epic') {
        // Epic crates: 60% Epic, 30% Legendary, 10% Mythic
        itemsPool = possibleRewards.filter(r => ['Epic', 'Legendary', 'Mythic'].includes(r.rarity));
      } else if (crateType === 'rare') {
        // Rare crates: 50% Rare, 40% Epic, 10% Legendary
        itemsPool = possibleRewards.filter(r => ['Rare', 'Epic', 'Legendary'].includes(r.rarity));
      } else {
        // Basic crates: 60% Common, 30% Uncommon, 10% Rare
        itemsPool = possibleRewards.filter(r => ['Common', 'Uncommon', 'Rare'].includes(r.rarity));
      }
      
      // Fallback if pool is empty
      if (itemsPool.length === 0) itemsPool = possibleRewards;
      
      const winner = itemsPool[Math.floor(Math.random() * itemsPool.length)];
      finalWinner = winner;

      const type = winner.type;
      const value = winner.name;
      
      const collectionKey = `economy.collection.${type}s`; // e.g. emotes, fonts, colors
      
      // Special case for types that don't end in 's' or have different mapping
      let finalKey = collectionKey;
      if (type === 'badge') finalKey = 'economy.collection.badges';
      if (type === 'theme') finalKey = 'economy.collection.themes';
      if (type === 'frame') finalKey = 'economy.collection.frames';
      if (type === 'font') finalKey = 'economy.collection.fonts';
      if (type === 'color') finalKey = 'economy.collection.colors';
      if (type === 'emote') finalKey = 'economy.collection.emotes';

      updates[finalKey] = arrayUnion(value);

      transaction.update(userRef, updates);
    });

    return finalWinner;
  },

  /**
   * Equips a cosmetic item from the collection.
   */
  async equipItem(userId: string, type: 'color' | 'frame' | 'font' | 'badge', value: string): Promise<void> {
    if (!userId) throw new Error("No user ID provided");
    const userRef = doc(db, 'users', userId);
    
    const fieldMap = {
      color: 'economy.activeColor',
      frame: 'economy.activeFrame',
      font: 'economy.activeFont',
      badge: 'economy.activeBadge'
    };

    await updateDoc(userRef, {
      [fieldMap[type]]: value
    });
  },

  /**
   * Directly purchase an item from the shop.
   */
  async buyShopItem(userId: string, item: { name: string, type: string, price: number, value?: any }): Promise<void> {
    if (!userId) throw new Error("No user ID provided");
    const userRef = doc(db, 'users', userId);

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw new Error("User not found");
      
      const data = userDoc.data();
      const currentBalance = data?.economy?.netsBalance || 0;
      
      if (currentBalance < item.price) {
        throw new Error("Insufficient Nets");
      }

      const updates: Record<string, any> = {
        'economy.netsBalance': increment(-item.price)
      };

      const type = item.type;
      const value = item.value || item.name;
      
      const collectionKeyMap: Record<string, string> = {
        'emote': 'economy.collection.emotes',
        'font': 'economy.collection.fonts',
        'color': 'economy.collection.colors',
        'frame': 'economy.collection.frames',
        'theme': 'economy.collection.themes',
        'badge': 'economy.collection.badges'
      };

      const finalKey = collectionKeyMap[type];
      if (finalKey) {
        updates[finalKey] = arrayUnion(value);
      }

      transaction.update(userRef, updates);
    });
  }
};
