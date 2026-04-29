<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    CheckCircle, 
    XCircle, 
    CalendarBlank, 
    Users, 
    CaretLeft, 
    CaretRight,
    MagnifyingGlass,
    Clock,
    UserCheck,
    CloudCheck,
    ListChecks,
    Table,
    Calendar,
    Layout,
    ArrowRight,
    CaretDown,
    Sparkle,
    Selection,
    ChartLineUp,
    CheckCircle as CheckCircleIcon,
    UsersThree,
    Hourglass,
    ArrowCircleUpRight,
    Fingerprint,
    ShieldCheck,
    Pulse,
    FloppyDisk,
    Warning
  } from 'phosphor-svelte';
  import { superForm } from 'sveltekit-superforms';
  import { zod4 as zod } from 'sveltekit-superforms/adapters';
  import { attendanceSchema } from '$lib/schemas/attendance';
  import VisualAttendanceCalendar from '$lib/components/Attendance/VisualAttendanceCalendar.svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { toast } from '$lib/stores/toast';

  import type { PageData } from './$types';
  import type { AttendanceSchema } from '$lib/schemas/attendance';

  let { data }: { data: PageData } = $props();

  const { form, enhance, delayed, message, isTainted } = superForm(untrack(() => data.form) as any, {
    validators: zod(attendanceSchema as any),
    dataType: 'json',
    onUpdated({ form }) {
      if (form.valid) {
        toast.success((form.message as string) || $t('attendance.record_success'));
      } else if (form.message) {
        toast.error(form.message as string);
      }
    },
    onError({ result }) {
      toast.error((result as any).error?.message || $t('common.error_occurred'));
    }
  }) as any;

  let viewMode = $state('list'); // 'list' | 'calendar'
  let searchQuery = $state('');
  
  // Derived data from server load
  let classes = $derived(data.classes || []);
  let students = $derived(data.students || []);
  let allAttendance = $derived(data.allAttendance || []);

  let selectedClassId = $derived($form.classId);
  let selectedDate = $derived($form.date);
  let selectedClass = $derived(classes.find((c: any) => c.id === selectedClassId));
  
  // Alumnos inscritos en la clase seleccionada
  let classStudents = $derived.by(() => {
    let filtered;
    if (selectedClassId === 'independent') {
      filtered = students.filter((s: any) => !s.classId);
    } else {
      if (!selectedClass) return [];
      filtered = students.filter((s: any) => 
        s.classId === selectedClassId || 
        (selectedClass as any).studentIds?.includes(s.id)
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((s: any) => s.name.toLowerCase().includes(q));
    }
    return filtered;
  });

  const handleParamChange = () => {
    const params = new URLSearchParams($page.url.searchParams);
    if ($form.classId) params.set('classId', $form.classId);
    else params.delete('classId');
    
    if ($form.date) params.set('date', $form.date);
    
    goto(`?${params.toString()}`, { replaceState: true, keepFocus: true, noScroll: true });
  };

  const setStatus = (studentId: string, status: 'P' | 'A') => {
    const records = $form.records as Array<{studentId: string; status: string}>;
    const index = records.findIndex((r) => r.studentId === studentId);
    if (index === -1) {
      $form.records = [...records, { studentId, status }];
    } else {
      ($form.records as any)[index].status = status;
    }
  };

  const getStatus = (studentId: string) => {
    const record = $form.records.find((r: any) => r.studentId === studentId);
    if (!record) return 'unmarked';
    return (record as any).status === 'P' ? 'present' : (record as any).status === 'A' ? 'absent' : 'unmarked';
  };

  const markAllPresent = () => {
    classStudents.forEach((student: any) => {
      setStatus(student.id, 'P');
    });
  };

  const stats = $derived.by(() => {
    const records = $form.records;
    const present = records.filter((r: any) => r.status === 'P').length;
    const absent = records.filter((r: any) => r.status === 'A').length;
    const total = classStudents.length;
    return { 
      present, 
      absent,
      total, 
      unmarked: total - (present + absent),
      percent: total > 0 ? Math.round((present / total) * 100) : 0 
    };
  });

  const getEngagementLabel = (percent: number) => {
    if (percent >= 90) return { label: $t('attendance.legend.excellent'), color: 'text-primary-400', bg: 'bg-primary-500/10' };
    if (percent >= 70) return { label: $t('attendance.legend.regular'), color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: $t('attendance.legend.critical'), color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const formatLabel = (str: string | undefined | null) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };
</script>

<svelte:head>
  <title>{$t('attendance.title')} - ChessNet</title>
</svelte:head>

<form method="POST" action="?/update" use:enhance class="max-w-[1440px] mx-auto px-6 pb-32" in:fade>
  <!-- Hidden inputs for mapping -->
  <input type="hidden" name="classId" bind:value={$form.classId} />
  <input type="hidden" name="date" bind:value={$form.date} />

  <!-- Ambient Background -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary-500/5 rounded-none blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-blue-500/5 rounded-none blur-[100px] opacity-50"></div>
  </div>

  <!-- Header Section -->
  <div class="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16 pt-16">
    <div class="space-y-4">
      <div class="flex items-center gap-8">
        <div class="relative group">
          <div class="absolute -inset-4 bg-primary-500/30 rounded-none blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div class="w-20 h-20 bg-zinc-950 border border-white/10 rounded-none flex items-center justify-center text-primary-400 shadow-2xl relative z-10 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-transparent"></div>
            <ListChecks size={36} weight="duotone" class="group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-3">
             <span class="px-2.5 py-1 bg-primary-500/10 border border-primary-500/20 rounded-none text-[10px] font-black text-primary-400 uppercase tracking-widest font-outfit">
               {$t('attendance.management_protocol')}
             </span>
             <span class="w-1.5 h-1.5 rounded-none bg-zinc-800"></span>
             <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-outfit">{$t('attendance.operational_intelligence')}</span>
          </div>
          <h1 class="text-6xl font-outfit font-black text-white tracking-tight uppercase leading-[0.85]">
            {$t('attendance.title')}<span class="text-primary-500 italic">.</span>
          </h1>
          <p class="text-zinc-400 font-jakarta text-lg font-medium tracking-tight mt-4 opacity-70">
            {$t('attendance.subtitle')}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 bg-zinc-900/40 p-1.5 rounded-none border border-white/5 backdrop-blur-xl">
      <button 
        type="button"
        onclick={() => viewMode = 'list'}
        class="flex items-center gap-2.5 px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all font-outfit
        {viewMode === 'list' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}"
      >
        <Table weight={viewMode === 'list' ? 'fill' : 'bold'} size={18} />
        {$t('attendance.view.take')}
      </button>
      <button 
        type="button"
        onclick={() => viewMode = 'calendar'}
        class="flex items-center gap-2.5 px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all font-outfit
        {viewMode === 'calendar' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}"
      >
        <Calendar weight={viewMode === 'calendar' ? 'fill' : 'bold'} size={18} />
        {$t('attendance.view.calendar')}
      </button>
    </div>
  </div>

  <!-- Selection Matrix -->
  <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
    <div class="lg:col-span-8 bento-card p-1">
      <div class="bg-zinc-950/40 backdrop-blur-3xl rounded-none p-8 h-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Class Selector -->
          <div class="space-y-3">
            <label for="class-select" class="flex items-center gap-2.5 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 font-outfit">
              <UsersThree size={16} weight="bold" class="text-primary-500" />
              {$t('attendance.select_class')}
            </label>
            <div class="relative group">
              <select 
                id="class-select"
                bind:value={$form.classId}
                onchange={handleParamChange}
                class="w-full bg-zinc-900 border border-white/5 rounded-none px-6 py-4 text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer text-sm font-bold font-jakarta"
              >
                <option value="">{$t('attendance.select_placeholder')}</option>
                <option value="independent">{$t('students.independent_student')}</option>
                {#each classes as cls}
                  <option value={cls.id}>{cls.name}</option>
                {/each}
              </select>
              <CaretDown weight="bold" size={14} class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-hover:text-primary-400 transition-colors" />
            </div>
          </div>

          <!-- Date Picker -->
          <div class="space-y-3">
            <label for="date-select" class="flex items-center gap-2.5 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 font-outfit">
              <CalendarBlank size={16} weight="bold" class="text-blue-500" />
              {$t('attendance.session_date')}
            </label>
            <div class="relative group">
              <input 
                id="date-select"
                type="date"
                bind:value={$form.date}
                onchange={handleParamChange}
                class="w-full bg-zinc-900 border border-white/5 rounded-none px-6 py-4 text-white focus:border-primary-500/50 outline-none transition-all cursor-pointer text-sm font-bold font-jakarta [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-4 bento-card p-8 bg-primary-500/5 border border-primary-500/10 flex flex-col justify-between group">
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-6">
          <div class="w-12 h-12 bg-primary-500/10 rounded-none border border-primary-500/20 flex items-center justify-center text-primary-400">
             <ChartLineUp size={24} weight="duotone" />
          </div>
          {#if selectedClassId}
            <div class="{getEngagementLabel(stats.percent).bg} {getEngagementLabel(stats.percent).color} px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest border border-current/20">
              {getEngagementLabel(stats.percent).label}
            </div>
          {/if}
        </div>
        
        <p class="text-[10px] font-black text-primary-400/60 uppercase tracking-widest mb-1 font-outfit">{$t('attendance.participation_rate')}</p>
        <h2 class="text-5xl font-outfit font-black text-white leading-none tracking-tighter">
          {stats.percent}<span class="text-2xl ml-1 text-primary-500/50">%</span>
        </h2>
      </div>

      <button 
        type="button"
        onclick={markAllPresent}
        disabled={!selectedClassId || $delayed}
        class="mt-8 bg-white text-black py-4.5 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30 disabled:grayscale font-outfit"
      >
        <CheckCircleIcon weight="fill" size={18} />
        {$t('attendance.mark_all_present')}
      </button>
    </div>
  </div>

  <!-- Content Section -->
  <div class="relative z-10 transition-all duration-700">
    {#if !selectedClassId}
      <!-- Selective Guidance -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" in:fly={{ y: 30, duration: 800 }}>
        <div class="bento-card p-10 bg-zinc-900/30 backdrop-blur-3xl border border-white/5 rounded-none text-center space-y-8 group hover:bg-zinc-900/50 transition-colors">
          <div class="w-20 h-20 bg-zinc-950 rounded-none border border-white/5 mx-auto flex items-center justify-center text-slate-600 group-hover:text-primary-400 group-hover:rotate-12 transition-all duration-500 shadow-inner">
            <Layout size={36} weight="duotone" />
          </div>
          <div>
            <h3 class="text-lg font-outfit font-black text-white uppercase tracking-tighter">{$t('attendance.select_class')}</h3>
            <p class="text-slate-500 font-jakarta text-xs uppercase tracking-widest mt-3 opacity-60 leading-relaxed">{$t('attendance.select_placeholder')}</p>
          </div>
        </div>

        <div class="bento-card p-10 bg-zinc-900/30 backdrop-blur-3xl border border-white/5 rounded-none text-center space-y-8 group hover:bg-zinc-900/50 transition-colors">
          <div class="w-20 h-20 bg-zinc-950 rounded-none border border-white/5 mx-auto flex items-center justify-center text-slate-600 group-hover:text-blue-400 group-hover:rotate-12 transition-all duration-500 shadow-inner">
            <Clock size={36} weight="duotone" />
          </div>
          <div>
            <h3 class="text-lg font-outfit font-black text-white uppercase tracking-tighter">{$t('attendance.session_date')}</h3>
            <p class="text-slate-500 font-jakarta text-xs uppercase tracking-widest mt-3 opacity-60 leading-relaxed">Default: Current protocol date</p>
          </div>
        </div>

        <div class="bento-card p-10 bg-zinc-900/30 backdrop-blur-3xl border border-white/5 rounded-none text-center space-y-8 group hover:bg-zinc-900/50 transition-colors">
          <div class="w-20 h-20 bg-zinc-950 rounded-none border border-white/5 mx-auto flex items-center justify-center text-slate-600 group-hover:text-amber-400 group-hover:rotate-12 transition-all duration-500 shadow-inner">
            <Hourglass size={36} weight="duotone" />
          </div>
          <div>
            <h3 class="text-lg font-outfit font-black text-white uppercase tracking-tighter">Quick Scan</h3>
            <p class="text-slate-500 font-jakarta text-xs uppercase tracking-widest mt-3 opacity-60 leading-relaxed">Ready for automated registration</p>
          </div>
        </div>
      </div>
    {:else if classStudents.length === 0}
      <div class="bento-card p-24 bg-zinc-900/30 backdrop-blur-3xl border border-dashed border-white/10 rounded-none text-center max-w-4xl mx-auto space-y-10" in:scale={{ start: 0.95 }}>
        <div class="w-32 h-32 bg-zinc-950 rounded-none border border-white/5 mx-auto flex items-center justify-center text-slate-700 shadow-inner">
          <UsersThree size={64} weight="duotone" />
        </div>
        <div class="space-y-4">
          <h2 class="text-4xl font-outfit font-black text-white uppercase tracking-tighter">{$t('attendance.no_students')}</h2>
          <p class="text-slate-500 font-jakarta text-lg font-medium max-w-sm mx-auto opacity-60">{$t('attendance.no_students_desc')}</p>
        </div>
        {#if selectedClassId !== 'independent'}
          <button 
            type="button"
            onclick={() => goto(`/panel/classes/${selectedClassId}`)}
            class="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-outfit font-black text-[10px] uppercase tracking-[0.4em] rounded-none border border-white/10 transition-all flex items-center gap-6 mx-auto group"
          >
            {$t('attendance.setup_class')}
            <ArrowRight weight="bold" class="group-hover:translate-x-3 transition-transform" />
          </button>
        {/if}
      </div>
    {:else}
      {#if viewMode === 'list'}
        <div class="space-y-12" in:fly={{ y: 20 }}>
          <!-- List Toolbar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div class="flex items-center gap-8">
               <div class="flex items-center gap-4">
                 <div class="h-10 w-1.5 bg-primary-500 rounded-none shadow-glow-primary"></div>
                 <h2 class="text-3xl font-outfit font-black text-white uppercase tracking-tighter">{$t('attendance.list_title')}</h2>
               </div>
               <div class="px-5 py-2 bg-zinc-900/50 border border-white/5 rounded-none flex items-center gap-4 backdrop-blur-md">
                 <UsersThree size={18} weight="duotone" class="text-slate-500" />
                 <span class="text-[10px] font-black text-slate-200 uppercase tracking-widest">{classStudents.length} {$t('attendance.students')}</span>
               </div>
             </div>

             <div class="flex items-center gap-6">
                <!-- Search bar -->
                <div class="relative group w-full md:w-80">
                  <MagnifyingGlass class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                  <input 
                    type="text"
                    bind:value={searchQuery}
                    placeholder={$t('common.search')}
                    class="w-full bg-zinc-900/50 border border-white/5 rounded-none pl-14 pr-6 py-4 text-sm font-jakarta font-medium text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-zinc-700 backdrop-blur-md"
                  />
                </div>
             </div>
          </div>

          <!-- Students Matrix -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {#each classStudents as student (student.id)}
              <div class="bento-card p-6 flex flex-col sm:flex-row items-center justify-between gap-8 group">
                <div class="flex items-center gap-5 w-full">
                  <div class="relative">
                    <div class="w-14 h-14 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center text-lg font-outfit font-black text-primary-400 group-hover:scale-105 transition-transform duration-500">
                      {student.name ? student.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : '?'}
                    </div>
                    {#if getStatus(student.id) === 'present'}
                       <div class="absolute -bottom-1 -right-1 bg-primary-500 text-black p-1 rounded-none border-4 border-zinc-900 shadow-xl scale-110" transition:scale>
                         <CheckCircleIcon size={12} weight="fill" />
                       </div>
                    {/if}
                  </div>
                  <div class="space-y-1">
                    <h3 class="text-lg font-outfit font-black text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight leading-none">{formatLabel(student.name)}</h3>
                    <div class="flex items-center gap-3">
                      <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{formatLabel(student.level) || $t('attendance.level_not_assigned')}</span>
                      <span class="w-1 h-1 rounded-none bg-zinc-800"></span>
                      <span class="text-[9px] font-medium text-zinc-600 uppercase tracking-widest italic">ID: {student.id.slice(0, 5)}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    type="button"
                    onclick={() => setStatus(student.id, 'P')}
                    disabled={$delayed}
                    class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-none border transition-all font-outfit font-black text-[9px] uppercase tracking-widest min-w-[110px]
                    {getStatus(student.id) === 'present' 
                      ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'bg-zinc-950/50 border-white/5 text-zinc-500 hover:border-primary-500/30 hover:text-primary-400'}"
                  >
                    <CheckCircle weight={getStatus(student.id) === 'present' ? 'fill' : 'bold'} size={18} />
                    {$t('attendance.present')}
                  </button>
                  <button 
                    type="button"
                    onclick={() => setStatus(student.id, 'A')}
                    disabled={$delayed}
                    class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-none border transition-all font-outfit font-black text-[9px] uppercase tracking-widest min-w-[110px]
                    {getStatus(student.id) === 'absent' 
                      ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' 
                      : 'bg-zinc-950/50 border-white/5 text-zinc-500 hover:border-red-500/30 hover:text-red-400'}"
                  >
                    <XCircle weight={getStatus(student.id) === 'absent' ? 'fill' : 'bold'} size={18} />
                    {$t('attendance.absent')}
                  </button>
                </div>
              </div>
            {/each}
          </div>

          <!-- Bottom Summary -->
          <div class="bento-card p-10 bg-zinc-900/30 backdrop-blur-3xl border border-white/5 rounded-none flex flex-wrap items-center justify-between gap-12 mt-12">
            <div class="flex items-center gap-12 flex-wrap">
               <div class="flex gap-10">
                  <div class="text-center md:text-left">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Present</p>
                    <p class="text-2xl font-outfit font-black text-white">{stats.present}</p>
                  </div>
                  <div class="text-center md:text-left">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Absent</p>
                    <p class="text-2xl font-outfit font-black text-white">{stats.absent}</p>
                  </div>
                  <div class="text-center md:text-left">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Unmarked</p>
                    <p class="text-2xl font-outfit font-black text-slate-500">{stats.unmarked}</p>
                  </div>
               </div>
            </div>

            <div class="flex items-center gap-6">
               <div class="text-right hidden sm:block">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Engagement level</p>
                  <p class="text-sm font-black text-primary-400 uppercase tracking-widest">{getEngagementLabel(stats.percent).label}</p>
               </div>
               <div class="w-16 h-16 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center text-primary-400 shadow-inner group overflow-hidden relative">
                  <div class="absolute inset-0 bg-primary-500/10 group-hover:scale-110 transition-transform"></div>
                  <Pulse size={32} weight="duotone" class="relative z-10" />
               </div>
            </div>
          </div>
        </div>
      {:else}
        <div class="bento-card p-10 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-none shadow-2xl overflow-hidden relative" in:fade>
           <!-- Background Decal -->
           <div class="absolute -left-20 -top-20 text-primary-600/[0.02] rotate-45 pointer-events-none">
              <Calendar weight="fill" size={400} />
           </div>
           
           <div class="relative z-10">
             <div class="flex items-center gap-6 mb-12">
               <div class="p-4 bg-primary-600/10 rounded-none border border-primary-500/20 text-primary-400">
                  <ChartLineUp size={28} weight="duotone" />
               </div>
               <div>
                  <h2 class="text-3xl font-outfit font-black text-white uppercase tracking-tighter">{$t('attendance.calendar.title')}</h2>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 italic">{$t('attendance.session_insights')}</p>
               </div>
             </div>

             <VisualAttendanceCalendar 
               {selectedClassId} 
               attendance={allAttendance} 
               onDateSelect={(date: string) => {
                 $form.date = date;
                 handleParamChange();
                 viewMode = 'list';
               }}
             />
           </div>
        </div>
      {/if}
    {/if}
  </div>

  <!-- Floating Save Bar -->
  {#if isTainted && selectedClassId && viewMode === 'list'}
    <div 
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-2xl"
      transition:fly={{ y: 50, duration: 600, easing: cubicOut }}
    >
      <div class="bg-zinc-950/80 backdrop-blur-2xl border border-primary-500/30 p-4 shadow-2xl shadow-primary-500/20 flex items-center justify-between gap-6">
        <div class="flex items-center gap-4 ml-2">
          <div class="w-10 h-10 bg-primary-500/10 rounded-none flex items-center justify-center text-primary-400 border border-primary-500/20">
            <Warning size={20} weight="duotone" class="animate-pulse" />
          </div>
          <div>
            <p class="text-[10px] font-black text-white uppercase tracking-widest">Protocolo Pendiente</p>
            <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Sincronización manual requerida</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <button 
            type="button"
            onclick={() => {
              $form.records = [...((data.form as any).data?.records || [])];
            }}
            class="px-6 py-3 rounded-none text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white transition-colors"
          >
            {$t('common.cancel')}
          </button>
          <button 
            type="submit"
            disabled={$delayed}
            class="bg-primary-500 hover:bg-primary-400 text-white px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale font-outfit"
          >
            {#if $delayed}
              <Hourglass size={16} class="animate-spin" />
              Sincronizando...
            {:else}
              <FloppyDisk size={16} weight="bold" />
              Sincronizar Protocolo
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}
</form>

<style lang="postcss">
  :global(input[type="date"]::-webkit-calendar-picker-indicator) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='0' ry='0'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
    cursor: pointer;
    filter: drop-shadow(0 0 5px rgba(139, 92, 246, 0.5));
  }

  .shadow-glow-primary { box-shadow: 0 0 20px -5px rgba(139, 92, 246, 0.5); }
</style>
