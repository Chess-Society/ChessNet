// User and Auth Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

// Profile Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "admin" | "teacher" | "assistant" | "viewer";
  created_at: string;
  updated_at: string;
}

// Category Types
export interface Category {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  color?: string;
  active?: boolean;
  order_index?: number;
  created_at: string;
}

// School/Center Types
export interface School {
  id: string;
  owner_id: string;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

// Class Types
export interface Class {
  id: string;
  owner_id: string;
  school_id: string;
  school_name?: string;
  name: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
  schedule?: string;
  max_students?: number;
  active?: boolean;
  price?: number;
  settings?: Record<string, any>;
  studentIds?: string[];
  created_at: string;
  updated_at: string;
}

// Student Types
export interface Student {
  id: string;
  owner_id: string;
  school_id: string;
  name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  grade?: string;
  level?: string;
  parent_email?: string;
  parent_phone?: string;
  avatar?: string;
  notes?: string;
  rating?: number;
  active?: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Skill Types (por usuario - owner_id)
export interface Skill {
  id: string;
  owner_id: string;
  category_id?: string;
  name: string;
  description?: string;
  icon?: string;
  resource_link?: string;
  level?: "beginner" | "intermediate" | "advanced";
  category?: string;
  difficulty?: number;
  estimated_hours?: number;
  prerequisites?: string[];
  learning_objectives?: string[];
  assessment_criteria?: string[];
  resources?: string[];
  order_index?: number;
  active?: boolean;
  created_at: string;
  updated_at: string;
}

// Bridge Table Types (por owner - owner_id)

// Class Skills (temario clase ↔ skill)
export interface ClassSkill {
  id: string;
  owner_id: string;
  class_id: string;
  skill_id: string;
  order_index?: number;
  created_at: string;
}

// Class Students (inscripciones clase ↔ alumno)
export interface ClassStudent {
  id: string;
  owner_id: string;
  class_id: string;
  student_id: string;
  enrolled_at: string;
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

// Tracking Types (por usuario - user_id)

// Attendance Types (Moved and merged below)

// Student Skills (progreso alumno por skill)
export interface StudentSkill {
  id: string;
  owner_id: string;
  student_id: string;
  skill_id: string;
  level: number; // 0-100
  mastered: boolean;
  notes?: string;
  last_practiced?: string;
  updated_at: string;
  created_at: string;
}

// =====================
// ATTENDANCE TYPES
// =====================

export type AttendanceStatus = 'P' | 'T' | 'A'; // Presente, Tardanza, Ausente

export interface Attendance {
  id: string;
  owner_id: string;
  student_id: string;
  class_id: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWithDetails extends Attendance {
  student?: Student;
  class?: Class;
}

export interface AttendanceRecord {
  student_id: string;
  student_name: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface ClassAttendance {
  class_id: string;
  class_name: string;
  date: string;
  records: AttendanceRecord[];
  total_students: number;
  present_count: number;
  late_count: number;
  absent_count: number;
}

export interface StudentAttendanceStats {
  student_id: string;
  student_name: string;
  total_sessions: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  attendance_rate: number; // percentage
  punctuality_rate: number; // percentage (present / (present + late))
  last_attendance_date?: string;
}

export interface ClassAttendanceStats {
  class_id: string;
  class_name: string;
  total_sessions: number;
  average_attendance_rate: number;
  average_punctuality_rate: number;
  most_attended_date?: string;
  least_attended_date?: string;
  students: StudentAttendanceStats[];
}

export interface AttendanceFilters {
  class_id?: string;
  student_id?: string;
  date_from?: string;
  date_to?: string;
  status?: AttendanceStatus;
}

export interface AttendanceCalendarEvent {
  date: string;
  class_id: string;
  class_name: string;
  schedule: string;
  attendance_taken: boolean;
  present_count?: number;
  total_students?: number;
}

// =====================
// PAYMENTS TYPES
// =====================

export type PaymentType = 'student' | 'school';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type PaymentConcept = 'monthly_fee' | 'registration' | 'tournament' | 'material' | 'private_lesson' | 'other';
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'paypal' | 'bizum' | 'other';

export interface Payment {
  id: string;
  owner_id: string;
  payment_type: PaymentType;
  student_id?: string;
  school_id?: string;
  class_id?: string;
  amount: number;
  currency: string;
  concept: PaymentConcept;
  description?: string;
  period_start?: string;
  period_end?: string;
  status: PaymentStatus;
  due_date: string;
  paid_date?: string;
  payment_method?: PaymentMethod;
  payment_reference?: string;
  invoice_number?: string;
  invoice_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentWithDetails extends Payment {
  student?: Student;
  school?: School;
  class?: Class;
}

export interface PaymentSummary {
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  total_payments: number;
  paid_payments: number;
  pending_payments: number;
  overdue_payments: number;
}

export interface StudentPaymentSummary extends PaymentSummary {
  student_id: string;
  student_name: string;
  last_payment_date?: string;
  next_due_date?: string;
}

export interface SchoolPaymentSummary extends PaymentSummary {
  school_id: string;
  school_name: string;
  last_payment_date?: string;
  next_due_date?: string;
}

export interface MonthlyRevenue {
  month: string; // YYYY-MM
  total_revenue: number;
  paid_revenue: number;
  pending_revenue: number;
  student_payments: number;
  school_payments: number;
  payment_count: number;
}

export interface PaymentFilters {
  payment_type?: PaymentType;
  status?: PaymentStatus;
  concept?: PaymentConcept;
  student_id?: string;
  school_id?: string;
  class_id?: string;
  date_from?: string;
  date_to?: string;
  due_date_from?: string;
  due_date_to?: string;
  amount_min?: number;
  amount_max?: number;
}

export interface CreatePaymentData {
  payment_type: PaymentType;
  student_id?: string;
  school_id?: string;
  class_id?: string;
  amount: number;
  currency?: string;
  concept: PaymentConcept;
  description?: string;
  period_start?: string;
  period_end?: string;
  status?: PaymentStatus;
  due_date: string;
  payment_method?: string;
  payment_reference?: string;
  invoice_number?: string;
  invoice_date?: string;
  notes?: string;
}

export interface PaymentStats {
  total_revenue_this_month: number;
  total_revenue_last_month: number;
  revenue_growth_percentage: number;
  pending_payments_count: number;
  overdue_payments_count: number;
  overdue_amount: number;
  average_payment_amount: number;
  top_paying_students: StudentPaymentSummary[];
  top_paying_schools: SchoolPaymentSummary[];
  monthly_revenue_trend: MonthlyRevenue[];
}

// View Types (derivadas)

// Class Occupancy View
export interface ClassOccupancy {
  owner_id: string;
  class_id: string;
  enrolled: number;
}

// Student Attendance View
export interface StudentAttendance {
  owner_id: string;
  student_id: string;
  marks: number;
  p_count: number;
  t_count: number;
  a_count: number;
  attendance_rate: number;
  punctuality_rate: number;
  last_date: string;
}

// Communication Types
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

// Extended Types with Relations

export interface ClassWithDetails extends Class {
  school?: School;
  students_count?: number;
  skills_count?: number;
}

export interface StudentWithDetails extends Student {
  class?: Class;
  skills_progress?: StudentSkill[];
  attendance_summary?: StudentAttendance;
}

export interface SkillWithDetails extends Omit<Skill, 'category'> {
  category?: Category;
  classes_count?: number;
  students_mastered?: number;
}

// Analytics Types
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

// Chess Game Types (mantienen estructura original)
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

export interface Membership {
  id: string;
  owner_id: string;
  school_id: string;
  user_id: string;
  role: "owner" | "admin" | "teacher" | "assistant" | "viewer";
  created_at: string;
  profiles?: any;
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

// Lead Types (CRM)
export interface Lead {
  id: string;
  owner_id: string;
  name: string;
  email?: string;
  phone?: string;
  school_id?: string;
  class_id?: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'lost';
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Form Types
export interface CreateClassForm {
  name: string;
  school_id?: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
  schedule?: string;
  max_students?: number;
  active?: boolean;
}

export interface CreateStudentForm {
  name: string;
  class_id?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  grade?: string;
  parent_email?: string;
  parent_phone?: string;
  notes?: string;
}

export interface CreateSkillForm {
  name: string;
  category_id?: string;
  description?: string;
  icon?: string;
  resource_link?: string;
  level?: "beginner" | "intermediate" | "advanced";
  difficulty?: number;
  estimated_hours?: number;
  learning_objectives?: string[];
  assessment_criteria?: string[];
  resources?: string[];
  order_index?: number;
  active?: boolean;
}

export interface AttendanceForm {
  class_id: string;
  student_id: string;
  date: string;
  status: "P" | "T" | "A";
  notes?: string;
}

export interface StudentSkillForm {
  student_id: string;
  skill_id: string;
  level: number;
  mastered: boolean;
  notes?: string;
}

// =====================
// LOCAL TOURNAMENT TYPES (IndexedDB)
// =====================

// Tournament main object
export interface LocalTournament {
  id: string;
  owner_id: string;
  school_id?: string;
  name: string;
  format: "swiss" | "round_robin" | "knockout";
  time_control?: string; // e.g., "15+10"
  location?: string;
  startAt?: string;
  endAt?: string;
  prize_pool?: number;
  max_players?: number;
  roundsPlanned?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "upcoming" | "in_progress" | "completed" | "cancelled";
  currentRound: number;
  start_date?: string; // Compatibilidad con vistas generales
  description?: string; // Compatibilidad con vistas generales
  _ttl?: number; 
// Time to live in milliseconds
  _expiresAt?: string; // ISO date when expires
  _version?: number; // For future sync
}

// Tournament players (inscriptions)
export interface LocalTournamentPlayer {
  id: string;
  tournament_id: string;
  student_id: string;
  student_name?: string; // Denormalized for convenience
  rating?: number;
  seed?: number;
  createdAt: string;
}

// Tournament rounds
export interface LocalTournamentRound {
  id: string;
  tournament_id: string;
  round_no: number;
  startedAt?: string;
  finishedAt?: string;
  notes?: string;
}

// Tournament pairings (matches)
export interface LocalTournamentPairing {
  id: string;
  tournament_id: string;
  round_no: number;
  board: number;
  white_student_id?: string;
  black_student_id?: string;
  white_name?: string; // Denormalized
  black_name?: string; // Denormalized
  result?: "1-0" | "0-1" | "1/2-1/2";
  bye?: boolean;
  points_white?: number;
  points_black?: number;
  notes?: string;
  updatedAt?: string;
}

// Tournament standings (calculated)
export interface LocalTournamentStanding {
  student_id: string;
  student_name: string;
  points: number;
  tiebreak1?: number; // Buchholz, etc.
  tiebreak2?: number;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  position: number;
}

// Complete tournament data (for nested storage)
export interface LocalTournamentComplete extends LocalTournament {
  players: LocalTournamentPlayer[];
  rounds: LocalTournamentRound[];
  pairings: LocalTournamentPairing[];
  standings?: LocalTournamentStanding[];
}

// Form types for tournament creation
export interface CreateTournamentForm {
  name: string;
  format: "swiss" | "round_robin" | "knockout";
  school_id?: string;
  time_control?: string;
  location?: string;
  startAt?: string;
  endAt?: string;
  prize_pool?: number;
  max_players?: number;
  roundsPlanned?: number;
  notes?: string;
  selected_students: string[]; // Student IDs to register
}

// Tournament main object
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  type?: "swiss" | "round_robin" | "elimination" | "team";
  format?: "swiss" | "round_robin" | "elimination" | "team" | "knockout" | "single_elimination";
  status: "planned" | "active" | "completed" | "draft" | "upcoming" | "in_progress" | "cancelled";
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  max_participants?: number;
  max_players?: number; // Aliased for legacy compatibility
  time_control?: string;
  entry_fee?: number;
  prize_pool?: number;
  location?: string;
  organizer?: string;
  notes?: string;
  rules?: string;
  school_id: string;
  current_round?: number;
  total_rounds?: number;
  players_registered?: number;
  owner_id: string;
  created_at: string;
  updated_at?: string;
}

// Tournament participants (players in a tournament)
export interface TournamentParticipant {
  id: string;
  owner_id: string;
  tournament_id: string;
  student_id: string;
  rating: number;
  score: number;
  tiebreak_score?: number;
  created_at: string;
  students?: Student; // For joined data
}

// Tournament matches/pairings
export interface TournamentMatch {
  id: string;
  owner_id: string;
  tournament_id: string;
  round: number;
  board_number: number;
  player1_id: string;
  player2_id: string;
  result?: "1-0" | "0-1" | "1/2-1/2" | "bye" | "forfeit" | "*";
  moves?: string[];
  game_duration_seconds?: number;
  played_at?: string;
  created_at: string;
  player1?: Student;
  player2?: Student;
}

// Tournament filters and queries
export interface TournamentFilters {
  format?: "swiss" | "round_robin" | "knockout";
  school_id?: string;
  status?: "planned" | "active" | "completed";
  startDate?: string;
  endDate?: string;
}

// Tournament statistics
export interface TournamentStats {
  total_tournaments: number;
  active_tournaments: number;
  completed_tournaments: number;
  total_players: number;
  total_games: number;
  formats: Record<string, number>;
}

// =====================
// SUBSCRIPTION TYPES
// =====================

export interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  price_monthly?: number;
  price_annual: number;
  currency: string;
  max_students: number; // -1 = unlimited
  max_classes: number;
  max_schools: number;
  max_tournaments: number;
  max_storage_mb: number;
  max_custom_skills: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'failed';
  started_at: string;
  expires_at: string;
  cancelled_at?: string;
  payment_method?: 'paypal' | 'stripe' | 'manual';
  payment_reference?: string;
  payment_email?: string;
  amount_paid?: number;
  currency: string;
  auto_renew: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPayment {
  id: string;
  user_id: string;
  subscription_id?: string;
  plan_id: string;
  amount: number;
  currency: string;
  payment_method: 'paypal' | 'stripe' | 'manual';
  payment_reference?: string;
  payment_email?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paid_at?: string;
  failed_at?: string;
  refunded_at?: string;
  gateway_response: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPlanLimits {
  plan_name: string;
  display_name: string;
  status: string;
  expires_at?: string;
  max_students: number;
  max_classes: number;
  max_schools: number;
  max_tournaments: number;
  max_storage_mb: number;
  max_custom_skills: number;
  features: string[];
}

export interface SubscriptionUpgradeData {
  current_plan: SubscriptionPlan;
  available_plans: SubscriptionPlan[];
  user_limits: UserPlanLimits;
  usage_stats: {
    students_count: number;
    classes_count: number;
    schools_count: number;
    tournaments_count: number;
    storage_used_mb: number;
    custom_skills_count: number;
  };
}
