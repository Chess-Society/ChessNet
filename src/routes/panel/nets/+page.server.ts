import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { 
  claimTierSchema, 
  buyItemSchema, 
  claimChallengeSchema, 
  equipItemSchema, 
  openCrateSchema 
} from '$lib/schemas/nets';
import { adminDb } from '$lib/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { XP_PER_TIER, possibleRewards } from '$lib/data/economy';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
  const { locals } = event;
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  // Initialize all forms
  const claimTierForm = await superValidate(zod(claimTierSchema as any)) as any;
  const buyItemForm = await superValidate(zod(buyItemSchema as any)) as any;
  const claimChallengeForm = await superValidate(zod(claimChallengeSchema as any)) as any;
  const equipItemForm = await superValidate(zod(equipItemSchema as any)) as any;
  const openCrateForm = await superValidate(zod(openCrateSchema as any)) as any;

  return {
    claimTierForm,
    buyItemForm,
    claimChallengeForm,
    equipItemForm,
    openCrateForm
  };
};

export const actions: Actions = {
  claimTier: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const form = await superValidate(request, zod(claimTierSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    const { tierId } = form.data;
    const userRef = adminDb.collection('users').doc(locals.user.uid);

    try {
      await adminDb.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) throw new Error("User not found");
        
        const data = userDoc.data();
        const bp = data?.economy?.battlePass;
        const claimedTiers = bp?.claimedTiers || [];
        
        if (claimedTiers.includes(tierId)) throw new Error("Tier already claimed");
        if (tierId > (bp?.currentTier || 1)) throw new Error("Tier not reached yet");

        // Logic to get the reward based on tierId
        // This usually comes from a static config or season document
        // For simplicity, we'll assume the client sent the tierId and we fetch the reward
        const seasonDoc = await adminDb.collection('config').doc('season').get();
        const seasonData = seasonDoc.data();
        const tier = seasonData?.tiers?.find((t: any) => t.level === tierId);
        if (!tier) throw new Error("Tier reward not found");

        const updates: any = {
          'economy.battlePass.claimedTiers': FieldValue.arrayUnion(tierId)
        };

        const { type, value } = tier.reward;
        if (type === 'nets') {
          updates['economy.netsBalance'] = FieldValue.increment(value);
          updates['economy.totalNetsEarned'] = FieldValue.increment(value);
        } else {
          updates[`economy.collection.${type}s`] = FieldValue.arrayUnion(value);
        }

        transaction.update(userRef, updates);
      });
      return { form };
    } catch (e: any) {
      return fail(500, { form, message: e.message });
    }
  },

  buyItem: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const form = await superValidate(request, zod(buyItemSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    const { itemId } = form.data;
    const userRef = adminDb.collection('users').doc(locals.user.uid);

    try {
      await adminDb.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) throw new Error("User not found");
        
        const data = userDoc.data();
        const currentBalance = data?.economy?.netsBalance || 0;

        // In a real app, you'd fetch the item price from a master list
        // For now, let's look for it in the shopItems or assume it's valid
        // Ideally we fetch the item info from Firestore shop collection
        const itemDoc = await adminDb.collection('shop').doc(itemId).get();
        if (!itemDoc.exists) throw new Error("Item not found");
        const itemData = itemDoc.data();

        if (currentBalance < itemData?.price) throw new Error("Insufficient Nets");

        const updates: any = {
          'economy.netsBalance': FieldValue.increment(-itemData?.price),
          [`economy.collection.${itemData?.type}s`]: FieldValue.arrayUnion(itemData?.name)
        };

        transaction.update(userRef, updates);
      });
      return { form };
    } catch (e: any) {
      return fail(500, { form, message: e.message });
    }
  },

  claimChallenge: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const form = await superValidate(request, zod(claimChallengeSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    const { challengeId, challengeType } = form.data;
    const userRef = adminDb.collection('users').doc(locals.user.uid);

    try {
      await adminDb.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) throw new Error("User not found");
        
        const data = userDoc.data();
        const challenge = data?.economy?.battlePass?.[`${challengeType}Challenges`]?.[challengeId];
        
        if (!challenge) throw new Error("Challenge not found");
        if (!challenge.completed) throw new Error("Challenge not completed");
        if (challenge.claimed) throw new Error("Challenge already claimed");

        const xpReward = challenge.rewardXp || 100;
        let newXp = (data?.economy?.battlePass?.currentXp || 0) + xpReward;
        let newTier = Math.floor(newXp / XP_PER_TIER) + 1;

        transaction.update(userRef, {
          [`economy.battlePass.${challengeType}Challenges.${challengeId}.claimed`]: true,
          'economy.battlePass.currentXp': newXp,
          'economy.battlePass.currentTier': newTier
        });
      });
      return { form };
    } catch (e: any) {
      return fail(500, { form, message: e.message });
    }
  },

  equipItem: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const form = await superValidate(request, zod(equipItemSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    const { type, value } = form.data;
    const userRef = adminDb.collection('users').doc(locals.user.uid);

    const fieldMap: any = {
      color: 'economy.activeColor',
      frame: 'economy.activeFrame',
      font: 'economy.activeFont',
      badge: 'economy.activeBadge',
      emote: 'economy.activeEmote'
    };

    try {
      await userRef.update({
        [fieldMap[type]]: value
      });
      return { form };
    } catch (e: any) {
      return fail(500, { form, message: e.message });
    }
  },

  openCrate: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const form = await superValidate(request, zod(openCrateSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    const { crateType } = form.data;
    const userRef = adminDb.collection('users').doc(locals.user.uid);

    const costs: any = {
      basic: 500,
      premium: 1500,
      legendary: 5000
    };

    try {
      let winner: any = null;
      await adminDb.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const data = userDoc.data();
        const nets = data?.economy?.netsBalance || 0;
        const cost = costs[crateType];

        if (nets < cost) throw new Error("Insufficient Nets");

        // Simple server-side RNG
        const itemsPool = possibleRewards.filter(r => {
          if (crateType === 'legendary') return ['Épico', 'Legendario', 'Mítico'].includes(r.rarity);
          if (crateType === 'premium') return ['Raro', 'Épico'].includes(r.rarity);
          return ['Común', 'Infrecuente', 'Raro'].includes(r.rarity);
        });

        winner = itemsPool[Math.floor(Math.random() * itemsPool.length)];

        transaction.update(userRef, {
          'economy.netsBalance': FieldValue.increment(-cost),
          [`economy.collection.${winner.type}s`]: FieldValue.arrayUnion(winner.name)
        });
      });
      return { form, winner };
    } catch (e: any) {
      return fail(500, { form, message: e.message });
    }
  }
};
