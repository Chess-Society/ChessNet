<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
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
    CheckCircle,
    Sparkle,
    Funnel,
    TrendUp
  } from 'phosphor-svelte';
  import { goto } from '$app/navigation';
  import { appStore } from '$lib/stores/appStore';
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';

  // State using runes
  let filter = $state('all'); // all, classes, tournaments
  let currentDate = $state(new Date());
  
  // Derived data from store
  let classes = $derived($appStore.classes || []);
  let localTournaments = $derived($appStore.localTournaments || []);
  
  // Day names for matching schedule strings
  const dayNames = {
    es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    en: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  };

  const dayShortNames = {
    es: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
    en: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  };
  
  // Logic to get events for the selected date
  let events = $derived.by(() => {
    const dayIndex = currentDate.getDay();
    const currentLang = ($locale as string) === 'es' ? 'es' : 'en';
    const translation = $t;
    
    const dayName = dayNames[currentLang as 'es' | 'en'][dayIndex];
    const dayShort = dayShortNames[currentLang as 'es' | 'en'][dayIndex];
    
    // Improved filtering: case insensitive and better matching
    const filteredClasses = classes
      .filter(c => {
        const schedule = (c.schedule || '').toLowerCase();
        // Regex to match whole words or specific patterns
        const regex = new RegExp(`\\b(${dayName}|${dayShort}|${dayNames.en[dayIndex]}|${dayShortNames.en[dayIndex]})\\b`, 'i');
        return regex.test(schedule);
      })
      .map(c => ({
        id: c.id,
        type: 'class',
        title: c.name,
        time: c.schedule || '17:00',
        location: c.school_name || 'ChessNet Center',
        tag: translation('planner.classes'),
        color: 'violet',
        href: `/panel/classes/${c.id}`
      }));

    const filteredTournaments = localTournaments
      .filter(t => {
        if (!t.startAt) return false;
        const tDate = new Date(t.startAt);
        return tDate.getDate() === currentDate.getDate() &&
               tDate.getMonth() === currentDate.getMonth() &&
               tDate.getFullYear() === currentDate.getFullYear();
      })
      .map(t => {
        const d = new Date(t.startAt!);
        return {
          id: t.id,
          type: 'tournament',
          title: t.name,
          time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          location: t.location || 'Online',
          tag: translation('planner.tournaments'),
          color: 'indigo',
          href: `/panel/tournaments/${t.id}`,
          timestamp: d.getTime()
        };
      });

    return [...filteredClasses, ...filteredTournaments]
      .sort((a, b) => a.time.localeCompare(b.time))
      .filter(e => 
        filter === 'all' || 
        (filter === 'classes' && e.type === 'class') || 
        (filter === 'tournaments' && e.type === 'tournament')
      );
  });

  // Get week days for the horizontal picker
  let weekDays = $derived(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay() || 7;
    startOfWeek.setDate(startOfWeek.getDate() - day + 1); // Start on Monday
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  });

  const daysOfWeekChars = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  function formatDate(date: Date) {
    return date.toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  }

  function changeMonth(delta: number) {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + delta);
    nextDate.setDate(1); // Reset to first day to avoid overflow
    currentDate = nextDate;
  }

  // Generate days for the current month view
  let calendarDays = $derived(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay() || 7; // Adjust for Monday-start
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  });

  function hasEvents(day: number) {
     const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
     const dayOfWeek = dayNames.en[checkDate.getDay()];
     const dayShort = dayShortNames.en[checkDate.getDay()];
     const dayOfWeekEs = dayNames.es[checkDate.getDay()];
     const dayShortEs = dayShortNames.es[checkDate.getDay()];

     const hasClass = classes.some(c => {
        const s = (c.schedule || '').toLowerCase();
        return s.includes(dayOfWeek) || s.includes(dayShort) || s.includes(dayOfWeekEs) || s.includes(dayShortEs);
     });

     const hasTournament = localTournaments.some(t => {
        if (!t.startAt) return false;
        const d = new Date(t.startAt);
        return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
     });

     return hasClass || hasTournament;
  }

</script>

<svelte:head>
  <title>{$t('planner.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-10 space-y-12" in:fade={{ duration: 300 }}>
  
  <!-- Premium Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
    <div class="space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
        <Sparkle weight="fill" class="w-3 h-3" />
        {$t('planner.subtitle')}
      </div>
      <h1 class="text-5xl font-outfit font-black text-white tracking-tight">
        {$t('planner.title')}
      </h1>
      <p class="text-zinc-500 font-plus-jakarta text-lg flex items-center gap-2">
        <Clock weight="bold" class="w-5 h-5 text-violet-500/50" />
        <span class="capitalize">{formatDate(currentDate)}</span>
      </p>
    </div>

    <div class="flex items-center gap-4">
      <!-- Filter Toggle -->
      <div class="flex p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl">
        {#each ['all', 'classes', 'tournaments'] as f}
          <button 
            onclick={() => filter = f}
            class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all {filter === f ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-500 hover:text-zinc-300'}"
          >
            {$t(`planner.${f}`)}
          </button>
        {/each}
      </div>

      <button 
        onclick={() => goto('/panel/tournaments/create')}
        class="w-14 h-14 bg-white hover:bg-violet-100 text-zinc-950 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center group"
      >
        <Plus size={24} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Sidebar Controls -->
    <div class="lg:col-span-4 space-y-8">
      <!-- Calendar Bento -->
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/20 transition-all duration-700"></div>
        
        <div class="flex items-center justify-between mb-8 relative z-10">
          <h3 class="text-white font-outfit font-bold text-xl uppercase tracking-tight">
            {currentDate.toLocaleDateString($locale, { month: 'long', year: 'numeric' })}
          </h3>
          <div class="flex gap-2">
            <button 
              onclick={() => changeMonth(-1)}
              class="w-10 h-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all active:scale-95"
            >
              <CaretRight size={18} weight="bold" class="rotate-180" />
            </button>
            <button 
              onclick={() => currentDate = new Date()}
              class="px-3 h-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-all active:scale-95"
            >
              TODAY
            </button>
            <button 
              onclick={() => changeMonth(1)}
              class="w-10 h-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all active:scale-95"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-3 text-center mb-6 relative z-10">
          {#each daysOfWeekChars as day}
            <span class="text-[10px] uppercase font-black text-zinc-600 tracking-widest">{day}</span>
          {/each}
          
          {#each Array((calendarDays().firstDay + 6) % 7) as _}
            <div class="aspect-square opacity-0"></div>
          {/each}
          
          {#each Array(calendarDays().days) as _, i}
            {@const day = i + 1}
            {@const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()}
            {@const isSelected = day === currentDate.getDate()}
            {@const hasA = hasEvents(day)}
            <button 
              onclick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(day);
                currentDate = newDate;
              }}
              class="aspect-square relative flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all
              {isSelected ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/40' : (isToday ? 'border border-violet-500/50 text-violet-400' : 'text-zinc-500 hover:bg-zinc-800 hover:text-white')}"
            >
              {day}
              {#if hasA && !isSelected}
                <div class="absolute bottom-1.5 w-1 h-1 rounded-full bg-violet-400/60"></div>
              {/if}
            </button>
          {/each}
        </div>

        <div class="pt-6 border-t border-zinc-800 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <span>{events.length} {$t('planner.events_count', { count: events.length }).split(' ')[1] || 'EVENTOS'}</span>
          <button 
            onclick={() => currentDate = new Date()}
            class="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
          >
            <Sparkle weight="fill" class="w-3 h-3" />
            GO TO TODAY
          </button>
        </div>
      </div>

      <!-- Quick Analysis Bento -->
      <div class="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
        <div class="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
           <TrendUp size={160} weight="fill" />
        </div>
        <div class="relative z-10 space-y-6">
          <div class="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
             <Trophy size={24} weight="duotone" />
          </div>
          <div>
            <h4 class="font-outfit font-black text-xl mb-2">{$t('planner.tip_title')}</h4>
            <p class="text-white/70 text-sm font-medium leading-relaxed">
              {$t('planner.tip_desc')}
            </p>
          </div>
          <button class="w-full py-4 bg-white text-zinc-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95 shadow-xl">
             {$t('planner.explore_analytics')}
          </button>
        </div>
      </div>
    </div>

    <!-- Event List -->
    <div class="lg:col-span-8 space-y-8">
      <!-- Horizontal Week View -->
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-4 flex gap-4 overflow-x-auto no-scrollbar">
        {#each weekDays() as date}
          {@const isSelected = date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth()}
          {@const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth()}
          <button 
            onclick={() => currentDate = date}
            class="flex-1 min-w-[70px] py-4 rounded-3xl flex flex-col items-center gap-2 transition-all group
            {isSelected ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'hover:bg-zinc-800/50'}"
          >
            <span class="text-[10px] font-black uppercase tracking-widest {isSelected ? 'text-white/70' : 'text-zinc-600 group-hover:text-zinc-400'}">
              {date.toLocaleDateString($locale, { weekday: 'short' })}
            </span>
            <span class="text-xl font-outfit font-black {isToday && !isSelected ? 'text-violet-500' : ''}">
              {date.getDate()}
            </span>
          </button>
        {/each}
      </div>

      <div class="flex items-center justify-between bg-zinc-950/50 p-6 rounded-[2rem] border border-zinc-800">
        <div class="flex items-center gap-4">
           <div class="w-1.5 h-6 bg-violet-600 rounded-full"></div>
           <h2 class="text-xl font-outfit font-black text-white tracking-tight uppercase">
             {formatDate(currentDate).toUpperCase()}
           </h2>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-8 w-[1px] bg-zinc-800 mx-2"></div>
           <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500">
             {$t('planner.events_count', { count: events.length })}
           </span>
        </div>
      </div>

      <div class="space-y-6">
        {#each events as event, i}
          <div 
            role="button"
            tabindex="0"
            class="group relative bg-zinc-900/40 border border-zinc-800/80 rounded-[32px] p-6 hover:border-violet-500/40 transition-all duration-300 cursor-pointer overflow-hidden shadow-xl"
            in:fly={{ x: 20, delay: i * 50 }}
            onclick={() => goto(event.href)}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goto(event.href); } }}
          >
            <div class="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div class="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
              <!-- Time -->
              <div class="flex flex-row md:flex-col items-center gap-4 md:gap-1 min-w-[120px] md:border-r border-zinc-800 md:pr-8">
                 <span class="text-white font-outfit font-black text-3xl group-hover:text-violet-400 transition-colors uppercase">{event.time.split(' ')[0]}</span>
                 <span class="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{event.time.includes(':') ? 'AM' : 'PENDING'}</span>
              </div>

              <!-- Main Content -->
              <div class="flex-1 min-w-0 space-y-3">
                <div class="flex items-center flex-wrap gap-2">
                   <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border
                     {event.type === 'class' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}">
                     {event.tag}
                   </span>
                   {#if i === 0 && currentDate.toDateString() === new Date().toDateString()}
                     <span class="flex items-center gap-1.5 text-emerald-400 text-[9px] font-black uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                       <span class="relative flex h-2 w-2">
                         <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                       </span>
                       {$t('planner.next_event_tag')}
                     </span>
                   {/if}
                </div>
                
                <h4 class="text-2xl font-outfit font-bold text-white truncate group-hover:translate-x-1 transition-transform">{event.title}</h4>
                
                <div class="flex flex-wrap gap-6 text-zinc-500 text-sm font-medium font-plus-jakarta">
                   <div class="flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                      <MapPin size={18} weight="duotone" class="text-violet-500/50" />
                      {event.location}
                   </div>
                   <div class="flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                      <Users size={18} weight="duotone" class="text-violet-500/50" />
                      {event.type === 'class' ? $t('planner.students_count', { count: 12 }) : $t('planner.location_open')}
                   </div>
                </div>
              </div>

              <!-- Action Bar -->
               <div class="flex items-center gap-3 md:ml-auto">
                  <button 
                    class="w-12 h-12 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-violet-400 hover:border-violet-500/50 transition-all shadow-lg active:scale-95"
                    title={$t('planner.mark_done')}
                    onclick={(e) => { e.stopPropagation(); /* Mark as done logic if any */ }}
                  >
                    <CheckCircle size={24} weight="duotone" />
                  </button>
                  <button 
                    class="w-12 h-12 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-lg active:scale-95"
                    onclick={(e) => { e.stopPropagation(); /* Options logic */ }}
                  >
                    <DotsThreeVertical size={24} weight="bold" />
                  </button>
               </div>
            </div>
          </div>
        {:else}
          <div 
            class="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[3rem] p-24 text-center space-y-8"
            in:fade
          >
             <div class="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center text-zinc-700 mx-auto shadow-inner relative overflow-hidden group">
                <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent"></div>
                <CalendarBlank size={48} weight="duotone" class="relative z-10" />
             </div>
             <div class="space-y-3">
                <h4 class="text-3xl font-outfit font-black text-white">{$t('planner.no_events')}</h4>
                <p class="text-zinc-500 font-plus-jakarta max-w-sm mx-auto text-lg leading-relaxed">
                  {$t('planner.no_events_desc')}
                </p>
             </div>
             <button 
               onclick={() => goto('/panel/tournaments/create')}
               class="px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
             >
               <Plus size={18} weight="bold" />
               {$t('planner.schedule_event')}
             </button>
          </div>
        {/each}
      </div>

    </div>

  </div>

</div>

<style lang="postcss">
  /* High-end Bento Aesthetics */
  :global(:root) {
    --glass-bg: rgba(24, 24, 27, 0.4);
    --glass-border: rgba(63, 63, 70, 0.3);
  }
</style>
