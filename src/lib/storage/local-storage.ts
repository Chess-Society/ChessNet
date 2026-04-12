import localforage from 'localforage';
import type { 
  LocalTournament, 
  LocalTournamentPlayer, 
  LocalTournamentRound, 
  LocalTournamentPairing, 
  LocalTournamentComplete 
} from '$lib/types';

// Configure localforage instances with namespacing
const createStore = (name: string) => {
  return localforage.createInstance({
    name: 'ChessNet',
    storeName: name,
    version: 1.0,
    description: `ChessNet ${name} storage`
  });
};

// Storage instances for different data types
export const tournamentsStore = createStore('tournaments');
export const tournamentPlayersStore = createStore('tournament_players');
export const tournamentRoundsStore = createStore('tournament_rounds');
export const tournamentPairingsStore = createStore('tournament_pairings');

// Helper functions for namespacing by user_id
export const getUserKey = (userId: string, key: string): string => {
  return `user_${userId}:${key}`;
};

export const getUserCollegeKey = (userId: string, collegeId: string, key: string): string => {
  return `user_${userId}:college_${collegeId}:${key}`;
};

export const parseUserKey = (fullKey: string): { userId?: string; collegeId?: string; key: string } => {
  const parts = fullKey.split(':');
  
  if (parts.length === 2 && parts[0].startsWith('user_')) {
    return {
      userId: parts[0].replace('user_', ''),
      key: parts[1]
    };
  }
  
  if (parts.length === 3 && parts[0].startsWith('user_') && parts[1].startsWith('college_')) {
    return {
      userId: parts[0].replace('user_', ''),
      collegeId: parts[1].replace('college_', ''),
      key: parts[2]
    };
  }
  
  return { key: fullKey };
};

// TTL and cleanup utilities
export const isExpired = (item: { _expiresAt?: string }): boolean => {
  if (!item._expiresAt) return false;
  return new Date(item._expiresAt) < new Date();
};

export const setTTL = (item: any, ttlMs: number): any => {
  const expiresAt = new Date(Date.now() + ttlMs);
  return {
    ...item,
    _ttl: ttlMs,
    _expiresAt: expiresAt.toISOString()
  };
};

// Generic cleanup function
export const cleanupExpiredItems = async (store: LocalForage, userId: string): Promise<void> => {
  const keys = await store.keys();
  const userKeys = keys.filter(key => key.startsWith(`user_${userId}:`));
  
  for (const key of userKeys) {
    try {
      const item = await store.getItem(key);
      if (item && typeof item === 'object' && 'object' in item) {
        const data = item as any;
        if (isExpired(data)) {
          await store.removeItem(key);
          console.log(`Cleaned up expired item: ${key}`);
        }
      }
    } catch (error) {
      console.warn(`Error checking expiration for ${key}:`, error);
    }
  }
};

// Cleanup all expired items for a user
export const cleanupUserData = async (userId: string): Promise<void> => {
  await Promise.all([
    cleanupExpiredItems(tournamentsStore, userId),
    cleanupExpiredItems(tournamentPlayersStore, userId),
    cleanupExpiredItems(tournamentRoundsStore, userId),
    cleanupExpiredItems(tournamentPairingsStore, userId)
  ]);
};

// Get all keys for a user (optionally filtered by college)
export const getUserKeys = async (
  store: LocalForage, 
  userId: string, 
  collegeId?: string
): Promise<string[]> => {
  const keys = await store.keys();
  const prefix = collegeId ? `user_${userId}:college_${collegeId}:` : `user_${userId}:`;
  return keys.filter(key => key.startsWith(prefix));
};

// Storage utilities for tournaments
export class LocalTournamentStorage {
  private userId: string;
  
  constructor(userId: string) {
    this.userId = userId;
  }

  // Generate unique IDs
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getKey(id: string, collegeId?: string): string {
    return collegeId 
      ? getUserCollegeKey(this.userId, collegeId, id)
      : getUserKey(this.userId, id);
  }

  // Tournament CRUD operations
  async createTournament(tournament: Omit<LocalTournament, 'id' | 'createdAt' | 'updatedAt'>): Promise<LocalTournament> {
    const now = new Date().toISOString();
    const newTournament: LocalTournament = {
      ...tournament,
      id: this.generateId(),
      user_id: this.userId,
      createdAt: now,
      updatedAt: now
    };

    const key = this.getKey(newTournament.id, tournament.college_id);
    await tournamentsStore.setItem(key, newTournament);
    return newTournament;
  }

  async getTournament(id: string, collegeId?: string): Promise<LocalTournament | null> {
    const key = this.getKey(id, collegeId);
    const tournament = await tournamentsStore.getItem(key) as LocalTournament | null;
    
    if (tournament && isExpired(tournament)) {
      await this.deleteTournament(id, collegeId);
      return null;
    }
    
    return tournament;
  }

  async updateTournament(id: string, updates: Partial<LocalTournament>, collegeId?: string): Promise<LocalTournament | null> {
    const existing = await this.getTournament(id, collegeId);
    if (!existing) return null;

    const updated: LocalTournament = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      user_id: this.userId, // Ensure user_id doesn't change
      updatedAt: new Date().toISOString()
    };

    const key = this.getKey(id, collegeId);
    await tournamentsStore.setItem(key, updated);
    return updated;
  }

  async deleteTournament(id: string, collegeId?: string): Promise<void> {
    const key = this.getKey(id, collegeId);
    await tournamentsStore.removeItem(key);
    
    // Also delete related data
    await this.deleteTournamentPlayers(id, collegeId);
    await this.deleteTournamentRounds(id, collegeId);
    await this.deleteTournamentPairings(id, collegeId);
  }

  async getAllTournaments(collegeId?: string): Promise<LocalTournament[]> {
    const keys = await getUserKeys(tournamentsStore, this.userId, collegeId);
    const tournaments: LocalTournament[] = [];

    for (const key of keys) {
      const tournament = await tournamentsStore.getItem(key) as LocalTournament | null;
      if (tournament) {
        if (isExpired(tournament)) {
          await tournamentsStore.removeItem(key);
        } else {
          tournaments.push(tournament);
        }
      }
    }

    return tournaments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Tournament Players operations
  async addPlayer(player: Omit<LocalTournamentPlayer, 'id' | 'createdAt'>): Promise<LocalTournamentPlayer> {
    // Check for duplicates
    const existing = await this.getTournamentPlayers(player.tournament_id);
    if (existing.some(p => p.student_id === player.student_id)) {
      throw new Error('Student is already registered in this tournament');
    }

    const newPlayer: LocalTournamentPlayer = {
      ...player,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    const key = this.getKey(`${player.tournament_id}_player_${newPlayer.id}`);
    await tournamentPlayersStore.setItem(key, newPlayer);
    return newPlayer;
  }

  async getTournamentPlayers(tournamentId: string): Promise<LocalTournamentPlayer[]> {
    const keys = await getUserKeys(tournamentPlayersStore, this.userId);
    const players: LocalTournamentPlayer[] = [];

    for (const key of keys) {
      if (key.includes(`${tournamentId}_player_`)) {
        const player = await tournamentPlayersStore.getItem(key) as LocalTournamentPlayer | null;
        if (player) {
          players.push(player);
        }
      }
    }

    return players.sort((a, b) => a.student_name?.localeCompare(b.student_name || '') || 0);
  }

  async removePlayer(tournamentId: string, studentId: string): Promise<void> {
    const players = await this.getTournamentPlayers(tournamentId);
    const player = players.find(p => p.student_id === studentId);
    
    if (player) {
      const key = this.getKey(`${tournamentId}_player_${player.id}`);
      await tournamentPlayersStore.removeItem(key);
    }
  }

  async deleteTournamentPlayers(tournamentId: string, collegeId?: string): Promise<void> {
    const keys = await getUserKeys(tournamentPlayersStore, this.userId, collegeId);
    
    for (const key of keys) {
      if (key.includes(`${tournamentId}_player_`)) {
        await tournamentPlayersStore.removeItem(key);
      }
    }
  }

  // Tournament Rounds operations
  async createRound(round: Omit<LocalTournamentRound, 'id'>): Promise<LocalTournamentRound> {
    // Check for duplicate round numbers
    const existing = await this.getTournamentRounds(round.tournament_id);
    if (existing.some(r => r.round_no === round.round_no)) {
      throw new Error(`Round ${round.round_no} already exists`);
    }

    const newRound: LocalTournamentRound = {
      ...round,
      id: this.generateId()
    };

    const key = this.getKey(`${round.tournament_id}_round_${round.round_no}`);
    await tournamentRoundsStore.setItem(key, newRound);
    return newRound;
  }

  async getTournamentRounds(tournamentId: string): Promise<LocalTournamentRound[]> {
    const keys = await getUserKeys(tournamentRoundsStore, this.userId);
    const rounds: LocalTournamentRound[] = [];

    for (const key of keys) {
      if (key.includes(`${tournamentId}_round_`)) {
        const round = await tournamentRoundsStore.getItem(key) as LocalTournamentRound | null;
        if (round) {
          rounds.push(round);
        }
      }
    }

    return rounds.sort((a, b) => a.round_no - b.round_no);
  }

  async updateRound(tournamentId: string, roundNo: number, updates: Partial<LocalTournamentRound>): Promise<LocalTournamentRound | null> {
    const key = this.getKey(`${tournamentId}_round_${roundNo}`);
    const existing = await tournamentRoundsStore.getItem(key) as LocalTournamentRound | null;
    
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    await tournamentRoundsStore.setItem(key, updated);
    return updated;
  }

  async deleteTournamentRounds(tournamentId: string, collegeId?: string): Promise<void> {
    const keys = await getUserKeys(tournamentRoundsStore, this.userId, collegeId);
    
    for (const key of keys) {
      if (key.includes(`${tournamentId}_round_`)) {
        await tournamentRoundsStore.removeItem(key);
      }
    }
  }

  // Tournament Pairings operations
  async createPairing(pairing: Omit<LocalTournamentPairing, 'id' | 'updatedAt'>): Promise<LocalTournamentPairing> {
    // Check for duplicate board numbers in the same round
    const existing = await this.getRoundPairings(pairing.tournament_id, pairing.round_no);
    if (existing.some(p => p.board === pairing.board)) {
      throw new Error(`Board ${pairing.board} already exists in round ${pairing.round_no}`);
    }

    const newPairing: LocalTournamentPairing = {
      ...pairing,
      id: this.generateId(),
      updatedAt: new Date().toISOString()
    };

    const key = this.getKey(`${pairing.tournament_id}_round_${pairing.round_no}_board_${pairing.board}`);
    await tournamentPairingsStore.setItem(key, newPairing);
    return newPairing;
  }

  async getRoundPairings(tournamentId: string, roundNo: number): Promise<LocalTournamentPairing[]> {
    const keys = await getUserKeys(tournamentPairingsStore, this.userId);
    const pairings: LocalTournamentPairing[] = [];

    for (const key of keys) {
      if (key.includes(`${tournamentId}_round_${roundNo}_board_`)) {
        const pairing = await tournamentPairingsStore.getItem(key) as LocalTournamentPairing | null;
        if (pairing) {
          pairings.push(pairing);
        }
      }
    }

    return pairings.sort((a, b) => a.board - b.board);
  }

  async getTournamentPairings(tournamentId: string): Promise<LocalTournamentPairing[]> {
    const keys = await getUserKeys(tournamentPairingsStore, this.userId);
    const pairings: LocalTournamentPairing[] = [];

    for (const key of keys) {
      if (key.includes(`${tournamentId}_round_`) && key.includes('_board_')) {
        const pairing = await tournamentPairingsStore.getItem(key) as LocalTournamentPairing | null;
        if (pairing) {
          pairings.push(pairing);
        }
      }
    }

    return pairings.sort((a, b) => a.round_no - b.round_no || a.board - b.board);
  }

  async updatePairing(
    tournamentId: string, 
    roundNo: number, 
    board: number, 
    updates: Partial<LocalTournamentPairing>
  ): Promise<LocalTournamentPairing | null> {
    const key = this.getKey(`${tournamentId}_round_${roundNo}_board_${board}`);
    const existing = await tournamentPairingsStore.getItem(key) as LocalTournamentPairing | null;
    
    if (!existing) return null;

    const updated = { 
      ...existing, 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await tournamentPairingsStore.setItem(key, updated);
    return updated;
  }

  async deleteTournamentPairings(tournamentId: string, collegeId?: string): Promise<void> {
    const keys = await getUserKeys(tournamentPairingsStore, this.userId, collegeId);
    
    for (const key of keys) {
      if (key.includes(`${tournamentId}_round_`) && key.includes('_board_')) {
        await tournamentPairingsStore.removeItem(key);
      }
    }
  }

  // Complete tournament data (nested structure)
  async getTournamentComplete(tournamentId: string, collegeId?: string): Promise<LocalTournamentComplete | null> {
    const tournament = await this.getTournament(tournamentId, collegeId);
    if (!tournament) return null;

    const [players, rounds, pairings] = await Promise.all([
      this.getTournamentPlayers(tournamentId),
      this.getTournamentRounds(tournamentId),
      this.getTournamentPairings(tournamentId)
    ]);

    return {
      ...tournament,
      players,
      rounds,
      pairings
    };
  }

  // Cleanup
  async cleanup(): Promise<void> {
    await cleanupUserData(this.userId);
  }
}
