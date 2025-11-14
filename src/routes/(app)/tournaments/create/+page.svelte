<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Trophy,
    Calendar,
    Clock,
    Users,
    DollarSign,
    MapPin,
    FileText,
    AlertCircle,
    CheckCircle,
    Settings,
    Target,
    Award,
    Play,
    Info
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { tournamentDB, type Tournament } from '$lib/stores/tournaments';

  export let data: PageData;

  // Form data
  let formData = {
    name: '',
    description: '',
    format: 'swiss' as 'swiss' | 'round_robin' | 'knockout' | 'single_elimination',
    time_control: '10+5',
    max_players: 16,
    entry_fee: 5.00,
    prize_pool: 0.00,
    start_date: '',
    end_date: '',
    start_time: '10:00',
    end_time: '18:00',
    registration_deadline_date: '',
    registration_deadline_time: '23:59',
    location: '',
    organizer: 'ChessNet',
    notes: '',
    rules: '',
    status: 'draft',
    current_round: 0,
    total_rounds: 0
  };

  // UI state
  let currentStep = 1;
  let totalSteps = 4;
  let isSubmitting = false;
  let showPreview = false;
  let errors: Record<string, string> = {};

  // Reactive calculations
  $: if (formData.auto_prize_pool) {
    formData.prize_pool = formData.max_players * formData.entry_fee * 0.8; // 80% del total recaudado
  }

  $: totalRounds = calculateTotalRounds(formData.format, formData.max_players);

  $: finalLocation = formData.location === 'custom' ? formData.custom_location : formData.location;

  // Set default dates
  onMount(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    formData.start_date = tomorrow.toISOString().split('T')[0];
    formData.end_date = tomorrow.toISOString().split('T')[0];
    
    const today = new Date();
    formData.registration_deadline_date = today.toISOString().split('T')[0];
  });

  const calculateTotalRounds = (format: string, players: number): number => {
    switch (format) {
      case 'swiss':
        return Math.ceil(Math.log2(players));
      case 'round_robin':
        return players - 1;
      case 'knockout':
      case 'single_elimination':
        return Math.ceil(Math.log2(players));
      default:
        return 5;
    }
  };

  const validateStep = (step: number): boolean => {
    errors = {};

    if (step === 1) {
      // Validaciones opcionales - solo validar formato si se proporciona
      if (formData.max_players && (formData.max_players < 2 || formData.max_players > 1000)) {
        errors.max_players = 'El número máximo de jugadores debe estar entre 2 y 1000';
      }
    }

    if (step === 2) {
      // Validaciones opcionales de fechas - solo validar lógica si se proporcionan
      if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
        errors.end_date = 'La fecha de fin debe ser posterior a la de inicio';
      }
      if (formData.registration_deadline_date && formData.start_date && formData.registration_deadline_date >= formData.start_date) {
        errors.registration_deadline_date = 'La fecha límite debe ser anterior al inicio del torneo';
      }
    }

    if (step === 3) {
      // Validaciones opcionales - solo validar si se proporcionan valores
      if (formData.max_players && (formData.max_players < 2 || formData.max_players > 1000)) {
        errors.max_players = 'El número máximo de jugadores debe estar entre 2 y 1000';
      }
      if (formData.entry_fee && formData.entry_fee < 0) {
        errors.entry_fee = 'La cuota de inscripción no puede ser negativa';
      }
      if (formData.prize_pool && formData.prize_pool < 0) {
        errors.prize_pool = 'El premio no puede ser negativo';
      }
    }

    if (step === 4) {
      // Validaciones opcionales - no hay campos obligatorios
    }

    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      currentStep = Math.min(currentStep + 1, totalSteps);
    }
  };

  const prevStep = () => {
    currentStep = Math.max(currentStep - 1, 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    isSubmitting = true;

    try {
      // Construir fechas completas
      const startDateTime = `${formData.start_date}T${formData.start_time}:00.000Z`;
      const endDateTime = `${formData.end_date}T${formData.end_time}:00.000Z`;
      const registrationDeadline = `${formData.registration_deadline_date}T${formData.registration_deadline_time}:00.000Z`;

      const tournamentData = {
        name: (formData.name?.trim() && formData.name.trim() !== '') ? formData.name.trim() : 'Torneo sin nombre',
        description: (formData.description?.trim() && formData.description.trim() !== '') ? formData.description.trim() : null,
        format: formData.format || 'swiss',
        time_control: formData.time_control || '10+5',
        max_players: formData.max_players || 16,
        entry_fee: formData.entry_fee || 0,
        prize_pool: formData.prize_pool || 0,
        start_date: startDateTime || null,
        end_date: endDateTime || null,
        registration_deadline: registrationDeadline || null,
        status: 'draft' as const,
        current_round: 0,
        total_rounds: totalRounds || 0,
        players_registered: 0,
        location: (finalLocation?.trim() && finalLocation.trim() !== '') ? finalLocation.trim() : null,
        organizer: (formData.organizer?.trim() && formData.organizer.trim() !== '') ? formData.organizer.trim() : null,
        notes: (formData.notes?.trim() && formData.notes.trim() !== '') ? formData.notes.trim() : null,
        rules: (formData.rules?.trim() && formData.rules.trim() !== '') ? formData.rules.trim() : null
      };

      console.log('🏆 Creating tournament:', tournamentData);

      // Check if we're in production (Supabase) or local dev (IndexedDB)
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      let newTournament;
      
      if (isLocalDev) {
        // Use IndexedDB for local development
        tournamentData.user_id = 'dev-user-123'; // Mock user ID for local dev
        newTournament = await tournamentDB.createTournament(tournamentData);
      } else {
        // Use Supabase API for production
        const response = await fetch('/api/tournaments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tournamentData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear el torneo');
        }

        const result = await response.json();
        newTournament = result.data;
      }
      
      console.log('✅ Tournament created successfully:', newTournament.id);

      // Redirect to tournament management
      goto(`/tournaments/${newTournament.id}`);
    } catch (error) {
      console.error('❌ Error creating tournament:', error);
      errors.submit = error instanceof Error ? error.message : 'Error desconocido al crear el torneo';
    } finally {
      isSubmitting = false;
    }
  };

  const getFormatDescription = (format: string) => {
    const descriptions = {
      swiss: 'Sistema suizo: Cada jugador juega el mismo número de partidas. Emparejamientos basados en puntuación.',
      round_robin: 'Todos contra todos: Cada jugador juega contra todos los demás participantes.',
      knockout: 'Eliminatorio: Los perdedores quedan eliminados. Formato de copa.',
      single_elimination: 'Eliminación simple: Una sola derrota elimina al jugador.'
    };
    return descriptions[format as keyof typeof descriptions] || '';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };
</script>

<svelte:head>
  <title>Crear Nuevo Torneo - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
  <!-- Header -->
  <div class="border-b border-slate-700/50 bg-slate-800/50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between py-6">
        <div class="flex items-center space-x-4">
          <button
            on:click={() => goto('/tournaments')}
            class="p-2 text-slate-400 hover:text-white transition-colors"
            title="Volver a Torneos"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="p-2 bg-orange-500/20 rounded-lg">
            <Trophy class="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Crear Nuevo Torneo</h1>
            <p class="text-slate-400">Configurar una nueva competición</p>
          </div>
        </div>
        
        <button
          on:click={() => showPreview = !showPreview}
          class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
        >
          <FileText class="w-4 h-4" />
          <span>{showPreview ? 'Ocultar' : 'Vista Previa'}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Progress Bar -->
  <div class="bg-slate-800/30 border-b border-slate-700/50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-slate-300">Paso {currentStep} de {totalSteps}</span>
        <span class="text-sm text-slate-400">{Math.round((currentStep / totalSteps) * 100)}% completado</span>
      </div>
      <div class="w-full bg-slate-700/50 rounded-full h-2">
        <div 
          class="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style="width: {(currentStep / totalSteps) * 100}%"
        ></div>
      </div>
    </div>
  </div>

  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 {showPreview ? 'lg:grid-cols-2' : ''} gap-8">
      
      <!-- Formulario -->
      <div class="space-y-8">
        
        <!-- Paso 1: Información Básica -->
        {#if currentStep === 1}
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="p-2 bg-orange-500/20 rounded-lg">
                <FileText class="w-5 h-5 text-orange-400" />
              </div>
              <h2 class="text-lg font-semibold text-white">Información Básica</h2>
            </div>
            
            <div class="space-y-6">
              <!-- Nombre del Torneo -->
              <div>
                <label for="tournament_name" class="block text-sm font-medium text-slate-300 mb-2">
                  Nombre del Torneo
                </label>
                <input
                  id="tournament_name"
                  type="text"
                  bind:value={formData.name}
                  placeholder="Ej: Torneo Principiantes Marzo 2024"
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                />
                {#if errors.name}
                  <p class="mt-1 text-sm text-red-400">{errors.name}</p>
                {/if}
              </div>

              <!-- Descripción -->
              <div>
                <label for="tournament_description" class="block text-sm font-medium text-slate-300 mb-2">
                  Descripción
                </label>
                <textarea
                  id="tournament_description"
                  bind:value={formData.description}
                  placeholder="Describe el torneo, nivel requerido, objetivos..."
                  rows="3"
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none"
                ></textarea>
                {#if errors.description}
                  <p class="mt-1 text-sm text-red-400">{errors.description}</p>
                {/if}
              </div>

              <!-- Formato del Torneo -->
              <div>
                <fieldset>
                  <legend class="block text-sm font-medium text-slate-300 mb-3">
                    Formato del Torneo
                  </legend>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {#each ['swiss', 'round_robin', 'knockout', 'single_elimination'] as format}
                      <label class="relative">
                        <input
                          type="radio"
                          bind:group={formData.format}
                          value={format}
                          class="sr-only"
                        />
                      <div class="p-4 border-2 rounded-lg cursor-pointer transition-all {formData.format === format 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-slate-600 hover:border-slate-500'}">
                        <div class="font-medium {formData.format === format ? 'text-orange-300' : 'text-white'} mb-1">
                          {format === 'swiss' ? 'Sistema Suizo' :
                           format === 'round_robin' ? 'Round Robin' :
                           format === 'knockout' ? 'Eliminatorio' : 'Eliminación Simple'}
                        </div>
                        <div class="text-xs text-slate-400">
                          {getFormatDescription(format)}
                        </div>
                      </div>
                    </label>
                    {/each}
                  </div>
                  {#if errors.format}
                    <p class="mt-1 text-sm text-red-400">{errors.format}</p>
                  {/if}
                </fieldset>
              </div>

              <!-- Control de Tiempo -->
              <div>
                <label for="time_control" class="block text-sm font-medium text-slate-300 mb-2">
                  Control de Tiempo
                </label>
                <select
                  id="time_control"
                  bind:value={formData.time_control}
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="5+3">Blitz 5+3</option>
                  <option value="10+5">Rápidas 10+5</option>
                  <option value="15+10">Rápidas 15+10</option>
                  <option value="30+0">Clásicas 30+0</option>
                  <option value="60+30">Clásicas 60+30</option>
                  <option value="90+30">Clásicas 90+30</option>
                </select>
              </div>
            </div>
          </div>
        {/if}

        <!-- Paso 2: Fechas y Horarios -->
        {#if currentStep === 2}
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="p-2 bg-orange-500/20 rounded-lg">
                <Calendar class="w-5 h-5 text-orange-400" />
              </div>
              <h2 class="text-lg font-semibold text-white">Fechas y Horarios</h2>
            </div>
            
            <div class="space-y-6">
              <!-- Fecha de Inicio -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="start_date" class="block text-sm font-medium text-slate-300 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    id="start_date"
                    type="date"
                    bind:value={formData.start_date}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                  />
                  {#if errors.start_date}
                    <p class="mt-1 text-sm text-red-400">{errors.start_date}</p>
                  {/if}
                </div>

                <div>
                  <label for="start_time" class="block text-sm font-medium text-slate-300 mb-2">
                    Hora de Inicio
                  </label>
                  <input
                    id="start_time"
                    type="time"
                    bind:value={formData.start_time}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              <!-- Fecha de Fin -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="end_date" class="block text-sm font-medium text-slate-300 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    id="end_date"
                    type="date"
                    bind:value={formData.end_date}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                  />
                  {#if errors.end_date}
                    <p class="mt-1 text-sm text-red-400">{errors.end_date}</p>
                  {/if}
                </div>

                <div>
                  <label for="end_time" class="block text-sm font-medium text-slate-300 mb-2">
                    Hora de Fin
                  </label>
                  <input
                    id="end_time"
                    type="time"
                    bind:value={formData.end_time}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              <!-- Fecha Límite de Inscripción -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="registration_deadline_date" class="block text-sm font-medium text-slate-300 mb-2">
                    Fecha Límite Inscripción
                  </label>
                  <input
                    id="registration_deadline_date"
                    type="date"
                    bind:value={formData.registration_deadline_date}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                  />
                  {#if errors.registration_deadline_date}
                    <p class="mt-1 text-sm text-red-400">{errors.registration_deadline_date}</p>
                  {/if}
                </div>

                <div>
                  <label for="registration_deadline_time" class="block text-sm font-medium text-slate-300 mb-2">
                    Hora Límite
                  </label>
                  <input
                    id="registration_deadline_time"
                    type="time"
                    bind:value={formData.registration_deadline_time}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              <!-- Información calculada -->
              <div class="p-4 bg-slate-700/30 rounded-lg">
                <div class="flex items-center space-x-2 mb-2">
                  <Info class="w-4 h-4 text-blue-400" />
                  <span class="text-sm font-medium text-blue-400">Información Calculada</span>
                </div>
                <div class="text-sm text-slate-300 space-y-1">
                  <div>Rondas estimadas: <span class="font-medium">{totalRounds}</span></div>
                  <div>Duración aproximada: <span class="font-medium">{Math.ceil(totalRounds * 1.5)} horas</span></div>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- Paso 3: Configuración de Participantes y Premios -->
        {#if currentStep === 3}
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="p-2 bg-orange-500/20 rounded-lg">
                <Users class="w-5 h-5 text-orange-400" />
              </div>
              <h2 class="text-lg font-semibold text-white">Participantes y Premios</h2>
            </div>
            
            <div class="space-y-6">
              <!-- Número Máximo de Jugadores -->
              <div>
                <label for="max_players" class="block text-sm font-medium text-slate-300 mb-2">
                  Número Máximo de Jugadores
                </label>
                <div class="flex items-center space-x-4">
                  <input
                    id="max_players"
                    type="range"
                    min="2"
                    max="64"
                    bind:value={formData.max_players}
                    class="flex-1"
                  />
                  <div class="w-16 text-center">
                    <input
                      type="number"
                      min="2"
                      max="64"
                      bind:value={formData.max_players}
                      class="w-full px-2 py-1 bg-slate-700/50 border border-slate-600/50 text-white text-center rounded"
                    />
                  </div>
                </div>
                {#if errors.max_players}
                  <p class="mt-1 text-sm text-red-400">{errors.max_players}</p>
                {/if}
              </div>

              <!-- Cuota de Inscripción -->
              <div>
                <label for="entry_fee" class="block text-sm font-medium text-slate-300 mb-2">
                  Cuota de Inscripción
                </label>
                <div class="relative">
                  <input
                    id="entry_fee"
                    type="number"
                    step="0.50"
                    min="0"
                    bind:value={formData.entry_fee}
                    placeholder="0.00"
                    class="w-full pl-8 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                  />
                  <DollarSign class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                {#if errors.entry_fee}
                  <p class="mt-1 text-sm text-red-400">{errors.entry_fee}</p>
                {/if}
              </div>

              <!-- Premio Total -->
              <div>
                <label class="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    bind:checked={formData.auto_prize_pool}
                    class="rounded border-slate-600 text-orange-500 focus:ring-orange-500/50"
                  />
                  <span class="text-sm font-medium text-slate-300">Calcular premios automáticamente (80% de inscripciones)</span>
                </label>
                
                {#if !formData.auto_prize_pool}
                  <div class="relative">
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      bind:value={formData.prize_pool}
                      placeholder="0.00"
                      class="w-full pl-8 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                    />
                    <Award class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                {:else}
                  <div class="p-3 bg-slate-700/30 rounded-lg">
                    <div class="text-sm text-slate-300">
                      Premio calculado: <span class="font-medium text-emerald-400">{formatCurrency(formData.prize_pool)}</span>
                    </div>
                    <div class="text-xs text-slate-400 mt-1">
                      Basado en {formData.max_players} jugadores × {formatCurrency(formData.entry_fee)} × 80%
                    </div>
                  </div>
                {/if}
                
                {#if errors.prize_pool}
                  <p class="mt-1 text-sm text-red-400">{errors.prize_pool}</p>
                {/if}
              </div>

              <!-- Resumen Económico -->
              <div class="p-4 bg-slate-700/30 rounded-lg">
                <div class="flex items-center space-x-2 mb-2">
                  <DollarSign class="w-4 h-4 text-emerald-400" />
                  <span class="text-sm font-medium text-emerald-400">Resumen Económico</span>
                </div>
                <div class="text-sm text-slate-300 space-y-1">
                  <div class="flex justify-between">
                    <span>Ingresos máximos:</span>
                    <span class="font-medium">{formatCurrency(formData.max_players * formData.entry_fee)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Premios:</span>
                    <span class="font-medium">{formatCurrency(formData.prize_pool)}</span>
                  </div>
                  <div class="flex justify-between border-t border-slate-600/50 pt-1">
                    <span>Beneficio estimado:</span>
                    <span class="font-medium text-emerald-400">
                      {formatCurrency(formData.max_players * formData.entry_fee - formData.prize_pool)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- Paso 4: Ubicación y Detalles -->
        {#if currentStep === 4}
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="p-2 bg-orange-500/20 rounded-lg">
                <MapPin class="w-5 h-5 text-orange-400" />
              </div>
              <h2 class="text-lg font-semibold text-white">Ubicación y Detalles</h2>
            </div>
            
            <div class="space-y-6">
              <!-- Ubicación -->
              <div>
                <label for="tournament_location" class="block text-sm font-medium text-slate-300 mb-2">
                  Ubicación del Torneo
                </label>
                <select
                  id="tournament_location"
                  bind:value={formData.location}
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="">Selecciona una ubicación</option>
                  {#each data.availableLocations as location}
                    <option value={location}>{location}</option>
                  {/each}
                  <option value="custom">Otra ubicación...</option>
                </select>
                
                {#if formData.location === 'custom'}
                  <input
                    type="text"
                    bind:value={formData.custom_location}
                    placeholder="Escribe la ubicación personalizada"
                    class="mt-2 w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                  />
                {/if}
                
                {#if errors.location}
                  <p class="mt-1 text-sm text-red-400">{errors.location}</p>
                {/if}
              </div>

              <!-- Organizador -->
              <div>
                <label for="tournament_organizer" class="block text-sm font-medium text-slate-300 mb-2">
                  Organizador
                </label>
                <input
                  id="tournament_organizer"
                  type="text"
                  bind:value={formData.organizer}
                  placeholder="Ej: ChessNet Madrid"
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50"
                />
                {#if errors.organizer}
                  <p class="mt-1 text-sm text-red-400">{errors.organizer}</p>
                {/if}
              </div>

              <!-- Notas Adicionales -->
              <div>
                <label for="tournament_notes" class="block text-sm font-medium text-slate-300 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  id="tournament_notes"
                  bind:value={formData.notes}
                  placeholder="Información adicional para los participantes, material necesario, etc..."
                  rows="3"
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 resize-none"
                ></textarea>
              </div>

              <!-- Reglas del Torneo -->
              <div>
                <label for="tournament_rules" class="block text-sm font-medium text-slate-300 mb-2">
                  Reglas Específicas
                </label>
                <textarea
                  id="tournament_rules"
                  bind:value={formData.rules}
                  placeholder="Reglas específicas del torneo, criterios de desempate, etc..."
                  rows="3"
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        {/if}

        <!-- Error de envío -->
        {#if errors.submit}
          <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <AlertCircle class="w-5 h-5 text-red-400" />
              <p class="text-red-400">{errors.submit}</p>
            </div>
          </div>
        {/if}

        <!-- Botones de Navegación -->
        <div class="flex items-center justify-between space-x-4">
          <button
            on:click={prevStep}
            disabled={currentStep === 1}
            class="px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <div class="flex items-center space-x-4">
            <button
              on:click={() => goto('/tournaments')}
              class="px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
            >
              Cancelar
            </button>

            {#if currentStep < totalSteps}
              <button
                on:click={nextStep}
                class="flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <span>Siguiente</span>
                <ArrowLeft class="w-4 h-4 rotate-180" />
              </button>
            {:else}
              <button
                on:click={handleSubmit}
                disabled={isSubmitting}
                class="flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white rounded-lg transition-colors"
              >
                {#if isSubmitting}
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creando...</span>
                {:else}
                  <CheckCircle class="w-4 h-4" />
                  <span>Crear Torneo</span>
                {/if}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <!-- Vista Previa -->
      {#if showPreview}
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 sticky top-8">
          <h2 class="text-lg font-semibold text-white mb-4">Vista Previa</h2>
          
          <div class="space-y-4">
            <!-- Información Básica -->
            <div class="flex items-center space-x-3">
              <Trophy class="w-5 h-5 text-orange-400" />
              <div>
                <p class="font-medium text-white">
                  {formData.name || 'Nombre del torneo'}
                </p>
                <p class="text-sm text-slate-400">
                  {formData.format === 'swiss' ? 'Sistema Suizo' :
                   formData.format === 'round_robin' ? 'Round Robin' :
                   formData.format === 'knockout' ? 'Eliminatorio' : 'Eliminación Simple'}
                </p>
              </div>
            </div>

            <!-- Detalles -->
            <div class="border-t border-slate-700/50 pt-4 space-y-3">
              {#if formData.start_date}
                <div class="flex justify-between">
                  <span class="text-slate-400">Fecha:</span>
                  <span class="text-white">{formatDate(formData.start_date)}</span>
                </div>
              {/if}
              
              <div class="flex justify-between">
                <span class="text-slate-400">Tiempo:</span>
                <span class="text-white">{formData.time_control}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-slate-400">Jugadores:</span>
                <span class="text-white">Máx. {formData.max_players}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-slate-400">Inscripción:</span>
                <span class="text-white">{formatCurrency(formData.entry_fee)}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-slate-400">Premios:</span>
                <span class="text-white">{formatCurrency(formData.prize_pool)}</span>
              </div>
              
              {#if finalLocation}
                <div class="flex justify-between">
                  <span class="text-slate-400">Ubicación:</span>
                  <span class="text-white">{finalLocation}</span>
                </div>
              {/if}
              
              <div class="flex justify-between">
                <span class="text-slate-400">Rondas:</span>
                <span class="text-white">{totalRounds}</span>
              </div>
            </div>

            <!-- Descripción -->
            {#if formData.description}
              <div class="border-t border-slate-700/50 pt-4">
                <p class="text-sm text-slate-400 mb-2">Descripción:</p>
                <p class="text-white text-sm">{formData.description}</p>
              </div>
            {/if}

            <!-- Notas -->
            {#if formData.notes}
              <div class="border-t border-slate-700/50 pt-4">
                <p class="text-sm text-slate-400 mb-2">Notas:</p>
                <p class="text-slate-300 text-sm">{formData.notes}</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </main>
</div>
