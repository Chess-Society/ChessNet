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
import { appStore } from '$lib/stores/appStore';
import { get } from 'svelte/store';

export const localTournamentsApi = {
  // Tournament CRUD operations
  async createTournament(formData: CreateTournamentForm): Promise<LocalTournament> {
    const ownerId = await getOwnerId();
    if (!ownerId) throw new Error("No authenticated user");
    
    const tournamentData = {
      name: formData.name,
      format: formData.format,
      schoolId: formData.schoolId, 
      timeControl: formData.timeControl,
      startAt: formData.startAt,
      endAt: formData.endAt,
      notes: formData.notes,
      roundsPlanned: formData.roundsPlanned || calculateDefaultRounds(formData.selectedStudents.length, formData.format)
    };

    const response = await fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tournamentData)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al crear el torneo');
    }

    const { data: tournament } = await response.json();

    // Add selected students as players
    for (const studentId of formData.selectedStudents) {
      await this.addPlayer(tournament.id, studentId);
    }

    return tournament;
  },

  async getTournament(id: string): Promise<LocalTournament | null> {
    const docSnap = await getDoc(doc(db, 'local_tournaments', id));
    if (!docSnap.exists()) return null;
    return toData<LocalTournament>(docSnap);
  },

  async updateTournament(id: string, updates: Partial<LocalTournament>): Promise<void> {
    const response = await fetch(`/api/tournaments?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al actualizar el torneo');
    }
  },

  async deleteTournament(id: string): Promise<void> {
    const response = await fetch(`/api/tournaments?id=${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al eliminar el torneo');
    }
  },


  async getAllTournaments(filters?: TournamentFilters): Promise<LocalTournament[]> {
    const q = getOwnedQuery('local_tournaments');
    const querySnapshot = await getDocs(q);
    let tournaments = querySnapshot.docs.map(doc => toData<LocalTournament>(doc));

    // Apply filters
    if (filters) {
      if (filters.schoolId) {
        tournaments = tournaments.filter(t => t.schoolId === filters.schoolId);
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
      where('tournamentId', '==', id)
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
  async addPlayer(tournamentId: string, studentId: string, manualName?: string): Promise<void> {
    const ownerId = await getOwnerId();
    let studentName = manualName;

    if (!studentName) {
      const studentDoc = await getDoc(doc(db, 'students', studentId));
      if (!studentDoc.exists()) {
        throw new Error('Student not found');
      } else {
        const student = studentDoc.data();
        studentName = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim();
      }
    }

    const docId = `${tournamentId}_${studentId}`;



    const response = await fetch('/api/tournaments/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentId: tournamentId,
        studentId: studentId,
        studentName: studentName,
        status: 'active'
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al añadir el jugador');
    }
  },

  async addManualPlayer(tournamentId: string, name: string): Promise<void> {
    const ghostId = `manual-${Date.now()}`;
    return this.addPlayer(tournamentId, ghostId, name);
  },

  async removePlayer(tournamentId: string, studentId: string): Promise<void> {
    const ownerId = await getOwnerId();

    
    const response = await fetch(`/api/tournaments/players?tournamentId=${tournamentId}&studentId=${studentId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al eliminar el jugador');
    }
  },

  async withdrawPlayer(tournamentId: string, studentId: string): Promise<void> {
    const ownerId = await getOwnerId();

    
    const response = await fetch('/api/tournaments/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentId: tournamentId,
        studentId: studentId,
        status: 'withdrawn'
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al retirar el jugador');
    }
  },

  async reactivatePlayer(tournamentId: string, studentId: string): Promise<void> {
    const ownerId = await getOwnerId();

    
    const response = await fetch('/api/tournaments/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentId: tournamentId,
        studentId: studentId,
        status: 'active'
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al reactivar el jugador');
    }
  },

  async getTournamentPlayers(tournamentId: string): Promise<LocalTournamentPlayer[]> {
    const ownerId = await getOwnerId();

    const q = query(
      getOwnedQuery('local_tournament_players'),
      where('tournamentId', '==', tournamentId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => toData<LocalTournamentPlayer>(doc));
  },

  // Round and pairing management
  async createRound(tournamentId: string, roundNo: number): Promise<void> {
    const ownerId = await getOwnerId();


    const response = await fetch('/api/tournaments/rounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentId: tournamentId,
        roundNo: roundNo
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al crear la ronda');
    }
  },

  async generatePairings(tournamentId: string, roundNo: number): Promise<void> {
    const ownerId = await getOwnerId();
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournament not found');

    const players = await this.getTournamentPlayers(tournamentId);
    if (players.length === 0) throw new Error('No players in tournament');

    // Create round if it doesn't exist
    let roundExists = false;
    const roundDoc = await getDoc(doc(db, 'local_tournament_rounds', `${tournamentId}_${roundNo}`));
    roundExists = roundDoc.exists();
    
    if (!roundExists) {
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

    // Save pairings via API
    const response = await fetch('/api/tournaments/pairings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentId: tournamentId,
        roundNo: roundNo,
        pairings
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al guardar los emparejamientos');
    }
  },

  async updateResult(
    tournamentId: string, 
    roundNo: number, 
    board: number, 
    result: "1-0" | "0-1" | "1/2-1/2"
  ): Promise<void> {
    const pointsWhite = result === "1-0" ? 1 : result === "1/2-1/2" ? 0.5 : 0;
    const pointsBlack = result === "0-1" ? 1 : result === "1/2-1/2" ? 0.5 : 0;

    const pairings = await this.getRoundPairings(tournamentId, roundNo);
    const pairing = pairings.find(p => p.board === board);
    
    if (pairing) {
      const ownerId = await getOwnerId();

      
      const response = await fetch('/api/tournaments/pairings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairingId: pairing.id,
          result,
          pointsWhite,
          pointsBlack
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error al actualizar el resultado');
      }
    }
  },

  async resetRound(tournamentId: string, roundNo: number): Promise<void> {
    const ownerId = await getOwnerId();


    const response = await fetch('/api/tournaments/rounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentId: tournamentId,
        roundNo: roundNo,
        action: 'reset'
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al reiniciar la ronda');
    }
  },

  async getRoundPairings(tournamentId: string, roundNo: number): Promise<LocalTournamentPairing[]> {
    const ownerId = await getOwnerId();

    const q = query(
      getOwnedQuery('local_tournament_pairings'),
      where('tournamentId', '==', tournamentId),
      where('roundNo', '==', roundNo)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => toData<LocalTournamentPairing>(doc));
  },

  async getTournamentPairings(tournamentId: string): Promise<LocalTournamentPairing[]> {
    const ownerId = await getOwnerId();

    const q = query(
      getOwnedQuery('local_tournament_pairings'),
      where('tournamentId', '==', tournamentId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => toData<LocalTournamentPairing>(doc));
  },

  // Standings and statistics
  async calculateStandings(tournamentId: string): Promise<LocalTournamentStanding[]> {
    const tournament = await this.getTournament(tournamentId);
    const players = await this.getTournamentPlayers(tournamentId);
    const pairings = await this.getTournamentPairings(tournamentId);

    // 1. Basic points and game stats
    const standings: LocalTournamentStanding[] = players.map(player => {
      const playerPairings = pairings.filter(p => 
        p.whiteStudentId === player.studentId || 
        p.blackStudentId === player.studentId
      );

      let points = 0;
      let wins = 0;
      let draws = 0;
      let losses = 0;

      playerPairings.forEach(pairing => {
        if (pairing.result === undefined && !pairing.bye) return;

        const isWhite = pairing.whiteStudentId === player.studentId;
        const playerPoints = isWhite ? pairing.pointsWhite || 0 : pairing.pointsBlack || 0;
        
        points += playerPoints;

        if (playerPoints === 1) wins++;
        else if (playerPoints === 0.5) draws++;
        else if (pairing.result) losses++;
      });

      return {
        studentId: player.studentId,
        studentName: player.studentName || 'Unknown',
        points,
        gamesPlayed: playerPairings.filter(p => p.result || p.bye).length,
        wins,
        draws,
        losses,
        tiebreak1: 0, // Buchholz or SB
        tiebreak2: 0, // SB or points
        position: 0
      };
    });

    // 2. Calculate Tiebreaks
    standings.forEach(standing => {
      const playerPairings = pairings.filter(p => 
        (p.whiteStudentId === standing.studentId || p.blackStudentId === standing.studentId) &&
        (p.result || p.bye)
      );

      let buchholz = 0;
      let sonnebornBerger = 0;

      playerPairings.forEach(p => {
        const isWhite = p.whiteStudentId === standing.studentId;
        const playerPoints = isWhite ? p.pointsWhite || 0 : p.pointsBlack || 0;
        const opponentId = isWhite ? p.blackStudentId : p.whiteStudentId;

        if (opponentId) {
          const opponentStanding = standings.find(s => s.studentId === opponentId);
          if (opponentStanding) {
            buchholz += opponentStanding.points;
            if (playerPoints === 1) sonnebornBerger += opponentStanding.points;
            else if (playerPoints === 0.5) sonnebornBerger += (opponentStanding.points * 0.5);
          }
        }
      });

      if (tournament?.format === 'round_robin') {
        standing.tiebreak1 = sonnebornBerger;
        standing.tiebreak2 = buchholz;
      } else {
        standing.tiebreak1 = buchholz;
        standing.tiebreak2 = sonnebornBerger;
      }
    });

    // 3. Sort
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if ((b.tiebreak1 || 0) !== (a.tiebreak1 || 0)) return (b.tiebreak1 || 0) - (a.tiebreak1 || 0);
      if ((b.tiebreak2 || 0) !== (a.tiebreak2 || 0)) return (b.tiebreak2 || 0) - (a.tiebreak2 || 0);
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
      totalTournaments: tournaments.length,
      activeTournaments: tournaments.filter(t => getTournamentStatus(t) === 'active').length,
      completedTournaments: tournaments.filter(t => getTournamentStatus(t) === 'completed').length,
      totalPlayers: 0,
      totalGames: 0,
      formats: { swiss: 0, round_robin: 0, knockout: 0 }
    };

    for (const tournament of tournaments) {
      const players = await this.getTournamentPlayers(tournament.id);
      const pairings = await this.getTournamentPairings(tournament.id);
      
      stats.totalPlayers += players.length;
      stats.totalGames += pairings.filter(p => p.result).length;
      stats.formats[tournament.format]++;
    }

    return stats;
  },

  async cleanOrphanedData(): Promise<void> {
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
        if ((data as any).tournamentId && !validTournamentIds.has((data as any).tournamentId)) {
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
      return playerCount % 2 === 0 ? playerCount - 1 : playerCount;
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
  const previousPairings = await localTournamentsApi.getTournamentPairings(tournamentId);
  
  // Available players to pair (only active ones)
  const availablePlayers = [...standings].filter(s => {
    const p = players.find(player => player.studentId === s.studentId);
    return p?.status !== 'withdrawn';
  });
  const pairings: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[] = [];
  let board = 1;

  // Shuffle players with same points for any round to avoid deterministic order if points are equal
  // especially important for round 1
  for (let i = 0; i < availablePlayers.length; i++) {
    let j = i;
    while (j + 1 < availablePlayers.length && availablePlayers[j+1].points === availablePlayers[i].points) {
      j++;
    }
    if (j > i) {
      const slice = availablePlayers.splice(i, j - i + 1);
      shuffleArray(slice);
      availablePlayers.splice(i, 0, ...slice);
      i = j;
    }
  }

  while (availablePlayers.length >= 1) {
    if (availablePlayers.length === 1) {
      const player = availablePlayers.shift()!;
      pairings.push({
        tournamentId: tournamentId,
        roundNo: roundNo,
        board,
        whiteStudentId: player.studentId,
        whiteName: player.studentName,
        bye: true,
        result: "1-0",
        pointsWhite: 1,
        pointsBlack: 0
      });
      break;
    }

    const player1 = availablePlayers.shift()!;
    
    // Find best opponent
    let opponentIndex = -1;
    for (let i = 0; i < availablePlayers.length; i++) {
      const p2 = availablePlayers[i];
      const alreadyPlayed = previousPairings.some(p => 
        (p.whiteStudentId === player1.studentId && p.blackStudentId === p2.studentId) ||
        (p.whiteStudentId === p2.studentId && p.blackStudentId === player1.studentId)
      );
      
      if (!alreadyPlayed) {
        opponentIndex = i;
        break;
      }
    }

    // If no opponent found that hasn't played, take the first one (fallback)
    if (opponentIndex === -1) opponentIndex = 0;

    const player2 = availablePlayers.splice(opponentIndex, 1)[0];
    
    // Color balancing: Count whites for each
    const whitesP1 = previousPairings.filter(p => p.whiteStudentId === player1.studentId && !p.bye).length;
    const whitesP2 = previousPairings.filter(p => p.whiteStudentId === player2.studentId && !p.bye).length;

    let whitePlayer, blackPlayer;
    if (whitesP1 > whitesP2) {
      whitePlayer = player2;
      blackPlayer = player1;
    } else if (whitesP2 > whitesP1) {
      whitePlayer = player1;
      blackPlayer = player2;
    } else {
      whitePlayer = Math.random() < 0.5 ? player1 : player2;
      blackPlayer = whitePlayer === player1 ? player2 : player1;
    }

    pairings.push({
      tournamentId: tournamentId,
      roundNo: roundNo,
      board,
      whiteStudentId: whitePlayer.studentId,
      blackStudentId: blackPlayer.studentId,
      whiteName: whitePlayer.studentName,
      blackName: blackPlayer.studentName
    });
    
    board++;
  }

  return pairings;
}

async function generateRoundRobinPairings(
  tournamentId: string, 
  roundNo: number, 
  players: LocalTournamentPlayer[]
): Promise<Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[]> {
  const activePlayers = players.filter(p => (p as any).status !== 'withdrawn');
  const pairings: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>[] = [];
  if (activePlayers.length < 2) return pairings;

  // Use Circle Method for Round Robin
  const playersArray = [...activePlayers];
  if (playersArray.length % 2 !== 0) {
    playersArray.push({ 
      id: 'bye', 
      tournamentId: tournamentId, 
      studentId: 'bye', 
      studentName: 'BYE',
      status: 'active'
    } as any);
  }

  const n = playersArray.length;
  const numRounds = n - 1;
  if (roundNo > numRounds) return pairings;

  // Rotate players array based on roundNo
  // Fixed position at index 0, others rotate
  const rotation = (roundNo - 1) % numRounds;
  const currentRoundPlayers = [playersArray[0]];
  for (let i = 1; i < n; i++) {
    const rotatedIndex = ((i - 1 + rotation) % (n - 1)) + 1;
    currentRoundPlayers.push(playersArray[rotatedIndex]);
  }

  let board = 1;
  for (let i = 0; i < n / 2; i++) {
    const p1 = currentRoundPlayers[i];
    const p2 = currentRoundPlayers[n - 1 - i];

    if (p1.studentId === 'bye' || p2.studentId === 'bye') {
      const realPlayer = p1.studentId !== 'bye' ? p1 : p2;
      pairings.push({
        tournamentId: tournamentId,
        roundNo: roundNo,
        board: 0, // Specialized board for byes
        whiteStudentId: realPlayer.studentId,
        whiteName: realPlayer.studentName,
        blackStudentId: 'BYE',
        blackName: 'BYE',
        result: '1-0', // Automatic point for bye in local RR
        pointsWhite: 1,
        pointsBlack: 0,
        bye: true
      });
      continue;
    }

    // Alternate colors based on round/index for fairness
    const isWhite = (i + roundNo) % 2 === 0;
    pairings.push({
      tournamentId: tournamentId,
      roundNo: roundNo,
      board: board++,
      whiteStudentId: isWhite ? p1.studentId : p2.studentId,
      whiteName: isWhite ? p1.studentName : p2.studentName,
      blackStudentId: isWhite ? p2.studentId : p1.studentId,
      blackName: isWhite ? p2.studentName : p1.studentName,
      result: undefined,
      pointsWhite: 0,
      pointsBlack: 0
    });
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
          tournamentId: tournamentId,
          roundNo: roundNo,
          board,
          whiteStudentId: shuffledPlayers[i].studentId,
          blackStudentId: shuffledPlayers[i + 1].studentId,
          whiteName: shuffledPlayers[i].studentName,
          blackName: shuffledPlayers[i + 1].studentName
        });
      } else {
        // Bye for last player
        pairings.push({
          tournamentId: tournamentId,
          roundNo: roundNo,
          board,
          whiteStudentId: shuffledPlayers[i].studentId,
          whiteName: shuffledPlayers[i].studentName,
          bye: true,
          result: "1-0",
          pointsWhite: 1
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
        const winner = players.find(p => p.studentId === pairing.whiteStudentId);
        if (winner) winners.push(winner);
      } else if (pairing.result) {
        let winnerId: string | undefined;
        if (pairing.result === "1-0") winnerId = pairing.whiteStudentId;
        else if (pairing.result === "0-1") winnerId = pairing.blackStudentId;
        
        if (winnerId) {
          const winner = players.find(p => p.studentId === winnerId);
          if (winner) winners.push(winner);
        }
      }
    }

    // Pair winners
    let board = 1;
    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        pairings.push({
          tournamentId: tournamentId,
          roundNo: roundNo,
          board,
          whiteStudentId: winners[i].studentId,
          blackStudentId: winners[i + 1].studentId,
          whiteName: winners[i].studentName,
          blackName: winners[i + 1].studentName
        });
      } else {
        // Bye for last winner
        pairings.push({
          tournamentId: tournamentId,
          roundNo: roundNo,
          board,
          whiteStudentId: winners[i].studentId,
          whiteName: winners[i].studentName,
          bye: true,
          result: "1-0",
          pointsWhite: 1
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
    (p.whiteStudentId === player1Id && p.blackStudentId === player2Id) ||
    (p.whiteStudentId === player2Id && p.blackStudentId === player1Id)
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
