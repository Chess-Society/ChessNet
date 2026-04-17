export interface LocalTournament {
  id: string;
  owner_id: string;
  school_id?: string;
  name: string;
  format: "swiss" | "round_robin" | "knockout";
  time_control?: string; // e.g., "15+10"
  location?: string;
  startAt?: string;
  endAt?: string;
  prize_pool?: number;
  max_players?: number;
  roundsPlanned?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "upcoming" | "in_progress" | "completed" | "cancelled";
  currentRound: number;
  start_date?: string; // Compatibilidad con vistas generales
  end_date?: string; // Compatibilidad con vistas generales
  registration_deadline?: string; // Compatibilidad con vistas generales
  organizer?: string;
  rules?: string;
  entry_fee?: number;
  description?: string; // Compatibilidad con vistas generales
  _ttl?: number; 
  _expiresAt?: string; // ISO date when expires
  _version?: number; // For future sync
}

export interface LocalTournamentPlayer {
  id: string;
  tournament_id: string;
  student_id: string;
  student_name?: string; // Denormalized for convenience
  rating?: number;
  seed?: number;
  status: 'active' | 'withdrawn';
  createdAt: string;
}

export interface LocalTournamentRound {
  id: string;
  tournament_id: string;
  round_no: number;
  startedAt?: string;
  finishedAt?: string;
  notes?: string;
}

export interface LocalTournamentPairing {
  id: string;
  tournament_id: string;
  round_no: number;
  board: number;
  white_student_id?: string;
  black_student_id?: string;
  white_name?: string; // Denormalized
  black_name?: string; // Denormalized
  result?: "1-0" | "0-1" | "1/2-1/2";
  bye?: boolean;
  points_white?: number;
  points_black?: number;
  notes?: string;
  updatedAt?: string;
}

export interface LocalTournamentStanding {
  student_id: string;
  student_name: string;
  points: number;
  tiebreak1?: number; // Buchholz, etc.
  tiebreak2?: number;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  position: number;
}

export interface LocalTournamentComplete extends LocalTournament {
  players: LocalTournamentPlayer[];
  rounds: LocalTournamentRound[];
  pairings: LocalTournamentPairing[];
  standings?: LocalTournamentStanding[];
}

export interface CreateTournamentForm {
  name: string;
  format: "swiss" | "round_robin" | "knockout";
  school_id?: string;
  time_control?: string;
  location?: string;
  startAt?: string;
  endAt?: string;
  prize_pool?: number;
  max_players?: number;
  roundsPlanned?: number;
  notes?: string;
  selected_students: string[]; // Student IDs to register
}
