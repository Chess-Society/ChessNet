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
    Coins,
    Student,
    CreditCard,
    ChatCircleDots,
    Crown,
    PencilSimple,
    CaretRight,
    ChartPieSlice,
    UserCircle,
    ArrowRight,
    Sword,
    HandCoins
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';
  import { t, locale } from '$lib/i18n';
  import { parseDate } from '$lib/utils/date';
  import { user as authUser } from '$lib/stores/auth';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let teacherName = $derived($appStore?.settings?.teacherName || $authUser?.displayName || 'Socio');

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
    
    // AÃ±adir las que falten si el layout estÃ¡ desactualizado
    allActions.forEach(a => {
      if (!layout.includes(a.id)) result.push(a);
    });
    
    return result;
  });

  // MÃ©tricas reales calculadas desde el store
  let stats = $derived({
    totalStudents: $appStore.students.length,
    monthlyRevenue: $appStore.payments.filter(p => {
      const dateStr = (p as any).date || p.paidDate || p.dueDate;
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

  let nextTournament = $derived($appStore.tournaments.filter(t => t.status === 'upcoming').sort((a,b) => (a.startDate || '').localeCompare(b.startDate || ''))[0]);

  // Onboarding flags
  const hasSchools = $derived($appStore.schools.length > 0);
  const hasClasses = $derived($appStore.classes.length > 0);
  const hasStudents = $derived($appStore.students.length > 0);
  const isFullyBoarded = $derived(hasClasses && hasStudents);

  // Social Pulse dinÃ¡mico (Mezcla de actividad social y operativa)
  let socialPulse = $derived(() => {
    const activities: any[] = [];
    
    // 1. Actividad de Estudiantes
    $appStore.students.slice(-2).reverse().forEach((s: any) => {
      activities.push({ 
        message: `${$t('dashboard.activity.new_student')}: ${s.name}`, 
        time: $t('dashboard.activity.recent'), 
        icon: UsersFour, 
        color: 'text-violet-400',
        type: 'OPERATIVE',
        timestamp: parseDate(s.createdAt).getTime()
      });
    });

    // 2. Actividad de Pagos
    $appStore.payments.slice(-2).reverse().forEach(p => {
      const student = $appStore.students.find(s => s.id === p.studentId);
      activities.push({ 
        message: `${$t('dashboard.activity.payment')}: ${p.amount}${$t('common.currency')} - ${student?.name || $t('common.unknown')}`, 
        time: $t('dashboard.activity.recent'), 
        icon: CurrencyEur, 
        color: 'text-primary-400',
        type: 'OPERATIVE',
        timestamp: parseDate(p.paidDate || p.dueDate || p.createdAt).getTime()
      });
    });

    // 3. Actividad Social Real (Posts)
    $appStore.posts.slice(0, 5).forEach(post => {
      activities.push({
        message: `${post.authorName}: ${post.content.substring(0, 40)}${post.content.length > 40 ? '...' : ''}`,
        time: 'Social',
        icon: ChatCircleDots,
        color: 'text-primary-400',
        type: 'SOCIAL',
        timestamp: parseDate(post.createdAt).getTime()
      });
    });

    // 4. Retos Activos (Markets)
    $appStore.markets.slice(0, 3).forEach(market => {
      activities.push({
        message: `NUEVO RETO: ${market.question}`,
        time: 'ACTIVO',
        icon: Sword,
        color: 'text-violet-400',
        type: 'COMMUNITY',
        timestamp: parseDate(market.createdAt).getTime()
      });
    });

    return activities.sort((a,b) => b.timestamp - a.timestamp).slice(0, 8);
  });

  // LOGICA DRAG & DROP
  const toggleEditMode = () => {
    if (editMode) {
      // Guardar nuevo layout
      appStore.updateDashboardLayout(displayedActions().map(a => a.id));
      // toast.success('DiseÃ±o guardado');
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
          const dateStr = (p as any).date || p.paidDate || p.dueDate;
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
    }),
    social: Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (5 - i));
      const day = d.getDate();
      const month = d.getMonth();
      const year = d.getFullYear();
      
      // Contar posts del dÃ­a
      return $appStore.posts.filter(p => {
        const pd = parseDate(p.createdAt);
        return pd.getDate() === day && pd.getMonth() === month && pd.getFullYear() === year;
      }).length * 10 || (10 + Math.random() * 20); // Base + posts
    })
  });

  const maxSoc = 100;
  let socPoints = $derived(chartData.social.map((v, i) => `${20 + i * 52},${130 - (v / maxSoc) * 110}`).join(' '));

  // Rank logic
  const tierNames = {
    'BRONZE': 'BRONCE',
    'SILVER': 'PLATA',
    'GOLD': 'ORO',
    'PLATINUM': 'PLATINO',
    'DIAMOND': 'DIAMANTE'
  };

  const nextTierNets = {
    'BRONZE': 1500,
    'SILVER': 5000,
    'GOLD': 15000,
    'PLATINUM': 50000,
    'DIAMOND': 100000
  };

  const userEconomy = $derived($appStore?.settings?.economy || { netsBalance: 0, tier: 'BRONZE' });
  const currentTier = $derived(userEconomy.tier || 'BRONZE');
  const netsToNext = $derived(nextTierNets[currentTier as keyof typeof nextTierNets] - userEconomy.netsBalance);
  const progressToNext = $derived(Math.min(100, (userEconomy.netsBalance / nextTierNets[currentTier as keyof typeof nextTierNets]) * 100));


</script>

<svelte:head>
  <title>ChessNet - Dashboard</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 pt-10 items-end">
    <div class="space-y-6" in:fly={{y: 20, duration: 800}}>
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="h-[2px] w-8 bg-violet-500"></div>
          <h2 class="text-violet-400 text-[10px] font-black uppercase tracking-[0.4em]">{$t('dashboard.ops.title')}</h2>
        </div>
        <h1 class="text-4xl lg:text-5xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.9]">
          {teacherName.split(' ')[0]}, <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-primary-300 to-indigo-400">{$t('panel.motto_primary').replace(',', '')}</span>
        </h1>
        <p class="text-zinc-500 text-sm font-medium tracking-tight font-jakarta max-w-md border-l-2 border-white/5 pl-4 py-1">
          {$t('dashboard.ops.desc')}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <button 
          onclick={toggleEditMode}
          class="px-5 py-2.5 border transition-all flex items-center gap-3 group {editMode ? 'bg-amber-500 border-amber-600 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-violet-500/50 hover:text-white'}"
        >
          <PencilSimple weight="bold" size={16} class={editMode ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] leading-none">
            {editMode ? $t('dashboard.save') : $t('dashboard.customize')}
          </span>
        </button>
        
        {#if !editMode}
          <div class="h-px w-12 bg-white/5 hidden sm:block"></div>
          <p class="text-[10px] text-zinc-600 font-black uppercase tracking-widest hidden sm:block">{todayFormat}</p>
        {/if}
      </div>
    </div>

    <!-- Nets Rank Widget (Replaces Impact) -->
    <div class="bento-card p-1 rounded-none bg-zinc-950/40 border border-white/5 group relative overflow-hidden transition-all duration-700 hover:border-violet-500/20" in:fly={{x: 20, duration: 800}}>
      <div class="absolute -right-12 -top-12 w-64 h-64 bg-violet-600/[0.03] blur-[100px] group-hover:bg-violet-600/10 transition-all duration-700"></div>
      
      <div class="flex flex-col md:flex-row items-center gap-8 p-8 relative z-10">
        <div class="w-28 h-28 bg-zinc-950 border border-white/10 flex items-center justify-center relative shadow-2xl shrink-0 group-hover:border-violet-500/40 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <ChartPieSlice weight="fill" size={44} class="text-violet-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform duration-500" />
          <div class="absolute -bottom-2 -right-2 bg-primary-500 text-black text-[8px] font-black px-2 py-1 uppercase tracking-tighter shadow-lg group-hover:bg-white transition-colors">
            NIVEL {currentTier}
          </div>
          <!-- Progress Ring -->
          <svg class="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90">
            <circle cx="58" cy="58" r="56" fill="none" stroke="currentColor" stroke-width="1.5" class="text-white/5" />
            <circle cx="58" cy="58" r="56" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="351.8" stroke-dashoffset={351.8 - (351.8 * progressToNext) / 100} class="text-primary-400 group-hover:text-violet-400 transition-all duration-1000" />
          </svg>
        </div>

        <div class="flex-1 space-y-5 w-full">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="flex items-center gap-1.5 px-2 py-0.5 bg-primary-500/10 border border-primary-500/20">
                <ChartPieSlice weight="fill" size={12} class="text-primary-400" />
                <span class="text-[8px] font-black text-primary-300 uppercase tracking-widest">ECONOMÍA CHESSNET</span>
              </div>
              <p class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Progreso de Rango</p>
            </div>
            <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight leading-none group-hover:text-primary-400 transition-colors">
              PRÓXIMO RANGO <span class="text-zinc-600 mx-2">/</span> <span class="text-primary-400">{(netsToNext ?? 0) > 0 ? (netsToNext ?? 0).toLocaleString() : 0} NETS</span>
            </h3>
            <p class="text-[10px] text-zinc-500 font-bold uppercase mt-3 flex items-center gap-2">
              <span class="w-1 h-1 bg-primary-500"></span>
              Sigue participando para subir de nivel y desbloquear beneficios exclusivos.
            </p>
          </div>
          
          <div class="space-y-4">
            <div class="h-1.5 w-full bg-zinc-900 border border-white/5 relative overflow-hidden">
              <div class="h-full bg-gradient-to-r from-violet-600 via-primary-400 to-violet-400 transition-all duration-1000 shadow-[0_0_20px_rgba(139,92,246,0.4)]" style="width: {progressToNext}%">
                <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>
              </div>
            </div>
            <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
              <div class="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10">
                <span class="text-zinc-500">SALDO ACTUAL:</span>
                <span class="text-white">{(userEconomy.netsBalance ?? 0).toLocaleString()} NTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div class="mb-8 lg:mb-12">
    <!-- Mobile Action Grid Header -->
    <div class="lg:hidden mb-4">
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{$t('dashboard.quick_access')}</p>
      <div class="h-0.5 w-12 bg-violet-500 rounded-none"></div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
          class="group relative flex flex-col items-start p-6 h-44 bg-zinc-950/40 border border-white/[0.05] transition-all duration-500 hover:border-violet-500/40 hover:bg-zinc-900/60 overflow-hidden {editMode ? 'cursor-move border-dashed border-violet-500/40' : ''} {action.premium && !($appStore.settings.plan === 'premium' || data.isAdmin) ? 'opacity-80' : ''}"
          in:fly={{y: 20, delay: 100 + (i * 50), duration: 600}}
        >
          <!-- Corner Accents -->
          <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-violet-500/50 transition-all"></div>
          <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-violet-500/50 transition-all"></div>
          
          <!-- Background Glow -->
          <div class="absolute -right-8 -bottom-8 w-32 h-32 {action.color.replace('text-', 'bg-')} opacity-0 blur-[60px] group-hover:opacity-[0.07] transition-opacity duration-700"></div>
          
          <div class="w-full flex justify-between items-start mb-auto">
            <div class="w-12 h-12 bg-white/[0.03] border border-white/5 flex items-center justify-center {action.color} group-hover:scale-110 group-hover:border-violet-500/30 group-hover:bg-violet-500/10 transition-all duration-500 relative">
               <div class="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 blur-md transition-opacity"></div>
               <action.icon weight="duotone" size={28} />
            </div>

            {#if action.premium && !($appStore.settings.plan === 'premium' || data.isAdmin)}
                <div class="px-2 py-1 bg-violet-600/20 border border-violet-500/30 text-violet-400">
                    <Crown weight="fill" size={10} />
                </div>
            {/if}
            
            {#if action.badge}
              <span class="bg-primary-500 text-black text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest leading-none shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                {action.badge}
              </span>
            {/if}
          </div>
          
          <div class="mt-6 w-full">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-outfit font-black text-white block uppercase tracking-[0.1em] group-hover:text-primary-300 transition-colors">
                {action.title}
              </span>
              <CaretRight size={10} class="text-zinc-700 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
            </div>
            <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.15em] leading-tight block line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {action.desc}
            </span>
          </div>

          {#if editMode}
              <div class="absolute inset-0 bg-violet-600/10 backdrop-blur-[3px] flex items-center justify-center border-2 border-dashed border-violet-500/30">
                <div class="flex flex-col items-center gap-2">
                  <DotsSixVertical weight="bold" size={32} class="text-violet-400 animate-pulse" />
                  <span class="text-[8px] font-black text-violet-300 uppercase tracking-widest">MOVER ACCIÓN</span>
                </div>
              </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
    <div class="lg:col-span-2 space-y-8">
      

      {#if !isFullyBoarded}
        <!-- Roadmap for quick access -->
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
      {/if}

      <!-- Stats Cards Row -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div class="bento-card p-6 flex flex-col gap-5 relative overflow-hidden group border-white/[0.05] bg-zinc-950/40 hover:border-violet-500/30 transition-all duration-500" in:fly={{y: 20, delay: 300}}>
          <div class="w-10 h-10 bg-white/[0.03] flex items-center justify-center text-violet-400 border border-white/5 group-hover:bg-violet-500/10 group-hover:text-white transition-all">
            <UsersFour weight="duotone" size={20} />
          </div>
          <div>
            <p class="text-[9px] font-outfit font-black text-zinc-500 uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:text-violet-300 transition-colors">{$t('dashboard.stats.students')}</p>
            <div class="flex items-center gap-3">
              <p class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{stats.totalStudents}</p>
              <TrendUp size={14} class="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
        
        <div class="bento-card p-6 flex flex-col gap-5 relative overflow-hidden group border-white/[0.05] bg-zinc-950/40 hover:border-primary-500/30 transition-all duration-500" in:fly={{y: 20, delay: 400}}>
          <div class="w-10 h-10 bg-white/[0.03] flex items-center justify-center text-primary-400 border border-white/5 group-hover:bg-primary-500/10 group-hover:text-white transition-all">
            <CurrencyEur weight="duotone" size={20} />
          </div>
          <div>
            <p class="text-[9px] font-outfit font-black text-zinc-500 uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:text-primary-300 transition-colors">{$t('dashboard.stats.revenue')}</p>
            <p class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{stats.monthlyRevenue}</p>
          </div>
        </div>
        
        <div class="bento-card p-6 flex flex-col gap-5 relative overflow-hidden group border-white/[0.05] bg-zinc-950/40 hover:border-violet-500/30 transition-all duration-500" in:fly={{y: 20, delay: 500}}>
          <div class="w-10 h-10 bg-white/[0.03] flex items-center justify-center text-violet-400 border border-white/5 group-hover:bg-violet-500/10 group-hover:text-white transition-all">
            <Pulse weight="duotone" size={20} />
          </div>
          <div>
            <p class="text-[9px] font-outfit font-black text-zinc-500 uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:text-violet-300 transition-colors">{$t('dashboard.stats.attendance')}</p>
            <div class="flex items-baseline gap-1">
              <p class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{stats.occupancyRate}</p>
              <span class="text-[10px] font-black text-zinc-600">%</span>
            </div>
          </div>
        </div>
        
        <div class="bento-card p-6 flex flex-col gap-5 relative overflow-hidden group border-white/[0.05] bg-zinc-950/40 hover:border-amber-500/30 transition-all duration-500" in:fly={{y: 20, delay: 600}}>
          <div class="w-10 h-10 bg-white/[0.03] flex items-center justify-center text-amber-400 border border-white/5 group-hover:bg-amber-500/10 group-hover:text-white transition-all">
            <Trophy weight="duotone" size={20} />
          </div>
          <div>
            <p class="text-[9px] font-outfit font-black text-zinc-500 uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:text-amber-300 transition-colors">{$t('dashboard.stats.next_event')}</p>
            {#if nextTournament}
              <p class="text-sm font-outfit font-black text-white leading-tight truncate uppercase tracking-tight">{nextTournament.name}</p>
            {:else}
              <p class="text-3xl font-outfit font-black text-zinc-800 leading-none">---</p>
            {/if}
          </div>
        </div>

        <div class="bento-card p-6 flex flex-col gap-5 relative overflow-hidden group border-violet-500/20 bg-violet-500/[0.03] hover:border-violet-400 transition-all duration-500" in:fly={{y: 20, delay: 700}}>
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/10 group-hover:bg-violet-500 group-hover:text-white transition-all">
            <Coins weight="fill" size={20} />
          </div>
          <div>
            <p class="text-[9px] font-outfit font-black text-zinc-400 uppercase tracking-[0.3em] mb-2 opacity-80">RANGO ACTUAL</p>
            <div class="flex items-baseline gap-1">
              <p class="text-4xl font-outfit font-black text-white leading-none tracking-tighter">{currentTier}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Chart 1: Ingresos -->
        <div class="bento-card group border-white/[0.05] bg-zinc-950/40">
          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 opacity-60">{$t('dashboard.revenue_trend')}</h3>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-3xl font-black text-white tracking-tighter font-outfit uppercase">{stats.monthlyRevenue}{$t('common.currency')}</span>
                  <div class="flex items-center gap-1 text-[8px] font-black text-primary-400 uppercase tracking-widest bg-primary-400/10 px-1.5 py-0.5">
                    <TrendUp size={10} />
                    <span>{$t('dashboard.stats.revenue_increase')}</span>
                  </div>
                </div>
              </div>
              <div class="w-10 h-10 bg-white/[0.03] border border-white/5 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/10 transition-colors">
                <CurrencyEur weight="duotone" size={20} />
              </div>
            </div>
            
            <div class="relative h-[130px] w-full mt-4 bg-zinc-900/30 border border-white/[0.03] overflow-hidden">
                <!-- Tech Grid Background -->
                <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;"></div>
                
                <svg class="w-full h-full relative z-10" viewBox="0 0 300 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.2" />
                            <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    
                    {#if chartData.revenue.some(v => v > 0)}
                       {@const max = Math.max(...chartData.revenue, 100) * 1.2}
                       {@const points = chartData.revenue.map((v, i) => `${20 + i * 52},${130 - (v / max) * 110}`).join(' ')}
                       
                       <path d="M 20,130 {points} 280,130" fill="url(#revGrad)" />
                       <path d="M 20,130 {points}" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" class="drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
                       
                       {#each chartData.revenue as v, i}
                         <rect x={20 + i * 52 - 2} y={130 - (v / max) * 110 - 2} width="4" height="4" class="fill-white stroke-violet-500 stroke-1" />
                       {/each}
                    {/if}
                </svg>
            </div>
          </div>
        </div>

        <!-- Chart 2: Estudiantes -->
        <div class="bento-card group border-white/[0.05] bg-zinc-950/40">
          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 opacity-60">{$t('dashboard.student_retention')}</h3>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-3xl font-black text-white tracking-tighter font-outfit uppercase">{stats.totalStudents}</span>
                  <div class="flex items-center gap-1 text-[8px] font-black text-primary-400 uppercase tracking-widest bg-primary-400/10 px-1.5 py-0.5">
                    <span>{$t('dashboard.stats.total_students')}</span>
                  </div>
                </div>
              </div>
              <div class="w-10 h-10 bg-white/[0.03] border border-white/5 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/10 transition-colors">
                <UsersFour weight="duotone" size={20} />
              </div>
            </div>
            
            <div class="relative h-[130px] w-full mt-4 bg-zinc-900/30 border border-white/[0.03] overflow-hidden p-4">
                <!-- Tech Grid Background -->
                <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;"></div>
                
                <div class="flex items-end justify-between h-full px-2 gap-3 relative z-10">
                    {#each [40, 60, 50, 80, 70, 95] as height, i}
                       <div class="flex-1 flex flex-col items-center group/bar">
                           <div class="w-full bg-white/5 border border-white/5 group-hover/bar:bg-primary-500/10 transition-all relative overflow-hidden" 
                                style="height: {height}%">
                               <div class="absolute bottom-0 left-0 right-0 bg-primary-500/30 group-hover/bar:bg-primary-500/50 transition-colors" style="height: 40%"></div>
                               <div class="absolute top-0 left-0 right-0 h-px bg-white/10 group-hover/bar:bg-primary-400 transition-colors"></div>
                           </div>
                       </div>
                    {/each}
                </div>
            </div>
          </div>
        </div>

        <!-- Chart 3: Social Activity -->
        <div class="bento-card group border-primary-500/20 bg-primary-500/[0.02]">
          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-primary-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 opacity-80">Actividad Social</h3>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-3xl font-black text-white tracking-tighter font-outfit uppercase">90</span>
                  <span class="text-[8px] font-black text-primary-400 uppercase tracking-widest bg-primary-400/10 px-1.5 py-0.5">NETS / SEMANA</span>
                </div>
              </div>
              <div class="w-10 h-10 bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-black transition-all">
                <ChatCircleDots weight="fill" size={20} />
              </div>
            </div>
            
            <div class="relative h-[130px] w-full mt-4 bg-primary-950/20 border border-primary-500/10 overflow-hidden">
                <!-- Tech Grid Background -->
                <div class="absolute inset-0 opacity-[0.05]" style="background-image: radial-gradient(circle, #22d3ee 1px, transparent 1px); background-size: 20px 20px;"></div>
                
                <svg class="w-full h-full relative z-10" viewBox="0 0 300 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.2" />
                            <stop offset="100%" stop-color="#00f2fe" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    
                    <path d="M 20,130 {socPoints} 280,130" fill="url(#socGrad)" />
                    <path d="M 20,130 {socPoints}" fill="none" stroke="#00f2fe" stroke-width="2" stroke-linecap="square" class="drop-shadow-[0_0_12px_rgba(0,242,254,0.6)]" />
                    
                    {#each socPoints.split(' ') as point, i}
                      {@const [x, y] = point.split(',')}
                      <rect x={parseFloat(x) - 2} y={parseFloat(y) - 2} width="4" height="4" class="fill-white stroke-primary-400 stroke-1" />
                    {/each}
                </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="space-y-6">
      <div class="bento-card p-8 flex flex-col h-full bg-zinc-950/40 border-white/[0.03]">
        <div class="flex justify-between items-center mb-8">
          <div class="space-y-1">
            <h3 class="text-sm font-outfit font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Pulse weight="fill" class="text-primary-400 animate-pulse" size={16} /> {$t('dashboard.social_pulse.title')}
            </h3>
            <p class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">ACTIVIDAD EN TIEMPO REAL</p>
          </div>
          <button 
            onclick={() => goto('/panel/social')}
            class="w-8 h-8 bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-primary-400 hover:border-primary-500/30 transition-all"
          >
            <ArrowRight weight="bold" size={14} />
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto custom-scrollbar -mx-2 pr-2">
          {#if socialPulse().length === 0}
            <div class="p-8 text-center bg-white/[0.03] border border-dashed border-white/10">
             <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic opacity-60">{$t('dashboard.social_pulse.waiting')}</p>
            </div>
          {:else}
            <div class="space-y-0">
              {#each socialPulse() as activity, i}
                <div class="flex gap-5 group/act relative" in:fly={{x: 20, delay: 800 + (i * 100)}}>
                   <div class="absolute left-5 top-10 bottom-0 w-px bg-white/[0.05] group-last/act:hidden"></div>
                   <div class="w-10 h-10 bg-zinc-950 border border-white/[0.08] flex items-center justify-center text-zinc-500 group-hover:text-primary-400 group-hover:border-primary-500/40 transition-all duration-500 shrink-0 z-10 shadow-xl">
                     <activity.icon weight="fill" size={18} class="{activity.color} group-hover:scale-110 transition-transform" />
                   </div>
                   <div class="flex-1 min-w-0 pb-8 group-last/act:pb-4">
                     <div class="p-3 bg-white/[0.02] border border-transparent group-hover:border-white/5 group-hover:bg-white/[0.04] transition-all duration-500">
                       <p class="text-[11px] text-zinc-300 font-bold leading-relaxed tracking-tight">{activity.message}</p>
                       <div class="flex items-center gap-3 mt-3">
                         <span class="text-[8px] text-zinc-600 font-black uppercase tracking-[0.2em]">{activity.time}</span>
                         <div class="h-1 w-1 bg-zinc-800 rounded-none"></div>
                         <div class="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 border border-white/5">
                           <span class="text-[7px] font-black {activity.type === 'SOCIAL' ? 'text-primary-400' : 'text-violet-400'} uppercase tracking-widest">{activity.type}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              {/each}
              
              <!-- Predictive Market Section (Real Data) -->
              {#if $appStore.markets.length > 0}
                {@const mainMarket = $appStore.markets[0]}
                {@const yesOpt = mainMarket.options?.find(o => o.text?.toUpperCase() === 'SÍ' || o.id === 'yes') || mainMarket.options?.[0]}
                {@const noOpt = mainMarket.options?.find(o => o.text?.toUpperCase() === 'NO' || o.id === 'no') || mainMarket.options?.[1]}
                {@const totalP = mainMarket.totalPool || 1}
                {@const yPct = Math.round(((yesOpt?.totalStaked || 0) / totalP) * 100)}
                {@const nPct = 100 - yPct}

                <div class="p-5 bg-violet-600/5 border border-violet-500/10 relative overflow-hidden group/market">
                  <div class="absolute top-0 right-0 p-2 opacity-10 group-hover/market:opacity-30 transition-opacity">
                      <Sword weight="fill" size={32} class="text-violet-500" />
                  </div>
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">Comunidad</span>
                    <div class="h-px flex-1 bg-violet-500/10"></div>
                  </div>
                  <p class="text-[11px] text-white font-bold leading-snug mb-4 uppercase tracking-tight line-clamp-2">
                    {mainMarket.question}
                  </p>
                  
                  <div class="space-y-3">
                    <div class="flex flex-col gap-2">
                      <div class="flex justify-between text-[9px] font-black">
                        <span class="text-emerald-400">{yesOpt?.text || 'SÍ'}</span>
                        <span class="text-white">{yPct}%</span>
                      </div>
                      <div class="h-1.5 bg-zinc-900 overflow-hidden">
                        <div class="h-full bg-emerald-500 transition-all duration-1000" style="width: {yPct}%"></div>
                      </div>
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex justify-between text-[9px] font-black">
                        <span class="text-rose-400">{noOpt?.text || 'NO'}</span>
                        <span class="text-white">{nPct}%</span>
                      </div>
                      <div class="h-1.5 bg-zinc-900 overflow-hidden">
                        <div class="h-full bg-rose-500 transition-all duration-1000" style="width: {nPct}%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              {:else}
                <div class="p-5 bg-zinc-900/50 border border-white/5 text-center">
                  <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">No hay retos activos</p>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <button 
          onclick={() => goto('/panel/social')}
          class="mt-8 w-full py-3.5 bg-white/5 border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {$t('dashboard.social_pulse.view_all')} <Plus size={14} weight="bold" />
        </button>
      </div>
      
      <!-- Support Card (WorldMonitor Command Style) -->
      <a href="/panel/support" class="relative group p-8 bg-zinc-950/40 border border-white/[0.03] overflow-hidden transition-all hover:border-amber-500/40">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 bg-amber-500 animate-pulse"></div>
                <p class="text-[9px] text-amber-500/80 font-black uppercase tracking-[0.4em]">SISTEMA DE SOPORTE</p>
              </div>
              <p class="text-xl font-outfit font-black text-white uppercase tracking-tighter">CENTRO DE AYUDA</p>
              <p class="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">ACCESO DIRECTO A COMUNICACIONES</p>
            </div>
            <div class="w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-amber-500 group-hover:text-black group-hover:scale-110 transition-all duration-500">
              <Lightning weight="fill" size={20} />
            </div>
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

