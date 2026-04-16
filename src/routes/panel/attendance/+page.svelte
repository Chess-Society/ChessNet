<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
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
    Calendar
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import VisualAttendanceCalendar from '$lib/components/Attendance/VisualAttendanceCalendar.svelte';
  import { fade, fly } from 'svelte/transition';

  let selectedClassId = $state($page.url.searchParams.get('classId') || '');
  let selectedDate = $state(new Date().toISOString().split('T')[0]);
  let viewMode = $state('list'); // 'list' | 'calendar'
  
  // Datos reactivos
  let classes = $derived($appStore.classes || []);
  let selectedClass = $derived(classes.find(c => c.id === selectedClassId));
  let students = $derived($appStore.students || []);
  
  // Alumnos inscritos en la clase seleccionada
  let classStudents = $derived(() => {
    if (selectedClassId === 'independent') {
      return students.filter(s => !s.class_id);
    }
    if (!selectedClass) return [];
    // Prioridad a class_id en el alumno, fallback a studentIds en la clase para retrocompatibilidad
    return students.filter(s => 
      s.class_id === selectedClassId || 
      selectedClass.studentIds?.includes(s.id)
    );
  });

  // Registro de asistencia actual (si existe en el store)
  let currentAttendance = $derived(() => {
    return $appStore.attendance.filter(a => a.class_id === selectedClassId && a.date === selectedDate);
  });

  const setStatus = async (studentId: string, status: string) => {
    if (!selectedClassId) return;
    
    const record = currentAttendance().find(r => r.student_id === studentId);
    
    // Si ya tiene ese estado, no hacemos nada (evita doble guardado innecesario)
    if (record?.status === status) return;

    await appStore.saveAttendance({
      id: record?.id,
      student_id: studentId,
      class_id: selectedClassId,
      date: selectedDate,
      status: status
    });
  };

  const getStatus = (studentId: string) => {
    const record = currentAttendance().find(r => r.student_id === studentId);
    if (!record) return 'unmarked';
    return record.status === 'P' ? 'present' : 'absent';
  };

  const markAllPresent = async () => {
    if (!selectedClassId) return;
    for (const student of classStudents()) {
      const record = currentAttendance().find(r => r.student_id === student.id);
      if (record?.status !== 'P') {
        await appStore.saveAttendance({
          id: record?.id,
          student_id: student.id,
          class_id: selectedClassId,
          date: selectedDate,
          status: 'P'
        });
      }
    }
  };

  const stats = $derived(() => {
    const records = currentAttendance();
    const present = records.filter(r => r.status === 'P').length;
    const total = classStudents().length;
    return { present, total, percent: total > 0 ? Math.round((present / total) * 100) : 0 };
  });

</script>

<svelte:head>
  <title>Attendance Control - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-8" transition:fade>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-500 shadow-lg shadow-violet-500/5">
        <ListChecks weight="duotone" class="w-8 h-8" />
      </div>
      <div>
        <h1 class="text-3xl font-outfit font-extrabold text-white tracking-tight">{$t('attendance.title')}</h1>
        <p class="text-slate-400 font-plus-jakarta text-sm">{$t('attendance.subtitle')}</p>
      </div>
    </div>

    <!-- View Toggle -->
    {#if selectedClassId}
    <div class="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 self-end md:self-center">
        <button 
            onclick={() => viewMode = 'list'}
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
            {viewMode === 'list' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-400 hover:text-white'}"
        >
            <Table weight="duotone" class="w-4 h-4" />
            {$t('attendance.view.take')}
        </button>
        <button 
            onclick={() => viewMode = 'calendar'}
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
            {viewMode === 'calendar' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-400 hover:text-white'}"
        >
            <Calendar weight="duotone" class="w-4 h-4" />
            {$t('attendance.view.calendar')}
        </button>
    </div>
    {/if}
  </div>

  <!-- Selection Tools Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
    <!-- Class Selector -->
    <div class="lg:col-span-4 bento-card p-6">
      <label class="block">
        <span class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest mb-3 block">{$t('attendance.select_class')}</span>
        <div class="relative">
          <Users weight="duotone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <select 
            bind:value={selectedClassId}
            class="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">{$t('attendance.select_placeholder')}</option>
            <option value="independent">{$t('students.independent_student')}</option>
            {#each classes as cls}
              <option value={cls.id}>{cls.name}</option>
            {/each}
          </select>
        </div>
      </label>
    </div>

    <!-- Date Picker -->
    <div class="lg:col-span-4 bento-card p-6">
      <label class="block">
        <span class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest mb-3 block">{$t('attendance.session_date')}</span>
        <div class="relative">
          <CalendarBlank weight="duotone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input 
            type="date"
            bind:value={selectedDate}
            class="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all cursor-pointer"
          />
        </div>
      </label>
    </div>

    <!-- Actions / Stats -->
    {#if selectedClassId}
    <div class="lg:col-span-4 bento-card p-6 bg-gradient-to-br from-violet-600/5 to-transparent flex flex-col justify-between">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest">{$t('attendance.summary')}</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-3xl font-outfit font-bold text-white">{stats().present}</span>
            <span class="text-slate-500 font-outfit leading-none">/ {stats().total} {$t('attendance.students')}</span>
          </div>
        </div>
        <div class="relative h-12 w-12">
            <svg class="h-12 w-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="4" fill="transparent" class="text-white/5"/>
                <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="4" fill="transparent" class="text-violet-500" 
                    stroke-dasharray="{20 * 2 * Math.PI}" 
                    stroke-dashoffset="{20 * 2 * Math.PI * (1 - stats().percent / 100)}" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {stats().percent}%
            </div>
        </div>
      </div>
      <button 
        onclick={markAllPresent}
        class="w-full btn-pill bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all shadow-violet-500/10 shadow-lg"
      >
        <CheckCircle weight="duotone" class="w-5 h-5" />
        {$t('attendance.mark_all_present')}
      </button>
    </div>
    {/if}
  </div>

  <!-- Empty State / List -->
  {#if !selectedClassId}
    <div class="bento-card bg-zinc-900/40 border-dashed p-24 text-center flex flex-col items-center gap-6" transition:fly={{ y: 20 }}>
      <div class="w-24 h-24 bg-zinc-800/50 rounded-[32px] flex items-center justify-center text-slate-600 shadow-inner">
        <Clock weight="duotone" class="w-12 h-12" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-outfit font-bold text-white">{$t('attendance.select_class')}</h2>
        <p class="text-slate-500 font-plus-jakarta max-w-xs mx-auto">{$t('attendance.select_placeholder')}</p>
      </div>
    </div>
  {:else if classStudents().length === 0}
    <div class="bento-card bg-zinc-900/40 border-dashed p-24 text-center flex flex-col items-center gap-6" transition:fly={{ y: 20 }}>
      <div class="w-24 h-24 bg-zinc-800/50 rounded-[32px] flex items-center justify-center text-slate-600 shadow-inner">
        <Users weight="duotone" class="w-12 h-12" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-outfit font-bold text-white">{$t('attendance.no_students')}</h2>
        <p class="text-slate-500 font-plus-jakarta max-w-xs mx-auto">{$t('attendance.no_students_desc')}</p>
        {#if selectedClassId !== 'independent'}
        <button 
          onclick={() => goto(`/panel/classes/${selectedClassId}`)} 
          class="btn-pill px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-outfit font-bold text-xs mt-6 border border-white/5 transition-all"
        >
          {$t('attendance.setup_class')} →
        </button>
        {/if}
      </div>
    </div>
  {:else}
    {#if viewMode === 'list'}
      <div class="bento-card overflow-hidden" transition:fly={{ y: 20 }}>
        <div class="px-8 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <span class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest">{$t('attendance.list_title')}</span>
            <div class="flex items-center gap-2 text-[10px] font-outfit font-medium text-slate-500">
                <CloudCheck weight="duotone" class="w-4 h-4 text-primary-500" />
                {$t('attendance.synced')}
            </div>
        </div>
        <div class="grid grid-cols-1 divide-y divide-white/5">
            {#each classStudents() as student (student.id)}
                {@const status = getStatus(student.id)}
                <div class="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group">
                    <div class="flex items-center gap-5">
                        <div class="w-12 h-12 bg-zinc-800 border border-white/5 rounded-2xl flex items-center justify-center text-xs font-outfit font-extrabold text-violet-400 group-hover:scale-105 transition-transform">
                            {student.name ? student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '?'}
                        </div>
                        <div>
                            <p class="text-white font-outfit font-bold group-hover:text-violet-400 transition-colors uppercase tracking-tight">{student.name}</p>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="px-2 py-0.5 bg-violet-600/10 text-violet-400 text-[10px] font-bold rounded-md uppercase tracking-wider">{student.level || 'No level'}</span>
                                <span class="text-[10px] text-slate-500 font-medium">ID: {student.id.slice(0, 8)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <button 
                            onclick={() => setStatus(student.id, 'P')}
                            class="flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all font-outfit font-bold text-xs
                            {status === 'present' 
                                ? 'bg-primary-500/10 border-primary-500/20 text-primary-500 shadow-lg shadow-primary-500/5' 
                                : 'bg-zinc-900/50 border-white/5 text-slate-500 hover:border-primary-500/50 hover:text-primary-400 hover:bg-primary-500/5'}"
                        >
                            <CheckCircle weight={status === 'present' ? 'duotone' : 'regular'} class="w-5 h-5" />
                            {$t('attendance.present')}
                        </button>
                        <button 
                            onclick={() => setStatus(student.id, 'A')}
                            class="flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all font-outfit font-bold text-xs
                            {status === 'absent' 
                                ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg shadow-red-500/5' 
                                : 'bg-zinc-900/50 border-white/5 text-slate-500 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5'}"
                        >
                            <XCircle weight={status === 'absent' ? 'duotone' : 'regular'} class="w-5 h-5" />
                            {$t('attendance.absent')}
                        </button>
                    </div>
                </div>
            {/each}
        </div>
      </div>

    <div class="mt-8 flex justify-end">
        <div class="flex items-center gap-3 text-slate-500 text-xs font-plus-jakarta italic bg-white/[0.02] px-4 py-2 rounded-full border border-white/5 border-dashed">
            <CloudCheck weight="duotone" class="w-5 h-5 text-violet-400" />
            {$t('attendance.auto_save')}
        </div>
    </div>
    {:else}
        <VisualAttendanceCalendar 
            {selectedClassId} 
            attendance={$appStore.attendance} 
            onDateSelect={(date: string) => {
                selectedDate = date;
                viewMode = 'list';
            }}
        />
    {/if}
  {/if}
</div>

<style lang="postcss">
</style>
