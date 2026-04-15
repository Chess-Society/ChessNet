import type { PageServerLoad } from './$types';
import { tournamentsApi } from '$lib/api/tournaments';
import { studentsApi } from '$lib/api/students';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { tournamentId } = params;
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    // Fetch tournament data, participants, and pairings in parallel
    const [tournament, participants, pairings, allStudents] = await Promise.all([
      tournamentsApi.getTournament(tournamentId),
      tournamentsApi.getTournamentParticipants(tournamentId),
      tournamentsApi.getTournamentMatches(tournamentId),
      studentsApi.getMyStudents()
    ]);

    if (!tournament) {
      throw error(404, 'Tournament not found');
    }

    // Verify ownership (if model includes user_id or created_by)
    // Note: We use created_by or user_id according to what we defined in the API
    const ownerId = tournament.owner_id;
    if (ownerId && ownerId !== locals.user.id) {
      throw error(403, 'You do not have permission to view this tournament');
    }

    // Format participants for the UI (registeredPlayers)
    const registeredPlayers = participants.map(p => ({
      id: p.id,
      tournament_id: p.tournament_id,
      student_id: p.student_id,
      student_name: p.students?.name || 'Unknown',
      student_rating: p.rating || 1200,
      registration_date: p.created_at,
      status: 'confirmed', // Simplified Firebase is usually confirmed directly
      notes: null
    }));

    // Determine unique rounds from the pairings
    const roundNumbers = [...new Set(pairings.map(p => p.round))].sort((a, b) => a - b);
    const rounds = roundNumbers.map(r => ({
      id: `round-${r}`,
      tournament_id: tournamentId,
      round_number: r,
      status: r < (tournament.current_round || 0) ? 'completed' : (r === (tournament.current_round || 0) ? 'in_progress' : 'not_started'),
      start_time: null,
      end_time: null
    }));

    // Format pairings for the UI
    const formattedPairings = pairings.map(p => ({
      id: p.id,
      tournament_id: p.tournament_id,
      round_number: p.round,
      board_number: p.board_number,
      white_player_id: p.player1_id,
      black_player_id: p.player2_id,
      result: p.result || '*',
      white_points: p.result === '1-0' ? 1 : (p.result === '1/2-1/2' ? 0.5 : 0),
      black_points: p.result === '0-1' ? 1 : (p.result === '1/2-1/2' ? 0.5 : 0),
      notes: null,
      is_bye: p.result === 'bye',
      white_player_name: p.player1?.name || 'White',
      black_player_name: p.player2?.name || 'Black'
    }));

    // Generate standings from the participants
    const standings = participants
      .sort((a, b) => (b.score || 0) - (a.score || 0) || (b.tiebreak_score || 0) - (a.tiebreak_score || 0))
      .map((p, index) => ({
        position: index + 1,
        student_id: p.student_id,
        student_name: p.students?.name || 'Unknown',
        rating: p.rating || 1200,
        points: p.score || 0,
        games_played: pairings.filter(m => (m.player1_id === p.student_id || m.player2_id === p.student_id) && m.result && m.result !== '*').length,
        wins: pairings.filter(m => (m.player1_id === p.student_id && m.result === '1-0') || (m.player2_id === p.student_id && m.result === '0-1')).length,
        draws: pairings.filter(m => (m.player1_id === p.student_id || m.player2_id === p.student_id) && m.result === '1/2-1/2').length,
        losses: pairings.filter(m => (m.player1_id === p.student_id && m.result === '0-1') || (m.player2_id === p.student_id && m.result === '1-0')).length,
        buchholz: p.tiebreak_score || 0,
        performance: p.rating || 1200 // Simplified
      }));

    // Available students to register (those not already registered)
    const registeredStudentIds = participants.map(p => p.student_id);
    const availableStudents = allStudents
      .filter(s => !registeredStudentIds.includes(s.id))
      .map(s => ({
        id: s.id,
        name: s.name,
        rating: 1200, // Base rating
        school_name: (s as any).school_name || 'No school',
        email: s.parent_email || ''
      }));

    return {
      user: locals.user,
      tournamentId,
      tournament,
      registeredPlayers,
      rounds,
      pairings: formattedPairings,
      standings,
      availableStudents
    };

  } catch (err: any) {
    console.error('❌ Error in tournament detail page:', err);
    if (err.status) throw err;
    throw error(500, 'Internal server error');
  }
};
