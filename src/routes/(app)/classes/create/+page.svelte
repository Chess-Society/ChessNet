<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    GraduationCap, 
    ArrowLeft,
    Save,
    X,
    School
  } from 'lucide-svelte';
  import { showToast, showError } from '$lib/utils/toast';
  import type { PageData } from './$types';

  export let data: PageData;

  let formData = {
    name: '',
    college_id: ''
  };

  let isSubmitting = false;
  let errors: Record<string, string> = {};

  const schools = data.schools || [];
  
  // Detectar si viene un college_id en la URL
  $: collegeIdFromUrl = $page.url.searchParams.get('college_id');
  $: isPreSelectedCollege = !!collegeIdFromUrl;
  
  // Pre-seleccionar el centro si viene en la URL
  $: if (collegeIdFromUrl && schools.length > 0) {
    const collegeExists = schools.find(s => s.id === collegeIdFromUrl);
    if (collegeExists) {
      formData.college_id = collegeIdFromUrl;
    }
  }


  const handleGoBack = () => {
    goto('/classes');
  };

  const validateForm = () => {
    errors = {};

    // Validación opcional de max_students si se proporciona
    if (formData.max_students && (formData.max_students < 1 || formData.max_students > 100)) {
      errors.max_students = 'El número máximo de estudiantes debe estar entre 1 y 100';
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      isSubmitting = true;

      console.log('🎓 Creating class:', formData);
      
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la clase');
      }

      showToast.success(`Clase "${formData.name}" creada exitosamente`);
      console.log('🎯 Navigating to class:', result.class.id);
      goto('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
      showError(error instanceof Error ? error.message : 'Error al crear la clase');
    } finally {
      isSubmitting = false;
    }
  };


  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      handleSubmit();
    }
  };

  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    return school?.name || '';
  };
</script>

<svelte:head>
  <title>Nueva Clase - ChessNet</title>
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

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
              <GraduationCap class="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Nueva Clase</h1>
              <p class="text-sm text-slate-400">Crear un nuevo grupo/aula básico</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <button on:click={handleGoBack} class="btn-secondary">
            <X class="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button 
            on:click={handleSubmit} 
            disabled={isSubmitting}
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creando...
            {:else}
              <Save class="w-4 h-4 mr-2" />
              Crear Clase
            {/if}
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-8">
      <form on:submit|preventDefault={handleSubmit} class="space-y-8">
        
        <!-- Información Básica -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
            <GraduationCap class="w-5 h-5 mr-2" />
            Información Esencial
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre de la clase -->
            <div class="md:col-span-2">
              <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
                Nombre de la clase
              </label>
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                placeholder="Ej: Principiantes Mañana, Intermedios Tarde..."
                class="input w-full"
                class:border-red-500={errors.name}
              />
              {#if errors.name}
                <p class="text-red-400 text-sm mt-1">{errors.name}</p>
              {/if}
            </div>

            <!-- Centro -->
            <div class="md:col-span-2">
              <label for="college_id" class="block text-sm font-medium text-slate-300 mb-2">
                <School class="w-4 h-4 inline mr-1" />
                Centro educativo
              </label>
              
              {#if isPreSelectedCollege && formData.college_id}
                <!-- Centro pre-seleccionado (solo lectura) -->
                <div class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                  <div class="flex items-center space-x-2">
                    <School class="w-4 h-4 text-blue-500" />
                    <span>{getSchoolName(formData.college_id)}</span>
                    <span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Pre-seleccionado</span>
                  </div>
                </div>
                <p class="text-xs text-slate-400 mt-1">
                  El centro se seleccionó automáticamente desde la página anterior
                </p>
              {:else}
                <!-- Dropdown para seleccionar centro -->
                <select
                  id="college_id"
                  bind:value={formData.college_id}
                  class="input w-full"
                  class:border-red-500={errors.college_id}
                >
                  <option value="">Selecciona un centro</option>
                  {#each schools as school}
                    <option value={school.id}>{school.name}</option>
                  {/each}
                </select>
              {/if}
              
              {#if errors.college_id}
                <p class="text-red-400 text-sm mt-1">{errors.college_id}</p>
              {/if}
            </div>


          </div>
        </div>

        <!-- Vista previa -->
        {#if formData.name && formData.college_id}
          <div class="bg-slate-700/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Vista previa</h3>
            <div class="bg-slate-800 border border-slate-600 rounded-lg p-4">
              <div class="flex items-center space-x-3 mb-3">
                <div class="p-2 bg-blue-500/20 rounded-lg">
                  <GraduationCap class="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 class="font-semibold text-white">{formData.name}</h4>
                  <p class="text-sm text-slate-400">{getSchoolName(formData.college_id)}</p>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- Información adicional -->
        <div class="bg-slate-700/50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-slate-300 mb-2">💡 Información</h3>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>• Usa nombres descriptivos para identificar fácilmente la clase</li>
            <li>• Selecciona el centro educativo donde se impartirá la clase</li>
            <li>• La clase se creará con la información básica</li>
            <li>• Podrás agregar más detalles después de crear la clase</li>
          </ul>
        </div>

        <!-- Atajo de teclado -->
        <div class="text-xs text-slate-500 text-center">
          Presiona <kbd class="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + Enter</kbd> para crear rápidamente
        </div>
      </form>
    </div>
  </main>
</div>

<style>
  .input {
    @apply bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500;
  }
  
  kbd {
    @apply font-mono text-xs;
  }
</style>
