
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
    { id: '1', name: 'Alex Magnusson', elo: 1200, level: 'Knight', attendance: 95, streak: 12, lastActive: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: '2', name: 'Sarah Polgar', elo: 850, level: 'Pawn', attendance: 80, streak: 3, lastActive: '1d ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: '3', name: 'David Hikaru', elo: 1500, level: 'Rook', attendance: 100, streak: 45, lastActive: '5m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: '4', name: 'Elena Tal', elo: 1100, level: 'Bishop', attendance: 60, streak: 0, lastActive: '5d ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
    { id: '5', name: 'Marcus Capablanca', elo: 2100, level: 'King', attendance: 98, streak: 120, lastActive: 'Now', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
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

export async function getTournaments(): Promise<Tournament[]> {
    return new Promise(r => setTimeout(() => r(mockTournaments), 400));
}
