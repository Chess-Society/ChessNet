import { supabase } from "$lib/supabase";
import type { Announcement, Student } from "$lib/types";

export const communicationApi = {
  // Get announcements by school
  async getAnnouncementsBySchool(
    schoolId: string,
    filters?: {
      type?: string;
      isPublished?: boolean;
      limit?: number;
      offset?: number;
    },
  ): Promise<Announcement[]> {
    let query = supabase
      .from("announcements")
      .select("*")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    if (filters?.isPublished !== undefined) {
      query = query.eq("is_published", filters.isPublished);
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

  // Get a specific announcement
  async getAnnouncement(id: string): Promise<Announcement> {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new announcement
  async createAnnouncement(
    schoolId: string,
    title: string,
    content: string,
    type: "general" | "class" | "student" | "tournament" | "event" = "general",
    targetType: "all" | "class" | "student" | "parent" = "all",
    targetId?: string,
    priority: "low" | "normal" | "high" | "urgent" = "normal",
    isPublished: boolean = false,
    expiresAt?: string,
  ): Promise<Announcement> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        school_id: schoolId,
        title,
        content,
        type,
        target_type: targetType,
        target_id: targetId,
        priority,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
        expires_at: expiresAt,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an announcement
  async updateAnnouncement(
    id: string,
    updates: Partial<Announcement>,
  ): Promise<Announcement> {
    const { data, error } = await supabase
      .from("announcements")
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

  // Delete an announcement
  async deleteAnnouncement(id: string): Promise<void> {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Publish an announcement
  async publishAnnouncement(id: string): Promise<Announcement> {
    const { data, error } = await supabase
      .from("announcements")
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Unpublish an announcement
  async unpublishAnnouncement(id: string): Promise<Announcement> {
    const { data, error } = await supabase
      .from("announcements")
      .update({
        is_published: false,
        published_at: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },


  // Send message to parent
  async sendParentMessage(
    studentId: string,
    title: string,
    content: string,
    type:
      | "progress"
      | "attendance"
      | "behavior"
      | "achievement"
      | "general" = "general",
  ): Promise<any> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("parent_messages")
      .insert({
        student_id: studentId,
        title,
        content,
        type,
        sent_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<any> {
    const { data, error } = await supabase
      .from("parent_messages")
      .update({ is_read: true })
      .eq("id", messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

};
