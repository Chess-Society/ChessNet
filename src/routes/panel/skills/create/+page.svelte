<script lang="ts">
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-french-toast';
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
    CheckCircle,
    WarningCircle,
    Lightbulb,
    Certificate,
    ArrowUpRight,
    Trophy,
    Shuffle,
    Brain
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';

  let { data } = $props<{ data: PageData }>();

  let formData = $state({
    name: '',
    description: '',
    category_id: '',
    difficulty: 1,
    estimated_hours: 1,
    prerequisites: [] as string[],
    learning_objectives: [''] as string[],
    assessment_criteria: [''] as string[],
    resources: [''] as string[],
    icon: '🎯',
    resource_link: '',
    order_index: 0,
    active: true
  });

  let isSubmitting = $state(false);
  let errors: Record<string, string> = $state({});

  // Filter skills to use as categories or use static ones if store is empty
  const categories = $derived($appStore.categories.length > 0 
    ? $appStore.categories 
    : [
        { id: 'basics', name: $t('skills.category_fundamentals') },
        { id: 'tactics', name: $t('skills.category_tactics') },
        { id: 'strategy', name: $t('skills.category_strategy') },
        { id: 'endgames', name: $t('skills.category_endgames') },
        { id: 'openings', name: $t('skills.category_openings') }
      ]
  );

  const availablePrerequisites = $derived(data.availablePrerequisites || []);

  const difficultyLevels = [
    { value: 1, label: $t('skills.difficulty.entry'), icon: Sparkle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { value: 2, label: $t('skills.difficulty.novice'), icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { value: 3, label: $t('skills.difficulty.intermediate'), icon: TrendUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { value: 4, label: $t('skills.difficulty.advanced'), icon: Target, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { value: 5, label: $t('skills.difficulty.master'), icon: Trophy, color: 'text-rose-400', bg: 'bg-rose-400/10' }
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

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    isSubmitting = true;
    uiStore.setLoading(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        learning_objectives: formData.learning_objectives.filter(o => o.trim()),
        assessment_criteria: formData.assessment_criteria.filter(c => c.trim()),
        resources: formData.resources.filter(r => r.trim())
      };

      await appStore.addSkill(payload);
      toast.success($t('common.save_success'));
      goto('/panel/skills');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || $t('skills.save_error') || 'Error creating the skill');
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
        <title>{$t('skills.create.title')} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white pb-32" in:fade>
  
  <!-- Premium Top Bar -->
  <header class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
    <div class="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          onclick={handleGoBack}
          class="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
        >
          <ArrowLeft weight="bold" class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
            <Sparkle weight="fill" class="w-4 h-4 text-violet-500" />
            {$t('skills.create.title')}
          </h1>
          <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{$t('skills.create.subtitle')}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          onclick={handleGoBack}
          class="px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
        >
          {$t('common.cancel')}
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="px-8 py-2.5 rounded-none bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 transition-all text-xs font-black tracking-widest uppercase flex items-center gap-2 disabled:opacity-50"
        >
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin"></div>
          {:else}
            <FloppyDisk weight="bold" class="w-4 h-4" />
          {/if}
          {isSubmitting ? $t('skills.create.saving') : $t('skills.create.save_btn')}
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-[1200px] mx-auto px-6 pt-12">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Content Area (8 cols) -->
      <div class="lg:col-span-8 space-y-8">
        
        <!-- AI Import Quick Action -->
        {#if !isSubmitting}
          <section 
            class="relative group overflow-hidden bg-zinc-900/40 border border-violet-500/30 rounded-none p-8 mb-8 shadow-2xl transition-all hover:bg-zinc-900/60"
            in:fly={{ y: -20, duration: 600 }}
          >
            <div class="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[80px] rounded-none transition-all group-hover:bg-violet-600/10"></div>
            <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div class="flex items-center gap-6">
                <div class="w-16 h-16 bg-violet-600/10 text-violet-400 flex items-center justify-center rounded-none border border-violet-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Brain weight="fill" class="w-8 h-8" />
                </div>
                <div>
                  <h3 class="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                    {$t('skills.ui.import_pdf') || 'Importar con IA'}
                    <span class="px-1.5 py-0.5 bg-violet-600 text-white text-[8px] font-black not-italic tracking-normal">BETA</span>
                  </h3>
                  <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{$t('skills.ui.import_pdf_subtitle') || 'Sube un PDF y ahorra tiempo creando lecciones'}</p>
                </div>
              </div>
              <button 
                onclick={() => goto('/panel/skills?import=ai')}
                class="px-8 py-4 bg-zinc-950 border border-violet-500/50 text-white font-black uppercase tracking-widest text-[10px] hover:bg-violet-600 hover:border-violet-400 transition-all shadow-xl flex items-center gap-3 group/ai"
              >
                <Sparkle weight="fill" class="w-4 h-4 group-hover/ai:rotate-12 transition-transform" />
                {$t('skills.ui.extract_ai') || 'ANALIZAR PDF'}
              </button>
            </div>
          </section>
        {/if}

        <!-- Main Info Card -->
        <section class="bg-zinc-900/30 border border-zinc-800/50 rounded-none overflow-hidden backdrop-blur-sm shadow-2xl">
          <div class="bg-gradient-to-r from-violet-600/10 to-transparent p-8 border-b border-zinc-800/50">
            <h2 class="text-xl font-black uppercase tracking-widest italic flex items-center gap-3">
              <span class="w-1.5 h-6 bg-violet-500 rounded-none"></span>
              {$t('skills.ui.core_config')}
            </h2>
          </div>

          <div class="p-8 space-y-10">
            <!-- Topic Name & Category Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label for="skill_name" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('skills.create.topic_name')}</label>
                <div class="input-wrapper">
                  <input
                    id="skill_name"
                    type="text"
                    bind:value={formData.name}
                    placeholder={$t('skills.create.topic_placeholder')}
                    class="glass-input {errors.name ? 'border-rose-500/50 focus:border-rose-500' : ''}"
                  />
                </div>
                {#if errors.name}
                  <p class="text-rose-400 text-[10px] font-bold uppercase flex items-center gap-1.5 ml-1 mt-2">
                    <WarningCircle weight="fill" class="w-3.5 h-3.5" /> {errors.name}
                  </p>
                {/if}
              </div>

              <div class="space-y-6 md:col-span-2">
                <span class="glass-label" id="category_label">{$t('skills.create.category')}</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="group" aria-labelledby="category_label">
                  {#each categories as category, i}
                    <button
                      type="button"
                      id="cat_btn_{i}"
                      onclick={() => formData.category_id = category.id}
                      class="selection-card small {formData.category_id === category.id ? 'active' : ''}"
                      aria-pressed={formData.category_id === category.id}
                    >
                      <div class="card-icon">
                        <Tag weight={formData.category_id === category.id ? "fill" : "duotone"} />
                      </div>
                      <div class="card-content">
                        <span class="card-title">{category.name}</span>
                      </div>
                      {#if formData.category_id === category.id}
                        <div class="card-check" in:scale>
                          <Check size={14} weight="bold" />
                        </div>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-4">
              <label for="skill_description" class="glass-label">{$t('skills.create.description')}</label>
              <div class="input-wrapper">
                <textarea
                  id="skill_description"
                  bind:value={formData.description}
                  placeholder={$t('skills.create.description_placeholder')}
                  rows="4"
                  class="glass-input !py-5 resize-none h-auto"
                ></textarea>
              </div>
            </div>

            <!-- Difficulty & Hours -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div class="space-y-4">
                <span class="glass-label">{$t('skills.create.difficulty')}</span>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {#each difficultyLevels as level}
                    <button 
                      type="button"
                      onclick={() => formData.difficulty = level.value}
                      class="selection-card small {formData.difficulty === level.value ? 'active' : ''}"
                    >
                      <div class="card-icon">
                        <level.icon weight={formData.difficulty === level.value ? "fill" : "duotone"} />
                      </div>
                      <div class="card-content">
                        <span class="block text-[10px] font-bold opacity-40 mb-0.5">{'⭐'.repeat(level.value)}</span>
                        <span class="card-title !tracking-tighter">{level.label}</span>
                      </div>
                      {#if formData.difficulty === level.value}
                        <div class="card-check" in:scale>
                          <Check size={12} weight="bold" />
                        </div>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>

              <div class="space-y-4">
                <span class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('common.duration') || 'Hours'}</span>
                <div class="bg-zinc-950/50 border border-zinc-800 rounded-none p-6 flex items-center justify-between shadow-inner">
                  <button 
                    onclick={() => formData.estimated_hours = Math.max(0.5, formData.estimated_hours - 0.5)}
                    class="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-rose-400 transition-all active:scale-90"
                  >
                    <SortAscending class="rotate-180" />
                  </button>
                  <div class="text-center">
                    <span class="text-4xl font-black tabular-nums">{formData.estimated_hours}</span>
                    <span class="text-[10px] font-black text-zinc-600 block uppercase">{$t('common.duration_unit') || 'Hours'}</span>
                  </div>
                  <button 
                    onclick={() => formData.estimated_hours += 0.5}
                    class="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-emerald-400 transition-all active:scale-90"
                  >
                    <Plus weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Prerequisites Section -->
        <section class="bg-zinc-900/30 border border-zinc-800/50 rounded-none p-8 space-y-6 shadow-xl">
           <div class="flex items-center justify-between">
              <h3 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                <Target weight="duotone" class="w-5 h-5 text-amber-500" />
                {$t('skills.ui.chain')}
              </h3>
              <div class="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-none text-[9px] font-black uppercase tracking-widest">
                {$t('skills.ui.dependencies')}: {formData.prerequisites.length}
              </div>
            </div>
            
            {#if availablePrerequisites.length === 0}
              <div class="bg-zinc-950/50 border border-zinc-800 border-dashed rounded-none p-10 text-center">
                <p class="text-xs text-zinc-500 italic">{$t('skills.ui.no_prerequisites')}</p>
              </div>
            {:else}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                {#each availablePrerequisites as skill}
                  <button 
                    onclick={() => togglePrerequisite(skill.id)}
                    class="flex items-center gap-4 p-4 rounded-none border transition-all text-left group/req
                    {formData.prerequisites.includes(skill.id) 
                      ? 'bg-violet-600/10 border-violet-500/50 text-white' 
                      : 'bg-zinc-950/30 border-zinc-800/50 text-zinc-500 hover:border-zinc-700'}"
                  >
                    <div class="w-10 h-10 rounded-none flex items-center justify-center transition-all
                      {formData.prerequisites.includes(skill.id) ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-zinc-900 text-zinc-700 group-hover/req:text-zinc-500'}">
                       {#if formData.prerequisites.includes(skill.id)}
                        <CheckCircle weight="fill" class="w-6 h-6" />
                       {:else}
                        <Target weight="bold" class="w-5 h-5" />
                       {/if}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[11px] font-black uppercase tracking-tight truncate">{skill.name}</p>
                      <p class="text-[9px] font-bold text-zinc-600 uppercase">{$t('skills.ui.level')} {skill.difficulty || 1}</p>
                    </div>
                  </button>
                {/each}
              </div>
            {/if}
        </section>

        <!-- Learning Path Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <!-- Objectives -->
           <section class="bg-zinc-900/30 border border-zinc-800/50 rounded-none p-8 space-y-6 shadow-xl">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                  <Check weight="duotone" class="w-5 h-5 text-violet-400" />
                  {$t('skills.create.objectives')}
                </h3>
                <button 
                  onclick={() => addItem('learning_objectives')}
                  class="w-8 h-8 rounded-none bg-violet-600/10 text-violet-400 hover:bg-violet-600 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  <Plus weight="bold" />
                </button>
              </div>

              <div class="space-y-4">
                {#each formData.learning_objectives as obj, i}
                  <div class="flex gap-4 group" in:slide={{ duration: 250 }}>
                    <div class="w-10 h-10 rounded-none bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[11px] font-black text-zinc-600 shrink-0 mt-1 shadow-inner group-hover:text-violet-500 group-hover:border-violet-500/30 transition-all">
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
           <section class="bg-zinc-900/30 border border-zinc-800/50 rounded-none p-8 space-y-6 shadow-xl">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                  <Certificate weight="duotone" class="w-5 h-5 text-amber-400" />
                  {$t('skills.ui.validation')}
                </h3>
                <button 
                  onclick={() => addItem('assessment_criteria')}
                  class="w-8 h-8 rounded-none bg-amber-600/10 text-amber-400 hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  <Plus weight="bold" />
                </button>
              </div>

              <div class="space-y-4">
                {#each formData.assessment_criteria as cr, i}
                  <div class="flex gap-4 group" in:slide={{ duration: 250 }}>
                    <div class="w-10 h-10 rounded-none bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-600 shrink-0 mt-1 shadow-inner group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all">
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
        <section class="bg-zinc-900/10 border border-zinc-800/20 rounded-none p-8 space-y-6 shadow-inner">
           <div class="flex items-center justify-between">
              <h3 class="text-sm font-black uppercase tracking-widest italic flex items-center gap-3 text-zinc-500">
                <Books weight="duotone" class="w-5 h-5 text-blue-400" />
                {$t('skills.ui.materials')}
              </h3>
              <button 
                onclick={() => addItem('resources')}
                class="px-5 py-2.5 rounded-none bg-zinc-950 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white hover:border-blue-500/30 transition-all flex items-center gap-2"
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
                    class="w-full bg-zinc-950/40 border border-zinc-800 rounded-none pl-12 pr-4 py-4 text-xs text-zinc-400 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-900 font-bold"
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
        <section class="bg-zinc-900/50 border border-zinc-800 rounded-none p-8 space-y-8 shadow-2xl relative overflow-hidden">
           <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/5 blur-3xl rounded-none"></div>
           
           <div class="flex flex-col items-center gap-6 relative z-10">
              <div class="relative group">
                <div class="w-32 h-32 bg-zinc-950 border-4 border-zinc-800 rounded-none flex items-center justify-center text-6xl shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-700">
                  {formData.icon || '🎯'}
                </div>
                <div class="absolute -bottom-2 -right-2 w-10 h-10 rounded-none bg-gradient-to-br from-violet-600 to-indigo-600 border border-white/20 flex items-center justify-center text-white shadow-xl animate-pulse">
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
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-none px-4 py-4 text-center text-2xl focus:border-violet-500 outline-none transition-all shadow-inner font-bold"
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
                  class="w-14 h-7 rounded-none relative transition-all duration-300 shadow-xl
                  {formData.active ? 'bg-violet-600 shadow-violet-600/20' : 'bg-zinc-800'}"
                >
                  <div class="absolute top-1 left-1 w-5 h-5 rounded-none bg-white transition-all transform 
                  {formData.active ? 'translate-x-7' : 'translate-x-0'} shadow-md"></div>
                </button>
              </div>

              <div class="space-y-4">
                 <div class="flex items-center justify-between text-xs">
                  <span class="text-zinc-600 uppercase tracking-tighter">{$t('skills.ui.order')}</span>
                  <div class="flex items-center gap-2">
                    <button onclick={() => formData.order_index = Math.max(0, formData.order_index - 1)} class="w-8 h-8 rounded-none bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">-</button>
                    <span class="w-10 text-center font-black text-violet-400 tabular-nums">{formData.order_index}</span>
                    <button onclick={() => formData.order_index += 1} class="w-8 h-8 rounded-none bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">+</button>
                  </div>
                </div>
              </div>
           </div>
        </section>

        <!-- Dynamic Live Showcase -->
        <section in:fade class="bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-none p-8 text-white space-y-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 blur-[60px] rounded-none transition-all duration-700"></div>
          
          <div class="flex items-center justify-between relative z-10">
            <div class="px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-none text-[9px] font-black uppercase tracking-widest text-violet-400">{$t('skills.ui.live_preview')}</div>
            <div class="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-none border border-white/5">
              {#each [1,2,3,4,5] as star}
                <Star weight={formData.difficulty >= star ? 'fill' : 'regular'} size={11} class={formData.difficulty >= star ? 'text-amber-400' : 'text-zinc-800'} />
              {/each}
            </div>
          </div>

          <div class="relative z-10 space-y-4">
            <div class="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform duration-500">
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
            <div class="px-3 py-1.5 bg-zinc-950 border border-white/10 rounded-none text-[9px] font-black uppercase tracking-widest shadow-xl">
              {getDifficultyInfo.label}
            </div>
          </div>
        </section>

        <!-- Knowledge Anchor -->
        <section class="bg-zinc-900 border border-zinc-800 border-dashed rounded-none p-8 space-y-4 flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-none bg-violet-500/10 flex items-center justify-center text-violet-400">
            <Lightbulb weight="fill" class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h4 class="text-xs font-black uppercase tracking-widest text-zinc-400">{$t('skills.ui.coach_tip')}</h4>
            <p class="text-[11px] text-zinc-600 leading-relaxed italic font-medium">
              "{$t('skills.create.tips_spec_desc')}"
            </p>
          </div>
        </section>

      </aside>
    </div>
  </main>
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Unused number selectors removed */

  :global(body) {
    background-color: #09090b;
  }
</style>

