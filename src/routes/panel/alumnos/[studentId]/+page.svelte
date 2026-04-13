<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft, 
    Edit, 
    UserCircle, 
    School, 
    FileText, 
    Calendar,
    Activity,
    Award,
    TrendingUp
  } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  let student = $derived(data.student);
  let school = $derived(data.school);
  let classes = $derived(data.classes || []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
</script>

<svelte:head>
  <title>{student?.name || 'Alumno'} - Perfil - ChessNet</title>
</svelte:head>

{#if student}
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6 space-y-10" transition:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={() => goto('/panel/alumnos')}
        class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Volver a la Lista
      </button>

      <div class="flex items-center gap-6">
        <div class="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 font-black text-2xl shadow-2xl shadow-emerald-500/10">
          {getInitials(student.name)}
        </div>
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase leading-none">{student.name}</h1>
          <div class="flex items-center gap-3 mt-2">
            <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              ALUMNO ACTIVO
            </span>
            {#if student.level}
              <span class="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Nivel: {student.level}
              </span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto(`/panel/alumnos/${student.id}/edit`)}
      class="bg-surface-950 border border-surface-800 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 transition-all flex items-center gap-3"
    >
      <Edit class="w-4 h-4" />
      Editar Perfil
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Info -->
    <div class="lg:col-span-2 space-y-8">
      <!-- School Info Card -->
      <section class="glass-panel p-8 space-y-6">
        <div class="flex items-center gap-3 border-b border-surface-900 pb-4">
          <School class="w-5 h-5 text-primary-400" />
          <h2 class="text-sm font-black text-white uppercase tracking-widest">Información Académica</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 bg-surface-950 border border-surface-900 rounded-2xl space-y-2">
            <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Centro Educativo</p>
            <p class="text-white font-bold">{school?.name || 'No asignado'}</p>
          </div>
          <div class="p-4 bg-surface-950 border border-surface-900 rounded-2xl space-y-2">
            <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Clases Inscritas</p>
            <div class="flex flex-wrap gap-2">
              {#if classes.length > 0}
                {#each classes as cls}
                  <span class="px-2 py-1 bg-primary-500/5 border border-primary-500/10 rounded-lg text-[9px] font-black text-primary-400 uppercase">
                    {cls.name}
                  </span>
                {/each}
              {:else}
                <p class="text-surface-700 text-[10px] font-bold uppercase italic">Sin clases</p>
              {/if}
            </div>
          </div>
        </div>
      </section>

      <!-- Notes section -->
      <section class="glass-panel p-8 space-y-6">
        <div class="flex items-center gap-3 border-b border-surface-900 pb-4">
          <FileText class="w-5 h-5 text-primary-400" />
          <h2 class="text-sm font-black text-white uppercase tracking-widest">Observaciones y Notas</h2>
        </div>
        
        <div class="bg-surface-950 border border-surface-900 rounded-2xl p-6 min-h-[200px]">
          {#if student.notes}
            <p class="text-surface-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">{student.notes}</p>
          {:else}
            <div class="flex flex-col items-center justify-center h-full text-surface-700 py-10 space-y-4">
               <FileText class="w-12 h-12 opacity-20" />
               <p class="text-[10px] font-black uppercase tracking-[0.2em]">No hay notas registradas para este alumno</p>
            </div>
          {/if}
        </div>
      </section>
    </div>

    <!-- Stats/Side columns -->
    <div class="space-y-8">
       <section class="glass-panel p-8 space-y-6 border-t-4 border-emerald-500">
          <div class="flex items-center gap-3 pb-2">
             <TrendingUp class="w-5 h-5 text-emerald-400" />
             <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Rendimiento</h3>
          </div>
          
          <div class="space-y-6">
             <div class="flex justify-between items-end">
                <div class="space-y-1">
                   <p class="text-[10px] font-black text-surface-500 uppercase">Progreso Estimado</p>
                   <p class="text-2xl font-black text-white leading-none tracking-tighter">74%</p>
                </div>
                <div class="w-24 h-1.5 bg-surface-900 rounded-full overflow-hidden">
                   <div class="h-full bg-emerald-500 w-[74%]"></div>
                </div>
             </div>
             
             <div class="flex justify-between items-end">
                <div class="space-y-1">
                   <p class="text-[10px] font-black text-surface-500 uppercase">Asistencia Media</p>
                   <p class="text-2xl font-black text-white leading-none tracking-tighter">92%</p>
                </div>
                <div class="w-24 h-1.5 bg-surface-900 rounded-full overflow-hidden">
                   <div class="h-full bg-blue-500 w-[92%]"></div>
                </div>
             </div>
          </div>
       </section>

       <section class="glass-panel p-8 space-y-6">
          <div class="flex items-center gap-3">
             <Award class="w-5 h-5 text-amber-500" />
             <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Logros y Niveles</h3>
          </div>
          
          <div class="space-y-4">
             <div class="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-4">
                <div class="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                   <Award class="w-5 h-5" />
                </div>
                <div>
                   <p class="text-[10px] font-black text-white uppercase">Primer Torneo</p>
                   <p class="text-[9px] font-bold text-surface-500 uppercase">Completado</p>
                </div>
             </div>
          </div>
       </section>
    </div>
  </div>
</div>
{:else}
<div class="h-[60vh] flex flex-col items-center justify-center space-y-6" in:fade>
   <div class="animate-pulse text-surface-800">
      <UserCircle class="w-20 h-20" />
   </div>
   <p class="text-surface-500 font-black text-[10px] uppercase tracking-[0.3em]">Cargando expediente del alumno...</p>
</div>
{/if}

<style lang="postcss">
  .glass-panel {
    @apply bg-surface-900/40 backdrop-blur-xl border border-surface-800 rounded-[2.5rem] shadow-2xl;
  }
</style>
