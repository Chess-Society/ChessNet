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
    TrendUp
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly, scale } from 'svelte/transition';

  let searchQuery = $state('');

  // Datos reactivos desde el store
  let classes = $derived($appStore.classes || []);
  let schools = $derived($appStore.schools || []);

  const filteredClasses = $derived(
    classes.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSchoolName = (id: string | undefined) => {
    return schools.find(s => s.id === id)?.name || 'Sin asignar';
  };

  const deleteClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    if (confirm(`¿Eliminar la clase ${cls?.name}?`)) {
      appStore.removeClass(id);
    }
  };
</script>

<svelte:head>
  <title>Clases y Grupos - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 pb-20" transition:fade>
  <!-- Main Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pt-10">
    <div class="space-y-4">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-violet-600/10 border border-violet-500/20 rounded-24 flex items-center justify-center text-violet-400 shadow-violet-flare/10 shadow-xl">
          <GraduationCap size={36} weight="duotone" />
        </div>
        <div>
          <h1 class="text-4xl md:text-5xl font-outfit font-extrabold text-white tracking-tighter">Clases y Grupos</h1>
          <p class="text-slate-400 font-jakarta text-lg font-medium tracking-tight mt-1">Organiza tu academia y gestiona los horarios de entrenamiento.</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/classes/create')}
      class="btn-pill bg-violet-600 text-white px-10 py-4 font-bold hover:bg-violet-500 transition-all shadow-violet-flare flex items-center gap-3 group text-sm"
    >
      <Plus size={22} weight="bold" class="transition-transform group-hover:rotate-90" />
      NUEVA CLASE
    </button>
  </div>

  <!-- Search and Quick Filters -->
  <div class="flex flex-col md:flex-row gap-4 mb-10 items-center">
    <div class="relative group flex-1 w-full">
      <MagnifyingGlass size={22} class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
      <input
        type="text"
        placeholder="Buscar clase por nombre o nivel..."
        bind:value={searchQuery}
        class="w-full bg-zinc-900/50 border border-white/5 rounded-24 pl-16 pr-8 py-5 text-base text-white focus:border-violet-500/50 outline-none transition-all backdrop-blur-xl font-jakarta placeholder:text-slate-600"
      />
    </div>
    
    <div class="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
       <div class="px-5 py-3 bg-violet-600 rounded-full text-[10px] font-outfit font-black text-white uppercase tracking-widest shadow-lg shadow-violet-600/20">Todas</div>
       <div class="px-5 py-3 hover:bg-white/5 rounded-full text-[10px] font-outfit font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all cursor-pointer">Activas</div>
       <div class="px-5 py-3 hover:bg-white/5 rounded-full text-[10px] font-outfit font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all cursor-pointer">Archivadas</div>
    </div>
  </div>

  {#if classes.length === 0}
    {@const hasSchools = schools.length > 0}
    <div class="bento-card border-dashed border-white/10 p-20 md:p-32 text-center space-y-10 relative overflow-hidden" in:fade>
      <div class="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent"></div>
      
      <div class="relative inline-block z-10">
        <div class="w-36 h-36 bg-violet-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-violet-500/20 text-violet-400 animate-pulse shadow-violet-flare/20 shadow-2xl">
          <GraduationCap size={72} weight="duotone" />
        </div>
        {#if !hasSchools}
          <div class="absolute -bottom-2 -right-2 bg-zinc-950 border border-white/10 p-4 rounded-2xl shadow-2xl">
             <Buildings size={28} weight="fill" class="text-amber-400" />
          </div>
        {:else}
          <div class="absolute -bottom-2 -right-2 bg-zinc-950 border border-white/10 p-4 rounded-2xl shadow-2xl">
             <Plus size={28} weight="bold" class="text-violet-400" />
          </div>
        {/if}
      </div>
      
      <div class="max-w-lg mx-auto space-y-4 relative z-10">
        {#if !hasSchools}
          <h2 class="text-4xl font-outfit font-extrabold text-white tracking-tighter">Registra un Centro primero</h2>
          <p class="text-slate-400 font-jakarta text-lg leading-relaxed font-medium">Para crear una clase, necesitas vincularla a un colegio, club o sede administrativa.</p>
        {:else}
          <h2 class="text-4xl font-outfit font-extrabold text-white tracking-tighter">Diseña tus Grupos de Éxito</h2>
          <p class="text-slate-400 font-jakarta text-lg leading-relaxed font-medium">Crea tu primera clase para organizar alumnos, registrar asistencia y seguir su progreso técnico.</p>
        {/if}
      </div>

      <button 
        onclick={() => goto(!hasSchools ? '/panel/schools' : '/panel/classes/create')}
        class="btn-pill bg-white text-zinc-950 px-12 py-5 font-black text-xs tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto relative z-10 uppercase"
      >
        {#if !hasSchools}
          <Buildings size={24} weight="duotone" />
          Configurar Centros
        {:else}
          <Plus size={24} weight="bold" />
          Crear mi primera clase
        {/if}
      </button>
    </div>
  {:else if filteredClasses.length === 0}
    <div class="bento-card border-dashed border-white/10 p-24 text-center space-y-8 relative overflow-hidden">
      <div class="absolute inset-0 bg-white/[0.02]"></div>
      <div class="w-24 h-24 bg-zinc-950 rounded-[2rem] flex items-center justify-center mx-auto border border-white/5 text-slate-700 shadow-inner relative z-10">
        <MagnifyingGlass size={48} weight="duotone" />
      </div>
      <div class="space-y-3 relative z-10">
        <h2 class="text-2xl font-outfit font-bold text-white tracking-tight">Sin resultados</h2>
        <p class="text-slate-500 font-jakarta text-base font-medium">No hemos encontrado clases que coincidan con "<span class="text-violet-400">{searchQuery}</span>".</p>
      </div>
      <button 
        onclick={() => searchQuery = ''}
        class="text-[10px] font-outfit font-black text-violet-400 uppercase tracking-widest hover:text-white transition-colors underline underline-offset-8"
      >
        Limpiar búsqueda
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each filteredClasses as cls, i}
        <div 
          class="bento-card p-8 border border-white/5 hover:border-violet-500/30 transition-all group relative overflow-hidden group/card flex flex-col"
          in:fly={{ y: 20, delay: i * 80 }}
        >
          <!-- Background Glow -->
          <div class="absolute -right-20 -top-20 w-48 h-48 bg-violet-600/0 group-hover/card:bg-violet-600/5 blur-3xl rounded-full transition-all duration-700"></div>
          
          <div class="flex items-start justify-between mb-8 relative z-10">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 bg-zinc-900 border border-white/5 rounded-24 flex items-center justify-center text-violet-400 font-outfit font-extrabold text-2xl group-hover/card:scale-110 group-hover/card:border-violet-500/30 transition-all duration-500 shadow-inner">
                {cls.name[0].toUpperCase()}
              </div>
              <div class="min-w-0">
                <h3 class="text-xl font-outfit font-bold text-white leading-tight group-hover/card:text-violet-400 transition-colors truncate">{cls.name}</h3>
                <div class="flex items-center gap-2 mt-1.5">
                   <div class="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                   <p class="text-[10px] font-jakarta font-bold text-slate-500 uppercase tracking-widest truncate">
                     {getSchoolName(cls.school_id)}
                   </p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 relative z-20">
                <button 
                  onclick={() => goto(`/panel/classes/${cls.id}/edit`)}
                  class="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-violet-600/30 hover:border-violet-500/40 transition-all"
                  title="Edit"
                >
                  <PencilSimple size={18} weight="bold" />
                </button>
                <button 
                  onclick={() => deleteClass(cls.id)}
                  class="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                  title="Delete"
                >
                  <Trash size={18} weight="bold" />
                </button>
            </div>
          </div>

          <div class="space-y-4 mb-auto relative z-10">
             <div class="flex items-center gap-3 text-sm font-jakarta text-slate-400 font-medium">
                <div class="p-2 bg-white/5 rounded-lg">
                  <Clock size={16} weight="duotone" class="text-violet-400" />
                </div>
                {cls.schedule || 'Horario flexible'}
             </div>
             <div class="flex items-center gap-3 text-sm font-jakarta text-slate-400 font-medium">
                <div class="p-2 bg-white/5 rounded-lg">
                  <Users size={16} weight="duotone" class="text-violet-400" />
                </div>
                <span class="text-white font-bold">{cls.studentIds?.length || 0}</span> Alumnos activos
             </div>
          </div>

          <div class="flex items-center justify-between pt-8 mt-8 border-t border-white/5 relative z-10">
            <button 
              onclick={() => goto(`/panel/classes/${cls.id}`)}
              class="flex items-center gap-2 text-[11px] font-outfit font-black text-violet-400 hover:text-white uppercase tracking-widest transition-all group/btn"
            >
               Detalles
              <CaretRight size={14} weight="bold" class="transition-transform group-hover/btn:translate-x-1" />
            </button>
            
            <button 
              onclick={() => goto(`/panel/attendance?classId=${cls.id}`)}
              class="px-5 py-2.5 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white border border-violet-500/20 hover:border-violet-400 rounded-full text-[10px] font-outfit font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-violet-600/20 active:scale-95"
            >
              Pasar Lista
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
