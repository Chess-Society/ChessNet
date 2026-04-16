<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft, 
    PencilSimple, 
    Buildings, 
    FileText, 
    Calendar,
    Pulse,
    Medal,
    TrendUp,
    IdentificationBadge,
    CheckCircle,
    GraduationCap
  } from 'phosphor-svelte';
  import { fade, fly } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  let student = $derived(data.student);
  let school = $derived(data.school);
  let enrolledClasses = $derived(data.enrolledClasses || []);
  let attendanceRate = $derived(data.attendanceRate);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
</script>

<svelte:head>
  <title>{student?.name || $t('common.unknown')} - {$t('students.records')} - ChessNet</title>
</svelte:head>

{#if student}
<div class="max-w-7xl mx-auto px-6 pb-24 pt-8 space-y-12" transition:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-6">
      <button 
        onclick={() => goto('/panel/students')}
        class="flex items-center gap-3 text-slate-500 hover:text-violet-400 transition-all group font-outfit font-bold uppercase tracking-widest text-[10px]"
      >
        <div class="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-violet-500/30 transition-all">
          <ArrowLeft size={14} weight="bold" />
        </div>
        {$t('students.back_to_list')}
      </button>

      <div class="flex items-center gap-8">
        <div class="w-24 h-24 bg-violet-600/10 border border-violet-500/20 rounded-24 flex items-center justify-center text-violet-400 font-outfit font-extrabold text-4xl shadow-violet-flare/10 shadow-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {getInitials(student.name)}
        </div>
        <div>
          <h1 class="text-4xl md:text-5xl font-outfit font-extrabold text-white tracking-tighter leading-none mb-3">{student.name}</h1>
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-4 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[10px] font-outfit font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle size={14} weight="bold" />
              {student.active ? $t('students.status_active') : $t('students.status_inactive')}
            </span>
            {#if student.level}
              <span class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-outfit font-black text-slate-400 uppercase tracking-widest">
                {$t('students.level')}: {student.level}
              </span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto(`/panel/students/${student.id}/edit`)}
      class="btn-pill bg-zinc-900 text-white px-10 py-4 font-bold border border-white/5 hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-xl text-sm"
    >
      <PencilSimple size={20} weight="duotone" class="text-violet-400" />
      {$t('students.edit_record')}
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Info -->
    <div class="lg:col-span-2 space-y-8">
      <!-- School Info Card -->
      <section class="bento-card !p-10 space-y-10">
        <div class="flex items-center gap-4 border-b border-white/5 pb-6">
          <GraduationCap size={24} weight="duotone" class="text-violet-400" />
          <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight uppercase">{$t('students.academic_record')}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-6 bg-zinc-950 border border-white/5 rounded-24 space-y-3 group hover:border-violet-500/30 transition-all">
            <div class="flex items-center gap-2">
               <Buildings size={16} weight="duotone" class="text-violet-500/60" />
               <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.educational_school')}</p>
            </div>
            <p class="text-white font-outfit font-bold text-lg">{school?.name || $t('classes.independent')}</p>
          </div>
          
          <div class="p-6 bg-zinc-950 border border-white/5 rounded-24 space-y-4 group hover:border-violet-500/30 transition-all">
            <div class="flex items-center gap-2">
               <IdentificationBadge size={16} weight="duotone" class="text-violet-500/60" />
               <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.active_classes')}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              {#if enrolledClasses.length > 0}
                {#each enrolledClasses as cls}
                  <span class="px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[10px] font-outfit font-black text-violet-400 uppercase tracking-widest">
                    {cls.name}
                  </span>
                {/each}
              {:else}
                <p class="text-slate-600 font-jakarta text-xs font-bold uppercase italic mt-1">{$t('students.no_records')}</p>
              {/if}
            </div>
          </div>
        </div>
      </section>

      <!-- Notes section -->
      <section class="bento-card !p-10 space-y-10">
        <div class="flex items-center gap-4 border-b border-white/5 pb-6">
          <FileText size={24} weight="duotone" class="text-violet-400" />
          <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight uppercase">{$t('students.observations')}</h2>
        </div>
        
        <div class="bg-zinc-950 border border-white/5 rounded-24 p-8 min-h-[250px] relative overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/5 blur-3xl rounded-full"></div>
          
          {#if student.notes}
            <p class="text-slate-400 font-jakarta text-lg leading-relaxed whitespace-pre-wrap relative z-10">{student.notes}</p>
          {:else}
            <div class="flex flex-col items-center justify-center h-full text-slate-700 py-12 space-y-5 relative z-10">
               <div class="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <FileText size={48} weight="duotone" class="opacity-30" />
               </div>
               <p class="text-xs font-outfit font-black uppercase tracking-widest text-slate-600">{$t('students.no_notes')}</p>
            </div>
          {/if}
        </div>
      </section>
    </div>

    <!-- Stats/Side columns -->
    <div class="space-y-8">
       <section class="bento-card !p-8 space-y-8 relative overflow-hidden group border-t-4 border-t-violet-500">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full"></div>
          
          <div class="flex items-center gap-4 relative z-10">
             <div class="p-2.5 bg-violet-600/10 rounded-xl border border-violet-500/20">
                <TrendUp size={20} weight="duotone" class="text-violet-400" />
             </div>
             <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">{$t('students.performance')}</h3>
          </div>
          
          <div class="space-y-10 relative z-10 pt-2">
             <div class="space-y-4">
                <div class="flex justify-between items-end">
                   <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.estimated_progress')}</p>
                   <p class="text-3xl font-outfit font-extrabold text-white leading-none tracking-tighter">{data.estimatedProgress}%</p>
                </div>
                <div class="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                   <div class="h-full bg-gradient-to-r from-violet-600 to-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.5)] rounded-full transition-all duration-1000" style="width: {data.estimatedProgress}%"></div>
                </div>
             </div>
             
             <div class="space-y-4">
                <div class="flex justify-between items-end">
                   <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.avg_attendance')}</p>
                   <p class="text-3xl font-outfit font-extrabold text-white leading-none tracking-tighter">{attendanceRate}%</p>
                </div>
                <div class="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                   <div class="h-full bg-gradient-to-r from-violet-500 to-indigo-400 shadow-[0_0_15px_rgba(139,92,246,0.5)] rounded-full transition-all duration-1000" style="width: {attendanceRate}%"></div>
                </div>
             </div>
          </div>
       </section>

       <section class="bento-card !p-8 space-y-8 relative overflow-hidden group">
          <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
          
          <div class="flex items-center gap-4 relative z-10">
             <div class="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <Medal size={20} weight="duotone" class="text-amber-400" />
             </div>
             <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">{$t('students.achievements')}</h3>
          </div>
          
          <div class="space-y-4 relative z-10">
             <div class="p-5 bg-zinc-950 border border-white/5 rounded-24 flex items-center gap-5 group/item hover:border-violet-500/30 transition-all">
                <div class="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 transition-all group-hover/item:scale-110 shadow-inner">
                   <Medal size={24} weight="duotone" />
                </div>
                <div>
                   <p class="text-xs font-outfit font-black text-white uppercase tracking-tight">{$t('students.first_tournament')}</p>
                   <p class="text-[10px] font-jakarta font-bold text-slate-500 uppercase tracking-widest mt-0.5">{$t('students.special_mention')}</p>
                </div>
             </div>
          </div>
       </section>
    </div>
  </div>
</div>
{:else}
<div class="h-[60vh] flex flex-col items-center justify-center gap-8" in:fade>
   <div class="relative">
      <div class="w-24 h-24 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
      <div class="absolute inset-0 flex items-center justify-center text-violet-400">
         <IdentificationBadge size={48} weight="duotone" class="animate-pulse" />
      </div>
   </div>
   <p class="text-slate-500 font-outfit font-black text-xs uppercase tracking-[0.4em]">{$t('common.loading')}...</p>
</div>
{/if}

<style lang="postcss">
  /* Profile specific styles if needed */
</style>
