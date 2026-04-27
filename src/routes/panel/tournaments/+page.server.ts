import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDb, ownerFilter } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { checkPlanGating } from '$lib/server/plans';
import { TOURNAMENT_TEMPLATES } from '$lib/constants/chess-presets';

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const id = data.get('id') as string;

    if (!id) return fail(400, { message: 'Missing tournament ID' });

    try {
      const doc = await adminDb.collection('local_tournaments').doc(id).get();
      const currentOwner = doc.data()?.owner_id || doc.data()?.ownerId;
      if (!doc.exists || currentOwner !== locals.user.uid) {
        return fail(403, { message: 'Unauthorized' });
      }

      await adminDb.collection('local_tournaments').doc(id).delete();
      return { success: true };
    } catch (err) {
      console.error('Error deleting tournament:', err);
      return fail(500, { message: 'Internal Server Error' });
    }
  },

  importTemplates: async ({ locals }) => {
    if (!locals.user) return fail(401);

    try {
      const uid = locals.user.uid;
      const batch = adminDb.batch();
      
      TOURNAMENT_TEMPLATES.forEach(template => {
        const ref = adminDb.collection('local_tournaments').doc();
        batch.set(ref, {
          ...template,
          owner_id: uid,
          status: 'upcoming',
          created_at: new Date().toISOString(),
          players_registered: 0
        });
      });

      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error importing templates:', err);
      return fail(500, { message: 'Internal Server Error' });
    }
  }
};

export const load: PageServerLoad = async (event) => {
  const { locals } = event;
  
  await checkPlanGating(event, 'premium');

  if (!locals.user) {
    return {
      user: null,
      tournaments: [],
      tournamentStats: {},
      availableStudents: []
    };
  }

    try {
    const uid = locals.user.uid;
    
    // Obtener torneos y estudiantes del usuario usando Admin SDK
    const [tournamentsSnap, studentsSnap] = await Promise.all([
      adminDb.collection("local_tournaments").where(ownerFilter(uid)).get(),
      adminDb.collection("students").where(ownerFilter(uid)).get()
    ]);

    const tournaments = tournamentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const students = studentsSnap.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data(),
      // Ensure name is always available
      name: doc.data().name || `${doc.data().first_name || ''} ${doc.data().last_name || ''}`.trim() || 'Unknown'
    }));

    // Filtrar estudiantes activos y mapearlos al formato que espera la UI
    const availableStudents = students
      .filter((s: any) => s.active !== false)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        first_name: s.first_name || s.name.split(' ')[0] || '',
        last_name: s.last_name || s.name.split(' ').slice(1).join(' ') || '',
        chess_level: s.chess_level || 'beginner',
        school_id: s.school_id || ''
      }));

    // Calcular estadísticas
    const tournamentStats = {
      total_tournaments: tournaments.length,
      upcoming_tournaments: tournaments.filter((t: any) => t.status === 'upcoming' || t.status === 'planned').length,
      in_progress_tournaments: tournaments.filter((t: any) => t.status === 'in_progress' || t.status === 'active').length,
      completed_tournaments: tournaments.filter((t: any) => t.status === 'completed').length,
      total_players_registered: tournaments.reduce((sum: number, t: any) => sum + (t.players_registered || 0), 0),
      total_prize_pool: tournaments.reduce((sum: number, t: any) => sum + (t.prize_pool || 0), 0),
      average_players_per_tournament: tournaments.length > 0
        ? tournaments.reduce((sum: number, t: any) => sum + (t.players_registered || 0), 0) / tournaments.length
        : 0
    };

    return {
      user: locals.user,
      tournaments: serializeRecord(tournaments),
      tournamentStats: serializeRecord(tournamentStats),
      availableStudents: serializeRecord(availableStudents)
    };

  } catch (err: any) {
    console.error('❌ Error in tournaments page server load:', err);
    return {
      user: locals.user,
      tournaments: [],
      tournamentStats: {},
      availableStudents: []
    };
  }
};
