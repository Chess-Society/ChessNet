<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { t } from '$lib/i18n';
  import { showToast, showError } from '$lib/stores/toast';
  import { fade, fly, scale } from 'svelte/transition';
  import { 
    ArrowLeft,
    CheckCircle,
    X,
    FileText,
    Plus, 
    Pulse, 
    BookOpen, 
    Lightning,
    IdentificationBadge,
    CaretRight,
    CaretLeft,
    FloppyDisk,
    Warning,
    UserCircle,
    Spinner,
    ArrowsClockwise,
    Buildings,
    Sparkle,
    Lightbulb,
    Info,
    ArrowRight,
    CircleNotch,
    Check,
    SelectionBackground
  } from 'phosphor-svelte';
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { studentSchema } from '$lib/schemas/student';
  import { appStore } from '$lib/stores/appStore';
  import type { PageData } from './$types';
  
  let { data } = $props<{ data: PageData }>();

  const { form, errors, constraints, enhance, delayed, message } = superForm(data.form as any, {
    validators: zod(studentSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        showToast.success($t('students.toast_create_success'));
        setTimeout(() => handleGoBack(), 400);
      }
    },
    onError({ result }) {
      showError(result.error);
    }
  });

  let plan = $derived($appStore.settings.plan || 'free');
  let studentsCount = $derived($appStore.students.length);
  let isLimitReached = $derived(plan === 'free' && studentsCount >= 10);

  // Data mapping
  const schools = $derived(data.schools || []);
  const classes = $derived(data.classes || []);

  // URL context
  const classIdFromUrl = $derived($page.url.searchParams.get('classId'));
  const schoolIdFromUrl = $derived($page.url.searchParams.get('schoolId'));
  const returnTo = $derived($page.url.searchParams.get('returnTo'));
  const isFromClass = $derived(!!classIdFromUrl);

  $effect(() => {
    if (schoolIdFromUrl && !$form.schoolId) $form.schoolId = schoolIdFromUrl;
    if (classIdFromUrl && !$form.classId) $form.classId = classIdFromUrl;
  });

  const handleGoBack = () => {
    if (returnTo) goto(returnTo);
    else if (isFromClass && classIdFromUrl) goto(`/panel/classes/${classIdFromUrl}`);
    else goto('/panel/students');
  };
</script>

<svelte:head>
  <title>{$t('students.new_title')} - ChessNet</title>
</svelte:head>

<!-- Premium Sticky Header -->
<div class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
  <div class="max-w-[1400px] mx-auto flex items-center justify-between">
    <div class="flex items-center gap-6">
      <button 
        onclick={handleGoBack}
        class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all active:scale-95 group"
      >
        <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </button>
      <div>
        <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('students.new_title')}</h1>
        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{$t('students.new_subtitle')}</p>
      </div>
    </div>

    <form 
      method="POST" 
      action="?/create" 
      use:enhance 
      class="flex items-center gap-4"
    >
      <button 
        type="button"
        onclick={handleGoBack}
        class="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-none text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
      >
        <X weight="bold" class="w-4 h-4" />
        {$t('common.cancel')}
      </button>
      <button 
        type="submit"
        disabled={$delayed || isLimitReached}
        class="flex items-center gap-3 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-none text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/20 active:scale-95 disabled:opacity-50 group"
      >
        {#if $delayed}
          <CircleNotch weight="bold" class="w-4 h-4 animate-spin" />
        {:else}
          <FloppyDisk weight="bold" class="w-4 h-4 group-hover:scale-110 transition-transform" />
        {/if}
        {$delayed ? $t('common.saving') : $t('students.confirm_registration')}
      </button>
    </form>
  </div>
</div>

<div class="max-w-[1400px] mx-auto px-6 md:px-12 py-12" in:fade={{ duration: 300 }}>
  {#if isLimitReached}
    <div class="mb-12 p-8 bg-amber-500/5 border border-amber-500/20 rounded-none flex items-center justify-between gap-8 relative overflow-hidden shadow-2xl" in:fly={{ y: 20 }}>
      <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent"></div>
      <div class="flex items-center gap-8 relative z-10">
        <div class="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-none flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10">
          <Lightning size={36} weight="duotone" />
        </div>
        <div>
          <h3 class="text-3xl font-outfit font-black text-white italic uppercase tracking-tighter mb-1">{$t('panel.limits.students')}</h3>
          <p class="text-zinc-500 font-bold uppercase text-[11px] tracking-widest">{$t('pricing.premium.desc')}</p>
        </div>
      </div>
      <a href="/panel/upgrade" class="relative z-10 px-10 py-5 bg-white text-black hover:bg-zinc-200 transition-all rounded-none font-outfit font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-white/10 active:scale-95">
        {$t('panel.upgrade')}
      </a>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
    
    <!-- Left: Form Sections (8 Columns) -->
    <div class="lg:col-span-8 space-y-10">
      {#if isFromClass}
        <div class="bento-card !p-6 bg-emerald-500/5 border-emerald-500/20 flex items-center gap-4 group" in:fly={{ x: -20 }}>
          <div class="w-12 h-12 bg-emerald-500/10 rounded-none flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10 transition-transform group-hover:scale-110">
            <CheckCircle weight="duotone" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">{$t('classes.enroll')}</p>
            <p class="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">{$t('students.auto_enroll_active')}</p>
          </div>
        </div>
      {/if}

      <!-- Section: Identity -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100"></div>
        
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
            <IdentificationBadge weight="duotone" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('students.personal_data')}</h3>
            <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('students.identity_desc')}</p>
          </div>
        </div>

        <div class="space-y-10 relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-3">
              <label for="firstName" class="glass-label">{$t('students.first_name')} <span class="text-violet-500">*</span></label>
              <div class="relative group">
                <UserCircle weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  bind:value={$form.firstName}
                  placeholder={$t('students.first_name_placeholder')}
                  class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
                  aria-invalid={$errors.firstName ? 'true' : undefined}
                  {...$constraints.firstName}
                />
              </div>
              {#if $errors.firstName}<p class="text-red-500 text-[10px] font-bold uppercase mt-1">{$errors.firstName}</p>{/if}
            </div>

            <div class="space-y-3">
              <label for="lastName" class="glass-label">{$t('students.last_name')}</label>
              <div class="relative group">
                <UserCircle weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  bind:value={$form.lastName}
                  placeholder={$t('students.last_name_placeholder')}
                  class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
                  {...$constraints.lastName}
                />
              </div>
            </div>

            <div class="space-y-3">
              <label for="lichessUsername" class="glass-label">Usuario de Lichess</label>
              <div class="relative group">
                <Sparkle weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-sky-500 transition-colors pointer-events-none" />
                <input
                  id="lichessUsername"
                  name="lichessUsername"
                  type="text"
                  bind:value={$form.lichessUsername}
                  placeholder="Ej: drnykterstein"
                  class="glass-input pl-16 pr-8 w-full focus:ring-sky-500/20 focus:border-sky-500 bg-zinc-950/50 italic"
                  {...$constraints.lichessUsername}
                />
              </div>
            </div>
          </div>

          <div class="space-y-6 pt-6 border-t border-white/5">
            <span class="glass-label mb-2 block">{$t('students.educational_school')}</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="hidden" name="schoolId" bind:value={$form.schoolId} />
              <button
                type="button"
                onclick={() => { $form.schoolId = ''; $form.classId = ''; }}
                class="selection-card small {$form.schoolId === '' ? 'active' : ''}"
              >
                <div class="card-icon">
                  <Sparkle weight={$form.schoolId === '' ? "fill" : "duotone"} />
                </div>
                <div class="card-content">
                  <span class="card-title">{$t('students.independent_student')}</span>
                </div>
                {#if $form.schoolId === ''}
                  <div class="card-check" in:scale>
                    <Check size={12} weight="bold" />
                  </div>
                {/if}
              </button>

              {#each schools as school}
                <button
                  type="button"
                  onclick={() => { $form.schoolId = school.id; $form.classId = ''; }}
                  class="selection-card small {$form.schoolId === school.id ? 'active' : ''}"
                >
                  <div class="card-icon">
                    <Buildings weight={$form.schoolId === school.id ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{school.name}</span>
                  </div>
                  {#if $form.schoolId === school.id}
                    <div class="card-check" in:scale>
                      <Check size={12} weight="bold" />
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <div class="space-y-6 pt-6 border-t border-white/5">
            <span class="glass-label mb-2 block">{$t('students.group_label')}</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="hidden" name="classId" bind:value={$form.classId} />
              <button
                type="button"
                onclick={() => $form.classId = ''}
                class="selection-card small {$form.classId === '' ? 'active' : ''}"
              >
                <div class="card-icon">
                  <IdentificationBadge weight={$form.classId === '' ? "fill" : "duotone"} />
                </div>
                <div class="card-content">
                  <span class="card-title">{$t('students.individual_class')}</span>
                </div>
                {#if $form.classId === ''}
                  <div class="card-check" in:scale>
                    <Check size={12} weight="bold" />
                  </div>
                {/if}
              </button>

              {#each classes.filter((c: any) => !$form.schoolId || c.schoolId === $form.schoolId) as c}
                <button
                  type="button"
                  onclick={() => $form.classId = c.id}
                  class="selection-card small {$form.classId === c.id ? 'active' : ''}"
                >
                  <div class="card-icon">
                    <BookOpen weight={$form.classId === c.id ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{c.name}</span>
                  </div>
                  {#if $form.classId === c.id}
                    <div class="card-check" in:scale>
                      <Check size={12} weight="bold" />
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Observations -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-amber-600/20 border border-amber-500/30 rounded-none flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
            <FileText weight="duotone" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('students.observations')}</h3>
            <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('students.notes_desc')}</p>
          </div>
        </div>

        <div class="space-y-6 relative z-10">
          <label for="notes" class="glass-label">{$t('students.notes_label')}</label>
          <textarea
            id="notes"
            name="notes"
            bind:value={$form.notes}
            placeholder={$t('students.notes_placeholder')}
            rows="5"
            class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50"
            {...$constraints.notes}
          ></textarea>
        </div>
      </section>
    </div>

    <!-- Right: Sticky Sidebar (4 Columns) -->
    <div class="lg:col-span-4">
      <div class="sticky top-32 space-y-8">
        
        <!-- Premium Preview Card -->
        <div class="bento-card !p-8 overflow-hidden relative group">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 rounded-none blur-3xl"></div>
          
          <div class="relative z-10 text-center space-y-8">
            <div class="flex flex-col items-center">
              <div class="w-24 h-24 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-2xl shadow-violet-500/20 transition-transform group-hover:scale-110 duration-700">
                <span class="text-4xl font-outfit font-black uppercase">
                  {$form.firstName ? $form.firstName.charAt(0) : '?'}
                </span>
              </div>
              <h4 class="text-2xl font-outfit font-black text-white mt-6 uppercase italic tracking-tighter truncate w-full px-4">
                {$form.firstName || $t('common.new')} {$form.lastName || ''}
              </h4>
              <span class="px-4 py-1.5 bg-zinc-950/50 border border-zinc-800 rounded-none text-[9px] font-black uppercase tracking-widest text-zinc-500 mt-2 shadow-inner">
                {$t('students.preview_label')}
              </span>
            </div>

            <div class="space-y-4 pt-8 border-t border-white/5">
              {#each [1, 2, 3] as i}
                <div class="flex gap-4 items-start text-left">
                  <div class="w-6 h-6 rounded-none bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-violet-500 shrink-0 shadow-inner">0{i}</div>
                  <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-relaxed pt-0.5">
                    {@html $t(`students.guidance_${i}`)}
                  </p>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Help Card -->
        <div class="bento-card !p-8 relative overflow-hidden bg-amber-600/5 border-amber-500/20">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <Lightbulb weight="duotone" class="w-5 h-5 text-amber-400" />
              <h3 class="text-[10px] font-black text-amber-200 uppercase tracking-widest">{$t('common.tip')}</h3>
            </div>
            <p class="text-[11px] text-zinc-500 leading-relaxed font-bold italic uppercase tracking-tighter">
              {$t('students.guidance_title')}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 0px;
  }
</style>

