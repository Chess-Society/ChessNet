import { db, auth, toData } from "$lib/firebase";
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
  serverTimestamp
} from "firebase/firestore";
import type {
  Tournament,
  TournamentParticipant,
  TournamentMatch,
  Student
} from "$lib/types";

export const tournamentsApi = {
  // Get all tournaments for the current user
  async getMyTournaments(userId?: string): Promise<Tournament[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "local_tournaments"),
      where("owner_id", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Tournament>(doc));
  },

  // Get tournaments by school
  async getTournamentsBySchool(schoolId: string): Promise<Tournament[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "local_tournaments"),
      where("owner_id", "==", uid),
      where("schoolId", "==", schoolId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Tournament>(doc));
  },

  // Get a specific tournament
  async getTournament(id: string): Promise<Tournament> {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const docRef = doc(db, "local_tournaments", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Tournament not found");
    
    const tournament = toData<Tournament>(docSnap);
    if (tournament.ownerId !== uid) throw new Error("Access denied");
    
    return tournament;
  },

  // Create a new tournament
  async createTournament(
    schoolId: string,
    name: string,
    description?: string,
    type: "swiss" | "round_robin" | "elimination" | "team" = "swiss",
    startDate?: string,
    endDate?: string,
    maxParticipants?: number,
    timeControl?: string,
    userId?: string
  ): Promise<Tournament> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    
    const docData = {
      owner_id: uid,
      schoolId,
      name,
      description: description || "",
      type,
      startDate: startDate || null,
      endDate: endDate || null,
      maxParticipants: maxParticipants || null,
      timeControl: timeControl || "",
      createdBy: uid,
      status: "planned",
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "local_tournaments"), docData);
    const docSnap = await getDoc(docRef);
    return toData<Tournament>(docSnap);
  },

  // Update a tournament
  async updateTournament(
    id: string,
    updates: Partial<Tournament>,
  ): Promise<Tournament> {
    const docRef = doc(db, "local_tournaments", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    const docSnap = await getDoc(docRef);
    return toData<Tournament>(docSnap);
  },

  // Delete a tournament
  async deleteTournament(id: string): Promise<void> {
    const docRef = doc(db, "local_tournaments", id);
    await deleteDoc(docRef);
  },

  // Start a tournament
  async startTournament(id: string): Promise<void> {
    const docRef = doc(db, "local_tournaments", id);
    await updateDoc(docRef, {
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
    });
  },

  // Complete a tournament
  async completeTournament(id: string): Promise<void> {
    const docRef = doc(db, "local_tournaments", id);
    await updateDoc(docRef, {
      status: "completed",
      endDate: new Date().toISOString().split("T")[0],
    });
  },

  // Get tournament participants (con students incrustados para compatibilidad)
  async getTournamentParticipants(
    tournamentId: string,
  ): Promise<TournamentParticipant[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "tournament_participants"),
      where("owner_id", "==", uid),
      where("tournamentId", "==", tournamentId),
      orderBy("score", "desc")
    );
    const querySnapshot = await getDocs(q);
    const participants = querySnapshot.docs.map(doc => toData<TournamentParticipant>(doc));
    
    // FETCH STUDENTS (Equivalent to join)
    for (const p of participants) {
      if (p.studentId) {
        const studentDoc = await getDoc(doc(db, "students", p.studentId));
        if (studentDoc.exists()) {
          p.students = toData<Student>(studentDoc);
        }
      }
    }

    return participants;
  },

  // Add participant to tournament
  async addParticipant(
    tournamentId: string,
    studentId: string,
    rating?: number,
  ): Promise<TournamentParticipant> {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const docData = {
      owner_id: uid,
      tournamentId,
      studentId,
      rating: rating || 1200,
      score: 0,
      tiebreakScore: 0,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "tournament_participants"), docData);
    const docSnap = await getDoc(docRef);
    return toData<TournamentParticipant>(docSnap);
  },

  // Remove participant from tournament
  async removeParticipant(participantId: string): Promise<void> {
    const docRef = doc(db, "tournament_participants", participantId);
    await deleteDoc(docRef);
  },

  // Update participant score
  async updateParticipantScore(
    participantId: string,
    score: number,
    tiebreakScore?: number,
  ): Promise<TournamentParticipant> {
    const docRef = doc(db, "tournament_participants", participantId);
    await updateDoc(docRef, {
      score,
      tiebreakScore: tiebreakScore || 0,
    });
    const docSnap = await getDoc(docRef);
    return toData<TournamentParticipant>(docSnap);
  },

  // Get tournament matches
  async getTournamentMatches(
    tournamentId: string,
    round?: number,
  ): Promise<TournamentMatch[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    let q = query(
      collection(db, "tournament_matches"),
      where("owner_id", "==", uid),
      where("tournamentId", "==", tournamentId)
    );

    if (round !== undefined) {
      q = query(q, where("round", "==", round));
    }

    const querySnapshot = await getDocs(q);
    let matches = querySnapshot.docs.map(doc => toData<TournamentMatch>(doc));
    
    matches.sort((a, b) => {
      if (a.round !== b.round) return a.round - b.round;
      return (a.boardNumber || 0) - (b.boardNumber || 0);
    });

    // Populate players (joins)
    for (const m of matches) {
      if (m.player1Id) {
        const p1Doc = await getDoc(doc(db, "students", m.player1Id));
        if (p1Doc.exists()) m.player1 = toData<Student>(p1Doc);
      }
      if (m.player2Id) {
        const p2Doc = await getDoc(doc(db, "students", m.player2Id));
        if (p2Doc.exists()) m.player2 = toData<Student>(p2Doc);
      }
    }

    return matches;
  },

  // Create tournament matches
  async createTournamentMatches(
    tournamentId: string,
    matches: Omit<TournamentMatch, "id" | "tournamentId" | "createdAt">[],
  ): Promise<TournamentMatch[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const createdMatches: TournamentMatch[] = [];
    
    for (const match of matches) {
      const docData = {
        ...match,
        owner_id: uid,
        tournamentId,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "tournament_matches"), docData);
      const docSnap = await getDoc(docRef);
      createdMatches.push(toData<TournamentMatch>(docSnap));
    }

    return createdMatches;
  },

  // Update match result
  async updateMatchResult(
    matchId: string,
    result: "1-0" | "0-1" | "1/2-1/2" | "bye" | "forfeit",
    moves?: string[],
    gameDurationSeconds?: number,
  ): Promise<TournamentMatch> {
    const docRef = doc(db, "tournament_matches", matchId);
    await updateDoc(docRef, {
      result,
      moves: moves || [],
      gameDurationSeconds: gameDurationSeconds || 0,
      playedAt: new Date().toISOString(),
    });
    const docSnap = await getDoc(docRef);
    return toData<TournamentMatch>(docSnap);
  },

  // Import predefined tournament templates
  async importPredefinedTournaments(schoolId: string): Promise<void> {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const { PREDEFINED_TOURNAMENTS } = await import("$lib/constants/predefined-content");

    for (const template of PREDEFINED_TOURNAMENTS) {
      // Check if tournament with this name already exists for this school
      const existing = await this.getTournamentsBySchool(schoolId);
      if (!existing.some(t => t.name === template.name)) {
        await this.createTournament(
          schoolId,
          template.name,
          template.description,
          template.format.toLowerCase().includes("suizo") ? "swiss" : "round_robin",
          undefined,
          undefined,
          template.max_players,
          template.time_control
        );
      }
    }
  }
};
