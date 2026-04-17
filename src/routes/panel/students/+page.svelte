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

  // Filters
  let searchQuery = $state('');
  let selectedSchool = $state('');

  // Reactive data from store
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
    return schools.find(s => s.id === id)?.name || 'Sin asignar';
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
    <div class="space-y-4 lg:space-y-4">
      <div class="flex items-center gap-4 lg:gap-6">
        <div class="w-12 h-12 lg:w-16 lg:h-16 bg-violet-600/10 border border-violet-500/20 rounded-xl lg:rounded-24 flex items-center justify-center text-violet-400 shadow-violet-flare/10 shadow-xl">
          <Users size={24} weight="duotone" class="lg:hidden" />
          <Users size={32} weight="duotone" class="hidden lg:block" />
        </div>
        <div>
          <h1 class="text-2xl lg:text-5xl font-outfit font-extrabold text-white tracking-tight lg:tracking-tighter">Comunidad</h1>
          <p class="text-slate-400 font-jakarta text-sm lg:text-lg font-medium">Gestión y seguimiento de alumnos.</p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3 lg:gap-4">
      <div class="bento-card !px-4 lg:!px-8 !py-3 lg:!py-4 flex items-center gap-4 lg:gap-8 backdrop-blur-xl">
         <div class="text-right">
            <p class="text-[9px] lg:text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Registrados</p>
            <p class="text-xl lg:text-2xl font-outfit font-bold text-white tracking-tighter">{students.length}</p>
         </div>
         <div class="w-px h-8 lg:h-10 bg-white/5"></div>
         <div class="text-right">
            <p class="text-[9px] lg:text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Activos</p>
            <p class="text-xl lg:text-2xl font-outfit font-bold text-violet-400 tracking-tighter">{students.length}</p>
         </div>
      </div>
      
      <button 
        onclick={() => goto('/panel/students/create')}
        class="btn-pill bg-violet-600 text-white px-6 lg:px-10 py-3 lg:py-4 font-bold hover:bg-violet-500 transition-all shadow-violet-flare flex items-center gap-2 lg:gap-3 group text-xs lg:text-sm"
      >
        <Plus size={20} weight="bold" class="transition-transform group-hover:rotate-90 lg:w-6 lg:h-6" />
        RECLUTAR ALUMNO
      </button>
    </div>
  </div>

  <!-- Search and Filters Layer (iOS Style) -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-2 lg:gap-4 mb-6 lg:mb-10">
    <div class="md:col-span-7 relative group">
      <MagnifyingGlass size={18} weight="duotone" class="absolute left-5 lg:left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors lg:w-5 lg:h-5" />
      <input
        type="text"
        placeholder="Buscar alumnos..."
        bind:value={searchQuery}
        class="w-full bg-zinc-900/50 border border-white/5 rounded-xl lg:rounded-2xl pl-12 lg:pl-16 pr-6 py-3 lg:py-4 text-xs lg:text-sm text-white focus:border-violet-500 outline-none transition-all backdrop-blur-xl font-jakarta placeholder:text-slate-600"
      />
    </div>

    <div class="grid grid-cols-2 md:contents gap-2">
      <div class="md:col-span-3 relative group">
        <Buildings size={18} weight="duotone" class="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 lg:w-5 lg:h-5" />
        <select 
          bind:value={selectedSchool} 
          class="w-full bg-zinc-900/50 border border-white/5 rounded-xl lg:rounded-2xl pl-10 lg:pl-16 pr-10 py-3 lg:py-4 text-xs lg:text-sm text-white focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl font-jakarta"
        >
          <option value="">Centros</option>
          {#each schools as school}
            <option value={school.id}>{school.name}</option>
          {/each}
        </select>
      </div>

      <div class="md:col-span-2">
        <button 
          onclick={() => { searchQuery = ''; selectedSchool = ''; }}
          class="w-full h-full bg-white/5 border border-white/10 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-bold hover:bg-white/10 transition-all backdrop-blur-xl font-outfit uppercase tracking-widest"
        >
          Limpiar
        </button>
      </div>
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
          <h2 class="text-3xl font-outfit font-extrabold text-white tracking-tighter">Crea una clase primero</h2>
          <p class="text-slate-500 font-jakarta text-lg font-medium leading-relaxed">Necesitas un grupo antes de inscribir alumnos.</p>
        {:else}
          <h2 class="text-3xl font-outfit font-extrabold text-white tracking-tighter">Tu comunidad espera</h2>
          <p class="text-slate-500 font-jakarta text-lg font-medium leading-relaxed">Inscribe a tus primeros alumnos para empezar.</p>
        {/if}
      </div>

      <button 
        onclick={() => goto(!hasClasses ? '/panel/classes' : '/panel/students/create')}
        class="btn-pill bg-violet-600 hover:bg-violet-500 text-white px-12 py-6 font-bold transition-all shadow-violet-flare flex items-center gap-4 mx-auto group ring-8 ring-violet-500/5 text-xl"
      >
        {#if !hasClasses}
          <GraduationCap size={28} weight="duotone" />
          Configurar Clases
        {:else}
          <Plus size={28} weight="bold" class="transition-transform group-hover:rotate-90" />
          Inscribir Alumno
        {/if}
      </button>
    </div>
  {:else if filteredStudents().length === 0}
    <div class="bento-card border-dashed border-white/10 p-32 text-center space-y-6">
      <div class="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 text-slate-600">
        <MagnifyingGlass size={48} weight="duotone" />
      </div>
      <div class="max-w-md mx-auto space-y-6">
        <h2 class="text-3xl font-outfit font-bold text-white tracking-tight">Tu comunidad crece</h2>
        <p class="text-slate-500 font-jakarta text-lg leading-relaxed">No hemos encontrado alumnos con estos criterios. Añade uno nuevo para empezar.</p>
        
        <button 
          onclick={() => { searchQuery = ''; selectedSchool = ''; }}
          class="text-violet-400 font-bold hover:text-white transition-colors underline underline-offset-8 decoration-violet-500/30"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredStudents() as student, i}
        <div 
          class="bento-card !p-5 lg:!p-8 border border-white/5 hover:border-violet-500/30 transition-all group relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="flex items-start justify-between mb-6 lg:mb-8 relative z-10">
            <div class="flex items-center gap-4 lg:gap-5">
              <div class="w-12 h-12 lg:w-16 lg:h-16 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-violet-400 font-outfit font-extrabold text-lg lg:text-2xl group-hover:scale-105 group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all shadow-inner relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {getInitials(student.name)}
              </div>
              <div class="min-w-0">
                <h3 class="text-white font-outfit font-bold text-lg lg:text-xl leading-snug group-hover:text-violet-400 transition-colors truncate">{student.name}</h3>
                <p class="text-[9px] lg:text-[11px] font-jakarta font-black text-slate-500 uppercase tracking-widest mt-1 lg:mt-1.5 flex items-center gap-2">
                  <Buildings weight="duotone" size={12} class="text-violet-500/60 lg:w-3.5 lg:h-3.5" />
                  {getSchoolName(student.school_id)}
                </p>
              </div>
            </div>

            <div class="flex items-center lg:flex-col gap-1 lg:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all lg:-translate-y-2 lg:group-hover:translate-y-0 duration-300">
                <button 
                  onclick={() => goto(`/panel/students/${student.id}/edit`)}
                  class="p-2 lg:p-3 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all shadow-lg"
                  title="Editar"
                >
                  <PencilSimple size={14} weight="bold" class="lg:w-4.5 lg:h-4.5" />
                </button>
                <button 
                  onclick={() => deleteStudent(student.id)}
                  class="p-2 lg:p-3 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-lg"
                  title="Eliminar"
                >
                  <Trash size={14} weight="bold" class="lg:w-4.5 lg:h-4.5" />
                </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 lg:pt-6 border-t border-white/5 relative z-10">
            <div class="flex items-center gap-2">
               <span class="px-2 lg:px-3 py-1 lg:py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] lg:text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">
                  ALUMNO
               </span>
               {#if student.level}
                <span class="px-2 lg:px-3 py-1 lg:py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[8px] lg:text-[10px] font-outfit font-black text-violet-400 uppercase tracking-widest">
                  {student.level}
                </span>
               {/if}
            </div>

            <button 
              onclick={() => goto(`/panel/students/${student.id}`)}
              class="flex items-center gap-1 text-[9px] lg:text-[11px] font-outfit font-bold text-violet-400 uppercase tracking-widest hover:text-white transition-all group/btn"
            >
              VER PERFIL
              <CaretRight size={12} weight="bold" class="transition-transform group-hover/btn:translate-x-1 lg:w-3.5 lg:h-3.5" />
            </button>
          </div>
          
          <!-- Decorative element -->
          <div class="absolute -bottom-10 -right-10 w-24 h-24 bg-violet-600/5 blur-3xl rounded-full group-hover:bg-violet-600/10 transition-colors"></div>
        </div>
      {/each}
    </div>
  {/if}
</div>
