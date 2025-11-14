<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Trophy,
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    Users,
    DollarSign,
    MapPin,
    Play,
    Pause,
    CheckCircle,
    AlertCircle,
    Edit3,
    Eye,
    Settings,
    ChevronDown,
    ChevronRight,
    Target,
    Award,
    TrendingUp,
    Trash2
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let searchTerm = '';
  let statusFilter = 'all';
  let formatFilter = 'all';
  let showFilters = false;

  // Datos reactivos
  $: filteredTournaments = data.tournaments?.filter((tournament) => {
    const matchesSearch = !searchTerm || 
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    const matchesFormat = formatFilter === 'all' || tournament.format === formatFilter;
    
    return matchesSearch && matchesStatus && matchesFormat;
  }) || [];

  const handleCreateTournament = () => {
    goto('/tournaments/create');
  };

  const handleViewTournament = (tournamentId: string) => {
    goto(`/tournaments/${tournamentId}`);
  };

  const handleEditTournament = (tournamentId: string) => {
    goto(`/tournaments/${tournamentId}/edit`);
  };

  const handleDeleteTournament = async (tournamentId: string, tournamentName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el torneo "${tournamentName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      // Importar tournamentDB dinámicamente
      const { tournamentDB } = await import('$lib/stores/tournaments');
      await tournamentDB.deleteTournament(tournamentId);
      
      // Recargar la página para actualizar la lista
      location.reload();
    } catch (error) {
      console.error('❌ Error deleting tournament:', error);
      alert('Error al eliminar el torneo');
    }
  };

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
      draft: { class: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Borrador' },
      upcoming: { class: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Próximo' },
      in_progress: { class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'En Curso' },
      completed: { class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Completado' },
      cancelled: { class: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Cancelado' }
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getFormatLabel = (format: string) => {
    const labels = {
      swiss: 'Suizo',
      round_robin: 'Round Robin',
      knockout: 'Eliminatorio',
      single_elimination: 'Eliminación Simple'
    };
    return labels[format as keyof typeof labels] || format;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return Edit3;
      case 'upcoming': return Calendar;
      case 'in_progress': return Play;
      case 'completed': return CheckCircle;
      case 'cancelled': return AlertCircle;
      default: return Trophy;
    }
  };

  const getOccupancyColor = (registered: number, max: number) => {
    const percentage = (registered / max) * 100;
    if (percentage >= 90) return 'text-emerald-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 50) return 'text-blue-400';
    return 'text-slate-400';
  };

  const isRegistrationOpen = (tournament: any) => {
    const now = new Date();
    const deadline = new Date(tournament.registration_deadline);
    return now < deadline && tournament.status !== 'completed' && tournament.status !== 'cancelled';
  };
</script>

<svelte:head>
  <title>Gestión de Torneos - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
  <!-- Header -->
  <div class="border-b border-slate-700/50 bg-slate-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-4">
          <button
            on:click={() => goto('/dashboard')}
            class="p-2 text-slate-400 hover:text-white transition-colors"
            title="Volver al Dashboard"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="p-2 bg-orange-500/20 rounded-lg">
            <Trophy class="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Gestión de Torneos</h1>
            <p class="text-slate-400">Organizar competiciones locales</p>
          </div>
        </div>
        
        <button
          on:click={handleCreateTournament}
          class="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Nuevo Torneo</span>
        </button>
      </div>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Estadísticas Generales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Torneos -->
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-orange-500/20 rounded-lg">
            <Trophy class="w-6 h-6 text-orange-400" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">
          {data.tournamentStats?.total_tournaments || 0}
        </h3>
        <p class="text-slate-400 text-sm">Total torneos</p>
      </div>

      <!-- En Curso -->
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-yellow-500/20 rounded-lg">
            <Play class="w-6 h-6 text-yellow-400" />
          </div>
          <span class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
            {data.tournamentStats?.in_progress_tournaments || 0}
          </span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">En Curso</h3>
        <p class="text-slate-400 text-sm">Activos ahora</p>
      </div>

      <!-- Participantes -->
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-blue-500/20 rounded-lg">
            <Users class="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">
          {data.tournamentStats?.total_players_registered || 0}
        </h3>
        <p class="text-slate-400 text-sm">Participantes totales</p>
      </div>

      <!-- Premios Totales -->
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-emerald-500/20 rounded-lg">
            <Award class="w-6 h-6 text-emerald-400" />
          </div>
          <TrendingUp class="w-4 h-4 text-emerald-400" />
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">
          {formatCurrency(data.tournamentStats?.total_prize_pool || 0)}
        </h3>
        <p class="text-slate-400 text-sm">En premios</p>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <!-- Búsqueda -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar torneos..."
            bind:value={searchTerm}
            class="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 w-full lg:w-80"
          />
        </div>

        <!-- Filtros -->
        <div class="flex items-center space-x-3">
          <button
            on:click={() => showFilters = !showFilters}
            class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
          >
            <Filter class="w-4 h-4" />
            <span>Filtros</span>
            <ChevronDown class="w-4 h-4 transition-transform {showFilters ? 'rotate-180' : ''}" />
          </button>
        </div>
      </div>

      <!-- Panel de filtros expandible -->
      {#if showFilters}
        <div class="mt-4 pt-4 border-t border-slate-700/50">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="status_filter" class="block text-sm font-medium text-slate-300 mb-2">Estado</label>
              <select
                id="status_filter"
                bind:value={statusFilter}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="upcoming">Próximo</option>
                <option value="in_progress">En Curso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <label for="format_filter" class="block text-sm font-medium text-slate-300 mb-2">Formato</label>
              <select
                id="format_filter"
                bind:value={formatFilter}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="all">Todos los formatos</option>
                <option value="swiss">Suizo</option>
                <option value="round_robin">Round Robin</option>
                <option value="knockout">Eliminatorio</option>
                <option value="single_elimination">Eliminación Simple</option>
              </select>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Lista de Torneos -->
    <div class="space-y-6">
      {#each filteredTournaments as tournament}
        {@const statusBadge = getStatusBadge(tournament.status)}
        {@const StatusIcon = getStatusIcon(tournament.status)}
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/30 transition-all duration-200">
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <!-- Información del torneo -->
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-orange-500/20 rounded-lg">
                  <StatusIcon class="w-6 h-6 text-orange-400" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-semibold text-white">{tournament.name}</h3>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {statusBadge.class}">
                      {statusBadge.label}
                    </span>
                  </div>
                  <p class="text-slate-400 mb-3">{tournament.description}</p>
                  
                  <!-- Detalles del torneo -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div class="flex items-center space-x-2">
                      <Calendar class="w-4 h-4 text-slate-500" />
                      <span class="text-slate-300">{formatDate(tournament.start_date)}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Clock class="w-4 h-4 text-slate-500" />
                      <span class="text-slate-300">{tournament.time_control}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <MapPin class="w-4 h-4 text-slate-500" />
                      <span class="text-slate-300">{tournament.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex items-center space-x-2">
                <button
                  on:click={() => handleViewTournament(tournament.id)}
                  class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors"
                  title="Ver detalles del torneo"
                >
                  <Eye class="w-4 h-4" />
                  <span>Ver</span>
                </button>
                <button
                  on:click={() => handleEditTournament(tournament.id)}
                  class="flex items-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  title="Gestionar torneo"
                >
                  <Settings class="w-4 h-4" />
                  <span>Gestionar</span>
                </button>
                <button
                  on:click={() => handleDeleteTournament(tournament.id, tournament.name)}
                  class="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Eliminar torneo"
                >
                  <Trash2 class="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>

            <!-- Métricas del torneo -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-700/50">
              <div class="text-center">
                <div class="text-lg font-semibold {getOccupancyColor(tournament.players_registered, tournament.max_players)}">
                  {tournament.players_registered}/{tournament.max_players}
                </div>
                <div class="text-xs text-slate-400">Jugadores</div>
              </div>
              
              <div class="text-center">
                <div class="text-lg font-semibold text-white">
                  {getFormatLabel(tournament.format)}
                </div>
                <div class="text-xs text-slate-400">Formato</div>
              </div>
              
              <div class="text-center">
                <div class="text-lg font-semibold text-white">
                  {tournament.current_round}/{tournament.total_rounds}
                </div>
                <div class="text-xs text-slate-400">Rondas</div>
              </div>
              
              <div class="text-center">
                <div class="text-lg font-semibold text-emerald-400">
                  {formatCurrency(tournament.entry_fee)}
                </div>
                <div class="text-xs text-slate-400">Inscripción</div>
              </div>
              
              <div class="text-center">
                <div class="text-lg font-semibold text-emerald-400">
                  {formatCurrency(tournament.prize_pool)}
                </div>
                <div class="text-xs text-slate-400">Premios</div>
              </div>
            </div>

            <!-- Información adicional -->
            <div class="mt-4 flex items-center justify-between text-sm">
              <div class="flex items-center space-x-4">
                <span class="text-slate-400">
                  Organizado por: <span class="text-slate-300">{tournament.organizer}</span>
                </span>
                {#if tournament.status === 'upcoming' && isRegistrationOpen(tournament)}
                  <span class="text-emerald-400">
                    ✓ Inscripciones abiertas hasta {formatDate(tournament.registration_deadline)}
                  </span>
                {:else if tournament.status === 'upcoming'}
                  <span class="text-red-400">
                    ✗ Inscripciones cerradas
                  </span>
                {/if}
              </div>
              
              <div class="text-slate-400">
                Creado: {formatDate(tournament.created_at)}
              </div>
            </div>
          </div>
        </div>
      {/each}

      {#if filteredTournaments.length === 0}
        <div class="text-center py-12">
          <Trophy class="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p class="text-slate-400">No se encontraron torneos</p>
          {#if searchTerm || statusFilter !== 'all' || formatFilter !== 'all'}
            <button
              on:click={() => {
                searchTerm = '';
                statusFilter = 'all';
                formatFilter = 'all';
              }}
              class="mt-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              Limpiar filtros
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </main>
</div>