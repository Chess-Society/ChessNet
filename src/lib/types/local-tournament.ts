export interface LocalTournament {
  id: string;
  ownerId: string;
  schoolId?: string;
  name: string;
  format: "swiss" | "round_robin" | "knockout";
  timeControl?: string; // e.g., "15+10"
  location?: string;
  startAt?: string;
  endAt?: string;
  prizePool?: number;
  maxPlayers?: number;
  roundsPlanned?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "upcoming" | "in_progress" | "completed" | "cancelled";
  currentRound: number;
  startDate?: string; // Compatibilidad con vistas generales
  endDate?: string; // Compatibilidad con vistas generales
  registrationDeadline?: string; // Compatibilidad con vistas generales
  organizer?: string;
  rules?: string;
  entryFee?: number;
  description?: string; // Compatibilidad con vistas generales
  _ttl?: number; 
  _expiresAt?: string; // ISO date when expires
  _version?: number; // For future sync
}

export interface LocalTournamentPlayer {
  id: string;
  ownerId: string;
  tournamentId: string;
  studentId: string;
  studentName?: string; // Denormalized for convenience
  rating?: number;
  seed?: number;
  status: 'active' | 'withdrawn';
  createdAt: string;
}

export interface LocalTournamentRound {
  id: string;
  ownerId: string;
  tournamentId: string;
  roundNo: number;
  startedAt?: string;
  finishedAt?: string;
  notes?: string;
}

export interface LocalTournamentPairing {
  id: string;
  ownerId: string;
  tournamentId: string;
  roundNo: number;
  board: number;
  whiteStudentId?: string;
  blackStudentId?: string;
  whiteName?: string; // Denormalized
  blackName?: string; // Denormalized
  result?: "1-0" | "0-1" | "1/2-1/2";
  bye?: boolean;
  pointsWhite?: number;
  pointsBlack?: number;
  notes?: string;
  updatedAt?: string;
}

export interface LocalTournamentStanding {
  studentId: string;
  studentName: string;
  points: number;
  tiebreak1?: number; // Buchholz, etc.
  tiebreak2?: number;
  gamesPlayed: number;
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
  schoolId?: string;
  timeControl?: string;
  location?: string;
  startAt?: string;
  endAt?: string;
  prizePool?: number;
  maxPlayers?: number;
  roundsPlanned?: number;
  notes?: string;
  selectedStudents: string[]; // Student IDs to register
}
