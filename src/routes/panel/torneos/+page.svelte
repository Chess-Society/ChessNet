<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Trophy, 
    Plus, 
    Edit, 
    Trash2,
    Calendar,
    Users,
    ChevronRight,
    Search,
    Medal,
    Trophy as TrophyIcon
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  let searchQuery = $state('');

  // Datos reactivos desde el store
  let tournaments = $derived($appStore.localTournaments || []);

  const filteredTournaments = $derived(() => {
    return tournaments.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const deleteTournament = (id: string) => {
    const t = tournaments.find(item => item.id === id);
    if (confirm(`¿Eliminar el torneo ${t?.name}?`)) {
      appStore.removeLocalTournament(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
      case 'Ongoing': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'completed':
      case 'Completed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'upcoming':
      case 'Upcoming': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };
</script>

<svelte:head>
  <title>Gestión de Torneos - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500">
          <TrophyIcon class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Gestión de Torneos</h1>
          <p class="text-slate-400 text-sm">Organiza competiciones, controla los emparejamientos y registra resultados.</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/torneos/create')}
      class="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2"
    >
      <Plus class="w-4 h-4" />
      Crear Torneo
    </button>
  </div>

  <div class="relative group mb-8">
    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
    <input
      type="text"
      placeholder="Buscar torneo..."
      bind:value={searchQuery}
      class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all backdrop-blur-xl"
    />
  </div>

  {#if filteredTournaments().length === 0}
    <div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6">
      <div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">
        <TrophyIcon class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">No hay torneos activos</h2>
        <p class="text-slate-500 text-sm">Organiza tu primer torneo para motivar a tus alumnos.</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredTournaments() as t, i}
        <div 
          class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-orange-500/30 transition-all group relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="flex items-center justify-between mb-6 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-orange-500 font-bold text-lg group-hover:scale-110 transition-all">
                {t.name[0].toUpperCase()}
              </div>
              <div>
                <h3 class="text-white font-bold leading-tight group-hover:text-orange-400 transition-colors">{t.name}</h3>
                <div class="flex items-center gap-2 mt-1">
                   <div class="px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest {getStatusColor(t.status)}">
                      {t.status}
                   </div>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onclick={() => goto(`/panel/torneos/${t.id}/edit`)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-orange-400 hover:border-orange-500/30 transition-all"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteTournament(t.id)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
            </div>
          </div>

          <div class="space-y-3 mb-6 relative z-10">
             <div class="flex items-center gap-2 text-xs text-slate-400">
                <Calendar class="w-3.5 h-3.5" />
                {t.startAt ? new Date(t.startAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha no definida'}
             </div>
             <div class="flex items-center gap-2 text-xs text-slate-400">
                <Users class="w-3.5 h-3.5" />
                {$appStore.localTournamentPlayers.filter(p => p.tournament_id === t.id).length} Participantes
             </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
            <button 
              onclick={() => goto(`/panel/torneos/${t.id}`)}
              class="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-wider hover:text-white transition-all group/btn"
            >
              GESTIONAR TORNEO
              <ChevronRight class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
