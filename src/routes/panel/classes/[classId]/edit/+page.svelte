<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ChalkboardTeacher,
    CaretLeft,
    FloppyDisk,
    X,
    Buildings,
    Sparkle,
    CheckCircle,
    Info,
    PlusCircle,
    ArrowRight,
    CaretDown,
    Warning,
    Plus,
    Target,
    Clock,
    CurrencyEur,
    UsersThree,
    Selection,
    GraduationCap,
    Lightbulb,
    Layout,
    ArrowCircleRight,
    ArrowCircleUpRight
  } from 'phosphor-svelte';
  import { toast } from '$lib/stores/toast';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { superForm } from 'sveltekit-superforms';
  import { zod4 as zod } from 'sveltekit-superforms/adapters';
  import { classSchema } from '$lib/schemas/class';

  let { data }: { data: any } = $props();

  const { form, errors, enhance, delayed, message, isTainted } = superForm(untrack(() => data.form) as any, {
    validators: zod(classSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success($t('classes.update_success'));
        setTimeout(() => goto(`/panel/classes/${data.class.id}`), 500);
      } else if (form.message) {
        toast.error(form.message);
      }
    }
  }) as any;

  const schools = $derived((data.schools as any[]) || []);

  const getLevelInfo = (level: string) => {
    switch(level) {
      case 'beginner': return { label: $t('common.levels.beginner'), color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
      case 'intermediate': return { label: $t('common.levels.intermediate'), color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'advanced': return { label: $t('common.levels.advanced'), color: 'text-amber-400', bg: 'bg-amber-500/10' };
      case 'mixed': return { label: $t('common.levels.mixed'), color: 'text-purple-400', bg: 'bg-purple-500/10' };
      default: return { label: level, color: 'text-zinc-400', bg: 'bg-zinc-500/10' };
    }
  };
</script>

<svelte:head>
  <title>{$t('classes.edit_title')} - {$form.name}</title>
</svelte:head>

<form method="POST" action="?/update" use:enhance class="contents">
  <div class="page-container" in:fade>
    <div class="glow-bg opacity-30"></div>

    <!-- Header -->
    <header class="main-header sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 py-6 mb-10 -mx-10 px-10">
      <div class="title-section">
        <button 
          type="button"
          onclick={() => goto(`/panel/classes/${data.class.id}`)}
          class="back-orb"
        >
          <CaretLeft size={24} weight="bold" />
        </button>
        
        <div class="flex items-center gap-6">
          <div class="header-icon !bg-primary-500/10 !border-primary-500/20 !text-primary-400">
            <Layout size={32} weight="bold" />
          </div>
          <div class="text-group">
            <div class="flex items-center gap-3 mb-1">
               <span class="text-[10px] font-black text-primary-400 uppercase tracking-widest font-outfit">{$t('common.edit')}</span>
               {#if isTainted}
                 <span class="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest animate-pulse">{$t('common.unsaved_changes')}</span>
               {/if}
               <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID: {data.class.id.slice(0, 8)}</span>
            </div>
            <h1 class="gradient-text font-outfit truncate max-w-[500px]">{$form.name}</h1>
            <p class="subtitle mt-1">{$t('classes.edit_subtitle')}</p>
          </div>
        </div>
      </div>

      <div class="action-section">
        <button 
          type="button"
          class="glass-btn secondary" 
          onclick={() => goto(`/panel/classes/${data.class.id}`)}
        >
          <X size={20} weight="bold" />
          <span class="font-outfit font-bold">{$t('common.cancel')}</span>
        </button>
        <button 
          type="submit"
          class="glass-btn primary" 
          disabled={$delayed}
        >
          {#if $delayed}
            <div class="animate-spin rounded-none h-5 w-5 border-2 border-white border-t-transparent"></div>
          {:else}
            <FloppyDisk size={20} weight="bold" />
          {/if}
          <span class="font-outfit font-bold">{$t('common.save_changes')}</span>
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <!-- Left: Form Sections -->
      <div class="lg:col-span-2 space-y-10">
        
        <!-- General Info -->
        <section class="bento-card !p-10 space-y-12">
          <div class="flex items-center gap-4 border-b border-white/5 pb-8">
            <Sparkle size={24} weight="duotone" class="text-primary-400" />
            <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight uppercase">{$t('classes.creation_label')}</h2>
          </div>

          <div class="space-y-10">
            <!-- Class Name -->
            <div class="space-y-4">
              <label for="name" class="glass-label">{$t('classes.name_label')} <span class="text-primary-500">*</span></label>
              <div class="input-wrapper">
                <input 
                  id="name"
                  name="name"
                  type="text" 
                  bind:value={$form.name}
                  placeholder={$t('classes.name_placeholder')}
                  class="glass-input {$errors.name ? 'border-red-500/50' : ''}"
                />
                {#if $errors.name}
                   <p class="text-[10px] text-red-400 font-bold mt-2 ml-1 uppercase tracking-widest">{$errors.name}</p>
                {/if}
              </div>
            </div>

            <!-- School Selection -->
            <div class="space-y-6">
              <input type="hidden" name="schoolId" bind:value={$form.schoolId} />
              <span class="glass-label">{$t('classes.school_label')}</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  type="button"
                  onclick={() => $form.schoolId = ''}
                  class="selection-card {$form.schoolId === '' ? 'active' : ''}"
                >
                  <div class="card-icon">
                    <Sparkle size={24} weight={$form.schoolId === '' ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <p class="card-title">{$t('classes.independent')}</p>
                    <p class="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">{$t('classes.academy_direct')}</p>
                  </div>
                  {#if $form.schoolId === ''}
                    <div class="card-check" in:scale>
                      <CheckCircle size={14} weight="fill" />
                    </div>
                  {/if}
                </button>

                {#each schools as school}
                  <button
                    type="button"
                    onclick={() => $form.schoolId = school.id}
                    class="selection-card {$form.schoolId === school.id ? 'active' : ''}"
                  >
                    <div class="card-icon">
                      <Buildings size={24} weight={$form.schoolId === school.id ? "fill" : "duotone"} />
                    </div>
                    <div class="card-content">
                      <p class="card-title">{school.name}</p>
                      <div class="flex items-center gap-2 mt-1">
                         <p class="text-[9px] font-bold opacity-40 uppercase tracking-widest">{school.city}</p>
                      </div>
                    </div>
                    {#if $form.schoolId === school.id}
                      <div class="card-check" in:scale>
                        <CheckCircle size={14} weight="fill" />
                      </div>
                    {/if}
                  </button>
                {/each}
              </div>
              {#if $errors.schoolId}
                <p class="text-[10px] text-red-400 font-bold mt-2 ml-1 uppercase tracking-widest">{$errors.schoolId}</p>
              {/if}
            </div>

            <!-- Description -->
            <div class="space-y-4">
              <label for="description" class="glass-label">{$t('classes.description')}</label>
              <div class="input-wrapper">
                <textarea 
                  id="description"
                  name="description"
                  bind:value={$form.description}
                  placeholder={$t('classes.description_placeholder')}
                  rows="4"
                  class="glass-input !py-5 resize-none h-auto"
                ></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- Logistics & Config -->
        <section class="bento-card !p-10 space-y-12">
          <div class="flex items-center gap-4 border-b border-white/5 pb-8">
            <Clock size={24} weight="duotone" class="text-primary-400" />
            <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight uppercase">{$t('classes.logistics_levels')}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-4">
              <label for="schedule" class="glass-label">{$t('classes.schedule')} <span class="text-primary-500">*</span></label>
              <div class="input-wrapper">
                <input 
                  id="schedule"
                  name="schedule"
                  type="text" 
                  bind:value={$form.schedule}
                  placeholder={$t('classes.schedule_placeholder')}
                  class="glass-input {$errors.schedule ? 'border-red-500/50' : ''}"
                />
                 {#if $errors.schedule}
                   <p class="text-[10px] text-red-400 font-bold mt-2 ml-1 uppercase tracking-widest">{$errors.schedule}</p>
                {/if}
              </div>
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
                    <div class="card-content items-center justify-center">
                      <p class="card-title text-center">{levelInfo.label}</p>
                    </div>
                    <div class="card-check">
                      <CheckCircle size={14} weight="fill" />
                    </div>
                  </button>
                {/each}
              </div>
            </div>
            
            <div class="space-y-4">
              <label for="maxStudents" class="glass-label">{$t('classes.max_students')}</label>
              <div class="input-wrapper">
                <input 
                  id="maxStudents"
                  name="maxStudents"
                  type="number" 
                  bind:value={$form.maxStudents}
                  class="glass-input font-bold"
                />
                {#if $errors.maxStudents}
                  <p class="text-[10px] text-red-400 font-bold mt-2 ml-1 uppercase tracking-widest">{$errors.maxStudents}</p>
                {/if}
              </div>
            </div>

            <div class="space-y-4">
              <label for="price" class="glass-label">{$t('classes.fee')}</label>
              <div class="input-wrapper">
                <input 
                  id="price"
                  name="price"
                  type="number" 
                  bind:value={$form.price}
                  class="glass-input text-primary-400 font-black"
                />
                {#if $errors.price}
                  <p class="text-[10px] text-red-400 font-bold mt-2 ml-1 uppercase tracking-widest">{$errors.price}</p>
                {/if}
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-1 space-y-8">
        <!-- Quick Stats -->
         <div class="grid grid-cols-1 gap-6">
            <div class="bento-card !p-8 bg-zinc-900/60 border border-white/5 rounded-none">
               <div class="flex items-center justify-between mb-4">
                  <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('classes.enrollment_status')}</p>
                  <UsersThree size={20} weight="duotone" class="text-primary-400" />
               </div>
               <p class="text-3xl font-outfit font-black text-white">{data.class.students_count || 0} / {$form.maxStudents}</p>
               <div class="mt-4 h-2 w-full bg-zinc-950 rounded-none overflow-hidden border border-white/5">
                  <div class="h-full bg-primary-500 transition-all duration-1000 shadow-[0_0_15px_rgba(139,92,246,0.5)]" style="width: {Math.min(100, ((data.class.students_count || 0) / $form.maxStudents) * 100)}%"></div>
               </div>
            </div>

            <div class="bento-card !p-8 bg-zinc-900/60 border border-white/5 rounded-none">
               <div class="flex items-center justify-between mb-4">
                  <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('classes.monthly_projected')}</p>
                  <CurrencyEur size={20} weight="duotone" class="text-primary-400" />
               </div>
               <p class="text-3xl font-outfit font-black text-white">{(data.class.students_count || 0) * $form.price}<span class="text-xs ml-2 text-zinc-500">{$t('common.currency_symbol')}</span></p>
               <p class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">{$t('classes.based_on_students')}</p>
            </div>
         </div>

         <!-- Protocol / Help -->
         <div class="bento-card !p-8 bg-primary-500/5 border border-primary-500/20">
            <div class="flex flex-col gap-6">
              <div class="flex items-center gap-3 border-b border-white/5 pb-6">
                <Lightbulb size={24} weight="duotone" class="text-primary-400" />
                <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">{$t('classes.guidance_title')}</h3>
              </div>
              
              <div class="space-y-6">
                <div class="space-y-2">
                   <h4 class="text-[10px] font-black text-primary-200 uppercase tracking-widest">{$t('classes.safety_warning')}</h4>
                   <p class="text-[12px] text-zinc-400 leading-relaxed font-jakarta">{$t('classes.safety_warning_desc')}</p>
                </div>
                <div class="space-y-2">
                   <h4 class="text-[10px] font-black text-primary-200 uppercase tracking-widest">{$t('classes.integrity_sync')}</h4>
                   <p class="text-[12px] text-zinc-400 leading-relaxed font-jakarta">{$t('classes.integrity_sync_desc')}</p>
                </div>
              </div>

              <button type="button" class="flex items-center gap-2 text-[11px] font-black text-primary-400 uppercase tracking-widest hover:text-white transition-colors mt-4">
                {$t('classes.help_link')}
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
         </div>

         <!-- Danger Zone -->
         <button 
          type="button"
          onclick={() => goto(`/panel/classes/${data.class.id}`)}
          class="w-full bento-card !p-8 rounded-none border border-white/5 bg-zinc-950/50 flex items-center justify-between group hover:bg-white/5 transition-all duration-300"
        >
          <div class="flex items-center gap-5">
            <div class="w-12 h-12 rounded-none bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-primary-400 transition-colors border border-white/5 shadow-inner">
               <ArrowCircleUpRight size={24} />
            </div>
            <div class="text-left">
              <p class="text-[11px] font-black text-white uppercase tracking-widest">{$t('classes.discard_changes')}</p>
              <p class="text-[9px] font-bold text-zinc-600 uppercase mt-0.5">{$t('classes.rollback_protocol')}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</form>

<style lang="postcss">
  .page-container {
    padding: 2.5rem;
    max-width: 1400px;
    margin: 0 auto;
    min-height: calc(100vh - 80px);
    position: relative;
    z-index: 10;
  }

  .glow-bg {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
    height: 60vh;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(0,0,0,0) 70%);
    pointer-events: none;
    z-index: -1;
  }

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .back-orb {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  .back-orb:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
    transform: translateX(-4px);
    border-color: rgba(255,255,255,0.2);
  }

  .header-icon {
    width: 64px;
    height: 64px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 0px;
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
    background: linear-gradient(135deg, #fff 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: #94a3b8;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .action-section {
    display: flex;
    gap: 1.25rem;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  @media (max-width: 1024px) {
    .main-header { flex-direction: column; align-items: flex-start; }
    .gradient-text { font-size: 2.25rem; }
    .action-section { width: 100%; margin-top: 2rem; }
  }

  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
  }
  textarea::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.2);
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.4);
  }
</style>
