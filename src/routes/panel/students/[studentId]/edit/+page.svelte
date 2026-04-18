<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    CaretLeft,
    FloppyDisk,
    User as UserIcon,
    ArrowCounterClockwise,
    Buildings,
    Note,
    IdentificationBadge,
    CheckCircle,
    CaretDown,
    Users
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { showToast, showError } from '$lib/stores/toast';
  let { data } = $props<{ data: PageData }>();

  let studentData = $derived(data.student);
  let schools = $derived(data.schools || []);
  let classes = $derived(data.classes || []);

  let formData = $state({
    name: '',
    first_name: '',
    last_name: '',
    school_id: '',
    class_id: '',
    notes: ''
  });

  $effect(() => {
    if (studentData) {
      formData = {
        name: studentData.name || '',
        first_name: studentData.first_name || '',
        last_name: studentData.last_name || '',
        school_id: studentData.school_id || '',
        class_id: studentData.class_id || '',
        notes: studentData.notes || ''
      };
    }
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const validateForm = () => {
    errors = {};
    if (!formData.name.trim()) errors.name = $t('students.full_name_required');
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    try {
      isSubmitting = true;
      const response = await fetch(`/api/students/${studentData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const returnTo = $page.url.searchParams.get('return_to');
        showToast.success($t('students.toast_update_success'));
        await invalidateAll();
        setTimeout(() => {
          goto(returnTo || `/panel/students/${studentData.id}`);
        }, 400);
      } else {
        throw new Error($t('students.save_error'));
      }
    } catch (error) {
      showError(error);
    } finally {
      isSubmitting = false;
    }
  };

  const hasChanges = $derived(
    formData.name !== (studentData?.name || '') ||
    formData.first_name !== (studentData?.first_name || '') ||
    formData.last_name !== (studentData?.last_name || '') ||
    formData.school_id !== (studentData?.school_id || '') ||
    formData.class_id !== (studentData?.class_id || '') ||
    formData.notes !== (studentData?.notes || '')
  );

  const resetToOriginal = () => {
    formData = {
      name: studentData?.name || '',
      first_name: studentData?.first_name || '',
      last_name: studentData?.last_name || '',
      school_id: studentData?.school_id || '',
      class_id: studentData?.class_id || '',
      notes: studentData?.notes || ''
    };
    errors = {};
  };
</script>

<svelte:head>
  <title>{$t('students.edit_title')} - {studentData?.name} - ChessNet</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-6 pb-20" transition:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pt-8">
    <div class="space-y-4">
      <button 
        onclick={() => goto('/panel/students')}
        class="flex items-center gap-2 text-slate-500 hover:text-violet-400 transition-colors group text-[10px] font-outfit font-black uppercase tracking-widest"
      >
        <CaretLeft weight="bold" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        {$t('students.back_to_list')}
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-violet-600/10 border border-violet-500/20 rounded-24 flex items-center justify-center text-violet-400 shadow-violet-flare/10 shadow-xl">
          <IdentificationBadge size={32} weight="duotone" />
        </div>
        <div>
          <h1 class="text-4xl md:text-5xl font-outfit font-extrabold text-white tracking-tighter">{$t('students.edit_title')}</h1>
          <p class="text-slate-400 font-jakarta text-lg font-medium tracking-tight">{$t('students.edit_subtitle')}</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      {#if hasChanges}
        <button 
          onclick={resetToOriginal}
          class="bg-white/5 text-white px-8 py-4 rounded-full text-[10px] font-outfit font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <ArrowCounterClockwise size={18} weight="bold" />
          {$t('students.discard')}
        </button>
      {/if}
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting || !hasChanges}
        class="btn-pill bg-violet-600 text-white px-10 py-4 font-bold hover:bg-violet-500 transition-all shadow-violet-flare flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
      >
        {#if isSubmitting}
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          {$t('common.loading')}
        {:else}
          <FloppyDisk size={20} weight="duotone" />
          {$t('students.save_changes')}
        {/if}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Left Column: Primary Information -->
    <div class="lg:col-span-8 space-y-8">
      <section class="bento-card p-10 space-y-10 relative overflow-hidden group">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-violet-600/5 blur-3xl rounded-full"></div>
        
        <div class="flex items-center gap-4 border-b border-white/5 pb-8 relative z-10">
           <div class="p-3 bg-violet-600/10 rounded-2xl text-violet-400">
              <IdentificationBadge size={24} weight="duotone" />
           </div>
           <h2 class="text-2xl font-outfit font-bold text-white tracking-tight">{$t('students.personal_data')}</h2>
        </div>

        <div class="grid grid-cols-1 gap-10 relative z-10">
           <div class="space-y-4">
              <label for="name" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1">{$t('students.full_name_label')}</label>
              <div class="relative">
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  placeholder={$t('students.full_name_placeholder')}
                  class={`w-full bg-zinc-950 border rounded-24 px-8 py-5 text-base font-jakarta text-white outline-none transition-all placeholder:text-slate-700 ${errors.name ? 'border-red-500 shadow-lg shadow-red-500/10' : 'border-white/5 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5'}`}
                />
              </div>
              {#if errors.name}
                <p class="text-red-400 text-[10px] font-bold uppercase tracking-widest ml-4">{errors.name}</p>
              {/if}
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                 <label for="first_name" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1">{$t('students.first_name')}</label>
                 <input
                   id="first_name"
                   type="text"
                   bind:value={formData.first_name}
                   class="w-full bg-zinc-950 border border-white/5 rounded-24 px-8 py-5 text-base font-jakarta text-white focus:border-violet-500/50 outline-none transition-all focus:ring-4 focus:ring-violet-500/5"
                 />
              </div>
              <div class="space-y-4">
                 <label for="last_name" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1">{$t('students.last_name')}</label>
                 <input
                   id="last_name"
                   type="text"
                   bind:value={formData.last_name}
                   class="w-full bg-zinc-950 border border-white/5 rounded-24 px-8 py-5 text-base font-jakarta text-white focus:border-violet-500/50 outline-none transition-all focus:ring-4 focus:ring-violet-500/5"
                 />
              </div>
           </div>
        </div>
      </section>

      <section class="bento-card p-10 space-y-10">
        <div class="flex items-center gap-4 border-b border-white/5 pb-8">
           <div class="p-3 bg-violet-600/10 rounded-2xl text-violet-400">
              <Note size={24} weight="duotone" />
           </div>
           <h2 class="text-2xl font-outfit font-bold text-white tracking-tight">{$t('students.observations')}</h2>
        </div>

        <div class="space-y-4">
           <label for="notes" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1 text-right block">{$t('students.notes_label')}</label>
           <textarea
             id="notes"
             bind:value={formData.notes}
             placeholder={$t('students.notes_placeholder')}
             class="w-full bg-zinc-950 border border-white/5 rounded-[32px] px-8 py-6 text-base font-jakarta text-white h-56 resize-none focus:border-violet-500/50 outline-none transition-all placeholder:text-slate-700 focus:ring-4 focus:ring-violet-500/5"
           ></textarea>
        </div>
      </section>
    </div>

    <!-- Right Column: Institutional & Context -->
    <div class="lg:col-span-4 space-y-8">
       <section class="bento-card p-8 space-y-8 border-t-2 border-violet-500 bg-gradient-to-b from-violet-600/5 to-transparent">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-violet-400 border border-white/5">
                <Buildings size={24} weight="duotone" />
             </div>
             <h3 class="text-lg font-outfit font-bold text-white tracking-tight">{$t('students.educational_school')}</h3>
          </div>

          <div class="space-y-6">
             <div class="relative group">
                <select
                  bind:value={formData.school_id}
                  class="w-full bg-zinc-950 border border-white/5 rounded-24 px-6 py-5 text-sm font-outfit font-bold uppercase tracking-widest text-white focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer group-hover:bg-zinc-900 focus:ring-4 focus:ring-violet-500/5"
                >
                  <option value="">{$t('classes.independent').toUpperCase()}</option>
                  {#each schools as school}
                    <option value={school.id}>{school.name.toUpperCase()}</option>
                  {/each}
                </select>
                <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-violet-400 transition-colors">
                   <CaretDown weight="bold" size={16} />
                </div>
             </div>
             
             <div class="p-5 bg-white/5 rounded-24 border border-white/5 border-dashed">
                <p class="text-[11px] font-jakarta font-medium text-slate-500 leading-relaxed italic text-center">
                   {$t('students.institutional_tip')}
                </p>
             </div>
          </div>
       </section>

       <section class="bento-card p-8 space-y-8">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-violet-400 border border-white/5">
                <Users size={24} weight="duotone" />
             </div>
             <h3 class="text-lg font-outfit font-bold text-white tracking-tight">{$t('students.assigned_class')}</h3>
          </div>
 
          <div class="space-y-6">
             <div class="relative group">
                <select
                  bind:value={formData.class_id}
                  class="w-full bg-zinc-950 border border-white/5 rounded-24 px-6 py-5 text-sm font-outfit font-bold uppercase tracking-widest text-white focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer group-hover:bg-zinc-900 focus:ring-4 focus:ring-violet-500/5"
                >
                  <option value="">{$t('classes.independent').toUpperCase()}</option>
                  {#each classes.filter((c: any) => !formData.school_id || c.school_id === formData.school_id) as cls}
                    <option value={cls.id}>{cls.name.toUpperCase()}</option>
                  {/each}
                </select>
                <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-violet-400 transition-colors">
                   <CaretDown weight="bold" size={16} />
                </div>
             </div>
             
             <div class="p-5 bg-white/5 rounded-24 border border-white/5 border-dashed">
                <p class="text-[11px] font-jakarta font-medium text-slate-500 leading-relaxed italic text-center">
                   {$t('students.class_tip')}
                </p>
             </div>
          </div>
       </section>
 
       <!-- Context Preview -->
       <section class="bento-card p-8 space-y-6">
          <h3 class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">{$t('students.preview_label')}</h3>
          
          <div class="flex items-center gap-5 bg-zinc-950/50 p-6 rounded-24 border border-white/5">
             <div class="w-14 h-14 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 font-outfit font-black text-xl shadow-inner">
                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
             </div>
             <div class="min-w-0">
                <p class="text-base font-outfit font-bold text-white uppercase tracking-tight truncate">{formData.name || $t('students.unnamed')}</p>
                <div class="flex items-center gap-2 mt-1">
                   <CheckCircle size={14} weight="fill" class="text-primary-500" />
                   <p class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest">{$t('students.status_sync')}</p>
                </div>
             </div>
          </div>
       </section>
    </div>
  </div>
</div>
