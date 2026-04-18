<script lang="ts">
  import { untrack } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
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

  $effect(() => {
    formData.name = data.class.name;
    formData.school_id = data.class.school_id || '';
    formData.level = data.class.level || 'beginner';
    formData.schedule = data.class.schedule || '';
    formData.max_students = data.class.max_students || 15;
    formData.price = data.class.price || 0;
    formData.description = data.class.description || '';
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const schools = $derived(data.schools || []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = $t('classes.name_required');
    if (!formData.schedule.trim()) newErrors.schedule = $t('classes.schedule_required') || 'Schedule is required';
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast.error($t('common.error_form') || 'Check the fields');
      return;
    }

    try {
      isSubmitting = true;
      const response = await fetch(`/api/classes/${data.class.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Error updating class');
      }

      showToast.success($t('classes.update_success'));
      await invalidateAll();
      setTimeout(() => {
        goto(`/panel/classes/${data.class.id}`);
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
  <title>{$t('classes.edit_title')} - {formData.name}</title>
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
        onclick={() => goto(`/panel/classes/${data.class.id}`)}
        class="flex items-center gap-3 text-slate-500 hover:text-primary-400 transition-all group text-[10px] font-black uppercase tracking-[0.4em] font-outfit"
      >
        <CaretLeft weight="bold" class="transition-transform group-hover:-translate-x-2" />
        {$t('classes.view_details')}
      </button>

      <div class="flex items-center gap-10">
        <div class="relative group">
          <div class="absolute -inset-4 bg-primary-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100"></div>
          <div class="w-24 h-24 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.25rem] flex items-center justify-center text-primary-400 shadow-2xl relative z-10 overflow-hidden group-hover:border-primary-500/50 transition-colors">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent"></div>
            <Layout size={44} weight="duotone" class="group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
              <span class="text-[10px] font-black text-primary-400 uppercase tracking-widest font-outfit">
                {$t('common.edit') || 'Modification'}
              </span>
            </div>
            <span class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] font-outfit">ID: {data.class.id.slice(0, 8)}</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-outfit font-black text-white tracking-tighter uppercase leading-none">
            {data.class.name}
          </h1>
          <p class="text-slate-400 font-jakarta text-xl font-medium tracking-tight mt-4 opacity-80 max-w-xl">
            {$t('classes.edit_subtitle')}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-[2.5rem] border border-white/5 backdrop-blur-2xl shadow-2xl">
      <button 
        onclick={() => goto(`/panel/classes/${data.class.id}`)}
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
          <span class="relative z-10">{$t('common.save_changes')}</span>
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
                  placeholder="e.g. Mon & Wed 17:00"
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
              placeholder={$t('classes.description_placeholder') || 'Enter class goals, requirements, etc.'}
            ></textarea>
          </div>
        </div>
      </div>

       <!-- Quick Stats Preview -->
       <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="bento-card p-8 bg-zinc-900/60 border border-white/5 rounded-3xl group hover:border-primary-500/20 transition-all duration-500">
             <div class="flex items-center justify-between mb-4">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrollment status</p>
                <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-emerald"></div>
             </div>
             <p class="text-2xl font-outfit font-black text-white">{data.class.students_count || 0} / {formData.max_students}</p>
             <div class="mt-4 h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                <div class="h-full bg-primary-500 transition-all duration-1000" style="width: {((data.class.students_count || 0) / formData.max_students) * 100}%"></div>
             </div>
          </div>

          <div class="bento-card p-8 bg-zinc-900/60 border border-white/5 rounded-3xl group hover:border-blue-500/20 transition-all duration-500">
             <div class="flex items-center justify-between mb-4">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly projected</p>
                <CurrencyEur size={20} weight="duotone" class="text-blue-500" />
             </div>
             <p class="text-2xl font-outfit font-black text-white">{(data.class.students_count || 0) * formData.price}<span class="text-xs ml-1 text-slate-500">{$t('common.currency_symbol')}</span></p>
             <p class="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-2">Based on current students</p>
          </div>

          <div class="bento-card p-8 bg-zinc-900/60 border border-white/5 rounded-3xl group hover:border-amber-500/20 transition-all duration-500">
             <div class="flex items-center justify-between mb-4">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Course Progress</p>
                <GraduationCap size={20} weight="duotone" class="text-amber-500" />
             </div>
             <p class="text-2xl font-outfit font-black text-white">{data.class.skills_count || 0} <span class="text-xs ml-1 text-slate-500">Skills defined</span></p>
             <p class="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-2">Syllabus coverage</p>
          </div>
       </div>
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
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 opacity-60">Update Protocol</p>
          </div>
        </div>

        <div class="space-y-12">
          <div class="space-y-5 group">
            <div class="flex items-center gap-4">
              <div class="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-glow-primary transition-all group-hover:scale-150 duration-500"></div>
              <h4 class="text-[12px] font-black text-white uppercase tracking-[0.1em] font-outfit group-hover:text-primary-300 transition-colors">Safety warning</h4>
            </div>
            <p class="text-[14px] text-slate-400 font-jakarta font-medium leading-relaxed pl-6 border-l border-white/10 group-hover:border-primary-500/40 transition-all duration-500">
              Updating the class fee or the schedule will automatically notify any students registered if system notifications are enabled.
            </p>
          </div>

          <div class="space-y-5 group">
            <div class="flex items-center gap-4">
              <div class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-glow-blue transition-all group-hover:scale-150 duration-500"></div>
              <h4 class="text-[12px] font-black text-white uppercase tracking-[0.1em] font-outfit group-hover:text-blue-300 transition-colors">Integrity sync</h4>
            </div>
            <p class="text-[14px] text-slate-400 font-jakarta font-medium leading-relaxed pl-6 border-l border-white/10 group-hover:border-blue-500/40 transition-all duration-500">
              Changes to the school association will preserve all student enrollments and historical records.
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

       <button 
        onclick={() => goto(`/panel/classes/${data.class.id}`)}
        class="w-full bento-card p-10 rounded-[4rem] border border-white/5 bg-zinc-900/20 flex items-center justify-between group hover:bg-white/5 transition-all duration-700 overflow-hidden relative"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-6 relative z-10">
          <div class="w-16 h-16 rounded-[1.75rem] bg-zinc-950 flex items-center justify-center text-slate-500 group-hover:text-primary-400 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-1000 border border-white/5 shadow-inner">
             <ArrowCircleUpRight size={32} />
          </div>
          <div class="text-left">
            <p class="text-[11px] font-black text-white uppercase tracking-[0.2em] font-outfit">Discard Changes</p>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60 italic">Rollback Protocol</p>
          </div>
        </div>
        <CaretDown weight="bold" size={20} class="text-slate-700 group-hover:text-white transition-colors relative z-10 -rotate-90" />
      </button>
    </div>
  </div>
</div>

<style lang="postcss">
  .shadow-glow-blue { box-shadow: 0 0 20px -5px rgba(59, 130, 246, 0.4); }
  .shadow-glow-emerald { box-shadow: 0 0 20px -5px rgba(16, 185, 129, 0.5); }
</style>
