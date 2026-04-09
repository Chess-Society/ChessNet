import { d as db, a as auth } from "./firebase.js";
import { doc, updateDoc, getDoc, addDoc, collection, query, where, getDocs, deleteDoc, orderBy } from "firebase/firestore";
const toData = (doc2) => {
  return { id: doc2.id, ...doc2.data() };
};
const tournamentsApi = {
  // Get all tournaments for the current user (or specified user)
  async getMyTournaments(userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "tournaments"),
      where("user_id", "==", uid),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc2) => toData(doc2));
  },
  // Get tournaments by school
  async getTournamentsBySchool(schoolId) {
    const q = query(
      collection(db, "tournaments"),
      where("school_id", "==", schoolId),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc2) => toData(doc2));
  },
  // Get a specific tournament
  async getTournament(id) {
    const docRef = doc(db, "tournaments", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Tournament not found");
    return toData(docSnap);
  },
  // Create a new tournament
  async createTournament(schoolId, name, description, type = "swiss", startDate, endDate, maxParticipants, timeControl, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const docData = {
      school_id: schoolId,
      user_id: uid,
      // Use user_id as in other collections
      name,
      description: description || "",
      type,
      start_date: startDate || null,
      end_date: endDate || null,
      max_participants: maxParticipants || null,
      time_control: timeControl || "",
      created_by: uid,
      status: "planned",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const docRef = await addDoc(collection(db, "tournaments"), docData);
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Update a tournament
  async updateTournament(id, updates) {
    const docRef = doc(db, "tournaments", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Delete a tournament
  async deleteTournament(id) {
    const docRef = doc(db, "tournaments", id);
    await deleteDoc(docRef);
  },
  // Start a tournament
  async startTournament(id) {
    const docRef = doc(db, "tournaments", id);
    await updateDoc(docRef, {
      status: "active",
      start_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
  },
  // Complete a tournament
  async completeTournament(id) {
    const docRef = doc(db, "tournaments", id);
    await updateDoc(docRef, {
      status: "completed",
      end_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
  },
  // Get tournament participants (con students incrustados para compatibilidad)
  async getTournamentParticipants(tournamentId) {
    const q = query(
      collection(db, "tournament_participants"),
      where("tournament_id", "==", tournamentId),
      orderBy("score", "desc")
    );
    const querySnapshot = await getDocs(q);
    const participants = querySnapshot.docs.map((doc2) => toData(doc2));
    for (const p of participants) {
      if (p.student_id) {
        const studentDoc = await getDoc(doc(db, "students", p.student_id));
        if (studentDoc.exists()) {
          p.students = toData(studentDoc);
        }
      }
    }
    return participants;
  },
  // Add participant to tournament
  async addParticipant(tournamentId, studentId, rating) {
    const docData = {
      tournament_id: tournamentId,
      student_id: studentId,
      rating: rating || 1200,
      score: 0,
      tiebreak_score: 0,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const docRef = await addDoc(collection(db, "tournament_participants"), docData);
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Remove participant from tournament
  async removeParticipant(participantId) {
    await deleteDoc(doc(db, "tournament_participants", participantId));
  },
  // Update participant score
  async updateParticipantScore(participantId, score, tiebreakScore) {
    const docRef = doc(db, "tournament_participants", participantId);
    await updateDoc(docRef, {
      score,
      tiebreak_score: tiebreakScore || 0
    });
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Get tournament matches
  async getTournamentMatches(tournamentId, round) {
    let q = query(
      collection(db, "tournament_matches"),
      where("tournament_id", "==", tournamentId)
    );
    if (round !== void 0) {
      q = query(q, where("round", "==", round));
    }
    const querySnapshot = await getDocs(q);
    let matches = querySnapshot.docs.map((doc2) => toData(doc2));
    matches.sort((a, b) => {
      if (a.round !== b.round) return a.round - b.round;
      return (a.board_number || 0) - (b.board_number || 0);
    });
    for (const m of matches) {
      if (m.player1_id) {
        const p1Doc = await getDoc(doc(db, "students", m.player1_id));
        if (p1Doc.exists()) m.player1 = toData(p1Doc);
      }
      if (m.player2_id) {
        const p2Doc = await getDoc(doc(db, "students", m.player2_id));
        if (p2Doc.exists()) m.player2 = toData(p2Doc);
      }
    }
    return matches;
  },
  // Create tournament matches
  async createTournamentMatches(tournamentId, matches) {
    const createdMatches = [];
    for (const match of matches) {
      const docData = {
        ...match,
        tournament_id: tournamentId,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const docRef = await addDoc(collection(db, "tournament_matches"), docData);
      const docSnap = await getDoc(docRef);
      createdMatches.push(toData(docSnap));
    }
    return createdMatches;
  },
  // Update match result
  async updateMatchResult(matchId, result, moves, gameDurationSeconds) {
    const docRef = doc(db, "tournament_matches", matchId);
    await updateDoc(docRef, {
      result,
      moves: moves || [],
      game_duration_seconds: gameDurationSeconds || 0,
      played_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  }
};
export {
  tournamentsApi as t
};
