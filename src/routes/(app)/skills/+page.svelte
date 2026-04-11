<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Target, 
    Plus, 
    Edit, 
    Trash2,
    Search,
    Filter,
    BookOpen,
    Zap,
    Star,
    Trophy,
    RefreshCw,
    X,
    ChevronRight,
    Calendar
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();
  
  interface LocalSkill {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    created_at: string;
  }

  let skills = $state((data.skills as unknown as LocalSkill[]) || []);
  let categories = $state((data.categories || []) as any[]);
  let stats = $state((data.stats || { total: 0, beginner: 0, intermediate: 0, advanced: 0 }) as any);
  let isLoading = $state(false);
  
  let searchQuery = $state('');
  let selectedCategory = $state('');
  let selectedDifficulty = $state('');

  const filteredSkills = $derived(
    skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || skill.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || skill.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
  );

  const difficultyThemes: Record<string, string> = {
    beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const difficultyLabels: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };

  const categoryIcons: Record<string, any> = {
    'Fundamentos': BookOpen,
    'Táctica': Zap,
    'Finales': Star,
    'Aperturas': Trophy
  };

  async function deleteSkill(skillId: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) return;
    
    try {
      const response = await fetch('/api/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: skillId }),
      });

      if (response.ok) {
        skills = skills.filter(s => s.id !== skillId);
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  }

  const clearFilters = () => {
    searchQuery = '';
    selectedCategory = '';
    selectedDifficulty = '';
  };
</script>

<svelte:head>
  <title>Habilidades - ChessNet</title>
</svelte:head>

<div class="space-y-8 animate-fade-in" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div class="space-y-2 text-center md:text-left">
      <div class="flex items-center justify-center md:justify-start gap-3 text-primary-400 font-bold uppercase tracking-widest text-xs">
        <Target class="w-4 h-4" />
        Curriculo & Programa
      </div>
      <h1 class="text-4xl font-black text-white tracking-tight">Habilidades</h1>
      <p class="text-surface-400">Catálogo de competencias y objetivos de aprendizaje para tus estudiantes.</p>
    </div>

    <div class="flex items-center justify-center gap-3">
      <button 
        onclick={() => goto('/skills/create')}
        class="btn-primary"
      >
        <Plus class="w-5 h-5 mr-2" />
        Nueva Habilidad
      </button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-6">
    <div class="glass-card p-6 border-b-2 border-primary-500">
      <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Total Skills</p>
      <div class="flex items-center justify-between">
        <p class="text-3xl font-black text-white">{stats.total}</p>
        <div class="p-2 bg-primary-500/10 rounded-xl text-primary-400">
          <Target class="w-5 h-5" />
        </div>
      </div>
    </div>
    
    <div class="glass-card p-6 border-b-2 border-green-500">
      <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Principiante</p>
      <div class="flex items-center justify-between">
        <p class="text-3xl font-black text-green-400">{stats.beginner}</p>
        <div class="p-2 bg-green-500/10 rounded-xl text-green-400">
          <BookOpen class="w-5 h-5" />
        </div>
      </div>
    </div>
    
    <div class="glass-card p-6 border-b-2 border-yellow-500">
      <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Intermedio</p>
      <div class="flex items-center justify-between">
        <p class="text-3xl font-black text-yellow-400">{stats.intermediate}</p>
        <div class="p-2 bg-yellow-500/10 rounded-xl text-yellow-400">
          <Zap class="w-5 h-5" />
        </div>
      </div>
    </div>

    <div class="glass-card p-6 border-b-2 border-red-500">
      <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Avanzado</p>
      <div class="flex items-center justify-between">
        <p class="text-3xl font-black text-red-400">{stats.advanced}</p>
        <div class="p-2 bg-red-500/10 rounded-xl text-red-400">
          <Star class="w-5 h-5" />
        </div>
      </div>
    </div>
  </div>

  <!-- Filters Area -->
  <div class="glass-panel p-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="relative group">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors" />
        <input
          type="text"
          placeholder="Filtrar por nombre..."
          bind:value={searchQuery}
          class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-primary-500/50 outline-none transition-all"
        />
      </div>

      <select 
        bind:value={selectedCategory} 
        class="bg-surface-950 border border-surface-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 outline-none transition-all cursor-pointer"
      >
        <option value="">Todas las categorías</option>
        {#each categories as category}
          <option value={category.name}>{category.name} ({category.count})</option>
        {/each}
      </select>

      <select 
        bind:value={selectedDifficulty} 
        class="bg-surface-950 border border-surface-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 outline-none transition-all cursor-pointer"
      >
        <option value="">Todas las dificultades</option>
        <option value="beginner">Principiante</option>
        <option value="intermediate">Intermedio</option>
        <option value="advanced">Avanzado</option>
      </select>

      <button 
        onclick={clearFilters} 
        class="btn-ghost flex items-center justify-center gap-2 text-sm"
      >
        <X class="w-4 h-4" />
        Limpiar Filtros
      </button>
    </div>
  </div>

  <!-- Skills Grid -->
  {#if filteredSkills.length === 0}
    <div class="glass-panel p-20 text-center space-y-6">
      <div class="w-20 h-20 bg-surface-900 rounded-3xl flex items-center justify-center mx-auto border border-surface-800">
        <Target class="w-10 h-10 text-surface-700" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">No hay habilidades que mostrar</h2>
        <p class="text-surface-500 text-sm max-w-xs mx-auto">
          Prueba a ajustar tus filtros de búsqueda para encontrar lo que necesitas.
        </p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredSkills as skill, i}
        {@const IconComponent = categoryIcons[skill.category] || Target}
        <div 
          class="glass-card group hover:bg-surface-900/40 transition-all duration-300 flex flex-col"
          in:fly={{ y: 20, delay: i * 40 }}
        >
          <div class="p-6 space-y-6 flex-1 flex flex-col">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-surface-900 rounded-xl flex items-center justify-center border border-surface-800 text-primary-400 group-hover:scale-110 group-hover:bg-primary-500/10 transition-all">
                  <IconComponent class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-bold text-white group-hover:text-primary-400 transition-colors">{skill.name}</h3>
                  <p class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">{skill.category}</p>
                </div>
              </div>
              
              <div class="flex gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onclick={() => goto(`/skills/${skill.id}/edit`)}
                  class="p-2 hover:bg-surface-800 rounded-lg text-surface-400 hover:text-white transition-colors"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteSkill(skill.id)}
                  class="p-2 hover:bg-red-500/10 rounded-lg text-surface-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p class="text-sm text-surface-400 leading-relaxed font-medium line-clamp-3">
              {skill.description}
            </p>

            <div class="mt-auto pt-6 flex items-center justify-between">
              <span class={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${difficultyThemes[skill.difficulty]}`}>
                {difficultyLabels[skill.difficulty]}
              </span>
              
              <div class="flex items-center gap-2 text-[10px] text-surface-600 font-bold uppercase tracking-wider">
                <Calendar class="w-3 h-3" />
                {new Date(skill.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <button 
            onclick={() => goto(`/skills/${skill.id}`)}
            class="w-full py-4 bg-surface-900/50 hover:bg-primary-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 hover:text-primary-400 border-t border-surface-800/50 transition-all flex items-center justify-center gap-2"
          >
            Detalles de Habilidad
            <ChevronRight class="w-3 h-3" />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Skill item styles */
</style>
