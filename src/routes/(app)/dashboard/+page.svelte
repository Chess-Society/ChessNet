<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { 
    School, 
    Users, 
    GraduationCap, 
    Target, 
    Trophy,
    ChevronRight,
    TrendingUp,
    BookOpen,
    UserCheck,
    BarChart3,
    DollarSign,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    UserPlus,
    Plus,
    Eye,
    MapPin,
    Activity,
    Bell,
    Zap,
    ArrowUp,
    ArrowDown,
    Star,
    Settings,
    Crown,
    ArrowRight,
    Sparkles,
    LayoutDashboard,
    ArrowUpRight
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let user = $derived(data.user);
  let dashboardStats = $derived((data.dashboardStats || {}) as any);
  let activeCentersCount = $derived(data.centersWithStats?.length || 0);
  let upcomingSessionsToday = $derived((data.upcomingSessionsToday || []) as any[]);
  let recentActivity = $derived((data.recentActivity || []) as any[]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getActivityIcon = (iconName: string): any => {
    switch (iconName) {
      case 'user-plus': return UserPlus;
      case 'check-circle': return CheckCircle;
      case 'plus': return Plus;
      case 'alert-triangle': return AlertTriangle;
      default: return Activity;
    }
  };

  const getActivityTheme = (color: string) => {
    switch (color) {
      case 'green': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'blue': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'purple': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'yellow': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-surface-400 bg-surface-500/10 border-surface-500/20';
    }
  };
</script>

<svelte:head>
  <title>Dashboard | ChessNet</title>
</svelte:head>

<div class="space-y-12 animate-fade-in pb-20" in:fade>
  <!-- Welcome Section -->
  <div class="flex flex-col xl:flex-row gap-8 items-start justify-between">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">
          <LayoutDashboard class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Panel de Control</h1>
          <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Estatus Operativo del Ecosistema</p>
        </div>
      </div>
      <div class="flex items-center gap-3 glass-panel px-5 py-3 rounded-2xl max-w-fit">
        <Sparkles class="w-4 h-4 text-primary-400" />
        <p class="text-[11px] font-black text-surface-200 uppercase tracking-widest">
          HOLA, <span class="text-white">{user?.email?.split('@')[0] || 'MAESTRO'}</span>. <span class="text-surface-500">BIENVENIDO DE VUELTA.</span>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4 w-full xl:w-auto">
      <div class="flex-1 xl:flex-none bg-surface-950/50 border border-surface-900 px-6 py-4 rounded-2xl flex items-center justify-center gap-4 backdrop-blur-xl">
        <Calendar class="w-5 h-5 text-primary-400" />
        <div class="text-[10px] font-black text-white uppercase tracking-widest">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="glass-panel p-8 border-t-4 border-primary-500 relative overflow-hidden group hover:border-primary-400 transition-all">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <School class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Centros Operativos</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{dashboardStats.totalCenters || 0}</p>
          <div class="flex items-center gap-1 text-[10px] font-black text-primary-400 uppercase mb-0.5">
             <ArrowUp class="w-3 h-3" />
             {dashboardStats.newClassesThisMonth || 0} ESTE MES
          </div>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-blue-500 relative overflow-hidden group hover:border-blue-400 transition-all">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Users class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Comunidad Estudiantil</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{dashboardStats.totalStudents || 0}</p>
          <div class="flex items-center gap-1 text-[10px] font-black text-blue-400 uppercase mb-0.5">
             <ArrowUp class="w-3 h-3" />
             {dashboardStats.newStudentsThisWeek || 0} SEMANA
          </div>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-orange-500 relative overflow-hidden group hover:border-orange-400 transition-all">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Zap class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Ocupación Media</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{dashboardStats.occupancyRate || 0}%</p>
          <p class="text-[10px] font-black text-surface-600 uppercase mb-0.5">{dashboardStats.currentOccupancy || 0} PLAZAS</p>
       </div>
       <div class="mt-4 h-1.5 w-full bg-surface-950 rounded-full border border-surface-900 overflow-hidden">
          <div class="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" style="width: {dashboardStats.occupancyRate || 0}%"></div>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-purple-500 relative overflow-hidden group hover:border-purple-400 transition-all">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <DollarSign class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Ingresos Consolidados</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter leading-none">{formatCurrency(dashboardStats.monthlyRevenue || 0)}</p>
          <p class="text-[9px] font-black text-purple-400 uppercase mb-0.5 whitespace-nowrap">MES ACTUAL</p>
       </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Upcoming Sessions -->
    <div class="lg:col-span-2 space-y-6">
      <div class="flex items-center justify-between px-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-surface-950 border border-surface-900 rounded-xl flex items-center justify-center text-primary-400">
            <Clock class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-black text-white uppercase tracking-tighter leading-none">Sesiones del Día</h2>
        </div>
        <span class="bg-surface-900 border border-surface-800 text-surface-400 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
          {upcomingSessionsToday.length} ACTIVAS
        </span>
      </div>

      {#if upcomingSessionsToday.length === 0}
        <div class="glass-panel p-20 text-center space-y-6">
          <div class="w-20 h-20 bg-surface-950 border border-surface-900 rounded-3xl flex items-center justify-center mx-auto text-surface-800">
            <Calendar class="w-10 h-10" />
          </div>
          <div>
            <p class="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]">No hay sesiones programadas</p>
            <p class="text-[9px] font-bold text-surface-800 uppercase tracking-widest mt-2">Todo el personal está libre por hoy.</p>
          </div>
        </div>
      {:else}
        <div class="space-y-4">
          {#each upcomingSessionsToday as session, i}
            <div 
              class="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary-500/30 transition-all border-l-4 border-primary-500"
              in:fly={{ y: 20, delay: i * 50 }}
            >
              <div class="flex items-center gap-6 text-center md:text-left">
                <div class="w-16 h-16 bg-surface-950 border border-surface-900 rounded-2xl flex items-center justify-center text-primary-400 shadow-xl group-hover:scale-105 transition-transform">
                  <GraduationCap class="w-8 h-8" />
                </div>
                <div>
                  <h3 class="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors leading-none">{session.className}</h3>
                  <div class="flex items-center justify-center md:justify-start gap-4 mt-2.5 text-surface-500 text-[10px] font-bold uppercase tracking-widest">
                    <span class="flex items-center gap-1.5">
                      <MapPin class="w-3.5 h-3.5" />
                      {session.schoolName}
                    </span>
                    <span class="w-1 h-1 rounded-full bg-surface-800"></span>
                    <span>AULA {session.room}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-8 w-full md:w-auto justify-center md:justify-end">
                <div class="text-right">
                  <p class="text-2xl font-black text-white tracking-tighter leading-none">{session.time}</p>
                  <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mt-1">DURACIÓN: {session.duration}</p>
                </div>
                
                {#if !session.attendanceTaken}
                  <button 
                    onclick={() => goto(`/classes/${session.id}/attendance`)}
                    class="bg-primary-500 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center gap-2 group/btn"
                  >
                    <UserCheck class="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    PASAR LISTA
                  </button>
                {:else}
                  <div class="flex items-center gap-2 text-primary-400 font-black bg-primary-500/10 px-5 py-3 rounded-xl border border-primary-500/20 text-[9px] tracking-widest uppercase">
                    <CheckCircle class="w-4 h-4" />
                    ASISTENCIA REGISTRADA
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Recent Activity Timeline -->
    <div class="space-y-6">
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 bg-surface-950 border border-surface-900 rounded-xl flex items-center justify-center text-accent-400">
          <Activity class="w-5 h-5" />
        </div>
        <h2 class="text-lg font-black text-white uppercase tracking-tighter leading-none">Actividad</h2>
      </div>

      <div class="glass-panel p-8 relative overflow-hidden min-h-[500px]">
        <div class="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Bell class="w-32 h-32" />
        </div>
        
        <div class="space-y-10 relative z-10">
          {#each recentActivity as activity, i}
            {@const ActivityIcon = getActivityIcon(activity.icon)}
            <div class="flex items-start gap-5 group relative" in:fly={{ x: 20, delay: i * 50 }}>
              {#if i < recentActivity.length - 1}
                <div class="absolute left-6 top-12 w-0.5 h-10 bg-surface-900"></div>
              {/if}
              
              <div class={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all flex-shrink-0 group-hover:scale-110 ${getActivityTheme(activity.color)} shadow-xl`}>
                <ActivityIcon class="w-5 h-5" />
              </div>
              
              <div class="flex-1 min-w-0 pt-1">
                <p class="text-[11px] font-bold text-surface-200 leading-relaxed uppercase tracking-tight group-hover:text-white transition-colors">{activity.message}</p>
                <div class="flex items-center gap-2 mt-2 text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">
                  <Clock class="w-3 h-3" />
                  {activity.timestamp}
                </div>
              </div>
            </div>
          {/each}
        </div>

        <div class="mt-12 pt-8 border-t border-surface-900 flex justify-center">
          <button class="text-[9px] font-black text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-[0.3em] flex items-center gap-3 group">
            Ver Historial Completo
            <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div class="space-y-8">
    <div class="flex items-center gap-4 px-2">
       <div class="w-1.5 h-8 bg-primary-500 rounded-full"></div>
       <h2 class="text-2xl font-black text-white uppercase tracking-tighter">Accesos Directos</h2>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {#each [
        { label: 'Centros', path: '/schools', icon: School, color: 'primary' },
        { label: 'Estudiantes', path: '/students', icon: Users, color: 'blue' },
        { label: 'Clases', path: '/classes', icon: GraduationCap, color: 'purple' },
        { label: 'Torneos', path: '/tournaments', icon: Trophy, color: 'orange' },
        { label: 'Reportes', path: '/reports', icon: BarChart3, color: 'emerald' }
      ] as action}
        <button 
          onclick={() => goto(action.path)}
          class="glass-panel p-8 text-center group hover:bg-surface-950 transition-all border-b-2 border-transparent hover:border-primary-500/50 relative overflow-hidden"
        >
          <div class="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight class="w-6 h-6 text-primary-400" />
          </div>
          <div class={`w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-surface-950 border border-surface-900 group-hover:border-primary-500/30 group-hover:bg-primary-500/5 transition-all shadow-xl`}>
             <action.icon class="w-6 h-6 text-primary-400 group-hover:scale-110 transition-transform" />
          </div>
          <p class="text-[10px] font-black text-white uppercase tracking-widest leading-none">{action.label}</p>
        </button>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  /* PostCSS active for standard compliance */
</style>