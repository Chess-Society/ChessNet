import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schoolSchema } from '$lib/schemas/school';
import { adminDb } from '$lib/server/firebase-admin';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const form = await superValidate(zod(schoolSchema as any));
  
  return {
    user: locals.user,
    form
  };
};

export const actions: Actions = {
  create: async (event) => {
    const { locals } = event;
    if (!locals.user) return fail(401);

    const form = await superValidate(event, zod(schoolSchema as any));
    if (!form.valid) return fail(400, { form });

    try {
      const schoolRef = adminDb.collection('schools').doc();
      const now = new Date().toISOString();
      
      const schoolData = {
        ...form.data,
        owner_id: locals.user.uid,
        ownerId: locals.user.uid,
        createdAt: now,
        updatedAt: now,
        created_at: now,
        updated_at: now
      };

      await schoolRef.set(schoolData);

      return { form, success: true };
    } catch (err: any) {
      console.error('Error creating school:', err);
      return fail(500, { form, error: err.message });
    }
  }
};
