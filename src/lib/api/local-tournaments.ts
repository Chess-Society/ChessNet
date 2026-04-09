import { LocalTournamentStorage } from '$lib/storage/local-storage';
import { db, auth } from "$lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  writeBatch,
  limit,
  type DocumentData
} from "firebase/firestore";
import type { 
  LocalTournament, 
  LocalTournamentPlayer, 
  LocalTournamentPairing, 
  LocalTournamentStanding,
  LocalTournamentComplete,
  CreateTournamentForm,
  TournamentFilters,
  TournamentStats,
  Student
} from '$lib/types';

// Helper to convert Firestore document to data with ID
const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

export class LocalTournamentsApi {
  private storage: LocalTournamentStorage;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.storage = new LocalTournamentStorage(userId);
  }

  // Tournament CRUD operations
  async createTournament(formData: CreateTournamentForm): Promise<LocalTournament> {
    // Create tournament
    const tournament = await this.storage.createTournament({
      name: formData.name,
      format: formData.format,
      college_id: formData.college_id,
      time_control: formData.time_control,
      startAt: formData.startAt,
      endAt: formData.endAt,
      user_id: this.userId,
      roundsPlanned: formData.roundsPlanned || this.calculateDefaultRounds(formData.selected_students.length, formData.format),
      notes: formData.notes
    });

    // Add selected students as players
    for (const studentId of formData.selected_students) {
      await this.addPlayer(tournament.id, studentId);
    }

    return tournament;
  }

  async getTournament(id: string, collegeId?: string): Promise<LocalTournament | null> {
    return this.storage.getTournament(id, collegeId);
  }

  async updateTournament(id: string, updates: Partial<LocalTournament>, collegeId?: string): Promise<LocalTournament | null> {
    return this.storage.updateTournament(id, updates, collegeId);
  }

  async deleteTournament(id: string, collegeId?: string): Promise<void> {
    return this.storage.deleteTournament(id, collegeId);
  }

  async getAllTournaments(filters?: TournamentFilters): Promise<LocalTournament[]> {
    let tournaments = await this.storage.getAllTournaments(filters?.college_id);

    // Apply filters
    if (filters) {
      if (filters.format) {
        tournaments = tournaments.filter(t => t.format === filters.format);
      }
      
      if (filters.status) {
        tournaments = tournaments.filter(t => this.getTournamentStatus(t) === filters.status);
      }
      
      if (filters.startDate) {
        tournaments = tournaments.filter(t => !t.startAt || t.startAt >= filters.startDate!);
      }
      
      if (filters.endDate) {
        tournaments = tournaments.filter(t => !t.endAt || t.endAt <= filters.endDate!);
      }
    }

    return tournaments;
  }

  async getTournamentComplete(id: string, collegeId?: string): Promise<LocalTournamentComplete | null> {
    const complete = await this.storage.getTournamentComplete(id, collegeId);
    if (complete) {
      // Calculate standings
      complete.standings = await this.calculateStandings(id);
    }
    return complete;
  }

  // Player management
  async addPlayer(tournamentId: string, studentId: string): Promise<LocalTournamentPlayer> {
    // Get student info from Firestore
    const studentDoc = await getDoc(doc(db, "students", studentId));
    
    if (!studentDoc.exists()) throw new Error('Student not found');
    const studentData = studentDoc.data();
    
    if (studentData.user_id !== this.userId) throw new Error('Student does not belong to user');

    const studentName = studentData.name || `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim();

    return this.storage.addPlayer({
      tournament_id: tournamentId,
      student_id: studentId,
      student_name: studentName
    });
  }

  async removePlayer(tournamentId: string, studentId: string): Promise<void> {
    return this.storage.removePlayer(tournamentId, studentId);
  }

  async getTournamentPlayers(tournamentId: string): Promise<LocalTournamentPlayer[]> {
    return this.storage.getTournamentPlayers(tournamentId);
  }

  // Round and pairing management
  async createRound(tournamentId: string, roundNo: number): Promise<void> {
    await this.storage.createRound({
      tournament_id: tournamentId,
      round_no: roundNo,
      startedAt: new Date().toISOString()
    });
  }

  async generatePairings(tournamentId: string, roundNo: number): Promise<LocalTournamentPairing[]> {
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournament not found');

    const players = await this.getTournamentPlayers(tournamentId);
    if (players.length === 0) throw new Error('No players in tournament');

    // Create round if it doesn't exist
    const rounds = await this.storage.getTournamentRounds(tournamentId);
    if (!rounds.find(r => r.round_no === roundNo)) {
      await this.createRound(tournamentId, roundNo);
    }

    let pairings: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[];

    switch (tournament.format) {
      case 'swiss':
        pairings = await this.generateSwissPairings(tournamentId, roundNo, players);
        break;
      case 'round_robin':
        pairings = await this.generateRoundRobinPairings(tournamentId, roundNo, players);
        break;
      case 'knockout':
        pairings = await this.generateKnockoutPairings(tournamentId, roundNo, players);
        break;
      default:
        throw new Error(`Unsupported tournament format: ${tournament.format}`);
    }

    // Save pairings
    const savedPairings: LocalTournamentPairing[] = [];
    for (const pairing of pairings) {
      savedPairings.push(await this.storage.createPairing(pairing));
    }

    return savedPairings;
  }

  async updateResult(
    tournamentId: string, 
    roundNo: number, 
    board: number, 
    result: "1-0" | "0-1" | "1/2-1/2"
  ): Promise<void> {
    const points_white = result === "1-0" ? 1 : result === "1/2-1/2" ? 0.5 : 0;
    const points_black = result === "0-1" ? 1 : result === "1/2-1/2" ? 0.5 : 0;

    await this.storage.updatePairing(tournamentId, roundNo, board, {
      result,
      points_white,
      points_black
    });
  }

  async getRoundPairings(tournamentId: string, roundNo: number): Promise<LocalTournamentPairing[]> {
    return this.storage.getRoundPairings(tournamentId, roundNo);
  }

  async getTournamentPairings(tournamentId: string): Promise<LocalTournamentPairing[]> {
    return this.storage.getTournamentPairings(tournamentId);
  }

  // Standings and statistics
  async calculateStandings(tournamentId: string): Promise<LocalTournamentStanding[]> {
    const players = await this.getTournamentPlayers(tournamentId);
    const pairings = await this.getTournamentPairings(tournamentId);

    const standings: LocalTournamentStanding[] = players.map(player => {
      const playerPairings = pairings.filter(p => 
        p.white_student_id === player.student_id || 
        p.black_student_id === player.student_id
      );

      let points = 0;
      let wins = 0;
      let draws = 0;
      let losses = 0;

      playerPairings.forEach(pairing => {
        if (!pairing.result) return;

        const isWhite = pairing.white_student_id === player.student_id;
        const playerPoints = isWhite ? pairing.points_white || 0 : pairing.points_black || 0;
        
        points += playerPoints;

        if (playerPoints === 1) wins++;
        else if (playerPoints === 0.5) draws++;
        else losses++;
      });

      return {
        student_id: player.student_id,
        student_name: player.student_name || 'Unknown',
        points,
        games_played: playerPairings.length,
        wins,
        draws,
        losses,
        position: 0 // Will be set after sorting
      };
    });

    // Sort by points (descending), then by wins (descending)
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.wins - a.wins;
    });

    // Set positions
    standings.forEach((standing, index) => {
      standing.position = index + 1;
    });

    return standings;
  }

  async getTournamentStats(): Promise<TournamentStats> {
    const tournaments = await this.getAllTournaments();
    
    const stats: TournamentStats = {
      total_tournaments: tournaments.length,
      active_tournaments: tournaments.filter(t => this.getTournamentStatus(t) === 'active').length,
      completed_tournaments: tournaments.filter(t => this.getTournamentStatus(t) === 'completed').length,
      total_players: 0,
      total_games: 0,
      formats: { swiss: 0, round_robin: 0, knockout: 0 }
    };

    for (const tournament of tournaments) {
      const players = await this.getTournamentPlayers(tournament.id);
      const pairings = await this.getTournamentPairings(tournament.id);
      
      stats.total_players += players.length;
      stats.total_games += pairings.filter(p => p.result).length;
      stats.formats[tournament.format]++;
    }

    return stats;
  }

  // Helper methods
  private getTournamentStatus(tournament: LocalTournament): 'planned' | 'active' | 'completed' {
    const now = new Date();
    
    if (tournament.endAt && new Date(tournament.endAt) < now) {
      return 'completed';
    }
    
    if (tournament.startAt && new Date(tournament.startAt) <= now) {
      return 'active';
    }
    
    return 'planned';
  }

  private calculateDefaultRounds(playerCount: number, format: string): number {
    switch (format) {
      case 'swiss':
        return Math.ceil(Math.log2(playerCount));
      case 'round_robin':
        return playerCount - 1;
      case 'knockout':
        return Math.ceil(Math.log2(playerCount));
      default:
        return 1;
    }
  }

  // Pairing algorithms
  private async generateSwissPairings(
    tournamentId: string, 
    roundNo: number, 
    players: LocalTournamentPlayer[]
  ): Promise<Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[]> {
    const standings = await this.calculateStandings(tournamentId);
    const availablePlayers = [...standings];
    const pairings: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[] = [];
    let board = 1;

    // Shuffle players with same points for first round
    if (roundNo === 1) {
      this.shuffleArray(availablePlayers);
    }

    while (availablePlayers.length >= 2) {
      const player1 = availablePlayers.shift()!;
      
      // Find best opponent (similar rating, haven't played before)
      let opponentIndex = 0;
      for (let i = 0; i < availablePlayers.length; i++) {
        if (await this.havePlayed(tournamentId, player1.student_id, availablePlayers[i].student_id)) {
          continue;
        }
        opponentIndex = i;
        break;
      }

      if (opponentIndex < availablePlayers.length) {
        const player2 = availablePlayers.splice(opponentIndex, 1)[0];
        
        // Determine colors (alternate for balance)
        const whitePlayer = Math.random() < 0.5 ? player1 : player2;
        const blackPlayer = whitePlayer === player1 ? player2 : player1;

        pairings.push({
          tournament_id: tournamentId,
          round_no: roundNo,
          board,
          white_student_id: whitePlayer.student_id,
          black_student_id: blackPlayer.student_id,
          white_name: whitePlayer.student_name,
          black_name: blackPlayer.student_name
        });
      } else {
        // Bye for unpaired player
        pairings.push({
          tournament_id: tournamentId,
          round_no: roundNo,
          board,
          white_student_id: player1.student_id,
          white_name: player1.student_name,
          bye: true,
          result: "1-0",
          points_white: 1
        });
      }
      
      board++;
    }

    // Handle remaining unpaired player (bye)
    if (availablePlayers.length === 1) {
      const player = availablePlayers[0];
      pairings.push({
        tournament_id: tournamentId,
        round_no: roundNo,
        board,
        white_student_id: player.student_id,
        white_name: player.student_name,
        bye: true,
        result: "1-0",
        points_white: 1
      });
    }

    return pairings;
  }

  private async generateRoundRobinPairings(
    tournamentId: string, 
    roundNo: number, 
    players: LocalTournamentPlayer[]
  ): Promise<Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[]> {
    const n = players.length;
    const pairings: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[] = [];
    
    if (n < 2) return pairings;

    // Round-robin algorithm
    const rounds = n % 2 === 0 ? n - 1 : n;
    if (roundNo > rounds) return pairings;

    const playersArray = [...players];
    if (n % 2 !== 0) {
      // Add dummy player for bye
      playersArray.push({ 
        id: 'bye', 
        tournament_id: tournamentId, 
        student_id: 'bye', 
        student_name: 'BYE',
        createdAt: new Date().toISOString()
      } as any);
    }

    const totalPlayers = playersArray.length;
    let board = 1;

    for (let i = 0; i < totalPlayers / 2; i++) {
      const player1Index = i;
      const player2Index = totalPlayers - 1 - i;
      
      if (player1Index >= player2Index) break;

      let p1Index, p2Index;
      
      if (roundNo === 1) {
        p1Index = player1Index;
        p2Index = player2Index;
      } else {
        // Rotate players (except first one)
        p1Index = player1Index === 0 ? 0 : ((player1Index + roundNo - 2) % (totalPlayers - 1)) + 1;
        p2Index = player2Index === 0 ? 0 : ((player2Index + roundNo - 2) % (totalPlayers - 1)) + 1;
      }

      const player1 = playersArray[p1Index];
      const player2 = playersArray[p2Index];

      // Skip if either player is bye
      if (player1.student_id === 'bye' || player2.student_id === 'bye') {
        const realPlayer = player1.student_id !== 'bye' ? player1 : player2;
        pairings.push({
          tournament_id: tournamentId,
          round_no: roundNo,
          board,
          white_student_id: realPlayer.student_id,
          white_name: realPlayer.student_name,
          bye: true,
          result: "1-0",
          points_white: 1
        });
      } else {
        pairings.push({
          tournament_id: tournamentId,
          round_no: roundNo,
          board,
          white_student_id: player1.student_id,
          black_student_id: player2.student_id,
          white_name: player1.student_name,
          black_name: player2.student_name
        });
      }
      
      board++;
    }

    return pairings;
  }

  private async generateKnockoutPairings(
    tournamentId: string, 
    roundNo: number, 
    players: LocalTournamentPlayer[]
  ): Promise<Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[]> {
    const pairings: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[] = [];
    
    if (roundNo === 1) {
      // First round: pair all players
      const shuffledPlayers = [...players];
      this.shuffleArray(shuffledPlayers);
      
      let board = 1;
      for (let i = 0; i < shuffledPlayers.length; i += 2) {
        if (i + 1 < shuffledPlayers.length) {
          pairings.push({
            tournament_id: tournamentId,
            round_no: roundNo,
            board,
            white_student_id: shuffledPlayers[i].student_id,
            black_student_id: shuffledPlayers[i + 1].student_id,
            white_name: shuffledPlayers[i].student_name,
            black_name: shuffledPlayers[i + 1].student_name
          });
        } else {
          // Bye for last player
          pairings.push({
            tournament_id: tournamentId,
            round_no: roundNo,
            board,
            white_student_id: shuffledPlayers[i].student_id,
            white_name: shuffledPlayers[i].student_name,
            bye: true,
            result: "1-0",
            points_white: 1
          });
        }
        board++;
      }
    } else {
      // Subsequent rounds: winners from previous round
      const prevRoundPairings = await this.getRoundPairings(tournamentId, roundNo - 1);
      const winners: LocalTournamentPlayer[] = [];

      for (const pairing of prevRoundPairings) {
        if (pairing.bye) {
          const winner = players.find(p => p.student_id === pairing.white_student_id);
          if (winner) winners.push(winner);
        } else if (pairing.result) {
          let winnerId: string | undefined;
          if (pairing.result === "1-0") winnerId = pairing.white_student_id;
          else if (pairing.result === "0-1") winnerId = pairing.black_student_id;
          // For draws in knockout, could implement tiebreaker logic
          
          if (winnerId) {
            const winner = players.find(p => p.student_id === winnerId);
            if (winner) winners.push(winner);
          }
        }
      }

      // Pair winners
      let board = 1;
      for (let i = 0; i < winners.length; i += 2) {
        if (i + 1 < winners.length) {
          pairings.push({
            tournament_id: tournamentId,
            round_no: roundNo,
            board,
            white_student_id: winners[i].student_id,
            black_student_id: winners[i + 1].student_id,
            white_name: winners[i].student_name,
            black_name: winners[i + 1].student_name
          });
        } else {
          // Bye for last winner
          pairings.push({
            tournament_id: tournamentId,
            round_no: roundNo,
            board,
            white_student_id: winners[i].student_id,
            white_name: winners[i].student_name,
            bye: true,
            result: "1-0",
            points_white: 1
          });
        }
        board++;
      }
    }

    return pairings;
  }

  private async havePlayed(tournamentId: string, player1Id: string, player2Id: string): Promise<boolean> {
    const pairings = await this.getTournamentPairings(tournamentId);
    return pairings.some(p => 
      (p.white_student_id === player1Id && p.black_student_id === player2Id) ||
      (p.white_student_id === player2Id && p.black_student_id === player1Id)
    );
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Cleanup
  async cleanup(): Promise<void> {
    return this.storage.cleanup();
  }
}

// Singleton instance
let apiInstance: LocalTournamentsApi | null = null;

export const getLocalTournamentsApi = async (): Promise<LocalTournamentsApi> => {
  if (!apiInstance) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    apiInstance = new LocalTournamentsApi(user.uid);
  }
  return apiInstance;
};

// Reset instance on logout
export const resetLocalTournamentsApi = (): void => {
  apiInstance = null;
};
