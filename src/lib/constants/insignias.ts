import { 
  Trophy, 
  Medal, 
  Star, 
  Users, 
  Crown,
  Fire,
  ShieldCheck,
  Lightning,
  Diamond,
  Heart,
  MagicWand,
  Student
} from 'phosphor-svelte';

export interface Insignia {
  id: string;
  titleKey: string;
  descKey: string;
  icon: any;
  color: string;
  glowColor: string;
  type: 'automatic' | 'special';
  condition?: (stats: any) => boolean;
}

export const INSIGNIAS: Insignia[] = [
  // --- AUTOMATIC INSIGNIAS ---
  {
    id: 'pioneer',
    titleKey: 'badges.items.pioneer.title',
    descKey: 'badges.items.pioneer.desc',
    icon: Star,
    color: 'text-violet-400',
    glowColor: 'bg-violet-500',
    type: 'automatic',
    condition: () => true
  },
  {
    id: 'first_class',
    titleKey: 'badges.items.first_class.title',
    descKey: 'badges.items.first_class.desc',
    icon: Users,
    color: 'text-emerald-400',
    glowColor: 'bg-emerald-500',
    type: 'automatic',
    condition: (stats) => stats.classesCount > 0
  },
  {
    id: 'mentor_level_1',
    titleKey: 'badges.items.mentor_level_1.title',
    descKey: 'badges.items.mentor_level_1.desc',
    icon: Student,
    color: 'text-blue-400',
    glowColor: 'bg-blue-500',
    type: 'automatic',
    condition: (stats) => stats.studentsCount >= 10
  },
  {
    id: 'mentor_level_2',
    titleKey: 'badges.items.mentor_level_2.title',
    descKey: 'badges.items.mentor_level_2.desc',
    icon: Users,
    color: 'text-indigo-400',
    glowColor: 'bg-indigo-500',
    type: 'automatic',
    condition: (stats) => stats.studentsCount >= 25
  },
  {
    id: 'multi_school',
    titleKey: 'badges.items.multi_school.title',
    descKey: 'badges.items.multi_school.desc',
    icon: ShieldCheck,
    color: 'text-cyan-400',
    glowColor: 'bg-cyan-500',
    type: 'automatic',
    condition: (stats) => stats.schoolsCount >= 3
  },
  {
    id: 'tournament_organizer',
    titleKey: 'badges.items.tournament_organizer.title',
    descKey: 'badges.items.tournament_organizer.desc',
    icon: Trophy,
    color: 'text-amber-400',
    glowColor: 'bg-amber-500',
    type: 'automatic',
    condition: (stats) => stats.completedTournamentsCount >= 1
  },
  {
    id: 'tournament_pro',
    titleKey: 'badges.items.tournament_pro.title',
    descKey: 'badges.items.tournament_pro.desc',
    icon: Medal,
    color: 'text-rose-400',
    glowColor: 'bg-rose-500',
    type: 'automatic',
    condition: (stats) => stats.completedTournamentsCount >= 5
  },
  {
    id: 'active_streak',
    titleKey: 'badges.items.active_streak.title',
    descKey: 'badges.items.active_streak.desc',
    icon: Fire,
    color: 'text-orange-400',
    glowColor: 'bg-orange-500',
    type: 'automatic',
    condition: (stats) => stats.studentsCount >= 50
  },

  // --- SPECIAL INSIGNIAS (Admin awarded) ---
  {
    id: 'premium_club',
    titleKey: 'badges.items.premium_club.title',
    descKey: 'badges.items.premium_club.desc',
    icon: Crown,
    color: 'text-yellow-400',
    glowColor: 'bg-yellow-500',
    type: 'special'
  },
  {
    id: 'bug_hunter',
    titleKey: 'badges.items.bug_hunter.title',
    descKey: 'badges.items.bug_hunter.desc',
    icon: MagicWand,
    color: 'text-fuchsia-400',
    glowColor: 'bg-fuchsia-500',
    type: 'special'
  },
  {
    id: 'early_adopter',
    titleKey: 'badges.items.early_adopter.title',
    descKey: 'badges.items.early_adopter.desc',
    icon: ShieldCheck,
    color: 'text-indigo-400',
    glowColor: 'bg-indigo-500',
    type: 'special'
  },
  {
    id: 'chess_influencer',
    titleKey: 'badges.items.chess_influencer.title',
    descKey: 'badges.items.chess_influencer.desc',
    icon: Lightning,
    color: 'text-cyan-400',
    glowColor: 'bg-cyan-500',
    type: 'special'
  },
  {
    id: 'verified_coach',
    titleKey: 'badges.items.verified_coach.title',
    descKey: 'badges.items.verified_coach.desc',
    icon: Diamond,
    color: 'text-rose-400',
    glowColor: 'bg-rose-500',
    type: 'special'
  },
  {
    id: 'philanthropist',
    titleKey: 'badges.items.philanthropist.title',
    descKey: 'badges.items.philanthropist.desc',
    icon: Heart,
    color: 'text-red-400',
    glowColor: 'bg-red-500',
    type: 'special'
  }
];
