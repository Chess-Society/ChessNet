<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { 
    School, 
    Users, 
    GraduationCap, 
    Target, 
    Trophy,
    CheckCircle,
    BarChart3,
    DollarSign,
    CalendarDays,
    BookHeart,
    Medal,
    GripVertical,
    Settings2,
    Calendar,
    Activity,
    TrendingUp,
    TrendingDown,
    Award,
    Plus,
    Clock,
    Zap
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast'; // Asumiendo que existe o lo crearemos

  // Definición de acciones disponibles (Misma que gh-pages)
  const allActions = [
    { id: 'centers', title: 'Centros Educativos', desc: 'Gestionar centros y ubicaciones', icon: School, color: 'text-blue-500', link: '/panel/centros' },
    { id: 'classes', title: 'Clases', desc: 'Organizar grupos y horarios', icon: GraduationCap, color: 'text-purple-500', link: '/panel/clases' },
    { id: 'students', title: 'Estudiantes', desc: 'Gestionar alumnado e inscripciones', icon: Users, color: 'text-emerald-500', link: '/panel/alumnos' },
    { id: 'skills', title: 'Habilidades', desc: 'Definir temarios y competencias', icon: Target, color: 'text-yellow-500', link: '/panel/habilidades' },
    { id: 'tournaments', title: 'Gestionar Torneos', desc: 'Organizar competiciones locales', icon: Trophy, color: 'text-orange-500', link: '/panel/torneos', premium: true },
    { id: 'attendance', title: 'Control de Asistencia', desc: 'Pasar lista y estadísticas', icon: CheckCircle, color: 'text-pink-500', link: '/panel/asistencia' },
    { id: 'reports', title: 'Informes', desc: 'Reportes y análisis avanzados', icon: BarChart3, color: 'text-cyan-500', link: '/panel/informes', premium: true },
    { id: 'payments', title: 'Sistema de Pagos', desc: 'Gestionar cobros y facturación', icon: DollarSign, color: 'text-teal-500', link: '/panel/pagos', badge: 'BETA', premium: true },
    { id: 'planner', title: 'Planificador', desc: 'Diseñar sesiones y contenido', icon: CalendarDays, color: 'text-indigo-500', link: '/panel/agenda', badge: 'NEW', premium: true },
    { id: 'leads', title: 'CRM / Interesados', desc: 'Gestionar posibles alumnos', icon: BookHeart, color: 'text-pink-500', link: '/panel/contactos', badge: 'NEW', premium: true },
    { id: 'achievements', title: 'Logros', desc: 'Ver progreso y medallas', icon: Trophy, color: 'text-amber-500', link: '/panel/logros' }
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
        icon: Users, 
        color: 'text-emerald-400',
        timestamp: new Date(s.created_at || Date.now()).getTime()
      });
    });

    $appStore.payments.slice(-3).reverse().forEach(p => {
      const student = $appStore.students.find(s => s.id === (p as any).studentId || s.id === p.student_id);
      activities.push({ 
        message: `Pago: ${p.amount}€ - ${student?.name || 'Desconocido'}`, 
        time: 'reciente', 
        icon: DollarSign, 
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
  <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pt-6">
    <div>
      <h1 class="text-3xl font-bold text-white flex items-center gap-2">
        Hola, Profe <span class="animate-pulse">👋</span>
      </h1>
      <p class="text-slate-400 mt-1 text-lg">Aquí tienes el resumen de tu academia hoy.</p>
    </div>
    
    <div class="mt-4 md:mt-0 text-left md:text-right bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
      <p class="text-xs text-slate-400 uppercase font-bold tracking-wider">Hoy es</p>
      <p class="text-xl font-bold text-white capitalize flex items-center gap-2">
        <Clock class="w-5 h-5 text-indigo-400" />
        {todayFormat}
      </p>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div class="mb-10">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <GripVertical class="w-5 h-5 text-indigo-500" /> Accesos Directos
      </h2>
      <button 
        onclick={toggleEditMode}
        class="text-xs flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors {editMode ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'text-slate-400'}"
      >
        <Settings2 class="w-3.5 h-3.5" /> 
        {editMode ? 'Guardar Orden' : 'Personalizar'}
      </button>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {#each displayedActions() as action, i}
        <div 
          draggable={editMode}
          ondragstart={(e) => handleDragStart(e, action.id)}
          ondragover={(e) => handleDragOver(e, action.id)}
          ondragend={handleDragEnd}
          class="relative transition-all duration-200 {draggedId === action.id ? 'scale-105 z-10 opacity-50' : ''}"
        >
          <button 
            onclick={() => !editMode && goto(action.link)}
            class="group flex flex-col items-center justify-center p-4 bg-[#1e293b] hover:bg-slate-800 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 w-full aspect-square md:aspect-auto md:h-32 shadow-lg hover:shadow-xl hover:-translate-y-1 relative {editMode ? 'cursor-move border-dashed border-slate-500' : 'cursor-pointer'} {action.premium && $appStore.settings.plan === 'free' ? 'opacity-75 grayscale-[0.5]' : ''}"
          >
            {#if action.premium && $appStore.settings.plan === 'free'}
               <div class="absolute -top-1 -right-1 bg-slate-900 border border-slate-700 p-1.5 rounded-lg shadow-xl z-20">
                 <Trophy class="w-3 h-3 text-slate-400" />
               </div>
            {/if}
            
            {#if action.badge}
              <span class="absolute top-2 left-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                {action.badge}
              </span>
            {/if}

            <div class="p-3 bg-slate-900/50 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
               <action.icon class="w-6 h-6 {action.color}" />
            </div>
            <span class="text-sm font-semibold text-slate-300 group-hover:text-white text-center leading-tight">
              {action.title}
            </span>

            {#if editMode}
               <div class="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                 <GripVertical class="w-6 h-6 text-white/80" />
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
        <div class="bg-[#1e293b] border-2 border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden group mb-8" in:fly={{y: 20}}>
            <!-- Background Glow -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700"></div>
            
            <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div class="flex-1 space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <Zap class="w-5 h-5 fill-indigo-400" />
                        </div>
                        <h3 class="text-xl font-bold text-white tracking-tight">Checklist de Inicio Rápido</h3>
                    </div>
                    <p class="text-slate-400 text-sm max-w-md">Completa estos pasos para tener tu academia de ajedrez totalmente operativa y lista para tus alumnos.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
                    <!-- Step 1: Centers -->
                    <button 
                      onclick={() => goto('/panel/centros')}
                      class="flex items-center gap-3 p-4 rounded-2xl border transition-all {hasSchools ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-400'}"
                    >
                        <div class="p-2 rounded-lg {hasSchools ? 'bg-emerald-500/20' : 'bg-slate-800'}">
                            {#if hasSchools}
                                <CheckCircle class="w-4 h-4" />
                            {:else}
                                <School class="w-4 h-4" />
                            {/if}
                        </div>
                        <div class="text-left">
                            <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Paso 1</p>
                            <p class="text-xs font-bold whitespace-nowrap">Crear Centro</p>
                        </div>
                    </button>

                    <!-- Step 2: Classes -->
                    <button 
                      onclick={() => goto('/panel/clases')}
                      disabled={!hasSchools}
                      class="flex items-center gap-3 p-4 rounded-2xl border transition-all {!hasSchools ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800' : hasClasses ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-400'}"
                    >
                        <div class="p-2 rounded-lg {hasClasses ? 'bg-emerald-500/20' : 'bg-slate-800'}">
                            {#if hasClasses}
                                <CheckCircle class="w-4 h-4" />
                            {:else}
                                <GraduationCap class="w-4 h-4" />
                            {/if}
                        </div>
                        <div class="text-left">
                            <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Paso 2</p>
                            <p class="text-xs font-bold whitespace-nowrap">Crear Clase</p>
                        </div>
                    </button>

                    <!-- Step 3: Students -->
                    <button 
                      onclick={() => goto('/panel/alumnos')}
                      disabled={!hasClasses}
                      class="flex items-center gap-3 p-4 rounded-2xl border transition-all {!hasClasses ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800' : hasStudents ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-400'}"
                    >
                        <div class="p-2 rounded-lg {hasStudents ? 'bg-emerald-500/20' : 'bg-slate-800'}">
                            {#if hasStudents}
                                <CheckCircle class="w-4 h-4" />
                            {:else}
                                <Users class="w-4 h-4" />
                            {/if}
                        </div>
                        <div class="text-left">
                            <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Paso 3</p>
                            <p class="text-xs font-bold whitespace-nowrap">Añadir Alumno</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      {/if}

      <!-- Stats Cards Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50">
          <p class="text-slate-500 text-xs font-bold uppercase mb-1">Alumnos</p>
          <p class="text-2xl font-bold text-white">{stats.totalStudents}</p>
          <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp class="w-3 h-3" /> Activos
          </p>
        </div>
        
        <div class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50">
          <p class="text-slate-500 text-xs font-bold uppercase mb-1">Ingresos (Mes)</p>
          <p class="text-2xl font-bold text-white">{stats.monthlyRevenue}€</p>
          <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp class="w-3 h-3" /> +15.0%
          </p>
        </div>
        
        <div class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50">
          <p class="text-slate-500 text-xs font-bold uppercase mb-1">Asistencia</p>
          <p class="text-2xl font-bold text-white">{stats.occupancyRate}%</p>
          <p class="text-xs text-blue-400 mt-1">Promedio global</p>
        </div>
        
        <div class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center">
          <p class="text-slate-500 text-xs font-bold uppercase mb-1">Próx. Torneo</p>
          {#if nextTournament}
            <div class="truncate">
                <p class="text-lg font-bold text-white truncate">{nextTournament.name}</p>
                <p class="text-xs text-orange-400 mt-1">En {Math.ceil((new Date(nextTournament.start_date || '').getTime() - Date.now()) / (1000*60*60*24))} días</p>
            </div>
          {:else}
            <p class="text-lg font-bold text-slate-500">—</p>
          {/if}
        </div>
      </div>

      <!-- Real SVG Charts implemented like original -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Chart 1: Ingresos -->
        <div class="bg-[#1e293b] border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 group">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-slate-400 text-sm font-medium">Historial de Ingresos</h3>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-2xl font-bold text-white">{stats.monthlyRevenue}€</span>
              </div>
            </div>
            <div class="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <DollarSign class="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          
          <div class="relative h-[150px] w-full mt-4">
              <svg class="w-full h-full" viewBox="0 0 300 150">
                  <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#10b981" stop-opacity="0.2" />
                          <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                      </linearGradient>
                  </defs>
                  
                  <!-- Grid -->
                  {#each [0, 1, 2, 3] as i}
                    <line x1="20" y1={130 - i * 35} x2="280" y2={130 - i * 35} 
                          class="stroke-slate-700/30" stroke-dasharray="4 4" />
                  {/each}
                  
                  {#if chartData.revenue.some(v => v > 0)}
                     <!-- Path Logic -->
                     {@const max = Math.max(...chartData.revenue, 100) * 1.2}
                     {@const points = chartData.revenue.map((v, i) => `${20 + i * 52},${130 - (v / max) * 110}`).join(' ')}
                     
                     <path d="M 20,130 {points} 280,130" fill="url(#revGrad)" />
                     <path d="M 20,130 {points}" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
                     
                     {#each chartData.revenue as v, i}
                       <circle cx={20 + i * 52} cy={130 - (v / max) * 110} r="3" class="fill-slate-900 stroke-emerald-500 stroke-2" />
                     {/each}
                  {/if}
              </svg>
              <div class="flex justify-between px-2 mt-2 text-[10px] text-slate-500 font-medium">
                  {#each chartData.labels as label}
                    <span>{label}</span>
                  {/each}
              </div>
          </div>
        </div>

        <!-- Chart 2: Estudiantes (Simplificado) -->
        <div class="bg-[#1e293b] border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 group">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-slate-400 text-sm font-medium">Fidelización Alumnos</h3>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-white">{stats.totalStudents}</span>
                  <span class="text-blue-400 text-xs font-medium">total acumulado</span>
                </div>
              </div>
              <div class="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Users class="w-5 h-5 text-blue-500" />
              </div>
            </div>
            
            <div class="relative h-[150px] w-full mt-4">
                <div class="flex items-end justify-between h-[120px] px-2 gap-4">
                    {#each [40, 60, 50, 80, 70, 95] as height, i}
                       <div class="flex-1 flex flex-col items-center">
                           <div class="w-full bg-blue-500/10 group-hover:bg-blue-500/20 rounded-t-lg transition-all relative overflow-hidden" 
                                style="height: {height}%">
                               <div class="absolute bottom-0 left-0 right-0 bg-blue-500/40" style="height: 40%"></div>
                           </div>
                           <span class="text-[10px] text-slate-600 mt-2">{chartData.labels[i]}</span>
                       </div>
                    {/each}
                </div>
            </div>
        </div>
      </div>
    </div>
    
    <!-- Sidebar -->
    <div class="space-y-6">
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <Activity class="w-5 h-5 text-blue-500" /> Actividad Reciente
      </h3>
      
      <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {#if recentActivity().length === 0}
          <div class="p-8 text-center text-slate-500 text-sm">No hay actividad reciente.</div>
        {:else}
          <div class="divide-y divide-slate-800">
            {#each recentActivity() as activity}
              <div class="p-4 flex gap-4 hover:bg-slate-800/30 transition-colors rounded-xl">
                 <div class="mt-1">
                   <div class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border-slate-700">
                     <activity.icon class="w-4 h-4 {activity.color}" />
                   </div>
                 </div>
                 <div>
                   <p class="text-sm text-slate-300 font-medium leading-snug">{activity.message}</p>
                   <p class="text-xs text-slate-500 mt-1">{activity.time}</p>
                 </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- Achievement Card -->
      <div class="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30 text-center relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award class="w-24 h-24 text-white" />
        </div>
        <Award class="w-10 h-10 text-yellow-400 mx-auto mb-3 relative z-10" />
        <h4 class="text-white font-bold mb-1 relative z-10">¿Nuevo Logro?</h4>
        <p class="text-sm text-indigo-200 mb-4 relative z-10">Revisa si has subido de nivel como entrenador.</p>
        <button onclick={() => goto('/panel/logros')} class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all w-full relative z-10">
            Ver Mis Logros
        </button>
      </div>

      <!-- Support Card -->
      <div class="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
          <p class="text-xs text-slate-400 mb-2">¿Necesitas ayuda con ChessNet?</p>
          <a href="mailto:soporte@chessnet.app" class="text-indigo-400 text-sm font-bold hover:text-indigo-300">Contactar Soporte →</a>
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
