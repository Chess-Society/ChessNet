<script lang="ts">
  import { goto } from '$app/navigation';
  import { showToast, showError } from '$lib/utils/toast';
  import { appStore } from '$lib/stores/appStore';
  import { ArrowLeft, Target, X, Save } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let formData = $state({
    name: '',
    description: '',
    category_id: '',
    difficulty: 1,
    estimated_hours: 1,
    learning_objectives: [''] as string[],
    assessment_criteria: [''] as string[],
    resources: [''] as string[],
    icon: '',
    resource_link: '',
    order_index: 0,
    active: true
  });

  let isSubmitting = $state(false);
  let errors: Record<string, string> = $state({});

  // Obtener categorías desde el store
  const categories = $derived($appStore.categories || []);

  const difficultyLevels = [
    { value: 1, label: 'Muy Fácil' },
    { value: 2, label: 'Fácil' },
    { value: 3, label: 'Intermedio' },
    { value: 4, label: 'Difícil' },
    { value: 5, label: 'Muy Difícil' }
  ];

  const handleGoBack = () => {
    goto('/panel/habilidades');
  };

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!formData.category_id) errors.category_id = 'La categoría es obligatoria';

    if (formData.order_index && (formData.order_index < 0 || formData.order_index > 1000)) {
      errors.order_index = 'El índice de orden debe estar entre 0 y 1000';
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast.error('Por favor, corrige los errores en el formulario');
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
          ...formData,
          name: formData.name.trim(),
          description: formData.description.trim(),
          learning_objectives: formData.learning_objectives.filter(o => o.trim()),
          assessment_criteria: formData.assessment_criteria.filter(c => c.trim()),
          resources: formData.resources.filter(r => r.trim())
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la habilidad');
      }
      
      showToast.success('Habilidad creada exitosamente');
      goto('/panel/habilidades');
    } catch (error) {
      console.error('Error creating skill:', error);
      showError(error, 'Error al crear la habilidad');
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

<svelte:window onkeydown={handleKeyDown} />

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <!-- Header -->
  <header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button onclick={handleGoBack} class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-white">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-purple-500/20 rounded-lg">
              <Target class="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Nueva Habilidad</h1>
              <p class="text-sm text-slate-400">Crear una nueva skill o competencia</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <button onclick={handleGoBack} class="btn-secondary">
            <X class="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button 
            onclick={handleSubmit} 
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
      <form 
        onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} 
        class="space-y-6"
      >
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
            Categoría *
          </label>
          <select
            id="category_id"
            bind:value={formData.category_id}
            class="input w-full"
            class:border-red-500={errors.category_id}
          >
            <option value="">Selecciona una categoría</option>
            {#each categories as category}
              <option value={category.id}>{category.name}</option>
            {/each}
          </select>
          {#if errors.category_id}
            <p class="text-red-400 text-sm mt-1">{errors.category_id}</p>
          {/if}
        </div>

        <!-- Dificultad -->
        <div>
          <label for="difficulty" class="block text-sm font-medium text-slate-300 mb-2">
            Nivel de Dificultad
          </label>
          <select
            id="difficulty"
            bind:value={formData.difficulty}
            class="input w-full"
          >
            {#each difficultyLevels as level}
              <option value={level.value}>{'⭐'.repeat(level.value)} {level.label}</option>
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
    background-color: #334155;
    border: 1px solid #475569;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    color: white;
    transition: all 0.2s;
  }
  
  .input::placeholder {
    color: #94a3b8;
  }
  
  .input:focus {
    border-color: #8b5cf6;
    outline: none;
    box-shadow: 0 0 0 1px #8b5cf6;
  }
  
  kbd {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.75rem;
    line-height: 1rem;
  }
</style>
