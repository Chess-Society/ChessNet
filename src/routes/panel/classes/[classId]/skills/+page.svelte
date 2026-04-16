<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Target, 
    CaretLeft,
    Plus,
    Minus,
    MagnifyingGlass,
    DotsSixVertical,
    BookOpen,
    Lightning,
    Star,
    Trophy,
    Clock,
    MapPin,
    GraduationCap,
    CaretDown,
    CaretUp,
    Trash,
    Info,
    CheckCircle
  } from 'phosphor-svelte';
  import { showToast, showError } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { t } from '$lib/i18n';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();
  
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

  let classData = $derived(data.class as unknown as LocalClass);
  let assignedSkills = $state<ExtendedSkill[]>([]);
  let availableSkillsByCategory = $state<Record<string, ExtendedSkill[]>>({});
  let stats = $state({ assigned: 0, available: 0, byCategory: {} as Record<string, number> });

  $effect(() => {
    assignedSkills = (data.assignedSkills as unknown as ExtendedSkill[]) || [];
    availableSkillsByCategory = (data.availableSkillsByCategory as unknown as Record<string, ExtendedSkill[]>) || {};
    stats = data.stats || { assigned: 0, available: 0, byCategory: {} as Record<string, number> };
    
    // Expandir todas las categorías por defecto al cargar datos
    Object.keys(availableSkillsByCategory).forEach(category => {
      if (expandedCategories[category] === undefined) {
        expandedCategories[category] = true;
      }
    });
  });
  
  let searchQuery = $state('');
  let isAssigning = $state(false);
  let expandedCategories = $state<Record<string, boolean>>({});

  // Filtrar skills disponibles por búsqueda
  let filteredAvailableSkills = $derived(
    Object.entries(availableSkillsByCategory || {}).reduce((acc, [category, skills]) => {
      const filtered = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    }, {} as Record<string, ExtendedSkill[]>)
  );

  const difficultyColors: Record<string, string> = {
    beginner: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    advanced: 'text-red-400 bg-red-500/10 border-red-500/20'
  };

  const difficultyLabels: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  };

  const categoryIcons: Record<string, any> = {
    'Fundamentals': BookOpen,
    'Tactics': Lightning,
    'Endgames': Star,
    'Openings': Trophy
  };

  const categoryColors: Record<string, string> = {
    'Fundamentals': 'text-blue-400 bg-blue-500/10',
    'Tactics': 'text-yellow-400 bg-yellow-500/10',
    'Endgames': 'text-purple-400 bg-purple-500/10',
    'Openings': 'text-primary-400 bg-primary-500/10'
  };

  onMount(() => {
    // Expandir todas las categorías por defecto
    Object.keys(availableSkillsByCategory).forEach(category => {
      expandedCategories[category] = true;
    });
  });

  const handleGoBack = () => {
    goto(`/panel/classes/${classData?.id}`);
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
          const newAssignedSkill = {
            ...skillToMove,
            assigned_at: new Date().toISOString(),
            order: assignedSkills.length + 1,
            assignment_id: `csk-${Date.now()}`
          };
          
          assignedSkills = [...assignedSkills, newAssignedSkill];
          
          availableSkillsByCategory[categoryToUpdate] = availableSkillsByCategory[categoryToUpdate]
            .filter(s => s.id !== skillId);
          
          if (availableSkillsByCategory[categoryToUpdate].length === 0) {
            delete availableSkillsByCategory[categoryToUpdate];
          }
          
          stats.assigned += 1;
          stats.available -= 1;
          if (!stats.byCategory[skillToMove.category]) {
            stats.byCategory[skillToMove.category] = 0;
          }
          stats.byCategory[skillToMove.category]++;
        }
        
        showToast.success(`Skill "${skillToMove?.name}" assigned correctly`);
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Error assigning skill');
      }
    } catch (error: any) {
      showToast.error('Error assigning skill');
    } finally {
      isAssigning = false;
    }
  };

  const handleUnassignSkill = async (skillId: string) => {
    const skill = assignedSkills.find(s => s.id === skillId);
    const confirmed = await uiStore.confirm({
      title: 'Remove Skill',
      message: `Are you sure you want to remove "${skill?.name}" from the syllabus?`,
      confirmText: 'Remove',
      cancelText: 'Cancel'
    });
    
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/class-skills?class_id=${classData?.id}&skill_id=${skillId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (skill) {
          const { assigned_at, order, assignment_id, ...skillData } = skill;
          
          if (!availableSkillsByCategory[skill.category]) {
            availableSkillsByCategory[skill.category] = [];
          }
          availableSkillsByCategory[skill.category].push(skillData);
          
          assignedSkills = assignedSkills.filter(s => s.id !== skillId);
          
          stats.assigned -= 1;
          stats.available += 1;
          stats.byCategory[skill.category]--;
          if (stats.byCategory[skill.category] === 0) {
            delete stats.byCategory[skill.category];
          }
        }
        
        showToast.success(`Skill "${skill?.name}" removed from syllabus`);
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Error removing skill');
      }
    } catch (error: any) {
      showToast.error('Error removing skill');
    }
  };

  const toggleCategory = (category: string) => {
    expandedCategories[category] = !expandedCategories[category];
  };

  const moveSkillUp = (index: number) => {
    if (index > 0) {
      const newAssignedSkills = [...assignedSkills];
      [newAssignedSkills[index - 1], newAssignedSkills[index]] = 
      [newAssignedSkills[index], newAssignedSkills[index - 1]];
      
      newAssignedSkills.forEach((skill, i) => {
        skill.order = i + 1;
      });
      
      assignedSkills = newAssignedSkills;
    }
  };

  const moveSkillDown = (index: number) => {
    if (index < assignedSkills.length - 1) {
      const newAssignedSkills = [...assignedSkills];
      [newAssignedSkills[index], newAssignedSkills[index + 1]] = 
      [newAssignedSkills[index + 1], newAssignedSkills[index]];
      
      newAssignedSkills.forEach((skill, i) => {
        skill.order = i + 1;
      });
      
      assignedSkills = newAssignedSkills;
    }
  };
</script>

<svelte:head>
  <title>Syllabus - {classData?.name || 'Class'} - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-6">
      <button 
        onclick={handleGoBack}
        class="flex items-center gap-2 text-zinc-500 hover:text-white transition-all group text-[10px] font-black uppercase tracking-[0.2em]"
      >
        <CaretLeft weight="bold" class="w-3 h-3 transition-transform group-hover:-translate-x-1" />
        Back to Class
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <Target weight="duotone" class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase leading-none">Syllabus</h1>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <span class="text-primary-500">●</span> {classData?.name} <span class="text-zinc-800">|</span> Skills and Objectives
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Info Dashboard -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[24px] shadow-xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[40px] -mr-16 -mt-16"></div>
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-12 h-12 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-primary-400">
          <CheckCircle weight="duotone" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1.5">Assigned</p>
          <p class="text-2xl font-black text-white leading-none tracking-tighter">{stats.assigned}</p>
        </div>
      </div>
    </div>

    <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[24px] shadow-xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[40px] -mr-16 -mt-16"></div>
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-12 h-12 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-primary-400">
          <Plus weight="duotone" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1.5">Available</p>
          <p class="text-2xl font-black text-white leading-none tracking-tighter">{stats.available}</p>
        </div>
      </div>
    </div>

    <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[24px] shadow-xl relative overflow-hidden group col-span-1 md:col-span-2">
      <div class="absolute top-0 right-0 w-64 h-32 bg-blue-500/5 blur-[60px] -mr-32 -mt-16"></div>
      <div class="flex items-center gap-8 relative z-10 h-full">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-blue-400">
            <Lightning weight="duotone" class="w-6 h-6" />
          </div>
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">By Category</p>
        </div>
        <div class="flex items-center gap-6 overflow-x-auto pb-1 no-scrollbar">
          {#each Object.entries(stats.byCategory) as [category, count]}
            <div class="flex items-center gap-2">
              <span class="text-lg font-black text-white leading-none">{count}</span>
              <span class="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{category}</span>
            </div>
          {/each}
          {#if Object.keys(stats.byCategory).length === 0}
            <span class="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">No categories assigned</span>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <!-- Current Syllabus (Assigned Skills) -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
          <Target weight="duotone" class="w-7 h-7 text-primary-500" />
          Current Syllabus
          <span class="text-xs bg-zinc-900 border border-zinc-800 text-zinc-500 px-3 py-1 rounded-full">{assignedSkills.length}</span>
        </h2>
      </div>

      {#if assignedSkills.length === 0}
        <div class="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-24 text-center space-y-6">
           <div class="w-24 h-24 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mx-auto text-zinc-800">
             <Target weight="duotone" class="w-12 h-12" />
           </div>
           <div>
             <h3 class="text-white font-black uppercase tracking-widest text-sm">Empty Syllabus</h3>
             <p class="text-zinc-500 text-[10px] font-medium uppercase mt-2 tracking-widest">Add skills from the bank on the right</p>
           </div>
        </div>
      {:else}
        <div class="space-y-4">
          {#each assignedSkills as skill, index (skill.id)}
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 hover:border-zinc-700 transition-all shadow-xl group relative overflow-hidden" in:fly={{ y: 20, delay: index * 50 }}>
              <div class="flex items-start gap-6 relative z-10">
                <!-- Reorder Controls -->
                <div class="flex flex-col items-center gap-2 pt-1">
                  <span class="w-8 h-8 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-400">
                    {skill.order}
                  </span>
                  <div class="flex flex-col gap-1">
                    <button 
                      onclick={() => moveSkillUp(index)}
                      disabled={index === 0}
                      class="p-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-600 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <CaretUp weight="bold" class="w-3 h-3" />
                    </button>
                    <button 
                      onclick={() => moveSkillDown(index)}
                      disabled={index === assignedSkills.length - 1}
                      class="p-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-600 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <CaretDown weight="bold" class="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      {#if categoryIcons[skill.category]}
                        {@const Icon = categoryIcons[skill.category]}
                        <div class={`p-2 rounded-xl border ${categoryColors[skill.category] || 'bg-zinc-500/10 border-zinc-500/20'}`}>
                          <Icon weight="duotone" class="w-5 h-5" />
                        </div>
                      {/if}
                      <h3 class="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors leading-none">{skill.name}</h3>
                    </div>
                    <button 
                      onclick={() => handleUnassignSkill(skill.id)}
                      class="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-600 hover:text-red-400 hover:border-red-500/30 transition-all"
                      title="Remove from syllabus"
                    >
                      <Trash weight="duotone" class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p class="text-zinc-500 text-xs leading-relaxed font-medium mb-5">{skill.description}</p>
                  
                  <div class="flex items-center justify-between border-t border-zinc-800/50 pt-4">
                    <div class="flex items-center gap-4">
                      <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{skill.category}</span>
                      <span class={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${difficultyColors[skill.difficulty] || 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'}`}>
                        {difficultyLabels[skill.difficulty]}
                      </span>
                    </div>
                    <span class="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
                      {skill.assigned_at ? new Date(skill.assigned_at).toLocaleDateString('en-US') : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Available Skills -->
    <div class="space-y-6">
      <div class="flex flex-col gap-6">
        <h2 class="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
          <BookOpen weight="duotone" class="w-7 h-7 text-primary-500" />
          Skills Bank
          <span class="text-xs bg-zinc-900 border border-zinc-800 text-zinc-500 px-3 py-1 rounded-full">{stats.available}</span>
        </h2>

        <!-- Premium Search -->
        <div class="relative group">
          <MagnifyingGlass weight="bold" class="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="SEARCH SKILLS..."
            bind:value={searchQuery}
            class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-white font-black uppercase tracking-widest text-[10px] focus:outline-none focus:border-primary-500 transition-all placeholder:text-zinc-700 shadow-xl"
          />
        </div>
      </div>

      {#if Object.keys(filteredAvailableSkills).length === 0}
        <div class="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-24 text-center space-y-6 mt-4">
           <div class="w-24 h-24 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mx-auto text-zinc-800">
             <MagnifyingGlass weight="duotone" class="w-12 h-12" />
           </div>
           <div>
             <h3 class="text-white font-black uppercase tracking-widest text-sm">No Results</h3>
             <p class="text-zinc-500 text-[10px] font-medium uppercase mt-2 tracking-widest">No matching skills found</p>
           </div>
        </div>
      {:else}
        <div class="space-y-6">
          {#each Object.entries(filteredAvailableSkills) as [category, skills]}
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-[28px] overflow-hidden shadow-xl">
              <!-- Categoría Header -->
              <button
                onclick={() => toggleCategory(category)}
                class="w-full p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors border-b border-transparent group/header"
                class:border-zinc-800={expandedCategories[category]}
              >
                <div class="flex items-center gap-4">
                  {#if categoryIcons[category]}
                    {@const Icon = categoryIcons[category]}
                    <div class={`p-3 rounded-2xl border ${categoryColors[category] || 'bg-zinc-500/10 border-zinc-500/20'}`}>
                      <Icon weight="duotone" class="w-6 h-6" />
                    </div>
                  {/if}
                  <div class="text-left">
                    <h3 class="text-base font-black text-white uppercase tracking-tight group-hover/header:text-primary-400 transition-colors">{category}</h3>
                    <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{skills.length} available</p>
                  </div>
                </div>
                
                <div class="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 group-hover/header:text-white transition-all">
                  {#if expandedCategories[category]}
                    <CaretUp weight="bold" class="w-4 h-4" />
                  {:else}
                    <CaretDown weight="bold" class="w-4 h-4" />
                  {/if}
                </div>
              </button>

              {#if expandedCategories[category]}
                <div class="divide-y divide-zinc-800/50">
                  {#each skills as skill (skill.id)}
                    <div class="p-6 hover:bg-zinc-800/30 transition-colors group/item">
                      <div class="flex items-start justify-between gap-6">
                        <div class="flex-1">
                          <h4 class="text-sm font-black text-white uppercase tracking-tight mb-2 group-hover/item:text-primary-400 transition-colors">{skill.name}</h4>
                          <p class="text-zinc-500 text-[11px] leading-relaxed font-medium mb-4">{skill.description}</p>
                          <div class="flex items-center gap-1.5 px-2 py-1 bg-zinc-950/50 w-fit rounded-lg border border-zinc-800">
                            {#each getDifficultyStars(skill.skill?.difficulty || (skill as any).difficulty || 0) as filled}
                              <Star weight={filled ? "fill" : "regular"} class={`w-3.5 h-3.5 ${filled ? 'text-yellow-400' : 'text-zinc-800'}`} />
                            {/each}
                          </div>
                        </div>
                        
                        <button 
                          onclick={() => handleAssignSkill(skill.id)}
                          disabled={isAssigning}
                          class="bg-white text-black p-3.5 rounded-2xl hover:bg-primary-500 hover:text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn active:scale-95"
                          title="Add to syllabus"
                        >
                          {#if isAssigning}
                            <div class="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                          {:else}
                            <Plus weight="bold" class="w-5 h-5" />
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
</div>

<style lang="postcss">
  :global(.animate-fade-in) {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
