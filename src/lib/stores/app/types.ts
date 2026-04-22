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
  Attendance
} from '$lib/types';

export interface AppSettings {
  plan: string;
  teacherName: string;
  teacherAvatar: string;
  teacherEmail?: string;
  featuredInsignias?: string[]; // IDs of up to 3 featured insignias
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
  settings: AppSettings;
  dashboardLayout: string[];
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
  settings: { 
    plan: 'free',
    teacherName: '',
    teacherAvatar: '',
    featuredInsignias: []
  },
  dashboardLayout: []
};
