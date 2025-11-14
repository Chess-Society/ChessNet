<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    User,
    Calendar,
    Clock,
    TrendingUp,
    TrendingDown,
    Target,
    BookOpen,
    Trophy,
    DollarSign,
    Phone,
    Mail,
    MapPin,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Award,
    Activity,
    BarChart3,
    PieChart,
    Users,
    School,
    FileText,
    Star,
    Zap,
    Timer
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let selectedTab: 'overview' | 'attendance' | 'skills' | 'payments' | 'tournaments' | 'timeline' = 'overview';

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'P': return CheckCircle;
      case 'T': return Clock;
      case 'A': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'P': return 'text-emerald-400';
      case 'T': return 'text-yellow-400';
      case 'A': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getSkillStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'in_progress': return 'text-yellow-400';
      case 'not_started': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-emerald-400';
      case 'pending': return 'text-yellow-400';
      case 'overdue': return 'text-red-400';
      default: return 'text-slate-400';
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance': return Calendar;
      case 'skill': return BookOpen;
      case 'payment': return DollarSign;
      case 'tournament': return Trophy;
      default: return Activity;
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Datos del reporte
  $: report = data.report;
  $: student = report?.student;
  $: progress = report?.progress_summary;
</script>

<svelte:head>
  <title>Informe de {student?.name || 'Estudiante'} - ChessNet</title>
</svelte:head>

{#if !report}
  <div class="min-h-screen bg-slate-900 flex items-center justify-center">
    <div class="text-center">
      <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-white mb-2">Estudiante no encontrado</h2>
      <p class="text-slate-400 mb-4">No se pudo cargar el informe del estudiante</p>
      <button
        on:click={() => goto('/reports')}
        class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
      >
        Volver a Informes
      </button>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <div class="border-b border-slate-700/50 bg-slate-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div class="flex items-center space-x-4">
            <button
              on:click={() => goto('/reports')}
              class="p-2 text-slate-400 hover:text-white transition-colors"
              title="Volver a Informes"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div class="p-2 bg-teal-500/20 rounded-lg">
              <User class="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">{student.name}</h1>
              <p class="text-slate-400">Informe de progreso detallado</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Información del Estudiante -->
    <div class="bg-slate-800/50 border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Información Personal -->
          <div class="space-y-4">
            <h3 class="font-semibold text-white">Información Personal</h3>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Mail class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-300">{student.email}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Phone class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-300">{student.phone}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Calendar class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-300">
                  {calculateAge(student.date_of_birth)} años ({formatDate(student.date_of_birth)})
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <School class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-300">{report.college.name}</span>
              </div>
            </div>
          </div>

          <!-- Métricas Clave -->
          <div class="space-y-4">
            <h3 class="font-semibold text-white">Métricas Clave</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-lg font-bold text-white">{formatPercentage(progress.attendance_rate)}</div>
                <div class="text-xs text-slate-400">Asistencia</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-white">{formatPercentage(progress.skill_completion_rate)}</div>
                <div class="text-xs text-slate-400">Skills</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-white">{progress.current_rating}</div>
                <div class="text-xs text-slate-400">Rating</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold {progress.overdue_payments > 0 ? 'text-red-400' : 'text-emerald-400'}">
                  {progress.overdue_payments > 0 ? progress.overdue_payments : '✓'}
                </div>
                <div class="text-xs text-slate-400">Pagos</div>
              </div>
            </div>
          </div>

          <!-- Estado General -->
          <div class="space-y-4">
            <h3 class="font-semibold text-white">Estado General</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Inscrito desde:</span>
                <span class="text-sm text-white">{formatDate(progress.enrollment_date)}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Días activo:</span>
                <span class="text-sm text-white">{progress.days_enrolled}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Última actividad:</span>
                <span class="text-sm text-white">{formatDate(progress.last_activity_date)}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Rating cambio:</span>
                <span class="text-sm {progress.rating_change >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                  {progress.rating_change >= 0 ? '+' : ''}{progress.rating_change}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-12">
          <button
            on:click={() => selectedTab = 'overview'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'overview' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Resumen
          </button>
          <button
            on:click={() => selectedTab = 'attendance'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'attendance' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Asistencia
          </button>
          <button
            on:click={() => selectedTab = 'skills'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'skills' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Habilidades
          </button>
          <button
            on:click={() => selectedTab = 'payments'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'payments' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Pagos
          </button>
          <button
            on:click={() => selectedTab = 'tournaments'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'tournaments' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Torneos
          </button>
          <button
            on:click={() => selectedTab = 'timeline'}
            class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'timeline' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
          >
            Cronología
          </button>
        </nav>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Tab: Resumen -->
      {#if selectedTab === 'overview'}
        <div class="space-y-8">
          
          <!-- Gráficos de Progreso -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Rating Evolution -->
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Evolución del Rating</h3>
              <div class="space-y-4">
                {#each report.rating_history as entry}
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-white">{entry.event}</div>
                      <div class="text-xs text-slate-400">{formatDate(entry.date)}</div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-sm font-medium text-white">{entry.rating}</span>
                      <span class="text-sm {entry.change >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                        {entry.change >= 0 ? '+' : ''}{entry.change}
                      </span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Skills Distribution -->
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Distribución de Skills</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <CheckCircle class="w-4 h-4 text-emerald-400" />
                    <span class="text-sm text-slate-300">Completadas</span>
                  </div>
                  <span class="text-sm font-medium text-white">{progress.skills_mastered}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <Clock class="w-4 h-4 text-yellow-400" />
                    <span class="text-sm text-slate-300">En progreso</span>
                  </div>
                  <span class="text-sm font-medium text-white">{progress.skills_in_progress}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <XCircle class="w-4 h-4 text-slate-400" />
                    <span class="text-sm text-slate-300">Sin comenzar</span>
                  </div>
                  <span class="text-sm font-medium text-white">
                    {progress.total_skills_assigned - progress.skills_mastered - progress.skills_in_progress}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notas del Instructor -->
          {#if student.instructor_notes}
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Notas del Instructor</h3>
              <div class="p-4 bg-slate-700/30 rounded-lg">
                <p class="text-slate-300">{student.instructor_notes}</p>
              </div>
            </div>
          {/if}

          <!-- Resumen de Clases -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Clases Inscritas</h3>
            <div class="space-y-4">
              {#each report.classes as cls}
                <div class="p-4 bg-slate-700/30 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-white">{cls.name}</h4>
                    <span class="text-sm text-emerald-400">{formatCurrency(cls.price)}/mes</span>
                  </div>
                  <div class="text-sm text-slate-400">{cls.schedule}</div>
                  <div class="text-xs text-slate-500 mt-1">
                    {formatDate(cls.start_date)} - {formatDate(cls.end_date)}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- Tab: Asistencia -->
      {#if selectedTab === 'attendance'}
        <div class="space-y-8">
          
          <!-- Estadísticas de Asistencia -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
              <div class="text-2xl font-bold text-emerald-400">{progress.attended_sessions}</div>
              <div class="text-sm text-slate-400">Presentes</div>
            </div>
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
              <div class="text-2xl font-bold text-yellow-400">{progress.late_sessions}</div>
              <div class="text-sm text-slate-400">Tardanzas</div>
            </div>
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
              <div class="text-2xl font-bold text-red-400">{progress.absent_sessions}</div>
              <div class="text-sm text-slate-400">Ausencias</div>
            </div>
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
              <div class="text-2xl font-bold text-white">{formatPercentage(progress.punctuality_rate)}</div>
              <div class="text-sm text-slate-400">Puntualidad</div>
            </div>
          </div>

          <!-- Historial de Asistencia -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Historial de Asistencia</h3>
            <div class="space-y-3">
              {#each report.attendance_history as attendance}
                {@const IconComponent = getAttendanceIcon(attendance.status)}
                <div class="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <IconComponent class="w-5 h-5 {getAttendanceColor(attendance.status)}" />
                    <div>
                      <div class="text-sm font-medium text-white">{formatDate(attendance.date)}</div>
                      <div class="text-xs text-slate-400">
                        {attendance.status === 'P' ? 'Presente' : 
                         attendance.status === 'T' ? 'Tardanza' : 'Ausente'}
                      </div>
                    </div>
                  </div>
                  {#if attendance.notes}
                    <div class="text-sm text-slate-300 max-w-md text-right">
                      {attendance.notes}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- Tab: Skills -->
      {#if selectedTab === 'skills'}
        <div class="space-y-8">
          
          <!-- Progreso por Categoría -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#each ['Fundamentos', 'Táctica', 'Finales'] as category}
              {@const categorySkills = report.skills_progress.filter(s => s.category === category)}
              {@const completedSkills = categorySkills.filter(s => s.status === 'completed').length}
              <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 class="font-semibold text-white mb-4">{category}</h3>
                <div class="text-center">
                  <div class="text-2xl font-bold text-white mb-2">
                    {completedSkills}/{categorySkills.length}
                  </div>
                  <div class="text-sm text-slate-400">
                    {formatPercentage(categorySkills.length > 0 ? (completedSkills / categorySkills.length) * 100 : 0)}
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Lista de Skills -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Progreso Detallado</h3>
            <div class="space-y-4">
              {#each report.skills_progress as skill}
                <div class="p-4 bg-slate-700/30 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <h4 class="font-medium text-white">{skill.skill_name}</h4>
                      <div class="text-sm text-slate-400">{skill.category}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium {getSkillStatusColor(skill.status)}">
                        {skill.status === 'completed' ? 'Completada' :
                         skill.status === 'in_progress' ? 'En progreso' : 'Sin comenzar'}
                      </div>
                      <div class="text-xs text-slate-400">
                        Nivel {skill.level}/{skill.max_level}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Barra de progreso -->
                  <div class="w-full bg-slate-600/50 rounded-full h-2 mb-2">
                    <div 
                      class="bg-teal-500 h-2 rounded-full transition-all duration-300"
                      style="width: {(skill.level / skill.max_level) * 100}%"
                    ></div>
                  </div>
                  
                  {#if skill.completion_date}
                    <div class="text-xs text-emerald-400 mb-1">
                      Completada: {formatDate(skill.completion_date)}
                    </div>
                  {/if}
                  
                  {#if skill.notes}
                    <div class="text-sm text-slate-300">{skill.notes}</div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- Tab: Pagos -->
      {#if selectedTab === 'payments'}
        <div class="space-y-8">
          
          <!-- Resumen de Pagos -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
              <div class="text-2xl font-bold text-white">{progress.total_payments}</div>
              <div class="text-sm text-slate-400">Total</div>
            </div>
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
              <div class="text-2xl font-bold text-emerald-400">{progress.paid_payments}</div>
              <div class="text-sm text-slate-400">Pagados</div>
            </div>
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
              <div class="text-2xl font-bold text-red-400">{progress.overdue_payments}</div>
              <div class="text-sm text-slate-400">Vencidos</div>
            </div>
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
              <div class="text-2xl font-bold text-white">{formatPercentage(progress.payment_compliance)}</div>
              <div class="text-sm text-slate-400">Cumplimiento</div>
            </div>
          </div>

          <!-- Historial de Pagos -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Historial de Pagos</h3>
            <div class="space-y-3">
              {#each report.payment_history as payment}
                <div class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <div class="text-sm font-medium text-white">{payment.description}</div>
                    <div class="text-xs text-slate-400">
                      Vencimiento: {formatDate(payment.due_date)}
                      {#if payment.paid_date}
                        • Pagado: {formatDate(payment.paid_date)}
                      {/if}
                    </div>
                    {#if payment.payment_method}
                      <div class="text-xs text-slate-500">
                        {payment.payment_method} - {payment.payment_reference}
                      </div>
                    {/if}
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-semibold text-white">{formatCurrency(payment.amount)}</div>
                    <div class="text-sm {getPaymentStatusColor(payment.status)}">
                      {payment.status === 'paid' ? 'Pagado' :
                       payment.status === 'pending' ? 'Pendiente' : 'Vencido'}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- Tab: Torneos -->
      {#if selectedTab === 'tournaments'}
        <div class="space-y-8">
          
          {#if report.tournament_history.length > 0}
            <!-- Estadísticas de Torneos -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
                <div class="text-2xl font-bold text-white">{progress.tournaments_participated}</div>
                <div class="text-sm text-slate-400">Participados</div>
              </div>
              <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
                <div class="text-2xl font-bold text-emerald-400">{progress.tournament_wins}</div>
                <div class="text-sm text-slate-400">Victorias</div>
              </div>
              <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
                <div class="text-2xl font-bold text-yellow-400">{progress.tournament_draws}</div>
                <div class="text-sm text-slate-400">Empates</div>
              </div>
              <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
                <div class="text-2xl font-bold text-red-400">{progress.tournament_losses}</div>
                <div class="text-sm text-slate-400">Derrotas</div>
              </div>
            </div>

            <!-- Historial de Torneos -->
            {#each report.tournament_history as tournament}
              <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-white">{tournament.name}</h3>
                    <div class="text-sm text-slate-400">
                      {formatDate(tournament.date)} • {tournament.format} • {tournament.participants} participantes
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-semibold text-white">
                      Posición {tournament.final_position}/{tournament.participants}
                    </div>
                    <div class="text-sm text-slate-400">{tournament.points} puntos</div>
                  </div>
                </div>

                <!-- Partidas del Torneo -->
                <div class="space-y-2">
                  <h4 class="font-medium text-slate-300 mb-2">Partidas</h4>
                  {#each tournament.games as game}
                    <div class="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div class="flex items-center space-x-3">
                        <div class="text-sm font-medium text-white">R{game.round}</div>
                        <div class="text-sm text-slate-300">vs {game.opponent}</div>
                        <div class="text-xs text-slate-400">({game.opponent_rating})</div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="text-xs text-slate-400">{game.color === 'white' ? '⚪' : '⚫'}</div>
                        <div class="text-sm font-medium {
                          game.result === '1-0' ? 'text-emerald-400' :
                          game.result === '0-1' ? 'text-red-400' : 'text-yellow-400'
                        }">
                          {game.result}
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          {:else}
            <div class="text-center py-12">
              <Trophy class="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p class="text-slate-400">No ha participado en torneos aún</p>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Tab: Cronología -->
      {#if selectedTab === 'timeline'}
        <div class="space-y-8">
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-6">Cronología de Actividad</h3>
            <div class="space-y-4">
              {#each report.activity_timeline as activity}
                {@const IconComponent = getActivityIcon(activity.type)}
                <div class="flex items-start space-x-4">
                  <div class="p-2 bg-slate-600/50 rounded-lg">
                    <IconComponent class="w-4 h-4 {getActivityColor(activity.status)}" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h4 class="font-medium text-white">{activity.title}</h4>
                      <span class="text-xs text-slate-400">{formatDate(activity.date)}</span>
                    </div>
                    <p class="text-sm text-slate-300 mt-1">{activity.description}</p>
                    {#if activity.details && typeof activity.details === 'object'}
                      <div class="mt-2 text-xs text-slate-400">
                        {#each Object.entries(activity.details) as [key, value]}
                          <span class="mr-4">{key}: {value}</span>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </main>
  </div>
{/if}
