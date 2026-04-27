<script lang="ts">
  import { fade, fly, slide } from 'svelte/transition';
  import { 
    Trophy, 
    Calendar, 
    SealCheck, 
    XCircle, 
    CaretDown, 
    GraduationCap,
    ChartLineUp,
    Target,
    Medal,
    Info
  } from 'phosphor-svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  let { data } = $props();
  const students = $derived(data.students);
  const currentStudent = $derived(data.currentStudent);
  const skills = $derived(data.skills);
  const attendance = $derived(data.attendance);

  let showSelector = $state(false);

  const switchStudent = (id: string) => {
    showSelector = false;
    goto(`/portal/progress?studentId=${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-400 bg-green-400/10 border-green-500/20';
      case 'absent': return 'text-red-400 bg-red-400/10 border-red-500/20';
      case 'late': return 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'absent': return 'Ausente';
      case 'late': return 'Tarde';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
</script>

<svelte:head>
  <title>Progreso de {currentStudent?.firstName} - ChessNet</title>
</svelte:head>

<div class="space-y-12">
  <!-- Top Header with Selector -->
  <header class="flex flex-col md:flex-row md:items-end justify-between gap-6" in:fly={{ y: -20, duration: 600 }}>
    <div class="space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
        <Target size={12} weight="fill" />
        <span>Seguimiento Académico</span>
      </div>
      <h1 class="text-4xl font-display font-black tracking-tighter text-white uppercase italic">
        Informe de <span class="text-blue-500">{currentStudent?.firstName}</span>
      </h1>
    </div>

    {#if students.length > 1}
      <div class="relative">
        <button 
          onclick={() => showSelector = !showSelector}
          class="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all group"
        >
          <div class="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center overflow-hidden">
             {#if currentStudent?.avatar}
               <img src={currentStudent.avatar} alt="" class="w-full h-full object-cover" />
             {:else}
               <GraduationCap size={16} weight="duotone" class="text-blue-400" />
             {/if}
          </div>
          <span class="text-sm font-bold text-white uppercase tracking-tight">{currentStudent?.firstName}</span>
          <CaretDown size={16} class="text-zinc-500 group-hover:text-white transition-transform {showSelector ? 'rotate-180' : ''}" />
        </button>

        {#if showSelector}
          <div 
            class="absolute right-0 mt-2 w-64 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            transition:slide
          >
            {#each students as s}
              <button 
                onclick={() => switchStudent(s.id)}
                class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left {s.id === currentStudent?.id ? 'bg-blue-600/10' : ''}"
              >
                <div class="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center overflow-hidden">
                  {#if s.avatar}
                    <img src={s.avatar} alt="" class="w-full h-full object-cover" />
                  {:else}
                    <GraduationCap size={14} weight="duotone" class="text-zinc-500" />
                  {/if}
                </div>
                <span class="text-xs font-bold text-white uppercase">{s.firstName} {s.lastName}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left: Stats & Level -->
    <div class="space-y-8">
      <div class="bento-card bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/20">
        <div class="flex items-center justify-between mb-8">
          <div class="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
            <Trophy size={24} weight="duotone" />
          </div>
          <div class="text-right">
            <p class="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nivel Técnico</p>
            <p class="text-3xl font-display font-black text-white italic">{currentStudent?.elo || 1200} ELO</p>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>Progreso de Nivel</span>
            <span>{((currentStudent?.elo || 1200) / 2500 * 100).toFixed(0)}%</span>
          </div>
          <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" style="width: {((currentStudent?.elo || 1200) / 2500 * 100)}%"></div>
          </div>
        </div>
      </div>

      <div class="bento-card">
        <h3 class="text-lg font-display font-black text-white uppercase italic tracking-tight mb-6 flex items-center gap-2">
          <Calendar size={18} weight="duotone" class="text-blue-500" />
          Asistencia Reciente
        </h3>
        <div class="space-y-3">
          {#each attendance as entry}
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{formatDate(entry.date)}</span>
                <span class="text-xs font-bold text-zinc-300">{entry.className || 'Clase de Ajedrez'}</span>
              </div>
              <div class="px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest {getStatusColor(entry.status)}">
                {getStatusLabel(entry.status)}
              </div>
            </div>
          {:else}
            <div class="py-10 text-center">
              <p class="text-zinc-600 text-xs italic">No hay registros de asistencia.</p>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right: Skills & Knowledge -->
    <div class="lg:col-span-2 space-y-8">
      <div class="bento-card">
        <div class="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div>
            <h3 class="text-2xl font-display font-black text-white uppercase italic tracking-tight">Habilidades Adquiridas</h3>
            <p class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Mapa de conocimientos y dominio</p>
          </div>
          <div class="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
            <Medal size={24} weight="duotone" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each skills as skill}
            <div class="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all">
              <div class="flex items-start justify-between mb-4">
                <div class="space-y-1">
                  <span class="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">{skill.category}</span>
                  <h4 class="text-sm font-bold text-zinc-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{skill.name}</h4>
                </div>
                <div class="flex items-center gap-1 px-2 py-1 bg-blue-600/10 rounded-lg">
                   <span class="text-[10px] font-black text-blue-400">{skill.score || 0}%</span>
                </div>
              </div>
              <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000" style="width: {skill.score || 0}%"></div>
              </div>
            </div>
          {:else}
            <div class="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <ChartLineUp size={48} weight="thin" class="mx-auto text-zinc-800 mb-4 opacity-20" />
              <p class="text-zinc-500 font-bold italic uppercase tracking-widest">Aún no se han evaluado habilidades específicas</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Observations / Notes -->
      <div class="bento-card border-l-4 border-l-blue-500">
        <h3 class="text-lg font-display font-black text-white uppercase italic tracking-tight mb-4 flex items-center gap-2">
          <Info size={18} weight="duotone" class="text-blue-500" />
          Observaciones del Profesor
        </h3>
        <div class="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 italic text-zinc-400 text-sm leading-relaxed">
          {currentStudent?.notes || 'No hay observaciones adicionales para este periodo.'}
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .bento-card {
    @apply p-8 bg-[#121214]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem];
  }
</style>
