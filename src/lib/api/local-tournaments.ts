import { db, toData } from "$lib/firebase";
import { getOwnerId, getOwnedQuery } from "./base";
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
  Student,
  LocalTournamentRound
} from '$lib/types';

export const localTournamentsApi = {
  // Tournament CRUD operations
  async createTournament(formData: CreateTournamentForm): Promise<LocalTournament> {
    const ownerId = await getOwnerId();
    
    const tournamentData = {
      name: formData.name,
      format: formData.format,
      school_id: formData.school_id || (formData as any).school_id, // Soporte para ambos durante transición
      time_control: formData.time_control,
      startAt: formData.startAt,
      endAt: formData.endAt,
      owner_id: ownerId,
      roundsPlanned: formData.roundsPlanned || calculateDefaultRounds(formData.selected_students.length, formData.format),
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'local_tournaments'), tournamentData);
    const tournament = { ...tournamentData, id: docRef.id } as LocalTournament;

    // Add selected students as players
    for (const studentId of formData.selected_students) {
      await this.addPlayer(docRef.id, studentId);
    }

    return tournament;
  },

  async getTournament(id: string): Promise<LocalTournament | null> {
    const docSnap = await getDoc(doc(db, 'local_tournaments', id));
    if (!docSnap.exists()) return null;
    return toData<LocalTournament>(docSnap);
  },

  async updateTournament(id: string, updates: Partial<LocalTournament>): Promise<void> {
    const docRef = doc(db, 'local_tournaments', id);
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  },

  async deleteTournament(id: string): Promise<void> {
    const batch = writeBatch(db);
    
    // 1. Delete players
    const playersQuery = query(collection(db, 'local_tournament_players'), where('tournament_id', '==', id));
    const playersSnap = await getDocs(playersQuery);
    playersSnap.docs.forEach(doc => batch.delete(doc.ref));

    // 2. Delete pairings
    const pairingsQuery = query(collection(db, 'local_tournament_pairings'), where('tournament_id', '==', id));
    const pairingsSnap = await getDocs(pairingsQuery);
    pairingsSnap.docs.forEach(doc => batch.delete(doc.ref));

    // 3. Delete rounds
    const roundsQuery = query(collection(db, 'local_tournament_rounds'), where('tournament_id', '==', id));
    const roundsSnap = await getDocs(roundsQuery);
    roundsSnap.docs.forEach(doc => batch.delete(doc.ref));

    // 4. Delete tournament document
    batch.delete(doc(db, 'local_tournaments', id));

    await batch.commit();
  },


  async getAllTournaments(filters?: TournamentFilters): Promise<LocalTournament[]> {
    const q = getOwnedQuery('local_tournaments');
    const querySnapshot = await getDocs(q);
    let tournaments = querySnapshot.docs.map(doc => toData<LocalTournament>(doc));

    // Apply filters
    if (filters) {
      if (filters.school_id || (filters as any).school_id) {
        const schoolId = filters.school_id || (filters as any).school_id;
        tournaments = tournaments.filter(t => t.school_id === schoolId);
      }
      if (filters.format) {
        tournaments = tournaments.filter(t => t.format === filters.format);
      }
      if (filters.status) {
        tournaments = tournaments.filter(t => getTournamentStatus(t) === filters.status);
      }
      if (filters.startDate) {
        tournaments = tournaments.filter(t => !t.startAt || t.startAt >= filters.startDate!);
      }
      if (filters.endDate) {
        tournaments = tournaments.filter(t => !t.endAt || t.endAt <= filters.endDate!);
      }
    }

    return tournaments;
  },

  async getTournamentComplete(id: string): Promise<LocalTournamentComplete | null> {
    const tournament = await this.getTournament(id);
    if (!tournament) return null;

    const players = await this.getTournamentPlayers(id);
    const pairings = await this.getTournamentPairings(id);
    
    const roundsQuery = query(
      getOwnedQuery('local_tournament_rounds'),
      where('tournament_id', '==', id)
    );
    const roundsSnap = await getDocs(roundsQuery);
    const rounds = roundsSnap.docs.map(doc => toData<LocalTournamentRound>(doc));
    
    const standings = await this.calculateStandings(id);

    return {
      ...tournament,
      players,
      pairings,
      rounds,
      standings
    };
  },

  // Player management
  async addPlayer(tournamentId: string, studentId: string): Promise<void> {
    const ownerId = await getOwnerId();
    const studentDoc = await getDoc(doc(db, 'students', studentId));
    
    if (!studentDoc.exists()) throw new Error('Student not found');
    const student = studentDoc.data();

    const studentName = student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
    const docId = `${tournamentId}_${studentId}`;

    await setDoc(doc(db, 'local_tournament_players', docId), {
      tournament_id: tournamentId,
      student_id: studentId,
      student_name: studentName,
      owner_id: ownerId,
      createdAt: new Date().toISOString()
    });
  },

  async removePlayer(tournamentId: string, studentId: string): Promise<void> {
    await deleteDoc(doc(db, 'local_tournament_players', `${tournamentId}_${studentId}`));
  },

  async getTournamentPlayers(tournamentId: string): Promise<LocalTournamentPlayer[]> {
    const q = query(
      getOwnedQuery('local_tournament_players'),
      where('tournament_id', '==', tournamentId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => toData<LocalTournamentPlayer>(doc));
  },

  // Round and pairing management
  async createRound(tournamentId: string, roundNo: number): Promise<void> {
    const ownerId = await getOwnerId();
    const docId = `${tournamentId}_${roundNo}`;
    await setDoc(doc(db, 'local_tournament_rounds', docId), {
      tournament_id: tournamentId,
      round_no: roundNo,
      owner_id: ownerId,
      startedAt: new Date().toISOString()
    });
  },

  async generatePairings(tournamentId: string, roundNo: number): Promise<void> {
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournament not found');

    const players = await this.getTournamentPlayers(tournamentId);
    if (players.length === 0) throw new Error('No players in tournament');

    // Create round if it doesn't exist
    const roundDoc = await getDoc(doc(db, 'local_tournament_rounds', `${tournamentId}_${roundNo}`));
    if (!roundDoc.exists()) {
      await this.createRound(tournamentId, roundNo);
    }

    let pairings: any[];

    switch (tournament.format) {
      case 'swiss':
        pairings = await generateSwissPairings(tournamentId, roundNo, players);
        break;
      case 'round_robin':
        pairings = await generateRoundRobinPairings(tournamentId, roundNo, players);
        break;
      case 'knockout':
        pairings = await generateKnockoutPairings(tournamentId, roundNo, players);
        break;
      default:
        throw new Error(`Unsupported tournament format: ${tournament.format}`);
    }

    // Save pairings
    const ownerId = await getOwnerId();
    for (const pairing of pairings) {
      await addDoc(collection(db, 'local_tournament_pairings'), {
        ...pairing,
        owner_id: ownerId,
        createdAt: new Date().toISOString()
      });
    }
  },

  async updateResult(
    tournamentId: string, 
    roundNo: number, 
    board: number, 
    result: "1-0" | "0-1" | "1/2-1/2"
  ): Promise<void> {
    const points_white = result === "1-0" ? 1 : result === "1/2-1/2" ? 0.5 : 0;
    const points_black = result === "0-1" ? 1 : result === "1/2-1/2" ? 0.5 : 0;

    const pairings = await this.getRoundPairings(tournamentId, roundNo);
    const pairing = pairings.find(p => p.board === board);
    
    if (pairing) {
      await updateDoc(doc(db, "local_tournament_pairings", pairing.id), {
        result,
        points_white,
        points_black,
        updatedAt: new Date().toISOString()
      });
    }
  },

  async getRoundPairings(tournamentId: string, roundNo: number): Promise<LocalTournamentPairing[]> {
    const q = query(
      getOwnedQuery('local_tournament_pairings'),
      where('tournament_id', '==', tournamentId),
      where('round_no', '==', roundNo)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => toData<LocalTournamentPairing>(doc));
  },

  async getTournamentPairings(tournamentId: string): Promise<LocalTournamentPairing[]> {
    const q = query(
      getOwnedQuery('local_tournament_pairings'),
      where('tournament_id', '==', tournamentId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => toData<LocalTournamentPairing>(doc));
  },

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
  },

  async getTournamentStats(): Promise<TournamentStats> {
    const tournaments = await this.getAllTournaments();
    
    const stats: TournamentStats = {
      total_tournaments: tournaments.length,
      active_tournaments: tournaments.filter(t => getTournamentStatus(t) === 'active').length,
      completed_tournaments: tournaments.filter(t => getTournamentStatus(t) === 'completed').length,
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
  },

  async cleanOrphanedData(): Promise<void> {
    const ownerId = await getOwnerId();
    const batch = writeBatch(db);
    let deletedCount = 0;

    // 1. Obtener todos los torneos válidos del owner
    const tournamentsSnap = await getDocs(getOwnedQuery('local_tournaments'));
    const validTournamentIds = new Set(tournamentsSnap.docs.map(doc => doc.id));

    // Función auxiliar para limpiar colecciones relacionadas
    const cleanCollection = async (collectionName: string) => {
      const snap = await getDocs(getOwnedQuery(collectionName));
      snap.docs.forEach(doc => {
        const data = doc.data();
        if ((data as any).tournament_id && !validTournamentIds.has((data as any).tournament_id)) {
          batch.delete(doc.ref);
          deletedCount++;
        }
      });
    };

    // 2. Limpiar jugadores, rondas y emparejamientos
    await cleanCollection('local_tournament_players');
    await cleanCollection('local_tournament_rounds');
    await cleanCollection('local_tournament_pairings');

    // 3. Ejecutar borrado si hay huérfanos
    if (deletedCount > 0) {
      await batch.commit();
    } else {
    }
  }
};

// Helper methods
function getTournamentStatus(tournament: LocalTournament): 'planned' | 'active' | 'completed' {
  const now = new Date();
  
  if (tournament.endAt && new Date(tournament.endAt) < now) {
    return 'completed';
  }
  
  if (tournament.startAt && new Date(tournament.startAt) <= now) {
    return 'active';
  }
  
  return 'planned';
}

function calculateDefaultRounds(playerCount: number, format: string): number {
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
async function generateSwissPairings(
  tournamentId: string, 
  roundNo: number, 
  players: LocalTournamentPlayer[]
): Promise<Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[]> {
  const standings = await localTournamentsApi.calculateStandings(tournamentId);
  const availablePlayers = [...standings];
  const pairings: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[] = [];
  let board = 1;

  // Shuffle players with same points for first round
  if (roundNo === 1) {
    shuffleArray(availablePlayers);
  }

  while (availablePlayers.length >= 2) {
    const player1 = availablePlayers.shift()!;
    
    // Find best opponent (similar rating, haven't played before)
    let opponentIndex = 0;
    for (let i = 0; i < availablePlayers.length; i++) {
      if (await havePlayed(tournamentId, player1.student_id, availablePlayers[i].student_id)) {
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

async function generateRoundRobinPairings(
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

async function generateKnockoutPairings(
  tournamentId: string, 
  roundNo: number, 
  players: LocalTournamentPlayer[]
): Promise<Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[]> {
  const pairings: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[] = [];
  
  if (roundNo === 1) {
    // First round: pair all players
    const shuffledPlayers = [...players];
    shuffleArray(shuffledPlayers);
    
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
    const prevRoundPairings = await localTournamentsApi.getRoundPairings(tournamentId, roundNo - 1);
    const winners: LocalTournamentPlayer[] = [];

    for (const pairing of prevRoundPairings) {
      if (pairing.bye) {
        const winner = players.find(p => p.student_id === pairing.white_student_id);
        if (winner) winners.push(winner);
      } else if (pairing.result) {
        let winnerId: string | undefined;
        if (pairing.result === "1-0") winnerId = pairing.white_student_id;
        else if (pairing.result === "0-1") winnerId = pairing.black_student_id;
        
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

async function havePlayed(tournamentId: string, player1Id: string, player2Id: string): Promise<boolean> {
  const pairings = await localTournamentsApi.getTournamentPairings(tournamentId);
  return pairings.some(p => 
    (p.white_student_id === player1Id && p.black_student_id === player2Id) ||
    (p.white_student_id === player2Id && p.black_student_id === player1Id)
  );
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Singleton and instance management is deprecated in favor of functional API
// but we keep the export for compatibility if needed elsewhere
export const getLocalTournamentsApi = async () => localTournamentsApi;
export const resetLocalTournamentsApi = () => {};
