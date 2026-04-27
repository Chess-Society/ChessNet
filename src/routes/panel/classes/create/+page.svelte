<script lang="ts">
  import { 
    ChalkboardTeacher, 
    CalendarBlank, 
    Clock, 
    MapPin, 
    Target, 
    Coins, 
    ArrowLeft,
    Users,
    Info,
    CheckCircle,
    CaretDown,
    UsersThree,
    Buildings,
    Warning,
    Plus,
    Sparkle,
    ArrowsClockwise,
    CurrencyEur,
    GraduationCap,
    Lightbulb,
    CaretLeft,
    Check,
    FloppyDisk,
    X,
    ArrowRight,
    Shuffle,
    TrendUp,
    ArrowUpRight,
    ArrowArcLeft
  } from 'phosphor-svelte';
  import { t, locale } from '$lib/i18n';
  import { goto, invalidateAll } from '$app/navigation';
  import { fade, scale, fly } from 'svelte/transition';
  import { toast } from '$lib/stores/toast';
  import { appStore } from '$lib/stores/appStore';
  import type { PageData } from './$types';
  import { page } from '$app/stores';

  import { superForm } from 'sveltekit-superforms';
  import { onMount, untrack } from 'svelte';
  import { zod4 as zod } from 'sveltekit-superforms/adapters';
  import { classSchema } from '$lib/schemas/class';
  
  let { data } = $props<{ data: PageData }>();

  const { form, errors, constraints, enhance, delayed, message, isTainted } = superForm(untrack(() => data.form) as any, {
    validators: zod(classSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success((form.message as string) || $t('classes.create_success'));
        goto('/panel/classes');
      } else if (form.message) {
        toast.error(form.message as string);
      }
    },
    onError({ result }) {
      toast.error((result as any).error?.message || 'Error al crear clase');
    }
  }) as any;

  let schools = $derived(data.schools || []);
  const schoolIdFromUrl = $derived($page.url.searchParams.get('schoolId'));

  const getLevelInfo = (l: string) => {
    switch(l) {
      case 'beginner': return { label: $t('common.levels.beginner'), icon: Sparkle };
      case 'intermediate': return { label: $t('common.levels.intermediate'), icon: ArrowUpRight };
      case 'advanced': return { label: $t('common.levels.advanced'), icon: TrendUp };
      case 'mixed': return { label: $t('common.levels.mixed'), icon: Shuffle };
      default: return { label: l, icon: Sparkle };
    }
  };
</script>

<svelte:head>
  <title>{$t('classes.new_title')} - ChessNet</title>
</svelte:head>

<form 
  method="POST" 
  action="?/create" 
  use:enhance
  class="min-h-screen bg-zinc-950"
>

  <!-- Premium Sticky Header -->
  <div class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
    <div class="max-w-[1400px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <button 
          type="button"
          onclick={() => goto('/panel/classes')}
          class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-primary-500/50 transition-all active:scale-95 group"
        >
          <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('classes.new_title')}</h1>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{$t('classes.new_subtitle')}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button 
          type="button"
          onclick={() => goto('/panel/classes')}
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-none text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          <X weight="bold" class="w-4 h-4" />
          {$t('common.cancel')}
        </button>
        <button 
          type="submit"
          disabled={$delayed}
          class="flex items-center gap-3 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-none text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary-600/20 active:scale-95 disabled:opacity-50 group"
        >
          {#if $delayed}
            <ArrowsClockwise weight="bold" class="w-4 h-4 animate-spin" />
          {:else}
            <FloppyDisk weight="bold" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          {/if}
          {$t('classes.create_btn')}
        </button>
      </div>
    </div>
  </div>

<div class="max-w-[1400px] mx-auto px-6 md:px-12 py-12" in:fade={{ duration: 300 }}>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
    
    <!-- Left: Form Sections (8 Columns) -->
    <div class="lg:col-span-8 space-y-10">
      
      <!-- General Academy Info -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-transparent opacity-100"></div>
        
        <div class="flex items-center gap-4 border-b border-white/5 pb-8 mb-10 relative z-10">
          <div class="w-14 h-14 bg-primary-600/20 border border-primary-500/30 rounded-none flex items-center justify-center text-primary-400 shadow-xl shadow-primary-500/10">
            <Sparkle size={24} weight="duotone" />
          </div>
          <div>
            <h2 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('classes.creation_label')}</h2>
            <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('classes.academy_direct')}</p>
          </div>
        </div>

        <div class="space-y-10 relative z-10">
          <!-- Class Name -->
          <div class="space-y-3">
            <label for="c-name" class="glass-label">{$t('classes.name_label')} <span class="text-primary-500">*</span></label>
            <div class="relative group">
               <ChalkboardTeacher weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
               <input 
                id="c-name"
                name="name"
                type="text" 
                bind:value={$form.name}
                required
                placeholder={$t('classes.name_placeholder')}
                class="glass-input pl-16 pr-8 w-full focus:ring-primary-500/20 focus:border-primary-500 bg-zinc-950/50 {$errors.name ? 'border-red-500/50 ring-red-500/20' : ''}"
                {...$constraints.name}
              />
            </div>
            {#if $errors.name}
              <p class="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{$errors.name}</p>
            {/if}
          </div>

          <!-- School Selection -->
          <div class="space-y-6">
            <input type="hidden" name="schoolId" bind:value={$form.schoolId} />
            <span class="glass-label">{$t('classes.school_label')}</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onclick={() => $form.schoolId = ''}
                class="selection-card {!$form.schoolId ? 'active' : ''}"
              >
                <div class="card-icon">
                  <Sparkle weight={!$form.schoolId ? "fill" : "duotone"} />
                </div>
                <div class="card-content">
                  <span class="card-title">{$t('classes.independent')}</span>
                  <p class="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">{$t('classes.academy_direct')}</p>
                </div>
                {#if !$form.schoolId}
                  <div class="card-check" in:scale>
                    <Check size={14} weight="bold" />
                  </div>
                {/if}
              </button>

              {#each schools as school}
                <button
                  type="button"
                  disabled={!!schoolIdFromUrl && schoolIdFromUrl !== school.id}
                  onclick={() => $form.schoolId = school.id}
                  class="selection-card {$form.schoolId === school.id ? 'active' : ''}"
                >
                  <div class="card-icon">
                    <Buildings weight={$form.schoolId === school.id ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{school.name}</span>
                    <p class="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">{school.city}</p>
                  </div>
                  {#if $form.schoolId === school.id}
                    <div class="card-check" in:scale>
                      <Check size={14} weight="bold" />
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
            {#if $errors.schoolId}
              <p class="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{$errors.schoolId}</p>
            {/if}
          </div>

          <!-- Description -->
          <div class="space-y-3">
            <label for="c-desc" class="glass-label">{$t('classes.description')}</label>
            <textarea 
              id="c-desc"
              name="description"
              bind:value={$form.description}
              placeholder={$t('classes.description_placeholder')}
              rows="4"
              class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50"
              {...$constraints.description}
            ></textarea>
          </div>
        </div>
      </section>

      <!-- Logistics & Config -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="flex items-center gap-4 border-b border-white/5 pb-8 mb-10">
          <div class="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-none flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
            <Clock size={24} weight="duotone" />
          </div>
          <div>
            <h2 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('classes.logistics_levels')}</h2>
            <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.scheduling')}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div class="space-y-3">
            <label for="c-schedule" class="glass-label">{$t('classes.schedule')} <span class="text-primary-500">*</span></label>
            <div class="relative group">
              <CalendarBlank weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
              <input 
                id="c-schedule"
                name="schedule"
                type="text" 
                bind:value={$form.schedule}
                required
                placeholder={$t('classes.schedule_placeholder')}
                class="glass-input pl-16 pr-8 w-full focus:ring-primary-500/20 focus:border-primary-500 bg-zinc-950/50 {$errors.schedule ? 'border-red-500/50 ring-red-500/20' : ''}"
                {...$constraints.schedule}
              />
            </div>
            {#if $errors.schedule}
              <p class="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{$errors.schedule}</p>
            {/if}
          </div>

          <div class="space-y-6">
            <input type="hidden" name="level" bind:value={$form.level} />
            <span class="glass-label">{$t('common.level')}</span>
            <div class="grid grid-cols-2 gap-4">
              {#each ['beginner', 'intermediate', 'advanced', 'mixed'] as level}
                {@const levelInfo = getLevelInfo(level)}
                <button
                  type="button"
                  onclick={() => $form.level = level as any}
                  class="selection-card small {$form.level === level ? 'active' : ''}"
                >
                  <div class="card-icon">
                    <levelInfo.icon weight={$form.level === level ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{levelInfo.label}</span>
                  </div>
                  {#if $form.level === level}
                    <div class="card-check" in:scale>
                      <Check size={12} weight="bold" />
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
          
          <div class="space-y-3">
            <label for="c-max" class="glass-label">{$t('classes.max_students')}</label>
            <div class="relative group">
                <UsersThree weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                <input 
                  id="c-max"
                  name="maxStudents"
                  type="number" 
                  bind:value={$form.maxStudents}
                  class="glass-input pl-16 pr-8 w-full focus:ring-primary-500/20 focus:border-primary-500 bg-zinc-950/50 font-bold"
                  {...$constraints.maxStudents}
                />
            </div>
          </div>

          <div class="space-y-3">
            <label for="c-price" class="glass-label">{$t('classes.fee')}</label>
            <div class="relative group">
                <Coins weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                <input 
                  id="c-price"
                  name="price"
                  type="number" 
                  bind:value={$form.price}
                  class="glass-input pl-16 pr-8 w-full focus:ring-primary-500/20 focus:border-primary-500 bg-zinc-950/50 text-primary-400 font-black"
                  {...$constraints.price}
                />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Right: Sticky Sidebar (4 Columns) -->
    <div class="lg:col-span-4">
      <div class="sticky top-32 space-y-8">
        
        <!-- Premium Preview Card -->
        <div class="bento-card !p-8 relative group overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-primary-500/10 rounded-none blur-3xl group-hover:bg-primary-500/20 transition-all duration-700"></div>
          
          <div class="flex items-center justify-between mb-8">
            <div class="flex flex-col">
              <h3 class="text-xs font-outfit font-black text-primary-400 uppercase tracking-[0.2em] mb-1">{$t('classes.live_showcase')}</h3>
              <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{$t('classes.status.active')}</p>
            </div>
            <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-none flex items-center justify-center text-primary-400 shadow-lg">
              <Sparkle weight="bold" class="w-6 h-6" />
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-zinc-950/50 p-6 rounded-none border border-white/5 shadow-inner">
              <h4 class="text-2xl font-outfit font-black text-white leading-tight uppercase truncate tracking-tighter italic">
                {$form.name || $t('classes.fallback_name')}
              </h4>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div class="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-none">
                <div class="flex items-center gap-3">
                  <Clock weight="duotone" class="w-5 h-5 text-primary-400" />
                  <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('classes.schedule')}</span>
                </div>
                <span class="text-[10px] font-bold text-white uppercase text-right truncate max-w-[120px]">
                  {$form.schedule || $t('classes.flexible_schedule')}
                </span>
              </div>
              <div class="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-none">
                <div class="flex items-center gap-3">
                  <GraduationCap weight="duotone" class="w-5 h-5 text-primary-400" />
                  <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('common.level')}</span>
                </div>
                <span class="text-[10px] font-bold text-primary-400 uppercase">{getLevelInfo($form.level).label}</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-none">
                <div class="flex items-center gap-3">
                  <UsersThree weight="duotone" class="w-5 h-5 text-primary-400" />
                  <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('classes.capacity')}</span>
                </div>
                <span class="text-[10px] font-bold text-zinc-200 uppercase">{$form.maxStudents} {$t('classes.students_short')}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Guidance -->
        <div class="bento-card !p-8 bg-primary-500/5 border border-primary-500/20 shadow-none">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <Lightbulb size={24} weight="duotone" class="text-primary-400" />
              <h3 class="text-xs font-outfit font-bold text-primary-200 uppercase tracking-widest">{$t('classes.guidance_title')}</h3>
            </div>
            
            <div class="space-y-4">
              <p class="text-[11px] text-zinc-400 leading-relaxed font-outfit font-bold uppercase tracking-tight">
                {@html $t('classes.guidance_clarity_desc')}
              </p>
              <p class="text-[11px] text-zinc-400 leading-relaxed font-outfit font-bold uppercase tracking-tight">
                {@html $t('classes.guidance_sync_desc')}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Panel -->
        <div class="bento-card !p-8 relative overflow-hidden bg-primary-600/5 border-primary-500/20">
          <button 
            onclick={() => goto('/panel/classes')}
            class="w-full h-14 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white flex items-center justify-center rounded-none text-[11px] font-black transition-all active:scale-95 uppercase tracking-widest gap-3"
          >
            <ArrowArcLeft weight="bold" class="w-4 h-4" />
            {$t('common.cancel')}
          </button>
        </div>

      </div>
      </div>
    </div>
  </div>
</form>

<style>
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 0;
  }
</style>

