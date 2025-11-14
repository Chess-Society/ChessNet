import { supabase } from "$lib/supabase";
import type { Skill, CreateSkillForm } from "$lib/types";

export const skillsApi = {
  // Get all skills for the current user
  async getMySkills(): Promise<Skill[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("skills")
      .select(`
        *,
        categories:category_id(*)
      `)
      .eq("user_id", user.id)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get skills by category
  async getSkillsByCategory(categoryId: string): Promise<Skill[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", user.id)
      .eq("category_id", categoryId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get a specific skill
  async getSkill(id: string): Promise<Skill> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("skills")
      .select(`
        *,
        categories:category_id(*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new skill
  async createSkill(skillData: CreateSkillForm): Promise<Skill> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("skills")
      .insert({
        user_id: user.id,
        name: skillData.name,
        category_id: skillData.category_id,
        description: skillData.description,
        icon: skillData.icon,
        resource_link: skillData.resource_link,
        level: skillData.level,
        order_index: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a skill
  async updateSkill(id: string, updates: Partial<CreateSkillForm>): Promise<Skill> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("skills")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a skill
  async deleteSkill(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  },

  // Reorder skills
  async reorderSkills(skillIds: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const updates = skillIds.map((id, index) => ({
      id,
      order_index: index,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from("skills")
      .upsert(updates, { onConflict: "id" });

    if (error) throw error;
  },

  // Get skills with progress for a specific student
  async getSkillsWithProgress(studentId: string): Promise<(Skill & { progress?: any })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("skills")
      .select(`
        *,
        categories:category_id(*),
        student_skills!inner(
          level,
          mastered,
          notes,
          last_practiced,
          updated_at
        )
      `)
      .eq("user_id", user.id)
      .eq("student_skills.student_id", studentId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get skills assigned to a class
  async getClassSkills(classId: string): Promise<Skill[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_skills")
      .select(`
        skills:skill_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data?.map((item: any) => item.skills).filter(Boolean) || [];
  }
};
