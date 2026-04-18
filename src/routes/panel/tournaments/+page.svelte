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
  import { user as authUser } from '$lib/stores/auth';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { TOURNAMENT_TEMPLATES } from '$lib/constants/chess-presets';
  import { fade, fly, scale } from 'svelte/transition';
  import { showToast, showError } from '$lib/stores/toast';

  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));

  onMount(() => {
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
    }
  });

  let searchQuery = $state('');
  let isImporting = $state(false);

  // Svelte 5 Runes for expanded reactive state
  let tournaments = $derived($appStore.localTournaments || []);
  let players = $derived($appStore.localTournamentPlayers || []);
  
  let stats = $derived({
    total: tournaments.length,
    active: tournaments.filter(t => t.status === 'in_progress').length,
    upcoming: tournaments.filter(t => t.status === 'upcoming').length,
    totalPlayers: players.length,
    uniquePlayers: new Set(players.map(p => p.student_id)).size
  });

  let filteredTournaments = $derived(
    tournaments.filter(t => (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
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
    switch (status?.toLowerCase()) {
      case 'in_progress':
      case 'ongoing': 
        return { 
          label: $t('tournaments.status_in_progress'), 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/20' 
        };
      case 'completed': 
        return { 
          label: $t('tournaments.status_completed'), 
          color: 'text-slate-400', 
          bg: 'bg-slate-500/10', 
          border: 'border-slate-500/20' 
        };
      case 'upcoming': 
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

<div class="max-w-7xl mx-auto px-6 py-10 space-y-10" in:fade={{ duration: 300 }}>
  
  <!-- Premium Header & Actions -->
  <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
    <div class="space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
        <div class="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></div>
        <span class="text-[10px] font-outfit font-black text-violet-300 uppercase tracking-widest">{$t('tournaments.competition_engine')}</span>
      </div>
      <div>
        <h1 class="text-5xl font-outfit font-black text-white tracking-tighter uppercase italic">
          {$t('tournaments.list_title')}
        </h1>
        <p class="text-zinc-500 font-medium text-lg mt-2 max-w-xl">
          {$t('tournaments.list_subtitle')}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button 
        onclick={handleImportTemplates}
        disabled={isImporting}
        class="px-6 py-4 rounded-2xl bg-zinc-900 text-slate-400 border border-zinc-800 hover:border-violet-500/30 hover:text-white transition-all flex items-center gap-3 text-xs font-black tracking-widest uppercase active:scale-95 disabled:opacity-50 group"
      >
        <DownloadSimple weight="bold" class="w-5 h-5 {isImporting ? 'animate-bounce' : 'group-hover:-translate-y-0.5 transition-transform'}" />
        {isImporting ? $t('common.loading') : $t('tournaments.import_btn')}
      </button>

      <button 
        onclick={() => goto('/panel/tournaments/create')}
        class="px-8 py-4 rounded-2xl bg-violet-600 text-white font-outfit font-black text-sm transition-all hover:bg-violet-500 shadow-xl shadow-violet-600/20 flex items-center gap-3 active:scale-95 uppercase tracking-widest"
      >
        <Plus weight="bold" class="w-5 h-5" />
        {$t('tournaments.new_button')}
      </button>
    </div>
  </div>

  <!-- Stats Overview (Bento Grid) -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each [
      { label: $t('tournaments.stats.total'), value: stats.total, icon: Trophy, color: 'text-violet-400', bg: 'bg-violet-500/10' },
      { label: $t('tournaments.stats.active'), value: stats.active, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      { label: $t('tournaments.stats.players'), value: stats.totalPlayers, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
      { label: $t('tournaments.stats.unique'), value: stats.uniquePlayers, icon: Medal, color: 'text-amber-400', bg: 'bg-amber-500/10' }
    ] as stat}
      {@const Icon = stat.icon}
      <div class="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl flex flex-col gap-4 relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon weight="fill" class="w-20 h-20" />
        </div>
        <div class="w-10 h-10 {stat.bg} rounded-xl flex items-center justify-center {stat.color}">
          <Icon weight="duotone" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
          <p class="text-2xl font-outfit font-black text-white">{stat.value}</p>
        </div>
      </div>
    {/each}
  </div>

  <!-- Search & Filter Bar -->
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-1 relative group">
      <MagnifyingGlass weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
      <input
        type="text"
        placeholder={$t('tournaments.search_placeholder')}
        bind:value={searchQuery}
        class="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-lg"
      />
    </div>
    
    <div class="relative w-full md:w-64">
      <select class="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer shadow-lg font-bold text-sm">
        <option value="all">{$t('common.all_statuses')}</option>
        <option value="upcoming">{$t('common.status_upcoming')}</option>
        <option value="in_progress">{$t('common.status_in_progress')}</option>
        <option value="completed">{$t('common.status_completed')}</option>
      </select>
      <CaretRight weight="bold" class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
    </div>
  </div>

  {#if filteredTournaments.length === 0}
    <div class="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[40px] p-20 text-center flex flex-col items-center gap-8" in:fly={{ y: 20 }}>
      <div class="w-24 h-24 bg-zinc-800/50 rounded-[32px] flex items-center justify-center text-zinc-700 shadow-inner border border-zinc-800/50">
        <Trophy weight="duotone" class="w-12 h-12 opacity-50" />
      </div>
      <div class="space-y-3">
        <h2 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('common.no_results')}</h2>
        <p class="text-zinc-500 font-medium max-w-xs mx-auto text-base">{$t('tournaments.no_tournaments_desc')}</p>
      </div>
      <div class="flex flex-wrap justify-center items-center gap-4">
        <button 
          onclick={handleImportTemplates}
          disabled={isImporting}
          class="px-8 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest text-[10px] transition-all border border-zinc-700 flex items-center gap-3 shadow-xl active:scale-95"
        >
          <Sparkle weight="fill" class="w-5 h-5 text-violet-400 {isImporting ? 'animate-spin' : ''}" />
          {isImporting ? $t('common.loading') : $t('tournaments.import_btn')}
        </button>

        <button 
          onclick={() => goto('/panel/tournaments/create')}
          class="px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-violet-600/20 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus weight="bold" class="w-5 h-5" />
          {$t('tournaments.new_button')}
        </button>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {#each filteredTournaments as tournament, i (tournament.id)}
        {@const status = getStatusConfig(tournament.status)}
        <div 
          class="group relative bg-zinc-900/40 border border-white/5 rounded-[32px] p-8 flex flex-col justify-between hover:border-violet-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-black/60 overflow-hidden backdrop-blur-sm"
          in:fly={{ y: 30, delay: i * 50, duration: 600 }}
        >
          <!-- Premium Hover Gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-700"></div>
          
          <div class="relative z-10">
            <!-- Header -->
            <div class="flex items-start justify-between mb-8">
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center text-violet-400 font-outfit font-black text-2xl group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 shadow-2xl ring-1 ring-white/5">
                  {tournament.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 class="text-white font-outfit font-black text-xl leading-none group-hover:text-violet-400 transition-colors uppercase italic tracking-tight">{tournament.name}</h3>
                  <div class="mt-3 flex">
                    <span class="px-3 py-1 rounded-full border text-[9px] font-outfit font-black uppercase tracking-widest {status.bg} {status.color} {status.border} shadow-sm">
                       {status.label}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <button 
                  onclick={() => goto(`/panel/tournaments/${tournament.id}/edit`)}
                  class="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-white/5"
                  aria-label={$t('common.edit')}
                >
                  <PencilSimple weight="bold" class="w-5 h-5" />
                </button>
                <button 
                  onclick={() => deleteTournament(tournament.id, tournament.name)}
                  class="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/10"
                  aria-label={$t('common.delete')}
                >
                  <Trash weight="bold" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 gap-4 mb-4">
                <div class="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group/stat hover:bg-white/[0.08] transition-all">
                  <div class="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-400 group-hover/stat:text-violet-400 transition-colors border border-white/5">
                      <CalendarBlank weight="duotone" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[9px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-0.5">{$t('tournaments.date_label')}</p>
                    <p class="text-sm font-bold text-slate-300 truncate">{tournament.startAt ? new Date(tournament.startAt).toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' }) : $t('tournaments.date_pending')}</p>
                  </div>
               </div>
               
               <div class="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group/stat hover:bg-white/[0.08] transition-all">
                  <div class="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-400 group-hover/stat:text-indigo-400 transition-colors border border-white/5">
                      <Users weight="duotone" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[9px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-0.5">{$t('tournaments.participants')}</p>
                    <p class="text-sm font-bold text-slate-300">{$appStore.localTournamentPlayers.filter(p => p.tournament_id === tournament.id).length} {$t('tournaments.registered_label')}</p>
                  </div>
               </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-6 relative z-10">
            <button 
              onclick={() => goto(`/panel/tournaments/${tournament.id}`)}
              class="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center gap-3 rounded-2xl text-[11px] font-outfit font-black transition-all duration-300 shadow-xl shadow-violet-600/10 hover:shadow-violet-600/30 group/btn uppercase tracking-[0.2em]"
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
