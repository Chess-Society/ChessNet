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

  const formatLabel = (str: string | undefined | null) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
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
  <header class="pt-12 mb-16 space-y-8" in:fly={{ y: 20, duration: 800 }}>
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <div class="h-[2px] w-8 bg-violet-500"></div>
        <h2 class="text-violet-400 text-[10px] font-black uppercase tracking-[0.4em]">{$t('nav.schools')}</h2>
      </div>
      <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div class="max-w-3xl">
          <h1 class="text-5xl lg:text-7xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.85]">
            Red de <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-white to-primary-300 italic">Centros Aliados</span>
          </h1>
          <p class="text-zinc-500 text-lg font-medium tracking-tight font-jakarta mt-6 border-l-2 border-white/5 pl-6 max-w-xl">
            {$t('schools.subtitle')}
          </p>
        </div>
        
        <div class="flex flex-wrap items-center gap-4">
          <button 
            onclick={() => goto('/panel/schools/create')}
            class="px-10 h-14 bg-white text-black hover:bg-violet-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl active:scale-95"
          >
            <Plus weight="bold" size={18} />
            {$t('schools.add_btn')}
          </button>

          {#if schools.length > 0}
            <button 
              onclick={() => showDeleteAllModal = true}
              class="h-14 w-14 bg-zinc-950/40 backdrop-blur-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-95"
              title={$t('schools.delete_btn')}
            >
              <Trash weight="bold" class="w-6 h-6" />
            </button>
          {/if}
        </div>
      </div>
    </div>
  </header>
  <!-- Stats Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <div class="bento-card p-8 flex flex-col gap-6 bg-zinc-950/40 backdrop-blur-xl border border-white/5 relative overflow-hidden group">
      <div class="flex items-center justify-between">
        <div class="w-12 h-12 bg-white/[0.03] border border-white/5 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/10 group-hover:text-white transition-all">
          <Buildings size={24} weight="duotone" />
        </div>
        <span class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] opacity-60 group-hover:text-violet-300 transition-colors">Infraestructura</span>
      </div>
      <div>
        <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1 opacity-50">{$t('schools.active_centers')}</p>
        <div class="text-4xl font-outfit font-black text-white tracking-tighter leading-none">{totalSchools}</div>
      </div>
    </div>

    <div class="bento-card p-8 flex flex-col gap-6 bg-zinc-950/40 backdrop-blur-xl border border-white/5 relative overflow-hidden group">
      <div class="flex items-center justify-between">
        <div class="w-12 h-12 bg-white/[0.03] border border-white/5 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/10 group-hover:text-white transition-all">
          <Users size={24} weight="duotone" />
        </div>
        <span class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] opacity-60 group-hover:text-violet-300 transition-colors">Comunidad</span>
      </div>
      <div>
        <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1 opacity-50">{$t('common.total_students')}</p>
        <div class="text-4xl font-outfit font-black text-white tracking-tighter leading-none">{totalStudents}</div>
      </div>
    </div>

    <div class="bento-card p-8 flex flex-col gap-6 bg-zinc-950/40 backdrop-blur-xl border border-white/5 relative overflow-hidden group">
      <div class="flex items-center justify-between">
        <div class="w-12 h-12 bg-white/[0.03] border border-white/5 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/10 group-hover:text-white transition-all">
          <GraduationCap size={24} weight="duotone" />
        </div>
        <span class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] opacity-60 group-hover:text-violet-300 transition-colors">Pedagogía</span>
      </div>
      <div>
        <p class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest mb-1 opacity-50">{$t('schools.avg_groups')}</p>
        <div class="text-4xl font-outfit font-black text-white tracking-tighter leading-none">{avgStudentsPerSchool}</div>
      </div>
    </div>
  </div>

  <!-- Search & Filters -->
  <div class="relative group mb-10 translate-y-0 hover:-translate-y-1 transition-transform">
    <MagnifyingGlass size={22} weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors z-20" />
    <input
      type="text"
      placeholder={$t('schools.search_placeholder')}
      bind:value={searchQuery}
      class="w-full bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-none pl-16 pr-6 py-5 text-base text-white focus:border-violet-500/50 outline-none transition-all font-jakarta relative z-10 shadow-2xl"
    />
  </div>
  {#if filteredSchools.length === 0}
    <div 
      class="bento-card border-dashed border-white/10 p-16 md:p-24 text-center space-y-10 relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl" 
      in:fade
    >
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
      
      <div class="relative inline-block">
        <div class="w-32 h-32 bg-zinc-900 rounded-none flex items-center justify-center mx-auto border border-white/10 text-violet-400 shadow-2xl relative z-10">
          <Buildings size={64} weight="duotone" class="animate-pulse" />
        </div>
      </div>
      
      <div class="max-w-md mx-auto space-y-4 relative z-10">
        <h2 class="text-4xl md:text-5xl font-outfit font-black text-white tracking-tighter uppercase italic">{$t('schools.empty_title')}</h2>
        <p class="text-zinc-500 font-jakarta leading-relaxed uppercase font-bold tracking-widest text-sm opacity-60">{$t('schools.empty_subtitle')}</p>
      </div>

      <button 
        onclick={() => goto('/panel/schools/create')}
        class="bg-white text-black hover:bg-violet-600 hover:text-white px-12 py-5 font-black transition-all shadow-2xl flex items-center gap-4 mx-auto active:scale-95 text-xs uppercase tracking-widest relative z-10"
      >
        <Plus size={24} weight="bold" />
        {$t('schools.empty_btn')}
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each filteredSchools as school, i}
        <div 
          role="article"
          class="bento-card p-6 border border-white/5 bg-zinc-950/40 backdrop-blur-xl hover:border-violet-500/40 transition-all group relative flex flex-col"
          in:fly={{ y: 20, delay: i * 80 }}
        >
          <!-- Background Glow Effect -->
          <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-violet-600 opacity-0 blur-[60px] group-hover:opacity-[0.05] transition-opacity duration-700"></div>
          
          <div class="flex items-start justify-between mb-8 relative z-10">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-none flex items-center justify-center text-violet-400 font-outfit font-black text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-2xl relative overflow-hidden">
                <div class="absolute inset-0 bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {school.name[0].toUpperCase()}
              </div>
              <div class="space-y-1">
                <h3 class="text-white font-outfit font-black text-xl leading-snug uppercase tracking-tighter group-hover:text-primary-300 transition-colors line-clamp-1 italic">{formatLabel(school.name)}</h3>
                <div class="flex items-center gap-2 text-zinc-500 font-jakarta text-[10px] uppercase tracking-widest font-black opacity-70">
                    <MapPin size={14} weight="fill" class="text-violet-500" />
                    <span class="line-clamp-1">{formatLabel(school.city) || $t('schools.location_not_defined')}</span>
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


