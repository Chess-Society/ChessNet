import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { predictionMarketSchema } from '$lib/schemas/prediction';
import { adminDb } from '$lib/server/firebase-admin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    marketForm: await superValidate(zod(predictionMarketSchema as any)) as any
  };
};

export const actions: Actions = {
  upsertMarket: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    
    // Check if admin (should be done via custom claims)
    
    const form = await superValidate(request, zod(predictionMarketSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    try {
      const marketData = {
        ...form.data,
        updatedAt: new Date().toISOString(),
        options: [
          { id: 'yes', text: 'Sí', totalStaked: 0, totalShares: 0 },
          { id: 'no', text: 'No', totalStaked: 0, totalShares: 0 }
        ]
      };

      if (form.data.id) {
        const id = form.data.id;
        delete (marketData as any).id;
        await adminDb.collection('prediction_markets').doc(id).update(marketData);
      } else {
        (marketData as any).createdAt = new Date().toISOString();
        (marketData as any).status = 'OPEN';
        (marketData as any).resolved = false;
        await adminDb.collection('prediction_markets').add(marketData);
      }

      return { form };
    } catch (e) {
      console.error(e);
      return fail(500, { form, message: 'Error al procesar el hito' });
    }
  },

  deleteMarket: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    
    const data = await request.formData();
    const id = data.get('id') as string;
    
    if (!id) return fail(400);

    try {
      await adminDb.collection('prediction_markets').doc(id).delete();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500);
    }
  }
};
