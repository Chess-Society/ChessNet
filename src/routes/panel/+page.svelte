<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { 
    HouseLine, 
    UsersFour, 
    GraduationCap, 
    Target, 
    Trophy,
    CheckCircle,
    ChartBar,
    CurrencyEur,
    CalendarBlank,
    Books,
    Medal,
    DotsSixVertical,
    GearSix,
    Pulse,
    TrendUp,
    TrendDown,
    Plus,
    Clock,
    Lightning,
    Buildings,
    Student,
    CreditCard,
    ChatCircleDots
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';
  import { t, locale } from '$lib/i18n';
  import { parseDate } from '$lib/utils/date';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  // Available actions definition
  const allActions = [
    { id: 'centers', title: $t('actions.schools.title'), desc: $t('actions.schools.desc'), icon: Buildings, color: 'text-blue-400', link: '/panel/schools' },
    { id: 'classes', title: $t('actions.classes.title'), desc: $t('actions.classes.desc'), icon: GraduationCap, color: 'text-primary-400', link: '/panel/classes' },
    { id: 'students', title: $t('actions.students.title'), desc: $t('actions.students.desc'), icon: UsersFour, color: 'text-violet-400', link: '/panel/students' },
    { id: 'skills', title: $t('actions.skills.title'), desc: $t('actions.skills.desc'), icon: Target, color: 'text-yellow-400', link: '/panel/skills' },
    { id: 'tournaments', title: $t('actions.tournaments.title'), desc: $t('actions.tournaments.desc'), icon: Trophy, color: 'text-orange-400', link: '/panel/tournaments', premium: true },
    { id: 'attendance', title: $t('actions.attendance.title'), desc: $t('actions.attendance.desc'), icon: CheckCircle, color: 'text-pink-400', link: '/panel/attendance' },
    { id: 'reports', title: $t('actions.reports.title'), desc: $t('actions.reports.desc'), icon: ChartBar, color: 'text-cyan-400', link: '/panel/reports', premium: true },
    { id: 'payments', title: $t('actions.payments.title'), desc: $t('actions.payments.desc'), icon: CreditCard, color: 'text-teal-400', link: '/panel/payments', badge: 'BETA', premium: true },
    { id: 'planner', title: $t('actions.planner.title'), desc: $t('actions.planner.desc'), icon: CalendarBlank, color: 'text-indigo-400', link: '/panel/planner', badge: 'NEW', premium: true },
    { id: 'achievements', title: $t('actions.achievements.title'), desc: $t('actions.achievements.desc'), icon: Medal, color: 'text-amber-400', link: '/panel/achievements' }
  ];

  let editMode = $state(false);
  let draggedId = $state<string | null>(null);

  // Derivados del store para el dashboard
  let displayedActions = $derived(() => {
    const layout = $appStore.dashboardLayout || [];
    if (layout.length === 0) return allActions;
    
    const actionMap = new Map(allActions.map(a => [a.id, a]));
    const result = layout.map(id => actionMap.get(id)).filter(Boolean) as typeof allActions;
    
    // Añadir las que falten si el layout está desactualizado
    allActions.forEach(a => {
      if (!layout.includes(a.id)) result.push(a);
    });
    
    return result;
  });

  // Métricas reales calculadas desde el store
  let stats = $derived({
    totalStudents: $appStore.students.length,
    monthlyRevenue: $appStore.payments.filter(p => {
      const dateStr = (p as any).date || p.paid_date || p.due_date;
      if (!dateStr) return false;
      const date = new Date(dateStr);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((acc, p) => acc + p.amount, 0),
    occupancyRate: (() => {
      if ($appStore.attendance.length === 0) return 0;
      const present = $appStore.attendance.filter(a => a.status === 'P').length;
      return Math.round((present / $appStore.attendance.length) * 100);
    })()
  });

  let nextTournament = $derived($appStore.tournaments.filter(t => t.status === 'upcoming').sort((a,b) => (a.start_date || '').localeCompare(b.start_date || ''))[0]);

  // Onboarding flags
  const hasSchools = $derived($appStore.schools.length > 0);
  const hasClasses = $derived($appStore.classes.length > 0);
  const hasStudents = $derived($appStore.students.length > 0);
  const isFullyBoarded = $derived(hasClasses && hasStudents);

  // Actividad reciente dinámica
  let recentActivity = $derived(() => {
    const activities: any[] = [];
    
    $appStore.students.slice(-3).reverse().forEach((s: any) => {
      activities.push({ 
        message: `${$t('dashboard.activity.new_student')}: ${s.name}`, 
        time: $t('dashboard.activity.recent'), 
        icon: UsersFour, 
        color: 'text-violet-400',
        timestamp: parseDate(s.created_at).getTime()
      });
    });

    $appStore.payments.slice(-3).reverse().forEach(p => {
      const student = $appStore.students.find(s => s.id === (p as any).studentId || s.id === p.student_id);
      activities.push({ 
        message: `${$t('dashboard.activity.payment')}: ${p.amount}${$t('common.currency')} - ${student?.name || $t('common.unknown')}`, 
        time: $t('dashboard.activity.recent'), 
        icon: CurrencyEur, 
        color: 'text-teal-400',
        timestamp: parseDate(p.paid_date || p.due_date || p.created_at).getTime()
      });
    });

    return activities.length > 0 ? activities.sort((a,b) => b.timestamp - a.timestamp).slice(0, 5) : [
      { message: $t('dashboard.waiting_activity'), time: '-', icon: Lightning, color: 'text-surface-600' }
    ];
  });

  // LOGICA DRAG & DROP
  const toggleEditMode = () => {
    if (editMode) {
      // Guardar nuevo layout
      appStore.updateDashboardLayout(displayedActions().map(a => a.id));
      // toast.success('Diseño guardado');
    }
    editMode = !editMode;
  };

  const handleDragStart = (e: DragEvent, id: string) => {
    if (!editMode) return;
    draggedId = id;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: DragEvent, targetId: string) => {
    if (!editMode || draggedId === targetId) return;
    e.preventDefault();
    
    const actions = [...displayedActions()];
    const draggedIdx = actions.findIndex(a => a.id === draggedId);
    const targetIdx = actions.findIndex(a => a.id === targetId);
    
    if (draggedIdx !== -1 && targetIdx !== -1) {
      const [draggedItem] = actions.splice(draggedIdx, 1);
      actions.splice(targetIdx, 0, draggedItem);
      appStore.updateDashboardLayout(actions.map(a => a.id));
    }
  };

  const handleDragEnd = () => {
    draggedId = null;
  };

  const todayFormat = $derived(new Intl.DateTimeFormat($locale === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()));

  // Chart data (simulated with original logic)
  const chartData = $derived({
    revenue: Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const month = d.getMonth();
      const year = d.getFullYear();
      return $appStore.payments
        .filter(p => {
          const dateStr = (p as any).date || p.paid_date || p.due_date;
          if (!dateStr) return false;
          const pd = new Date(dateStr);
          return pd.getMonth() === month && pd.getFullYear() === year;
        })
        .reduce((acc, p) => acc + p.amount, 0);
    }),
    labels: Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { month: 'short' });
    })
  });

</script>

<svelte:head>
  <title>ChessNet - Dashboard</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <!-- Hero Section (iOS Style) -->
  <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-10 pt-4 lg:pt-8 gap-4 lg:gap-6">
    <div class="space-y-0.5 lg:space-y-1">
      <h1 class="text-3xl lg:text-5xl font-extrabold text-white tracking-tight lg:tracking-tighter font-display">
        {$t('dashboard.welcome_coach')} <span class="hidden lg:inline">👋</span>
      </h1>
      <p class="text-surface-500 text-sm lg:text-lg font-medium">{$t('dashboard.overview')}</p>
    </div>
    
    <div class="hidden lg:flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
      <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
        <Clock weight="duotone" size={24} />
      </div>
      <div class="pr-6">
        <p class="text-[10px] text-surface-500 uppercase font-black tracking-widest leading-none mb-1">{$t('dashboard.today_is')}</p>
        <p class="text-lg font-bold text-white capitalize">{todayFormat}</p>
      </div>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div class="mb-8 lg:mb-12">
    <div class="flex justify-between items-center mb-4 lg:mb-6">
      <h2 class="text-lg lg:text-xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
        <DotsSixVertical weight="duotone" class="text-primary-500" /> {$t('dashboard.quick_access')}
      </h2>
      <button 
        onclick={toggleEditMode}
        class="text-[9px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-white/5 hover:bg-white/5 transition-all {editMode ? 'bg-primary-500 text-white border-primary-500 shadow-violet-flare' : 'text-surface-400'}"
      >
        <GearSix weight="duotone" size={14} /> 
        {editMode ? $t('dashboard.save') : $t('dashboard.customize')}
      </button>
    </div>
    
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-4">
      {#each displayedActions() as action, i}
        <div 
          role="button"
          tabindex="0"
          draggable={editMode}
          ondragstart={(e) => handleDragStart(e, action.id)}
          ondragover={(e) => handleDragOver(e, action.id)}
          ondragend={handleDragEnd}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') !editMode && goto(action.link) }}
          class="relative transition-all duration-300 {draggedId === action.id ? 'scale-105 z-10 opacity-50' : ''}"
        >
          <button 
            onclick={() => {
              if (editMode) return;
              const isPremium = $appStore.settings.plan === 'premium' || data.isAdmin;
              if (action.premium && !isPremium) {
                goto('/pricing');
              } else {
                goto(action.link);
              }
            }}
            class="bento-card group w-full flex flex-col items-start p-5 h-40 text-left {editMode ? 'cursor-move border-dashed border-white/20' : ''} {action.premium && !($appStore.settings.plan === 'premium' || data.isAdmin) ? 'opacity-80' : ''}"
          >
             {#if action.premium && !($appStore.settings.plan === 'premium' || data.isAdmin)}
                <div class="absolute top-4 right-4 text-primary-400">
                   <Lightning weight="duotone" size={18} />
                </div>
             {/if}
            
            {#if action.badge}
              <span class="absolute top-4 right-4 bg-primary-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg z-10 uppercase tracking-widest">
                {action.badge}
              </span>
            {/if}

            <div class="p-3 bg-white/5 rounded-2xl mb-auto group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary-500/10 group-hover:text-primary-400 {action.color}">
               <action.icon weight="duotone" size={28} />
            </div>
            
            <div class="mt-2">
              <span class="text-sm font-bold text-white block">
                {action.title}
              </span>
              <span class="text-[10px] text-surface-500 font-medium group-hover:text-surface-400 transition-colors">
                {action.desc}
              </span>
            </div>

            {#if editMode}
               <div class="absolute inset-0 bg-primary-500/10 rounded-24 flex items-center justify-center">
                 <DotsSixVertical weight="bold" size={24} class="text-white/40" />
               </div>
            {/if}
          </button>
        </div>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
    <div class="lg:col-span-2 space-y-8">
      

      {#if !isFullyBoarded}
        <div class="bento-card border-primary-500/20 mb-8 overflow-hidden group" in:fly={{y: 20}}>
            <!-- Background Glow -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full group-hover:bg-primary-500/20 transition-all duration-700"></div>
            
            <div class="bento-card-inner relative z-10 !p-10 flex flex-col md:flex-row gap-10 items-center">
                <div class="flex-1 space-y-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                            <Lightning weight="duotone" size={24} />
                        </div>
                        <h3 class="text-2xl font-extrabold text-white tracking-tight font-display">{$t('dashboard.quick_start')}</h3>
                    </div>
                    <p class="text-surface-400 text-base font-medium max-w-sm">{$t('dashboard.steps_desc')}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                    <!-- Step 1: Centers -->
                    <button 
                      onclick={() => goto('/panel/schools')}
                      class="flex flex-col items-start gap-4 p-5 rounded-24 border transition-all duration-300 {hasSchools ? 'bg-violet-500/5 border-violet-500/20 text-violet-400' : 'bg-white/5 border-white/5 hover:border-primary-500/50 text-surface-400'}"
                    >
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center {hasSchools ? 'bg-violet-500/20' : 'bg-white/5'}">
                            {#if hasSchools}
                                <CheckCircle weight="duotone" size={20} />
                            {:else}
                                <HouseLine weight="duotone" size={20} />
                            {/if}
                        </div>
                        <div>
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{$t('nav.schools')} ({$t('common.optional')})</p>
                            <p class="text-xs font-bold whitespace-nowrap">{$t('dashboard.step1')}</p>
                        </div>
                    </button>

                    <!-- Step 2: Classes -->
                    <button 
                      onclick={() => goto('/panel/classes')}
                      class="flex flex-col items-start gap-4 p-5 rounded-24 border transition-all duration-300 {hasClasses ? 'bg-violet-500/5 border-violet-500/20 text-violet-400' : 'bg-white/5 border-white/5 hover:border-primary-500/50 text-surface-400'}"
                    >
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center {hasClasses ? 'bg-violet-500/20' : 'bg-white/5'}">
                            {#if hasClasses}
                                <CheckCircle weight="duotone" size={20} />
                            {:else}
                                <GraduationCap weight="duotone" size={20} />
                            {/if}
                        </div>
                        <div>
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{$t('nav.classes')}</p>
                            <p class="text-xs font-bold whitespace-nowrap">{$t('dashboard.step2')}</p>
                        </div>
                    </button>

                    <!-- Step 3: Students -->
                    <button 
                      onclick={() => goto('/panel/students')}
                      class="flex flex-col items-start gap-4 p-5 rounded-24 border transition-all duration-300 {hasStudents ? 'bg-violet-500/5 border-violet-500/20 text-violet-400' : 'bg-white/5 border-white/5 hover:border-primary-500/50 text-surface-400'}"
                    >
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center {hasStudents ? 'bg-violet-500/20' : 'bg-white/5'}">
                            {#if hasStudents}
                                <CheckCircle weight="duotone" size={20} />
                            {:else}
                                <UsersFour weight="duotone" size={20} />
                            {/if}
                        </div>
                        <div>
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{$t('nav.students')}</p>
                            <p class="text-xs font-bold whitespace-nowrap">{$t('dashboard.step3')}</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      {/if}

      <!-- Stats Cards Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div class="bento-card group">
          <div class="p-6">
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <UsersFour weight="duotone" size={14} class="text-violet-400" /> {$t('dashboard.stats.students')}
            </p>
            <div class="flex items-baseline gap-2">
              <p class="text-5xl font-extrabold text-white tracking-tighter font-display">{stats.totalStudents}</p>
            </div>
            <p class="text-[10px] font-bold text-violet-400 mt-4 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendUp weight="bold" size={12} /> {$t('dashboard.stats.active')}
            </p>
          </div>
        </div>
        
        <div class="bento-card group">
          <div class="p-6">
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <CurrencyEur weight="duotone" size={14} class="text-primary-400" /> {$t('dashboard.stats.revenue')}
            </p>
            <div class="flex items-baseline gap-1">
              <p class="text-5xl font-extrabold text-white tracking-tighter font-display">{stats.monthlyRevenue}</p>
              <span class="text-2xl font-bold text-surface-600 tracking-tighter font-display">{$t('common.currency')}</span>
            </div>
            <p class="text-[10px] font-bold text-primary-400 mt-4 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendUp weight="bold" size={12} /> {$t('dashboard.stats.this_month')}
            </p>
          </div>
        </div>
        
        <div class="bento-card group">
          <div class="p-6">
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Pulse weight="duotone" size={14} class="text-blue-400" /> {$t('dashboard.stats.attendance')}
            </p>
            <div class="flex items-baseline gap-1">
              <p class="text-5xl font-extrabold text-white tracking-tighter font-display">{stats.occupancyRate}</p>
              <span class="text-2xl font-bold text-surface-600 tracking-tighter font-display">%</span>
            </div>
            <p class="text-[10px] font-bold text-surface-500 mt-4 uppercase tracking-wider">{$t('dashboard.stats.avg')}</p>
          </div>
        </div>
        
        <div class="bento-card group overflow-hidden">
          <div class="p-6">
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Trophy weight="duotone" size={14} class="text-orange-400" /> {$t('dashboard.stats.next_event')}
            </p>
            {#if nextTournament}
              <div class="h-10 mt-2">
                  <p class="text-xl font-bold text-white truncate font-display">{nextTournament.name}</p>
                  <p class="text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1">{$t('dashboard.stats.in')} {Math.ceil((new Date(nextTournament.start_date || '').getTime() - Date.now()) / (1000*60*60*24))} {$t('dashboard.stats.days')}</p>
              </div>
            {:else}
              <p class="text-5xl font-extrabold text-surface-700 tracking-tighter font-display">—</p>
              <p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest mt-4">{$t('dashboard.stats.no_events')}</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Real SVG Charts implemented like original -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Chart 1: Ingresos -->
        <div class="bento-card group">
          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{$t('dashboard.revenue_trend')}</h3>
                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-3xl font-extrabold text-white tracking-tighter font-display">{stats.monthlyRevenue}{$t('common.currency')}</span>
                  <span class="text-[10px] font-bold text-violet-400 uppercase tracking-widest">{$t('dashboard.stats.revenue_increase')}</span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                <CurrencyEur weight="duotone" size={20} />
              </div>
            </div>
            
            <div class="relative h-[160px] w-full mt-4">
                <svg class="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.3" />
                            <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    
                    {#if chartData.revenue.some(v => v > 0)}
                       {@const max = Math.max(...chartData.revenue, 100) * 1.2}
                       {@const points = chartData.revenue.map((v, i) => `${20 + i * 52},${130 - (v / max) * 110}`).join(' ')}
                       
                       <path d="M 20,130 {points} 280,130" fill="url(#revGrad)" />
                       <path d="M 20,130 {points}" fill="none" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                       
                       {#each chartData.revenue as v, i}
                         <circle cx={20 + i * 52} cy={130 - (v / max) * 110} r="4" class="fill-bento-card stroke-primary-400 stroke-2" />
                       {/each}
                    {/if}
                </svg>
                <div class="flex justify-between px-2 mt-4 text-[9px] text-surface-500 font-black uppercase tracking-widest">
                    {#each chartData.labels as label}
                      <span>{label}</span>
                    {/each}
                </div>
            </div>
          </div>
        </div>

        <!-- Chart 2: Estudiantes -->
        <div class="bento-card group">
          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{$t('dashboard.student_retention')}</h3>
                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-3xl font-extrabold text-white tracking-tighter font-display">{stats.totalStudents}</span>
                  <span class="text-[10px] font-bold text-primary-400 uppercase tracking-widest">{$t('dashboard.stats.total_students')}</span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                <UsersFour weight="duotone" size={20} />
              </div>
            </div>
            
            <div class="relative h-[160px] w-full mt-4">
                <div class="flex items-end justify-between h-[120px] px-2 gap-3">
                    {#each [40, 60, 50, 80, 70, 95] as height, i}
                       <div class="flex-1 flex flex-col items-center group/bar">
                           <div class="w-full bg-white/5 group-hover/bar:bg-primary-500/20 rounded-t-xl transition-all relative overflow-hidden" 
                                style="height: {height}%">
                               <div class="absolute bottom-0 left-0 right-0 bg-primary-500/40 group-hover/bar:bg-primary-500/60 transition-colors" style="height: 30%"></div>
                           </div>
                           <span class="text-[9px] text-surface-600 font-bold uppercase tracking-tighter mt-3 group-hover/bar:text-surface-400 transition-colors">
                             {chartData.labels[i]}
                           </span>
                       </div>
                    {/each}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sidebar -->
    <div class="space-y-6">
      <h3 class="text-lg font-extrabold text-white flex items-center gap-3 font-display">
        <Pulse weight="duotone" class="text-primary-500" /> {$t('dashboard.activity')}
      </h3>
      
      <div class="bento-card max-h-[500px] overflow-y-auto custom-scrollbar p-2">
        {#if recentActivity().length === 0}
          <div class="p-12 text-center">
            <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-surface-600">
               <Pulse weight="duotone" size={24} />
            </div>
            <p class="text-surface-500 text-sm font-medium">{$t('dashboard.no_activity')}</p>
          </div>
        {:else}
          <div class="space-y-1">
            {#each recentActivity() as activity}
              <div class="p-4 flex gap-4 hover:bg-white/5 transition-all duration-300 rounded-2xl group/act">
                 <div class="mt-0.5">
                   <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 group-hover/act:bg-primary-500/10 group-hover/act:text-primary-400 transition-colors">
                     <activity.icon weight="duotone" size={18} class={activity.color} />
                   </div>
                 </div>
                 <div class="flex-1 min-w-0">
                   <p class="text-sm text-white font-bold leading-snug truncate">{activity.message}</p>
                   <p class="text-[10px] text-surface-500 font-bold uppercase tracking-widest mt-1 opacity-60">{activity.time}</p>
                 </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- Achievement Card -->
      <div class="bento-card !bg-primary-500/10 border-primary-500/20 p-8 text-center relative overflow-hidden group">
        <div class="absolute -top-12 -right-12 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 scale-150 rotate-12">
            <Medal weight="duotone" size={120} class="text-primary-400" />
        </div>
        
        <div class="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-400 mx-auto mb-6 relative z-10 shadow-violet-flare">
           <Medal weight="duotone" size={32} />
        </div>
        
        <h4 class="text-xl font-extrabold text-white mb-2 relative z-10 font-display">{$t('dashboard.keep_growing')}</h4>
        <p class="text-sm text-surface-400 mb-8 relative z-10 font-medium">{$t('dashboard.achievements_desc')}</p>
        
        <button onclick={() => goto('/panel/achievements')} class="btn-pill bg-white text-black w-full relative z-10 font-bold text-sm tracking-tight active:scale-95 transition-transform py-4">
            {$t('dashboard.view_achievements')}
        </button>
      </div>

      <!-- Support Card -->
      <div class="bento-card !p-6 flex items-center justify-between group">
          <div>
            <p class="text-[10px] text-surface-500 font-black uppercase tracking-widest leading-none mb-1">{$t('dashboard.need_help')}</p>
            <p class="text-sm font-bold text-white">{$t('dashboard.support_center')}</p>
          </div>
          <a href="/panel/lobby?tab=support" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-surface-400 hover:bg-primary-500 hover:text-white transition-all shadow-soft">
            <Plus weight="bold" size={16} />
          </a>
      </div>
    </div>
  </div>
  
</div>

<style>
  div::-webkit-scrollbar { display: none; }
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
    display: block;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
</style>
