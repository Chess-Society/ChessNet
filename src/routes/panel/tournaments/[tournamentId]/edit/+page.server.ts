import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { tournamentSchema } from '$lib/schemas/tournament';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { tournamentId } = params;
  
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  const uid = locals.user.uid;

  try {
    const [tournamentSnap, schoolsSnap] = await Promise.all([
      adminDb.collection('local_tournaments').doc(tournamentId).get(),
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    if (!tournamentSnap.exists) {
      throw error(404, 'Torneo no encontrado');
    }

    const rawData = tournamentSnap.data() || {};
    
    // Check ownership
    if (rawData.ownerId !== uid && rawData.owner_id !== uid) {
      throw error(403, 'No tienes permiso para editar este torneo');
    }

    const schools = schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    // Format dates for datetime-local (YYYY-MM-DDTHH:mm)
    const formatDateTime = (date: any) => {
        if (!date) return '';
        try {
            return new Date(date).toISOString().slice(0, 16);
        } catch {
            return '';
        }
    };

    const tournament = { 
        ...rawData,
        name: rawData.name || '',
        description: rawData.description || '',
        ownerId: rawData.ownerId || rawData.owner_id,
        schoolId: rawData.schoolId || rawData.school_id || '',
        timeControl: rawData.timeControl || rawData.time_control || '15 + 10',
        maxPlayers: rawData.maxPlayers || rawData.max_players || 16,
        entryFee: rawData.entryFee || rawData.entry_fee || 0,
        prizePool: rawData.prizePool || rawData.prize_pool || 0,
        startAt: formatDateTime(rawData.startAt || rawData.start_at || rawData.startDate || rawData.start_date),
        endAt: formatDateTime(rawData.endAt || rawData.end_at || rawData.endDate || rawData.end_date),
        registrationDeadline: formatDateTime(rawData.registrationDeadline || rawData.registration_deadline),
        createdAt: rawData.createdAt || rawData.created_at,
        updatedAt: rawData.updatedAt || rawData.updated_at,
        sharedWith: rawData.sharedWith || [],
        status: rawData.status || 'upcoming',
        format: rawData.format || 'swiss',
        organizer: rawData.organizer || '',
        notes: rawData.notes || '',
        rules: rawData.rules || ''
    };

    const form = await superValidate(tournament, zod(tournamentSchema as any));

    return {
      form,
      schools: serializeRecord(schools),
      tournamentId
    };

  } catch (err: any) {
    console.error('❌ Error in tournament edit page load:', err);
    if (err.status) throw err;
    throw error(500, 'Error interno del servidor');
  }
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    if (!locals.user) return fail(401);
    const { tournamentId } = params;

    const form = await superValidate(request, zod(tournamentSchema as any));
    if (!form.valid) return message(form, 'Revisa los errores del formulario', { status: 400 });

    try {
      const docRef = adminDb.collection('local_tournaments').doc(tournamentId);
      const snap = await docRef.get();

      if (!snap.exists) return message(form, 'Torneo no encontrado', { status: 404 });
      if (snap.data()?.ownerId !== locals.user.uid && snap.data()?.owner_id !== locals.user.uid) {
          return message(form, 'No tienes permisos para editar este torneo', { status: 403 });
      }

      const updates = {
        ...form.data,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString() // legacy
      };

      await docRef.update(updates);

      return { form };
    } catch (err: any) {
      console.error('❌ Error updating tournament:', err);
      return message(form, 'Error al actualizar el torneo: ' + err.message, { status: 500 });
    }
  },
  delete: async ({ params, locals }) => {
    if (!locals.user) return fail(401);
    const { tournamentId } = params;

    try {
      const docRef = adminDb.collection('local_tournaments').doc(tournamentId);
      const snap = await docRef.get();

      if (!snap.exists) throw redirect(302, '/panel/tournaments');
      if (snap.data()?.ownerId !== locals.user.uid && snap.data()?.owner_id !== locals.user.uid) {
          throw error(403);
      }

      // Cascade delete related collections
      const batch = adminDb.batch();
      
      const collections = [
        'local_tournament_players',
        'local_tournament_rounds',
        'local_tournament_pairings'
      ];

      for (const coll of collections) {
        const relatedSnap = await adminDb.collection(coll).where('tournamentId', '==', tournamentId).get();
        relatedSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
      }

      batch.delete(docRef);
      await batch.commit();
      
      throw redirect(302, '/panel/tournaments');
    } catch (err: any) {
      if (err.status) throw err;
      console.error('❌ Error deleting tournament:', err);
      return fail(500, { error: err.message });
    }
  }
};
