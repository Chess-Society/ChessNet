<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    CaretLeft, 
    FloppyDisk, 
    ArrowCounterClockwise, 
    Eye, 
    EyeSlash,
    Plus, 
    Trash, 
    Target, 
    Lightbulb, 
    Certificate, 
    Books, 
    WarningCircle,
    CheckCircle,
    Info,
    Star,
    Clock,
    DotsThreeVertical,
    Check
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly } from 'svelte/transition';

  const { data } = $props<{ data: PageData }>();
  
  const skillData = $derived(data.skill);
  const categories = $derived(data.categories || []);
  const availablePrerequisites = $derived(data.availablePrerequisites || []);

  // Form data state - Snapshot the initial data for the form without tracking 'data'
  const initial = untrack(() => $state.snapshot(data.skill));
  
  let formData = $state({
    name: initial?.name || '',
    description: initial?.description || '',
    category_id: initial?.category_id || '',
    difficulty: initial?.difficulty || 1,
    estimated_hours: initial?.estimated_hours || 1,
    prerequisites: (initial?.prerequisites || []) as string[],
    learning_objectives: (initial?.learning_objectives || ['']) as string[],
    assessment_criteria: (initial?.assessment_criteria || ['']) as string[],
    resources: (initial?.resources || ['']) as string[],
    icon: initial?.icon || '',
    resource_link: initial?.resource_link || '',
    order_index: initial?.order_index || 1,
    active: initial?.active ?? true
  });

  // UI state
  let isSubmitting = $state(false);
  let errors: Record<string, string> = $state({});
  let showPreview = $state(false);
  let showConfirmDiscard = $state(false);

  const difficultyLevels = [
    { value: 1, label: 'Very Easy', color: 'text-primary-400', bg: 'bg-primary-400/10' },
    { value: 2, label: 'Easy', color: 'text-green-400', bg: 'bg-green-400/10' },
    { value: 3, label: 'Intermediate', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { value: 4, label: 'Hard', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { value: 5, label: 'Expert', color: 'text-rose-400', bg: 'bg-rose-400/10' }
  ];

  const validateForm = () => {
    errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.category_id) errors.category_id = 'Select a category';
    
    const validObjectives = formData.learning_objectives.filter(obj => obj.trim());
    if (validObjectives.length === 0) errors.learning_objectives = 'Add at least one objective';

    const validCriteria = formData.assessment_criteria.filter(c => c.trim());
    if (validCriteria.length === 0) errors.assessment_criteria = 'Add at least one criteria';

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    isSubmitting = true;
    try {
      // Clean up arrays
      const cleanedData = {
        ...formData,
        learning_objectives: formData.learning_objectives.filter(obj => obj.trim()),
        assessment_criteria: formData.assessment_criteria.filter(c => c.trim()),
        resources: formData.resources.filter(r => r.trim())
      };

      const response = await fetch(`/api/skills/${skillData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        const { showToast } = await import('$lib/stores/toast');
        showToast.success('Skill updated successfully');
        goto('/panel/skills');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      const { showError } = await import('$lib/stores/toast');
      showError(error, 'Error updating the skill');
    } finally {
      isSubmitting = false;
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
      learning_objectives: [...(initial?.learning_objectives || [''])],
      assessment_criteria: [...(initial?.assessment_criteria || [''])],
      resources: [...(initial?.resources || [''])],
      icon: initial?.icon || '',
      resource_link: initial?.resource_link || '',
      order_index: initial?.order_index || 1,
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
      learning_objectives: (initial?.learning_objectives || ['']),
      assessment_criteria: (initial?.assessment_criteria || ['']),
      resources: (initial?.resources || ['']),
      icon: initial?.icon || '',
      resource_link: initial?.resource_link || '',
      order_index: initial?.order_index || 1,
      active: initial?.active ?? true
    })
  );

  // List Helpers
  const addItem = (list: string[]) => [...list, ''];
  const removeItem = (list: string[], index: number) => list.filter((_, i) => i !== index);
  
  const togglePrerequisite = (id: string) => {
    if (formData.prerequisites.includes(id)) {
      formData.prerequisites = formData.prerequisites.filter(p => p !== id);
    } else {
      formData.prerequisites = [...formData.prerequisites, id];
    }
  };

  const getDifficultyInfo = $derived(
    difficultyLevels.find(l => l.value === formData.difficulty) || difficultyLevels[0]
  );
</script>

<div class="min-h-screen bg-zinc-950 text-zinc-400 p-4 lg:p-8">
  <div class="max-w-[1400px] mx-auto space-y-8">
    
    <!-- Top Header & Actions -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-sm font-medium text-zinc-500 mb-2">
          <a href="/panel/skills" class="hover:text-violet-400 transition-colors">Skills</a>
          <span>/</span>
          <span class="text-zinc-300">Edit</span>
        </div>
        <div class="flex items-center gap-4">
          <button 
            onclick={() => goto('/panel/skills')}
            class="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          >
            <CaretLeft weight="bold" size={20} />
          </button>
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              {formData.name || 'Edit Skill'}
            </h1>
            <p class="text-zinc-500">Adjust the details and progression of this skill</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        {#if hasChanges}
           <button 
            onclick={() => showConfirmDiscard = true}
            class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all font-medium text-sm"
          >
            <ArrowCounterClockwise size={18} />
            Discard
          </button>
        {/if}

        <button 
          onclick={() => showPreview = !showPreview}
          class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-all font-medium text-sm"
        >
          {#if showPreview}
            <EyeSlash size={18} weight="duotone" />
            Hide Preview
          {:else}
            <Eye size={18} weight="duotone" />
            Live Preview
          {/if}
        </button>

        <button 
          onclick={handleSubmit}
          disabled={isSubmitting || !hasChanges}
          class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-violet-500/20"
        >
          {#if isSubmitting}
            <span class="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span>
            Please wait...
          {:else}
            <FloppyDisk size={20} weight="duotone" />
            Save Changes
          {/if}
        </button>
      </div>
    </header>

    <!-- Main Bento Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column: Primary Content -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Basic Configuration Card -->
        <section class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-8 space-y-8">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
              <Info size={24} weight="duotone" />
            </div>
            <h2 class="text-xl font-bold text-white">Main Configuration</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label for="skill_name" class="text-sm font-semibold text-zinc-300 ml-1">Skill Name</label>
              <input 
                id="skill_name"                bind:value={formData.name}
                type="text"
                placeholder="e.g., Pawn Endgames"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
              {#if errors.name}
                <p class="text-rose-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <WarningCircle size={14} /> {errors.name}
                </p>
              {/if}
            </div>

            <div class="space-y-2">
              <label for="category_id" class="text-sm font-semibold text-zinc-300 ml-1">Category</label>
              <select 
                id="category_id"                bind:value={formData.category_id}
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select category</option>
                {#each categories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              </select>
              {#if errors.category_id}
                 <p class="text-rose-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <WarningCircle size={14} /> {errors.category_id}
                </p>
              {/if}
            </div>

            <div class="md:col-span-2 space-y-2">
              <label for="skill_description" class="text-sm font-semibold text-zinc-300 ml-1">Learning Description</label>
              <textarea 
                id="skill_description"                bind:value={formData.description}
                rows="4"
                placeholder="Describe what the student will learn..."
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none"
              ></textarea>
              {#if errors.description}
                <p class="text-rose-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <WarningCircle size={14} /> {errors.description}
                </p>
              {/if}
            </div>

            <div class="space-y-4">
              <p class="text-sm font-semibold text-zinc-300 ml-1">Difficulty Level</p>
              <div class="flex flex-wrap gap-2">
                {#each difficultyLevels as level}
                  <button 
                    onclick={() => formData.difficulty = level.value}
                    class="px-4 py-2.5 rounded-2xl border transition-all text-sm font-medium flex items-center gap-2
                    {formData.difficulty === level.value 
                      ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}"
                  >
                    <Star weight={formData.difficulty >= level.value ? 'fill' : 'regular'} size={16} />
                    {level.label}
                  </button>
                {/each}
              </div>
            </div>

            <div class="space-y-2">
              <label for="estimated_hours" class="text-sm font-semibold text-zinc-300 ml-1">Time Investment (Hours)</label>
              <div class="relative">
                <input 
                  id="estimated_hours"                  bind:value={formData.estimated_hours}
                  type="number"
                  step="0.5"
                  min="0.5"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all pl-12"
                />
                <Clock size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>
          </div>
        </section>

        <!-- Learning Path Section (Objectives & Criteria) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Objectives Card -->
          <section class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                  <Lightbulb size={20} weight="duotone" />
                </div>
                <h3 class="font-bold text-white">Objectives</h3>
              </div>
              <button 
                onclick={() => formData.learning_objectives = addItem(formData.learning_objectives)}
                class="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
              >
                <Plus weight="bold" size={16} />
              </button>
            </div>

            <div class="space-y-4">
              {#each formData.learning_objectives as objective, i}
                <div class="group relative flex items-start gap-3 bg-zinc-950/50 border border-zinc-800 p-3 rounded-2xl hover:border-zinc-700 transition-all">
                  <div class="text-xs font-bold text-zinc-700 mt-2.5 ml-1">0{i+1}</div>
                  <textarea 
                    bind:value={formData.learning_objectives[i]}
                    placeholder="Describe an objective..."
                    rows="2"
                    class="w-full bg-transparent text-sm text-zinc-300 focus:outline-none resize-none"
                  ></textarea>
                  <button 
                    onclick={() => formData.learning_objectives = removeItem(formData.learning_objectives, i)}
                    class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all shrink-0"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              {/each}
              {#if errors.learning_objectives}
                <p class="text-rose-400 text-xs flex items-center gap-1"><WarningCircle /> {errors.learning_objectives}</p>
              {/if}
            </div>
          </section>

          <!-- Criteria Card -->
          <section class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Certificate size={20} weight="duotone" />
                </div>
                <h3 class="font-bold text-white">Assessment Criteria</h3>
              </div>
              <button 
                onclick={() => formData.assessment_criteria = addItem(formData.assessment_criteria)}
                class="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
              >
                <Plus weight="bold" size={16} />
              </button>
            </div>

            <div class="space-y-4">
              {#each formData.assessment_criteria as criteria, i}
                <div class="group relative flex items-start gap-3 bg-zinc-950/50 border border-zinc-800 p-3 rounded-2xl hover:border-zinc-700 transition-all">
                  <div class="text-xs font-bold text-zinc-700 mt-2.5 ml-1">C{i+1}</div>
                  <textarea 
                    bind:value={formData.assessment_criteria[i]}
                    placeholder="Evaluation criteria..."
                    rows="2"
                    class="w-full bg-transparent text-sm text-zinc-300 focus:outline-none resize-none"
                  ></textarea>
                  <button 
                    onclick={() => formData.assessment_criteria = removeItem(formData.assessment_criteria, i)}
                    class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all shrink-0"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              {/each}
              {#if errors.assessment_criteria}
                <p class="text-rose-400 text-xs flex items-center gap-1"><WarningCircle /> {errors.assessment_criteria}</p>
              {/if}
            </div>
          </section>
          <!-- Resources Card -->
          <section class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Books size={20} weight="duotone" />
                </div>
                <h3 class="font-bold text-white">Suggested Resources</h3>
              </div>
              <button 
                onclick={() => formData.resources = addItem(formData.resources)}
                class="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
              >
                <Plus weight="bold" size={16} />
              </button>
            </div>

            <div class="space-y-4">
              {#each formData.resources as resource, i}
                <div class="group relative flex items-start gap-3 bg-zinc-950/50 border border-zinc-800 p-3 rounded-2xl hover:border-zinc-700 transition-all">
                  <div class="text-xs font-bold text-zinc-700 mt-2.5 ml-1">R{i+1}</div>
                  <textarea 
                    bind:value={formData.resources[i]}
                    placeholder="Book, video, or link..."
                    rows="2"
                    class="w-full bg-transparent text-sm text-zinc-300 focus:outline-none resize-none"
                  ></textarea>
                  <button 
                    onclick={() => formData.resources = removeItem(formData.resources, i)}
                    class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all shrink-0"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              {/each}
            </div>
          </section>

        </div>

        <!-- Dependencies Section -->
        <section class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-8 space-y-6">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Target size={24} weight="duotone" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Dependencies</h2>
              <p class="text-sm text-zinc-500">Skills the student must master beforehand</p>
            </div>
          </div>

          {#if availablePrerequisites.length === 0}
            <div class="text-center py-12 bg-zinc-950/50 rounded-3xl border border-zinc-800 border-dashed">
              <p class="text-zinc-500 italic">No previous skills configured yet.</p>
            </div>
          {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {#each availablePrerequisites as skill}
                <button 
                  onclick={() => togglePrerequisite(skill.id)}
                  class="flex items-center justify-between p-4 rounded-2xl border transition-all text-left
                  {formData.prerequisites.includes(skill.id) 
                    ? 'bg-violet-600/10 border-violet-500 text-white' 
                    : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'}"
                >
                  <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg {formData.prerequisites.includes(skill.id) ? 'bg-violet-500 text-white' : 'bg-zinc-900 text-zinc-600'}">
                       {#if formData.prerequisites.includes(skill.id)}
                         <Check weight="bold" size={14} />
                       {:else}
                         <Target size={14} />
                       {/if}
                    </div>
                    <span class="text-sm font-medium line-clamp-1">{skill.name}</span>
                  </div>
                </button>
              {/each}
            </div>
          {/if}
        </section>
      </div>

      <!-- Right Column: Metadata & Sidebar -->
      <aside class="lg:col-span-4 space-y-6">
        
        <!-- Status Card -->
        <section class="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-white">Content Status</h3>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Active?</span>
              <button 
                onclick={() => formData.active = !formData.active}
                aria-label="Toggle skill status"
                class="w-12 h-6 rounded-full relative transition-all duration-300 
                {formData.active ? 'bg-violet-600' : 'bg-zinc-800'}"
              >
                <div class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all transform 
                {formData.active ? 'translate-x-6' : 'translate-x-0'}"></div>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center">
              <span class="block text-2xl font-bold text-white mb-0.5">{formData.learning_objectives.filter(o => o.trim()).length}</span>
              <span class="text-[10px] font-bold uppercase text-zinc-500">Objectives</span>
            </div>
            <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center">
              <span class="block text-2xl font-bold text-white mb-0.5">{formData.assessment_criteria.filter(c => c.trim()).length}</span>
              <span class="text-[10px] font-bold uppercase text-zinc-500">Criteria</span>
            </div>
          </div>

          <div class="pt-4 border-t border-zinc-800 space-y-3">
             <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">Suggested Progression</span>
              <span class="text-white font-medium">Auto-ordered</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">Last Modified</span>
              <span class="text-zinc-400 italic">Today</span>
            </div>
          </div>
        </section>

        <!-- Preview Card -->
        {#if showPreview}
          <section in:fade out:fade class="bg-violet-600 border border-violet-500 rounded-[24px] p-8 text-white space-y-6 shadow-2xl shadow-violet-500/40">
            <div class="flex items-center justify-between">
              <div class="p-3 bg-white/10 rounded-2xl backdrop-blur-xl">
                <Target size={32} weight="duotone" />
              </div>
              <div class="flex items-center gap-1">
                {#each [1,2,3,4,5] as star}
                  <Star weight={formData.difficulty >= star ? 'fill' : 'regular'} size={14} class="text-white/50 {formData.difficulty >= star ? 'text-yellow-300' : ''}" />
                {/each}
              </div>
            </div>

            <div>
              <h3 class="text-2xl font-bold line-clamp-2">{formData.name || 'Skill Name'}</h3>
              <p class="text-white/80 text-sm mt-3 leading-relaxed line-clamp-4">
                {formData.description || 'Describe your skill to see how it looks...'}
              </p>
            </div>

            <div class="flex items-center gap-4 pt-4 border-t border-white/20">
              <div class="flex items-center gap-2">
                <Clock size={16} />
                <span class="text-xs font-bold">{formData.estimated_hours}h</span>
              </div>
              <div class="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {getDifficultyInfo.label}
              </div>
            </div>
          </section>
        {/if}

        <section class="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 space-y-4">
          <div class="flex items-center gap-2 text-white font-semibold italic text-sm">
            <Lightbulb size={18} class="text-amber-400" />
            Coach's Tips
          </div>
          <p class="text-xs text-zinc-500 leading-relaxed italic">
            "For effective learning, aim for each skill to take no more than 3-5 hours of study before applying a practical assessment criterion."
          </p>
        </section>

      </aside>
    </div>
  </div>
</div>

<!-- Discard Changes Modal -->
{#if showConfirmDiscard}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onclick={() => showConfirmDiscard = false}></div>
    <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 max-w-md w-full relative z-10 shadow-2xl" in:fly={{ y: 20 }}>
      <div class="p-4 bg-rose-500/10 text-rose-500 rounded-2xl w-fit mb-6">
        <ArrowCounterClockwise size={32} />
      </div>
      <h3 class="text-2xl font-bold text-white mb-2">Discard changes?</h3>
      <p class="text-zinc-400 mb-8 leading-relaxed">
        You will lose all adjustments made in this session. This action cannot be undone.
      </p>
      <div class="flex flex-col gap-3">
        <button 
          onclick={resetForm}
          class="w-full py-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20"
        >
          Yes, discard changes
        </button>
        <button 
          onclick={() => showConfirmDiscard = false}
          class="w-full py-4 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all"
        >
          Continue editing
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom thin scrollbar for textareas */
  textarea::-webkit-scrollbar {
    width: 4px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 10px;
  }
  
  /* Hide arrows in number input */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
