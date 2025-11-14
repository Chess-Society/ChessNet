import { w as writable } from "./index.js";
const tournaments = writable([]);
let db = null;
const initDB = async () => {
  {
    throw new Error("IndexedDB not available in server environment");
  }
};
const tournamentDB = {
  async init() {
    if (!db) {
      db = await initDB();
    }
    return db;
  },
  async createTournament(tournament) {
    const database = await this.init();
    const newTournament = {
      ...tournament,
      id: `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournaments"], "readwrite");
      const store = transaction.objectStore("tournaments");
      const request = store.add(newTournament);
      request.onsuccess = () => {
        console.log("✅ Tournament created:", newTournament.id);
        this.loadTournaments();
        resolve(newTournament);
      };
      request.onerror = () => reject(request.error);
    });
  },
  async getTournament(id) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournaments"], "readonly");
      const store = transaction.objectStore("tournaments");
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },
  async updateTournament(id, updates) {
    const database = await this.init();
    const existing = await this.getTournament(id);
    if (!existing) {
      throw new Error(`Tournament ${id} not found`);
    }
    const updated = {
      ...existing,
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournaments"], "readwrite");
      const store = transaction.objectStore("tournaments");
      const request = store.put(updated);
      request.onsuccess = () => {
        console.log("✅ Tournament updated:", id);
        this.loadTournaments();
        resolve(updated);
      };
      request.onerror = () => reject(request.error);
    });
  },
  async deleteTournament(id) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournaments", "tournament_players", "tournament_rounds", "tournament_pairings"], "readwrite");
      transaction.objectStore("tournaments").delete(id);
      const playersIndex = transaction.objectStore("tournament_players").index("tournament_id");
      playersIndex.openCursor(IDBKeyRange.only(id)).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      const roundsIndex = transaction.objectStore("tournament_rounds").index("tournament_id");
      roundsIndex.openCursor(IDBKeyRange.only(id)).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      const pairingsIndex = transaction.objectStore("tournament_pairings").index("tournament_id");
      pairingsIndex.openCursor(IDBKeyRange.only(id)).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      transaction.oncomplete = () => {
        console.log("✅ Tournament deleted:", id);
        this.loadTournaments();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  },
  async loadTournaments() {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournaments"], "readonly");
      const store = transaction.objectStore("tournaments");
      const request = store.getAll();
      request.onsuccess = () => {
        const result = request.result || [];
        tournaments.set(result);
        console.log(`📊 Loaded ${result.length} tournaments from IndexedDB`);
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  },
  // Tournament Players operations
  async registerPlayer(player) {
    const database = await this.init();
    const newPlayer = {
      ...player,
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registration_date: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_players"], "readwrite");
      const store = transaction.objectStore("tournament_players");
      const request = store.add(newPlayer);
      request.onsuccess = () => {
        console.log("✅ Player registered:", newPlayer.student_name);
        resolve(newPlayer);
      };
      request.onerror = () => reject(request.error);
    });
  },
  async getTournamentPlayers(tournamentId) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_players"], "readonly");
      const store = transaction.objectStore("tournament_players");
      const index = store.index("tournament_id");
      const request = index.getAll(tournamentId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },
  // Generar emparejamientos para la primera ronda
  async generateFirstRoundPairings(tournamentId) {
    const database = await this.init();
    const players = await this.getTournamentPlayers(tournamentId);
    if (players.length < 2) {
      throw new Error("Se necesitan al menos 2 jugadores para generar emparejamientos");
    }
    const sortedPlayers = players.sort((a, b) => b.student_rating - a.student_rating);
    const pairings = [];
    const roundNumber = 1;
    await this.createRound(tournamentId, roundNumber);
    for (let i = 0; i < sortedPlayers.length; i += 2) {
      const whitePlayer = sortedPlayers[i];
      const blackPlayer = sortedPlayers[i + 1];
      if (blackPlayer) {
        const pairing = {
          id: `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tournament_id: tournamentId,
          round_number: roundNumber,
          board_number: Math.floor(i / 2) + 1,
          white_player_id: whitePlayer.id,
          black_player_id: blackPlayer.id,
          result: "*",
          white_points: 0,
          black_points: 0,
          is_bye: false
        };
        pairings.push(pairing);
      } else {
        const byePairing = {
          id: `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tournament_id: tournamentId,
          round_number: roundNumber,
          board_number: Math.floor(i / 2) + 1,
          white_player_id: whitePlayer.id,
          black_player_id: "",
          result: "1-0",
          // Bye = victoria automática
          white_points: 1,
          black_points: 0,
          is_bye: true
        };
        pairings.push(byePairing);
      }
    }
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_pairings"], "readwrite");
      const store = transaction.objectStore("tournament_pairings");
      let completed = 0;
      const total = pairings.length;
      if (total === 0) {
        resolve(pairings);
        return;
      }
      pairings.forEach((pairing) => {
        const request = store.add(pairing);
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            console.log(`✅ Generated ${total} pairings for round ${roundNumber}`);
            resolve(pairings);
          }
        };
        request.onerror = () => reject(request.error);
      });
    });
  },
  // Crear una ronda
  async createRound(tournamentId, roundNumber) {
    const database = await this.init();
    const newRound = {
      id: `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tournament_id: tournamentId,
      round_number: roundNumber,
      status: "not_started",
      start_time: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_rounds"], "readwrite");
      const store = transaction.objectStore("tournament_rounds");
      const request = store.add(newRound);
      request.onsuccess = () => {
        console.log(`✅ Round ${roundNumber} created for tournament ${tournamentId}`);
        resolve(newRound);
      };
      request.onerror = () => reject(request.error);
    });
  },
  // Obtener emparejamientos de una ronda
  async getRoundPairings(tournamentId, roundNumber) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_pairings"], "readonly");
      const store = transaction.objectStore("tournament_pairings");
      const index = store.index("tournament_round_board");
      const request = index.getAll(IDBKeyRange.bound([tournamentId, roundNumber, 0], [tournamentId, roundNumber, 999]));
      request.onsuccess = () => {
        const result = request.result || [];
        result.sort((a, b) => a.board_number - b.board_number);
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  },
  // Actualizar resultado de un emparejamiento
  async updatePairingResult(pairingId, result) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_pairings"], "readwrite");
      const store = transaction.objectStore("tournament_pairings");
      const request = store.get(pairingId);
      request.onsuccess = () => {
        const pairing = request.result;
        if (!pairing) {
          reject(new Error("Emparejamiento no encontrado"));
          return;
        }
        let whitePoints = 0;
        let blackPoints = 0;
        switch (result) {
          case "1-0":
            whitePoints = 1;
            blackPoints = 0;
            break;
          case "0-1":
            whitePoints = 0;
            blackPoints = 1;
            break;
          case "1/2-1/2":
            whitePoints = 0.5;
            blackPoints = 0.5;
            break;
        }
        const updatedPairing = {
          ...pairing,
          result,
          white_points: whitePoints,
          black_points: blackPoints
        };
        const updateRequest = store.put(updatedPairing);
        updateRequest.onsuccess = () => {
          console.log("✅ Pairing result updated:", pairingId, result);
          resolve();
        };
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  },
  // Finalizar una ronda
  async finishRound(tournamentId, roundNumber) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_rounds"], "readwrite");
      const store = transaction.objectStore("tournament_rounds");
      const index = store.index("tournament_round");
      const request = index.get([tournamentId, roundNumber]);
      request.onsuccess = () => {
        const round = request.result;
        if (!round) {
          console.error(`❌ Round ${roundNumber} not found for tournament ${tournamentId}`);
          reject(new Error(`Ronda ${roundNumber} no encontrada para el torneo ${tournamentId}`));
          return;
        }
        console.log(`🔄 Finishing round ${roundNumber} for tournament ${tournamentId}`);
        const updatedRound = {
          ...round,
          status: "completed",
          end_time: (/* @__PURE__ */ new Date()).toISOString()
        };
        const updateRequest = store.put(updatedRound);
        updateRequest.onsuccess = () => {
          console.log(`✅ Round ${roundNumber} finished successfully`);
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
  async generateNextRound(tournamentId) {
    const database = await this.init();
    const players = await this.getTournamentPlayers(tournamentId);
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }
    const nextRoundNumber = tournament.current_round + 1;
    console.log(`🔄 Generating round ${nextRoundNumber} for tournament ${tournamentId}`);
    await this.createRound(tournamentId, nextRoundNumber);
    const allPairings = await this.getAllTournamentPairings(tournamentId);
    const playerPoints = /* @__PURE__ */ new Map();
    players.forEach((player) => {
      playerPoints.set(player.id, 0);
    });
    allPairings.forEach((pairing) => {
      if (pairing.result && pairing.result !== "*") {
        const whitePoints = playerPoints.get(pairing.white_player_id) || 0;
        const blackPoints = playerPoints.get(pairing.black_player_id) || 0;
        playerPoints.set(pairing.white_player_id, whitePoints + (pairing.white_points || 0));
        playerPoints.set(pairing.black_player_id, blackPoints + (pairing.black_points || 0));
      }
    });
    const sortedPlayers = players.sort((a, b) => {
      const pointsA = playerPoints.get(a.id) || 0;
      const pointsB = playerPoints.get(b.id) || 0;
      if (pointsA !== pointsB) {
        return pointsB - pointsA;
      }
      return b.student_rating - a.student_rating;
    });
    const pairings = [];
    for (let i = 0; i < sortedPlayers.length; i += 2) {
      const whitePlayer = sortedPlayers[i];
      const blackPlayer = sortedPlayers[i + 1];
      if (blackPlayer) {
        const pairing = {
          id: `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tournament_id: tournamentId,
          round_number: nextRoundNumber,
          board_number: Math.floor(i / 2) + 1,
          white_player_id: whitePlayer.id,
          black_player_id: blackPlayer.id,
          result: "*",
          white_points: 0,
          black_points: 0,
          is_bye: false
        };
        pairings.push(pairing);
      } else {
        const byePairing = {
          id: `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tournament_id: tournamentId,
          round_number: nextRoundNumber,
          board_number: Math.floor(i / 2) + 1,
          white_player_id: whitePlayer.id,
          black_player_id: "",
          result: "1-0",
          // Bye = victoria automática
          white_points: 1,
          black_points: 0,
          is_bye: true
        };
        pairings.push(byePairing);
      }
    }
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_pairings"], "readwrite");
      const store = transaction.objectStore("tournament_pairings");
      let completed = 0;
      const total = pairings.length;
      if (total === 0) {
        console.log(`⚠️ No pairings to generate for round ${nextRoundNumber}`);
        resolve(pairings);
        return;
      }
      console.log(`💾 Saving ${total} pairings to IndexedDB for round ${nextRoundNumber}`);
      pairings.forEach((pairing, index) => {
        const request = store.add(pairing);
        request.onsuccess = () => {
          completed++;
          console.log(`✅ Saved pairing ${index + 1}/${total} for round ${nextRoundNumber}`);
          if (completed === total) {
            console.log(`🎉 All ${total} pairings saved for round ${nextRoundNumber}`);
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
  async getAllTournamentPairings(tournamentId) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournament_pairings"], "readonly");
      const store = transaction.objectStore("tournament_pairings");
      const index = store.index("tournament_id");
      const request = index.getAll(tournamentId);
      request.onsuccess = () => {
        const result = request.result || [];
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  },
  // Finalizar torneo
  async finishTournament(tournamentId) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(["tournaments"], "readwrite");
      const store = transaction.objectStore("tournaments");
      const request = store.get(tournamentId);
      request.onsuccess = () => {
        const tournament = request.result;
        if (!tournament) {
          reject(new Error("Torneo no encontrado"));
          return;
        }
        const updatedTournament = {
          ...tournament,
          status: "completed",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        const updateRequest = store.put(updatedTournament);
        updateRequest.onsuccess = () => {
          console.log("✅ Tournament finished:", tournamentId);
          resolve();
        };
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  },
  // Calcular nuevo rating ELO (algoritmo simplificado)
  calculateNewRating(playerRating, opponentRating, result, kFactor = 32) {
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const ratingChange = Math.round(kFactor * (result - expectedScore));
    return playerRating + ratingChange;
  },
  // Actualizar ratings después de una ronda
  async updateRatingsAfterRound(tournamentId, roundNumber) {
    const database = await this.init();
    try {
      console.log(`🔄 Updating ratings after round ${roundNumber} for tournament ${tournamentId}`);
      const roundPairings = await this.getRoundPairings(tournamentId, roundNumber);
      const players = await this.getTournamentPlayers(tournamentId);
      const currentRatings = /* @__PURE__ */ new Map();
      players.forEach((player) => {
        currentRatings.set(player.id, player.student_rating);
      });
      for (const pairing of roundPairings) {
        if (pairing.result && pairing.result !== "*" && !pairing.is_bye) {
          const whitePlayerId = pairing.white_player_id;
          const blackPlayerId = pairing.black_player_id;
          const whiteRating = currentRatings.get(whitePlayerId) || 1200;
          const blackRating = currentRatings.get(blackPlayerId) || 1200;
          let whiteResult = 0;
          let blackResult = 0;
          switch (pairing.result) {
            case "1-0":
              whiteResult = 1;
              blackResult = 0;
              break;
            case "0-1":
              whiteResult = 0;
              blackResult = 1;
              break;
            case "1/2-1/2":
              whiteResult = 0.5;
              blackResult = 0.5;
              break;
          }
          const newWhiteRating = this.calculateNewRating(whiteRating, blackRating, whiteResult);
          const newBlackRating = this.calculateNewRating(blackRating, whiteRating, blackResult);
          currentRatings.set(whitePlayerId, newWhiteRating);
          currentRatings.set(blackPlayerId, newBlackRating);
          console.log(`📊 Rating update: ${whitePlayerId} ${whiteRating} → ${newWhiteRating} (${whiteResult === 1 ? "W" : whiteResult === 0.5 ? "D" : "L"})`);
          console.log(`📊 Rating update: ${blackPlayerId} ${blackRating} → ${newBlackRating} (${blackResult === 1 ? "W" : blackResult === 0.5 ? "D" : "L"})`);
        }
      }
      const transaction = database.transaction(["tournament_players"], "readwrite");
      const store = transaction.objectStore("tournament_players");
      for (const [playerId, newRating] of currentRatings) {
        const player = players.find((p) => p.id === playerId);
        if (player) {
          const updatedPlayer = {
            ...player,
            student_rating: newRating
          };
          await new Promise((resolve, reject) => {
            const request = store.put(updatedPlayer);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }
      }
      console.log(`✅ Ratings updated for round ${roundNumber}`);
    } catch (error) {
      console.error("❌ Error updating ratings:", error);
      throw error;
    }
  },
  // Obtener historial de ratings de un jugador
  async getPlayerRatingHistory(playerId) {
    return [];
  }
};
export {
  tournamentDB,
  tournaments
};
