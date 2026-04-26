<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Buildings, 
    Plus, 
    PencilSimple, 
    Trash,
    MapPin,
    Users,
    CaretRight,
    MagnifyingGlass,
    ArrowUpRight,
    Globe,
    GraduationCap,
    Info,
    CheckCircle
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
  import { enhance } from '$app/forms';
  import { tick } from 'svelte';

  let showDeleteModal = $state(false);
  let schoolToDelete = $state<{id: string, name: string} | null>(null);

  let deleteForm: HTMLFormElement;
  let purgeForm: HTMLFormElement;

  let searchQuery = $state('');

  // Svelte 5 reactive data
  let schools = $derived($appStore.schools || []);
  let students = $derived($appStore.students || []);

  // KPIs
  const totalSchools = $derived(schools.length);
  const totalStudents = $derived(students.length);
  const avgStudentsPerSchool = $derived(totalSchools > 0 ? Math.round(totalStudents / totalSchools) : 0);

  const filteredSchools = $derived(
    schools.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Optimización: Precalcular el conteo de alumnos por centro para evitar filtrados repetitivos en el render
  const studentsCountMap = $derived(
    students.reduce((acc, s) => {
      const schoolId = s.schoolId;
      if (schoolId) acc[schoolId] = (acc[schoolId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  const getStudentCount = (schoolId: string) => {
    return studentsCountMap[schoolId] || 0;
  };

  const deleteSchool = (id: string) => {
    const school = schools.find(s => s.id === id);
    if (school) {
        schoolToDelete = { id, name: school.name };
        showDeleteModal = true;
    }
  };

  const confirmDelete = async () => {
    if (schoolToDelete) {
      await tick();
      deleteForm.requestSubmit();
      showDeleteModal = false;
      schoolToDelete = null;
    }
  };

  let showDeleteAllModal = $state(false);

  const confirmDeleteAll = async () => {
    purgeForm.requestSubmit();
    showDeleteAllModal = false;
  };
</script>

<svelte:head>
  <title>{$t('schools.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 pb-12" transition:fade>
  
  <!-- Programmatic Forms for Deletions -->
  <form 
    method="POST" 
    action="?/delete" 
    use:enhance={() => {
      return async ({ result }) => {
        if (result.type === 'success') {
          toast.success($t('schools.toast_update_success') || 'Centro eliminado');
        } else {
          toast.error($t('common.error_occurred'));
        }
      };
    }} 
    bind:this={deleteForm} 
    class="hidden"
  >
    <input type="hidden" name="id" value={schoolToDelete?.id} />
  </form>

  <form 
    method="POST" 
    action="?/purge" 
    use:enhance={() => {
      return async ({ result }) => {
        if (result.type === 'success') {
          toast.success($t('schools.toast_all_deleted') || 'Todos los centros eliminados');
        } else {
          toast.error($t('common.error_occurred'));
        }
      };
    }} 
    bind:this={purgeForm} 
    class="hidden"
  ></form>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pt-12">
    <div class="space-y-6">
      <div class="flex items-center gap-6">
        <div class="relative">
          <div class="absolute inset-0 bg-violet-500/30 blur-2xl rounded-none"></div>
          <div class="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/40 rounded-none flex items-center justify-center text-violet-400 backdrop-blur-xl relative z-10 shadow-xl">
            <Buildings size={36} weight="duotone" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-6xl font-outfit font-black text-white tracking-tighter uppercase leading-none">
              <span class="gradient-text">{$t('schools.title')}</span>
            </h1>
          </div>
          <p class="text-zinc-500 font-medium text-lg mt-3 font-jakarta">
            {$t('schools.subtitle')}
          </p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/schools/create')}
      class="rounded-none px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-violet-flare flex items-center gap-3 group ring-1 ring-white/20 uppercase text-xs tracking-widest"
    >
      <div class="p-1 bg-white/20 rounded-none group-hover:rotate-90 transition-transform">
        <Plus size={18} weight="bold" />
      </div>
      {$t('schools.add_btn')}
    </button>

    {#if schools.length > 0}
      <button 
        onclick={() => showDeleteAllModal = true}
        class="h-[60px] w-[60px] rounded-none bg-red-900/20 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-95 mb-1"
        title={$t('schools.delete_btn')}
      >
        <Trash weight="bold" class="w-6 h-6" />
      </button>
    {/if}
  </div>

  <!-- Stats Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <div class="bento-card p-8 flex flex-col gap-6 relative overflow-hidden group">
      <div class="flex items-center justify-between">
        <div class="w-12 h-12 bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
          <Buildings size={24} weight="duotone" />
        </div>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-violet-500/20 blur-xl w-8 h-8 absolute top-0 right-0"></div>
      </div>
      <div>
        <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('schools.active_centers')}</p>
        <div class="text-4xl font-outfit font-black text-white">{totalSchools}</div>
      </div>
    </div>

    <div class="bento-card p-8 flex flex-col gap-6 relative overflow-hidden group">
      <div class="flex items-center justify-between">
        <div class="w-12 h-12 bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
          <Users size={24} weight="duotone" />
        </div>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-violet-500/20 blur-xl w-8 h-8 absolute top-0 right-0"></div>
      </div>
      <div>
        <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('common.total_students')}</p>
        <div class="text-4xl font-outfit font-black text-white">{totalStudents}</div>
      </div>
    </div>

    <div class="bento-card p-8 flex flex-col gap-6 relative overflow-hidden group">
      <div class="flex items-center justify-between">
        <div class="w-12 h-12 bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
          <GraduationCap size={24} weight="duotone" />
        </div>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-violet-500/20 blur-xl w-8 h-8 absolute top-0 right-0"></div>
      </div>
      <div>
        <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1">{$t('schools.avg_groups')}</p>
        <div class="text-4xl font-outfit font-black text-white">{avgStudentsPerSchool}</div>
      </div>
    </div>
  </div>

  <!-- Search & Filters -->
  <div class="relative group mb-10 translate-y-0 hover:-translate-y-1 transition-transform">
    <div class="absolute inset-0 bg-violet-500/5 blur-xl group-focus-within:bg-violet-500/10 transition-colors"></div>
    <MagnifyingGlass size={22} weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors z-20" />
    <input
      type="text"
      placeholder={$t('schools.search_placeholder')}
      bind:value={searchQuery}
      class="w-full bg-bento-card border border-white/5 rounded-none pl-16 pr-6 py-5 text-base text-white focus:border-violet-500/50 outline-none transition-all backdrop-blur-2xl font-jakarta relative z-10 shadow-2xl"
    />
  </div>

  {#if filteredSchools.length === 0}
    <div 
      class="bento-card border-dashed border-white/10 p-16 md:p-24 text-center space-y-10 relative overflow-hidden" 
      in:fade
    >
      <div class="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none"></div>
      
      <div class="relative inline-block scale-110">
        <div class="w-32 h-32 bg-violet-500/10 rounded-none flex items-center justify-center mx-auto border border-violet-500/20 text-violet-400 animate-pulse-slow shadow-violet-flare relative z-10">
          <Buildings size={64} weight="duotone" />
        </div>
        <div class="absolute -bottom-2 -right-2 bg-bento-bg border border-white/10 p-3 rounded-none shadow-2xl z-20 text-violet-400">
             <Plus size={24} weight="bold" />
        </div>
      </div>
      
      <div class="max-w-md mx-auto space-y-4 relative z-10">
        <h2 class="text-3xl md:text-4xl font-outfit font-black text-white tracking-tight uppercase">{$t('schools.empty_title')}</h2>
        <p class="text-slate-500 font-jakarta text-lg leading-relaxed">{$t('schools.empty_subtitle')}</p>
      </div>

      <button 
        onclick={() => goto('/panel/schools/create')}
        class="rounded-none bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-105 active:scale-95 text-white px-10 py-5 font-black transition-all shadow-violet-flare flex items-center gap-3 mx-auto group ring-8 ring-violet-500/5 text-lg relative z-10 uppercase tracking-widest"
      >
        <Plus size={24} weight="bold" class="transition-transform group-hover:rotate-90" />
        {$t('schools.empty_btn')}
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each filteredSchools as school, i}
        <div 
          role="article"
          class="bento-card p-6 border border-white/5 hover:border-violet-500/40 transition-all group relative flex flex-col"
          in:fly={{ y: 20, delay: i * 80 }}
        >
          <!-- Background Glow Effect -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl rounded-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="flex items-start justify-between mb-8 relative z-10">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-none flex items-center justify-center text-violet-400 font-outfit font-black text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-2xl relative overflow-hidden">
                <div class="absolute inset-0 bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {school.name[0].toUpperCase()}
              </div>
              <div class="space-y-1">
                <h3 class="text-white font-outfit font-bold text-xl leading-snug group-hover:text-violet-400 transition-colors line-clamp-1">{school.name}</h3>
                <div class="flex items-center gap-2 text-zinc-500 font-jakarta text-[10px] uppercase tracking-widest font-black">
                    <MapPin size={14} weight="fill" class="text-violet-500" />
                    <span class="line-clamp-1">{school.city || $t('schools.location_not_defined')}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onclick={() => goto(`/panel/schools/${school.id}/edit`)}
                  class="p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-violet-600/30 hover:border-violet-500/50 transition-all"
                  aria-label={$t('common.edit')}
                >
                  <PencilSimple size={16} weight="bold" />
                </button>
                <button 
                  onclick={() => deleteSchool(school.id)}
                  class="p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                  aria-label={$t('common.delete')}
                >
                  <Trash size={16} weight="bold" />
                </button>
            </div>
          </div>

          <div class="mt-auto space-y-6 relative z-10">
            <!-- Student Progress Indicator -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                <div class="flex items-center gap-2">
                  <Users size={14} weight="duotone" class="text-violet-400" />
                  <span>{$t('reports.enrolled')}</span>
                </div>
                <span class="text-white">{getStudentCount(school.id)}</span>
              </div>
              <div class="h-1.5 w-full bg-slate-800/50 rounded-none overflow-hidden border border-white/5 shadow-inner">
                <div 
                  class="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-none transition-all duration-1000 ease-out relative"
                  style="width: {Math.min((getStudentCount(school.id) / 30) * 100, 100)}%"
                >
                   <div class="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-white/5">
              <div class="flex -space-x-3 overflow-hidden">
                {#each Array(Math.min(getStudentCount(school.id), 4)) as _, j}
                  <div class="h-8 w-8 rounded-none ring-2 ring-bento-bg bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    S{j+1}
                  </div>
                {/each}
                {#if getStudentCount(school.id) > 4}
                  <div class="h-8 w-8 rounded-none ring-2 ring-bento-bg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-400 backdrop-blur-sm">
                    +{getStudentCount(school.id) - 4}
                  </div>
                {/if}
              </div>

              <button 
                onclick={() => goto(`/panel/schools/${school.id}`)}
                class="flex items-center gap-3 px-5 py-2.5 bg-zinc-950 hover:bg-violet-600 border border-zinc-800 hover:border-violet-500 text-zinc-500 hover:text-white text-[11px] font-outfit font-black uppercase tracking-widest transition-all group/btn active:scale-95"
              >
                {$t('schools.manage_btn')}
                <CaretRight size={14} weight="bold" class="transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<ConfirmModal
  bind:show={showDeleteModal}
  title={$t('schools.delete_btn')}
  message={$t('schools.delete_confirm')}
  confirmText={$t('common.delete')}
  cancelText={$t('common.cancel')}
  onConfirm={confirmDelete}
  type="danger"
/>

<ConfirmModal
  bind:show={showDeleteAllModal}
  title={$t('schools.delete_btn')}
  message={$t('schools.delete_all_warning') || '¿Estás seguro de que quieres eliminar todos los centros? Esta acción no se puede deshacer.'}
  confirmText={$t('common.delete')}
  cancelText={$t('common.cancel')}
  onConfirm={confirmDeleteAll}
  type="danger"
/>

<style>
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  :global(.animate-pulse-slow) {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(0.98); }
  }
</style>


