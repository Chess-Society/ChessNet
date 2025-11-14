<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Save,
    X,
    AlertTriangle,
    CheckCircle,
    School,
    Clock,
    Users,
    DollarSign,
    Calendar,
    MapPin,
    BookOpen,
    Target,
    Eye,
    RotateCcw
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let classData = data.class;
  let schools = data.schools || [];
  let suggestedSchedules = data.suggestedSchedules || {};
  let suggestedCapacities = data.suggestedCapacities || {};

  // Form data (solo campos que existen en la BD)
  let formData = {
    name: classData?.name || '',
    description: classData?.description || '',
    college_id: classData?.college_id || '',
    schedule: classData?.schedule || '',
    max_students: classData?.max_students || 12,
    level: classData?.level || 'beginner'
  };

  // Form state
  let isSubmitting = false;
  let errors: Record<string, string> = {};
  let showPreview = false;

  const levelOptions = [
    { value: 'beginner', label: 'Principiante', color: 'text-green-400' },
    { value: 'intermediate', label: 'Intermedio', color: 'text-yellow-400' },
    { value: 'advanced', label: 'Avanzado', color: 'text-red-400' },
    { value: 'mixed', label: 'Mixto', color: 'text-purple-400' }
  ];

  onMount(() => {
    console.log('✏️ Edit class page loaded:', classData?.name);
  });

  const handleGoBack = () => {
    goto(`/classes/${classData.id}`);
  };

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre de la clase es obligatorio';
    }

    if (!formData.college_id) {
      errors.college_id = 'Debes seleccionar un centro';
    }

    if (formData.max_students < 1 || formData.max_students > 50) {
      errors.max_students = 'La capacidad debe estar entre 1 y 50 estudiantes';
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    isSubmitting = true;

    try {
      console.log('💾 Updating class:', formData);

      // Simular actualización
      const response = await fetch(`/api/classes/${classData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('✅ Class updated successfully');
        alert('✅ Clase actualizada correctamente');
        goto(`/classes/${classData.id}`);
      } else {
        throw new Error('Error updating class');
      }
    } catch (error) {
      console.error('Error updating class:', error);
      alert('❌ Error al actualizar la clase');
    } finally {
      isSubmitting = false;
    }
  };

  const handleScheduleSuggestion = (schedule: string) => {
    formData.schedule = schedule;
  };

  const handleCapacitySuggestion = (capacity: number) => {
    formData.max_students = capacity;
  };

  const resetToOriginal = () => {
    formData = {
      name: classData?.name || '',
      description: classData?.description || '',
      college_id: classData?.college_id || '',
      schedule: classData?.schedule || '',
      max_students: classData?.max_students || 12,
      level: classData?.level || 'beginner'
    };
    errors = {};
  };

  const hasChanges = () => {
    return (
      formData.name !== (classData?.name || '') ||
      formData.description !== (classData?.description || '') ||
      formData.college_id !== (classData?.college_id || '') ||
      formData.schedule !== (classData?.schedule || '') ||
      formData.max_students !== (classData?.max_students || 12) ||
      formData.level !== (classData?.level || 'beginner')
    );
  };

  const getSelectedSchoolName = () => {
    const school = schools.find(s => s.id === formData.college_id);
    return school?.name || 'Seleccionar centro';
  };

  const getCurrentLevelInfo = () => {
    return levelOptions.find(opt => opt.value === formData.level) || levelOptions[0];
  };

  const getCurrentCapacityInfo = () => {
    return suggestedCapacities[formData.level] || { min: 1, max: 50, recommended: 12 };
  };
</script>

<svelte:head>
  <title>Editar Clase - {classData?.name || 'Clase'} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <!-- Header -->
  <header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button on:click={handleGoBack} class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen class="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Editar Clase</h1>
              <p class="text-sm text-slate-400">{classData?.name}</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          {#if hasChanges()}
            <button on:click={resetToOriginal} class="btn-secondary">
              <RotateCcw class="w-4 h-4 mr-2" />
              Descartar Cambios
            </button>
          {/if}
          <button on:click={() => showPreview = !showPreview} class="btn-secondary">
            <Eye class="w-4 h-4 mr-2" />
            {showPreview ? 'Ocultar' : 'Vista Previa'}
          </button>
          <button on:click={handleSubmit} disabled={isSubmitting || !hasChanges()} class="btn-primary">
            {#if isSubmitting}
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            {:else}
              <Save class="w-4 h-4 mr-2" />
              Guardar Cambios
            {/if}
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulario principal -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Información básica -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-6">Información Básica</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre -->
            <div>
              <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
                Nombre de la Clase *
              </label>
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                class={`input w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Ej: Principiantes Mañana"
              />
              {#if errors.name}
                <p class="text-red-400 text-sm mt-1">{errors.name}</p>
              {/if}
            </div>

            <!-- Centro -->
            <div>
              <label for="college_id" class="block text-sm font-medium text-slate-300 mb-2">
                Centro Educativo *
              </label>
              <select
                id="college_id"
                bind:value={formData.college_id}
                class={`input w-full ${errors.college_id ? 'border-red-500' : ''}`}
              >
                <option value="">Seleccionar centro</option>
                {#each schools as school}
                  <option value={school.id}>{school.name}</option>
                {/each}
              </select>
              {#if errors.college_id}
                <p class="text-red-400 text-sm mt-1">{errors.college_id}</p>
              {/if}
            </div>

            <!-- Nivel -->
            <div>
              <label for="level" class="block text-sm font-medium text-slate-300 mb-2">
                Nivel de la Clase
              </label>
              <select
                id="level"
                bind:value={formData.level}
                class="input w-full"
              >
                {#each levelOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>

          </div>

          <!-- Descripción -->
          <div class="mt-6">
            <label for="description" class="block text-sm font-medium text-slate-300 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              bind:value={formData.description}
              class="input w-full h-24 resize-none"
              placeholder="Describe el enfoque y objetivos de la clase..."
            ></textarea>
          </div>
        </div>

        <!-- Horario y capacidad -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-6">Horario y Capacidad</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Horario -->
            <div>
              <label for="schedule" class="block text-sm font-medium text-slate-300 mb-2">
                Horario
              </label>
              <input
                id="schedule"
                type="text"
                bind:value={formData.schedule}
                class="input w-full"
                placeholder="Ej: Lunes y Miércoles 10:00-11:00"
              />
            </div>

            <!-- Capacidad -->
            <div>
              <label for="max_students" class="block text-sm font-medium text-slate-300 mb-2">
                Capacidad Máxima *
              </label>
              <input
                id="max_students"
                type="number"
                bind:value={formData.max_students}
                class={`input w-full ${errors.max_students ? 'border-red-500' : ''}`}
                min="1"
                max="50"
              />
              {#if errors.max_students}
                <p class="text-red-400 text-sm mt-1">{errors.max_students}</p>
              {/if}
            </div>
          </div>
        </div>

      </div>

      <!-- Panel lateral -->
      <div class="space-y-6">
        <!-- Vista previa -->
        {#if showPreview}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 class="font-semibold mb-4">Vista Previa</h3>
            
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-white">{formData.name || 'Nombre de la clase'}</h4>
                <p class="text-sm text-slate-400">{getSelectedSchoolName()}</p>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-400">Nivel:</span>
                  <span class={`ml-1 ${getCurrentLevelInfo().color}`}>{getCurrentLevelInfo().label}</span>
                </div>
                <div>
                  <span class="text-slate-400">Capacidad:</span>
                  <span class="text-white ml-1">{formData.max_students}</span>
                </div>
              </div>

              <div>
                <span class="text-slate-400 text-sm">Horario:</span>
                <p class="text-white">{formData.schedule || 'No especificado'}</p>
              </div>

              {#if formData.description}
                <div>
                  <span class="text-slate-400 text-sm">Descripción:</span>
                  <p class="text-slate-300 text-sm leading-relaxed mt-1">{formData.description}</p>
                </div>
              {/if}

            </div>
          </div>
        {/if}

        <!-- Información de ayuda -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 class="font-semibold mb-4">Consejos</h3>
          
          <div class="space-y-3 text-sm text-slate-400">
            <div class="flex items-start space-x-2">
              <Target class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p>Ajusta la capacidad según el nivel: principiantes necesitan más atención individual.</p>
            </div>
            <div class="flex items-start space-x-2">
              <Clock class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>Los horarios matutinos funcionan mejor para niños pequeños.</p>
            </div>
            <div class="flex items-start space-x-2">
              <BookOpen class="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p>Usa las notas del instructor para recordar metodologías específicas del grupo.</p>
            </div>
          </div>
        </div>

        <!-- Acciones de clase -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 class="font-semibold mb-4">Gestión de la Clase</h3>
          
          <div class="space-y-3">
            <button 
              on:click={() => goto(`/classes/${classData.id}/students`)}
              class="w-full btn-secondary text-left"
            >
              <Users class="w-4 h-4 mr-2" />
              Gestionar Estudiantes
            </button>
            <button 
              on:click={() => goto(`/classes/${classData.id}/skills`)}
              class="w-full btn-secondary text-left"
            >
              <Target class="w-4 h-4 mr-2" />
              Gestionar Temario
            </button>
            <button 
              on:click={() => goto(`/classes/${classData.id}/attendance`)}
              class="w-full btn-secondary text-left"
            >
              <CheckCircle class="w-4 h-4 mr-2" />
              Control de Asistencia
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  .input {
    @apply bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500;
  }
  
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center;
  }
  
  .btn-secondary {
    @apply bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center border border-slate-600;
  }
</style>
