<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Trophy, 
    Plus, 
    PencilSimple, 
    Trash,
    CalendarBlank,
    Users,
    CaretRight,
    MagnifyingGlass,
    Medal,
    ArrowsOutCardinal,
    Clock,
    MapPin,
    DotsThreeVertical
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly, scale } from 'svelte/transition';

  let searchQuery = $state('');

  // Svelte 5 Runes for reactive state
  let tournaments = $derived($appStore.localTournaments || []);
  let filteredTournaments = $derived(
    tournaments.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const deleteTournament = (id: string) => {
    const t = tournaments.find(item => item.id === id);
    if (confirm(`Delete tournament ${t?.name}?`)) {
      appStore.removeLocalTournament(id);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_progress':
      case 'Ongoing': 
        return { 
          label: 'In Progress', 
          color: 'text-primary-400', 
          bg: 'bg-primary-500/10', 
          border: 'border-primary-500/20' 
        };
      case 'completed':
      case 'Completed': 
        return { 
          label: 'Completed', 
          color: 'text-slate-400', 
          bg: 'bg-slate-500/10', 
          border: 'border-slate-500/20' 
        };
      case 'upcoming':
      case 'Upcoming': 
        return { 
          label: 'Upcoming', 
          color: 'text-violet-400', 
          bg: 'bg-violet-500/10', 
          border: 'border-violet-500/20' 
        };
      default: 
        return { 
          label: status, 
          color: 'text-slate-400', 
          bg: 'bg-slate-500/10', 
          border: 'border-slate-500/20' 
        };
    }
  };
</script>

<svelte:head>
  <title>Tournaments - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-8" in:fade={{ duration: 300 }}>
  
  <!-- Premium Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
    <div class="flex items-center gap-5">
      <div class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div class="relative w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-violet-500 shadow-2xl">
          <Trophy weight="duotone" class="w-9 h-9" />
        </div>
      </div>
      <div>
        <h1 class="text-4xl font-outfit font-black text-white tracking-tight">Tournaments</h1>
        <p class="text-zinc-500 font-plus-jakarta text-base mt-1">Comprehensive management of competitions and rankings.</p>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/tournaments/create')}
      class="group relative inline-flex items-center justify-center px-8 py-4 font-outfit font-bold text-white transition-all duration-200 bg-violet-600 rounded-2xl hover:bg-violet-500 shadow-lg shadow-violet-500/20 active:scale-95"
    >
      <Plus weight="bold" class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
      Organize Tournament
    </button>
  </div>

  <!-- Advanced Search & Filter Bar -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
    <div class="md:col-span-3 relative group">
      <MagnifyingGlass weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
      <input
        type="text"
        placeholder="Search by tournament name..."
        bind:value={searchQuery}
        class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-xl"
      />
    </div>
    <div class="relative">
      <select class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer shadow-xl">
        <option value="all">All statuses</option>
        <option value="upcoming">Upcoming</option>
        <option value="in_progress">In progress</option>
        <option value="completed">Completed</option>
      </select>
      <CaretRight weight="bold" class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 rotate-90 pointer-events-none" />
    </div>
  </div>

  {#if filteredTournaments.length === 0}
    <div class="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-[32px] p-24 text-center flex flex-col items-center gap-6" in:fly={{ y: 20 }}>
      <div class="w-24 h-24 bg-zinc-900 rounded-[32px] flex items-center justify-center text-zinc-700 shadow-inner border border-zinc-800">
        <Trophy weight="duotone" class="w-12 h-12" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-outfit font-bold text-white">No tournaments found</h2>
        <p class="text-zinc-500 font-plus-jakarta max-w-xs mx-auto text-base">Start organizing your community by creating your first official tournament today.</p>
      </div>
      <button 
        onclick={() => goto('/panel/tournaments/create')}
        class="mt-4 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all border border-zinc-700"
      >
        Create first tournament
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredTournaments as t, i (t.id)}
        {@const status = getStatusConfig(t.status)}
        <div 
          class="group relative bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 flex flex-col justify-between hover:border-violet-500/30 transition-all duration-300 shadow-xl overflow-hidden"
          in:fly={{ y: 30, delay: i * 50, duration: 500 }}
        >
          <!-- Animated Highlight Overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div>
            <!-- Card Header -->
            <div class="flex items-start justify-between mb-6 relative z-10">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-violet-400 font-outfit font-black text-xl group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 shadow-lg">
                  {t.name[0].toUpperCase()}
                </div>
                <div class="flex flex-col">
                  <h3 class="text-white font-outfit font-bold text-lg leading-tight group-hover:text-violet-400 transition-colors uppercase tracking-tight">{t.name}</h3>
                  <div class="mt-2 flex">
                    <span class="px-2.5 py-1 rounded-lg border text-[10px] font-outfit font-black uppercase tracking-widest {status.bg} {status.color} {status.border}">
                       {status.label}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onclick={() => goto(`/panel/tournaments/${t.id}/edit`)}
                  class="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                  aria-label="Edit"
                >
                  <PencilSimple weight="bold" class="w-5 h-5" />
                </button>
                <button 
                  onclick={() => deleteTournament(t.id)}
                  class="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-all"
                  aria-label="Delete"
                >
                  <Trash weight="bold" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Card Stats -->
            <div class="space-y-3 mb-8 relative z-10">
               <div class="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors font-plus-jakarta font-medium text-sm">
                  <div class="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
                      <CalendarBlank weight="duotone" class="w-5 h-5" />
                  </div>
                  <span>{t.startAt ? new Date(t.startAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) : 'TBD'}</span>
               </div>
               <div class="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors font-plus-jakarta font-medium text-sm">
                  <div class="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
                      <Users weight="duotone" class="w-5 h-5" />
                  </div>
                  <span>{$appStore.localTournamentPlayers.filter(p => p.tournament_id === t.id).length} Participants</span>
               </div>
               {#if t.location}
               <div class="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors font-plus-jakarta font-medium text-sm">
                  <div class="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
                      <MapPin weight="duotone" class="w-5 h-5" />
                  </div>
                  <span class="truncate">{t.location}</span>
               </div>
               {/if}
            </div>
          </div>

          <!-- Action Button -->
          <div class="pt-6 border-t border-zinc-800/50 relative z-10">
            <button 
              onclick={() => goto(`/panel/tournaments/${t.id}`)}
              class="w-full h-12 bg-zinc-950 hover:bg-violet-600 text-zinc-300 hover:text-white flex items-center justify-center gap-2 rounded-xl text-xs font-outfit font-black transition-all duration-300 border border-zinc-800 hover:border-violet-500 group/btn shadow-lg"
            >
              MANAGE COMPETITION
              <CaretRight weight="bold" class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Optional: Add custom animations or specific Bento patterns if needed */
</style>
