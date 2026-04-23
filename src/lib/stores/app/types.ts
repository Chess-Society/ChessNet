import type { 
  School, 
  Student, 
  Class, 
  Skill, 
  Category,
  Tournament, 
  LocalTournament, 
  Payment,
  Lead,
  Badge,
  StudentBadge,
  Attendance,
  UserEconomy,
  SocialPost
} from '$lib/types';
import type { PredictionMarket } from '$lib/types/governance';

export interface AppSettings {
  plan: string;
  role?: 'teacher' | 'director' | 'admin';
  schoolName?: string; // Optional: specific school name for directors
  teacherName: string;
  teacherAvatar: string;
  teacherEmail?: string;
  featuredInsignias?: string[]; // IDs of up to 3 featured insignias
  economy?: UserEconomy;
  [key: string]: any;
}

export interface AppState {
  schools: School[];
  students: Student[];
  classes: Class[];
  skills: Skill[];
  categories: Category[];
  tournaments: Tournament[]; // Globales
  localTournaments: LocalTournament[]; // Locales/Clase
  localTournamentPlayers: any[]; 
  localTournamentRounds: any[];
  localTournamentPairings: any[];
  attendance: Attendance[];
  payments: Payment[];
  plans: any[];
  leads: Lead[];
  badges: Badge[];
  studentBadges: StudentBadge[];
  studentStats: any[];
  reports: any[];
  lobbySuggestions: any[];
  lobbyAnnouncements: any[];
  communityGroups: any[];
  unlockedAchievements: any[];
  pendingAchievementIds: string[]; // Queue for sequential display
  posts: SocialPost[];
  markets: PredictionMarket[];
  settings: AppSettings;
  dashboardLayout: string[];
  initialized: boolean;
}

export const initialState: AppState = {
  schools: [],
  students: [],
  classes: [],
  skills: [],
  categories: [],
  tournaments: [],
  localTournaments: [],
  localTournamentPlayers: [],
  localTournamentRounds: [],
  localTournamentPairings: [],
  attendance: [],
  payments: [],
  plans: [],
  leads: [],
  badges: [],
  studentBadges: [],
  studentStats: [],
  reports: [],
  lobbySuggestions: [],
  lobbyAnnouncements: [],
  communityGroups: [],
  unlockedAchievements: [],
  pendingAchievementIds: [],
  posts: [],
  markets: [],
  settings: { 
    plan: 'free',
    teacherName: '',
    teacherAvatar: '',
    featuredInsignias: []
  },
  dashboardLayout: [],
  initialized: false
};
