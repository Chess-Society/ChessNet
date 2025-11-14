<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    Users, 
    ArrowLeft,
    Save,
    X,
    User,
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    School,
    FileText,
    AlertTriangle
  } from 'lucide-svelte';
  import { showToast, showError } from '$lib/utils/toast';
  import type { PageData } from './$types';

  export let data: PageData;

  let formData = {
    first_name: '',
    last_name: '',
    notes: ''
  };

  let isSubmitting = false;
  let errors: Record<string, string> = {};

  // Obtener parámetros de la URL
  $: classId = $page.url.searchParams.get('class_id');
  $: collegeId = $page.url.searchParams.get('college_id');
  $: returnTo = $page.url.searchParams.get('return_to');
  $: isFromClass = !!classId;
  $: isFromCollege = !!collegeId;

  const handleGoBack = () => {
    if (returnTo) {
      goto(returnTo);
    } else if (isFromClass && classId) {
      goto(`/classes/${classId}/students`);
    } else {
      goto('/students');
    }
  };

  const validateForm = () => {
    errors = {};
    // No hay validaciones específicas para los campos que existen
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      isSubmitting = true;

      console.log('👥 Creating student:', formData);
      
      // Filtrar solo los campos que existen en la tabla students
      const studentData = {
        name: `${formData.first_name?.trim() || ''} ${formData.last_name?.trim() || ''}`.trim() || 'Estudiante sin nombre',
        first_name: (formData.first_name?.trim() && formData.first_name.trim() !== '') ? formData.first_name.trim() : null,
        last_name: (formData.last_name?.trim() && formData.last_name.trim() !== '') ? formData.last_name.trim() : null,
        notes: (formData.notes?.trim() && formData.notes.trim() !== '') ? formData.notes.trim() : null,
        college_id: collegeId || null
      };
      
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ API Error Response:', result);
        const errorMessage = result.details ? 
          `${result.error}: ${result.details}` : 
          result.error || 'Error al crear el estudiante';
        throw new Error(errorMessage);
      }
      
      showToast.success(`Estudiante ${formData.first_name} ${formData.last_name} creado exitosamente`);
      
      // Si viene desde una clase, inscribir automáticamente al estudiante
      if (isFromClass && classId && result.student) {
        try {
          const enrollResponse = await fetch('/api/class-students', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              class_id: classId,
              student_id: result.student.id
            }),
          });

          if (enrollResponse.ok) {
            showToast.success(`Estudiante inscrito automáticamente en la clase`);
            if (returnTo) {
              goto(returnTo);
            } else {
              goto(`/classes/${classId}/students`);
            }
          } else {
            showToast.warning(`Estudiante creado, pero no se pudo inscribir en la clase`);
            if (returnTo) {
              goto(returnTo);
            } else {
              goto('/students');
            }
          }
        } catch (enrollError) {
          console.error('Error enrolling student:', enrollError);
          showToast.warning(`Estudiante creado, pero no se pudo inscribir en la clase`);
          if (returnTo) {
            goto(returnTo);
          } else {
            goto('/students');
          }
        }
      } else {
        if (returnTo) {
          goto(returnTo);
        } else {
          goto('/students');
        }
      }
    } catch (error) {
      console.error('Error creating student:', error);
      showError(error instanceof Error ? error.message : 'Error al crear el estudiante');
    } finally {
      isSubmitting = false;
    }
  };


  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      handleSubmit();
    }
  };

</script>

<svelte:head>
  <title>Nuevo Estudiante - ChessNet</title>
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
            <div class="p-2 bg-green-500/20 rounded-lg">
              <Users class="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">
                {isFromClass ? 'Nuevo Estudiante para Clase' : 'Nuevo Estudiante'}
              </h1>
              {#if isFromClass}
                <p class="text-slate-400 text-sm">El estudiante se inscribirá automáticamente en la clase</p>
              {/if}
              <p class="text-sm text-slate-400">
                {isFromClass ? 'Crear e inscribir estudiante en la clase' : 'Registrar un nuevo alumno'}
              </p>
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
              Crear Estudiante
            {/if}
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-8">
      <form on:submit|preventDefault={handleSubmit} class="space-y-8">
        
        <!-- Mensaje informativo si viene desde una clase -->
        {#if isFromClass}
          <div class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <p class="text-blue-300 text-sm">
                <strong>Inscripción automática:</strong> Este estudiante se inscribirá automáticamente en la clase desde donde se está creando.
              </p>
            </div>
          </div>
        {/if}
        
        <!-- Información Personal -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
            <User class="w-5 h-5 mr-2" />
            Información Personal
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre -->
            <div>
              <label for="first_name" class="block text-sm font-medium text-slate-300 mb-2">
                Nombre
              </label>
              <input
                id="first_name"
                type="text"
                bind:value={formData.first_name}
                placeholder="Nombre del estudiante"
                class="input w-full"
                class:border-red-500={errors.first_name}
              />
              {#if errors.first_name}
                <p class="text-red-400 text-sm mt-1">{errors.first_name}</p>
              {/if}
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
                placeholder="Apellidos del estudiante"
                class="input w-full"
                class:border-red-500={errors.last_name}
              />
              {#if errors.last_name}
                <p class="text-red-400 text-sm mt-1">{errors.last_name}</p>
              {/if}
            </div>

          </div>
        </div>


        <!-- Información Adicional -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
            <FileText class="w-5 h-5 mr-2" />
            Información Adicional
          </h2>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- Notas -->
            <div>
              <label for="notes" class="block text-sm font-medium text-slate-300 mb-2">
                <FileText class="w-4 h-4 inline mr-1" />
                Notas adicionales
              </label>
              <textarea
                id="notes"
                bind:value={formData.notes}
                placeholder="Información adicional sobre el estudiante, nivel, características especiales..."
                rows="3"
                class="input w-full resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="bg-slate-700/50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-slate-300 mb-2">💡 Consejos para registrar estudiantes</h3>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>• Todos los campos son opcionales - puedes completar la información más tarde</li>
            <li>• El nombre y apellidos se combinarán automáticamente para el nombre completo</li>
            <li>• Las notas te ayudarán a recordar características especiales del estudiante</li>
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
