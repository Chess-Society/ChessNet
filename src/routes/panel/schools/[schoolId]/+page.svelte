<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { 
    Buildings, 
    CaretLeft,
    Plus,
    PencilSimple,
    Trash,
    Users,
    GraduationCap,
    Clock,
    MapPin,
    Target,
    ChartLineUp,
    Phone,
    EnvelopeSimple,
    Globe,
    Calendar,
    BookOpen,
    Star,
    CaretRight,
    Pulse,
    MagnifyingGlass,
    Funnel,
    X,
    Layout,
    ArrowUpRight,
    CheckCircle,
    TrendUp
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';

  let showDeleteModal = $state(false);
  let classToDeleteId = $state('');
  let classToDeleteName = $state('');

  let { data } = $props<{ data: PageData }>();

  let school = $derived(data.school as any);
  let classes = $derived((data.classes || []) as any[]);
  let stats = $derived((data.stats || { 
    totalClasses: 0, activeClasses: 0, inactiveClasses: 0,
    totalStudents: 0, totalCapacity: 0, occupancyRate: 0,
    levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 },
    averageClassSize: 0
  }) as any);

  let selectedLevel = $state('');
  let selectedStatus = $state('active');

  const filteredClasses = $derived(
    classes.filter(classItem => {
      const matchesLevel = !selectedLevel || classItem.level === selectedLevel;
      const matchesStatus = selectedStatus === 'all' || selectedStatus === 'active';
      return matchesLevel && matchesStatus;
    })
  );

  const deleteClass = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    if (cls) {
      classToDeleteId = classId;
      classToDeleteName = cls.name;
      showDeleteModal = true;
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/classes/${classToDeleteId}`, { method: 'DELETE' });
      if (response.ok) {
        showDeleteModal = false;
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleCreateClass = () => {
    goto(`/panel/classes/create?schoolId=${school.id}`);
  };

  const handleEditClass = (classId: string) => {
    goto(`/panel/classes/${classId}/edit`);
  };

  const handleViewClass = (classId: string) => {
    goto(`/panel/classes/${classId}`);
  };
</script>

<svelte:head>
  <title>{school?.name || $t('schools.new')} - ChessNet</title>
</svelte:head>

<div class="space-y-12 pb-20 px-6 max-w-7xl mx-auto" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-12">
    <div class="space-y-8">
      <button 
        onclick={() => goto('/panel/schools')}
        class="flex items-center gap-2 text-slate-500 hover:text-violet-400 transition-all group text-[11px] font-bold uppercase tracking-[0.2em]"
      >
        <div class="p-1.5 bg-white/5 border border-white/10 rounded-lg group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all">
          <CaretLeft size={16} weight="bold" class="transition-transform group-hover:-translate-x-1" />
        </div>
        {$t('back')}
      </button>

      <div class="flex items-center gap-8">
        <div class="relative">
          <div class="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full"></div>
          <div class="w-24 h-24 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/40 rounded-[2.5rem] flex items-center justify-center text-violet-400 shadow-2xl backdrop-blur-xl relative z-10 rotate-3 hover:rotate-0 transition-all duration-500 group">
            <Buildings size={48} weight="duotone" class="group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-4xl md:text-5xl font-outfit font-black text-white tracking-tighter uppercase line-clamp-1">{school?.name}</h1>
            <div class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{$t('common.active')}</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            {#if school?.city}
              <span class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                <MapPin size={14} weight="fill" class="text-violet-500" />
                {school.city}
              </span>
            {/if}
            <span class="flex items-center gap-2 text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/5 px-4 py-2 rounded-xl border border-violet-500/10 backdrop-blur-md">
              <Users size={14} weight="bold" />
              {stats.totalStudents} {$t('common.students')}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
      <button 
        onclick={() => school?.id && goto(`/panel/schools/${school.id}/edit`)}
        class="flex items-center gap-2 px-6 py-4 text-[11px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all shadow-lg active:scale-95"
      >
        <PencilSimple size={18} weight="bold" />
        {$t('common.edit')}
      </button>
      <button 
        onclick={() => school?.id && goto(`/panel/classes/create?schoolId=${school.id}`)}
        class="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-violet-flare flex items-center gap-3 group ring-1 ring-white/20"
      >
        <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform" />
        {$t('schools.details.add_class')}
      </button>
    </div>
  </div>

  <!-- Stats Bento Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
    <div class="bento-card p-8 border border-white/5 group hover:border-violet-500/40 transition-all relative overflow-hidden">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-violet-500/5 blur-3xl rounded-full"></div>
      <div class="flex items-start justify-between mb-6">
        <div class="p-3 bg-violet-500/10 rounded-2xl text-violet-400 border border-violet-500/20 group-hover:scale-110 transition-transform">
          <GraduationCap size={24} weight="duotone" />
        </div>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{$t('schools.details.groups')}</span>
      </div>
      <div class="space-y-1">
        <h3 class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{stats.totalClasses}</h3>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{$t('schools.details.active_classes')}</p>
      </div>
    </div>
    
    <div class="bento-card p-8 border border-white/5 group hover:border-blue-500/40 transition-all relative overflow-hidden">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full"></div>
      <div class="flex items-start justify-between mb-6">
        <div class="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
          <Users size={24} weight="duotone" />
        </div>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{$t('common.students')}</span>
      </div>
      <div class="space-y-1">
        <h3 class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{stats.totalStudents || 0}</h3>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{$t('schools.details.total_enrollment')}</p>
      </div>
    </div>

    <div class="bento-card p-8 border border-white/5 group hover:border-fuchsia-500/40 transition-all relative overflow-hidden">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-fuchsia-500/5 blur-3xl rounded-full"></div>
      <div class="flex items-start justify-between mb-6">
        <div class="p-3 bg-fuchsia-500/10 rounded-2xl text-fuchsia-400 border border-fuchsia-500/20 group-hover:scale-110 transition-transform">
          <Target size={24} weight="duotone" />
        </div>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{$t('schools.details.occupancy')}</span>
      </div>
      <div class="space-y-1">
        <h3 class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">
          {Math.round((stats.totalStudents / (stats.totalCapacity || 1)) * 100)}%
        </h3>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{$t('schools.details.capacity_rate')}</p>
      </div>
    </div>

    <div class="bento-card p-8 border border-white/5 group hover:border-amber-500/40 transition-all relative overflow-hidden">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full"></div>
      <div class="flex items-start justify-between mb-6">
        <div class="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
          <TrendUp size={24} weight="duotone" />
        </div>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{$t('schools.details.performance')}</span>
      </div>
      <div class="space-y-1">
        <h3 class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">92%</h3>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{$t('schools.details.avg_progress')}</p>
      </div>
    </div>
  </div>

  <!-- Classes Section -->
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-8">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
          <BookOpen size={28} weight="duotone" class="text-violet-400" />
        </div>
        <div>
          <h2 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">
            {$t('nav.classes')}
          </h2>
          <p class="text-xs text-slate-500 font-jakarta mt-0.5">{$t('schools.details.manage_desc')}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner">
          {#each ['active', 'all'] as status}
            <button 
              onclick={() => selectedStatus = status}
              class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedStatus === status ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {status === 'active' ? $t('common.active') : $t('schools.details.history')}
            </button>
          {/each}
        </div>
        
        <div class="relative group">
          <select bind:value={selectedLevel} class="appearance-none bg-black/40 border border-white/5 rounded-2xl pl-6 pr-14 py-3.5 text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:border-white/20 transition-all shadow-inner backdrop-blur-md">
            <option value="">{$t('common.all')}</option>
            <option value="beginner">{$t('common.levels.beginner')}</option>
            <option value="intermediate">{$t('common.levels.intermediate')}</option>
            <option value="advanced">{$t('common.levels.advanced')}</option>
          </select>
          <CaretRight size={14} weight="bold" class="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none group-hover:text-violet-400 transition-colors" />
        </div>
      </div>
    </div>

    {#if filteredClasses.length === 0}
      <div class="bento-card border-dashed border-white/10 p-24 text-center space-y-10" in:fade>
        <div class="relative inline-block">
          <div class="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 mx-auto text-slate-700">
            <Star size={48} weight="duotone" class="opacity-20 animate-pulse" />
          </div>
        </div>
        <div class="max-w-xs mx-auto space-y-4">
          <h3 class="text-xl font-outfit font-bold text-white uppercase tracking-widest">{$t('schools.details.no_classes')}</h3>
          <p class="text-sm font-jakarta text-slate-500 leading-relaxed">{$t('schools.details.no_classes_desc')}</p>
        </div>
        <button 
          onclick={handleCreateClass}
          class="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-10 py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-violet-flare ring-8 ring-violet-500/5"
        >
          {$t('schools.create_class')}
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {#each filteredClasses as item, i}
          <div 
            class="bento-card p-8 border border-white/5 group hover:border-violet-500/40 transition-all duration-500 relative overflow-hidden flex flex-col justify-between"
            in:fly={{ y: 20, delay: i * 80 }}
          >
            <!-- Background Decoration -->
            <div class="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 pointer-events-none rotate-12">
              <GraduationCap size={200} weight="fill" />
            </div>

            <div class="relative z-10">
              <div class="flex items-start justify-between mb-8">
                <div class="space-y-4">
                  <span class={`text-[9px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-xl border shadow-lg backdrop-blur-md ${
                    item.level === 'beginner' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' :
                    item.level === 'intermediate' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {item.level}
                  </span>
                  <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors leading-tight line-clamp-2">{item.name}</h3>
                </div>
                
                <div class="flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onclick={(e) => { e.stopPropagation(); handleEditClass(item.id); }} 
                    class="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-violet-600/30 rounded-xl transition-all border border-white/10 shadow-2xl backdrop-blur-md"
                  >
                    <PencilSimple size={18} weight="bold" />
                  </button>
                  <button 
                    onclick={(e) => { e.stopPropagation(); deleteClass(item.id); }} 
                    class="p-3 bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all border border-white/10 shadow-2xl backdrop-blur-md"
                  >
                    <Trash size={18} weight="bold" />
                  </button>
                </div>
              </div>

              <div class="space-y-4 mb-10">
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                  <span class="flex items-center gap-2"><Users size={16} weight="duotone" class="text-violet-400" /> {$t('schools.details.enrollment')}</span>
                  <span class="text-white">
                    {(item.students_count || 0)} 
                    <span class="text-slate-600 mx-1">/</span> 
                    {item.max_students || '15'}
                  </span>
                </div>
                <div class="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div 
                    class="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                    style={`width: ${Math.min(((item.students_count || 0) / (item.max_students || 15)) * 100, 100)}%`}
                  ></div>
                </div>
              </div>
            </div>
            
            <button 
              onclick={() => handleViewClass(item.id)}
              class="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-600/20 transition-all flex items-center justify-center gap-3 group/btn relative z-10 shadow-2xl backdrop-blur-md active:scale-95"
            >
              {$t('schools.details.class_panel')}
              <CaretRight size={16} weight="bold" class="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<ConfirmModal
  bind:show={showDeleteModal}
  title={$t('schools.danger_zone')}
  message={$t('classes.delete_confirm').replace('{name}', classToDeleteName)}
  confirmText={$t('schools.delete_permanently')}
  cancelText={$t('common.cancel')}
  onConfirm={confirmDelete}
  type="danger"
/>

