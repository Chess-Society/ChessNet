<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Trophy,
    Users,
    Play,
    Pause,
    Settings,
    UserPlus,
    Calendar,
    Clock,
    MapPin,
    DollarSign,
    Award,
    Target,
    BarChart3,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Eye,
    Edit3,
    Download,
    RefreshCw,
    Zap,
    Medal,
    Crown,
    Star,
    TrendingUp,
    Timer,
    Flag,
    Trash2
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { tournamentDB } from '$lib/stores/tournaments';

  export let data: PageData;

  let selectedTab: 'overview' | 'players' | 'rounds' | 'standings' | 'settings' = 'overview';
  let showRegisterModal = false;
  let selectedStudentId = '';
  let isSubmitting = false;

  // Datos del torneo
  $: tournament = data.tournament;
  $: registeredPlayers = data.registeredPlayers || [];
  $: rounds = data.rounds || [];
  $: pairings = data.pairings || [];
  
  // Cargar emparejamientos cuando el torneo esté en progreso
  let currentRoundPairings: any[] = [];
  
  $: if (tournament?.status === 'in_progress' && tournament?.current_round) {
    loadCurrentRoundPairings();
  }
  
  const loadCurrentRoundPairings = async () => {
    if (!tournament?.id || !tournament?.current_round) return;
    
    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      const pairings = await tournamentDB.getRoundPairings(tournament.id, tournament.current_round);
      currentRoundPairings = pairings;
      console.log(`✅ Loaded ${pairings.length} pairings for round ${tournament.current_round}`);
    } catch (error) {
      console.error('❌ Error loading pairings:', error);
      currentRoundPairings = [];
    }
  };

  // Sincronizar datos mock del servidor con IndexedDB
  const syncMockDataToIndexedDB = async () => {
    if (!tournament) return;
    
    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      
      // Verificar si el torneo ya existe en IndexedDB
      const existingTournament = await tournamentDB.getTournament(tournament.id);
      
      if (!existingTournament) {
        console.log('🔄 Syncing mock tournament to IndexedDB:', tournament.id);
        
        // Crear el torneo en IndexedDB con el ID específico del mock
        const newTournament = {
          ...tournament,
          id: tournament.id, // Usar el ID del mock, no generar uno nuevo
          created_at: tournament.created_at,
          updated_at: tournament.updated_at
        };
        
        // Insertar directamente en IndexedDB con el ID específico
        const database = await tournamentDB.init();
        const transaction = database.transaction(['tournaments'], 'readwrite');
        const store = transaction.objectStore('tournaments');
        
        await new Promise((resolve, reject) => {
          const request = store.add(newTournament);
          request.onsuccess = () => {
            console.log('✅ Tournament synced to IndexedDB:', tournament.id);
            resolve(newTournament);
          };
          request.onerror = () => reject(request.error);
        });
        
        // Registrar jugadores en IndexedDB (solo si no existen)
        for (const player of registeredPlayers) {
          try {
            await tournamentDB.registerPlayer({
              tournament_id: player.tournament_id,
              student_id: player.student_id,
              student_name: player.student_name,
              student_rating: player.student_rating,
              status: player.status,
              notes: player.notes
            });
          } catch (playerError) {
            // Si el jugador ya existe, continuar
            if (playerError.name === 'ConstraintError') {
              console.log('⚠️ Player already exists:', player.student_name);
              continue;
            }
            throw playerError;
          }
        }
        
        console.log('✅ Mock data synced to IndexedDB');
      }
    } catch (error) {
      console.error('❌ Error syncing mock data:', error);
    }
  };

  // Limpiar datos duplicados en IndexedDB
  const clearDuplicateTournaments = async () => {
    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      const database = await tournamentDB.init();
      
      // Obtener todos los torneos
      const transaction = database.transaction(['tournaments'], 'readwrite');
      const store = transaction.objectStore('tournaments');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const tournaments = request.result || [];
        const mockTournaments = tournaments.filter(t => t.id.startsWith('tournament-'));
        const dynamicTournaments = tournaments.filter(t => t.id.startsWith('tournament_'));
        
        // Eliminar torneos dinámicos duplicados
        dynamicTournaments.forEach(tournament => {
          const mockEquivalent = mockTournaments.find(mt => mt.name === tournament.name);
          if (mockEquivalent) {
            console.log('🗑️ Removing duplicate tournament:', tournament.id);
            store.delete(tournament.id);
          }
        });
      };
    } catch (error) {
      console.error('❌ Error clearing duplicates:', error);
    }
  };

  // Sincronizar datos cuando se cargue la página
  $: if (tournament && registeredPlayers.length > 0) {
    clearDuplicateTournaments().then(() => {
      syncMockDataToIndexedDB();
    });
  }
  $: standings = data.standings || [];

  // Funciones de formato
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { class: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Borrador', icon: Edit3 },
      upcoming: { class: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Próximo', icon: Calendar },
      in_progress: { class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'En Curso', icon: Play },
      completed: { class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Completado', icon: CheckCircle },
      cancelled: { class: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Cancelado', icon: XCircle }
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getFormatLabel = (format: string) => {
    const labels = {
      swiss: 'Sistema Suizo',
      round_robin: 'Round Robin',
      knockout: 'Eliminatorio',
      single_elimination: 'Eliminación Simple'
    };
    return labels[format as keyof typeof labels] || format;
  };

  const getRoundStatusBadge = (status: string) => {
    const badges = {
      not_started: { class: 'bg-gray-500/20 text-gray-400', label: 'No iniciada', icon: Clock },
      in_progress: { class: 'bg-yellow-500/20 text-yellow-400', label: 'En curso', icon: Play },
      completed: { class: 'bg-emerald-500/20 text-emerald-400', label: 'Completada', icon: CheckCircle }
    };
    return badges[status as keyof typeof badges] || badges.not_started;
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case '1-0': return 'text-emerald-400';
      case '0-1': return 'text-red-400';
      case '1/2-1/2': return 'text-yellow-400';
      case '*': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case '1-0': return '1-0';
      case '0-1': return '0-1';
      case '1/2-1/2': return '½-½';
      case '*': return 'En juego';
      default: return 'Sin resultado';
    }
  };

  const handleRegisterPlayer = async () => {
    if (!selectedStudentId || isSubmitting) return;

    isSubmitting = true;
    
    try {
      const selectedStudent = data.availableStudents?.find(s => s.id === selectedStudentId);
      if (!selectedStudent) {
        throw new Error('Estudiante no encontrado');
      }

      await tournamentDB.registerPlayer({
        tournament_id: tournament.id,
        student_id: selectedStudent.id,
        student_name: selectedStudent.name,
        student_rating: selectedStudent.rating,
        status: 'registered'
      });

      console.log('✅ Player registered successfully');
      showRegisterModal = false;
      selectedStudentId = '';
      
      // Actualizar la página
      location.reload();
    } catch (error) {
      console.error('❌ Error registering player:', error);
      alert('Error al inscribir el jugador');
    } finally {
      isSubmitting = false;
    }
  };

  const handleStartTournament = async () => {
    if (!tournament || tournament.status !== 'upcoming') return;

    if (!confirm(`¿Estás seguro de que quieres iniciar el torneo "${tournament.name}"? Una vez iniciado, no podrás modificar la configuración.`)) {
      return;
    }

    try {
      // Limpiar duplicados y sincronizar datos
      await clearDuplicateTournaments();
      await syncMockDataToIndexedDB();
      
      const { tournamentDB } = await import('$lib/stores/tournaments');
      
      // Verificar que el torneo existe en IndexedDB
      const existingTournament = await tournamentDB.getTournament(tournament.id);
      if (!existingTournament) {
        throw new Error(`Torneo ${tournament.id} no encontrado en IndexedDB`);
      }
      
      console.log('🎯 Starting tournament:', tournament.id, 'Status:', existingTournament.status);
      
      // 1. Actualizar el estado del torneo
      await tournamentDB.updateTournament(tournament.id, {
        status: 'in_progress',
        current_round: 1
      });

      // 2. Generar emparejamientos para la primera ronda
      await tournamentDB.generateFirstRoundPairings(tournament.id);

      console.log('✅ Tournament started with pairings generated');
      
      // Actualizar el estado local del torneo
      tournament = {
        ...tournament,
        status: 'in_progress',
        current_round: 1
      };
      
      // Recargar emparejamientos
      await loadCurrentRoundPairings();
      
      // Mostrar mensaje de éxito
      alert('¡Torneo iniciado correctamente! Se han generado los emparejamientos para la primera ronda.');
      
    } catch (error) {
      console.error('❌ Error starting tournament:', error);
      alert(`Error al iniciar el torneo: ${error.message}`);
    }
  };

  const canStartTournament = () => {
    return tournament?.status === 'upcoming' && 
           registeredPlayers.length >= 2 && 
           new Date() >= new Date(tournament.registration_deadline);
  };

  const isRegistrationOpen = () => {
    if (!tournament) return false;
    const now = new Date();
    const deadline = new Date(tournament.registration_deadline);
    return now < deadline && 
           tournament.status !== 'completed' && 
           tournament.status !== 'cancelled' &&
           registeredPlayers.length < tournament.max_players;
  };

  const getPlayerName = (playerId: string) => {
    if (!playerId) return 'BYE';
    const player = registeredPlayers.find(p => p.id === playerId);
    return player ? player.student_name : 'Jugador desconocido';
  };

  // Función de debug para limpiar IndexedDB
  const clearIndexedDB = async () => {
    if (!confirm('¿Estás seguro de que quieres limpiar toda la base de datos de torneos? Esto eliminará todos los datos.')) {
      return;
    }
    
    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      const database = await tournamentDB.init();
      
      // Limpiar todas las tablas
      const transaction = database.transaction(['tournaments', 'tournament_players', 'tournament_rounds', 'tournament_pairings'], 'readwrite');
      
      transaction.objectStore('tournaments').clear();
      transaction.objectStore('tournament_players').clear();
      transaction.objectStore('tournament_rounds').clear();
      transaction.objectStore('tournament_pairings').clear();
      
      transaction.oncomplete = () => {
        console.log('🗑️ IndexedDB cleared successfully');
        alert('Base de datos limpiada. Recarga la página para sincronizar los datos mock.');
        location.reload();
      };
      
      transaction.onerror = () => {
        console.error('❌ Error clearing IndexedDB:', transaction.error);
        alert('Error al limpiar la base de datos');
      };
    } catch (error) {
      console.error('❌ Error clearing IndexedDB:', error);
      alert('Error al limpiar la base de datos');
    }
  };

  // Actualizar resultado de un emparejamiento
  const handleUpdateResult = async (pairingId: string, result: '1-0' | '0-1' | '1/2-1/2') => {
    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      await tournamentDB.updatePairingResult(pairingId, result);
      
      // Actualizar el estado local inmediatamente
      const pairingIndex = currentRoundPairings.findIndex(p => p.id === pairingId);
      if (pairingIndex !== -1) {
        // Calcular puntos según el resultado
        let whitePoints = 0;
        let blackPoints = 0;
        
        switch (result) {
          case '1-0':
            whitePoints = 1;
            blackPoints = 0;
            break;
          case '0-1':
            whitePoints = 0;
            blackPoints = 1;
            break;
          case '1/2-1/2':
            whitePoints = 0.5;
            blackPoints = 0.5;
            break;
        }
        
        // Actualizar el emparejamiento local
        currentRoundPairings[pairingIndex] = {
          ...currentRoundPairings[pairingIndex],
          result,
          white_points: whitePoints,
          black_points: blackPoints
        };
        
        // Forzar reactividad
        currentRoundPairings = [...currentRoundPairings];
        
        // Actualizar clasificación automáticamente
        calculateStandings().then(standings => {
          currentStandings = standings;
        });
      }
      
      console.log('✅ Result updated:', result);
    } catch (error) {
      console.error('❌ Error updating result:', error);
      alert('Error al actualizar el resultado');
    }
  };

  // Finalizar ronda actual
  const handleFinishRound = async () => {
    if (!tournament || !tournament.current_round) return;

    if (!confirm(`¿Estás seguro de que quieres finalizar la ronda ${tournament.current_round}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      
      console.log(`🏁 Finishing round ${tournament.current_round} of tournament ${tournament.id}`);
      
      // 1. Finalizar la ronda actual
      await tournamentDB.finishRound(tournament.id, tournament.current_round);
      console.log(`✅ Round ${tournament.current_round} finished`);
      
      // 2. Actualizar ratings después de la ronda
      await tournamentDB.updateRatingsAfterRound(tournament.id, tournament.current_round);
      console.log(`✅ Ratings updated after round ${tournament.current_round}`);
      
      // 3. Verificar si es la última ronda
      if (tournament.current_round >= tournament.total_rounds) {
        console.log('🏆 Last round completed, finishing tournament');
        
        // Finalizar el torneo
        await tournamentDB.finishTournament(tournament.id);
        
        // Actualizar estado local
        tournament = {
          ...tournament,
          status: 'completed'
        };
        
        alert('¡Torneo finalizado! Se ha completado la última ronda.');
      } else {
        const nextRound = tournament.current_round + 1;
        console.log(`🔄 Generating next round: ${nextRound}`);
        
        // Generar siguiente ronda
        await tournamentDB.generateNextRound(tournament.id);
        console.log(`✅ Next round ${nextRound} generated`);
        
        // Actualizar estado del torneo
        await tournamentDB.updateTournament(tournament.id, {
          current_round: nextRound
        });
        console.log(`✅ Tournament updated to round ${nextRound}`);
        
        // Actualizar estado local
        tournament = {
          ...tournament,
          current_round: nextRound
        };
        
        // Recargar emparejamientos para la nueva ronda
        console.log(`🔄 Loading pairings for round ${nextRound}`);
        await loadCurrentRoundPairings();
        
        alert(`¡Ronda ${nextRound - 1} finalizada! Se ha generado la ronda ${nextRound}.`);
      }
      
    } catch (error) {
      console.error('❌ Error finishing round:', error);
      alert(`Error al finalizar la ronda: ${error.message}`);
    }
  };

  // Verificar si se puede finalizar la ronda (reactivo)
  let canFinishCurrentRound = false;
  
  $: canFinishCurrentRound = tournament && currentRoundPairings.length > 0 && 
    currentRoundPairings.every(pairing => 
      pairing.is_bye || (pairing.result && pairing.result !== '*')
    );

  // Calcular clasificación actual
  const calculateStandings = async () => {
    if (!tournament) return [];
    
    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      const allPairings = await tournamentDB.getAllTournamentPairings(tournament.id);
      
      // Obtener jugadores actualizados (con ratings actualizados)
      const updatedPlayers = await tournamentDB.getTournamentPlayers(tournament.id);
      
      // Calcular puntos de cada jugador
      const playerStats = new Map();
      
      // Inicializar estadísticas con ratings actualizados
      updatedPlayers.forEach(player => {
        playerStats.set(player.id, {
          id: player.id,
          name: player.student_name,
          rating: player.student_rating,
          points: 0,
          games: 0,
          wins: 0,
          draws: 0,
          losses: 0
        });
      });
      
      // Procesar resultados
      allPairings.forEach(pairing => {
        if (pairing.result && pairing.result !== '*') {
          const whiteStats = playerStats.get(pairing.white_player_id);
          const blackStats = playerStats.get(pairing.black_player_id);
          
          if (whiteStats) {
            whiteStats.games++;
            whiteStats.points += pairing.white_points || 0;
            if (pairing.result === '1-0') whiteStats.wins++;
            else if (pairing.result === '1/2-1/2') whiteStats.draws++;
            else if (pairing.result === '0-1') whiteStats.losses++;
          }
          
          if (blackStats) {
            blackStats.games++;
            blackStats.points += pairing.black_points || 0;
            if (pairing.result === '0-1') blackStats.wins++;
            else if (pairing.result === '1/2-1/2') blackStats.draws++;
            else if (pairing.result === '1-0') blackStats.losses++;
          }
        }
      });
      
      // Convertir a array y ordenar
      const standings = Array.from(playerStats.values())
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          return b.rating - a.rating;
        })
        .map((player, index) => ({
          position: index + 1,
          ...player
        }));
      
      return standings;
    } catch (error) {
      console.error('❌ Error calculating standings:', error);
      return [];
    }
  };

  // Clasificación reactiva
  let currentStandings: any[] = [];
  let ratingChanges: Map<string, number> = new Map();
  
  $: if (tournament && tournament.status === 'in_progress') {
    calculateStandings().then(standings => {
      currentStandings = standings;
    });
  }

  // Función para obtener el cambio de rating de un jugador
  const getRatingChange = (playerId: string): number => {
    return ratingChanges.get(playerId) || 0;
  };

  // Función para formatear cambio de rating
  const formatRatingChange = (change: number): string => {
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '0';
  };

  // Función para obtener color del cambio de rating
  const getRatingChangeColor = (change: number): string => {
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };
</script>

<svelte:head>
  <title>{tournament?.name || 'Torneo'} - ChessNet</title>
</svelte:head>

{#if !tournament}
  <div class="min-h-screen bg-slate-900 flex items-center justify-center">
    <div class="text-center">
      <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-white mb-2">Torneo no encontrado</h2>
      <p class="text-slate-400 mb-4">No se pudo cargar la información del torneo</p>
      <button
        on:click={() => goto('/tournaments')}
        class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
      >
        Volver a Torneos
      </button>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <div class="border-b border-slate-700/50 bg-slate-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div class="flex items-center space-x-4">
            <button
              on:click={() => goto('/tournaments')}
              class="p-2 text-slate-400 hover:text-white transition-colors"
              title="Volver a Torneos"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div class="p-2 bg-orange-500/20 rounded-lg">
              <Trophy class="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">{tournament.name}</h1>
              <p class="text-slate-400">Gestión del torneo</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            {#if tournament.status}
              {@const statusBadge = getStatusBadge(tournament.status)}
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {statusBadge.class}">
                <svelte:component this={statusBadge.icon} class="w-4 h-4 mr-1" />
                {statusBadge.label}
              </span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Información del Torneo -->
    <div class="bg-slate-800/50 border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Información Básica -->
          <div class="space-y-4">
            <h3 class="font-semibold text-white">Información Básica</h3>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Calendar class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-300">{formatDate(tournament.start_date)}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Clock class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-300">{tournament.time_control}</span>
              </div>
              <div class="flex items-center space-x-2">
                <MapPin class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-300">{tournament.location}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Target class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-300">{getFormatLabel(tournament.format)}</span>
              </div>
            </div>
          </div>

          <!-- Métricas -->
          <div class="space-y-4">
            <h3 class="font-semibold text-white">Métricas</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-lg font-bold text-white">{registeredPlayers.length}/{tournament.max_players}</div>
                <div class="text-xs text-slate-400">Jugadores</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-white">{tournament.current_round}/{tournament.total_rounds}</div>
                <div class="text-xs text-slate-400">Rondas</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-emerald-400">{formatCurrency(tournament.entry_fee)}</div>
                <div class="text-xs text-slate-400">Inscripción</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-emerald-400">{formatCurrency(tournament.prize_pool)}</div>
                <div class="text-xs text-slate-400">Premios</div>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="space-y-4">
            <h3 class="font-semibold text-white">Acciones</h3>
            <div class="space-y-2">
              {#if isRegistrationOpen()}
                <button
                  on:click={() => showRegisterModal = true}
                  class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <UserPlus class="w-4 h-4" />
                  <span>Inscribir Jugador</span>
                </button>
              {/if}
              
              {#if canStartTournament()}
                <button
                  on:click={handleStartTournament}
                  class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  <Play class="w-4 h-4" />
                  <span>Iniciar Torneo</span>
                </button>
              {/if}
              
              <!-- Botón de debug temporal -->
              <button
                on:click={clearIndexedDB}
                class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                <Trash2 class="w-4 h-4" />
                <span>Limpiar DB (Debug)</span>
              </button>
              
              <button
                on:click={() => goto(`/tournaments/${tournament.id}/edit`)}
                class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Settings class="w-4 h-4" />
                <span>Configurar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-12">
          <button
            on:click={() => selectedTab = 'overview'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'overview' 
              ? 'border-orange-500 text-orange-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Resumen
          </button>
          <button
            on:click={() => selectedTab = 'players'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'players' 
              ? 'border-orange-500 text-orange-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Jugadores ({registeredPlayers.length})
          </button>
          <button
            on:click={() => selectedTab = 'rounds'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'rounds' 
              ? 'border-orange-500 text-orange-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Rondas
          </button>
          <button
            on:click={() => selectedTab = 'standings'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'standings' 
              ? 'border-orange-500 text-orange-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Clasificación
          </button>
          <button
            on:click={() => selectedTab = 'settings'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'settings' 
              ? 'border-orange-500 text-orange-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Configuración
          </button>
        </nav>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Tab: Resumen -->
      {#if selectedTab === 'overview'}
        <div class="space-y-8">
          
          <!-- Progreso del Torneo -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Progreso del Torneo</h3>
            
            <div class="space-y-4">
              <!-- Barra de progreso -->
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300">Ronda {tournament.current_round} de {tournament.total_rounds}</span>
                  <span class="text-slate-400">{Math.round((tournament.current_round / tournament.total_rounds) * 100)}% completado</span>
                </div>
                <div class="w-full bg-slate-700/50 rounded-full h-3">
                  <div 
                    class="bg-orange-500 h-3 rounded-full transition-all duration-300"
                    style="width: {(tournament.current_round / tournament.total_rounds) * 100}%"
                  ></div>
                </div>
              </div>

              <!-- Estado actual -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-slate-700/30 rounded-lg text-center">
                  <div class="text-2xl font-bold text-white mb-1">{registeredPlayers.length}</div>
                  <div class="text-sm text-slate-400">Jugadores Inscritos</div>
                </div>
                <div class="p-4 bg-slate-700/30 rounded-lg text-center">
                  <div class="text-2xl font-bold text-white mb-1">{rounds.filter(r => r.status === 'completed').length}</div>
                  <div class="text-sm text-slate-400">Rondas Completadas</div>
                </div>
                <div class="p-4 bg-slate-700/30 rounded-lg text-center">
                  <div class="text-2xl font-bold text-white mb-1">{pairings.filter(p => p.result && p.result !== '*').length}</div>
                  <div class="text-sm text-slate-400">Partidas Jugadas</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Emparejamientos actuales -->
          {#if tournament.status === 'in_progress' && currentRoundPairings.length > 0}
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                <Target class="w-5 h-5 mr-2 text-blue-400" />
                Ronda {tournament.current_round} - Emparejamientos
              </h3>
              
              <div class="space-y-3">
                {#each currentRoundPairings as pairing}
                  <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div class="flex items-center space-x-4">
                      <div class="text-sm font-medium text-slate-400">
                        Tablero {pairing.board_number}
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-white">{getPlayerName(pairing.white_player_id)}</span>
                        <span class="text-slate-400">vs</span>
                        <span class="text-white">{getPlayerName(pairing.black_player_id)}</span>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-3">
                      {#if pairing.is_bye}
                        <span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded">
                          BYE
                        </span>
                      {:else}
                        <!-- Controles de resultado -->
                        <div class="flex items-center space-x-2">
                          <button
                            on:click={() => handleUpdateResult(pairing.id, '1-0')}
                            class="px-3 py-1 text-xs rounded transition-colors {pairing.result === '1-0' 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-600 text-slate-300 hover:bg-emerald-600 hover:text-white'}"
                            title="Victoria de las blancas"
                          >
                            1-0
                          </button>
                          <button
                            on:click={() => handleUpdateResult(pairing.id, '1/2-1/2')}
                            class="px-3 py-1 text-xs rounded transition-colors {pairing.result === '1/2-1/2' 
                              ? 'bg-yellow-600 text-white' 
                              : 'bg-slate-600 text-slate-300 hover:bg-yellow-600 hover:text-white'}"
                            title="Tablas"
                          >
                            ½-½
                          </button>
                          <button
                            on:click={() => handleUpdateResult(pairing.id, '0-1')}
                            class="px-3 py-1 text-xs rounded transition-colors {pairing.result === '0-1' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-slate-600 text-slate-300 hover:bg-red-600 hover:text-white'}"
                            title="Victoria de las negras"
                          >
                            0-1
                          </button>
                        </div>
                        
                        <!-- Estado actual -->
                        <div class="text-sm">
                          {#if pairing.result && pairing.result !== '*'}
                            <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">
                              {getResultLabel(pairing.result)}
                            </span>
                          {:else}
                            <span class="px-2 py-1 bg-slate-500/50 text-slate-400 rounded">
                              Pendiente
                            </span>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
              
              <!-- Botón para finalizar ronda -->
              {#if tournament.status === 'in_progress' && canFinishCurrentRound}
                <div class="mt-6 pt-4 border-t border-slate-700/50">
                  <button
                    on:click={handleFinishRound}
                    class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <CheckCircle class="w-5 h-5" />
                    <span>
                      {tournament.current_round >= tournament.total_rounds 
                        ? 'Finalizar Torneo' 
                        : `Finalizar Ronda ${tournament.current_round}`}
                    </span>
                  </button>
                </div>
              {/if}
            </div>
          {/if}

          <!-- Descripción -->
          {#if tournament.description}
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Descripción</h3>
              <p class="text-slate-300">{tournament.description}</p>
            </div>
          {/if}

          <!-- Últimas Partidas -->
          {#if pairings.length > 0}
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Últimas Partidas</h3>
              <div class="space-y-3">
                {#each pairings.slice(-5) as pairing}
                  <div class="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div class="flex items-center space-x-4">
                      <div class="text-sm font-medium text-white">Mesa {pairing.board_number}</div>
                      <div class="text-sm text-slate-300">
                        {pairing.white_player_name} vs {pairing.black_player_name}
                      </div>
                    </div>
                    <div class="text-sm font-medium {getResultColor(pairing.result)}">
                      {getResultLabel(pairing.result)}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Tab: Jugadores -->
      {#if selectedTab === 'players'}
        <div class="space-y-6">
          
          <!-- Lista de Jugadores -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <div class="p-6 border-b border-slate-700/50">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-white">Jugadores Inscritos</h3>
                {#if isRegistrationOpen()}
                  <button
                    on:click={() => showRegisterModal = true}
                    class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <UserPlus class="w-4 h-4" />
                    <span>Inscribir Jugador</span>
                  </button>
                {/if}
              </div>
            </div>
            
            <div class="p-6">
              {#if registeredPlayers.length > 0}
                <div class="space-y-3">
                  {#each registeredPlayers as player}
                    <div class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div class="flex items-center space-x-4">
                        <div class="p-2 bg-blue-500/20 rounded-lg">
                          <Users class="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 class="font-medium text-white">{player.student_name}</h4>
                          <div class="text-sm text-slate-400">Rating: {player.student_rating}</div>
                        </div>
                      </div>
                      
                      <div class="flex items-center space-x-4">
                        <div class="text-right">
                          <div class="text-sm text-slate-300">
                            {player.status === 'confirmed' ? 'Confirmado' : 
                             player.status === 'registered' ? 'Registrado' : 'Retirado'}
                          </div>
                          <div class="text-xs text-slate-400">
                            {formatDate(player.registration_date)}
                          </div>
                        </div>
                        
                        <div class="w-3 h-3 rounded-full {
                          player.status === 'confirmed' ? 'bg-emerald-400' :
                          player.status === 'registered' ? 'bg-yellow-400' : 'bg-red-400'
                        }"></div>
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-8">
                  <Users class="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p class="text-slate-400">No hay jugadores inscritos</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <!-- Tab: Rondas -->
      {#if selectedTab === 'rounds'}
        <div class="space-y-6">
          
          {#if rounds.length > 0}
            {#each rounds as round}
              <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-white">Ronda {round.round_number}</h3>
                  {#if round.status}
                    {@const roundBadge = getRoundStatusBadge(round.status)}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {roundBadge.class}">
                      <svelte:component this={roundBadge.icon} class="w-3 h-3 mr-1" />
                      {roundBadge.label}
                    </span>
                  {/if}
                </div>

                <!-- Emparejamientos de la ronda -->
                {#if pairings.length > 0}
                  {@const roundPairings = pairings.filter(p => p.round_number === round.round_number)}
                  {#if roundPairings.length > 0}
                  <div class="space-y-3">
                    {#each roundPairings as pairing}
                      <div class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                        <div class="flex items-center space-x-4">
                          <div class="text-sm font-medium text-slate-400">Mesa {pairing.board_number}</div>
                          <div class="text-sm text-white">
                            ⚪ {pairing.white_player_name}
                          </div>
                          <div class="text-slate-400">vs</div>
                          <div class="text-sm text-white">
                            ⚫ {pairing.black_player_name}
                          </div>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                          <div class="text-lg font-medium {getResultColor(pairing.result)}">
                            {getResultLabel(pairing.result)}
                          </div>
                          {#if pairing.result === '*'}
                            <button class="text-slate-400 hover:text-white transition-colors">
                              <Edit3 class="w-4 h-4" />
                            </button>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                  {:else}
                    <p class="text-slate-400 text-center py-4">No hay emparejamientos para esta ronda</p>
                  {/if}
                {/if}
              </div>
            {/each}
          {:else}
            <div class="text-center py-12">
              <Calendar class="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p class="text-slate-400">No hay rondas programadas</p>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Tab: Clasificación -->
      {#if selectedTab === 'standings'}
        <div class="space-y-6">
          
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <div class="p-6 border-b border-slate-700/50">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-white">Clasificación Actual</h3>
                {#if tournament.status === 'in_progress'}
                  <button
                    on:click={() => calculateStandings().then(standings => currentStandings = standings)}
                    class="flex items-center space-x-2 px-3 py-1 bg-slate-600 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
                  >
                    <RefreshCw class="w-4 h-4" />
                    <span>Actualizar</span>
                  </button>
                {/if}
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-700/30">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Pos</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Jugador</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Rating</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Cambio</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Puntos</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Partidas</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">W-D-L</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                  {#each currentStandings as standing}
                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          {#if standing.position === 1}
                            <Crown class="w-4 h-4 text-yellow-400" />
                          {:else if standing.position === 2}
                            <Medal class="w-4 h-4 text-slate-300" />
                          {:else if standing.position === 3}
                            <Medal class="w-4 h-4 text-orange-400" />
                          {/if}
                          <span class="text-sm font-medium text-white">{standing.position}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-white">{standing.name}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-slate-300">{standing.rating}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium {getRatingChangeColor(getRatingChange(standing.id))}">
                          {formatRatingChange(getRatingChange(standing.id))}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-bold text-white">{standing.points}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-slate-300">{standing.games}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-slate-300">
                          {standing.wins}-{standing.draws}-{standing.losses}
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            
            {#if currentStandings.length === 0}
              <div class="text-center py-12">
                <BarChart3 class="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p class="text-slate-400">
                  {tournament.status === 'in_progress' 
                    ? 'No hay resultados aún' 
                    : 'No hay clasificación disponible'}
                </p>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Tab: Configuración -->
      {#if selectedTab === 'settings'}
        <div class="space-y-6">
          
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Configuración del Torneo</h3>
            
            <div class="space-y-4">
              <button
                on:click={() => goto(`/tournaments/${tournament.id}/edit`)}
                class="w-full flex items-center justify-center space-x-2 p-4 border border-slate-600/50 rounded-lg hover:bg-slate-700/30 transition-colors"
              >
                <Edit3 class="w-5 h-5 text-slate-400" />
                <span class="text-slate-300">Editar Información del Torneo</span>
              </button>
              
              <button class="w-full flex items-center justify-center space-x-2 p-4 border border-slate-600/50 rounded-lg hover:bg-slate-700/30 transition-colors">
                <Download class="w-5 h-5 text-slate-400" />
                <span class="text-slate-300">Exportar Datos del Torneo</span>
              </button>
              
              <button class="w-full flex items-center justify-center space-x-2 p-4 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                <XCircle class="w-5 h-5" />
                <span>Cancelar Torneo</span>
              </button>
            </div>
          </div>
        </div>
      {/if}
    </main>
  </div>

  <!-- Modal de Inscribir Jugador -->
  {#if showRegisterModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-white mb-4">Inscribir Jugador</h3>
        
        <div class="space-y-4">
          <div>
            <label for="student_select" class="block text-sm font-medium text-slate-300 mb-2">Seleccionar Estudiante</label>
            <select
              id="student_select"
              bind:value={selectedStudentId}
              class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="">Selecciona un estudiante</option>
              {#each data.availableStudents || [] as student}
                <option value={student.id}>{student.name} (Rating: {student.rating})</option>
              {/each}
            </select>
          </div>
          
          <div class="flex items-center justify-end space-x-3">
            <button
              on:click={() => { showRegisterModal = false; selectedStudentId = ''; }}
              class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              on:click={handleRegisterPlayer}
              disabled={!selectedStudentId || isSubmitting}
              class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
            >
              {#if isSubmitting}
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Inscribiendo...</span>
              {:else}
                <UserPlus class="w-4 h-4" />
                <span>Inscribir</span>
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}
