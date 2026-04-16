<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    CaretLeft,
    CalendarBlank,
    Users,
    UserCheck,
    Clock,
    Warning,
    CheckCircle,
    XCircle,
    Plus,
    FloppyDisk,
    ChartBar,
    TrendUp,
    Target,
    Eye,
    Lightning,
    ClockCounterClockwise as History
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import type { AttendanceStatus, AttendanceRecord } from '$lib/types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t, locale } from '$lib/i18n';
  import { showToast, showError } from '$lib/stores/toast';

  const locale_map: Record<string, string> = { en: 'en-US', es: 'es-ES' };
  const getLocaleDate = (date: Date, options: Intl.DateTimeFormatOptions) => {
    return date.toLocaleDateString(locale_map[$locale] || 'es-ES', options);
  };

  let { data } = $props<{ data: PageData }>();

  const classData = $derived(data.class as any);
  const students = $derived((data.students || []) as any[]);
  const recentAttendance = $derived((data.recentAttendance || []) as any[]);
  const attendanceStats = $derived((data.attendanceStats || []) as any[]);

  let selectedDate = $state(new Date().toISOString().split('T')[0]);
  let currentAttendance = $state<Record<string, { status: AttendanceStatus; notes: string }>>({});
  let isSubmitting = $state(false);
  let showingDate = $state<string | null>(null);
  let currentView = $state<'take' | 'calendar' | 'history' | 'stats'>('take');
  let currentMonth = $state(new Date());

  const showHistoryForDate = (date: string) => {
    showingDate = showingDate === date ? null : date;
  };

  const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysArray = (date: Date) => {
    const days = [];
    const totalDays = daysInMonth(date);
    const firstDay = firstDayOfMonth(date);
    
    // Fill empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Fill days of the month
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(date.getFullYear(), date.getMonth(), i);
      const dateStr = d.toISOString().split('T')[0];
      const hasAttendance = recentAttendance.some(a => a.date === dateStr);
      days.push({ day: i, dateStr, hasAttendance });
    }
    
    return days;
  };

  const handleDateClick = (dateStr: string) => {
    selectedDate = dateStr;
    currentView = 'take';
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

      if (!response.ok) throw new Error('Error saving attendance');
      showToast.success($t('attendance.save_success'));
    } catch (error) {
      showError(error);
    } finally {
      isSubmitting = false;
    }
  };

  const statusThemes = {
    P: { icon: CheckCircle, label: $t('attendance.status.present'), color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
    T: { icon: Clock, label: $t('attendance.status.late'), color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    A: { icon: XCircle, label: $t('attendance.status.absent'), color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  };
</script>

<svelte:head>
  <title>Attendance - {classData?.name} - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header & Navigation -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-6">
      <button 
        onclick={() => goto(`/panel/classes/${classData.id}`)}
        class="flex items-center gap-2 text-zinc-500 hover:text-white transition-all group text-[10px] font-black uppercase tracking-[0.2em]"
      >
        <CaretLeft weight="bold" class="w-3 h-3 transition-transform group-hover:-translate-x-1" />
        {$t('classes.back_to_class')}
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/20">
          <UserCheck weight="duotone" class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase leading-none">{$t('actions.attendance.title')}</h1>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <span class="text-primary-500">●</span> {classData?.name} <span class="text-zinc-800">|</span> {classData?.schedule}
          </p>
        </div>
      </div>
    </div>

    <!-- View Switcher -->
    <div class="flex items-center gap-1 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 backdrop-blur-xl">
      <button 
        onclick={() => currentView = 'take'}
        class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'take' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
      >
        <Lightning weight="duotone" class="w-4 h-4" />
        {$t('attendance.view.take')}
      </button>
      <button 
        onclick={() => currentView = 'calendar'}
        class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'calendar' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
      >
        <CalendarBlank weight="duotone" class="w-4 h-4" />
        {$t('attendance.view.calendar')}
      </button>
      <button 
        onclick={() => currentView = 'history'}
        class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'history' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
      >
        <History weight="duotone" class="w-4 h-4" />
        {$t('attendance.view.history')}
      </button>
      <button 
        onclick={() => currentView = 'stats'}
        class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'stats' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
      >
        <ChartBar weight="duotone" class="w-4 h-4" />
        {$t('attendance.view.stats')}
      </button>
    </div>
  </div>

  {#if currentView === 'take'}
    <div class="space-y-8" in:fly={{ y: 20 }}>
      <!-- Control Bar Card -->
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -mr-32 -mt-32"></div>
        
        <div class="flex items-center gap-6 relative z-10">
          <div class="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner group-hover:border-primary-500/30 transition-colors">
            <CalendarBlank weight="duotone" class="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">{$t('attendance.control.session_date')}</p>
            <input 
              type="date" 
              bind:value={selectedDate}
              class="bg-transparent text-white font-black uppercase tracking-tighter text-xl outline-none cursor-pointer hover:text-primary-400 transition-colors"
            />
          </div>
        </div>

        <div class="flex items-center gap-3 relative z-10">
          <button 
            onclick={() => {
              students.forEach(s => currentAttendance[s.id].status = 'P');
            }}
            class="bg-zinc-950 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border border-zinc-800 hover:border-primary-500/50 transition-all flex items-center gap-2 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.2)]"
          >
            <CheckCircle weight="duotone" class="w-4 h-4 text-primary-400" />
            {$t('attendance.control.mark_all')}
          </button>
          
          <button 
            onclick={handleSubmitAttendance}
            disabled={isSubmitting}
            class="bg-primary-500 text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
              {$t('attendance.control.saving')}
            {:else}
              <FloppyDisk weight="bold" class="w-4 h-4" />
              {$t('attendance.control.save')}
            {/if}
          </button>
        </div>
      </div>

      <!-- Students Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {#each students as student}
          <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[24px] flex items-center justify-between group hover:border-zinc-700 transition-all shadow-xl hover:shadow-2xl">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-primary-400 font-black text-2xl group-hover:border-primary-500/50 transition-colors shadow-inner">
                {student.name?.charAt(0)}
              </div>
              <div>
                <h3 class="text-white font-black uppercase text-base leading-tight group-hover:text-primary-400 transition-colors tracking-tight">{student.name}</h3>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{student.age} {$t('common.years')}</span>
                  <span class="w-1 h-1 rounded-full bg-zinc-800"></span>
                  <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{student.level}</span>
                </div>
              </div>
            </div>

            <div class="flex bg-zinc-950 p-2 rounded-[20px] border border-zinc-800 gap-1.5 shadow-inner">
              {#each Object.entries(statusThemes) as [status, theme]}
                <button 
                  onclick={() => currentAttendance[student.id].status = status as AttendanceStatus}
                  class={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-all ${currentAttendance[student.id]?.status === status ? `${theme.bg} ${theme.color} ${theme.border} shadow-lg scale-105` : 'text-zinc-700 hover:text-zinc-400 hover:bg-zinc-900'}`}
                  title={theme.label}
                >
                  <theme.icon weight="duotone" class="w-6 h-6" />
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if currentView === 'calendar'}
    <div class="space-y-8" in:fade>
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-12 relative z-10">
          <div class="flex items-center gap-6">
            <div class="w-14 h-14 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-primary-400 shadow-inner">
              <CalendarBlank weight="duotone" class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                {getLocaleDate(currentMonth, { month: 'long', year: 'numeric' })}
              </h2>
              <p class="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] mt-3">{$t('attendance.calendar.title')}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              onclick={() => currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)}
              class="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white hover:border-primary-500/50 transition-all shadow-inner active:scale-95"
            >
              <CaretLeft weight="bold" class="w-4 h-4" />
            </button>
            <button 
              onclick={() => currentMonth = new Date()}
              class="px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-primary-500/50 transition-all shadow-inner active:scale-95"
            >
              {$t('attendance.calendar.today')}
            </button>
            <button 
              onclick={() => currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)}
              class="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white hover:border-primary-500/50 transition-all shadow-inner active:scale-95"
            >
              <CaretLeft weight="bold" class="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        <!-- Days names -->
        <div class="grid grid-cols-7 gap-4 mb-4 relative z-10">
          {#each ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'] as day}
            <div class="text-center text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] py-2">{day}</div>
          {/each}
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-4 relative z-10">
          {#each getDaysArray(currentMonth) as dayObj}
            {#if dayObj === null}
              <div class="aspect-square"></div>
            {:else}
              <button 
                onclick={() => handleDateClick(dayObj.dateStr)}
                class={`aspect-square rounded-[24px] p-4 flex flex-col items-center justify-center gap-2 border transition-all relative group/day active:scale-95 ${dayObj.dateStr === new Date().toISOString().split('T')[0] ? 'bg-primary-500 border-primary-400 text-black shadow-lg shadow-primary-500/20' : (dayObj.hasAttendance ? 'bg-zinc-800/50 border-zinc-700 text-white hover:border-primary-500' : 'bg-zinc-950/50 border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-white')}`}
              >
                <span class="text-xl font-black tracking-tighter">{dayObj.day}</span>
                {#if dayObj.hasAttendance}
                  <div class={`w-1.5 h-1.5 rounded-full ${dayObj.dateStr === new Date().toISOString().split('T')[0] ? 'bg-black' : 'bg-primary-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'}`}></div>
                {/if}
              </button>
            {/if}
          {/each}
        </div>

        <!-- Legend -->
        <div class="mt-12 pt-8 border-t border-zinc-800/50 flex items-center gap-8 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{$t('attendance.calendar.recorded')}</span>
          </div>
          <div class="flex items-center gap-3">
             <div class="w-3 h-3 bg-zinc-950 border border-zinc-800 rounded-full"></div>
             <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{$t('attendance.calendar.no_records')}</span>
          </div>
          <div class="flex items-center gap-3 ml-auto">
             <Lightning weight="duotone" class="w-3 h-3 text-primary-500" />
             <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">{$t('attendance.calendar.click_to_take')}</span>
          </div>
        </div>
      </div>
    </div>

  {:else if currentView === 'history'}
    <div class="space-y-6" in:fly={{ y: 20 }}>
      {#if recentAttendance.length === 0}
        <div class="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-24 text-center space-y-6">
           <div class="w-24 h-24 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mx-auto text-zinc-800">
             <History weight="duotone" class="w-12 h-12" />
           </div>
           <div>
             <h3 class="text-white font-black uppercase tracking-widest text-sm">{$t('attendance.history.no_records')}</h3>
             <p class="text-zinc-500 text-[10px] font-medium uppercase mt-2 tracking-widest">{$t('attendance.history.saved_desc')}</p>
           </div>
        </div>
      {:else}
        <div class="grid grid-cols-1 gap-4">
          {#each recentAttendance as session}
            <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[24px] group hover:border-primary-500/30 transition-all shadow-xl">
               <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div class="flex items-center gap-6">
                     <div class="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-primary-400 shadow-inner group-hover:border-primary-500/30 transition-colors">
                        <CalendarBlank weight="duotone" class="w-7 h-7" />
                     </div>
                     <div>
                        <h4 class="text-white font-black uppercase tracking-tighter text-xl leading-none">
                          {getLocaleDate(new Date(session.date), { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h4>
                        <div class="flex gap-4 mt-3">
                           <div class="flex items-center gap-1.5">
                             <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                             <span class="text-[9px] font-black text-primary-400 uppercase tracking-widest">{session.records.filter((r: any) => r.status === 'P').length} {$t('attendance.status.present')}</span>
                           </div>
                           <div class="flex items-center gap-1.5">
                             <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                             <span class="text-[9px] font-black text-yellow-400 uppercase tracking-widest">{session.records.filter((r: any) => r.status === 'T').length} {$t('attendance.status.late')}</span>
                           </div>
                           <div class="flex items-center gap-1.5">
                             <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                             <span class="text-[9px] font-black text-red-400 uppercase tracking-widest">{session.records.filter((r: any) => r.status === 'A').length} {$t('attendance.status.absent')}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <button 
                    onclick={() => showHistoryForDate(session.date)}
                    class={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all ${showingDate === session.date ? 'bg-white text-black border-white shadow-xl shadow-white/5' : 'bg-zinc-950 text-white border-zinc-800 hover:border-primary-500'}`}
                  >
                    {showingDate === session.date ? $t('attendance.history.hide_details') : $t('attendance.history.view_report')}
                  </button>
               </div>

               {#if showingDate === session.date}
                 <div class="mt-8 pt-8 border-t border-zinc-800/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" transition:fade>
                    {#each session.records as rec}
                      <div class="flex flex-col p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner group/item">
                         <span class="text-[10px] font-black text-zinc-300 uppercase truncate mb-3 leading-none">{rec.student_name}</span>
                         <span class={`w-fit text-[8px] font-black px-2.5 py-1 rounded-lg uppercase border ${statusThemes[rec.status as keyof typeof statusThemes].bg} ${statusThemes[rec.status as keyof typeof statusThemes].color} ${statusThemes[rec.status as keyof typeof statusThemes].border}`}>
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
        <div class="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px] space-y-8 relative overflow-hidden group hover:border-zinc-700 transition-all shadow-xl">
           <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[50px] -mr-16 -mt-16"></div>
           
           <div class="flex items-center gap-4 relative z-10">
              <div class="w-16 h-16 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-primary-400 font-black text-2xl shadow-inner">
                 {stats.student_name?.charAt(0)}
              </div>
              <div>
                 <h4 class="text-white font-black uppercase text-base leading-tight truncate max-w-[160px] tracking-tight">{stats.student_name}</h4>
                 <div class="flex items-center gap-2 mt-1.5">
                   <Lightning weight="fill" class="w-3 h-3 text-primary-500" />
                   <p class="text-[9px] font-black text-primary-400 uppercase tracking-widest">({stats.attendance_rate}%) {$t('attendance.stats.performance')}</p>
                 </div>
              </div>
           </div>

           <div class="grid grid-cols-3 gap-2 relative z-10">
              <div class="text-center p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner group-hover:border-primary-500/20 transition-colors">
                 <p class="text-[8px] font-black text-primary-400 uppercase mb-2">OK</p>
                 <p class="text-2xl font-black text-white tracking-tighter">{stats.present_count}</p>
              </div>
              <div class="text-center p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner group-hover:border-yellow-500/20 transition-colors">
                 <p class="text-[8px] font-black text-yellow-400 uppercase mb-2">LATE</p>
                 <p class="text-2xl font-black text-white tracking-tighter">{stats.late_count}</p>
              </div>
              <div class="text-center p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner group-hover:border-red-500/20 transition-colors">
                 <p class="text-[8px] font-black text-red-500 uppercase mb-2">ABS</p>
                 <p class="text-2xl font-black text-white tracking-tighter">{stats.absent_count}</p>
              </div>
           </div>

           <div class="space-y-4 relative z-10">
              <div class="flex items-baseline justify-between">
                 <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">{$t('attendance.stats.punctuality')}</span>
                 <span class="text-sm font-black text-white tracking-tighter">{stats.punctuality_rate}%</span>
              </div>
              <div class="h-2 bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden p-0.5">
                 <div class="h-full bg-primary-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-1000" style="width: {stats.punctuality_rate}%"></div>
              </div>
           </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  :global(.animate-fade-in) {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
