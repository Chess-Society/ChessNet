<script lang="ts">
  import { onMount } from 'svelte';
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
    Crown
  } from 'lucide-svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let user = data.user;
  let dashboardStats = data.dashboardStats || {};
  let centersWithStats = data.centersWithStats || [];
  let featuredClasses = data.featuredClasses || [];
  let recentActivity = data.recentActivity || [];
  let upcomingSessionsToday = data.upcomingSessionsToday || [];

  onMount(() => {
    console.log('✅ Enhanced Dashboard loaded - User:', user?.email || 'none');
    console.log('📊 Dashboard stats:', dashboardStats);
  });

  const manageSchools = () => {
    goto('/schools');
  };

  const manageStudents = () => {
    goto('/students');
  };

  const manageClasses = () => {
    goto('/classes');
  };

  const manageSkills = () => {
    goto('/skills');
  };

  const manageTournaments = () => {
    goto('/tournaments');
  };

  const upgradeAccount = () => {
    goto('/upgrade');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'danger': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-slate-600 bg-slate-700/50';
    }
  };

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-plus': return UserPlus;
      case 'check-circle': return CheckCircle;
      case 'plus': return Plus;
      case 'alert-triangle': return AlertTriangle;
      default: return Activity;
    }
  };

  const getActivityColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-400';
      case 'blue': return 'text-blue-400';
      case 'purple': return 'text-purple-400';
      case 'yellow': return 'text-yellow-400';
      case 'red': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-400';
    if (rate >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 85) return 'text-green-400';
    if (rate >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };
</script>

<svelte:head>
  <title>Dashboard - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <!-- Header mejorado -->
  <header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
    <div class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white">Dashboard</h1>
          <p class="text-slate-400 mt-1">Bienvenido de vuelta, {user?.email || 'Usuario'}</p>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Alertas -->
          {#if dashboardStats.lowAttendanceClasses > 0}
            <div class="flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
              <AlertTriangle class="w-4 h-4 text-yellow-400" />
              <span class="text-sm text-yellow-300">{dashboardStats.lowAttendanceClasses} alerta(s)</span>
            </div>
          {/if}
          
          <div class="text-right">
            <p class="text-sm text-slate-400">Hoy</p>
            <p class="font-semibold text-white">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <!-- Métricas principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Centros -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Centros Educativos</p>
            <p class="text-3xl font-bold text-white">{dashboardStats.totalCenters || 0}</p>
            <p class="text-xs text-green-400 mt-1">
              <ArrowUp class="w-3 h-3 inline mr-1" />
              +{dashboardStats.newClassesThisMonth || 0} este mes
            </p>
          </div>
          <div class="p-3 bg-blue-500/20 rounded-lg">
            <School class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <!-- Total Estudiantes -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Estudiantes Activos</p>
            <p class="text-3xl font-bold text-white">{dashboardStats.totalStudents || 0}</p>
            <p class="text-xs text-green-400 mt-1">
              <ArrowUp class="w-3 h-3 inline mr-1" />
              +{dashboardStats.newStudentsThisWeek || 0} esta semana
            </p>
          </div>
          <div class="p-3 bg-green-500/20 rounded-lg">
            <Users class="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <!-- Ocupación Global -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Ocupación Global</p>
            <p class={`text-3xl font-bold ${getOccupancyColor(dashboardStats.occupancyRate || 0)}`}>
              {dashboardStats.occupancyRate || 0}%
            </p>
            <p class="text-xs text-slate-400 mt-1">
              {dashboardStats.currentOccupancy || 0}/{dashboardStats.totalCapacity || 0} plazas
            </p>
          </div>
          <div class="p-3 bg-purple-500/20 rounded-lg">
            <TrendingUp class="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      <!-- Ingresos Mensuales -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Ingresos Mensuales</p>
            <p class="text-3xl font-bold text-white">{formatCurrency(dashboardStats.monthlyRevenue || 0)}</p>
            <p class="text-xs text-slate-400 mt-1">
              Promedio {formatCurrency(dashboardStats.averageClassPrice || 0)}/clase
            </p>
          </div>
          <div class="p-3 bg-yellow-500/20 rounded-lg">
            <DollarSign class="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Fila principal: Sesiones de hoy + Actividad reciente -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Próximas sesiones hoy -->
      <div class="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-white">Sesiones de Hoy</h2>
          <div class="flex items-center space-x-2">
            <Clock class="w-4 h-4 text-slate-400" />
            <span class="text-sm text-slate-400">{upcomingSessionsToday.length} programadas</span>
          </div>
        </div>

        {#if upcomingSessionsToday.length === 0}
          <div class="text-center py-8">
            <Calendar class="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p class="text-slate-400">No hay clases programadas para hoy</p>
          </div>
        {:else}
          <div class="space-y-4">
            {#each upcomingSessionsToday as session}
              <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
                <div class="flex items-center space-x-4">
                  <div class="p-2 bg-blue-500/20 rounded-lg">
                    <GraduationCap class="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 class="font-medium text-white">{session.className}</h3>
                    <p class="text-sm text-slate-400">
                      {session.schoolName} • {session.room}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-4">
                  <div class="text-right">
                    <p class="font-medium text-white">{session.time}</p>
                    <p class="text-xs text-slate-400">{session.duration} • {session.students} estudiantes</p>
                  </div>
                  
                  {#if !session.attendanceTaken}
                    <button 
                      on:click={() => goto(`/classes/${session.id}/attendance`)}
                      class="btn-primary text-sm"
                    >
                      <UserCheck class="w-4 h-4 mr-1" />
                      Pasar Lista
                    </button>
                  {:else}
                    <div class="flex items-center space-x-1 text-green-400">
                      <CheckCircle class="w-4 h-4" />
                      <span class="text-xs">Lista pasada</span>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Actividad reciente -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-white">Actividad Reciente</h2>
          <Activity class="w-5 h-5 text-slate-400" />
        </div>

        <div class="space-y-4">
          {#each recentActivity as activity}
            <div class="flex items-start space-x-3">
              <div class={`p-2 rounded-lg ${activity.color === 'green' ? 'bg-green-500/20' : activity.color === 'blue' ? 'bg-blue-500/20' : activity.color === 'purple' ? 'bg-purple-500/20' : activity.color === 'yellow' ? 'bg-yellow-500/20' : 'bg-slate-700/50'}`}>
                <svelte:component this={getActivityIcon(activity.icon)} class={`w-4 h-4 ${getActivityColor(activity.color)}`} />
              </div>
              <div class="flex-1">
                <p class="text-sm text-slate-300 leading-relaxed">{activity.message}</p>
                <p class="text-xs text-slate-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Centros destacados -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-white">Rendimiento por Centro</h2>
          <button on:click={manageSchools} class="text-blue-400 hover:text-blue-300 text-sm">
            Ver todos
          </button>
        </div>

        <div class="space-y-4">
          {#each centersWithStats as center}
            <button 
              on:click={() => goto(`/schools/${center.id}`)}
              class="w-full text-left p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-white">{center.name}</h3>
                  <p class="text-sm text-slate-400">{center.city} • {center.totalClasses} clases</p>
                </div>
                <div class="text-right">
                  <div class="flex items-center space-x-2">
                    <span class={`text-sm font-medium ${getOccupancyColor(center.occupancyRate)}`}>
                      {center.occupancyRate}%
                    </span>
                    <ChevronRight class="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
              
              <div class="mt-3 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span class="text-slate-400">Estudiantes:</span>
                  <span class="text-white ml-1">{center.totalStudents}</span>
                </div>
                <div>
                  <span class="text-slate-400">Asistencia:</span>
                  <span class={`ml-1 ${getAttendanceColor(center.attendanceRate)}`}>{center.attendanceRate}%</span>
                </div>
                <div>
                  <span class="text-slate-400">Ingresos:</span>
                  <span class="text-white ml-1">{formatCurrency(center.monthlyRevenue)}</span>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Clases destacadas -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-white">Estado de las Clases</h2>
          <button on:click={manageClasses} class="text-blue-400 hover:text-blue-300 text-sm">
            Ver todas
          </button>
        </div>

        <div class="space-y-4">
          {#each featuredClasses as classItem}
            <button 
              on:click={() => goto(`/classes/${classItem.id}`)}
              class={`w-full text-left p-4 rounded-lg border transition-colors ${getStatusColor(classItem.status)}`}
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-white">{classItem.name}</h3>
                  <p class="text-sm text-slate-400">{classItem.schoolName}</p>
                </div>
                <div class="text-right">
                  {#if classItem.status === 'warning'}
                    <AlertTriangle class="w-5 h-5 text-yellow-400" />
                  {:else}
                    <CheckCircle class="w-5 h-5 text-green-400" />
                  {/if}
                </div>
              </div>
              
              <div class="mt-3 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span class="text-slate-400">Ocupación:</span>
                  <span class={`ml-1 ${getOccupancyColor(classItem.occupancyRate)}`}>
                    {classItem.students}/{classItem.capacity} ({classItem.occupancyRate}%)
                  </span>
                </div>
                <div>
                  <span class="text-slate-400">Asistencia:</span>
                  <span class={`ml-1 ${getAttendanceColor(classItem.attendanceRate)}`}>{classItem.attendanceRate}%</span>
                </div>
              </div>

              <div class="mt-2 text-xs text-slate-500">
                Próxima sesión: {new Date(classItem.nextSession).toLocaleDateString('es-ES')}
              </div>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Acciones rápidas mejoradas -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h2 class="text-xl font-semibold text-white mb-6">Acciones Rápidas</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          on:click={manageSchools}
          class="group p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all duration-200 text-left"
        >
          <div class="flex items-center justify-between mb-4">
            <School class="w-8 h-8 text-blue-400" />
            <ChevronRight class="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-blue-300 mb-2">Centros Educativos</h3>
          <p class="text-sm text-blue-400/80">Gestionar centros y ubicaciones</p>
        </button>

        <button 
          on:click={manageStudents}
          class="group p-6 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all duration-200 text-left"
        >
          <div class="flex items-center justify-between mb-4">
            <Users class="w-8 h-8 text-green-400" />
            <ChevronRight class="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-green-300 mb-2">Estudiantes</h3>
          <p class="text-sm text-green-400/80">Gestionar alumnado e inscripciones</p>
        </button>

        <button 
          on:click={manageClasses}
          class="group p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all duration-200 text-left"
        >
          <div class="flex items-center justify-between mb-4">
            <GraduationCap class="w-8 h-8 text-purple-400" />
            <ChevronRight class="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-purple-300 mb-2">Clases</h3>
          <p class="text-sm text-purple-400/80">Organizar grupos y horarios</p>
        </button>

        <button 
          on:click={manageSkills}
          class="group p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 text-left"
        >
          <div class="flex items-center justify-between mb-4">
            <Target class="w-8 h-8 text-yellow-400" />
            <ChevronRight class="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-yellow-300 mb-2">Habilidades</h3>
          <p class="text-sm text-yellow-400/80">Definir temarios y competencias</p>
        </button>

        <button 
          on:click={manageTournaments}
          class="group p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all duration-200 text-left"
        >
          <div class="flex items-center justify-between mb-4">
            <Trophy class="w-8 h-8 text-orange-400" />
            <ChevronRight class="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-orange-300 mb-2">Gestionar Torneos</h3>
          <p class="text-sm text-orange-400/80">Organizar competiciones locales</p>
        </button>

        <button 
          on:click={() => goto('/attendance')}
          class="group p-6 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all duration-200 text-left"
        >
          <div class="flex items-center justify-between mb-4">
            <UserCheck class="w-8 h-8 text-red-400" />
            <ChevronRight class="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-red-300 mb-2">Control de Asistencia</h3>
          <p class="text-sm text-red-400/80">Pasar lista y estadísticas</p>
        </button>

        <button 
          on:click={() => goto('/reports')}
          class="group p-6 bg-teal-500/10 border border-teal-500/20 rounded-lg hover:bg-teal-500/20 transition-all duration-200 text-left"
        >
          <div class="flex items-center justify-between mb-4">
            <BarChart3 class="w-8 h-8 text-teal-400" />
            <ChevronRight class="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-teal-300 mb-2">Informes</h3>
          <p class="text-sm text-teal-400/80">Reportes y análisis avanzados</p>
        </button>

        <button 
          on:click={() => goto('/payments')}
          class="group p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all duration-200 text-left relative"
        >
          <div class="absolute top-2 right-2">
            <div class="bg-yellow-500 text-slate-900 text-xs px-2 py-1 rounded-full font-medium">
              BETA
            </div>
          </div>
          <div class="flex items-center justify-between mb-4">
            <DollarSign class="w-8 h-8 text-emerald-400" />
            <ChevronRight class="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-emerald-300 mb-2">Sistema de Pagos</h3>
          <p class="text-sm text-emerald-400/80">Gestionar cobros y facturación</p>
        </button>

        <!-- TEMPORALMENTE DESHABILITADO - Upgrade -->
        <!-- 
        <button 
          on:click={upgradeAccount}
          class="group p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 text-left relative overflow-hidden"
        >
          <div class="absolute top-2 right-2">
            <div class="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs px-2 py-1 rounded-full font-medium">
              UPGRADE
            </div>
          </div>
          <div class="flex items-center justify-between mb-4">
            <Crown class="w-8 h-8 text-blue-400" />
            <ChevronRight class="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 class="font-medium text-blue-300 mb-2">Mejorar Plan</h3>
          <p class="text-sm text-blue-400/80">Más estudiantes y funciones</p>
        </button>
        -->
      </div>
    </div>
  </main>
</div>

<style>
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center;
  }
  
  .btn-secondary {
    @apply bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center border border-slate-600;
  }
</style>