<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { 
    ChartBar, 
    TrendUp, 
    Users, 
    CalendarBlank,
    Target,
    ChartPieSlice,
    ChartLine,
    ArrowUpRight,
    MagnifyingGlass,
    Star,
    Quotes,
    GraduationCap,
    Buildings,
    CheckCircle,
    TrendDown,
    Pulse,
    Trophy,
    ArrowClockwise,
    FileText
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { user as authUser } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';

  import { goto } from '$app/navigation';
  import { fade, fly, scale } from 'svelte/transition';

  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.isAdmin === true);

  onMount(() => {
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
    }
  });

  // Data fetching from appStore
  let students = $derived($appStore.students || []);
  let schools = $derived($appStore.schools || []);
  let attendance = $derived($appStore.attendance || []);
  let payments = $derived($appStore.payments || []);

  // Advanced Analytics Derivations
  const attendanceStats = $derived(() => {
    if (attendance.length === 0) return { rate: 0, trend: 'stable' };
    const present = attendance.filter(a => a.status === 'P' || a.status === 'T').length;
    const rate = Math.round((present / attendance.length) * 100);
    return { rate, trend: rate > 85 ? 'up' : 'stable' };
  });

  const growthStats = $derived(() => {
    if (students.length === 0) return { count: 0, percent: 0, trend: 'up' };
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newStudents = students.filter(s => {
      const createdAt = s.createdAt ? new Date(s.createdAt) : new Date(0);
      return createdAt > thirtyDaysAgo;
    }).length;

    const previousTotal = students.length - newStudents;
    const percent = previousTotal > 0 ? (newStudents / previousTotal) * 100 : 100;

    return { 
      count: newStudents, 
      percent: Math.round(percent),
      trend: percent > 10 ? 'up' : 'stable'
    };
  });

  const academicStats = $derived(() => {
    const totalStudents = students.length;
    const totalSchools = schools.length;
    
    const levels: Record<string, number> = {};
    students.forEach(s => {
      const level = s.grade || s.level || 'No level';
      levels[level] = (levels[level] || 0) + 1;
    });

    const sortedLevels = Object.entries(levels)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, percent: Math.round((count / totalStudents) * 100) }));

    return { totalStudents, totalSchools, sortedLevels };
  });

  const schoolBreakdown = $derived(() => {
    const total = students.length || 1;
    return schools.map(s => {
      const count = students.filter(student => student.schoolId === s.id).length;
      return {
        id: s.id,
        name: s.name,
        count,
        percent: Math.round((count / total) * 100)
      };
    }).sort((a,b) => b.count - a.count);
  });

  const healthScore = $derived(() => {
    if (payments.length === 0) return 100;
    const overdue = payments.filter(p => p.status === 'overdue').length;
    return Math.max(0, 100 - (overdue / payments.length) * 50);
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const totalRevenue = $derived(payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0));
</script>

<svelte:head>
  <title>{$t('reports.title')} - ChessNet Analytics</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-12" in:fade={{ duration: 400 }}>
  
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12 lg:mb-16">
    <div class="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 text-center lg:text-left">
      <div class="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-violet-400 shadow-2xl shrink-0">
        <ChartBar weight="bold" class="w-8 h-8" />
      </div>
      <div>
        <div class="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <span class="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-none text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Star weight="fill" class="w-3 h-3" />
              {$t('reports.premium_analytics')}
            </span>
            <span class="w-1.5 h-1.5 bg-zinc-800 rounded-none"></span>
            <span class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-violet-500 rounded-none shadow-[0_0_8px_#8b5cf6]"></span>
              {$t('reports.real_time')}
            </span>
        </div>
        <h1 class="text-4xl lg:text-7xl font-outfit font-black text-white tracking-tighter uppercase">{$t('reports.title')}</h1>
        <p class="text-zinc-500 font-medium text-base lg:text-lg mt-1 max-w-xl">{$t('reports.subtitle')}</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={async () => {
          await appStore.syncAll();
          toast.success($t('reports.real_time'));
        }}
        class="h-14 w-14 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center active:scale-95"
        title="Sincronizar Datos"
      >
        <ArrowClockwise weight="bold" class="w-6 h-6" />
      </button>
      <button 
        class="h-14 px-8 rounded-none bg-violet-600 text-white font-black hover:bg-violet-500 transition-all flex items-center gap-3 shadow-xl shadow-violet-500/20 active:scale-95 uppercase text-[10px] tracking-widest"
      >
        <FileText weight="bold" class="w-5 h-5" />
        {$t('reports.view_full_report')}
      </button>
    </div>
  </div>

  <!-- Bento KPI Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16">
    <!-- Revenue KPI -->
    <div class="bento-card p-6 lg:p-8 group overflow-hidden relative">
      <div class="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[40px] rounded-none -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="flex flex-col gap-6 relative z-10">
        <div class="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
          <ChartLine weight="bold" size={24} />
        </div>
        <div>
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{$t('reports.revenue')}</p>
          <p class="text-3xl lg:text-4xl font-outfit font-black text-white tracking-tighter">{formatCurrency(totalRevenue)}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="w-1.5 h-1.5 bg-violet-500 rounded-none shadow-[0_0_8px_#8b5cf6]"></span>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Global Turnover</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Students KPI -->
    <div class="bento-card p-6 lg:p-8 group overflow-hidden relative">
      <div class="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-[40px] rounded-none -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="flex flex-col gap-6 relative z-10">
        <div class="w-12 h-12 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-none flex items-center justify-center text-fuchsia-400">
          <Users weight="bold" size={24} />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <p class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{$t('reports.subscriptions')}</p>
            <div class="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-none text-[9px] font-black text-emerald-400 uppercase tracking-widest">
              <TrendUp weight="bold" class="w-3 h-3" />
              <span>{growthStats().percent}%</span>
            </div>
          </div>
          <p class="text-3xl lg:text-4xl font-outfit font-black text-white tracking-tighter">{academicStats().totalStudents}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="w-1.5 h-1.5 bg-fuchsia-500 rounded-none shadow-[0_0_8px_#d946ef]"></span>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{$t('reports.active_now')}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Schools KPI -->
    <div class="bento-card p-6 lg:p-8 group overflow-hidden relative">
      <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-none -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="flex flex-col gap-6 relative z-10">
        <div class="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-none flex items-center justify-center text-amber-400">
          <Buildings weight="bold" size={24} />
        </div>
        <div>
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{$t('reports.active_centers')}</p>
          <p class="text-3xl lg:text-4xl font-outfit font-black text-white tracking-tighter">{academicStats().totalSchools}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="w-1.5 h-1.5 bg-amber-500 rounded-none shadow-[0_0_8px_#f59e0b]"></span>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{schoolBreakdown().length} {$t('reports.locations')}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Score KPI -->
    <div class="bento-card p-6 lg:p-8 group overflow-hidden relative">
      <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-none -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="flex flex-col gap-6 relative z-10">
        <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-none flex items-center justify-center text-indigo-400">
          <Pulse weight="bold" size={24} />
        </div>
        <div>
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{$t('reports.health_score')}</p>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl lg:text-4xl font-outfit font-black text-white tracking-tighter">{Math.round(healthScore())}</p>
            <span class="text-zinc-600 font-black text-xs uppercase tracking-widest">/ 100 PTS</span>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <span class="w-1.5 h-1.5 bg-indigo-500 rounded-none shadow-[0_0_8px_#6366f1]"></span>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{$t('reports.estimated')}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Left Column: School Breakdown -->
    <div class="lg:col-span-2 bento-card p-8 lg:p-10">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-400">
            <Buildings weight="bold" size={24} />
          </div>
          <div>
            <h3 class="text-xl font-outfit font-black text-white uppercase tracking-wider">{$t('reports.students_per_center')}</h3>
            <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">{$t('reports.updated_today')}</p>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        {#if schoolBreakdown().length === 0}
          <div class="py-20 flex flex-col items-center justify-center gap-4 text-zinc-700">
            <GraduationCap weight="thin" size={64} />
            <p class="font-bold uppercase tracking-widest text-[10px]">{$t('reports.no_center_data')}</p>
          </div>
        {:else}
          {#each schoolBreakdown() as school, i}
            <div class="group" in:fly={{ y: 20, delay: i * 50 }}>
              <div class="flex justify-between items-end mb-3">
                <div>
                  <span class="text-sm font-black text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors">{school.name}</span>
                  <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{school.count} {$t('reports.alumni')}</p>
                </div>
                <span class="text-xl font-outfit font-black text-white">{school.percent}%</span>
              </div>
              <div class="h-3 bg-zinc-950 border border-zinc-800/50 rounded-none overflow-hidden relative">
                <div 
                  class="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-none transition-all duration-1000 ease-out" 
                  style="width: {school.percent}%"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></div>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Right Column: Level & Growth -->
    <div class="space-y-8">
      
      <!-- Levels Panel -->
      <div class="bento-card p-8">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-400">
            <ChartPieSlice weight="bold" size={24} />
          </div>
          <h3 class="text-lg font-outfit font-black text-white uppercase tracking-wider">{$t('reports.levels')}</h3>
        </div>

        <div class="space-y-4">
          {#each academicStats().sortedLevels as level, i}
            <div class="bg-zinc-950/50 border border-zinc-800/50 rounded-none p-4 hover:border-violet-500/30 transition-all group" in:scale={{ delay: i * 100 }}>
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{level.name === 'No level' ? $t('reports.no_levels') : level.name}</span>
                <span class="text-sm font-outfit font-black text-white group-hover:text-violet-400">{level.count}</span>
              </div>
              <div class="h-1.5 bg-zinc-900 rounded-none overflow-hidden">
                <div class="h-full bg-violet-500 rounded-none shadow-[0_0_8px_#8b5cf6]" style="width: {level.percent}%"></div>
              </div>
            </div>
          {/each}
          {#if academicStats().sortedLevels.length === 0}
            <p class="text-center text-zinc-700 py-10 font-bold uppercase text-[10px]">{$t('reports.no_levels')}</p>
          {/if}
        </div>
      </div>

      <!-- Growth Panel -->
      <div class="bento-card p-8 group overflow-hidden relative">
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/5 blur-[40px] rounded-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="flex items-center gap-4 mb-8 relative z-10">
          <div class="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-400">
            <TrendUp weight="bold" size={24} />
          </div>
          <h3 class="text-lg font-outfit font-black text-white uppercase tracking-wider">{$t('reports.growth')}</h3>
        </div>

        <div class="flex items-center gap-6 relative z-10">
          <div class="relative w-24 h-24 shrink-0">
             <svg viewBox="0 0 36 36" class="w-full h-full rotate-[-90deg]">
              <circle cx="18" cy="18" r="16" fill="none" class="stroke-zinc-950" stroke-width="4" />
              <circle cx="18" cy="18" r="16" fill="none" class="stroke-violet-500" stroke-width="4" stroke-dasharray="{growthStats().percent}, 100" stroke-linecap="round" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xl font-outfit font-black text-white">+{growthStats().count}</span>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{$t('reports.last_30_days')}</p>
            <p class="text-[11px] font-medium text-zinc-400 line-clamp-2 leading-relaxed">{$t('reports.growth_desc')}</p>
            <div class="mt-3 flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-none w-fit">
              <CheckCircle weight="fill" class="w-3 h-3 text-violet-400" />
              <span class="text-[9px] font-black text-violet-400 uppercase tracking-widest">{$t('reports.steady_recovery')}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>

<style lang="postcss">
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 3s infinite linear;
  }
</style>

