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
    MinusCircle
  } from 'phosphor-svelte';
  import { showToast, showError } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { t } from '$lib/i18n';
  import type { PageData } from './$types';
  import { fade, fly } from 'svelte/transition';

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
      (student.first_name + ' ' + student.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const levelColors: Record<string, string> = {
    beginner: 'text-primary-400',
    intermediate: 'text-blue-400',
    advanced: 'text-purple-400'
  };

  const levelLabels: Record<string, string> = {
    beginner: 'BEGINNER',
    intermediate: 'INTERMEDIATE',
    advanced: 'ADVANCED',
    mixed: 'MIXED'
  };

  onMount(() => {
  });

  const handleGoBack = () => {
    const fromSchool = $page.url.searchParams.get('from_school');
    const fromClass = $page.url.searchParams.get('from_class');
    
    if (fromSchool) {
      goto(`/panel/schools/${fromSchool}`);
    } else if (fromClass) {
      goto(`/panel/classes/${fromClass}`);
    } else if (classData?.school_id) {
      goto(`/panel/schools/${classData.school_id}`);
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
      showError('The class has reached its maximum capacity');
      return;
    }

    try {
      isEnrolling = true;
      
      const response = await fetch('/api/class-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class_id: classData.id,
          student_id: studentId
        })
      });

      if (response.ok) {
        const student = availableStudents.find(s => s.id === studentId);
        if (student) {
          enrolledStudents = [...enrolledStudents, { ...student, enrolled_at: new Date().toISOString() }];
          availableStudents = availableStudents.filter(s => s.id !== studentId);
          
          stats.enrolled += 1;
          stats.available -= 1;
          stats.occupancyRate = Math.round((stats.enrolled / stats.capacity) * 100);
        }
        
        showToast.success(`${student?.first_name} ${student?.last_name} enrolled successfully`);
      } else {
        const error = await response.json();
        showError(error.error || 'Error enrolling student');
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      showError('Error enrolling student');
    } finally {
      isEnrolling = false;
    }
  };

  const handleEditStudent = (studentId: string) => {
    const schoolId = classData?.school_id;
    const queryParam = schoolId ? `?schoolId=${schoolId}` : '';
    goto(`/panel/students/${studentId}/edit${queryParam}`);
  };

  const handleUnenrollStudent = async (studentId: string) => {
    const student = enrolledStudents.find(s => s.id === studentId);
    const confirmed = await uiStore.confirm({
      title: 'Unenroll Student',
      message: `Are you sure you want to unenroll ${student?.first_name} ${student?.last_name}?`,
      confirmText: 'Unenroll',
      cancelText: 'Cancel'
    });
    
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/class-students?class_id=${classData.id}&student_id=${studentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (student) {
          const { enrolled_at, ...studentData } = student;
          availableStudents = [...availableStudents, studentData];
          enrolledStudents = enrolledStudents.filter(s => s.id !== studentId);
          
          stats.enrolled -= 1;
          stats.available += 1;
          stats.occupancyRate = Math.round((stats.enrolled / stats.capacity) * 100);
        }
        
        showToast.success(`${student?.first_name} ${student?.last_name} unenrolled successfully`);
      } else {
        const error = await response.json();
        showError(error.error || 'Error unenrolling student');
      }
    } catch (error) {
      console.error('Error unenrolling student:', error);
      showError('Error unenrolling student');
    }
  };
</script>

<svelte:head>
  <title>Students - {classData?.name || 'Class'} - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={handleGoBack}
        class="flex items-center gap-2 text-zinc-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <CaretLeft weight="bold" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <Users weight="duotone" class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase mb-1">{classData?.name}</h1>
          <p class="text-zinc-500 text-sm font-medium uppercase tracking-widest font-body">Student and Capacity Management</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => goto(`/panel/classes/${classData?.id}`)}
        class="bg-zinc-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-zinc-800 hover:border-primary-500/50 transition-all flex items-center gap-3"
      >
        <Eye weight="duotone" class="w-4 h-4 text-primary-400" />
        Dashboard
      </button>
      <button 
        onclick={() => goto(`/panel/students/create?classId=${classData?.id}&schoolId=${classData?.school_id}&returnTo=/panel/classes/${classData?.id}/students`)}
        class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3"
      >
        <UserPlus weight="bold" class="w-4 h-4" />
        New Student
      </button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bento-card p-6 flex items-center gap-4">
      <div class="w-12 h-12 bg-primary-500/10 rounded-2xl border border-primary-500/20 flex items-center justify-center text-primary-400">
        <UserCheck weight="duotone" class="w-6 h-6" />
      </div>
      <div>
        <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Enrolled</p>
        <p class="text-2xl font-black text-white">{stats.enrolled}</p>
      </div>
    </div>

    <div class="bento-card p-6 flex items-center gap-4">
      <div class="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-400">
        <Users weight="duotone" class="w-6 h-6" />
      </div>
      <div>
        <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Available</p>
        <p class="text-2xl font-black text-white">{stats.available}</p>
      </div>
    </div>

    <div class="bento-card p-6 flex items-center gap-4">
      <div class="w-12 h-12 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center text-purple-400">
        <ChartBar weight="duotone" class="w-6 h-6" />
      </div>
      <div>
        <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Capacity</p>
        <p class="text-2xl font-black text-white">{stats.capacity}</p>
      </div>
    </div>

    <div class="bento-card p-6 flex items-center gap-4">
      <div class="w-12 h-12 bg-orange-500/10 rounded-2xl border border-orange-500/20 flex items-center justify-center text-orange-400">
        <Pulse weight="duotone" class="w-6 h-6" />
      </div>
      <div>
        <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Occupancy</p>
        <p class="text-2xl font-black text-white">{stats.occupancyRate}%</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <!-- Enrolled Students Column -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <UserCheck weight="duotone" class="w-5 h-5 text-primary-400" />
          Class List
        </h2>
        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{enrolledStudents.length} Students</span>
      </div>

      {#if enrolledStudents.length === 0}
        <div class="bento-card p-16 text-center space-y-4 border-dashed">
          <Users weight="duotone" class="w-12 h-12 text-zinc-800 mx-auto" />
          <div class="space-y-1">
            <h3 class="text-white font-black uppercase text-sm">No students enrolled</h3>
            <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Start adding students from the available list</p>
          </div>
        </div>
      {:else}
        <div class="space-y-3">
          {#each enrolledStudents as student}
            <div class="bento-card p-4 hover:border-primary-500/30 transition-all group flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 shadow-inner bg-zinc-950 rounded-2xl border border-zinc-900 flex items-center justify-center text-primary-400 font-black group-hover:border-primary-500/50 transition-colors">
                  {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                </div>
                <div>
                  <h4 class="text-white font-black uppercase text-xs mb-0.5">{student.first_name} {student.last_name}</h4>
                  <div class="flex items-center gap-3 text-zinc-500 font-body text-[10px] font-bold uppercase tracking-wider">
                    <span>{calculateAge(student.date_of_birth)} years</span>
                    <span class={levelColors[student.chess_level] || 'text-zinc-400'}>
                      {levelLabels[student.chess_level] || 'MIXED'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button 
                  onclick={() => handleEditStudent(student.id)}
                  class="p-2 bg-zinc-950 rounded-xl border border-zinc-800 hover:text-primary-400 transition-colors text-zinc-500"
                  title="Edit"
                >
                  <PencilSimple weight="duotone" class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => handleUnenrollStudent(student.id)}
                  class="p-2 bg-zinc-950 rounded-xl border border-zinc-800 hover:text-red-400 transition-colors text-zinc-500"
                  title="Unenroll"
                >
                  <UserMinus weight="duotone" class="w-4 h-4" />
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Available Students Column -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <Plus weight="bold" class="w-5 h-5 text-primary-400" />
          Available Students
        </h2>
      </div>

      <!-- Search Box -->
      <div class="relative group font-body">
        <MagnifyingGlass weight="bold" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary-400 transition-colors" />
        <input
          type="text"
          placeholder="SEARCH BY NAME OR EMAIL..."
          bind:value={searchQuery}
          class="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-primary-500/50 transition-all font-black"
        />
      </div>

      {#if stats.available <= 0}
        <div class="p-8 border-2 border-red-500/20 rounded-3xl bg-red-500/5 text-center space-y-2">
           <WarningCircle weight="duotone" class="w-10 h-10 text-red-400 mx-auto mb-2" />
           <p class="text-[10px] font-black text-white uppercase tracking-widest">Max Capacity Reached</p>
           <p class="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider">The class has reached its capacity of {stats.capacity} students.</p>
        </div>
      {:else if filteredAvailableStudents.length === 0}
        <div class="bento-card p-16 text-center space-y-4 border-dashed">
          <MagnifyingGlass weight="duotone" class="w-12 h-12 text-zinc-800 mx-auto" />
          <div class="space-y-1">
            <h3 class="text-white font-black uppercase text-sm">No matches found</h3>
            <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Try creating a new student if you can't find them</p>
          </div>
        </div>
      {:else}
        <div class="space-y-3">
          {#each filteredAvailableStudents as student}
            <div class="bento-card p-4 hover:border-primary-500/30 transition-all group flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-zinc-950 rounded-2xl border border-zinc-900 flex items-center justify-center text-primary-400/50 font-black group-hover:border-primary-500/50 transition-colors">
                  {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                </div>
                <div>
                  <h4 class="text-white font-black uppercase text-xs mb-0.5">{student.first_name} {student.last_name}</h4>
                  <p class="text-zinc-500 font-body text-[10px] font-bold uppercase tracking-wider">{student.email}</p>
                </div>
              </div>
              
              <button 
                onclick={() => handleEnrollStudent(student.id)}
                disabled={isEnrolling}
                class="p-2 bg-zinc-950 rounded-xl border border-zinc-800 hover:text-primary-400 transition-colors text-zinc-500 disabled:opacity-50"
                title="Enroll"
              >
                {#if isEnrolling}
                  <div class="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                {:else}
                  <Plus weight="bold" class="w-4 h-4" />
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
  /* Transitions are handled by global index.css */
</style>
