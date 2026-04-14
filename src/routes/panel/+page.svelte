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

  // Definición de acciones disponibles
  const allActions = [
    { id: 'centers', title: 'Centros', desc: 'Gestionar sedes', icon: Buildings, color: 'text-blue-400', link: '/panel/centros' },
    { id: 'classes', title: 'Clases', desc: 'Grupos y horarios', icon: GraduationCap, color: 'text-primary-400', link: '/panel/clases' },
    { id: 'students', title: 'Alumnos', desc: 'Listado y fichas', icon: UsersFour, color: 'text-violet-400', link: '/panel/alumnos' },
    { id: 'skills', title: 'Habilidades', desc: 'Temarios y progreso', icon: Target, color: 'text-yellow-400', link: '/panel/habilidades' },
    { id: 'tournaments', title: 'Torneos', desc: 'Organizar eventos', icon: Trophy, color: 'text-orange-400', link: '/panel/torneos', premium: true },
    { id: 'attendance', title: 'Asistencia', desc: 'Control de falta', icon: CheckCircle, color: 'text-pink-400', link: '/panel/asistencia' },
    { id: 'reports', title: 'Informes', desc: 'Análisis de datos', icon: ChartBar, color: 'text-cyan-400', link: '/panel/informes', premium: true },
    { id: 'payments', title: 'Cobros', desc: 'Facturación y pagos', icon: CreditCard, color: 'text-teal-400', link: '/panel/pagos', badge: 'BETA', premium: true },
    { id: 'planner', title: 'Planificador', desc: 'Agenda de sesiones', icon: CalendarBlank, color: 'text-indigo-400', link: '/panel/agenda', badge: 'NEW', premium: true },
    { id: 'leads', title: 'Mensajes', desc: 'Comunicación', icon: ChatCircleDots, color: 'text-pink-400', link: '/panel/comunicacion', badge: 'NEW', premium: true },
    { id: 'achievements', title: 'Premios', desc: 'Medallas y logros', icon: Medal, color: 'text-amber-400', link: '/panel/logros' }
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
  const isFullyBoarded = $derived(hasSchools && hasClasses && hasStudents);

  // Actividad reciente dinámica
  let recentActivity = $derived(() => {
    const activities: any[] = [];
    
    $appStore.students.slice(-3).reverse().forEach(s => {
      activities.push({ 
        message: `Nuevo estudiante: ${s.name}`, 
        time: 'reciente', 
        icon: UsersFour, 
        color: 'text-violet-400',
        timestamp: new Date(s.created_at || Date.now()).getTime()
      });
    });

    $appStore.payments.slice(-3).reverse().forEach(p => {
      const student = $appStore.students.find(s => s.id === (p as any).studentId || s.id === p.student_id);
      activities.push({ 
        message: `Pago: ${p.amount}€ - ${student?.name || 'Desconocido'}`, 
        time: 'reciente', 
        icon: CurrencyEur, 
        color: 'text-teal-400',
        timestamp: new Date((p as any).date || p.paid_date || p.due_date || Date.now()).getTime()
      });
    });

    return activities.sort((a,b) => b.timestamp - a.timestamp).slice(0, 5);
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

  const todayFormat = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  // Datos para gráficos (simulados con la lógica del original)
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
      return d.toLocaleDateString('es-ES', { month: 'short' }).charAt(0).toUpperCase() + d.toLocaleDateString('es-ES', { month: 'short' }).slice(1);
    })
  });

</script>

<svelte:head>
  <title>ChessNet - Dashboard</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <!-- Hero Section -->
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pt-8 gap-6">
    <div class="space-y-1">
      <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tighter font-display">
        Hola, Profe <span class="text-primary-400">👋</span>
      </h1>
      <p class="text-surface-400 text-lg font-medium">Resumen general de tu academia.</p>
    </div>
    
    <div class="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
      <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
        <Clock weight="duotone" size={24} />
      </div>
      <div class="pr-6">
        <p class="text-[10px] text-surface-500 uppercase font-black tracking-widest leading-none mb-1">Hoy es</p>
        <p class="text-lg font-bold text-white capitalize">{todayFormat}</p>
      </div>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div class="mb-12">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
        <DotsSixVertical weight="duotone" class="text-primary-500" /> Accesos Directos
      </h2>
      <button 
        onclick={toggleEditMode}
        class="text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 hover:bg-white/5 transition-all {editMode ? 'bg-primary-500 text-white border-primary-500 shadow-violet-flare' : 'text-surface-400'}"
      >
        <GearSix weight="duotone" size={16} /> 
        {editMode ? 'Guardar' : 'Personalizar'}
      </button>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
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
              if (action.premium && $appStore.settings.plan === 'free') {
                goto('/precios');
              } else {
                goto(action.link);
              }
            }}
            class="bento-card group w-full flex flex-col items-start p-5 h-40 text-left {editMode ? 'cursor-move border-dashed border-white/20' : ''} {action.premium && $appStore.settings.plan === 'free' ? 'opacity-80' : ''}"
          >
             {#if action.premium && $appStore.settings.plan === 'free'}
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
                        <h3 class="text-2xl font-extrabold text-white tracking-tight font-display">Inicio Rápido</h3>
                    </div>
                    <p class="text-surface-400 text-base font-medium max-w-sm">Completa estos pasos para tener tu academia lista.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                    <!-- Step 1: Centers -->
                    <button 
                      onclick={() => goto('/panel/centros')}
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
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Paso 1</p>
                            <p class="text-xs font-bold whitespace-nowrap">Crear Centro</p>
                        </div>
                    </button>

                    <!-- Step 2: Classes -->
                    <button 
                      onclick={() => goto('/panel/clases')}
                      disabled={!hasSchools}
                      class="flex flex-col items-start gap-4 p-5 rounded-24 border transition-all duration-300 {!hasSchools ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5' : hasClasses ? 'bg-violet-500/5 border-violet-500/20 text-violet-400' : 'bg-white/5 border-white/5 hover:border-primary-500/50 text-surface-400'}"
                    >
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center {hasClasses ? 'bg-violet-500/20' : 'bg-white/5'}">
                            {#if hasClasses}
                                <CheckCircle weight="duotone" size={20} />
                            {:else}
                                <GraduationCap weight="duotone" size={20} />
                            {/if}
                        </div>
                        <div>
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Paso 2</p>
                            <p class="text-xs font-bold whitespace-nowrap">Crear Clase</p>
                        </div>
                    </button>

                    <!-- Step 3: Students -->
                    <button 
                      onclick={() => goto('/panel/alumnos')}
                      disabled={!hasClasses}
                      class="flex flex-col items-start gap-4 p-5 rounded-24 border transition-all duration-300 {!hasClasses ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5' : hasStudents ? 'bg-violet-500/5 border-violet-500/20 text-violet-400' : 'bg-white/5 border-white/5 hover:border-primary-500/50 text-surface-400'}"
                    >
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center {hasStudents ? 'bg-violet-500/20' : 'bg-white/5'}">
                            {#if hasStudents}
                                <CheckCircle weight="duotone" size={20} />
                            {:else}
                                <UsersFour weight="duotone" size={20} />
                            {/if}
                        </div>
                        <div>
                            <p class="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Paso 3</p>
                            <p class="text-xs font-bold whitespace-nowrap">Añadir Alumno</p>
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
              <UsersFour weight="duotone" size={14} class="text-violet-400" /> Estudiantes
            </p>
            <div class="flex items-baseline gap-2">
              <p class="text-5xl font-extrabold text-white tracking-tighter font-display">{stats.totalStudents}</p>
            </div>
            <p class="text-[10px] font-bold text-violet-400 mt-4 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendUp weight="bold" size={12} /> Activos
            </p>
          </div>
        </div>
        
        <div class="bento-card group">
          <div class="p-6">
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <CurrencyEur weight="duotone" size={14} class="text-primary-400" /> Ingresos
            </p>
            <div class="flex items-baseline gap-1">
              <p class="text-5xl font-extrabold text-white tracking-tighter font-display">{stats.monthlyRevenue}</p>
              <span class="text-2xl font-bold text-surface-600 tracking-tighter font-display">€</span>
            </div>
            <p class="text-[10px] font-bold text-primary-400 mt-4 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendUp weight="bold" size={12} /> En curso
            </p>
          </div>
        </div>
        
        <div class="bento-card group">
          <div class="p-6">
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Pulse weight="duotone" size={14} class="text-blue-400" /> Asistencia
            </p>
            <div class="flex items-baseline gap-1">
              <p class="text-5xl font-extrabold text-white tracking-tighter font-display">{stats.occupancyRate}</p>
              <span class="text-2xl font-bold text-surface-600 tracking-tighter font-display">%</span>
            </div>
            <p class="text-[10px] font-bold text-surface-500 mt-4 uppercase tracking-wider">Promedio Mes</p>
          </div>
        </div>
        
        <div class="bento-card group overflow-hidden">
          <div class="p-6">
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Trophy weight="duotone" size={14} class="text-orange-400" /> Próximo
            </p>
            {#if nextTournament}
              <div class="h-10 mt-2">
                  <p class="text-xl font-bold text-white truncate font-display">{nextTournament.name}</p>
                  <p class="text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1">En {Math.ceil((new Date(nextTournament.start_date || '').getTime() - Date.now()) / (1000*60*60*24))} días</p>
              </div>
            {:else}
              <p class="text-5xl font-extrabold text-surface-700 tracking-tighter font-display">—</p>
              <p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest mt-4">Sin torneos</p>
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
                <h3 class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Evolución de Ingresos</h3>
                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-3xl font-extrabold text-white tracking-tighter font-display">{stats.monthlyRevenue}€</span>
                  <span class="text-[10px] font-bold text-violet-400 uppercase tracking-widest">+12% este mes</span>
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
                <h3 class="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Fidelización Alumnos</h3>
                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-3xl font-extrabold text-white tracking-tighter font-display">{stats.totalStudents}</span>
                  <span class="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Alumnos totales</span>
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
        <Pulse weight="duotone" class="text-primary-500" /> Actividad
      </h3>
      
      <div class="bento-card max-h-[500px] overflow-y-auto custom-scrollbar p-2">
        {#if recentActivity().length === 0}
          <div class="p-12 text-center">
            <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-surface-600">
               <Pulse weight="duotone" size={24} />
            </div>
            <p class="text-surface-500 text-sm font-medium">Sin actividad reciente.</p>
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
        
        <h4 class="text-xl font-extrabold text-white mb-2 relative z-10 font-display">¡Sigue creciendo!</h4>
        <p class="text-sm text-surface-400 mb-8 relative z-10 font-medium">Desbloquea nuevas insignias gestionando tu academia.</p>
        
        <button onclick={() => goto('/panel/logros')} class="btn-pill bg-white text-black w-full relative z-10 font-bold text-sm tracking-tight active:scale-95 transition-transform py-4">
            Ver Mis Logros
        </button>
      </div>

      <!-- Support Card -->
      <div class="bento-card !p-6 flex items-center justify-between group">
          <div>
            <p class="text-[10px] text-surface-500 font-black uppercase tracking-widest leading-none mb-1">¿Necesitas ayuda?</p>
            <p class="text-sm font-bold text-white">Centro de Soporte</p>
          </div>
          <a href="mailto:soporte@chessnet.app" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-surface-400 hover:bg-primary-500 hover:text-white transition-all shadow-soft">
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
