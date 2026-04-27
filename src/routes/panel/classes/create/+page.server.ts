import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { classSchema } from '$lib/schemas/class';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { checkClassLimit } from '$lib/server/plans';
import type { Actions, PageServerLoad } from './$types';

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
    if (!form.valid) return message(form, 'Datos inválidos. Por favor revisa el formulario.', { status: 400 });

    try {
      const uid = locals.user.uid;
      
      // Enforce class limit for free plan
      const canCreate = await checkClassLimit(uid);
      if (!canCreate) {
        return message(form, 'Has alcanzado el límite de 1 clase del plan gratuito. Mejora a Premium para clases ilimitadas.', { status: 403 });
      }

      const now = new Date().toISOString();
      const { id, ...data } = form.data;
      const classData = {
        ...data,
        owner_id: locals.user.uid,
        ownerId: locals.user.uid,
        school_id: form.data.schoolId, // Ensure snake_case for compatibility
        schoolId: form.data.schoolId,
        created_at: now,
        updated_at: now,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await adminDb.collection('classes').add(classData);
      return message(form, '¡Clase creada con éxito!');
    } catch (err: any) {
      console.error('Error creating class:', err);
      return message(form, err.message || 'Failed to create class', { status: 500 });
    }
  }
};
