<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { showError, showToast } from '$lib/stores/toast';
  import { appStore } from '$lib/stores/appStore';
  import { 
    CaretLeft, 
    Buildings, 
    MapPin, 
    Globe, 
    Sparkle, 
    X, 
    Check,
    Info,
    ArrowRight,
    FloppyDisk,
    Lightbulb,
    ArrowLeft,
    IdentificationBadge,
    NavigationArrow,
    SealCheck
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';

  let { data } = $props<{ data: PageData }>();

  let name = $state('');
  let city = $state('');
  let country = $state('espana');
  let isCreating = $state(false);

  const countries = [
    { id: 'espana', code: 'ES', icon: MapPin },
    { id: 'andorra', code: 'AD', icon: Globe },
    { id: 'mexico', code: 'MX', icon: Buildings },
    { id: 'argentina', code: 'AR', icon: Buildings }
  ];

  async function createSchool() {
    if (!name.trim()) {
      showToast.error($t('schools.form.name_required'));
      return;
    }

    try {
      isCreating = true;
      const newSchool = await appStore.addSchool({
        name: name.trim(),
        city: city.trim() || null,
        country: country
      });

      showToast.success($t('schools.create_success'));
      await invalidateAll();
      await new Promise(resolve => setTimeout(resolve, 400));
      await goto(`/panel/schools/${newSchool.id}`);

    } catch (error: any) {
      showError(error, $t('schools.create_error'));
    } finally {
      isCreating = false;
    }
  }
</script>

<svelte:head>
  <title>{$t('schools.new_title')} - ChessNet</title>
</svelte:head>

<!-- Premium Sticky Header -->
<div class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
  <div class="max-w-[1400px] mx-auto flex items-center justify-between">
    <div class="flex items-center gap-6">
      <button 
        onclick={() => goto('/panel/schools')}
        class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-all active:scale-95 group"
      >
        <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </button>
      <div>
        <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('schools.new_title')}</h1>
        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{$t('schools.new_subtitle')}</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button 
        onclick={() => goto('/panel/schools')}
        class="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-none text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
      >
        <X weight="bold" class="w-4 h-4" />
        {$t('common.cancel')}
      </button>
      <button 
        onclick={createSchool}
        disabled={isCreating || !name.trim()}
        class="flex items-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 group"
      >
        {#if isCreating}
          <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin"></div>
        {:else}
          <FloppyDisk weight="bold" class="w-4 h-4 group-hover:scale-110 transition-transform" />
        {/if}
        {isCreating ? $t('common.saving') : $t('schools.add_btn')}
      </button>
    </div>
  </div>
</div>

<div class="max-w-[1400px] mx-auto px-6 md:px-12 py-12" in:fade={{ duration: 300 }}>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
    
    <!-- Left: Form Sections (8 Columns) -->
    <div class="lg:col-span-8 space-y-10">
      
      <!-- Section: General Info -->
      <section class="bento-card !p-10 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent opacity-100"></div>
        
        <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-emerald-600/20 border border-emerald-500/30 rounded-none flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
            <Buildings weight="duotone" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('schools.sections.general')}</h3>
            <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('schools.identity_desc')}</p>
          </div>
        </div>

        <div class="space-y-10 relative z-10">
          <div class="space-y-3">
            <label for="name" class="glass-label">{$t('schools.form.name_label')} <span class="text-emerald-500">*</span></label>
            <div class="relative group">
              <IdentificationBadge weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
              <input
                id="name"
                type="text"
                bind:value={name}
                placeholder={$t('schools.form.name_placeholder')}
                class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-3">
              <label for="city" class="glass-label">{$t('schools.form.city_label')}</label>
              <div class="relative group">
                <NavigationArrow weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                <input
                  id="city"
                  type="text"
                  bind:value={city}
                  placeholder={$t('schools.form.city_placeholder')}
                  class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                />
              </div>
            </div>
          </div>

          <div class="space-y-6 pt-6 border-t border-white/5">
            <span class="glass-label">{$t('schools.form.country_label')}</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {#each countries as c}
                <button
                  class="selection-card small {country === c.id ? 'active' : ''}"
                  onclick={() => country = c.id}
                >
                  <div class="card-icon">
                    <c.icon weight={country === c.id ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{$t(`countries.${c.id}`)}</span>
                  </div>
                  {#if country === c.id}
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

      <!-- Advanced Config (Placeholder for parity) -->
      <section class="bento-card !p-10 relative overflow-hidden group opacity-60">
         <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
          <div class="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-none flex items-center justify-center text-zinc-500">
            <Sparkle weight="duotone" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight opacity-50">{$t('common.advanced_settings')}</h3>
            <p class="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('schools.advanced_desc')}</p>
          </div>
        </div>
        <p class="text-[11px] text-zinc-500 font-bold uppercase tracking-widest italic leading-relaxed text-center py-8">
           {$t('schools.advanced_coming_soon')}
        </p>
      </section>
    </div>

    <!-- Right: Sticky Sidebar (4 Columns) -->
    <div class="lg:col-span-4">
      <div class="sticky top-32 space-y-8">
        
        <!-- Guide Panel -->
        <div class="bento-card !p-8 overflow-hidden relative group">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-amber-600/10 rounded-none blur-3xl"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-8">
              <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-4 py-2 rounded-none border border-zinc-800 shadow-inner">
                {$t('schools.guide.title')}
              </span>
              <div class="w-12 h-12 bg-amber-600/20 border border-amber-500/30 rounded-none flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10">
                <Lightbulb weight="duotone" class="w-6 h-6" />
              </div>
            </div>

            <div class="space-y-6">
              {#each [
                { text: $t('schools.guide.step1'), color: 'bg-emerald-500' },
                { text: $t('schools.guide.step2'), color: 'bg-blue-500' },
                { text: $t('schools.guide.step3'), color: 'bg-amber-500' },
                { text: $t('schools.guide.step4'), color: 'bg-violet-500' }
              ] as step}
                <div class="flex items-start gap-4">
                  <div class={`mt-1.5 w-1.5 h-1.5 rounded-none ${step.color} flex-shrink-0 shadow-lg`}></div>
                  <p class="text-[11px] text-zinc-400 leading-relaxed font-bold uppercase tracking-tighter">{step.text}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Help Card -->
        <div class="bento-card !p-8 relative overflow-hidden bg-emerald-600/5 border-emerald-500/20">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <Info weight="duotone" class="w-5 h-5 text-emerald-400" />
              <h3 class="text-[10px] font-black text-emerald-200 uppercase tracking-widest">{$t('schools.help.title')}</h3>
            </div>
            <p class="text-[11px] text-zinc-500 leading-relaxed font-bold italic uppercase tracking-tighter">
              {$t('schools.help.text')}
            </p>
            <button class="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-white transition-colors pt-2 group">
              {$t('schools.help.link')}
              <ArrowRight weight="bold" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>




