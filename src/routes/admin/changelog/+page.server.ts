import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { changelogEntrySchema } from '$lib/schemas/changelog';
import { adminDb } from '$lib/server/firebase-admin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || !locals.isAdmin) throw redirect(302, '/panel');

  const snapshot = await adminDb.collection('changelog').orderBy('date', 'desc').get();
  const entries = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

  const form = await superValidate(zod(changelogEntrySchema));

  return {
    form: { ...form },
    entries
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user || !locals.isAdmin) return fail(401);

    const form = await superValidate(request, zod(changelogEntrySchema));
    if (!form.valid) return fail(400, { form });

    try {
      await adminDb.collection('changelog').add({
        ...form.data,
        createdAt: new Date().toISOString()
      });
      return { form };
    } catch (err: any) {
      console.error('Error creating changelog entry:', err);
      return fail(500, { message: err.message });
    }
  },

  delete: async ({ url, locals }) => {
    if (!locals.user || !locals.isAdmin) return fail(401);
    const id = url.searchParams.get('id');
    if (!id) return fail(400);

    try {
      await adminDb.collection('changelog').doc(id).delete();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting changelog entry:', err);
      return fail(500, { message: err.message });
    }
  }
};
