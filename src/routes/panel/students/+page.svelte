<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Users, 
    Plus, 
    PencilSimple, 
    Trash,
    MagnifyingGlass,
    Buildings,
    CaretRight,
    UserCircle,
    X,
    Funnel,
    GraduationCap,
    IdentificationBadge,
    ChartBar,
    TrendUp,
    AddressBook,
    Eye,
    ArrowClockwise,
    FileText
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import StudentReportModal from '$lib/components/admin/StudentReportModal.svelte';
  import { enhance } from '$app/forms';
  import { tick } from 'svelte';

  // Filters & State
  let searchQuery = $state('');
  let selectedSchool = $state('');
  let isDeleting = $state<string | null>(null);
  let reportingStudentId = $state<string | null>(null);

  let deleteForm: HTMLFormElement;
  let purgeForm: HTMLFormElement;
  let studentIdToDelete = $state('');

  // Reactive data from store
  let students = $derived(($appStore.students as any[]) || []);
  let schools = $derived(($appStore.schools as any[]) || []);
  let classes = $derived(($appStore.classes as any[]) || []);

  const metrics = $derived.by(() => {
    const activeCount = students.length; // Future: filter by active status if implemented
    const schoolsCount = new Set(students.map(s => s.schoolId).filter(Boolean)).size;
    const avgStudentsPerClass = classes.length > 0 ? (students.length / classes.length).toFixed(1) : 0;

    return {
      total: students.length,
      active: activeCount,
      schools: schoolsCount,
      avgPerClass: avgStudentsPerClass
    };
  });

  const filteredStudents = $derived(
    students.filter(s => {
      const nameMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const schoolMatch = !selectedSchool || s.schoolId === selectedSchool;
      return nameMatch && schoolMatch;
    })
  );

  const getSchoolName = (id: string | undefined) => {
    if (!id) return $t('students.unassigned');
    return schools.find(s => s.id === id)?.name || $t('students.unassigned');
  };

  const deleteStudent = async (id: string) => {
    const student = students.find(s => s.id === id);
    const confirmed = await uiStore.confirm({
      title: $t('students.delete_simple_confirm', { name: student?.name }),
      message: $t('common.undone_action'),
      type: 'danger',
      confirmText: $t('common.delete'),
      cancelText: $t('common.cancel')
    });

    if (confirmed) {
      studentIdToDelete = id;
      await tick();
      deleteForm.requestSubmit();
    }
  };

  const handleDeleteAll = async () => {
    if (students.length === 0) return;
    
    const confirmed = await uiStore.confirm({
      title: $t('students.delete_all_confirm'),
      message: $t('students.delete_all_warning'),
      type: 'danger',
      confirmText: $t('common.delete'),
      cancelText: $t('common.cancel')
    });

    if (confirmed) {
      purgeForm.requestSubmit();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
</script>

<svelte:head>
  <title>{$t('students.community_title')} - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-12" in:fade={{ duration: 400 }}>
  
  <!-- Programmatic Forms for Deletions -->
  <form 
    method="POST" 
    action="?/delete" 
    use:enhance={() => {
      isDeleting = studentIdToDelete;
      return async ({ result }) => {
        isDeleting = null;
        if (result.type === 'success') {
          toast.success($t('students.toast_update_success'));
        } else {
          toast.error($t('students.toast_update_error'));
        }
      };
    }} 
    bind:this={deleteForm} 
    class="hidden"
  >
    <input type="hidden" name="id" bind:value={studentIdToDelete} />
  </form>

  <form 
    method="POST" 
    action="?/purge" 
    use:enhance={() => {
      return async ({ result }) => {
        if (result.type === 'success') {
          toast.success($t('students.toast_all_deleted'));
        } else {
          toast.error($t('common.error_occurred'));
        }
      };
    }} 
    bind:this={purgeForm} 
    class="hidden"
  ></form>
  
  <!-- Header & Title Area -->
  <div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12 lg:mb-16">
    <div class="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 text-center lg:text-left">
      <div class="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 shadow-2xl shrink-0">
        <Users weight="bold" class="w-8 h-8" />
      </div>
      <div>
        <div class="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <span class="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-none text-[10px] font-black text-violet-400 uppercase tracking-widest">{$t('students.community_title')}</span>
            <span class="w-1.5 h-1.5 bg-zinc-800 rounded-none"></span>
            <span class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{metrics.total} {$t('common.students')}</span>
        </div>
        <h1 class="text-4xl lg:text-7xl font-outfit font-black text-white tracking-tighter uppercase">{$t('students.community_title')}</h1>
        <p class="text-zinc-500 font-medium text-base lg:text-lg mt-1 max-w-xl">{$t('students.community_subtitle')}</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => { searchQuery = ''; selectedSchool = ''; }}
        class="h-14 w-14 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center active:scale-95"
        title={$t('students.clear_filters')}
      >
        <ArrowClockwise weight="bold" class="w-6 h-6" />
      </button>
      <button 
        onclick={() => goto('/panel/students/create')}
        class="h-14 px-8 rounded-none bg-violet-600 text-white font-black hover:bg-violet-500 transition-all flex items-center gap-3 shadow-xl shadow-violet-500/20 active:scale-95 uppercase text-[10px] tracking-widest"
      >
        <Plus weight="bold" class="w-5 h-5" />
        {$t('students.new_student_btn')}
      </button>

      {#if students.length > 0}
        <button 
          onclick={handleDeleteAll}
          class="h-14 w-14 rounded-none bg-red-900/20 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-95"
          title={$t('common.delete')}
        >
          <Trash weight="bold" class="w-6 h-6" />
        </button>
      {/if}
    </div>
  </div>

  <!-- Bento Metrics Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16">
    <div class="bg-zinc-900 border border-zinc-800 rounded-none p-6 lg:p-8 shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-[60px] rounded-none -mr-16 -mt-16"></div>
      <div class="flex flex-col gap-3 lg:gap-4 relative z-10">
        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-violet-500/10 rounded-none flex items-center justify-center text-violet-400">
          <GraduationCap weight="bold" class="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div>
          <p class="text-[8px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('common.total_students')}</p>
          <p class="text-2xl lg:text-4xl font-outfit font-black text-white">{metrics.total}</p>
        </div>
      </div>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-none p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      <div class="flex flex-col gap-3 lg:gap-4 relative z-10">
        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-primary-500/10 rounded-none flex items-center justify-center text-primary-400">
          <TrendUp weight="bold" class="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div>
          <p class="text-[8px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('students.active_students')}</p>
          <p class="text-2xl lg:text-4xl font-outfit font-black text-white">{metrics.active}</p>
        </div>
      </div>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-none p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      <div class="flex flex-col gap-3 lg:gap-4 relative z-10">
        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-amber-500/10 rounded-none flex items-center justify-center text-amber-400">
          <Buildings weight="bold" class="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div>
          <p class="text-[8px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('common.schools')}</p>
          <p class="text-2xl lg:text-4xl font-outfit font-black text-white">{metrics.schools}</p>
        </div>
      </div>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-none p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      <div class="flex flex-col gap-3 lg:gap-4 relative z-10">
        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-fuchsia-500/10 rounded-none flex items-center justify-center text-fuchsia-400">
          <ChartBar weight="bold" class="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div>
          <p class="text-[8px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('students.avg_per_class')}</p>
          <p class="text-2xl lg:text-4xl font-outfit font-black text-white">{metrics.avgPerClass}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content Area -->
  <div class="bg-zinc-900 border border-zinc-800 rounded-none p-6 lg:p-10 shadow-2xl mb-8 lg:mb-12">
    <div class="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
      <div class="w-full relative group">
        <div class="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors">
          <MagnifyingGlass weight="bold" class="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <input 
          type="text" 
          bind:value={searchQuery}
          placeholder={$t('students.search_placeholder')}
          class="w-full h-14 lg:h-16 bg-zinc-950 border border-zinc-800 rounded-none pl-16 pr-6 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all shadow-inner placeholder:text-zinc-700 text-sm lg:text-base"
        />
      </div>

      <div class="w-full lg:w-96 relative group">
        <div class="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors">
          <Buildings weight="bold" class="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <select 
          bind:value={selectedSchool}
          class="w-full h-14 lg:h-16 bg-zinc-950 border border-zinc-800 rounded-none pl-16 pr-6 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all appearance-none cursor-pointer text-sm lg:text-base"
        >
          <option value="">{$t('common.all_schools')}</option>
          {#each schools as school}
            <option value={school.id}>{school.name}</option>
          {/each}
        </select>
        <div class="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
          <CaretRight weight="bold" size={20} class="rotate-90 text-zinc-700" />
        </div>
      </div>
    </div>
  </div>

    <!-- Students List Section (Card View on Mobile, Table on Tablet/Desktop) -->
    
    <!-- Desktop Table -->
    <div class="hidden lg:block bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden shadow-2xl">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-bottom border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
              <th class="px-8 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('students.full_name')}</th>
              <th class="px-8 py-6 text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('students.level')}</th>
              <th class="px-8 py-6 text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('common.classes')}</th>
              <th class="px-8 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('students.educational_school')}</th>
              <th class="px-8 py-6 text-right text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('common.actions')}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800">
            {#if students.length === 0}
              <tr>
                <td colspan="5" class="py-32">
                  <div class="flex flex-col items-center justify-center gap-6">
                    <div class="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-800">
                      <Users size={48} weight="bold" />
                    </div>
                    <div class="text-center">
                      <h3 class="text-xl font-outfit font-black text-white uppercase tracking-wider">{$t('students.no_students')}</h3>
                      <p class="text-zinc-500 font-medium mt-2">{$t('students.no_students_desc') || 'Empieza por añadir a tu primer alumno.'}</p>
                    </div>
                    <button 
                      onclick={() => goto('/panel/students/create')}
                      class="h-12 px-8 rounded-none bg-violet-600 text-white font-black hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/20 active:scale-95 uppercase text-[10px] tracking-widest"
                    >
                      {$t('students.recruit_btn')}
                    </button>
                  </div>
                </td>
              </tr>
            {:else if filteredStudents.length === 0}
              <tr>
                <td colspan="5" class="py-32">
                  <div class="flex flex-col items-center justify-center gap-6">
                    <div class="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-800">
                      <MagnifyingGlass size={48} weight="bold" />
                    </div>
                    <div class="text-center">
                      <h3 class="text-xl font-outfit font-black text-white uppercase tracking-wider">{$t('students.no_results_title')}</h3>
                      <p class="text-zinc-500 font-medium mt-2">{$t('students.no_results_desc') || 'Prueba con otros términos de búsqueda.'}</p>
                    </div>
                  </div>
                </td>
              </tr>
            {:else}
              {#each filteredStudents as student, i}
                <tr class="group hover:bg-zinc-800/30 transition-all cursor-pointer">
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-400 font-outfit font-black text-sm shadow-inner overflow-hidden uppercase">
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <p class="text-white font-bold leading-none">{student.name}</p>
                        <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('students.student_label')}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <span class="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-none text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      {student.level || '--'}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <div class="flex justify-center">
                      <div class="h-8 min-w-[32px] px-2 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-[10px] font-black text-zinc-500 uppercase">
                        {student.classId ? 1 : 0}
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-2 text-zinc-400 font-medium">
                      <Buildings weight="bold" class="w-4 h-4 text-zinc-600" />
                      <span class="text-sm">{getSchoolName(student.schoolId)}</span>
                    </div>
                  </td>
                  <td class="px-8 py-6 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        class="h-10 px-4 rounded-none bg-primary-500/10 border border-primary-500/20 text-primary-400 hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 group/btn shadow-lg shadow-primary-500/5"
                        onclick={(e) => { e.stopPropagation(); reportingStudentId = student.id; }}
                        title={$t('students.report_view')}
                      >
                        <FileText weight="bold" size={16} class="group-hover/btn:rotate-6 transition-transform" />
                        <span class="text-[10px] font-black uppercase tracking-widest">{$t('students.report_view')}</span>
                      </button>
                      <button 
                        class="h-10 w-10 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center active:scale-95"
                        onclick={() => goto(`/panel/students/${student.id}`)}
                        title={$t('students.view_profile')}
                      >
                        <Eye weight="bold" size={18} />
                      </button>
                      <button 
                        class="h-10 w-10 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center active:scale-95"
                        onclick={() => goto(`/panel/students/${student.id}/edit`)}
                        title={$t('common.edit')}
                      >
                        <PencilSimple weight="bold" size={18} />
                      </button>
                      <button 
                        class="h-10 w-10 rounded-none bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-95"
                        onclick={() => deleteStudent(student.id)}
                        disabled={isDeleting === student.id}
                        title={$t('common.delete')}
                      >
                        <Trash weight="bold" size={18} />
                      </button>
                    </div>
                    <div class="group-hover:hidden">
                      <span class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-none text-[10px] font-black text-primary-400 uppercase tracking-widest">
                        {$t('students.status_active')}
                      </span>
                    </div>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card Grid -->
    <div class="lg:hidden space-y-4 pb-20">
      {#if students.length === 0}
        <div class="bg-zinc-900 border border-zinc-800 rounded-none p-12 text-center">
            <div class="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-800 mx-auto mb-6">
              <Users size={40} weight="bold" />
            </div>
            <h3 class="text-xl font-outfit font-black text-white uppercase tracking-wider">{$t('students.no_students')}</h3>
            <p class="text-zinc-500 font-medium mt-2 mb-8">{$t('students.no_students_desc')}</p>
            <button 
              onclick={() => goto('/panel/students/create')}
              class="w-full h-14 rounded-none bg-violet-600 text-white font-black hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/20 active:scale-95 uppercase text-xs tracking-widest"
            >
              {$t('students.new_student_btn')}
            </button>
        </div>
      {:else if filteredStudents.length === 0}
        <div class="bg-zinc-900 border border-zinc-800 rounded-none p-12 text-center">
            <div class="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-800 mx-auto mb-6">
              <MagnifyingGlass size={40} weight="bold" />
            </div>
            <h3 class="text-xl font-outfit font-black text-white uppercase tracking-wider">{$t('students.no_results_title')}</h3>
            <p class="text-zinc-500 font-medium mt-2">{$t('students.no_results_desc')}</p>
        </div>
      {:else}
        {#each filteredStudents as student}
          <div class="bg-zinc-900 border border-zinc-800 rounded-none p-6 shadow-xl relative overflow-hidden active:scale-[0.98] transition-all">
            <div class="flex items-start justify-between gap-4 mb-6">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-400 font-outfit font-black text-lg shadow-inner uppercase shrink-0">
                  {getInitials(student.name)}
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg leading-tight">{student.name}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <Buildings weight="bold" class="w-3 h-3 text-zinc-600" />
                    <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{getSchoolName(student.schoolId)}</span>
                  </div>
                </div>
              </div>
              <div class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-none">
                <span class="text-[8px] font-black text-primary-400 uppercase tracking-widest">{$t('students.status_active')}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-zinc-950/50 border border-white/5 rounded-none p-4">
                <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('students.level')}</p>
                <p class="text-sm font-black text-white">{student.level || '--'}</p>
              </div>
              <div class="bg-zinc-950/50 border border-white/5 rounded-none p-4">
                <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Clase</p>
                <p class="text-sm font-black text-white">{student.classId ? 'Asignada' : 'N/A'}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                class="flex-1 h-12 rounded-none bg-primary-500/10 border border-primary-500/20 text-primary-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                onclick={() => reportingStudentId = student.id}
              >
                <FileText weight="bold" size={16} />
                {$t('students.report_view')}
              </button>
              <button 
                class="w-12 h-12 rounded-none bg-zinc-800 border border-white/5 text-zinc-400 flex items-center justify-center"
                onclick={() => goto(`/panel/students/${student.id}`)}
              >
                <Eye weight="bold" size={20} />
              </button>
              <button 
                class="w-12 h-12 rounded-none bg-zinc-800 border border-white/5 text-zinc-400 flex items-center justify-center"
                onclick={() => goto(`/panel/students/${student.id}/edit`)}
              >
                <PencilSimple weight="bold" size={20} />
              </button>
              <button 
                class="w-12 h-12 rounded-none bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center"
                onclick={() => deleteStudent(student.id)}
                disabled={isDeleting === student.id}
              >
                <Trash weight="bold" size={20} />
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  {#if reportingStudentId}
    <StudentReportModal 
      studentId={reportingStudentId} 
      onclose={() => reportingStudentId = null} 
    />
  {/if}

<style lang="postcss">
  /* Premium Scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-white/10 rounded-none hover:bg-white/20;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3f3f46;
  }

  /* Table Transitions */
  tr {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>

