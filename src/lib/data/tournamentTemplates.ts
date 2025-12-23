/**
 * Tournament Templates for ChessNet
 * Predefined tournament configurations for common scenarios
 */

export interface TournamentTemplate {
    id: string;
    name: string;
    description: string;
    format: 'Suizo' | 'Round Robin' | 'Eliminación';
    suggestedRounds: number;
    timeControl: string;
    icon: string;
    color: string;
    estimatedDuration: string;
    idealParticipants: string;
    tieBreaks: string[];
}

export const tournamentTemplates: TournamentTemplate[] = [
    {
        id: 'school-rapid',
        name: 'Torneo Escolar Rápido',
        description: 'Perfecto para torneos escolares de una tarde. 3 rondas Swiss con partidas rápidas.',
        format: 'Suizo',
        suggestedRounds: 3,
        timeControl: '10+0',
        icon: '⚡',
        color: 'blue',
        estimatedDuration: '2-3 horas',
        idealParticipants: '8-20 jugadores',
        tieBreaks: ['Buchholz', 'Enfrentamiento Directo']
    },
    {
        id: 'monthly-league',
        name: 'Liga Mensual',
        description: 'Torneo mensual estándar. 5 rondas Swiss con tiempo de reflexión.',
        format: 'Suizo',
        suggestedRounds: 5,
        timeControl: '15+10',
        icon: '🏆',
        color: 'emerald',
        estimatedDuration: '4-5 horas',
        idealParticipants: '12-32 jugadores',
        tieBreaks: ['Buchholz', 'Sonneborn-Berger']
    },
    {
        id: 'annual-championship',
        name: 'Campeonato Anual',
        description: 'Torneo oficial de larga duración. 7 rondas Swiss con control clásico.',
        format: 'Suizo',
        suggestedRounds: 7,
        timeControl: '90+30',
        icon: '👑',
        color: 'yellow',
        estimatedDuration: '2-3 días',
        idealParticipants: '16-64 jugadores',
        tieBreaks: ['Buchholz', 'Sonneborn-Berger', 'Enfrentamiento Directo']
    },
    {
        id: 'blitz-tournament',
        name: 'Torneo Blitz',
        description: 'Acción rápida y emocionante. 5 rondas de partidas relámpago.',
        format: 'Suizo',
        suggestedRounds: 5,
        timeControl: '3+2',
        icon: '⚡',
        color: 'orange',
        estimatedDuration: '1-2 horas',
        idealParticipants: '8-24 jugadores',
        tieBreaks: ['Buchholz']
    },
    {
        id: 'round-robin-small',
        name: 'Todos contra Todos (Pequeño)',
        description: 'Formato Round Robin ideal para grupos reducidos. Todos juegan contra todos.',
        format: 'Round Robin',
        suggestedRounds: 0, // Calculated based on participants
        timeControl: '15+10',
        icon: '🔄',
        color: 'purple',
        estimatedDuration: 'Variable',
        idealParticipants: '4-10 jugadores',
        tieBreaks: ['Sonneborn-Berger', 'Enfrentamiento Directo']
    },
    {
        id: 'knockout-cup',
        name: 'Copa Eliminación Directa',
        description: 'Formato de copa. Pierde y quedas eliminado. Emoción garantizada.',
        format: 'Eliminación',
        suggestedRounds: 0, // Calculated based on participants (log2)
        timeControl: '10+5',
        icon: '🏅',
        color: 'red',
        estimatedDuration: 'Variable',
        idealParticipants: '8, 16, 32 jugadores',
        tieBreaks: ['Desempate rápido']
    },
    {
        id: 'weekend-swiss',
        name: 'Torneo de Fin de Semana',
        description: 'Torneo Swiss de fin de semana. 6 rondas distribuidas en 2 días.',
        format: 'Suizo',
        suggestedRounds: 6,
        timeControl: '60+30',
        icon: '📅',
        color: 'teal',
        estimatedDuration: '2 días',
        idealParticipants: '16-40 jugadores',
        tieBreaks: ['Buchholz', 'Sonneborn-Berger']
    },
    {
        id: 'beginner-friendly',
        name: 'Torneo para Principiantes',
        description: 'Diseñado para jugadores nuevos. Pocas rondas, tiempo generoso.',
        format: 'Suizo',
        suggestedRounds: 4,
        timeControl: '20+10',
        icon: '🌱',
        color: 'green',
        estimatedDuration: '3-4 horas',
        idealParticipants: '8-16 jugadores',
        tieBreaks: ['Buchholz']
    }
];

/**
 * Get template by ID
 */
export function getTemplate(id: string): TournamentTemplate | undefined {
    return tournamentTemplates.find(t => t.id === id);
}

/**
 * Get templates by format
 */
export function getTemplatesByFormat(format: 'Suizo' | 'Round Robin' | 'Eliminación'): TournamentTemplate[] {
    return tournamentTemplates.filter(t => t.format === format);
}
