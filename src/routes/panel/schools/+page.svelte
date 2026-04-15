<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Buildings, 
    Plus, 
    PencilSimple, 
    Trash,
    MapPin,
    Users,
    CaretRight,
    MagnifyingGlass
  } from 'phosphor-svelte';
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
    if (confirm(`¿Eliminar el centro ${school?.name}? Esto no eliminará a los alumnos, pero se quedarán sin centro asignado.`)) {
      appStore.removeSchool(id);
    }
  };
</script>

<svelte:head>
  <title>Centros y Clubes - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pt-8">
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <Buildings size={32} weight="duotone" />
        </div>
        <div>
          <h1 class="text-4xl font-outfit font-bold text-white tracking-tight">Centros y Clubes</h1>
          <p class="text-slate-400 font-jakarta text-sm">Gestiona los centros académicos donde impartes clase.</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/schools/create')}
      class="btn-pill bg-violet-600 text-white px-8 py-3.5 font-bold hover:bg-violet-500 transition-all shadow-violet-flare flex items-center gap-2 group"
    >
      <Plus size={20} weight="bold" class="transition-transform group-hover:rotate-90" />
      Añadir Centro
    </button>
  </div>

  <div class="relative group mb-10">
    <MagnifyingGlass size={20} class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
    <input
      type="text"
      placeholder="Buscar centros por nombre..."
      bind:value={searchQuery}
      class="w-full bg-bento-card border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:border-violet-500/50 outline-none transition-all backdrop-blur-xl font-jakarta"
    />
  </div>

  {#if filteredSchools().length === 0}
    <div class="bento-card border-dashed border-white/10 p-16 md:p-32 text-center space-y-8" in:fade>
      <div class="relative inline-block">
        <div class="w-32 h-32 bg-violet-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-violet-500/20 text-violet-400 animate-bounce-subtle shadow-violet-flare">
          <Buildings size={64} weight="duotone" />
        </div>
        <div class="absolute -bottom-2 -right-2 bg-bento-bg border border-white/10 p-3 rounded-2xl shadow-xl">
             <Plus size={24} weight="bold" class="text-violet-400" />
        </div>
      </div>
      
      <div class="max-w-md mx-auto space-y-4">
        <h2 class="text-3xl font-outfit font-bold text-white tracking-tight">Tu red de centros</h2>
        <p class="text-slate-500 font-jakarta text-lg leading-relaxed">Añade tu primer centro o club para empezar a organizar tus clases.</p>
      </div>

      <button 
        onclick={() => goto('/panel/schools/create')}
        class="btn-pill bg-violet-600 hover:bg-violet-500 text-white px-10 py-5 font-bold transition-all shadow-violet-flare flex items-center gap-3 mx-auto group ring-8 ring-violet-500/5 text-lg"
      >
        <Plus size={24} weight="bold" class="transition-transform group-hover:rotate-90" />
        CREAR PRIMER CENTRO
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredSchools() as school, i}
        <div 
          class="bento-card p-6 border border-white/5 hover:border-violet-500/30 transition-all group relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="flex items-center justify-between mb-6 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-violet-400 font-outfit font-bold text-xl group-hover:scale-105 transition-all shadow-inner">
                {school.name[0].toUpperCase()}
              </div>
              <div>
                <h3 class="text-white font-outfit font-bold text-lg leading-tight group-hover:text-violet-400 transition-colors">{school.name}</h3>
                <div class="flex items-center gap-1.5 text-slate-500 font-jakarta text-[11px] mt-0.5 uppercase tracking-wide">
                    <MapPin size={12} weight="fill" class="text-slate-600" />
                    {school.location || 'Ubicación no definida'}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onclick={() => goto(`/panel/schools/${school.id}/edit`)}
                  class="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-violet-600/20 hover:border-violet-500/30 transition-all"
                  title="Edit"
                >
                  <PencilSimple size={18} />
                </button>
                <button 
                  onclick={() => deleteSchool(school.id)}
                  class="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
            <div class="flex items-center gap-4">
               <div class="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Users size={16} weight="duotone" class="text-violet-400" />
                  <span class="text-xs font-outfit font-bold text-white">{getStudentCount(school.id)}</span>
                  <span class="text-[10px] font-jakarta text-slate-500 uppercase tracking-widest">Alumnos</span>
               </div>
            </div>

            <button 
              onclick={() => goto(`/panel/schools/${school.id}`)}
              class="flex items-center gap-1.5 text-[11px] font-outfit font-bold text-violet-400 uppercase tracking-widest hover:text-white transition-all group/btn"
            >
              GESTIONAR
              <CaretRight size={14} weight="bold" class="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
