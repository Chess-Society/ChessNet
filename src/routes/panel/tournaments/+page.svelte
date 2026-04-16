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
    DotsThreeVertical,
    CheckCircle,
    DownloadSimple,
    Sparkle
  } from 'phosphor-svelte';
  import { t, locale } from '$lib/i18n';
  import { appStore } from '$lib/stores/appStore';
  import { uiStore } from '$lib/stores/uiStore';
  import { TOURNAMENT_TEMPLATES } from '$lib/constants/chess-presets';
  import { fade, fly, scale } from 'svelte/transition';
  import { showToast, showError } from '$lib/stores/toast';

  let searchQuery = $state('');
  let isImporting = $state(false);

  // Svelte 5 Runes for reactive state
  let tournaments = $derived($appStore.localTournaments || []);
  let filteredTournaments = $derived(
    tournaments.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const deleteTournament = async (id: string, name: string) => {
    const confirmed = await uiStore.confirm({
      title: $t('tournaments.delete_title'),
      message: $t('common.confirm_delete', { name }),
      type: 'danger',
      confirmText: $t('common.delete')
    });

    if (confirmed) {
      try {
        await appStore.removeLocalTournament(id);
        showToast.success($t('common.delete_success'));
      } catch (error) {
        showError(error);
      }
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_progress':
      case 'Ongoing': 
        return { 
          label: $t('tournaments.status_in_progress'), 
          color: 'text-primary-400', 
          bg: 'bg-primary-500/10', 
          border: 'border-primary-500/20' 
        };
      case 'completed':
      case 'Completed': 
        return { 
          label: $t('tournaments.status_completed'), 
          color: 'text-slate-400', 
          bg: 'bg-slate-500/10', 
          border: 'border-slate-500/20' 
        };
      case 'upcoming':
      case 'Upcoming': 
        return { 
          label: $t('tournaments.status_upcoming'),
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

  const handleImportTemplates = async () => {
    const confirmed = await uiStore.confirm({
      title: $t('tournaments.import_templates_title'),
      message: $t('tournaments.import_confirm'),
      confirmText: $t('common.confirm')
    });

    if (confirmed) {
      isImporting = true;
      try {
        await appStore.importTournamentTemplates(TOURNAMENT_TEMPLATES);
        showToast.success($t('tournaments.import_success'));
      } catch (error) {
        showError(error);
      } finally {
        isImporting = false;
      }
    }
  };
</script>

<svelte:head>
  <title>{$t('tournaments.list_title')} - ChessNet</title>
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
        <h1 class="text-4xl font-outfit font-black text-white tracking-tight">{$t('tournaments.list_title')}</h1>
        <p class="text-zinc-500 font-plus-jakarta text-base mt-1">{$t('tournaments.list_subtitle')}</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={handleImportTemplates}
        disabled={isImporting}
        class="relative px-8 py-3.5 rounded-2xl bg-gradient-to-br from-indigo-600/90 to-violet-600/90 text-white border border-white/10 hover:from-indigo-600 hover:to-violet-600 transition-all flex items-center gap-3 text-xs font-black tracking-widest uppercase shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 group overflow-hidden"
      >
        <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <DownloadSimple weight="bold" class="w-5 h-5 relative z-10 {isImporting ? 'animate-bounce' : ''}" />
        <span class="relative z-10">{isImporting ? $t('common.loading') : $t('tournaments.import_btn')}</span>
      </button>

      <button 
        onclick={() => goto('/panel/tournaments/create')}
        class="group relative inline-flex items-center justify-center px-8 py-4 font-outfit font-bold text-white transition-all duration-200 bg-violet-600 rounded-2xl hover:bg-violet-500 shadow-lg shadow-violet-500/20 active:scale-95"
      >
        <Plus weight="bold" class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
        {$t('tournaments.new_button')}
      </button>
    </div>
  </div>

  <!-- Advanced Search & Filter Bar -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
    <div class="md:col-span-3 relative group">
      <MagnifyingGlass weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
      <input
        type="text"
        placeholder={$t('tournaments.search_placeholder')}
        bind:value={searchQuery}
        class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-xl"
      />
    </div>
    <div class="relative">
      <select class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer shadow-xl font-bold">
        <option value="all">{$t('common.all_statuses')}</option>
        <option value="upcoming">{$t('common.status_upcoming')}</option>
        <option value="in_progress">{$t('common.status_in_progress')}</option>
        <option value="completed">{$t('common.status_completed')}</option>
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
        <h2 class="text-2xl font-outfit font-bold text-white">{$t('common.no_results')}</h2>
        <p class="text-zinc-500 font-plus-jakarta max-w-xs mx-auto text-base">{$t('tournaments.no_tournaments_desc')}</p>
      </div>
      <div class="flex items-center gap-4 mt-4">
        <button 
          onclick={handleImportTemplates}
          disabled={isImporting}
          class="px-8 py-4 rounded-[20px] bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest text-xs transition-all border border-zinc-700 flex items-center gap-2"
        >
          <Sparkle weight="fill" class="w-4 h-4 text-violet-400 {isImporting ? 'animate-spin' : ''}" />
          {isImporting ? $t('common.loading') : $t('tournaments.import_btn')}
        </button>

        <button 
          onclick={() => goto('/panel/tournaments/create')}
          class="px-8 py-4 rounded-[20px] bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2"
        >
          <Plus weight="bold" class="w-4 h-4" />
          {$t('tournaments.new_button')}
        </button>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredTournaments as tournament, i (tournament.id)}
        {@const status = getStatusConfig(tournament.status)}
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
                  {tournament.name[0].toUpperCase()}
                </div>
                <div class="flex flex-col">
                  <h3 class="text-white font-outfit font-bold text-lg leading-tight group-hover:text-violet-400 transition-colors uppercase tracking-tight">{tournament.name}</h3>
                  <div class="mt-2 flex">
                    <span class="px-2.5 py-1 rounded-lg border text-[10px] font-outfit font-black uppercase tracking-widest {status.bg} {status.color} {status.border}">
                       {status.label}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onclick={() => goto(`/panel/tournaments/${tournament.id}/edit`)}
                  class="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                  aria-label="Edit"
                >
                  <PencilSimple weight="bold" class="w-5 h-5" />
                </button>
                <button 
                  onclick={() => deleteTournament(tournament.id, tournament.name)}
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
                  <span>{tournament.startAt ? new Date(tournament.startAt).toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' }) : $t('tournaments.date_pending')}</span>
               </div>
               <div class="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors font-plus-jakarta font-medium text-sm">
                  <div class="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
                      <Users weight="duotone" class="w-5 h-5" />
                  </div>
                  <span>{$appStore.localTournamentPlayers.filter(p => p.tournament_id === tournament.id).length} {$t('tournaments.participants')}</span>
               </div>
               {#if tournament.location}
               <div class="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors font-plus-jakarta font-medium text-sm">
                  <div class="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
                      <MapPin weight="duotone" class="w-5 h-5" />
                  </div>
                  <span class="truncate">{tournament.location}</span>
               </div>
               {/if}
            </div>
          </div>

          <!-- Action Button -->
          <div class="pt-6 border-t border-zinc-800/50 relative z-10">
            <button 
              onclick={() => goto(`/panel/tournaments/${tournament.id}`)}
              class="w-full h-12 bg-zinc-950 hover:bg-violet-600 text-zinc-300 hover:text-white flex items-center justify-center gap-2 rounded-xl text-xs font-outfit font-black transition-all duration-300 border border-zinc-800 hover:border-violet-500 group/btn shadow-lg uppercase tracking-widest"
            >
              {$t('tournaments.manage')}
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
