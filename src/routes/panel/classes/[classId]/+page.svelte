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

  let { data } = $props<{ data: PageData }>();

  const classData = $derived(data.class as any);
  const students = $derived((data.students || []) as any[]);
  const classSkills = $derived((data.classSkills || []) as any[]);
  const classStats = $derived(data.classStats as any);
  const attendanceStats = $derived(data.attendanceStats as any);

  let currentView = $state<'overview' | 'students' | 'skills'>('overview');

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
</script>

<svelte:head>
  <title>{classData?.name} - ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto px-6 pb-24" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 pt-16">
    <div class="space-y-8">
      <button 
        onclick={handleGoBack}
        class="flex items-center gap-3 text-slate-500 hover:text-violet-400 transition-all group text-[10px] font-black uppercase tracking-[0.4em] font-outfit"
      >
        <CaretLeft weight="bold" class="transition-transform group-hover:-translate-x-2" />
        {$t('common.back')}
      </button>

      <div class="flex items-center gap-10">
        <div class="relative group">
          <div class="absolute -inset-4 bg-violet-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100"></div>
          <div class="w-24 h-24 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.25rem] flex items-center justify-center text-violet-400 shadow-2xl relative z-10 overflow-hidden group/icon hover:border-violet-500/50 transition-colors">
            <div class="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-transparent"></div>
            <GraduationCap weight="duotone" size={52} class="relative z-10 group-hover/icon:scale-110 transition-transform duration-500" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-3">
            <span class={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-glow-violet-mini ${levelColors[classData?.level as keyof typeof levelColors] || levelColors.mixed}`}>
              {levelLabels[classData?.level as keyof typeof levelColors] || $t('common.unknown')}
            </span>
            {#if classData?.school}
              <span class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-outfit">
                {classData.school.name}
              </span>
            {/if}
          </div>
          <h1 class="text-5xl md:text-6xl font-outfit font-black text-white tracking-tighter uppercase leading-none">
            {classData?.name}
          </h1>
          <div class="flex flex-wrap items-center gap-8 mt-5">
            <div class="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-widest font-jakarta">
              <Clock weight="duotone" size={18} class="text-violet-500" />
              {classData?.schedule}
            </div>
            <div class="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-widest font-jakarta">
              <UsersThree weight="duotone" size={18} class="text-blue-500" />
              <span class="text-white">{classStats?.active_students}</span> / {classData?.max_students} {$t('classes.students_short')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-[2.5rem] border border-white/5 backdrop-blur-2xl shadow-2xl">
      <button 
        onclick={() => goto(`/panel/classes/${classData.id}/attendance`)}
        class="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 transition-all flex items-center gap-4 border border-transparent hover:border-white/10 font-outfit group"
      >
        <ClipboardText weight="duotone" size={22} class="text-violet-400 group-hover:scale-110 transition-transform" />
        {$t('classes.attendance')}
      </button>
      <button 
        onclick={() => goto(`/panel/classes/${classData.id}/edit`)}
        class="bg-white text-black px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-violet-600 hover:text-white transition-all shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] flex items-center gap-4 active:scale-95 font-outfit group"
      >
        <Gear weight="duotone" size={22} class="group-hover:rotate-90 transition-transform duration-700" />
        {$t('classes.configure')}
      </button>
    </div>
  </div>

  <!-- Perspective Navigation -->
  <div class="flex items-center gap-3 mb-16 p-2 bg-zinc-900/40 rounded-[2rem] border border-white/5 w-fit backdrop-blur-3xl shadow-2xl relative z-20">
    <button 
      onclick={() => currentView = 'overview'}
      class={`px-12 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 font-outfit group ${currentView === 'overview' ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
      <ChartPie weight={currentView === 'overview' ? 'fill' : 'duotone'} size={20} class={currentView === 'overview' ? 'text-black' : 'text-slate-500 group-hover:text-white'} />
      {$t('classes.overview')}
    </button>
    <button 
      onclick={() => currentView = 'students'}
      class={`px-12 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 font-outfit group ${currentView === 'students' ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
      <Users weight={currentView === 'students' ? 'fill' : 'duotone'} size={20} class={currentView === 'students' ? 'text-black' : 'text-slate-500 group-hover:text-white'} />
      {$t('classes.students')}
      <span class={`ml-1 text-[9px] font-black opacity-40 ${currentView === 'students' ? 'text-black' : 'text-slate-500'}`}>({students.length})</span>
    </button>
    <button 
      onclick={() => currentView = 'skills'}
      class={`px-12 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 font-outfit group ${currentView === 'skills' ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
      <Target weight={currentView === 'skills' ? 'fill' : 'duotone'} size={20} class={currentView === 'skills' ? 'text-black' : 'text-slate-500 group-hover:text-white'} />
      {$t('classes.syllabus')}
      <span class={`ml-1 text-[9px] font-black opacity-40 ${currentView === 'skills' ? 'text-black' : 'text-slate-500'}`}>({classSkills.length})</span>
    </button>
  </div>

  {#if currentView === 'overview'}
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12" in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
      <!-- Strategic Metrics Grid -->
      <div class="lg:col-span-8 space-y-12">
        <!-- Dashboard Core Bento -->
        <div class="bento-card p-12 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] relative overflow-hidden group/details shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5)]">
           <div class="absolute -right-32 -top-32 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none group-hover/details:bg-violet-600/20 transition-all duration-1000 scale-95 group-hover:scale-105"></div>
           <div class="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

           <div class="flex items-center justify-between mb-16 relative z-10">
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-violet-500 shadow-glow-violet"></div>
                  <h2 class="text-3xl font-black text-white tracking-tighter font-outfit uppercase">{$t('classes.details')}</h2>
                </div>
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-5 italic">{$t('classes.operational_intel')}</p>
              </div>
              <div class="p-4 bg-zinc-950/80 rounded-[1.75rem] border border-white/10 text-violet-400 shadow-inner scale-110 group-hover/details:rotate-12 transition-transform duration-700">
                <Folders weight="duotone" size={32} />
              </div>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 relative z-10">
              <div class="space-y-12">
                <div class="flex items-start gap-8 group/item">
                  <div class="p-5 bg-zinc-950 rounded-3xl text-violet-400 border border-white/5 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)] group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-500">
                    <Clock weight="duotone" size={28} />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 font-outfit group-hover/item:text-violet-400 transition-colors">{$t('classes.schedule')}</p>
                    <p class="text-white font-black text-2xl font-jakarta uppercase tracking-tight leading-tight">{classData?.schedule}</p>
                  </div>
                </div>

                <div class="flex items-start gap-8 group/item">
                  <div class="p-5 bg-zinc-950 rounded-3xl text-blue-400 border border-white/5 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)] group-hover/item:scale-110 group-hover/item:-rotate-3 transition-all duration-500">
                    <MapPin weight="duotone" size={28} />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 font-outfit group-hover/item:text-blue-400 transition-colors">{$t('classes.location')}</p>
                    <p class="text-white font-black text-2xl font-jakarta uppercase tracking-tight leading-tight">{classData?.room || $t('classes.to_be_defined')}</p>
                  </div>
                </div>
              </div>

              <div class="space-y-12">
                <div class="flex items-start gap-8 group/item">
                  <div class="p-5 bg-zinc-950 rounded-3xl text-amber-500 border border-white/5 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)] group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-500">
                    <CalendarBlank weight="duotone" size={28} />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 font-outfit group-hover/item:text-amber-500 transition-colors">{$t('classes.period')}</p>
                    <p class="text-white font-bold text-lg font-jakarta uppercase tracking-tight leading-tight flex flex-wrap items-center gap-3">
                      <span class="bg-white/5 px-3 py-1 rounded-xl border border-white/5">{new Date(classData?.start_date).toLocaleDateString()}</span>
                      <ArrowRight size={14} class="text-slate-600" /> 
                      <span class="bg-white/5 px-3 py-1 rounded-xl border border-white/5">{new Date(classData?.end_date).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-8 group/item">
                  <div class="p-5 bg-zinc-950 rounded-3xl text-emerald-400 border border-white/5 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)] group-hover/item:scale-110 group-hover/item:-rotate-3 transition-all duration-500">
                    <CurrencyEur weight="duotone" size={28} />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 font-outfit group-hover/item:text-emerald-400 transition-colors">{$t('classes.fee')}</p>
                    <p class="text-emerald-400 font-black text-4xl font-outfit uppercase tracking-tighter leading-none drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]">{formatCurrency(classData?.price || 0)}</p>
                  </div>
                </div>
              </div>
           </div>

           {#if classData?.description}
             <div class="mt-16 bg-zinc-950/60 border border-white/5 p-10 rounded-[2.5rem] relative z-10 shadow-inner group/desc hover:border-violet-500/20 transition-all duration-500">
               <div class="flex items-center gap-3 mb-6">
                 <Lightbulb weight="duotone" size={20} class="text-violet-500 animate-pulse" />
                 <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-outfit">{$t('classes.description')}</h3>
               </div>
               <p class="text-slate-400 text-lg leading-relaxed font-medium font-jakarta uppercase tracking-tight group-hover/desc:text-slate-300 transition-colors">{classData.description}</p>
             </div>
           {/if}
        </div>

        <!-- Metric Pulse Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Occupancy Bento -->
          <div class="bento-card p-12 bg-zinc-900/30 border border-white/5 rounded-[3.5rem] space-y-10 relative overflow-hidden group/occupancy shadow-2xl">
             <div class="absolute -right-16 -top-16 text-white/[0.02] rotate-12 scale-150 pointer-events-none group-hover/occupancy:text-blue-500/10 transition-colors duration-1000">
                <UsersThree weight="fill" size={200} />
             </div>
             <div class="flex items-center justify-between relative z-10">
                <div class="p-4 bg-blue-500/15 border border-blue-500/20 rounded-2xl text-blue-400 shadow-glow-blue-mini group-hover/occupancy:scale-110 transition-transform">
                   <ChartPie weight="duotone" size={28} />
                </div>
                <div class="text-right">
                   <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-outfit mb-1">{$t('classes.occupancy')}</p>
                   <p class="text-5xl font-black text-white font-outfit tracking-tighter leading-none">{classStats?.occupancy_rate}%</p>
                </div>
             </div>
             <div class="space-y-4 relative z-10">
                <div class="h-4 bg-zinc-950 rounded-full border border-white/5 overflow-hidden p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                   <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-[1500ms] ease-out shadow-glow-blue" style="width: {classStats?.occupancy_rate}%">
                      <div class="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer"></div>
                   </div>
                </div>
                <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] font-jakarta text-slate-500">
                   <div class="flex items-center gap-2">
                     <span class="text-white bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-500/30">{classStats?.active_students}</span>
                     <span>{$t('classes.active_students')}</span>
                   </div>
                   <div class="flex items-center gap-2">
                     <span>{$t('classes.limit')}</span>
                     <span class="text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{classData?.max_students}</span>
                   </div>
                </div>
             </div>
          </div>

          <!-- Attendance Pulse -->
          <div class="bento-card p-12 bg-zinc-900/30 border border-white/5 rounded-[3.5rem] space-y-10 relative overflow-hidden group/performance shadow-2xl">
             <div class="absolute -right-16 -top-16 text-white/[0.02] -rotate-12 scale-150 pointer-events-none group-hover/performance:text-emerald-500/10 transition-colors duration-1000">
                <ChartLineUp weight="fill" size={200} />
             </div>
             <div class="flex items-center justify-between relative z-10">
                <div class="p-4 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-glow-emerald-mini group-hover/performance:scale-110 transition-transform">
                   <Ranking weight="duotone" size={28} />
                </div>
                <div class="text-right">
                   <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-outfit mb-1">{$t('classes.attendance_rate')}</p>
                   <p class="text-5xl font-black text-emerald-400 font-outfit tracking-tighter leading-none shadow-glow-emerald-text">{attendanceStats?.average_attendance_rate}%</p>
                </div>
             </div>
             <div class="flex items-center gap-6 relative z-10">
                 <div class="flex-1 p-6 bg-zinc-950/80 rounded-[2rem] border border-white/5 text-center shadow-inner group-hover/performance:border-emerald-500/20 transition-all duration-500">
                    <p class="text-[8px] font-black text-slate-600 uppercase mb-2 tracking-[0.3em] font-outfit">{$t('classes.punctuality')}</p>
                    <p class="text-2xl font-black text-blue-400 font-outfit tracking-tighter leading-none">{attendanceStats?.average_punctuality_rate}%</p>
                 </div>
                 <div class="flex-1 p-6 bg-zinc-950/80 rounded-[2rem] border border-white/5 text-center shadow-inner group-hover/performance:border-white/10 transition-all duration-500">
                    <p class="text-[8px] font-black text-slate-600 uppercase mb-2 tracking-[0.3em] font-outfit">{$t('classes.retention') || 'Retention'}</p>
                    <p class="text-2xl font-black text-white font-outfit tracking-tighter leading-none">94%</p>
                 </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Action & Pulse Column -->
      <div class="lg:col-span-4 space-y-12">
        <!-- Enrollment Master Action -->
        <button 
          onclick={() => goto(`/panel/students/create?classId=${classData.id}&schoolId=${classData.school_id}`)}
          class="w-full bento-card p-12 bg-zinc-900/60 border border-violet-500/30 rounded-[3.5rem] text-left hover:border-violet-400 transition-all duration-700 group relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(139,92,246,0.15)] active:scale-95"
        >
          <div class="absolute -right-16 -bottom-16 text-white/[0.03] group-hover:text-violet-500/10 transition-all duration-1000 group-hover:scale-125 group-hover:rotate-12">
            <UserPlus weight="fill" size={240} />
          </div>
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="relative z-10">
            <div class="w-20 h-20 bg-violet-600/15 rounded-[2.25rem] border border-violet-500/20 flex items-center justify-center text-violet-400 mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-glow-violet-mini">
               <UserPlus weight="duotone" size={40} />
            </div>
            <div class="flex items-center gap-3 mb-3">
               <span class="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] font-outfit">{$t('classes.strategic_growth')}</span>
               <div class="h-px flex-1 bg-violet-500/20"></div>
            </div>
            <h4 class="text-4xl font-black text-white uppercase tracking-tighter font-outfit leading-none mb-3">{$t('students.enroll_btn')}</h4>
            <p class="text-slate-500 text-[13px] font-medium uppercase tracking-tight font-jakarta transition-colors group-hover:text-slate-300 leading-tight">{$t('students.enroll_desc')}</p>
          </div>
        </button>

        <!-- Dynamic Activity Bridge -->
        <div class="bento-card p-10 bg-zinc-900/40 border border-white/5 rounded-[3.5rem] space-y-10 relative overflow-hidden group/activity shadow-2xl">
           <div class="flex items-center gap-5 border-b border-white/5 pb-8">
              <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-glow-emerald-mini animate-pulse-slow">
                <CheckCircle weight="duotone" size={24} />
              </div>
              <div>
                <h3 class="text-sm font-black text-white uppercase tracking-[0.25em] font-outfit">{$t('classes.session_pulse')}</h3>
                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{$t('classes.real_time_tracking')}</p>
              </div>
           </div>

           <div class="p-8 bg-zinc-950/80 rounded-[2.5rem] border border-white/10 shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)] group-hover/activity:border-violet-500/30 transition-all duration-700">
              <div class="flex items-center justify-between mb-4">
                 <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] font-outfit">{$t('classes.last_session')}</p>
                 <span class="px-3 py-1 bg-violet-600/10 border border-violet-500/20 rounded-full text-[10px] font-black text-violet-400 tracking-tighter font-outfit transition-all group-hover/activity:bg-violet-600 group-hover/activity:text-white">{new Date(attendanceStats?.last_session_date).toLocaleDateString()}</span>
              </div>
              <p class="text-lg text-white font-bold font-jakarta uppercase tracking-tight leading-snug">{$t('classes.activity_summary', { count: students.length })}</p>
           </div>

           <div class="flex items-center justify-between pt-4">
              <div class="flex -space-x-5 group/avatars">
                 {#each students.slice(0, 5) as student, i}
                   <div 
                     class="w-12 h-12 rounded-[1.25rem] bg-zinc-900 border-2 border-zinc-950 flex items-center justify-center text-white font-black text-sm font-outfit uppercase shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] ring-2 ring-white/5 transition-all duration-500 hover:scale-125 hover:-translate-y-3 cursor-pointer relative z-[{10-i}]"
                     style="transition-delay: {i * 50}ms"
                   >
                     <div class="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent"></div>
                     <span class="relative z-10">{student.name.charAt(0)}</span>
                   </div>
                 {/each}
                 {#if students.length > 5}
                   <div class="w-12 h-12 rounded-[1.25rem] bg-violet-600 border-2 border-zinc-950 flex items-center justify-center text-white font-black text-[11px] shadow-2xl ring-2 ring-white/5 relative z-0 group-hover/avatars:translate-x-3 transition-transform duration-700 font-outfit">
                     +{students.length - 5}
                   </div>
                 {/if}
              </div>
              <button 
                onclick={() => currentView = 'students'}
                class="w-12 h-12 rounded-2xl bg-white/5 text-slate-500 hover:text-white hover:bg-violet-600 transition-all border border-white/5 group/link flex items-center justify-center shadow-xl active:scale-90"
              >
                <ArrowRight weight="bold" size={20} class="group-hover/link:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        <!-- Group Recognition Bento -->
        <div class="bento-card p-12 bg-gradient-to-br from-emerald-600/[0.08] via-zinc-900/40 to-transparent border border-emerald-500/20 rounded-[3.5rem] text-center space-y-8 shadow-2xl group/trophy relative overflow-hidden">
           <div class="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover/trophy:opacity-100 transition-opacity duration-1000"></div>
           <div class="w-24 h-24 bg-zinc-950 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/20 group-hover/trophy:scale-110 group-hover/trophy:rotate-12 transition-all duration-1000 shadow-[inset_0_5px_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
             <div class="absolute inset-x-0 bottom-0 h-1/2 bg-emerald-500/10"></div>
             <Trophy weight="duotone" size={48} class="text-emerald-400 relative z-10 drop-shadow-glow-emerald" />
           </div>
           <div>
             <h4 class="text-xs font-black text-white uppercase tracking-[0.4em] font-outfit mb-3">{$t('classes.group_progress')}</h4>
             <p class="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest font-jakarta max-w-[240px] mx-auto group-hover/trophy:text-slate-300 transition-colors">{$t('classes.progress_desc', { percent: 45 })}</p>
           </div>
           <div class="pt-4 flex justify-center gap-3">
              {#each Array(3) as _, i}
                <div class="h-1.5 shadow-glow-emerald w-12 rounded-full transition-all duration-700 group-hover/trophy:w-16 {i < 2 ? 'bg-emerald-500' : 'bg-white/10'}" style="transition-delay: {i * 100}ms"></div>
              {/each}
           </div>
        </div>
      </div>
    </div>

  {:else if currentView === 'students'}
    <div class="space-y-12" in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-1.5 bg-violet-600 rounded-full"></div>
              <h2 class="text-5xl font-black text-white uppercase tracking-tighter font-outfit">{$t('students.records')}</h2>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-11">{$t('classes.operational_intel')}</p>
         </div>
         <div class="flex items-center gap-4 bg-zinc-900/50 p-2.5 rounded-[1.75rem] border border-white/5 backdrop-blur-2xl shadow-2xl">
              <button 
                onclick={() => goto(`/panel/classes/${classData.id}/students`)}
                class="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center gap-4 border border-transparent hover:border-white/10 font-outfit group"
              >
                <Shapes weight="duotone" size={20} class="text-violet-400 group-hover:scale-110 transition-transform" />
                {$t('common.manage')}
              </button>
              <button 
                onclick={() => goto(`/panel/students/create?classId=${classData.id}`)}
                class="bg-white text-black px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-violet-600 hover:text-white transition-all shadow-xl flex items-center gap-4 font-outfit active:scale-95 group"
              >
                <Plus weight="bold" size={18} class="group-hover:rotate-90 transition-transform" />
                {$t('students.enroll_btn')}
              </button>
         </div>
      </div>

      {#if students.length === 0}
         <div class="bento-card py-40 px-12 text-center space-y-12 bg-zinc-900/40 border-2 border-dashed border-white/10 rounded-[4rem] shadow-2xl group/empty relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_70%)]"></div>
            <div class="w-40 h-40 bg-zinc-950 rounded-[3rem] border border-white/5 flex items-center justify-center mx-auto text-slate-800 shadow-[inset_0_4px_25px_rgba(0,0,0,0.8)] group-hover/empty:scale-110 group-hover/empty:border-violet-500/20 transition-all duration-1000 relative z-10">
               <Student weight="duotone" size={80} class="group-hover/empty:text-violet-400 transition-colors duration-700" />
            </div>
            <div class="space-y-6 relative z-10">
              <h3 class="text-4xl font-black text-white uppercase font-outfit tracking-tighter">{$t('students.no_records')}</h3>
              <p class="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] font-jakarta max-w-sm mx-auto leading-relaxed">{$t('students.start_adding') || 'Initialize your educational roster to track progress.'}</p>
            </div>
            <button 
              onclick={() => goto(`/panel/students/create?classId=${classData.id}`)}
              class="relative z-10 bg-violet-600 text-white px-16 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-[0_20px_50px_-15px_rgba(139,92,246,0.4)] active:scale-95 font-outfit"
            >
              {$t('students.enroll_btn')}
            </button>
         </div>
      {:else}
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {#each students as student, i}
               <div 
                 class="bento-card p-10 bg-zinc-900/40 border border-white/5 hover:border-violet-500/40 hover:bg-zinc-900/60 transition-all group rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-between"
                 in:fly={{ y: 20, delay: i * 50, duration: 600, easing: cubicOut }}
               >
                  <div class="absolute -right-12 -top-12 text-white/[0.02] group-hover:text-violet-500/[0.08] transition-all duration-1000 rotate-12 scale-150 pointer-events-none">
                     <GraduationCap size={200} weight="fill" />
                  </div>
                  
                  <div class="relative z-10 w-full mb-10">
                    <div class="flex items-center justify-between mb-10">
                       <div class="relative group/avatar">
                          <div class="absolute -inset-2 bg-violet-600/20 rounded-2xl blur-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                          <div class="w-20 h-20 bg-zinc-950 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-violet-400 font-black text-3xl group-hover:scale-110 group-hover:border-violet-500/50 transition-all duration-700 shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)] font-outfit relative z-10 overflow-hidden">
                             <div class="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent"></div>
                             {student.name.charAt(0)}
                          </div>
                       </div>
                       <div class="flex flex-col items-end gap-3">
                          <div class={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border backdrop-blur-md ${student.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-glow-emerald-mini' : 'bg-slate-800/10 text-slate-500 border-slate-500/10'}`}>
                            {student.active ? $t('students.status_active') : $t('students.status_inactive')}
                          </div>
                       </div>
                    </div>

                    <div class="space-y-3 mb-10">
                       <h4 class="text-white font-black uppercase text-2xl leading-none font-outfit tracking-tighter group-hover:text-violet-400 transition-all duration-700">{student.name}</h4>
                       <div class="flex items-center gap-3">
                          <p class="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] font-jakarta">{student.age} {$t('students.years')}</p>
                          <div class="w-1 h-1 rounded-full bg-slate-700"></div>
                          <p class="text-[10px] text-violet-400/80 font-black uppercase tracking-[0.25em] font-jakarta">{levelLabels[student.level as keyof typeof levelLabels] || $t('common.mixed')}</p>
                       </div>
                    </div>

                    <div class="space-y-5 pb-10 border-b border-white/5 mb-2 font-jakarta">
                       <div class="flex items-center gap-4 text-slate-400 group/link">
                          <div class="p-2.5 bg-zinc-950 rounded-xl border border-white/5 group-hover/link:border-violet-500/30 transition-all duration-500">
                             <Envelope weight="duotone" size={16} class="text-violet-500/60" />
                          </div>
                          <span class="text-[11px] font-bold truncate uppercase tracking-widest leading-none bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/[0.02]">{student.email || $t('students.no_email')}</span>
                       </div>
                       <div class="flex items-center gap-4 text-slate-400 group/link">
                          <div class="p-2.5 bg-zinc-950 rounded-xl border border-white/5 group-hover/link:border-blue-500/30 transition-all duration-500">
                             <Phone weight="duotone" size={16} class="text-blue-500/60" />
                          </div>
                          <span class="text-[11px] font-bold uppercase tracking-widest leading-none bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/[0.02]">{student.phone || $t('students.no_phone')}</span>
                       </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between relative z-10 w-full pt-4">
                     <div class="space-y-1.5 bg-zinc-950/80 px-5 py-3 rounded-[1.25rem] border border-white/5 shadow-inner group-hover:border-emerald-500/20 transition-all">
                        <p class="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] font-outfit">{$t('students.performance') || 'Rating'}</p>
                        <p class="text-lg font-black text-white font-outfit tracking-tighter leading-none">1245 <span class="text-[10px] text-slate-600 font-bold ml-1">ELO</span></p>
                     </div>
                     <button 
                       onclick={() => goto(`/panel/students/${student.id}`)}
                       class="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all shadow-xl active:scale-90 group/btn overflow-hidden relative"
                     >
                       <div class="absolute inset-0 bg-violet-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                       <ArrowRight weight="bold" size={20} class="relative z-10 group-hover/btn:scale-110 transition-transform" />
                     </button>
                  </div>
               </div>
            {/each}
         </div>
      {/if}
    </div>

  {:else if currentView === 'skills'}
    <div class="space-y-12" in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-1.5 bg-violet-600 rounded-full shadow-glow-violet"></div>
              <h2 class="text-5xl font-black text-white uppercase tracking-tighter font-outfit">{$t('classes.syllabus')}</h2>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-11 italic">{$t('classes.roadmap_objectives')}</p>
         </div>
         <button 
            onclick={() => goto(`/panel/classes/${classData.id}/skills`)}
            class="bg-white text-black px-12 py-4.5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-violet-600 hover:text-white transition-all flex items-center gap-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] active:scale-95 font-outfit group"
          >
           <Plus weight="bold" size={20} class="group-hover:rotate-90 transition-transform duration-500" />
           {$t('common.manage')}
         </button>
      </div>

      {#if classSkills.length === 0}
         <div class="bento-card py-44 px-12 text-center space-y-12 bg-zinc-900/40 border-2 border-dashed border-white/10 rounded-[4rem] shadow-2xl group/empty relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)]"></div>
            <div class="w-44 h-44 bg-zinc-950 rounded-[3.5rem] border border-white/5 flex items-center justify-center mx-auto text-slate-800 shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)] group-hover/empty:scale-110 group-hover/empty:border-emerald-500/20 transition-all duration-1000 relative z-10">
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
                 class="bento-card p-12 flex flex-col lg:flex-row lg:items-center gap-16 bg-zinc-900/40 border border-white/5 group hover:border-violet-500/40 hover:bg-zinc-900/70 transition-all duration-700 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden"
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
                        <div class="flex items-center gap-2 px-5 py-2 rounded-full border border-violet-500/20 bg-violet-600/10 shadow-glow-violet-mini backdrop-blur-md">
                           <Shapes size={14} weight="duotone" class="text-violet-400" />
                           <span class="text-[9px] font-black text-violet-300 uppercase tracking-[0.2em] font-outfit">
                             {skill.skill.category?.name}
                           </span>
                        </div>
                     </div>
                     <p class="text-slate-400 text-lg font-medium leading-relaxed max-w-4xl font-jakarta uppercase tracking-tight group-hover:text-slate-200 transition-all duration-700">{skill.skill.description}</p>
                  </div>

                  <div class="flex flex-col items-center gap-6 relative z-10 bg-zinc-950/90 p-10 rounded-[3rem] border border-white/5 shadow-[inset_0_4px_25px_rgba(0,0,0,0.8)] min-w-[220px] group-hover:border-violet-500/30 transition-all duration-1000 group/rating">
                     <div class="flex items-center gap-3">
                       <Ranking size={20} weight="duotone" class="text-violet-500/80 group-hover/rating:scale-110 transition-transform" />
                       <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-outfit">{$t('common.difficulty') || 'Difficulty'}</p>
                     </div>
                     <div class="flex items-center gap-3.5">
                        {#each Array(5) as _, j}
                           <div 
                             class={`w-3.5 h-12 rounded-full transition-all duration-1000 ease-out ${j < skill.skill.difficulty ? 'bg-gradient-to-t from-violet-600 to-indigo-500 shadow-glow-violet' : 'bg-white/5'}`} 
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
</style>
