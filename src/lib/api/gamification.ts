import { db, auth, toData } from "$lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  writeBatch
} from "firebase/firestore";
import type { Badge, StudentBadge, StudentStats } from "$lib/types";

export const gamificationApi = {
  // Get badges by school
  async getBadgesBySchool(schoolId: string): Promise<Badge[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "badges"),
      where("owner_id", "==", user.uid),
      where("school_id", "==", schoolId),
      where("is_active", "==", true),
      orderBy("created_at")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Badge>(doc));
  },

  // Get a specific badge
  async getBadge(id: string): Promise<Badge> {
    const docSnap = await getDoc(doc(db, "badges", id));
    if (!docSnap.exists()) throw new Error("Badge not found");
    return toData<Badge>(docSnap);
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
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createBadge',
        schoolId, name, description, icon, color, criteria
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error creating badge');
    return result.badge;
  },

  // Update a badge
  async updateBadge(id: string, updates: Partial<Badge>): Promise<void> {
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateBadge',
        id, updates
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error updating badge');
  },

  // Delete a badge
  async deleteBadge(id: string): Promise<void> {
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deleteBadge',
        id
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error deleting badge');
  },

  // Get student badges
  async getStudentBadges(studentId: string): Promise<StudentBadge[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "student_badges"),
      where("owner_id", "==", user.uid),
      where("student_id", "==", studentId),
      orderBy("earned_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    const studentBadges = querySnapshot.docs.map(doc => toData<any>(doc));

    // Manual join for badge data
    for (const sb of studentBadges) {
      if (sb.badge_id) {
        const badgeSnap = await getDoc(doc(db, "badges", sb.badge_id));
        if (badgeSnap.exists()) {
          sb.badges = toData<Badge>(badgeSnap);
        }
      }
    }

    return studentBadges as StudentBadge[];
  },

  // Award badge to student
  async awardBadge(studentId: string, badgeId: string): Promise<void> {
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'awardBadge',
        studentId, badgeId
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error awarding badge');
  },

  // Remove badge from student
  async removeBadge(studentId: string, badgeId: string): Promise<void> {
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'removeBadge',
        studentId, badgeId
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error removing badge');
  },

  // Get student statistics
  async getStudentStats(studentId: string): Promise<StudentStats | null> {
    const docSnap = await getDoc(doc(db, "student_stats", studentId));
    if (!docSnap.exists()) return null;
    return toData<StudentStats>(docSnap);
  },

  // Create or update student statistics
  async updateStudentStats(
    studentId: string,
    updates: Partial<StudentStats>,
  ): Promise<StudentStats> {
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateStudentStats',
        studentId, updates
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error updating student stats');
    
    const stats = await this.getStudentStats(studentId);
    if (!stats) throw new Error('Stats not found after update');
    return stats;
  },

  // Add points to student
  async addPoints(
    studentId: string,
    points: number,
    reason?: string,
  ): Promise<void> {
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addPoints',
        studentId, points, reason
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error adding points');
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
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'logActivity',
        studentId, activityType, activityData
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error logging activity');
  },

  // Check and award badges
  async checkAndAwardBadges(studentId: string): Promise<Badge[]> {
    const response = await fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'checkAndAwardBadges',
        studentId
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Error checking badges');
    return result.newBadges;
  },

};
