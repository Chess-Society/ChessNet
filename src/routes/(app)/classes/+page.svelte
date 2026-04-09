<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    GraduationCap, 
    Plus, 
    Edit, 
    Trash2,
    Search,
    Filter,
    Users,
    UserPlus,
    School,
    Calendar,
    UserCheck,
    Target,
    BookOpen,
    Eye,
    Activity,
    RefreshCw,
    X,
    ChevronRight,
    ArrowUpRight,
    MoreHorizontal
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, slide, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let classes = $state((data.classes || []) as any[]);
  let stats = $derived(data.stats || { 
    total: 0, 
    levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, 
    schools: {}, totalStudents: 0, totalCapacity: 0, occupancyRate: 0, averageClassSize: 0 
  });
  let schools = $derived(data.schools || []);
  
  let searchQuery = $state('');
  let selectedLevel = $state('');
  let selectedSchool = $state('');

  const filteredClasses = $derived(
    (classes as ClassItem[]).filter(classItem => {
      const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (classItem.description && classItem.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLevel = !selectedLevel || classItem.level === selectedLevel;
      const matchesSchool = !selectedSchool || classItem.college_id === selectedSchool;
      return matchesSearch && matchesLevel && matchesSchool;
    })
  );

  interface ClassItem {
    id: string;
    name: string;
    description?: string;
    level: string;
    college_id: string;
  }

  const levelLabels: Record<string, string> = {
    beginner: 'PRINCIPIANTE',
    intermediate: 'INTERMEDIO',
    advanced: 'AVANZADO',
    mixed: 'MIXTO'
  };

  const levelThemes: Record<string, string> = {
    beginner: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    intermediate: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
    advanced: 'text-red-400 border-red-500/20 bg-red-500/10',
    mixed: 'text-purple-400 border-purple-500/20 bg-purple-500/10'
  };

  const getSchoolName = (collegeId: string) => {
    const school = schools.find((s: {id: string, name: string}) => s.id === collegeId);
    return school?.name || 'CENTRO NO ASIGNADO';
  };

  async function deleteClass(classId: string) {
    const classItem = classes.find(c => c.id === classId);
    if (!confirm(`¿ESTÁS SEGURO DE QUE DESEAS ELIMINAR LA CLASE "${classItem?.name.toUpperCase()}"?`)) return;
    
    try {
      const response = await fetch('/api/classes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: classId })
      });

      if (response.ok) {
        classes = classes.filter(c => c.id !== classId);
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  }

  const clearFilters = () => {
    searchQuery = '';
    selectedLevel = '';
    selectedSchool = '';
  };
</script>

<svelte:head>
  <title>Gestión de Clases - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">
          <GraduationCap class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Gestión Académica</h1>
          <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Control de Aulas y Programas Formativos</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/classes/create')}
      class="bg-primary-500 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center justify-center gap-3 group"
    >
      <Plus class="w-5 h-5 transition-transform group-hover:rotate-90" />
      NUEVA CLASE
    </button>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="glass-panel p-8 border-t-4 border-primary-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <GraduationCap class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Total Programas</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{classes.length}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">GRUPOS</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-blue-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Users class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Alumnos Inscritos</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{stats.totalStudents}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">ACTIVOS</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-orange-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Activity class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Ocupación Media</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{stats.occupancyRate.toFixed(0)}%</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">CAPACIDAD</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-purple-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <School class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Centros Asignados</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{schools.length}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">SEDES</p>
       </div>
    </div>
  </div>

  <!-- Filters Area -->
  <div class="flex flex-col lg:flex-row gap-4">
    <div class="flex-grow relative group">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors" />
      <input
        type="text"
        placeholder="BUSCAR POR NOMBRE O DESCRIPCIÓN..."
        bind:value={searchQuery}
        class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all backdrop-blur-xl"
      />
    </div>

    <select 
      bind:value={selectedLevel} 
      class="bg-surface-950/50 border border-surface-900 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl min-w-[200px]"
    >
      <option value="">TODOS LOS NIVELES</option>
      <option value="beginner">PRINCIPIANTE</option>
      <option value="intermediate">INTERMEDIO</option>
      <option value="advanced">AVANZADO</option>
      <option value="mixed">MIXTO</option>
    </select>

    <select 
      bind:value={selectedSchool} 
      class="bg-surface-950/50 border border-surface-900 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl min-w-[200px]"
    >
      <option value="">TODOS LOS CENTROS</option>
      {#each schools as school}
        <option value={school.id}>{school.name.toUpperCase()}</option>
      {/each}
    </select>

    <button 
      onclick={clearFilters} 
      class="bg-surface-900/50 border border-surface-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all backdrop-blur-xl"
    >
      RESETEAR
    </button>
  </div>

  <!-- Classes Grid -->
  {#if filteredClasses.length === 0}
    <div class="glass-panel p-24 text-center space-y-6">
      <div class="w-20 h-20 bg-surface-950 border border-surface-900 rounded-3xl flex items-center justify-center mx-auto text-surface-800">
        <GraduationCap class="w-10 h-10" />
      </div>
      <div>
        <p class="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]">No hay clases disponibles</p>
        <p class="text-[9px] font-bold text-surface-800 uppercase tracking-widest mt-2">Prueba a ajustar los criterios de búsqueda.</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {#each filteredClasses as classItem, i}
        <div 
          class="glass-panel group hover:border-primary-500/30 transition-all"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="p-8 space-y-6">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-surface-950 border border-surface-900 rounded-2xl flex items-center justify-center text-primary-400 shadow-xl group-hover:scale-105 transition-transform">
                  <GraduationCap class="w-7 h-7" />
                </div>
                <div>
                  <h3 class="text-base font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors leading-none">{classItem.name}</h3>
                  <p class="text-[9px] font-black text-surface-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <School class="w-3 h-3" />
                    {getSchoolName(classItem.college_id)}
                  </p>
                </div>
              </div>
              
              <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onclick={() => goto(`/classes/${classItem.id}/edit`)}
                  class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-400 hover:text-white hover:border-primary-500/30 transition-all"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteClass(classItem.id)}
                  class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
               {#if classItem.level}
                <span class={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${levelThemes[classItem.level]}`}>
                  {levelLabels[classItem.level]}
                </span>
              {/if}
              <span class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary-500/20 bg-primary-500/10 text-primary-400">
                ACTIVA
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-surface-900/50">
              <div class="space-y-1">
                <p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">MATRICULADOS</p>
                <div class="flex items-center gap-2">
                   <Users class="w-3.5 h-3.5 text-blue-400" />
                   <span class="text-white font-black text-sm">~15</span>
                </div>
              </div>
              <div class="space-y-1">
                <p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">CONTENIDO</p>
                <div class="flex items-center gap-2">
                   <BookOpen class="w-3.5 h-3.5 text-purple-400" />
                   <span class="text-white font-black text-sm">~5 BLOQUES</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3 pt-2">
               <button
                 onclick={() => goto(`/classes/${classItem.id}/attendance`)}
                 class="w-full bg-primary-500/10 border border-primary-500/20 text-primary-400 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-black transition-all flex items-center justify-center gap-3"
               >
                 <UserCheck class="w-4 h-4" />
                 TOMAR ASISTENCIA
               </button>
               
               <div class="grid grid-cols-2 gap-3">
                  <button
                    onclick={() => goto(`/classes/${classItem.id}`)}
                    class="bg-surface-950 border border-surface-900 py-3 rounded-2xl text-[9px] font-black text-surface-500 uppercase tracking-widest hover:text-white hover:border-primary-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye class="w-4 h-4" />
                    DETALLES
                  </button>
                  <button
                    onclick={() => goto(`/students/create?class_id=${classItem.id}`)}
                    class="bg-surface-950 border border-surface-900 py-3 rounded-2xl text-[9px] font-black text-surface-500 uppercase tracking-widest hover:text-white hover:border-primary-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus class="w-4 h-4" />
                    MATRICULAR
                  </button>
               </div>
            </div>

            <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-2">
              {#each [
                { label: 'ALUMNOS', path: 'students' },
                { label: 'TEMARIO', path: 'skills' },
                { label: 'ANÁLISIS', path: 'analysis' }
              ] as sub}
                <button 
                  onclick={() => goto(`/classes/${classItem.id}/${sub.path}`)} 
                  class="px-4 py-2 bg-surface-950/80 border border-surface-900 rounded-xl text-[8px] font-black text-surface-600 hover:text-primary-400 hover:border-primary-500/30 transition-all whitespace-nowrap uppercase tracking-widest"
                >
                   {sub.label}
                </button>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
