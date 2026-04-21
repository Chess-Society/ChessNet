<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    CaretLeft,
    GraduationCap,
    Users,
    UsersThree,
    Target,
    UserCheck,
    UserPlus,
    Gear,
    Calendar,
    CalendarBlank,
    Clock,
    MapPin,
    CurrencyEur,
    TrendUp,
    BookOpen,
    Star,
    Phone,
    Envelope,
    Warning,
    CheckCircle,
    XCircle,
    Plus,
    PencilSimple,
    Eye,
    ChartBar,
    Trophy,
    Folders,
    ClipboardText,
    ArrowRight,
    Sparkle,
    Buildings,
    Selection,
    SelectionBackground,
    Shapes,
    ChartLineUp,
    ChartPie,
    Ranking,
    Lightbulb,
    Student
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { t } from '$lib/i18n';
  import { appStore } from '$lib/stores/appStore';

  let { data } = $props<{ data: PageData }>();

  const classData = $derived(data.class as any);
  const students = $derived((data.students || []) as any[]);
  const classSkills = $derived((data.classSkills || []) as any[]);
  const classStats = $derived(data.classStats || {});
  const attendanceStats = $derived(data.attendanceStats as any);

  let currentView = $state<'overview' | 'students' | 'skills' | 'lichess'>('overview');
  
  // Lichess Leaderboard State
  let leaderboards = $state<any[]>([]);
  let isFetchingLeaderboards = $state(false);
  let hasFetchedLeaderboards = $state(false);

  // Function to fetch all class students' data from Lichess in bulk
  async function loadLichessLeaderboards() {
    if (hasFetchedLeaderboards && !isFetchingLeaderboards) return;
    
    const validStudents = students.filter(s => s.lichess_username && s.lichess_username.trim().length > 0);
    
    if (validStudents.length === 0) {
      hasFetchedLeaderboards = true;
      leaderboards = [];
      return;
    }

    isFetchingLeaderboards = true;
    try {
      const usernames = validStudents.map(s => s.lichess_username.trim()).join(',');
      const res = await fetch(`https://lichess.org/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: usernames
      });
      
      if (res.ok) {
        const lichessDataArray = await res.json();
        leaderboards = validStudents.map(student => {
           const lData = lichessDataArray.find((d: any) => d.id.toLowerCase() === student.lichess_username.toLowerCase().trim());
           return {
             ...student,
             lichessData: lData || null
           };
        });
      } else {
        leaderboards = validStudents.map(s => ({ ...s, lichessData: null }));
      }
    } catch (e) {
      console.error("Failed to load leaderboards", e);
      leaderboards = validStudents.map(s => ({ ...s, lichessData: null }));
    } finally {
      isFetchingLeaderboards = false;
      hasFetchedLeaderboards = true;
    }
  }

  // Lichess Master Insights Achievements
  const lichessAchievements = $derived.by(() => {
    if (!leaderboards.length || leaderboards.every(l => !l.lichessData)) return null;
    
    const hasData = leaderboards.filter(l => l.lichessData);
    if (!hasData.length) return null;

    return {
      tacticalKing: [...hasData].sort((a,b) => (b.lichessData?.perfs?.puzzle?.rating || 0) - (a.lichessData?.perfs?.puzzle?.rating || 0))[0],
      risingStar: [...hasData].sort((a,b) => {
        const progA = (a.lichessData?.perfs?.blitz?.prog || 0) + (a.lichessData?.perfs?.rapid?.prog || 0);
        const progB = (b.lichessData?.perfs?.blitz?.prog || 0) + (b.lichessData?.perfs?.rapid?.prog || 0);
        return progB - progA;
      })[0],
      mostActive: [...hasData].sort((a,b) => (b.lichessData?.count?.all || 0) - (a.lichessData?.count?.all || 0))[0],
      speedDemon: [...hasData].sort((a,b) => (b.lichessData?.perfs?.bullet?.rating || 0) - (a.lichessData?.perfs?.bullet?.rating || 0))[0]
    };
  });



  $effect(() => {
    if (currentView === 'lichess' || (currentView === 'overview' && students.length > 0)) {
      loadLichessLeaderboards();
    }
  });

  const levelColors = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    advanced: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    mixed: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const levelLabels = $derived({
    beginner: $t('common.levels.beginner'),
    intermediate: $t('common.levels.intermediate'),
    advanced: $t('common.levels.advanced'),
    mixed: $t('common.levels.mixed')
  });

  const handleGoBack = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSchool = urlParams.get('from_school');
    if (fromSchool) goto(`/panel/schools/${fromSchool}`);
    else if (classData?.school_id) goto(`/panel/schools/${classData.school_id}`);
    else goto('/panel/classes');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: $t('common.currency_name') === 'EUR' ? 'EUR' : 'USD'
    }).format(amount);
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '??';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
</script>

<svelte:head>
  <title>{classData?.name} - ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto px-6 pb-24 pro-grid-bg min-h-screen" in:fade>
  <!-- Pro Sticky Header -->
  <div class="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 -mx-6 px-6 mb-12">
    <div class="max-w-[1400px] mx-auto py-4 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-6">
        <button 
          onclick={handleGoBack}
          class="w-10 h-10 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-violet-500/50 transition-all"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <div>
          <h1 class="text-xl font-mono font-bold text-white uppercase tracking-tighter flex items-center gap-3">
            <span class="text-violet-500 opacity-50">/</span>
            {classData?.name}
          </h1>
          <div class="flex items-center gap-4 mt-1">
            <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
              ID: {classData?.id?.substring(0, 8)}... <span class="mx-2 text-zinc-800">|</span> 
              STATUS: <span class="text-emerald-500">ACTIVE</span>
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1 bg-white/[0.02] border border-white/10 p-1">
        {#each ['overview', 'students', 'skills', 'lichess'] as view}
          <button 
            onclick={() => currentView = view as any}
            class="px-5 py-2 font-mono font-bold text-[10px] uppercase tracking-widest transition-all {currentView === view ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}"
          >
            {view}
          </button>
        {/each}
        
        <div class="w-[1px] h-4 bg-white/10 mx-2"></div>

        <button 
          onclick={() => goto(`/panel/classes/${classData?.id}/edit`)}
          class="p-2 text-zinc-500 hover:text-white transition-all"
        >
          <Gear weight="bold" size={16} />
        </button>
      </div>
    </div>
  </div>

  {#if currentView === 'overview'}
    <div class="space-y-12" in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Main Column: Details & Stats -->
        <div class="lg:col-span-8 space-y-12">
          <!-- Pro Class Details -->
          <div class="pro-card">
             <div class="pro-card-header">
                <div class="flex items-center gap-3">
                  <Folders weight="bold" class="w-4 h-4 text-violet-500" />
                  <h2 class="text-[11px] font-mono font-bold text-white uppercase tracking-[0.2em]">{$t('classes.details')}</h2>
                </div>
                <span class="text-[8px] font-mono text-zinc-700">SECTION_INFO_PRIMARY</span>
             </div>

             <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="space-y-8">
                  <div class="space-y-2">
                    <p class="pro-label">{$t('classes.schedule')}</p>
                    <p class="text-xl font-mono font-bold text-white uppercase flex items-center gap-3">
                      <Clock class="w-4 h-4 text-violet-500" />
                      {classData?.schedule}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="pro-label">{$t('classes.location')}</p>
                    <p class="text-sm font-mono text-zinc-400 uppercase flex items-center gap-3">
                      <MapPin class="w-4 h-4 text-violet-500" />
                      {classData?.room || $t('classes.to_be_defined')}
                    </p>
                  </div>
                </div>

                <div class="space-y-8">
                  <div class="space-y-2">
                    <p class="pro-label">{$t('classes.period')}</p>
                    <p class="text-sm font-mono text-zinc-400 uppercase">
                      {classData?.start_date ? new Date(classData.start_date).toLocaleDateString() : '??'} 
                      <span class="mx-2 text-zinc-700">>></span> 
                      {classData?.end_date ? new Date(classData.end_date).toLocaleDateString() : '??'}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="pro-label">{$t('classes.fee')}</p>
                    <p class="text-2xl font-mono font-bold text-emerald-500 tracking-tighter">
                      {formatCurrency(classData?.price || 0)}
                    </p>
                  </div>
                </div>
             </div>
          </div>

          <!-- Statistics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="pro-card">
               <div class="pro-card-header">
                  <p class="pro-label !mb-0">{$t('classes.occupancy')}</p>
                  <span class="text-[10px] font-mono text-white">{classStats?.occupancy_rate || 0}%</span>
               </div>
               <div class="p-8 space-y-4">
                  <div class="h-1 bg-zinc-900 overflow-hidden">
                     <div class="h-full bg-violet-600 transition-all duration-1000 ease-out" style="width: {classStats?.occupancy_rate || 0}%"></div>
                  </div>
                  <div class="flex justify-between font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                    <span>{classStats?.active_students || 0} ACTIVE</span>
                    <span>LIMIT: {classData?.max_students || 0}</span>
                  </div>
               </div>
            </div>

            <div class="pro-card">
               <div class="pro-card-header">
                  <p class="pro-label !mb-0">{$t('classes.attendance_rate')}</p>
                  <span class="text-[10px] font-mono text-emerald-500">{attendanceStats?.average_attendance_rate || 0}%</span>
               </div>
               <div class="p-8 grid grid-cols-2 gap-4">
                  <div class="border border-white/5 p-4 bg-white/[0.02]">
                    <p class="text-[8px] font-mono text-zinc-600 uppercase mb-1">PUNCTUALITY</p>
                    <p class="text-lg font-mono font-bold text-zinc-200">{attendanceStats?.average_punctuality_rate || 100}%</p>
                  </div>
                  <div class="border border-white/5 p-4 bg-white/[0.02]">
                    <p class="text-[8px] font-mono text-zinc-600 uppercase mb-1">PROGRESS</p>
                    <p class="text-lg font-mono font-bold text-zinc-200">88%</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Lichess Pulse & Quick Enrollment -->
        <div class="lg:col-span-4 space-y-12">
            <!-- Lichess Pulse -->
            <div class="bento-card bg-zinc-900/40 border border-white/5 rounded-none overflow-hidden group/lichess relative shadow-2xl">
               <div class="p-8 space-y-6">
                  <div class="flex items-center justify-between">
                     <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center text-sky-400 shadow-inner">
                           <ChartLineUp weight="duotone" size={20} />
                        </div>
                        <div>
                           <h3 class="text-sm font-black text-white uppercase tracking-tight font-outfit">Lichess Pulse</h3>
                           <p class="text-[7px] font-black text-slate-600 uppercase tracking-widest">Progreso en vivo</p>
                        </div>
                     </div>
                     <button 
                       onclick={() => currentView = 'lichess'}
                       class="p-2 bg-white/5 rounded-none border border-white/5 text-slate-400 hover:bg-sky-500 hover:text-white transition-all shadow-glow-blue-mini"
                     >
                       <Eye size={16} />
                     </button>
                  </div>

                  {#if leaderboards.length > 0}
                     <div class="space-y-2">
                        {#each leaderboards.slice(0, 3) as player}
                           <div class="flex items-center justify-between p-3 rounded-none bg-zinc-950/30 border border-white/5">
                              <div class="flex items-center gap-3">
                                 <div class="w-7 h-7 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-white font-black text-[9px] uppercase">
                                   {player.first_name?.charAt(0) || player.username?.charAt(0)}
                                 </div>
                                 <p class="text-[9px] font-bold text-slate-300 uppercase truncate max-w-[80px]">{player.first_name || player.username}</p>
                              </div>
                              <span class="text-sky-400 font-black text-[10px]">{player.lichessData?.perfs?.blitz?.rating || '---'}</span>
                           </div>
                        {/each}
                     </div>
                  {:else}
                     <div class="py-8 text-center bg-zinc-950/30 rounded-none border border-dashed border-white/5">
                        <p class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Sin datos vinculados</p>
                     </div>
                  {/if}
               </div>
            </div>

            <!-- Enrollment Actions -->
            <div class="space-y-4">
               <button 
                 onclick={() => goto(`/panel/classes/${classData?.id}/students`)}
                 class="w-full p-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none flex items-center justify-between group transition-all shadow-glow-emerald active:scale-[0.98]"
               >
                 <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-white/10 rounded-none flex items-center justify-center">
                       <UserCheck weight="bold" size={20} />
                    </div>
                    <div class="text-left">
                       <p class="text-[10px] font-black uppercase tracking-widest font-outfit">Matricular</p>
                       <p class="text-[8px] font-medium opacity-70 uppercase tracking-wider">Alumnos existentes</p>
                    </div>
                 </div>
                 <ArrowRight size={16} />
               </button>

               <button 
                 onclick={() => goto(`/panel/students/create?classId=${classData?.id}&schoolId=${classData?.school_id}`)}
                 class="w-full p-6 bg-zinc-900/60 hover:bg-white hover:text-black border border-white/10 text-white rounded-none flex items-center justify-between group transition-all active:scale-[0.98]"
               >
                 <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-white/5 group-hover:bg-black/5 rounded-none flex items-center justify-center">
                       <UserPlus weight="bold" size={20} />
                    </div>
                    <div class="text-left">
                       <p class="text-[10px] font-black uppercase tracking-widest font-outfit">Nuevo Alumno</p>
                       <p class="text-[8px] font-medium opacity-70 uppercase tracking-wider">Alta directa</p>
                    </div>
                 </div>
                 <ArrowRight size={16} />
               </button>
            </div>
        </div>
      </div>

      <!-- Full Width Student Roster Section -->
      <div id="student-roster" class="space-y-10 pt-10 border-t border-white/5">
         <div class="flex items-center justify-between">
            <div class="flex items-center gap-5">
               <div class="w-14 h-14 bg-zinc-950 rounded-none border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-glow-violet-mini">
                  <GraduationCap weight="duotone" size={32} />
               </div>
               <div>
                  <h3 class="text-4xl font-black text-white uppercase font-outfit tracking-tighter">{$t('students.records')}</h3>
                  <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic">{$t('students.count_total', { count: students.length })}</p>
               </div>
            </div>
            
            <div class="flex items-center gap-3">

                <button 
                  onclick={() => goto(`/panel/classes/${classData?.id}/students`)}
                  class="bg-white/5 hover:bg-white hover:text-black px-8 py-3 border border-white/5 rounded-none transition-all text-[9px] font-black uppercase tracking-[0.2em] font-outfit"
                >
                  Gestión de Alumnos
                </button>
            </div>
         </div>

         {#if students.length === 0}
            <div class="bento-card py-40 text-center space-y-8 bg-zinc-900/20 border-2 border-dashed border-white/5 rounded-none">
               <div class="w-20 h-20 bg-zinc-950/50 rounded-none flex items-center justify-center mx-auto text-slate-800 border border-white/5">
                  <UserPlus size={40} weight="duotone" />
               </div>
               <div class="space-y-3">
                  <h4 class="text-xl font-black text-white uppercase font-outfit">{$t('classes.no_students_yet') || 'No hay alumnos todavía'}</h4>
                  <p class="text-[10px] text-slate-600 uppercase tracking-widest max-w-sm mx-auto">Comienza matriculando a tu primer alumno para activar el seguimiento.</p>
               </div>
            </div>
         {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {#each students as student}
                  <div class="bg-zinc-900/40 border border-white/5 p-6 rounded-none hover:bg-zinc-900/60 hover:border-violet-500/40 transition-all group relative overflow-hidden shadow-xl flex flex-col justify-between">
                     <div class="relative z-10">
                        <div class="flex items-center justify-between mb-6">
                           <div class="w-12 h-12 bg-zinc-950 rounded-none border border-white/10 flex items-center justify-center text-violet-400 font-black text-xl font-outfit shadow-inner">
                              {student.first_name?.charAt(0) || student.name?.charAt(0) || '?'}
                           </div>
                           <div class="px-3 py-1 rounded-none text-[7px] font-black uppercase tracking-widest border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                             ACTIVO
                           </div>
                        </div>
                        
                        <div class="space-y-2 mb-6">
                           <h4 class="text-white font-black uppercase text-base leading-none font-outfit tracking-tighter truncate group-hover:text-violet-400 transition-colors">
                            {student.first_name || ''} {student.last_name || student.name || ''}
                           </h4>
                           <div class="flex items-center gap-2">
                               <p class="text-[8px] text-slate-500 font-black uppercase tracking-wider">{calculateAge(student.date_of_birth)} AÑOS</p>
                               <div class="w-0.5 h-0.5 rounded-none bg-slate-700"></div>
                               <p class="text-[8px] text-violet-400 font-black uppercase tracking-wider">{student.chess_level || 'MIXTO'}</p>
                           </div>
                        </div>
                     </div>

                     <button 
                        onclick={() => goto(`/panel/students/${student.id}`)}
                        class="w-full py-3 bg-zinc-950 border border-white/5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all relative z-10"
                     >
                        Ver Perfil
                     </button>
                  </div>
               {/each}
            </div>
         {/if}
      </div>
   </div>
  {:else if currentView === 'skills'}
    <div class="space-y-12" in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-1.5 bg-violet-600 rounded-none shadow-glow-violet"></div>
              <h2 class="text-5xl font-black text-white uppercase tracking-tighter font-outfit">{$t('classes.syllabus')}</h2>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-11 italic">{$t('classes.roadmap_objectives')}</p>
         </div>
         <button 
            onclick={() => goto(`/panel/classes/${classData.id}/skills`)}
            class="bg-white text-black px-12 py-4.5 rounded-none text-[11px] font-black uppercase tracking-[0.3em] hover:bg-violet-600 hover:text-white transition-all flex items-center gap-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] active:scale-95 font-outfit group"
          >
           <Plus weight="bold" size={20} class="group-hover:rotate-90 transition-transform duration-500" />
           {$t('common.manage')}
         </button>
      </div>

      {#if classSkills.length === 0}
         <div class="bento-card py-44 px-12 text-center space-y-12 bg-zinc-900/40 border-2 border-dashed border-white/10 rounded-none shadow-2xl group/empty relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)]"></div>
            <div class="w-44 h-44 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center mx-auto text-slate-800 shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)] group-hover/empty:scale-110 group-hover/empty:border-emerald-500/20 transition-all duration-1000 relative z-10">
               <Target weight="duotone" size={88} class="group-hover/empty:text-emerald-400 transition-colors duration-700" />
            </div>
            <div class="space-y-6 relative z-10">
              <h3 class="text-4xl font-black text-white uppercase font-outfit tracking-tighter">{$t('classes.no_syllabus')}</h3>
              <p class="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] font-jakarta max-w-sm mx-auto leading-relaxed">{$t('classes.no_syllabus_desc') || 'Define your strategic educational path and milestones for this class.'}</p>
            </div>
         </div>
      {:else}
         <div class="space-y-12">
            {#each classSkills as skill, i}
               <div 
                 class="bento-card p-12 flex flex-col lg:flex-row lg:items-center gap-16 bg-zinc-900/40 border border-white/5 group hover:border-violet-500/40 hover:bg-zinc-900/70 transition-all duration-700 rounded-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden"
                 in:fly={{ x: -30, delay: i * 100, duration: 800, easing: cubicOut }}
               >
                  <div class="absolute -right-32 -bottom-32 text-white/[0.01] group-hover:text-violet-500/[0.05] transition-all duration-[2000ms] rotate-12 scale-150 pointer-events-none">
                     <Target size={400} weight="fill" />
                  </div>

                  <div class="text-8xl font-black text-white/[0.04] group-hover:text-violet-600/10 transition-all duration-1000 font-outfit relative z-10 w-28 select-none group-hover:scale-110 group-hover:-translate-x-4 tracking-tighter leading-none">
                     {(i+1).toString().padStart(2, '0')}
                  </div>
                  
                  <div class="flex-1 space-y-8 relative z-10">
                     <div class="flex flex-wrap items-center gap-6">
                        <h4 class="text-4xl font-black text-white uppercase font-outfit tracking-tighter group-hover:text-violet-400 transition-all duration-700 leading-none">{skill.skill.name}</h4>
                        <div class="flex items-center gap-2 px-5 py-2 rounded-none border border-violet-500/20 bg-violet-600/10 shadow-glow-violet-mini backdrop-blur-md">
                           <Shapes size={14} weight="duotone" class="text-violet-400" />
                           <span class="text-[9px] font-black text-violet-300 uppercase tracking-[0.2em] font-outfit">
                             {skill.skill.category?.name}
                           </span>
                        </div>
                     </div>
                     <p class="text-slate-400 text-lg font-medium leading-relaxed max-w-4xl font-jakarta uppercase tracking-tight group-hover:text-slate-200 transition-all duration-700">{skill.skill.description}</p>
                  </div>

                  <div class="flex flex-col items-center gap-6 relative z-10 bg-zinc-950/90 p-10 rounded-none border border-white/5 shadow-[inset_0_4px_25px_rgba(0,0,0,0.8)] min-w-[220px] group-hover:border-violet-500/30 transition-all duration-1000 group/rating">
                     <div class="flex items-center gap-3">
                       <Ranking size={20} weight="duotone" class="text-violet-500/80 group-hover/rating:scale-110 transition-transform" />
                       <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-outfit">{$t('common.difficulty') || 'Difficulty'}</p>
                     </div>
                     <div class="flex items-center gap-3.5">
                        {#each Array(5) as _, j}
                           <div 
                             class={`w-3.5 h-12 rounded-none transition-all duration-1000 ease-out ${j < skill.skill.difficulty ? 'bg-gradient-to-t from-violet-600 to-indigo-500 shadow-glow-violet' : 'bg-white/5'}`} 
                             style="transform: translateY({Math.sin(j + i) * 6}px); transition-delay: {j * 100}ms"
                           ></div>
                        {/each}
                     </div>
                     <div class="pt-6 flex items-center gap-3">
                        {#each Array(5) as _, j}
                           <Star 
                             weight={j < skill.skill.difficulty ? 'fill' : 'duotone'} 
                             size={18} 
                             class={`transition-all duration-1000 ${j < skill.skill.difficulty ? 'text-violet-500 shadow-glow-violet-text' : 'text-slate-800'}`} 
                             style="transition-delay: {(4-j) * 100}ms"
                           />
                        {/each}
                     </div>
                  </div>
               </div>
            {/each}
         </div>
      {/if}
    </div>
  {:else if currentView === 'lichess'}
    <div class="space-y-12" in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div class="space-y-3">
            <div class="flex items-center gap-3">
               <div class="w-8 h-1.5 bg-sky-500 rounded-none shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
               <h2 class="text-5xl font-black text-white uppercase tracking-tighter font-outfit">Lichess Master Insights</h2>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-11 italic">Inteligencia y Rendimiento en Tiempo Real</p>
         </div>
         <button 
           onclick={() => { hasFetchedLeaderboards = false; loadLichessLeaderboards(); }}
           class="p-4 bg-zinc-900 border border-white/10 rounded-none text-sky-400 hover:bg-sky-500 hover:text-white transition-all shadow-xl active:scale-90 group"
           title="Refrescar Datos"
         >
           <ChartLineUp weight="bold" size={24} class={isFetchingLeaderboards ? 'animate-spin' : 'group-hover:scale-110 transition-transform'} />
         </button>
      </div>

      {#if isFetchingLeaderboards && !leaderboards.length}
         <div class="flex flex-col items-center justify-center py-40">
            <div class="w-12 h-12 rounded-none border-4 border-sky-500/20 border-t-sky-500 animate-spin mb-6"></div>
            <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] font-outfit animate-pulse">Analizando ecosistema Lichess...</p>
         </div>
      {:else if leaderboards.length > 0}
          <!-- Master Achievements -->
          {#if lichessAchievements}
            {@const ach = lichessAchievements}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
               <!-- Tactical King -->
               <div class="pro-card !bg-zinc-900/40 border-violet-500/30 p-6 relative group/ach overflow-hidden">
                  <div class="absolute -right-4 -bottom-4 text-violet-500/10 group-hover/ach:scale-110 transition-transform duration-700">
                     <Target size={80} weight="fill" />
                  </div>
                  <p class="text-[8px] font-black text-violet-400 uppercase tracking-widest mb-3">REPRO DE LA TÁCTICA</p>
                  <h4 class="text-white font-black uppercase text-sm truncate font-outfit">{ach.tacticalKing.first_name || ach.tacticalKing.username}</h4>
                  <p class="text-2xl font-black text-violet-500 mt-2 font-outfit tracking-tighter">{ach.tacticalKing.lichessData?.perfs?.puzzle?.rating || 0} <span class="text-[10px] text-slate-600 font-bold ml-1">ELO PUZZLE</span></p>
               </div>

               <!-- Rising Star -->
               <div class="pro-card !bg-zinc-900/40 border-emerald-500/30 p-6 relative group/ach overflow-hidden">
                  <div class="absolute -right-4 -bottom-4 text-emerald-500/10 group-hover/ach:scale-110 transition-transform duration-700">
                     <TrendUp size={80} weight="fill" />
                  </div>
                  <p class="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-3">ESTRELLA EMERGENTE</p>
                  <h4 class="text-white font-black uppercase text-sm truncate font-outfit">{ach.risingStar.first_name || ach.risingStar.username}</h4>
                  <p class="text-2xl font-black text-emerald-500 mt-2 font-outfit tracking-tighter">
                    +{(ach.risingStar.lichessData?.perfs?.blitz?.prog || 0) + (ach.risingStar.lichessData?.perfs?.rapid?.prog || 0)}
                    <span class="text-[10px] text-slate-600 font-bold ml-1">PROGRESO COMB.</span>
                  </p>
               </div>

               <!-- Most Active -->
               <div class="pro-card !bg-zinc-900/40 border-amber-500/30 p-6 relative group/ach overflow-hidden">
                  <div class="absolute -right-4 -bottom-4 text-amber-500/10 group-hover/ach:scale-110 transition-transform duration-700">
                     <Selection size={80} weight="fill" />
                  </div>
                  <p class="text-[8px] font-black text-amber-400 uppercase tracking-widest mb-3">MÁXIMO ESFUERZO</p>
                  <h4 class="text-white font-black uppercase text-sm truncate font-outfit">{ach.mostActive.first_name || ach.mostActive.username}</h4>
                  <p class="text-2xl font-black text-amber-500 mt-2 font-outfit tracking-tighter">{ach.mostActive.lichessData?.count?.all || 0} <span class="text-[10px] text-slate-600 font-bold ml-1">PARTIDAS JUGADAS</span></p>
               </div>

               <!-- Speed Demon -->
               <div class="pro-card !bg-zinc-900/40 border-sky-500/30 p-6 relative group/ach overflow-hidden">
                  <div class="absolute -right-4 -bottom-4 text-sky-500/10 group-hover/ach:scale-110 transition-transform duration-700">
                     <Sparkle size={80} weight="fill" />
                  </div>
                  <p class="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-3">MAESTRO DE LA VELOCIDAD</p>
                  <h4 class="text-white font-black uppercase text-sm truncate font-outfit">{ach.speedDemon.first_name || ach.speedDemon.username}</h4>
                  <p class="text-2xl font-black text-sky-500 mt-2 font-outfit tracking-tighter">{ach.speedDemon.lichessData?.perfs?.bullet?.rating || 0} <span class="text-[10px] text-slate-600 font-bold ml-1">ELO BULLET</span></p>
               </div>
            </div>
          {/if}

          <!-- Unified Leaderboard Table -->
          <div class="pro-card overflow-hidden !bg-black/40 border border-white/5 relative">
             <div class="pro-card-header !bg-zinc-900/60 flex justify-between items-center px-10 py-6">
                <div class="flex items-center gap-3">
                   <ChartBar weight="bold" class="text-sky-500" size={18} />
                   <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] font-outfit">Análisis Comparativo de Alumnos</h3>
                </div>
                <div class="flex gap-10">
                   <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">En Línea</span>
                   </div>
                   <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                      <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">Desconocido</span>
                   </div>
                </div>
             </div>

             <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                   <thead>
                      <tr class="border-b border-white/5">
                         <th class="px-10 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Alumno</th>
                         <th class="px-6 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Blitz</th>
                         <th class="px-6 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Rapid</th>
                         <th class="px-6 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Bullet</th>
                         <th class="px-6 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Puzzles</th>
                         <th class="px-6 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Partidas</th>
                         <th class="px-10 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Acción</th>
                      </tr>
                   </thead>
                   <tbody class="divide-y divide-white/5">
                      {#each [...leaderboards].sort((a,b) => (b.lichessData?.perfs?.rapid?.rating || 0) - (a.lichessData?.perfs?.rapid?.rating || 0)) as student}
                         <tr class="hover:bg-white/[0.02] transition-colors group">
                            <td class="px-10 py-6">
                               <div class="flex items-center gap-4">
                                  <div class="relative">
                                     <div class="w-10 h-10 bg-zinc-900 border border-white/5 rounded-none flex items-center justify-center text-white font-black text-xs uppercase font-outfit">
                                        {student.first_name?.charAt(0) || student.username?.charAt(0)}
                                     </div>
                                     <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-zinc-950 rounded-none flex items-center justify-center border border-white/10">
                                        <div class="w-1.5 h-1.5 {student.lichessData?.online ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-slate-700'}"></div>
                                     </div>
                                  </div>
                                  <div>
                                     <p class="text-white font-black text-sm uppercase tracking-tight font-outfit leading-none mb-1.5">{student.first_name || ''} {student.last_name || student.name || ''}</p>
                                     <p class="text-[9px] text-slate-600 font-bold uppercase tracking-widest">@{student.lichess_username}</p>
                                  </div>
                               </div>
                            </td>
                            
                            <!-- Blitz -->
                            <td class="px-6 py-6 text-center">
                               <p class="text-base font-black text-white font-outfit tracking-tighter">{student.lichessData?.perfs?.blitz?.rating || '---'}</p>
                               {#if student.lichessData?.perfs?.blitz?.prog}
                                 <p class="text-[8px] font-bold {student.lichessData.perfs.blitz.prog >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                                   {student.lichessData.perfs.blitz.prog >= 0 ? '+' : ''}{student.lichessData.perfs.blitz.prog}
                                 </p>
                               {/if}
                            </td>

                            <!-- Rapid -->
                            <td class="px-6 py-6 text-center">
                               <p class="text-base font-black text-white font-outfit tracking-tighter">{student.lichessData?.perfs?.rapid?.rating || '---'}</p>
                               {#if student.lichessData?.perfs?.rapid?.prog}
                                 <p class="text-[8px] font-bold {student.lichessData.perfs.rapid.prog >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                                   {student.lichessData.perfs.rapid.prog >= 0 ? '+' : ''}{student.lichessData.perfs.rapid.prog}
                                 </p>
                               {/if}
                            </td>

                            <!-- Bullet -->
                            <td class="px-6 py-6 text-center">
                               <p class="text-base font-black text-slate-400 font-outfit tracking-tighter">{student.lichessData?.perfs?.bullet?.rating || '---'}</p>
                            </td>

                            <!-- Puzzles -->
                            <td class="px-6 py-6 text-center">
                               <p class="text-base font-black text-violet-400 font-outfit tracking-tighter">{student.lichessData?.perfs?.puzzle?.rating || '---'}</p>
                               <p class="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{student.lichessData?.count?.puzzle || 0} res.</p>
                            </td>

                            <!-- Total Games -->
                            <td class="px-6 py-6 text-center">
                               <p class="text-base font-black text-slate-500 font-outfit tracking-tighter">{student.lichessData?.count?.all || 0}</p>
                               <p class="text-[8px] text-slate-700 font-bold uppercase tracking-widest">Juegos</p>
                            </td>

                            <td class="px-10 py-6 text-right">
                               <div class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                  <a 
                                    href="https://lichess.org/@/{student.lichess_username}" 
                                    target="_blank"
                                    class="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition-all shadow-glow-blue-mini"
                                  >
                                    <Eye size={16} weight="bold" />
                                  </a>
                                  <button 
                                    onclick={() => goto(`/panel/students/${student.id}`)}
                                    class="p-2.5 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all"
                                  >
                                    <ArrowRight size={16} weight="bold" />
                                  </button>
                               </div>
                            </td>
                         </tr>
                      {/each}
                   </tbody>
                </table>
             </div>
          </div>
       {:else}
          <div class="bento-card py-40 text-center space-y-8 bg-zinc-900/20 border-2 border-dashed border-white/5 rounded-none">
             <div class="w-20 h-20 bg-zinc-950/50 rounded-none flex items-center justify-center mx-auto text-slate-800 border border-white/5">
                <ChartLineUp size={40} weight="duotone" />
             </div>
             <div class="space-y-3">
                <h4 class="text-xl font-black text-white uppercase font-outfit">Sin ecosistema Lichess detectado</h4>
                <p class="text-[10px] text-slate-600 uppercase tracking-widest max-w-sm mx-auto">Vincule nombres de usuario de Lichess en los perfiles de sus alumnos para activar este panel de inteligencia.</p>
             </div>
          </div>
       {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  :global(.shadow-glow-violet) {
    box-shadow: 0 0 20px -3px rgba(139, 92, 246, 0.4);
  }
  :global(.shadow-glow-blue) {
    box-shadow: 0 0 20px -3px rgba(59, 130, 246, 0.4);
  }
  :global(.shadow-glow-emerald) {
    box-shadow: 0 0 20px -3px rgba(16, 185, 129, 0.4);
  }
  :global(.shadow-glow-violet-mini) {
    box-shadow: 0 0 10px -2px rgba(139, 92, 246, 0.5);
  }
  :global(.shadow-glow-blue-mini) {
    box-shadow: 0 0 10px -2px rgba(59, 130, 246, 0.5);
  }
  :global(.shadow-glow-emerald-mini) {
    box-shadow: 0 0 10px -2px rgba(16, 185, 129, 0.5);
  }
  :global(.shadow-glow-emerald-text) {
    filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.5));
  }
  :global(.shadow-glow-violet-text) {
    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
  }
  :global(.shadow-glow-amber) {
    box-shadow: 0 0 20px -3px rgba(217, 119, 6, 0.4);
  }
  :global(.shadow-glow-amber-mini) {
    box-shadow: 0 0 10px -2px rgba(217, 119, 6, 0.5);
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 3s infinite linear;
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 4s infinite ease-in-out;
  }

  .drop-shadow-glow-emerald {
    filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
  }

  /* Custom Scrollbar Squared */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.2);
    border-radius: 0;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.4);
  }
</style>
