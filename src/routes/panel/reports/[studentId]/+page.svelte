<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    User as UserIcon,
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
    Timer,
    ChevronRight,
    Search,
    Download,
    Share2,
    Briefcase,
    Layers
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';

  let { data } = $props<{ data: PageData }>();

  let selectedTab = $state<'overview' | 'attendance' | 'skills' | 'payments' | 'tournaments' | 'timeline'>('overview');

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'P': return CheckCircle;
      case 'T': return Clock;
      case 'A': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getAttendanceTheme = (status: string) => {
    switch (status) {
      case 'P': return 'text-primary-400 border-primary-500/20 bg-primary-500/10';
      case 'T': return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
      case 'A': return 'text-red-400 border-red-500/20 bg-red-500/10';
      default: return 'text-surface-400 border-surface-500/20 bg-surface-500/10';
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

  const report = $derived(data.report);
  const student = $derived(report?.student);
  const progress = $derived(report?.progress_summary);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'timeline', label: 'Timeline', icon: Timer },
  ] as const;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance': return Calendar;
      case 'skill': return Zap;
      case 'payment': return DollarSign;
      case 'tournament': return Trophy;
      default: return Activity;
    }
  };
</script>

<svelte:head>
  <title>{$t('reports.title', { name: student?.name || 'Student' })} - ChessNet</title>
</svelte:head>

{#if !report}
  <div class="min-h-[60vh] flex items-center justify-center p-8" in:fade>
    <div class="glass-panel p-12 text-center max-w-md space-y-6 border-t-4 border-red-500">
      <div class="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-400 mx-auto shadow-2xl">
        <AlertTriangle class="w-10 h-10" />
      </div>
      <div>
        <h2 class="text-2xl font-black text-white uppercase tracking-tighter">{$t('reports.not_found')}</h2>
        <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mt-2">{$t('reports.not_found_desc')}</p>
      </div>
      <button
        onclick={() => goto('/panel/reports')}
        class="w-full bg-surface-950 border border-surface-900 py-4 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:border-primary-500/50 transition-all flex items-center justify-center gap-3"
      >
        <ArrowLeft class="w-4 h-4" />
        {$t('common.back')}
      </button>
    </div>
  </div>
{:else}
  <div class="space-y-10 animate-fade-in pb-20" in:fade>
    <!-- Header Section -->
    <div class="flex flex-col xl:flex-row gap-8 items-start justify-between">
      <div class="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div class="relative group">
          <div class="absolute inset-0 bg-primary-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div class="w-32 h-32 bg-surface-950 border-4 border-surface-900 rounded-[2.5rem] flex items-center justify-center text-primary-400 text-5xl font-black shadow-2xl relative z-10 group-hover:border-primary-500/30 transition-all">
            {student.name.charAt(0)}
          </div>
          <div class="absolute -bottom-2 -right-2 bg-primary-500 text-black p-2 rounded-xl shadow-lg z-20">
            <Trophy class="w-4 h-4" />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 class="text-4xl font-black text-white tracking-tighter uppercase leading-none">{student.name}</h1>
            <span class="bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle class="w-3 h-3" />
              {$t('reports.common.verified')}
            </span>
          </div>
          
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-surface-500 text-[10px] font-bold uppercase tracking-widest">
            <div class="flex items-center gap-2">
              <School class="w-3 h-3 text-primary-400" />
              {report.school.name}
            </div>
            <div class="w-1.5 h-1.5 rounded-full bg-surface-800"></div>
            <div class="flex items-center gap-2">
              <Calendar class="w-3 h-3 text-primary-400" />
              {calculateAge(student.date_of_birth)} {$t('reports.years')}
            </div>
            <div class="w-1.5 h-1.5 rounded-full bg-surface-800"></div>
            <div class="flex items-center gap-2">
              <Clock class="w-3 h-3 text-primary-400" />
              {$t('reports.active_since')} {formatDate(progress.enrollment_date)}
            </div>
            <div class="w-1.5 h-1.5 rounded-full bg-surface-800"></div>
            <div class="flex items-center gap-2">
              <div class={`w-2 h-2 rounded-full ${student.status === 'active' ? 'bg-primary-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-surface-700'}`}></div>
              {student.status ? $t(`reports.status.${student.status.toLowerCase()}`) : '---'}
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <button class="flex-1 md:flex-none bg-surface-950/50 border border-surface-900 p-4 rounded-2xl text-white hover:border-primary-500/30 transition-all backdrop-blur-xl group">
          <Share2 class="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
        <button class="flex-1 md:flex-none bg-surface-950/50 border border-surface-900 p-4 rounded-2xl text-white hover:border-primary-500/30 transition-all backdrop-blur-xl group">
          <Download class="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
        <button class="flex-[3] md:flex-none bg-primary-500 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center justify-center gap-3">
          <FileText class="w-4 h-4" />
          {$t('reports.generate_pdf')}
        </button>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="glass-panel p-6 border-l-4 border-primary-500 flex items-center justify-between group">
         <div>
            <span class="text-[9px] font-black text-surface-500 uppercase tracking-widest">{$t('reports.metrics.attendance')}</span>
            <p class="text-2xl font-black text-white mt-1 uppercase leading-none">{progress.attendance_rate.toFixed(1)}%</p>
         </div>
         <div class="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
            <Activity class="w-6 h-6" />
         </div>
      </div>
      
      <div class="glass-panel p-6 border-l-4 border-blue-500 flex items-center justify-between group">
         <div>
            <span class="text-[9px] font-black text-surface-500 uppercase tracking-widest">{$t('reports.metrics.rating')}</span>
            <div class="flex items-baseline gap-2">
              <p class="text-2xl font-black text-white mt-1 uppercase leading-none">{progress.current_rating}</p>
              <span class={`text-[10px] font-black ${progress.rating_change >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
                {progress.rating_change >= 0 ? '▲' : '▼'} {Math.abs(progress.rating_change)}
              </span>
            </div>
         </div>
         <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Trophy class="w-6 h-6" />
         </div>
      </div>

      <div class="glass-panel p-6 border-l-4 border-purple-500 flex items-center justify-between group">
         <div>
            <span class="text-[9px] font-black text-surface-500 uppercase tracking-widest">{$t('reports.metrics.skills')}</span>
            <p class="text-2xl font-black text-white mt-1 uppercase leading-none">{progress.skill_completion_rate.toFixed(1)}%</p>
         </div>
         <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Zap class="w-6 h-6" />
         </div>
      </div>

      <div class="glass-panel p-6 border-l-4 border-orange-500 flex items-center justify-between group">
         <div>
            <span class="text-[9px] font-black text-surface-500 uppercase tracking-widest">{$t('reports.metrics.balance')}</span>
            <p class={`text-2xl font-black mt-1 uppercase leading-none ${progress.overdue_payments > 0 ? 'text-red-400' : 'text-primary-400'}`}>
              {progress.overdue_payments > 0 ? `-${progress.overdue_payments}` : 'OK'}
            </p>
         </div>
         <div class="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
            <DollarSign class="w-6 h-6" />
         </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex flex-wrap gap-2 p-1.5 bg-surface-950/50 border border-surface-900 rounded-[2rem] backdrop-blur-xl">
      {#each tabs as tab}
        <button
          onclick={() => selectedTab = tab.id}
          class={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            selectedTab === tab.id 
              ? 'bg-primary-500 text-black shadow-xl scale-[1.02]' 
              : 'text-surface-500 hover:text-white hover:bg-surface-900'
          }`}
        >
          <tab.icon class="w-4 h-4" />
          <span class="hidden sm:inline">{$t(`reports.tabs.${tab.id}`)}</span>
        </button>
      {/each}
    </div>

    <!-- Tab Content -->
    <div class="space-y-8" in:fade={{ duration: 200 }}>
      {#if selectedTab === 'overview'}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column: Details & Notes -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Basic Info Card -->
            <div class="glass-panel overflow-hidden border-t-4 border-primary-500">
               <div class="p-8 border-b border-surface-900 bg-surface-950/50">
                  <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <UserIcon class="w-4 h-4 text-primary-400" />
                    {$t('reports.contact.title')}
                  </h3>
               </div>
               <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-6">
                    <div class="group">
                      <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">{$t('reports.contact.email')}</p>
                      <div class="flex items-center gap-3 text-white font-bold tracking-tight bg-surface-950/50 p-3 rounded-xl border border-surface-900 group-hover:border-primary-500/30 transition-all">
                        <Mail class="w-4 h-4 text-primary-400" />
                        {student.email}
                      </div>
                    </div>
                    <div class="group">
                      <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">{$t('reports.contact.phone')}</p>
                      <div class="flex items-center gap-3 text-white font-bold tracking-tight bg-surface-950/50 p-3 rounded-xl border border-surface-900 group-hover:border-primary-500/30 transition-all">
                        <Phone class="w-4 h-4 text-primary-400" />
                        {student.phone}
                      </div>
                    </div>
                  </div>
                  <div class="space-y-6">
                    <div class="group">
                      <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">{$t('reports.contact.birth')}</p>
                      <div class="flex items-center gap-3 text-white font-bold tracking-tight bg-surface-950/50 p-3 rounded-xl border border-surface-900 group-hover:border-primary-500/30 transition-all">
                        <Calendar class="w-4 h-4 text-primary-400" />
                        {formatDate(student.date_of_birth)}
                      </div>
                    </div>
                    <div class="group">
                      <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">{$t('reports.contact.last_activity')}</p>
                      <div class="flex items-center gap-3 text-white font-bold tracking-tight bg-surface-950/50 p-3 rounded-xl border border-surface-900 group-hover:border-primary-500/30 transition-all">
                        <Activity class="w-4 h-4 text-primary-400" />
                        {formatDate(progress.last_activity_date)}
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            <!-- Instructor Notes -->
            {#if student.instructor_notes}
              <div class="glass-panel p-8 border-t-4 border-orange-500">
                <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <FileText class="w-4 h-4 text-orange-400" />
                  {$t('reports.observations.title')}
                </h3>
                <div class="p-6 bg-surface-950/80 border border-surface-900 rounded-2xl italic text-surface-300 text-sm leading-relaxed relative overflow-hidden">
                   <div class="absolute top-0 right-0 p-4 opacity-10">
                      <BookOpen class="w-12 h-12" />
                   </div>
                   "{student.instructor_notes}"
                </div>
              </div>
            {/if}

            <!-- Enrolled Classes -->
            <div class="glass-panel p-8 border-t-4 border-blue-500">
               <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <Layers class="w-4 h-4 text-blue-400" />
                {$t('reports.programs.title')}
               </h3>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {#each report.classes as cls}
                    <div class="p-5 bg-surface-950/50 border border-surface-900 rounded-2xl group hover:border-blue-500/30 transition-all">
                       <div class="flex items-center justify-between mb-3">
                          <h4 class="text-sm font-black text-white uppercase tracking-tight">{cls.name}</h4>
                          <span class="text-[10px] font-black text-primary-400">{formatCurrency(cls.price)}/{$t('reports.programs.per_month')}</span>
                       </div>
                       <div class="flex items-center gap-2 text-[10px] font-bold text-surface-500 uppercase">
                          <Clock class="w-3.5 h-3.5" />
                          {cls.schedule}
                       </div>
                    </div>
                  {/each}
               </div>
            </div>
          </div>

          <!-- Right Column: Performance Charts -->
          <div class="space-y-8">
             <!-- Rating Evolution -->
             <div class="glass-panel p-8 border-t-4 border-primary-500">
                <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">{$t('reports.history.rating')}</h3>
                <div class="space-y-4">
                   {#each report.rating_history as entry}
                     <div class="flex items-center justify-between p-4 bg-surface-950/50 border border-surface-900 rounded-2xl group hover:bg-surface-950 transition-colors">
                        <div>
                           <p class="text-[10px] font-black text-white uppercase tracking-tight">{entry.event}</p>
                           <p class="text-[8px] font-black text-surface-600 uppercase mt-0.5">{formatDate(entry.date)}</p>
                        </div>
                        <div class="text-right">
                           <p class="text-sm font-black text-white">{entry.rating}</p>
                           <p class={`text-[9px] font-black ${entry.change >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
                             {entry.change >= 0 ? '+' : ''}{entry.change}
                           </p>
                        </div>
                     </div>
                   {/each}
                </div>
             </div>

             <!-- Skills Breakdown -->
             <div class="glass-panel p-8 border-t-4 border-purple-500">
                <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">{$t('reports.skills.status')}</h3>
                <div class="space-y-5">
                   <div class="space-y-2">
                      <div class="flex justify-between text-[10px] font-black tracking-widest text-primary-400">
                        <span>{$t('reports.skills.mastered')}</span>
                        <span>{report.skills?.filter((s: any) => s.status === 'completed').length || 0} / {report.skills?.length || 0}</span>
                      </div>
                      <div class="h-2 bg-surface-950 rounded-full border border-surface-900 overflow-hidden">
                        <div class="h-full bg-primary-500" style="width: {progress.total_skills_assigned > 0 ? (progress.skills_mastered/progress.total_skills_assigned)*100 : 0}%"></div>
                      </div>
                   </div>

                   <div class="space-y-2">
                      <div class="flex justify-between text-[10px] font-black tracking-widest text-blue-400">
                        <span>{$t('reports.skills.in_progress')}</span>
                        <span>{progress.skills_in_progress}</span>
                      </div>
                      <div class="h-2 bg-surface-950 rounded-full border border-surface-900 overflow-hidden">
                        <div class="h-full bg-blue-500" style="width: {progress.total_skills_assigned > 0 ? (progress.skills_in_progress/progress.total_skills_assigned)*100 : 0}%"></div>
                      </div>
                   </div>

                   <div class="space-y-2">
                      <div class="flex justify-between text-[10px] font-black tracking-widest text-surface-600">
                        <span>{$t('reports.skills.pending')}</span>
                        <span>{progress.total_skills_assigned - progress.skills_mastered - progress.skills_in_progress}</span>
                      </div>
                      <div class="h-2 bg-surface-950 rounded-full border border-surface-900 overflow-hidden">
                        <div class="h-full bg-surface-800" style="width: {progress.total_skills_assigned > 0 ? ((progress.total_skills_assigned - progress.skills_mastered - progress.skills_in_progress)/progress.total_skills_assigned)*100 : 0}%"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      {/if}

      {#if selectedTab === 'attendance'}
        <div class="space-y-8" in:fade>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="glass-panel p-8 text-center border-b-4 border-primary-500">
               <p class="text-4xl font-black text-white tracking-tighter mb-2">{progress.attended_sessions}</p>
               <p class="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em]">{$t('reports.attendance.present')}</p>
            </div>
            <div class="glass-panel p-8 text-center border-b-4 border-orange-500">
               <p class="text-4xl font-black text-white tracking-tighter mb-2">{progress.late_sessions}</p>
               <p class="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em]">{$t('reports.attendance.late')}</p>
            </div>
            <div class="glass-panel p-8 text-center border-b-4 border-red-500">
               <p class="text-4xl font-black text-white tracking-tighter mb-2">{progress.absent_sessions}</p>
               <p class="text-[9px] font-black text-red-400 uppercase tracking-[0.2em]">{$t('reports.attendance.absent')}</p>
            </div>
            <div class="glass-panel p-8 text-center border-b-4 border-blue-500">
               <p class="text-4xl font-black text-white tracking-tighter mb-2">{progress.punctuality_rate.toFixed(0)}%</p>
               <p class="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">{$t('reports.attendance.punctuality')}</p>
            </div>
          </div>

          <div class="glass-panel overflow-hidden border-t-4 border-primary-500">
             <div class="p-8 border-b border-surface-900">
                <h3 class="text-xs font-black text-white uppercase tracking-[0.2em]">{$t('reports.attendance.record')}</h3>
             </div>
             <div class="divide-y divide-surface-900/50">
                {#each report.attendance_history as h}
                  {@const Icon = getAttendanceIcon(h.status)}
                  <div class="p-6 flex flex-wrap items-center justify-between gap-4 group hover:bg-surface-950/50 transition-colors">
                     <div class="flex items-center gap-5">
                        <div class={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${getAttendanceTheme(h.status)}`}>
                           <Icon class="w-6 h-6" />
                        </div>
                        <div>
                           <p class="text-xs font-black text-white uppercase tracking-tight">{formatDate(h.date)}</p>
                           <p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest mt-0.5">{$t('reports.attendance.status')}: {h.status === 'P' ? $t('reports.attendance.present') : h.status === 'T' ? $t('reports.attendance.late') : $t('reports.attendance.absent')}</p>
                        </div>
                     </div>
                     {#if h.notes}
                        <div class="bg-surface-950 border border-surface-900 px-5 py-3 rounded-xl max-w-sm">
                           <p class="text-[10px] text-surface-400 italic">"{h.notes}"</p>
                        </div>
                     {/if}
                  </div>
                {/each}
             </div>
          </div>
        </div>
      {/if}

      {#if selectedTab === 'skills'}
        <div class="space-y-8" in:fade>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#each ['fundamentals', 'tactics', 'endgames'] as category}
              {@const catSkills = (report.skills_progress as any[]).filter(s => s.category.toLowerCase() === category.toLowerCase())}
              {@const completed = catSkills.filter(s => s.status === 'completed').length}
              <div class="glass-panel p-8 flex items-center justify-between border-t-4 border-purple-500">
                 <div class="flex flex-col">
                    <h4 class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mb-1">
                       {$t(`reports.skills.categories.${category}`)}
                    </h4>
                    <p class="text-3xl font-black text-white tracking-tighter">{completed} / {catSkills.length}</p>
                 </div>
                 <div class="w-16 h-16 rounded-full border-4 border-surface-900 flex items-center justify-center relative">
                    <svg class="absolute inset-0 w-full h-full -rotate-90">
                       <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="4" class="text-surface-900" />
                       <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="4" class="text-purple-500" stroke-dasharray="175.9" stroke-dashoffset={175.9 - (175.9 * (completed / (catSkills.length || 1)))} />
                    </svg>
                    <span class="text-[10px] font-black text-white">{catSkills.length > 0 ? ((completed/catSkills.length)*100).toFixed(0) : 0}%</span>
                 </div>
              </div>
            {/each}
          </div>

          <div class="grid grid-cols-1 gap-4">
             {#each report.skills_progress as skill}
                <div class="glass-panel p-8 group hover:border-purple-500/30 transition-all border-l-8 {skill.status === 'completed' ? 'border-primary-500' : skill.status === 'in_progress' ? 'border-blue-500' : 'border-surface-800'}">
                   <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div class="space-y-2">
                         <div class="flex items-center gap-3">
                           <h4 class="text-lg font-black text-white uppercase tracking-tight">{skill.skill_name}</h4>
                           <span class="text-[8px] font-black text-surface-600 border border-surface-800 px-2 py-0.5 rounded uppercase">{skill.category}</span>
                         </div>
                         {#if skill.notes}
                           <p class="text-[11px] text-surface-400 italic max-w-xl">"{skill.notes}"</p>
                         {/if}
                      </div>
                      
                      <div class="flex items-center gap-10">
                         <div class="text-center">
                            <p class="text-2xl font-black text-white">{skill.level} / {skill.max_level}</p>
                            <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest mt-1">{$t('reports.skills.level')}</p>
                         </div>
                         <div class="text-right">
                            <span class={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                               skill.status === 'completed' ? 'text-primary-400 border-primary-500/20 bg-primary-500/10' : 
                               skill.status === 'in_progress' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' : 
                               'text-surface-500 border-surface-800 bg-surface-950'
                            }`}>
                               {skill.status === 'completed' ? $t('reports.skills.completed') : skill.status === 'in_progress' ? $t('reports.skills.in_progress') : $t('reports.skills.not_started')}
                            </span>
                            {#if skill.completion_date}
                              <p class="text-[8px] font-black text-surface-600 uppercase mt-2 tracking-widest">{$t('reports.skills.completed_on')}: {formatDate(skill.completion_date)}</p>
                            {/if}
                         </div>
                      </div>
                   </div>
                </div>
             {/each}
          </div>
        </div>
      {/if}

      {#if selectedTab === 'payments'}
         <div class="space-y-8" in:fade>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="glass-panel p-8 text-center border-t-4 border-surface-900">
                 <p class="text-4xl font-black text-white tracking-tighter mb-2">{progress.total_payments}</p>
                 <p class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em]">{$t('reports.payments.issued')}</p>
              </div>
              <div class="glass-panel p-8 text-center border-t-4 border-primary-500">
                 <p class="text-4xl font-black text-primary-400 tracking-tighter mb-2">{progress.paid_payments}</p>
                 <p class="text-[10px] font-black text-primary-500/50 uppercase tracking-[0.2em]">{$t('reports.payments.settled')}</p>
              </div>
              <div class="glass-panel p-8 text-center border-t-4 border-red-500">
                 <p class="text-4xl font-black text-red-400 tracking-tighter mb-2">{progress.overdue_payments}</p>
                 <p class="text-[9px] font-black text-red-500/50 uppercase tracking-[0.2em]">{$t('reports.payments.overdue')}</p>
              </div>
              <div class="glass-panel p-8 text-center border-t-4 border-blue-500">
                 <p class="text-4xl font-black text-white tracking-tighter mb-2">{progress.payment_compliance.toFixed(0)}%</p>
                 <p class="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">{$t('reports.payments.compliance')}</p>
              </div>
            </div>

            <div class="glass-panel overflow-hidden border-t-4 border-primary-500">
               <div class="overflow-x-auto">
                  <table class="w-full text-left">
                     <thead>
                        <tr class="bg-surface-950/80 border-b border-surface-900">
                           <th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500">{$t('reports.payments.concept')}</th>
                           <th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-right">{$t('reports.payments.amount')}</th>
                           <th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-center">{$t('reports.payments.status')}</th>
                           <th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-right">{$t('reports.payments.reference')}</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-surface-900/50">
                        {#each report.payment_history as pay}
                          <tr class="hover:bg-primary-500/[0.02] transition-colors group">
                             <td class="px-8 py-6">
                                <div>
                                   <p class="text-xs font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors">{pay.description}</p>
                                   <p class="text-[9px] font-black text-surface-600 uppercase mt-1 tracking-widest">{$t('reports.payments.due')}: {formatDate(pay.due_date)}</p>
                                </div>
                             </td>
                             <td class="px-8 py-6 text-right font-black text-white text-sm">
                                {formatCurrency(pay.amount)}
                             </td>
                             <td class="px-8 py-6 text-center">
                                <span class={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                   pay.status === 'paid' ? 'text-primary-400 border-primary-500/20 bg-primary-500/10' : 
                                   pay.status === 'overdue' ? 'text-red-400 border-red-500/20 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
                                   'text-orange-400 border-orange-500/20 bg-orange-500/10'
                                }`}>
                                   {pay.status === 'paid' ? $t('reports.payments.settled') : pay.status === 'overdue' ? $t('reports.payments.overdue') : $t('reports.payments.pending')}
                                </span>
                             </td>
                             <td class="px-8 py-6 text-right">
                                <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest">{pay.payment_reference || 'N/A'}</p>
                                {#if pay.paid_date}
                                  <p class="text-[8px] font-bold text-primary-500/50 uppercase">{$t('reports.payments.paid')}: {formatDate(pay.paid_date)}</p>
                                {/if}
                             </td>
                          </tr>
                        {/each}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      {/if}

      {#if selectedTab === 'tournaments'}
         <div class="space-y-8" in:fade>
            {#if report.tournament_history.length > 0}
               <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div class="glass-panel p-8 text-center border-b-4 border-yellow-500">
                     <p class="text-4xl font-black text-white tracking-tighter mb-2">{progress.tournaments_participated}</p>
                     <p class="text-[9px] font-black text-yellow-500/50 uppercase tracking-[0.2em]">{$t('reports.tournaments.played')}</p>
                  </div>
                  <div class="glass-panel p-8 text-center border-b-4 border-primary-500">
                     <p class="text-4xl font-black text-primary-400 tracking-tighter mb-2">{progress.tournament_wins}</p>
                     <p class="text-[10px] font-black text-primary-500/50 uppercase tracking-[0.2em]">{$t('reports.tournaments.wins')}</p>
                  </div>
                  <div class="glass-panel p-8 text-center border-b-4 border-surface-500">
                     <p class="text-4xl font-black text-white tracking-tighter mb-2">{progress.tournament_draws}</p>
                     <p class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em]">{$t('reports.tournaments.draws')}</p>
                  </div>
                  <div class="glass-panel p-8 text-center border-b-4 border-red-500">
                     <p class="text-4xl font-black text-red-400 tracking-tighter mb-2">{progress.tournament_losses}</p>
                     <p class="text-[9px] font-black text-red-500/50 uppercase tracking-[0.2em]">{$t('reports.tournaments.losses')}</p>
                  </div>
               </div>

               <div class="grid grid-cols-1 gap-8">
                  {#each report.tournament_history as tmnt}
                     <div class="glass-panel overflow-hidden border-t-4 border-primary-500">
                        <div class="p-8 border-b border-surface-900 bg-surface-950/50 flex flex-wrap items-center justify-between gap-6">
                           <div class="space-y-1">
                              <h3 class="text-xl font-black text-white uppercase tracking-tighter">{tmnt.name}</h3>
                              <div class="flex items-center gap-4 text-[9px] font-black text-surface-500 uppercase tracking-[0.2em]">
                                 <span>{formatDate(tmnt.date)}</span>
                                 <span class="w-1.5 h-1.5 rounded-full bg-surface-800"></span>
                                 <span>{tmnt.format}</span>
                                 <span class="w-1.5 h-1.5 rounded-full bg-surface-800"></span>
                                 <span>{tmnt.participants} {$t('reports.tournaments.participants')}</span>
                              </div>
                           </div>
                           <div class="text-right">
                              <p class="text-2xl font-black text-white tracking-tighter">{$t('reports.tournaments.position')}: {tmnt.final_position} <span class="text-primary-500">/ {tmnt.participants}</span></p>
                              <p class="text-[9px] font-black text-primary-400 uppercase tracking-widest mt-1">{$t('reports.tournaments.score')}: {tmnt.points} PTS</p>
                           </div>
                        </div>
                        <div class="p-8">
                           <h4 class="text-[9px] font-black text-surface-600 uppercase tracking-[0.2em] mb-4">{$t('reports.tournaments.games')}</h4>
                           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {#each tmnt.games as g}
                                 <div class="p-5 bg-surface-950/80 border border-surface-900 rounded-2xl flex items-center justify-between group hover:border-primary-500/30 transition-all">
                                    <div class="flex items-center gap-4">
                                       <div class="w-10 h-10 rounded-xl bg-surface-900 flex items-center justify-center text-[10px] font-black text-surface-400">R{g.round}</div>
                                       <div>
                                          <p class="text-[11px] font-black text-white uppercase tracking-tight">{g.opponent}</p>
                                          <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest mt-0.5">{$t('reports.tournaments.rating')}: {g.opponent_rating}</p>
                                       </div>
                                    </div>
                                    <div class="text-right flex flex-col items-end gap-1.5">
                                       <span class={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                          g.result === '1-0' ? 'text-primary-400 border border-primary-500/20 bg-primary-500/10' :
                                          g.result === '0-1' ? 'text-red-400 border border-red-500/20 bg-red-500/10' :
                                          'text-orange-400 border border-orange-500/20 bg-orange-500/10'
                                       }`}>
                                          {g.result === '1-0' ? $t('reports.tournaments.wins') : g.result === '0-1' ? $t('reports.tournaments.losses') : $t('reports.tournaments.draws')}
                                       </span>
                                       <span class="text-[10px]">{g.color === 'white' ? `⚪ ${$t('reports.tournaments.color_white')}` : `⚫ ${$t('reports.tournaments.color_black')}`}</span>
                                    </div>
                                 </div>
                              {/each}
                           </div>
                        </div>
                     </div>
                  {/each}
               </div>
            {:else}
               <div class="glass-panel p-24 text-center space-y-6">
                  <div class="w-20 h-20 bg-surface-950 border border-surface-900 rounded-3xl flex items-center justify-center mx-auto text-surface-800">
                     <Trophy class="w-10 h-10" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-white uppercase tracking-[0.3em]">{$t('reports.no_history')}</p>
                    <p class="text-[9px] font-bold text-surface-500 uppercase tracking-widest mt-2">{$t('reports.no_history_desc')}</p>
                  </div>
               </div>
            {/if}
         </div>
      {/if}

      {#if selectedTab === 'timeline'}
         <div class="max-w-4xl mx-auto space-y-12 py-10" in:fade>
            <div class="relative">
               <!-- Vertical Line -->
               <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-surface-900/50"></div>

               <div class="space-y-12">
                  {#each report.activity_timeline as act, i}
                     {@const ActIcon = getActivityIcon(act.type)}
                     <div class="relative pl-16 group">
                        <!-- Dot -->
                        <div class={`absolute left-[1.125rem] top-0 w-3 h-3 rounded-full border-2 border-surface-950 z-10 transition-all group-hover:scale-150 ${
                           act.status === 'positive' ? 'bg-primary-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]' :
                           act.status === 'negative' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                           'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                        }`}></div>

                        <div class="glass-panel p-6 group-hover:border-primary-500/20 transition-all">
                           <div class="flex items-center justify-between mb-3">
                              <div class="flex items-center gap-3">
                                 <div class="p-2 bg-surface-950 rounded-lg text-surface-500 group-hover:text-primary-400 transition-colors">
                                    <ActIcon class="w-4 h-4" />
                                 </div>
                                 <h4 class="text-sm font-black text-white uppercase tracking-tight">{act.title}</h4>
                              </div>
                              <span class="text-[9px] font-black text-surface-600 uppercase tracking-widest">{formatDate(act.date)}</span>
                           </div>
                           <p class="text-[11px] text-surface-400 leading-relaxed mb-4">{act.description}</p>
                           
                           {#if act.details && Object.keys(act.details).length > 0}
                              <div class="flex flex-wrap gap-4 pt-4 border-t border-surface-900/50">
                                 {#each Object.entries(act.details) as [key, value]}
                                    <div class="flex flex-col">
                                       <span class="text-[8px] font-black text-surface-600 uppercase tracking-widest">{key}</span>
                                       <span class="text-[10px] font-black text-white uppercase mt-0.5">{value}</span>
                                    </div>
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
    </div>
  </div>
{/if}

<style lang="postcss">
  /* Transitions and micro-interactions */
  :global(.glass-panel) {
    transition: all 300ms;
  }
</style>
