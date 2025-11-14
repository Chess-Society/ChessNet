import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
  console.log('🏆 Tournaments page server load - User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Tournaments page - Providing mock data');
    
    // Mock de torneos con diferentes estados
    const mockTournaments = [
      {
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
        players_registered: 12,
        created_at: '2024-02-15T00:00:00Z',
        updated_at: '2024-02-20T00:00:00Z',
        location: 'Escuela de Ajedrez Madrid Centro',
        organizer: 'ChessNet - Madrid',
        notes: 'Torneo ideal para estudiantes que llevan menos de 6 meses aprendiendo',
        rules: 'Reglamento FIDE simplificado para principiantes'
      },
      {
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
        rules: 'Reglamento FIDE oficial'
      },
      {
        id: 'tournament-003',
        name: 'Liga Escolar Enero',
        description: 'Torneo round robin para estudiantes avanzados',
        format: 'round_robin',
        time_control: '20+10',
        max_players: 6,
        entry_fee: 8.00,
        prize_pool: 40.00,
        start_date: '2024-01-20T10:00:00Z',
        end_date: '2024-01-20T16:00:00Z',
        registration_deadline: '2024-01-19T23:59:59Z',
        status: 'completed',
        current_round: 5,
        total_rounds: 5,
        players_registered: 6,
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-20T16:30:00Z',
        location: 'Escuela de Ajedrez Madrid Centro',
        organizer: 'ChessNet - Madrid',
        notes: 'Todos contra todos, ideal para estudiantes avanzados',
        rules: 'Reglamento FIDE oficial con desempates por Buchholz'
      },
      {
        id: 'tournament-004',
        name: 'Torneo Rápido Abril',
        description: 'Torneo de partidas rápidas',
        format: 'swiss',
        time_control: '5+3',
        max_players: 20,
        entry_fee: 3.00,
        prize_pool: 45.00,
        start_date: '2024-04-05T18:00:00Z',
        end_date: '2024-04-05T22:00:00Z',
        registration_deadline: '2024-04-04T23:59:59Z',
        status: 'draft',
        current_round: 0,
        total_rounds: 6,
        players_registered: 3,
        created_at: '2024-02-12T00:00:00Z',
        updated_at: '2024-02-12T00:00:00Z',
        location: 'Online - Plataforma ChessNet',
        organizer: 'ChessNet - Online',
        notes: 'Torneo online de partidas rápidas',
        rules: 'Reglamento de ajedrez online ChessNet'
      }
    ];

    // Estadísticas generales
    const tournamentStats = {
      total_tournaments: mockTournaments.length,
      upcoming_tournaments: mockTournaments.filter(t => t.status === 'upcoming').length,
      in_progress_tournaments: mockTournaments.filter(t => t.status === 'in_progress').length,
      completed_tournaments: mockTournaments.filter(t => t.status === 'completed').length,
      total_players_registered: mockTournaments.reduce((sum, t) => sum + t.players_registered, 0),
      total_prize_pool: mockTournaments.reduce((sum, t) => sum + t.prize_pool, 0),
      average_players_per_tournament: mockTournaments.length > 0 
        ? mockTournaments.reduce((sum, t) => sum + t.players_registered, 0) / mockTournaments.length 
        : 0
    };

    // Mock de estudiantes disponibles para inscribir
    const availableStudents = [
      {
        id: 'mock-student-1',
        name: 'Ana García Martín',
        rating: 1250,
        college: 'Escuela de Ajedrez Madrid Centro'
      },
      {
        id: 'mock-student-2',
        name: 'Carlos López Silva',
        rating: 1180,
        college: 'Escuela de Ajedrez Madrid Centro'
      },
      {
        id: 'mock-student-3',
        name: 'María Rodríguez Pérez',
        rating: 1480,
        college: 'Club de Ajedrez Barcelona'
      },
      {
        id: 'mock-student-4',
        name: 'David González Torres',
        rating: 1320,
        college: 'Club de Ajedrez Barcelona'
      },
      {
        id: 'mock-student-5',
        name: 'Laura Martínez Vega',
        rating: 1150,
        college: 'Escuela de Ajedrez Madrid Centro'
      },
      {
        id: 'mock-student-6',
        name: 'Pedro Ruiz Sánchez',
        rating: 1200,
        college: 'Club de Ajedrez Barcelona'
      }
    ];

    return {
      user: locals.user,
      tournaments: mockTournaments,
      tournamentStats,
      availableStudents
    };
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: Tournaments page - Fetching from Supabase');
  
  if (!locals.user) {
    return {
      user: null,
      tournaments: [],
      tournamentStats: {},
      availableStudents: []
    };
  }

  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options),
    },
  });

  try {
    // Obtener torneos del usuario
    const { data: tournaments, error: tournamentsError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('user_id', locals.user.id)
      .order('created_at', { ascending: false });

    if (tournamentsError) {
      console.error('❌ Error fetching tournaments:', tournamentsError);
      return {
        user: locals.user,
        tournaments: [],
        tournamentStats: {},
        availableStudents: []
      };
    }

    // Obtener estudiantes disponibles para inscribir
    const { data: availableStudents, error: studentsError } = await supabase
      .from('students')
      .select('id, first_name, last_name, chess_level, school_id')
      .eq('user_id', locals.user.id)
      .eq('active', true);

    if (studentsError) {
      console.error('❌ Error fetching students:', studentsError);
    }

    // Calcular estadísticas
    const tournamentStats = {
      total_tournaments: tournaments?.length || 0,
      upcoming_tournaments: tournaments?.filter(t => t.status === 'upcoming').length || 0,
      in_progress_tournaments: tournaments?.filter(t => t.status === 'in_progress').length || 0,
      completed_tournaments: tournaments?.filter(t => t.status === 'completed').length || 0,
      total_players_registered: tournaments?.reduce((sum, t) => sum + (t.players_registered || 0), 0) || 0,
      total_prize_pool: tournaments?.reduce((sum, t) => sum + (t.prize_pool || 0), 0) || 0,
      average_players_per_tournament: tournaments?.length > 0 
        ? tournaments.reduce((sum, t) => sum + (t.players_registered || 0), 0) / tournaments.length 
        : 0
    };

    return {
      user: locals.user,
      tournaments: tournaments || [],
      tournamentStats,
      availableStudents: availableStudents || []
    };

  } catch (err: any) {
    console.error('❌ Error in tournaments production mode:', err);
    return {
      user: locals.user,
      tournaments: [],
      tournamentStats: {},
      availableStudents: []
    };
  }
};