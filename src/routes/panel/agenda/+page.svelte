<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { 
    CalendarBlank, 
    Calendar, 
    Clock, 
    MapPin, 
    Trophy, 
    Users, 
    CaretRight,
    ArrowLeft,
    Plus,
    DotsThreeVertical,
    CheckCircle
  } from 'phosphor-svelte';
  import { goto } from '$app/navigation';
  import { appStore } from '$lib/stores/appStore';
  import { onMount } from 'svelte';

  // State using runes
  let filter = $state('all'); // all, classes, tournaments
  let currentDate = $state(new Date());
  
  // Derived data from store
  let classes = $derived($appStore.classes || []);
  let localTournaments = $derived($appStore.localTournaments || []);
  
  // Mock data for "Today" if no real events are found in a specific range
  // In a real app, we'd filter by the selected date
  let events = $derived([
    ...classes.map(c => ({
      id: c.id,
      type: 'class',
      title: c.name,
      time: c.schedule || '17:00 - 18:30',
      location: c.school_name || 'ChessNet Plaza',
      tag: 'Clase',
      color: 'violet'
    })),
    ...localTournaments.map(t => ({
      id: t.id,
      type: 'tournament',
      title: t.name,
      time: t.startAt || 'Mañana, 10:00',
      location: t.location || 'Online',
      tag: 'Torneo',
      color: 'emerald'
    }))
  ].filter(e => filter === 'all' || (filter === 'classes' && e.type === 'class') || (filter === 'tournaments' && e.type === 'tournament')));

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  function getToday() {
    return currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }

</script>

<svelte:head>
  <title>Agenda - ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8" in:fade>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div class="space-y-1">
      <div class="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">
        <CalendarBlank size={14} weight="bold" />
        Gestión de Horarios
      </div>
      <h1 class="text-4xl font-black text-white tracking-tight flex items-center gap-3">
        Tu Agenda
        <span class="text-xs font-medium px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400">
           {events.length} Eventos
        </span>
      </h1>
      <p class="text-slate-400 font-medium capitalize">{getToday()}</p>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <button 
          onclick={() => filter = 'all'}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all {filter === 'all' ? 'bg-zinc-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}"
        >
          Todo
        </button>
        <button 
          onclick={() => filter = 'classes'}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all {filter === 'classes' ? 'bg-zinc-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}"
        >
          Clases
        </button>
        <button 
          onclick={() => filter = 'tournaments'}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all {filter === 'tournaments' ? 'bg-zinc-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}"
        >
          Torneos
        </button>
      </div>

      <button 
        onclick={() => goto('/panel/torneos/create')}
        class="p-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl shadow-lg shadow-violet-900/20 transition-all hover:scale-105 active:scale-95"
      >
        <Plus size={20} weight="bold" />
      </button>
    </div>
  </div>

  <!-- Main Bento Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    
    <!-- Mini Calendar / Navigation (Side) -->
    <div class="lg:col-span-4 space-y-6">
      <div class="bento-card p-6">
        <h3 class="text-white font-bold mb-6 flex items-center justify-between">
          Calendario
          <div class="flex gap-2">
             <button class="p-1.5 hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors">
               <CaretRight size={16} weight="bold" class="rotate-180" />
             </button>
             <button class="p-1.5 hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors">
               <CaretRight size={16} weight="bold" />
             </button>
          </div>
        </h3>
        
        <div class="grid grid-cols-7 gap-2 text-center mb-4">
          {#each daysOfWeek as day}
            <span class="text-[10px] uppercase font-bold text-slate-500">{day}</span>
          {/each}
        </div>
        
        <div class="grid grid-cols-7 gap-2 text-center">
          {#each Array(31) as _, i}
            {@const day = i + 1}
            {@const isToday = day === currentDate.getDate()}
            {@const hasEvent = [5, 12, 18, 24].includes(day)}
            <button class="aspect-square relative flex items-center justify-center rounded-xl text-xs font-bold transition-all
              {isToday ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-zinc-800 hover:text-white'}">
              {day}
              {#if hasEvent && !isToday}
                <div class="absolute bottom-1 w-1 h-1 bg-violet-500 rounded-full"></div>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <div class="bento-card p-6 overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
          <Trophy size={80} weight="duotone" class="text-emerald-400" />
        </div>
        <h3 class="text-white font-bold mb-2">Próximo Gran Evento</h3>
        <p class="text-slate-400 text-xs mb-4">Final de la Liga de Invierno</p>
        <div class="flex items-center gap-3 text-emerald-400 text-xs font-bold bg-emerald-500/5 py-3 px-4 rounded-xl border border-emerald-500/10 mb-4">
           <Clock size={14} weight="bold" />
           Faltan 3 días, 12 horas
        </div>
        <button class="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-colors">
          Ver Detalles
        </button>
      </div>
    </div>

    <!-- Event List (Center/Wide) -->
    <div class="lg:col-span-8 space-y-6">
      <div class="flex items-center justify-between px-2">
        <h2 class="text-xl font-bold text-white tracking-tight">Agenda para Hoy</h2>
        <button class="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">Ver semana</button>
      </div>

      <div class="space-y-4">
        {#each events as event, i}
          <div 
            class="bento-card p-5 group hover:border-zinc-700 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
            in:fly={{ y: 20, delay: i * 50 }}
          >
            <!-- Time Indicator -->
            <div class="flex md:flex-col items-center gap-3 md:gap-1 min-w-[100px] border-r border-zinc-800 pr-6">
               <span class="text-white font-black text-lg">{event.time.split(' ')[0]}</span>
               <span class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{event.time.includes('-') ? event.time.split(' - ')[1] : ''}</span>
            </div>

            <!-- Content -->
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-3">
                 <span class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                   {event.type === 'class' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}">
                   {event.tag}
                 </span>
                 {#if i === 0}
                   <span class="flex items-center gap-1.5 text-orange-400 text-[10px] font-bold bg-orange-500/5 px-2 py-1 rounded-lg border border-orange-500/10">
                     <Clock size={10} weight="bold" />
                     EN CURSO
                   </span>
                 {/if}
              </div>
              <h4 class="text-white font-bold group-hover:text-violet-400 transition-colors">{event.title}</h4>
              <div class="flex flex-wrap gap-4 text-slate-500 text-xs font-medium">
                 <div class="flex items-center gap-1.5">
                    <MapPin size={14} weight="duotone" />
                    {event.location}
                 </div>
                 <div class="flex items-center gap-1.5">
                    <Users size={14} weight="duotone" />
                    {event.type === 'class' ? '12 alumnos' : 'Libre'}
                 </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3">
               <button class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-slate-400 hover:text-white hover:border-zinc-700 transition-all">
                 <CheckCircle size={18} weight="duotone" />
               </button>
               <button class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-slate-400 hover:text-white hover:border-zinc-700 transition-all">
                 <DotsThreeVertical size={18} weight="bold" />
               </button>
            </div>
          </div>
        {:else}
          <div class="bento-card p-12 text-center space-y-4">
             <div class="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center text-slate-600 mx-auto">
                <CalendarBlank size={32} weight="duotone" />
             </div>
             <div>
                <h4 class="text-white font-bold">No hay eventos</h4>
                <p class="text-slate-500 text-sm">Disfruta de tu tiempo libre o programa una nueva sesión.</p>
             </div>
             <button 
               onclick={() => goto('/panel/torneos/create')}
               class="btn-primary py-2 px-6 rounded-xl text-xs"
             >
               Programar Evento
             </button>
          </div>
        {/each}
      </div>

      <!-- Quick Tips Card -->
      <div class="bg-violet-600/5 border border-violet-500/10 rounded-[2rem] p-8 flex items-center gap-6 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 opacity-5">
           <Calendar size={180} weight="fill" />
        </div>
        <div class="p-4 bg-violet-600/10 rounded-2xl text-violet-400">
           <Clock size={32} weight="duotone" />
        </div>
        <div>
           <h4 class="text-white font-bold mb-1">Dato del día</h4>
           <p class="text-slate-400 text-sm leading-relaxed max-w-md">
             Tus mañanas son un 20% más productivas si organizas los torneos los jueves. ¡Sigue así!
           </p>
        </div>
      </div>
    </div>

  </div>

</div>

<style lang="postcss">
  .bento-card {
    @apply bg-zinc-900/50 border border-zinc-800/50 rounded-[2rem] relative overflow-hidden;
  }
</style>
