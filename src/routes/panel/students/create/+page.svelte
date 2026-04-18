<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';

  import { page } from '$app/stores';
  import { 
    ArrowLeft,
    CheckCircle,
    X,
    FileText,
    Plus, 
    Pulse, 
    BookOpen, 
    Lightning,
    FloppyDiskBack,
    IdentificationBadge,
    CaretRight
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { showToast, showError } from '$lib/stores/toast';
  let { data } = $props<{ data: PageData }>();

  let plan = $derived($appStore.settings.plan || 'free');
  let studentsCount = $derived($appStore.students.length);
  let isLimitReached = $derived(plan === 'free' && studentsCount >= 12);

  let formData = $state({
    first_name: '',
    last_name: '',
    notes: '',
    school_id: '',
    class_id: ''
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  // Data mapping
  const schools = $derived(data.schools || []);
  const classes = $derived(data.classes || []);

  // URL context
  const classIdFromUrl = $derived($page.url.searchParams.get('classId'));
  const schoolIdFromUrl = $derived($page.url.searchParams.get('schoolId'));
  const returnTo = $derived($page.url.searchParams.get('returnTo'));
  const isFromClass = $derived(!!classIdFromUrl);

  $effect(() => {
    if (schoolIdFromUrl) formData.school_id = schoolIdFromUrl;
    if (classIdFromUrl) formData.class_id = classIdFromUrl;
  });

  const handleGoBack = () => {
    if (returnTo) goto(returnTo);
    else if (isFromClass && classIdFromUrl) goto(`/panel/classes/${classIdFromUrl}`);
    else goto('/panel/students');
  };

  const validateForm = () => {
    errors = {};
    if (!formData.first_name.trim()) errors.first_name = $t('students.full_name_required');
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (isLimitReached) {
      goto('/pricing');
      return;
    }
    if (!validateForm() || isSubmitting) return;

    try {
      isSubmitting = true;
      const studentData = {
        name: `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        notes: formData.notes.trim(),
        school_id: formData.school_id,
        class_id: formData.class_id
      };
      
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || $t('common.error'));
      
      // Auto-enrolar si viene de una clase
      if (formData.class_id && result.student) {
        await fetch('/api/class-students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ class_id: formData.class_id, student_id: result.student.id }),
        });
      }
      
      showToast.success($t('students.toast_create_success'));
      await invalidateAll();
      setTimeout(() => {
        goto(returnTo || (isFromClass ? `/panel/classes/${classIdFromUrl}` : '/panel/students'));
      }, 400);

    } catch (error) {
      showError(error);
    } finally {
      isSubmitting = false;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      handleSubmit();
    }
  };
</script>

<svelte:head>
  <title>{$t('students.new_title')} - ChessNet</title>
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<div class="max-w-5xl mx-auto px-6 pb-24 pt-8" in:fade>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
      <div class="space-y-6">
        <button 
          onclick={handleGoBack}
          class="flex items-center gap-3 text-slate-500 hover:text-violet-400 transition-all group font-outfit font-bold uppercase tracking-widest text-[10px]"
        >
          <div class="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-violet-500/30 transition-all">
            <ArrowLeft size={14} weight="bold" />
          </div>
          {$t('students.back')}
        </button>

        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-violet-600/10 border border-violet-500/20 rounded-24 flex items-center justify-center text-violet-400 shadow-violet-flare/10 shadow-xl">
            <IdentificationBadge size={32} weight="duotone" />
          </div>
          <div>
            <h1 class="text-4xl md:text-5xl font-outfit font-extrabold text-white tracking-tighter">{$t('students.new_title')}</h1>
            <p class="text-slate-400 font-jakarta text-lg font-medium">{$t('students.new_subtitle')}</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button 
          onclick={handleGoBack}
          class="btn-pill bg-zinc-900 text-white px-8 py-4 font-bold border border-white/5 hover:bg-zinc-800 transition-all flex items-center gap-3 text-sm"
        >
          <X size={18} weight="bold" />
          {$t('common.cancel')}
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="btn-pill bg-violet-600 text-white px-10 py-4 font-bold hover:bg-violet-500 transition-all shadow-violet-flare flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {#if isSubmitting}
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          {:else}
            <FloppyDiskBack size={20} weight="duotone" />
          {/if}
          {$t('students.confirm_registration')}
        </button>
      </div>
    </div>

    {#if isLimitReached}
      <div class="bento-card border-violet-500/50 p-10 flex flex-col md:flex-row items-center gap-8 mb-10 overflow-hidden relative shadow-violet-flare/20" in:fly={{ y: 20 }}>
        <div class="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent"></div>
        <div class="w-20 h-20 bg-violet-600/20 rounded-2xl flex items-center justify-center text-violet-400 shrink-0 border border-violet-500/30 relative z-10">
          <Lightning size={40} weight="duotone" class="animate-pulse" />
        </div>
        <div class="flex-grow text-center md:text-left relative z-10">
          <h3 class="text-2xl font-outfit font-extrabold text-white tracking-tight">{$t('panel.limits.students')}</h3>
          <p class="text-slate-400 font-jakarta text-lg font-medium mt-1">{$t('pricing.premium.desc')}</p>
        </div>
        <a 
          href="/panel/upgrade"
          class="btn-pill bg-white text-black px-10 py-4 font-black uppercase tracking-widest hover:bg-slate-100 transition-all relative z-10 active:scale-95 shadow-xl"
        >
          {$t('panel.upgrade')}
        </a>
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Form Section -->
      <div class="lg:col-span-2 space-y-8">
        {#if isFromClass}
          <div class="bento-card !p-6 border-l-4 border-l-violet-500 flex items-center gap-5 transition-all">
             <div class="w-12 h-12 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-400">
                <CheckCircle size={28} weight="duotone" />
             </div>
             <div>
                <p class="text-xs font-outfit font-black text-violet-400 uppercase tracking-widest leading-none mb-1.5">{$t('classes.enroll')}</p>
                <p class="text-sm font-jakarta font-medium text-slate-500">{$t('students.new_subtitle')}</p>
             </div>
          </div>
        {/if}

        <div class="bento-card !p-10 space-y-12">
          <div class="flex items-center gap-4 pb-6 border-b border-white/5">
             <IdentificationBadge size={24} weight="duotone" class="text-violet-400" />
             <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight">{$t('students.personal_data')}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div class="space-y-4">
                <label for="first_name" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1">{$t('students.first_name')} <span class="text-violet-500">*</span></label>
                <input
                  id="first_name"
                  type="text"
                  bind:value={formData.first_name}
                  placeholder={$t('students.first_name_placeholder')}
                  class={`w-full bg-zinc-950 border rounded-24 px-8 py-5 text-base font-medium text-white outline-none transition-all placeholder:text-slate-700 font-jakarta ${errors.first_name ? 'border-red-500/50 focus:border-red-500 shadow-lg shadow-red-500/5' : 'border-white/10 focus:border-violet-500/50'}`}
                />
                {#if errors.first_name}
                  <p class="text-red-400 text-xs font-jakarta font-bold ml-2">{errors.first_name}</p>
                {/if}
             </div>

             <div class="space-y-4">
                <label for="last_name" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1">{$t('students.last_name')}</label>
                <input
                  id="last_name"
                  type="text"
                  bind:value={formData.last_name}
                  placeholder={$t('students.last_name_placeholder')}
                  class="w-full bg-zinc-950 border border-white/10 rounded-24 px-8 py-5 text-base font-medium text-white focus:border-violet-500/50 outline-none transition-all placeholder:text-slate-700 font-jakarta"
                />
             </div>

             <div class="space-y-4">
                <label for="school" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1">{$t('students.educational_school')} ({$t('common.optional')})</label>
                <div class="relative group">
                  <select
                    id="school"
                    bind:value={formData.school_id}
                    class={`w-full bg-zinc-950 border rounded-24 px-8 py-5 text-base font-medium text-white outline-none transition-all font-jakarta appearance-none ${errors.school_id ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-violet-500/50'}`}
                  >
                    <option value="">{$t('students.independent_student')}</option>
                    {#each schools as school}
                      <option value={school.id}>{school.name}</option>
                    {/each}
                  </select>
                  <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-violet-400 transition-colors">
                    <CaretRight weight="bold" class="rotate-90" />
                  </div>
                </div>
             </div>

             <div class="space-y-4">
                <label for="class" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1">{$t('students.group_label')} ({$t('common.optional')})</label>
                <div class="relative group">
                  <select
                    id="class"
                    bind:value={formData.class_id}
                    class="w-full bg-zinc-950 border border-white/10 rounded-24 px-8 py-5 text-base font-medium text-white focus:border-violet-500/50 outline-none transition-all font-jakarta appearance-none"
                  >
                    <option value="">{$t('students.individual_class')}</option>
                    {#each classes.filter((c: any) => !formData.school_id || c.school_id === formData.school_id) as c}
                      <option value={c.id}>{c.name}</option>
                    {/each}
                  </select>
                  <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-violet-400 transition-colors">
                    <CaretRight weight="bold" class="rotate-90" />
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div class="bento-card !p-10 space-y-12">
           <div class="flex items-center gap-4 pb-6 border-b border-white/5">
              <FileText size={24} weight="duotone" class="text-violet-400" />
              <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight">{$t('students.observations')}</h2>
           </div>

           <div class="space-y-4">
              <label for="notes" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest ml-1">{$t('students.notes_label')}</label>
              <textarea
                id="notes"
                bind:value={formData.notes}
                placeholder={$t('students.notes_placeholder')}
                class="w-full bg-zinc-950 border border-white/10 rounded-24 px-8 py-6 text-base font-medium text-white h-48 resize-none focus:border-violet-500/50 outline-none transition-all placeholder:text-slate-700 font-jakarta"
              ></textarea>
           </div>
        </div>
      </div>

      <!-- Stats/Guidance Column -->
      <div class="space-y-8">
         <div class="bento-card !p-8 space-y-8 relative overflow-hidden group">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full"></div>
            
            <div class="flex items-center gap-3 relative z-10">
               <BookOpen size={22} weight="duotone" class="text-violet-400" />
               <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">{$t('students.guidance_title')}</h3>
            </div>

            <div class="space-y-6 relative z-10">
               <div class="flex gap-4">
                  <div class="w-8 h-8 bg-zinc-950 rounded-xl flex items-center justify-center text-xs font-outfit font-black text-violet-400 border border-white/5 shadow-inner">01</div>
                  <p class="text-xs font-jakarta font-medium text-slate-400 leading-relaxed">
                     {@html $t('students.guidance_1')}
                  </p>
               </div>
               <div class="flex gap-4">
                  <div class="w-8 h-8 bg-zinc-950 rounded-xl flex items-center justify-center text-xs font-outfit font-black text-violet-400 border border-white/5 shadow-inner">02</div>
                  <p class="text-xs font-jakarta font-medium text-slate-400 leading-relaxed">
                     {@html $t('students.guidance_2')}
                  </p>
               </div>
               <div class="flex gap-4">
                  <div class="w-8 h-8 bg-zinc-950 rounded-xl flex items-center justify-center text-xs font-outfit font-black text-violet-400 border border-white/5 shadow-inner">03</div>
                  <p class="text-xs font-jakarta font-medium text-slate-400 leading-relaxed">
                     {@html $t('students.guidance_3')}
                  </p>
               </div>
            </div>
         </div>

         <!-- Preview Card -->
         <div class="bento-card !p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.preview_label')}</h3>
              <div class="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
            </div>
            
            <div class="p-6 bg-zinc-950 rounded-24 border border-white/5 space-y-5 relative overflow-hidden group">
               <div class="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div class="flex items-center gap-5 relative z-10">
                  <div class="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-violet-400 font-outfit font-extrabold text-xl shadow-inner text-center">
                     {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div class="min-w-0">
                    <p class="text-base font-outfit font-bold text-white truncate group-hover:text-violet-400 transition-colors">
                      {formData.first_name || $t('common.new')} {formData.last_name || $t('students.student_label')}
                    </p>
                    <p class="text-[9px] font-outfit font-black text-violet-500/60 uppercase tracking-widest mt-1 text-center">{$t('students.technical_tag')}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
</div>

<style lang="postcss">
  /* Student creation specialized layout */
</style>
