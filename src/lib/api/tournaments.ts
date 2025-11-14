import { supabase } from "$lib/supabase";
import type {
  Tournament,
  TournamentParticipant,
  TournamentMatch,
} from "$lib/types";

export const tournamentsApi = {
  // Get tournaments by school
  async getTournamentsBySchool(schoolId: string): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a specific tournament
  async getTournament(id: string): Promise<Tournament> {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new tournament
  async createTournament(
    schoolId: string,
    name: string,
    description?: string,
    type: "swiss" | "round_robin" | "elimination" | "team" = "swiss",
    startDate?: string,
    endDate?: string,
    maxParticipants?: number,
    timeControl?: string,
  ): Promise<Tournament> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("tournaments")
      .insert({
        school_id: schoolId,
        name,
        description,
        type,
        start_date: startDate,
        end_date: endDate,
        max_participants: maxParticipants,
        time_control: timeControl,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a tournament
  async updateTournament(
    id: string,
    updates: Partial<Tournament>,
  ): Promise<Tournament> {
    const { data, error } = await supabase
      .from("tournaments")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a tournament
  async deleteTournament(id: string): Promise<void> {
    const { error } = await supabase.from("tournaments").delete().eq("id", id);

    if (error) throw error;
  },

  // Start a tournament
  async startTournament(id: string): Promise<void> {
    const { error } = await supabase
      .from("tournaments")
      .update({
        status: "active",
        start_date: new Date().toISOString().split("T")[0],
      })
      .eq("id", id);

    if (error) throw error;
  },

  // Complete a tournament
  async completeTournament(id: string): Promise<void> {
    const { error } = await supabase
      .from("tournaments")
      .update({
        status: "completed",
        end_date: new Date().toISOString().split("T")[0],
      })
      .eq("id", id);

    if (error) throw error;
  },

  // Get tournament participants
  async getTournamentParticipants(
    tournamentId: string,
  ): Promise<TournamentParticipant[]> {
    const { data, error } = await supabase
      .from("tournament_participants")
      .select(
        `
        *,
        students:student_id(*)
      `,
      )
      .eq("tournament_id", tournamentId)
      .order("score", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add participant to tournament
  async addParticipant(
    tournamentId: string,
    studentId: string,
    rating?: number,
  ): Promise<TournamentParticipant> {
    const { data, error } = await supabase
      .from("tournament_participants")
      .insert({
        tournament_id: tournamentId,
        student_id: studentId,
        rating,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove participant from tournament
  async removeParticipant(participantId: string): Promise<void> {
    const { error } = await supabase
      .from("tournament_participants")
      .delete()
      .eq("id", participantId);

    if (error) throw error;
  },

  // Update participant score
  async updateParticipantScore(
    participantId: string,
    score: number,
    tiebreakScore?: number,
  ): Promise<TournamentParticipant> {
    const { data, error } = await supabase
      .from("tournament_participants")
      .update({
        score,
        tiebreak_score: tiebreakScore,
      })
      .eq("id", participantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get tournament matches
  async getTournamentMatches(
    tournamentId: string,
    round?: number,
  ): Promise<TournamentMatch[]> {
    let query = supabase
      .from("tournament_matches")
      .select(
        `
        *,
        player1:player1_id(*),
        player2:player2_id(*)
      `,
      )
      .eq("tournament_id", tournamentId);

    if (round !== undefined) {
      query = query.eq("round", round);
    }

    query = query
      .order("round", { ascending: true })
      .order("board_number", { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Create tournament matches
  async createTournamentMatches(
    tournamentId: string,
    matches: Omit<TournamentMatch, "id" | "tournament_id" | "created_at">[],
  ): Promise<TournamentMatch[]> {
    const matchesWithTournament = matches.map((match) => ({
      ...match,
      tournament_id: tournamentId,
    }));

    const { data, error } = await supabase
      .from("tournament_matches")
      .insert(matchesWithTournament)
      .select();

    if (error) throw error;
    return data || [];
  },

  // Update match result
  async updateMatchResult(
    matchId: string,
    result: "1-0" | "0-1" | "1/2-1/2" | "bye" | "forfeit",
    moves?: string[],
    gameDurationSeconds?: number,
  ): Promise<TournamentMatch> {
    const { data, error } = await supabase
      .from("tournament_matches")
      .update({
        result,
        moves,
        game_duration_seconds: gameDurationSeconds,
        played_at: new Date().toISOString(),
      })
      .eq("id", matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

};
