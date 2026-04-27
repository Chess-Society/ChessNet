import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { classSchema } from '$lib/schemas/class';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const uid = locals.user.uid;
  const classId = params.classId;

  try {
    const [classSnap, schoolsSnap] = await Promise.all([
      adminDb.collection('classes').doc(classId).get(),
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    if (!classSnap.exists) {
      throw error(404, 'Clase no encontrada');
    }

    const classData = { id: classSnap.id, ...classSnap.data() } as any;
    if (classData.owner_id !== uid) {
      throw error(403, 'No tienes permiso para editar esta clase');
    }

    const schools = schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    
    // Support legacy field names in form initialization
    const form = await superValidate({
      ...classData,
      maxStudents: classData.maxStudents || classData.max_students || 15,
      schoolId: classData.schoolId || classData.school_id || ''
    }, zod(classSchema as any)) as any;

    return {
      user: locals.user,
      class: serializeRecord(classData),
      schools: serializeRecord(schools),
      form
    };

  } catch (err: any) {
    console.error('❌ Error in edit class page load:', err);
    if (err.status) throw err;
    throw error(500, 'Error al cargar los datos de la clase');
  }
};

export const actions: Actions = {
  update: async (event) => {
    const { locals, params } = event;
    if (!locals.user) return fail(401);

    const form = await superValidate(event, zod(classSchema as any)) as any;
    if (!form.valid) return message(form, 'Revisa los errores del formulario', { status: 400 });

    try {
      const classRef = adminDb.collection('classes').doc(params.classId);
      const classSnap = await classRef.get();

      if (!classSnap.exists) return message(form, 'Clase no encontrada', { status: 404 });
      if (classSnap.data()?.owner_id !== locals.user.uid) return message(form, 'No tienes permisos para editar esta clase', { status: 403 });

      await classRef.update({
        ...form.data,
        updated_at: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return { form, success: true };
    } catch (err: any) {
      console.error('Error updating class:', err);
      return message(form, 'Error al actualizar la clase: ' + err.message, { status: 500 });
    }
  }
};
