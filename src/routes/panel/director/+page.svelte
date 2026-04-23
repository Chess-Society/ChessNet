<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { 
    Buildings, 
    Users, 
    Chalkboard, 
    IdentificationCard,
    ArrowRight,
    CaretRight,
    UserGear,
    Briefcase,
    ChartLineUp,
    ShieldCheck
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { user } from '$lib/stores/auth';
  import { t } from '$lib/i18n';
  import { goto } from '$app/navigation';

  // State derived from the store
  const settings = $derived($appStore.settings);
  const myUid = $derived($user?.uid);

  // Route Guard: only directors can view this page
  $effect(() => {
    if ($appStore.initialized && settings && settings.role !== 'director') {
      goto('/panel');
    }
  });
  
  // Data shared with the director
  const sharedSchools = $derived($appStore.schools.filter(s => s.ownerId !== myUid));
  const sharedClasses = $derived($appStore.classes.filter(c => c.ownerId !== myUid));
  const sharedStudents = $derived($appStore.students.filter(s => s.ownerId !== myUid));

  // Extract unique teacher UIDs from shared data
  const teacherUids = $derived([...new Set(sharedSchools.map(s => s.ownerId))]);

  const stats = $derived([
    { label: $t('director.stats.schools'), value: sharedSchools.length, icon: Buildings, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: $t('director.stats.teachers'), value: teacherUids.length, icon: UserGear, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: $t('director.stats.students'), value: sharedStudents.length, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: $t('director.stats.classes'), value: sharedClasses.length, icon: Chalkboard, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]);

</script>

<svelte:head>
  <title>{$t('nav.director_console')} - ChessNet</title>
</svelte:head>

<div class="space-y-12 pb-20" in:fade>
  
  <!-- Premium Header -->
  <header class="relative overflow-hidden bento-card !p-12 border-emerald-500/20 bg-emerald-600/5">
    <div class="absolute top-0 right-0 p-8 opacity-10">
      <Buildings size={240} weight="duotone" class="text-emerald-400 rotate-12" />
    </div>
    
    <div class="relative z-10 space-y-6">
      <div class="flex items-center gap-3">
        <div class="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
          {$t('nav.director')}
        </div>
        <div class="h-px w-12 bg-emerald-500/30"></div>
        <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{$t('director.organization')}: {settings?.schoolName || 'General'}</span>
      </div>
      
      <h1 class="text-5xl md:text-6xl font-outfit font-black text-white uppercase italic tracking-tighter leading-none">
        {$t('nav.director_console')}
      </h1>
      <p class="text-zinc-400 font-jakarta text-sm md:text-base max-w-2xl leading-relaxed font-medium">
        {$t('director.welcome')}
      </p>

      <div class="flex flex-wrap gap-4 pt-4">
        <div class="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-white/5 rounded-none shadow-xl">
          <ShieldCheck weight="fill" class="text-emerald-500" />
          <span class="text-[10px] font-black text-white uppercase tracking-widest">{$t('director.access_verified')}</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-white/5 rounded-none shadow-xl">
          <ChartLineUp weight="fill" class="text-blue-500" />
          <span class="text-[10px] font-black text-white uppercase tracking-widest">{$t('director.real_time')}</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each stats as stat, i}
      <div 
        class="bento-card !p-8 group hover:border-emerald-500/30 transition-all cursor-default"
        in:fly={{ y: 20, delay: i * 100 }}
      >
        <div class="flex items-start justify-between mb-6">
          <div class="w-12 h-12 {stat.bg} flex items-center justify-center text-white border border-white/5 group-hover:scale-110 transition-transform">
            <stat.icon size={24} weight="duotone" class={stat.color} />
          </div>
          <div class="text-4xl font-outfit font-black text-white italic tracking-tighter">
            {stat.value}
          </div>
        </div>
        <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Schools Management -->
    <div class="lg:col-span-8 space-y-6">
      <div class="flex items-center justify-between px-2">
        <h3 class="text-xl font-outfit font-black text-white uppercase italic tracking-tight flex items-center gap-3">
          <Buildings weight="duotone" class="text-emerald-500" />
          {$t('director.managed_schools')}
        </h3>
        <button class="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">{$t('director.view_all')}</button>
      </div>

      <div class="space-y-4">
        {#if sharedSchools.length > 0}
          {#each sharedSchools as school}
            <div class="bento-card !p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
              <div class="flex items-center gap-6">
                <div class="w-16 h-16 bg-zinc-950 border border-white/5 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                  <Buildings size={32} weight="duotone" />
                </div>
                <div>
                  <h4 class="text-lg font-outfit font-black text-white uppercase tracking-tight italic group-hover:text-emerald-400 transition-colors">{school.name}</h4>
                  <div class="flex items-center gap-4 mt-1">
                    <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Users size={12} /> {$t('director.students_count', { n: sharedStudents.filter(s => s.schoolId === school.id).length })}
                    </span>
                    <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Chalkboard size={12} /> {$t('director.classes_count', { n: sharedClasses.filter(c => c.schoolId === school.id).length })}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onclick={() => goto(`/panel/schools/${school.id}`)}
                class="w-12 h-12 bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-emerald-500/50 transition-all"
              >
                <CaretRight weight="bold" />
              </button>
            </div>
          {/each}
        {:else}
          <div class="bento-card !p-20 text-center border-dashed border-white/10 opacity-60">
            <IdentificationCard size={48} weight="duotone" class="mx-auto mb-6 text-zinc-600" />
            <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
              {$t('director.no_schools_desc')}
            </p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Teachers List -->
    <div class="lg:col-span-4 space-y-6">
      <h3 class="text-xl font-outfit font-black text-white uppercase italic tracking-tight flex items-center gap-3 px-2">
        <UserGear weight="duotone" class="text-blue-500" />
        {$t('director.teacher_network')}
      </h3>

      <div class="space-y-3">
        {#each teacherUids as uid}
          <div class="bento-card !p-5 flex items-center gap-4 group/teacher hover:border-blue-500/30 transition-all">
            <div class="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover/teacher:text-blue-400 group-hover/teacher:border-blue-500/30 transition-all">
              <Users weight="duotone" size={24} />
            </div>
            <div>
              <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">{$t('director.teacher_node')}</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-outfit font-black text-white uppercase tracking-tight">
                  {$t('director.teacher_id_prefix')}_{uid.substring(0, 4).toUpperCase()}
                </span>
                <span class="px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
                  {uid.substring(0, 8)}
                </span>
              </div>
            </div>
          </div>
        {:else}
          <div class="bento-card !p-10 text-center opacity-60">
            <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">{$t('director.no_teachers')}</p>
          </div>
        {/each}
        
        <div class="mt-6 p-6 bg-blue-600/5 border border-blue-500/10 space-y-4">
          <div class="flex items-center gap-3">
            <Briefcase size={18} class="text-blue-400" />
            <span class="text-[10px] font-black text-white uppercase tracking-widest">{$t('director.how_to_add_title')}</span>
          </div>
          <p class="text-[11px] text-zinc-500 leading-relaxed italic">
            {$t('director.how_to_add_desc')}
          </p>
        </div>
      </div>
    </div>

  </div>

</div>

<style lang="postcss">
  .bento-card {
    @apply relative overflow-hidden;
  }
</style>
