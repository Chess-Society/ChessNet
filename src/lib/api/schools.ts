import { supabase } from "$lib/supabase";
import type { School, Membership } from "$lib/types";

export const schoolsApi = {
  // Get all schools for the current user
  async getMySchools(): Promise<School[]> {
    const { data, error } = await supabase
      .from("colleges")
      .select(
        `
        *,
        memberships!inner(user_id)
      `,
      )
      .eq("memberships.user_id", (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
    return data || [];
  },

  // Get a specific school
  async getSchool(id: string): Promise<School> {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new school
  async createSchool(
    name: string,
    city?: string,
  ): Promise<School> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("colleges")
      .insert({
        name,
        city,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Create membership for the owner
    await this.addMember(data.id, user.id, "owner");

    // Initialize default data for the school
    await supabase.rpc("initialize_school_data", { school_uuid: data.id });

    return data;
  },

  // Update a school
  async updateSchool(id: string, updates: Partial<School>): Promise<School> {
    const { data, error } = await supabase
      .from("colleges")
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

  // Delete a school
  async deleteSchool(id: string): Promise<void> {
    const { error } = await supabase.from("colleges").delete().eq("id", id);

    if (error) throw error;
  },

  // Get school members
  async getSchoolMembers(schoolId: string): Promise<Membership[]> {
    const { data, error } = await supabase
      .from("memberships")
      .select(
        `
        *,
        profiles:user_id(*)
      `,
      )
      .eq("school_id", schoolId);

    if (error) throw error;
    return data || [];
  },

  // Add a member to a school
  async addMember(
    schoolId: string,
    userId: string,
    role: "owner" | "admin" | "teacher" | "assistant" | "viewer",
  ): Promise<Membership> {
    const { data, error } = await supabase
      .from("memberships")
      .insert({
        school_id: schoolId,
        user_id: userId,
        role,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update member role
  async updateMemberRole(
    membershipId: string,
    role: "owner" | "admin" | "teacher" | "assistant" | "viewer",
  ): Promise<Membership> {
    const { data, error } = await supabase
      .from("memberships")
      .update({ role })
      .eq("id", membershipId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove a member from a school
  async removeMember(membershipId: string): Promise<void> {
    const { error } = await supabase
      .from("memberships")
      .delete()
      .eq("id", membershipId);

    if (error) throw error;
  },

  // Check if user is member of school
  async isMember(schoolId: string): Promise<boolean> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return false;

    const { data, error } = await supabase
      .from("memberships")
      .select("id")
      .eq("school_id", schoolId)
      .eq("user_id", user.id)
      .single();

    return !error && !!data;
  },

  // Get user's role in school
  async getUserRole(schoolId: string): Promise<string | null> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return null;

    const { data, error } = await supabase
      .from("memberships")
      .select("role")
      .eq("school_id", schoolId)
      .eq("user_id", user.id)
      .single();

    if (error) return null;
    return data.role;
  },
};
