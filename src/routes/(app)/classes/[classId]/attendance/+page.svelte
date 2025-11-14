<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Calendar,
    Users,
    UserCheck,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Plus,
    Save,
    BarChart3,
    TrendingUp,
    Target,
    Eye
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { AttendanceStatus, AttendanceRecord } from '$lib/types';

  export let data: PageData;

  let classData = data.class;
  let students = data.students || [];
  let recentAttendance = data.recentAttendance || [];
  let attendanceStats = data.attendanceStats || [];

  // Estado para pasar lista
  let selectedDate = new Date().toISOString().split('T')[0]; // Fecha de hoy por defecto
  let currentAttendance: Record<string, { status: AttendanceStatus; notes: string }> = {};
  let isSubmitting = false;
  let showingDate: string | null = null;

  // Vista actual
  let currentView: 'take' | 'history' | 'stats' = 'take';

  onMount(() => {
    console.log('✅ Class attendance page: Class:', classData?.name);
    console.log('✅ Students in class:', students.length);
    console.log('✅ Recent attendance sessions:', recentAttendance.length);
    
    // Inicializar asistencia actual
    initializeCurrentAttendance();
  });

  const initializeCurrentAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = recentAttendance.find(session => session.date === today);
    
    students.forEach(student => {
      const existingRecord = todayAttendance?.records.find(r => r.student_id === student.id);
      currentAttendance[student.id] = {
        status: existingRecord?.status || 'P',
        notes: existingRecord?.notes || ''
      };
    });
  };

  const handleGoBack = () => {
    goto(`/classes/${classData.id}`);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    currentAttendance[studentId] = {
      ...currentAttendance[studentId],
      status
    };
    // Force reactivity
    currentAttendance = { ...currentAttendance };
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    currentAttendance[studentId] = {
      ...currentAttendance[studentId],
      notes
    };
    // Force reactivity
    currentAttendance = { ...currentAttendance };
  };

  const handleSubmitAttendance = async () => {
    if (isSubmitting) return;

    isSubmitting = true;
    
    try {
      const records: AttendanceRecord[] = students.map(student => ({
        student_id: student.id,
        student_name: student.name,
        status: currentAttendance[student.id]?.status || 'P',
        notes: currentAttendance[student.id]?.notes || ''
      }));

      console.log('📊 Submitting attendance for date:', selectedDate);
      console.log('📊 Records:', records);

      // En modo dev, simular guardado
      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classData.id,
          date: selectedDate,
          records
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Attendance saved:', result);
        
        // Actualizar el historial local (mock)
        const existingSessionIndex = recentAttendance.findIndex(session => session.date === selectedDate);
        if (existingSessionIndex >= 0) {
          recentAttendance[existingSessionIndex].records = records;
        } else {
          recentAttendance.push({ date: selectedDate, records });
        }
        recentAttendance = [...recentAttendance.sort((a, b) => b.date.localeCompare(a.date))];
        
        alert('✅ Asistencia guardada correctamente');
      } else {
        throw new Error('Error saving attendance');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('❌ Error al guardar la asistencia');
    } finally {
      isSubmitting = false;
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'P': return CheckCircle;
      case 'T': return Clock;
      case 'A': return XCircle;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'P': return 'text-green-400';
      case 'T': return 'text-yellow-400';
      case 'A': return 'text-red-400';
      default: return 'text-green-400';
    }
  };

  const getStatusBgColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'P': return 'bg-green-500/20 border-green-500/30';
      case 'T': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'A': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-green-500/20 border-green-500/30';
    }
  };

  const getStatusLabel = (status: AttendanceStatus) => {
    switch (status) {
      case 'P': return 'Presente';
      case 'T': return 'Tardanza';
      case 'A': return 'Ausente';
      default: return 'Presente';
    }
  };

  const showHistoryForDate = (date: string) => {
    showingDate = showingDate === date ? null : date;
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const markAllPresent = () => {
    students.forEach(student => {
      currentAttendance[student.id] = { ...currentAttendance[student.id], status: 'P' };
    });
    currentAttendance = { ...currentAttendance };
  };

  const clearAllNotes = () => {
    students.forEach(student => {
      currentAttendance[student.id] = { ...currentAttendance[student.id], notes: '' };
    });
    currentAttendance = { ...currentAttendance };
  };
</script>

<svelte:head>
  <title>Asistencia - {classData?.name || 'Clase'} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <!-- Header -->
  <header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button on:click={handleGoBack} class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-500/20 rounded-lg">
              <UserCheck class="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Control de Asistencia</h1>
              <p class="text-sm text-slate-400">{classData?.name} • {classData?.schedule}</p>
            </div>
          </div>
        </div>
        
        <!-- Navigation tabs -->
        <div class="flex items-center bg-slate-700/50 rounded-lg p-1">
          <button 
            on:click={() => currentView = 'take'}
            class={`px-4 py-2 rounded-md transition-colors ${currentView === 'take' ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <UserCheck class="w-4 h-4 inline mr-2" />
            Pasar Lista
          </button>
          <button 
            on:click={() => currentView = 'history'}
            class={`px-4 py-2 rounded-md transition-colors ${currentView === 'history' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Calendar class="w-4 h-4 inline mr-2" />
            Historial
          </button>
          <button 
            on:click={() => currentView = 'stats'}
            class={`px-4 py-2 rounded-md transition-colors ${currentView === 'stats' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart3 class="w-4 h-4 inline mr-2" />
            Estadísticas
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    {#if currentView === 'take'}
      <!-- Pasar Lista -->
      <div class="space-y-8">
        <!-- Controls -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Pasar Lista</h2>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <Calendar class="w-5 h-5 text-slate-500" />
                <input 
                  type="date" 
                  bind:value={selectedDate}
                  class="input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <button on:click={markAllPresent} class="btn-secondary text-sm">
                <CheckCircle class="w-4 h-4 mr-2" />
                Todos Presentes
              </button>
              <button on:click={clearAllNotes} class="btn-secondary text-sm">
                <XCircle class="w-4 h-4 mr-2" />
                Limpiar Notas
              </button>
            </div>
          </div>

          <!-- Quick stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <Users class="w-4 h-4 text-blue-500" />
                <span class="text-sm text-slate-400">Total</span>
              </div>
              <p class="text-2xl font-bold">{students.length}</p>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <CheckCircle class="w-4 h-4 text-green-500" />
                <span class="text-sm text-slate-400">Presentes</span>
              </div>
              <p class="text-2xl font-bold text-green-400">
                {Object.values(currentAttendance).filter(a => a.status === 'P').length}
              </p>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <Clock class="w-4 h-4 text-yellow-500" />
                <span class="text-sm text-slate-400">Tardanzas</span>
              </div>
              <p class="text-2xl font-bold text-yellow-400">
                {Object.values(currentAttendance).filter(a => a.status === 'T').length}
              </p>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <XCircle class="w-4 h-4 text-red-500" />
                <span class="text-sm text-slate-400">Ausentes</span>
              </div>
              <p class="text-2xl font-bold text-red-400">
                {Object.values(currentAttendance).filter(a => a.status === 'A').length}
              </p>
            </div>
          </div>
        </div>

        <!-- Student List -->
        <div class="space-y-4">
          {#each students as student}
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-lg">
                      {student.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'XX'}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg">{student.name}</h3>
                    <p class="text-sm text-slate-400">
                      {student.age} años • {student.level}
                    </p>
                  </div>
                </div>

                <div class="flex items-center space-x-4">
                  <!-- Status buttons -->
                  <div class="flex items-center space-x-2">
                    {#each ['P', 'T', 'A'] as status}
                      <button
                        on:click={() => handleStatusChange(student.id, status)}
                        class={`p-3 rounded-lg border transition-all ${
                          currentAttendance[student.id]?.status === status 
                            ? getStatusBgColor(status) + ' ' + getStatusColor(status)
                            : 'border-slate-600 text-slate-400 hover:border-slate-500'
                        }`}
                        title={getStatusLabel(status)}
                      >
                        <svelte:component 
                          this={getStatusIcon(status)} 
                          class="w-5 h-5" 
                        />
                      </button>
                    {/each}
                  </div>

                  <!-- Notes -->
                  <div class="w-64">
                    <input
                      type="text"
                      placeholder="Notas (opcional)"
                      value={currentAttendance[student.id]?.notes || ''}
                      on:input={(e) => handleNotesChange(student.id, e.target.value)}
                      class="input text-sm w-full"
                    />
                  </div>

                  <!-- Status indicator -->
                  <div class={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBgColor(currentAttendance[student.id]?.status || 'P')}`}>
                    {getStatusLabel(currentAttendance[student.id]?.status || 'P')}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Submit button -->
        <div class="flex justify-end">
          <button 
            on:click={handleSubmitAttendance}
            disabled={isSubmitting}
            class="btn-primary text-lg px-8 py-3"
          >
            {#if isSubmitting}
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Guardando...
            {:else}
              <Save class="w-5 h-5 mr-2" />
              Guardar Asistencia
            {/if}
          </button>
        </div>
      </div>

    {:else if currentView === 'history'}
      <!-- Historial -->
      <div class="space-y-6">
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-4">Historial de Asistencia</h2>
          
          {#if recentAttendance.length === 0}
            <div class="text-center py-12">
              <Calendar class="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 class="text-xl font-semibold text-slate-400 mb-2">No hay registros de asistencia</h3>
              <p class="text-slate-500">Comienza pasando lista para ver el historial aquí</p>
            </div>
          {:else}
            <div class="space-y-4">
              {#each recentAttendance as session}
                <div class="border border-slate-700 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <Calendar class="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 class="font-semibold">
                          {new Date(session.date).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <p class="text-sm text-slate-400">
                          {session.records.filter(r => r.status === 'P').length} presentes • 
                          {session.records.filter(r => r.status === 'T').length} tardanzas • 
                          {session.records.filter(r => r.status === 'A').length} ausentes
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      on:click={() => showHistoryForDate(session.date)}
                      class="btn-secondary"
                    >
                      <Eye class="w-4 h-4 mr-2" />
                      {showingDate === session.date ? 'Ocultar' : 'Ver Detalles'}
                    </button>
                  </div>

                  {#if showingDate === session.date}
                    <div class="mt-4 pt-4 border-t border-slate-700">
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {#each session.records as record}
                          <div class="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                            <div class="flex items-center space-x-3">
                              <svelte:component 
                                this={getStatusIcon(record.status)} 
                                class={`w-4 h-4 ${getStatusColor(record.status)}`} 
                              />
                              <span class="font-medium">{record.student_name}</span>
                            </div>
                            <div class="text-right">
                              <span class={`text-sm ${getStatusColor(record.status)}`}>
                                {getStatusLabel(record.status)}
                              </span>
                              {#if record.notes}
                                <p class="text-xs text-slate-400 mt-1">{record.notes}</p>
                              {/if}
                            </div>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

    {:else if currentView === 'stats'}
      <!-- Estadísticas -->
      <div class="space-y-6">
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-6">Estadísticas de Asistencia</h2>
          
          {#if attendanceStats.length === 0}
            <div class="text-center py-12">
              <BarChart3 class="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 class="text-xl font-semibold text-slate-400 mb-2">No hay estadísticas disponibles</h3>
              <p class="text-slate-500">Necesitas al menos una sesión de asistencia para ver estadísticas</p>
            </div>
          {:else}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {#each attendanceStats as stats}
                <div class="border border-slate-700 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-sm">
                          {stats.student_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'XX'}
                        </span>
                      </div>
                      <div>
                        <h3 class="font-semibold">{stats.student_name}</h3>
                        <p class="text-sm text-slate-400">{stats.total_sessions} sesiones</p>
                      </div>
                    </div>
                    
                    <div class="text-right">
                      <div class={`text-2xl font-bold ${getAttendanceRateColor(stats.attendance_rate)}`}>
                        {stats.attendance_rate}%
                      </div>
                      <p class="text-xs text-slate-400">Asistencia</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-4 mb-4">
                    <div class="text-center">
                      <div class="flex items-center justify-center mb-1">
                        <CheckCircle class="w-4 h-4 text-green-400 mr-1" />
                        <span class="text-lg font-bold text-green-400">{stats.present_count}</span>
                      </div>
                      <p class="text-xs text-slate-400">Presentes</p>
                    </div>
                    <div class="text-center">
                      <div class="flex items-center justify-center mb-1">
                        <Clock class="w-4 h-4 text-yellow-400 mr-1" />
                        <span class="text-lg font-bold text-yellow-400">{stats.late_count}</span>
                      </div>
                      <p class="text-xs text-slate-400">Tardanzas</p>
                    </div>
                    <div class="text-center">
                      <div class="flex items-center justify-center mb-1">
                        <XCircle class="w-4 h-4 text-red-400 mr-1" />
                        <span class="text-lg font-bold text-red-400">{stats.absent_count}</span>
                      </div>
                      <p class="text-xs text-slate-400">Ausentes</p>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-400">Puntualidad</span>
                      <span class={getAttendanceRateColor(stats.punctuality_rate)}>
                        {stats.punctuality_rate}%
                      </span>
                    </div>
                    {#if stats.last_attendance_date}
                      <div class="flex justify-between text-sm">
                        <span class="text-slate-400">Última asistencia</span>
                        <span class="text-slate-300">
                          {new Date(stats.last_attendance_date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  .input {
    @apply bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500;
  }
</style>
