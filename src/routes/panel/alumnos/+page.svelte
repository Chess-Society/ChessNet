<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Users, 
    Plus, 
    Edit, 
    Trash2,
    Search,
    School,
    ChevronRight,
    UserCircle,
    X,
    Filter
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  // Filtros
  let searchQuery = $state('');
  let selectedCenter = $state('');

  // Datos reactivos desde el store
  let students = $derived($appStore.students || []);
  let centers = $derived($appStore.centers || []);

  const filteredStudents = $derived(() => {
    return students.filter(s => {
      const nameMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const centerMatch = !selectedCenter || s.centerId === selectedCenter;
      return nameMatch && centerMatch;
    });
  });

  const getCenterName = (id: string | undefined) => {
    return centers.find(c => c.id === id)?.name || 'Sin centro';
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (confirm(`¿Eliminar a ${student?.name}?`)) {
      appStore.removeStudent(id);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
</script>

<svelte:head>
  <title>Mis Alumnos - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
          <Users class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Comunidad Estudiantil</h1>
          <p class="text-slate-400 text-sm">Gestión y seguimiento de tus alumnos registrados.</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="bg-[#1e293b]/50 border border-slate-800 px-5 py-2.5 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
         <div class="text-right">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registrados</p>
            <p class="text-sm font-bold text-white uppercase">{students.length} ALUMNOS</p>
         </div>
         <div class="w-px h-6 bg-slate-800"></div>
         <div class="text-right">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Activos</p>
            <p class="text-sm font-bold text-white uppercase">{students.length}</p>
         </div>
      </div>
      
      <button 
        onclick={() => goto('/panel/alumnos/create')}
        class="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Matricular
      </button>
    </div>
  </div>

  <!-- Search and Filters Layer (Same as gh-pages logic) -->
  <div class="flex flex-col md:flex-row gap-4 mb-8">
    <div class="flex-grow relative group">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
      <input
        type="text"
        placeholder="Buscar por nombre..."
        bind:value={searchQuery}
        class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all backdrop-blur-xl"
      />
    </div>

    <div class="relative group min-w-[240px]">
      <School class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <select 
        bind:value={selectedCenter} 
        class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-10 py-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl"
      >
        <option value="">Todos los centros</option>
        {#each centers as center}
          <option value={center.id}>{center.name}</option>
        {/each}
      </select>
    </div>

    <button 
      onclick={() => { searchQuery = ''; selectedCenter = ''; }}
      class="bg-slate-800/50 border border-slate-700 text-white px-6 py-4 rounded-2xl text-sm font-bold hover:bg-slate-700 transition-all backdrop-blur-xl"
    >
      Resetear
    </button>
  </div>

  <!-- Students Grid -->
  {#if filteredStudents().length === 0}
    <div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6">
      <div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">
        <Users class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">No se encuentran alumnos</h2>
        <p class="text-slate-500 text-sm">Ajusta los filtros o matricula un nuevo alumno.</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredStudents() as student, i}
        <div 
          class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="flex items-center justify-between mb-6 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-emerald-500 font-bold text-lg group-hover:scale-110 group-hover:border-emerald-500/30 transition-all">
                {getInitials(student.name)}
              </div>
              <div>
                <h3 class="text-white font-bold leading-tight group-hover:text-emerald-400 transition-colors">{student.name}</h3>
                <p class="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">{getCenterName(student.centerId)}</p>
              </div>
            </div>

            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onclick={() => goto(`/panel/alumnos/${student.id}/edit`)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteStudent(student.id)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
            <div class="flex items-center gap-2">
               <span class="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  ALUMNO
               </span>
               {#if student.level}
                <span class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                  {student.level}
                </span>
               {/if}
            </div>

            <button 
              onclick={() => goto(`/panel/alumnos/${student.id}`)}
              class="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider hover:text-white transition-all group/btn"
            >
              VER PERFIL
              <ChevronRight class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
