<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    BarChart3,
    Users,
    School,
    TrendingUp,
    TrendingDown,
    Calendar,
    Clock,
    CheckCircle,
    AlertTriangle,
    Trophy,
    Target,
    Eye,
    Search,
    Filter,
    ChevronDown,
    Activity,
    BookOpen,
    DollarSign,
    Award
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let searchTerm = '';
  let collegeFilter = 'all';
  let statusFilter = 'all'; // all, active, inactive, attention
  let showFilters = false;

  // Datos reactivos
  $: filteredStudents = data.studentsReports?.filter((report) => {
    const matchesSearch = !searchTerm || 
      report.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.college.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCollege = collegeFilter === 'all' || report.student.college_id === collegeFilter;
    
    const matchesStatus = statusFilter === 'all' || (() => {
      if (statusFilter === 'active') {
        return new Date(report.progress_summary.last_activity_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }
      if (statusFilter === 'inactive') {
        return new Date(report.progress_summary.last_activity_date) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }
      if (statusFilter === 'attention') {
        return report.progress_summary.attendance_rate < 80 || 
               report.progress_summary.overdue_payments > 0 ||
               report.progress_summary.skill_completion_rate < 50;
      }
      return true;
    })();
    
    return matchesSearch && matchesCollege && matchesStatus;
  }) || [];

  // Obtener lista única de colegios
  $: colleges = [...new Set(data.studentsReports?.map(r => ({ id: r.student.college_id, name: r.college.name })) || [])];

  const handleViewReport = (studentId: string) => {
    goto(`/reports/${studentId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStudentStatus = (report: any) => {
    const lastActivity = new Date(report.progress_summary.last_activity_date);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    if (report.progress_summary.overdue_payments > 0) {
      return { status: 'overdue', label: 'Pagos pendientes', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
    }
    if (report.progress_summary.attendance_rate < 70) {
      return { status: 'low_attendance', label: 'Asistencia baja', class: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    }
    if (lastActivity <= weekAgo) {
      return { status: 'inactive', label: 'Inactivo', class: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    }
    if (report.progress_summary.attendance_rate >= 90 && report.progress_summary.skill_completion_rate >= 75) {
      return { status: 'excellent', label: 'Excelente', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    }
    return { status: 'active', label: 'Activo', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance': return Calendar;
      case 'skill': return BookOpen;
      case 'payment': return DollarSign;
      case 'tournament': return Trophy;
      default: return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-emerald-400';
      case 'negative': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };
</script>

<svelte:head>
  <title>Informes de Progreso - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
  <!-- Header -->
  <div class="border-b border-slate-700/50 bg-slate-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-4">
          <button
            on:click={() => goto('/dashboard')}
            class="p-2 text-slate-400 hover:text-white transition-colors"
            title="Volver al Dashboard"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="p-2 bg-teal-500/20 rounded-lg">
            <BarChart3 class="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Informes de Progreso</h1>
            <p class="text-slate-400">Reportes y análisis por estudiante</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Estadísticas Generales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Estudiantes -->
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-blue-500/20 rounded-lg">
            <Users class="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">
          {data.generalStats?.total_students || 0}
        </h3>
        <p class="text-slate-400 text-sm">Total estudiantes</p>
      </div>

      <!-- Estudiantes Activos -->
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-emerald-500/20 rounded-lg">
            <Activity class="w-6 h-6 text-emerald-400" />
          </div>
          <span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
            {data.generalStats?.active_students || 0}
          </span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">Activos</h3>
        <p class="text-slate-400 text-sm">Última semana</p>
      </div>

      <!-- Asistencia Promedio -->
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-purple-500/20 rounded-lg">
            <Calendar class="w-6 h-6 text-purple-400" />
          </div>
          {#if (data.generalStats?.average_attendance_rate || 0) >= 85}
            <TrendingUp class="w-4 h-4 text-emerald-400" />
          {:else}
            <TrendingDown class="w-4 h-4 text-red-400" />
          {/if}
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">
          {formatPercentage(data.generalStats?.average_attendance_rate || 0)}
        </h3>
        <p class="text-slate-400 text-sm">Asistencia promedio</p>
      </div>

      <!-- Progreso Skills -->
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-yellow-500/20 rounded-lg">
            <Target class="w-6 h-6 text-yellow-400" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">
          {formatPercentage(data.generalStats?.average_skill_completion || 0)}
        </h3>
        <p class="text-slate-400 text-sm">Skills completadas</p>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <!-- Búsqueda -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            bind:value={searchTerm}
            class="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 w-full lg:w-80"
          />
        </div>

        <!-- Filtros -->
        <div class="flex items-center space-x-3">
          <button
            on:click={() => showFilters = !showFilters}
            class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
          >
            <Filter class="w-4 h-4" />
            <span>Filtros</span>
            <ChevronDown class="w-4 h-4 transition-transform {showFilters ? 'rotate-180' : ''}" />
          </button>
        </div>
      </div>

      <!-- Panel de filtros expandible -->
      {#if showFilters}
        <div class="mt-4 pt-4 border-t border-slate-700/50">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="college_filter" class="block text-sm font-medium text-slate-300 mb-2">Centro</label>
              <select
                id="college_filter"
                bind:value={collegeFilter}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="all">Todos los centros</option>
                {#each colleges as college}
                  <option value={college.id}>{college.name}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for="status_filter" class="block text-sm font-medium text-slate-300 mb-2">Estado</label>
              <select
                id="status_filter"
                bind:value={statusFilter}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="attention">Requieren atención</option>
              </select>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Lista de Estudiantes -->
    <div class="space-y-6">
      {#each filteredStudents as report}
        {@const studentStatus = getStudentStatus(report)}
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/30 transition-all duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <!-- Información del estudiante -->
              <div class="flex items-center space-x-4">
                <div class="p-3 bg-slate-600/50 rounded-lg">
                  <Users class="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">{report.student.name}</h3>
                  <p class="text-slate-400">{report.student.email}</p>
                  <div class="flex items-center space-x-4 mt-1">
                    <div class="flex items-center space-x-1">
                      <School class="w-3 h-3 text-slate-500" />
                      <span class="text-xs text-slate-500">{report.college.name}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Calendar class="w-3 h-3 text-slate-500" />
                      <span class="text-xs text-slate-500">
                        Inscrito: {formatDate(report.progress_summary.enrollment_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Estado y acciones -->
              <div class="flex items-center space-x-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {studentStatus.class}">
                  {studentStatus.label}
                </span>
                <button
                  on:click={() => handleViewReport(report.student.id)}
                  class="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  <Eye class="w-4 h-4" />
                  <span>Ver Informe</span>
                </button>
              </div>
            </div>

            <!-- Métricas rápidas -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div class="text-center">
                <div class="text-lg font-semibold text-white">
                  {formatPercentage(report.progress_summary.attendance_rate)}
                </div>
                <div class="text-xs text-slate-400">Asistencia</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-white">
                  {formatPercentage(report.progress_summary.skill_completion_rate)}
                </div>
                <div class="text-xs text-slate-400">Skills</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-white">
                  {report.progress_summary.current_rating}
                </div>
                <div class="text-xs text-slate-400">Rating</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold {report.progress_summary.overdue_payments > 0 ? 'text-red-400' : 'text-emerald-400'}">
                  {report.progress_summary.overdue_payments > 0 ? report.progress_summary.overdue_payments : '✓'}
                </div>
                <div class="text-xs text-slate-400">Pagos</div>
              </div>
            </div>

            <!-- Actividad reciente -->
            <div class="border-t border-slate-700/50 pt-4">
              <h4 class="text-sm font-medium text-slate-300 mb-3">Actividad Reciente</h4>
              <div class="space-y-2">
                {#each report.recent_activity.slice(0, 3) as activity}
                  {@const IconComponent = getActivityIcon(activity.type)}
                  <div class="flex items-center space-x-3">
                    <div class="p-1 bg-slate-600/50 rounded">
                      <IconComponent class="w-3 h-3 {getActivityColor(activity.status)}" />
                    </div>
                    <div class="flex-1">
                      <span class="text-sm text-white">{activity.description}</span>
                      <span class="text-xs text-slate-400 ml-2">{formatDate(activity.date)}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}

      {#if filteredStudents.length === 0}
        <div class="text-center py-12">
          <BarChart3 class="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p class="text-slate-400">No se encontraron estudiantes</p>
          {#if searchTerm || collegeFilter !== 'all' || statusFilter !== 'all'}
            <button
              on:click={() => {
                searchTerm = '';
                collegeFilter = 'all';
                statusFilter = 'all';
              }}
              class="mt-2 text-teal-400 hover:text-teal-300 transition-colors"
            >
              Limpiar filtros
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </main>
</div>
