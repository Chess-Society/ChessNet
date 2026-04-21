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
  import { user as authUser } from '$lib/stores/auth';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { uiStore } from '$lib/stores/uiStore';
  import { showToast, showError, toast } from '$lib/stores/toast';
  import { fade, fly } from 'svelte/transition';
  import { TOURNAMENT_TEMPLATES } from '$lib/constants/chess-presets';

  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));

  const tournaments = $derived($appStore?.localTournaments || []);
  const players = $derived($appStore?.localTournamentPlayers || []);

  onMount(() => {
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
      return;
    }
  });

  let searchQuery = $state('');
  let isImporting = $state(false);
  
  let stats = $derived({
    total: tournaments.length,
    active: tournaments.filter(t => t.status === 'in_progress').length,
    upcoming: tournaments.filter(t => t.status === 'upcoming').length,
    totalPlayers: players.length,
    uniquePlayers: new Set(players.map(p => p.studentId)).size
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
          color: 'text-primary-400', 
          bg: 'bg-primary-500/10', 
          border: 'border-primary-500/20' 
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
    <div class="space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20">
        <div class="w-1.5 h-1.5 bg-violet-400 animate-pulse"></div>
        <span class="text-[10px] font-outfit font-black text-violet-300 uppercase tracking-widest">{$t('tournaments.competition_engine')}</span>
      </div>
      <div>
        <h1 class="text-6xl font-outfit font-black text-white tracking-tighter uppercase leading-none">
          <span class="gradient-text">{$t('tournaments.list_title')}</span>
        </h1>
        <p class="text-zinc-500 font-medium text-lg mt-3 font-jakarta">
          {$t('tournaments.list_subtitle')}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button 
        onclick={handleImportTemplates}
        disabled={isImporting}
        class="px-6 py-4 rounded-none bg-zinc-900 text-slate-400 border border-zinc-800 hover:border-violet-500/30 hover:text-white transition-all flex items-center gap-3 text-xs font-black tracking-widest uppercase active:scale-95 disabled:opacity-50 group"
      >
        <DownloadSimple weight="bold" class="w-5 h-5 {isImporting ? 'animate-bounce' : 'group-hover:-translate-y-0.5 transition-transform'}" />
        {isImporting ? $t('common.loading') : $t('tournaments.import_btn')}
      </button>

      <button 
        onclick={() => goto('/panel/tournaments/create')}
        class="px-8 py-4 rounded-none bg-violet-600 text-white font-outfit font-black text-sm transition-all hover:bg-violet-500 shadow-xl shadow-violet-600/20 flex items-center gap-3 active:scale-95 uppercase tracking-widest"
      >
        <Plus weight="bold" class="w-5 h-5" />
        {$t('tournaments.new_button')}
      </button>
    </div>
  </div>

  <!-- Stats Overview (Bento Grid) -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each [
      { label: $t('tournaments.stats.total'), value: stats.total, icon: Trophy, color: 'text-violet-400' },
      { label: $t('tournaments.stats.active'), value: stats.active, icon: Clock, color: 'text-violet-400' },
      { label: $t('tournaments.stats.players'), value: stats.totalPlayers, icon: Users, color: 'text-violet-400' },
      { label: $t('tournaments.stats.unique'), value: stats.uniquePlayers, icon: Medal, color: 'text-violet-400' }
    ] as stat}
      <div class="bento-card p-6 flex flex-col gap-4 relative overflow-hidden group">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center {stat.color}">
            <stat.icon weight="duotone" class="w-6 h-6" />
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-violet-500/20 blur-xl w-8 h-8 absolute top-0 right-0"></div>
        </div>
        <div>
          <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
          <div class="flex items-baseline gap-1">
            <p class="text-3xl font-outfit font-black text-white">{stat.value}</p>
          </div>
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
        class="w-full bg-zinc-900/40 border border-zinc-800 rounded-none pl-14 pr-6 py-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-lg"
      />
    </div>
    
    <div class="relative w-full md:w-64">
      <select class="w-full bg-zinc-900/40 border border-zinc-800 rounded-none px-6 py-4 text-zinc-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer shadow-lg font-bold text-sm">
        <option value="all">{$t('common.all_statuses')}</option>
        <option value="upcoming">{$t('common.status_upcoming')}</option>
        <option value="in_progress">{$t('common.status_in_progress')}</option>
        <option value="completed">{$t('common.status_completed')}</option>
      </select>
      <CaretRight weight="bold" class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
    </div>
  </div>

  {#if filteredTournaments.length === 0}
    <div class="bento-card p-24 text-center flex flex-col items-center gap-10" in:fly={{ y: 20 }}>
      <div class="relative">
        <div class="absolute inset-0 bg-violet-500/20 blur-[50px]"></div>
        <div class="w-32 h-32 bg-zinc-800/50 flex items-center justify-center text-zinc-700 shadow-2xl border border-zinc-700/50 relative">
          <Trophy weight="duotone" class="w-16 h-16 opacity-30 text-violet-400" />
        </div>
      </div>
      <div class="space-y-4 max-w-sm">
        <h2 class="text-4xl font-outfit font-black text-white uppercase tracking-tighter">{$t('common.no_results')}</h2>
        <p class="text-zinc-500 font-medium text-lg leading-relaxed font-jakarta">{$t('tournaments.no_tournaments_desc')}</p>
      </div>
      <div class="flex flex-wrap justify-center items-center gap-4">
        <button 
          onclick={handleImportTemplates}
          disabled={isImporting}
          class="px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] transition-all border border-zinc-800 flex items-center gap-4 shadow-xl active:scale-95 group"
        >
          <Sparkle weight="fill" class="w-6 h-6 text-violet-400 group-hover:rotate-12 transition-transform {isImporting ? 'animate-spin' : ''}" />
          {isImporting ? $t('common.loading') : $t('tournaments.import_btn')}
        </button>

        <button 
          onclick={() => goto('/panel/tournaments/create')}
          class="px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[11px] shadow-[0_20px_40px_rgba(124,58,237,0.3)] transition-all flex items-center gap-4 active:scale-95"
        >
          <Plus weight="bold" class="w-6 h-6" />
          {$t('tournaments.new_button')}
        </button>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
      {#each filteredTournaments as tournament, i (tournament.id)}
        {@const status = getStatusConfig(tournament.status)}
        <div 
          class="bento-card p-8 flex flex-col group relative overflow-hidden"
          in:fly={{ y: 30, delay: i * 50, duration: 600 }}
        >
          <!-- Premium Violet Glow -->
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/5 blur-[80px] group-hover:bg-violet-600/10 transition-all duration-700"></div>
          
          <div class="relative z-10 flex flex-col h-full">
            <!-- Top Actions Overlay -->
            <div class="absolute top-0 right-0 p-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
                <button 
                  onclick={() => goto(`/panel/tournaments/${tournament.id}/edit`)}
                  class="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                  aria-label={$t('common.edit')}
                >
                  <PencilSimple weight="bold" class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteTournament(tournament.id, tournament.name)}
                  class="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  aria-label={$t('common.delete')}
                >
                  <Trash weight="bold" class="w-4 h-4" />
                </button>
            </div>

            <!-- Avatar & Header -->
            <div class="flex items-center gap-6 mb-8">
                <div class="w-16 h-16 bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 font-outfit font-black text-2xl group-hover:border-violet-500/30 group-hover:text-violet-400 transition-all duration-700 relative shrink-0">
                  <div class="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {tournament.name[0].toUpperCase()}
                </div>
                <div class="min-w-0">
                  <h3 class="text-white font-outfit font-black text-xl leading-none group-hover:text-violet-400 transition-colors uppercase tracking-tighter truncate">{tournament.name}</h3>
                  <div class="mt-3 flex">
                    <span class="px-3 py-1 border text-[9px] font-outfit font-black uppercase tracking-widest {status.bg} {status.color} {status.border} shadow-lg backdrop-blur-md">
                       {status.label}
                    </span>
                  </div>
                </div>
            </div>

            <!-- Bento Stats Panel -->
            <div class="space-y-2 mb-8 mt-auto">
                <div class="flex items-center justify-between p-4 bg-zinc-950/30 border border-white/5 group/item hover:border-violet-500/20 transition-all">
                  <div class="flex items-center gap-3">
                      <CalendarBlank weight="duotone" class="w-4 h-4 text-zinc-600 group-hover:text-violet-400" />
                      <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{$t('tournaments.date_label')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-zinc-300">
                    {tournament.startAt ? new Date(tournament.startAt).toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' }) : $t('tournaments.date_pending')}
                  </span>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-zinc-950/30 border border-white/5 group/item hover:border-violet-500/20 transition-all">
                  <div class="flex items-center gap-3">
                      <Users weight="duotone" class="w-4 h-4 text-zinc-600 group-hover:text-violet-400" />
                      <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{$t('tournaments.participants')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-zinc-300">
                    {players.filter(p => p.tournamentId === tournament.id).length} {$t('tournaments.registered_label')}
                  </span>
                </div>

                <div class="flex items-center justify-between p-4 bg-zinc-950/30 border border-white/5 group/item hover:border-violet-500/20 transition-all">
                  <div class="flex items-center gap-3">
                      <Trophy weight="duotone" class="w-4 h-4 text-zinc-600 group-hover:text-violet-400" />
                      <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{$t('tournaments.format')}</span>
                  </div>
                  <span class="text-[9px] font-black text-violet-400/80 uppercase">
                    {tournament.format?.replace('_', ' ') || 'SWISS'}
                  </span>
                </div>
            </div>

            <!-- Manage Button -->
            <button 
              onclick={() => goto(`/panel/tournaments/${tournament.id}`)}
              class="w-full h-14 bg-zinc-950 hover:bg-violet-600 border border-zinc-800 hover:border-violet-500 text-zinc-500 hover:text-white flex items-center justify-center gap-4 text-[11px] font-outfit font-black transition-all duration-500 group/btn uppercase tracking-widest"
            >
              {$t('tournaments.manage')}
              <CaretRight weight="bold" class="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
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

