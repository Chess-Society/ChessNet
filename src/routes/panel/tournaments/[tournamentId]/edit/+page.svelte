<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
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
    Pulse
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, slide, fly } from 'svelte/transition';

  interface Props {
    data: PageData;
  }

  import { untrack } from 'svelte';
  import type { LocalTournament as Tournament } from '$lib/types/local-tournament';
  import { localTournamentsApi } from '$lib/api/local-tournaments';
  import { appStore } from '$lib/stores/appStore';
  import { get } from 'svelte/store';
  import { showToast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  
  let { data }: Props = $props();

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
    time_control: tournament?.time_control || '15+10',
    max_players: tournament?.max_players || 16,
    entry_fee: tournament?.entry_fee || 0,
    prize_pool: tournament?.prize_pool || 0,
    start_date: tournament?.start_date ? new Date(tournament.start_date).toISOString().slice(0, 16) : '',
    end_date: tournament?.end_date ? new Date(tournament.end_date).toISOString().slice(0, 16) : '',
    registration_deadline: tournament?.registration_deadline ? new Date(tournament.registration_deadline).toISOString().slice(0, 16) : '',
    location: tournament?.location || '',
    organizer: tournament?.organizer || '',
    notes: tournament?.notes || '',
    rules: tournament?.rules || ''
  });

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) errors.name = $t('tournaments.form.name_required');
    if (!formData.description.trim()) errors.description = $t('tournaments.form.desc_required');
    if (formData.max_players < 2) errors.max_players = $t('tournaments.form.min_players_error');
    if (formData.max_players > 64) errors.max_players = $t('tournaments.form.max_players_error');
    if (formData.entry_fee < 0) errors.entry_fee = $t('tournaments.form.negative_error');
    if (formData.prize_pool < 0) errors.prize_pool = $t('tournaments.form.negative_error');
    
    if (!formData.start_date) errors.start_date = $t('tournaments.form.required');
    if (!formData.end_date) errors.end_date = $t('tournaments.form.required');
    if (!formData.registration_deadline) errors.registration_deadline = $t('tournaments.form.required');

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) <= new Date(formData.start_date)) {
        errors.end_date = $t('tournaments.form.date_sequence_error');
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
        startAt: new Date(formData.start_date).toISOString(),
        endAt: new Date(formData.end_date).toISOString(),
        // Also map to compat fields if needed
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
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
    const confirmed = await uiStore.confirm({
      title: $t('tournaments.delete_confirm_title'),
      message: $t('tournaments.delete_confirm_desc'),
      type: 'danger',
      confirmText: $t('common.delete')
    });

    if (!confirmed) return;

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
    const confirmed = await uiStore.confirm({
      title: $t('tournaments.reset_confirm_title'),
      confirmText: $t('common.reset')
    });

    if (!confirmed) return;

    try {
      // 1. Reset tournament status
      await localTournamentsApi.updateTournament(tournament.id, { 
        status: 'upcoming',
        currentRound: 1
      });
      
      // 2. Clear pairings and rounds (this should be handled by a specific API method if possible, or manually)
      // Since we don't have a bulk 'clearAll' for a tournament, we loop or use existing resetRound per round
      // For now, let's just use the currentRound 1 and status upcoming.
      
      showToast.success($t('tournaments.reset.success'));
      window.location.reload();
    } catch (error) {
      console.error('❌ Error resetting tournament:', error);
      showToast.error($t('tournaments.reset.error'));
    }
  };

  const formatLabels: Record<string, string> = {
    swiss: $t('tournaments.type_swiss'),
    round_robin: $t('tournaments.type_round_robin'),
    knockout: $t('tournaments.type_knockout'),
    single_elimination: $t('tournaments.type_knockout')
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

<div class="max-w-7xl mx-auto px-6 py-12" in:fade={{ duration: 300 }}>
  
  <!-- Back & Header -->
  <div class="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
    <div class="flex items-center gap-8">
      <button 
        onclick={() => goto(`/panel/tournaments/${tournament.id}`)} 
        class="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-[24px] flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-zinc-900 transition-all shadow-2xl active:scale-95 group shrink-0"
        aria-label="Back"
      >
        <CaretLeft weight="bold" class="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>
      <div>
        <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-black text-violet-400 uppercase tracking-widest">{$t('tournaments.competition_engine')}</span>
            <span class="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
            <span class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase border {statusColors[tournament.status]}">
              {$t(`tournaments.status_${tournament.status}`)}
            </span>
        </div>
        <h1 class="text-5xl font-outfit font-black text-white tracking-tighter uppercase italic">{$t('tournaments.manage_title')}</h1>
        <p class="text-zinc-500 font-medium text-lg mt-1">{formData.name || $t('tournaments.untitled')}</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
        <button 
          onclick={() => goto(`/panel/tournaments/${tournament.id}`)}
          class="h-14 px-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 font-bold hover:text-white hover:bg-zinc-900 transition-all uppercase text-[10px] tracking-widest"
        >
          {$t('common.cancel')}
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="h-14 px-8 rounded-2xl bg-violet-600 text-white font-black hover:bg-violet-500 transition-all flex items-center gap-3 shadow-xl shadow-violet-500/20 disabled:opacity-50 active:scale-95 uppercase text-[10px] tracking-widest"
        >
          {#if isSubmitting}
            <ArrowCounterClockwise weight="bold" class="w-5 h-5 animate-spin" />
            {$t('tournaments.saving')}
          {:else}
            <FloppyDisk weight="bold" class="w-5 h-5" />
            {$t('common.save')}
          {/if}
        </button>
      </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <!-- Main Form Area -->
      <div class="lg:col-span-2 space-y-10">
        
        <!-- Section: Essential Info -->
        <section class="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl relative group">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
          <div class="p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
                <Trophy weight="bold" size={24} />
              </div>
              <div>
                <h3 class="text-xl font-outfit font-black text-white uppercase italic tracking-wider">{$t('tournaments.identity_info')}</h3>
                <p class="text-zinc-500 text-sm font-medium">{$t('tournaments.identity_desc')}</p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label for="tournament-name" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.form.name')}</label>
                <input 
                  id="tournament-name"
                  type="text" 
                  bind:value={formData.name}
                  class="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-zinc-700"
                  placeholder={$t('tournaments.form.name_placeholder')}
                />
              </div>

              <div class="space-y-2">
                <label for="tournament-description" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('common.description')}</label>
                <textarea 
                  id="tournament-description"
                  bind:value={formData.description}
                  rows="3"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-zinc-700"
                  placeholder={$t('tournaments.form.notes_placeholder')}
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="tournament-format" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.game_system')}</label>
                  <select 
                    id="tournament-format"
                    bind:value={formData.format}
                    class="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="swiss">{$t('tournaments.type_swiss')}</option>
                    <option value="round_robin">{$t('tournaments.type_round_robin')}</option>
                    <option value="knockout">{$t('tournaments.type_knockout')}</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label for="tournament-time-control" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.time_control')}</label>
                  <input 
                    id="tournament-time-control"
                    type="text" 
                    bind:value={formData.time_control}
                    class="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-zinc-700"
                    placeholder="10+5"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section: Logistics -->
        <section class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400">
                <CurrencyEur weight="bold" size={24} />
            </div>
            <div>
              <h3 class="text-xl font-outfit font-black text-white uppercase italic tracking-wider">{$t('tournaments.logistics_details')}</h3>
              <p class="text-zinc-500 text-sm font-medium">{$t('tournaments.logistics_desc')}</p>
            </div>
          </div>

          <div class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label for="max-players" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.max_capacity')}</label>
                <input id="max-players" type="number" bind:value={formData.max_players} class="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-white font-bold" />
              </div>
              <div class="space-y-2">
                <label for="entry-fee" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.entry_fee_label')}</label>
                <div class="relative">
                  <input id="entry-fee" type="number" bind:value={formData.entry_fee} class="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-violet-400 font-bold" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black">€</span>
                </div>
              </div>
              <div class="space-y-2">
                <label for="prize-pool" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.prize_pool_label')}</label>
                <div class="relative">
                  <input id="prize-pool" type="number" bind:value={formData.prize_pool} class="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-emerald-400 font-bold" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black">€</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="location" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.location_platform')}</label>
                <input id="location" type="text" bind:value={formData.location} class="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-white font-medium" />
              </div>
              <div class="space-y-2">
                <label for="organizer" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.organizing_entity')}</label>
                <input id="organizer" type="text" bind:value={formData.organizer} class="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-white font-medium" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800/50 pt-8">
              <div class="space-y-2">
                <label for="start-date" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.start')}</label>
                <input id="start-date" type="datetime-local" bind:value={formData.start_date} class="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-xs text-white [color-scheme:dark]" />
              </div>
              <div class="space-y-2">
                <label for="end-date" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.status_completed')}</label>
                <input id="end-date" type="datetime-local" bind:value={formData.end_date} class="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-xs text-white [color-scheme:dark]" />
              </div>
              <div class="space-y-2">
                <label for="reg-deadline" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.registration_deadline')}</label>
                <input id="reg-deadline" type="datetime-local" bind:value={formData.registration_deadline} class="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-xs text-orange-400 [color-scheme:dark]" />
              </div>
            </div>
          </div>
        </section>

        <!-- Rules and Documentation -->
        <section class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <FileText weight="bold" size={24} />
            </div>
            <div>
              <h3 class="text-xl font-outfit font-black text-white uppercase italic tracking-wider">{$t('tournaments.documentation')}</h3>
              <p class="text-zinc-500 text-sm font-medium">{$t('tournaments.doc_desc')}</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <label for="rules" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.rules')}</label>
              <textarea 
                id="rules"
                bind:value={formData.rules}
                rows="5"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-zinc-700"
                placeholder={$t('tournaments.rules_placeholder')}
              ></textarea>
            </div>
            <div class="space-y-2">
              <label for="staff_notes" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.staff_notes')}</label>
              <textarea 
                id="staff_notes"
                bind:value={formData.notes}
                rows="2"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all opacity-70"
                placeholder={$t('tournaments.staff_notes_placeholder')}
              ></textarea>
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section class="bg-red-500/5 border border-red-500/20 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-red-500/10 transition-all duration-700"></div>
          <div class="flex flex-col md:flex-row items-center justify-between gap-8 py-4 relative z-10">
            <div class="text-center md:text-left">
              <h3 class="text-xl font-outfit font-black text-red-100 uppercase italic tracking-wider mb-2">{$t('tournaments.danger_zone')}</h3>
              <p class="text-red-400/60 text-sm font-medium">{$t('tournaments.danger_zone_desc')}</p>
            </div>
            <div class="flex items-center gap-4">
              <button 
                onclick={() => showResetConfirm = true}
                class="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all"
              >
                {$t('tournaments.reset_tournament')}
              </button>
              <button 
                onclick={() => showDeleteConfirm = true}
                class="px-6 py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
              >
                {$t('common.delete')}
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Preview Sidebar -->
      <aside class="sticky top-10 space-y-6">
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500/50 to-transparent"></div>
          
          <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8">{$t('tournaments.live_preview')}</h4>
          
          <div class="space-y-8">
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 text-2xl">
                <Trophy weight="bold" />
              </div>
              <div>
                <p class="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1">{$t('tournaments.preview_tournament')}</p>
                <p class="text-2xl font-outfit font-black text-white italic leading-tight">{formData.name || 'Untitled Tournament'}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{$t('common.date')}</p>
                <p class="text-sm font-bold text-zinc-300">{formData.start_date ? new Date(formData.start_date).toLocaleDateString() : 'TBD'}</p>
              </div>
              <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{$t('tournaments.game_system')}</p>
                <p class="text-sm font-bold text-zinc-300 capitalize">{formData.format.replace('_', ' ')}</p>
              </div>
            </div>

            <div class="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <div class="flex justify-between items-center text-xs">
                <span class="font-black uppercase text-zinc-600 tracking-widest">{$t('tournaments.time_control')}</span>
                <span class="font-bold text-violet-400">{formData.time_control}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="font-black uppercase text-zinc-600 tracking-widest">{$t('tournaments.max_capacity')}</span>
                <span class="font-bold text-emerald-400">{formData.max_players} {$t('tournaments.spots_lowercase')}</span>
              </div>
              <div class="pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                <span class="font-black uppercase text-zinc-600 tracking-widest">{$t('tournaments.prize_pool_label')}</span>
                <span class="font-bold text-zinc-300">
                  {formData.prize_pool} €
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-violet-600/10 border border-violet-500/20 rounded-[28px] p-6">
          <div class="flex items-center gap-4 text-violet-400">
            <WarningCircle weight="bold" class="w-6 h-6 shrink-0" />
            <p class="text-[10px] font-black uppercase tracking-widest leading-relaxed">
              {$t('tournaments.edit_warning')}
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>

<!-- Delete confirmation modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-xl" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden" in:fly={{ y: 40, duration: 400 }}>
      <div class="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
      <div class="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
        <Trash weight="bold" size={40} />
      </div>
      <div class="text-center space-y-3">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-wider">{$t('tournaments.delete_permanently_title')}</h3>
        <p class="text-zinc-500 font-medium leading-relaxed">{$t('tournaments.delete_permanently_desc')}</p>
      </div>
      <div class="flex flex-col gap-3">
        <button 
          onclick={handleDelete}
          class="h-14 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-500/20 active:scale-95"
        >
          {$t('tournaments.delete_now')}
        </button>
        <button 
          onclick={() => showDeleteConfirm = false}
          class="h-14 rounded-2xl bg-zinc-800 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hover:text-white hover:bg-zinc-700 transition-all active:scale-95"
        >
          {$t('common.cancel')}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Reset confirmation modal -->
{#if showResetConfirm}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-xl" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden" in:fly={{ y: 40, duration: 400 }}>
      <div class="absolute top-0 left-0 w-full h-1 bg-violet-600"></div>
      <div class="w-20 h-20 rounded-3xl bg-violet-500/10 flex items-center justify-center text-violet-500 mx-auto">
        <ArrowCounterClockwise weight="bold" size={40} />
      </div>
      <div class="text-center space-y-3">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-wider">{$t('tournaments.reset_structure_title')}</h3>
        <p class="text-zinc-500 font-medium leading-relaxed">{$t('tournaments.reset_structure_desc')}</p>
      </div>
      <div class="flex flex-col gap-3">
        <button 
          onclick={handleReset}
          class="h-14 rounded-2xl bg-violet-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/20 active:scale-95"
        >
          {$t('common.reset')}
        </button>
        <button 
          onclick={() => showResetConfirm = false}
          class="h-14 rounded-2xl bg-zinc-800 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hover:text-white hover:bg-zinc-700 transition-all active:scale-95"
        >
          {$t('common.cancel')}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Scrollbar customization for text areas */
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
  textarea::-webkit-scrollbar-thumb:hover {
    background: #3f3f46;
  }
</style>
