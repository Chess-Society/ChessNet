import { supabase } from "$lib/supabase";
import type { ChessExercise } from "$lib/types";

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
    let query = supabase
      .from("chess_exercises")
      .select("*")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Get a specific exercise
  async getExercise(id: string): Promise<ChessExercise> {
    const { data, error } = await supabase
      .from("chess_exercises")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new exercise
  async createExercise(
    schoolId: string,
    exercise: Omit<
      ChessExercise,
      "id" | "school_id" | "created_at" | "updated_at"
    >,
  ): Promise<ChessExercise> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("chess_exercises")
      .insert({
        school_id: schoolId,
        ...exercise,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an exercise
  async updateExercise(
    id: string,
    updates: Partial<ChessExercise>,
  ): Promise<ChessExercise> {
    const { data, error } = await supabase
      .from("chess_exercises")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an exercise
  async deleteExercise(id: string): Promise<void> {
    const { error } = await supabase
      .from("chess_exercises")
      .delete()
      .eq("id", id);

    if (error) throw error;
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
    const { error } = await supabase.from("exercise_attempts").insert({
      exercise_id: exerciseId,
      student_id: studentId,
      moves,
      is_correct: isCorrect,
      time_spent_seconds: timeSpentSeconds,
      hints_used: hintsUsed,
    });

    if (error) throw error;
  },


  // Get student's exercise attempts
  async getStudentAttempts(
    studentId: string,
    exerciseId?: string,
  ): Promise<any[]> {
    let query = supabase
      .from("exercise_attempts")
      .select(
        `
        *,
        chess_exercises:exercise_id(*)
      `,
      )
      .eq("student_id", studentId)
      .order("attempted_at", { ascending: false });

    if (exerciseId) {
      query = query.eq("exercise_id", exerciseId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

};
