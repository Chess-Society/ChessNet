import { db, toData } from "$lib/firebase";
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
  deleteDoc
} from "firebase/firestore";
import type { ChessExercise } from "$lib/types";
import { getOwnerId, getOwnedQuery } from "./base";

export const exercisesApi = {
  /**
   * Obtiene ejercicios filtrados por centro y criterios adicionales.
   */
  async getExercisesBySchool(
    schoolId: string,
    filters?: {
      category?: string;
      difficulty?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<ChessExercise[]> {
    const ownerId = await getOwnerId();
    let q = query(
      getOwnedQuery("chess_exercises"),
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

    if (filters?.offset !== undefined) {
      data = data.slice(filters.offset);
    }
    if (filters?.limit) {
      data = data.slice(0, filters.limit);
    }

    return data;
  },

  /**
   * Obtiene un ejercicio específico.
   */
  async getExercise(id: string): Promise<ChessExercise> {
    const ownerId = await getOwnerId();
    const docSnap = await getDoc(doc(db, "chess_exercises", id));
    
    if (!docSnap.exists()) throw new Error("Ejercicio no encontrado");
    
    const data = toData<ChessExercise>(docSnap);
    if (data.owner_id !== ownerId) throw new Error("Acceso denegado");
    
    return data;
  },

  /**
   * Crea un nuevo ejercicio.
   */
  async createExercise(
    schoolId: string,
    exercise: Omit<
      ChessExercise,
      "id" | "school_id" | "created_at" | "updated_at" | "owner_id"
    >,
  ): Promise<ChessExercise> {
    const ownerId = await getOwnerId();

    const data = {
      ...exercise,
      school_id: schoolId,
      owner_id: ownerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "chess_exercises"), data);
    const docSnap = await getDoc(docRef);
    return toData<ChessExercise>(docSnap);
  },

  /**
   * Actualiza un ejercicio.
   */
  async updateExercise(
    id: string,
    updates: Partial<ChessExercise>,
  ): Promise<ChessExercise> {
    const ownerId = await getOwnerId();
    const docRef = doc(db, "chess_exercises", id);
    
    const current = await this.getExercise(id);
    if (current.owner_id !== ownerId) throw new Error("No autorizado");

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<ChessExercise>(docSnap);
  },

  /**
   * Elimina un ejercicio.
   */
  async deleteExercise(id: string): Promise<void> {
    const ownerId = await getOwnerId();
    const current = await this.getExercise(id);
    if (current.owner_id !== ownerId) throw new Error("No autorizado");
    
    await deleteDoc(doc(db, "chess_exercises", id));
  },

  /**
   * Registra un intento de resolución de ejercicio.
   */
  async recordAttempt(
    exerciseId: string,
    studentId: string,
    moves: string[],
    isCorrect: boolean,
    timeSpentSeconds: number,
    hintsUsed: number = 0,
  ): Promise<void> {
    const ownerId = await getOwnerId();

    await addDoc(collection(db, "exercise_attempts"), {
      owner_id: ownerId,
      exercise_id: exerciseId,
      student_id: studentId,
      moves,
      is_correct: isCorrect,
      time_spent_seconds: timeSpentSeconds,
      hints_used: hintsUsed,
      attempted_at: new Date().toISOString()
    });
  },

  /**
   * Obtiene los intentos de un alumno.
   */
  async getStudentAttempts(
    studentId: string,
    exerciseId?: string,
  ): Promise<any[]> {
    const ownerId = await getOwnerId();

    let q = query(
      getOwnedQuery("exercise_attempts"),
      where("student_id", "==", studentId),
      orderBy("attempted_at", "desc")
    );

    if (exerciseId) {
      q = query(q, where("exercise_id", "==", exerciseId));
    }

    const querySnapshot = await getDocs(q);
    const attempts = querySnapshot.docs.map(doc => toData<any>(doc));

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
