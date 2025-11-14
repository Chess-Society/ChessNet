<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Target, 
    Plus, 
    Edit, 
    Trash2,
    ArrowLeft,
    Search,
    Filter,
    BookOpen,
    Zap,
    Star,
    Trophy
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let skills = data.skills || [];
  let categories = data.categories || [];
  let stats = data.stats || { total: 0, beginner: 0, intermediate: 0, advanced: 0 };
  let isLoading = false;
  let searchQuery = '';
  let selectedCategory = '';
  let selectedDifficulty = '';

  // Filtros reactivos
  $: filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || skill.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || skill.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };

  const categoryIcons = {
    'Fundamentos': BookOpen,
    'Táctica': Zap,
    'Finales': Star,
    'Aperturas': Trophy
  };

  onMount(() => {
    console.log('✅ Skills page: User authenticated via server:', data.user?.email);
    console.log('✅ Skills page: Skills from server:', skills.length);
  });

  const handleGoBack = () => {
    goto('/dashboard');
  };

  const handleCreateSkill = () => {
    goto('/skills/create');
  };

  const handleEditSkill = (skillId: string) => {
    goto(`/skills/${skillId}/edit`);
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) return;
    
    try {
      const response = await fetch('/api/skills', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: skillId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar la habilidad');
      }

      // Remover del array local
      skills = skills.filter(s => s.id !== skillId);
      console.log('✅ Skill deleted successfully:', skillId);
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error al eliminar la habilidad: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const clearFilters = () => {
    searchQuery = '';
    selectedCategory = '';
    selectedDifficulty = '';
  };
</script>

<svelte:head>
  <title>Habilidades - ChessNet</title>
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
            <div class="p-2 bg-purple-500/20 rounded-lg">
              <Target class="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Habilidades</h1>
              <p class="text-sm text-slate-400">Catálogo de skills y competencias</p>
            </div>
          </div>
        </div>
        
        <button on:click={handleCreateSkill} class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Nueva Habilidad
        </button>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-purple-500/20 rounded-lg">
            <Target class="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{stats.total}</div>
            <div class="text-sm text-slate-400">Total Skills</div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-green-500/20 rounded-lg">
            <BookOpen class="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{stats.beginner}</div>
            <div class="text-sm text-slate-400">Principiante</div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-yellow-500/20 rounded-lg">
            <Zap class="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{stats.intermediate}</div>
            <div class="text-sm text-slate-400">Intermedio</div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-red-500/20 rounded-lg">
            <Star class="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{stats.advanced}</div>
            <div class="text-sm text-slate-400">Avanzado</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar habilidades..."
            bind:value={searchQuery}
            class="input pl-10 w-full"
          />
        </div>

        <select bind:value={selectedCategory} class="input">
          <option value="">Todas las categorías</option>
          {#each categories as category}
            <option value={category.name}>{category.name} ({category.count})</option>
          {/each}
        </select>

        <select bind:value={selectedDifficulty} class="input">
          <option value="">Todas las dificultades</option>
          <option value="beginner">Principiante</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </select>

        <button on:click={clearFilters} class="btn-secondary">
          <Filter class="w-4 h-4 mr-2" />
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Lista de habilidades -->
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    {:else if filteredSkills.length === 0}
      <div class="text-center py-12">
        <Target class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-slate-400 mb-2">
          {searchQuery || selectedCategory || selectedDifficulty ? 'No se encontraron habilidades' : 'No hay habilidades registradas'}
        </h3>
        <p class="text-slate-500 mb-6">
          {searchQuery || selectedCategory || selectedDifficulty ? 'Prueba con otros filtros de búsqueda' : 'Comienza creando tu primera habilidad'}
        </p>
        {#if !searchQuery && !selectedCategory && !selectedDifficulty}
          <button on:click={handleCreateSkill} class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            Crear Primera Habilidad
          </button>
        {/if}
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredSkills as skill}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                {#if categoryIcons[skill.category]}
                  <div class="p-2 bg-purple-500/20 rounded-lg">
                    <svelte:component this={categoryIcons[skill.category]} class="w-5 h-5 text-purple-500" />
                  </div>
                {/if}
                <div>
                  <h3 class="font-semibold text-white">{skill.name}</h3>
                  <p class="text-sm text-slate-400">{skill.category}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  on:click={() => handleEditSkill(skill.id)}
                  class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  on:click={() => handleDeleteSkill(skill.id)}
                  class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p class="text-slate-300 mb-4 text-sm leading-relaxed">{skill.description}</p>

            <div class="flex items-center justify-between">
              <span class={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[skill.difficulty]}`}>
                {difficultyLabels[skill.difficulty]}
              </span>
              <span class="text-xs text-slate-500">
                Creado: {new Date(skill.created_at).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>

<style>
  .input {
    @apply bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500;
  }
</style>
