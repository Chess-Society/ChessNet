<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    CaretLeft,
    GraduationCap,
    Users,
    Target,
    UserCheck,
    UserPlus,
    Gear,
    Calendar,
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
    ClipboardText
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';

  let { data } = $props<{ data: PageData }>();

  const classData = $derived(data.class as any);
  const students = $derived((data.students || []) as any[]);
  const classSkills = $derived((data.classSkills || []) as any[]);
  const classStats = $derived(data.classStats as any);
  const attendanceStats = $derived(data.attendanceStats as any);

  let currentView = $state<'overview' | 'students' | 'skills' | 'attendance'>('overview');

  const levelColors = {
    beginner: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
    intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    mixed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
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

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={handleGoBack}
        class="flex items-center gap-2 text-zinc-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <CaretLeft weight="bold" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        {$t('common.back')}
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <GraduationCap weight="duotone" class="w-8 h-8" />
        </div>
        <div>
          <div class="flex items-center gap-3 mb-1">
             <h1 class="text-3xl font-black text-white tracking-tighter uppercase">{classData?.name}</h1>
             <span class={`text-[8px] font-black px-2 py-0.5 rounded-full border ${levelColors[classData?.level as keyof typeof levelColors] || levelColors.mixed}`}>
               {levelLabels[classData?.level as keyof typeof levelColors] || $t('common.unknown')}
             </span>
          </div>
          <p class="text-zinc-500 text-sm font-medium uppercase tracking-widest font-body">
            {classData?.school ? classData.school.name : $t('classes.independent')} • {classData?.schedule}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => goto(`/panel/classes/${classData.id}/attendance`)}
        class="bg-zinc-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-zinc-800 hover:border-primary-500/50 transition-all flex items-center gap-3"
      >
        <ClipboardText weight="duotone" class="w-4 h-4 text-primary-400" />
        {$t('classes.attendance')}
      </button>
      <button 
        onclick={() => goto(`/panel/classes/${classData.id}/edit`)}
        class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3"
      >
        <Gear weight="duotone" class="w-4 h-4" />
        {$t('classes.configure')}
      </button>
    </div>
  </div>

  <!-- Tab Navigation -->
  <div class="flex items-center gap-1 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 w-fit backdrop-blur-xl">
    <button 
      onclick={() => currentView = 'overview'}
      class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'overview' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-zinc-500 hover:text-white'}`}
    >
      <ChartBar weight="duotone" class="w-3.5 h-3.5" />
      {$t('classes.overview')}
    </button>
    <button 
      onclick={() => currentView = 'students'}
      class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'students' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-zinc-500 hover:text-white'}`}
    >
      <Users weight="duotone" class="w-3.5 h-3.5" />
      {$t('classes.students')} ({students.length})
    </button>
    <button 
      onclick={() => currentView = 'skills'}
      class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'skills' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-zinc-500 hover:text-white'}`}
    >
      <Target weight="duotone" class="w-3.5 h-3.5" />
      {$t('classes.syllabus')} ({classSkills.length})
    </button>
  </div>

  {#if currentView === 'overview'}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10" in:fly={{ y: 20 }}>
      <!-- Main Info Panel -->
      <div class="lg:col-span-2 space-y-8">
        <section class="bento-card p-8 space-y-8 border-t-4 border-primary-500">
           <div class="flex items-center justify-between">
              <h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">
                <Folders weight="duotone" class="w-5 h-5 text-primary-400" />
                {$t('classes.details')}
              </h2>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-zinc-950 rounded-2xl text-primary-400 border border-zinc-800">
                    <Clock weight="duotone" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('classes.schedule')}</p>
                    <p class="text-white font-bold">{classData?.schedule}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="p-3 bg-zinc-950 rounded-2xl text-primary-400 border border-zinc-800">
                    <MapPin weight="duotone" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('classes.location')}</p>
                    <p class="text-white font-bold">{classData?.room || $t('classes.to_be_defined')}</p>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-zinc-950 rounded-2xl text-primary-400 border border-zinc-800">
                    <Calendar weight="duotone" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('classes.period')}</p>
                    <p class="text-white font-bold text-xs">
                      {new Date(classData?.start_date).toLocaleDateString()} - {new Date(classData?.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="p-3 bg-zinc-950 rounded-2xl text-primary-400 border border-zinc-800">
                    <CurrencyEur weight="duotone" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('classes.fee')}</p>
                    <p class="text-white font-bold">{formatCurrency(classData?.price || 0)}</p>
                  </div>
                </div>
              </div>
           </div>

           {#if classData?.description}
             <div class="bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl">
               <h3 class="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">{$t('classes.description')}</h3>
               <p class="text-zinc-400 text-sm leading-relaxed font-medium font-body">{classData.description}</p>
             </div>
           {/if}
        </section>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onclick={() => goto(`/panel/students/create?classId=${classData.id}&schoolId=${classData.school_id}`)}
            class="bento-card p-8 text-left hover:border-primary-500/50 transition-all group relative overflow-hidden"
          >
            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserPlus weight="duotone" class="w-24 h-24 text-white" />
            </div>
            <UserPlus weight="duotone" class="w-8 h-8 text-primary-400 mb-4" />
            <h4 class="text-white font-black uppercase text-sm mb-1">{$t('students.enroll_btn')}</h4>
            <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{$t('students.enroll_desc')}</p>
          </button>

          <button 
            onclick={() => goto(`/panel/classes/${classData.id}/attendance`)}
            class="bento-card p-8 text-left hover:border-primary-500/50 transition-all group relative overflow-hidden"
          >
            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ClipboardText weight="duotone" class="w-24 h-24 text-white" />
            </div>
            <ClipboardText weight="duotone" class="w-8 h-8 text-primary-400 mb-4" />
            <h4 class="text-white font-black uppercase text-sm mb-1">{$t('classes.take_attendance')}</h4>
            <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{$t('classes.take_attendance')}</p>
          </button>
        </div>
      </div>

      <!-- Stats Sidebar -->
      <div class="space-y-8">
        <!-- Capacity Card -->
        <div class="bento-card p-8 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-[10px] font-black text-white uppercase tracking-widest">{$t('classes.occupancy')}</h3>
            <span class="text-xs font-black text-primary-400">{classStats.occupancy_rate}%</span>
          </div>
          
          <div class="h-3 bg-zinc-950 rounded-full border border-zinc-900 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000"
              style="width: {classStats.occupancy_rate}%"
            ></div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-center">
               <p class="text-[8px] font-black text-zinc-500 uppercase mb-1">{$t('students.status_active')}</p>
               <p class="text-xl font-black text-white">{classStats.active_students}</p>
            </div>
            <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-center">
               <p class="text-[8px] font-black text-zinc-500 uppercase mb-1">{$t('classes.available')}</p>
               <p class="text-xl font-black text-primary-400">{(classData.max_students || 0) - classStats.total_students}</p>
            </div>
          </div>
        </div>

        <!-- Attendance Stats -->
        <div class="bento-card p-8 space-y-6">
           <h3 class="text-[10px] font-black text-white uppercase tracking-widest">{$t('classes.metrics')}</h3>
           
           <div class="space-y-4 font-body text-sm">
              <div class="flex items-center justify-between py-2 border-b border-zinc-900">
                <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('classes.attendance_rate')}</span>
                <span class="text-xs font-black text-primary-400">{attendanceStats.average_attendance_rate}%</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-zinc-900">
                <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('classes.punctuality')}</span>
                <span class="text-xs font-black text-blue-400">{attendanceStats.average_punctuality_rate}%</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('classes.last_session')}</span>
                <span class="text-[10px] font-bold text-white uppercase">{new Date(attendanceStats.last_session_date).toLocaleDateString()}</span>
              </div>
           </div>
        </div>

        <!-- Trophy/Motivation -->
        <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5 text-center space-y-2">
           <Trophy weight="duotone" class="w-10 h-10 text-primary-400 mx-auto mb-2" />
           <p class="text-[10px] font-black text-white uppercase tracking-widest">{$t('classes.group_progress')}</p>
           <p class="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider">{$t('classes.progress_desc', { percent: 45 })}</p>
        </div>
      </div>
    </div>

  {:else if currentView === 'students'}
    <div class="space-y-6" in:fly={{ y: 20 }}>
      <div class="flex items-center justify-between">
         <h2 class="text-xl font-black text-white uppercase tracking-tighter">{$t('students.records')}</h2>
         <div class="flex items-center gap-3">
             <button 
               onclick={() => goto(`/panel/classes/${classData.id}/students`)}
               class="bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-800 hover:border-primary-500/50 transition-all flex items-center gap-2"
             >
               <Users weight="duotone" class="w-4 h-4" />
               {$t('common.manage')}
             </button>
         </div>
      </div>

      {#if students.length === 0}
         <div class="bento-card p-20 text-center space-y-6 border-dashed">
            <div class="w-20 h-20 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mx-auto text-zinc-800">
               <Users weight="duotone" class="w-10 h-10" />
            </div>
            <div class="space-y-2">
              <h3 class="text-white font-black uppercase">{$t('students.no_records')}</h3>
              <p class="text-zinc-500 text-xs font-medium uppercase tracking-widest">{$t('students.start_adding')}</p>
            </div>
            <button 
              onclick={() => goto(`/panel/students/create?classId=${classData.id}`)}
              class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20"
            >
              {$t('students.enroll_btn')}
            </button>
         </div>
      {:else}
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each students as student}
               <div class="bento-card p-6 hover:border-primary-500/30 transition-all group">
                  <div class="flex items-center gap-4 mb-6">
                     <div class="w-14 h-14 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-primary-400 font-black text-lg group-hover:border-primary-500/50 transition-colors">
                        {student.name.charAt(0)}
                     </div>
                     <div>
                        <h4 class="text-white font-black uppercase text-sm leading-tight">{student.name}</h4>
                        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{student.age} {$t('students.years')} • {levelLabels[student.level as keyof typeof levelLabels] || $t('common.mixed')}</p>
                     </div>
                  </div>

                  <div class="space-y-3 pb-6 border-b border-zinc-900 mb-6 font-body">
                     <div class="flex items-center gap-3 text-zinc-400">
                        <Envelope weight="duotone" class="w-3.5 h-3.5 text-primary-500/50" />
                        <span class="text-[10px] font-bold truncate uppercase tracking-wider">{student.email || $t('students.no_email')}</span>
                     </div>
                     <div class="flex items-center gap-3 text-zinc-400">
                        <Phone weight="duotone" class="w-3.5 h-3.5 text-primary-500/50" />
                        <span class="text-[10px] font-bold uppercase tracking-wider">{student.phone || $t('students.no_phone')}</span>
                     </div>
                  </div>

                  <div class="flex items-center justify-between">
                     <div class="flex items-center gap-2">
                        <div class={`w-1.5 h-1.5 rounded-full ${student.active ? 'bg-primary-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-zinc-800'}`}></div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500">{student.active ? $t('students.status_active') : $t('students.status_inactive')}</span>
                     </div>
                     <button 
                       onclick={() => goto(`/panel/students/${student.id}`)}
                       class="p-2 bg-zinc-950 rounded-xl border border-zinc-800 hover:text-primary-400 transition-colors text-zinc-500"
                     >
                       <Eye weight="duotone" class="w-4 h-4" />
                     </button>
                  </div>
               </div>
            {/each}
         </div>
      {/if}
    </div>

  {:else if currentView === 'skills'}
    <div class="space-y-6" in:fly={{ y: 20 }}>
      <div class="flex items-center justify-between">
         <h2 class="text-xl font-black text-white uppercase tracking-tighter">{$t('classes.syllabus')}</h2>
         <button 
           onclick={() => goto(`/panel/classes/${classData.id}/skills`)}
           class="bg-primary-500 text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all flex items-center gap-2"
         >
           <Plus weight="bold" class="w-4 h-4" />
           {$t('common.manage')}
         </button>
      </div>

      {#if classSkills.length === 0}
         <div class="bento-card p-20 text-center space-y-6 border-dashed">
            <Target weight="duotone" class="w-16 h-16 text-zinc-800 mx-auto" />
            <div class="space-y-2">
              <h3 class="text-white font-black uppercase">{$t('classes.no_syllabus')}</h3>
              <p class="text-zinc-500 text-xs font-medium uppercase tracking-widest">{$t('classes.no_syllabus_desc')}</p>
            </div>
         </div>
      {:else}
         <div class="space-y-4">
            {#each classSkills as skill, i}
               <div class="bento-card p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary-500/30 transition-all">
                  <div class="text-2xl font-black text-zinc-900 group-hover:text-primary-500/20 transition-colors">
                     {(i+1).toString().padStart(2, '0')}
                  </div>
                  <div class="flex-1 space-y-2">
                     <div class="flex items-center gap-3">
                        <h4 class="text-white font-black uppercase text-base">{skill.skill.name}</h4>
                        <span class="text-[8px] font-black px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-500 uppercase tracking-widest">
                          {skill.skill.category?.name}
                        </span>
                     </div>
                     <p class="text-zinc-400 text-xs font-medium leading-relaxed max-w-2xl font-body">{skill.skill.description}</p>
                  </div>
                  <div class="flex items-center gap-1">
                     {#each Array(5) as _, j}
                        <Star weight={j < skill.skill.difficulty ? 'fill' : 'duotone'} class={`w-3.5 h-3.5 ${j < skill.skill.difficulty ? 'text-primary-500 shadow-glow' : 'text-zinc-800'}`} />
                     {/each}
                  </div>
               </div>
            {/each}
         </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Custom glow for active stars */
  .shadow-glow {
    filter: drop-shadow(0 0 4px rgba(139, 92, 246, 0.5));
  }
</style>
