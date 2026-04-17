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
      school_id: formData.school_id || (formData as any).school_id, 
      time_control: formData.time_control,
      startAt: formData.startAt,
      endAt: formData.endAt,
      owner_id: ownerId,
      roundsPlanned: formData.roundsPlanned || calculateDefaultRounds(formData.selected_students.length, formData.format),
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'upcoming' as const,
      currentRound: 0
    };

    if (ownerId === 'chessnet-dev-uid') {
        const id = await appStore.addLocalTournament(tournamentData);
        for (const studentId of formData.selected_students) {
            await this.addPlayer(id, studentId);
        }
        return { ...tournamentData, id };
    }

    const docRef = await addDoc(collection(db, 'local_tournaments'), tournamentData);
    const tournament = { ...tournamentData, id: docRef.id } as LocalTournament;

    // Add selected students as players
    for (const studentId of formData.selected_students) {
      await this.addPlayer(docRef.id, studentId);
    }

    return tournament;
  },

  async getTournament(id: string): Promise<LocalTournament | null> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        return get(appStore).localTournaments.find(t => t.id === id) || null;
    }
    const docSnap = await getDoc(doc(db, 'local_tournaments', id));
    if (!docSnap.exists()) return null;
    return toData<LocalTournament>(docSnap);
  },

  async updateTournament(id: string, updates: Partial<LocalTournament>): Promise<void> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        await appStore.updateLocalTournament(id, updates);
        return;
    }
    const docRef = doc(db, 'local_tournaments', id);
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  },

  async deleteTournament(id: string): Promise<void> {
    const ownerId = await getOwnerId();
    
    if (ownerId === 'chessnet-dev-uid') {
        const batch = {
            delete: (coll: string, id: string) => {
                // Mock deletion is handled by appStore if we add a multi-delete, 
                // but let's just call the individual ones or add a helper to appStore.
            }
        };
        // Use appStore directly for better sync
        await appStore.removeLocalTournament(id);
        await appStore.removeLocalTournamentPairings(id);
        // We need round removal too
        const tournamentRounds = get(appStore).localTournamentRounds.filter(r => r.tournament_id === id);
        for (const r of tournamentRounds) {
            await appStore.removeLocalTournamentRound(id, r.round_no);
        }
        const tournamentPlayers = get(appStore).localTournamentPlayers.filter(p => p.tournament_id === id);
        for (const p of tournamentPlayers) {
            await appStore.removeLocalTournamentPlayer(id, p.student_id);
        }
        return;
    }

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
  async addPlayer(tournamentId: string, studentId: string, manualName?: string): Promise<void> {
    const ownerId = await getOwnerId();
    let studentName = manualName;

    if (!studentName) {
      if (ownerId === 'chessnet-dev-uid') {
        const mockStudents = get(appStore).students;
        const found = mockStudents.find((s: any) => s.id === studentId);
        if (found) {
          studentName = found.name || `${found.first_name || ''} ${found.last_name || ''}`.trim();
        }
        
        if (!studentName) {
            // Check localStorage as final fallback
            const saved = localStorage.getItem('chessnet_mock_students');
            if (saved) {
                const items = JSON.parse(saved);
                const foundAgain = items.find((s: any) => s.id === studentId);
                if (foundAgain) {
                    studentName = foundAgain.name || `${foundAgain.first_name || ''} ${foundAgain.last_name || ''}`.trim();
                }
            }
        }
        
        if (!studentName) throw new Error('Student not found in local data');
      } else {
        const studentDoc = await getDoc(doc(db, 'students', studentId));
        if (!studentDoc.exists()) {
          throw new Error('Student not found');
        } else {
          const student = studentDoc.data();
          studentName = student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
        }
      }
    }

    const docId = `${tournamentId}_${studentId}`;

    if (ownerId === 'chessnet-dev-uid') {
        await appStore.addLocalTournamentPlayer({
          tournament_id: tournamentId,
          student_id: studentId,
          student_name: studentName,
          status: 'active'
        });
        return;
    }

    await setDoc(doc(db, 'local_tournament_players', docId), {
      tournament_id: tournamentId,
      student_id: studentId,
      student_name: studentName,
      owner_id: ownerId,
      status: 'active',
      createdAt: new Date().toISOString()
    });
  },

  async addManualPlayer(tournamentId: string, name: string): Promise<void> {
    const ghostId = `manual-${Date.now()}`;
    return this.addPlayer(tournamentId, ghostId, name);
  },

  async removePlayer(tournamentId: string, studentId: string): Promise<void> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        await appStore.removeLocalTournamentPlayer(tournamentId, studentId);
        return;
    }
    await deleteDoc(doc(db, 'local_tournament_players', `${tournamentId}_${studentId}`));
  },

  async withdrawPlayer(tournamentId: string, studentId: string): Promise<void> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        await appStore.updateLocalTournamentPlayer(tournamentId, studentId, { status: 'withdrawn' });
        return;
    }
    await updateDoc(doc(db, 'local_tournament_players', `${tournamentId}_${studentId}`), {
      status: 'withdrawn'
    });
  },

  async reactivatePlayer(tournamentId: string, studentId: string): Promise<void> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        await appStore.updateLocalTournamentPlayer(tournamentId, studentId, { status: 'active' });
        return;
    }
    await updateDoc(doc(db, 'local_tournament_players', `${tournamentId}_${studentId}`), {
      status: 'active'
    });
  },

  async getTournamentPlayers(tournamentId: string): Promise<LocalTournamentPlayer[]> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        return get(appStore).localTournamentPlayers.filter(p => p.tournament_id === tournamentId);
    }
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
    if (ownerId === 'chessnet-dev-uid') {
        await appStore.addLocalTournamentRound({
          tournament_id: tournamentId,
          round_no: roundNo,
          startedAt: new Date().toISOString()
        });
        return;
    }
    await setDoc(doc(db, 'local_tournament_rounds', docId), {
      tournament_id: tournamentId,
      round_no: roundNo,
      owner_id: ownerId,
      startedAt: new Date().toISOString()
    });
  },

  async generatePairings(tournamentId: string, roundNo: number): Promise<void> {
    const ownerId = await getOwnerId();
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournament not found');

    const players = await this.getTournamentPlayers(tournamentId);
    if (players.length === 0) throw new Error('No players in tournament');

    // Create round if it doesn't exist
    let roundExists = false;
    if (ownerId === 'chessnet-dev-uid') {
        roundExists = get(appStore).localTournamentRounds.some(r => r.tournament_id === tournamentId && r.round_no === roundNo);
    } else {
        const roundDoc = await getDoc(doc(db, 'local_tournament_rounds', `${tournamentId}_${roundNo}`));
        roundExists = roundDoc.exists();
    }
    
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

    // Save pairings
    for (const pairing of pairings) {
      if (ownerId === 'chessnet-dev-uid') {
          await appStore.addLocalTournamentPairing(pairing);
      } else {
          await addDoc(collection(db, 'local_tournament_pairings'), {
            ...pairing,
            owner_id: ownerId,
            createdAt: new Date().toISOString()
          });
      }
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
      const ownerId = await getOwnerId();
      if (ownerId === 'chessnet-dev-uid') {
          await appStore.updateLocalTournamentPairing(pairing.id, {
            result,
            points_white,
            points_black
          });
          return;
      }
      await updateDoc(doc(db, "local_tournament_pairings", pairing.id), {
        result,
        points_white,
        points_black,
        updatedAt: new Date().toISOString()
      });
    }
  },

  async resetRound(tournamentId: string, roundNo: number): Promise<void> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        await appStore.removeLocalTournamentPairings(tournamentId, roundNo);
        await appStore.removeLocalTournamentRound(tournamentId, roundNo);
        await appStore.updateLocalTournament(tournamentId, {
            currentRound: Math.max(1, roundNo - 1)
        });
        return;
    }

    const pairings = await this.getRoundPairings(tournamentId, roundNo);
    const batch = writeBatch(db);
    pairings.forEach(p => batch.delete(doc(db, 'local_tournament_pairings', p.id)));
    batch.delete(doc(db, 'local_tournament_rounds', `${tournamentId}_${roundNo}`));
    
    // Also update tournament current round
    batch.update(doc(db, 'local_tournaments', tournamentId), {
      currentRound: Math.max(1, roundNo - 1)
    });

    await batch.commit();
  },

  async getRoundPairings(tournamentId: string, roundNo: number): Promise<LocalTournamentPairing[]> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        const allPairings = get(appStore).localTournamentPairings;
        return allPairings.filter(p => p.tournament_id === tournamentId && p.round_no === roundNo);
    }
    const q = query(
      getOwnedQuery('local_tournament_pairings'),
      where('tournament_id', '==', tournamentId),
      where('round_no', '==', roundNo)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => toData<LocalTournamentPairing>(doc));
  },

  async getTournamentPairings(tournamentId: string): Promise<LocalTournamentPairing[]> {
    const ownerId = await getOwnerId();
    if (ownerId === 'chessnet-dev-uid') {
        return get(appStore).localTournamentPairings.filter(p => p.tournament_id === tournamentId);
    }
    const q = query(
      getOwnedQuery('local_tournament_pairings'),
      where('tournament_id', '==', tournamentId)
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
        p.white_student_id === player.student_id || 
        p.black_student_id === player.student_id
      );

      let points = 0;
      let wins = 0;
      let draws = 0;
      let losses = 0;

      playerPairings.forEach(pairing => {
        if (pairing.result === undefined && !pairing.bye) return;

        const isWhite = pairing.white_student_id === player.student_id;
        const playerPoints = isWhite ? pairing.points_white || 0 : pairing.points_black || 0;
        
        points += playerPoints;

        if (playerPoints === 1) wins++;
        else if (playerPoints === 0.5) draws++;
        else if (pairing.result) losses++;
      });

      return {
        student_id: player.student_id,
        student_name: player.student_name || 'Unknown',
        points,
        games_played: playerPairings.filter(p => p.result || p.bye).length,
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
        (p.white_student_id === standing.student_id || p.black_student_id === standing.student_id) &&
        (p.result || p.bye)
      );

      let buchholz = 0;
      let sonnebornBerger = 0;

      playerPairings.forEach(p => {
        const isWhite = p.white_student_id === standing.student_id;
        const result = p.result;
        const playerPoints = isWhite ? p.points_white || 0 : p.points_black || 0;
        const opponentId = isWhite ? p.black_student_id : p.white_student_id;

        if (opponentId) {
          const opponentStanding = standings.find(s => s.student_id === opponentId);
          if (opponentStanding) {
            buchholz += opponentStanding.points;
            if (playerPoints === 1) sonnebornBerger += opponentStanding.points;
            else if (playerPoints === 0.5) sonnebornBerger += (opponentStanding.points * 0.5);
          }
        } else if (p.bye) {
           // Standard: Bye doesn't contribute to Buchholz directly in some systems, 
           // but here we keep it simple or follow FIDE virtual opponent (too complex for now).
           // Let's just skip opponent points for Bye.
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
    const p = players.find(player => player.student_id === s.student_id);
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
        tournament_id: tournamentId,
        round_no: roundNo,
        board,
        white_student_id: player.student_id,
        white_name: player.student_name,
        bye: true,
        result: "1-0",
        points_white: 1,
        points_black: 0
      });
      break;
    }

    const player1 = availablePlayers.shift()!;
    
    // Find best opponent
    let opponentIndex = -1;
    for (let i = 0; i < availablePlayers.length; i++) {
      const p2 = availablePlayers[i];
      const alreadyPlayed = previousPairings.some(p => 
        (p.white_student_id === player1.student_id && p.black_student_id === p2.student_id) ||
        (p.white_student_id === p2.student_id && p.black_student_id === player1.student_id)
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
    const whitesP1 = previousPairings.filter(p => p.white_student_id === player1.student_id && !p.bye).length;
    const whitesP2 = previousPairings.filter(p => p.white_student_id === player2.student_id && !p.bye).length;

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
      tournament_id: tournamentId,
      round_no: roundNo,
      board,
      white_student_id: whitePlayer.student_id,
      black_student_id: blackPlayer.student_id,
      white_name: whitePlayer.student_name,
      black_name: blackPlayer.student_name
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
      tournament_id: tournamentId, 
      student_id: 'bye', 
      student_name: 'BYE',
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

    if (p1.student_id === 'bye' || p2.student_id === 'bye') {
      const realPlayer = p1.student_id !== 'bye' ? p1 : p2;
      pairings.push({
        tournament_id: tournamentId,
        round_no: roundNo,
        board: 0, // Specialized board for byes
        white_student_id: realPlayer.student_id,
        white_name: realPlayer.student_name,
        black_student_id: 'BYE',
        black_name: 'BYE',
        result: '1-0', // Automatic point for bye in local RR
        points_white: 1,
        points_black: 0,
        bye: true
      });
      continue;
    }

    // Alternate colors based on round/index for fairness
    const isWhite = (i + roundNo) % 2 === 0;
    pairings.push({
      tournament_id: tournamentId,
      round_no: roundNo,
      board: board++,
      white_student_id: isWhite ? p1.student_id : p2.student_id,
      white_name: isWhite ? p1.student_name : p2.student_name,
      black_student_id: isWhite ? p2.student_id : p1.student_id,
      black_name: isWhite ? p2.student_name : p1.student_name,
      result: undefined,
      points_white: 0,
      points_black: 0
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
