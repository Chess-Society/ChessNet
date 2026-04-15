import type { Student } from './school';

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  type?: "swiss" | "round_robin" | "elimination" | "team";
  format?: "swiss" | "round_robin" | "elimination" | "team" | "knockout" | "single_elimination";
  status: "planned" | "active" | "completed" | "draft" | "upcoming" | "in_progress" | "cancelled";
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  max_participants?: number;
  max_players?: number; // Aliased for legacy compatibility
  time_control?: string;
  entry_fee?: number;
  prize_pool?: number;
  location?: string;
  organizer?: string;
  notes?: string;
  rules?: string;
  school_id: string;
  current_round?: number;
  total_rounds?: number;
  players_registered?: number;
  owner_id: string;
  created_at: string;
  updated_at?: string;
}

export interface TournamentParticipant {
  id: string;
  owner_id: string;
  tournament_id: string;
  student_id: string;
  rating: number;
  score: number;
  tiebreak_score?: number;
  created_at: string;
  students?: Student; // For joined data
}

export interface TournamentMatch {
  id: string;
  owner_id: string;
  tournament_id: string;
  round: number;
  board_number: number;
  player1_id: string;
  player2_id: string;
  result?: "1-0" | "0-1" | "1/2-1/2" | "bye" | "forfeit" | "*";
  moves?: string[];
  game_duration_seconds?: number;
  played_at?: string;
  created_at: string;
  player1?: Student;
  player2?: Student;
}

export interface TournamentFilters {
  format?: "swiss" | "round_robin" | "knockout";
  school_id?: string;
  status?: "planned" | "active" | "completed";
  startDate?: string;
  endDate?: string;
}

export interface TournamentStats {
  total_tournaments: number;
  active_tournaments: number;
  completed_tournaments: number;
  total_players: number;
  total_games: number;
  formats: Record<string, number>;
}
