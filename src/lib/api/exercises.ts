import { db, auth } from "$lib/firebase";
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
import type { ChessExercise } from "$lib/types";

// Helper to convert Firestore document to data with ID
const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

export const exercisesApi = {
  // Get exercises by school
  async getExercisesBySchool(
    schoolId: string,
    filters?: {
      category?: string;
      difficulty?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<ChessExercise[]> {
    let q = query(
      collection(db, "chess_exercises"),
      where("school_id", "==", schoolId),
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map(doc => toData<ChessExercise>(doc));

    if (filters?.category) {
      data = data.filter(e => e.category === filters.category);
    }

    if (filters?.difficulty) {
      data = data.filter(e => e.difficulty === filters.difficulty);
    }

    // Manual slice for limit/offset
    if (filters?.offset !== undefined) {
      data = data.slice(filters.offset);
    }
    if (filters?.limit) {
      data = data.slice(0, filters.limit);
    }

    return data;
  },

  // Get a specific exercise
  async getExercise(id: string): Promise<ChessExercise> {
    const docSnap = await getDoc(doc(db, "chess_exercises", id));
    if (!docSnap.exists()) throw new Error("Exercise not found");
    return toData<ChessExercise>(docSnap);
  },

  // Create a new exercise
  async createExercise(
    schoolId: string,
    exercise: Omit<
      ChessExercise,
      "id" | "school_id" | "created_at" | "updated_at"
    >,
  ): Promise<ChessExercise> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const exerciseData = {
      school_id: schoolId,
      ...exercise,
      created_by: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "chess_exercises"), exerciseData);
    const docSnap = await getDoc(docRef);
    return toData<ChessExercise>(docSnap);
  },

  // Update an exercise
  async updateExercise(
    id: string,
    updates: Partial<ChessExercise>,
  ): Promise<ChessExercise> {
    const docRef = doc(db, "chess_exercises", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<ChessExercise>(docSnap);
  },

  // Delete an exercise
  async deleteExercise(id: string): Promise<void> {
    await deleteDoc(doc(db, "chess_exercises", id));
  },

  // Record exercise attempt
  async recordAttempt(
    exerciseId: string,
    studentId: string,
    moves: string[],
    isCorrect: boolean,
    timeSpentSeconds: number,
    hintsUsed: number = 0,
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await addDoc(collection(db, "exercise_attempts"), {
      exercise_id: exerciseId,
      student_id: studentId,
      moves,
      is_correct: isCorrect,
      time_spent_seconds: timeSpentSeconds,
      hints_used: hintsUsed,
      attempted_at: new Date().toISOString(),
      owner_id: user.uid
    });
  },

  // Get student's exercise attempts
  async getStudentAttempts(
    studentId: string,
    exerciseId?: string,
  ): Promise<any[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    let q = query(
      collection(db, "exercise_attempts"),
      where("student_id", "==", studentId),
      orderBy("attempted_at", "desc")
    );

    if (exerciseId) {
      q = query(q, where("exercise_id", "==", exerciseId));
    }

    const querySnapshot = await getDocs(q);
    const attempts = querySnapshot.docs.map(doc => toData<any>(doc));

    // Manual join for exercise data
    for (const attempt of attempts) {
      if (attempt.exercise_id) {
        const exerciseSnap = await getDoc(doc(db, "chess_exercises", attempt.exercise_id));
        if (exerciseSnap.exists()) {
          attempt.chess_exercises = toData<ChessExercise>(exerciseSnap);
        }
      }
    }

    return attempts;
  },
};
