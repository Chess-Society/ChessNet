<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    Users, 
    CaretLeft,
    UserPlus,
    UserMinus,
    MagnifyingGlass,
    CalendarBlank,
    EnvelopeSimple,
    GraduationCap,
    Clock,
    MapPin,
    TrendUp,
    UserCheck,
    WarningCircle,
    PencilSimple,
    Eye,
    ChartBar,
    Pulse,
    BookOpen,
    Buildings,
    Plus,
    MinusCircle,
    ArrowRight,
    IdentificationBadge,
    SelectionBackground,
    MaskHappy,
    ArrowCircleRight,
    Sparkle,
    Shapes,
    ChartPie
  } from 'phosphor-svelte';
  import { showToast, showError } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { t } from '$lib/i18n';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { appStore } from '$lib/stores/appStore';

  let { data } = $props<{ data: PageData }>();

  let classData = $derived(data.class as any);
  let enrolledStudents = $state<any[]>([]);
  let availableStudents = $state<any[]>([]);
  let stats = $state<any>({ enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 });

  $effect(() => {
    enrolledStudents = data.enrolledStudents || [];
    availableStudents = data.availableStudents || [];
    stats = data.stats || { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 };
  });
  
  let searchQuery = $state('');
  let isEnrolling = $state(false);

  // Filter available students by search query
  let filteredAvailableStudents = $derived(
    availableStudents.filter(student =>
      (student.firstName + ' ' + student.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const levelColors: Record<string, string> = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    advanced: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    mixed: 'bg-slate-500/10 text-slate-400 border-slate-500/10'
  };

  const levelLabels: Record<string, string> = {
    beginner: $t('common.levels.beginner'),
    intermediate: $t('common.levels.intermediate'),
    advanced: $t('common.levels.advanced'),
    mixed: $t('common.levels.mixed')
  };

  let quickName = $state('');
  let quickLichess = $state('');
  let isAdding = $state(false);
  let showQuickAdd = $state(false);

  async function handleQuickAdd() {
    if (!quickName) return;
    isAdding = true;
    try {
      const nameParts = quickName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Alumno';

      const studentData = {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@chessnet.app`,
        lichessUsername: quickLichess || '',
        active: true,
        schoolId: classData.schoolId,
        level: 'beginner',
        dateOfBirth: '2015-01-01'
      };
      
      const newStudent = await appStore.addStudent(studentData);
      if (newStudent?.id) {
        await appStore.enrollStudent(classData.id, newStudent.id);
        quickName = '';
        quickLichess = '';
        showQuickAdd = false;
        
        // Refresh local state or reload
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      isAdding = false;
    }
  }

  const handleGoBack = () => {
    const fromSchool = $page.url.searchParams.get('from_school');
    const fromClass = $page.url.searchParams.get('from_class');
    
    if (fromSchool) {
      goto(`/panel/schools/${fromSchool}`);
    } else if (fromClass) {
      goto(`/panel/classes/${fromClass}`);
    } else if (classData?.schoolId) {
      goto(`/panel/schools/${classData.schoolId}`);
    } else {
      goto(`/panel/classes/${classData.id}`);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '??';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleEnrollStudent = async (studentId: string) => {
    if (stats.available <= 0) {
      showError($t('classes.max_capacity_reached'));
      return;
    }

    try {
      isEnrolling = true;
      
      const classId = classData?.id;
      if (!classId) {
        showError($t('common.error_occurred'));
        return;
      }

      const response = await fetch('/api/class-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: classId,
          studentId: studentId
        })
      });

      if (response.ok) {
        const student = availableStudents.find(s => s.id === studentId);
        if (student) {
          enrolledStudents = [...enrolledStudents, { ...student, enrolledAt: new Date().toISOString() }];
          availableStudents = availableStudents.filter(s => s.id !== studentId);
          
          stats.enrolled += 1;
          stats.available -= 1;
          stats.occupancyRate = Math.round((stats.enrolled / stats.capacity) * 100);
        }
        
        showToast.success($t('students.enroll_success', { name: `${student?.firstName} ${student?.lastName}` }));
      } else {
        const error = await response.json();
        showError(error.error || $t('common.error_occurred'));
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      showError($t('common.error_occurred'));
    } finally {
      isEnrolling = false;
    }
  };

  const handleEditStudent = (studentId: string) => {
    const schoolId = classData?.schoolId;
    const queryParam = schoolId ? `?schoolId=${schoolId}` : '';
    goto(`/panel/students/${studentId}/edit${queryParam}`);
  };

  const handleUnenrollStudent = async (studentId: string) => {
    const student = enrolledStudents.find(s => s.id === studentId);
    const confirmed = await uiStore.confirm({
      title: $t('students.unenroll_title'),
      message: $t('students.unenroll_confirm', { name: `${student?.firstName} ${student?.lastName}` }),
      confirmText: $t('common.unenroll'),
      cancelText: $t('common.cancel')
    });
    
    if (!confirmed) return;

    try {
      const classId = classData?.id;
      if (!classId) {
        showError($t('common.error_occurred'));
        return;
      }

      const response = await fetch(`/api/class-students?classId=${classId}&studentId=${studentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (student) {
          const { enrolledAt, ...studentData } = student;
          availableStudents = [...availableStudents, studentData];
          enrolledStudents = enrolledStudents.filter(s => s.id !== studentId);
          
          stats.enrolled -= 1;
          stats.available += 1;
          stats.occupancyRate = Math.round((stats.enrolled / stats.capacity) * 100);
        }
        
        showToast.success($t('students.unenroll_success', { name: `${student?.firstName} ${student?.lastName}` }));
      } else {
        const error = await response.json();
        showError(error.error || $t('common.error_occurred'));
      }
    } catch (error) {
      console.error('Error unenrolling student:', error);
      showError($t('common.error_occurred'));
    }
  };
</script>

<svelte:head>
  <title>{$t('classes.manage_students')} - {classData?.name} - ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto px-6 pb-24" in:fade>
  <!-- Unified Header -->
  <div class="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 -mx-6 px-6 mb-12">
    <div class="max-w-[1400px] mx-auto py-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <button 
          onclick={handleGoBack}
          class="p-3 hover:bg-white/5 rounded-none transition-all text-slate-500 hover:text-white"
        >
          <CaretLeft size={24} weight="bold" />
        </button>
        <div>
          <h1 class="text-2xl font-black text-white px-2 tracking-tighter uppercase font-outfit">
            {$t('classes.students')}
          </h1>
          <div class="flex items-center gap-2 px-2">
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
              {classData?.name} • Gestionar Inscripciones
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          onclick={() => showQuickAdd = !showQuickAdd}
          class={`px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 font-outfit active:scale-95 border ${showQuickAdd ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-white text-black border-transparent hover:bg-violet-600 hover:text-white shadow-xl'}`}
        >
          {#if showQuickAdd}
            <Plus weight="bold" size={18} class="rotate-45" />
            {$t('common.cancel')}
          {:else}
            <UserPlus weight="duotone" size={18} />
            {$t('students.quick_add') || 'Alta Rápida'}
          {/if}
        </button>

        <div class="w-[1px] h-8 bg-white/10 mx-2"></div>

        <button 
          onclick={() => goto(`/panel/classes/${classData?.id}`)}
          class="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-none transition-all"
          title="Dashboard"
        >
          <Eye weight="duotone" size={24} />
        </button>
      </div>
    </div>
  </div>

  {#if showQuickAdd}
    <div 
      class="bg-zinc-900/60 border border-white/5 rounded-none p-10 mb-16 shadow-2xl relative overflow-hidden group/quick"
      transition:fly={{ y: -20, duration: 500, easing: cubicOut }}
    >
      <div class="absolute -right-32 -top-32 w-64 h-64 bg-violet-600/10 rounded-none blur-[100px] pointer-events-none group-hover/quick:bg-violet-600/20 transition-all duration-1000"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row items-end gap-8">
        <div class="flex-1 space-y-4 w-full">
          <label for="quick-name" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">{$t('students.name')}</label>
          <div class="relative group/input">
            <input 
              id="quick-name"
              type="text" 
              bind:value={quickName}
              placeholder={$t('students.full_name_placeholder') || 'Ej: Nombre del Alumno'}
              class="w-full bg-zinc-950/80 border border-white/10 rounded-none px-6 py-5 text-white font-bold font-jakarta focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all outline-none"
            />
          </div>
        </div>
        <div class="flex-1 space-y-4 w-full">
          <label for="quick-lichess" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Lichess Username (Opcional)</label>
          <div class="relative group/input">
            <div class="absolute left-6 top-1/2 -translate-y-1/2 text-sky-500">
              <Sparkle weight="duotone" size={18} />
            </div>
            <input 
              id="quick-lichess"
              type="text" 
              bind:value={quickLichess}
              placeholder="p.e. drnykterstein"
              class="w-full bg-zinc-950/80 border border-white/10 rounded-none pl-12 pr-6 py-5 text-white font-bold font-jakarta focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all outline-none"
            />
          </div>
        </div>
        <button 
          onclick={handleQuickAdd}
          disabled={!quickName || isAdding}
          class="bg-violet-600 text-white h-[66px] px-12 rounded-none text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-glow-violet active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-4"
        >
          {#if isAdding}
            <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-none animate-spin"></div>
            {$t('common.processing')}
          {:else}
            <UserPlus weight="bold" size={20} />
            {$t('common.create') || 'Crear'}
          {/if}
        </button>
      </div>
    </div>
  {/if}

  <!-- Interactive Metrics Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
    <div class="bento-card p-8 bg-zinc-900/40 border border-white/5 rounded-none flex items-center gap-6 shadow-2xl group/stat">
      <div class="w-14 h-14 bg-violet-500/10 rounded-none border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-glow-violet-mini group-hover/stat:scale-110 transition-transform">
        <UserCheck weight="duotone" size={28} />
      </div>
      <div>
        <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-1 font-outfit">{$t('classes.enrolled')}</p>
        <p class="text-3xl font-black text-white font-outfit tracking-tighter">{stats.enrolled}</p>
      </div>
    </div>

    <div class="bento-card p-8 bg-zinc-900/40 border border-white/5 rounded-none flex items-center gap-6 shadow-2xl group/stat">
      <div class="w-14 h-14 bg-blue-500/10 rounded-none border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-glow-blue-mini group-hover/stat:scale-110 transition-transform">
        <Users weight="duotone" size={28} />
      </div>
      <div>
        <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-1 font-outfit">{$t('classes.available')}</p>
        <p class="text-3xl font-black text-white font-outfit tracking-tighter">{stats.available}</p>
      </div>
    </div>

    <div class="bento-card p-8 bg-zinc-900/40 border border-white/5 rounded-none flex items-center gap-6 shadow-2xl group/stat">
      <div class="w-14 h-14 bg-emerald-500/10 rounded-none border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-glow-emerald-mini group-hover/stat:scale-110 transition-transform">
        <ChartBar weight="duotone" size={28} />
      </div>
      <div>
        <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-1 font-outfit">{$t('classes.capacity')}</p>
        <p class="text-3xl font-black text-white font-outfit tracking-tighter">{stats.capacity}</p>
      </div>
    </div>

    <div class="bento-card p-8 bg-zinc-900/40 border border-white/5 rounded-none flex items-center gap-6 shadow-2xl group/stat overflow-hidden relative">
      <div class="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
      <div class="w-14 h-14 bg-amber-500/10 rounded-none border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-glow-amber-mini group-hover/stat:scale-110 transition-transform relative z-10">
        <ChartPie weight="duotone" size={28} />
      </div>
      <div class="relative z-10">
        <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-1 font-outfit">{$t('classes.occupancy')}</p>
        <p class="text-3xl font-black text-white font-outfit tracking-tighter">{stats.occupancyRate}%</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-16" in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
    <!-- Active Roster Matrix -->
    <div class="space-y-10">
      <div class="flex items-center justify-between border-b border-white/5 pb-8">
        <div class="space-y-2">
           <h2 class="text-3xl font-black text-white uppercase tracking-tighter font-outfit flex items-center gap-4">
             <UserCheck weight="duotone" size={32} class="text-violet-500" />
             {$t('classes.class_list')}
           </h2>
           <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4 md:ml-12 italic">{$t('classes.enrolled_students_desc') || 'Listado de alumnos inscritos en esta clase'}</p>
        </div>
        <div class="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 py-2 bg-zinc-950 rounded-none border border-white/5">
           <span class="text-white bg-violet-600/20 px-2 py-0.5 rounded-none border border-violet-500/30 font-outfit">{enrolledStudents.length}</span>
           {$t('classes.students_short')}
        </div>
      </div>
      {#if enrolledStudents.length === 0}
        <div class="bento-card py-32 px-12 text-center space-y-8 bg-zinc-900/30 border-2 border-dashed border-white/5 rounded-none group/empty shadow-inner">
          <div class="w-24 h-24 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center mx-auto text-slate-800 shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)] group-hover/empty:border-violet-500/20 transition-all duration-1000">
             <Users weight="duotone" size={48} />
          </div>
          <div class="space-y-3">
            <h3 class="text-white font-black uppercase text-lg tracking-tighter font-outfit">{$t('classes.no_enrolled')}</h3>
            <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] font-jakarta max-w-[240px] mx-auto leading-relaxed">{$t('classes.start_enrolling_desc') || 'Initialize your educational roster by allocating students from the candidate pool.'}</p>
          </div>
          
        </div>
      {:else}
        <div class="space-y-4">
          {#each enrolledStudents as student, i}
             <div 
               class="bento-card p-6 bg-zinc-900/40 border border-white/5 hover:border-violet-500/30 hover:bg-zinc-900/60 transition-all group rounded-none flex items-center justify-between shadow-2xl relative overflow-hidden"
               in:fly={{ x: -20, delay: i * 50, duration: 600, easing: cubicOut }}
             >
                <div class="absolute inset-0 bg-gradient-to-r from-violet-600/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div class="flex items-center gap-6 relative z-10">
                  <div class="w-16 h-16 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center text-violet-400 font-black font-outfit text-xl group-hover:scale-110 group-hover:border-violet-500/50 transition-all duration-700 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] relative overflow-hidden">
                     <div class="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent"></div>
                     <span class="relative z-10">{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 class="text-white font-black uppercase text-sm mb-1.5 font-outfit tracking-tight group-hover:text-violet-400 transition-colors">{student.firstName} {student.lastName}</h4>
                    <div class="flex items-center gap-3">
                       <div class="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/5 rounded-none text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <IdentificationBadge size={12} class="text-slate-600" />
                          {calculateAge(student.dateOfBirth)} {$t('students.years_short')}
                       </div>
                       <div class={`px-2 py-0.5 rounded-none border text-[9px] font-black uppercase tracking-widest ${levelColors[student.chessLevel] || 'bg-slate-500/10 text-slate-400 border-slate-500/10'}`}>
                         {levelLabels[student.chessLevel] || 'MIXED'}
                       </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-3 relative z-10">
                  <button 
                    onclick={() => handleEditStudent(student.id)}
                    class="w-12 h-12 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-violet-600 hover:border-violet-400 transition-all shadow-inner group/action active:scale-90"
                    title="Edit"
                  >
                    <PencilSimple weight="duotone" size={20} class="group-hover/action:rotate-12 transition-transform" />
                  </button>
                  <button 
                    onclick={() => handleUnenrollStudent(student.id)}
                    class="w-12 h-12 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-red-600 hover:border-red-400 transition-all shadow-inner group/action active:scale-90"
                    title="Unenroll"
                  >
                    <UserMinus weight="duotone" size={20} class="group-hover/action:scale-110 transition-transform" />
                  </button>
                </div>
             </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Candidate Pool Phase -->
    <div class="space-y-10">
      <div class="flex flex-col gap-6 border-b border-white/5 pb-8">
         <div class="space-y-2">
            <h2 class="text-3xl font-black text-white uppercase tracking-tighter font-outfit flex items-center gap-4">
              <Plus weight="bold" size={32} class="text-blue-500" />
              {$t('classes.available_students')}
            </h2>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4 md:ml-12 italic">{$t('classes.available_students_desc') || 'Alumnos del centro que pueden ser inscritos'}</p>
         </div>

         <!-- Enhanced Command Search -->
         <div class="relative group font-outfit">
           <div class="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-blue-600/20 rounded-none blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
           <div class="relative">
             <MagnifyingGlass weight="bold" size={20} class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
             <input
               type="text"
               placeholder={$t('classes.search_placeholder') || 'BUSCAR POR NOMBRE O EMAIL...'}
               bind:value={searchQuery}
               class="w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-none py-5 pl-16 pr-8 text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase tracking-[0.2em] shadow-2xl"
             />
           </div>
         </div>
      </div>

      {#if stats.available <= 0}
        <div class="bento-card p-12 bg-zinc-900/60 border border-violet-500/30 rounded-none text-center space-y-6 relative overflow-hidden group/max shadow-2xl">
           <div class="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent"></div>
           <div class="w-24 h-24 bg-zinc-950 rounded-none flex items-center justify-center mx-auto text-violet-400 shadow-glow-violet-mini mb-4 animate-pulse-slow">
              <WarningCircle weight="duotone" size={52} />
           </div>
           <div class="space-y-3 relative z-10">
              <h3 class="text-2xl font-black text-white uppercase tracking-tighter font-outfit">{$t('classes.max_capacity_reached')}</h3>
              <p class="text-slate-500 text-[11px] font-black leading-relaxed uppercase tracking-[0.3em] font-jakarta max-w-xs mx-auto">{$t('classes.capacity_desc', { count: stats.capacity }) || 'Strategic allocation limit achieved. Upgrade operational infrastructure to expand roster capacity.'}</p>
           </div>
        </div>
      {:else if filteredAvailableStudents.length === 0}
        <div class="bento-card py-32 px-12 text-center space-y-8 bg-zinc-900/30 border-2 border-dashed border-white/5 rounded-none group/empty shadow-inner">
          <div class="w-24 h-24 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center mx-auto text-slate-800 shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)] group-hover/empty:border-blue-500/20 transition-all duration-1000">
             <MagnifyingGlass weight="duotone" size={48} />
          </div>
          <div class="space-y-3">
            <h3 class="text-white font-black uppercase text-lg tracking-tighter font-outfit">{$t('classes.no_matches')}</h3>
            <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] font-jakarta max-w-[240px] mx-auto leading-relaxed">{$t('classes.no_matches_desc') || 'No se han encontrado alumnos que coincidan con la búsqueda.'}</p>
          </div>
        </div>
      {:else}
        <div class="space-y-4">
          {#each filteredAvailableStudents as student, i}
             <div 
               class="bento-card p-6 bg-zinc-900/30 border border-white/5 hover:border-blue-500/30 hover:bg-zinc-900/50 transition-all group rounded-none flex items-center justify-between shadow-2xl relative overflow-hidden"
               in:fly={{ x: 20, delay: i * 50, duration: 600, easing: cubicOut }}
             >
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 bg-zinc-950 rounded-none border border-white/5 flex items-center justify-center text-slate-600 font-black font-outfit text-xl group-hover:scale-110 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all duration-700 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)]">
                     {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4 class="text-white font-black uppercase text-sm mb-1 font-outfit tracking-tight group-hover:text-blue-400 transition-colors">{student.firstName} {student.lastName}</h4>
                    <p class="text-slate-600 font-black text-[10px] uppercase tracking-widest font-jakarta transition-colors group-hover:text-slate-400 truncate max-w-[200px]">{student.email || 'NO_IDENTIFIER'}</p>
                  </div>
                </div>
                
                <button 
                  onclick={() => handleEnrollStudent(student.id)}
                  disabled={isEnrolling}
                  class="w-14 h-14 bg-zinc-950 text-slate-500 hover:text-black hover:bg-white rounded-none border border-white/5 flex items-center justify-center transition-all shadow-xl active:scale-90 group/link disabled:opacity-50"
                  title="Enroll"
                >
                  {#if isEnrolling}
                    <div class="w-6 h-6 border-4 border-violet-500 border-t-transparent rounded-none animate-spin"></div>
                  {:else}
                    <Plus weight="bold" size={24} class="group-hover/link:rotate-90 transition-transform duration-500" />
                  {/if}
                </button>
             </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  :global(.shadow-glow-violet-mini) {
    box-shadow: 0 0 15px -3px rgba(139, 92, 246, 0.4);
  }
  :global(.shadow-glow-blue-mini) {
    box-shadow: 0 0 15px -3px rgba(59, 130, 246, 0.4);
  }
  :global(.shadow-glow-emerald-mini) {
    box-shadow: 0 0 15px -3px rgba(16, 185, 129, 0.4);
  }
  :global(.shadow-glow-amber-mini) {
    box-shadow: 0 0 15px -3px rgba(245, 158, 11, 0.4);
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 4s infinite ease-in-out;
  }
</style>
