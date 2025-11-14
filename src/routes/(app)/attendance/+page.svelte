<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    UserCheck, 
    Users, 
    Calendar, 
    Clock, 
    TrendingUp, 
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    School,
    ChevronRight,
    ArrowLeft,
    BarChart3,
    Target,
    Eye,
    Plus
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let user = data.user;
  let attendanceData = data.attendanceData;

  onMount(() => {
    console.log('📊 Attendance Dashboard loaded - User:', user?.email || 'none');
    console.log('📊 Attendance data:', attendanceData);
  });

  const handleTakeAttendance = (classId: string) => {
    goto(`/classes/${classId}/attendance`);
  };

  const handleViewClass = (classId: string) => {
    goto(`/classes/${classId}`);
  };

  const handleViewCenter = (centerId: string) => {
    goto(`/schools/${centerId}`);
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAttendanceBgColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-500/10 border-green-500/30';
    if (rate >= 75) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
</script>

<svelte:head>
  <title>Control de Asistencia - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
  <!-- Header -->
  <header class="bg-slate-800 border-b border-slate-700">
    <div class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button 
            on:click={() => goto('/dashboard')}
            class="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft class="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-white">Control de Asistencia</h1>
            <p class="text-slate-400">Gestiona las asistencias de todos tus centros</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
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
      <!-- Total Clases Hoy -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Clases Hoy</p>
            <p class="text-3xl font-bold text-white">{attendanceData.todayStats.totalClasses}</p>
            <p class="text-xs text-slate-400 mt-1">
              {attendanceData.todayStats.classesWithAttendance} con lista pasada
            </p>
          </div>
          <div class="p-3 bg-blue-500/20 rounded-lg">
            <Calendar class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <!-- Total Estudiantes -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Estudiantes</p>
            <p class="text-3xl font-bold text-white">{attendanceData.todayStats.totalStudents}</p>
            <p class="text-xs text-slate-400 mt-1">
              {attendanceData.todayStats.presentStudents} presentes
            </p>
          </div>
          <div class="p-3 bg-green-500/20 rounded-lg">
            <Users class="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <!-- Tasa de Asistencia -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Asistencia</p>
            <p class={`text-3xl font-bold ${getAttendanceColor(attendanceData.todayStats.attendanceRate)}`}>
              {attendanceData.todayStats.attendanceRate}%
            </p>
            <p class="text-xs text-slate-400 mt-1">
              {attendanceData.todayStats.absentStudents} ausentes
            </p>
          </div>
          <div class="p-3 bg-purple-500/20 rounded-lg">
            <BarChart3 class="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      <!-- Ausencias -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Ausencias</p>
            <p class="text-3xl font-bold text-red-400">{attendanceData.todayStats.absentStudents}</p>
            <p class="text-xs text-slate-400 mt-1">
              {attendanceData.todayStats.totalStudents - attendanceData.todayStats.absentStudents} presentes
            </p>
          </div>
          <div class="p-3 bg-red-500/20 rounded-lg">
            <AlertTriangle class="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Centros y Clases -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Centros con clases -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Centros y Clases</h2>
            <div class="flex items-center space-x-2">
              <School class="w-4 h-4 text-slate-400" />
              <span class="text-sm text-slate-400">{attendanceData.centersWithClasses.length} centros</span>
            </div>
          </div>

          {#if attendanceData.centersWithClasses.length === 0}
            <div class="text-center py-8">
              <School class="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p class="text-slate-400">No hay centros con clases programadas</p>
            </div>
          {:else}
            <div class="space-y-4">
              {#each attendanceData.centersWithClasses as center}
                <div class="bg-slate-700/50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="p-2 bg-blue-500/20 rounded-lg">
                        <School class="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 class="font-medium text-white">{center.name}</h3>
                        <p class="text-sm text-slate-400">{center.city}</p>
                      </div>
                    </div>
                    <button 
                      on:click={() => handleViewCenter(center.id)}
                      class="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Eye class="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  <div class="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span class="text-slate-400">Clases:</span>
                      <span class="text-white ml-1">{center.classesToday}/{center.totalClasses}</span>
                    </div>
                    <div>
                      <span class="text-slate-400">Estudiantes:</span>
                      <span class="text-white ml-1">{center.totalStudents}</span>
                    </div>
                    <div>
                      <span class="text-slate-400">Asistencia:</span>
                      <span class={`ml-1 ${getAttendanceColor(center.attendanceRate)}`}>{center.attendanceRate}%</span>
                    </div>
                  </div>

                  <!-- Clases del centro -->
                  {#if center.classes.length > 0}
                    <div class="space-y-2">
                      {#each center.classes as classItem}
                        <div class="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                          <div class="flex items-center space-x-3">
                            <div class="p-1.5 bg-green-500/20 rounded-lg">
                              <UserCheck class="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <h4 class="font-medium text-white">{classItem.name}</h4>
                              <p class="text-sm text-slate-400">
                                {classItem.time} • {classItem.present}/{classItem.students} estudiantes
                              </p>
                            </div>
                          </div>
                          <div class="flex items-center space-x-2">
                            <span class={`text-sm font-medium ${getAttendanceColor(classItem.attendanceRate)}`}>
                              {classItem.attendanceRate}%
                            </span>
                            <button 
                              on:click={() => handleTakeAttendance(classItem.id)}
                              class="p-1.5 hover:bg-slate-500 rounded-lg transition-colors"
                              title="Ver detalles de asistencia"
                            >
                              <ChevronRight class="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Próximas clases -->
        {#if attendanceData.upcomingClasses.length > 0}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-white">Próximas Clases</h2>
              <div class="flex items-center space-x-2">
                <Clock class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-400">{attendanceData.upcomingClasses.length} programadas</span>
              </div>
            </div>

            <div class="space-y-3">
              {#each attendanceData.upcomingClasses as classItem}
                <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="p-2 bg-orange-500/20 rounded-lg">
                      <Clock class="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 class="font-medium text-white">{classItem.name}</h3>
                      <p class="text-sm text-slate-400">{classItem.centerName} • {classItem.time}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-slate-400">{classItem.students} estudiantes</span>
                    <button 
                      on:click={() => handleTakeAttendance(classItem.id)}
                      class="btn-primary text-sm"
                    >
                      <UserCheck class="w-4 h-4 mr-1" />
                      Pasar Lista
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Panel lateral -->
      <div class="space-y-6">
        <!-- Asistencias recientes -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Asistencias Recientes</h2>
            <div class="flex items-center space-x-2">
              <CheckCircle class="w-4 h-4 text-slate-400" />
              <span class="text-sm text-slate-400">{attendanceData.recentAttendance.length}</span>
            </div>
          </div>

          {#if attendanceData.recentAttendance.length === 0}
            <div class="text-center py-6">
              <CheckCircle class="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p class="text-slate-400 text-sm">No hay asistencias recientes</p>
            </div>
          {:else}
            <div class="space-y-3">
              {#each attendanceData.recentAttendance as attendance}
                <div class="p-3 bg-slate-700/50 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-white text-sm">{attendance.className}</h4>
                    <span class={`text-xs font-medium ${getAttendanceColor(attendance.attendanceRate)}`}>
                      {attendance.attendanceRate}%
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mb-1">{attendance.centerName}</p>
                  <p class="text-xs text-slate-500">{formatDate(attendance.date)}</p>
                  <div class="flex items-center justify-between mt-2 text-xs">
                    <span class="text-green-400">{attendance.present} presentes</span>
                    <span class="text-red-400">{attendance.absent} ausentes</span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Acciones rápidas -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-white mb-6">Acciones Rápidas</h2>
          
          <div class="space-y-3">
            <button 
              on:click={() => goto('/classes')}
              class="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="p-1.5 bg-blue-500/20 rounded-lg">
                  <Target class="w-4 h-4 text-blue-400" />
                </div>
                <span class="text-white">Ver Todas las Clases</span>
              </div>
              <ChevronRight class="w-4 h-4 text-slate-400" />
            </button>

            <button 
              on:click={() => goto('/students')}
              class="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="p-1.5 bg-green-500/20 rounded-lg">
                  <Users class="w-4 h-4 text-green-400" />
                </div>
                <span class="text-white">Gestionar Estudiantes</span>
              </div>
              <ChevronRight class="w-4 h-4 text-slate-400" />
            </button>

            <button 
              on:click={() => goto('/reports')}
              class="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="p-1.5 bg-purple-500/20 rounded-lg">
                  <BarChart3 class="w-4 h-4 text-purple-400" />
                </div>
                <span class="text-white">Ver Informes</span>
              </div>
              <ChevronRight class="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
