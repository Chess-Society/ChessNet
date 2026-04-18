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
    CaretRight,
    CaretLeft,
    FloppyDisk
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

<div class="page-container" in:fade>
  <div class="glow-bg"></div>

  <!-- Header Section -->
  <header class="main-header">
    <div class="title-section">
      <button 
        onclick={handleGoBack}
        class="back-orb"
        title={$t('common.back')}
      >
        <CaretLeft size={24} weight="bold" />
      </button>
      <div class="flex items-center gap-6">
        <div class="header-icon">
          <Plus size={32} weight="bold" />
        </div>
        <div class="text-group">
          <h1 class="gradient-text font-outfit">{$t('students.new_title')}</h1>
          <p class="subtitle mt-1">{$t('students.new_subtitle')}</p>
        </div>
      </div>
    </div>

    <div class="action-section">
      <button 
        class="glass-btn secondary" 
        onclick={handleGoBack}
      >
        <X size={20} weight="bold" />
        <span class="font-outfit font-bold">{$t('common.cancel')}</span>
      </button>
      <button 
        class="glass-btn primary" 
        onclick={handleSubmit}
        disabled={isSubmitting}
      >
        {#if isSubmitting}
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
        {:else}
          <FloppyDisk size={20} weight="bold" />
        {/if}
        <span class="font-outfit font-bold">{$t('students.confirm_registration')}</span>
      </button>
    </div>
  </header>

  {#if isLimitReached}
    <div class="limit-warning mb-12" in:fly={{ y: 20 }}>
      <div class="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent"></div>
      <div class="warning-icon">
        <Lightning size={32} weight="duotone" />
      </div>
      <div class="warning-text">
        <h3>{$t('panel.limits.students')}</h3>
        <p>{$t('pricing.premium.desc')}</p>
      </div>
      <a href="/panel/upgrade" class="upgrade-btn">
        {$t('panel.upgrade')}
      </a>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2 space-y-8">
      {#if isFromClass}
        <div class="enrollment-tip" in:fade>
          <div class="tip-icon">
            <CheckCircle size={24} weight="duotone" />
          </div>
          <div>
            <p class="tip-label">{$t('classes.enroll')}</p>
            <p class="tip-desc">{$t('students.new_subtitle')}</p>
          </div>
        </div>
      {/if}

      <!-- Form Section -->
      <section class="bento-card !p-10 space-y-12">
        <div class="flex items-center gap-4 border-b border-white/5 pb-8">
          <IdentificationBadge size={24} weight="duotone" class="text-violet-400" />
          <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight uppercase">{$t('students.personal_data')}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div class="space-y-4">
            <label for="first_name" class="input-label">{$t('students.first_name')} <span class="text-violet-500">*</span></label>
            <div class="input-wrapper">
              <input
                id="first_name"
                type="text"
                bind:value={formData.first_name}
                placeholder={$t('students.first_name_placeholder')}
                class="glass-input {errors.first_name ? 'error' : ''}"
              />
            </div>
            {#if errors.first_name}
              <p class="error-msg">{errors.first_name}</p>
            {/if}
          </div>

          <div class="space-y-4">
            <label for="last_name" class="input-label">{$t('students.last_name')}</label>
            <div class="input-wrapper">
              <input
                id="last_name"
                type="text"
                bind:value={formData.last_name}
                placeholder={$t('students.last_name_placeholder')}
                class="glass-input"
              />
            </div>
          </div>

          <div class="space-y-4">
            <label for="school" class="input-label">{$t('students.educational_school')} ({$t('common.optional')})</label>
            <div class="input-wrapper group">
              <select id="school" bind:value={formData.school_id} class="glass-select">
                <option value="">{$t('students.independent_student')}</option>
                {#each schools as school}
                  <option value={school.id}>{school.name}</option>
                {/each}
              </select>
              <CaretRight weight="bold" class="select-arrow rotate-90" />
            </div>
          </div>

          <div class="space-y-4">
            <label for="class" class="input-label">{$t('students.group_label')} ({$t('common.optional')})</label>
            <div class="input-wrapper group">
              <select id="class" bind:value={formData.class_id} class="glass-select">
                <option value="">{$t('students.individual_class')}</option>
                {#each classes.filter((c: any) => !formData.school_id || c.school_id === formData.school_id) as c}
                  <option value={c.id}>{c.name}</option>
                {/each}
              </select>
              <CaretRight weight="bold" class="select-arrow rotate-90" />
            </div>
          </div>
        </div>
      </section>

      <!-- Observations -->
      <section class="bento-card !p-10 space-y-10">
        <div class="flex items-center gap-4 border-b border-white/5 pb-8">
          <FileText size={24} weight="duotone" class="text-violet-400" />
          <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight uppercase">{$t('students.observations')}</h2>
        </div>

        <div class="space-y-4">
          <label for="notes" class="input-label">{$t('students.notes_label')}</label>
          <textarea
            id="notes"
            bind:value={formData.notes}
            placeholder={$t('students.notes_placeholder')}
            class="glass-textarea"
          ></textarea>
        </div>
      </section>
    </div>

    <!-- Sidebar -->
    <div class="space-y-8">
      <section class="bento-card !p-8 space-y-8 relative overflow-hidden group">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full"></div>
        
        <div class="flex items-center gap-3 mb-6 relative z-10">
           <BookOpen size={22} weight="duotone" class="text-violet-400" />
           <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">{$t('students.guidance_title')}</h3>
        </div>

        <div class="space-y-6 relative z-10">
           {#each [1, 2, 3] as i}
           <div class="flex gap-4 group/item">
              <div class="guidance-step">0{i}</div>
              <p class="text-xs font-jakarta font-medium text-slate-400 leading-relaxed group-hover/item:text-slate-300 transition-colors">
                 {@html $t(`students.guidance_${i}`)}
              </p>
           </div>
           {/each}
        </div>
      </section>

      <!-- Preview -->
      <section class="bento-card !p-8 space-y-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.preview_label')}</h3>
          <div class="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
        </div>
        
        <div class="preview-box">
           <div class="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
           <div class="flex items-center gap-5 relative z-10">
              <div class="preview-avatar">
                 {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : '?'}
              </div>
              <div class="min-w-0">
                <p class="text-base font-outfit font-bold text-white truncate group-hover:text-violet-400 transition-colors">
                  {formData.first_name || $t('common.new')} {formData.last_name || $t('students.student_label')}
                </p>
                <div class="flex items-center gap-2 mt-1 Opacity-60">
                  <div class="w-2 h-2 rounded-full bg-slate-500"></div>
                  <p class="text-[9px] font-outfit font-black text-slate-500 uppercase tracking-widest leading-none">{$t('students.technical_tag')}</p>
                </div>
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

  .limit-warning {
    position: relative;
    background: rgba(139, 92, 246, 0.05);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 28px;
    padding: 2.5rem;
    display: flex;
    align-items: center;
    gap: 2.5rem;
    overflow: hidden;
  }

  .warning-icon {
    width: 64px;
    height: 64px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a78bfa;
    z-index: 10;
  }

  .warning-text {
    flex-grow: 1;
    z-index: 10;
  }

  .warning-text h3 {
    font-family: 'Outfit';
    font-weight: 800;
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .warning-text p {
    color: #94a3b8;
    font-family: 'Jakarta';
    font-weight: 500;
  }

  .upgrade-btn {
    padding: 0.9rem 2.5rem;
    background: #fff;
    color: #000;
    border-radius: 50px;
    font-family: 'Outfit';
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.85rem;
    z-index: 10;
    box-shadow: 0 10px 20px rgba(255,255,255,0.1);
  }

  .enrollment-tip {
    background: rgba(139, 92, 246, 0.05);
    border-left: 4px solid #7c3aed;
    padding: 1.5rem;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .tip-icon { color: #8b5cf6; }
  .tip-label { font-family: 'Outfit'; font-weight: 900; font-size: 0.7rem; color: #a78bfa; text-transform: uppercase; letter-spacing: 1px; }
  .tip-desc { font-family: 'Jakarta'; font-weight: 500; font-size: 0.9rem; color: #64748b; }

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
    font-weight: 500;
  }

  .input-wrapper :global(.select-arrow) {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    pointer-events: none;
    color: #475569;
    transition: color 0.3s;
  }

  .input-wrapper:hover :global(.select-arrow) { color: #a78bfa; }

  .glass-textarea {
    min-height: 180px;
    resize: none;
    line-height: 1.6;
  }

  .error-msg {
    color: #f87171;
    font-size: 0.75rem;
    font-weight: 700;
    margin-top: 0.5rem;
    padding-left: 0.75rem;
  }

  .guidance-step {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Outfit';
    font-weight: 900;
    font-size: 0.75rem;
    color: #7c3aed;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }

  .preview-box {
    position: relative;
    background: rgba(0,0,0,0.25);
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: 24px;
    padding: 1.5rem;
    overflow: hidden;
    transition: all 0.3s;
  }

  .preview-avatar {
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a78bfa;
    font-family: 'Outfit';
    font-weight: 900;
    font-size: 1.5rem;
  }

  @media (max-width: 1024px) {
    .main-header { flex-direction: column; align-items: flex-start; }
    .gradient-text { font-size: 2.25rem; }
    .action-section { width: 100%; }
    .glass-btn { flex: 1; justify-content: center; }
  }
</style>
