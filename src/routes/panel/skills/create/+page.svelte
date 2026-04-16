<script lang="ts">
  import { goto } from '$app/navigation';
  import { showToast, showError } from '$lib/stores/toast';
  import { appStore } from '$lib/stores/appStore';
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
    Books
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly } from 'svelte/transition';
  import { t } from '$lib/i18n';

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

  // Get categories from the store
  const categories = $derived($appStore.categories || []);

  const difficultyLevels = [
    { value: 1, label: 'Very Easy' },
    { value: 2, label: 'Easy' },
    { value: 3, label: 'Intermediate' },
    { value: 4, label: 'Hard' },
    { value: 5, label: 'Expert' }
  ];

  const handleGoBack = () => {
    goto('/panel/skills');
  };

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.category_id) errors.category_id = 'Category is required';

    if (formData.order_index && (formData.order_index < 0 || formData.order_index > 1000)) {
      errors.order_index = 'Order index must be between 0 and 1000';
    }

    return Object.keys(errors).length === 0;
  };

  const addItem = (key: 'learning_objectives' | 'assessment_criteria' | 'resources') => {
    formData[key] = [...formData[key], ''];
  };

  const removeItem = (key: 'learning_objectives' | 'assessment_criteria' | 'resources', index: number) => {
    formData[key] = formData[key].filter((_, i) => i !== index);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast.error('Please correct the errors in the form');
      return;
    }

    try {
      isSubmitting = true;
      
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
        throw new Error(result.error || $t('skills.create.error'));
      }
      
      showToast.success($t('skills.create.success'));
      goto('/panel/skills');
    } catch (error) {
      console.error('Error creating skill:', error);
      showError(error, $t('skills.create.error'));
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
  <title>{$t('skills.create.title')} - ChessNet</title>
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<div class="min-h-screen bg-zinc-950 pb-24" in:fade>
  <!-- Navigation Header Space -->
  <div class="max-w-[800px] mx-auto pt-8 px-4 pb-4">
    <button 
      onclick={handleGoBack}
      class="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group text-sm font-medium"
    >
      <ArrowLeft weight="bold" class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {$t('skills.create.back')}
    </button>
  </div>

  <main class="max-w-[800px] mx-auto px-4">
    <!-- Header Card -->
    <div class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-8 md:p-10 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl shadow-black/50">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-[24px] flex items-center justify-center text-violet-500">
          <Target weight="duotone" class="w-10 h-10" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">{$t('skills.create.title')}</h1>
          <p class="text-zinc-500 font-medium mt-1">{$t('skills.create.subtitle')}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3 w-full md:w-auto">
        <button 
          onclick={handleGoBack} 
          class="flex-1 md:flex-none px-6 py-3 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all text-sm font-bold flex items-center justify-center gap-2"
        >
          <X weight="bold" class="w-4 h-4" />
          {$t('common.cancel')}
        </button>
        <button 
          onclick={handleSubmit} 
          disabled={isSubmitting}
          class="flex-1 md:flex-none px-8 py-3 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20 text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {$t('skills.create.saving')}
          {:else}
            <FloppyDisk weight="bold" class="w-4 h-4" />
            {$t('skills.create.save_btn')}
          {/if}
        </button>
      </div>
    </div>

    <!-- Main Form Grid -->
    <div class="grid grid-cols-1 gap-8">
      <!-- General Content -->
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-8 md:p-10 space-y-8 shadow-2xl shadow-black/50">
        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-8">
          
          <div class="grid grid-cols-1 gap-8">
            <!-- Nombre -->
            <div class="space-y-3">
              <label for="name" class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">
                <Note weight="duotone" class="w-4 h-4 text-violet-400" />
                {$t('skills.create.topic_name')}
              </label>
              <div class="relative group">
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  placeholder={$t('skills.create.topic_placeholder')}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] px-6 py-4 text-white hover:border-zinc-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-600 outline-none"
                  class:border-red-500={errors.name}
                />
              </div>
              {#if errors.name}
                <p class="text-red-400 text-xs font-bold px-1 flex items-center gap-1.5">
                  <Info weight="fill" class="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              {/if}
            </div>

            <!-- Categoría y Dificultad -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label for="category_id" class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">
                  <Tag weight="duotone" class="w-4 h-4 text-violet-400" />
                  {$t('skills.create.category')}
                </label>
                <select
                  id="category_id"
                  bind:value={formData.category_id}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] px-6 py-4 text-white hover:border-zinc-700 focus:border-violet-500 transition-all outline-none appearance-none"
                  class:border-red-500={errors.category_id}
                >
                  <option value="" disabled>{$t('skills.create.category_placeholder')}</option>
                  {#each categories as category}
                    <option value={category.id}>{category.name}</option>
                  {/each}
                </select>
                {#if errors.category_id}
                  <p class="text-red-400 text-xs font-bold px-1 flex items-center gap-1.5">
                    <Info weight="fill" class="w-3.5 h-3.5" />
                    {errors.category_id}
                  </p>
                {/if}
              </div>

              <div class="space-y-3">
                <label for="difficulty" class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">
                  <TrendUp weight="duotone" class="w-4 h-4 text-violet-400" />
                  {$t('skills.create.difficulty')}
                </label>
                <select
                  id="difficulty"
                  bind:value={formData.difficulty}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] px-6 py-4 text-white hover:border-zinc-700 focus:border-violet-500 transition-all outline-none appearance-none"
                >
                  {#each difficultyLevels as level}
                    <option value={level.value}>{'⭐'.repeat(level.value)} {level.label}</option>
                  {/each}
                </select>
              </div>
            </div>

            <!-- Descripción -->
            <div class="space-y-3">
              <label for="description" class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">
                <Info weight="duotone" class="w-4 h-4 text-violet-400" />
                {$t('skills.create.description')}
              </label>
              <textarea
                id="description"
                bind:value={formData.description}
                placeholder={$t('skills.create.description_placeholder')}
                rows="4"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-[24px] px-6 py-5 text-white hover:border-zinc-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-600 outline-none resize-none"
              ></textarea>
            </div>

            <!-- Dynamic Lists (Objectives, Criteria, Resources) -->
            <div class="space-y-8">
              <!-- Objectives -->
              <div class="space-y-4">
                <div class="flex items-center justify-between px-1">
                  <label class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                    <Check weight="duotone" class="w-4 h-4 text-violet-400" />
                    {$t('skills.create.objectives')}
                  </label>
                  <button 
                    type="button"
                    onclick={() => addItem('learning_objectives')}
                    class="p-1 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2"
                  >
                    <Plus weight="bold" class="w-3 h-3" />
                    {$t('skills.create.add_objective')}
                  </button>
                </div>
                <div class="grid grid-cols-1 gap-3">
                  {#each formData.learning_objectives as objective, i}
                    <div class="flex items-center gap-3 group">
                      <input
                        type="text"
                        bind:value={formData.learning_objectives[i]}
                        placeholder={$t('skills.create.objective_placeholder')}
                        class="flex-1 bg-zinc-950 border border-zinc-800 rounded-[16px] px-6 py-3 text-white focus:border-violet-500 outline-none text-sm transition-all"
                      />
                      <button 
                        type="button"
                        onclick={() => removeItem('learning_objectives', i)}
                        class="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash weight="bold" class="w-4 h-4" />
                      </button>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Criterios -->
              <div class="space-y-4">
                <div class="flex items-center justify-between px-1">
                  <label class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                    <Target weight="duotone" class="w-4 h-4 text-violet-400" />
                    {$t('skills.create.criteria')}
                  </label>
                  <button 
                    type="button"
                    onclick={() => addItem('assessment_criteria')}
                    class="p-1 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2"
                  >
                    <Plus weight="bold" class="w-3 h-3" />
                    {$t('skills.create.add_criteria')}
                  </button>
                </div>
                <div class="grid grid-cols-1 gap-3">
                  {#each formData.assessment_criteria as criteria, i}
                    <div class="flex items-center gap-3 group">
                      <input
                        type="text"
                        bind:value={formData.assessment_criteria[i]}
                        placeholder={$t('skills.create.criteria_placeholder')}
                        class="flex-1 bg-zinc-950 border border-zinc-800 rounded-[16px] px-6 py-3 text-white focus:border-violet-500 outline-none text-sm transition-all"
                      />
                      <button 
                        type="button"
                        onclick={() => removeItem('assessment_criteria', i)}
                        class="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash weight="bold" class="w-4 h-4" />
                      </button>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Recursos -->
              <div class="space-y-4">
                <div class="flex items-center justify-between px-1">
                  <label class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                    <Books weight="duotone" class="w-4 h-4 text-violet-400" />
                    {$t('skills.create.resources')}
                  </label>
                  <button 
                    type="button"
                    onclick={() => addItem('resources')}
                    class="p-1 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2"
                  >
                    <Plus weight="bold" class="w-3 h-3" />
                    {$t('skills.create.add_resource')}
                  </button>
                </div>
                <div class="grid grid-cols-1 gap-3">
                  {#each formData.resources as resource, i}
                    <div class="flex items-center gap-3 group">
                      <input
                        type="text"
                        bind:value={formData.resources[i]}
                        placeholder={$t('skills.create.resource_placeholder')}
                        class="flex-1 bg-zinc-950 border border-zinc-800 rounded-[16px] px-6 py-3 text-white focus:border-violet-500 outline-none text-sm transition-all"
                      />
                      <button 
                        type="button"
                        onclick={() => removeItem('resources', i)}
                        class="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash weight="bold" class="w-4 h-4" />
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
               <!-- Icono -->
              <div class="space-y-3">
                <label for="icon" class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">
                  <Plus weight="duotone" class="w-4 h-4 text-violet-400" />
                  {$t('skills.create.icon')}
                </label>
                <input
                  id="icon"
                  type="text"
                  bind:value={formData.icon}
                  placeholder={$t('skills.create.icon_placeholder')}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] px-6 py-4 text-white hover:border-zinc-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-600 outline-none uppercase text-center text-xl font-bold"
                />
              </div>

               <!-- Orden -->
              <div class="space-y-3">
                <label for="order_index" class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">
                  <SortAscending weight="duotone" class="w-4 h-4 text-violet-400" />
                  {$t('skills.create.order')}
                </label>
                <input
                  id="order_index"
                  type="number"
                  min="0"
                  bind:value={formData.order_index}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] px-6 py-4 text-white hover:border-zinc-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-600 outline-none"
                />
              </div>
            </div>

            <!-- Enlace externo (Legacy support / Quick reference) -->
            <div class="space-y-3">
              <label for="resource_link" class="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">
                <Link weight="duotone" class="w-4 h-4 text-violet-400" />
                {$t('skills.create.link')}
              </label>
              <input
                id="resource_link"
                type="url"
                bind:value={formData.resource_link}
                placeholder="https://lichess.org/lesson/..."
                class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] px-6 py-4 text-white hover:border-zinc-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-600 outline-none"
              />
            </div>
          </div>

          <!-- Quick Actions Footer -->
          <div class="pt-10 border-t border-zinc-800 flex flex-col items-center">
            <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">{$t('skills.create.quick_save')}</p>
            <button 
              onclick={handleSubmit}
              disabled={isSubmitting}
              class="w-full py-5 rounded-[24px] bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-black uppercase tracking-widest shadow-xl shadow-white/5 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
               {#if isSubmitting}
                <div class="w-5 h-5 border-3 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin"></div>
                {$t('skills.create.creating')}
              {:else}
                <Check weight="bold" class="w-5 h-5" />
                {$t('skills.create.finish_btn')}
              {/if}
            </button>
          </div>
        </form>
      </div>

      <!-- Tips Section -->
      <div class="bg-violet-600/5 border border-violet-500/10 rounded-[24px] p-8 md:p-10 shadow-2xl shadow-black/50">
        <h3 class="flex items-center gap-3 text-lg font-bold text-white mb-6">
          <Info weight="duotone" class="w-6 h-6 text-violet-400" />
          {$t('skills.create.tips_title')}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <h4 class="text-sm font-black text-violet-400 uppercase tracking-widest">{$t('skills.create.tips_spec_title')}</h4>
            <p class="text-zinc-400 text-sm leading-relaxed">{$t('skills.create.tips_spec_desc')}</p>
          </div>
          <div class="space-y-2">
            <h4 class="text-sm font-black text-violet-400 uppercase tracking-widest">{$t('skills.create.tips_ass_title')}</h4>
            <p class="text-zinc-400 text-sm leading-relaxed">{$t('skills.create.tips_ass_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  /* Custom layouts adjustments */
</style>
