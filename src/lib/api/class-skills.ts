import { supabase } from "$lib/supabase";
import type { ClassSkill, Skill } from "$lib/types";

export const classSkillsApi = {
  // Get all skills assigned to a class
  async getClassSkills(classId: string): Promise<(ClassSkill & { skill: Skill })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_skills")
      .select(`
        *,
        skills:skill_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get all classes where a skill is assigned
  async getSkillClasses(skillId: string): Promise<(ClassSkill & { class: any })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_skills")
      .select(`
        *,
        classes:class_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("skill_id", skillId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Assign a skill to a class
  async assignSkillToClass(classId: string, skillId: string, orderIndex?: number): Promise<ClassSkill> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Check if already assigned
    const { data: existing } = await supabase
      .from("class_skills")
      .select("id")
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .eq("skill_id", skillId)
      .single();

    if (existing) {
      throw new Error("Skill is already assigned to this class");
    }

    // Get next order index if not provided
    if (orderIndex === undefined) {
      const { data: lastSkill } = await supabase
        .from("class_skills")
        .select("order_index")
        .eq("owner_id", user.id)
        .eq("class_id", classId)
        .order("order_index", { ascending: false })
        .limit(1)
        .single();

      orderIndex = (lastSkill?.order_index || 0) + 1;
    }

    const { data, error } = await supabase
      .from("class_skills")
      .insert({
        owner_id: user.id,
        class_id: classId,
        skill_id: skillId,
        order_index: orderIndex
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Assign multiple skills to a class
  async assignSkillsToClass(classId: string, skillIds: string[]): Promise<ClassSkill[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get current max order index
    const { data: lastSkill } = await supabase
      .from("class_skills")
      .select("order_index")
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    let nextOrderIndex = (lastSkill?.order_index || 0) + 1;

    const skillsToInsert = skillIds.map(skillId => ({
      owner_id: user.id,
      class_id: classId,
      skill_id: skillId,
      order_index: nextOrderIndex++
    }));

    const { data, error } = await supabase
      .from("class_skills")
      .insert(skillsToInsert)
      .select();

    if (error) throw error;
    return data || [];
  },

  // Remove a skill from a class
  async removeSkillFromClass(classId: string, skillId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("class_skills")
      .delete()
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .eq("skill_id", skillId);

    if (error) throw error;
  },

  // Remove multiple skills from a class
  async removeSkillsFromClass(classId: string, skillIds: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("class_skills")
      .delete()
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .in("skill_id", skillIds);

    if (error) throw error;
  },

  // Reorder skills in a class
  async reorderClassSkills(classId: string, skillIds: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get existing class_skills records
    const { data: existingSkills, error: fetchError } = await supabase
      .from("class_skills")
      .select("id, skill_id")
      .eq("owner_id", user.id)
      .eq("class_id", classId);

    if (fetchError) throw fetchError;

    // Create updates with new order
    const updates = skillIds.map((skillId, index) => {
      const existing = existingSkills?.find(cs => cs.skill_id === skillId);
      if (!existing) throw new Error(`Skill ${skillId} not found in class ${classId}`);
      
      return {
        id: existing.id,
        order_index: index
      };
    });

    const { error } = await supabase
      .from("class_skills")
      .upsert(updates, { onConflict: "id" });

    if (error) throw error;
  },

  // Get class curriculum (skills with details)
  async getClassCurriculum(classId: string): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_skills")
      .select(`
        *,
        skills:skill_id(
          *,
          categories:category_id(*)
        )
      `)
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Copy curriculum from one class to another
  async copyCurriculum(fromClassId: string, toClassId: string): Promise<ClassSkill[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get source class skills
    const { data: sourceSkills, error: fetchError } = await supabase
      .from("class_skills")
      .select("skill_id, order_index")
      .eq("owner_id", user.id)
      .eq("class_id", fromClassId)
      .order("order_index", { ascending: true });

    if (fetchError) throw fetchError;
    if (!sourceSkills || sourceSkills.length === 0) {
      return [];
    }

    // Insert into target class
    const skillsToInsert = sourceSkills.map(skill => ({
      owner_id: user.id,
      class_id: toClassId,
      skill_id: skill.skill_id,
      order_index: skill.order_index
    }));

    const { data, error } = await supabase
      .from("class_skills")
      .insert(skillsToInsert)
      .select();

    if (error) throw error;
    return data || [];
  }
};
