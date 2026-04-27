import type { PageServerLoad, Actions } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { tournamentSchema } from '$lib/schemas/tournament';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, '/auth/login');
  }

  const uid = locals.user.uid;
  const form = await superValidate(zod(tournamentSchema as any)) as any;
  (form.data as any).startAt = new Date().toISOString().slice(0, 16);

  try {
    const [studentsSnap, schoolsSnap] = await Promise.all([
      adminDb.collection('students').where('owner_id', '==', uid).get(),
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    const schools = schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const students = studentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const availableStudents = students.map((s: any) => {
      const school = schools.find((sc: any) => sc.id === s.school_id);
      return {
        id: s.id,
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.name || 'Sin nombre',
        rating: s.rating || 1200,
        school_name: school?.name || 'Sin centro',
        email: s.parent_email || s.email || ''
      };
    });

    return {
      form,
      user: locals.user,
      availableStudents: serializeRecord(availableStudents),
      schools: serializeRecord(schools)
    };

  } catch (err: any) {
    console.error('❌ Error in tournament create page server load:', err);
    return {
      form,
      user: locals.user,
      availableStudents: [],
      schools: []
    };
  }
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) return fail(401);

    const form = await superValidate(request, zod(tournamentSchema as any));
    if (!form.valid) return message(form, 'Datos inválidos. Por favor revisa el formulario.', { status: 400 });

    try {
      const tournamentData = {
        ...form.data,
        ownerId: locals.user.uid,
        owner_id: locals.user.uid, // legacy
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        created_at: new Date().toISOString(), // legacy
        updated_at: new Date().toISOString(), // legacy
        status: 'upcoming',
        selected_students: []
      };

      const docRef = await adminDb.collection('local_tournaments').add(tournamentData);
      
      return message(form, { text: '¡Torneo creado con éxito!', id: docRef.id });
    } catch (err: any) {
      console.error('❌ Error creating tournament:', err);
      return message(form, err.message || 'Error desconocido al crear el torneo', { status: 500 });
    }
  }
};

