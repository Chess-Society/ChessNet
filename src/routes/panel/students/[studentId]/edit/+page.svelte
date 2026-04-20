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
    Users,
    X,
    FileText,
    Pencil,
    WarningCircle,
    Sparkle,
    UserCircle,
    BookOpen
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { showToast, showError } from '$lib/stores/toast';
  import { appStore } from '$lib/stores/appStore';

  let { data } = $props<{ data: PageData }>();

  let studentData = $derived($appStore.students?.find(s => s.id === data.student.id) || data.student);
  let schools = $derived(data.schools || []);
  let classes = $derived(data.classes || []);

  let formData = $state({
    name: '',
    first_name: '',
    last_name: '',
    school_id: '',
    class_id: '',
    notes: '',
    lichess_username: ''
  });

  let isInitialized = $state(false);
  $effect(() => {
    if (studentData && !isInitialized) {
      formData = {
        name: studentData.name || '',
        first_name: studentData.first_name || '',
        last_name: studentData.last_name || '',
        school_id: studentData.school_id || '',
        class_id: studentData.class_id || '',
        notes: studentData.notes || '',
        lichess_username: studentData.lichess_username || ''
      };
      isInitialized = true;
    }
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  let isVerifyingLichess = $state(false);
  let lichessStatus = $state<'idle' | 'valid' | 'invalid'>('idle');

  async function verifyLichessUser() {
    const user = formData.lichess_username.trim();
    if (!user) {
      lichessStatus = 'idle';
      return;
    }
    isVerifyingLichess = true;
    try {
      const res = await fetch(`https://lichess.org/api/user/${user}`);
      lichessStatus = res.ok ? 'valid' : 'invalid';
    } catch {
      lichessStatus = 'invalid';
    } finally {
      isVerifyingLichess = false;
    }
  }

  const validateForm = () => {
    errors = {};
    if (!formData.name.trim()) errors.name = $t('students.full_name_required');
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    try {
      isSubmitting = true;
      
      await appStore.updateStudent({
        id: studentData.id,
        ...formData
      });

      const returnTo = $page.url.searchParams.get('return_to');
      showToast.success($t('students.toast_update_success'));
      await invalidateAll();
      setTimeout(() => {
        goto(returnTo || `/panel/students/${studentData.id}`);
      }, 400);
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
    formData.notes !== (studentData?.notes || '') ||
    formData.lichess_username !== (studentData?.lichess_username || '')
  );

  const resetToOriginal = () => {
    formData = {
      name: studentData?.name || '',
      first_name: studentData?.first_name || '',
      last_name: studentData?.last_name || '',
      school_id: studentData?.school_id || '',
      class_id: studentData?.class_id || '',
      notes: studentData?.notes || '',
      lichess_username: studentData?.lichess_username || ''
    };
    errors = {};
  };
</script>

<svelte:head>
  <title>{$t('students.edit_title')} - {studentData?.name} - ChessNet</title>
</svelte:head>

<div class="page-container" in:fade>
  <div class="glow-bg"></div>

  <!-- Header Section -->
  <!-- Premium Sticky Header -->
  <header class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 mb-12">
    <div class="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          onclick={() => goto(`/panel/students/${studentData.id}`)}
          class="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
        >
          <CaretLeft weight="bold" class="w-5 h-5" />
        </button>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-black uppercase tracking-widest italic flex items-center gap-2">
              <Pencil weight="bold" class="w-4 h-4 text-violet-500" />
              {$t('students.edit_title')}
            </h1>
            {#if hasChanges}
              <span class="px-2 py-0.5 rounded-none bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest animate-pulse border border-amber-500/20">{$t('skills.ui.unsaved')}</span>
            {/if}
          </div>
          <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{$t('students.edit_subtitle')}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        {#if hasChanges}
          <button 
            class="px-5 py-2.5 rounded-none text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all flex items-center gap-2" 
            onclick={resetToOriginal}
            in:scale
          >
            <ArrowCounterClockwise size={20} weight="bold" />
            <span class="font-outfit font-bold">{$t('students.discard')}</span>
          </button>
        {/if}
        <button 
          class="px-8 py-2.5 rounded-none bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 transition-all text-xs font-black tracking-widest uppercase flex items-center gap-2 disabled:opacity-50" 
          onclick={handleSubmit}
          disabled={isSubmitting || !hasChanges}
        >
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin"></div>
          {:else}
            <FloppyDisk size={20} weight="bold" />
          {/if}
          <span class="font-outfit font-bold">{$t('students.save_changes')}</span>
        </button>
      </div>
    </div>
  </header>

  <div class="max-w-[1400px] mx-auto px-6">

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Left Column: Primary Information -->
    <div class="lg:col-span-8 space-y-8">
      <section class="bento-card !p-10 space-y-10 relative overflow-hidden group">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-violet-600/5 blur-3xl rounded-none"></div>
        
        <div class="flex items-center gap-4 border-b border-white/5 pb-8 relative z-10">
           <div class="p-3 bg-violet-600/10 rounded-none text-violet-400">
              <IdentificationBadge size={24} weight="duotone" />
           </div>
           <h2 class="text-2xl font-outfit font-bold text-white tracking-tight uppercase">{$t('students.personal_data')}</h2>
        </div>

        <div class="space-y-10 relative z-10">
           <div class="space-y-4">
              <label for="name" class="input-label">{$t('students.full_name_label')}</label>
              <div class="input-wrapper">
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  placeholder={$t('students.full_name_placeholder')}
                  class="glass-input {errors.name ? 'error' : ''}"
                />
              </div>
              {#if errors.name}
                <p class="error-msg">{errors.name}</p>
              {/if}
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                 <label for="first_name" class="input-label">{$t('students.first_name')}</label>
                 <div class="input-wrapper">
                    <input
                      id="first_name"
                      type="text"
                      bind:value={formData.first_name}
                      class="glass-input"
                    />
                 </div>
              </div>
              <div class="space-y-4">
                 <label for="last_name" class="input-label">{$t('students.last_name')}</label>
                 <div class="input-wrapper">
                    <input
                      id="last_name"
                      type="text"
                      bind:value={formData.last_name}
                      class="glass-input"
                    />
                 </div>
              </div>
           </div>
        </div>
      </section>

      <section class="bento-card !p-10 space-y-10">
        <div class="flex items-center gap-4 border-b border-white/5 pb-8">
           <div class="p-3 bg-violet-600/10 rounded-none text-violet-400">
              <Note size={24} weight="duotone" />
           </div>
           <h2 class="text-2xl font-outfit font-bold text-white tracking-tight uppercase">{$t('students.observations')}</h2>
        </div>

        <div class="space-y-4">
           <label for="notes" class="input-label !text-right">{$t('students.notes_label')}</label>
           <div class="input-wrapper">
              <textarea
                id="notes"
                bind:value={formData.notes}
                placeholder={$t('students.notes_placeholder')}
                class="glass-textarea"
              ></textarea>
           </div>
        </div>
      </section>
    </div>

    <!-- Right Column: Institutional & Context -->
    <div class="lg:col-span-4 space-y-8">
       <!-- Lichess Integration -->
       <section class="bento-card !p-8 border-t-2 border-sky-500 bg-gradient-to-b from-sky-600/5 to-transparent">
          <div class="flex items-center gap-4 mb-6">
             <div class="w-12 h-12 bg-zinc-950 rounded-none flex items-center justify-center text-sky-400 border border-white/5 shadow-inner">
                <svg width="24" height="24" viewBox="0 0 44 44" class="fill-current"><path d="M12.92,10.6A11.75,11.75,0,0,0,24,20H24V9.66L15.3,1.06A11.75,11.75,0,0,0,1,12.79h0A11.75,11.75,0,0,0,12.79,24.5h.13V24a11.75,11.75,0,0,1-11.75-11.75h0A11.75,11.75,0,0,1,12.92,10.6Zm18.15,22.8A11.75,11.75,0,0,0,20,24H20V34.34L28.7,42.94A11.75,11.75,0,0,0,43,31.21h0A11.75,11.75,0,0,0,31.21,19.5h-.13v.5a11.75,11.75,0,0,1,11.75,11.75h0A11.75,11.75,0,0,1,31.08,33.4Z"></path></svg>
             </div>
             <h3 class="text-lg font-outfit font-bold text-white tracking-tight">{$t('students.lichess_integration')}</h3>
          </div>
 
          <div class="space-y-4">
            <p class="text-[11px] font-jakarta text-slate-400 leading-relaxed font-medium">
              {$t('students.lichess_tip')}
            </p>
            <div class="input-wrapper relative">
              <input
                id="lichess_username"
                type="text"
                bind:value={formData.lichess_username}
                onblur={verifyLichessUser}
                oninput={() => lichessStatus = 'idle'}
                placeholder={$t('students.lichess_placeholder')}
                class="glass-input !bg-sky-500/5 focus:!border-sky-400 focus:!ring-sky-500/20 pr-12 {lichessStatus === 'invalid' ? '!border-red-500/50 focus:!ring-red-500/20' : ''} {lichessStatus === 'valid' ? '!border-emerald-500/50 focus:!ring-emerald-500/20' : ''}"
              />
            <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                {#if isVerifyingLichess}
                   <div class="w-4 h-4 rounded-none border-2 border-sky-500/20 border-t-sky-500 animate-spin"></div>
                {:else if lichessStatus === 'valid'}
                   <CheckCircle weight="fill" class="w-5 h-5 text-emerald-500 drop-shadow-md" />
                {:else if lichessStatus === 'invalid'}
                   <WarningCircle weight="fill" class="w-5 h-5 text-red-500 drop-shadow-md" />
                {/if}
              </div>
            </div>
            {#if lichessStatus === 'valid'}
              <p class="text-[10px] font-bold text-emerald-400 tracking-wider uppercase pl-2">{$t('students.lichess_valid')}</p>
            {:else if lichessStatus === 'invalid'}
              <p class="text-[10px] font-bold text-red-400 tracking-wider uppercase pl-2">{$t('students.lichess_invalid')}</p>
            {/if}
          </div>
       </section>

       <section class="bento-card !p-8 border-t-2 border-violet-500 bg-gradient-to-b from-violet-600/5 to-transparent">
          <div class="flex items-center gap-4 mb-8">
             <div class="w-12 h-12 bg-zinc-950 rounded-none flex items-center justify-center text-violet-400 border border-white/5 shadow-inner">
                <Buildings size={24} weight="duotone" />
             </div>
             <h3 class="text-lg font-outfit font-bold text-white tracking-tight">{$t('students.educational_school')}</h3>
          </div>

          <div class="space-y-4">
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  type="button"
                  class="selection-card {!formData.school_id ? 'active' : ''}"
                  onclick={() => {
                    formData.school_id = '';
                    formData.class_id = '';
                  }}
                >
                  <div class="card-icon">
                    <Sparkle weight="duotone" />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{$t('classes.independent')}</span>
                  </div>
                  {#if !formData.school_id}
                    <div class="card-check" in:scale>
                      <CheckCircle size={20} weight="fill" />
                    </div>
                  {/if}
                </button>

                {#each schools as school}
                  <button 
                    type="button"
                    class="selection-card {formData.school_id === school.id ? 'active' : ''}"
                    onclick={() => {
                      if (formData.school_id !== school.id) {
                        formData.school_id = school.id;
                        formData.class_id = '';
                      }
                    }}
                  >
                    <div class="card-icon">
                      <Buildings weight="duotone" />
                    </div>
                    <div class="card-content">
                      <span class="card-title">{school.name}</span>
                      <span class="text-[10px] font-medium text-zinc-500">{school.city || ''}</span>
                    </div>
                    {#if formData.school_id === school.id}
                      <div class="card-check" in:scale>
                        <CheckCircle size={20} weight="fill" />
                      </div>
                    {/if}
                  </button>
                {/each}
             </div>
             
             <div class="tip-card">
                <p>{$t('students.institutional_tip')}</p>
             </div>
          </div>
       </section>

       <section class="bento-card !p-8">
          <div class="flex items-center gap-4 mb-8">
             <div class="w-12 h-12 bg-zinc-950 rounded-none flex items-center justify-center text-violet-400 border border-white/5 shadow-inner">
                <Users size={24} weight="duotone" />
             </div>
             <h3 class="text-lg font-outfit font-bold text-white tracking-tight">{$t('students.assigned_class')}</h3>
          </div>
  
          <div class="space-y-4">
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  type="button"
                  class="selection-card {!formData.class_id ? 'active' : ''}"
                  onclick={() => formData.class_id = ''}
                >
                  <div class="card-icon">
                    <UserCircle weight="duotone" />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{$t('classes.independent')}</span>
                  </div>
                  {#if !formData.class_id}
                    <div class="card-check" in:scale>
                      <CheckCircle size={20} weight="fill" />
                    </div>
                  {/if}
                </button>

                {#each classes.filter((c: any) => !formData.school_id || c.school_id === formData.school_id) as cls}
                  <button 
                    type="button"
                    class="selection-card {formData.class_id === cls.id ? 'active' : ''}"
                    onclick={() => formData.class_id = cls.id}
                  >
                    <div class="card-icon">
                      <BookOpen weight="duotone" />
                    </div>
                    <div class="card-content">
                      <span class="card-title">{cls.name}</span>
                      <span class="text-[10px] font-medium text-zinc-500">{cls.schedule || ''}</span>
                    </div>
                    {#if formData.class_id === cls.id}
                      <div class="card-check" in:scale>
                        <CheckCircle size={20} weight="fill" />
                      </div>
                    {/if}
                  </button>
                {/each}
             </div>
             
             <div class="tip-card">
                <p>{$t('students.class_tip')}</p>
             </div>
          </div>
       </section>
  
       <!-- Context Preview -->
       <section class="bento-card !p-8 space-y-6">
          <h3 class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">{$t('students.preview_label')}</h3>
          
          <div class="preview-mini">
             <div class="avatar-sm">
                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
             </div>
             <div class="min-w-0">
                <p class="text-base font-outfit font-bold text-white uppercase tracking-tight truncate">{formData.name || $t('students.unnamed')}</p>
                <div class="flex items-center gap-2 mt-1">
                   <div class="w-1.5 h-1.5 rounded-none bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   <p class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest leading-none">{$t('students.status_sync')}</p>
                </div>
             </div>
          </div>
       </section>
    </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .input-label {
    display: block;
    font-family: 'Outfit';
    font-weight: 900;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #475569;
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
  }

  .input-wrapper {
    position: relative;
  }

  .glass-input, .glass-textarea {
    width: 100%;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0;
    padding: 1.15rem 1.5rem;
    color: #fff;
    font-size: 1rem;
    font-family: 'Jakarta';
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-input:focus, .glass-textarea:focus {
    background: rgba(0,0,0,0.4);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3), 0 0 1px 1px rgba(139, 92, 246, 0.2);
    outline: none;
  }



  .glass-textarea {
    min-height: 220px;
    resize: none;
    line-height: 1.6;
    border-radius: 0;
  }

  .error-msg {
    color: #f87171;
    font-size: 0.75rem;
    font-weight: 700;
    margin-top: 0.5rem;
    padding-left: 0.75rem;
  }

  .tip-card {
    padding: 1.25rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0;
    font-family: 'Jakarta';
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.6;
    font-style: italic;
    text-align: center;
  }

  .preview-mini {
     display: flex;
     align-items: center;
     gap: 1.25rem;
     padding: 1.25rem;
     background: rgba(0,0,0,0.25);
     border: 1px solid rgba(255,255,255,0.03);
     border-radius: 0;
  }

  .avatar-sm {
    width: 52px;
    height: 52px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a78bfa;
    font-family: 'Outfit';
    font-weight: 900;
    font-size: 1.5rem;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
  }

  .selection-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0;
    text-align: left;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    width: 100%;
  }

  .selection-card:hover {
    background: rgba(139, 92, 246, 0.05);
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-2px);
  }



  @media (max-width: 1024px) {
  }
</style>
