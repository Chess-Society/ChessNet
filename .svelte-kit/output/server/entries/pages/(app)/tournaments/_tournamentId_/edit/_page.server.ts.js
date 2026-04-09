import { t as tournamentsApi } from "../../../../../../chunks/tournaments.js";
import { error } from "@sveltejs/kit";
const load = async ({ params, locals }) => {
  const { tournamentId } = params;
  console.log("🏆 Tournament edit page server load - Tournament:", tournamentId, "User:", locals.user?.email || "none");
  if (!locals.user) {
    throw error(401, "Usuario no autenticado");
  }
  try {
    const tournament = await tournamentsApi.getTournament(tournamentId);
    if (!tournament) {
      throw error(404, "Torneo no encontrado");
    }
    const ownerId = tournament.user_id || tournament.created_by;
    if (ownerId && ownerId !== locals.user.id) {
      throw error(403, "No tienes permiso para editar este torneo");
    }
    return {
      user: locals.user,
      tournament
    };
  } catch (err) {
    console.error("❌ Error in tournament edit page load:", err);
    if (err.status) throw err;
    throw error(500, "Error interno del servidor");
  }
};
export {
  load
};
