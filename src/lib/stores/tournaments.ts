import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Types para torneos
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  format: 'swiss' | 'round_robin' | 'knockout' | 'single_elimination' | 'elimination' | 'team';
  time_control: string;
  max_players: number;
  entry_fee: number;
  prize_pool: number;
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  status: 'draft' | 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  current_round?: number;
  total_rounds?: number;
  players_registered?: number;
  location?: string;
  organizer?: string;
  notes?: string;
  rules?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface TournamentPlayer {
  id: string;
  tournament_id: string;
  student_id: string;
  student_name: string;
  student_rating: number;
  registration_date: string;
  status: 'registered' | 'confirmed' | 'withdrawn';
  notes?: string;
}

export interface TournamentRound {
  id: string;
  tournament_id: string;
  round_number: number;
  status: 'not_started' | 'in_progress' | 'completed';
  start_time?: string;
  end_time?: string;
}

export interface TournamentPairing {
  id: string;
  tournament_id: string;
  round_number: number;
  board_number: number;
  white_player_id: string;
  black_player_id: string;
  result?: '1-0' | '0-1' | '1/2-1/2' | '*';
  white_points?: number;
  black_points?: number;
  notes?: string;
  is_bye: boolean;
}

// Store para torneos
export const tournaments = writable<Tournament[]>([]);
export const tournamentPlayers = writable<TournamentPlayer[]>([]);
export const tournamentRounds = writable<TournamentRound[]>([]);
export const tournamentPairings = writable<TournamentPairing[]>([]);

// IndexedDB setup
let db: IDBDatabase | null = null;

const initDB = async (): Promise<IDBDatabase> => {
  if (!browser) {
    throw new Error('IndexedDB not available in server environment');
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ChessNetTournaments', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Tournaments store
      if (!db.objectStoreNames.contains('tournaments')) {
        const tournamentsStore = db.createObjectStore('tournaments', { keyPath: 'id' });
        tournamentsStore.createIndex('user_id', 'user_id', { unique: false });
        tournamentsStore.createIndex('status', 'status', { unique: false });
        tournamentsStore.createIndex('start_date', 'start_date', { unique: false });
      }
      
      // Tournament Players store
      if (!db.objectStoreNames.contains('tournament_players')) {
        const playersStore = db.createObjectStore('tournament_players', { keyPath: 'id' });
        playersStore.createIndex('tournament_id', 'tournament_id', { unique: false });
        playersStore.createIndex('student_id', 'student_id', { unique: false });
        playersStore.createIndex('tournament_student', ['tournament_id', 'student_id'], { unique: true });
      }
      
      // Tournament Rounds store
      if (!db.objectStoreNames.contains('tournament_rounds')) {
        const roundsStore = db.createObjectStore('tournament_rounds', { keyPath: 'id' });
        roundsStore.createIndex('tournament_id', 'tournament_id', { unique: false });
        roundsStore.createIndex('tournament_round', ['tournament_id', 'round_number'], { unique: true });
      }
      
      // Tournament Pairings store
      if (!db.objectStoreNames.contains('tournament_pairings')) {
        const pairingsStore = db.createObjectStore('tournament_pairings', { keyPath: 'id' });
        pairingsStore.createIndex('tournament_id', 'tournament_id', { unique: false });
        pairingsStore.createIndex('round_number', 'round_number', { unique: false });
        pairingsStore.createIndex('tournament_round_board', ['tournament_id', 'round_number', 'board_number'], { unique: true });
      }
    };
  });
};

// Tournament CRUD operations
export const tournamentDB = {
  async init() {
    if (!db) {
      db = await initDB();
    }
    return db;
  },

  async createTournament(tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>): Promise<Tournament> {
    const database = await this.init();
    
    const newTournament: Tournament = {
      ...tournament,
      id: `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournaments'], 'readwrite');
      const store = transaction.objectStore('tournaments');
      const request = store.add(newTournament);
      
      request.onsuccess = () => {
        this.loadTournaments(); // Refresh store
        resolve(newTournament);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async getTournament(id: string): Promise<Tournament | null> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournaments'], 'readonly');
      const store = transaction.objectStore('tournaments');
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
    const database = await this.init();
    const existing = await this.getTournament(id);
    
    if (!existing) {
      throw new Error(`Tournament ${id} not found`);
    }

    const updated: Tournament = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournaments'], 'readwrite');
      const store = transaction.objectStore('tournaments');
      const request = store.put(updated);
      
      request.onsuccess = () => {
        this.loadTournaments(); // Refresh store
        resolve(updated);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async deleteTournament(id: string): Promise<void> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournaments', 'tournament_players', 'tournament_rounds', 'tournament_pairings'], 'readwrite');
      
      // Delete tournament
      transaction.objectStore('tournaments').delete(id);
      
      // Delete related players
      const playersIndex = transaction.objectStore('tournament_players').index('tournament_id');
      playersIndex.openCursor(IDBKeyRange.only(id)).onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      
      // Delete related rounds
      const roundsIndex = transaction.objectStore('tournament_rounds').index('tournament_id');
      roundsIndex.openCursor(IDBKeyRange.only(id)).onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      
      // Delete related pairings
      const pairingsIndex = transaction.objectStore('tournament_pairings').index('tournament_id');
      pairingsIndex.openCursor(IDBKeyRange.only(id)).onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      
      transaction.oncomplete = () => {
        this.loadTournaments(); // Refresh store
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async loadTournaments(): Promise<Tournament[]> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournaments'], 'readonly');
      const store = transaction.objectStore('tournaments');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const result = request.result || [];
        tournaments.set(result);
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Tournament Players operations
  async registerPlayer(player: Omit<TournamentPlayer, 'id' | 'registration_date'>): Promise<TournamentPlayer> {
    const database = await this.init();
    
    const newPlayer: TournamentPlayer = {
      ...player,
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registration_date: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_players'], 'readwrite');
      const store = transaction.objectStore('tournament_players');
      const request = store.add(newPlayer);
      
      request.onsuccess = () => {
        resolve(newPlayer);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async getTournamentPlayers(tournamentId: string): Promise<TournamentPlayer[]> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_players'], 'readonly');
      const store = transaction.objectStore('tournament_players');
      const index = store.index('tournament_id');
      const request = index.getAll(tournamentId);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  // Generar emparejamientos para la primera ronda
  async generateFirstRoundPairings(tournamentId: string): Promise<TournamentPairing[]> {
    const database = await this.init();
    const players = await this.getTournamentPlayers(tournamentId);
    
    if (players.length < 2) {
      throw new Error('Se necesitan al menos 2 jugadores para generar emparejamientos');
    }

    // Ordenar jugadores por rating (descendente)
    const sortedPlayers = players.sort((a, b) => b.student_rating - a.student_rating);
    
    const pairings: TournamentPairing[] = [];
    const roundNumber = 1;
    
    // Crear la ronda en IndexedDB
    await this.createRound(tournamentId, roundNumber);
    
    // Generar emparejamientos
    for (let i = 0; i < sortedPlayers.length; i += 2) {
      const whitePlayer = sortedPlayers[i];
      const blackPlayer = sortedPlayers[i + 1];
      
      if (blackPlayer) {
        // Emparejamiento normal
        const pairing: TournamentPairing = {
          id: `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tournament_id: tournamentId,
          round_number: roundNumber,
          board_number: Math.floor(i / 2) + 1,
          white_player_id: whitePlayer.id,
          black_player_id: blackPlayer.id,
          result: '*',
          white_points: 0,
          black_points: 0,
          is_bye: false
        };
        pairings.push(pairing);
      } else {
        // Bye para el último jugador si hay número impar
        const byePairing: TournamentPairing = {
          id: `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tournament_id: tournamentId,
          round_number: roundNumber,
          board_number: Math.floor(i / 2) + 1,
          white_player_id: whitePlayer.id,
          black_player_id: '',
          result: '1-0', // Bye = victoria automática
          white_points: 1,
          black_points: 0,
          is_bye: true
        };
        pairings.push(byePairing);
      }
    }

    // Guardar emparejamientos en la base de datos
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_pairings'], 'readwrite');
      const store = transaction.objectStore('tournament_pairings');
      
      let completed = 0;
      const total = pairings.length;
      
      if (total === 0) {
        resolve(pairings);
        return;
      }
      
      pairings.forEach(pairing => {
        const request = store.add(pairing);
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve(pairings);
          }
        };
        request.onerror = () => reject(request.error);
      });
    });
  },

  // Crear una ronda
  async createRound(tournamentId: string, roundNumber: number): Promise<TournamentRound> {
    const database = await this.init();
    
    const newRound: TournamentRound = {
      id: `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tournament_id: tournamentId,
      round_number: roundNumber,
      status: 'not_started',
      start_time: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_rounds'], 'readwrite');
      const store = transaction.objectStore('tournament_rounds');
      const request = store.add(newRound);
      
      request.onsuccess = () => {
        resolve(newRound);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Obtener emparejamientos de una ronda
  async getRoundPairings(tournamentId: string, roundNumber: number): Promise<TournamentPairing[]> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_pairings'], 'readonly');
      const store = transaction.objectStore('tournament_pairings');
      const index = store.index('tournament_round_board');
      const request = index.getAll(IDBKeyRange.bound([tournamentId, roundNumber, 0], [tournamentId, roundNumber, 999]));
      
      request.onsuccess = () => {
        const result = request.result || [];
        // Ordenar por número de tablero
        result.sort((a, b) => a.board_number - b.board_number);
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Actualizar resultado de un emparejamiento
  async updatePairingResult(pairingId: string, result: '1-0' | '0-1' | '1/2-1/2'): Promise<void> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_pairings'], 'readwrite');
      const store = transaction.objectStore('tournament_pairings');
      const request = store.get(pairingId);
      
      request.onsuccess = () => {
        const pairing = request.result;
        if (!pairing) {
          reject(new Error('Emparejamiento no encontrado'));
          return;
        }

        // Calcular puntos según el resultado
        let whitePoints = 0;
        let blackPoints = 0;
        
        switch (result) {
          case '1-0':
            whitePoints = 1;
            blackPoints = 0;
            break;
          case '0-1':
            whitePoints = 0;
            blackPoints = 1;
            break;
          case '1/2-1/2':
            whitePoints = 0.5;
            blackPoints = 0.5;
            break;
        }

        // Actualizar el emparejamiento
        const updatedPairing = {
          ...pairing,
          result,
          white_points: whitePoints,
          black_points: blackPoints
        };

        const updateRequest = store.put(updatedPairing);
        updateRequest.onsuccess = () => {
          resolve();
        };
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Finalizar una ronda
  async finishRound(tournamentId: string, roundNumber: number): Promise<void> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_rounds'], 'readwrite');
      const store = transaction.objectStore('tournament_rounds');
      const index = store.index('tournament_round');
      const request = index.get([tournamentId, roundNumber]);
      
      request.onsuccess = () => {
        const round = request.result;
        if (!round) {
          console.error(`❌ Round ${roundNumber} not found for tournament ${tournamentId}`);
          reject(new Error(`Ronda ${roundNumber} no encontrada para el torneo ${tournamentId}`));
          return;
        }


        // Actualizar el estado de la ronda
        const updatedRound = {
          ...round,
          status: 'completed',
          end_time: new Date().toISOString()
        };

        const updateRequest = store.put(updatedRound);
        updateRequest.onsuccess = () => {
          resolve();
        };
        updateRequest.onerror = () => {
          console.error(`❌ Error updating round ${roundNumber}:`, updateRequest.error);
          reject(updateRequest.error);
        };
      };
      request.onerror = () => {
        console.error(`❌ Error finding round ${roundNumber}:`, request.error);
        reject(request.error);
      };
    });
  },

  // Generar siguiente ronda (sistema suizo simplificado)
  async generateNextRound(tournamentId: string): Promise<TournamentPairing[]> {
    const database = await this.init();
    const players = await this.getTournamentPlayers(tournamentId);
    const tournament = await this.getTournament(tournamentId);
    
    if (!tournament) {
      throw new Error('Torneo no encontrado');
    }

    const nextRoundNumber = (tournament.current_round || 0) + 1;
    
    // Crear la nueva ronda en IndexedDB
    await this.createRound(tournamentId, nextRoundNumber);
    
    // Obtener todos los emparejamientos anteriores para calcular puntos
    const allPairings = await this.getAllTournamentPairings(tournamentId);
    
    // Calcular puntos de cada jugador
    const playerPoints = new Map<string, number>();
    players.forEach(player => {
      playerPoints.set(player.id, 0);
    });

    allPairings.forEach(pairing => {
      if (pairing.result && pairing.result !== '*') {
        const whitePoints = playerPoints.get(pairing.white_player_id) || 0;
        const blackPoints = playerPoints.get(pairing.black_player_id) || 0;
        
        playerPoints.set(pairing.white_player_id, whitePoints + (pairing.white_points || 0));
        playerPoints.set(pairing.black_player_id, blackPoints + (pairing.black_points || 0));
      }
    });

    // Ordenar jugadores por puntos (descendente) y luego por rating
    const sortedPlayers = players.sort((a, b) => {
      const pointsA = playerPoints.get(a.id) || 0;
      const pointsB = playerPoints.get(b.id) || 0;
      
      if (pointsA !== pointsB) {
        return pointsB - pointsA;
      }
      return b.student_rating - a.student_rating;
    });

    // Generar emparejamientos para la siguiente ronda
    const pairings: TournamentPairing[] = [];
    
    for (let i = 0; i < sortedPlayers.length; i += 2) {
      const whitePlayer = sortedPlayers[i];
      const blackPlayer = sortedPlayers[i + 1];
      
      if (blackPlayer) {
        const pairing: TournamentPairing = {
          id: `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tournament_id: tournamentId,
          round_number: nextRoundNumber,
          board_number: Math.floor(i / 2) + 1,
          white_player_id: whitePlayer.id,
          black_player_id: blackPlayer.id,
          result: '*',
          white_points: 0,
          black_points: 0,
          is_bye: false
        };
        pairings.push(pairing);
      } else {
        // Bye para el último jugador si hay número impar
        const byePairing: TournamentPairing = {
          id: `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tournament_id: tournamentId,
          round_number: nextRoundNumber,
          board_number: Math.floor(i / 2) + 1,
          white_player_id: whitePlayer.id,
          black_player_id: '',
          result: '1-0', // Bye = victoria automática
          white_points: 1,
          black_points: 0,
          is_bye: true
        };
        pairings.push(byePairing);
      }
    }

    // Guardar emparejamientos en la base de datos
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_pairings'], 'readwrite');
      const store = transaction.objectStore('tournament_pairings');
      
      let completed = 0;
      const total = pairings.length;
      
      if (total === 0) {
        resolve(pairings);
        return;
      }
      
      
      pairings.forEach((pairing, index) => {
        const request = store.add(pairing);
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve(pairings);
          }
        };
        request.onerror = () => {
          console.error(`❌ Error saving pairing ${index + 1}:`, request.error);
          reject(request.error);
        };
      });
    });
  },

  // Obtener todos los emparejamientos de un torneo
  async getAllTournamentPairings(tournamentId: string): Promise<TournamentPairing[]> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournament_pairings'], 'readonly');
      const store = transaction.objectStore('tournament_pairings');
      const index = store.index('tournament_id');
      const request = index.getAll(tournamentId);
      
      request.onsuccess = () => {
        const result = request.result || [];
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Finalizar torneo
  async finishTournament(tournamentId: string): Promise<void> {
    const database = await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tournaments'], 'readwrite');
      const store = transaction.objectStore('tournaments');
      const request = store.get(tournamentId);
      
      request.onsuccess = () => {
        const tournament = request.result;
        if (!tournament) {
          reject(new Error('Torneo no encontrado'));
          return;
        }

        const updatedTournament = {
          ...tournament,
          status: 'completed',
          updated_at: new Date().toISOString()
        };

        const updateRequest = store.put(updatedTournament);
        updateRequest.onsuccess = () => {
          resolve();
        };
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Calcular nuevo rating ELO (algoritmo simplificado)
  calculateNewRating(playerRating: number, opponentRating: number, result: number, kFactor: number = 32): number {
    // result: 1 = victoria, 0.5 = tablas, 0 = derrota
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const ratingChange = Math.round(kFactor * (result - expectedScore));
    return playerRating + ratingChange;
  },

  // Actualizar ratings después de una ronda
  async updateRatingsAfterRound(tournamentId: string, roundNumber: number): Promise<void> {
    const database = await this.init();
    
    try {
      
      // Obtener emparejamientos de la ronda
      const roundPairings = await this.getRoundPairings(tournamentId, roundNumber);
      
      // Obtener jugadores del torneo
      const players = await this.getTournamentPlayers(tournamentId);
      
      // Crear mapa de ratings actuales
      const currentRatings = new Map<string, number>();
      players.forEach(player => {
        currentRatings.set(player.id, player.student_rating);
      });
      
      // Procesar cada emparejamiento
      for (const pairing of roundPairings) {
        if (pairing.result && pairing.result !== '*' && !pairing.is_bye) {
          const whitePlayerId = pairing.white_player_id;
          const blackPlayerId = pairing.black_player_id;
          
          const whiteRating = currentRatings.get(whitePlayerId) || 1200;
          const blackRating = currentRatings.get(blackPlayerId) || 1200;
          
          let whiteResult = 0;
          let blackResult = 0;
          
          switch (pairing.result) {
            case '1-0':
              whiteResult = 1;
              blackResult = 0;
              break;
            case '0-1':
              whiteResult = 0;
              blackResult = 1;
              break;
            case '1/2-1/2':
              whiteResult = 0.5;
              blackResult = 0.5;
              break;
          }
          
          // Calcular nuevos ratings
          const newWhiteRating = this.calculateNewRating(whiteRating, blackRating, whiteResult);
          const newBlackRating = this.calculateNewRating(blackRating, whiteRating, blackResult);
          
          // Actualizar ratings en el mapa
          currentRatings.set(whitePlayerId, newWhiteRating);
          currentRatings.set(blackPlayerId, newBlackRating);
          
        }
      }
      
      // Actualizar ratings en IndexedDB
      const transaction = database.transaction(['tournament_players'], 'readwrite');
      const store = transaction.objectStore('tournament_players');
      
      for (const [playerId, newRating] of currentRatings) {
        const player = players.find(p => p.id === playerId);
        if (player) {
          const updatedPlayer = {
            ...player,
            student_rating: newRating
          };
          
          await new Promise<void>((resolve, reject) => {
            const request = store.put(updatedPlayer);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }
      }
      
      
    } catch (error) {
      console.error('❌ Error updating ratings:', error);
      throw error;
    }
  },

  // Obtener historial de ratings de un jugador
  async getPlayerRatingHistory(playerId: string): Promise<{round: number, rating: number, change: number}[]> {
    // Esta función se puede implementar más adelante para mostrar gráficos
    // Por ahora retornamos un array vacío
    return [];
  }
};

// Initialize on client side
if (browser) {
  tournamentDB.init().then(() => {
    tournamentDB.loadTournaments();
  }).catch(console.error);
}
