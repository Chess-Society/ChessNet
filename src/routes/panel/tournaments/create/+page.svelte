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
    CaretDown
  } from 'phosphor-svelte';
  import { t, locale } from '$lib/i18n';
  import { goto, invalidateAll } from '$app/navigation';
  import { fade, fly, scale } from 'svelte/transition';
  import { showToast, showError } from '$lib/stores/toast';
  import { appStore } from '$lib/stores/appStore';

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

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      isSubmitting = true;
      
      const tournamentToCreate = {
          ...tournament,
          startAt: tournament.startDate,
          time_control: tournament.timeControl,
          max_players: tournament.maxPlayers,
          prize_pool: tournament.prizePool,
          selected_students: [] // No pre-selected students in this simplified form
      };

      await appStore.addLocalTournament(tournamentToCreate);

      showToast.success($t('tournaments.create_success'));
      await invalidateAll();
      setTimeout(() => {
        goto(`/panel/tournaments`);
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
      case 'elimination': return $t('tournaments.format_elimination');
      default: return f;
    }
  };
</script>

<svelte:head>
  <title>New Tournament - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-8" in:fade={{ duration: 300 }}>
  
  <!-- Back & Header -->
  <div class="flex items-center gap-6 mb-12">
    <button 
      onclick={() => goto('/panel/tournaments')} 
      class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-lg"
      aria-label="Back"
    >
      <ArrowLeft weight="bold" class="w-5 h-5" />
    </button>
    <div>
      <h1 class="text-4xl font-outfit font-black text-white tracking-tight">{$t('tournaments.new_title')}</h1>
      <p class="text-zinc-500 font-plus-jakarta text-base mt-1">{$t('tournaments.new_subtitle')}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Left: Form Sections -->
    <div class="lg:col-span-2 space-y-8">
      <form onsubmit={handleSubmit} id="tournament-form" class="space-y-8">
        
        <!-- Section 1: Basic Info -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 opacity-5">
            <Trophy weight="duotone" class="w-32 h-32 text-white" />
          </div>
          
          <h3 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3 relative z-10">
            <div class="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500">
              <Info weight="duotone" class="w-6 h-6" />
            </div>
            {$t('tournaments.general_info')}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div class="space-y-2 md:col-span-2">
              <label for="t-name" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.name_label')}</label>
              <input 
                id="t-name"
                type="text" 
                bind:value={tournament.name}
                required
                placeholder={$t('tournaments.name_placeholder')}
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-700 shadow-inner"
              />
            </div>

            <!-- School/Independent Selection -->
            <div class="space-y-4 md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/5">
              <label for="school" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                {$t('classes.school_label')}
              </label>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each schools as school}
                  <button
                    type="button"
                    onclick={() => tournament.school_id = school.id}
                    class="flex items-center justify-between p-4 rounded-xl border transition-all {tournament.school_id === school.id ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10'}"
                  >
                    <div class="flex items-center gap-3 text-left">
                      <div class="p-2 rounded-lg {tournament.school_id === school.id ? 'bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-500'}">
                        <Buildings weight="duotone" class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="text-xs font-black uppercase tracking-wider">{school.name}</p>
                        <p class="text-[10px] opacity-60">{school.city}</p>
                      </div>
                    </div>
                    {#if tournament.school_id === school.id}
                      <CheckCircle weight="fill" class="w-5 h-5 text-violet-500" />
                    {/if}
                  </button>
                {/each}

                <button
                  type="button"
                  onclick={() => tournament.school_id = ''}
                  class="flex items-center justify-between p-4 rounded-xl border transition-all {tournament.school_id === '' ? 'bg-zinc-800 border-zinc-700 text-white shadow-lg' : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10'}"
                >
                  <div class="flex items-center gap-3 text-left">
                    <div class="p-2 rounded-lg {tournament.school_id === '' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-500'}">
                      <Info weight="duotone" class="w-4 h-4" />
                    </div>
                    <div>
                      <p class="text-xs font-black uppercase tracking-wider">{$t('classes.independent')}</p>
                      <p class="text-[10px] opacity-60">{$t('common.unknown')}</p>
                    </div>
                  </div>
                  {#if tournament.school_id === ''}
                    <CheckCircle weight="fill" class="w-5 h-5 text-zinc-500" />
                  {/if}
                </button>
              </div>

              {#if schools.length === 0}
                <div class="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2 mt-2">
                  <div class="flex items-center gap-2 text-amber-500">
                    <Warning weight="fill" class="w-3.5 h-3.5" />
                    <p class="text-[9px] font-black uppercase tracking-widest">{$t('schools.empty_title')}</p>
                  </div>
                  <p class="text-zinc-500 text-[9px] font-medium leading-relaxed uppercase tracking-wider">
                    {$t('schools.empty_subtitle')}
                  </p>
                  <button 
                    type="button"
                    onclick={() => goto('/panel/schools/new')}
                    class="text-amber-500 text-[9px] font-black uppercase tracking-widest hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    {$t('schools.empty_btn')}
                    <Plus weight="bold" class="w-2.5 h-2.5" />
                  </button>
                </div>
              {/if}
            </div>

            <div class="space-y-2 md:col-span-2">
              <label for="t-desc" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.desc_label')}</label>
              <textarea 
                id="t-desc"
                bind:value={tournament.description}
                placeholder={$t('tournaments.desc_placeholder')}
                rows="3"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-700 shadow-inner resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Section 2: Logistics & Rules -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl overflow-hidden">
          <h3 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <CalendarBlank weight="duotone" class="w-6 h-6" />
            </div>
            {$t('tournaments.logistics_title')}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="t-date" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.date_label')}</label>
              <div class="relative">
                <CalendarBlank weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-date"
                  type="date" 
                  bind:value={tournament.startDate}
                  required
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-inner [color-scheme:dark]"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="t-time" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.time_control_label')}</label>
              <div class="relative">
                <Clock weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-time"
                  type="text" 
                  bind:value={tournament.timeControl}
                  placeholder={$t('tournaments.time_control_placeholder')}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-700 shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="t-loc" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.location_label')}</label>
              <div class="relative">
                <MapPin weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-loc"
                  type="text" 
                  bind:value={tournament.location}
                  placeholder={$t('tournaments.location_placeholder')}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-700 shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="t-format" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.format_label')}</label>
              <div class="relative">
                <Target weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 pointer-events-none" />
                <select 
                  id="t-format"
                  bind:value={tournament.format}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer shadow-inner font-bold"
                >
                  <option value="swiss">{$t('tournaments.format_swiss')}</option>
                  <option value="round_robin">{$t('tournaments.format_round_robin')}</option>
                  <option value="elimination">{$t('tournaments.format_elimination')}</option>
                </select>
                <CaretDown weight="bold" class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Players & Prizes -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl overflow-hidden">
          <h3 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
            <div class="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500">
              <Coins weight="duotone" class="w-6 h-6" />
            </div>
            {$t('tournaments.capacity_title')}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="t-max" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.max_players_label')}</label>
              <div class="relative">
                <UsersThree weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-max"
                  type="number" 
                  bind:value={tournament.maxPlayers}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="t-prize" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.prize_pool_label')} ({$t('common.currency')})</label>
              <div class="relative">
                <Coins weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-prize"
                  type="number" 
                  bind:value={tournament.prizePool}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Right: Sticky Preview & Actions -->
    <div class="lg:col-span-1">
      <div class="sticky top-8 space-y-6">
        
        <!-- Live Preview Card -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 shadow-2xl overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100 transition-opacity"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-8">
              <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800">{$t('tournaments.preview')}</span>
              <div class="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-violet-500">
                <Trophy weight="duotone" class="w-6 h-6" />
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <h4 class="text-2xl font-outfit font-black text-white leading-tight uppercase truncate">
                  {tournament.name || $t('tournaments.untitled')}
                </h4>
                <div class="mt-2 flex">
                  <span class="px-2.5 py-1 rounded-lg border text-[10px] font-outfit font-black uppercase tracking-widest bg-violet-500/10 text-violet-400 border-violet-500/20">
                    {$t('classes.status_active')}
                  </span>
                </div>
              </div>

              <div class="space-y-4 pt-4 border-t border-zinc-800/50">
                <div class="flex items-center gap-3 text-zinc-400 font-plus-jakarta text-sm">
                  <CalendarBlank weight="duotone" class="w-5 h-5 text-zinc-500" />
                  <span>{tournament.startDate ? new Date(tournament.startDate).toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' }) : $t('tournaments.date_pending')}</span>
                </div>
                <div class="flex items-center gap-3 text-zinc-400 font-plus-jakarta text-sm">
                  <Target weight="duotone" class="w-5 h-5 text-zinc-500" />
                  <span>{getFormatLabel(tournament.format)}</span>
                </div>
                <div class="flex items-center gap-3 text-zinc-400 font-plus-jakarta text-sm">
                  <UsersThree weight="duotone" class="w-5 h-5 text-zinc-500" />
                  <span>Max. {tournament.maxPlayers} {$t('classes.students')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Card -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
          <p class="text-zinc-500 text-sm font-plus-jakarta mb-6 text-center italic">
            {$t('tournaments.quote')}
          </p>
          
          <div class="flex flex-col gap-3">
            <button 
              form="tournament-form"
              type="submit"
              disabled={isSubmitting}
              class="w-full bg-violet-600 hover:bg-violet-500 text-white font-outfit font-black py-4 rounded-2xl transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {#if isSubmitting}
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {:else}
                <CheckCircle weight="bold" class="w-6 h-6 group-hover:scale-110 transition-transform" />
              {/if}
              {$t('tournaments.publish')}
            </button>
            <button 
              onclick={() => goto('/panel/tournaments')}
              class="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-outfit font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              {$t('tournaments.discard')}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar for textareas if needed */
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
</style>
