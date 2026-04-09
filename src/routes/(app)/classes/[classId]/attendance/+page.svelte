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
    Eye,
    Zap,
    History
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { AttendanceStatus, AttendanceRecord } from '$lib/types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  const classData = $derived(data.class as any);
  const students = $derived((data.students || []) as any[]);
  const recentAttendance = $derived((data.recentAttendance || []) as any[]);
  const attendanceStats = $derived((data.attendanceStats || []) as any[]);

  let selectedDate = $state(new Date().toISOString().split('T')[0]);
  let currentAttendance = $state<Record<string, { status: AttendanceStatus; notes: string }>>({});
  let isSubmitting = $state(false);
  let showingDate = $state<string | null>(null);
  let currentView = $state<'take' | 'history' | 'stats'>('take');

  const showHistoryForDate = (date: string) => {
    showingDate = showingDate === date ? null : date;
  };

  $effect(() => {
    if (students.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = recentAttendance.find((session: any) => session.date === today);
      
      const newAttendance: Record<string, { status: AttendanceStatus; notes: string }> = {};
      students.forEach(student => {
        const existingRecord = todayAttendance?.records.find((r: any) => r.student_id === student.id);
        newAttendance[student.id] = {
          status: (existingRecord?.status as AttendanceStatus) || 'P',
          notes: existingRecord?.notes || ''
        };
      });
      currentAttendance = newAttendance;
    }
  });

  const handleSubmitAttendance = async () => {
    if (isSubmitting) return;
    try {
      isSubmitting = true;
      const records: AttendanceRecord[] = students.map(student => ({
        student_id: student.id,
        student_name: student.name,
        status: currentAttendance[student.id]?.status || 'P',
        notes: currentAttendance[student.id]?.notes || ''
      }));

      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id: classData.id, date: selectedDate, records })
      });

      if (!response.ok) throw new Error('Error');
      alert('✅ Asistencia guardada');
    } catch (error) {
      alert('❌ Error al guardar');
    } finally {
      isSubmitting = false;
    }
  };

  const statusThemes = {
    P: { icon: CheckCircle, label: 'PRESENTE', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    T: { icon: Clock, label: 'TARDE', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    A: { icon: XCircle, label: 'AUSENTE', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  };
</script>

<svelte:head>
  <title>Asistencia - {classData?.name} - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={() => goto(`/classes/${classData.id}`)}
        class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Regresar a Clase
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <UserCheck class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase">Asistencia</h1>
          <p class="text-surface-500 text-sm font-medium uppercase tracking-widest">{classData?.name} • {classData?.schedule}</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex items-center gap-1 bg-surface-950/50 p-1.5 rounded-2xl border border-surface-900 w-fit backdrop-blur-xl">
      <button 
        onclick={() => currentView = 'take'}
        class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'take' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-surface-500 hover:text-white'}`}
      >
        <Zap class="w-3.5 h-3.5" />
        Pasar Lista
      </button>
      <button 
        onclick={() => currentView = 'history'}
        class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'history' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-surface-500 hover:text-white'}`}
      >
        <History class="w-3.5 h-3.5" />
        Historial
      </button>
      <button 
        onclick={() => currentView = 'stats'}
        class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'stats' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-surface-500 hover:text-white'}`}
      >
        <BarChart3 class="w-3.5 h-3.5" />
        Estadísticas
      </button>
    </div>
  </div>

  {#if currentView === 'take'}
    <div class="space-y-8" in:fly={{ y: 20 }}>
      <!-- Activity Controls -->
      <div class="glass-panel p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t-4 border-primary-500 shadow-2xl">
         <div class="flex items-center gap-4">
            <div class="p-3 bg-surface-950 rounded-2xl border border-surface-900">
               <Calendar class="w-5 h-5 text-primary-400" />
            </div>
            <div>
               <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1">Fecha de Sesión</p>
               <input 
                 type="date" 
                 bind:value={selectedDate}
                 class="bg-transparent text-white font-black uppercase tracking-tighter outline-none cursor-pointer"
               />
            </div>
         </div>

         <div class="flex items-center gap-3">
            <button 
              onclick={() => {
                students.forEach(s => currentAttendance[s.id].status = 'P');
              }}
              class="bg-surface-950 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-emerald-500/50 transition-all flex items-center gap-2"
            >
              <CheckCircle class="w-4 h-4 text-emerald-400" />
              Todo OK
            </button>
            <button 
              onclick={handleSubmitAttendance}
              disabled={isSubmitting}
              class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center gap-3"
            >
              {#if isSubmitting}
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
              {:else}
                <Save class="w-4 h-4" />
              {/if}
              Finalizar Registro
            </button>
         </div>
      </div>

      <!-- Student Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {#each students as student}
          <div class="glass-panel p-6 flex items-center justify-between group hover:border-surface-700 transition-all relative overflow-hidden">
             <div class="flex items-center gap-5 relative z-10">
                <div class="w-14 h-14 bg-surface-950 rounded-2xl border border-surface-800 flex items-center justify-center text-primary-400 font-black text-lg group-hover:border-primary-500/50 transition-colors">
                   {student.name.charAt(0)}
                </div>
                <div>
                  <h3 class="text-white font-black uppercase text-sm leading-tight group-hover:text-primary-400 transition-colors">{student.name}</h3>
                  <div class="flex items-center gap-2 mt-1">
                     <span class="text-[9px] font-black text-surface-600 uppercase tracking-widest">{student.age} años</span>
                     <span class="w-1 h-1 rounded-full bg-surface-800"></span>
                     <span class="text-[9px] font-black text-surface-600 uppercase tracking-widest">{student.level}</span>
                  </div>
                </div>
             </div>

             <div class="flex items-center gap-3 relative z-10">
                <div class="flex bg-surface-950 p-1.5 rounded-2xl border border-surface-900 gap-1">
                   {#each Object.entries(statusThemes) as [status, theme]}
                      <button 
                        onclick={() => currentAttendance[student.id].status = status as AttendanceStatus}
                        class={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentAttendance[student.id]?.status === status ? `${theme.bg} ${theme.color} ${theme.border} shadow-lg scale-110` : 'text-surface-700 hover:text-surface-400'}`}
                        title={theme.label}
                      >
                         <theme.icon class="w-5 h-5" />
                      </button>
                   {/each}
                </div>
             </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if currentView === 'history'}
    <div class="space-y-6" in:fly={{ y: 20 }}>
      {#if recentAttendance.length === 0}
        <div class="glass-panel p-20 text-center space-y-4">
           <History class="w-16 h-16 text-surface-800 mx-auto" />
           <p class="text-[10px] font-black text-surface-600 uppercase tracking-widest">No hay registros históricos</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 gap-4">
          {#each recentAttendance as session}
            <div class="glass-panel p-6 group hover:border-primary-500/30 transition-all">
               <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div class="flex items-center gap-6">
                     <div class="w-12 h-12 bg-surface-950 border border-surface-800 rounded-2xl flex items-center justify-center text-primary-400">
                        <Calendar class="w-6 h-6" />
                     </div>
                     <div>
                        <h4 class="text-white font-black uppercase tracking-tight text-lg leading-none">
                          {new Date(session.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h4>
                        <div class="flex gap-4 mt-2">
                           <span class="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{session.records.filter((r: any) => r.status === 'P').length} OK</span>
                           <span class="text-[9px] font-black text-yellow-400 uppercase tracking-widest">{session.records.filter((r: any) => r.status === 'T').length} TARDE</span>
                           <span class="text-[9px] font-black text-red-400 uppercase tracking-widest">{session.records.filter((r: any) => r.status === 'A').length} FALTAS</span>
                        </div>
                     </div>
                  </div>
                  <button 
                    onclick={() => showHistoryForDate(session.date)}
                    class="bg-surface-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-primary-500/50 transition-all"
                  >
                    Ver Informe
                  </button>
               </div>

               {#if showingDate === session.date}
                 <div class="mt-8 pt-8 border-t border-surface-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" transition:fade>
                    {#each session.records as rec}
                      <div class="flex items-center justify-between p-3 bg-surface-950 border border-surface-900 rounded-xl">
                         <span class="text-[10px] font-black text-white uppercase truncate">{rec.student_name}</span>
                         <span class={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${statusThemes[rec.status as keyof typeof statusThemes].bg} ${statusThemes[rec.status as keyof typeof statusThemes].color}`}>
                           {statusThemes[rec.status as keyof typeof statusThemes].label}
                         </span>
                      </div>
                    {/each}
                 </div>
               {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>

  {:else if currentView === 'stats'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" in:fly={{ y: 20 }}>
      {#each attendanceStats as stats}
        <div class="glass-panel p-8 space-y-8 relative overflow-hidden group">
           <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-surface-950 rounded-2xl border border-surface-800 flex items-center justify-center text-primary-400 font-black text-lg">
                 {stats.student_name.charAt(0)}
              </div>
              <div>
                 <h4 class="text-white font-black uppercase text-sm leading-tight truncate max-w-[120px]">{stats.student_name}</h4>
                 <p class="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em]">{stats.attendance_rate}% RENDIMIENTO</p>
              </div>
           </div>

           <div class="grid grid-cols-3 gap-3">
              <div class="text-center p-3 bg-surface-950 border border-surface-900 rounded-2xl">
                 <p class="text-[8px] font-black text-emerald-400 uppercase mb-1">OK</p>
                 <p class="text-lg font-black text-white">{stats.present_count}</p>
              </div>
              <div class="text-center p-3 bg-surface-950 border border-surface-900 rounded-2xl">
                 <p class="text-[8px] font-black text-yellow-400 uppercase mb-1">TARDE</p>
                 <p class="text-lg font-black text-white">{stats.late_count}</p>
              </div>
              <div class="text-center p-3 bg-surface-950 border border-surface-900 rounded-2xl">
                 <p class="text-[8px] font-black text-red-400 uppercase mb-1">FALTA</p>
                 <p class="text-lg font-black text-white">{stats.absent_count}</p>
              </div>
           </div>

           <div class="space-y-4">
              <div class="flex items-baseline justify-between">
                 <span class="text-[9px] font-black text-surface-500 uppercase tracking-widest">Puntualidad</span>
                 <span class="text-xs font-black text-blue-400">{stats.punctuality_rate}%</span>
              </div>
              <div class="h-1.5 bg-surface-950 rounded-full border border-surface-900 overflow-hidden">
                 <div class="h-full bg-blue-500" style="width: {stats.punctuality_rate}%"></div>
              </div>
           </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Attendance detail styles */
</style>
