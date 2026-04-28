<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
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
    DotsSixVertical,
    TrendUp,
    Lightning,
    Buildings,
    CreditCard,
    Crown,
    PencilSimple,
    CaretRight,
    Pulse,
    Megaphone,
    BookOpen
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';
  import { t, locale } from '$lib/i18n';
  import { parseDate } from '$lib/utils/date';
  import { user as authUser } from '$lib/stores/auth';
  import { ArrowsClockwise, PuzzlePiece, Sword } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import Modal from '$lib/components/ui/Modal.svelte';

  let { data } = $props<{ data: PageData }>();

  // Announcement modal state
  let selectedAnnouncement = $state<any>(null);
  let showAnnouncementModal = $state(false);

  function openAnnouncement(ann: any) {
    selectedAnnouncement = ann;
    showAnnouncementModal = true;
  }

  let teacherName = $derived($appStore?.settings?.teacherName || $authUser?.displayName || 'Socio');

  // Resolved data for parent view
  const resolvedChildren = $derived(data?.role === 'parent' || data?.role === 'student' ? data?.children : data?.parentData?.children);
  const resolvedAnnouncements = $derived(data?.role === 'parent' || data?.role === 'student' ? data?.announcements : data?.parentData?.announcements);
  const resolvedPayments = $derived(data?.role === 'parent' || data?.role === 'student' ? data?.payments : data?.parentData?.payments);
  const resolvedMissions = $derived(data?.role === 'parent' || data?.role === 'student' ? data?.missions : data?.parentData?.missions);

  // Available actions definition
  const allActions = [
    { id: 'centers', title: $t('actions.schools.title'), desc: $t('actions.schools.desc'), icon: Buildings, color: 'text-blue-400', link: '/panel/schools' },
    { id: 'classes', title: $t('actions.classes.title'), desc: $t('actions.classes.desc'), icon: GraduationCap, color: 'text-primary-400', link: '/panel/classes' },
    { id: 'students', title: $t('actions.students.title'), desc: $t('actions.students.desc'), icon: UsersFour, color: 'text-violet-400', link: '/panel/students' },
    { id: 'skills', title: $t('actions.skills.title'), desc: $t('actions.skills.desc'), icon: BookOpen, color: 'text-yellow-400', link: '/panel/skills' },
    { id: 'tournaments', title: $t('actions.tournaments.title'), desc: $t('actions.tournaments.desc'), icon: Trophy, color: 'text-orange-400', link: '/panel/tournaments', premium: true },
    { id: 'attendance', title: $t('actions.attendance.title'), desc: $t('actions.attendance.desc'), icon: CheckCircle, color: 'text-pink-400', link: '/panel/attendance' },
    { id: 'missions', title: $t('actions.missions.title'), desc: $t('actions.missions.desc'), icon: Target, color: 'text-amber-400', link: '/panel/missions' },
    { id: 'reports', title: $t('actions.reports.title'), desc: $t('actions.reports.desc'), icon: ChartBar, color: 'text-cyan-400', link: '/panel/reports', premium: true },
    { id: 'payments', title: $t('actions.payments.title'), desc: $t('actions.payments.desc'), icon: CreditCard, color: 'text-primary-400', link: '/panel/payments', badge: 'BETA', premium: true },
    { id: 'planner', title: $t('actions.planner.title'), desc: $t('actions.planner.desc'), icon: CalendarBlank, color: 'text-indigo-400', link: '/panel/planner', badge: 'NEW', premium: true }
  ];

  let editMode = $state(false);
  let draggedId = $state<string | null>(null);

  // Derivados del store para el dashboard
  let displayedActions = $derived((() => {
    const layout = $appStore.dashboardLayout || [];
    const actionMap = new Map(allActions.map(a => [a.id, a]));
    
    let result: typeof allActions = [];
    if (layout.length > 0) {
      result = layout.map(id => actionMap.get(id)).filter(Boolean) as typeof allActions;
      // Add missing ones
      allActions.forEach(a => {
        if (!layout.includes(a.id)) result.push(a);
      });
    } else {
      result = allActions;
    }
    
    return result;
  })());

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

  // LOGICA DRAG & DROP
  const toggleEditMode = () => {
    if (editMode) {
      // Guardar nuevo layout
      appStore.updateDashboardLayout(displayedActions.map(a => a.id));
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
    
    const actions = [...displayedActions];
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

  // Role switching logic
  let viewMode = $state<'teacher' | 'parent'>('teacher');
  let userRole = $derived(data?.role || 'teacher');
  
  onMount(() => {
    if (userRole === 'parent' || userRole === 'student') {
      viewMode = 'parent';
    }
  });

  let hasParentData = $derived(!!data?.parentData || (data?.role === 'parent' || data?.role === 'student'));

  function toggleView() {
    viewMode = viewMode === 'teacher' ? 'parent' : 'teacher';
  }

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
    })
  });

</script>

<svelte:head>
  <title>ChessNet - Dashboard</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <!-- View Switcher (Only if user has both roles) -->
  {#if (userRole === 'admin' || userRole === 'teacher') && data?.parentData}
    <div class="flex justify-center pt-8 -mb-4">
      <div class="inline-flex p-1 bg-zinc-950 border border-white/5 rounded-full shadow-2xl">
        <button 
          onclick={() => viewMode = 'teacher'}
          class="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all {viewMode === 'teacher' ? 'bg-primary-500 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}"
        >
          Vista Profesor
        </button>
        <button 
          onclick={() => viewMode = 'parent'}
          class="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all {viewMode === 'parent' ? 'bg-primary-500 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}"
        >
          Vista Familiar
        </button>
      </div>
    </div>
  {/if}

  {#if viewMode === 'parent'}
    <!-- PARENT VIEW -->
    <div class="pt-10 space-y-12" in:fly={{ y: 20, duration: 600 }}>
      <header class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="h-[2px] w-8 bg-primary-500"></div>
          <h2 class="text-primary-400 text-[10px] font-black uppercase tracking-[0.4em]">Panel de Padres</h2>
        </div>
        <h1 class="text-4xl lg:text-6xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.9]">
          Hola, <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-primary-300 italic">
            {userRole === 'student' ? (resolvedChildren?.[0]?.name || 'Bienvenido') : 'Familia'}
          </span>
        </h1>
      </header>

      <!-- Children Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each resolvedChildren || [] as child}
          <div class="bento-card !p-8 group hover:border-primary-500/30 transition-all">
             <div class="flex items-start justify-between mb-8">
               <div class="flex items-center gap-6">
                 <div class="w-20 h-20 bg-zinc-950 border border-white/10 flex items-center justify-center text-primary-400 relative overflow-hidden group">
                    <div class="absolute inset-0 bg-primary-500/5 group-hover:scale-110 transition-transform"></div>
                    <GraduationCap size={40} weight="duotone" class="relative z-10" />
                 </div>
                 <div>
                   <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight italic">{child.name}</h3>
                   <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                     {child.level || 'Nivel inicial'} • {child.school_name || 'Sin escuela asignada'}
                   </p>
                 </div>
               </div>
               <div class="px-4 py-2 bg-zinc-950 border border-white/5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                 ID: {child.id.slice(0,6)}
               </div>
             </div>

             <div class="grid grid-cols-3 gap-4 mb-8">
               <div class="p-4 bg-zinc-950/50 border border-white/5 rounded-none">
                 <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Elo FIDE/Local</p>
                 <p class="text-xl font-outfit font-black text-white">{child.elo || 0}</p>
               </div>
               <div class="p-4 bg-zinc-950/50 border border-white/5 rounded-none">
                 <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Clases totales</p>
                 <p class="text-xl font-outfit font-black text-white">{child.totalClasses || 0}</p>
               </div>
               <div class="p-4 bg-zinc-950/50 border border-white/5 rounded-none">
                 <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Asistencia</p>
                 <p class="text-xl font-outfit font-black text-primary-400">100%</p>
               </div>
             </div>

             <button 
               onclick={() => goto(`/panel/students/${child.id}`)}
               class="w-full h-14 border border-white/10 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
               <ChartBar size={18} />
               Ver Informe de Progreso
             </button>
          </div>
        {/each}
      </div>

      <!-- Parent Payments Section -->
      {#if resolvedPayments?.length}
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <CreditCard size={24} weight="duotone" class="text-primary-400" />
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">Facturación Reciente</h3>
            </div>
            <button onclick={() => goto('/panel/payments')} class="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Ver todo</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each resolvedPayments as payment}
              <div class="bento-card !p-6 border-white/5 hover:border-primary-500/20 transition-all group">
                <div class="flex items-center justify-between mb-4">
                  <div class="px-3 py-1 bg-zinc-950 border border-white/5 text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                    {new Date(payment.dueDate || payment.date).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
                  </div>
                  <span class="text-[8px] font-black px-2 py-1 uppercase tracking-widest {payment.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
                    {payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
                <div class="flex items-end justify-between">
                  <div>
                    <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Concepto</p>
                    <p class="text-sm font-outfit font-black text-white uppercase italic tracking-tight">{payment.concept || 'Cuota Mensual'}</p>
                    <p class="text-[10px] text-zinc-500 font-bold mt-1">
                      {resolvedChildren?.find((c: any) => c.id === payment.studentId)?.name || 'Alumno'}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-outfit font-black text-white">{payment.amount}€</p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Missions Section -->
      {#if resolvedMissions?.length}
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <Target size={24} weight="duotone" class="text-primary-400" />
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">Misiones y Desafíos</h3>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each resolvedMissions as mission}
              <div class="bento-card !p-6 border-white/5 group relative overflow-hidden">
                {#if mission.completed}
                  <div class="absolute top-0 right-0 p-2">
                    <CheckCircle weight="fill" size={24} class="text-emerald-500" />
                  </div>
                {/if}
                
                <div class="space-y-4">
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[8px] font-black px-2 py-0.5 bg-primary-500/10 text-primary-400 uppercase border border-primary-500/20 mb-2 inline-block">
                        {mission.details?.type === 'puzzles' ? 'Lichess Puzzles' : 'Desafío'}
                      </span>
                      <h4 class="text-lg font-outfit font-black text-white uppercase italic tracking-tight">{mission.details?.title}</h4>
                    </div>
                    <div class="text-right">
                      <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Recompensa</p>
                      <p class="text-sm font-black text-amber-400">+{mission.details?.reward} XP</p>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Progreso</span>
                      <span>{mission.progress} / {mission.details?.target}</span>
                    </div>
                    <div class="h-2 bg-white/5 overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-1000" 
                        style="width: {(mission.progress / mission.details?.target) * 100}%"
                      ></div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-2">
                    <p class="text-[9px] text-zinc-500 font-medium">
                      Asignado a: <span class="text-white">{resolvedChildren?.find((c: any) => c.id === mission.studentId)?.name}</span>
                    </p>
                    <form 
                      method="POST" 
                      action="?/verifyMission"
                      use:enhance={() => {
                        return ({ result }) => {
                          if (result.type === 'success') {
                            toast.success('¡Progreso actualizado!');
                          }
                        };
                      }}
                    >
                      <input type="hidden" name="assignmentId" value={mission.id} />
                      <button 
                        disabled={mission.completed}
                        class="relative px-6 h-12 bg-zinc-950 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:hover:bg-zinc-950 disabled:hover:text-zinc-500 overflow-hidden group/btn"
                      >
                        <div class="absolute inset-0 bg-primary-500/10 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500"></div>
                        <span class="relative z-10 flex items-center gap-2">
                          {#if mission.completed}
                            <CheckCircle weight="fill" size={16} class="text-emerald-500" />
                            COMPLETADO
                          {:else}
                            <ArrowsClockwise weight="bold" size={16} class="group-hover/btn:rotate-180 transition-transform duration-700" />
                            VERIFICAR PROGRESO
                          {/if}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>

                {#if mission.completed}
                  <div class="absolute inset-0 pointer-events-none overflow-hidden" in:fade>
                    {#each Array(12) as _, i}
                      <div 
                        class="absolute w-1 h-1 bg-primary-500/40 rounded-full"
                        style="
                          left: {50 + (Math.random() - 0.5) * 40}%; 
                          top: {50 + (Math.random() - 0.5) * 40}%;
                          --rx: {(Math.random() - 0.5) * 120}px;
                          --rd: {Math.random() * 0.5}s;
                          animation: particle {0.8 + Math.random()}s ease-out var(--rd) forwards;
                        "
                      ></div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Announcements for Parents -->

      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Megaphone size={24} weight="duotone" class="text-primary-400" />
            <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">Comunicados Recientes</h3>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          {#each resolvedAnnouncements || [] as ann}
            <div class="bento-card !p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary-500/20 transition-all">
              <div class="flex items-start gap-6">
                <div class="w-12 h-12 bg-zinc-950 border border-white/5 flex flex-col items-center justify-center shrink-0">
                  <span class="text-[8px] font-black text-zinc-600 uppercase">{new Date(ann.createdAt).toLocaleDateString('es', { month: 'short' })}</span>
                  <span class="text-lg font-black text-white">{new Date(ann.createdAt).getDate()}</span>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[8px] font-black px-2 py-0.5 bg-primary-500/10 text-primary-400 uppercase border border-primary-500/20">{ann.priority}</span>
                  </div>
                  <h4 class="text-lg font-outfit font-black text-white uppercase italic tracking-tight">{ann.title}</h4>
                  <p class="text-zinc-500 text-sm line-clamp-1">{ann.content}</p>
                </div>
              </div>
               <button 
                onclick={() => openAnnouncement(ann)}
                class="px-6 h-12 border border-white/5 hover:border-primary-500/50 text-[9px] font-black text-zinc-400 uppercase tracking-widest transition-all">
                Leer comunicado
              </button>
            </div>
          {/each}
          {#if !resolvedAnnouncements?.length}
            <div class="p-12 text-center border border-dashed border-white/10 opacity-50">
              <p class="text-zinc-500 font-bold uppercase tracking-widest italic">No hay comunicados nuevos</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <!-- TEACHER / ADMIN VIEW -->
  <div class="grid grid-cols-1 mb-12 pt-10 items-end">
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
  </div>

  <!-- Quick Actions Grid -->
  <div class="mb-8 lg:mb-12">
    <!-- Mobile Action Grid Header -->
    <div class="lg:hidden mb-4">
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{$t('dashboard.quick_access')}</p>
      <div class="h-0.5 w-12 bg-violet-500 rounded-none"></div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {#each displayedActions as action, i}
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

            {#if action.premium && !($appStore.settings.plan === 'premium' || userRole === 'admin')}
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

  <div class="flex flex-col gap-8 mb-10">
    <div class="space-y-8 w-full">
      

      {#if !isFullyBoarded}
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
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  {/if}

  <!-- Announcement Modal -->
  {#if showAnnouncementModal && selectedAnnouncement}
    <Modal show={showAnnouncementModal} title="Comunicado Oficial" onClose={() => showAnnouncementModal = false}>
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[8px] font-black px-2 py-0.5 bg-primary-500/10 text-primary-400 uppercase border border-primary-500/20">{selectedAnnouncement.priority}</span>
              <span class="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{new Date(selectedAnnouncement.createdAt).toLocaleDateString()}</span>
            </div>
            <h2 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tight">{selectedAnnouncement.title}</h2>
          </div>
          <div class="w-16 h-16 bg-primary-500/10 flex items-center justify-center text-primary-400 shrink-0">
             <Megaphone size={32} weight="duotone" />
          </div>
        </div>

        <div class="prose prose-invert max-w-none">
          <p class="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
            {selectedAnnouncement.content}
          </p>
        </div>

        {#if selectedAnnouncement.attachmentUrl}
          <div class="p-4 bg-zinc-950 border border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/5 flex items-center justify-center">
                <Lightning size={20} class="text-primary-400" />
              </div>
              <div>
                <p class="text-[10px] font-black text-white uppercase tracking-widest">Archivo Adjunto</p>
                <p class="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Documento PDF / Imagen</p>
              </div>
            </div>
            <a href={selectedAnnouncement.attachmentUrl} target="_blank" class="px-4 py-2 bg-primary-500 text-[10px] font-black text-black uppercase tracking-widest hover:bg-primary-400 transition-all">
              Descargar
            </a>
          </div>
        {/if}

        <div class="pt-6 border-t border-white/5 flex justify-end">
          <button 
            onclick={() => showAnnouncementModal = false}
            class="px-8 h-12 bg-zinc-900 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Cerrar comunicado
          </button>
        </div>
      </div>
    </Modal>
  {/if}
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

  @keyframes particle {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--rx), -100px) scale(0);
      opacity: 0;
    }
  }

  :global(.particle-success) {
    animation: particle 1s ease-out forwards;
  }
</style>

