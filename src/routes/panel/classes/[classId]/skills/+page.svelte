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
    CheckCircle,
    ArrowsDownUp,
    FolderSimple
  } from 'phosphor-svelte';
  import { showToast, showError } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { t } from '$lib/i18n';
  import type { PageData } from './$types';
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

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
    
    // Expand categories by default
    Object.keys(availableSkillsByCategory).forEach(category => {
      if (expandedCategories[category] === undefined) {
        expandedCategories[category] = true;
      }
    });
  });
  
  let searchQuery = $state('');
  let isAssigning = $state(false);
  let expandedCategories = $state<Record<string, boolean>>({});

  // Search filter
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
    beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    advanced: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

  const difficultyLabels: Record<string, string> = {
    beginner: $t('common.levels.beginner'),
    intermediate: $t('common.levels.intermediate'),
    advanced: $t('common.levels.advanced')
  };

  const categoryIcons: Record<string, any> = {
    'Fundamentals': BookOpen,
    'Tactics': Lightning,
    'Endgames': Star,
    'Openings': Trophy,
    'Strategy': Target
  };

  const categoryColors: Record<string, string> = {
    'Fundamentals': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Tactics': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    'Endgames': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'Openings': 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    'Strategy': 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

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
        
        showToast.success($t('common.success.action'));
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
      title: $t('skills.delete_title'),
      message: `${$t('skills.delete_skill_confirm')} "${skill?.name}"?`,
      confirmText: $t('common.remove'),
      cancelText: $t('common.cancel')
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
        
        showToast.success($t('common.success.action'));
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

<div class="space-y-12 pb-24 max-w-[1600px] mx-auto px-4 md:px-0">
  <!-- Elevated Header -->
  <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
    <div class="space-y-6">
      <button 
        onclick={handleGoBack}
        class="flex items-center gap-2.5 text-zinc-500 hover:text-white transition-all group px-4 py-2 bg-zinc-900/40 border border-white/5 rounded-none w-fit"
      >
        <CaretLeft weight="bold" class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span class="text-[10px] font-black uppercase tracking-[0.2em]">{ $t('common.back') }</span>
      </button>

      <div class="flex items-center gap-8">
        <div class="relative group">
          <div class="absolute -inset-2 bg-primary-500/20 blur-2xl rounded-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 rounded-none flex items-center justify-center text-primary-400 shadow-2xl relative">
            <Target weight="duotone" class="w-10 h-10" />
            <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-zinc-900 border border-white/10 rounded-none flex items-center justify-center text-[10px] font-black text-white shadow-lg">
              {stats.assigned}
            </div>
          </div>
        </div>
        <div>
          <h1 class="text-6xl font-black text-white tracking-tight uppercase leading-[0.9] flex flex-col">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600 italic font-serif normal-case text-3xl mb-1 tracking-normal font-medium">{$t('common.classes')}</span>
            {$t('classes.syllabus')}
          </h1>
          <div class="flex items-center gap-3 mt-4">
            <span class="h-px w-8 bg-primary-500/50"></span>
            <p class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              {classData?.name} <span class="w-1 h-1 bg-zinc-700 rounded-none"></span> { $t('skills.ui.global_topics') }
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Strategic Metrics Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    <!-- Assigned Pulse -->
    <div class="bento-card group perspective transition-all duration-500">
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] rounded-none -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-all duration-700"></div>
      <div class="relative z-10 flex flex-col h-full justify-between gap-6">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-none flex items-center justify-center text-primary-400 shadow-lg shadow-primary-500/5 group-hover:scale-110 transition-transform duration-500">
            <CheckCircle weight="duotone" class="w-6 h-6" />
          </div>
          <div class="text-right">
            <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{$t('classes.target_active')}</span>
            <span class="text-2xl font-black text-white tracking-widest">#{stats.assigned}</span>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-1.5 w-full bg-zinc-950/50 rounded-none overflow-hidden border border-white/5">
            <div 
              class="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
              style="width: {(stats.assigned / (stats.assigned + stats.available)) * 100}%"
            ></div>
          </div>
          <p class="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{$t('classes.lessons_assigned', { count: stats.assigned })}</p>
        </div>
      </div>
    </div>

    <!-- Available Bank -->
    <div class="bento-card group">
      <div class="relative z-10 flex flex-col h-full justify-between gap-6">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-none flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
            <FolderSimple weight="duotone" class="w-6 h-6" />
          </div>
          <div class="text-right">
            <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{$t('classes.bank_depth')}</span>
            <span class="text-2xl font-black text-white tracking-widest">{stats.available}</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex -space-x-2">
            {#each Array(3) as _, i}
              <div class="w-6 h-6 bg-zinc-800 border-2 border-zinc-900 rounded-none flex items-center justify-center">
                 <Star weight="fill" class="w-2.5 h-2.5 text-zinc-600" />
              </div>
            {/each}
          </div>
          <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest">{$t('classes.resources_available')}</span>
        </div>
      </div>
    </div>

    <!-- Category Distribution -->
    <div class="bento-card group col-span-1 md:col-span-2 overflow-hidden">
      <div class="absolute -right-8 -bottom-8 w-48 h-48 bg-zinc-800/10 rounded-none blur-3xl group-hover:bg-primary-500/5 transition-all duration-1000"></div>
      <div class="relative z-10 flex flex-col h-full gap-4">
        <div class="flex items-center gap-4 border-b border-white/5 pb-4">
          <div class="w-10 h-10 bg-zinc-950/50 border border-white/10 rounded-none flex items-center justify-center text-zinc-400 group-hover:text-primary-400 transition-colors">
            <ArrowsDownUp weight="duotone" class="w-5 h-5" />
          </div>
          <h4 class="text-[10px] font-black text-white uppercase tracking-[0.2em]">{ $t('skills.ui.group_by_category') }</h4>
        </div>
        
        <div class="flex flex-wrap gap-4 mt-2">
          {#each Object.entries(stats.byCategory) as [category, count]}
            <div class="flex items-center gap-3 bg-zinc-950/50 border border-white/5 px-4 py-2.5 rounded-none hover:border-white/10 transition-all cursor-default">
              <span class="text-lg font-black text-white leading-none">{count}</span>
              <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{category}</span>
            </div>
          {/each}
          {#if Object.keys(stats.byCategory).length === 0}
            <div class="flex items-center gap-2 text-zinc-700">
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">{$t('classes.no_categories')}</span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Matrix Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
    <!-- Left Column: Active Syllabus -->
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-px bg-primary-500/30"></div>
          <h2 class="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            {$t('classes.current_syllabus_title')}
            <span class="text-xs font-medium bg-white/5 border border-white/10 text-zinc-400 px-3 py-1 rounded-none tracking-widest">{assignedSkills.length}</span>
          </h2>
        </div>
      </div>

      {#if assignedSkills.length === 0}
        <div class="bento-card border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center py-24 text-center group">
          <div class="w-20 h-20 bg-zinc-900 border border-white/5 rounded-none flex items-center justify-center text-zinc-800 mb-6 group-hover:text-primary-500/50 transition-colors duration-500">
            <Target weight="duotone" class="w-10 h-10" />
          </div>
          <h3 class="text-white font-black uppercase tracking-[0.2em] text-sm">{$t('classes.empty_syllabus')}</h3>
          <p class="text-zinc-600 text-[10px] font-medium uppercase mt-2 tracking-[0.2em] max-w-xs">{ $t('skills.skills_empty_desc') }</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each assignedSkills as skill, index (skill.id)}
            <div 
              class="bento-card p-0 overflow-hidden group hover:scale-[1.01] transition-transform duration-500"
              in:fly={{ y: 20, delay: index * 50, duration: 800, easing: quintOut }}
            >
              <div class="flex">
                <!-- Order Side Pane -->
                <div class="w-14 bg-zinc-950/50 border-r border-white/5 flex flex-col items-center py-6 gap-4">
                  <span class="text-[10px] font-black text-primary-500/50 tracking-tighter group-hover:text-primary-400 transition-colors uppercase">
                    P{index + 1}
                  </span>
                  <div class="flex flex-col gap-2">
                    <button 
                      onclick={() => moveSkillUp(index)}
                      disabled={index === 0}
                      class="p-2 bg-white/5 border border-white/5 rounded-none text-zinc-600 hover:text-white disabled:opacity-5 transition-all active:scale-90"
                    >
                      <CaretUp weight="bold" class="w-3 h-3" />
                    </button>
                    <button 
                      onclick={() => moveSkillDown(index)}
                      disabled={index === assignedSkills.length - 1}
                      class="p-2 bg-white/5 border border-white/5 rounded-none text-zinc-600 hover:text-white disabled:opacity-5 transition-all active:scale-90"
                    >
                      <CaretDown weight="bold" class="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="flex-1 p-6 flex flex-col justify-between">
                  <div class="flex items-start justify-between gap-6">
                    <div class="flex items-center gap-4">
                      {#if categoryIcons[skill.category]}
                        {@const Icon = categoryIcons[skill.category]}
                        <div class={`w-12 h-12 rounded-none border flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-500 ${categoryColors[skill.category] || 'bg-zinc-800/40 border-white/10'}`}>
                          <Icon weight="duotone" class="w-6 h-6" />
                        </div>
                      {/if}
                      <div>
                        <h3 class="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors">{skill.name}</h3>
                        <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">{skill.category}</p>
                      </div>
                    </div>
                    
                    <button 
                      onclick={() => handleUnassignSkill(skill.id)}
                      class="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-none flex items-center justify-center text-rose-500/50 hover:text-rose-400 hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    >
                      <Trash weight="duotone" class="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <p class="text-zinc-500 text-[11px] leading-relaxed font-medium my-6 border-l-2 border-white/5 pl-4 line-clamp-2 italic">
                    {skill.description}
                  </p>

                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div class="flex items-center gap-2">
                       <div class={`px-3 py-1 rounded-none text-[8px] font-black uppercase tracking-[0.2em] border ${difficultyColors[skill.difficulty] || 'bg-white/5 border-white/10 text-zinc-400'}`}>
                        {difficultyLabels[skill.difficulty]}
                      </div>
                    </div>
                    <span class="text-[8px] font-black text-zinc-700 uppercase tracking-widest flex items-center gap-2">
                      <Clock weight="bold" class="w-3 h-3" />
                      {skill.assigned_at ? new Date(skill.assigned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Right Column: Skills Bank -->
    <div class="space-y-8">
      <div class="flex flex-col gap-8">
        <div class="flex items-center gap-4">
          <div class="w-10 h-px bg-blue-500/30"></div>
          <h2 class="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            {$t('classes.hiring_bank')}
            <span class="text-xs font-medium bg-white/5 border border-white/10 text-zinc-400 px-3 py-1 rounded-none tracking-widest">{stats.available}</span>
          </h2>
        </div>

        <!-- Premium High-Density Search -->
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-none blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <MagnifyingGlass weight="bold" class="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-all duration-300" />
          <input
            type="text"
            placeholder={ $t('skills.ui.search_placeholder') }
            bind:value={searchQuery}
            class="w-full bg-zinc-900/40 border border-white/5 rounded-none py-5 pl-16 pr-6 text-white font-black uppercase tracking-[0.15em] text-[11px] focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-700 backdrop-blur-xl"
          />
        </div>
      </div>

      {#if Object.keys(filteredAvailableSkills).length === 0}
        <div class="bento-card border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center py-24 text-center mt-4">
           <div class="w-20 h-20 bg-zinc-900 border border-white/5 rounded-none flex items-center justify-center text-zinc-800 mb-6">
             <MagnifyingGlass weight="duotone" class="w-10 h-10" />
           </div>
           <h3 class="text-white font-black uppercase tracking-widest text-sm">{$t('classes.target_not_found')}</h3>
           <p class="text-zinc-600 text-[10px] font-medium uppercase mt-2 tracking-widest">{$t('classes.adjust_search')}</p>
        </div>
      {:else}
        <div class="space-y-6">
          {#each Object.entries(filteredAvailableSkills) as [category, skills], catIndex}
            <div 
              class="rounded-none overflow-hidden border border-white/5 bg-zinc-900/20 backdrop-blur-3xl"
              in:fly={{ y: 20, delay: 100 + (catIndex * 100) }}
            >
              <!-- Category Trigger -->
              <button
                onclick={() => toggleCategory(category)}
                class="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all text-left group/trigger"
              >
                <div class="flex items-center gap-6">
                  {#if categoryIcons[category]}
                    {@const Icon = categoryIcons[category]}
                    <div class={`w-14 h-14 rounded-none border flex items-center justify-center transition-all duration-500 group-hover/trigger:scale-110 ${categoryColors[category] || 'bg-zinc-800/40 border-white/10'}`}>
                      <Icon weight="duotone" class="w-7 h-7" />
                    </div>
                  {/if}
                  <div>
                    <h3 class="text-xl font-black text-white uppercase tracking-tight group-hover/trigger:text-primary-400 transition-colors">{category}</h3>
                    <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-1">{$t('classes.skills_indexed', { count: skills.length })}</p>
                  </div>
                </div>
                
                <div class={`w-12 h-12 bg-zinc-950/50 border border-white/5 rounded-none flex items-center justify-center text-zinc-600 group-hover/trigger:text-white transition-all transform ${expandedCategories[category] ? 'rotate-180' : ''}`}>
                  <CaretDown weight="bold" class="w-5 h-5" />
                </div>
              </button>

              {#if expandedCategories[category]}
                <div class="divide-y divide-white/5 border-t border-white/5 overflow-hidden" transition:slide={{ duration: 500, easing: quintOut }}>
                  {#each skills as skill (skill.id)}
                    <div class="p-8 hover:bg-white/[0.03] transition-all group/item relative overflow-hidden">
                      <div class="relative z-10 flex items-start justify-between gap-8">
                        <div class="flex-1">
                          <h4 class="text-sm font-black text-white uppercase tracking-wider group-hover/item:text-primary-400 transition-colors">{skill.name}</h4>
                          <p class="text-zinc-500 text-[11px] leading-relaxed font-medium my-4 line-clamp-2">{skill.description}</p>
                          
                          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950/50 w-fit rounded-none border border-white/5">
                            {#each getDifficultyStars(skill.skill?.difficulty || (skill as any).difficulty || 0) as filled}
                              <Star weight={filled ? "fill" : "regular"} class={`w-3.5 h-3.5 ${filled ? 'text-amber-400' : 'text-zinc-800'}`} />
                            {/each}
                          </div>
                        </div>
                        
                        <button 
                          onclick={() => handleAssignSkill(skill.id)}
                          disabled={isAssigning}
                          class="bg-white text-black w-14 h-14 rounded-none flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all shadow-2xl disabled:opacity-50 group/btn active:scale-90"
                        >
                          {#if isAssigning}
                            <div class="animate-spin rounded-none h-5 w-5 border-2 border-current border-t-transparent"></div>
                          {:else}
                            <Plus weight="bold" class="w-6 h-6" />
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
  .bento-card {
    @apply bg-zinc-900/40 backdrop-blur-3xl border border-white/5 p-8 rounded-none shadow-2xl relative overflow-hidden;
  }

  .perspective {
    perspective: 1000px;
  }

  :global(.animate-fade-in) {
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  :global(.skill-card .check-icon) {
    color: #4ade80;
  }

  :global(.skill-card .timer-icon) {
    color: #a1a1aa;
  }

  :global(.skill-card .category-icon) {
    color: #f59e0b;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
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

