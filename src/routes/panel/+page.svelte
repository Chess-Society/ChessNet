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
    ChatCircleDots,
    Crown
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
    { id: 'payments', title: $t('actions.payments.title'), desc: $t('actions.payments.desc'), icon: CreditCard, color: 'text-primary-400', link: '/panel/payments', badge: 'BETA', premium: true },
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
        color: 'text-primary-400',
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
  
  <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 pt-8 gap-8">
    <div class="space-y-2">
      <h1 class="text-4xl lg:text-6xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.9]">
        <span class="gradient-text">{$t('panel.motto_primary') || 'Entrena con pasión,'}</span><br/>
        {$t('panel.motto_secondary') || 'lidera con estrategia.'}
      </h1>
      <p class="text-zinc-500 text-lg font-medium tracking-tight font-jakarta">{$t('dashboard.overview')}</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
      <div class="flex items-center gap-4 bento-card p-4 flex-1 lg:flex-none justify-between lg:justify-start">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center text-violet-400">
            <Clock weight="duotone" size={20} />
          </div>
          <div>
            <p class="text-[9px] text-zinc-500 uppercase font-black tracking-widest leading-none mb-1">{$t('dashboard.today_is')}</p>
            <p class="text-sm font-outfit font-black text-white capitalize">{todayFormat}</p>
          </div>
        </div>
      </div>

      <button 
        onclick={toggleEditMode}
        class="h-18 px-6 border transition-all flex flex-col items-center justify-center gap-1 group {editMode ? 'bg-amber-500 border-amber-600 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-violet-500/50 hover:text-white'}"
      >
        <PencilSimple weight="bold" size={20} class={editMode ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} />
        <span class="text-[8px] font-black uppercase tracking-widest leading-none">
          {editMode ? 'Guardar' : 'Editar'}
        </span>
      </button>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div class="mb-8 lg:mb-12">
    <!-- Mobile Action Grid Header -->
    <div class="lg:hidden mb-4">
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{$t('dashboard.quick_access')}</p>
      <div class="h-0.5 w-12 bg-violet-500 rounded-none"></div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {#each displayedActions() as action, i}
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
          class="bento-card group flex flex-col items-start p-6 h-44 text-left relative overflow-hidden transition-all {editMode ? 'cursor-move border-dashed border-white/20' : ''} {action.premium && !($appStore.settings.plan === 'premium' || data.isAdmin) ? 'opacity-80' : ''}"
        >
          <!-- Premium Violet Glow -->
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {#if action.premium && !($appStore.settings.plan === 'premium' || data.isAdmin)}
              <div class="absolute top-4 right-4 text-violet-400">
                  <Crown weight="fill" size={18} />
              </div>
          {/if}
          
          {#if action.badge}
            <span class="absolute top-4 right-4 bg-violet-600 text-white text-[9px] font-black px-2 py-0.5 shadow-lg z-10 uppercase tracking-widest leading-none">
              {action.badge}
            </span>
          {/if}

          <div class="w-12 h-12 bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-500 mb-auto">
              <action.icon weight="duotone" size={28} />
          </div>
          
          <div class="mt-4">
            <span class="text-sm font-outfit font-black text-white block uppercase tracking-tight">
              {action.title}
            </span>
            <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 block">
              {action.desc}
            </span>
          </div>

          {#if editMode}
              <div class="absolute inset-0 bg-violet-500/10 flex items-center justify-center">
                <DotsSixVertical weight="bold" size={24} class="text-white/40" />
              </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
    <div class="lg:col-span-2 space-y-8">
      

      <!-- Always show roadmap for quick access as requested -->
      <div class="bento-card mb-8 overflow-hidden group" in:fly={{y: 20}}>
            <!-- Background Glow -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 blur-[100px] group-hover:bg-violet-500/20 transition-all duration-700"></div>
            
            <div class="relative z-10 p-6 md:p-10 flex flex-col xl:flex-row gap-6 md:gap-10 items-center">
                <div class="flex-1 space-y-2 md:space-y-4 text-center md:text-left">
                    <div class="flex items-center gap-4 justify-center md:justify-start">
                        <div class="w-10 h-10 md:w-12 md:h-12 bg-violet-500/10 flex items-center justify-center text-violet-400">
                            <Crown weight="fill" size={20} class="md:hidden" />
                            <Crown weight="fill" size={24} class="hidden md:block" />
                        </div>
                        <h3 class="text-xl md:text-3xl font-outfit font-black text-white tracking-tighter uppercase leading-none">{$t('dashboard.quick_start')}</h3>
                    </div>
                    <p class="text-zinc-500 text-sm md:text-lg font-medium max-w-sm font-jakarta mx-auto md:ml-0">{$t('dashboard.steps_desc')}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full xl:w-auto">
                    <!-- Step 1: Centers -->
                    <button 
                      onclick={() => goto('/panel/schools')}
                      class="flex flex-col items-start gap-4 p-5 border transition-all duration-300 {hasSchools ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-zinc-900 border-zinc-800 hover:border-violet-500/50 text-zinc-500'}"
                    >
                        <div class="w-10 h-10 flex items-center justify-center {hasSchools ? 'bg-violet-500/20' : 'bg-zinc-800'}">
                            {#if hasSchools}
                                <CheckCircle weight="duotone" size={20} />
                            {:else}
                                <HouseLine weight="duotone" size={20} />
                            {/if}
                        </div>
                        <div>
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{$t('nav.schools')}</p>
                            <p class="text-xs font-black uppercase tracking-tight whitespace-nowrap">{$t('dashboard.step1')}</p>
                        </div>
                    </button>

                    <!-- Step 2: Classes -->
                    <button 
                      onclick={() => goto('/panel/classes')}
                      class="flex flex-col items-start gap-4 p-5 border transition-all duration-300 {hasClasses ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-zinc-900 border-zinc-800 hover:border-violet-500/50 text-zinc-500'}"
                    >
                        <div class="w-10 h-10 flex items-center justify-center {hasClasses ? 'bg-violet-500/20' : 'bg-zinc-800'}">
                            {#if hasClasses}
                                <CheckCircle weight="duotone" size={20} />
                            {:else}
                                <GraduationCap weight="duotone" size={20} />
                            {/if}
                        </div>
                        <div>
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{$t('nav.classes')}</p>
                            <p class="text-xs font-black uppercase tracking-tight whitespace-nowrap">{$t('dashboard.step2')}</p>
                        </div>
                    </button>

                    <!-- Step 3: Students -->
                    <button 
                      onclick={() => goto('/panel/students')}
                      class="flex flex-col items-start gap-4 p-5 border transition-all duration-300 {hasStudents ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-zinc-900 border-zinc-800 hover:border-violet-500/50 text-zinc-500'}"
                    >
                        <div class="w-10 h-10 flex items-center justify-center {hasStudents ? 'bg-violet-500/20' : 'bg-zinc-800'}">
                            {#if hasStudents}
                                <CheckCircle weight="duotone" size={20} />
                            {:else}
                                <UsersFour weight="duotone" size={20} />
                            {/if}
                        </div>
                        <div>
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{$t('nav.students')}</p>
                            <p class="text-xs font-black uppercase tracking-tight whitespace-nowrap">{$t('dashboard.step3')}</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

      <!-- Stats Cards Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div class="bento-card p-8 flex flex-col gap-4 relative overflow-hidden group">
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center text-violet-400">
            <UsersFour weight="duotone" size={18} />
          </div>
          <div>
            <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('dashboard.stats.students')}</p>
            <p class="text-4xl font-outfit font-black text-white leading-none">{stats.totalStudents}</p>
          </div>
        </div>
        
        <div class="bento-card p-8 flex flex-col gap-4 relative overflow-hidden group">
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center text-violet-400">
            <CurrencyEur weight="duotone" size={18} />
          </div>
          <div>
            <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('dashboard.stats.revenue')}</p>
            <p class="text-4xl font-outfit font-black text-white leading-none">{stats.monthlyRevenue}</p>
          </div>
        </div>
        
        <div class="bento-card p-8 flex flex-col gap-4 relative overflow-hidden group">
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center text-violet-400">
            <Pulse weight="duotone" size={18} />
          </div>
          <div>
            <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('dashboard.stats.attendance')}</p>
            <div class="flex items-baseline gap-1">
              <p class="text-4xl font-outfit font-black text-white leading-none">{stats.occupancyRate}</p>
              <span class="text-xs font-black text-zinc-600">%</span>
            </div>
          </div>
        </div>
        
        <div class="bento-card p-8 flex flex-col gap-4 relative overflow-hidden group">
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center text-violet-400">
            <Trophy weight="duotone" size={18} />
          </div>
          <div>
            <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('dashboard.stats.next_event')}</p>
            {#if nextTournament}
              <p class="text-xl font-outfit font-black text-white leading-tight truncate uppercase tracking-tight">{nextTournament.name}</p>
            {:else}
              <p class="text-4xl font-outfit font-black text-zinc-800 leading-none">—</p>
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
              <div class="w-10 h-10 rounded-none bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 transition-colors">
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
              <div class="w-10 h-10 rounded-none bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                <UsersFour weight="duotone" size={20} />
              </div>
            </div>
            
            <div class="relative h-[160px] w-full mt-4">
                <div class="flex items-end justify-between h-[120px] px-2 gap-3">
                    {#each [40, 60, 50, 80, 70, 95] as height, i}
                       <div class="flex-1 flex flex-col items-center group/bar">
                           <div class="w-full bg-white/5 group-hover/bar:bg-primary-500/20 rounded-none transition-all relative overflow-hidden" 
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
    
    <div class="space-y-6">
      <div class="bento-card p-8">
        <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
          <Pulse weight="duotone" class="text-violet-400" /> {$t('dashboard.activity')}
        </h3>
        
        <div class="max-h-[400px] overflow-y-auto custom-scrollbar -mx-2">
          {#if recentActivity().length === 0}
            <div class="p-8 text-center">
               <p class="text-zinc-500 text-sm font-medium">{$t('dashboard.no_activity')}</p>
            </div>
          {:else}
            <div class="space-y-1">
              {#each recentActivity() as activity}
                <div class="p-4 flex gap-4 hover:bg-white/5 transition-all group/act">
                   <div class="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-all shrink-0">
                     <activity.icon weight="duotone" size={20} class={activity.color} />
                   </div>
                   <div class="flex-1 min-w-0">
                     <p class="text-sm text-white font-bold leading-snug truncate">{activity.message}</p>
                     <p class="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1 opacity-60">{activity.time}</p>
                   </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Support Card -->
      <a href="/panel/support" class="bento-card p-8 flex items-center justify-between group hover:border-amber-500/30 transition-all">
          <div>
            <p class="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{$t('dashboard.need_help')}</p>
            <p class="text-lg font-outfit font-black text-white uppercase tracking-tight">{$t('dashboard.support_center')}</p>
          </div>
          <div class="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <Plus weight="bold" size={20} />
          </div>
      </a>
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
    border-radius: 0;
  }
</style>

