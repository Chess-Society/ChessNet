import { supabase } from "$lib/supabase";
import type { Badge, StudentBadge, StudentStats } from "$lib/types";

export const gamificationApi = {
  // Get badges by school
  async getBadgesBySchool(schoolId: string): Promise<Badge[]> {
    const { data, error } = await supabase
      .from("badges")
      .select("*")
      .eq("school_id", schoolId)
      .eq("is_active", true)
      .order("created_at");

    if (error) throw error;
    return data || [];
  },

  // Get a specific badge
  async getBadge(id: string): Promise<Badge> {
    const { data, error } = await supabase
      .from("badges")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new badge
  async createBadge(
    schoolId: string,
    name: string,
    description: string,
    icon: string,
    color: string = "#3b82f6",
    criteria: any,
  ): Promise<Badge> {
    const { data, error } = await supabase
      .from("badges")
      .insert({
        school_id: schoolId,
        name,
        description,
        icon,
        color,
        criteria,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a badge
  async updateBadge(id: string, updates: Partial<Badge>): Promise<Badge> {
    const { data, error } = await supabase
      .from("badges")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a badge
  async deleteBadge(id: string): Promise<void> {
    const { error } = await supabase.from("badges").delete().eq("id", id);

    if (error) throw error;
  },

  // Get student badges
  async getStudentBadges(studentId: string): Promise<StudentBadge[]> {
    const { data, error } = await supabase
      .from("student_badges")
      .select(
        `
        *,
        badges(*)
      `,
      )
      .eq("student_id", studentId)
      .order("earned_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Award badge to student
  async awardBadge(studentId: string, badgeId: string): Promise<StudentBadge> {
    const { data, error } = await supabase
      .from("student_badges")
      .insert({
        student_id: studentId,
        badge_id: badgeId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove badge from student
  async removeBadge(studentId: string, badgeId: string): Promise<void> {
    const { error } = await supabase
      .from("student_badges")
      .delete()
      .eq("student_id", studentId)
      .eq("badge_id", badgeId);

    if (error) throw error;
  },

  // Get student statistics
  async getStudentStats(studentId: string): Promise<StudentStats | null> {
    const { data, error } = await supabase
      .from("student_stats")
      .select("*")
      .eq("student_id", studentId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Create or update student statistics
  async updateStudentStats(
    studentId: string,
    updates: Partial<StudentStats>,
  ): Promise<StudentStats> {
    const { data, error } = await supabase
      .from("student_stats")
      .upsert({
        student_id: studentId,
        ...updates,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add points to student
  async addPoints(
    studentId: string,
    points: number,
    reason?: string,
  ): Promise<StudentStats> {
    const currentStats = await this.getStudentStats(studentId);
    const newPoints = (currentStats?.points || 0) + points;
    const newLevel = Math.floor(newPoints / 100) + 1; // 100 points per level

    const updatedStats = await this.updateStudentStats(studentId, {
      points: newPoints,
      level: newLevel,
    });

    // Log activity
    await this.logActivity(studentId, "points_earned", {
      points,
      reason,
      totalPoints: newPoints,
    });

    return updatedStats;
  },

  // Update streak
  async updateStreak(studentId: string): Promise<StudentStats> {
    const currentStats = await this.getStudentStats(studentId);
    const lastActivity = currentStats?.last_activity
      ? new Date(currentStats.last_activity)
      : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = currentStats?.streak_days || 0;

    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity);
      lastActivityDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1;
      }
      // If daysDiff === 0, it's the same day, keep current streak
    } else {
      // First activity
      newStreak = 1;
    }

    return await this.updateStudentStats(studentId, {
      streak_days: newStreak,
    });
  },

  // Increment exercises completed
  async incrementExercisesCompleted(studentId: string): Promise<StudentStats> {
    const currentStats = await this.getStudentStats(studentId);
    const newCount = (currentStats?.exercises_completed || 0) + 1;

    const updatedStats = await this.updateStudentStats(studentId, {
      exercises_completed: newCount,
    });

    // Log activity
    await this.logActivity(studentId, "exercise_completed", {
      totalExercises: newCount,
    });

    return updatedStats;
  },

  // Increment lessons completed
  async incrementLessonsCompleted(studentId: string): Promise<StudentStats> {
    const currentStats = await this.getStudentStats(studentId);
    const newCount = (currentStats?.lessons_completed || 0) + 1;

    const updatedStats = await this.updateStudentStats(studentId, {
      lessons_completed: newCount,
    });

    // Log activity
    await this.logActivity(studentId, "lesson_completed", {
      totalLessons: newCount,
    });

    return updatedStats;
  },

  // Increment tournaments participated
  async incrementTournamentsParticipated(
    studentId: string,
  ): Promise<StudentStats> {
    const currentStats = await this.getStudentStats(studentId);
    const newCount = (currentStats?.tournaments_participated || 0) + 1;

    const updatedStats = await this.updateStudentStats(studentId, {
      tournaments_participated: newCount,
    });

    // Log activity
    await this.logActivity(studentId, "tournament_participated", {
      totalTournaments: newCount,
    });

    return updatedStats;
  },

  // Add play time
  async addPlayTime(studentId: string, seconds: number): Promise<StudentStats> {
    const currentStats = await this.getStudentStats(studentId);
    const newTime = (currentStats?.total_play_time_seconds || 0) + seconds;

    return await this.updateStudentStats(studentId, {
      total_play_time_seconds: newTime,
    });
  },

  // Log activity
  async logActivity(
    studentId: string,
    activityType: string,
    activityData?: any,
  ): Promise<void> {
    const { error } = await supabase.from("activity_logs").insert({
      student_id: studentId,
      activity_type: activityType,
      activity_data: activityData,
    });

    if (error) throw error;
  },

  // Check and award badges
  async checkAndAwardBadges(studentId: string): Promise<Badge[]> {
    const studentStats = await this.getStudentStats(studentId);
    const studentBadges = await this.getStudentBadges(studentId);
    const earnedBadgeIds = studentBadges.map((sb) => sb.badge_id);

    // Get all badges for the student's school
    const { data: student } = await supabase
      .from("students")
      .select("school_id")
      .eq("id", studentId)
      .single();

    if (!student) return [];

    const badges = await this.getBadgesBySchool(student.school_id);
    const newBadges: Badge[] = [];

    for (const badge of badges) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      const criteria = badge.criteria;
      let shouldAward = false;

      // Check different badge criteria
      if (
        criteria.lessons_completed &&
        (studentStats?.lessons_completed || 0) >= criteria.lessons_completed
      ) {
        shouldAward = true;
      } else if (
        criteria.exercises_completed &&
        (studentStats?.exercises_completed || 0) >= criteria.exercises_completed
      ) {
        shouldAward = true;
      } else if (
        criteria.tournaments_participated &&
        (studentStats?.tournaments_participated || 0) >=
          criteria.tournaments_participated
      ) {
        shouldAward = true;
      } else if (
        criteria.streak_days &&
        (studentStats?.streak_days || 0) >= criteria.streak_days
      ) {
        shouldAward = true;
      } else if (criteria.points && (studentStats?.points || 0) >= criteria.points) {
        shouldAward = true;
      } else if (criteria.level && (studentStats?.level || 0) >= criteria.level) {
        shouldAward = true;
      }

      if (shouldAward) {
        await this.awardBadge(studentId, badge.id);
        newBadges.push(badge);
      }
    }

    return newBadges;
  },

};
