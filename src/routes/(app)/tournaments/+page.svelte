<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Trophy,
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    Users,
    MapPin,
    Play,
    CheckCircle,
    AlertCircle,
    Edit3,
    Eye,
    Settings,
    ChevronDown,
    ChevronRight,
    Award,
    TrendingUp,
    Trash2,
    X,
    Timer,
    Medal,
    Sparkles,
    LayoutDashboard,
    Briefcase,
    Zap
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let searchTerm = $state('');
  let statusFilter = $state('all');
  let formatFilter = $state('all');

  const filteredTournaments = $derived(
    data.tournaments?.filter((tournament) => {
      const matchesSearch = !searchTerm || 
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
      const matchesFormat = formatFilter === 'all' || tournament.format === formatFilter;
      
      return matchesSearch && matchesStatus && matchesFormat;
    }) || []
  );

  const handleDeleteTournament = async (tournamentId: string, tournamentName: string) => {
    if (!confirm(`¿ESTÁS SEGURO DE QUE DESEAS ELIMINAR EL TORNEO "${tournamentName.toUpperCase()}"?`)) {
      return;
    }

    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      await tournamentDB.deleteTournament(tournamentId);
      location.reload();
    } catch (error) {
      console.error('❌ Error deleting tournament:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const statusThemes: Record<string, string> = {
    draft: 'text-surface-500 border-surface-800 bg-surface-950',
    upcoming: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    in_progress: 'text-primary-400 border-primary-500/20 bg-primary-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    completed: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    cancelled: 'text-red-400 border-red-500/20 bg-red-500/10'
  };

  const statusLabels: Record<string, string> = {
    draft: 'BORRADOR',
    upcoming: 'PRÓXIMO',
    in_progress: 'EN CURSO',
    completed: 'FINALIZADO',
    cancelled: 'CANCELADO'
  };

  const formatLabels: Record<string, string> = {
    swiss: 'SUIZO',
    round_robin: 'ROUND ROBIN',
    knockout: 'ELIMINATORIO',
    single_elimination: 'ELIMINACIÓN SIMPLE'
  };
</script>

<svelte:head>
  <title>Torneos y Competiciones - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">
          <Trophy class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Tour Arena</h1>
          <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Gestión de Competiciones y Rating</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/tournaments/create')}
      class="bg-primary-500 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center justify-center gap-3 group"
    >
      <Plus class="w-5 h-5 transition-transform group-hover:rotate-90" />
      CREAR TORNEO
    </button>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="glass-panel p-8 border-t-4 border-primary-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Trophy class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Total Eventos</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{data.tournamentStats?.total_tournaments || 0}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">REGISTRADOS</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-blue-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Timer class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Competiciones Activas</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-blue-400 tracking-tighter leading-none">{data.tournamentStats?.in_progress_tournaments || 0}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">EN CURSO</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-orange-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Users class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Jugadores Inscritos</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{data.tournamentStats?.total_players_registered || 0}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">USUARIOS</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-purple-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Award class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Bolsa de Premios</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{formatCurrency(data.tournamentStats?.total_prize_pool || 0)}</p>
          <p class="text-[9px] font-black text-purple-400 uppercase mb-0.5 whitespace-nowrap">GLOBAL</p>
       </div>
    </div>
  </div>

  <!-- Filters Area -->
  <div class="flex flex-col lg:flex-row gap-4">
    <div class="flex-grow relative group">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors" />
      <input
        type="text"
        placeholder="BUSCAR TORNEO POR NOMBRE O UBICACIÓN..."
        bind:value={searchTerm}
        class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all backdrop-blur-xl"
      />
    </div>

    <select 
      bind:value={statusFilter} 
      class="bg-surface-950/50 border border-surface-900 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl min-w-[200px]"
    >
      <option value="all">TODOS LOS ESTADOS</option>
      <option value="draft">BORRADOR</option>
      <option value="upcoming">PRÓXIMO</option>
      <option value="in_progress">EN CURSO</option>
      <option value="completed">FINALIZADO</option>
    </select>

    <select 
      bind:value={formatFilter} 
      class="bg-surface-950/50 border border-surface-900 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl min-w-[200px]"
    >
      <option value="all">TODOS LOS FORMATOS</option>
      <option value="swiss">SUIZO</option>
      <option value="round_robin">ROUND ROBIN</option>
      <option value="knockout">ELIMINATORIO</option>
    </select>

    <button 
      onclick={() => { searchTerm = ''; statusFilter = 'all'; formatFilter = 'all'; }}
      class="bg-surface-900/50 border border-surface-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all backdrop-blur-xl"
    >
      RESETEAR
    </button>
  </div>

  <!-- Tournament List -->
  <div class="space-y-8">
    {#each filteredTournaments as tournament, i}
      <div 
        class="glass-panel group hover:border-primary-500/30 transition-all overflow-hidden"
        in:fly={{ y: 20, delay: i * 40 }}
      >
        <div class="p-8">
          <div class="flex flex-col xl:flex-row gap-10">
            <!-- Left Info -->
            <div class="flex-1 space-y-6">
              <div class="flex flex-col md:flex-row md:items-center gap-6">
                <div class="w-16 h-16 bg-surface-950 border border-surface-900 rounded-2xl flex items-center justify-center text-primary-400 shadow-xl group-hover:scale-105 transition-transform flex-shrink-0">
                  <Trophy class="w-8 h-8" />
                </div>
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-4">
                    <h3 class="text-xl font-black text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight leading-none">{tournament.name}</h3>
                    <span class={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${statusThemes[tournament.status]}`}>
                      {statusLabels[tournament.status]}
                    </span>
                  </div>
                  <p class="text-[11px] text-surface-500 leading-relaxed max-w-2xl">{tournament.description}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-surface-900/50">
                <div class="space-y-1.5">
                   <p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">FECHA INICIO</p>
                   <div class="flex items-center gap-2 text-white font-bold text-xs">
                      <Calendar class="w-4 h-4 text-blue-400" />
                      {formatDate(tournament.start_date)}
                   </div>
                </div>
                <div class="space-y-1.5">
                   <p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">CONTROL TIEMPO</p>
                   <div class="flex items-center gap-2 text-white font-bold text-xs">
                      <Timer class="w-4 h-4 text-orange-400" />
                      {tournament.time_control}
                   </div>
                </div>
                <div class="space-y-1.5">
                   <p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">SALA / SEDE</p>
                   <div class="flex items-center gap-2 text-white font-bold text-xs">
                      <MapPin class="w-4 h-4 text-red-400" />
                      {tournament.location.toUpperCase()}
                   </div>
                </div>
                <div class="space-y-1.5">
                   <p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">SISTEMA</p>
                   <div class="flex items-center gap-2 text-white font-bold text-xs">
                      <Zap class="w-4 h-4 text-purple-400" />
                      {formatLabels[tournament.format] || tournament.format}
                   </div>
                </div>
              </div>
            </div>

            <!-- Vertical Divider -->
            <div class="hidden xl:block w-px bg-surface-900/50"></div>

            <!-- Metrics & Actions Container -->
            <div class="flex flex-col md:flex-row xl:flex-col items-center gap-10 xl:w-64">
               <!-- Metrics -->
               <div class="flex flex-1 items-center justify-around md:justify-start xl:flex-col gap-10 w-full">
                  <div class="text-center xl:text-left">
                    <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">PARTICIPACIÓN</p>
                    <p class="text-xl font-black text-white leading-none">
                      {tournament.players_registered} <span class="text-surface-700">/ {tournament.max_players}</span>
                    </p>
                  </div>
                  <div class="text-center xl:text-left">
                    <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">PREMIACIÓN</p>
                    <p class="text-xl font-black text-emerald-400 leading-none">{formatCurrency(tournament.prize_pool)}</p>
                  </div>
                  <div class="text-center xl:text-left">
                    <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">RONDA ACTUAL</p>
                    <p class="text-xl font-black text-primary-400 leading-none">
                      {tournament.current_round} <span class="text-surface-700">/ {tournament.total_rounds}</span>
                    </p>
                  </div>
               </div>

               <!-- Actions -->
               <div class="flex gap-3 w-full justify-center md:justify-end xl:justify-start">
                  <button 
                    onclick={() => goto(`/tournaments/${tournament.id}`)}
                    class="p-4 bg-surface-950 border border-surface-900 rounded-2xl text-surface-400 hover:text-white hover:border-primary-500/30 transition-all shadow-xl group/btn"
                  >
                    <Eye class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onclick={() => goto(`/tournaments/${tournament.id}/edit`)}
                    class="p-4 bg-surface-950 border border-surface-900 rounded-2xl text-surface-400 hover:text-primary-400 hover:border-primary-500/30 transition-all shadow-xl group/btn"
                  >
                    <Settings class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onclick={() => handleDeleteTournament(tournament.id, tournament.name)}
                    class="p-4 bg-surface-950 border border-surface-900 rounded-2xl text-surface-400 hover:text-red-400 hover:border-red-500/30 transition-all shadow-xl group/btn"
                  >
                    <Trash2 class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="glass-panel p-24 text-center space-y-6">
        <div class="w-20 h-20 bg-surface-950 border border-surface-900 rounded-3xl flex items-center justify-center mx-auto text-surface-800">
          <Trophy class="w-10 h-10" />
        </div>
        <div>
          <p class="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]">No se han localizado torneos</p>
          <p class="text-[9px] font-bold text-surface-800 uppercase tracking-widest mt-2">Ajusta los filtros o inicia una nueva arena.</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  /* Transitions are managed via Tailwind and Svelte transitions */
</style>