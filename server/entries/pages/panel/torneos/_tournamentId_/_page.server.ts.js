import { t as tournamentsApi } from "../../../../../chunks/tournaments.js";
import { s as studentsApi } from "../../../../../chunks/students.js";
import { error } from "@sveltejs/kit";
const load = async ({ params, locals }) => {
  const { tournamentId } = params;
  console.log("🏆 Tournament detail page server load - Tournament:", tournamentId, "User:", locals.user?.email || "none");
  if (!locals.user) {
    throw error(401, "Usuario no autenticado");
  }
  try {
    const [tournament, participants, pairings, allStudents] = await Promise.all([
      tournamentsApi.getTournament(tournamentId),
      tournamentsApi.getTournamentParticipants(tournamentId),
      tournamentsApi.getTournamentMatches(tournamentId),
      studentsApi.getMyStudents(locals.user.id)
    ]);
    if (!tournament) {
      throw error(404, "Torneo no encontrado");
    }
    const ownerId = tournament.user_id || tournament.created_by;
    if (ownerId && ownerId !== locals.user.id) {
      throw error(403, "No tienes permiso para ver este torneo");
    }
    const registeredPlayers = participants.map((p) => ({
      id: p.id,
      tournament_id: p.tournament_id,
      student_id: p.student_id,
      student_name: p.students?.name || "Desconocido",
      student_rating: p.rating || 1200,
      registration_date: p.created_at,
      status: "confirmed",
      // Firebase simplificado suele ser confirmado directamente
      notes: null
    }));
    const roundNumbers = [...new Set(pairings.map((p) => p.round))].sort((a, b) => a - b);
    const rounds = roundNumbers.map((r) => ({
      id: `round-${r}`,
      tournament_id: tournamentId,
      round_number: r,
      status: r < (tournament.current_round || 0) ? "completed" : r === tournament.current_round ? "in_progress" : "not_started",
      start_time: null,
      end_time: null
    }));
    const formattedPairings = pairings.map((p) => ({
      id: p.id,
      tournament_id: p.tournament_id,
      round_number: p.round,
      board_number: p.board_number,
      white_player_id: p.player1_id,
      black_player_id: p.player2_id,
      result: p.result || "*",
      white_points: p.result === "1-0" ? 1 : p.result === "1/2-1/2" ? 0.5 : 0,
      black_points: p.result === "0-1" ? 1 : p.result === "1/2-1/2" ? 0.5 : 0,
      notes: null,
      is_bye: p.result === "bye",
      white_player_name: p.player1?.name || "Blanco",
      black_player_name: p.player2?.name || "Negro"
    }));
    const standings = participants.sort((a, b) => (b.score || 0) - (a.score || 0) || (b.tiebreak_score || 0) - (a.tiebreak_score || 0)).map((p, index) => ({
      position: index + 1,
      student_id: p.student_id,
      student_name: p.students?.name || "Desconocido",
      rating: p.rating || 1200,
      points: p.score || 0,
      games_played: pairings.filter((m) => (m.player1_id === p.student_id || m.player2_id === p.student_id) && m.result && m.result !== "*").length,
      wins: pairings.filter((m) => m.player1_id === p.student_id && m.result === "1-0" || m.player2_id === p.student_id && m.result === "0-1").length,
      draws: pairings.filter((m) => (m.player1_id === p.student_id || m.player2_id === p.student_id) && m.result === "1/2-1/2").length,
      losses: pairings.filter((m) => m.player1_id === p.student_id && m.result === "0-1" || m.player2_id === p.student_id && m.result === "1-0").length,
      buchholz: p.tiebreak_score || 0,
      performance: p.rating || 1200
      // Simplificado
    }));
    const registeredStudentIds = participants.map((p) => p.student_id);
    const availableStudents = allStudents.filter((s) => !registeredStudentIds.includes(s.id)).map((s) => ({
      id: s.id,
      name: s.name,
      rating: 1200,
      // Rating base
      college: s.college_name || "Sin centro",
      email: s.parent_email || ""
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
  } catch (err) {
    console.error("❌ Error in tournament detail page:", err);
    if (err.status) throw err;
    throw error(500, "Error interno del servidor");
  }
};
export {
  load
};
