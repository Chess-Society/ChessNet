import type { PageServerLoad } from './$types';
import { tournamentsApi } from '$lib/api/tournaments';
import { studentsApi } from '$lib/api/students';

import { checkPlanGating } from '$lib/server/plans';

export const load: PageServerLoad = async (event) => {
  const { locals } = event;
  console.log('🏆 Tournaments page server load - User:', locals.user?.email || 'none');

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
    // Obtener torneos y estudiantes del usuario mediante Firebase API en paralelo
    const [tournaments, students] = await Promise.all([
      tournamentsApi.getMyTournaments(),
      studentsApi.getMyStudents()
    ]);

    // Filtrar estudiantes activos y mapearlos al formato que espera la UI
    const availableStudents = students
      .filter(s => s.active !== false)
      .map(s => ({
        id: s.id,
        first_name: s.first_name || '',
        last_name: s.last_name || '',
        chess_level: (s as any).chess_level || 'beginner',
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

    console.log('✅ Tournaments data loaded successfully');
    return {
      user: locals.user,
      tournaments,
      tournamentStats,
      availableStudents
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
