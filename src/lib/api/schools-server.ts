import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { School, Membership } from '$lib/types';
import type { Cookies } from '@sveltejs/kit';

// Función para crear cliente de Supabase en el servidor
function createSupabaseServerClient(cookies: Cookies) {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      flowType: 'pkce'
    },
    cookies: {
      get: (key) => {
        return cookies.get(key);
      },
      set: (key, value, options) => {
        cookies.set(key, value, { 
          ...options, 
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        });
      },
      remove: (key, options) => {
        cookies.delete(key, { ...options, path: '/' });
      },
    },
  });
}

export const schoolsServerApi = {
  // Get all schools for the current user
  async getMySchools(cookies: Cookies): Promise<School[]> {
    const supabase = createSupabaseServerClient(cookies);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("user_id", user.id); // Usar user_id directamente

    if (error) throw error;
    return data || [];
  },

  // Get a specific school
  async getSchool(id: string, cookies: Cookies): Promise<School> {
    const supabase = createSupabaseServerClient(cookies);
    
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
    cookies: Cookies,
    city?: string,
  ): Promise<School> {
    const supabase = createSupabaseServerClient(cookies);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    console.log('🏫 Creating school for user:', user.email, 'with owner_id:', user.id);

    const { data, error } = await supabase
      .from("colleges")
      .insert({
        name,
        city,
        user_id: user.id, // Usar user_id en lugar de owner_id
        created_by: user.id, // También establecer created_by
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating school:', error);
      throw error;
    }

    console.log('✅ School created successfully:', data.id);

    // Create membership for the owner
    await this.addMember(data.id, user.id, "owner", cookies);

    // Initialize default data for the school
    try {
      await supabase.rpc("initialize_school_data", { school_uuid: data.id });
      console.log('✅ School data initialized successfully');
    } catch (initError) {
      console.warn('⚠️ Warning: Could not initialize school data:', initError);
      // No lanzar error, la escuela se creó correctamente
    }

    return data;
  },

  // Update a school
  async updateSchool(id: string, updates: Partial<School>, cookies: Cookies): Promise<School> {
    const supabase = createSupabaseServerClient(cookies);
    
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
  async deleteSchool(id: string, cookies: Cookies): Promise<void> {
    const supabase = createSupabaseServerClient(cookies);
    
    const { error } = await supabase.from("colleges").delete().eq("id", id);

    if (error) throw error;
  },

  // Add a member to a school
  async addMember(
    schoolId: string,
    userId: string,
    role: "owner" | "admin" | "teacher" | "assistant" | "viewer",
    cookies: Cookies
  ): Promise<Membership> {
    const supabase = createSupabaseServerClient(cookies);
    
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

  // Check if user is member of school
  async isMember(schoolId: string, cookies: Cookies): Promise<boolean> {
    const supabase = createSupabaseServerClient(cookies);
    
    const { data: { user } } = await supabase.auth.getUser();
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
  async getUserRole(schoolId: string, cookies: Cookies): Promise<string | null> {
    const supabase = createSupabaseServerClient(cookies);
    
    const { data: { user } } = await supabase.auth.getUser();
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
