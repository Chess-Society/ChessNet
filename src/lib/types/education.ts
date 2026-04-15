export interface ChessPosition {
  fen: string;
  moves: string[];
  evaluation?: number;
  best_move?: string;
}

export interface Badge {
  id: string;
  owner_id: string;
  school_id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: any;
  is_active: boolean;
  created_at: string;
}

export interface StudentBadge {
  id: string;
  owner_id: string;
  student_id: string;
  badge_id: string;
  earned_at: string;
  badges?: Badge;
}

export interface StudentStats {
  id: string;
  owner_id: string;
  student_id: string;
  points: number;
  level: number;
  streak_days: number;
  exercises_completed: number;
  lessons_completed: number;
  tournaments_participated: number;
  total_play_time_seconds: number;
  last_activity: string;
  updated_at: string;
}

export interface CurriculumUnit {
  id: string;
  owner_id: string;
  school_id: string;
  title: string;
  description?: string;
  level?: string;
  color?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  owner_id: string;
  unit_id: string;
  title: string;
  description?: string;
  content?: any;
  objectives: string[];
  duration_minutes: number;
  difficulty?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ChessExercise {
  id: string;
  title: string;
  description: string;
  position: ChessPosition;
  solution: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "tactics" | "strategy" | "endgame" | "opening";
  hints?: string[];
  explanation?: string;
  owner_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  school_id: string;
  owner_id: string;
  title: string;
  content: string;
  type?: "general" | "class" | "student" | "event";
  target_type?: "all" | "class" | "student";
  target_id?: string;
  priority: "low" | "normal" | "high" | "urgent";
  is_published: boolean;
  published_at?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  student_id: string;
  student_name: string;
  skills_mastered: number;
  total_skills: number;
  progress_percentage: number;
  attendance_rate: number;
  last_activity: string;
}

export interface ClassAnalytics {
  class_id: string;
  class_name: string;
  total_students: number;
  average_attendance: number;
  average_progress: number;
  top_performers: StudentProgress[];
}
