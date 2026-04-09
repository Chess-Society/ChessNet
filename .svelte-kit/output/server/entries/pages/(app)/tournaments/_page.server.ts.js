import { t as tournamentsApi } from "../../../../chunks/tournaments.js";
import { s as studentsApi } from "../../../../chunks/students.js";
const load = async ({ locals }) => {
  console.log("🏆 Tournaments page server load - User:", locals.user?.email || "none");
  if (!locals.user) {
    return {
      user: null,
      tournaments: [],
      tournamentStats: {},
      availableStudents: []
    };
  }
  try {
    const [tournaments, students] = await Promise.all([
      tournamentsApi.getMyTournaments(locals.user.id),
      studentsApi.getMyStudents(locals.user.id)
    ]);
    const availableStudents = students.filter((s) => s.active !== false).map((s) => ({
      id: s.id,
      first_name: s.first_name || "",
      last_name: s.last_name || "",
      chess_level: s.chess_level || "beginner",
      school_id: s.college_id || ""
    }));
    const tournamentStats = {
      total_tournaments: tournaments.length,
      upcoming_tournaments: tournaments.filter((t) => t.status === "upcoming" || t.status === "planned").length,
      in_progress_tournaments: tournaments.filter((t) => t.status === "in_progress" || t.status === "active").length,
      completed_tournaments: tournaments.filter((t) => t.status === "completed").length,
      total_players_registered: tournaments.reduce((sum, t) => sum + (t.players_registered || 0), 0),
      total_prize_pool: tournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0),
      average_players_per_tournament: tournaments.length > 0 ? tournaments.reduce((sum, t) => sum + (t.players_registered || 0), 0) / tournaments.length : 0
    };
    console.log("✅ Tournaments data loaded successfully");
    return {
      user: locals.user,
      tournaments,
      tournamentStats,
      availableStudents
    };
  } catch (err) {
    console.error("❌ Error in tournaments page server load:", err);
    return {
      user: locals.user,
      tournaments: [],
      tournamentStats: {},
      availableStudents: []
    };
  }
};
export {
  load
};
