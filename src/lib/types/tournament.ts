import type { Student } from './school';

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  type?: "swiss" | "round_robin" | "elimination" | "team";
  format?: "swiss" | "round_robin" | "elimination" | "team" | "knockout" | "single_elimination";
  status: "planned" | "active" | "completed" | "draft" | "upcoming" | "in_progress" | "cancelled";
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  maxPlayers?: number; // Aliased for legacy compatibility
  timeControl?: string;
  entryFee?: number;
  prizePool?: number;
  location?: string;
  organizer?: string;
  notes?: string;
  rules?: string;
  schoolId: string;
  currentRound?: number;
  totalRounds?: number;
  playersRegistered?: number;
  owner_id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TournamentParticipant {
  id: string;
  owner_id: string;
  tournamentId: string;
  studentId: string;
  rating: number;
  score: number;
  tiebreakScore?: number;
  createdAt: string;
  students?: Student; // For joined data
}

export interface TournamentMatch {
  id: string;
  owner_id: string;
  tournamentId: string;
  round: number;
  boardNumber: number;
  player1Id: string;
  player2Id: string;
  result?: "1-0" | "0-1" | "1/2-1/2" | "bye" | "forfeit" | "*";
  moves?: string[];
  gameDurationSeconds?: number;
  playedAt?: string;
  createdAt: string;
  player1?: Student;
  player2?: Student;
}

export interface TournamentFilters {
  format?: "swiss" | "round_robin" | "knockout";
  schoolId?: string;
  status?: "planned" | "active" | "completed";
  startDate?: string;
  endDate?: string;
}

export interface TournamentStats {
  totalTournaments: number;
  activeTournaments: number;
  completedTournaments: number;
  totalPlayers: number;
  totalGames: number;
  formats: Record<string, number>;
}
