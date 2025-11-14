<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    Target, 
    ArrowLeft,
    Save,
    X
  } from 'lucide-svelte';
  import { showToast, showError } from '$lib/utils/toast';
  import type { PageData } from './$types';

  export const data: PageData = {} as PageData;

  let formData = {
    name: '',
    description: '',
    category_id: '',
    icon: '',
    resource_link: '',
    level: 'beginner',
    order_index: 0
  };

  let isSubmitting = false;
  let errors: Record<string, string> = {};

  const categories = [
    'Fundamentos',
    'Táctica',
    'Finales',
    'Aperturas',
    'Estrategia',
    'Psicología'
  ];

  const levels = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' }
  ];

  const handleGoBack = () => {
    goto('/skills');
  };

  const validateForm = () => {
    errors = {};

    // Validación opcional de order_index si se proporciona
    if (formData.order_index && (formData.order_index < 0 || formData.order_index > 1000)) {
      errors.order_index = 'El índice de orden debe estar entre 0 y 1000';
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

      console.log('🎯 Creating skill:', formData);
      
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: (formData.name?.trim() && formData.name.trim() !== '') ? formData.name.trim() : 'Habilidad sin nombre',
          description: (formData.description?.trim() && formData.description.trim() !== '') ? formData.description.trim() : null,
          category_id: (formData.category_id?.trim() && formData.category_id.trim() !== '') ? formData.category_id.trim() : null,
          level: formData.level || 'beginner',
          icon: (formData.icon?.trim() && formData.icon.trim() !== '') ? formData.icon.trim() : null,
          resource_link: (formData.resource_link?.trim() && formData.resource_link.trim() !== '') ? formData.resource_link.trim() : null,
          order_index: formData.order_index || 0
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la habilidad');
      }
      
      showToast('Habilidad creada exitosamente');
      goto('/skills');
    } catch (error) {
      console.error('Error creating skill:', error);
      showError('Error al crear la habilidad: ' + (error instanceof Error ? error.message : 'Error desconocido'));
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
  <title>Nueva Habilidad - ChessNet</title>
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
            <div class="p-2 bg-purple-500/20 rounded-lg">
              <Target class="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Nueva Habilidad</h1>
              <p class="text-sm text-slate-400">Crear una nueva skill o competencia</p>
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
              Crear Habilidad
            {/if}
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-8">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- Nombre -->
        <div>
          <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
            Nombre de la habilidad
          </label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            placeholder="Ej: Movimiento de peones, Táctica de clavada..."
            class="input w-full"
            class:border-red-500={errors.name}
          />
          {#if errors.name}
            <p class="text-red-400 text-sm mt-1">{errors.name}</p>
          {/if}
        </div>

        <!-- Descripción -->
        <div>
          <label for="description" class="block text-sm font-medium text-slate-300 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            bind:value={formData.description}
            placeholder="Describe qué aprenderá el estudiante con esta habilidad..."
            rows="4"
            class="input w-full resize-none"
            class:border-red-500={errors.description}
          ></textarea>
          {#if errors.description}
            <p class="text-red-400 text-sm mt-1">{errors.description}</p>
          {/if}
        </div>

        <!-- Categoría -->
        <div>
          <label for="category_id" class="block text-sm font-medium text-slate-300 mb-2">
            Categoría
          </label>
          <select
            id="category_id"
            bind:value={formData.category_id}
            class="input w-full"
            class:border-red-500={errors.category_id}
          >
            <option value="">Selecciona una categoría</option>
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
          {#if errors.category_id}
            <p class="text-red-400 text-sm mt-1">{errors.category_id}</p>
          {/if}
        </div>

        <!-- Nivel -->
        <div>
          <label for="level" class="block text-sm font-medium text-slate-300 mb-2">
            Nivel
          </label>
          <select
            id="level"
            bind:value={formData.level}
            class="input w-full"
          >
            {#each levels as level}
              <option value={level.value}>{level.label}</option>
            {/each}
          </select>
        </div>

        <!-- Icono -->
        <div>
          <label for="icon" class="block text-sm font-medium text-slate-300 mb-2">
            Icono (opcional)
          </label>
          <input
            id="icon"
            type="text"
            bind:value={formData.icon}
            placeholder="Ej: ♟️, 🏰, ⚔️"
            class="input w-full"
          />
        </div>

        <!-- Enlace de recurso -->
        <div>
          <label for="resource_link" class="block text-sm font-medium text-slate-300 mb-2">
            Enlace de recurso (opcional)
          </label>
          <input
            id="resource_link"
            type="url"
            bind:value={formData.resource_link}
            placeholder="https://ejemplo.com/recurso"
            class="input w-full"
          />
        </div>

        <!-- Orden -->
        <div>
          <label for="order_index" class="block text-sm font-medium text-slate-300 mb-2">
            Orden de aparición
          </label>
          <input
            id="order_index"
            type="number"
            min="0"
            bind:value={formData.order_index}
            class="input w-full"
          />
          <p class="text-xs text-slate-400 mt-1">
            Número para ordenar las habilidades (0 = primero)
          </p>
        </div>

        <!-- Información adicional -->
        <div class="bg-slate-700/50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-slate-300 mb-2">💡 Consejos para crear habilidades</h3>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>• Sé específico en el nombre (ej: "Enroque corto" vs "Enroque")</li>
            <li>• La descripción debe explicar qué aprenderá el estudiante</li>
            <li>• Organiza por categorías para facilitar la búsqueda</li>
            <li>• Ajusta la dificultad según el nivel requerido</li>
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
