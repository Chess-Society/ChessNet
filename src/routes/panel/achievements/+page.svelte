<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { appStore } from '$lib/stores/appStore';
  import { INSIGNIAS } from '$lib/constants/insignias';
  import { Trophy, Medal, LockKey, CheckCircle, Info, Sparkle, Shield, Star, Crown, Lightning, MagicWand } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { goto } from '$app/navigation';

  let schools = $derived($appStore.schools || []);
  let students = $derived($appStore.students || []);
  let classes = $derived($appStore.classes || []);
  let tournaments = $derived($appStore.localTournaments || []);
  let unlockedData = $derived($appStore.unlockedAchievements || []);

  let stats = $derived({
    studentsCount: students.length,
    classesCount: classes.length,
    schoolsCount: schools.length,
    completedTournamentsCount: tournaments.filter(t => t.status === 'completed').length
  });

  // Procesar cuáles están desbloqueadas
  let processedInsignias = $derived(
    INSIGNIAS.map(insignia => {
      let isUnlocked = false;
      let unlockDate = null;

      if (insignia.type === 'automatic' && insignia.condition) {
        isUnlocked = insignia.condition(stats);
      } else {
        const found = unlockedData.find((u: any) => u.id === insignia.id);
        if (found) {
          isUnlocked = true;
          unlockDate = found.unlockedAt;
        }
      }

      return {
        ...insignia,
        isUnlocked,
        unlockDate
      };
    })
  );

  let filter = $state('all'); // all, unlocked, locked

  let filteredInsignias = $derived(
    processedInsignias.filter(ins => {
      if (filter === 'unlocked') return ins.isUnlocked;
      if (filter === 'locked') return !ins.isUnlocked;
      return true;
    })
  );

  const unlockedCount = $derived(processedInsignias.filter(i => i.isUnlocked).length);
  const totalCount = $derived(INSIGNIAS.length);
  const progressPercent = $derived(Math.round((unlockedCount / totalCount) * 100));

</script>

<svelte:head>
  <title>{$t('badges.hub_title')} - ChessNet</title>
</svelte:head>

<div class="p-4 sm:p-8 max-w-7xl mx-auto space-y-12" in:fade>
  
  <!-- Header con Estética Premium -->
  <header 
    class="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-14 border border-white/10 bg-gradient-to-br from-indigo-950/60 via-slate-900/40 to-black backdrop-blur-2xl shadow-2xl"
    in:fly={{ y: -30, duration: 1000 }}
  >
    <!-- Elementos Decorativos -->
    <div class="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/20 blur-[120px] rounded-full animate-pulse"></div>
    <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>

    <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-inner">
            <Medal size={32} weight="duotone" />
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-black tracking-[0.3em] text-violet-500 uppercase">{$t('badges.premium_distinction')}</span>
            <span class="text-white font-bold tracking-tight">{$t('badges.hub_title')}</span>
          </div>
        </div>
        
        <h1 class="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none">
          {@html $t('badges.evolve_prestige')}
        </h1>
        
        <p class="text-lg text-slate-400 max-w-xl leading-relaxed font-medium">
          {$t('badges.header_desc')}
        </p>
      </div>

      <!-- Stats Card Premium -->
      <div class="flex flex-col items-center lg:items-end gap-6">
        <div class="relative group">
          <div class="absolute inset-0 bg-violet-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2rem] flex items-center gap-8 shadow-2xl">
            <div class="text-center">
              <span class="block text-4xl font-black text-white">{unlockedCount}</span>
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{$t('badges.obtained')}</span>
            </div>
            <div class="w-px h-12 bg-white/10"></div>
            <div class="text-center">
              <span class="block text-4xl font-black text-violet-500">{progressPercent}%</span>
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{$t('badges.progress')}</span>
            </div>
          </div>
        </div>
        
        <div class="w-full lg:w-64 space-y-2">
           <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <div 
              class="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              style="width: {progressPercent}%"
            ></div>
          </div>
          <div class="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
            <span>{$t('badges.beginner')}</span>
            <span>{$t('badges.grandmaster')}</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Filtros Navegación -->
  <div class="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-8">
    <div class="flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-white/5 rounded-2xl backdrop-blur-md shadow-inner">
      <button 
        class="px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest {filter === 'all' ? 'bg-white/10 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}"
        onclick={() => filter = 'all'}
      >
        {$t('common.all')}
      </button>
      <button 
        class="px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest {filter === 'unlocked' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}"
        onclick={() => filter = 'unlocked'}
      >
        {$t('badges.unlocked')}
      </button>
      <button 
        class="px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest {filter === 'locked' ? 'bg-white/5 text-slate-400' : 'text-slate-500 hover:text-slate-300'}"
        onclick={() => filter = 'locked'}
      >
        {$t('badges.locked')}
      </button>
    </div>

    <div class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-500/70 text-xs font-bold leading-tight max-w-md">
      <Info size={16} weight="duotone" />
      <span>{$t('badges.special_manual_note')}</span>
    </div>
  </div>

  <!-- Grid de Insignias con Hover Efectos -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {#each filteredInsignias as insignia (insignia.id)}
      <div 
        in:scale={{ duration: 400, start: 0.95 }}
        class="group relative h-full"
      >
        <!-- Card Moderno -->
        <div class="
          h-full relative overflow-hidden flex flex-col p-8 rounded-[2.5rem] border transition-all duration-700
          {insignia.isUnlocked 
            ? 'bg-gradient-to-b from-slate-900/90 to-black border-white/10 hover:border-violet-500/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]' 
            : 'bg-zinc-950/40 border-white/5 opacity-60 grayscale-[0.8]'}
        ">
          
          <!-- Background Decor -->
          {#if insignia.isUnlocked}
            <div class="absolute -top-10 -left-10 w-32 h-32 blur-[40px] opacity-20 {insignia.glowColor} group-hover:opacity-40 transition-opacity"></div>
          {/if}

          <!-- Icon container -->
          <div class="relative mb-8 self-start">
            {#if insignia.isUnlocked}
              <div class="absolute inset-0 blur-2xl opacity-40 {insignia.glowColor} group-hover:opacity-70 transition-opacity duration-700"></div>
            {/if}
            
            <div class="
              relative w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:rotate-[5deg]
              {insignia.isUnlocked 
                ? `bg-slate-900/80 border-white/20 shadow-2xl ${insignia.color}` 
                : 'bg-transparent border-white/10 text-slate-700'}
            ">
              {#if !insignia.isUnlocked}
                <LockKey size={34} weight="duotone" />
              {:else}
                {@const Icon = insignia.icon}
                <Icon size={34} weight="duotone" />
              {/if}
            </div>

            {#if insignia.isUnlocked}
              <div 
                class="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-xl"
                in:scale
              >
                <CheckCircle size={12} weight="fill" />
              </div>
            {/if}
          </div>

          <!-- Content Area -->
          <div class="space-y-3 flex-grow relative z-10">
            <div class="flex items-center justify-between gap-4">
              <h3 class="font-black text-2xl tracking-tighter transition-colors {insignia.isUnlocked ? 'text-white group-hover:text-violet-400' : 'text-slate-600'}">
                {$t(insignia.titleKey)}
              </h3>
              {#if insignia.type === 'special'}
                <div class="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/10 shadow-sm shadow-amber-500/5 scale-90">
                  <Star size={10} weight="fill" />
                  <span class="text-[9px] font-black uppercase tracking-tighter">Gold</span>
                </div>
              {/if}
            </div>
            
            <p class="text-sm font-medium leading-relaxed transition-colors {insignia.isUnlocked ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-700'}">
              {$t(insignia.descKey)}
            </p>
          </div>

          <!-- Interaction Footer -->
          <div class="mt-10 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
            {#if insignia.isUnlocked}
              <span class="text-[10px] font-black text-violet-500 uppercase tracking-[0.2em]">{$t('badges.active_distinction')}</span>
              <div class="flex -space-x-1">
                 <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              </div>
            {:else}
              <span class="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">{$t('badges.pending_criteria')}</span>
              <div class="p-1 rounded bg-white/5">
                <LockKey size={12} class="text-slate-800" />
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="col-span-full py-20 text-center space-y-4 bg-white/5 rounded-[3rem] border border-dashed border-white/10" in:fade>
         <div class="inline-flex p-5 rounded-full bg-slate-900 border border-white/5 text-slate-600 mb-2">
           <Shield size={40} weight="duotone" />
         </div>
         <h3 class="text-xl font-bold text-white">{$t('badges.no_badges_found')}</h3>
         <p class="text-slate-500 text-sm">{$t('badges.change_filters_desc')}</p>
      </div>
    {/each}
  </div>

  <!-- Bottom CTA / Legend -->
  <section 
    class="mt-20 relative p-12 overflow-hidden rounded-[3rem] text-center border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-transparent backdrop-blur-sm"
    in:fly={{ y: 50, duration: 1000 }}
  >
    <div class="absolute top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none"></div>
    <div class="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full"></div>

    <div class="relative z-10 space-y-8">
      <div class="inline-flex p-4 rounded-3xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
        <Sparkle size={48} weight="duotone" />
      </div>
      
      <div class="space-y-3">
        <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">{$t('badges.legacy_title')}</h2>
        <p class="text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          {$t('badges.legacy_desc')}
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
        <button 
          onclick={() => goto('/panel')} 
          class="group flex items-center gap-3 bg-white text-black py-4 px-10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-violet-50 hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
        >
          <span>{$t('badges.back_dashboard')}</span>
          <Lightning size={16} weight="fill" class="group-hover:animate-bounce" />
        </button>
        
        <div class="flex items-center gap-3 text-slate-500 hover:text-slate-300 transition-colors cursor-help group">
           <Info size={20} weight="duotone" />
           <span class="text-xs font-black uppercase tracking-widest">{$t('badges.support_center')}</span>
        </div>
      </div>
    </div>
  </section>

</div>

<style>
  /* Optimizaciones de rendimiento para animaciones complejas */
  :global(body) {
    scrollbar-gutter: stable;
  }
</style>
