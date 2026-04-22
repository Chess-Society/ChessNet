<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    CaretLeft,
    Trophy,
    FloppyDisk,
    Calendar,
    Clock,
    Users,
    CurrencyEur,
    MapPin,
    Target,
    FileText,
    Warning,
    WarningCircle,
    CheckCircle,
    Gear,
    Trash,
    ArrowCounterClockwise,
    Info,
    Layout,
    Pulse,
    ArrowsClockwise,
    UsersThree,
    Check,
    ArrowLeft,
    X,
    ArrowArcLeft,
    Buildings
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, slide, fly, scale } from 'svelte/transition';
  import type { LocalTournament as Tournament } from '$lib/types/local-tournament';
  import { localTournamentsApi } from '$lib/api/local-tournaments';
  import { appStore } from '$lib/stores/appStore';
  import { get } from 'svelte/store';
  import { showToast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  
  let { data }: { data: PageData } = $props();

  let tournament = $state(untrack(() => data.tournament as Tournament));
  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});
  let showDeleteConfirm = $state(false);
  let showResetConfirm = $state(false);

  // Form data using Svelte 5 state
  let formData = $state({
    name: tournament?.name || '',
    description: tournament?.description || '',
    format: tournament?.format || 'swiss',
    timeControl: tournament?.timeControl || '15+10',
    maxPlayers: tournament?.maxPlayers || 16,
    entryFee: tournament?.entryFee || 0,
    prizePool: tournament?.prizePool || 0,
    startAt: tournament?.startAt ? new Date(tournament.startAt).toISOString().slice(0, 16) : '',
    endAt: tournament?.endAt ? new Date(tournament.endAt).toISOString().slice(0, 16) : '',
    registrationDeadline: tournament?.registrationDeadline ? new Date(tournament.registrationDeadline).toISOString().slice(0, 16) : '',
    location: tournament?.location || '',
    organizer: tournament?.organizer || '',
    notes: tournament?.notes || '',
    rules: tournament?.rules || '',
    schoolId: tournament?.schoolId || ''
  });

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) errors.name = $t('tournaments.form.name_required');
    if (!formData.description.trim()) errors.description = $t('tournaments.form.desc_required');
    if (formData.maxPlayers < 2) errors.maxPlayers = $t('tournaments.form.min_players_error');
    if (formData.maxPlayers > 64) errors.maxPlayers = $t('tournaments.form.max_players_error');
    if (formData.entryFee < 0) errors.entryFee = $t('tournaments.form.negative_error');
    if (formData.prizePool < 0) errors.prizePool = $t('tournaments.form.negative_error');
    
    if (!formData.startAt) errors.startAt = $t('tournaments.form.required');
    if (!formData.endAt) errors.endAt = $t('tournaments.form.required');
    if (!formData.registrationDeadline) errors.registrationDeadline = $t('tournaments.form.required');

    if (formData.startAt && formData.endAt) {
      if (new Date(formData.endAt) <= new Date(formData.startAt)) {
        errors.endAt = $t('tournaments.form.date_sequence_error');
      }
    }

    if (!formData.location.trim()) errors.location = $t('tournaments.form.location_required');

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    isSubmitting = true;

    try {
      const updates = {
        ...formData,
        format: formData.format as any,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString()
      };

      await localTournamentsApi.updateTournament(tournament.id, updates);
      showToast.success($t('tournaments.updates.success'));
      goto(`/panel/tournaments/${tournament.id}`);
    } catch (error) {
      console.error('❌ Error updating tournament:', error);
      showToast.error($t('tournaments.updates.error'));
    } finally {
      isSubmitting = false;
    }
  };

  const handleDelete = async () => {
    try {
      await localTournamentsApi.deleteTournament(tournament.id);
      showToast.success($t('tournaments.delete.success'));
      goto('/panel/tournaments');
    } catch (error) {
      console.error('❌ Error deleting tournament:', error);
      showToast.error($t('tournaments.delete.error'));
    }
  };

  const handleReset = async () => {
    try {
      await localTournamentsApi.updateTournament(tournament.id, { 
        status: 'upcoming',
        currentRound: 1
      });
      showToast.success($t('tournaments.reset.success'));
      window.location.reload();
    } catch (error) {
      console.error('❌ Error resetting tournament:', error);
      showToast.error($t('tournaments.reset.error'));
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    upcoming: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    in_progress: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20'
  };
</script>

<svelte:head>
  <title>Edit | {formData.name || $t('tournaments.untitled')} - ChessNet</title>
</svelte:head>

<!-- Premium Sticky Header -->
<div class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
  <div class="max-w-[1400px] mx-auto flex items-center justify-between">
    <div class="flex items-center gap-6">
      <button 
        onclick={() => goto(`/panel/tournaments/${tournament.id}`)}
        class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all active:scale-95 group"
      >
        <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </button>
      <div>
        <div class="flex items-center gap-3">
            <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('tournaments.manage_title')}</h1>
            <span class="px-2 py-0.5 rounded-none text-[8px] font-black uppercase border {statusColors[tournament.status]}">
              {$t(`tournaments.status_${tournament.status}`)}
            </span>
        </div>
        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{formData.name || $t('tournaments.untitled')}</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button 
        onclick={() => goto(`/panel/tournaments/${tournament.id}`)}
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
        {$t('common.save')}
      </button>
    </div>
  </div>
</div>

<div class="max-w-[1400px] mx-auto px-6 md:px-12 py-12" in:fade={{ duration: 300 }}>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
    
    <!-- Left: Form Sections (8 Columns) -->
    <div class="lg:col-span-8 space-y-10">
      
      <!-- Section: Identity Info -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100"></div>
        
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
            <Trophy weight="duotone" class="w-8 h-8" />
          </div>
          <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.identity_info')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.identity_desc')}</p>
          </div>
        </div>

        <div class="space-y-10 relative z-10">
          <div class="space-y-3">
            <label for="tournament-name" class="glass-label">{$t('tournaments.form.name')} <span class="text-violet-500">*</span></label>
            <div class="relative group">
               <Trophy weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
               <input 
                id="tournament-name"
                type="text" 
                bind:value={formData.name}
                class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
                placeholder={$t('tournaments.form.name_placeholder')}
              />
            </div>
            {#if errors.name}<p class="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.name}</p>{/if}
          </div>

          <div class="space-y-3">
            <label for="tournament-description" class="glass-label">{$t('common.description')}</label>
            <textarea 
              id="tournament-description"
              bind:value={formData.description}
              rows="3"
              class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50"
              placeholder={$t('tournaments.form.notes_placeholder')}
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-4">
              <span class="glass-label mb-2 block">{$t('tournaments.game_system')}</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {#each [
                  { id: 'swiss', icon: UsersThree, label: 'tournaments.type_swiss' },
                  { id: 'round_robin', icon: ArrowsClockwise, label: 'tournaments.type_round_robin' },
                  { id: 'knockout', icon: Trophy, label: 'tournaments.type_knockout' }
                ] as format}
                  <button
                    type="button"
                    onclick={() => (formData.format as any) = format.id}
                    class="selection-card small {formData.format === format.id ? 'active' : ''}"
                  >
                    <div class="card-icon">
                      <format.icon weight={formData.format === format.id ? "fill" : "duotone"} />
                    </div>
                    <div class="card-content">
                      <span class="card-title">{$t(format.label)}</span>
                    </div>
                    {#if formData.format === format.id}
                      <div class="card-check" in:scale>
                        <Check size={12} weight="bold" />
                      </div>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
            <div class="space-y-3">
              <label for="tournament-time-control" class="glass-label">{$t('tournaments.time_control')}</label>
              <div class="relative group">
                  <Clock weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                  <input 
                    id="tournament-time-control"
                    type="text" 
                    bind:value={formData.timeControl}
                    class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
                    placeholder="10+5"
                  />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Logistics & Config -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
            <MapPin weight="duotone" class="w-8 h-8" />
          </div>
          <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.logistics_details')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.logistics_desc')}</p>
          </div>
        </div>

        <div class="space-y-10 relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-3">
              <label for="max-players" class="glass-label">{$t('tournaments.max_capacity')}</label>
              <input id="max-players" type="number" bind:value={formData.maxPlayers} class="glass-input w-full px-6 bg-zinc-950/50 font-bold" />
            </div>
            <div class="space-y-3">
              <label for="entry-fee" class="glass-label">{$t('tournaments.entry_fee_label')}</label>
              <div class="relative">
                <input id="entry-fee" type="number" bind:value={formData.entryFee} class="glass-input w-full px-6 bg-zinc-950/50 text-violet-400 font-bold" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black">€</span>
              </div>
            </div>
            <div class="space-y-3">
              <label for="prize-pool" class="glass-label">{$t('tournaments.prize_pool_label')}</label>
              <div class="relative">
                <input id="prize-pool" type="number" bind:value={formData.prizePool} class="glass-input w-full px-6 bg-zinc-950/50 text-violet-400 font-black" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black">€</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-3">
              <label for="location" class="glass-label">{$t('tournaments.location_platform')}</label>
              <div class="relative group">
                  <MapPin weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                  <input id="location" type="text" bind:value={formData.location} class="glass-input pl-16 w-full bg-zinc-950/50" />
              </div>
            </div>
            <div class="space-y-3">
              <label for="organizer" class="glass-label">{$t('tournaments.organizing_entity')}</label>
              <div class="relative group">
                  <Buildings weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                  <input id="organizer" type="text" bind:value={formData.organizer} class="glass-input pl-16 w-full bg-zinc-950/50" />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
            <div class="space-y-2">
              <label for="start-date" class="glass-label">{$t('tournaments.start')}</label>
              <input id="start-date" type="datetime-local" bind:value={formData.startAt} class="glass-input w-full px-4 text-xs [color-scheme:dark] bg-zinc-950/50" />
            </div>
            <div class="space-y-2">
              <label for="end-date" class="glass-label">{$t('tournaments.status_completed')}</label>
              <input id="end-date" type="datetime-local" bind:value={formData.endAt} class="glass-input w-full px-4 text-xs [color-scheme:dark] bg-zinc-950/50" />
            </div>
            <div class="space-y-2">
              <label for="reg-deadline" class="glass-label">{$t('tournaments.registration_deadline')}</label>
              <input id="reg-deadline" type="datetime-local" bind:value={formData.registrationDeadline} class="glass-input w-full px-4 text-xs text-violet-400 [color-scheme:dark] bg-zinc-950/50" />
            </div>
          </div>
        </div>
      </section>

      <!-- Rules and Documentation -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
            <FileText weight="duotone" class="w-8 h-8" />
          </div>
          <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.documentation')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.doc_desc')}</p>
          </div>
        </div>

        <div class="space-y-10 relative z-10">
          <div class="space-y-3">
            <label for="rules" class="glass-label">{$t('tournaments.rules')}</label>
            <textarea 
              id="rules"
              bind:value={formData.rules}
              rows="5"
              class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50 focus:ring-violet-500/20 focus:border-violet-500"
              placeholder={$t('tournaments.rules_placeholder')}
            ></textarea>
          </div>
          <div class="space-y-3">
            <label for="staff_notes" class="glass-label">{$t('tournaments.staff_notes')}</label>
            <textarea 
              id="staff_notes"
              bind:value={formData.notes}
              rows="2"
              class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50 focus:ring-violet-500/20 focus:border-violet-500 opacity-70"
              placeholder={$t('tournaments.staff_notes_placeholder')}
            ></textarea>
          </div>
        </div>
      </section>

      <!-- Danger Zone -->
      <section class="bento-card !p-10 bg-red-500/5 border-red-500/20 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[80px] rounded-none -mr-16 -mt-16 group-hover:bg-red-500/10 transition-all duration-700"></div>
        <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div class="text-center md:text-left">
            <h3 class="text-xl font-outfit font-black text-red-100 uppercase italic tracking-wider mb-2">{$t('tournaments.danger_zone')}</h3>
            <p class="text-red-400/60 text-[10px] font-black uppercase tracking-widest">{$t('tournaments.danger_zone_desc')}</p>
          </div>
          <div class="flex items-center gap-4">
            <button 
              onclick={() => showResetConfirm = true}
              class="h-12 px-6 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
            >
              {$t('tournaments.reset_tournament')}
            </button>
            <button 
              onclick={() => showDeleteConfirm = true}
              class="h-12 px-6 rounded-none bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
            >
              {$t('common.delete')}
            </button>
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
                {$t('tournaments.live_preview')}
              </span>
              <div class="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
                <Trophy weight="duotone" class="w-6 h-6" />
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-zinc-950/50 p-6 rounded-none border border-zinc-800/50 shadow-inner">
                <p class="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">{$t('tournaments.preview_tournament')}</p>
                <h4 class="text-2xl font-outfit font-black text-white leading-tight uppercase truncate tracking-tighter italic">
                  {formData.name || $t('tournaments.untitled')}
                </h4>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                  <div class="flex items-center gap-3">
                    <Calendar weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('common.date')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-white uppercase">{formData.startAt ? new Date(formData.startAt).toLocaleDateString() : 'TBD'}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                  <div class="flex items-center gap-3">
                    <Target weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.game_system')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-violet-400 uppercase">{formData.format.replace('_', ' ')}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                  <div class="flex items-center gap-3">
                    <Clock weight="duotone" class="w-5 h-5 text-zinc-600" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.time_control')}</span>
                  </div>
                  <span class="text-[10px] font-bold text-white uppercase">{formData.timeControl}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning Panel -->
        <div class="bento-card !p-8 relative overflow-hidden bg-violet-600/5 border-violet-500/20">
          <div class="flex gap-4 items-start">
             <WarningCircle weight="duotone" class="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
             <p class="text-[11px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
               {$t('tournaments.edit_warning')}
             </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Delete confirmation modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-3xl" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-10 rounded-none max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden" in:fly={{ y: 40, duration: 400 }}>
      <div class="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
      <div class="w-20 h-20 rounded-none bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
        <Trash weight="bold" size={40} />
      </div>
      <div class="text-center space-y-3">
        <h3 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('tournaments.delete_permanently_title')}</h3>
        <p class="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">{$t('tournaments.delete_permanently_desc')}</p>
      </div>
      <div class="flex flex-col gap-3">
        <button 
          onclick={handleDelete}
          class="h-14 rounded-none bg-red-600 text-white font-black uppercase text-[11px] tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-500/40 active:scale-95"
        >
          {$t('tournaments.delete_now')}
        </button>
        <button 
          onclick={() => showDeleteConfirm = false}
          class="h-14 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[11px] tracking-widest hover:text-white transition-all active:scale-95"
        >
          {$t('common.cancel')}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Reset confirmation modal -->
{#if showResetConfirm}
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-3xl" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-10 rounded-none max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden" in:fly={{ y: 40, duration: 400 }}>
      <div class="absolute top-0 left-0 w-full h-1 bg-violet-600"></div>
      <div class="w-20 h-20 rounded-none bg-violet-500/10 flex items-center justify-center text-violet-500 mx-auto">
        <ArrowCounterClockwise weight="bold" size={40} />
      </div>
      <div class="text-center space-y-3">
        <h3 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('tournaments.reset_structure_title')}</h3>
        <p class="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">{$t('tournaments.reset_structure_desc')}</p>
      </div>
      <div class="flex flex-col gap-3">
        <button 
          onclick={handleReset}
          class="h-14 rounded-none bg-violet-600 text-white font-black uppercase text-[11px] tracking-widest hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/40 active:scale-95"
        >
          {$t('common.reset')}
        </button>
        <button 
          onclick={() => showResetConfirm = false}
          class="h-14 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[11px] tracking-widest hover:text-white transition-all active:scale-95"
        >
          {$t('common.cancel')}
        </button>
      </div>
    </div>
  </div>
{/if}

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
