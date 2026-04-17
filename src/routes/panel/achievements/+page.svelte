<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { appStore } from '$lib/stores/appStore';
  import { INSIGNIAS } from '$lib/constants/insignias';
  import { Trophy, Medal, LockKey, CheckCircle, Info, Sparkle, Shield, Star, Crown, Lightning, MagicWand, Users } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { goto } from '$app/navigation';
  import InsigniaBadge from '$lib/components/ui/InsigniaBadge.svelte';

  let schools = $derived($appStore.schools || []);
  let students = $derived($appStore.students || []);
  let classes = $derived($appStore.classes || []);
  let tournaments = $derived($appStore.localTournaments || []);
  let unlockedData = $derived($appStore.unlockedAchievements || []);

  let stats = $derived({
    studentsCount: students.length,
    classesCount: classes.length,
    schoolsCount: schools.length,
    lessonsCreatedCount: $appStore.skills?.length || 0,
    completedTournamentsCount: tournaments.filter(t => t.status === 'completed').length,
    lobbyContributionsCount: $appStore.lobbySuggestions?.filter(s => s.authorId === $appStore.user?.uid).length || 0
  });

  // Procesar cuáles están desbloqueadas
  let processedInsignias = $derived(
    INSIGNIAS.map(insignia => {
      const found = unlockedData.find((u: any) => u.id === insignia.id);
      let isUnlocked = !!found;
      let unlockDate = found?.unlockedAt;

      // Si es automática y se cumple la condición localmente, considerarla desbloqueada 
      // (aunque appStore ya debería haberla guardado)
      if (!isUnlocked && insignia.type === 'automatic' && insignia.condition?.(stats)) {
        isUnlocked = true;
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

  const categories = [
    { id: 'system', icon: Sparkle },
    { id: 'growth', icon: Users },
    { id: 'tournament', icon: Trophy },
    { id: 'admin', icon: Shield }
  ];

  const unlockedCount = $derived(processedInsignias.filter(i => i.isUnlocked).length);
  const totalCount = $derived(INSIGNIAS.length);
  const progressPercent = $derived(Math.round((unlockedCount / totalCount) * 100));

</script>

<svelte:head>
  <title>{$t('badges.hub_title')} - ChessNet</title>
</svelte:head>

<div class="p-4 sm:p-8 max-w-7xl mx-auto space-y-16 pb-24" in:fade>
  
  <!-- Header con Estética Premium -->
  <header 
    class="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-14 border border-white/10 bg-gradient-to-br from-indigo-950/40 via-slate-900/20 to-black backdrop-blur-2xl shadow-2xl"
    in:fly={{ y: -30, duration: 1000 }}
  >
    <div class="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/20 blur-[120px] rounded-full animate-pulse"></div>
    <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>

    <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Medal size={32} weight="duotone" />
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-black tracking-[0.3em] text-violet-500 uppercase">{$t('badges.premium_distinction')}</span>
            <span class="text-white/60 font-bold tracking-tight text-sm uppercase">{$t('badges.hub_title')}</span>
          </div>
        </div>
        
        <h1 class="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none uppercase">
            {$t('badges.hub_title_main') || 'Center of'}<br/>
            <span class="bg-gradient-to-r from-violet-400 to-indigo-600 bg-clip-text text-transparent">{$t('badges.hub_title_suffix') || 'Merits'}</span>
        </h1>
        
        <p class="text-lg text-slate-400 max-w-xl leading-relaxed font-normal">
          {$t('badges.header_desc')}
        </p>
      </div>

      <!-- Stats Card Premium -->
      <div class="flex flex-col items-center lg:items-end gap-6">
        <div class="relative group">
          <div class="absolute inset-0 bg-violet-500/10 blur-3xl transition-opacity duration-700"></div>
          <div class="relative bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] flex items-center gap-10 shadow-2xl">
            <div class="text-center">
              <span class="block text-5xl font-black text-white">{unlockedCount}</span>
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{$t('badges.obtained')}</span>
            </div>
            <div class="w-px h-16 bg-white/10"></div>
            <div class="text-center">
              <span class="block text-5xl font-black text-violet-500">{progressPercent}%</span>
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{$t('badges.progress')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="flex flex-wrap items-center justify-between gap-6 pb-4 border-b border-white/5">
    <div class="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
      {#each ['all', 'unlocked', 'locked'] as f}
        <button 
          class="px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest {filter === f ? 'bg-white text-black shadow-xl' : 'text-slate-400 hover:text-white'}"
          onclick={() => filter = f}
        >
          {$t(f === 'all' ? 'common.all' : (f === 'unlocked' ? 'badges.unlocked' : 'badges.locked'))}
        </button>
      {/each}
    </div>

    <button 
      onclick={() => goto('/panel/settings')}
      class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500/20 transition-all"
    >
      <Star size={18} weight="duotone" />
      {$t('badges.feature_in_profile')}
    </button>
  </div>

  <!-- Contenido Agrupado por Categorías -->
  <div class="space-y-24">
    {#each categories as cat}
        {@const catInsignias = filteredInsignias.filter(i => i.category === cat.id)}
        {#if catInsignias.length > 0}
            <section class="space-y-10" id="section-{cat.id}">
                <div class="flex items-center gap-6 group/section">
                    <div class="p-4 rounded-[2rem] bg-white/5 border border-white/10 text-white/40 shadow-inner group-hover/section:text-violet-400 group-hover/section:border-violet-500/30 transition-all duration-500">
                        <cat.icon size={28} weight="duotone" />
                    </div>
                    <div>
                        <h2 class="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-4">
                            {$t(`badges.category_${cat.id}`)}
                            <span class="h-0.5 w-12 bg-white/10 rounded-full group-hover/section:w-24 group-hover/section:bg-violet-600 transition-all duration-700"></span>
                        </h2>
                    </div>
                </div>

                <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 sm:gap-8 lg:gap-10">
                    {#each catInsignias as insignia (insignia.id)}
                        <div class="flex flex-col items-center">
                            <InsigniaBadge 
                                {insignia} 
                                unlocked={insignia.isUnlocked} 
                                showDescription={false}
                                size="md"
                            />
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    {/each}

    {#if filteredInsignias.length === 0}
        <div class="py-32 text-center space-y-6 bg-white/5 rounded-[3rem] border border-dashed border-white/10" in:fade>
            <div class="inline-flex p-8 rounded-full bg-slate-900 border border-white/5 text-slate-700">
                <Shield size={64} weight="duotone" />
            </div>
            <div class="space-y-2">
                <h3 class="text-2xl font-bold text-white">{$t('badges.no_badges_found')}</h3>
                <p class="text-slate-500">{$t('badges.change_filters_desc')}</p>
            </div>
        </div>
    {/if}
  </div>

  <!-- Bottom CTA / Legend -->
  <section 
    class="mt-32 relative p-12 overflow-hidden rounded-[4rem] text-center border border-white/10 bg-white/5 backdrop-blur-md"
    in:fly={{ y: 50, duration: 1000 }}
  >
    <div class="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent"></div>
    <div class="relative z-10 space-y-8">
      <div class="inline-flex p-5 rounded-[2rem] bg-indigo-500/10 text-indigo-400">
        <Sparkle size={48} weight="duotone" />
      </div>
      
      <div class="space-y-3">
        <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight italic uppercase">TU LEGADO EN<br/><span class="text-indigo-400">CHESSNET</span></h2>
        <p class="text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          {$t('badges.legacy_desc')}
        </p>
      </div>
      
      <button 
        onclick={() => goto('/panel')} 
        class="group flex items-center mx-auto gap-3 bg-white text-black py-5 px-12 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl"
      >
        <span>{$t('badges.back_dashboard')}</span>
        <Lightning size={16} weight="fill" />
      </button>
    </div>
  </section>

</div>

<style>
  :global(body) {
    background-color: #050505;
    scrollbar-gutter: stable;
  }
</style>
