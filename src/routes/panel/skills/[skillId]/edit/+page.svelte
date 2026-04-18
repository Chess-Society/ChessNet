<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from '$lib/stores/toast';
  import { appStore } from '$lib/stores/appStore';
  import { uiStore } from '$lib/stores/uiStore';
  import { 
    ArrowLeft, 
    Target, 
    X, 
    Check, 
    Trash,
    Plus,
    Tag,
    TrendUp,
    Timer,
    Note,
    Link,
    SortAscending,
    Info,
    FloppyDisk,
    Books,
    Sparkle,
    CaretRight,
    Star,
    Clock,
    Smiley,
    Monitor,
    DeviceMobile,
    Layout,
    ArrowCounterClockwise,
    CheckCircle,
    WarningCircle,
    PencilSimple,
    Certificate,
    Lightbulb
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, slide } from 'svelte/transition';
  import { t } from '$lib/i18n';

  let { data } = $props<{ data: PageData }>();
  
  const skillData = $derived(data.skill);
  const categories = $derived(data.categories || []);
  const availablePrerequisites = $derived(data.availablePrerequisites || []);
  const filteredPrerequisites = $derived(availablePrerequisites.filter((s: any) => s.id !== skillData?.id));

  // Form data state - Snapshot the initial data for the form without tracking 'data'
  const initial = untrack(() => $state.snapshot(data.skill));
  
  let formData = $state({
    name: initial?.name || '',
    description: initial?.description || '',
    category_id: initial?.category_id || '',
    difficulty: initial?.difficulty || 1,
    estimated_hours: initial?.estimated_hours || 1,
    prerequisites: (initial?.prerequisites || []) as string[],
    learning_objectives: (initial?.learning_objectives && initial.learning_objectives.length > 0 ? initial.learning_objectives : ['']) as string[],
    assessment_criteria: (initial?.assessment_criteria && initial.assessment_criteria.length > 0 ? initial.assessment_criteria : ['']) as string[],
    resources: (initial?.resources && initial.resources.length > 0 ? initial.resources : ['']) as string[],
    icon: initial?.icon || '🎯',
    resource_link: initial?.resource_link || '',
    order_index: initial?.order_index || 0,
    active: initial?.active ?? true
  });

  // UI state
  let isSubmitting = $state(false);
  let errors: Record<string, string> = $state({});
  let showConfirmDiscard = $state(false);

  const difficultyLevels = [
    { value: 1, label: 'Entry', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { value: 2, label: 'Novice', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { value: 3, label: 'Intermediate', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { value: 4, label: 'Advanced', color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { value: 5, label: 'Master', color: 'text-rose-400', bg: 'bg-rose-400/10' }
  ];

  const handleGoBack = () => {
    goto('/panel/skills');
  };

  const validateForm = () => {
    errors = {};
    if (!formData.name.trim()) errors.name = $t('common.required');
    if (!formData.category_id) errors.category_id = $t('common.required');
    return Object.keys(errors).length === 0;
  };

  const addItem = (key: 'learning_objectives' | 'assessment_criteria' | 'resources') => {
    formData[key] = [...formData[key], ''];
  };

  const removeItem = (key: 'learning_objectives' | 'assessment_criteria' | 'resources', index: number) => {
    formData[key] = formData[key].filter((_, i) => i !== index);
    if (formData[key].length === 0) formData[key] = [''];
  };

  const togglePrerequisite = (id: string) => {
    if (formData.prerequisites.includes(id)) {
      formData.prerequisites = formData.prerequisites.filter(p => p !== id);
    } else {
      formData.prerequisites = [...formData.prerequisites, id];
    }
  };

  const resetForm = () => {
    formData = {
      name: initial?.name || '',
      description: initial?.description || '',
      category_id: initial?.category_id || '',
      difficulty: initial?.difficulty || 1,
      estimated_hours: initial?.estimated_hours || 1,
      prerequisites: [...(initial?.prerequisites || [])],
      learning_objectives: initial?.learning_objectives && initial.learning_objectives.length > 0 ? [...initial.learning_objectives] : [''],
      assessment_criteria: initial?.assessment_criteria && initial.assessment_criteria.length > 0 ? [...initial.assessment_criteria] : [''],
      resources: initial?.resources && initial.resources.length > 0 ? [...initial.resources] : [''],
      icon: initial?.icon || '🎯',
      resource_link: initial?.resource_link || '',
      order_index: initial?.order_index || 0,
      active: initial?.active ?? true
    };
    errors = {};
    showConfirmDiscard = false;
  };

  const hasChanges = $derived(
    JSON.stringify(formData) !== JSON.stringify({
      name: initial?.name || '',
      description: initial?.description || '',
      category_id: initial?.category_id || '',
      difficulty: initial?.difficulty || 1,
      estimated_hours: initial?.estimated_hours || 1,
      prerequisites: (initial?.prerequisites || []),
      learning_objectives: initial?.learning_objectives && initial.learning_objectives.length > 0 ? initial.learning_objectives : [''],
      assessment_criteria: initial?.assessment_criteria && initial.assessment_criteria.length > 0 ? initial.assessment_criteria : [''],
      resources: initial?.resources && initial.resources.length > 0 ? initial.resources : [''],
      icon: initial?.icon || '🎯',
      resource_link: initial?.resource_link || '',
      order_index: initial?.order_index || 0,
      active: initial?.active ?? true
    })
  );

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    isSubmitting = true;
    uiStore.setLoading(true);
    try {
      const payload = {
        ...formData,
        id: data.skillId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        learning_objectives: formData.learning_objectives.filter(o => o.trim()),
        assessment_criteria: formData.assessment_criteria.filter(c => c.trim()),
        resources: formData.resources.filter(r => r.trim())
      };

      await appStore.updateSkill(payload);
      toast.success($t('common.save_success'));
      goto('/panel/skills');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error updating the skill');
    } finally {
      isSubmitting = false;
      uiStore.setLoading(false);
    }
  };

  const getDifficultyInfo = $derived(
    difficultyLevels.find(l => l.value === formData.difficulty) || difficultyLevels[0]
  );
</script>

<svelte:head>
  <title>{$t('skills.edit.title')} - {formData.name} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white pb-32" in:fade>
  
  <!-- Premium Top Bar -->
  <header class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
    <div class="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          onclick={handleGoBack}
          class="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
        >
          <ArrowLeft weight="bold" class="w-5 h-5" />
        </button>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-black uppercase tracking-widest italic flex items-center gap-2">
              <PencilSimple weight="bold" class="w-4 h-4 text-violet-500" />
              {$t('skills.edit.title')}
            </h1>
            {#if hasChanges}
              <span class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest animate-pulse border border-amber-500/20">{$t('skills.ui.unsaved')}</span>
            {/if}
          </div>
          <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{$t('skills.edit.subtitle', { name: skillData.name })}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        {#if hasChanges}
           <button 
            onclick={() => showConfirmDiscard = true}
            class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all flex items-center gap-2"
          >
            <ArrowCounterClockwise weight="bold" class="w-4 h-4" />
            {$t('skills.edit.discard_btn')}
          </button>
        {/if}
        
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting || !hasChanges}
          class="px-8 py-2.5 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 transition-all text-xs font-black tracking-widest uppercase flex items-center gap-2 disabled:opacity-50"
        >
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {:else}
            <FloppyDisk weight="bold" class="w-4 h-4" />
          {/if}
          {isSubmitting ? ($t('common.saving') || 'Updating...') : $t('skills.edit.save_btn')}
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-[1200px] mx-auto px-6 pt-12">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Content Area (8 cols) -->
      <div class="lg:col-span-8 space-y-8">
        
        <!-- Main Info Card -->
        <section class="bg-zinc-900/30 border border-zinc-800/50 rounded-[32px] overflow-hidden backdrop-blur-sm shadow-2xl">
          <div class="bg-gradient-to-r from-violet-600/10 to-transparent p-8 border-b border-zinc-800/50 flex items-center justify-between">
            <h2 class="text-xl font-black uppercase tracking-widest italic flex items-center gap-3">
              <span class="w-1.5 h-6 bg-violet-500 rounded-full"></span>
              {$t('skills.ui.core_config')}
            </h2>
            <div class="px-4 py-1.5 rounded-full bg-zinc-950/50 border border-zinc-800 text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono italic">
              ID: {skillData.id}
            </div>
          </div>

          <div class="p-8 space-y-10">
            <!-- Topic Name & Category Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label for="name" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('skills.create.topic_name')}</label>
                <div class="relative group">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors">
                    <Note weight="bold" class="w-5 h-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    bind:value={formData.name}
                    placeholder={$t('skills.create.topic_placeholder')}
                    class="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-zinc-700 font-bold uppercase tracking-tight"
                  />
                </div>
                {#if errors.name}
                  <p class="text-rose-400 text-[10px] font-bold uppercase flex items-center gap-1.5 ml-1">
                    <WarningCircle weight="fill" class="w-3.5 h-3.5" /> {errors.name}
                  </p>
                {/if}
              </div>

              <div class="space-y-3">
                <label for="category_id" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('skills.create.category')}</label>
                <div class="relative group">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none">
                    <Tag weight="bold" class="w-5 h-5" />
                  </div>
                  <select
                    id="category_id"
                    bind:value={formData.category_id}
                    class="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-10 py-4 text-white focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer font-bold uppercase tracking-tight"
                  >
                    <option value="" disabled>{$t('skills.create.category_placeholder')}</option>
                    {#each categories as category}
                      <option value={category.id}>{category.name}</option>
                    {/each}
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                    <SortAscending class="rotate-180 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-3">
              <label for="description" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('skills.create.description')}</label>
              <textarea
                id="description"
                bind:value={formData.description}
                placeholder={$t('skills.create.description_placeholder')}
                rows="4"
                class="w-full bg-zinc-950/50 border border-zinc-800 rounded-[24px] p-6 text-white focus:border-violet-500 outline-none transition-all placeholder:text-zinc-700 italic font-medium leading-relaxed resize-none"
              ></textarea>
            </div>

            <!-- Difficulty & Hours -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div class="space-y-4">
                <span class="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('skills.create.difficulty')}</span>
                <div class="flex flex-wrap gap-2">
                  {#each difficultyLevels as level}
                    <button 
                      onclick={() => formData.difficulty = level.value}
                      class="px-4 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-2 flex-1 min-w-[80px]
                      {formData.difficulty === level.value 
                        ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20 scale-105' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}"
                    >
                      <span>{'⭐'.repeat(level.value)}</span>
                      {level.label}
                    </button>
                  {/each}
                </div>
              </div>

              <div class="space-y-4">
                <label for="hours" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('common.duration') || 'Hours'}</label>
                <div class="bg-zinc-950/50 border border-zinc-800 rounded-[24px] p-6 flex items-center justify-between shadow-inner">
                  <button 
                    onclick={() => formData.estimated_hours = Math.max(0.5, formData.estimated_hours - 0.5)}
                    class="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-rose-400 transition-all active:scale-90"
                  >
                    <SortAscending class="rotate-180" />
                  </button>
                  <div class="text-center">
                    <span class="text-4xl font-black tabular-nums">{formData.estimated_hours}</span>
                    <span class="text-[10px] font-black text-zinc-600 block uppercase">{$t('common.duration_unit') || 'Hours'}</span>
                  </div>
                  <button 
                    onclick={() => formData.estimated_hours += 0.5}
                    class="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-emerald-400 transition-all active:scale-90"
                  >
                    <Plus weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Prerequisites Section -->
        <section class="bg-zinc-900/30 border border-zinc-800/50 rounded-[32px] p-8 space-y-6 shadow-xl">
           <div class="flex items-center justify-between">
              <h3 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                <Target weight="duotone" class="w-5 h-5 text-amber-500" />
                {$t('skills.ui.chain')}
              </h3>
              <div class="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                {$t('skills.ui.dependencies')}: {formData.prerequisites.length}
              </div>
            </div>
            
            {#if availablePrerequisites.length === 0}
              <div class="bg-zinc-950/50 border border-zinc-800 border-dashed rounded-2xl p-10 text-center">
                <p class="text-xs text-zinc-500 italic">{$t('skills.ui.no_prerequisites')}</p>
              </div>
            {:else}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                {#each filteredPrerequisites as skill}
                  <button 
                    onclick={() => togglePrerequisite(skill.id)}
                    class="flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group/req
                    {formData.prerequisites.includes(skill.id) 
                      ? 'bg-violet-600/10 border-violet-500/50 text-white' 
                      : 'bg-zinc-950/30 border-zinc-800/50 text-zinc-500 hover:border-zinc-700'}"
                  >
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all
                      {formData.prerequisites.includes(skill.id) ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-zinc-900 text-zinc-700 group-hover/req:text-zinc-500'}">
                       {#if formData.prerequisites.includes(skill.id)}
                        <CheckCircle weight="fill" class="w-6 h-6" />
                       {:else}
                        <Target weight="bold" class="w-5 h-5" />
                       {/if}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[11px] font-black uppercase tracking-tight truncate">{skill.name}</p>
                      <p class="text-[9px] font-bold text-zinc-600 uppercase">Level {skill.difficulty || 1}</p>
                    </div>
                  </button>
                {/each}
              </div>
            {/if}
        </section>

        <!-- Learning Path Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <!-- Objectives -->
           <section class="bg-zinc-900/30 border border-zinc-800/50 rounded-[32px] p-8 space-y-6 shadow-xl">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                  <Check weight="duotone" class="w-5 h-5 text-violet-400" />
                  {$t('skills.create.objectives')}
                </h3>
                <button 
                  onclick={() => addItem('learning_objectives')}
                  class="w-8 h-8 rounded-lg bg-violet-600/10 text-violet-400 hover:bg-violet-600 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  <Plus weight="bold" />
                </button>
              </div>

              <div class="space-y-4">
                {#each formData.learning_objectives as obj, i}
                  <div class="flex gap-4 group" in:slide={{ duration: 250 }}>
                    <div class="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[11px] font-black text-zinc-600 shrink-0 mt-1 shadow-inner group-hover:text-violet-500 group-hover:border-violet-500/30 transition-all">
                      {i + 1}
                    </div>
                    <textarea
                      bind:value={formData.learning_objectives[i]}
                      placeholder={$t('skills.ui.objective_placeholder')}
                      rows="2"
                      class="flex-1 bg-transparent border-b border-zinc-800 py-1 text-sm text-zinc-300 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-800 resize-none no-scrollbar font-medium"
                    ></textarea>
                    <button 
                      onclick={() => removeItem('learning_objectives', i)}
                      class="opacity-0 group-hover:opacity-100 p-2 text-zinc-700 hover:text-rose-400 transition-all active:scale-90"
                    >
                      <Trash weight="bold" />
                    </button>
                  </div>
                {/each}
              </div>
           </section>

           <!-- Criteria -->
           <section class="bg-zinc-900/30 border border-zinc-800/50 rounded-[32px] p-8 space-y-6 shadow-xl">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                  <Certificate weight="duotone" class="w-5 h-5 text-amber-400" />
                  {$t('skills.ui.validation')}
                </h3>
                <button 
                  onclick={() => addItem('assessment_criteria')}
                  class="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-400 hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  <Plus weight="bold" />
                </button>
              </div>

              <div class="space-y-4">
                {#each formData.assessment_criteria as cr, i}
                  <div class="flex gap-4 group" in:slide={{ duration: 250 }}>
                    <div class="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-600 shrink-0 mt-1 shadow-inner group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all">
                      C{i + 1}
                    </div>
                    <textarea
                      bind:value={formData.assessment_criteria[i]}
                      placeholder={$t('skills.ui.criteria_placeholder')}
                      rows="2"
                      class="flex-1 bg-transparent border-b border-zinc-800 py-1 text-sm text-zinc-300 focus:border-amber-500 outline-none transition-all placeholder:text-zinc-800 resize-none no-scrollbar font-medium"
                    ></textarea>
                    <button 
                      onclick={() => removeItem('assessment_criteria', i)}
                      class="opacity-0 group-hover:opacity-100 p-2 text-zinc-700 hover:text-rose-400 transition-all active:scale-90"
                    >
                      <Trash weight="bold" />
                    </button>
                  </div>
                {/each}
              </div>
           </section>
        </div>

        <!-- Resources & Advanced -->
        <section class="bg-zinc-900/10 border border-zinc-800/20 rounded-[32px] p-8 space-y-6 shadow-inner">
           <div class="flex items-center justify-between">
              <h3 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-3 text-zinc-500">
                <Books weight="duotone" class="w-5 h-5 text-blue-400" />
                {$t('skills.ui.materials')}
              </h3>
              <button 
                onclick={() => addItem('resources')}
                class="px-5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white hover:border-blue-500/30 transition-all flex items-center gap-2"
              >
                <Plus weight="bold" class="w-3 h-3" /> {$t('skills.create.add_resource') || 'Material'}
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each formData.resources as res, i}
                <div class="relative group" in:fade>
                   <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                    <Link weight="bold" class="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    bind:value={formData.resources[i]}
                    placeholder={$t('skills.create.resource_placeholder')}
                    class="w-full bg-zinc-950/40 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-xs text-zinc-400 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-900 font-bold"
                  />
                  <button 
                    onclick={() => removeItem('resources', i)}
                    class="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-rose-400 transition-all active:scale-90"
                  >
                    <X weight="bold" class="w-4 h-4" />
                  </button>
                </div>
              {/each}
            </div>
        </section>

      </div>

      <!-- Right Column: Sidebar (4 cols) -->
      <aside class="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-[100px]">
        
        <!-- Icon & Content Sync Card -->
        <section class="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden">
           <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full"></div>
           
           <div class="flex flex-col items-center gap-6 relative z-10">
              <div class="relative group">
                <div class="w-32 h-32 bg-zinc-950 border-4 border-zinc-800 rounded-[40px] flex items-center justify-center text-6xl shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-700">
                  {formData.icon || '🎯'}
                </div>
                <div class="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 border border-white/20 flex items-center justify-center text-white shadow-xl animate-pulse">
                   <Smiley weight="bold" class="w-5 h-5" />
                </div>
              </div>
              
              <div class="text-center space-y-2 w-full">
                <label for="icon_input" class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{$t('skills.ui.avatar')}</label>
                <input
                  id="icon_input"
                  type="text"
                  bind:value={formData.icon}
                  placeholder={$t('skills.create.icon_placeholder')}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-center text-2xl focus:border-violet-500 outline-none transition-all shadow-inner font-bold"
                />
              </div>
           </div>

           <div class="space-y-6 pt-6 border-t border-zinc-800/50 relative z-10 font-bold">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-black uppercase tracking-widest text-zinc-500">{$t('skills.ui.status')}</h4>
                  <p class="text-[10px] {formData.active ? 'text-emerald-500' : 'text-zinc-600'} mt-1 uppercase tracking-tighter italic">
                    {formData.active ? ($t('common.status_active') || 'Public & Teaching') : ($t('common.status_inactive') || 'Draft / Private')}
                  </p>
                </div>
                <button 
                  onclick={() => formData.active = !formData.active}
                  aria-label="Toggle active status"
                  class="w-14 h-7 rounded-full relative transition-all duration-300 shadow-xl
                  {formData.active ? 'bg-violet-600 shadow-violet-600/20' : 'bg-zinc-800'}"
                >
                  <div class="absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all transform 
                  {formData.active ? 'translate-x-7' : 'translate-x-0'} shadow-md"></div>
                </button>
              </div>

              <div class="space-y-4">
                 <div class="flex items-center justify-between text-xs">
                  <span class="text-zinc-600 uppercase tracking-tighter">{$t('skills.ui.order')}</span>
                  <div class="flex items-center gap-2">
                    <button onclick={() => formData.order_index = Math.max(0, formData.order_index - 1)} class="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">-</button>
                    <span class="w-10 text-center font-black text-violet-400 tabular-nums">{formData.order_index}</span>
                    <button onclick={() => formData.order_index += 1} class="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">+</button>
                  </div>
                </div>
              </div>
           </div>
        </section>

        <!-- Dynamic Live Showcase -->
        <section in:fade class="bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[32px] p-8 text-white space-y-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 blur-[60px] rounded-full transition-all duration-700"></div>
          
          <div class="flex items-center justify-between relative z-10">
            <div class="px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-violet-400">{$t('skills.ui.live_preview')}</div>
            <div class="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
              {#each [1,2,3,4,5] as star}
                <Star weight={formData.difficulty >= star ? 'fill' : 'regular'} size={11} class={formData.difficulty >= star ? 'text-amber-400' : 'text-zinc-800'} />
              {/each}
            </div>
          </div>

          <div class="relative z-10 space-y-4">
            <div class="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform duration-500">
              {formData.icon || '🎯'}
            </div>
            
            <div>
              <h3 class="text-2xl font-black uppercase tracking-tight line-clamp-2 leading-none">
                {formData.name || ($t('skills.create.topic_name') || 'Set a module name')}
              </h3>
              <p class="text-zinc-500 text-[11px] mt-4 leading-relaxed line-clamp-3 italic font-medium">
                "{formData.description || ($t('skills.create.description_placeholder') || 'Add content detail to see it here...')}"
              </p>
            </div>
          </div>

          <div class="pt-6 border-t border-white/5 relative z-10 flex items-center justify-between">
            <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
              <Clock weight="fill" class="w-4 h-4 text-violet-500" /> {formData.estimated_hours} {$t('common.duration_unit') || 'Hours'}
            </div>
            <div class="px-3 py-1.5 bg-zinc-950 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
              {getDifficultyInfo.label}
            </div>
          </div>
        </section>

        <!-- Knowledge Anchor -->
        <section class="bg-zinc-900 border border-zinc-800 border-dashed rounded-[32px] p-8 space-y-4 flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Lightbulb weight="fill" class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h4 class="text-xs font-black uppercase tracking-widest text-zinc-400">{$t('skills.ui.coach_tip')}</h4>
            <p class="text-[11px] text-zinc-600 leading-relaxed italic font-medium">
              "{$t('skills.edit.tips_spec_desc')}"
            </p>
          </div>
        </section>

      </aside>
    </div>
  </main>
</div>

<!-- Discard Changes Modal -->
{#if showConfirmDiscard}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade>
    <button class="absolute inset-0 bg-zinc-950/90 backdrop-blur-md w-full border-none cursor-default" onclick={() => showConfirmDiscard = false} aria-label="Close modal"></button>
    <div class="bg-zinc-900 border border-white/10 rounded-[40px] p-10 max-w-md w-full relative z-10 shadow-[0_40px_100px_rgba(0,0,0,1)] text-center" in:fly={{ y: 30 }}>
      <div class="p-6 bg-rose-500/10 text-rose-500 rounded-3xl w-fit mx-auto mb-8 animate-bounce">
        <ArrowCounterClockwise size={40} weight="bold" />
      </div>
      <h3 class="text-3xl font-black text-white mb-3 tracking-tight uppercase italic">{$t('skills.edit.discard_title')}</h3>
      <p class="text-zinc-500 mb-10 leading-relaxed font-medium">
        {$t('skills.edit.discard_msg', { name: formData.name })}
      </p>
      <div class="flex flex-col gap-4">
        <button 
          onclick={resetForm}
          class="w-full py-5 rounded-2xl bg-rose-600 text-white font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-2xl shadow-rose-600/30 active:scale-95"
        >
          {$t('skills.edit.discard_confirm')}
        </button>
        <button 
          onclick={() => showConfirmDiscard = false}
          class="w-full py-5 rounded-2xl bg-zinc-800 text-white font-black uppercase tracking-widest hover:bg-zinc-700 transition-all active:scale-95"
        >
          {$t('skills.edit.discard_cancel')}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  :global(body) {
    background-color: #09090b;
  }
</style>
