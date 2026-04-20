<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    GraduationCap, 
    Plus, 
    PencilSimple, 
    Trash,
    Calendar,
    Users,
    CaretRight,
    MagnifyingGlass,
    Clock,
    Buildings,
    DotsThreeVertical,
    TrendUp,
    BookOpen,
    Eye,
    Target,
    ChartBar,
    MapPin,
    CurrencyEur,
    UsersThree,
    UserCheck,
    Selection,
    ArrowUpRight,
    Funnel,
    X,
    Sparkle
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';

  let showDeleteModal = $state(false);
  let classToDelete = $state<{id: string, name: string} | null>(null);

  let searchQuery = $state('');
  let currentTab = $state('all');
  let viewMode = $state('list'); // 'list' or 'grid'

  // Reactive data from store
  let classes = $derived($appStore.classes || []);
  let schools = $derived($appStore.schools || []);

  const metrics = $derived({
    total: classes.length,
    activeStudents: classes.reduce((acc, c) => acc + (c.studentIds?.length || 0), 0),
    avgOccupancy: classes.length > 0 
      ? Math.round(classes.reduce((acc, c) => acc + ((c.studentIds?.length || 0) / (c.max_students || 10) * 100), 0) / classes.length)
      : 0,
    potentialRevenue: classes.reduce((acc, c) => acc + ((c.studentIds?.length || 0) * (c.price || 0)), 0)
  });

  const filteredClasses = $derived(
    classes.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           getSchoolName(c.school_id).toLowerCase().includes(searchQuery.toLowerCase());
      
      if (currentTab === 'all') return matchesSearch;
      if (currentTab === 'active') return matchesSearch && (c.studentIds?.length || 0) > 0;
      if (currentTab === 'empty') return matchesSearch && (c.studentIds?.length || 0) === 0;
      return matchesSearch;
    })
  );

  const getSchoolName = (id: string | undefined) => {
    return schools.find(s => s.id === id)?.name || $t('common.independent');
  };

  const deleteClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    if (cls) {
        classToDelete = { id, name: cls.name };
        showDeleteModal = true;
    }
  };

  const confirmDelete = () => {
    if (classToDelete) {
      appStore.removeClass(classToDelete.id);
      showDeleteModal = false;
      classToDelete = null;
    }
  };

  let showDeleteAllModal = $state(false);

  const confirmDeleteAll = async () => {
    try {
      await appStore.removeAllClasses();
      toast.success($t('classes.toast_all_deleted') || 'Todas las clases han sido eliminadas');
    } catch (err) {
      toast.error($t('common.error_occurred') || 'Ha ocurrido un error');
    } finally {
      showDeleteAllModal = false;
    }
  };
</script>

<svelte:head>
  <title>{$t('classes.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-[1600px] mx-auto px-6 pb-24" in:fade>
  <!-- Ambient Background -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary-500/5 rounded-none blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[5%] left-[-10%] w-[35rem] h-[35rem] bg-blue-500/5 rounded-none blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
  </div>

  <!-- Header Section -->
  <div class="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 pt-16">
    <div class="space-y-8">
      <div class="flex items-center gap-10">
        <div class="relative group">
          <div class="absolute -inset-4 bg-primary-500/20 rounded-none blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100"></div>
          <div class="w-24 h-24 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-none flex items-center justify-center text-primary-400 shadow-2xl relative z-10 overflow-hidden group-hover:border-primary-500/50 transition-colors">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent"></div>
            <GraduationCap size={44} weight="duotone" class="group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-none flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-none bg-primary-500 animate-pulse"></div>
              <span class="text-[10px] font-black text-primary-400 uppercase tracking-widest font-outfit">
                {$t('panel.management') || 'Management'}
              </span>
            </div>
          </div>
          <h1 class="text-5xl md:text-7xl font-outfit font-black text-white tracking-tighter uppercase leading-none">
            {$t('classes.title')}
          </h1>
          <p class="text-slate-400 font-jakarta text-xl font-medium tracking-tight mt-4 opacity-80 max-w-xl">
            {$t('classes.subtitle')}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-none border border-white/5 backdrop-blur-2xl shadow-2xl">
      <div class="flex items-center bg-black/40 rounded-none p-1.5 border border-white/5 mr-4">
        <button 
          onclick={() => viewMode = 'list'}
          class="px-4 py-2.5 rounded-none transition-all {viewMode === 'list' ? 'bg-zinc-800 text-primary-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}"
        >
          <Selection size={18} weight="bold" />
        </button>
        <button 
          onclick={() => viewMode = 'grid'}
          class="px-4 py-2.5 rounded-none transition-all {viewMode === 'grid' ? 'bg-zinc-800 text-primary-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}"
        >
          <ChartBar size={18} weight="bold" />
        </button>
      </div>
      <button 
        onclick={() => goto('/panel/classes/create')}
        class="bg-white text-black px-12 py-4.5 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 active:scale-95 font-outfit group overflow-hidden relative"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Plus weight="bold" size={22} class="relative z-10 transition-transform group-hover:rotate-90" />
        <span class="relative z-10">{$t('classes.add_btn')}</span>
      </button>

      {#if classes.length > 0}
        <button 
          onclick={() => showDeleteAllModal = true}
          class="h-[60px] w-[60px] rounded-none bg-red-900/20 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-95"
          title={$t('classes.delete_btn')}
        >
          <Trash weight="bold" class="w-6 h-6" />
        </button>
      {/if}
    </div>
  </div>

  <!-- Strategic Metrics Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative z-10">
    <div class="bento-card group p-10 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-none relative overflow-hidden transition-all duration-700 hover:border-primary-500/30">
      <div class="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12">
        <GraduationCap size={240} weight="fill" />
      </div>
      <div class="relative z-10 flex flex-col gap-10">
        <div class="w-16 h-16 rounded-none bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 group-hover:shadow-glow-primary transition-shadow">
          <GraduationCap size={32} weight="duotone" />
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{$t('classes.total_classes')}</p>
          <div class="flex items-end gap-3 mt-4">
            <h3 class="text-6xl font-outfit font-black text-white leading-none tracking-tighter">{metrics.total}</h3>
            <div class="px-2 py-1 bg-primary-500/10 border border-primary-500/20 rounded-none text-[10px] font-black text-primary-400 mb-2 uppercase tracking-tight">{$t('classes.status.active')}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bento-card group p-10 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-none relative overflow-hidden transition-all duration-700 hover:border-blue-500/30">
      <div class="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12">
        <UsersThree size={240} weight="fill" />
      </div>
      <div class="relative z-10 flex flex-col gap-10">
        <div class="w-16 h-16 rounded-none bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:shadow-glow-blue transition-shadow">
          <UsersThree size={32} weight="duotone" />
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{$t('classes.active_students_short')}</p>
          <div class="flex items-end gap-3 mt-4">
            <h3 class="text-6xl font-outfit font-black text-white leading-none tracking-tighter">{metrics.activeStudents}</h3>
            <span class="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest opacity-60">{$t('classes.students')}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bento-card group p-10 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-none relative overflow-hidden transition-all duration-700 hover:border-amber-500/30">
      <div class="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12">
        <Target size={240} weight="fill" />
      </div>
      <div class="relative z-10 flex flex-col gap-10 h-full">
        <div class="w-16 h-16 rounded-none bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:shadow-glow-amber transition-shadow">
          <Target size={32} weight="duotone" />
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{$t('classes.occupancy')}</p>
          <div class="flex items-center gap-5 mt-4">
            <h3 class="text-6xl font-outfit font-black text-white leading-none tracking-tighter">{metrics.avgOccupancy}%</h3>
            <div class="flex-1 h-3 bg-zinc-950 rounded-none border border-white/5 p-0.5 overflow-hidden shadow-inner">
              <div class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-none transition-all duration-1000" style="width: {metrics.avgOccupancy}%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bento-card group p-10 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-none relative overflow-hidden transition-all duration-700 hover:border-primary-500/30">
      <div class="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12">
        <CurrencyEur size={240} weight="fill" />
      </div>
      <div class="relative z-10 flex flex-col gap-10">
        <div class="w-16 h-16 rounded-none bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 group-hover:shadow-glow-primary transition-shadow">
          <CurrencyEur size={32} weight="duotone" />
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{$t('classes.metrics.monthly_value')}</p>
          <div class="flex items-end gap-3 mt-4">
            <h3 class="text-5xl font-outfit font-black text-white leading-none tracking-tighter">
              {metrics.potentialRevenue}
              <span class="text-2xl ml-1 text-slate-600 font-black">{$t('common.currency_symbol')}</span>
            </h3>
            <div class="flex items-center gap-1 text-primary-400 text-[10px] font-black mb-1.5 bg-primary-500/10 px-2 py-0.5 rounded-none border border-primary-500/10">
              <TrendUp size={14} weight="bold" />
              <span>+12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Filters & Search Toolbar -->
  <div class="relative z-10 flex flex-col xl:flex-row gap-8 mb-12 items-stretch xl:items-center justify-between">
    <div class="flex items-center gap-3 bg-zinc-900/50 p-2.5 rounded-none border border-white/5 backdrop-blur-2xl shadow-xl overflow-x-auto no-scrollbar">
       {#each ['all', 'active', 'empty'] as tab}
         <button 
           onclick={() => currentTab = tab}
           class="px-10 py-4.5 rounded-none text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap {currentTab === tab ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}"
         >
           {$t(`classes.${tab === 'all' ? 'all' : tab + '_tab'}`) || tab}
         </button>
       {/each}
    </div>

    <div class="flex items-center gap-6 flex-1 xl:max-w-3xl">
      <div class="relative group flex-1">
        <div class="absolute -inset-1 bg-primary-500/5 rounded-none blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <MagnifyingGlass size={22} class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
        <input
          type="text"
          placeholder={$t('classes.search_placeholder')}
          bind:value={searchQuery}
          class="w-full bg-zinc-900/50 border border-white/5 rounded-none pl-16 pr-8 py-5.5 text-base text-white focus:border-primary-500/50 focus:bg-zinc-900/80 outline-none transition-all placeholder:text-zinc-700 font-jakarta font-semibold shadow-inner"
        />
        {#if searchQuery}
          <button 
            onclick={() => searchQuery = ''}
            class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} weight="bold" />
          </button>
        {/if}
      </div>
      <button class="w-16 h-16 bg-zinc-900/50 border border-white/5 rounded-none flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/30 transition-all active:scale-95 shadow-2xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Funnel size={24} weight="duotone" class="relative z-10" />
      </button>
    </div>
  </div>

  <!-- Content Section -->
  {#if classes.length === 0}
    <div class="relative z-10 bento-card border-dashed border-white/10 p-32 text-center space-y-12 rounded-none group" in:fade>
        <div class="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary-600/5 to-transparent"></div>
        <div class="w-48 h-48 bg-zinc-950 rounded-none flex items-center justify-center mx-auto border border-white/10 text-slate-700 shadow-3xl relative z-10 group-hover:rotate-12 transition-all duration-1000">
            <BookOpen size={100} weight="duotone" class="opacity-20 group-hover:opacity-60 transition-opacity" />
        </div>
        <div class="space-y-6 relative z-10">
            <h3 class="text-5xl font-outfit font-black text-white tracking-widest uppercase">{$t('classes.empty_title')}</h3>
            <p class="text-slate-500 max-w-md mx-auto font-jakarta text-xl font-medium leading-relaxed opacity-80">{$t('classes.empty_subtitle')}</p>
        </div>
        <button 
            onclick={() => goto('/panel/classes/create')}
            class="bg-white text-black px-20 py-7 rounded-none font-outfit font-black text-[12px] uppercase tracking-[0.4em] hover:bg-primary-600 hover:text-white transition-all shadow-3xl active:scale-95 relative z-10"
        >
            {$t('classes.empty_btn')}
        </button>
    </div>
  {:else if filteredClasses.length === 0}
    <div class="relative z-10 bento-card border-dashed border-white/10 p-32 text-center space-y-12 rounded-none" in:fade>
      <div class="w-48 h-48 bg-zinc-950 rounded-none flex items-center justify-center mx-auto border border-white/10 text-slate-800 shadow-2xl relative z-10 rotate-(-12deg)">
        <MagnifyingGlass size={100} weight="duotone" class="opacity-10" />
      </div>
      <div class="space-y-6 relative z-10">
        <h2 class="text-5xl font-outfit font-black text-white tracking-widest uppercase">{$t('common.no_data')}</h2>
        <p class="text-slate-500 font-jakarta text-xl font-medium leading-relaxed opacity-80">{$t('classes.no_results').replace('{query}', searchQuery)}</p>
      </div>
      <button 
        onclick={() => searchQuery = ''}
        class="text-[12px] font-outfit font-black text-primary-400 uppercase tracking-[0.4em] hover:text-white transition-all underline underline-offset-[20px] decoration-primary-500/40 decoration-2"
      >
        {$t('classes.clear_search')}
      </button>
    </div>
  {:else}
    {#if viewMode === 'list'}
      <div class="relative z-10 bento-card bg-zinc-900/30 backdrop-blur-3xl rounded-none border border-white/5 overflow-hidden shadow-3xl" in:fade>
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                <th class="px-12 py-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{$t('classes.name_label')}</th>
                <th class="px-12 py-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{$t('classes.school_label')}</th>
                <th class="px-12 py-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{$t('classes.schedule')}</th>
                <th class="px-12 py-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{$t('classes.occupancy')}</th>
                <th class="px-12 py-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">{$t('common.actions')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              {#each filteredClasses as cls, i}
                <tr 
                  class="group/row hover:bg-white/[0.04] transition-all duration-500 cursor-pointer"
                  onclick={() => goto(`/panel/classes/${cls.id}`)}
                  in:fly={{ y: 20, delay: i * 30, duration: 600 }}
                >
                  <td class="px-12 py-12">
                    <div class="flex items-center gap-10">
                      <div class="relative group/art">
                        <div class="absolute -inset-2 bg-primary-500/20 rounded-none blur-xl opacity-0 group-hover/row:opacity-100 transition-opacity duration-700"></div>
                        <div class="w-20 h-20 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center text-white font-outfit font-black text-3xl shadow-2xl relative z-10 overflow-hidden group-hover/row:border-primary-500/30 transition-colors">
                          <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent group-hover/art:rotate-12 transition-transform duration-700"></div>
                          <span class="relative z-10 group-hover/row:scale-110 transition-transform duration-500">{cls.name[0].toUpperCase()}</span>
                        </div>
                      </div>
                      <div>
                        <h3 class="text-2xl font-outfit font-black text-white group-hover/row:text-primary-400 transition-colors duration-500 tracking-tighter uppercase leading-none">{cls.name}</h3>
                        <div class="flex items-center gap-4 mt-5">
                          <span class="px-3 py-1 bg-white/5 border border-white/5 rounded-none text-[10px] font-black text-slate-400 uppercase tracking-widest">{cls.level || $t('classes.level.mixed')}</span>
                          {#if (cls.studentIds?.length || 0) >= (cls.max_students || 10)}
                            <span class="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-none text-[10px] font-black text-red-400 uppercase tracking-widest animate-pulse">{$t('classes.metrics.full_capacity')}</span>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-12 py-12">
                     <div class="flex items-center gap-4 group/chip">
                        <div class="p-3 bg-blue-500/10 rounded-none border border-blue-500/20 text-blue-400 group-hover/row:scale-110 transition-transform">
                          <Buildings weight="duotone" size={20} />
                        </div>
                        <span class="text-sm font-black text-slate-300 uppercase tracking-tight">{getSchoolName(cls.school_id)}</span>
                     </div>
                  </td>
                  <td class="px-12 py-12">
                    <div class="flex items-center gap-4 group/chip">
                       <div class="p-3 bg-amber-500/10 rounded-none border border-amber-500/20 text-amber-400 group-hover/row:scale-110 transition-transform">
                         <Clock weight="duotone" size={20} />
                       </div>
                       <span class="text-sm font-black text-slate-300 uppercase tracking-tight">{cls.schedule || $t('classes.flexible_schedule')}</span>
                    </div>
                  </td>
                  <td class="px-12 py-12">
                    <div class="flex flex-col gap-4 w-64">
                       <div class="flex items-center justify-between text-[11px] font-black uppercase tracking-widest font-outfit">
                          <div class="flex items-center gap-3">
                             <UsersThree size={16} class="text-primary-500" />
                             <span class="text-slate-200">{cls.studentIds?.length || 0} <span class="text-slate-600">/</span> {cls.max_students || 10}</span>
                          </div>
                          <span class="text-primary-400">{Math.round(((cls.studentIds?.length || 0) / (cls.max_students || 10)) * 100)}%</span>
                       </div>
                       <div class="h-2.5 bg-black/40 rounded-none border border-white/5 p-0.5 overflow-hidden">
                          <div 
                            class="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 rounded-none transition-all duration-1500 ease-out shadow-glow-primary/20"
                            style="width: {Math.min(100, (cls.studentIds?.length || 0) / (cls.max_students || 10) * 100)}%"
                          ></div>
                       </div>
                    </div>
                  </td>
                  <td class="px-12 py-12 text-right" onclick={(e) => e.stopPropagation()}>
                    <div class="flex items-center justify-end gap-5">
                      <button 
                        onclick={() => goto(`/panel/classes/${cls.id}/students`)}
                        class="w-14 h-14 rounded-none bg-zinc-950/80 border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary-400 hover:border-primary-500/30 transition-all active:scale-95 group/btn"
                        title={$t('classes.manage_students')}
                      >
                         <UserCheck size={24} weight="duotone" class="group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button 
                        onclick={() => goto(`/panel/classes/${cls.id}`)}
                        class="w-14 h-14 rounded-none bg-zinc-950/80 border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary-400 hover:border-primary-500/30 transition-all active:scale-95 group/btn"
                      >
                         <Eye size={24} weight="duotone" class="group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button 
                        onclick={() => goto(`/panel/classes/${cls.id}/edit`)}
                        class="w-14 h-14 rounded-none bg-zinc-950/80 border border-white/10 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all active:scale-95 group/btn"
                      >
                         <PencilSimple size={24} weight="duotone" class="group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button 
                        onclick={() => deleteClass(cls.id)}
                        class="w-14 h-14 rounded-none bg-zinc-950/80 border border-white/10 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all active:scale-95 group/btn"
                      >
                         <Trash size={24} weight="duotone" class="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else}
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10" in:fade>
        {#each filteredClasses as cls, i}
           <div 
             class="group bento-card p-10 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-none relative overflow-hidden transition-all duration-700 hover:border-primary-500/30 cursor-pointer"
             onclick={() => goto(`/panel/classes/${cls.id}`)}
             onkeydown={(e) => e.key === 'Enter' && goto(`/panel/classes/${cls.id}`)}
             role="button"
             tabindex="0"
             in:fly={{ y: 30, delay: i * 50, duration: 800 }}
           >
              <div class="absolute -right-16 -top-16 w-64 h-64 bg-primary-600/5 rounded-none blur-[80px] group-hover:bg-primary-600/10 transition-colors"></div>
              
              <div class="relative z-10 flex flex-col gap-10 h-full">
                 <div class="flex items-start justify-between">
                    <div class="w-24 h-24 bg-zinc-950 border border-white/10 rounded-none flex items-center justify-center text-white font-outfit font-black text-4xl shadow-2xl relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                       <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent"></div>
                       <span class="relative z-10">{cls.name[0].toUpperCase()}</span>
                    </div>
                    <div class="flex flex-col items-end gap-3">
                       <span class="px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-none text-[9px] font-black text-primary-400 uppercase tracking-widest">{cls.level || $t('classes.level.beginner')}</span>
                    </div>
                 </div>

                 <div class="space-y-4">
                    <h3 class="text-4xl font-outfit font-black text-white group-hover:text-primary-400 transition-colors tracking-tighter uppercase leading-none">{cls.name}</h3>
                    <div class="flex items-center gap-4 text-slate-400 font-jakarta font-bold text-sm uppercase tracking-tight">
                       <Buildings weight="duotone" size={18} class="text-blue-500" />
                       {getSchoolName(cls.school_id)}
                    </div>
                 </div>

                 <div class="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div class="space-y-3">
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{$t('classes.occupancy')}</p>
                       <div class="flex items-center gap-3">
                          <span class="text-2xl font-outfit font-black text-white tracking-tighter">{cls.studentIds?.length || 0}<span class="text-sm text-slate-500 ml-1">/{cls.max_students || 10}</span></span>
                          <div class="flex-1 h-2 bg-black/40 rounded-none overflow-hidden">
                             <div class="h-full bg-primary-500 rounded-none" style="width: {Math.min(100, (cls.studentIds?.length || 0) / (cls.max_students || 10) * 100)}%"></div>
                          </div>
                       </div>
                    </div>
                    <div class="space-y-3 text-right">
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{$t('classes.metrics.monthly_fee')}</p>
                       <p class="text-2xl font-outfit font-black text-primary-400 tracking-tighter">{cls.price || 0}<span class="text-sm ml-1 text-slate-600">{$t('common.currency_symbol')}</span></p>
                    </div>
                 </div>

                 <div class="mt-auto flex items-center justify-between pt-8 group-hover:translate-x-2 transition-transform duration-500">
                    <div class="flex items-center gap-4">
                       <div class="flex -space-x-3">
                          {#each Array(Math.min(3, cls.studentIds?.length || 0)) as _}
                            <div class="w-10 h-10 rounded-none bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-black text-slate-500">
                               <Users size={16} />
                            </div>
                          {/each}
                          {#if (cls.studentIds?.length || 0) > 3}
                            <div class="w-10 h-10 rounded-none bg-primary-600 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-black text-white">
                               +{(cls.studentIds?.length || 0) - 3}
                            </div>
                          {/if}
                       </div>
                       <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">{$t('classes.metrics.enrolled')}</p>
                    </div>
                    <ArrowUpRight size={24} weight="bold" class="text-primary-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </div>
              </div>
           </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<ConfirmModal
  bind:show={showDeleteModal}
  title={$t('classes.delete_btn')}
  message={$t('classes.delete_confirm').replace('{name}', classToDelete?.name || '')}
  confirmText={$t('common.delete')}
  cancelText={$t('common.cancel')}
  onConfirm={confirmDelete}
  type="danger"
/>

<ConfirmModal
  bind:show={showDeleteAllModal}
  title={$t('classes.delete_btn')}
  message={$t('classes.delete_all_warning') || '¿Estás seguro de que quieres eliminar todas las clases? Esta acción no se puede deshacer.'}
  confirmText={$t('common.delete')}
  cancelText={$t('common.cancel')}
  onConfirm={confirmDeleteAll}
  type="danger"
/>

<style lang="postcss">

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .custom-scrollbar::-webkit-scrollbar {
    height: 8px;
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
    background-clip: content-box;
  }
</style>

