/**
 * Lichess API Service for Broadcasts and Events
 */
export const lichessApi = {
  /**
   * Fetches top active and upcoming broadcasts from Lichess.
   */
  async getTopBroadcasts() {
    try {
      const response = await fetch('https://lichess.org/api/broadcast/top');
      if (!response.ok) throw new Error('Failed to fetch Lichess broadcasts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Lichess broadcasts:', error);
      return { active: [], upcoming: [], past: [] };
    }
  },

  /**
   * Formats a Lichess broadcast into a suggested Hito (Milestone)
   */
  async getBroadcast(id: string) {
    const res = await fetch(`https://lichess.org/api/broadcast/${id}`);
    if (!res.ok) throw new Error('Error al obtener broadcast de Lichess');
    return await res.json();
  },

  mapBroadcastToSuggestion(broadcast: any) {
    const tour = broadcast.tour;
    const round = broadcast.round;
    
    // Add 4 hours to start time for closing date
    const endDate = new Date(round.startsAt + 4 * 60 * 60 * 1000);
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    const formattedDate = endDate.toISOString().slice(0, 16);
    
    return {
      question: `¿Finalizará el ${round.name} de ${tour.name} según lo previsto?`,
      description: `Validación automática vía Lichess API (Tour: ${tour.id}).`,
      category: 'Torneos',
      endDate: endDate.toISOString(),
      oracleType: 'LICHESS',
      oracleConfig: {
        externalId: tour.id,
        tournamentId: tour.id,
        roundId: round.id,
        validationSource: 'LICHESS_API'
      }
    };
  }
};
