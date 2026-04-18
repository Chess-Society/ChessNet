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
    Pencil
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

<div class="page-container" in:fade>
  <div class="glow-bg"></div>

  <!-- Header Section -->
  <header class="main-header">
    <div class="title-section">
      <button 
        onclick={() => goto(`/panel/students/${studentData.id}`)}
        class="back-orb"
        title={$t('students.back_to_list')}
      >
        <CaretLeft size={24} weight="bold" />
      </button>
      <div class="flex items-center gap-6">
        <div class="header-icon">
          <Pencil size={32} weight="bold" />
        </div>
        <div class="text-group">
          <h1 class="gradient-text font-outfit truncate max-w-md">{$t('students.edit_title')}</h1>
          <p class="subtitle mt-1">{$t('students.edit_subtitle')}</p>
        </div>
      </div>
    </div>

    <div class="action-section">
      {#if hasChanges}
        <button 
          class="glass-btn secondary" 
          onclick={resetToOriginal}
          in:scale
        >
          <ArrowCounterClockwise size={20} weight="bold" />
          <span class="font-outfit font-bold">{$t('students.discard')}</span>
        </button>
      {/if}
      <button 
        class="glass-btn primary" 
        onclick={handleSubmit}
        disabled={isSubmitting || !hasChanges}
      >
        {#if isSubmitting}
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
        {:else}
          <FloppyDisk size={20} weight="bold" />
        {/if}
        <span class="font-outfit font-bold">{$t('students.save_changes')}</span>
      </button>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Left Column: Primary Information -->
    <div class="lg:col-span-8 space-y-8">
      <section class="bento-card !p-10 space-y-10 relative overflow-hidden group">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-violet-600/5 blur-3xl rounded-full"></div>
        
        <div class="flex items-center gap-4 border-b border-white/5 pb-8 relative z-10">
           <div class="p-3 bg-violet-600/10 rounded-2xl text-violet-400">
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
           <div class="p-3 bg-violet-600/10 rounded-2xl text-violet-400">
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
       <section class="bento-card !p-8 border-t-2 border-violet-500 bg-gradient-to-b from-violet-600/5 to-transparent">
          <div class="flex items-center gap-4 mb-8">
             <div class="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-violet-400 border border-white/5 shadow-inner">
                <Buildings size={24} weight="duotone" />
             </div>
             <h3 class="text-lg font-outfit font-bold text-white tracking-tight">{$t('students.educational_school')}</h3>
          </div>

          <div class="space-y-6">
             <div class="input-wrapper group">
                <select bind:value={formData.school_id} class="glass-select uppercase text-xs font-black tracking-widest">
                  <option value="">{$t('classes.independent')}</option>
                  {#each schools as school}
                    <option value={school.id}>{school.name}</option>
                  {/each}
                </select>
                <CaretDown weight="bold" class="select-arrow" />
             </div>
             
             <div class="tip-card">
                <p>{$t('students.institutional_tip')}</p>
             </div>
          </div>
       </section>

       <section class="bento-card !p-8">
          <div class="flex items-center gap-4 mb-8">
             <div class="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-violet-400 border border-white/5 shadow-inner">
                <Users size={24} weight="duotone" />
             </div>
             <h3 class="text-lg font-outfit font-bold text-white tracking-tight">{$t('students.assigned_class')}</h3>
          </div>
  
          <div class="space-y-6">
             <div class="input-wrapper group">
                <select bind:value={formData.class_id} class="glass-select uppercase text-xs font-black tracking-widest">
                  <option value="">{$t('classes.independent')}</option>
                  {#each classes.filter((c: any) => !formData.school_id || c.school_id === formData.school_id) as cls}
                    <option value={cls.id}>{cls.name}</option>
                  {/each}
                </select>
                <CaretDown weight="bold" class="select-arrow" />
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
                   <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   <p class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest leading-none">{$t('students.status_sync')}</p>
                </div>
             </div>
          </div>
       </section>
    </div>
  </div>
</div>

<style lang="postcss">
  .page-container {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    min-height: 100vh;
    z-index: 1;
  }

  .glow-bg {
    position: fixed;
    top: -10%;
    right: -10%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
    filter: blur(80px);
    z-index: -1;
    pointer-events: none;
  }

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3.5rem;
    gap: 2rem;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 1.75rem;
  }

  .back-orb {
    width: 54px;
    height: 54px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #475569;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .back-orb:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateX(-5px);
  }

  .header-icon {
    width: 64px;
    height: 64px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a78bfa;
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  }

  .gradient-text {
    font-size: 3rem;
    font-weight: 900;
    margin: 0;
    line-height: 1;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
     color: #94a3b8;
     font-family: 'Jakarta';
     font-size: 1.1rem;
     font-weight: 500;
  }

  .action-section {
    display: flex;
    gap: 1.25rem;
  }

  .glass-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1.75rem;
    border-radius: 16px;
    font-size: 0.95rem;
    font-weight: 700;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .glass-btn.primary {
    background: #fff;
    color: #000;
    box-shadow: 0 10px 25px rgba(255,255,255,0.1);
  }

  .glass-btn.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(255,255,255,0.15);
  }

  .glass-btn.secondary {
    background: rgba(255,255,255,0.03);
    color: #fff;
  }

  .glass-btn.secondary:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.15);
  }

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

  .glass-input, .glass-select, .glass-textarea {
    width: 100%;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 20px;
    padding: 1.15rem 1.5rem;
    color: #fff;
    font-size: 1rem;
    font-family: 'Jakarta';
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-input:focus, .glass-select:focus, .glass-textarea:focus {
    background: rgba(0,0,0,0.4);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3), 0 0 1px 1px rgba(139, 92, 246, 0.2);
    outline: none;
  }

  .glass-input.error { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 15px rgba(239, 68, 68, 0.1); }

  .glass-select {
    appearance: none;
    cursor: pointer;
  }

  .input-wrapper :global(.select-arrow) {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #475569;
    transition: color 0.3s;
  }

  .input-wrapper:hover :global(.select-arrow) { color: #a78bfa; }

  .glass-textarea {
    min-height: 220px;
    resize: none;
    line-height: 1.6;
    border-radius: 32px;
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
    border-radius: 20px;
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
     border-radius: 24px;
  }

  .avatar-sm {
    width: 52px;
    height: 52px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a78bfa;
    font-family: 'Outfit';
    font-weight: 900;
    font-size: 1.5rem;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
  }

  @media (max-width: 1024px) {
    .main-header { flex-direction: column; align-items: flex-start; }
    .gradient-text { font-size: 2.25rem; }
    .action-section { width: 100%; }
    .glass-btn { flex: 1; justify-content: center; }
  }
</style>
