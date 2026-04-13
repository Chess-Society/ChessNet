import { db, auth, toData, getUserPath } from "$lib/firebase";
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
  serverTimestamp,
  type DocumentData
} from "firebase/firestore";
import type {
  Tournament,
  TournamentParticipant,
  TournamentMatch,
  Student
} from "$lib/types";

export const tournamentsApi = {
  // Get all tournaments for the current user (or specified user)
  async getMyTournaments(userId?: string): Promise<Tournament[]> {
    const q = query(
      collection(db, getUserPath(userId), "tournaments"),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Tournament>(doc));
  },

  // Get tournaments by school
  async getTournamentsBySchool(schoolId: string): Promise<Tournament[]> {
    const q = query(
      collection(db, getUserPath(), "tournaments"),
      where("school_id", "==", schoolId),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Tournament>(doc));
  },

  // Get a specific tournament
  async getTournament(id: string): Promise<Tournament> {
    const docRef = doc(db, getUserPath(), "tournaments", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Tournament not found");
    return toData<Tournament>(docSnap);
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
    const userPath = getUserPath(userId);
    
    const docData = {
      school_id: schoolId,
      name,
      description: description || "",
      type,
      start_date: startDate || null,
      end_date: endDate || null,
      max_participants: maxParticipants || null,
      time_control: timeControl || "",
      created_by: auth.currentUser?.uid,
      status: "planned",
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, userPath, "tournaments"), docData);
    const docSnap = await getDoc(docRef);
    return toData<Tournament>(docSnap);
  },

  // Update a tournament
  async updateTournament(
    id: string,
    updates: Partial<Tournament>,
  ): Promise<Tournament> {
    const docRef = doc(db, getUserPath(), "tournaments", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString()
    });
    const docSnap = await getDoc(docRef);
    return toData<Tournament>(docSnap);
  },

  // Delete a tournament
  async deleteTournament(id: string): Promise<void> {
    const docRef = doc(db, getUserPath(), "tournaments", id);
    await deleteDoc(docRef);
  },

  // Start a tournament
  async startTournament(id: string): Promise<void> {
    const docRef = doc(db, getUserPath(), "tournaments", id);
    await updateDoc(docRef, {
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
    });
  },

  // Complete a tournament
  async completeTournament(id: string): Promise<void> {
    const docRef = doc(db, getUserPath(), "tournaments", id);
    await updateDoc(docRef, {
      status: "completed",
      end_date: new Date().toISOString().split("T")[0],
    });
  },

  // Get tournament participants (con students incrustados para compatibilidad)
  async getTournamentParticipants(
    tournamentId: string,
  ): Promise<TournamentParticipant[]> {
    const userPath = getUserPath();
    const q = query(
      collection(db, userPath, "tournament_participants"),
      where("tournament_id", "==", tournamentId),
      orderBy("score", "desc")
    );
    const querySnapshot = await getDocs(q);
    const participants = querySnapshot.docs.map(doc => toData<TournamentParticipant>(doc));
    
    // FETCH STUDENTS (Equivalent to join)
    for (const p of participants) {
      if (p.student_id) {
        const studentDoc = await getDoc(doc(db, userPath, "students", p.student_id));
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
    const userPath = getUserPath();
    const docData = {
      tournament_id: tournamentId,
      student_id: studentId,
      rating: rating || 1200,
      score: 0,
      tiebreak_score: 0,
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, userPath, "tournament_participants"), docData);
    const docSnap = await getDoc(docRef);
    return toData<TournamentParticipant>(docSnap);
  },

  // Remove participant from tournament
  async removeParticipant(participantId: string): Promise<void> {
    const docRef = doc(db, getUserPath(), "tournament_participants", participantId);
    await deleteDoc(docRef);
  },

  // Update participant score
  async updateParticipantScore(
    participantId: string,
    score: number,
    tiebreakScore?: number,
  ): Promise<TournamentParticipant> {
    const docRef = doc(db, getUserPath(), "tournament_participants", participantId);
    await updateDoc(docRef, {
      score,
      tiebreak_score: tiebreakScore || 0,
    });
    const docSnap = await getDoc(docRef);
    return toData<TournamentParticipant>(docSnap);
  },

  // Get tournament matches
  async getTournamentMatches(
    tournamentId: string,
    round?: number,
  ): Promise<TournamentMatch[]> {
    const userPath = getUserPath();
    let q = query(
      collection(db, userPath, "tournament_matches"),
      where("tournament_id", "==", tournamentId)
    );

    if (round !== undefined) {
      q = query(q, where("round", "==", round));
    }

    const querySnapshot = await getDocs(q);
    let matches = querySnapshot.docs.map(doc => toData<TournamentMatch>(doc));
    
    matches.sort((a, b) => {
      if (a.round !== b.round) return a.round - b.round;
      return (a.board_number || 0) - (b.board_number || 0);
    });

    // Populate players (joins)
    for (const m of matches) {
      if (m.player1_id) {
        const p1Doc = await getDoc(doc(db, userPath, "students", m.player1_id));
        if (p1Doc.exists()) m.player1 = toData<Student>(p1Doc);
      }
      if (m.player2_id) {
        const p2Doc = await getDoc(doc(db, userPath, "students", m.player2_id));
        if (p2Doc.exists()) m.player2 = toData<Student>(p2Doc);
      }
    }

    return matches;
  },

  // Create tournament matches
  async createTournamentMatches(
    tournamentId: string,
    matches: Omit<TournamentMatch, "id" | "tournament_id" | "created_at">[],
  ): Promise<TournamentMatch[]> {
    const userPath = getUserPath();
    const createdMatches: TournamentMatch[] = [];
    
    for (const match of matches) {
      const docData = {
        ...match,
        tournament_id: tournamentId,
        created_at: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, userPath, "tournament_matches"), docData);
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
    const docRef = doc(db, getUserPath(), "tournament_matches", matchId);
    await updateDoc(docRef, {
      result,
      moves: moves || [],
      game_duration_seconds: gameDurationSeconds || 0,
      played_at: new Date().toISOString(),
    });
    const docSnap = await getDoc(docRef);
    return toData<TournamentMatch>(docSnap);
  },
};
