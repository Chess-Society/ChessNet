import { supabase } from "$lib/supabase";
import type { College } from "$lib/types";

export const collegesApi = {
  // Get all colleges for current user
  async getColleges(): Promise<College[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },


  // Get colleges by city
  async getCollegesByCity(city: string): Promise<College[]> {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("city", city)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get a specific college
  async getCollege(id: string): Promise<College> {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Search colleges by name
  async searchColleges(query: string): Promise<College[]> {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("name", { ascending: true })
      .limit(20);

    if (error) throw error;
    return data || [];
  },

  // Create a new college
  async createCollege(collegeData: {
    name: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  }): Promise<College> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("colleges")
      .insert({
        user_id: user.id,
        name: collegeData.name,
        city: collegeData.city,
        address: collegeData.address,
        phone: collegeData.phone,
        email: collegeData.email,
        website: collegeData.website
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a college
  async updateCollege(
    id: string, 
    updates: Partial<Omit<College, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<College> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("colleges")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a college
  async deleteCollege(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("colleges")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  },

  // Get colleges with class count
  async getCollegesWithClassCount(): Promise<(College & { classes_count: number })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("colleges")
      .select(`
        *,
        classes:classes(count)
      `)
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) throw error;
    
    return data?.map(college => ({
      ...college,
      classes_count: college.classes?.[0]?.count || 0
    })) || [];
  },

};
