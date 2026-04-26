import type { PageServerLoad, Actions } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { classSchema } from '$lib/schemas/class';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  const uid = locals.user.uid;

  try {
    const snapshot = await adminDb.collection('schools')
      .where('owner_id', '==', uid)
      .orderBy('name', 'asc')
      .get();
    
    const schools = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
    
    // Initialize form with first school if available
    const form = await superValidate(
      schools.length === 1 ? { schoolId: schools[0].id } : {},
      zod(classSchema as any)
    );

    return {
      user: locals.user,
      schools,
      form
    };
  } catch (err: any) {
    console.error('❌ Error in classes create page load:', err);
    return {
      user: locals.user,
      schools: [],
      form: await superValidate(zod(classSchema as any))
    };
  }
};

export const actions: Actions = {
  create: async (event) => {
    const { locals } = event;
    if (!locals.user) return fail(401);

    const form = await superValidate(event, zod(classSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    try {
      const classData = {
        ...form.data,
        owner_id: locals.user.uid,
        ownerId: locals.user.uid, // Support both formats
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await adminDb.collection('classes').add(classData);
      return { form, success: true, id: docRef.id };
    } catch (err: any) {
      console.error('Error creating class:', err);
      return fail(500, { form, error: err.message });
    }
  }
};
