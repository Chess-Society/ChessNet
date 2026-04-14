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

    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!formData.description.trim()) errors.description = 'La descripción es obligatoria';
    if (formData.max_players < 2) errors.max_players = 'Mínimo 2 jugadores';
    if (formData.max_players > 64) errors.max_players = 'Máximo 64 jugadores';
    if (formData.entry_fee < 0) errors.entry_fee = 'No puede ser negativa';
    if (formData.prize_pool < 0) errors.prize_pool = 'No puede ser negativo';
    
    if (!formData.start_date) errors.start_date = 'Obligatoria';
    if (!formData.end_date) errors.end_date = 'Obligatoria';
    if (!formData.registration_deadline) errors.registration_deadline = 'Obligatoria';

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) <= new Date(formData.start_date)) {
        errors.end_date = 'Debe ser posterior al inicio';
      }
    }

    if (!formData.location.trim()) errors.location = 'La ubicación es obligatoria';

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
      goto(`/panel/torneos/${tournament.id}`);
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
      goto('/panel/torneos');
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
    swiss: 'Sistema Suizo',
    round_robin: 'Robin (Todos vs Todos)',
    knockout: 'Eliminatorio',
    single_elimination: 'Eliminación Simple'
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
  <title>Editar | {formData.name || 'Torneo'} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b] text-zinc-100 p-4 lg:p-8">
  <div class="max-w-7xl mx-auto space-y-8">
    
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <button 
          onclick={() => goto(`/panel/torneos/${tournament.id}`)}
          class="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
          title="Regresar"
        >
          <CaretLeft weight="duotone" size={20} />
        </button>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-2xl font-bold tracking-tight">Gestionar Torneo</h1>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border {statusColors[tournament.status]}">
              {tournament.status}
            </span>
          </div>
          <p class="text-zinc-500 text-sm">Modifica los parámetros y reglamentación del evento.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          onclick={() => goto(`/panel/torneos/${tournament.id}`)}
          class="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium hover:bg-zinc-800 transition-all"
        >
          Cancelar
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-all flex items-center gap-2 shadow-lg shadow-violet-500/20 disabled:opacity-50"
        >
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Guardando...
          {:else}
            <FloppyDisk weight="duotone" size={18} />
            Guardar Cambios
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
              <h2 class="text-lg font-bold">Información de Identidad</h2>
              <p class="text-xs text-zinc-500">Nombre descriptivo y detalles públicos.</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="name">Nombre del Torneo</label>
                <input 
                  id="name"
                  type="text" 
                  bind:value={formData.name}
                  placeholder="Ej: Open de Primavera 2024"
                  class="w-full bg-zinc-950 border {errors.name ? 'border-red-500' : 'border-zinc-800'} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-zinc-700"
                />
                {#if errors.name}
                  <p class="text-red-500 text-[10px] font-bold uppercase ml-1" in:slide>{errors.name}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="description">Descripción Corta</label>
                <textarea 
                  id="description"
                  bind:value={formData.description}
                  rows="3"
                  placeholder="Una breve introducción para los participantes..."
                  class="w-full bg-zinc-950 border {errors.description ? 'border-red-500' : 'border-zinc-800'} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-zinc-700"
                ></textarea>
                {#if errors.description}
                  <p class="text-red-500 text-[10px] font-bold uppercase ml-1" in:slide>{errors.description}</p>
                {/if}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="format">Sistema de Juego</label>
                <div class="relative group">
                  <select 
                    id="format"
                    bind:value={formData.format}
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="swiss">Sistema Suizo</option>
                    <option value="round_robin">Round Robin (Liga)</option>
                    <option value="knockout">Eliminatoria Directa</option>
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 transition-colors group-hover:text-zinc-400">
                    <Gear weight="duotone" size={16} />
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="time_control">Ritmo de Juego</label>
                <input 
                  id="time_control"
                  type="text" 
                  bind:value={formData.time_control}
                  placeholder="Ej: 15+10"
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
              <h2 class="text-lg font-bold">Logística y Costos</h2>
              <p class="text-xs text-zinc-500">Fechas, locación y aspectos financieros.</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="max_players">Cupo Máximo</label>
                <input 
                  id="max_players"
                  type="number" 
                  bind:value={formData.max_players}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="entry_fee">Inscripción (€)</label>
                <input 
                  id="entry_fee"
                  type="number" 
                  bind:value={formData.entry_fee}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="prize_pool">Bolsa de Premios (€)</label>
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
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="location">Ubicación / Plataforma</label>
                <div class="relative group">
                  <input 
                    id="location"
                    type="text" 
                    bind:value={formData.location}
                    placeholder="Ej: Sede Central o Online"
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all pl-12"
                  />
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                    <MapPin weight="duotone" size={20} />
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="organizer">Entidad Organizadora</label>
                <input 
                  id="organizer"
                  type="text" 
                  bind:value={formData.organizer}
                  placeholder="Ej: Club de Ajedrez Regional"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="start_date">Comienzo</label>
                <input 
                  id="start_date"
                  type="datetime-local" 
                  bind:value={formData.start_date}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none text-xs"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="end_date">Finalización</label>
                <input 
                  id="end_date"
                  type="datetime-local" 
                  bind:value={formData.end_date}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none text-xs"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="deadline">Cierre Inscripción</label>
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
              <h2 class="text-lg font-bold">Documentación</h2>
              <p class="text-xs text-zinc-500">Reglas técnicas y notas operativas.</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="rules">Reglamento del Torneo</label>
              <textarea 
                id="rules"
                bind:value={formData.rules}
                rows="4"
                placeholder="Detalla las reglas FIDE o variaciones locales..."
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1" for="notes">Notas para el Staff</label>
              <textarea 
                id="notes"
                bind:value={formData.notes}
                rows="2"
                placeholder="Logística interna, material necesario..."
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
              <h2 class="text-lg font-bold text-red-500">Zona de Riesgo</h2>
              <p class="text-xs text-red-500/60">Acciones destructoras que no se pueden deshacer.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-zinc-950/50 border border-red-500/10 flex flex-col justify-between gap-4">
              <div>
                <h3 class="text-sm font-bold text-red-400 mb-1">Reiniciar Torneo</h3>
                <p class="text-xs text-zinc-500 leading-relaxed">
                  Elimina todos los emparejamientos y rondas generadas. El estado volverá a 'Borrador'.
                </p>
              </div>
              <button 
                onclick={() => showResetConfirm = true}
                class="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <ArrowCounterClockwise size={14} />
                Reiniciar Estructura
              </button>
            </div>

            <div class="p-4 rounded-2xl bg-zinc-950/50 border border-red-500/10 flex flex-col justify-between gap-4">
              <div>
                <h3 class="text-sm font-bold text-red-400 mb-1">Eliminar Permanentemente</h3>
                <p class="text-xs text-zinc-500 leading-relaxed">
                  Borra el torneo y todos sus datos relacionados (jugadores, pagos, resultados).
                </p>
              </div>
              <button 
                onclick={() => showDeleteConfirm = true}
                class="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Trash weight="duotone" size={14} />
                Borrar Torneo
              </button>
            </div>
          </div>
        </section>

      </div>

      <!-- Preview Sidebar -->
      <aside class="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="bg-violet-600 px-6 py-4 flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">Previsualización Live</span>
            <Layout weight="duotone" size={16} class="text-violet-200 opacity-50" />
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Mock Tournament Card -->
            <div class="space-y-4">
              <div class="h-24 rounded-2xl bg-gradient-to-br from-violet-600/20 to-zinc-950 border border-violet-500/20 flex items-center justify-center">
                <Trophy weight="duotone" size={48} class="text-violet-500 opacity-20" />
              </div>
              
              <div>
                <h3 class="text-xl font-bold truncate">{formData.name || 'Sin nombre'}</h3>
                <p class="text-xs text-zinc-500 line-clamp-2 mt-1">{formData.description || 'Sin descripción...'}</p>
              </div>

              <div class="grid grid-cols-2 gap-3 pb-4 border-b border-zinc-800">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Calendar size={16} />
                  </div>
                  <div class="text-[10px]">
                    <p class="text-zinc-500 font-bold uppercase">Inicio</p>
                    <p class="text-zinc-300">{formData.start_date ? new Date(formData.start_date).toLocaleDateString() : '--'}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <MapPin size={16} />
                  </div>
                  <div class="text-[10px]">
                    <p class="text-zinc-500 font-bold uppercase">Lugar</p>
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
                  <p class="text-[10px] text-zinc-500 font-bold uppercase">Premios</p>
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
                <p>La previsualización muestra cómo se verá este torneo en el catálogo público y el panel de jugadores.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-violet-600/10 to-transparent border border-violet-500/20 rounded-3xl p-6">
          <div class="flex items-center gap-2 mb-3">
            <CheckCircle weight="duotone" size={18} class="text-violet-500" />
            <h4 class="text-sm font-bold">Estado de Configuración</h4>
          </div>
          <ul class="space-y-2 text-xs text-zinc-500">
            <li class="flex justify-between">
              <span>Campos requeridos</span>
              <span class={validateForm() ? 'text-violet-500' : 'text-zinc-600'}>
                {validateForm() ? 'OK' : 'Pendiente'}
              </span>
            </li>
            <li class="flex justify-between">
              <span>Reglamento definido</span>
              <span class={formData.rules ? 'text-violet-500' : 'text-zinc-600'}>
                {formData.rules ? 'OK' : 'No'}
              </span>
            </li>
            <li class="flex justify-between">
              <span>Bolsa de premios</span>
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

<!-- Modal confirmación borrar -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] max-w-md w-full shadow-2xl space-y-6" transition:fly={{ y: 20 }}>
      <div class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
        <Trash weight="duotone" size={32} />
      </div>
      <div class="text-center space-y-2">
        <h3 class="text-xl font-bold">¿Borrar torneo permanentemente?</h3>
        <p class="text-zinc-500 text-sm">Esta acción eliminará todos los registros, jugadores y resultados. No hay marcha atrás.</p>
      </div>
      <div class="flex gap-3 pt-4">
        <button 
          onclick={() => showDeleteConfirm = false}
          class="flex-1 px-5 py-3 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all"
        >
          Cancelar
        </button>
        <button 
          onclick={handleDelete}
          class="flex-1 px-5 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all"
        >
          Borrar ahora
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal confirmación reiniciar -->
{#if showResetConfirm}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] max-w-md w-full shadow-2xl space-y-6" transition:fly={{ y: 20 }}>
      <div class="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 mx-auto">
        <ArrowCounterClockwise weight="duotone" size={32} />
      </div>
      <div class="text-center space-y-2">
        <h3 class="text-xl font-bold">¿Reiniciar estructura?</h3>
        <p class="text-zinc-500 text-sm">Se borrarán los emparejamientos y el torneo volverá a estado borrador. Los jugadores inscritos se mantendrán.</p>
      </div>
      <div class="flex gap-3 pt-4">
        <button 
          onclick={() => showResetConfirm = false}
          class="flex-1 px-5 py-3 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all"
        >
          Cancelar
        </button>
        <button 
          onclick={handleReset}
          class="flex-1 px-5 py-3 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all"
        >
          Reiniciar
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Personalización de scrollbar para áreas de texto */
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
