<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    School, 
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Users,
    GraduationCap,
    Clock,
    MapPin,
    Target,
    TrendingUp,
    Phone,
    Mail,
    Globe,
    Calendar,
    BookOpen,
    Star,
    ChevronRight,
    Activity,
    Search,
    Filter,
    X
  } from 'lucide-svelte';
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
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    mixed: 'Mixto'
  };

  const deleteClass = async (classId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta clase?')) return;
    try {
      const response = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Error al eliminar la clase');
      }
    } catch (error) {
      alert('Error al eliminar la clase');
    }
  };

  const handleCreateClass = () => {
    goto(`/classes/create?school_id=${school.id}`);
  };

  const handleEditClass = (classId: string) => {
    goto(`/classes/${classId}/edit`);
  };

  const handleViewClass = (classId: string) => {
    goto(`/classes/${classId}`);
  };
</script>

<svelte:head>
  <title>{school?.name || 'Centro'} - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={() => goto('/schools')}
        class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Volver a Centros
      </button>

      <div class="flex items-center gap-6">
        <div class="w-20 h-20 bg-primary-500/10 border border-primary-500/20 rounded-[2.5rem] flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          <School class="w-10 h-10" />
        </div>
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase">{school?.name}</h1>
          <div class="flex flex-wrap items-center gap-4 mt-2">
            {#if school?.city}
              <span class="flex items-center gap-1.5 text-xs font-bold text-surface-500 uppercase tracking-widest bg-surface-900 px-3 py-1 rounded-full border border-surface-800">
                <MapPin class="w-3.5 h-3.5 text-primary-500" />
                {school.city}
              </span>
            {/if}
            <span class="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Activity class="w-3.5 h-3.5" />
              Sede Activa
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => goto(`/schools/${school.id}/edit`)}
        class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
      >
        <Edit class="w-4 h-4" />
        Configurar Sede
      </button>
      <button 
        onclick={() => goto(`/classes/create?school_id=${school.id}`)}
        class="bg-primary-500 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Nueva Clase
      </button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="glass-card p-6 border-b-2 border-primary-500 hover:translate-y-[-4px] transition-transform">
      <p class="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-1">Clases Activas</p>
      <div class="flex items-end justify-between">
        <h3 class="text-3xl font-black text-white leading-none">{stats.totalClasses}</h3>
        <GraduationCap class="w-6 h-6 text-primary-400" />
      </div>
    </div>
    
    <div class="glass-card p-6 border-b-2 border-blue-500 hover:translate-y-[-4px] transition-transform">
      <p class="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-1">Capacidad Est.</p>
      <div class="flex items-end justify-between">
        <h3 class="text-3xl font-black text-white leading-none">{stats.totalCapacity || 0}</h3>
        <Users class="w-6 h-6 text-blue-400" />
      </div>
    </div>

    <div class="glass-card p-6 border-b-2 border-purple-500 hover:translate-y-[-4px] transition-transform">
      <p class="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-1">Niveles Diferentes</p>
      <div class="flex items-end justify-between">
        <h3 class="text-3xl font-black text-white leading-none">{Object.values(stats.levels).filter((v: any) => v > 0).length}</h3>
        <Target class="w-6 h-6 text-purple-400" />
      </div>
    </div>

    <div class="glass-card p-6 border-b-2 border-yellow-500 hover:translate-y-[-4px] transition-transform">
      <p class="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-1">Rendimiento Avg</p>
      <div class="flex items-end justify-between">
        <h3 class="text-3xl font-black text-white leading-none">88%</h3>
        <TrendingUp class="w-6 h-6 text-yellow-400" />
      </div>
    </div>
  </div>

  <!-- Classes Section -->
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h2 class="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
        <BookOpen class="w-5 h-5 text-primary-400" />
        Listado de Clases
      </h2>
      
      <div class="flex items-center gap-3">
        <div class="flex bg-surface-900 border border-surface-800 rounded-xl p-1">
          {#each ['active', 'all'] as status}
            <button 
              onclick={() => selectedStatus = status}
              class={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedStatus === status ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-surface-500 hover:text-white'}`}
            >
              {status === 'active' ? 'Disponibles' : 'Histórico'}
            </button>
          {/each}
        </div>
        
        <select bind:value={selectedLevel} class="bg-surface-900 border border-surface-800 rounded-xl px-4 py-2.5 text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:border-surface-700 transition-all">
          <option value="">TODOS LOS NIVELES</option>
          <option value="beginner">PRINCIPIANTE</option>
          <option value="intermediate">INTERMEDIO</option>
          <option value="advanced">AVANZADO</option>
        </select>
      </div>
    </div>

    {#if filteredClasses.length === 0}
      <div class="glass-panel py-24 text-center space-y-4 border-dashed">
        <div class="w-16 h-16 bg-surface-900 rounded-3xl flex items-center justify-center border border-surface-800 mx-auto text-surface-700 opacity-50">
          <Star class="w-8 h-8" />
        </div>
        <div class="max-w-xs mx-auto space-y-2">
          <h3 class="text-sm font-black text-surface-400 uppercase tracking-widest">Sin clases configuradas</h3>
          <p class="text-xs text-surface-600">Empieza a organizar grupos de entrenamiento en este centro ahora.</p>
        </div>
        <button 
          onclick={handleCreateClass}
          class="btn-primary"
        >
          Crear Clase Ahora
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {#each filteredClasses as item, i}
          <div 
            class="glass-panel p-6 group hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden"
            in:fly={{ y: 20, delay: i * 50 }}
          >
            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <GraduationCap class="w-24 h-24" />
            </div>

            <div class="flex items-start justify-between mb-6">
              <div class="space-y-1">
                <span class={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${
                   item.level === 'beginner' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                   item.level === 'intermediate' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                   'bg-purple-500/10 border-purple-500/20 text-purple-400'
                }`}>
                  {levelLabels[item.level] || item.level}
                </span>
                <h3 class="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors">{item.name}</h3>
              </div>
              
              <div class="flex items-center gap-2 translate-x-2">
                <button onclick={() => handleEditClass(item.id)} class="p-2 text-surface-600 hover:text-white transition-colors">
                  <Edit class="w-4 h-4" />
                </button>
                <button onclick={() => deleteClass(item.id)} class="p-2 text-surface-600 hover:text-red-400 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="space-y-3 mb-6 relative z-10">
              <div class="flex items-center justify-between text-[10px] font-bold text-surface-500 uppercase tracking-widest">
                <span class="flex items-center gap-1.5"><Users class="w-3.5 h-3.5" /> Estudiantes</span>
                <span class="text-surface-300">{(item.students_count || 0)} / {item.max_students || '∞'}</span>
              </div>
              <div class="h-1.5 bg-surface-950 rounded-full overflow-hidden">
                <div class="h-full bg-primary-500" style={`width: ${Math.min(((item.students_count || 0) / (item.max_students || 10)) * 100, 100)}%`}></div>
              </div>
            </div>

            <button 
              onclick={() => handleViewClass(item.id)}
              class="w-full py-3 bg-surface-900 border border-surface-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-surface-500 hover:text-white hover:border-surface-600 transition-all flex items-center justify-center gap-2 group/btn"
            >
              Ver Panel Detallado
              <ChevronRight class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  /* School detail styles */
</style>