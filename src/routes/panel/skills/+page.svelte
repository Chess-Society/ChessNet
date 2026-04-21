<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
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
    X
  } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { toast } from 'svelte-french-toast';
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
  let isExtractingAI = $state(false);
  let isImporting = $state(false);
  let extractionProgress = $state(0);
  let showImportModal = $state(false);
  let isGrouped = $state(true);
  let fileInput = $state<HTMLInputElement>();

  // Local state for smooth DnD transitions, initialized from store/data
  let skillsState = $state<SkillWithDetails[]>([]);
  let isDragging = $state(false);

  $effect(() => {
    if (!isDragging) {
      const source = ($appStore?.skills?.length || 0) > 0 ? $appStore.skills : (data?.skills || []);
      skillsState = [...source] as SkillWithDetails[];
    }
  });

  const skills = $derived(skillsState);

  const categories = $derived([
    { id: 'all', name: $t('common.all'), count: skills.length },
    ...(data?.categories || []).map((c: any) => ({ 
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
        
        const catId = typeof s.category === 'string' ? s.category_id : (s.category?.id || s.category_id);
        const matchesCategory = selectedCategory === 'all' || catId === selectedCategory || s.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
  );

  let skillsByCategory = $derived(
    (data?.categories || []).map((cat: any) => ({
      ...cat,
      items: filteredSkills.filter((s) => {
        const sCatId = typeof s.category === 'string' ? s.category_id : (s.category?.id || s.category_id);
        return sCatId === (cat.id || cat.name) || s.category === cat.name;
      })
    })).filter((cat: any) => cat.items.length > 0 || selectedCategory === cat.id)
  );

  const stats = $derived({
    total: skills.length,
    mastered: skills.filter((s) => (s.students_mastered || 0) > 0).length,
    advanced: skills.filter((s) => s.level === 'advanced').length,
    hours: skills.reduce((acc, s) => acc + (Number(s.estimated_hours) || 0), 0)
  });

  const deleteSkill = async (id: string, name: string) => {
    const confirmed = await uiStore.confirm({
      title: $t('skills.delete_title'),
      message: $t('common.confirm_delete', { name }),
      type: 'danger',
      confirmText: $t('common.delete')
    });
    
    if (confirmed) {
      uiStore.setLoading(true);
      try {
        await appStore.removeSkill(id);
        toast.success($t('common.delete_success') || 'Deleted successfully');
      } catch (err) {
        console.error(err);
        toast.error($t('skills.delete_error') || 'Error deleting skill');
      } finally {
        uiStore.setLoading(false);
      }
    }
  };

  const handleImportSyllabus = async () => {
    const confirmed = await uiStore.confirm({
      title: $t('skills.import_title'),
      message: $t('skills.import_confirm'),
      confirmText: $t('common.confirm')
    });

    if (confirmed) {
      isImporting = true;
      try {
        await appStore.importCurriculum(CHESS_SYLLABUS_PRESETS);
        toast.success($t('skills.import_success') || 'Syllabus imported');
      } catch (err) {
        console.error(err);
        toast.error($t('skills.import_error') || 'Error importing syllabus');
      } finally {
        isImporting = false;
      }
    }
  };

  const handlePDFUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) extractFromPDF(file);
  };

  const extractFromPDF = async (file: File) => {
    const state = $appStore;
    const isPremium = state.settings?.plan === 'premium';
    
    if (!isPremium) {
      toast.error($t('pricing.premium.required'));
      return;
    }

    isExtractingAI = true;
    extractionProgress = 20;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/skills/import-ai', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract syllabus');
      }

      const { skills: extractedSkills } = await response.json();
      
      if (!extractedSkills || extractedSkills.length === 0) {
        throw new Error('No skills were extracted from the document');
      }

      // Update progress for visual feedback
      extractionProgress = 80;

      await appStore.importCurriculum(extractedSkills);
      extractionProgress = 100;
      
      setTimeout(() => {
        isExtractingAI = false;
        toast.success($t('skills.ui.extraction_complete'));
      }, 600);
      
    } catch (err: any) {
      console.error('AI Import Error:', err);
      isExtractingAI = false;
      
      // Explicit feedback for common errors
      let errorMsg = err.message || $t('skills.process_error') || 'Error processing PDF';
      if (errorMsg.includes('JSON')) {
        errorMsg = 'IA error: No se pudo generar una estructura válida. Intenta con otro PDF.';
      } else if (errorMsg.includes('fetch')) {
        errorMsg = 'Error de conexión con el servidor. Reintenta en unos instantes.';
      }
      
      toast.error(errorMsg, { duration: 5000 });
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
    const d = Number(diff) || (diff === 'beginner' ? 1 : diff === 'intermediate' ? 3 : 5);
    if (d <= 2) return 'from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/20';
    if (d <= 4) return 'from-orange-500/20 to-orange-500/5 text-orange-400 border-orange-500/20';
    return 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20';
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

    if (confirmed) {
      uiStore.setLoading(true);
      try {
        await appStore.removeMultipleSkills(selectedIds);
        selectedIds = [];
        isSelectionMode = false;
        toast.success($t('common.delete_success') || 'Deleted successfully');
      } catch (err) {
        console.error(err);
        toast.error($t('skills.delete_error') || 'Error deleting skills');
      } finally {
        uiStore.setLoading(false);
      }
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

    if (confirmed) {
      uiStore.setLoading(true);
      try {
        await appStore.clearSyllabus();
        selectedIds = [];
        isSelectionMode = false;
        toast.success($t('common.delete_success') || 'Syllabus deleted');
      } catch (err) {
        console.error(err);
        toast.error($t('skills.delete_error') || 'Error deleting syllabus');
      } finally {
        uiStore.setLoading(false);
      }
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
        const sCatId = typeof s.category === 'string' ? s.category_id : (s.category?.id || s.category_id);
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
        const sCatId = typeof s.category === 'string' ? s.category_id : (s.category?.id || s.category_id);
        return sCatId !== categoryId && s.category !== categoryId;
      });
      skillsState = [...otherSkills, ...newItems];
    }

    // Prepare reordering payload
    // We use the current index in the full list as the new order
    const orderedList = categoryId === 'all' ? newItems : [...skillsState].sort((a,b) => (a.order || 0) - (b.order || 0)); 
    
    // Better strategy: just update the orders for the items that changed
    const reorderings = orderedList.map((item, index) => ({
      id: item.id,
      order: index
    }));

    try {
      await appStore.reorderSkills(reorderings);
      toast.success($t('skills.reorder_success') || 'Sort order updated');
    } catch (err) {
      console.error(err);
      toast.error($t('skills.reorder_error') || 'Error reordering skills');
      // Revert state on error?
      isDragging = false;
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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<svelte:head>
  <title>{$t('skills.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12 pb-40" in:fade={{ duration: 400 }}>
  
  <!-- Premium Header -->
  <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
    <div class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="px-3 py-1 rounded-none bg-violet-500/10 border border-violet-500/20 text-[10px] font-black text-violet-400 uppercase tracking-widest font-outfit">
          {$t('skills.ui.academic_manager')}
        </div>
        <div class="w-1 h-1 rounded-none bg-zinc-800"></div>
        <div class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{$t('skills.ui.slogan')}</div>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-none flex items-center justify-center text-white shadow-2xl shadow-violet-600/20 relative group overflow-hidden">
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Path weight="duotone" class="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <h1 class="text-5xl font-black text-white tracking-tight uppercase italic drop-shadow-2xl font-outfit">
            {$t('skills.title')}
          </h1>
          <p class="text-zinc-500 text-lg font-bold flex items-center gap-3 mt-1 font-outfit">
            <Lightning weight="fill" class="w-5 h-5 text-amber-500" />
            {$t('skills.ui.slogan')}
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <!-- Main AI Import CTA -->
        <button 
          onclick={() => showImportModal = true}
          class="relative px-10 py-5 rounded-none bg-zinc-950 text-white border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.1)] hover:shadow-[0_0_60px_rgba(139,92,246,0.2)] hover:border-violet-500 transition-all flex items-center justify-center gap-4 text-xs font-black tracking-[0.2em] uppercase group overflow-hidden active:scale-95"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          
          <div class="relative flex items-center gap-3">
            <Sparkle weight="fill" class="w-5 h-5 text-violet-400 group-hover:rotate-[30deg] transition-transform duration-500" />
            <span class="italic">{$t('skills.import_title')}</span>
          </div>
          
          <div class="px-2 py-0.5 bg-violet-600 text-white text-[8px] font-black rounded-none shadow-lg">BETA AI</div>
        </button>

        <button 
          onclick={() => goto('/panel/skills/create')}
          class="px-10 py-5 rounded-none bg-white text-black shadow-2xl hover:shadow-white/10 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-xs font-black tracking-widest uppercase group active:scale-95"
        >
          <Plus weight="bold" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span>{$t('skills.create_title')}</span>
        </button>
    </div>
  </div>

  {#if skills.length === 0}
    <div 
      class="relative bg-zinc-900/20 border border-dashed border-white/5 p-12 lg:p-20 flex flex-col items-center justify-center text-center gap-8 group overflow-hidden"
      in:fly={{ y: 20, duration: 600 }}
    >
      <div class="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div class="relative w-24 h-24 bg-zinc-950 flex items-center justify-center border border-white/10 shadow-2xl">
        <div class="absolute inset-2 border border-violet-500/20 animate-pulse"></div>
        <FilePdf weight="duotone" class="w-12 h-12 text-violet-400" />
      </div>

      <div class="space-y-4 max-w-xl relative z-10">
        <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter">{$t('skills.ui.import_pdf') || 'Analysis de PDF con IA'}</h2>
        <p class="text-zinc-500 font-medium leading-relaxed">
          {$t('skills.ui.import_pdf_subtitle') || 'Sube el temario de tu escuela en PDF y nuestra IA extraerá automáticamente todas las lecciones, objetivos y recursos por ti.'}
        </p>
      </div>

      <button 
        onclick={() => showImportModal = true}
        class="bg-violet-600 hover:bg-violet-500 text-white px-12 py-5 rounded-none font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_15px_40px_rgba(139,92,246,0.3)] transition-all active:scale-95 flex items-center gap-4"
      >
        <Sparkle weight="fill" class="w-4 h-4" />
        {$t('skills.ui.extract_ai') || 'COMENZAR ANÁLISIS'}
      </button>
    </div>
  {/if}

  <!-- Stats Bento -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-none p-8 hover:bg-zinc-900/60 transition-all duration-500 shadow-2xl overflow-hidden relative">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/10 blur-3xl group-hover:bg-violet-600/20 transition-all duration-700"></div>
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 rounded-none bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-500">
          <SquaresFour weight="duotone" class="w-6 h-6" />
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-none bg-violet-500/10 text-violet-400 text-[9px] font-black uppercase tracking-wider">
          <TrendUp weight="bold" class="w-3 h-3" />
          {$t('skills.ui.active_tag')}
        </div>
      </div>
      <div class="space-y-1">
        <span class="text-4xl font-black text-white block tabular-nums leading-none font-outfit">{stats.total}</span>
        <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest font-jakarta">{$t('skills.ui.global_topics')}</span>
      </div>
    </div>

    <div class="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-none p-8 hover:bg-zinc-900/60 transition-all duration-500 shadow-2xl relative">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-600/10 blur-3xl group-hover:bg-amber-600/20 transition-all duration-700"></div>
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 rounded-none bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-500">
          <Star weight="duotone" class="w-6 h-6" />
        </div>
        <div class="text-[9px] font-black text-amber-400 uppercase tracking-widest border border-amber-500/20 px-3 py-1 rounded-none">{$t('skills.ui.level_avg')}</div>
      </div>
      <div class="space-y-1">
        <span class="text-4xl font-black text-white block tabular-nums leading-none font-outfit">{stats.advanced}</span>
        <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest font-jakarta">{$t('skills.ui.advanced_mastery')}</span>
      </div>
    </div>

    <div class="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-none p-8 hover:bg-zinc-900/60 transition-all duration-500 shadow-2xl relative">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 rounded-none bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
          <Clock weight="duotone" class="w-6 h-6" />
        </div>
        <div class="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-none font-outfit">{$t('skills.ui.estimates')}</div>
      </div>
      <div class="space-y-1">
        <span class="text-4xl font-black text-white block tabular-nums leading-none font-outfit">{stats.hours}<span class="text-xl text-zinc-500 ml-1">h</span></span>
        <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest font-jakarta">{$t('skills.ui.course_duration')}</span>
      </div>
    </div>

    <div class="group bg-gradient-to-br from-violet-600 to-indigo-700 rounded-none p-8 shadow-2xl shadow-indigo-600/20 relative overflow-hidden flex flex-col justify-between">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div class="relative z-10 flex justify-between items-start">
        <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-none flex items-center justify-center text-white">
          <Trophy weight="fill" class="w-6 h-6" />
        </div>
        <div class="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] bg-black/20 px-3 py-1 rounded-none font-outfit">{$t('skills.ui.premium_path')}</div>
      </div>
      <div class="relative z-10 space-y-4">
        <div>
          <h4 class="text-sm font-bold text-white/70 uppercase tracking-widest mb-1">{$t('skills.ui.advanced_mastery')}</h4>
          <p class="text-2xl font-black text-white">{stats.advanced} {$t('skills.ui.master_skills')}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- AI Progress Indicator (Visible when extracting) -->
  {#if isExtractingAI}
    <div class="relative group overflow-hidden bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-none p-1 shadow-2xl transition-all" transition:slide>
      <div class="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-blue-600/10 opacity-100"></div>
      <div class="relative bg-zinc-950/80 rounded-none p-8 flex flex-col md:flex-row items-center justify-between gap-10">
        <div class="flex items-center gap-6 flex-1">
          <div class="w-16 h-16 bg-violet-600/20 rounded-none flex items-center justify-center text-violet-500">
            <Brain weight="fill" class="w-8 h-8 animate-pulse" />
          </div>
          <div class="space-y-1">
            <h3 class="text-xl font-black text-white uppercase italic tracking-tight">{$t('skills.ui.extracting')}</h3>
            <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">{$t('skills.ui.import_pdf_subtitle')}</p>
          </div>
        </div>
        <div class="w-full md:w-80 space-y-3">
          <div class="flex justify-between text-[10px] font-black text-violet-400 uppercase tracking-widest">
            <span>{Math.round(extractionProgress)}%</span>
            <span>ANALIZANDO...</span>
          </div>
          <div class="h-2 bg-zinc-900 rounded-none border border-white/5 p-0.5 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-violet-600 to-blue-500 rounded-none transition-all duration-300" style="width: {extractionProgress}%"></div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Search & Toggles -->
  <div class="sticky top-6 z-40">
    <div class="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-3 rounded-none shadow-2xl flex flex-col lg:flex-row gap-3">
      <div class="flex-1 relative group">
        <label for="skill-search" class="sr-only">{$t('skills.ui.search_placeholder')}</label>
        <MagnifyingGlass class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
        <input 
          id="skill-search"
          type="text" 
          bind:value={searchQuery} 
          placeholder={$t('skills.ui.search_placeholder')} 
          class="w-full bg-zinc-950/50 border border-white/5 rounded-none py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium" 
        />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <label for="skill-category-filter" class="sr-only">{$t('skills.create.category')}</label>
        <select 
          id="skill-category-filter"
          bind:value={selectedCategory} 
          class="bg-zinc-950/50 border border-white/5 rounded-none p-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all min-w-[180px]"
        >
          <option value="all">{$t('skills.category_all')}</option>
          {#each categories.filter(c => c.id !== 'all') as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
        <button 
          onclick={() => { 
            isSelectionMode = !isSelectionMode;
            if (!isSelectionMode) selectedIds = [];
            else if (selectedIds.length === 0) toast(`${$t('common.info')}: ${$t('skills.ui.esc_to_exit')}`);
          }} 
          class="h-[60px] px-6 rounded-none border border-white/5 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all {isSelectionMode ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-zinc-950/50 text-zinc-400 hover:text-white'}"
          aria-pressed={isSelectionMode}
          aria-label={$t('skills.ui.select_skills')}
        >
          <CheckCircle weight={isSelectionMode ? 'fill' : 'bold'} class="w-4 h-4" />
          {$t('skills.ui.select_skills')}
        </button>
        <button onclick={() => isGrouped = !isGrouped} class="h-[60px] px-6 rounded-none border border-white/5 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all {isGrouped ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'bg-zinc-950/50 text-zinc-400 hover:text-white'}">
          <Path weight="bold" class="w-4 h-4" />
          {$t('skills.ui.group_by_category')}
        </button>
        <button onclick={handleImportSyllabus} disabled={isImporting} class="h-[60px] px-8 rounded-none bg-zinc-950/50 border border-white/5 text-white hover:bg-zinc-900 transition-all flex items-center gap-2 group/btn relative overflow-hidden">
          {#if isImporting}
            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-none animate-spin"></div>
          {:else}
            <Lightning weight="fill" class="w-5 h-5 text-yellow-400" />
          {/if}
          <span class="font-black uppercase tracking-[0.2em] text-[10px]">{$t('skills.import_cta')}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Main View -->
  {#if isGrouped}
    <div class="space-y-16 py-10">
      {#each skillsByCategory as module}
        <section class="space-y-8" in:fade>
          <div class="flex items-center gap-4 border-b border-white/5 pb-4">
            <div class="w-12 h-12 rounded-none bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <SquaresFour weight="fill" class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-2xl font-black text-white uppercase tracking-tight italic">{$t('skills.ui.module')}: {module.name}</h3>
              <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{module.items.length} {$t('skills.ui.lessons')}</p>
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
          onclick={() => showImportModal = true}
          class="group p-8 bg-zinc-900/50 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col items-center gap-6 text-center shadow-2xl relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="w-16 h-16 bg-violet-600/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative">
            <Brain weight="fill" class="w-8 h-8" />
            <Sparkle weight="fill" class="w-4 h-4 absolute -top-1 -right-1 animate-pulse text-white" />
          </div>
          <div>
            <h4 class="text-white font-black uppercase tracking-tighter text-xl italic mb-2 flex items-center justify-center gap-2">
              {$t('skills.ui.import_pdf')}
              <span class="px-1.5 py-0.5 bg-violet-500 text-black text-[8px] font-black not-italic tracking-normal">AI</span>
            </h4>
            <p class="text-zinc-500 text-xs font-bold leading-relaxed">{$t('skills.ui.import_pdf_subtitle')}</p>
          </div>
          <div class="mt-auto pt-6 w-full">
             <div class="w-full py-4 bg-violet-600 text-white font-black uppercase tracking-widest text-[10px] group-hover:bg-violet-500 transition-colors flex items-center justify-center gap-2 relative">
               <Sparkle weight="fill" class="w-4 h-4" />
               {$t('skills.ui.extract_ai')}
               <div class="absolute inset-0 overflow-hidden">
                 <div class="animate-[shimmer_2s_infinite] absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"></div>
               </div>
             </div>
          </div>
        </button>

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

  <!-- Bulk Actions Floating Bar -->
  {#if isSelectionMode || selectedIds.length > 0}
    <div 
      class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-6"
      transition:fly={{ y: 100, duration: 600, easing: cubicOut }}
    >
      <div class="bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-none p-4 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center justify-between gap-6">
        <div class="flex items-center gap-4 pl-4">
          <div class="w-12 h-12 rounded-none bg-amber-500/20 flex items-center justify-center text-amber-500">
            <Stack weight="fill" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-white font-black uppercase text-sm tracking-widest italic leading-none">
              {selectedIds.length} {selectedIds.length === 1 ? $t('skills.ui.item_selected') : $t('skills.ui.items_selected')}
            </p>
            <button 
              onclick={deselectAll}
              class="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors"
            >
              {$t('skills.ui.deselect_all')}
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button 
            onclick={selectAllFiltered}
            class="px-6 py-4 rounded-none bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            {$t('common.select_all')}
          </button>
          
          <button 
            onclick={deleteAll}
            class="px-6 py-4 rounded-none bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group/danger"
          >
            <Trash weight="fill" class="w-4 h-4 group-hover/danger:animate-bounce" />
            {$t('skills.ui.delete_all')}
          </button>

          <button 
            onclick={deleteSelected}
            disabled={selectedIds.length === 0}
            class="px-8 py-4 rounded-none bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl"
          >
            <Trash weight="bold" class="w-4 h-4" />
            {$t('skills.ui.delete_selected', { count: selectedIds.length })}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Import Selection Modal -->
  {#if showImportModal}
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-6" transition:fade>
      <div 
        class="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onclick={() => showImportModal = false}
        onkeydown={(e) => e.key === 'Escape' && (showImportModal = false)}
        role="button"
        tabindex="-1"
      ></div>
      
      <div 
        class="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-none shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row"
        in:fly={{ y: 20, duration: 600, easing: cubicOut }}
      >
        <!-- AI Option -->
        <div class="flex-1 p-10 space-y-8 border-b md:border-b-0 md:border-r border-white/5 group hover:bg-violet-500/5 transition-colors">
          <div class="w-16 h-16 bg-violet-600/10 text-violet-400 flex items-center justify-center rounded-none mb-6 group-hover:scale-110 transition-transform duration-500">
            <FilePdf weight="duotone" class="w-10 h-10" />
          </div>
          <div class="space-y-4">
            <h3 class="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-violet-300 transition-colors">{$t('skills.ui.import_pdf')}</h3>
            <p class="text-zinc-500 font-medium leading-relaxed">{$t('skills.ui.import_pdf_subtitle')}</p>
          </div>
          
          <div class="pt-6">
            <input type="file" accept=".pdf" class="hidden" bind:this={fileInput} onchange={(e) => { handlePDFUpload(e); showImportModal = false; }} />
            <button 
              onclick={() => fileInput?.click()}
              class="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-violet-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              <Sparkle weight="fill" class="w-4 h-4" />
              {$t('skills.ui.extract_ai')}
            </button>
          </div>
        </div>

        <!-- Presets Option -->
        <div class="flex-1 p-10 space-y-8 group hover:bg-amber-500/5 transition-colors">
          <div class="w-16 h-16 bg-amber-500/10 text-amber-400 flex items-center justify-center rounded-none mb-6 group-hover:scale-110 transition-transform duration-500">
            <Stack weight="duotone" class="w-10 h-10" />
          </div>
          <div class="space-y-4">
            <h3 class="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-amber-300 transition-colors">{$t('skills.import_title')}</h3>
            <p class="text-zinc-500 font-medium leading-relaxed">{$t('skills.import_confirm')}</p>
          </div>
          
          <div class="pt-6">
            <button 
              onclick={() => { handleImportSyllabus(); showImportModal = false; }}
              class="w-full py-5 bg-zinc-900 text-white border border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Lightning weight="fill" class="w-4 h-4 text-amber-400" />
              {$t('skills.import_cta')}
            </button>
          </div>
        </div>

        <!-- Close -->
        <button 
          onclick={() => showImportModal = false}
          class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X weight="bold" class="w-6 h-6" />
        </button>
      </div>
    </div>
  {/if}
</div>

{#snippet SkillCardComp({ skill, getDifficultyColor, getResourceType, getResourceIcon, getResourceLabel, deleteSkill }: { skill: SkillWithDetails, getDifficultyColor: (d: any) => string, getResourceType: (r: string) => string, getResourceIcon: (t: string) => any, getResourceLabel: (t: string) => string, deleteSkill: (id: string, name: string) => void })}
  {@const masteredCount = skill.students_mastered || 0}
  {@const masteryProgress = Math.min((masteredCount / 20) * 100, 100)}
  {@const isSelected = selectedIds.includes(skill.id)}
  
  <div 
    class="group relative bg-zinc-900/40 backdrop-blur-xl border {isSelected ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'} rounded-none p-6 hover:bg-zinc-800/60 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden cursor-pointer"
    onclick={() => isSelectionMode && toggleSkillSelection(skill.id)}
    onkeydown={(e) => isSelectionMode && (e.key === 'Enter' || e.key === ' ') && toggleSkillSelection(skill.id)}
    role="button"
    tabindex={isSelectionMode ? 0 : -1}
    aria-pressed={isSelected}
    aria-label={`${skill.name} - ${isSelected ? $t('common.selected') : $t('common.not_selected')}`}
  >
    <div class="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    
    <div class="flex justify-between items-start mb-6 relative z-10">
      <div class="flex items-center gap-3">
        {#if isSelectionMode}
          <div 
            class="w-6 h-6 rounded-none border-2 flex items-center justify-center transition-all {isSelected ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/10 bg-black/40'}"
            transition:scale
          >
            {#if isSelected}
              <CheckCircle weight="fill" class="w-4 h-4" />
            {/if}
          </div>
        {:else}
          <button 
            type="button"
            class="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-violet-400 transition-colors cursor-grab active:cursor-grabbing"
            aria-label={$t('common.reorder') || 'Reorder lesson'}
          >
            <DotsThreeVertical weight="bold" class="w-5 h-5" />
          </button>
        {/if}
        <div class="px-3 py-1 rounded-none text-[9px] font-black uppercase tracking-widest border {getDifficultyColor(skill.difficulty)} bg-black/20 font-outfit">
          {skill.level || $t('skills.status_mastered')}
        </div>
      </div>
      
      <div class="flex gap-2">
        <button 
          disabled={isSelectionMode}
          onclick={(e) => { e.stopPropagation(); goto(`/panel/skills/${skill.id}/edit`); }} 
          class="w-8 h-8 rounded-none bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all disabled:opacity-0"
          aria-label={$t('skills.edit.title')}
        >
          <PencilLine weight="bold" class="w-4 h-4" />
        </button>
        <button 
          disabled={isSelectionMode}
          onclick={(e) => { e.stopPropagation(); deleteSkill(skill.id, skill.name); }} 
          class="w-8 h-8 rounded-none bg-white/5 hover:bg-rose-500/10 flex items-center justify-center text-zinc-600 hover:text-rose-500 transition-all disabled:opacity-0"
          aria-label={$t('common.delete')}
        >
          <Trash weight="bold" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="flex-1 space-y-4 relative z-10">
      <h3 class="text-xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-violet-300 transition-colors">{skill.name}</h3>
      <p class="text-zinc-500 text-xs line-clamp-2 leading-relaxed font-medium">{skill.description || $t('skills.ui.slogan')}</p>
      {#if skill.resources && skill.resources.length > 0}
        <div class="flex flex-wrap gap-2 pt-2">
          {#each skill.resources.slice(0, 3) as res}
            {@const type = getResourceType(res)}
            {@const Icon = getResourceIcon(type)}
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-950/50 border border-white/5 text-[9px] font-bold text-zinc-400">
              <Icon weight="bold" class="w-3 h-3" />
              {getResourceLabel(type)}
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <div class="border-t border-white/5 mt-6 pt-6 space-y-3 relative z-10">
      <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
        <div class="flex items-center gap-2 text-zinc-500">
          <BookOpen weight="fill" class="w-4 h-4 text-violet-500" />
          <span>{skill.estimated_hours || 0}h</span>
        </div>
        <div class="flex items-center gap-2 text-zinc-400">
          <CheckCircle weight="fill" class="w-4 h-4" />
          <span>{Math.round(masteryProgress)}% {$t('skills.mastered') || 'MASTERED'}</span>
        </div>
      </div>
      <div class="h-1 bg-zinc-950 rounded-none overflow-hidden">
        <div class="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-1000" style="width: {masteryProgress}%"></div>
      </div>
    </div>
  </div>
{/snippet}

<style>
  :global(.no-scrollbar::-webkit-scrollbar) { display: none; }
</style>

