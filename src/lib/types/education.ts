export interface ChessPosition {
  fen: string;
  moves: string[];
  evaluation?: number;
  bestMove?: string;
}

export interface Badge {
  id: string;
  ownerId: string;
  schoolId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: any;
  isActive: boolean;
  createdAt: string;
}

export interface StudentBadge {
  id: string;
  ownerId: string;
  studentId: string;
  badgeId: string;
  earnedAt: string;
  badge?: Badge;
}

export interface StudentStats {
  id: string;
  ownerId: string;
  studentId: string;
  points: number;
  level: number;
  streakDays: number;
  exercisesCompleted: number;
  lessonsCompleted: number;
  tournamentsParticipated: number;
  totalPlayTimeSeconds: number;
  lastActivity: string;
  updatedAt: string;
}

export interface CurriculumUnit {
  id: string;
  ownerId: string;
  schoolId: string;
  title: string;
  description?: string;
  level?: string;
  color?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  ownerId: string;
  unitId: string;
  title: string;
  description?: string;
  content?: any;
  objectives: string[];
  durationMinutes: number;
  difficulty?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
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
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  schoolId: string;
  ownerId: string;
  title: string;
  content: string;
  type?: "general" | "class" | "student" | "event";
  targetType?: "all" | "class" | "student";
  targetId?: string;
  priority: "low" | "normal" | "high" | "urgent";
  isPublished: boolean;
  publishedAt?: string;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  skillsMastered: number;
  totalSkills: number;
  progressPercentage: number;
  attendanceRate: number;
  lastActivity: string;
}

export interface ClassAnalytics {
  classId: string;
  className: string;
  totalStudents: number;
  averageAttendance: number;
  averageProgress: number;
  topPerformers: StudentProgress[];
}
