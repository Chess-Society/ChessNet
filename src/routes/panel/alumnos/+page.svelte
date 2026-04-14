<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Users, 
    Plus, 
    PencilSimple, 
    Trash,
    MagnifyingGlass,
    Buildings,
    CaretRight,
    UserCircle,
    X,
    Funnel,
    GraduationCap,
    IdentificationBadge
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  // Filtros
  let searchQuery = $state('');
  let selectedSchool = $state('');

  // Datos reactivos desde el store
  let students = $derived($appStore.students || []);
  let schools = $derived($appStore.schools || []);

  const filteredStudents = $derived(() => {
    return students.filter(s => {
      const nameMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const schoolMatch = !selectedSchool || s.school_id === selectedSchool;
      return nameMatch && schoolMatch;
    });
  });

  const getSchoolName = (id: string | undefined) => {
    return schools.find(s => s.id === id)?.name || 'Sin centro';
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
  <title>Comunidad - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 pb-12" transition:fade>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pt-8">
    <div class="space-y-4">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-violet-600/10 border border-violet-500/20 rounded-24 flex items-center justify-center text-violet-400 shadow-violet-flare/10 shadow-xl">
          <Users size={32} weight="duotone" />
        </div>
        <div>
          <h1 class="text-4xl md:text-5xl font-outfit font-extrabold text-white tracking-tighter">Comunidad</h1>
          <p class="text-slate-400 font-jakarta text-lg font-medium">Gestión y seguimiento de alumnos.</p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <div class="bento-card !px-8 !py-4 flex items-center gap-8 backdrop-blur-xl">
         <div class="text-right">
            <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Registrados</p>
            <p class="text-2xl font-outfit font-bold text-white tracking-tighter">{students.length}</p>
         </div>
         <div class="w-px h-10 bg-white/5"></div>
         <div class="text-right">
            <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Activos</p>
            <p class="text-2xl font-outfit font-bold text-violet-400 tracking-tighter">{students.length}</p>
         </div>
      </div>
      
      <button 
        onclick={() => goto('/panel/alumnos/create')}
        class="btn-pill bg-violet-600 text-white px-10 py-4 font-bold hover:bg-violet-500 transition-all shadow-violet-flare flex items-center gap-3 group text-sm"
      >
        <Plus size={20} weight="bold" class="transition-transform group-hover:rotate-90" />
        Nuevo Alumno
      </button>
    </div>
  </div>

  <!-- Search and Filters Layer -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
    <div class="md:col-span-7 relative group">
      <MagnifyingGlass size={22} weight="duotone" class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
      <input
        type="text"
        placeholder="Buscar por nombre de alumno..."
        bind:value={searchQuery}
        class="w-full bg-zinc-900/50 border border-white/5 rounded-24 pl-16 pr-6 py-5 text-base text-white focus:border-violet-500/50 outline-none transition-all backdrop-blur-xl font-jakarta placeholder:text-slate-600"
      />
    </div>

    <div class="md:col-span-3 relative group">
      <Buildings size={22} weight="duotone" class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400" />
      <select 
        bind:value={selectedSchool} 
        class="w-full bg-zinc-900/50 border border-white/5 rounded-24 pl-16 pr-10 py-5 text-base text-white focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl font-jakarta"
      >
        <option value="">Todos los centros</option>
        {#each schools as school}
          <option value={school.id}>{school.name}</option>
        {/each}
      </select>
    </div>

    <div class="md:col-span-2">
      <button 
        onclick={() => { searchQuery = ''; selectedSchool = ''; }}
        class="w-full h-full bg-white/5 border border-white/10 text-white px-6 py-5 rounded-24 text-sm font-bold hover:bg-white/10 transition-all backdrop-blur-xl font-outfit uppercase tracking-widest"
      >
        Resetear
      </button>
    </div>
  </div>

  <!-- Students Grid -->
  {#if students.length === 0}
    {@const hasClasses = $appStore.classes.length > 0}
    <div class="bento-card border-dashed border-white/10 p-20 md:p-40 text-center space-y-10" in:fade>
      <div class="relative inline-block">
        <div class="w-32 h-32 bg-violet-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-violet-500/20 text-violet-400 animate-bounce-subtle shadow-violet-flare/20 shadow-2xl">
          <Users size={64} weight="duotone" />
        </div>
        {#if !hasClasses}
          <div class="absolute -bottom-2 -right-2 bg-zinc-950 border border-white/10 p-4 rounded-2xl shadow-2xl">
             <GraduationCap size={28} weight="duotone" class="text-amber-400" />
          </div>
        {:else}
          <div class="absolute -bottom-2 -right-2 bg-zinc-950 border border-white/10 p-4 rounded-2xl shadow-2xl">
             <Plus size={28} weight="bold" class="text-violet-400" />
          </div>
        {/if}
      </div>
      
      <div class="max-w-md mx-auto space-y-4">
        {#if !hasClasses}
          <h2 class="text-3xl font-outfit font-extrabold text-white tracking-tighter">Primero crea una clase</h2>
          <p class="text-slate-500 font-jakarta text-lg font-medium leading-relaxed">Necesitas un grupo antes de matricular alumnos.</p>
        {:else}
          <h2 class="text-3xl font-outfit font-extrabold text-white tracking-tighter">Tu comunidad te espera</h2>
          <p class="text-slate-500 font-jakarta text-lg font-medium leading-relaxed">Matricula a tus primeros alumnos para empezar.</p>
        {/if}
      </div>

      <button 
        onclick={() => goto(!hasClasses ? '/panel/clases' : '/panel/alumnos/create')}
        class="btn-pill bg-violet-600 hover:bg-violet-500 text-white px-12 py-6 font-bold transition-all shadow-violet-flare flex items-center gap-4 mx-auto group ring-8 ring-violet-500/5 text-xl"
      >
        {#if !hasClasses}
          <GraduationCap size={28} weight="duotone" />
          Configurar Clases
        {:else}
          <Plus size={28} weight="bold" class="transition-transform group-hover:rotate-90" />
          Matricular Alumno
        {/if}
      </button>
    </div>
  {:else if filteredStudents().length === 0}
    <div class="bento-card border-dashed border-white/10 p-32 text-center space-y-6">
      <div class="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 text-slate-600">
        <MagnifyingGlass size={48} weight="duotone" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-outfit font-extrabold text-white tracking-tight">Sin resultados</h2>
        <p class="text-slate-500 font-jakarta text-lg font-medium">Ajusta los filtros de búsqueda.</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredStudents() as student, i}
        <div 
          class="bento-card !p-8 border border-white/5 hover:border-violet-500/30 transition-all group relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="flex items-start justify-between mb-8 relative z-10">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-violet-400 font-outfit font-extrabold text-2xl group-hover:scale-105 group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all shadow-inner relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {getInitials(student.name)}
              </div>
              <div class="min-w-0">
                <h3 class="text-white font-outfit font-bold text-xl leading-snug group-hover:text-violet-400 transition-colors truncate">{student.name}</h3>
                <p class="text-[11px] font-jakarta font-black text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <Buildings weight="duotone" size={14} class="text-violet-500/60" />
                  {getSchoolName(student.school_id)}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 duration-300">
                <button 
                  onclick={() => goto(`/panel/alumnos/${student.id}/edit`)}
                  class="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all shadow-lg"
                  title="Editar"
                >
                  <PencilSimple size={18} weight="bold" />
                </button>
                <button 
                  onclick={() => deleteStudent(student.id)}
                  class="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-lg"
                  title="Eliminar"
                >
                  <Trash size={18} weight="bold" />
                </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
            <div class="flex items-center gap-2">
               <span class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">
                  ALUMNO
               </span>
               {#if student.level}
                <span class="px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[10px] font-outfit font-black text-violet-400 uppercase tracking-widest">
                  {student.level}
                </span>
               {/if}
            </div>

            <button 
              onclick={() => goto(`/panel/alumnos/${student.id}`)}
              class="flex items-center gap-2 text-xs font-outfit font-bold text-violet-400 uppercase tracking-widest hover:text-white transition-all group/btn"
            >
              PERFIL
              <CaretRight size={16} weight="bold" class="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
          
          <!-- Decorative element -->
          <div class="absolute -bottom-10 -right-10 w-24 h-24 bg-violet-600/5 blur-3xl rounded-full group-hover:bg-violet-600/10 transition-colors"></div>
        </div>
      {/each}
    </div>
  {/if}
</div>
