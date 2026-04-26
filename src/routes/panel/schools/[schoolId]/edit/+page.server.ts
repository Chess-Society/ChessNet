import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schoolSchema } from '$lib/schemas/school';

export const load: PageServerLoad = async ({ locals, params }) => {
  const schoolId = params.schoolId;
  
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  const uid = locals.user.uid;

  try {
    const schoolSnap = await adminDb.collection("schools").doc(schoolId).get();
    
    if (!schoolSnap.exists) {
      throw error(404, 'Centro no encontrado');
    }

    const schoolData = schoolSnap.data()!;
    
    // Authorization check
    if (schoolData.owner_id !== uid && !schoolData.sharedWith?.includes(uid)) {
      throw error(403, 'No tienes permiso para editar este centro');
    }

    // Map Firestore data to Schema
    const form = await superValidate({
      name: schoolData.name || '',
      city: schoolData.city || '',
      country: schoolData.country || 'espana',
      address: schoolData.address || '',
      phone: schoolData.phone || '',
      email: schoolData.email || '',
      website: schoolData.website || '',
      location: schoolData.location || '',
      socialEnabled: schoolData.socialEnabled ?? schoolData.social_enabled ?? true,
      economyEnabled: schoolData.economyEnabled ?? schoolData.economy_enabled ?? true,
      sharedWith: schoolData.sharedWith || []
    }, zod(schoolSchema as any));

    return { 
      user: locals.user, 
      school: serializeRecord({ id: schoolSnap.id, ...schoolData }), 
      form 
    };

  } catch (err: any) {
    console.error('❌ Error in edit school page:', err);
    if (err.status) throw err;
    throw error(500, 'Error al cargar los datos del centro');
  }
};

export const actions: Actions = {
  update: async ({ request, params, locals }) => {
    if (!locals.user) throw error(401);
    
    const form = await superValidate(request, zod(schoolSchema as any));
    if (!form.valid) return fail(400, { form });

    try {
      const schoolRef = adminDb.collection('schools').doc(params.schoolId);
      const schoolSnap = await schoolRef.get();
      
      if (!schoolSnap.exists) return fail(404, { form, message: 'Centro no encontrado' });
      
      const schoolData = schoolSnap.data()!;
      if (schoolData.owner_id !== locals.user.uid) {
        return fail(403, { form, message: 'No tienes permisos' });
      }

      const updateData = {
        ...form.data,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Keep legacy field names for compatibility
        social_enabled: form.data.socialEnabled,
        economy_enabled: form.data.economyEnabled
      };

      await schoolRef.update(updateData);

      return { form };
    } catch (err: any) {
      console.error('❌ Error updating school:', err);
      return message(form, 'Error al actualizar el centro', { status: 500 });
    }
  }
};
