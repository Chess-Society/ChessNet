<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    ArrowLeft,
    Save,
    User,
    RotateCcw
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let studentData = data.student;
  let schools = data.schools || [];

  // Form data - solo campos que existen en Supabase
  let formData = {
    name: studentData?.name || '',
    first_name: studentData?.first_name || '',
    last_name: studentData?.last_name || '',
    college_id: studentData?.college_id || '',
    notes: studentData?.notes || ''
  };

  // Detectar college_id de la URL para asignación automática
  $: {
    const urlCollegeId = $page.url.searchParams.get('college_id');
    if (urlCollegeId && !formData.college_id) {
      formData.college_id = urlCollegeId;
    }
  }

  // Form state
  let isSubmitting = false;
  let errors: Record<string, string> = {};

  // Función para obtener el nombre del centro
  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Sin asignar';
  };

  onMount(() => {
    console.log('✏️ Edit student page loaded:', studentData?.name);
  });

  const handleGoBack = () => {
    goto('/students');
  };

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    isSubmitting = true;

    try {
      console.log('💾 Updating student:', formData);

      const response = await fetch(`/api/students/${studentData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Student updated successfully:', result);
        showToast.success('Estudiante actualizado correctamente');
        
        // Redirigir según el parámetro return_to
        const returnTo = $page.url.searchParams.get('return_to');
        if (returnTo) {
          goto(returnTo);
        } else {
          goto('/students');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el estudiante');
      }
    } catch (error: any) {
      console.error('Error updating student:', error);
      showError(error, 'Error al actualizar el estudiante');
    } finally {
      isSubmitting = false;
    }
  };

  const resetToOriginal = () => {
    formData = {
      name: studentData?.name || '',
      first_name: studentData?.first_name || '',
      last_name: studentData?.last_name || '',
      college_id: studentData?.college_id || '',
      notes: studentData?.notes || ''
    };
    errors = {};
  };

  const hasChanges = () => {
    return (
      formData.name !== (studentData?.name || '') ||
      formData.first_name !== (studentData?.first_name || '') ||
      formData.last_name !== (studentData?.last_name || '') ||
      formData.college_id !== (studentData?.college_id || '') ||
      formData.notes !== (studentData?.notes || '')
    );
  };

  const getSelectedSchoolName = () => {
    const school = schools.find(s => s.id === formData.college_id);
    return school?.name || 'Seleccionar centro';
  };
</script>

<svelte:head>
  <title>Editar Estudiante - {studentData?.name || 'Estudiante'} - ChessNet</title>
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
            <div class="p-2 bg-green-500/20 rounded-lg">
              <User class="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Editar Estudiante</h1>
              <p class="text-sm text-slate-400">{studentData?.name}</p>
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
    <div class="max-w-2xl mx-auto">
      <!-- Formulario simplificado -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-6">Editar Estudiante</h2>
        
        <!-- Mensaje informativo si se asignó automáticamente el centro -->
        {#if $page.url.searchParams.get('college_id')}
          <div class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <p class="text-blue-300 text-sm">
                <strong>Centro asignado automáticamente:</strong> El estudiante se ha asignado al centro de la clase desde donde se está editando.
              </p>
            </div>
          </div>
        {/if}
        
        <div class="space-y-6">
          <!-- Nombre completo -->
          <div>
            <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
              Nombre Completo *
            </label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              class={`input w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Nombre completo del estudiante"
            />
            {#if errors.name}
              <p class="text-red-400 text-sm mt-1">{errors.name}</p>
            {/if}
          </div>

          <!-- Nombre -->
          <div>
            <label for="first_name" class="block text-sm font-medium text-slate-300 mb-2">
              Nombre
            </label>
            <input
              id="first_name"
              type="text"
              bind:value={formData.first_name}
              class="input w-full"
              placeholder="Nombre del estudiante"
            />
          </div>

          <!-- Apellidos -->
          <div>
            <label for="last_name" class="block text-sm font-medium text-slate-300 mb-2">
              Apellidos
            </label>
            <input
              id="last_name"
              type="text"
              bind:value={formData.last_name}
              class="input w-full"
              placeholder="Apellidos del estudiante"
            />
          </div>

          <!-- Centro -->
          <div>
            <label for="college_id" class="block text-sm font-medium text-slate-300 mb-2">
              Centro Educativo
            </label>
            <select
              id="college_id"
              bind:value={formData.college_id}
              class="input w-full"
            >
              <option value="">Seleccionar centro</option>
              {#each schools as school}
                <option value={school.id}>{school.name}</option>
              {/each}
            </select>
          </div>

          <!-- Notas -->
          <div>
            <label for="notes" class="block text-sm font-medium text-slate-300 mb-2">
              Notas
            </label>
            <textarea
              id="notes"
              bind:value={formData.notes}
              class="input w-full h-24 resize-none"
              placeholder="Notas sobre el estudiante..."
            ></textarea>
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
