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
    PencilLine
  } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { appStore } from '$lib/stores/appStore';
  import { uiStore } from '$lib/stores/uiStore';
  import { CHESS_SYLLABUS_PRESETS } from '$lib/constants/chess-presets';
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
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
  let fileInput: HTMLInputElement;

  // Reactive data from the store for real-time updates
  let skills = $derived($appStore.skills.length > 0 ? $appStore.skills : data.skills);

  const categories = $derived([
    { id: 'all', name: $t('common.all'), count: skills.length },
    ...data.categories.map(c => ({ id: c.id || c.name, name: c.name, count: c.count || 0 }))
  ]);

  let filteredSkills = $derived(
    skills.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || s.category_id === selectedCategory || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  );

  let skillsByCategory = $derived(
    data.categories.map(cat => ({
      ...cat,
      items: filteredSkills.filter(s => s.category_id === cat.id || s.category === cat.name)
    })).filter(cat => cat.items.length > 0 || selectedCategory === cat.id)
  );

  const stats = $derived({
    total: skills.length,
    mastered: skills.filter(s => (s as any).students_mastered > 0).length,
    advanced: skills.filter(s => s.level === 'advanced').length,
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
      const result = await appStore.removeSkill(id);
      if (result) {
        uiStore.toast($t('common.delete_success'), 'success');
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
        uiStore.toast($t('skills.import_success'), 'success');
      } catch (err) {
        console.error(err);
        uiStore.toast('Error importing syllabus', 'error');
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
    isExtractingAI = true;
    extractionProgress = 0;
    
    const interval = setInterval(() => {
      extractionProgress += Math.random() * 10;
      if (extractionProgress >= 95) {
        clearInterval(interval);
        finalizeExtraction();
      }
    }, 300);

    const finalizeExtraction = async () => {
      await new Promise(r => setTimeout(r, 1500));
      
      const prefix = file.name.split('.')[0].toUpperCase();
      const extractedSkills = CHESS_SYLLABUS_PRESETS.slice(0, 6).map((s, i) => ({
        ...s,
        name: `${prefix} - ${s.name}`,
        description: `Contenido escolar extraído con IA desde ${file.name}.`,
        resources: [
          'https://youtube.com/watch?v=chess-demo',
          'guia-estudio-pro.pdf',
          'https://chessnet.io/resources/whitepaper'
        ]
      }));

      await appStore.importCurriculum(extractedSkills);
      extractionProgress = 100;
      
      setTimeout(() => {
        isExtractingAI = false;
        uiStore.toast($t('skills.ui.extraction_complete'), 'success');
      }, 600);
    };
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
    if (d <= 2) return 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20';
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
        // En un caso real haríamos un batch o un Promise.all, pero appStore.removeSkill gestiona Firestore de forma individual
        await Promise.all(selectedIds.map(id => appStore.removeSkill(id)));
        selectedIds = [];
        isSelectionMode = false;
        uiStore.toast($t('common.delete_success'), 'success');
      } catch (err) {
        console.error(err);
        uiStore.toast('Error deleting skills', 'error');
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
        await Promise.all(skills.map(s => appStore.removeSkill(s.id)));
        selectedIds = [];
        isSelectionMode = false;
        uiStore.toast($t('common.delete_success'), 'success');
      } catch (err) {
        console.error(err);
        uiStore.toast('Error deleting syllabus', 'error');
      } finally {
        uiStore.setLoading(false);
      }
    }
  };
</script>

<svelte:head>
  <title>{$t('skills.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12 pb-40" in:fade={{ duration: 400 }}>
  
  <!-- Premium Header -->
  <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
    <div class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-black text-violet-400 uppercase tracking-widest">
          {$t('skills.ui.academic_manager')}
        </div>
        <div class="w-1 h-1 rounded-full bg-zinc-800"></div>
        <div class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Syllabus 2.0</div>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-violet-600/20 relative group overflow-hidden">
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Path weight="duotone" class="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <h1 class="text-5xl font-black text-white tracking-tight uppercase italic drop-shadow-2xl">
            {$t('skills.title')}
          </h1>
          <p class="text-zinc-500 text-lg font-medium flex items-center gap-3 mt-1">
            <Lightning weight="fill" class="w-5 h-5 text-amber-500" />
            {$t('skills.ui.slogan')}
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button 
        onclick={() => goto('/panel/skills/create')}
        class="px-10 py-5 rounded-2xl bg-white text-black shadow-2xl hover:shadow-white/10 hover:-translate-y-1 transition-all flex items-center gap-3 text-xs font-black tracking-widest uppercase group active:scale-95"
      >
        <Plus weight="bold" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
        <span>{$t('skills.ui.create_btn')}</span>
      </button>
    </div>
  </div>

  <!-- Stats Bento -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 hover:bg-zinc-900/60 transition-all duration-500 shadow-2xl overflow-hidden relative">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/20 transition-all duration-700"></div>
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-500">
          <SquaresFour weight="duotone" class="w-6 h-6" />
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider">
          <TrendUp weight="bold" class="w-3 h-3" />
          {$t('skills.ui.active_tag')}
        </div>
      </div>
      <div class="space-y-1">
        <span class="text-4xl font-black text-white block tabular-nums leading-none">{stats.total}</span>
        <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{$t('skills.ui.global_topics')}</span>
      </div>
    </div>

    <div class="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 hover:bg-zinc-900/60 transition-all duration-500 shadow-2xl relative">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl group-hover:bg-amber-600/20 transition-all duration-700"></div>
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-500">
          <Star weight="duotone" class="w-6 h-6" />
        </div>
        <div class="text-[9px] font-black text-amber-400 uppercase tracking-widest border border-amber-500/20 px-3 py-1 rounded-full">{$t('skills.ui.level_avg')}</div>
      </div>
      <div class="space-y-1">
        <span class="text-4xl font-black text-white block tabular-nums leading-none">{stats.advanced}</span>
        <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{$t('skills.ui.advanced_mastery')}</span>
      </div>
    </div>

    <div class="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 hover:bg-zinc-900/60 transition-all duration-500 shadow-2xl relative">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
      <div class="flex items-center justify-between mb-8">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
          <Clock weight="duotone" class="w-6 h-6" />
        </div>
        <div class="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">{$t('skills.ui.estimates')}</div>
      </div>
      <div class="space-y-1">
        <span class="text-4xl font-black text-white block tabular-nums leading-none">{stats.hours}<span class="text-xl text-zinc-500 ml-1">h</span></span>
        <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{$t('skills.ui.course_duration')}</span>
      </div>
    </div>

    <div class="group bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[32px] p-8 shadow-2xl shadow-indigo-600/20 relative overflow-hidden flex flex-col justify-between">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div class="relative z-10 flex justify-between items-start">
        <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
          <Trophy weight="fill" class="w-6 h-6" />
        </div>
        <div class="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] bg-black/20 px-3 py-1 rounded-full">{$t('skills.ui.premium_path')}</div>
      </div>
      <div class="relative z-10 space-y-4">
        <div>
          <h4 class="text-sm font-bold text-white/70 uppercase tracking-widest mb-1">{$t('skills.ui.advanced_mastery')}</h4>
          <p class="text-2xl font-black text-white">{stats.advanced} {$t('skills.ui.master_skills')}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- AI PDF Card -->
  <div class="relative group overflow-hidden bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-[40px] p-1 shadow-2xl">
    <div class="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    <div class="relative bg-zinc-950/80 rounded-[38px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10">
      <div class="flex flex-col md:flex-row items-center gap-8 text-center md:text-left flex-1">
        <div class="w-24 h-24 bg-violet-600/10 rounded-[32px] border border-violet-500/20 flex items-center justify-center text-violet-500 relative group-hover:scale-110 transition-all duration-700">
          <div class="absolute inset-0 bg-violet-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <FilePdf weight="duotone" class="w-12 h-12 relative z-10" />
          <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-xl">
            <Sparkle weight="bold" class="w-4 h-4" />
          </div>
        </div>
        <div class="space-y-2 max-w-xl">
          <h2 class="text-3xl font-black text-white italic uppercase tracking-tight">{$t('skills.ui.import_pdf')}</h2>
          <p class="text-zinc-500 font-medium leading-relaxed">{$t('skills.ui.import_pdf_subtitle')}</p>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 w-full lg:w-fit">
        <input type="file" accept=".pdf" class="hidden" bind:this={fileInput} onchange={handlePDFUpload} />
        {#if !isExtractingAI}
          <button onclick={() => fileInput.click()} class="w-full lg:w-auto px-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-violet-500 hover:text-white transition-all shadow-2xl active:scale-95 group/btn">
            <FileArrowUp weight="bold" class="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform" />
            {$t('skills.ui.extract_ai')}
          </button>
        {:else}
          <div class="w-full lg:w-80 space-y-4 py-2">
            <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span class="flex items-center gap-2 text-violet-400">
                <Brain weight="fill" class="w-4 h-4 animate-pulse" />
                {$t('skills.ui.extracting')}
              </span>
              <span class="text-zinc-500">{Math.round(extractionProgress)}%</span>
            </div>
            <div class="h-3 bg-zinc-900 rounded-full border border-white/5 overflow-hidden p-0.5">
              <div class="h-full bg-gradient-to-r from-violet-600 to-blue-500 rounded-full transition-all duration-300" style="width: {extractionProgress}%"></div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Search & Toggles -->
  <div class="sticky top-6 z-40">
    <div class="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-3 rounded-[32px] shadow-2xl flex flex-col lg:flex-row gap-3">
      <div class="flex-1 relative group">
        <label for="skill-search" class="sr-only">{$t('skills.ui.search_placeholder')}</label>
        <MagnifyingGlass class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
        <input 
          id="skill-search"
          type="text" 
          bind:value={searchQuery} 
          placeholder={$t('skills.ui.search_placeholder')} 
          class="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium" 
        />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <label for="skill-category-filter" class="sr-only">{$t('skills.create.category')}</label>
        <select 
          id="skill-category-filter"
          bind:value={selectedCategory} 
          class="bg-zinc-950/50 border border-white/5 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all min-w-[180px]"
        >
          <option value="all">{$t('skills.category_all')}</option>
          {#each categories.filter(c => c.id !== 'all') as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
        <button 
          onclick={() => isSelectionMode = !isSelectionMode} 
          class="h-[60px] px-6 rounded-2xl border border-white/5 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all {isSelectionMode ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-zinc-950/50 text-zinc-400 hover:text-white'}"
          aria-pressed={isSelectionMode}
          aria-label={$t('skills.ui.select_skills')}
        >
          <CheckCircle weight={isSelectionMode ? 'fill' : 'bold'} class="w-4 h-4" />
          {$t('skills.ui.select_skills')}
        </button>
        <button onclick={() => isGrouped = !isGrouped} class="h-[60px] px-6 rounded-2xl border border-white/5 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all {isGrouped ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'bg-zinc-950/50 text-zinc-400 hover:text-white'}">
          <Path weight="bold" class="w-4 h-4" />
          {$t('skills.ui.group_by_category')}
        </button>
        <button onclick={handleImportSyllabus} disabled={isImporting} class="h-[60px] px-8 rounded-2xl bg-zinc-950/50 border border-white/5 text-white hover:bg-zinc-900 transition-all flex items-center gap-2 group/btn relative overflow-hidden">
          {#if isImporting}
            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <SquaresFour weight="fill" class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-2xl font-black text-white uppercase tracking-tight italic">{$t('skills.ui.module')}: {module.name}</h3>
              <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{module.items.length} {$t('skills.ui.lessons')}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each module.items as skill (skill.id)}
              {@render SkillCardComp({ skill, getDifficultyColor, getResourceType, getResourceIcon, getResourceLabel, deleteSkill })}
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
      {#each filteredSkills as skill (skill.id)}
        {@render SkillCardComp({ skill, getDifficultyColor, getResourceType, getResourceIcon, getResourceLabel, deleteSkill })}
      {/each}
    </div>
  {/if}

  <!-- Bulk Actions Floating Bar -->
  {#if isSelectionMode || selectedIds.length > 0}
    <div 
      class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-6"
      transition:fly={{ y: 100, duration: 600, easing: cubicOut }}
    >
      <div class="bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[32px] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center justify-between gap-6">
        <div class="flex items-center gap-4 pl-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
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
            class="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            {$t('common.select_all')}
          </button>
          
          <button 
            onclick={deleteAll}
            class="px-6 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group/danger"
          >
            <Trash weight="fill" class="w-4 h-4 group-hover/danger:animate-bounce" />
            {$t('skills.ui.delete_all')}
          </button>

          <button 
            onclick={deleteSelected}
            disabled={selectedIds.length === 0}
            class="px-8 py-4 rounded-2xl bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl"
          >
            <Trash weight="bold" class="w-4 h-4" />
            {$t('skills.ui.delete_selected', { count: selectedIds.length })}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

{#snippet SkillCardComp({ skill, getDifficultyColor, getResourceType, getResourceIcon, getResourceLabel, deleteSkill })}
  {@const masteredCount = (skill as any).students_mastered || 0}
  {@const masteryProgress = Math.min((masteredCount / 20) * 100, 100)}
  {@const isSelected = selectedIds.includes(skill.id)}
  
  <div 
    class="group relative bg-zinc-900/40 backdrop-blur-xl border {isSelected ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'} rounded-[32px] p-6 hover:bg-zinc-800/60 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden cursor-pointer"
    onclick={() => isSelectionMode && toggleSkillSelection(skill.id)}
    onkeydown={(e) => isSelectionMode && (e.key === 'Enter' || e.key === ' ') && toggleSkillSelection(skill.id)}
    role="button"
    tabindex={isSelectionMode ? 0 : -1}
    aria-pressed={isSelected}
    aria-label={`${skill.name} - ${isSelected ? 'Selected' : 'Unselected'}`}
  >
    <div class="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    
    <div class="flex justify-between items-start mb-6 relative z-10">
      <div class="flex items-center gap-3">
        {#if isSelectionMode}
          <div 
            class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all {isSelected ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/10 bg-black/40'}"
            transition:scale
          >
            {#if isSelected}
              <CheckCircle weight="fill" class="w-4 h-4" />
            {/if}
          </div>
        {/if}
        <div class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border {getDifficultyColor(skill.difficulty)} bg-black/20">
          {skill.level || 'Mastery'}
        </div>
      </div>
      
      <div class="flex gap-2">
        <button 
          disabled={isSelectionMode}
          onclick={(e) => { e.stopPropagation(); goto(`/panel/skills/${skill.id}/edit`); }} 
          class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all disabled:opacity-0"
          aria-label="Edit skill"
        >
          <PencilLine weight="bold" class="w-4 h-4" />
        </button>
        <button 
          disabled={isSelectionMode}
          onclick={(e) => { e.stopPropagation(); deleteSkill(skill.id, skill.name); }} 
          class="w-8 h-8 rounded-lg bg-white/5 hover:bg-rose-500/10 flex items-center justify-center text-zinc-600 hover:text-rose-500 transition-all disabled:opacity-0"
          aria-label="Delete skill"
        >
          <Trash weight="bold" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="flex-1 space-y-4 relative z-10">
      <h3 class="text-xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-violet-300 transition-colors">{skill.name}</h3>
      <p class="text-zinc-500 text-xs line-clamp-2 leading-relaxed font-medium">{skill.description || 'Syllabus module content.'}</p>
      {#if skill.resources && skill.resources.length > 0}
        <div class="flex flex-wrap gap-2 pt-2">
          {#each skill.resources.slice(0, 3) as res}
            {@const type = getResourceType(res)}
            {@const Icon = getResourceIcon(type)}
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/50 border border-white/5 text-[9px] font-bold text-zinc-400">
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
          <span>{Math.round(masteryProgress)}% {$t('common.mastered') || 'Domino'}</span>
        </div>
      </div>
      <div class="h-1 bg-zinc-950 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-violet-600 to-emerald-500 transition-all duration-1000" style="width: {masteryProgress}%"></div>
      </div>
    </div>
  </div>
{/snippet}

<style>
  :global(.no-scrollbar::-webkit-scrollbar) { display: none; }
</style>
