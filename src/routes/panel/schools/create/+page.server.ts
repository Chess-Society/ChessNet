import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { schoolSchema } from '$lib/schemas/school';
import { adminDb } from '$lib/server/firebase-admin';
import { checkSchoolLimit } from '$lib/server/plans';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('🔍 [SchoolsCreate] Loading page, locals.user:', locals.user?.uid);
  
  if (!locals.user) {
    console.log('🚫 [SchoolsCreate] No user in locals, redirecting to /login');
    throw redirect(302, '/login');
  }

  try {
    const form = await superValidate(zod(schoolSchema as any));
    console.log('✅ [SchoolsCreate] Form validated');
    
    return {
      user: locals.user,
      form
    };
  } catch (err: any) {
    console.error('❌ [SchoolsCreate] Error in load:', err);
    throw err;
  }
};

export const actions: Actions = {
  create: async (event) => {
    const { locals } = event;
    if (!locals.user) return fail(401);

    const form = await superValidate(event, zod(schoolSchema as any));
    if (!form.valid) return message(form, 'Datos inválidos. Por favor revisa el formulario.', { status: 400 });

    try {
      const uid = locals.user.uid;

      // Enforce school limit for free plan
      const canCreate = await checkSchoolLimit(uid);
      if (!canCreate) {
        return message(form, 'Has alcanzado el límite de 1 centro educativo del plan gratuito. Mejora a Premium para centros ilimitados.', { status: 403 });
      }

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

      return message(form, '¡Escuela creada con éxito!');
    } catch (err: any) {
      console.error('Error creating school:', err);
      return message(form, err.message || 'Error desconocido al crear la escuela', { status: 500 });
    }
  }
};
