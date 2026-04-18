<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
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
    Lightbulb
  } from 'phosphor-svelte';
  import { showToast, showError } from '$lib/stores/toast';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { cubicOut } from 'svelte/easing';

  let { data } = $props<{ data: PageData }>();

  let formData = $state({
    name: '',
    school_id: '',
    level: 'beginner',
    schedule: '',
    max_students: 15,
    price: 0,
    description: ''
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const schools = $derived(data.schools || []);
  
  const schoolIdFromUrl = $derived($page.url.searchParams.get('schoolId'));
  const isPreSelectedSchool = $derived(!!schoolIdFromUrl);
  
  $effect(() => {
    if (schoolIdFromUrl && schools.length > 0) {
      const schoolExists = (schools as any[]).find(s => s.id === schoolIdFromUrl);
      if (schoolExists) formData.school_id = schoolIdFromUrl;
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = $t('classes.name_required');
    if (!formData.schedule.trim()) newErrors.schedule = $t('classes.schedule_required');
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast.error($t('common.error_form'));
      return;
    }

    try {
      isSubmitting = true;
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Error');
      }

      showToast.success($t('classes.create_success'));
      await invalidateAll();
      setTimeout(() => {
        goto('/panel/classes');
      }, 400);

    } catch (error) {
      showError(error);
    } finally {
      isSubmitting = false;
    }
  };

  const getSchoolName = (schoolId: string) => {
    return (schools as any[]).find(s => s.id === schoolId)?.name || '';
  };
</script>

<svelte:head>
  <title>{$t('classes.new_title')} - ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto px-6 pb-24" in:fade>
  <!-- Ambient Background -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary-500/5 rounded-full blur-[120px] animate-pulse"></div>
  </div>

  <!-- Header Section -->
  <div class="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 pt-16">
    <div class="space-y-8">
      <button 
        onclick={() => goto('/panel/classes')}
        class="flex items-center gap-3 text-slate-500 hover:text-primary-400 transition-all group text-[10px] font-black uppercase tracking-[0.4em] font-outfit"
      >
        <CaretLeft weight="bold" class="transition-transform group-hover:-translate-x-2" />
        {$t('classes.back_to_list')}
      </button>

      <div class="flex items-center gap-10">
        <div class="relative group">
          <div class="absolute -inset-4 bg-primary-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100"></div>
          <div class="w-24 h-24 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.25rem] flex items-center justify-center text-primary-400 shadow-2xl relative z-10 overflow-hidden group-hover:border-primary-500/50 transition-colors">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent"></div>
            <PlusCircle size={44} weight="duotone" class="group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
              <span class="text-[10px] font-black text-primary-400 uppercase tracking-widest font-outfit">
                {$t('classes.creation_label')}
              </span>
            </div>
          </div>
          <h1 class="text-5xl md:text-6xl font-outfit font-black text-white tracking-tighter uppercase leading-none">
            {$t('classes.new_title')}
          </h1>
          <p class="text-slate-400 font-jakarta text-xl font-medium tracking-tight mt-4 opacity-80 max-w-xl">
            {$t('classes.new_subtitle')}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-[2.5rem] border border-white/5 backdrop-blur-2xl shadow-2xl">
      <button 
        onclick={() => goto('/panel/classes')}
        class="px-10 py-4.5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all font-outfit hover:bg-white/5"
        disabled={isSubmitting}
      >
        {$t('common.cancel')}
      </button>
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting}
        class="bg-white text-black px-12 py-4.5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 active:scale-95 disabled:opacity-50 font-outfit group overflow-hidden relative"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {#if isSubmitting}
          <div class="relative z-10 animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
          <span class="relative z-10">{$t('common.saving')}</span>
        {:else}
          <FloppyDisk weight="duotone" size={22} class="relative z-10" />
          <span class="relative z-10">{$t('classes.create_btn')}</span>
        {/if}
      </button>
    </div>
  </div>

  <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
    <!-- Main Form Column -->
    <div class="lg:col-span-8 space-y-12">
      <div class="bento-card p-12 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5)] rounded-[3.5rem] relative overflow-hidden">
        <div class="absolute -right-32 -top-32 w-80 h-80 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div class="absolute -left-32 -bottom-32 w-80 h-80 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div class="flex flex-col gap-12 relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <!-- Name Field -->
            <div class="space-y-4">
              <label for="name" class="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-outfit transition-colors group-focus-within:text-primary-400">
                <Selection size={18} weight="bold" class="text-primary-500" />
                {$t('classes.name_label')}
              </label>
              <div class="relative group">
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  placeholder={$t('classes.name_placeholder')}
                  class="w-full bg-zinc-950/60 border border-white/5 rounded-[1.75rem] px-8 py-6 text-white font-bold font-jakarta text-xl focus:border-primary-500/50 outline-none transition-all placeholder:text-zinc-800 shadow-inner group-hover:border-white/10 {errors.name ? 'border-red-500/40' : ''}"
                />
                {#if errors.name}
                  <p class="text-[10px] text-red-500 font-black mt-3 ml-2 uppercase tracking-widest" in:fly={{ y: -5 }}>{errors.name}</p>
                {/if}
              </div>
            </div>

            <!-- School Selection -->
            <div class="space-y-4">
              <label for="school" class="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-outfit">
                <Buildings size={18} weight="bold" class="text-blue-500" />
                {$t('classes.school_label')}
              </label>
              {#if isPreSelectedSchool}
                <div class="w-full bg-primary-600/10 border border-primary-500/20 rounded-[1.75rem] px-8 py-[1.375rem] flex items-center justify-between shadow-inner group backdrop-blur-md">
                  <div class="flex items-center gap-5">
                    <div class="p-2.5 bg-primary-600/20 rounded-xl border border-primary-500/30">
                      <Buildings weight="duotone" size={24} class="text-primary-400" />
                    </div>
                    <span class="text-white font-black uppercase text-sm font-jakarta tracking-tighter">{getSchoolName(formData.school_id)}</span>
                  </div>
                  <CheckCircle size={22} weight="fill" class="text-primary-400 shadow-glow-primary" />
                </div>
              {:else}
                <div class="relative group">
                  <select 
                    id="school"
                    bind:value={formData.school_id}
                    class="w-full bg-zinc-950/60 border border-white/5 rounded-[1.75rem] px-8 py-6 text-white focus:border-primary-500/50 transition-all appearance-none cursor-pointer text-sm font-black font-jakarta uppercase tracking-[0.25em] shadow-inner group-hover:border-white/10"
                  >
                    <option value="" class="bg-zinc-950">{$t('classes.independent')}</option>
                    {#each schools as school}
                      <option value={school.id} class="bg-zinc-950">{school.name}</option>
                    {/each}
                  </select>
                  <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-primary-400 transition-colors">
                    <CaretDown weight="bold" size={18} />
                  </div>
                </div>
              {/if}
            </div>

            <!-- Level -->
            <div class="space-y-4">
              <label for="level" class="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-outfit">
                <Target size={18} weight="bold" class="text-emerald-500" />
                {$t('common.level')}
              </label>
              <div class="relative group">
                <select 
                  id="level"
                  bind:value={formData.level}
                  class="w-full bg-zinc-950/60 border border-white/5 rounded-[1.75rem] px-8 py-6 text-white focus:border-primary-500/50 transition-all appearance-none cursor-pointer text-sm font-black font-jakarta uppercase tracking-[0.25em] shadow-inner group-hover:border-white/10"
                >
                  <option value="beginner" class="bg-zinc-950">{$t('common.levels.beginner')}</option>
                  <option value="intermediate" class="bg-zinc-950">{$t('common.levels.intermediate')}</option>
                  <option value="advanced" class="bg-zinc-950">{$t('common.levels.advanced')}</option>
                  <option value="mixed" class="bg-zinc-950">{$t('common.levels.mixed')}</option>
                </select>
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-primary-400 transition-colors">
                  <CaretDown weight="bold" size={18} />
                </div>
              </div>
            </div>

            <!-- Fee / Price -->
            <div class="space-y-4">
              <label for="price" class="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-outfit">
                <CurrencyEur size={18} weight="bold" class="text-amber-500" />
                {$t('classes.fee')}
              </label>
              <div class="relative group">
                <input
                  id="price"
                  type="number"
                  bind:value={formData.price}
                  class="w-full bg-zinc-950/60 border border-white/5 rounded-[1.75rem] px-8 py-6 text-emerald-400 font-black font-outfit text-2xl focus:border-primary-500/50 outline-none transition-all shadow-inner group-hover:border-white/10"
                />
                <div class="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600 font-black text-xs uppercase tracking-[0.3em] backdrop-blur-md bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">{$t('common.currency_symbol')}</div>
              </div>
            </div>

            <!-- Schedule -->
            <div class="space-y-4">
              <label for="schedule" class="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-outfit">
                <Clock size={18} weight="bold" class="text-primary-500" />
                {$t('classes.schedule')}
              </label>
              <div class="relative group">
                <input
                  id="schedule"
                  type="text"
                  bind:value={formData.schedule}
                  placeholder={$t('classes.schedule_placeholder')}
                  class="w-full bg-zinc-950/60 border border-white/5 rounded-[1.75rem] px-8 py-6 text-white font-bold font-jakarta text-base focus:border-primary-500/50 outline-none transition-all placeholder:text-zinc-800 shadow-inner group-hover:border-white/10 {errors.schedule ? 'border-red-500/40' : ''}"
                />
                {#if errors.schedule}
                  <p class="text-[10px] text-red-500 font-black mt-3 ml-2 uppercase tracking-widest" in:fly={{ y: -5 }}>{errors.schedule}</p>
                {/if}
              </div>
            </div>

            <!-- Capacity -->
            <div class="space-y-4">
              <label for="max_students" class="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-outfit">
                <UsersThree size={18} weight="bold" class="text-blue-500" />
                {$t('classes.max_students')}
              </label>
              <div class="relative group">
                <input
                  id="max_students"
                  type="number"
                  bind:value={formData.max_students}
                  class="w-full bg-zinc-950/60 border border-white/5 rounded-[1.75rem] px-8 py-6 text-white font-black font-outfit text-2xl focus:border-primary-500/50 outline-none transition-all shadow-inner group-hover:border-white/10"
                />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-4 pt-6">
            <label for="description" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-outfit">{$t('classes.description')}</label>
            <textarea
              id="description"
              bind:value={formData.description}
              rows="5"
              class="w-full bg-zinc-950/60 border border-white/5 rounded-[2.5rem] px-10 py-8 text-white font-medium font-jakarta focus:border-primary-500/50 outline-none transition-all placeholder:text-zinc-800 resize-none text-lg shadow-inner group-hover:border-white/10"
              placeholder={$t('classes.description_placeholder')}
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      {#if formData.name}
        <div class="relative group" transition:fly={{ y: 50, duration: 1000, easing: cubicOut }}>
          <div class="absolute -inset-2 bg-gradient-to-r from-primary-600/20 via-blue-600/20 to-teal-600/20 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition-all duration-1000 scale-95 group-hover:scale-100"></div>
          <div class="bento-card relative z-10 p-12 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
             <!-- Background Decal -->
             <div class="absolute -right-24 -bottom-24 text-white/[0.02] group-hover:text-primary-600/[0.05] transition-colors duration-1000 rotate-12 scale-150 pointer-events-none">
               <GraduationCap weight="fill" size={400} />
             </div>

             <div class="flex flex-col xl:flex-row gap-16 items-start relative z-10">
                <div class="w-40 h-40 bg-zinc-950 border border-white/10 rounded-[3rem] flex items-center justify-center text-primary-400 shadow-[inset_0_5px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:border-primary-500/40 transition-all duration-700 relative overflow-hidden group/art">
                   <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent group-hover/art:scale-150 transition-transform duration-1000"></div>
                   <GraduationCap size={80} weight="duotone" class="relative z-10 group-hover:rotate-12 transition-transform" />
                </div>

                <div class="flex-1 space-y-8">
                   <div>
                     <div class="flex items-center gap-4 mb-5">
                       <span class="px-4 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] backdrop-blur-md shadow-glow-primary/20">{$t('classes.live_showcase')}</span>
                       <div class="h-px flex-1 bg-gradient-to-r from-primary-500/20 to-transparent"></div>
                     </div>
                     <h2 class="text-6xl font-outfit font-black text-white uppercase tracking-tighter leading-[0.9] group-hover:text-primary-400 transition-colors duration-700">{formData.name}</h2>
                   </div>

                   <div class="flex flex-wrap gap-5">
                      <div class="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl backdrop-blur-xl group/chip hover:bg-white/10 transition-colors">
                        <Buildings size={22} weight="duotone" class="text-blue-500 group-hover/chip:scale-110 transition-transform" />
                        <span class="text-[11px] font-black text-white uppercase tracking-[0.2em]">{formData.school_id ? getSchoolName(formData.school_id) : $t('classes.independent')}</span>
                      </div>
                      <div class="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl backdrop-blur-xl group/chip hover:bg-white/10 transition-colors">
                        <Target size={22} weight="duotone" class="text-emerald-500 group-hover/chip:scale-110 transition-transform" />
                        <span class="text-[11px] font-black text-white uppercase tracking-[0.2em]">{$t(`common.levels.${formData.level}`)}</span>
                      </div>
                      {#if formData.schedule}
                        <div class="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl backdrop-blur-xl group/chip hover:bg-white/10 transition-colors">
                          <Clock size={22} weight="duotone" class="text-amber-500 group-hover/chip:scale-110 transition-transform" />
                          <span class="text-[11px] font-black text-white uppercase tracking-[0.2em]">{formData.schedule}</span>
                        </div>
                      {/if}
                   </div>
                </div>

                <!-- Price/Capacity Bubble -->
                <div class="w-full xl:w-56 p-10 bg-zinc-950/80 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center gap-8 shadow-[inset_0_5px_30px_rgba(0,0,0,0.6)] backdrop-blur-2xl group-hover:border-white/20 transition-colors">
                   <div class="text-center group/fee">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 group-hover/fee:text-emerald-400 transition-colors">{$t('classes.fee')}</p>
                      <p class="text-5xl font-outfit font-black text-emerald-400 leading-none tracking-tighter">{formData.price}<span class="text-base ml-1.5 text-slate-600 font-black">{$t('common.currency_symbol')}</span></p>
                   </div>
                   <div class="h-px w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                   <div class="text-center group/cap">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 group-hover/cap:text-white transition-colors">{$t('classes.max_students')}</p>
                      <p class="text-3xl font-outfit font-black text-white leading-none tracking-tighter">{formData.max_students}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Info Column -->
    <div class="lg:col-span-4 space-y-10">
      <div class="bento-card p-10 bg-zinc-900/30 backdrop-blur-3xl border border-white/5 rounded-[3rem] space-y-12 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-24 top-0 w-48 h-48 bg-primary-600/5 rounded-full blur-[80px]"></div>
        
        <div class="flex items-center gap-5 border-b border-white/10 pb-8">
          <div class="p-4 bg-primary-600/15 rounded-2xl border border-primary-500/30 text-primary-400 shadow-glow-primary/20">
            <Lightbulb size={28} weight="duotone" />
          </div>
          <div>
            <h3 class="text-sm font-black text-white uppercase tracking-[0.3em] font-outfit">{$t('classes.guidance_title')}</h3>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 opacity-60">{$t('classes.creation_protocol')}</p>
          </div>
        </div>

        <div class="space-y-12">
          <div class="space-y-5 group">
            <div class="flex items-center gap-4">
              <div class="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-glow-primary transition-all group-hover:scale-150 duration-500"></div>
              <h4 class="text-[12px] font-black text-white uppercase tracking-[0.1em] font-outfit group-hover:text-primary-300 transition-colors">{$t('classes.guidance_clarity_title')}</h4>
            </div>
            <p class="text-[14px] text-slate-400 font-jakarta font-medium leading-relaxed pl-6 border-l border-white/10 group-hover:border-primary-500/40 transition-all duration-500">
              {@html $t('classes.guidance_clarity_desc')}
            </p>
          </div>

          <div class="space-y-5 group">
            <div class="flex items-center gap-4">
              <div class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-glow-blue transition-all group-hover:scale-150 duration-500"></div>
              <h4 class="text-[12px] font-black text-white uppercase tracking-[0.1em] font-outfit group-hover:text-blue-300 transition-colors">{$t('classes.guidance_sync_title')}</h4>
            </div>
            <p class="text-[14px] text-slate-400 font-jakarta font-medium leading-relaxed pl-6 border-l border-white/10 group-hover:border-blue-500/40 transition-all duration-500">
              {$t('classes.guidance_sync_desc')}
            </p>
          </div>
        </div>

        <div class="pt-8 border-t border-white/10">
           <div class="p-8 bg-zinc-950/80 rounded-[2.25rem] border border-white/5 relative overflow-hidden group/help shadow-inner backdrop-blur-md hover:border-primary-500/20 transition-colors">
              <div class="absolute -right-6 -top-6 text-primary-600/10 rotate-12 transition-all duration-1000 group-hover/help:rotate-45 group-hover/help:scale-150">
                 <Sparkle size={100} weight="fill" />
              </div>
              <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 relative z-10 transition-colors group-hover/help:text-slate-400">{$t('classes.technical_doubts')}</p>
              <button class="text-primary-400 hover:text-white transition-all text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 group/btn relative z-10">
                {$t('classes.help_link')}
                <ArrowRight weight="bold" class="group-hover/btn:translate-x-3 transition-transform duration-500" />
              </button>
           </div>
        </div>
      </div>

      <div class="bento-card p-10 rounded-[3rem] border border-primary-500/20 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent flex items-center justify-between shadow-2xl group hover:border-primary-500/40 transition-all duration-700">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 rounded-2xl bg-primary-600/20 flex items-center justify-center text-primary-400 border border-primary-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-glow-primary/10">
              <CheckCircle weight="duotone" size={28} />
            </div>
            <div>
              <p class="text-[11px] font-black text-white uppercase tracking-[0.2em] font-outfit group-hover:text-primary-300 transition-colors">{$t('classes.protocols_active')}</p>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">{$t('classes.real_time_safety')}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-glow-emerald animate-pulse"></div>
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500/30"></div>
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500/10"></div>
          </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .shadow-glow-primary { box-shadow: 0 0 20px -5px rgba(16, 185, 129, 0.5); }
  .shadow-glow-blue { box-shadow: 0 0 20px -5px rgba(59, 130, 246, 0.4); }
  .shadow-glow-emerald { box-shadow: 0 0 20px -5px rgba(16, 185, 129, 0.5); }
</style>
