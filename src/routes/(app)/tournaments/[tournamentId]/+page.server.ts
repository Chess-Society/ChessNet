import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const { tournamentId } = params;
  console.log('🏆 Tournament detail page server load - Tournament:', tournamentId, 'User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Tournament detail page - Providing mock data');
    
    // Mock del torneo específico
    const mockTournaments: Record<string, any> = {
      'tournament-001': {
        id: 'tournament-001',
        name: 'Torneo Principiantes Marzo',
        description: 'Torneo mensual para estudiantes principiantes',
        format: 'swiss',
        time_control: '10+5',
        max_players: 16,
        entry_fee: 5.00,
        prize_pool: 50.00,
        start_date: '2024-03-15T10:00:00Z',
        end_date: '2024-03-15T18:00:00Z',
        registration_deadline: '2024-03-14T23:59:59Z',
        status: 'upcoming',
        current_round: 0,
        total_rounds: 5,
        players_registered: 8,
        created_at: '2024-02-15T00:00:00Z',
        updated_at: '2024-02-20T00:00:00Z',
        location: 'Escuela de Ajedrez Madrid Centro',
        organizer: 'ChessNet - Madrid',
        notes: 'Torneo ideal para estudiantes que llevan menos de 6 meses aprendiendo',
        rules: 'Reglamento FIDE simplificado para principiantes',
        user_id: 'dev-user-123'
      },
      'tournament-002': {
        id: 'tournament-002',
        name: 'Copa ChessNet Febrero',
        description: 'Torneo eliminatorio mensual',
        format: 'knockout',
        time_control: '15+10',
        max_players: 8,
        entry_fee: 10.00,
        prize_pool: 60.00,
        start_date: '2024-02-10T09:00:00Z',
        end_date: '2024-02-10T17:00:00Z',
        registration_deadline: '2024-02-09T23:59:59Z',
        status: 'in_progress',
        current_round: 2,
        total_rounds: 3,
        players_registered: 8,
        created_at: '2024-01-25T00:00:00Z',
        updated_at: '2024-02-10T12:30:00Z',
        location: 'Club de Ajedrez Barcelona',
        organizer: 'ChessNet - Barcelona',
        notes: 'Sistema eliminatorio directo',
        rules: 'Reglamento FIDE oficial',
        user_id: 'dev-user-123'
      }
    };

    const tournament = mockTournaments[tournamentId];
    
    if (!tournament) {
      throw new Error(`Tournament not found: ${tournamentId}`);
    }

    // Mock de jugadores inscritos
    const mockRegisteredPlayers = [
      {
        id: 'player-reg-001',
        tournament_id: tournamentId,
        student_id: 'mock-student-1',
        student_name: 'Ana García Martín',
        student_rating: 1250,
        registration_date: '2024-02-16T10:30:00Z',
        status: 'confirmed',
        notes: null
      },
      {
        id: 'player-reg-002',
        tournament_id: tournamentId,
        student_id: 'mock-student-2',
        student_name: 'Carlos López Silva',
        student_rating: 1180,
        registration_date: '2024-02-17T14:20:00Z',
        status: 'confirmed',
        notes: null
      },
      {
        id: 'player-reg-003',
        tournament_id: tournamentId,
        student_id: 'mock-student-3',
        student_name: 'María Rodríguez Pérez',
        student_rating: 1480,
        registration_date: '2024-02-18T09:15:00Z',
        status: 'confirmed',
        notes: null
      },
      {
        id: 'player-reg-004',
        tournament_id: tournamentId,
        student_id: 'mock-student-4',
        student_name: 'David González Torres',
        student_rating: 1320,
        registration_date: '2024-02-19T16:45:00Z',
        status: 'confirmed',
        notes: null
      },
      {
        id: 'player-reg-005',
        tournament_id: tournamentId,
        student_id: 'mock-student-5',
        student_name: 'Laura Martínez Vega',
        student_rating: 1150,
        registration_date: '2024-02-20T11:30:00Z',
        status: 'registered',
        notes: 'Pendiente de confirmación de pago'
      },
      {
        id: 'player-reg-006',
        tournament_id: tournamentId,
        student_id: 'mock-student-6',
        student_name: 'Pedro Ruiz Sánchez',
        student_rating: 1200,
        registration_date: '2024-02-21T13:20:00Z',
        status: 'confirmed',
        notes: null
      },
      {
        id: 'player-reg-007',
        tournament_id: tournamentId,
        student_id: 'mock-student-7',
        student_name: 'Isabel Torres Moreno',
        student_rating: 1350,
        registration_date: '2024-02-22T08:45:00Z',
        status: 'confirmed',
        notes: null
      },
      {
        id: 'player-reg-008',
        tournament_id: tournamentId,
        student_id: 'mock-student-8',
        student_name: 'Miguel Ángel Fernández',
        student_rating: 1280,
        registration_date: '2024-02-23T15:10:00Z',
        status: 'confirmed',
        notes: null
      }
    ];

    // Mock de rondas
    const mockRounds = [
      {
        id: 'round-001',
        tournament_id: tournamentId,
        round_number: 1,
        status: tournament.status === 'in_progress' ? 'completed' : 'not_started',
        start_time: tournament.status === 'in_progress' ? '2024-02-10T09:00:00Z' : null,
        end_time: tournament.status === 'in_progress' ? '2024-02-10T10:30:00Z' : null
      },
      {
        id: 'round-002',
        tournament_id: tournamentId,
        round_number: 2,
        status: tournament.status === 'in_progress' ? 'in_progress' : 'not_started',
        start_time: tournament.status === 'in_progress' ? '2024-02-10T11:00:00Z' : null,
        end_time: null
      }
    ];

    // Mock de emparejamientos
    const mockPairings = tournament.status === 'in_progress' ? [
      // Ronda 1
      {
        id: 'pairing-001',
        tournament_id: tournamentId,
        round_number: 1,
        board_number: 1,
        white_player_id: 'mock-student-1',
        black_player_id: 'mock-student-8',
        result: '1-0',
        white_points: 1,
        black_points: 0,
        notes: null,
        is_bye: false,
        white_player_name: 'Ana García Martín',
        black_player_name: 'Miguel Ángel Fernández'
      },
      {
        id: 'pairing-002',
        tournament_id: tournamentId,
        round_number: 1,
        board_number: 2,
        white_player_id: 'mock-student-3',
        black_player_id: 'mock-student-6',
        result: '1/2-1/2',
        white_points: 0.5,
        black_points: 0.5,
        notes: null,
        is_bye: false,
        white_player_name: 'María Rodríguez Pérez',
        black_player_name: 'Pedro Ruiz Sánchez'
      },
      {
        id: 'pairing-003',
        tournament_id: tournamentId,
        round_number: 1,
        board_number: 3,
        white_player_id: 'mock-student-4',
        black_player_id: 'mock-student-5',
        result: '0-1',
        white_points: 0,
        black_points: 1,
        notes: null,
        is_bye: false,
        white_player_name: 'David González Torres',
        black_player_name: 'Laura Martínez Vega'
      },
      {
        id: 'pairing-004',
        tournament_id: tournamentId,
        round_number: 1,
        board_number: 4,
        white_player_id: 'mock-student-7',
        black_player_id: 'mock-student-2',
        result: '1-0',
        white_points: 1,
        black_points: 0,
        notes: null,
        is_bye: false,
        white_player_name: 'Isabel Torres Moreno',
        black_player_name: 'Carlos López Silva'
      },
      // Ronda 2 (en progreso)
      {
        id: 'pairing-005',
        tournament_id: tournamentId,
        round_number: 2,
        board_number: 1,
        white_player_id: 'mock-student-1',
        black_player_id: 'mock-student-7',
        result: '*',
        white_points: null,
        black_points: null,
        notes: null,
        is_bye: false,
        white_player_name: 'Ana García Martín',
        black_player_name: 'Isabel Torres Moreno'
      },
      {
        id: 'pairing-006',
        tournament_id: tournamentId,
        round_number: 2,
        board_number: 2,
        white_player_id: 'mock-student-5',
        black_player_id: 'mock-student-3',
        result: '*',
        white_points: null,
        black_points: null,
        notes: null,
        is_bye: false,
        white_player_name: 'Laura Martínez Vega',
        black_player_name: 'María Rodríguez Pérez'
      }
    ] : [];

    // Mock de clasificación actual
    const mockStandings = tournament.status === 'in_progress' ? [
      { 
        position: 1, 
        student_id: 'mock-student-1', 
        student_name: 'Ana García Martín', 
        rating: 1250, 
        points: 1.0, 
        games_played: 1,
        wins: 1,
        draws: 0,
        losses: 0,
        buchholz: 0,
        performance: 1350
      },
      { 
        position: 1, 
        student_id: 'mock-student-5', 
        student_name: 'Laura Martínez Vega', 
        rating: 1150, 
        points: 1.0, 
        games_played: 1,
        wins: 1,
        draws: 0,
        losses: 0,
        buchholz: 0,
        performance: 1320
      },
      { 
        position: 1, 
        student_id: 'mock-student-7', 
        student_name: 'Isabel Torres Moreno', 
        rating: 1350, 
        points: 1.0, 
        games_played: 1,
        wins: 1,
        draws: 0,
        losses: 0,
        buchholz: 0,
        performance: 1280
      },
      { 
        position: 4, 
        student_id: 'mock-student-3', 
        student_name: 'María Rodríguez Pérez', 
        rating: 1480, 
        points: 0.5, 
        games_played: 1,
        wins: 0,
        draws: 1,
        losses: 0,
        buchholz: 0,
        performance: 1200
      },
      { 
        position: 4, 
        student_id: 'mock-student-6', 
        student_name: 'Pedro Ruiz Sánchez', 
        rating: 1200, 
        points: 0.5, 
        games_played: 1,
        wins: 0,
        draws: 1,
        losses: 0,
        buchholz: 0,
        performance: 1480
      }
    ] : [];

    // Mock de estudiantes disponibles para inscribir
    const availableStudents = [
      {
        id: 'mock-student-9',
        name: 'Roberto Sánchez López',
        rating: 1220,
        college: 'Escuela de Ajedrez Madrid Centro',
        email: 'roberto.sanchez@email.com'
      },
      {
        id: 'mock-student-10',
        name: 'Carmen Vega Ruiz',
        rating: 1190,
        college: 'Club de Ajedrez Barcelona',
        email: 'carmen.vega@email.com'
      }
    ];

    return {
      user: locals.user,
      tournamentId,
      tournament,
      registeredPlayers: mockRegisteredPlayers,
      rounds: mockRounds,
      pairings: mockPairings,
      standings: mockStandings,
      availableStudents
    };
  }
  
  return {
    user: locals.user,
    tournamentId,
    tournament: null,
    registeredPlayers: [],
    rounds: [],
    pairings: [],
    standings: [],
    availableStudents: []
  };
};
