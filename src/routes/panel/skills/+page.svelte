<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { 
    Target, 
    Plus, 
    PencilSimple, 
    Trash,
    BookOpen,
    Trophy,
    CaretRight,
    MagnifyingGlass,
    Stack,
    Star,
    Sparkle,
    DownloadSimple,
    Sword,
    ChartBar,
    Tag,
    TrendUp,
    Clock,
    CirclesThreePlus,
    SquaresFour,
    DotsThreeVertical,
    CheckCircle,
    Graph,
    TrendDown,
    Path,
    Lightning,
    FilePdf,
    FileArrowUp,
    FileArrowDown,
    Brain,
    Link,
    PencilLine,
    X,
    CaretDown
  } from 'phosphor-svelte';
  import { loadTranslations, t } from '$lib/i18n';
  import { toast } from '$lib/stores/toast';
  import { appStore } from '$lib/stores/appStore';
  import { uiStore } from '$lib/stores/uiStore';
  import { CHESS_SYLLABUS_PRESETS } from '$lib/constants/chess-presets';
  import { 
    fade, 
    fly, 
    slide, 
    scale 
  } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import type { Skill, Category, SkillWithDetails } from '$lib/types';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let searchQuery = $state('');
  let selectedCategory = $state('all');
  let hoveredSkillId = $state<string | null>(null);
  let isImporting = $state(false);
  let showImportModal = $state(false);
  let isGrouped = $state(true);
  let fileInput = $state<HTMLInputElement>();

  // Local state for smooth DnD transitions, initialized from store/data
  let skillsState = $state<SkillWithDetails[]>([]);
  let isDragging = $state(false);

  $effect(() => {
    if (!isDragging) {
      const source = (($appStore?.skills?.length || 0) > 0 ? $appStore.skills : (data?.skills || [])).filter(Boolean);
      skillsState = [...source] as SkillWithDetails[];
    }
  });

  const skills = $derived(skillsState);

  const categories = $derived([
    { id: 'all', name: $t('common.all'), count: skills.length },
    ...(data?.categories || []).filter(Boolean).map((c: any) => ({ 
      id: c.id || c.name, 
      name: c.name, 
      count: c.count || 0 
    }))
  ]);

  let filteredSkills = $derived(
    skills
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const catId = typeof s.category === 'string' ? s.categoryId : (s.category?.id || s.categoryId);
        const matchesCategory = selectedCategory === 'all' || catId === selectedCategory || s.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
  );

  let skillsByCategory = $derived(
    (data?.categories || []).filter(Boolean).map((cat: any) => ({
      ...cat,
      items: filteredSkills.filter((s) => {
        const sCatId = typeof s.category === 'string' ? s.categoryId : (s.category?.id || s.categoryId);
        return sCatId === (cat.id || cat.name) || s.category === cat.name;
      })
    })).filter((cat: any) => cat.items.length > 0 || selectedCategory === cat.id)
  );

  const stats = $derived({
    total: skills.length,
    mastered: skills.filter((s) => (s.studentsMastered || 0) > 0).length,
    advanced: skills.filter((s) => (Number(s.difficulty) || 0) >= 4).length,
    hours: skills.reduce((acc, s) => acc + (Number(s.estimatedHours) || 0), 0)
  });

  let skillToDelete = $state<{id: string, name: string} | null>(null);
  let deleteForm = $state<HTMLFormElement | null>(null);
  let deleteMultipleForm = $state<HTMLFormElement | null>(null);
  let clearSyllabusForm = $state<HTMLFormElement | null>(null);
  let importCurriculumForm = $state<HTMLFormElement | null>(null);
  let reorderForm = $state<HTMLFormElement | null>(null);

  let reorderingsData = $state<string>('[]');
  let importData = $state<string>('');

  const deleteSkill = async (id: string, name: string) => {
    const confirmed = await uiStore.confirm({
      title: $t('skills.delete_title'),
      message: $t('common.confirm_delete', { name }),
      type: 'danger',
      confirmText: $t('common.delete')
    });
    
    if (confirmed && deleteForm) {
      skillToDelete = { id, name };
      await tick();
      deleteForm.requestSubmit();
    }
  };

  const handleImportSyllabus = async () => {
    const confirmed = await uiStore.confirm({
      title: $t('skills.import_title'),
      message: $t('skills.import_confirm'),
      confirmText: $t('common.confirm')
    });

    if (confirmed && importCurriculumForm) {
      isImporting = true;
      importData = JSON.stringify(CHESS_SYLLABUS_PRESETS);
      await tick();
      importCurriculumForm.requestSubmit();
    }
  };


  const getResourceType = (resource: string) => {
    if (resource.includes('youtube.com') || resource.includes('vimeo')) return 'video';
    if (resource.toLowerCase().endsWith('.pdf')) return 'pdf';
    return 'link';
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Lightning;
      case 'pdf': return FilePdf;
      default: return Link;
    }
  };

  const getResourceLabel = (type: string) => {
    switch (type) {
      case 'video': return $t('skills.ui.resource_video');
      case 'pdf': return $t('skills.ui.resource_pdf');
      default: return $t('skills.ui.resource_link');
    }
  };

  const getDifficultyColor = (diff: any) => {
    const d = typeof diff === 'number' ? diff : (diff === 'beginner' ? 1 : diff === 'intermediate' ? 3 : 5);
    if (d <= 2) return 'border-emerald-500/20 text-emerald-400';
    if (d <= 4) return 'border-amber-500/20 text-amber-400';
    return 'border-rose-500/20 text-rose-400';
  };

  const getDifficultyLabel = (diff: any, level?: string) => {
    if (level) return formatLabel(level);
    const d = typeof diff === 'number' ? diff : (diff === 'beginner' ? 1 : diff === 'intermediate' ? 3 : 5);
    if (d <= 1) return $t('skills.difficulty.entry');
    if (d <= 2) return $t('skills.difficulty.novice');
    if (d <= 3) return $t('skills.difficulty.intermediate');
    if (d <= 4) return $t('skills.difficulty.advanced');
    return $t('skills.difficulty.master');
  };

  // Bulk Selection Logic
  let selectedIds = $state<string[]>([]);
  let isSelectionMode = $state(false);

  const toggleSkillSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter(i => i !== id);
    } else {
      selectedIds = [...selectedIds, id];
    }
  };

  const selectAllFiltered = () => {
    selectedIds = filteredSkills.map(s => s.id);
  };

  const deselectAll = () => {
    selectedIds = [];
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    const count = selectedIds.length;
    const confirmed = await uiStore.confirm({
      title: $t('skills.ui.delete_selected', { count }),
      message: $t('common.confirm_delete_multiple', { count }),
      type: 'danger',
      confirmText: $t('common.delete')
    });

    if (confirmed && deleteMultipleForm) {
      await tick();
      deleteMultipleForm.requestSubmit();
    }
  };

  const deleteAll = async () => {
    if (skills.length === 0) return;

    const confirmed = await uiStore.confirm({
      title: $t('skills.ui.delete_all'),
      message: $t('skills.ui.delete_all_confirm'),
      type: 'danger',
      confirmText: $t('common.delete')
    });

    if (confirmed && clearSyllabusForm) {
      await tick();
      clearSyllabusForm.requestSubmit();
    }
  };

  // Drag & Drop Handling
  const dragDuration = 300;

  function handleDndConsider(categoryId: string, e: CustomEvent<any>) {
    const { items: newItems } = e.detail;
    isDragging = true;
    
    if (categoryId === 'all') {
      skillsState = newItems;
    } else {
      // Update only items in this category within the global list
      const otherSkills = skillsState.filter(s => {
        const sCatId = typeof s.category === 'string' ? s.categoryId : (s.category?.id || s.categoryId);
        return sCatId !== categoryId && s.category !== categoryId;
      });
      skillsState = [...otherSkills, ...newItems].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  }

  const handleDndFinalize = async (categoryId: string, e: CustomEvent<any>) => {
    const { items: newItems } = e.detail;
    isDragging = false;
    
    // Update local state first for immediate feedback
    if (categoryId === 'all') {
      skillsState = newItems;
    } else {
      const otherSkills = skillsState.filter(s => {
        const sCatId = typeof s.category === 'string' ? s.categoryId : (s.category?.id || s.categoryId);
        return sCatId !== categoryId && s.category !== categoryId;
      });
      skillsState = [...otherSkills, ...newItems];
    }

    // Prepare reordering payload
    const orderedList = categoryId === 'all' ? newItems : [...skillsState].sort((a,b) => (a.order || 0) - (b.order || 0)); 
    const reorderings = orderedList.map((item: any, index: number) => ({
      id: item.id,
      order: index
    }));

    if (reorderForm) {
      reorderingsData = JSON.stringify(reorderings);
      await tick();
      reorderForm.requestSubmit();
    }
  };

  // Keyboard Shortcuts
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isSelectionMode) {
      isSelectionMode = false;
      selectedIds = [];
    }
  }

  onMount(() => {
    loadTranslations(['skills', 'common', 'nav']);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const formatLabel = (str: string | undefined | null) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };
</script>

<form method="POST" action="?/delete" use:enhance={() => {
  uiStore.setLoading(true);
  return async ({ result }) => {
    uiStore.setLoading(false);
    if (result.type === 'success') {
      toast.success($t('common.delete_success') || 'Deleted successfully');
    }
    skillToDelete = null;
  };
}} bind:this={deleteForm} class="hidden">
  <input type="hidden" name="id" value={skillToDelete?.id} />
</form>

<form method="POST" action="?/deleteMultiple" use:enhance={() => {
  uiStore.setLoading(true);
  return async ({ result }) => {
    uiStore.setLoading(false);
    if (result.type === 'success') {
      selectedIds = [];
      isSelectionMode = false;
      toast.success($t('common.delete_success') || 'Deleted successfully');
    }
  };
}} bind:this={deleteMultipleForm} class="hidden">
  <input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
</form>

<form method="POST" action="?/clearSyllabus" use:enhance={() => {
  uiStore.setLoading(true);
  return async ({ result }) => {
    uiStore.setLoading(false);
    if (result.type === 'success') {
      selectedIds = [];
      isSelectionMode = false;
      toast.success($t('common.delete_success') || 'Syllabus deleted');
    }
  };
}} bind:this={clearSyllabusForm} class="hidden"></form>

<form method="POST" action="?/importCurriculum" use:enhance={() => {
  isImporting = true;
  return async ({ result }) => {
    isImporting = false;
    if (result.type === 'success') {
      toast.success($t('skills.import_success') || 'Syllabus imported');
    }
  };
}} bind:this={importCurriculumForm} class="hidden">
  <input type="hidden" name="curriculum" value={importData} />
</form>

<form method="POST" action="?/reorder" use:enhance={() => {
  return async ({ result }) => {
    if (result.type === 'success') {
      toast.success($t('skills.reorder_success') || 'Sort order updated');
    }
  };
}} bind:this={reorderForm} class="hidden">
  <input type="hidden" name="reorderings" value={reorderingsData} />
</form>


<svelte:head>
  <title>{$t('skills.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" in:fade>
  
  <!-- Header Section -->
  <header class="pt-12 mb-16 space-y-8" in:fly={{ y: 20, duration: 800 }}>
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <div class="h-[2px] w-8 bg-violet-500"></div>
        <h2 class="text-violet-400 text-[10px] font-black uppercase tracking-[0.4em]">{$t('nav.skills')}</h2>
      </div>
      <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div class="max-w-3xl">
          <h1 class="text-5xl lg:text-7xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.85]">
            Academia de <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-white to-primary-300 italic">Alto Rendimiento</span>
          </h1>
          <p class="text-zinc-500 text-lg font-medium tracking-tight font-jakarta mt-6 border-l-2 border-white/5 pl-6 max-w-xl">
            Gestiona el mapa de competencias de tus alumnos con un sistema de progresión técnica avanzado y visual.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center gap-4">
          <button 
            onclick={() => handleImportSyllabus()}
            class="px-6 h-14 bg-zinc-950/40 backdrop-blur-xl border border-white/5 text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 group"
          >
            <Lightning weight="fill" size={18} class="text-amber-400 group-hover:scale-110 transition-transform" />
            {$t('skills.import_title')}
          </button>

          <button 
            onclick={() => goto('/panel/skills/create')}
            class="px-10 h-14 bg-white text-black hover:bg-violet-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl active:scale-95"
          >
            <Plus weight="bold" size={18} />
            {$t('skills.create_title')}
          </button>
        </div>
      </div>
    </div>
  </header>

  {#if skills.length === 0}
    <div 
      class="relative bento-card border-dashed border-white/10 p-20 flex flex-col items-center justify-center text-center gap-10 group overflow-hidden"
      in:fly={{ y: 20, duration: 600 }}
    >
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
      
      <div class="relative w-32 h-32 bg-zinc-900 border border-white/10 flex items-center justify-center text-violet-400 shadow-2xl">
        <Target weight="fill" class="w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
        <div class="absolute inset-0 bg-violet-500/10 blur-2xl"></div>
      </div>

      <div class="space-y-6 max-w-2xl relative z-10">
        <h2 class="text-5xl font-outfit font-black text-white uppercase italic tracking-tighter leading-none">
          {$t('skills.ui.no_skills_title') || 'Academia Vacía'}
        </h2>
        <p class="text-zinc-500 font-bold uppercase tracking-widest text-sm leading-relaxed max-w-md mx-auto">
          {$t('skills.ui.no_skills_subtitle') || 'INICIA TU PROGRAMA ACADÉMICO IMPORTANDO UN TEMARIO O CREANDO UNA LECCIÓN DESDE CERO.'}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-6 relative z-10">
        <button 
          onclick={() => handleImportSyllabus()}
          class="bg-white text-black hover:bg-violet-600 hover:text-white px-16 py-6 font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all active:scale-95 flex items-center gap-4"
        >
          <Lightning weight="fill" class="w-5 h-5" />
          {$t('skills.import_cta')}
        </button>
      </div>
    </div>
  {/if}

  <!-- Stats Bento -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
    <!-- Total Topics -->
    <div class="bento-card group p-8 bg-zinc-950/40 backdrop-blur-xl border border-white/5 hover:border-violet-500/30 transition-all duration-500">
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 bg-white/[0.03] border border-white/5 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/10 group-hover:text-white transition-all">
          <SquaresFour weight="fill" class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] opacity-60 group-hover:text-violet-300 transition-colors">Contenido Total</span>
      </div>
      <div class="space-y-1">
        <span class="text-5xl font-black text-white block leading-none tracking-tighter font-outfit">{stats.total}</span>
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic opacity-50">{$t('skills.ui.global_topics')}</span>
      </div>
    </div>

    <!-- Advanced -->
    <div class="bento-card group p-8 bg-zinc-950/40 backdrop-blur-xl border border-white/5 hover:border-amber-500/30 transition-all duration-500">
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 bg-white/[0.03] border border-white/5 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/10 group-hover:text-white transition-all">
          <Star weight="fill" class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] opacity-60 group-hover:text-amber-300 transition-colors">Nivel Élite</span>
      </div>
      <div class="space-y-1">
        <span class="text-5xl font-black text-white block leading-none tracking-tighter font-outfit">{stats.advanced}</span>
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic opacity-50">{$t('skills.ui.advanced_mastery')}</span>
      </div>
    </div>

    <!-- Duration -->
    <div class="bento-card group p-8 hover:bg-white/5 transition-all duration-500">
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
          <Clock weight="fill" class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Tiempo Estimado</span>
      </div>
      <div class="space-y-1">
        <div class="flex items-baseline gap-2">
          <span class="text-5xl font-black text-white block leading-none tracking-tighter font-outfit">{stats.hours}</span>
          <span class="text-xl font-bold text-zinc-600 italic">H</span>
        </div>
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest italic">{$t('skills.ui.course_duration')}</span>
      </div>
    </div>

    <!-- Premium Info -->
    <div class="bento-card group p-8 bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500">
      <div class="flex justify-between items-start mb-8">
        <div class="w-12 h-12 bg-white flex items-center justify-center text-black">
          <Trophy weight="fill" class="w-6 h-6" />
        </div>
        <div class="text-[9px] font-black text-white uppercase tracking-widest border border-white/20 px-2 py-1 italic">
          {$t('skills.ui.premium_path')}
        </div>
      </div>
      <div class="space-y-1">
        <h4 class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Estatus Curricular</h4>
        <p class="text-2xl font-black text-white tracking-tighter uppercase italic leading-tight">
          TOP 10% ACADEMY
        </p>
      </div>
    </div>
  </div>

  <!-- Syllabus Progress Indicator -->

  <!-- Search & Toggles Bar -->
  <div class="sticky top-6 z-40 mb-12">
    <div class="bento-card p-2 flex flex-col lg:flex-row gap-2 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <div class="flex-1 relative group">
        <MagnifyingGlass class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
        <input 
          id="skill-search"
          type="text" 
          bind:value={searchQuery} 
          placeholder={$t('skills.ui.search_placeholder').toUpperCase()} 
          class="w-full bg-white/5 border border-white/5 focus:border-violet-500/50 py-5 pl-14 pr-6 text-white focus:outline-none transition-all font-outfit font-black uppercase tracking-widest text-[10px] placeholder:text-zinc-600" 
        />
      </div>
      
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative min-w-[200px] group">
          <select 
            id="skill-category-filter"
            bind:value={selectedCategory} 
            class="w-full bg-white/5 border border-white/5 hover:border-violet-500/30 p-5 pr-12 text-white font-outfit font-black uppercase tracking-widest text-[10px] focus:outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="all">{$t('skills.category_all').toUpperCase()}</option>
            {#each categories.filter(c => c.id !== 'all') as category}
              <option value={category.id}>{formatLabel(category.name).toUpperCase()}</option>
            {/each}
          </select>
          <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-violet-400 transition-colors">
            <CaretDown weight="bold" size={14} />
          </div>
        </div>

        <button 
          onclick={() => { 
            isSelectionMode = !isSelectionMode;
            if (!isSelectionMode) selectedIds = [];
          }} 
          class="px-6 py-5 border transition-all font-outfit font-black uppercase tracking-widest text-[10px] flex items-center gap-3 {isSelectionMode ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'}"
        >
          <CheckCircle weight={isSelectionMode ? 'fill' : 'bold'} class="w-4 h-4" />
          {$t('skills.ui.select_skills')}
        </button>

        <button 
          onclick={() => isGrouped = !isGrouped} 
          class="px-6 py-5 border transition-all font-outfit font-black uppercase tracking-widest text-[10px] flex items-center gap-3 {isGrouped ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'}"
        >
          <Path weight="bold" class="w-4 h-4" />
          {$t('skills.ui.group_by_category')}
        </button>
      </div>
    </div>
  </div>

  <!-- Main View -->
  {#if isGrouped}
    <div class="space-y-24 py-20">
      {#each skillsByCategory as module}
        <section class="space-y-8" in:fade>
          <div class="flex items-end gap-6 border-b border-white/10 pb-6 relative group/header">
            <div class="absolute right-0 bottom-0 text-[100px] font-black text-white/[0.02] leading-none select-none pointer-events-none uppercase italic tracking-tighter group-hover/header:text-white/[0.04] transition-all">
              {formatLabel(module.name)}
            </div>
            <div class="w-16 h-16 bg-violet-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-violet-600/20">
              <SquaresFour weight="fill" class="w-8 h-8" />
            </div>
            <div class="space-y-1 relative z-10">
              <p class="text-[10px] font-black text-violet-500 uppercase tracking-[0.4em]">Sección de Módulo</p>
              <h3 class="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{formatLabel(module.name)}</h3>
              <p class="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] italic">{module.items.length} Lecciones Disponibles</p>
            </div>
          </div>
          <div 
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            use:dndzone={{ 
              items: module.items, 
              dragDisabled: isSelectionMode || searchQuery !== '', 
              flipDurationMs: dragDuration,
              dropTargetStyle: { outline: '2px dashed rgba(139, 92, 246, 0.5)', borderRadius: '0px' }
            }}
            onconsider={(e) => handleDndConsider(module.id, e)}
            onfinalize={(e) => handleDndFinalize(module.id, e)}
          >
            {#each module.items as skill (skill.id)}
              <div animate:flip={{ duration: dragDuration }}>
                {@render SkillCardComp({ skill: skill as SkillWithDetails, getDifficultyColor, getResourceType, getResourceIcon, getResourceLabel, deleteSkill })}
              </div>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {:else if filteredSkills.length > 0}
    <div 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10"
      use:dndzone={{ 
        items: filteredSkills, 
        dragDisabled: isSelectionMode || searchQuery !== '' || isGrouped, 
        flipDurationMs: dragDuration,
        dropTargetStyle: { outline: '2px dashed rgba(139, 92, 246, 0.5)', borderRadius: '0px' }
      }}
      onconsider={(e) => handleDndConsider('all', e)}
      onfinalize={(e) => handleDndFinalize('all', e)}
    >
      {#each filteredSkills as skill (skill.id)}
        <div animate:flip={{ duration: dragDuration }}>
          {@render SkillCardComp({ skill: skill as SkillWithDetails, getDifficultyColor, getResourceType, getResourceIcon, getResourceLabel, deleteSkill })}
        </div>
      {/each}
    </div>
  {:else}
    <div class="py-32 flex flex-col items-center justify-center text-center space-y-10" in:fade>
      <div class="relative">
        <div class="w-32 h-32 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-700 animate-pulse">
          <Target weight="thin" class="w-16 h-16" />
        </div>
        <div class="absolute -bottom-4 -right-4 w-12 h-12 bg-violet-600 flex items-center justify-center text-white shadow-2xl">
          <Sparkle weight="bold" class="w-6 h-6 rotate-12" />
        </div>
      </div>
      
      <div class="space-y-3 max-w-md">
        <h3 class="text-3xl font-black text-white uppercase italic tracking-tighter">
          {searchQuery ? $t('common.no_results') : $t('skills.ui.no_skills_title') || 'TU ACADEMIA ESTÁ VACÍA'}
        </h3>
        <p class="text-zinc-500 font-medium leading-relaxed">
          {searchQuery ? $t('common.no_results_subtitle') : $t('skills.ui.no_skills_subtitle') || 'Comienza creando tu primera lección o importa un temario completo con un solo clic.'}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-6">
        <button 
          onclick={() => handleImportSyllabus()}
          class="group p-8 bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 transition-all flex flex-col items-center gap-6 text-center shadow-2xl"
        >
          <div class="w-16 h-16 bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Stack weight="fill" class="w-8 h-8" />
          </div>
          <div>
            <h4 class="text-white font-black uppercase tracking-tighter text-xl italic mb-2">{$t('skills.import_title')}</h4>
            <p class="text-zinc-500 text-xs font-bold leading-relaxed">{$t('skills.import_confirm')}</p>
          </div>
          <div class="mt-auto pt-6 w-full">
             <div class="w-full py-4 bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] group-hover:bg-zinc-750 transition-colors flex items-center justify-center gap-2 border border-white/5">
               <Lightning weight="fill" class="w-4 h-4 text-amber-400" />
               {$t('skills.import_cta')}
             </div>
          </div>
        </button>
      </div>

      <div class="flex items-center gap-4 text-zinc-600">
        <div class="w-12 h-px bg-zinc-800"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.3em]">{$t('common.or') || 'O BIEN'}</span>
        <div class="w-12 h-px bg-zinc-800"></div>
      </div>

      <button 
        onclick={() => goto('/panel/skills/create')}
        class="group px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center gap-3 active:scale-95 shadow-xl"
      >
        <Plus weight="bold" class="w-5 h-5 group-hover:rotate-90 transition-transform" />
        {$t('skills.create_title')}
      </button>
      </div>
    </div>
  {/if}

  {#if isSelectionMode || selectedIds.length > 0}
    <div 
      class="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-5xl px-6"
      transition:fly={{ y: 150, duration: 800, easing: cubicOut }}
    >
      <div class="bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Stack weight="fill" class="w-8 h-8" />
          </div>
          <div>
            <p class="text-white font-outfit font-black uppercase text-xl tracking-tighter italic leading-none mb-1">
              {selectedIds.length} {selectedIds.length === 1 ? $t('skills.ui.item_selected') : $t('skills.ui.items_selected')}
            </p>
            <button 
              onclick={deselectAll}
              class="text-[11px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] transition-colors flex items-center gap-2 group"
            >
              <X weight="bold" class="w-3 h-3 group-hover:rotate-90 transition-transform" />
              {$t('skills.ui.deselect_all')}
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <button 
            onclick={selectAllFiltered}
            class="px-8 py-5 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-[11px] font-black uppercase tracking-[0.2em]"
          >
            {$t('common.select_all')}
          </button>
          
          <button 
            onclick={deleteAll}
            class="px-8 py-5 bg-rose-600/10 border border-rose-600/30 text-rose-500 hover:bg-rose-600 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 group/danger"
          >
            <Trash weight="fill" class="w-5 h-5 group-hover/danger:rotate-12 transition-transform" />
            {$t('skills.ui.delete_all')}
          </button>

          <button 
            onclick={deleteSelected}
            disabled={selectedIds.length === 0}
            class="px-12 py-5 bg-white text-black hover:bg-violet-600 hover:text-white disabled:opacity-20 disabled:grayscale transition-all text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-4 shadow-2xl"
          >
            <Trash weight="bold" class="w-5 h-5" />
            {$t('skills.ui.delete_selected', { count: selectedIds.length })}
          </button>
        </div>
      </div>
    </div>
  {/if}

</div>

{#snippet SkillCardComp({ skill, getDifficultyColor, getResourceType, getResourceIcon, getResourceLabel, deleteSkill }: { skill: SkillWithDetails, getDifficultyColor: (d: any) => string, getResourceType: (r: string) => string, getResourceIcon: (t: string) => any, getResourceLabel: (t: string) => string, deleteSkill: (id: string, name: string) => void })}
  {@const masteredCount = skill.studentsMastered || 0}
  {@const masteryProgress = Math.min((masteredCount / 20) * 100, 100)}
  {@const isSelected = selectedIds.includes(skill.id)}
  {@const orderNum = (Number(skill.order) || 0)}
  <div 
    class="group relative bento-card border {isSelected ? 'border-amber-500 bg-amber-500/5' : 'border-white/5 bg-zinc-950/40 backdrop-blur-xl'} p-0 hover:border-violet-500/40 transition-all duration-500 flex flex-col h-full cursor-pointer"
    onclick={() => isSelectionMode && toggleSkillSelection(skill.id)}
    onkeydown={(e) => isSelectionMode && (e.key === 'Enter' || e.key === ' ') && toggleSkillSelection(skill.id)}
    role="button"
    tabindex={isSelectionMode ? 0 : -1}
  >
    <!-- Card Header / Sequence -->
    <div class="flex items-stretch border-b border-white/5 group-hover:border-violet-500/20 transition-colors h-16">
      <div class="w-16 bg-white/[0.02] flex items-center justify-center border-r border-white/5 group-hover:bg-violet-600 transition-all">
        <span class="text-2xl font-black text-white italic font-outfit">#{orderNum.toString().padStart(2, '0')}</span>
      </div>
      <div class="flex-1 flex items-center justify-between px-6">
        <div class="px-3 py-1 bg-black/40 border border-white/5 text-[9px] font-black uppercase tracking-widest {getDifficultyColor(skill.difficulty)}">
          {getDifficultyLabel(skill.difficulty, skill.level).toUpperCase()}
        </div>
        
        <div class="flex gap-1">
          {#if isSelectionMode}
            <div class="w-8 h-8 border flex items-center justify-center transition-all {isSelected ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/5 bg-black/40'}">
              {#if isSelected}<CheckCircle weight="fill" class="w-5 h-5" />{/if}
            </div>
          {:else}
             <button 
                onclick={(e) => { e.stopPropagation(); goto(`/panel/skills/${skill.id}/edit`); }} 
                class="w-10 h-10 bg-white/5 hover:bg-white hover:text-black flex items-center justify-center text-zinc-500 transition-all border border-white/5"
              >
                <PencilLine weight="bold" class="w-5 h-5" />
              </button>
              <button 
                onclick={(e) => { e.stopPropagation(); deleteSkill(skill.id, skill.name); }} 
                class="w-10 h-10 bg-white/5 hover:bg-rose-600 hover:text-white flex items-center justify-center text-zinc-500 transition-all border border-white/5"
              >
                <Trash weight="bold" class="w-5 h-5" />
              </button>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="p-8 flex-1 space-y-6 relative overflow-hidden">
      <!-- Decoration -->
      <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-violet-600 opacity-0 blur-[60px] group-hover:opacity-[0.07] transition-opacity duration-700"></div>
      
      <div class="space-y-2 relative z-10">
        <h3 class="text-2xl font-black text-white leading-none uppercase tracking-tighter italic group-hover:text-primary-300 transition-colors">
          {formatLabel(skill.name)}
        </h3>
        <p class="text-zinc-500 text-xs font-bold uppercase tracking-wide line-clamp-2 italic leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
          {skill.description || $t('skills.ui.slogan')}
        </p>
      </div>

      {#if skill.resources && skill.resources.length > 0}
        <div class="flex flex-wrap gap-2 relative z-10">
          {#each skill.resources.slice(0, 3) as res}
            {@const type = getResourceType(res)}
            {@const Icon = getResourceIcon(type)}
            <div class="px-3 py-1.5 bg-zinc-900 border border-white/5 text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Icon weight="bold" class="w-3 h-3" />
              {getResourceLabel(type).toUpperCase()}
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Card Footer / Stats -->
    <div class="px-8 pb-8 space-y-4 relative z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-violet-600/10 flex items-center justify-center text-violet-500">
            <Clock weight="fill" class="w-4 h-4" />
          </div>
          <div>
            <p class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">DURACIÓN</p>
            <p class="text-xs font-black text-white leading-none">{skill.estimatedHours || 0}H</p>
          </div>
        </div>

        <div class="text-right">
           <p class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">MAESTRÍA</p>
           <p class="text-xs font-black text-white leading-none">{Math.round(masteryProgress)}%</p>
        </div>
      </div>
      
      <div class="h-1.5 bg-zinc-900 border border-white/5 overflow-hidden">
        <div class="h-full bg-white group-hover:bg-violet-500 transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.3)]" style="width: {masteryProgress}%"></div>
      </div>
    </div>
  </div>
{/snippet}

<style>
  :global(.no-scrollbar::-webkit-scrollbar) { display: none; }
</style>

