<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
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
    Layout
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

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

  const levelLabels: any = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    mixed: 'Mixed'
  };

  const deleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      const response = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Error deleting class');
      }
    } catch (error) {
      alert('Error deleting class');
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
  <title>{school?.name || 'School'} - ChessNet</title>
</svelte:head>

<div class="space-y-12 pb-20 px-6 max-w-7xl mx-auto" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-8">
    <div class="space-y-6">
      <button 
        onclick={() => goto('/panel/schools')}
        class="flex items-center gap-2 text-zinc-500 hover:text-violet-400 transition-all group text-[10px] font-black uppercase tracking-[0.2em]"
      >
        <CaretLeft size={16} weight="bold" class="transition-transform group-hover:-translate-x-1" />
        Back to Schools
      </button>

      <div class="flex items-center gap-8">
        <div class="w-24 h-24 bg-violet-500/10 border border-violet-500/20 rounded-[2.5rem] flex items-center justify-center text-violet-400 shadow-[0_0_50px_rgba(139,92,246,0.1)] transform -rotate-3 hover:rotate-0 transition-all duration-500 group">
          <Buildings size={48} weight="duotone" class="group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <h1 class="text-5xl font-outfit font-black text-white tracking-tighter uppercase">{school?.name}</h1>
          <div class="flex flex-wrap items-center gap-4 mt-3">
            {#if school?.city}
              <span class="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-900/50 px-4 py-1.5 rounded-full border border-zinc-800">
                <MapPin size={14} weight="duotone" class="text-violet-500" />
                {school.city}
              </span>
            {/if}
            <span class="flex items-center gap-2 text-[10px] font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-4 py-1.5 rounded-full border border-primary-500/20">
              <Pulse size={14} weight="bold" />
              Active Site
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-zinc-900/30 p-2 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
      <button 
        onclick={() => school?.id && goto(`/panel/schools/${school.id}/edit`)}
        class="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-zinc-950/50 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl transition-all"
      >
        <PencilSimple size={16} weight="duotone" />
        Configure Site
      </button>
      <button 
        onclick={() => school?.id && goto(`/panel/classes/create?schoolId=${school.id}`)}
        class="bg-violet-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 transition-all shadow-[0_10px_30px_-10px_rgba(139,92,246,0.4)] flex items-center gap-2 group"
      >
        <Plus size={16} weight="bold" class="group-hover:rotate-90 transition-transform" />
        New Class
      </button>
    </div>
  </div>

  <!-- Bento Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2rem] border-b-4 border-b-violet-500 shadow-xl group hover:-translate-y-1 transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Classes</p>
        <div class="p-2 bg-violet-500/10 rounded-xl text-violet-400">
          <GraduationCap size={20} weight="duotone" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <h3 class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{stats.totalClasses}</h3>
        <span class="text-[10px] font-bold text-zinc-600 uppercase">Classes</span>
      </div>
    </div>
    
    <div class="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2rem] border-b-4 border-b-blue-500 shadow-xl group hover:-translate-y-1 transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Est. Capacity</p>
        <div class="p-2 bg-blue-500/10 rounded-xl text-blue-400">
          <Users size={20} weight="duotone" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <h3 class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{stats.totalCapacity || 0}</h3>
        <span class="text-[10px] font-bold text-zinc-600 uppercase">Slots</span>
      </div>
    </div>

    <div class="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2rem] border-b-4 border-b-purple-500 shadow-xl group hover:-translate-y-1 transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Diversity</p>
        <div class="p-2 bg-purple-500/10 rounded-xl text-purple-400">
          <Target size={20} weight="duotone" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <h3 class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{Object.values(stats.levels || {}).filter((v: any) => v > 0).length}</h3>
        <span class="text-[10px] font-bold text-zinc-600 uppercase">Levels</span>
      </div>
    </div>

    <div class="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2rem] border-b-4 border-b-amber-500 shadow-xl group hover:-translate-y-1 transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Avg Performance</p>
        <div class="p-2 bg-amber-500/10 rounded-xl text-amber-400">
          <ChartLineUp size={20} weight="duotone" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <h3 class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">88%</h3>
        <span class="text-[10px] font-bold text-zinc-600 uppercase">Target</span>
      </div>
    </div>
  </div>

  <!-- Classes Section -->
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
      <h2 class="text-2xl font-outfit font-black text-white uppercase tracking-tight flex items-center gap-3">
        <div class="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
          <BookOpen size={24} weight="duotone" class="text-violet-400" />
        </div>
        Training Classes
      </h2>
      
      <div class="flex items-center gap-4">
        <div class="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
          {#each ['active', 'all'] as status}
            <button 
              onclick={() => selectedStatus = status}
              class={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedStatus === status ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {status === 'active' ? 'Active' : 'History'}
            </button>
          {/each}
        </div>
        
        <div class="relative">
          <select bind:value={selectedLevel} class="appearance-none bg-zinc-950 border border-zinc-800 rounded-2xl pl-6 pr-12 py-3.5 text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:border-zinc-700 transition-all shadow-inner">
            <option value="">ALL LEVELS</option>
            <option value="beginner">BEGINNER</option>
            <option value="intermediate">INTERMEDIATE</option>
            <option value="advanced">ADVANCED</option>
          </select>
          <CaretRight size={14} weight="bold" class="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-zinc-500 pointer-events-none" />
        </div>
      </div>
    </div>

    {#if filteredClasses.length === 0}
      <div class="bg-zinc-900/30 backdrop-blur-sm p-32 text-center space-y-8 rounded-[3rem] border border-dashed border-zinc-800">
        <div class="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-zinc-800 mx-auto text-zinc-800">
          <Star size={48} weight="duotone" class="opacity-30" />
        </div>
        <div class="max-w-xs mx-auto space-y-4">
          <h3 class="text-lg font-outfit font-black text-white uppercase tracking-widest">No classes configured</h3>
          <p class="text-sm font-jakarta text-zinc-500 leading-relaxed">Start organizing training classes in this school now.</p>
        </div>
        <button 
          onclick={handleCreateClass}
          class="bg-violet-600 text-white px-10 py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-violet-500 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] ring-8 ring-violet-500/5"
        >
          Create Class Now
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {#each filteredClasses as item, i}
          <div 
            class="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] group hover:border-violet-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between"
            in:fly={{ y: 20, delay: i * 50 }}
          >
            <!-- Background Decoration -->
            <div class="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110">
              <GraduationCap size={200} weight="fill" />
            </div>

            <div>
              <div class="flex items-start justify-between mb-8 relative z-10">
                <div class="space-y-3">
                  <span class={`text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border shadow-sm ${
                    item.level === 'beginner' ? 'bg-primary-500/10 border-primary-500/20 text-primary-400' :
                    item.level === 'intermediate' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    'bg-purple-500/10 border-purple-500/20 text-purple-400'
                  }`}>
                    {levelLabels[item.level] || item.level}
                  </span>
                  <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors leading-tight">{item.name}</h3>
                </div>
                
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button onclick={() => handleEditClass(item.id)} class="p-3 bg-zinc-950/50 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl transition-all border border-zinc-800 shadow-xl">
                    <PencilSimple size={18} weight="duotone" />
                  </button>
                  <button onclick={() => deleteClass(item.id)} class="p-3 bg-zinc-950/50 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-zinc-800 shadow-xl">
                    <Trash size={18} weight="duotone" />
                  </button>
                </div>
              </div>

              <div class="space-y-4 mb-10 relative z-10">
                <div class="flex items-center justify-between text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  <span class="flex items-center gap-2"><Users size={16} weight="duotone" class="text-violet-500" /> Students</span>
                  <span class="text-zinc-200">{(item.students_count || 0)} <span class="text-zinc-700 mx-1">/</span> {item.max_students || '∞'}</span>
                </div>
                <div class="h-2 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800 shadow-inner">
                  <div class="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]" style={`width: ${Math.min(((item.students_count || 0) / (item.max_students || 10)) * 100, 100)}%`}></div>
                </div>
              </div>
            </div>

            <button 
              onclick={() => handleViewClass(item.id)}
              class="w-full py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-zinc-900 transition-all flex items-center justify-center gap-3 group/btn relative z-10 shadow-lg"
            >
              View Class Panel
              <CaretRight size={16} weight="bold" class="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  /* School detail refined with Bento Dark aesthetics */
</style>
