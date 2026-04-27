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
  Attendance
} from '$lib/types';

export interface AppSettings {
  plan: string;
  role?: 'teacher' | 'director' | 'admin' | 'student' | 'family';
  schoolName?: string; // Optional: specific school name for directors
  teacherName: string;
  teacherAvatar: string;
  teacherEmail?: string;
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
  studentStats: any[];
  reports: any[];
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
  studentStats: [],
  reports: [],
  settings: { 
    plan: 'free',
    teacherName: '',
    teacherAvatar: ''
  },
  dashboardLayout: [],
  initialized: false
};
