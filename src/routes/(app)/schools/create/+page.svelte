<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { schoolsApi } from '$lib/api/schools';
  import { showError, showToast } from '$lib/utils/toast';
  import { ArrowLeft, School, MapPin, Globe } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let name = '';
  let city = '';
  let isCreating = false;

  onMount(() => {
    console.log('✅ Create school page: User authenticated via server:', data.user?.email);
  });

  async function createSchool() {
    // Validar que el nombre no esté vacío
    if (!name || !name.trim()) {
      showError(new Error('El nombre del centro es obligatorio'));
      return;
    }


    try {
      isCreating = true;
      
      // Usar API del servidor en lugar del cliente
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies
        body: JSON.stringify({
          name: name?.trim() || 'Centro sin nombre',
          city: city?.trim() || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el centro');
      }

      showToast.success('Centro creado correctamente');
      goto(`/schools/${result.school.id}`);
    } catch (error) {
      showError(error, 'Error al crear el centro');
    } finally {
      isCreating = false;
    }
  }

  function cancel() {
    goto('/schools');
  }
</script>

<svelte:head>
  <title>Crear Centro - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <header class="bg-slate-800 border-b border-slate-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center space-x-4">
          <button 
            on:click={() => goto('/schools')}
            class="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <h1 class="text-2xl font-bold text-white">Crear Nuevo Centro</h1>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-primary-600 p-3 rounded-xl">
              <School class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-semibold">Información del Centro</h2>
              <p class="text-slate-400">Completa los datos de tu centro educativo</p>
            </div>
          </div>

          <form on:submit|preventDefault={createSchool} class="space-y-6">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-slate-200">Información Básica</h3>
              
              <div>
                <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
                  Nombre del centro
                </label>
                <input
                  id="name"
                  type="text"
                  bind:value={name}
                  placeholder="Ej: Colegio San Ramón y San Antonio"
                  class="input-base w-full"
                  required
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="city" class="block text-sm font-medium text-slate-300 mb-2">
                    Ciudad
                  </label>
                  <input
                    id="city"
                    type="text"
                    bind:value={city}
                    placeholder="Ej: Madrid"
                    class="input-base w-full"
                  />
                </div>

              </div>

            </div>


            <!-- Actions -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-slate-700">
              <button
                type="button"
                on:click={cancel}
                class="btn-ghost"
                disabled={isCreating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn-primary"
                disabled={isCreating || !name.trim()}
              >
                {#if isCreating}
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                {:else}
                  Crear centro
                {/if}
              </button>
            </div>
          </form>
        </div>

        <!-- Help text -->
        <div class="mt-6 p-4 bg-slate-800 rounded-lg">
          <h4 class="font-medium text-slate-200 mb-2">💡 Consejos</h4>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>• El nombre del centro es obligatorio y aparecerá en todos los documentos</li>
            <li>• La información de contacto es opcional pero recomendada</li>
            <li>• Podrás modificar estos datos más tarde desde la configuración del centro</li>
            <li>• Una vez creado, se inicializarán automáticamente las habilidades y materiales por defecto</li>
          </ul>
        </div>
      </div>
    </main>
</div>
