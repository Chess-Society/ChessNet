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
    Plus,
    Activity,
    ClipboardCheck,
    Timer
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  const attendanceData = $derived((data.attendanceData || {
    todayStats: { totalClasses: 0, classesWithAttendance: 0, totalStudents: 0, presentStudents: 0, attendanceRate: 0, absentStudents: 0 },
    centersWithClasses: [],
    upcomingClasses: [],
    recentAttendance: []
  }) as any);

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
  <title>Asistencia - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4 text-center md:text-left">
      <div class="flex items-center justify-center md:justify-start gap-3">
        <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400">
           <Activity class="w-6 h-6" />
        </div>
        <div>
           <h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Control de Asistencia</h1>
           <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Seguimiento en tiempo real</p>
        </div>
      </div>
    </div>

    <div class="bg-surface-950/50 border border-surface-900 px-6 py-4 rounded-3xl flex items-center gap-6 shadow-2xl backdrop-blur-xl">
       <div class="text-right">
          <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Estado del Sistema</p>
          <div class="flex items-center gap-2 justify-end">
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <p class="text-xs font-black text-white uppercase tracking-tighter">OPERATIVO</p>
          </div>
       </div>
       <div class="w-px h-8 bg-surface-900"></div>
       <div class="text-right">
          <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Hoy</p>
          <p class="text-xs font-black text-white uppercase tracking-tighter">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</p>
       </div>
    </div>
  </div>

  <!-- Realtime Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="glass-panel p-6 border-t-4 border-primary-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Calendar class="w-24 h-24" />
       </div>
       <div class="flex items-baseline justify-between mb-2">
          <h3 class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Clases Hoy</h3>
          <span class="text-[10px] font-black text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded uppercase">On Air</span>
       </div>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter">{attendanceData.todayStats.totalClasses}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">ACTIVA(S)</p>
       </div>
    </div>

    <div class="glass-panel p-6 border-t-4 border-blue-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Users class="w-24 h-24" />
       </div>
       <div class="flex items-baseline justify-between mb-2">
          <h3 class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Alumnos</h3>
          <p class="text-[10px] font-black text-blue-400 uppercase">Presentes</p>
       </div>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter">{attendanceData.todayStats.presentStudents}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">/ {attendanceData.todayStats.totalStudents}</p>
       </div>
    </div>

    <div class="glass-panel p-6 border-t-4 border-purple-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <TrendingUp class="w-24 h-24" />
       </div>
       <div class="flex items-baseline justify-between mb-2">
          <h3 class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Tasa Global</h3>
          <TrendingUp class="w-3.5 h-3.5 text-purple-400" />
       </div>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter">{attendanceData.todayStats.attendanceRate}%</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">MEDIA</p>
       </div>
    </div>

    <div class="glass-panel p-6 border-t-4 border-red-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <AlertTriangle class="w-24 h-24" />
       </div>
       <div class="flex items-baseline justify-between mb-2">
          <h3 class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Ausencias</h3>
          <span class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_red]"></span>
       </div>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter">{attendanceData.todayStats.absentStudents}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">FALTAS</p>
       </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <div class="lg:col-span-2 space-y-10">
      <!-- Active Monitoring -->
      <section class="space-y-6">
        <div class="flex items-center justify-between px-2">
           <h2 class="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
             <School class="w-5 h-5 text-primary-400" />
             Actividad por Centro
           </h2>
        </div>

        {#if attendanceData.centersWithClasses.length === 0}
          <div class="glass-panel p-16 text-center space-y-4">
             <div class="w-16 h-16 bg-surface-950 rounded-full border border-surface-900 flex items-center justify-center mx-auto text-surface-800">
                <Calendar class="w-8 h-8" />
             </div>
             <p class="text-[10px] font-black text-surface-600 uppercase tracking-widest">Sin sesiones activas en este momento</p>
          </div>
        {:else}
          <div class="space-y-6">
            {#each attendanceData.centersWithClasses as center, i}
              <div class="glass-panel overflow-hidden border-l-4 border-primary-500" in:fly={{ y: 20, delay: i * 100 }}>
                 <div class="p-8">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-surface-900">
                       <div class="flex items-center gap-5">
                          <div class="w-14 h-14 bg-surface-950 border border-surface-800 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">
                             <School class="w-7 h-7" />
                          </div>
                          <div>
                             <h3 class="text-xl font-black text-white uppercase tracking-tighter">{center.name}</h3>
                             <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]">{center.city} • {center.classes.length} GRUPOS</p>
                          </div>
                       </div>
                       
                       <div class="flex items-center gap-8">
                          <div class="text-right">
                             <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest mb-1">Rendimiento</p>
                             <div class="flex items-center gap-3 justify-end text-lg font-black text-white">
                                {center.attendanceRate}%
                                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
                             </div>
                          </div>
                          <button 
                            onclick={() => goto(`/schools/${center.id}`)}
                            class="p-3 bg-surface-950 border border-surface-900 rounded-xl text-surface-500 hover:text-primary-400 hover:border-primary-500/30 transition-all shadow-lg"
                          >
                            <Eye class="w-5 h-5" />
                          </button>
                       </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {#each center.classes as cls}
                          <div class="p-5 bg-surface-950/40 border border-surface-900 rounded-2xl hover:border-primary-500/20 transition-all group">
                             <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center gap-3">
                                   <div class="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                   <h4 class="text-xs font-black text-white uppercase truncate">{cls.name}</h4>
                                </div>
                                <span class="text-[9px] font-black text-surface-600 bg-surface-900 px-2 py-0.5 rounded uppercase tracking-tighter">{cls.time}</span>
                             </div>

                             <div class="flex items-end justify-between">
                                <div class="space-y-2">
                                   <div class="flex items-center gap-2">
                                      <span class="text-[10px] font-black text-white">{cls.present}</span>
                                      <span class="text-[10px] font-black text-surface-600">/ {cls.students}</span>
                                   </div>
                                   <div class="w-32 h-1.5 bg-surface-900 rounded-full overflow-hidden">
                                      <div 
                                        class="h-full bg-primary-500 transition-all duration-1000" 
                                        style="width: {cls.attendanceRate}%"
                                      ></div>
                                   </div>
                                </div>
                                <button 
                                  onclick={() => goto(`/classes/${cls.id}/attendance`)}
                                  class="flex items-center gap-2 text-[9px] font-black text-primary-400 uppercase tracking-widest hover:text-white transition-colors"
                                >
                                  Pasar Lista
                                  <ChevronRight class="w-3.5 h-3.5" />
                                </button>
                             </div>
                          </div>
                       {/each}
                    </div>
                 </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <!-- Upcoming Queue -->
      {#if attendanceData.upcomingClasses.length > 0}
        <section class="space-y-6">
           <h2 class="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3 px-2">
             <Timer class="w-5 h-5 text-blue-400" />
             En Cola de Inicio
           </h2>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each attendanceData.upcomingClasses as cls}
                <div class="glass-panel p-5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                   <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Clock class="w-6 h-6" />
                      </div>
                      <div>
                        <h4 class="text-sm font-black text-white uppercase tracking-tight leading-tight">{cls.name}</h4>
                        <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mt-0.5">{cls.time}</p>
                      </div>
                   </div>
                   <button 
                     onclick={() => goto(`/classes/${cls.id}/attendance`)}
                     class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-600 hover:text-primary-400 hover:border-primary-500/30 transition-all shadow-xl"
                     title="Abrir Control de Asistencia"
                   >
                     <ClipboardCheck class="w-5 h-5" />
                   </button>
                </div>
              {/each}
           </div>
        </section>
      {/if}
    </div>

    <!-- Sidebar Activity -->
    <div class="space-y-10">
      <section class="glass-panel p-8 space-y-8">
        <h2 class="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
          <CheckCircle class="w-5 h-5 text-emerald-400" />
          Registros Recientes
        </h2>
        
        {#if attendanceData.recentAttendance.length === 0}
          <div class="text-center py-10">
            <p class="text-[10px] font-black text-surface-700 uppercase tracking-widest">Sin actividad reciente</p>
          </div>
        {:else}
          <div class="space-y-8">
            {#each attendanceData.recentAttendance as rec, i}
              <div class="relative pl-8 border-l-2 border-surface-900 pb-2" in:fade={{ delay: i * 50 }}>
                <div class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] border-2 border-surface-950"></div>
                
                <div class="flex items-center justify-between mb-2">
                   <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest">{formatDate(rec.date)}</p>
                   <span class="text-[10px] font-black text-emerald-400">{rec.attendanceRate}%</span>
                </div>
                
                <h4 class="text-xs font-black text-white uppercase tracking-tighter mb-1">{rec.className}</h4>
                <p class="text-[9px] font-bold text-surface-400 uppercase tracking-widest truncate">{rec.centerName}</p>
                
                <div class="flex gap-2 mt-4">
                  <span class="px-2 py-1 bg-surface-950 text-emerald-400 text-[8px] font-black rounded border border-surface-900 uppercase tracking-widest">{rec.present} Presente(s)</span>
                  <span class="px-2 py-1 bg-surface-950 text-red-400 text-[8px] font-black rounded border border-surface-900 uppercase tracking-widest">{rec.absent} Falta(s)</span>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <!-- Direct Shortcuts -->
      <section class="space-y-4">
         <h3 class="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] px-2 italic">Accesos Rápidos</h3>
         <div class="space-y-3">
            <button 
              onclick={() => goto('/reports')}
              class="w-full glass-panel p-5 flex items-center justify-between group hover:border-primary-500/30 transition-all text-left"
            >
               <div class="flex items-center gap-4">
                  <div class="p-3 bg-surface-950 rounded-xl text-primary-400 border border-surface-900 group-hover:scale-110 transition-transform">
                     <BarChart3 class="w-5 h-5" />
                  </div>
                  <div>
                     <p class="text-[10px] font-black text-white uppercase">Informes Mensuales</p>
                     <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Analizar Tendencias</p>
                  </div>
               </div>
               <ChevronRight class="w-4 h-4 text-surface-700" />
            </button>

            <button 
              onclick={() => goto('/classes')}
              class="w-full glass-panel p-5 flex items-center justify-between group hover:border-primary-500/30 transition-all text-left"
            >
               <div class="flex items-center gap-4">
                  <div class="p-3 bg-surface-950 rounded-xl text-blue-400 border border-surface-900 group-hover:scale-110 transition-transform">
                     <Users class="w-5 h-5" />
                  </div>
                  <div>
                     <p class="text-[10px] font-black text-white uppercase">Todos los Grupos</p>
                     <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Gestión Académica</p>
                  </div>
               </div>
               <ChevronRight class="w-4 h-4 text-surface-700" />
            </button>
         </div>
      </section>
    </div>
  </div>
</div>

<style lang="postcss">
  /* Attendance styles */
</style>
