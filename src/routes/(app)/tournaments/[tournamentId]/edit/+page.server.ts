import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const { tournamentId } = params;
  console.log('🏆 Tournament edit page server load - Tournament:', tournamentId, 'User:', locals.user?.email || 'none');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Tournament edit page - Using mock data');
    
    // Mock del torneo específico
    const mockTournaments: Record<string, any> = {
      'tournament-001': {
        id: 'tournament-001',
        name: 'Torneo Principiantes Marzo',
        description: 'Torneo mensual para estudiantes principiantes',
        format: 'swiss',
        time_control: '15+10',
        max_players: 16,
        entry_fee: 5.00,
        prize_pool: 80.00,
        start_date: '2024-03-15T10:00:00Z',
        end_date: '2024-03-15T18:00:00Z',
        registration_deadline: '2024-03-14T23:59:59Z',
        status: 'upcoming',
        current_round: 0,
        total_rounds: 4,
        players_registered: 8,
        location: 'Centro de Desarrollo Local',
        organizer: 'ChessNet',
        notes: 'Torneo para estudiantes de nivel principiante',
        rules: 'Reglamento FIDE simplificado para principiantes',
        user_id: 'dev-user-123'
      },
      'tournament-002': {
        id: 'tournament-002',
        name: 'Copa ChessNet Febrero',
        description: 'Torneo eliminatorio mensual',
        format: 'knockout',
        time_control: '25+5',
        max_players: 8,
        entry_fee: 10.00,
        prize_pool: 60.00,
        start_date: '2024-02-20T09:00:00Z',
        end_date: '2024-02-20T17:00:00Z',
        registration_deadline: '2024-02-19T23:59:59Z',
        status: 'completed',
        current_round: 3,
        total_rounds: 3,
        players_registered: 8,
        location: 'Centro de Desarrollo Local',
        organizer: 'ChessNet',
        notes: 'Torneo eliminatorio para estudiantes intermedios',
        rules: 'Reglamento FIDE estándar',
        user_id: 'dev-user-123'
      }
    };

    const tournament = mockTournaments[tournamentId];
    
    if (!tournament) {
      throw new Error(`Tournament not found: ${tournamentId}`);
    }

    return {
      user: locals.user,
      tournament
    };
  }
  
  // ===== LÓGICA NORMAL PARA PRODUCCIÓN =====
  try {
    // Aquí iría la lógica para obtener el torneo real de la base de datos
    // Por ahora, devolvemos datos básicos
    const tournament = {
      id: tournamentId,
      name: 'Torneo de Producción',
      description: 'Torneo en producción',
      format: 'swiss',
      time_control: '15+10',
      max_players: 16,
      entry_fee: 5.00,
      prize_pool: 80.00,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      registration_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      current_round: 0,
      total_rounds: 4,
      players_registered: 0,
      location: 'Centro de Producción',
      organizer: 'ChessNet',
      notes: '',
      rules: '',
      user_id: locals.user?.id || 'unknown'
    };
    
    return {
      user: locals.user,
      tournament
    };
    
  } catch (error) {
    console.error('❌ Error loading tournament for edit:', error);
    throw new Error(`Tournament not found: ${tournamentId}`);
  }
};
