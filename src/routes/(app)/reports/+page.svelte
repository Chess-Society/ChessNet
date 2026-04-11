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
    Award,
    X,
    Sparkles,
    Zap,
    Download
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  interface StudentReport {
    student: {
      id: string;
      name: string;
      email: string;
      college_id: string;
    };
    college: {
      name: string;
    };
    progress_summary: {
      attendance_rate: number;
      skill_completion_rate: number;
      current_rating: number;
      overdue_payments: number;
    };
  }

  let { data } = $props<{ data: PageData & { studentsReports: StudentReport[] } }>();

  let searchTerm = $state('');
  let collegeFilter = $state('all');
  
  const filteredStudents = $derived(
    data.studentsReports?.filter((report) => {
      const name = report.student.name || '';
      const email = report.student.email || '';
      const college = report.college?.name || '';
      
      const matchesSearch = !searchTerm || 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCollege = collegeFilter === 'all' || report.student.college_id === collegeFilter;
      
      return matchesSearch && matchesCollege;
    }) || []
  );

  const colleges = $derived([...new Set((data.studentsReports || []).map((r: StudentReport) => ({ id: r.student.college_id, name: r.college.name })) || [])]);

  const getStatusTheme = (report: StudentReport) => {
    if (report.progress_summary.overdue_payments > 0) return 'text-red-400 border-red-500/20 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
    if (report.progress_summary.attendance_rate < 70) return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
    if (report.progress_summary.attendance_rate >= 90) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
  };

  const getStatusLabel = (report: StudentReport) => {
    if (report.progress_summary.overdue_payments > 0) return 'AVISO PAGO';
    if (report.progress_summary.attendance_rate < 70) return 'BAJA ASIST.';
    if (report.progress_summary.attendance_rate >= 90) return 'EXCEPCIONAL';
    return 'ESTÁNDAR';
  };
</script>

<svelte:head>
  <title>Análisis y Reportes - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">
          <Activity class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Centro Analítico</h1>
          <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Métricas de Rendimiento Académico</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button class="bg-surface-950/50 border border-surface-900 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:border-primary-500/30 transition-all flex items-center gap-2 backdrop-blur-xl group">
         <Sparkles class="w-4 h-4 text-primary-400 group-hover:animate-pulse" />
         IA Insights
      </button>
      <button class="bg-primary-500 text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center gap-2">
        <Download class="w-4 h-4" />
        Exportar CSV
      </button>
    </div>
  </div>

  <!-- Stats Dashboard -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="glass-panel p-8 border-t-4 border-primary-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Users class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Población Total</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter">{data.generalStats?.total_students || 0}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">Alumnos</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-blue-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Activity class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Actividad Semanal</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter">{data.generalStats?.active_students || 0}</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">Activos</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-emerald-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Calendar class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Asistencia Media</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter">{data.generalStats?.average_attendance_rate.toFixed(1)}%</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">Global</p>
       </div>
    </div>

    <div class="glass-panel p-8 border-t-4 border-purple-500 relative overflow-hidden group">
       <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Award class="w-24 h-24" />
       </div>
       <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Progreso Skills</p>
       <div class="flex items-end gap-3">
          <p class="text-4xl font-black text-white tracking-tighter">{data.generalStats?.average_skill_completion.toFixed(1)}%</p>
          <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">Completitud</p>
       </div>
    </div>
  </div>

  <!-- Search and Selection Filters -->
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-grow relative group">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors" />
      <input
        type="text"
        placeholder="BUSCAR ESTUDIANTE, EMAIL O CENTRO..."
        bind:value={searchTerm}
        class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all backdrop-blur-xl"
      />
    </div>

    <div class="relative group min-w-[240px]">
      <School class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
      <select 
        bind:value={collegeFilter} 
        class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-10 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl"
      >
        <option value="all">TODOS LOS CENTROS</option>
        {#each colleges as col: {id: string, name: string}}
          <option value={col.id}>{col.name.toUpperCase()}</option>
        {/each}
      </select>
    </div>

    <button 
      onclick={() => { searchTerm = ''; collegeFilter = 'all'; }}
      class="bg-surface-900/50 border border-surface-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all backdrop-blur-xl"
    >
      RESETEAR
    </button>
  </div>

  <!-- Results Table -->
  <div class="glass-panel overflow-hidden border-t-4 border-primary-500 shadow-2xl">
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-surface-950/80 border-b border-surface-900 backdrop-blur-xl">
            <th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500">Estudiante / Sede</th>
            <th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-center">Rendimiento</th>
            <th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-center">Elo Actual</th>
            <th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-center">Estatus</th>
            <th class="px-8 py-5"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-900/50">
          {#each filteredStudents as report, i}
            <tr class="hover:bg-primary-500/[0.02] transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-5">
                   <div class="w-12 h-12 bg-surface-950 border border-surface-800 rounded-2xl flex items-center justify-center text-primary-400 group-hover:border-primary-500/30 transition-all shadow-xl font-black">
                      {report.student.name.charAt(0)}
                   </div>
                   <div>
                      <h3 class="text-sm font-black text-white uppercase tracking-tight leading-none group-hover:text-primary-400 transition-colors">{report.student.name}</h3>
                      <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <School class="w-3 h-3" />
                        {report.college.name}
                      </p>
                   </div>
                </div>
              </td>
              <td class="px-8 py-6">
                 <div class="flex flex-col items-center gap-2.5">
                    <div class="flex items-center gap-6">
                       <div class="text-center">
                          <p class="text-[10px] font-black text-white">{report.progress_summary.attendance_rate.toFixed(0)}%</p>
                          <p class="text-[7px] font-black text-surface-600 uppercase tracking-widest">ASIST.</p>
                       </div>
                       <div class="text-center">
                          <p class="text-[10px] font-black text-white">{report.progress_summary.skill_completion_rate.toFixed(0)}%</p>
                          <p class="text-[7px] font-black text-surface-600 uppercase tracking-widest">SKILLS</p>
                       </div>
                    </div>
                    <div class="w-24 h-1.5 bg-surface-950 rounded-full border border-surface-900 overflow-hidden">
                       <div class="h-full bg-primary-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style="width: {(report.progress_summary.attendance_rate + report.progress_summary.skill_completion_rate)/2}%"></div>
                    </div>
                 </div>
              </td>
              <td class="px-8 py-6 text-center">
                 <div class="inline-block px-4 py-2 bg-surface-950 border border-surface-900 rounded-xl">
                    <p class="text-lg font-black text-white leading-none">{report.progress_summary.current_rating}</p>
                    <p class="text-[8px] font-black text-primary-400 uppercase tracking-widest mt-1">ELO RATING</p>
                 </div>
              </td>
              <td class="px-8 py-6 text-center">
                 <span class={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusTheme(report)}`}>
                   {getStatusLabel(report)}
                 </span>
              </td>
              <td class="px-8 py-6 text-right">
                 <button 
                   onclick={() => goto(`/reports/${report.student.id}`)}
                   class="p-3 bg-surface-950 border border-surface-800 rounded-2xl text-surface-500 hover:text-primary-400 hover:border-primary-500/30 transition-all shadow-xl group/btn"
                 >
                    <Eye class="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                 </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if filteredStudents.length === 0}
      <div class="p-24 text-center space-y-6">
         <div class="w-20 h-20 bg-surface-950 border border-surface-900 rounded-3xl flex items-center justify-center mx-auto text-surface-800">
            <BarChart3 class="w-10 h-10" />
         </div>
         <p class="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]">No hay registros para este filtro</p>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  /* Reports dashboard visual enhancements */
</style>
