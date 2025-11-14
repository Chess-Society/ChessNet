import { supabase } from "$lib/supabase";
import type { Category } from "$lib/types";

export const categoriesApi = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get a specific category
  async getCategory(id: string): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new category (admin only)
  async createCategory(
    name: string,
    description?: string,
    color?: string
  ): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        description,
        color: color || '#3b82f6'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a category (admin only)
  async updateCategory(
    id: string, 
    updates: Partial<Pick<Category, 'name' | 'description' | 'color'>>
  ): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a category (admin only)
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Get categories with skill count
  async getCategoriesWithSkillCount(): Promise<(Category & { skills_count: number })[]> {
    const { data, error } = await supabase
      .from("categories")
      .select(`
        *,
        skills:skills(count)
      `)
      .order("name", { ascending: true });

    if (error) throw error;
    
    return data?.map(category => ({
      ...category,
      skills_count: category.skills?.[0]?.count || 0
    })) || [];
  }
};
