<script lang="ts">
  import { 
    Trophy, 
    CalendarBlank, 
    Clock, 
    MapPin, 
    Target, 
    Coins, 
    ArrowLeft,
    Users,
    Info,
    CheckCircle,
    CaretRight,
    UsersThree,
    Buildings,
    Warning,
    Plus,
    CaretDown,
    Sparkle,
    ArrowsClockwise,
    Check,
    FloppyDisk,
    X,
    ArrowArcLeft
  } from 'phosphor-svelte';
  import { t, locale } from '$lib/i18n';
  import { goto, invalidateAll } from '$app/navigation';
  import { fade, fly, scale } from 'svelte/transition';
  import { showToast, showError } from '$lib/stores/toast';
  import { appStore } from '$lib/stores/appStore';
  import { localTournamentsApi } from '$lib/api/local-tournaments';

  let { data } = $props<{ data: any }>();
  let schools = $derived(data.schools || []);

  let tournament = $state({
    name: '',
    startDate: '',
    timeControl: '15 + 10',
    location: '',
    school_id: '',
    format: 'swiss',
    maxPlayers: 16,
    prizePool: 0,
    description: ''
  });

  let isSubmitting = $state(false);

  const handleSubmit = async (e?: Event) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    if (!tournament.name.trim()) {
      showToast.error($t('common.error_form'));
      return;
    }

    try {
      isSubmitting = true;
      
      const tournamentToCreate = {
          ...tournament,
          startAt: tournament.startDate,
          time_control: tournament.timeControl,
          max_players: tournament.maxPlayers,
          prize_pool: tournament.prizePool,
          selected_students: []
      };

      const created = await localTournamentsApi.createTournament(tournamentToCreate as any);

      showToast.success($t('tournaments.create_success'));
      await invalidateAll();
      setTimeout(() => {
        goto(`/panel/tournaments/${created.id}`);
      }, 400);
    } catch (error) {
      showError(error);
    } finally {
      isSubmitting = false;
    }
  };

  const getFormatLabel = (f: string) => {
    switch(f) {
      case 'swiss': return $t('tournaments.format_swiss');
      case 'round_robin': return $t('tournaments.format_round_robin');
      case 'knockout': return $t('tournaments.format_elimination');
      default: return f;
    }
  };
</script>

<svelte:head>
  <title>{$t('tournaments.new_title')} - ChessNet</title>
</svelte:head>

<!-- Premium Sticky Header -->
<div class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
    <div class="max-w-[1400px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <button 
          onclick={() => goto('/panel/tournaments')}
          class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all active:scale-95 group"
        >
          <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('tournaments.new_title')}</h1>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{$t('tournaments.competition_engine')}</p>
        </div>
      </div>
  
      <div class="flex items-center gap-4">
        <button 
          onclick={() => goto('/panel/tournaments')}
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-none text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          <X weight="bold" class="w-4 h-4" />
          {$t('common.cancel')}
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="flex items-center gap-3 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-none text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/20 active:scale-95 disabled:opacity-50 group"
        >
          {#if isSubmitting}
            <ArrowsClockwise weight="bold" class="w-4 h-4 animate-spin" />
          {:else}
            <FloppyDisk weight="bold" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          {/if}
          {$t('tournaments.publish')}
        </button>
      </div>
    </div>
  </div>

<div class="max-w-[1400px] mx-auto px-6 md:px-12 py-12" in:fade={{ duration: 300 }}>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
    
    <!-- Left: Form Sections (8 Columns) -->
    <div class="lg:col-span-8 space-y-10">
      
      <!-- Section: General Info -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100"></div>
        
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
            <Trophy weight="duotone" class="w-8 h-8" />
          </div>
          <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.general_info')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.competition_engine')}</p>
          </div>
        </div>

        <div class="space-y-10 relative z-10">
          <!-- Tournament Name -->
          <div class="space-y-3">
            <label for="t-name" class="glass-label">{$t('tournaments.name_label')} <span class="text-violet-500">*</span></label>
            <div class="relative group">
              <Trophy weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
              <input 
                id="t-name"
                type="text" 
                bind:value={tournament.name}
                required
                placeholder={$t('tournaments.name_placeholder')}
                class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
              />
            </div>
          </div>

          <!-- School Context Selection -->
          <div class="space-y-6">
             <div class="flex items-center gap-3">
                <Buildings weight="duotone" class="w-5 h-5 text-zinc-400" />
                <span class="glass-label !ml-0">
                  {$t('classes.school_label')}
                </span>
             </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each schools as school}
                <button
                  type="button"
                  onclick={() => tournament.school_id = school.id}
                  class="selection-card {tournament.school_id === school.id ? 'active' : ''}"
                >
                  <div class="card-icon">
                    <Buildings weight={tournament.school_id === school.id ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{school.name}</span>
                    <p class="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">{school.city}</p>
                  </div>
                  {#if tournament.school_id === school.id}
                    <div class="card-check" in:scale>
                      <Check size={14} weight="bold" />
                    </div>
                  {/if}
                </button>
              {/each}

              <button
                type="button"
                onclick={() => tournament.school_id = ''}
                class="selection-card {tournament.school_id === '' ? 'active' : ''}"
              >
                <div class="card-icon">
                  <Sparkle weight={tournament.school_id === '' ? "fill" : "duotone"} />
                </div>
                <div class="card-content">
                  <span class="card-title">{$t('classes.independent')}</span>
                  <p class="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">{$t('common.verified')}</p>
                </div>
                {#if tournament.school_id === ''}
                  <div class="card-check" in:scale>
                    <Check size={14} weight="bold" />
                  </div>
                {/if}
              </button>
            </div>

            {#if schools.length === 0}
              <div class="p-6 bg-amber-500/5 border border-amber-500/10 rounded-none flex gap-4 items-start shadow-inner mt-4">
                <Warning weight="fill" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div class="space-y-3">
                  <p class="text-[10px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
                    {$t('schools.empty_subtitle')}
                  </p>
                  <button 
                      type="button"
                      onclick={() => goto('/panel/schools/create')}
                      class="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-none transition-all flex items-center gap-2"
                  >
                      {$t('schools.empty_btn')}
                      <Plus weight="bold" class="w-3 h-3" />
                  </button>
                </div>
              </div>
            {/if}
          </div>

          <!-- Description -->
          <div class="space-y-3">
            <label for="t-desc" class="glass-label">{$t('tournaments.desc_label')}</label>
            <textarea 
              id="t-desc"
              bind:value={tournament.description}
              placeholder={$t('tournaments.desc_placeholder')}
              rows="4"
              class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50"
            ></textarea>
          </div>
        </div>
      </section>

      <!-- Section: Logistics & Rules -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-none flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/10">
            <CalendarBlank weight="duotone" class="w-8 h-8" />
          </div>
          <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.logistics_title')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.scheduling')}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div class="space-y-3">
            <label for="t-date" class="glass-label">{$t('tournaments.date_label')}</label>
            <div class="relative group">
              <CalendarBlank weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <input 
                id="t-date"
                type="date" 
                bind:value={tournament.startDate}
                required
                class="glass-input pl-16 pr-8 w-full [color-scheme:dark] focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-950/50"
              />
            </div>
          </div>

          <div class="space-y-3">
            <label for="t-time" class="glass-label">{$t('tournaments.time_control_label')}</label>
            <div class="relative group">
              <Clock weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <input 
                id="t-time"
                type="text" 
                bind:value={tournament.timeControl}
                placeholder={$t('tournaments.time_control_placeholder')}
                class="glass-input pl-16 pr-8 w-full focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-950/50"
              />
            </div>
          </div>

          <div class="space-y-3">
            <label for="t-loc" class="glass-label">{$t('tournaments.location_label')}</label>
            <div class="relative group">
              <MapPin weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <input 
                id="t-loc"
                type="text" 
                bind:value={tournament.location}
                placeholder={$t('tournaments.location_placeholder')}
                class="glass-input pl-16 pr-8 w-full focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-950/50"
              />
            </div>
          </div>

          <div class="space-y-4">
            <span class="glass-label">{$t('tournaments.format_label')}</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {#each [
                { id: 'swiss', icon: UsersThree, label: 'tournaments.format_swiss' },
                { id: 'round_robin', icon: ArrowsClockwise, label: 'tournaments.format_round_robin' },
                { id: 'knockout', icon: Trophy, label: 'tournaments.format_elimination' }
              ] as format}
                <button
                  type="button"
                  onclick={() => tournament.format = format.id}
                  class="selection-card small {tournament.format === format.id ? 'active' : ''}"
                >
                  <div class="card-icon">
                    <format.icon weight={tournament.format === format.id ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{$t(format.label)}</span>
                  </div>
                  {#if tournament.format === format.id}
                    <div class="card-check" in:scale>
                      <Check size={12} weight="bold" />
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Capacity & Awards -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-amber-600/20 border border-amber-500/30 rounded-none flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
            <Coins weight="duotone" class="w-8 h-8" />
          </div>
          <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.capacity_title')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.participants')}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div class="space-y-3">
            <label for="t-max" class="glass-label">{$t('tournaments.max_players_label')}</label>
            <div class="relative group">
              <UsersThree weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-amber-500 transition-colors pointer-events-none" />
              <input 
                id="t-max"
                type="number" 
                bind:value={tournament.maxPlayers}
                class="glass-input pl-16 pr-8 w-full focus:ring-amber-500/20 focus:border-amber-500 bg-zinc-950/50"
              />
            </div>
          </div>

          <div class="space-y-3">
            <label for="t-prize" class="glass-label">{$t('tournaments.prize_pool_label')} ({$t('common.currency')})</label>
            <div class="relative group">
              <Coins weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-amber-500 transition-colors pointer-events-none" />
              <input 
                id="t-prize"
                type="number" 
                bind:value={tournament.prizePool}
                class="glass-input pl-16 pr-8 w-full focus:ring-amber-500/20 focus:border-amber-500 bg-zinc-950/50 font-outfit font-black text-amber-400"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Right: Sticky Sidebar (4 Columns) -->
    <div class="lg:col-span-4">
      <div class="sticky top-32 space-y-8">
        
        <!-- Premium Preview Card -->
        <div class="bento-card !p-8 overflow-hidden relative group">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 rounded-none blur-3xl"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-8">
              <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-4 py-2 rounded-none border border-zinc-800 shadow-inner">
                {$t('tournaments.preview')}
              </span>
              <div class="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
                <Trophy weight="duotone" class="w-6 h-6" />
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-zinc-950/50 p-6 rounded-none border border-zinc-800/50 shadow-inner">
                <h4 class="text-2xl font-outfit font-black text-white leading-tight uppercase truncate tracking-tighter italic">
                  {tournament.name || $t('tournaments.untitled')}
                </h4>
                <div class="mt-4 flex">
                  <span class="px-3 py-1 rounded-none border text-[9px] font-black uppercase tracking-[0.15em] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {$t('common.status_upcoming')}
                  </span>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                  <div class="flex items-center gap-3">
                    <CalendarBlank weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.date_label')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-white uppercase">
                    {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' }) : $t('tournaments.date_pending')}
                  </span>
                </div>
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                  <div class="flex items-center gap-3">
                    <Target weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.format')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-violet-400 uppercase">{getFormatLabel(tournament.format)}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                  <div class="flex items-center gap-3">
                    <UsersThree weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.max_players_label')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-white uppercase">{tournament.maxPlayers} {$t('tournaments.players')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Panel -->
        <div class="bento-card !p-8 relative overflow-hidden bg-violet-600/5 border-violet-500/20">
          <div class="flex gap-4 items-start mb-8">
             <Info weight="duotone" class="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
             <p class="text-[11px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
               {$t('tournaments.create_player_desc')}
             </p>
          </div>
          
          <button 
            onclick={() => goto('/panel/tournaments')}
            class="w-full h-14 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white flex items-center justify-center rounded-none text-[11px] font-black transition-all active:scale-95 uppercase tracking-widest gap-3"
          >
            <ArrowArcLeft weight="bold" class="w-4 h-4" />
            {$t('tournaments.discard')}
          </button>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 0px;
  }
</style>

