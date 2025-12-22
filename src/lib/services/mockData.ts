
// Tipos
export interface Center {
    id: string;
    name: string;
    location: string;
    studentCount: number;
    activeGroups: number;
    status: 'active' | 'inactive';
}

export interface Student {
    id: string;
    name: string;
    elo: number;
    level: 'Pawn' | 'Knight' | 'Bishop' | 'Rook' | 'Queen' | 'King';
    attendance: number;
    streak: number;
    lastActive: string;
    avatar: string;
    skillsMastered: number;
}

export interface ClassGroup {
    id: string;
    name: string;
    center: string;
    schedule: string;
    students: number;
    level: string;
    nextSession: string;
}

export interface Skill {
    id: string;
    category: 'Tactics' | 'Strategy' | 'Endgame' | 'Openings';
    name: string;
    description: string;
    level: number;
    studentsMastered: number;
}

export interface Tournament {
    id: string;
    name: string;
    date: string;
    participants: number;
    type: 'Swiss' | 'Arena' | 'Round Robin';
    status: 'Upcoming' | 'Live' | 'Completed';
}

// Datos Mockeados
export const mockCenters: Center[] = [
    { id: '1', name: 'Academia Central de Madrid', location: 'Madrid', studentCount: 145, activeGroups: 12, status: 'active' },
    { id: '2', name: 'Club de Ajedrez Barcelona', location: 'Barcelona', studentCount: 89, activeGroups: 8, status: 'active' },
    { id: '3', name: 'Escuela Infantil Valencia', location: 'Valencia', studentCount: 34, activeGroups: 4, status: 'active' },
    { id: '4', name: 'Colegio San Jose', location: 'Sevilla', studentCount: 0, activeGroups: 0, status: 'inactive' },
];

export const mockStudents: Student[] = [
    { id: '1', name: 'Alex Magnusson', elo: 1200, level: 'Knight', attendance: 95, streak: 12, lastActive: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', skillsMastered: 15 },
    { id: '2', name: 'Sarah Polgar', elo: 850, level: 'Pawn', attendance: 80, streak: 3, lastActive: '1d ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', skillsMastered: 8 },
    { id: '3', name: 'David Hikaru', elo: 1500, level: 'Rook', attendance: 100, streak: 45, lastActive: '5m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', skillsMastered: 24 },
    { id: '4', name: 'Elena Tal', elo: 1100, level: 'Bishop', attendance: 60, streak: 0, lastActive: '5d ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', skillsMastered: 12 },
    { id: '5', name: 'Marcus Capablanca', elo: 2100, level: 'King', attendance: 98, streak: 120, lastActive: 'Now', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', skillsMastered: 45 },
];

export const mockClasses: ClassGroup[] = [
    { id: '1', name: 'Grupo A - Iniciación', center: 'Academia Central', schedule: 'L y X 17:00', students: 12, level: 'Pawn', nextSession: 'Hoy, 17:00' },
    { id: '2', name: 'Grupo B - Intermedio', center: 'Academia Central', schedule: 'M y J 18:30', students: 8, level: 'Bishop', nextSession: 'Mañana, 18:30' },
    { id: '3', name: 'Tecnificación Sábados', center: 'Club Barcelona', schedule: 'S 10:00', students: 15, level: 'Rook', nextSession: 'Sábado, 10:00' },
];

export const mockSkills: Skill[] = [
    { id: '1', category: 'Tactics', name: 'Clavada (Pin)', description: 'Ataque a una pieza que no puede moverse', level: 1, studentsMastered: 45 },
    { id: '2', category: 'Tactics', name: 'Ataque Doble', description: 'Atacar dos piezas al mismo tiempo', level: 1, studentsMastered: 32 },
    { id: '3', category: 'Endgame', name: 'Mate Pastor', description: 'Mate en f7 con Dama y Alfil', level: 1, studentsMastered: 89 },
    { id: '4', category: 'Strategy', name: 'Centro', description: 'Control de las casillas centrales e4-d4-e5-d5', level: 2, studentsMastered: 20 },
    { id: '5', category: 'Openings', name: 'Apertura Italiana', description: '1. e4 e5 2. Nf3 Nc6 3. Bc4', level: 2, studentsMastered: 15 },
];

export const mockTournaments: Tournament[] = [
    { id: '1', name: 'Torneo de Invierno 2025', date: '2025-12-25', participants: 40, type: 'Swiss', status: 'Upcoming' },
    { id: '2', name: 'Liga Inter-Escolar', date: '2025-12-20', participants: 120, type: 'Arena', status: 'Live' },
    { id: '3', name: 'Clasificatorio Regional', date: '2025-11-15', participants: 64, type: 'Swiss', status: 'Completed' },
];

// Simulacion de API
export async function getCenters(): Promise<Center[]> {
    return new Promise(r => setTimeout(() => r(mockCenters), 500));
}

export async function getStudents(): Promise<Student[]> {
    return new Promise(r => setTimeout(() => r(mockStudents), 600));
}

export async function getClasses(): Promise<ClassGroup[]> {
    return new Promise(r => setTimeout(() => r(mockClasses), 500));
}

export async function getSkills(): Promise<Skill[]> {
    return new Promise(r => setTimeout(() => r(mockSkills), 400));
}

export async function getTournaments(): Promise<Tournament[]> {
    return new Promise(r => setTimeout(() => r(mockTournaments), 400));
}
