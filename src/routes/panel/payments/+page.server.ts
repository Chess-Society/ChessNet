import type { PageServerLoad, Actions } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { paymentSchema } from '$lib/schemas/payment';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, '/auth/login');
  }

  const uid = locals.user.uid;
  const form = await superValidate(zod(paymentSchema as any));

  try {
    const [paymentsSnap, studentsSnap, schoolsSnap] = await Promise.all([
      adminDb.collection('payments').where('owner_id', '==', uid).orderBy('created_at', 'desc').get(),
      adminDb.collection('students').where('owner_id', '==', uid).orderBy('name', 'asc').get(),
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    const payments = paymentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const students = studentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const schools = schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return {
      form,
      payments: serializeRecord(payments),
      students: serializeRecord(students),
      schools: serializeRecord(schools),
      user: locals.user
    };
  } catch (err: any) {
    console.error('❌ Error in payments load:', err);
    return {
      form,
      payments: [],
      students: [],
      schools: [],
      user: locals.user
    };
  }
};

export const actions: Actions = {
  upsert: async ({ request, locals }) => {
    if (!locals.user) return fail(401);

    const form = await superValidate(request, zod(paymentSchema as any));
    if (!form.valid) return fail(400, { form });

    try {
      const uid = locals.user.uid;
      const { id, ...data } = form.data;
      
      const paymentData = {
        ...data,
        ownerId: uid,
        owner_id: uid,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (id) {
        await adminDb.collection('payments').doc(id).update(paymentData);
      } else {
        (paymentData as any).createdAt = new Date().toISOString();
        (paymentData as any).created_at = new Date().toISOString();
        await adminDb.collection('payments').add(paymentData);
      }

      return { form };
    } catch (err: any) {
      console.error('❌ Error in payment upsert:', err);
      return fail(500, { form, error: err.message });
    }
  },

  delete: async ({ request, locals }) => {
    if (!locals.user) return fail(401);

    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) return fail(400, { message: 'ID is required' });

    try {
      await adminDb.collection('payments').doc(id).delete();
      return { success: true };
    } catch (err: any) {
      console.error('❌ Error deleting payment:', err);
      return fail(500, { error: err.message });
    }
  }
};
