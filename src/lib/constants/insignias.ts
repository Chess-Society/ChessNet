import { 
  Trophy, 
  Medal, 
  Star, 
  Users, 
  Crown,
  Fire,
  Shield,
  Lightning,
  Diamond,
  Heart,
  MagicWand,
  Student,
  BookOpen,
  Strategy,
  Sword,
  TrendUp
} from 'phosphor-svelte';

export interface Insignia {
  id: string;
  titleKey: string;
  descKey: string;
  icon: any;
  color: string; // Base Hex Color
  glowColor: string; // Glow Hex Color
  type: 'automatic' | 'special';
  category: 'system' | 'growth' | 'tournament' | 'admin';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  condition?: (stats: any) => boolean;
  secret?: boolean;
  hintKey?: string;
}

export const INSIGNIAS: Insignia[] = [
  {
    id: 'pioneer',
    titleKey: 'badges.items.pioneer.title',
    descKey: 'badges.items.pioneer.desc',
    icon: Star,
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    type: 'automatic',
    category: 'system',
    tier: 'bronze',
    condition: () => true
  },
  {
    id: 'early_adopter',
    titleKey: 'badges.items.early_adopter.title',
    descKey: 'badges.items.early_adopter.desc',
    icon: Lightning,
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    type: 'automatic',
    category: 'system',
    tier: 'silver',
    condition: () => true
  },
  
  // --- GROWTH / MENTOR PROGRESSION ---
  {
    id: 'mentor_level_1',
    titleKey: 'badges.items.mentor_level_1.title',
    descKey: 'badges.items.mentor_level_1.desc',
    icon: Student,
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    type: 'automatic',
    category: 'growth',
    tier: 'bronze',
    condition: (stats) => stats.studentsCount >= 5
  },
  {
    id: 'mentor_level_2',
    titleKey: 'badges.items.mentor_level_2.title',
    descKey: 'badges.items.mentor_level_2.desc',
    icon: Users,
    color: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    type: 'automatic',
    category: 'growth',
    tier: 'silver',
    condition: (stats) => stats.studentsCount >= 25
  },
  {
    id: 'mentor_level_3',
    titleKey: 'badges.items.mentor_level_3.title',
    descKey: 'badges.items.mentor_level_3.desc',
    icon: Crown,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    type: 'automatic',
    category: 'growth',
    tier: 'gold',
    condition: (stats) => stats.studentsCount >= 50
  },
  {
      id: 'chess_grandmaster_coach',
      titleKey: 'badges.items.chess_grandmaster_coach.title',
      descKey: 'badges.items.chess_grandmaster_coach.desc',
      icon: Crown,
      color: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.6)',
      type: 'automatic',
      category: 'growth',
      tier: 'platinum',
      secret: true,
      hintKey: 'badges.hints.students_100',
      condition: (stats) => stats.studentsCount >= 100
  },

  // --- ACADEMIC / SCHOLAR ---
  {
    id: 'scholar_level_1',
    titleKey: 'badges.items.scholar_level_1.title',
    descKey: 'badges.items.scholar_level_1.desc',
    icon: BookOpen,
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    type: 'automatic',
    category: 'growth',
    tier: 'bronze',
    condition: (stats) => stats.lessonsCreatedCount >= 1
  },
  {
    id: 'scholar_level_2',
    titleKey: 'badges.items.scholar_level_2.title',
    descKey: 'badges.items.scholar_level_2.desc',
    icon: Strategy,
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    type: 'automatic',
    category: 'growth',
    tier: 'gold',
    secret: true,
    hintKey: 'badges.hints.lessons_10',
    condition: (stats) => stats.lessonsCreatedCount >= 10
  },

  // --- TOURNAMENTS PROGRESSION ---
  {
    id: 'tournament_organizer',
    titleKey: 'badges.items.tournament_organizer.title',
    descKey: 'badges.items.tournament_organizer.desc',
    icon: Sword,
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    type: 'automatic',
    category: 'tournament',
    tier: 'bronze',
    condition: (stats) => stats.completedTournamentsCount >= 1
  },
  {
    id: 'tournament_pro',
    titleKey: 'badges.items.tournament_pro.title',
    descKey: 'badges.items.tournament_pro.desc',
    icon: Medal,
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    type: 'automatic',
    category: 'tournament',
    tier: 'gold',
    condition: (stats) => stats.completedTournamentsCount >= 5
  },
  {
    id: 'tournament_master',
    titleKey: 'badges.items.tournament_master.title',
    descKey: 'badges.items.tournament_master.desc',
    icon: Trophy,
    color: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    type: 'automatic',
    category: 'tournament',
    tier: 'platinum',
    secret: true,
    hintKey: 'badges.hints.tournaments_10',
    condition: (stats) => stats.completedTournamentsCount >= 10
  },

  // --- SPECIAL / HIDDEN ---
  {
    id: 'community_voice',
    titleKey: 'badges.items.community_voice.title',
    descKey: 'badges.items.community_voice.desc',
    icon: Users,
    color: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    type: 'automatic',
    category: 'system',
    tier: 'silver',
    secret: true,
    hintKey: 'badges.hints.lobby_contribution',
    condition: (stats) => stats.lobbyContributionsCount >= 5
  },
  {
    id: 'bug_hunter',
    titleKey: 'badges.items.bug_hunter.title',
    descKey: 'badges.items.bug_hunter.desc',
    icon: MagicWand,
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    type: 'special',
    category: 'admin',
    tier: 'silver'
  },
  {
    id: 'premium_club',
    titleKey: 'badges.items.premium_club.title',
    descKey: 'badges.items.premium_club.desc',
    icon: Crown,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    type: 'special',
    category: 'admin',
    tier: 'platinum',
    secret: true,
    hintKey: 'badges.hints.premium'
  },
  {
    id: 'titan_of_industry',
    titleKey: 'badges.items.titan_of_industry.title',
    descKey: 'badges.items.titan_of_industry.desc',
    icon: TrendUp,
    color: '#1E293B',
    glowColor: 'rgba(255, 255, 255, 0.1)',
    type: 'automatic',
    category: 'growth',
    tier: 'legendary',
    secret: true,
    hintKey: 'badges.hints.titan',
    condition: (stats) => stats.studentsCount >= 200 && stats.schoolsCount >= 5
  },
  {
      id: 'legendary_curriculum',
      titleKey: 'badges.items.legendary_curriculum.title',
      descKey: 'badges.items.legendary_curriculum.desc',
      icon: MagicWand,
      color: '#F472B6',
      glowColor: 'rgba(244, 114, 182, 0.6)',
      type: 'special',
      category: 'system',
      tier: 'legendary',
      secret: true,
      hintKey: 'badges.hints.syllabus'
  }
];
