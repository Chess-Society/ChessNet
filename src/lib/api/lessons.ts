import { supabase } from "$lib/supabase";
import type { CurriculumUnit, Lesson } from "$lib/types";

export const lessonsApi = {
  // Get curriculum units by school
  async getCurriculumUnits(schoolId: string): Promise<CurriculumUnit[]> {
    const { data, error } = await supabase
      .from("curriculum_units")
      .select("*")
      .eq("school_id", schoolId)
      .order("order_index");

    if (error) throw error;
    return data || [];
  },

  // Get a specific curriculum unit
  async getCurriculumUnit(id: string): Promise<CurriculumUnit> {
    const { data, error } = await supabase
      .from("curriculum_units")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new curriculum unit
  async createCurriculumUnit(
    schoolId: string,
    title: string,
    description?: string,
    level?: string,
    color?: string,
  ): Promise<CurriculumUnit> {
    // Get the next order index
    const { data: lastUnit } = await supabase
      .from("curriculum_units")
      .select("order_index")
      .eq("school_id", schoolId)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex =
      lastUnit && lastUnit.length > 0 ? lastUnit[0].order_index + 1 : 0;

    const { data, error } = await supabase
      .from("curriculum_units")
      .insert({
        school_id: schoolId,
        title,
        description,
        level,
        color,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a curriculum unit
  async updateCurriculumUnit(
    id: string,
    updates: Partial<CurriculumUnit>,
  ): Promise<CurriculumUnit> {
    const { data, error } = await supabase
      .from("curriculum_units")
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

  // Delete a curriculum unit
  async deleteCurriculumUnit(id: string): Promise<void> {
    const { error } = await supabase
      .from("curriculum_units")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Reorder curriculum units
  async reorderCurriculumUnits(
    units: { id: string; order_index: number }[],
  ): Promise<void> {
    const updates = units.map((unit) =>
      supabase
        .from("curriculum_units")
        .update({ order_index: unit.order_index })
        .eq("id", unit.id),
    );

    const results = await Promise.all(updates);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      throw new Error("Error reordering curriculum units");
    }
  },

  // Get lessons by unit
  async getLessonsByUnit(unitId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("unit_id", unitId)
      .order("order_index");

    if (error) throw error;
    return data || [];
  },

  // Get a specific lesson
  async getLesson(id: string): Promise<Lesson> {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new lesson
  async createLesson(
    unitId: string,
    title: string,
    description?: string,
    content?: any,
    objectives?: string[],
    durationMinutes?: number,
    difficulty?: string,
  ): Promise<Lesson> {
    // Get the next order index
    const { data: lastLesson } = await supabase
      .from("lessons")
      .select("order_index")
      .eq("unit_id", unitId)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex =
      lastLesson && lastLesson.length > 0 ? lastLesson[0].order_index + 1 : 0;

    const { data, error } = await supabase
      .from("lessons")
      .insert({
        unit_id: unitId,
        title,
        description,
        content,
        objectives,
        duration_minutes: durationMinutes || 60,
        difficulty,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a lesson
  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson> {
    const { data, error } = await supabase
      .from("lessons")
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

  // Delete a lesson
  async deleteLesson(id: string): Promise<void> {
    const { error } = await supabase.from("lessons").delete().eq("id", id);

    if (error) throw error;
  },

  // Reorder lessons
  async reorderLessons(
    lessons: { id: string; order_index: number }[],
  ): Promise<void> {
    const updates = lessons.map((lesson) =>
      supabase
        .from("lessons")
        .update({ order_index: lesson.order_index })
        .eq("id", lesson.id),
    );

    const results = await Promise.all(updates);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      throw new Error("Error reordering lessons");
    }
  },

  // Get lesson resources
  async getLessonResources(lessonId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("lesson_resources")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("order_index");

    if (error) throw error;
    return data || [];
  },

  // Add resource to lesson
  async addLessonResource(
    lessonId: string,
    title: string,
    type: "url" | "file" | "exercise" | "position",
    url?: string,
    filePath?: string,
    content?: any,
  ): Promise<any> {
    // Get the next order index
    const { data: lastResource } = await supabase
      .from("lesson_resources")
      .select("order_index")
      .eq("lesson_id", lessonId)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex =
      lastResource && lastResource.length > 0
        ? lastResource[0].order_index + 1
        : 0;

    const { data, error } = await supabase
      .from("lesson_resources")
      .insert({
        lesson_id: lessonId,
        title,
        type,
        url,
        file_path: filePath,
        content,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update lesson resource
  async updateLessonResource(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from("lesson_resources")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete lesson resource
  async deleteLessonResource(id: string): Promise<void> {
    const { error } = await supabase
      .from("lesson_resources")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

};
