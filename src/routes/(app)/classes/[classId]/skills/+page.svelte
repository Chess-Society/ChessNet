<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Target, 
    ArrowLeft,
    Plus,
    Minus,
    Search,
    GripVertical,
    BookOpen,
    Zap,
    Star,
    Trophy,
    Clock,
    MapPin,
    GraduationCap,
    ChevronDown,
    ChevronUp
  } from 'lucide-svelte';
  import { showToast, showError } from '$lib/utils/toast';
  import type { PageData } from './$types';

  export let data: PageData;
  
  interface ExtendedSkill {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    created_at?: string;
    assigned_at?: string;
    order?: number;
    assignment_id?: string;
    skill?: {
      name: string;
      description: string;
      category: string;
      difficulty: number;
    };
  }

  const getDifficultyStars = (difficulty: number) => Array.from({ length: 5 }, (_, i) => i < difficulty);

  interface LocalClass {
    id: string;
    name: string;
    level: string;
    schedule: string;
    room?: string;
    description?: string;
  }

  let classData = data.class as unknown as LocalClass;
  let assignedSkills = (data.assignedSkills as unknown as ExtendedSkill[]) || [];
  let availableSkillsByCategory = (data.availableSkillsByCategory as unknown as Record<string, ExtendedSkill[]>) || {};
  let stats = data.stats || { assigned: 0, available: 0, byCategory: {} as Record<string, number> };
  
  let searchQuery = '';
  let isAssigning = false;
  let expandedCategories: Record<string, boolean> = {};

  // Filtrar skills disponibles por búsqueda
  $: filteredAvailableSkills = Object.entries(availableSkillsByCategory || {}).reduce((acc, [category, skills]) => {
    const filtered = skills.filter(skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as typeof availableSkillsByCategory);

  const difficultyColors: Record<string, string> = {
    beginner: 'text-green-400 bg-green-500/20 border-green-500/30',
    intermediate: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    advanced: 'text-red-400 bg-red-500/20 border-red-500/30'
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

  const categoryColors: Record<string, string> = {
    'Fundamentos': 'text-blue-400 bg-blue-500/20',
    'Táctica': 'text-yellow-400 bg-yellow-500/20',
    'Finales': 'text-purple-400 bg-purple-500/20',
    'Aperturas': 'text-green-400 bg-green-500/20'
  };

  onMount(() => {
    console.log('✅ Class skills page: Class:', classData?.name);
    console.log('✅ Assigned skills:', assignedSkills.length);
    console.log('✅ Available skills by category:', Object.keys(availableSkillsByCategory));

    // Expandir todas las categorías por defecto
    Object.keys(availableSkillsByCategory).forEach(category => {
      expandedCategories[category] = true;
    });
  });

  const handleGoBack = () => {
    goto(`/classes/${classData?.id}`);
  };

  const handleAssignSkill = async (skillId: string) => {
    try {
      isAssigning = true;
      
      const response = await fetch('/api/class-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class_id: classData?.id,
          skill_id: skillId
        })
      });

      if (response.ok) {
        // Encontrar la skill en las disponibles y moverla a asignadas
        let skillToMove = null;
        let categoryToUpdate = '';
        
        for (const [category, skills] of Object.entries(availableSkillsByCategory || {})) {
          const skill = skills.find(s => s.id === skillId);
          if (skill) {
            skillToMove = skill;
            categoryToUpdate = category;
            break;
          }
        }
        
        if (skillToMove) {
          // Agregar a skills asignadas
          const newAssignedSkill = {
            ...skillToMove,
            assigned_at: new Date().toISOString(),
            order: assignedSkills.length + 1,
            assignment_id: `csk-${Date.now()}`
          };
          
          assignedSkills = [...assignedSkills, newAssignedSkill];
          
          // Remover de skills disponibles
          availableSkillsByCategory[categoryToUpdate] = availableSkillsByCategory[categoryToUpdate]
            .filter(s => s.id !== skillId);
          
          // Si la categoría queda vacía, eliminarla
          if (availableSkillsByCategory[categoryToUpdate].length === 0) {
            delete availableSkillsByCategory[categoryToUpdate];
            availableSkillsByCategory = { ...availableSkillsByCategory };
          }
          
          // Actualizar estadísticas
          const s = stats as any;
          s.assigned += 1;
          s.available -= 1;
          if (!s.byCategory[skillToMove.category]) {
            s.byCategory[skillToMove.category] = 0;
          }
          s.byCategory[skillToMove.category]++;
        }
        
        showToast.success(`Skill "${skillToMove?.name}" asignada correctamente`);
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Error al asignar la skill');
      }
    } catch (error: any) {
      console.error('Error assigning skill:', error);
      showToast.error('Error al asignar la skill');
    } finally {
      isAssigning = false;
    }
  };

  const handleUnassignSkill = async (skillId: string) => {
    const skill = assignedSkills.find(s => s.id === skillId);
    if (!confirm(`¿Estás seguro de que quieres quitar "${skill?.name}" del temario?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/class-skills?class_id=${classData?.id}&skill_id=${skillId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Mover skill de asignadas a disponibles
        if (skill) {
          const { assigned_at, order, assignment_id, ...skillData } = skill;
          
          // Agregar a skills disponibles
          if (!availableSkillsByCategory[skill.category]) {
            availableSkillsByCategory[skill.category] = [];
          }
          availableSkillsByCategory[skill.category].push(skillData);
          availableSkillsByCategory = { ...availableSkillsByCategory };
          
          // Remover de skills asignadas
          assignedSkills = assignedSkills.filter(s => s.id !== skillId);
          
          // Actualizar estadísticas
          const s = stats as any;
          s.assigned -= 1;
          s.available += 1;
          s.byCategory[skill.category]--;
          if (s.byCategory[skill.category] === 0) {
            delete s.byCategory[skill.category];
          }
        }
        
        showToast.success(`Skill "${skill?.name}" removida del temario`);
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Error al quitar la skill');
      }
    } catch (error: any) {
      console.error('Error unassigning skill:', error);
      showToast.error('Error al quitar la skill');
    }
  };

  const toggleCategory = (category: string) => {
    expandedCategories[category] = !expandedCategories[category];
    expandedCategories = { ...expandedCategories };
  };

  // Funciones para reordenar skills (implementación básica)
  const moveSkillUp = (index: number) => {
    if (index > 0) {
      const newAssignedSkills = [...assignedSkills];
      [newAssignedSkills[index - 1], newAssignedSkills[index]] = 
      [newAssignedSkills[index], newAssignedSkills[index - 1]];
      
      // Actualizar orden
      newAssignedSkills.forEach((skill, i) => {
        skill.order = i + 1;
      });
      
      assignedSkills = newAssignedSkills;
      
      // TODO: Enviar actualización al servidor
      console.log('Moving skill up:', assignedSkills[index - 1].name);
    }
  };

  const moveSkillDown = (index: number) => {
    if (index < assignedSkills.length - 1) {
      const newAssignedSkills = [...assignedSkills];
      [newAssignedSkills[index], newAssignedSkills[index + 1]] = 
      [newAssignedSkills[index + 1], newAssignedSkills[index]];
      
      // Actualizar orden
      newAssignedSkills.forEach((skill, i) => {
        skill.order = i + 1;
      });
      
      assignedSkills = newAssignedSkills;
      
      // TODO: Enviar actualización al servidor
      console.log('Moving skill down:', assignedSkills[index + 1].name);
    }
  };
</script>

<svelte:head>
  <title>Temario - {classData?.name || 'Clase'} - ChessNet</title>
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
              <h1 class="text-2xl font-bold">{classData?.name}</h1>
              <p class="text-sm text-slate-400">Temario y habilidades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <!-- Información de la clase -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="space-y-2">
          <div class="flex items-center space-x-2 text-sm">
            <Clock class="w-4 h-4 text-slate-500" />
            <span class="text-slate-300">{classData?.schedule}</span>
          </div>
          {#if classData?.room}
            <div class="flex items-center space-x-2 text-sm">
              <MapPin class="w-4 h-4 text-slate-500" />
              <span class="text-slate-300">{classData.room}</span>
            </div>
          {/if}
        </div>

        <div class="space-y-2">
          <div class="flex items-center space-x-2 text-sm">
            <GraduationCap class="w-4 h-4 text-slate-500" />
            <span class="text-slate-300">{(classData && (difficultyLabels as any)[(classData as any).level]) || (classData as any)?.level || 'Nivel'}</span>
          </div>
          <div class="flex items-center space-x-2 text-sm">
            <Target class="w-4 h-4 text-slate-500" />
            <span class="text-purple-400 font-medium">{(stats as any).assigned || 0} skills asignadas</span>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-sm text-slate-400">Por categoría</p>
          <div class="space-y-1">
            {#if (stats as any).byCategory && typeof (stats as any).byCategory === 'object'}
              {#each Object.entries((stats as any).byCategory) as [category, count]}
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-300">{category}</span>
                  <span class="text-slate-400">{count}</span>
                </div>
              {/each}
            {/if}
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-sm text-slate-400">Skills disponibles</p>
          <div class="flex items-center space-x-2">
            <Plus class="w-4 h-4 text-slate-500" />
            <span class="text-lg font-bold text-green-400">{(stats as any).available || 0}</span>
          </div>
        </div>
      </div>

      {#if classData?.description}
        <div class="mt-4 pt-4 border-t border-slate-700">
          <p class="text-slate-300 text-sm">{classData.description}</p>
        </div>
      {/if}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Temario Actual (Skills Asignadas) -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white flex items-center">
            <Target class="w-5 h-5 mr-2" />
            Temario Actual ({assignedSkills.length})
          </h2>
        </div>

        {#if assignedSkills.length === 0}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <Target class="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-slate-400 mb-2">No hay skills asignadas</h3>
            <p class="text-slate-500">Asigna habilidades desde la lista de disponibles</p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each assignedSkills as skill, index}
              <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-3 flex-1">
                    <!-- Orden y controles de reordenamiento -->
                    <div class="flex flex-col items-center space-y-1 mt-1">
                      <span class="text-xs text-slate-500 font-mono bg-slate-700 px-2 py-1 rounded">
                        {skill.order}
                      </span>
                      <div class="flex flex-col space-y-1">
                        <button 
                          on:click={() => moveSkillUp(index)}
                          disabled={index === 0}
                          class="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Subir en el orden"
                        >
                          <ChevronUp class="w-3 h-3" />
                        </button>
                        <button 
                          on:click={() => moveSkillDown(index)}
                          disabled={index === assignedSkills.length - 1}
                          class="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Bajar en el orden"
                        >
                          <ChevronDown class="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <!-- Información de la skill -->
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        {#if categoryIcons[skill.category]}
                          <div class={`p-1 rounded ${categoryColors[skill.category] || 'bg-slate-500/20'}`}>
                            <svelte:component this={categoryIcons[skill.category]} class="w-4 h-4" />
                          </div>
                        {/if}
                        <h3 class="font-semibold text-white">{skill.name}</h3>
                      </div>
                      
                      <p class="text-slate-300 text-sm mb-3 leading-relaxed">{skill.description}</p>
                      
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <span class="text-xs text-slate-500">{skill.category}</span>
                          <span class={`px-2 py-1 rounded-full text-xs font-medium border ${(difficultyColors as any)[skill.difficulty]}`}>
                            {(difficultyLabels as any)[skill.difficulty]}
                          </span>
                        </div>
                        <span class="text-xs text-slate-500">
                          Añadida: {skill.assigned_at ? new Date(skill.assigned_at).toLocaleDateString('es-ES') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Botón para quitar -->
                  <button 
                    on:click={() => handleUnassignSkill(skill.id)}
                    class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400 ml-3"
                    title="Quitar del temario"
                  >
                    <Minus class="w-4 h-4" />
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Skills Disponibles -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white flex items-center">
            <Plus class="w-5 h-5 mr-2" />
            Skills Disponibles ({(stats as any).available})
          </h2>
        </div>

        <!-- Búsqueda -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar skills disponibles..."
            bind:value={searchQuery}
            class="input pl-10 w-full"
          />
        </div>

        {#if Object.keys(filteredAvailableSkills).length === 0}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <Target class="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-slate-400 mb-2">
              {searchQuery ? 'No se encontraron skills' : 'No hay skills disponibles'}
            </h3>
            <p class="text-slate-500">
              {searchQuery ? 'Prueba con otros términos de búsqueda' : 'Todas las skills apropiadas para este nivel ya están asignadas'}
            </p>
          </div>
        {:else}
          <div class="space-y-4">
            {#each Object.entries(filteredAvailableSkills || {}) as [category, skills]}
              <div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <!-- Header de categoría -->
                <button
                  on:click={() => toggleCategory(category)}
                  class="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    {#if categoryIcons[category]}
                      <div class={`p-2 rounded-lg ${categoryColors[category] || 'bg-slate-500/20'}`}>
                        <svelte:component this={categoryIcons[category]} class="w-5 h-5" />
                      </div>
                    {/if}
                    <div class="text-left">
                      <h3 class="font-semibold text-white">{category}</h3>
                      <p class="text-sm text-slate-400">{skills.length} skills disponibles</p>
                    </div>
                  </div>
                  
                  {#if expandedCategories[category]}
                    <ChevronUp class="w-5 h-5 text-slate-400" />
                  {:else}
                    <ChevronDown class="w-5 h-5 text-slate-400" />
                  {/if}
                </button>

                <!-- Skills de la categoría -->
                {#if expandedCategories[category]}
                  <div class="border-t border-slate-700">
                    {#each skills as skill}
                      <div class="p-4 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 transition-colors">
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <h4 class="font-semibold text-white mb-2">{skill.name}</h4>
                            <p class="text-slate-300 text-sm mb-3 leading-relaxed">{skill.description}</p>
                            <div class="flex items-center space-x-3">
                              {#each getDifficultyStars(skill.skill?.difficulty || (skill as any).difficulty || 0) as filled}
                                <Star class={`w-4 h-4 ${filled ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                              {/each}
                            </div>
                          </div>
                          
                          <button 
                            on:click={() => handleAssignSkill(skill.id)}
                            disabled={isAssigning}
                            class="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-slate-400 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ml-3"
                            title="Añadir al temario"
                          >
                            {#if isAssigning}
                              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                            {:else}
                              <Plus class="w-4 h-4" />
                            {/if}
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>

<style>
  .input {
    background-color: rgb(51 65 85); /* slate-700 */
    border: 1px solid rgb(71 85 105); /* slate-600 */
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    color: white;
    outline: none;
  }
  .input::placeholder {
    color: rgb(148 163 184); /* slate-400 */
  }
  .input:focus {
    border-color: #10b981; /* primary-500 */
    box-shadow: 0 0 0 1px #10b981;
  }
</style>
