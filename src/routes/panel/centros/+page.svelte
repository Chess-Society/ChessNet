<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    School, 
    Plus, 
    Edit, 
    Trash2,
    MapPin,
    Users,
    ChevronRight,
    Search
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  let searchQuery = $state('');

  // Datos reactivos desde el store
  let schools = $derived($appStore.schools || []);
  let students = $derived($appStore.students || []);

  const filteredSchools = $derived(() => {
    return schools.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const getStudentCount = (school_id: string) => {
    return students.filter(s => s.school_id === school_id).length;
  };

  const deleteSchool = (id: string) => {
    const school = schools.find(s => s.id === id);
    if (confirm(`¿Eliminar el centro ${school?.name}? Esto no eliminará a los alumnos, pero quedarán sin centro asignado.`)) {
      appStore.removeSchool(id);
    }
  };
</script>

<svelte:head>
  <title>Centros Educativos - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
          <School class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Centros Educativos</h1>
          <p class="text-slate-400 text-sm">Organiza las instituciones donde impartes tus lecciones.</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/centros/create')}
      class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
    >
      <Plus class="w-4 h-4" />
      Añadir Centro
    </button>
  </div>

  <div class="relative group mb-8">
    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
    <input
      type="text"
      placeholder="Buscar centro por nombre..."
      bind:value={searchQuery}
      class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all backdrop-blur-xl"
    />
  </div>

  {#if filteredSchools().length === 0}
    <div class="bg-[#1e293b]/40 border-2 border-slate-800 border-dashed rounded-[3rem] p-16 md:p-32 text-center space-y-8" in:fade>
      <div class="relative inline-block">
        <div class="w-32 h-32 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-indigo-500/20 text-indigo-400 animate-bounce-subtle">
          <School class="w-16 h-16" />
        </div>
        <div class="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl">
           <Plus class="w-6 h-6 text-emerald-500" />
        </div>
      </div>
      
      <div class="max-w-md mx-auto space-y-3">
        <h2 class="text-2xl font-bold text-white tracking-tight">Todo gran maestro necesita un lugar donde enseñar</h2>
        <p class="text-slate-500 text-lg leading-relaxed">Añade tu primer colegio o club para empezar a organizar tu imperio del ajedrez.</p>
      </div>

      <button 
        onclick={() => goto('/panel/centros/create')}
        class="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-3 mx-auto group ring-4 ring-indigo-600/10"
      >
        <Plus class="w-5 h-5 transition-transform group-hover:rotate-90" />
        CREAR MI PRIMER CENTRO
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredSchools() as school, i}
        <div 
          class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="flex items-center justify-between mb-6 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-500 font-bold text-lg group-hover:scale-110 transition-all">
                {school.name[0].toUpperCase()}
              </div>
              <div>
                <h3 class="text-white font-bold leading-tight group-hover:text-blue-400 transition-colors">{school.name}</h3>
                <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5 uppercase tracking-wide">
                    <MapPin class="w-3 h-3" />
                    {school.location || 'Ubicación no definida'}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onclick={() => goto(`/panel/centros/${school.id}/edit`)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteSchool(school.id)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
            <div class="flex items-center gap-4">
               <div class="flex items-center gap-1.5">
                  <Users class="w-4 h-4 text-slate-500" />
                  <span class="text-xs font-bold text-white">{getStudentCount(school.id)} Alumnos</span>
               </div>
            </div>

            <button 
              onclick={() => goto(`/panel/centros/${school.id}`)}
              class="flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:text-white transition-all group/btn"
            >
              GESTIONAR
              <ChevronRight class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
