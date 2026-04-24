import { db } from "$lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  updateDoc, 
  runTransaction,
  serverTimestamp,
  increment
} from "firebase/firestore";
import type { PredictionMarket, PredictionBet } from "$lib/types/governance";

export const predictionApi = {
  /**
   * Crea un nuevo hito de pronóstico con liquidez inicial.
   */
  async createMarket(market: Omit<PredictionMarket, 'id' | 'totalPool' | 'createdAt' | 'status'>): Promise<string> {
    const LIQUIDITY_SEED = 50; // Nets iniciales por opción para estabilizar precio
    const marketData = {
      ...market,
      status: 'OPEN',
      totalPool: market.options.length * LIQUIDITY_SEED,
      createdAt: new Date().toISOString(),
      options: market.options.map(opt => ({ 
        ...opt, 
        totalStaked: LIQUIDITY_SEED,
        totalShares: LIQUIDITY_SEED // Inicialmente 1 share = 1 Net (Price 1.0/N_options)
      }))
    };
    const docRef = await addDoc(collection(db, "prediction_markets"), marketData);
    return docRef.id;
  },

  /**
   * Actualiza un hito existente.
   */
  async updateMarket(marketId: string, updates: Partial<PredictionMarket>): Promise<void> {
    const marketRef = doc(db, "prediction_markets", marketId);
    await updateDoc(marketRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Elimina un hito (Solo si no tiene apuestas o por administración forzada).
   */
  async deleteMarket(marketId: string): Promise<void> {
    const marketRef = doc(db, "prediction_markets", marketId);
    // Nota: En producción deberíamos verificar si hay apuestas activas
    // o usar una función de Cloud Functions para limpiar las apuestas asociadas.
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(marketRef);
  },

  /**
   * Realiza una compra de "acciones" en un mercado (Modelo AMM).
   */
  async placeBet(userId: string, marketId: string, optionId: string, amount: number): Promise<void> {
    const marketRef = doc(db, "prediction_markets", marketId);
    const userRef = doc(db, "users", userId);
    // ID Determinístico para la apuesta para permitir lectura transaccional sin Query
    const betId = `bet_${marketId}_${userId}_${optionId}`;
    const betRef = doc(db, "prediction_bets", betId);

    await runTransaction(db, async (transaction) => {
      const [marketSnap, userSnap, betSnap] = await Promise.all([
        transaction.get(marketRef),
        transaction.get(userRef),
        transaction.get(betRef)
      ]);

      if (!marketSnap.exists()) throw new Error("Hito no encontrado");
      if (!userSnap.exists()) throw new Error("Usuario no encontrado");

      const marketData = marketSnap.data() as PredictionMarket;
      const userData = userSnap.data();

      if (marketData.status !== 'OPEN') throw new Error("El hito no está abierto");
      if ((userData.economy?.netsBalance || 0) < amount) throw new Error("Nets insuficientes");

      // Calcular precio actual (basado en ratio de pool)
      const option = marketData.options.find(o => o.id === optionId);
      if (!option) throw new Error("Opción inválida");
      
      const currentPrice = (option.totalStaked || 1) / (marketData.totalPool || 1);
      const sharesToBuy = amount / currentPrice;

      // Actualizar opciones del mercado
      const updatedOptions = marketData.options.map(opt => {
        if (opt.id === optionId) {
          return { 
            ...opt, 
            totalStaked: (opt.totalStaked || 0) + amount,
            totalShares: (opt.totalShares || 0) + sharesToBuy
          };
        }
        return opt;
      });

      // Registrar o actualizar la posición del usuario
      if (betSnap.exists()) {
        const betData = betSnap.data();
        transaction.update(betRef, {
          amount: (betData.amount || 0) + amount,
          sharesOwned: (betData.sharesOwned || 0) + sharesToBuy,
          updatedAt: new Date().toISOString()
        });
      } else {
        transaction.set(betRef, {
          marketId,
          userId,
          optionId,
          amount,
          sharesOwned: sharesToBuy,
          createdAt: new Date().toISOString()
        });
      }

      // Actualizar balance del usuario
      transaction.update(userRef, {
        "economy.netsBalance": (userData.economy?.netsBalance || 0) - amount,
        "economy.lastEconomyUpdate": new Date().toISOString()
      });

      // Actualizar pool del mercado
      transaction.update(marketRef, {
        totalPool: (marketData.totalPool || 0) + amount,
        options: updatedOptions
      });
    });
  },

  /**
   * Vende una posición antes de que el mercado cierre.
   */
  async sellPosition(userId: string, marketId: string, optionId: string, sharesToSell: number): Promise<void> {
    const marketRef = doc(db, "prediction_markets", marketId);
    const userRef = doc(db, "users", userId);
    const betId = `bet_${marketId}_${userId}_${optionId}`;
    const betRef = doc(db, "prediction_bets", betId);

    await runTransaction(db, async (transaction) => {
      const [marketSnap, userSnap, betSnap] = await Promise.all([
        transaction.get(marketRef),
        transaction.get(userRef),
        transaction.get(betRef)
      ]);

      if (!betSnap.exists()) {
         // Fallback por si hay apuestas con ID antiguo (legacy)
         // Nota: En producción esto debería manejarse con una migración, 
         // pero por ahora lanzamos error para forzar consistencia.
         throw new Error("No tienes un pronóstico registrado con este ID transaccional");
      }
      
      const posData = betSnap.data();
      if ((posData.sharesOwned || 0) < sharesToSell) throw new Error("No tienes suficientes Nets comprometidos");
      
      const marketData = marketSnap.data() as PredictionMarket;
      if (marketData.status !== 'OPEN') throw new Error("Hito cerrado para cambios");

      // Calcular valor actual de venta
      const option = marketData.options.find(o => o.id === optionId);
      if (!option) throw new Error("Opción inválida");
      
      const currentPrice = (option.totalStaked || 1) / (marketData.totalPool || 1);
      const netsToReturn = sharesToSell * currentPrice;

      // Actualizar mercado
      const updatedOptions = marketData.options.map(opt => {
        if (opt.id === optionId) {
          return { 
            ...opt, 
            totalStaked: Math.max(1, (opt.totalStaked || 0) - netsToReturn),
            totalShares: Math.max(1, (opt.totalShares || 0) - sharesToSell)
          };
        }
        return opt;
      });

      // Actualizar posición del usuario
      if (posData.sharesOwned === sharesToSell) {
        transaction.delete(betRef);
      } else {
        transaction.update(betRef, {
          sharesOwned: posData.sharesOwned - sharesToSell,
          amount: Math.max(0, posData.amount - netsToReturn)
        });
      }

      // Actualizar usuario
      transaction.update(userRef, {
        "economy.netsBalance": (userSnap.data()?.economy?.netsBalance || 0) + netsToReturn,
        "economy.lastEconomyUpdate": new Date().toISOString()
      });

      transaction.update(marketRef, {
        totalPool: Math.max(1, (marketData.totalPool || 0) - netsToReturn),
        options: updatedOptions
      });
    });
  },

  /**
   * Propone un resultado para el hito (Fase Optimista).
   * El hito entra en estado PENDING para permitir disputas.
   */
  async proposeResolution(marketId: string, resultOptionId: string): Promise<void> {
    const marketRef = doc(db, "prediction_markets", marketId);
    await updateDoc(marketRef, {
      status: 'PENDING',
      resultOptionId,
      resolutionProposedAt: new Date().toISOString()
    });
  },

  /**
   * Disputa un resultado propuesto.
   */
  async disputeMarket(userId: string, marketId: string): Promise<void> {
    const marketRef = doc(db, "prediction_markets", marketId);
    
    await runTransaction(db, async (transaction) => {
      const marketSnap = await transaction.get(marketRef);
      if (!marketSnap.exists()) throw new Error("Hito no encontrado");
      
      const marketData = marketSnap.data() as PredictionMarket;
      if (marketData.status !== 'PENDING') throw new Error("No hay una resolución pendiente para disputar");

      const disputedBy = marketData.disputedBy || [];
      if (disputedBy.includes(userId)) throw new Error("Ya has disputado este hito");

      transaction.update(marketRef, {
        status: 'DISPUTED',
        disputedBy: [...disputedBy, userId]
      });
    });
  },

  /**
   * Finaliza y liquida un hito (después de la fase de disputa).
   */
  async finalizeMarket(marketId: string, resultOptionId: string): Promise<void> {
    const marketRef = doc(db, "prediction_markets", marketId);
    
    await runTransaction(db, async (transaction) => {
      const marketSnap = await transaction.get(marketRef);
      if (!marketSnap.exists()) throw new Error("Hito no encontrado");
      
      const marketData = marketSnap.data() as PredictionMarket;
      // Solo se puede finalizar si está PENDING, DISPUTED o OPEN (por un admin directo)
      if (marketData.status !== 'PENDING' && marketData.status !== 'DISPUTED' && marketData.status !== 'OPEN') {
        throw new Error("El hito no está en fase de finalización");
      }

      // Buscar todas las posiciones de este mercado
      const betsQuery = query(
        collection(db, "prediction_bets"), 
        where("marketId", "==", marketId)
      );
      const betsSnap = await getDocs(betsQuery);
      
      if (betsSnap.size > 150) {
        throw new Error(`El mercado tiene demasiadas apuestas (${betsSnap.size}) para ser procesado automáticamente. Contacte con soporte técnico.`);
      }
      
      // Liquidar a los ganadores (1 Net por acción)
      for (const betDoc of betsSnap.docs) {
        const bet = betDoc.data();
        if (bet.optionId === resultOptionId) {
          const payout = Math.floor(bet.sharesOwned || 0);
          
          if (payout > 0) {
            const winnerRef = doc(db, "users", bet.userId);
            transaction.update(winnerRef, {
              "economy.netsBalance": increment(payout),
              "economy.lastEconomyUpdate": new Date().toISOString()
            });

              // Registrar transacción
              const transRef = doc(collection(db, "nets_transactions"));
              transaction.set(transRef, {
                userId: bet.userId,
                amount: payout,
                type: 'EARN',
                reason: `Liquidación: ${marketData.question}`,
                createdAt: new Date().toISOString()
              });
            }
          }
          transaction.delete(betDoc.ref);
        }

        // Cerrar definitivamente
        transaction.update(marketRef, {
        status: 'RESOLVED',
        resultOptionId,
        resolvedAt: new Date().toISOString()
      });
    });
  },
  
  /**
   * Alias para finalizar un hito directamente (una sola acción administrativa).
   */
  async resolveMarket(marketId: string, resultOptionId: string): Promise<void> {
    return this.finalizeMarket(marketId, resultOptionId);
  },

  /**
   * Obtiene los hitos. Soporta segmentación por escuela.
   */
  async getMarkets(schoolId?: string) {
    let q;
    if (schoolId && schoolId !== 'ALL') {
      q = query(
        collection(db, "prediction_markets"),
        where("schoolId", "==", schoolId),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "prediction_markets"),
        orderBy("createdAt", "desc")
      );
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as PredictionMarket[];
  },

  /**
   * Worker logic: Auto-resuelve hitos basados en Oráculos.
   */
  async autoResolveAll(schoolId?: string): Promise<{ resolved: number }> {
    const q = schoolId && schoolId !== 'ALL' 
      ? query(collection(db, "prediction_markets"), where("schoolId", "==", schoolId), where("status", "==", "OPEN"))
      : query(collection(db, "prediction_markets"), where("status", "==", "OPEN"));
      
    const snap = await getDocs(q);
    const markets = snap.docs.map(d => ({ id: d.id, ...d.data() })) as PredictionMarket[];
    const oracleMarkets = markets.filter(m => m.oracleType === 'LICHESS');
    
    let resolvedCount = 0;
    for (const m of oracleMarkets) {
      const tournamentId = m.oracleConfig?.tournamentId || m.oracleConfig?.externalId;
      if (!tournamentId) continue;
      
      try {
        // Importación dinámica para evitar problemas en SSR si fuera necesario
        const { lichessApi } = await import("./lichess");
        const broadcast = await lichessApi.getBroadcast(tournamentId);
        const rounds = broadcast.rounds || [];
        const roundId = m.oracleConfig?.roundId;
        const targetRound = roundId ? rounds.find((r: any) => r.id === roundId) : null;
        const isFinished = targetRound ? targetRound.finished : rounds.some((r: any) => r.finished);

        if (isFinished) {
          await this.resolveMarket(m.id, 'yes');
          resolvedCount++;
        }
      } catch (e) {
        console.error(`[OracleWorker] Error resolving market ${m.id}:`, e);
      }
    }
    return { resolved: resolvedCount };
  }
};
