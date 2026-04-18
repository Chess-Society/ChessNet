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
    ArrowsClockwise
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

<div class="max-w-7xl mx-auto px-6 py-12" in:fade={{ duration: 300 }}>
  
  <!-- Back & Header -->
  <div class="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
    <div class="flex items-center gap-8">
      <button 
        onclick={() => goto('/panel/tournaments')} 
        class="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-[24px] flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-zinc-900 transition-all shadow-2xl active:scale-95 group shrink-0"
        aria-label="Back"
      >
        <ArrowLeft weight="bold" class="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>
      <div>
        <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-black text-violet-400 uppercase tracking-widest">{$t('tournaments.competition_engine')}</span>
            <span class="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
            <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('common.status_upcoming')}</span>
        </div>
        <h1 class="text-5xl font-outfit font-black text-white tracking-tighter uppercase italic">{$t('tournaments.new_title')}</h1>
        <p class="text-zinc-500 font-medium text-lg mt-1">{$t('tournaments.new_subtitle')}</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
    
    <!-- Left: Form Sections -->
    <div class="lg:col-span-2 space-y-8">
      <form onsubmit={handleSubmit} id="tournament-form" class="space-y-8">
        
        <!-- Section: Essential Metrics -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100"></div>
          
          <div class="flex items-center gap-5 mb-10 relative z-10">
            <div class="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-violet-500/20">
              <Trophy weight="duotone" class="w-8 h-8" />
            </div>
            <div>
                <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.general_info')}</h3>
                <p class="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">{$t('tournaments.competition_engine')}</p>
            </div>
          </div>

          <div class="space-y-8 relative z-10">
            <!-- Tournament Name -->
            <div class="space-y-3">
              <label for="t-name" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.name_label')}</label>
              <div class="relative group">
                <Trophy weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input 
                  id="t-name"
                  type="text" 
                  bind:value={tournament.name}
                  required
                  placeholder={$t('tournaments.name_placeholder')}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <!-- School Context Selection -->
            <div class="space-y-4 p-8 bg-zinc-950/50 border border-zinc-800 rounded-[30px] shadow-inner">
               <div class="flex items-center gap-3 mb-2">
                  <Buildings weight="duotone" class="w-5 h-5 text-zinc-500" />
                  <label for="school" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    {$t('classes.school_label')}
                  </label>
               </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each schools as school}
                  <button
                    type="button"
                    onclick={() => tournament.school_id = school.id}
                    class="flex items-center justify-between p-5 rounded-2xl border transition-all {tournament.school_id === school.id ? 'bg-violet-600/10 border-violet-500 text-white shadow-lg' : 'bg-black/20 border-zinc-800 text-zinc-500 hover:border-zinc-700'}"
                  >
                    <div class="flex items-center gap-4 text-left">
                      <div class="w-10 h-10 rounded-xl {tournament.school_id === school.id ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-600'} flex items-center justify-center transition-colors">
                        <Buildings weight="duotone" class="w-5 h-5" />
                      </div>
                      <div>
                        <p class="text-xs font-black uppercase tracking-widest">{school.name}</p>
                        <p class="text-[9px] font-bold opacity-60 uppercase tracking-tighter mt-0.5">{school.city}</p>
                      </div>
                    </div>
                    {#if tournament.school_id === school.id}
                      <CheckCircle weight="fill" class="w-6 h-6 text-violet-500 animate-scale" />
                    {/if}
                  </button>
                {/each}

                <button
                  type="button"
                  onclick={() => tournament.school_id = ''}
                  class="flex items-center justify-between p-5 rounded-2xl border transition-all {tournament.school_id === '' ? 'bg-zinc-800/20 border-zinc-700 text-white shadow-lg' : 'bg-black/20 border-zinc-800 text-zinc-500 hover:border-zinc-700'}"
                >
                  <div class="flex items-center gap-4 text-left">
                    <div class="w-10 h-10 rounded-xl {tournament.school_id === '' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-600'} flex items-center justify-center transition-colors">
                      <Sparkle weight="duotone" class="w-5 h-5" />
                    </div>
                    <div>
                      <p class="text-xs font-black uppercase tracking-widest">{$t('classes.independent')}</p>
                      <p class="text-[9px] font-bold opacity-60 uppercase tracking-tighter mt-0.5">PLATFORM WIDE</p>
                    </div>
                  </div>
                  {#if tournament.school_id === ''}
                    <CheckCircle weight="fill" class="w-6 h-6 text-zinc-400" />
                  {/if}
                </button>
              </div>

              {#if schools.length === 0}
                <div class="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4 items-start shadow-inner">
                  <Warning weight="fill" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div class="space-y-3">
                    <p class="text-[10px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
                      {$t('schools.empty_subtitle')}
                    </p>
                    <button 
                        type="button"
                        onclick={() => goto('/panel/schools/new')}
                        class="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2"
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
              <label for="t-desc" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.desc_label')}</label>
              <textarea 
                id="t-desc"
                bind:value={tournament.description}
                placeholder={$t('tournaments.desc_placeholder')}
                rows="4"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] px-6 py-5 text-sm text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Section: Logistics & Rules -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
          <div class="flex items-center gap-5 mb-10 relative z-10">
            <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <CalendarBlank weight="duotone" class="w-8 h-8" />
            </div>
            <div>
                <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.logistics_title')}</h3>
                <p class="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">SCHEDULING & FORMAT</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div class="space-y-3">
              <label for="t-date" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.date_label')}</label>
              <div class="relative group">
                <CalendarBlank weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input 
                  id="t-date"
                  type="date" 
                  bind:value={tournament.startDate}
                  required
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white font-bold [color-scheme:dark] focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-3">
              <label for="t-time" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.time_control_label')}</label>
              <div class="relative group">
                <Clock weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input 
                  id="t-time"
                  type="text" 
                  bind:value={tournament.timeControl}
                  placeholder={$t('tournaments.time_control_placeholder')}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-3">
              <label for="t-loc" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.location_label')}</label>
              <div class="relative group">
                <MapPin weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input 
                  id="t-loc"
                  type="text" 
                  bind:value={tournament.location}
                  placeholder={$t('tournaments.location_placeholder')}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-3">
              <label for="t-format" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.format_label')}</label>
              <div class="relative group">
                <Target weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <select 
                  id="t-format"
                  bind:value={tournament.format}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] pl-16 pr-12 py-5 text-sm text-white font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner"
                >
                  <option value="swiss">{$t('tournaments.format_swiss')}</option>
                  <option value="round_robin">{$t('tournaments.format_round_robin')}</option>
                  <option value="elimination">{$t('tournaments.format_elimination')}</option>
                </select>
                <CaretDown weight="bold" class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Capacity & Awards -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
          <div class="flex items-center gap-5 mb-10 relative z-10">
            <div class="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
              <Coins weight="duotone" class="w-8 h-8" />
            </div>
            <div>
                <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.capacity_title')}</h3>
                <p class="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">PARTICIPANTS & PRIZES</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div class="space-y-3">
              <label for="t-max" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.max_players_label')}</label>
              <div class="relative group">
                <UsersThree weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input 
                  id="t-max"
                  type="number" 
                  bind:value={tournament.maxPlayers}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white font-bold focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-3">
              <label for="t-prize" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.prize_pool_label')} ({$t('common.currency')})</label>
              <div class="relative group">
                <Coins weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input 
                  id="t-prize"
                  type="number" 
                  bind:value={tournament.prizePool}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white font-bold focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Right: Sticky Preview & Guidance -->
    <div class="lg:col-span-1">
      <div class="sticky top-12 space-y-8">
        
        <!-- Premium Preview Card (Matches List Style) -->
        <div class="bg-[#0c0c0e] border border-zinc-800 rounded-[40px] p-8 shadow-2xl overflow-hidden relative group">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-8">
              <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800 shadow-inner">
                {$t('tournaments.preview')}
              </span>
              <div class="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-violet-500/20">
                <Trophy weight="duotone" class="w-6 h-6" />
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-zinc-950/50 p-6 rounded-[28px] border border-zinc-800 shadow-inner">
                <h4 class="text-2xl font-outfit font-black text-white leading-tight uppercase truncate tracking-tighter italic">
                  {tournament.name || $t('tournaments.untitled')}
                </h4>
                <div class="mt-4 flex">
                  <span class="px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {$t('tournaments.status_upcoming')}
                  </span>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-2xl">
                  <div class="flex items-center gap-3">
                    <CalendarBlank weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.date_label')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-white uppercase">
                    {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' }) : $t('tournaments.date_pending')}
                  </span>
                </div>
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-2xl">
                  <div class="flex items-center gap-3">
                    <Target weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.format')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-violet-400 uppercase">{getFormatLabel(tournament.format)}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-2xl">
                  <div class="flex items-center gap-3">
                    <UsersThree weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.max_players_label')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-white uppercase">{tournament.maxPlayers} PLAYERS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Panel -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
          <div class="p-5 bg-violet-600/5 rounded-2xl border border-violet-500/20 mb-8 flex gap-4 items-start">
             <Info weight="duotone" class="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
             <p class="text-[11px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
               {$t('tournaments.create_player_desc') || 'The tournament will be created in draught status. You can add players and generate rounds once created.'}
             </p>
          </div>
          
          <div class="space-y-4">
            <button 
              form="tournament-form"
              type="submit"
              disabled={isSubmitting}
              class="w-full h-16 bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center gap-4 rounded-3xl text-[12px] font-outfit font-black transition-all duration-300 shadow-xl shadow-violet-600/20 active:scale-95 group disabled:opacity-50 uppercase tracking-[0.2em]"
            >
              {#if isSubmitting}
                <ArrowsClockwise weight="bold" class="w-6 h-6 animate-spin" />
              {:else}
                <CheckCircle weight="bold" class="w-6 h-6 group-hover:scale-110 transition-transform" />
              {/if}
              {$t('tournaments.publish')}
            </button>
            <button 
              onclick={() => goto('/panel/tournaments')}
              class="w-full h-16 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white flex items-center justify-center rounded-3xl text-[12px] font-outfit font-black transition-all active:scale-95 uppercase tracking-[0.2em]"
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
