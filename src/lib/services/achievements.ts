import { derived, type Readable } from 'svelte/store';
import { appStore } from './storage';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type AchievementCategory = 'teaching' | 'students' | 'tournaments' | 'engagement' | 'skills';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    category: AchievementCategory;
    icon: string;
    tier: AchievementTier;
    requirement: {
        type: 'count' | 'streak' | 'milestone';
        target: number;
        metric: string;
    };
    unlockedAt?: string;
    progress: number;
}

// Define all achievements
export const ACHIEVEMENTS: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
    // Teaching Milestones
    {
        id: 'first-class',
        name: 'Primera Clase',
        description: 'Has creado tu primera clase',
        category: 'teaching',
        icon: 'BookOpen',
        tier: 'bronze',
        requirement: { type: 'count', target: 1, metric: 'classes' }
    },
    {
        id: 'organized-teacher',
        name: 'Maestro Organizador',
        description: 'Gestiona 5 clases activas',
        category: 'teaching',
        icon: 'BookOpen',
        tier: 'silver',
        requirement: { type: 'count', target: 5, metric: 'classes' }
    },
    {
        id: 'grand-master-teacher',
        name: 'Gran Maestro Docente',
        description: '10 o más clases activas',
        category: 'teaching',
        icon: 'BookOpen',
        tier: 'gold',
        requirement: { type: 'count', target: 10, metric: 'classes' }
    },

    // Student Growth
    {
        id: 'first-student',
        name: 'Primer Alumno',
        description: 'Has matriculado tu primer estudiante',
        category: 'students',
        icon: 'Users',
        tier: 'bronze',
        requirement: { type: 'count', target: 1, metric: 'students' }
    },
    {
        id: 'school-running',
        name: 'Escuela en Marcha',
        description: '10 estudiantes matriculados',
        category: 'students',
        icon: 'Users',
        tier: 'silver',
        requirement: { type: 'count', target: 10, metric: 'students' }
    },
    {
        id: 'consolidated-academy',
        name: 'Academia Consolidada',
        description: '50 estudiantes matriculados',
        category: 'students',
        icon: 'Users',
        tier: 'gold',
        requirement: { type: 'count', target: 50, metric: 'students' }
    },
    {
        id: 'chess-empire',
        name: 'Imperio del Ajedrez',
        description: '100 o más estudiantes',
        category: 'students',
        icon: 'Users',
        tier: 'platinum',
        requirement: { type: 'count', target: 100, metric: 'students' }
    },

    // Tournament Organizer
    {
        id: 'first-tournament',
        name: 'Primer Torneo',
        description: 'Has organizado tu primer torneo',
        category: 'tournaments',
        icon: 'Trophy',
        tier: 'bronze',
        requirement: { type: 'count', target: 1, metric: 'tournaments' }
    },
    {
        id: 'veteran-organizer',
        name: 'Organizador Veterano',
        description: '5 torneos organizados',
        category: 'tournaments',
        icon: 'Trophy',
        tier: 'silver',
        requirement: { type: 'count', target: 5, metric: 'tournaments' }
    },
    {
        id: 'competition-master',
        name: 'Maestro de Competiciones',
        description: '10 o más torneos organizados',
        category: 'tournaments',
        icon: 'Trophy',
        tier: 'gold',
        requirement: { type: 'count', target: 10, metric: 'tournaments' }
    },

    // Skills
    {
        id: 'skill-catalog',
        name: 'Catálogo Inicial',
        description: 'Has creado 10 habilidades',
        category: 'skills',
        icon: 'Target',
        tier: 'bronze',
        requirement: { type: 'count', target: 10, metric: 'skills' }
    },
    {
        id: 'complete-library',
        name: 'Biblioteca Completa',
        description: '50 o más habilidades definidas',
        category: 'skills',
        icon: 'Target',
        tier: 'gold',
        requirement: { type: 'count', target: 50, metric: 'skills' }
    },

    // Financial
    {
        id: 'first-income',
        name: 'Primer Ingreso',
        description: 'Has registrado tu primer pago',
        category: 'teaching',
        icon: 'CreditCard',
        tier: 'bronze',
        requirement: { type: 'milestone', target: 1, metric: 'revenue' }
    },
    {
        id: 'business-growing',
        name: 'Negocio Rentable',
        description: 'Has generado más de 500€ en ingresos',
        category: 'teaching',
        icon: 'TrendingUp',
        tier: 'silver',
        requirement: { type: 'milestone', target: 500, metric: 'revenue' }
    },
    {
        id: 'chess-tycoon',
        name: 'Magnate del Tablero',
        description: 'Ingresos superiores a 2000€',
        category: 'teaching',
        icon: 'Crown',
        tier: 'platinum',
        requirement: { type: 'milestone', target: 2000, metric: 'revenue' }
    },

    // Centers
    {
        id: 'expansion',
        name: 'Expansión',
        description: 'Gestionas 2 o más centros',
        category: 'teaching',
        icon: 'MapPin',
        tier: 'silver',
        requirement: { type: 'count', target: 2, metric: 'centers' }
    },
];

// Calculate achievement progress based on current store state
export const achievementsStore: Readable<Achievement[]> = derived(
    appStore,
    ($store) => {
        const totalRevenue = $store.payments.reduce((sum, p) => sum + p.amount, 0);

        const metrics = {
            classes: $store.classes.length,
            students: $store.students.length,
            tournaments: $store.tournaments.length,
            skills: $store.skills.length,
            centers: $store.centers.length,
            revenue: totalRevenue,
        };

        const unlockedIds = new Set(($store.unlockedAchievements || []).map(a => a.id));

        return ACHIEVEMENTS.map((achievement) => {
            const currentValue = metrics[achievement.requirement.metric as keyof typeof metrics] || 0;
            // For revenue, 1 unit is enough for "first income" if target is 1, but if target is 500, we need the actual sum
            const progress = Math.min(100, (currentValue / achievement.requirement.target) * 100);

            // Check persistence first
            const validUnlock = $store.unlockedAchievements?.find(a => a.id === achievement.id);

            return {
                ...achievement,
                progress,
                unlockedAt: validUnlock ? validUnlock.unlockedAt : undefined,
            };
        });
    }
);

// Get tier color
export function getTierColor(tier: AchievementTier): string {
    const colors = {
        bronze: 'from-orange-700 to-orange-900',
        silver: 'from-slate-400 to-slate-600',
        gold: 'from-yellow-400 to-yellow-600',
        platinum: 'from-cyan-400 to-purple-500',
    };
    return colors[tier];
}

// Get tier glow
export function getTierGlow(tier: AchievementTier): string {
    const glows = {
        bronze: 'shadow-orange-500/50',
        silver: 'shadow-slate-400/50',
        gold: 'shadow-yellow-400/50',
        platinum: 'shadow-purple-500/50',
    };
    return glows[tier];
}
