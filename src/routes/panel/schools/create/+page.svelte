<script lang="ts">
  import { untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { showToast } from '$lib/stores/toast';
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
    SealCheck,
    CurrencyEur
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { schoolSchema } from '$lib/schemas/school';

  let { data } = $props<{ data: PageData }>();
  // svelte-ignore state_referenced_locally
  let { form: dataForm } = data;

  const { form, errors, enhance, delayed, message, tainted } = superForm(dataForm, {
    validators: zod(schoolSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        showToast.success(form.message || $t('schools.create_success'));
        goto('/panel/schools');
      } else if (form.message) {
        showToast.error(form.message);
      }
    }
  });

  let searchQuery = $state('');
  let isSelectOpen = $state(false);
  let customCountry = $state('');

  const countries = [
    { id: 'espana', code: 'ES', icon: MapPin },
    { id: 'andorra', code: 'AD', icon: Globe },
    { id: 'mexico', code: 'MX', icon: Buildings },
    { id: 'argentina', code: 'AR', icon: Buildings },
    { id: 'colombia', code: 'CO', icon: Globe },
    { id: 'usa', code: 'US', icon: Buildings },
    { id: 'chile', code: 'CL', icon: MapPin },
    { id: 'peru', code: 'PE', icon: MapPin },
    { id: 'others', code: '?', icon: Globe }
  ];

  let filteredCountries = $derived(
    countries.filter(c => 
      $t(`countries.${c.id}`).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  $effect(() => {
    if ($form.country === 'others') {
      // Logic for custom country if needed
    }
  });
</script>

<svelte:head>
  <title>{$t('schools.new_title')} - ChessNet</title>
</svelte:head>

<form method="POST" action="?/create" use:enhance class="contents">
  <!-- Premium Sticky Header -->
  <header class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
    <div class="max-w-[1400px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <button 
          type="button"
          onclick={() => goto('/panel/schools')}
          class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-all active:scale-95 group"
        >
          <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('schools.new_title')}</h1>
            {#if $tainted}
              <span class="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest animate-pulse">{$t('common.unsaved_changes')}</span>
            {/if}
          </div>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{$t('schools.new_subtitle')}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button 
          type="button"
          onclick={() => goto('/panel/schools')}
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-none text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          <X weight="bold" class="w-4 h-4" />
          {$t('common.cancel')}
        </button>
        <button 
          type="submit"
          disabled={$delayed}
          class="flex items-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 group"
        >
          {#if $delayed}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin"></div>
          {:else}
            <FloppyDisk weight="bold" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          {/if}
          {$delayed ? $t('common.saving') : $t('schools.add_btn')}
        </button>
      </div>
    </div>
  </header>

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
                  name="name"
                  type="text"
                  bind:value={$form.name}
                  placeholder={$t('schools.form.name_placeholder')}
                  class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                />
              </div>
              {#if $errors.name}
                <p class="text-[10px] text-red-400 font-bold mt-2 ml-1 uppercase tracking-widest">{$errors.name}</p>
              {/if}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-3">
                <label for="city" class="glass-label">{$t('schools.form.city_label')}</label>
                <div class="relative group">
                  <NavigationArrow weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  <input
                    id="city"
                    name="city"
                    type="text"
                    bind:value={$form.city}
                    placeholder={$t('schools.form.city_placeholder')}
                    class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                  />
                </div>
              </div>

              <div class="space-y-3">
                <label for="phone" class="glass-label">{$t('common.phone')}</label>
                <div class="relative group">
                  <IdentificationBadge weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    bind:value={$form.phone}
                    placeholder="600 000 000"
                    class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-6 pt-6 border-t border-white/5">
              <label for="country-search" class="glass-label">{$t('schools.form.country_label')}</label>
              
              <div class="relative">
                <input type="hidden" name="country" bind:value={$form.country} />
                <!-- Custom Searchable Select -->
                <div class="relative group">
                  <Globe weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none z-10" />
                  <button
                    type="button"
                    onclick={() => isSelectOpen = !isSelectOpen}
                    class="glass-input pl-16 pr-12 w-full flex items-center justify-between text-left focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50 min-h-[64px]"
                  >
                    <span class={$form.country ? 'text-white' : 'text-zinc-500'}>
                      {$form.country ? ($form.country === 'others' ? (customCountry || $t('countries.others')) : $t(`countries.${$form.country}`)) : $t('countries.select')}
                    </span>
                    <CaretLeft weight="bold" class="w-4 h-4 transition-transform {isSelectOpen ? '-rotate-90' : 'rotate-0'}" />
                  </button>

                  {#if isSelectOpen}
                    <div 
                      class="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 shadow-2xl z-[150] overflow-hidden max-h-80 flex flex-col"
                      transition:fly={{ y: -10, duration: 200 }}
                    >
                      <div class="p-4 border-b border-white/5 bg-zinc-950/50">
                        <input
                          type="text"
                          bind:value={searchQuery}
                          placeholder={$t('countries.search_placeholder')}
                          class="w-full bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest text-emerald-400 placeholder:text-zinc-700"
                          id="country-search"
                          onkeydown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                      </div>
                      <div class="overflow-y-auto custom-scrollbar">
                        {#each filteredCountries as c}
                          <button
                            type="button"
                            class="w-full flex items-center justify-between px-6 py-4 hover:bg-emerald-600/10 transition-colors group/item {$form.country === c.id ? 'bg-emerald-600/20' : ''}"
                            onclick={() => {
                                $form.country = c.id;
                                if (c.id !== 'others') customCountry = '';
                                isSelectOpen = false;
                                searchQuery = '';
                              }}
                          >
                            <div class="flex items-center gap-4">
                              <div class="w-8 h-8 flex items-center justify-center {$form.country === c.id ? 'text-emerald-400' : 'text-zinc-600 group-hover/item:text-emerald-500'} transition-colors">
                                <c.icon weight={$form.country === c.id ? "fill" : "duotone"} size={20} />
                              </div>
                              <span class="text-sm font-bold uppercase tracking-tight {$form.country === c.id ? 'text-emerald-400' : 'text-zinc-400 group-hover/item:text-white'}">
                                {$t(`countries.${c.id}`)}
                              </span>
                            </div>
                            {#if $form.country === c.id}
                              <Check size={16} weight="bold" class="text-emerald-500" />
                            {/if}
                          </button>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>

                {#if $form.country === 'others'}
                  <div class="pt-6" transition:fly={{ y: 10, duration: 200 }}>
                    <div class="relative group">
                      <Sparkle weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                      <input
                        type="text"
                        bind:value={customCountry}
                        placeholder={$t('countries.select')}
                        class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                      />
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
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
              <button type="button" class="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-white transition-colors pt-2 group">
                {$t('schools.help.link')}
                <ArrowRight weight="bold" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

<style lang="postcss">
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.3);
  }
</style>




