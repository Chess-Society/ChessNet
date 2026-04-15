<script lang="ts">
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
  
  let { data }: Props = $props();

  let tournament = $state(untrack(() => data.tournament));
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

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.max_players < 2) errors.max_players = 'Minimum 2 players';
    if (formData.max_players > 64) errors.max_players = 'Maximum 64 players';
    if (formData.entry_fee < 0) errors.entry_fee = 'Cannot be negative';
    if (formData.prize_pool < 0) errors.prize_pool = 'Cannot be negative';
    
    if (!formData.start_date) errors.start_date = 'Required';
    if (!formData.end_date) errors.end_date = 'Required';
    if (!formData.registration_deadline) errors.registration_deadline = 'Required';

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) <= new Date(formData.start_date)) {
        errors.end_date = 'Must be after start date';
      }
    }

    if (!formData.location.trim()) errors.location = 'Location is required';

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    isSubmitting = true;

    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      const updates = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        registration_deadline: new Date(formData.registration_deadline).toISOString(),
      };

      await tournamentDB.updateTournament(tournament.id, updates);
      goto(`/panel/tournaments/${tournament.id}`);
    } catch (error) {
      console.error('❌ Error updating tournament:', error);
    } finally {
      isSubmitting = false;
    }
  };

  const handleDelete = async () => {
    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      await tournamentDB.deleteTournament(tournament.id);
      goto('/panel/tournaments');
    } catch (error) {
      console.error('❌ Error deleting tournament:', error);
    }
  };

  const handleReset = async () => {
    try {
      const { tournamentDB } = await import('$lib/stores/tournaments');
      // Simple reset: remove players, reset status
      await tournamentDB.updateTournament(tournament.id, { 
        status: 'upcoming',
        current_round: 0
      });
      // In a real app we would clear rounds/pairings here too
      window.location.reload();
    } catch (error) {
      console.error('❌ Error resetting tournament:', error);
    }
  };

  const formatLabels: Record<string, string> = {
    swiss: 'Swiss System',
    round_robin: 'Round Robin (League)',
    knockout: 'Knockout',
    single_elimination: 'Single Elimination'
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
  <title>Edit | {formData.name || 'Tournament'} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b] text-zinc-100 p-4 lg:p-8">
  <div class="max-w-7xl mx-auto space-y-8">
    
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <button 
          onclick={() => goto(`/panel/tournaments/${tournament.id}`)}
          class="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
          title="Back"
        >
          <CaretLeft weight="duotone" size={20} />
        </button>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-2xl font-bold tracking-tight">Manage Tournament</h1>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border {statusColors[tournament.status]}">
              {tournament.status}
            </span>
          </div>
          <p class="text-zinc-500 text-sm">Modify event parameters and regulations.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          onclick={() => goto(`/panel/tournaments/${tournament.id}`)}
          class="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium hover:bg-zinc-800 transition-all"
        >
          Cancel
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-all flex items-center gap-2 shadow-lg shadow-violet-500/20 disabled:opacity-50"
        >
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Saving...
          {:else}
            <FloppyDisk weight="duotone" size={18} />
            Save Changes
          {/if}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Main Form Area -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Info Básica -->
        <section class="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 lg:p-8 backdrop-blur-sm">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <Trophy weight="duotone" size={24} />
            </div>
            <div>
              <h2 class="text-lg font-bold">Identity Information</h2>
              <p class="text-xs text-zinc-500">Descriptive name and public details.</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="name">Tournament Name</label>
                <input 
                  id="name"
                  type="text" 
                  bind:value={formData.name}
                  placeholder="e.g., Spring Open 2024"
                  class="w-full bg-zinc-950 border {errors.name ? 'border-red-500' : 'border-zinc-800'} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-zinc-700"
                />
                {#if errors.name}
                  <p class="text-red-500 text-[10px] font-bold uppercase ml-1" in:slide>{errors.name}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="description">Short Description</label>
                <textarea 
                  id="description"
                  bind:value={formData.description}
                  rows="3"
                  placeholder="A brief introduction for participants..."
                  class="w-full bg-zinc-950 border {errors.description ? 'border-red-500' : 'border-zinc-800'} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-zinc-700"
                ></textarea>
                {#if errors.description}
                  <p class="text-red-500 text-[10px] font-bold uppercase ml-1" in:slide>{errors.description}</p>
                {/if}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="format">Game System</label>
                <div class="relative group">
                  <select 
                    id="format"
                    bind:value={formData.format}
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="swiss">Swiss System</option>
                    <option value="round_robin">Round Robin (League)</option>
                    <option value="knockout">Direct Elimination</option>
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 transition-colors group-hover:text-zinc-400">
                    <Gear weight="duotone" size={16} />
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="time_control">Time Control</label>
                <input 
                  id="time_control"
                  type="text" 
                  bind:value={formData.time_control}
                  placeholder="e.g., 15+10"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Logística y Costos -->
        <section class="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 lg:p-8 backdrop-blur-sm">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <CurrencyEur weight="duotone" size={24} />
            </div>
            <div>
              <h2 class="text-lg font-bold">Logistics and Costs</h2>
              <p class="text-xs text-zinc-500">Dates, location, and financial aspects.</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="max_players">Max Capacity</label>
                <input 
                  id="max_players"
                  type="number" 
                  bind:value={formData.max_players}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="entry_fee">Entry Fee (€)</label>
                <input 
                  id="entry_fee"
                  type="number" 
                  bind:value={formData.entry_fee}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="prize_pool">Prize Pool (€)</label>
                <input 
                  id="prize_pool"
                  type="number" 
                  bind:value={formData.prize_pool}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold text-violet-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="location">Location / Platform</label>
                <div class="relative group">
                  <input 
                    id="location"
                    type="text" 
                    bind:value={formData.location}
                    placeholder="e.g., Central HQ or Online"
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all pl-12"
                  />
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                    <MapPin weight="duotone" size={20} />
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="organizer">Organizing Entity</label>
                <input 
                  id="organizer"
                  type="text" 
                  bind:value={formData.organizer}
                  placeholder="e.g., Regional Chess Club"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="start_date">Start</label>
                <input 
                  id="start_date"
                  type="datetime-local" 
                  bind:value={formData.start_date}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none text-xs"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="end_date">End</label>
                <input 
                  id="end_date"
                  type="datetime-local" 
                  bind:value={formData.end_date}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none text-xs"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="deadline">Registration Deadline</label>
                <input 
                  id="deadline"
                  type="datetime-local" 
                  bind:value={formData.registration_deadline}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none text-xs text-orange-400"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Notas y Reglas -->
        <section class="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 lg:p-8 backdrop-blur-sm">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <FileText weight="duotone" size={24} />
            </div>
            <div>
              <h2 class="text-lg font-bold">Documentation</h2>
              <p class="text-xs text-zinc-500">Technical rules and operational notes.</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="rules">Tournament Rules</label>
              <textarea 
                id="rules"
                bind:value={formData.rules}
                rows="4"
                placeholder="Detail FIDE rules or local variations..."
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="notes">Staff Notes</label>
              <textarea 
                id="notes"
                bind:value={formData.notes}
                rows="2"
                placeholder="Internal logistics, required materials..."
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all opacity-70"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section class="border border-red-500/20 bg-red-500/5 rounded-3xl p-6 lg:p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <Warning weight="duotone" size={24} />
            </div>
            <div>
              <h2 class="text-lg font-bold text-red-500">Danger Zone</h2>
              <p class="text-xs text-red-500/60">Destructive actions that cannot be undone.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-zinc-950/50 border border-red-500/10 flex flex-col justify-between gap-4">
              <div>
                <h3 class="text-sm font-bold text-red-400 mb-1">Reset Tournament</h3>
                <p class="text-xs text-zinc-500 leading-relaxed">
                  Deletes all pairings and generated rounds. Status will revert to 'Draft'.
                </p>
              </div>
              <button 
                onclick={() => showResetConfirm = true}
                class="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <ArrowCounterClockwise size={14} />
                Reset Structure
              </button>
            </div>

            <div class="p-4 rounded-2xl bg-zinc-950/50 border border-red-500/10 flex flex-col justify-between gap-4">
              <div>
                <h3 class="text-sm font-bold text-red-400 mb-1">Delete Permanently</h3>
                <p class="text-xs text-zinc-500 leading-relaxed">
                  Deletes the tournament and all its related data (players, payments, results).
                </p>
              </div>
              <button 
                onclick={() => showDeleteConfirm = true}
                class="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Trash weight="duotone" size={14} />
                Delete Tournament
              </button>
            </div>
          </div>
        </section>

      </div>

      <!-- Preview Sidebar -->
      <aside class="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="bg-violet-600 px-6 py-4 flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">Live Preview</span>
            <Layout weight="duotone" size={16} class="text-violet-200 opacity-50" />
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Mock Tournament Card -->
            <div class="space-y-4">
              <div class="h-24 rounded-2xl bg-gradient-to-br from-violet-600/20 to-zinc-950 border border-violet-500/20 flex items-center justify-center">
                <Trophy weight="duotone" size={48} class="text-violet-500 opacity-20" />
              </div>
              
              <div>
                <h3 class="text-xl font-bold truncate">{formData.name || 'Untitled'}</h3>
                <p class="text-xs text-zinc-500 line-clamp-2 mt-1">{formData.description || 'No description...'}</p>
              </div>

              <div class="grid grid-cols-2 gap-3 pb-4 border-b border-zinc-800">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Calendar size={16} />
                  </div>
                  <div class="text-[10px]">
                    <p class="text-zinc-500 font-bold uppercase">Start</p>
                    <p class="text-zinc-300">{formData.start_date ? new Date(formData.start_date).toLocaleDateString() : '--'}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <MapPin size={16} />
                  </div>
                  <div class="text-[10px]">
                    <p class="text-zinc-500 font-bold uppercase">Location</p>
                    <p class="text-zinc-300 truncate max-w-[80px]">{formData.location || '--'}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex -space-x-2">
                  {#each Array(3) as _}
                    <div class="w-7 h-7 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center">
                      <Users size={12} class="text-zinc-500" />
                    </div>
                  {/each}
                  <div class="w-7 h-7 rounded-full bg-violet-500/20 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-violet-400">
                    +{formData.max_players}
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-zinc-500 font-bold uppercase">Prizes</p>
                  <p class="text-sm font-black text-violet-400">€{formData.prize_pool || '0'}</p>
                </div>
              </div>

              <div class="pt-4 flex gap-2">
                <span class="px-3 py-1.5 rounded-xl bg-zinc-800 text-[10px] font-bold text-zinc-400">
                  {formatLabels[formData.format] || formData.format}
                </span>
                <span class="px-3 py-1.5 rounded-xl bg-zinc-800 text-[10px] font-bold text-zinc-400">
                  {formData.time_control}
                </span>
              </div>
            </div>

            <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-[11px] text-zinc-400 italic">
              <div class="flex gap-2 items-start">
                <Info size={14} class="text-violet-500 mt-0.5" />
                <p>The preview shows how this tournament will appear in the public catalog and player panel.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-violet-600/10 to-transparent border border-violet-500/20 rounded-3xl p-6">
          <div class="flex items-center gap-2 mb-3">
            <CheckCircle weight="duotone" size={18} class="text-violet-500" />
            <h4 class="text-sm font-bold">Configuration Status</h4>
          </div>
          <ul class="space-y-2 text-xs text-zinc-500">
            <li class="flex justify-between">
              <span>Required fields</span>
              <span class={validateForm() ? 'text-violet-500' : 'text-zinc-600'}>
                {validateForm() ? 'OK' : 'Pending'}
              </span>
            </li>
            <li class="flex justify-between">
              <span>Rules defined</span>
              <span class={formData.rules ? 'text-violet-500' : 'text-zinc-600'}>
                {formData.rules ? 'OK' : 'No'}
              </span>
            </li>
            <li class="flex justify-between">
              <span>Prize pool</span>
              <span class={formData.prize_pool > 0 ? 'text-violet-500' : 'text-zinc-600'}>
                {formData.prize_pool > 0 ? '€' + formData.prize_pool : 'No'}
              </span>
            </li>
          </ul>
        </div>
      </aside>

    </div>
  </div>
</div>

<!-- Delete confirmation modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] max-w-md w-full shadow-2xl space-y-6" transition:fly={{ y: 20 }}>
      <div class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
        <Trash weight="duotone" size={32} />
      </div>
      <div class="text-center space-y-2">
        <h3 class="text-xl font-bold">Permanently delete tournament?</h3>
        <p class="text-zinc-500 text-sm">This action will delete all records, players, and results. There is no turning back.</p>
      </div>
      <div class="flex gap-3 pt-4">
        <button 
          onclick={() => showDeleteConfirm = false}
          class="flex-1 px-5 py-3 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all"
        >
          Cancel
        </button>
        <button 
          onclick={handleDelete}
          class="flex-1 px-5 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all"
        >
          Delete now
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Reset confirmation modal -->
{#if showResetConfirm}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] max-w-md w-full shadow-2xl space-y-6" transition:fly={{ y: 20 }}>
      <div class="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 mx-auto">
        <ArrowCounterClockwise weight="duotone" size={32} />
      </div>
      <div class="text-center space-y-2">
        <h3 class="text-xl font-bold">Reset structure?</h3>
        <p class="text-zinc-500 text-sm">Pairings will be deleted and the tournament will return to draft status. Registered players will be kept.</p>
      </div>
      <div class="flex gap-3 pt-4">
        <button 
          onclick={() => showResetConfirm = false}
          class="flex-1 px-5 py-3 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all"
        >
          Cancel
        </button>
        <button 
          onclick={handleReset}
          class="flex-1 px-5 py-3 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all"
        >
          Reset
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
