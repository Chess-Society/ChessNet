<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Trophy,
    Save,
    Calendar,
    Clock,
    Users,
    DollarSign,
    MapPin,
    Target,
    FileText,
    AlertTriangle,
    CheckCircle,
    Settings
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let tournament = data.tournament;
  let isSubmitting = false;
  let errors: Record<string, string> = {};

  // Form data
  let formData = {
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
  };

  onMount(() => {
    console.log('🏆 Tournament edit page loaded - Tournament:', tournament?.name || 'none');
  });

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre del torneo es obligatorio';
    }

    if (!formData.description.trim()) {
      errors.description = 'La descripción es obligatoria';
    }

    if (formData.max_players < 2) {
      errors.max_players = 'Debe haber al menos 2 jugadores';
    }

    if (formData.max_players > 64) {
      errors.max_players = 'Máximo 64 jugadores';
    }

    if (formData.entry_fee < 0) {
      errors.entry_fee = 'La cuota no puede ser negativa';
    }

    if (formData.prize_pool < 0) {
      errors.prize_pool = 'El premio no puede ser negativo';
    }

    if (!formData.start_date) {
      errors.start_date = 'La fecha de inicio es obligatoria';
    }

    if (!formData.end_date) {
      errors.end_date = 'La fecha de fin es obligatoria';
    }

    if (!formData.registration_deadline) {
      errors.registration_deadline = 'La fecha límite de inscripción es obligatoria';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        errors.end_date = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }

    if (formData.registration_deadline && formData.start_date) {
      const deadline = new Date(formData.registration_deadline);
      const startDate = new Date(formData.start_date);
      
      if (deadline >= startDate) {
        errors.registration_deadline = 'La fecha límite debe ser anterior al inicio del torneo';
      }
    }

    if (!formData.location.trim()) {
      errors.location = 'La ubicación es obligatoria';
    }

    if (!formData.organizer.trim()) {
      errors.organizer = 'El organizador es obligatorio';
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    isSubmitting = true;

    try {
      // Importar tournamentDB dinámicamente
      const { tournamentDB } = await import('$lib/stores/tournaments');
      
      const updates = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        format: formData.format,
        time_control: formData.time_control,
        max_players: formData.max_players,
        entry_fee: formData.entry_fee,
        prize_pool: formData.prize_pool,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        registration_deadline: new Date(formData.registration_deadline).toISOString(),
        location: formData.location.trim(),
        organizer: formData.organizer.trim(),
        notes: formData.notes.trim(),
        rules: formData.rules.trim()
      };

      await tournamentDB.updateTournament(tournament.id, updates);
      
      goto(`/panel/torneos/${tournament.id}`);
      
    } catch (error) {
      console.error('❌ Error updating tournament:', error);
      alert('Error al actualizar el torneo');
    } finally {
      isSubmitting = false;
    }
  };

  const getFormatLabel = (format: string) => {
    const formats: Record<string, string> = {
      'swiss': 'Sistema Suizo',
      'round_robin': 'Todos contra Todos',
      'knockout': 'Eliminatorio',
      'single_elimination': 'Eliminación Simple'
    };
    return formats[format] || format;
  };

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      'draft': 'Borrador',
      'upcoming': 'Próximo',
      'in_progress': 'En Progreso',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    };
    return statuses[status] || status;
  };
</script>

<svelte:head>
  <title>Editar {tournament?.name || 'Torneo'} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
  <!-- Header -->
  <header class="bg-slate-800 border-b border-slate-700">
    <div class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button 
            onclick={() => goto(`/panel/torneos/${tournament.id}`)}
            class="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft class="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-white">Editar Torneo</h1>
            <p class="text-slate-400">{tournament?.name || 'Torneo'}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-slate-600 bg-slate-700/50 text-slate-300">
            {getStatusLabel(tournament?.status || 'draft')}
          </span>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Información básica -->
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <Trophy class="w-5 h-5 mr-2 text-orange-400" />
              Información Básica
            </h2>
            
            <div class="space-y-4">
              <!-- Nombre del torneo -->
              <div>
                <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
                  Nombre del Torneo *
                </label>
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  class="input w-full {errors.name ? 'border-red-500' : ''}"
                  placeholder="Ej: Torneo Principiantes Marzo"
                />
                {#if errors.name}
                  <p class="text-red-400 text-sm mt-1">{errors.name}</p>
                {/if}
              </div>

              <!-- Descripción -->
              <div>
                <label for="description" class="block text-sm font-medium text-slate-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  bind:value={formData.description}
                  rows="3"
                  class="input w-full {errors.description ? 'border-red-500' : ''}"
                  placeholder="Describe el torneo, su propósito y características especiales"
                ></textarea>
                {#if errors.description}
                  <p class="text-red-400 text-sm mt-1">{errors.description}</p>
                {/if}
              </div>

              <!-- Formato y control de tiempo -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="format" class="block text-sm font-medium text-slate-300 mb-2">
                    Formato del Torneo *
                  </label>
                  <select
                    id="format"
                    bind:value={formData.format}
                    class="input w-full"
                  >
                    <option value="swiss">Sistema Suizo</option>
                    <option value="round_robin">Todos contra Todos</option>
                    <option value="knockout">Eliminatorio</option>
                    <option value="single_elimination">Eliminación Simple</option>
                  </select>
                </div>

                <div>
                  <label for="time_control" class="block text-sm font-medium text-slate-300 mb-2">
                    Control de Tiempo
                  </label>
                  <select
                    id="time_control"
                    bind:value={formData.time_control}
                    class="input w-full"
                  >
                    <option value="5+0">5 minutos</option>
                    <option value="10+0">10 minutos</option>
                    <option value="15+10">15+10</option>
                    <option value="25+5">25+5</option>
                    <option value="30+0">30 minutos</option>
                    <option value="60+0">1 hora</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración del torneo -->
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings class="w-5 h-5 mr-2 text-blue-400" />
              Configuración
            </h2>
            
            <div class="space-y-4">
              <!-- Jugadores y cuotas -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="max_players" class="block text-sm font-medium text-slate-300 mb-2">
                    Máximo de Jugadores *
                  </label>
                  <input
                    id="max_players"
                    type="number"
                    min="2"
                    max="64"
                    bind:value={formData.max_players}
                    class="input w-full {errors.max_players ? 'border-red-500' : ''}"
                  />
                  {#if errors.max_players}
                    <p class="text-red-400 text-sm mt-1">{errors.max_players}</p>
                  {/if}
                </div>

                <div>
                  <label for="entry_fee" class="block text-sm font-medium text-slate-300 mb-2">
                    Cuota de Inscripción (€)
                  </label>
                  <input
                    id="entry_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    bind:value={formData.entry_fee}
                    class="input w-full {errors.entry_fee ? 'border-red-500' : ''}"
                  />
                  {#if errors.entry_fee}
                    <p class="text-red-400 text-sm mt-1">{errors.entry_fee}</p>
                  {/if}
                </div>

                <div>
                  <label for="prize_pool" class="block text-sm font-medium text-slate-300 mb-2">
                    Premio Total (€)
                  </label>
                  <input
                    id="prize_pool"
                    type="number"
                    min="0"
                    step="0.01"
                    bind:value={formData.prize_pool}
                    class="input w-full {errors.prize_pool ? 'border-red-500' : ''}"
                  />
                  {#if errors.prize_pool}
                    <p class="text-red-400 text-sm mt-1">{errors.prize_pool}</p>
                  {/if}
                </div>
              </div>

              <!-- Fechas -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="start_date" class="block text-sm font-medium text-slate-300 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    id="start_date"
                    type="datetime-local"
                    bind:value={formData.start_date}
                    class="input w-full {errors.start_date ? 'border-red-500' : ''}"
                  />
                  {#if errors.start_date}
                    <p class="text-red-400 text-sm mt-1">{errors.start_date}</p>
                  {/if}
                </div>

                <div>
                  <label for="end_date" class="block text-sm font-medium text-slate-300 mb-2">
                    Fecha de Fin *
                  </label>
                  <input
                    id="end_date"
                    type="datetime-local"
                    bind:value={formData.end_date}
                    class="input w-full {errors.end_date ? 'border-red-500' : ''}"
                  />
                  {#if errors.end_date}
                    <p class="text-red-400 text-sm mt-1">{errors.end_date}</p>
                  {/if}
                </div>

                <div>
                  <label for="registration_deadline" class="block text-sm font-medium text-slate-300 mb-2">
                    Límite Inscripción *
                  </label>
                  <input
                    id="registration_deadline"
                    type="datetime-local"
                    bind:value={formData.registration_deadline}
                    class="input w-full {errors.registration_deadline ? 'border-red-500' : ''}"
                  />
                  {#if errors.registration_deadline}
                    <p class="text-red-400 text-sm mt-1">{errors.registration_deadline}</p>
                  {/if}
                </div>
              </div>

              <!-- Ubicación y organizador -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="location" class="block text-sm font-medium text-slate-300 mb-2">
                    Ubicación *
                  </label>
                  <input
                    id="location"
                    type="text"
                    bind:value={formData.location}
                    class="input w-full {errors.location ? 'border-red-500' : ''}"
                    placeholder="Centro, sala, dirección..."
                  />
                  {#if errors.location}
                    <p class="text-red-400 text-sm mt-1">{errors.location}</p>
                  {/if}
                </div>

                <div>
                  <label for="organizer" class="block text-sm font-medium text-slate-300 mb-2">
                    Organizador *
                  </label>
                  <input
                    id="organizer"
                    type="text"
                    bind:value={formData.organizer}
                    class="input w-full {errors.organizer ? 'border-red-500' : ''}"
                    placeholder="Nombre del organizador"
                  />
                  {#if errors.organizer}
                    <p class="text-red-400 text-sm mt-1">{errors.organizer}</p>
                  {/if}
                </div>
              </div>
            </div>
          </div>

          <!-- Notas y reglas -->
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <FileText class="w-5 h-5 mr-2 text-green-400" />
              Información Adicional
            </h2>
            
            <div class="space-y-4">
              <div>
                <label for="notes" class="block text-sm font-medium text-slate-300 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  id="notes"
                  bind:value={formData.notes}
                  rows="3"
                  class="input w-full"
                  placeholder="Información adicional sobre el torneo..."
                ></textarea>
              </div>

              <div>
                <label for="rules" class="block text-sm font-medium text-slate-300 mb-2">
                  Reglas Específicas
                </label>
                <textarea
                  id="rules"
                  bind:value={formData.rules}
                  rows="4"
                  class="input w-full"
                  placeholder="Reglas específicas del torneo, variantes, etc..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="space-y-6">
          <!-- Resumen -->
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Resumen</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-slate-400">Formato:</span>
                <span class="text-white">{getFormatLabel(formData.format)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Control:</span>
                <span class="text-white">{formData.time_control}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Jugadores:</span>
                <span class="text-white">{formData.max_players}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Cuota:</span>
                <span class="text-white">€{formData.entry_fee}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Premio:</span>
                <span class="text-white">€{formData.prize_pool}</span>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Acciones</h3>
            
            <div class="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white rounded-lg transition-colors"
              >
                <Save class="w-4 h-4" />
                <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>

              <button
                type="button"
                onclick={() => goto(`/panel/torneos/${tournament.id}`)}
                class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <ArrowLeft class="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>

          <!-- Advertencias -->
          {#if tournament?.status === 'in_progress' || tournament?.status === 'completed'}
            <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div class="flex items-center space-x-2 mb-3">
                <AlertTriangle class="w-5 h-5 text-yellow-400" />
                <h3 class="text-lg font-semibold text-yellow-300">Advertencia</h3>
              </div>
              <p class="text-yellow-200 text-sm">
                Este torneo ya ha comenzado o ha terminado. Algunos cambios pueden no ser aplicables.
              </p>
            </div>
          {/if}
        </div>
      </div>
    </form>
  </main>
</div>
