<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    GraduationCap, 
    Plus, 
    Edit, 
    Trash2,
    Calendar,
    Users,
    ChevronRight,
    Search,
    Clock,
    School
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  let searchQuery = $state('');

  // Datos reactivos desde el store
  let classes = $derived($appStore.classes || []);
  let schools = $derived($appStore.schools || []);

  const filteredClasses = $derived(
    classes.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSchoolName = (id: string | undefined) => {
    return schools.find(s => s.id === id)?.name || 'Sin centro';
  };

  const deleteClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    if (confirm(`¿Eliminar la clase ${cls?.name}?`)) {
      appStore.removeClass(id);
    }
  };
</script>

<svelte:head>
  <title>Gestión de Clases - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500">
          <GraduationCap class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Clases y Grupos</h1>
          <p class="text-slate-400 text-sm">Gestiona tus horarios y la organización de tus grupos de ajedrez.</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/clases/create')}
      class="bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
    >
      <Plus class="w-4 h-4" />
      Nueva Clase
    </button>
  </div>

  <div class="relative group mb-8">
    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
    <input
      type="text"
      placeholder="Buscar clase por nombre..."
      bind:value={searchQuery}
      class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-purple-500/50 outline-none transition-all backdrop-blur-xl"
    />
  </div>

  {#if classes.length === 0}
    {@const hasSchools = schools.length > 0}
    <div class="bg-[#1e293b]/40 border-2 border-slate-800 border-dashed rounded-[3rem] p-16 md:p-32 text-center space-y-8" in:fade>
      <div class="relative inline-block">
        <div class="w-32 h-32 bg-purple-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-purple-500/20 text-purple-400 animate-bounce-subtle">
          <GraduationCap class="w-16 h-16" />
        </div>
        {#if !hasSchools}
          <div class="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl">
             <School class="w-6 h-6 text-orange-400" />
          </div>
        {:else}
          <div class="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl">
             <Plus class="w-6 h-6 text-emerald-500" />
          </div>
        {/if}
      </div>
      
      <div class="max-w-md mx-auto space-y-3">
        {#if !hasSchools}
          <h2 class="text-2xl font-bold text-white tracking-tight">Primero, necesitamos un centro</h2>
          <p class="text-slate-500 text-lg leading-relaxed">Antes de organizar tus clases, debes registrar el colegio, club o centro donde se impartirán.</p>
        {:else}
          <h2 class="text-2xl font-bold text-white tracking-tight">Define tus grupos de estudio</h2>
          <p class="text-slate-500 text-lg leading-relaxed">Crea tu primera clase para empezar a gestionar horarios y pasar lista a tus alumnos.</p>
        {/if}
      </div>

      {#if !hasSchools}
        <button 
          onclick={() => goto('/panel/centros')}
          class="bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-orange-900/40 flex items-center gap-3 mx-auto group ring-4 ring-orange-600/10"
        >
          <School class="w-5 h-5" />
          IR A CENTROS
        </button>
      {:else}
        <button 
          onclick={() => goto('/panel/clases/create')}
          class="bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-purple-900/40 flex items-center gap-3 mx-auto group ring-4 ring-purple-600/10"
        >
          <Plus class="w-5 h-5 transition-transform group-hover:rotate-90" />
          CREAR MI PRIMERA CLASE
        </button>
      {/if}
    </div>
  {:else if filteredClasses.length === 0}
    <div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6">
      <div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">
        <Search class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">No se encuentran clases</h2>
        <p class="text-slate-500 text-sm">Ajusta tu búsqueda o crea una nueva clase.</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredClasses as cls, i}
        <div 
          class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/30 transition-all group relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="flex items-center justify-between mb-6 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-purple-500 font-bold text-lg group-hover:scale-110 transition-all">
                {cls.name[0].toUpperCase()}
              </div>
              <div>
                <h3 class="text-white font-bold leading-tight group-hover:text-purple-400 transition-colors">{cls.name}</h3>
                <p class="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">{getSchoolName(cls.school_id)}</p>
              </div>
            </div>

            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onclick={() => goto(`/panel/clases/${cls.id}/edit`)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-purple-400 hover:border-purple-500/30 transition-all"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteClass(cls.id)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
            </div>
          </div>

          <div class="space-y-3 mb-6 relative z-10">
             <div class="flex items-center gap-2 text-xs text-slate-400">
                <Clock class="w-3.5 h-3.5" />
                {cls.schedule || 'Horario no definido'}
             </div>
             <div class="flex items-center gap-2 text-xs text-slate-400">
                <Users class="w-3.5 h-3.5" />
                {cls.studentIds?.length || 0} Alumnos inscritos
             </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
            <button 
              onclick={() => goto(`/panel/clases/${cls.id}`)}
              class="flex items-center gap-1 text-[10px] font-bold text-purple-500 uppercase tracking-wider hover:text-white transition-all group/btn"
            >
               GESTIONAR CLASE
              <ChevronRight class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
            
            <button 
              onclick={() => goto(`/panel/asistencia?classId=${cls.id}`)}
              class="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors"
            >
              Pasar Lista
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
