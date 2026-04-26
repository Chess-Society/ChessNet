<script lang="ts">
  import { untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    CaretLeft,
    FloppyDisk,
    X,
    Buildings,
    Phone,
    EnvelopeSimple,
    MapPin,
    Globe,
    House,
    CheckCircle,
    PencilLine,
    CircleNotch,
    Sparkle,
    ArrowRight,
    Lightbulb,
    Info,
    WarningCircle,
    Check,
    ArrowLeft,
    IdentificationBadge,
    NavigationArrow,
    Browser,
    Users,
    CurrencyEur
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { showToast } from '$lib/stores/toast';
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { schoolSchema } from '$lib/schemas/school';

  let { data } = $props<{ data: PageData }>();

  const { form, errors, enhance, delayed, message, isTainted } = superForm(data.form, {
    validators: zod(schoolSchema),
    onUpdated({ form }) {
      if (form.valid) {
        showToast.success($t('schools.toast_success'));
        setTimeout(() => goto(`/panel/schools/${data.school.id}`), 400);
      } else if (form.message) {
        showToast.error(form.message);
      }
    }
  });

  const schoolData = $derived(data.school);
  let newDirectorEmail = $state('');
  let isResolvingEmail = $state(false);

  const addDirector = async () => {
    if (!newDirectorEmail) return;
    try {
      isResolvingEmail = true;
      const res = await fetch(`/api/users/resolve-email?email=${encodeURIComponent(newDirectorEmail)}`);
      if (!res.ok) throw new Error('Usuario no encontrado o error de servidor');
      const user = await res.json();
      
      if ($form.sharedWith.includes(user.uid)) {
        showToast.error('Este director ya tiene acceso');
      } else {
        $form.sharedWith = [...$form.sharedWith, user.uid];
        newDirectorEmail = '';
        showToast.success('Director añadido correctamente');
      }
    } catch (e: any) {
      showToast.error(e.message);
    } finally {
      isResolvingEmail = false;
    }
  };

  const removeDirector = (uid: string) => {
    $form.sharedWith = $form.sharedWith.filter(id => id !== uid);
    showToast.success('Acceso revocado');
  };

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

  // Initialize custom country if current country isn't in the quick list
  $effect(() => {
    const isQuick = countries.some(c => c.id === $form.country);
    if (!isQuick && $form.country) {
      customCountry = $form.country;
      $form.country = 'others';
    }
  });
</script>

<svelte:head>
  <title>{$t('schools.edit_title')} - {schoolData?.name || 'School'}</title>
</svelte:head>

<form method="POST" action="?/update" use:enhance class="contents">
  <!-- Premium Sticky Header -->
  <header class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
    <div class="max-w-[1400px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <button 
          type="button"
          onclick={() => goto(`/panel/schools/${schoolData?.id}`)}
          class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-all active:scale-95 group"
        >
          <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('schools.edit_title')}</h1>
            {#if isTainted()}
              <span class="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest animate-pulse">{$t('common.unsaved_changes')}</span>
            {/if}
          </div>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{$form.name || '...'}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button 
          type="button"
          onclick={() => goto(`/panel/schools/${schoolData?.id}`)}
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
            <CircleNotch weight="bold" class="w-4 h-4 animate-spin" />
          {:else}
            <FloppyDisk weight="bold" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          {/if}
          {$t('common.save')}
        </button>
      </div>
    </div>
  </header>

  <div class="max-w-[1400px] mx-auto px-6 md:px-12 py-12" in:fade={{ duration: 300 }}>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <!-- Left: Form Sections (8 Columns) -->
      <div class="lg:col-span-8 space-y-10">
        
        <!-- Section: Identity -->
        <section class="bento-card !p-10 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent opacity-100"></div>
          
          <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
            <div class="w-14 h-14 bg-emerald-600/20 border border-emerald-500/30 rounded-none flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <Buildings weight="duotone" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('schools.sections.general')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('schools.edit_subtitle')}</p>
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
                    class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                  />
                </div>
              </div>
              <div class="space-y-6">
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

            <div class="space-y-3 pt-6 border-t border-white/5">
              <label for="address" class="glass-label">{$t('schools.form.address_label')}</label>
              <div class="relative group">
                <MapPin weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  bind:value={$form.address}
                  class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Section: Contact -->
        <section class="bento-card !p-10 relative overflow-hidden group">
          <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
            <div class="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-none flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/10">
              <EnvelopeSimple weight="duotone" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('actions.messages.title')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('schools.contact_desc')}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div class="space-y-3">
              <label for="phone" class="glass-label">{$t('schools.form.phone_label')}</label>
              <div class="relative group">
                <Phone weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  bind:value={$form.phone}
                  class="glass-input pl-16 pr-8 w-full focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-950/50"
                />
              </div>
            </div>
            <div class="space-y-3">
              <label for="email" class="glass-label">{$t('schools.form.email_label')}</label>
              <div class="relative group">
                <EnvelopeSimple weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  bind:value={$form.email}
                  class="glass-input pl-16 pr-8 w-full focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-950/50"
                />
              </div>
              {#if $errors.email}
                <p class="text-[10px] text-red-400 font-bold mt-2 ml-1 uppercase tracking-widest">{$errors.email}</p>
              {/if}
            </div>
            <div class="md:col-span-2 space-y-3">
              <label for="website" class="glass-label">{$t('schools.form.website_label')}</label>
              <div class="relative group">
                <Browser weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                <input
                  id="website"
                  name="website"
                  type="url"
                  bind:value={$form.website}
                  class="glass-input pl-16 pr-8 w-full focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-950/50"
                />
              </div>
              {#if $errors.website}
                <p class="text-[10px] text-red-400 font-bold mt-2 ml-1 uppercase tracking-widest">{$errors.website}</p>
              {/if}
            </div>
          </div>
        </section>

        <!-- Section: Director Access (Sharing) -->
        <section class="bento-card !p-10 relative overflow-hidden group border-violet-500/10">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100"></div>
          
          <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
            <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
              <Users weight="duotone" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('schools.access_directors.title')}</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('schools.access_directors.desc')}</p>
            </div>
          </div>

          <div class="space-y-8 relative z-10">
            <div class="space-y-4">
              <p class="text-xs text-zinc-400 font-jakarta leading-relaxed">
                {$t('schools.access_directors.help')}
              </p>
              
              <div class="flex gap-3">
                <div class="relative flex-1 group">
                  <EnvelopeSimple weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    placeholder={$t('schools.access_directors.placeholder')}
                    bind:value={newDirectorEmail}
                    class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
                    onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addDirector())}
                  />
                </div>
                <button 
                  type="button"
                  onclick={addDirector}
                  disabled={!newDirectorEmail || isResolvingEmail}
                  class="px-8 bg-violet-600 hover:bg-violet-500 text-white font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {isResolvingEmail ? '...' : $t('schools.access_directors.add_btn')}
                </button>
              </div>
            </div>

            {#if $form.sharedWith && $form.sharedWith.length > 0}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each $form.sharedWith as uid}
                  <div class="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-none group/item">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-violet-500/20 flex items-center justify-center text-violet-400 font-black text-[10px]">
                        {uid.substring(0, 2).toUpperCase()}
                      </div>
                      <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-widest truncate max-w-[120px]">{uid}</span>
                    </div>
                    <button 
                      type="button"
                      onclick={() => removeDirector(uid)}
                      class="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X weight="bold" size={14} />
                    </button>
                  </div>
                  <!-- Hidden inputs for array binding in Superforms -->
                  <input type="hidden" name="sharedWith" value={uid} />
                {/each}
              </div>
            {:else}
              <div class="p-8 border border-dashed border-white/5 text-center">
                <p class="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic">{$t('schools.access_directors.empty')}</p>
              </div>
            {/if}
          </div>
        </section>

        <!-- Advanced Config (Social/Economy) -->
        <section class="bento-card !p-10 relative overflow-hidden group">
          <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
            <div class="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-none flex items-center justify-center text-zinc-500">
              <Sparkle weight="duotone" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('common.advanced_settings')}</h3>
              <p class="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('schools.advanced_desc')}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <label class="flex items-center justify-between p-6 bg-zinc-950/50 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
              <div class="flex items-center gap-4">
                <Globe size={24} weight="duotone" class="text-primary-400" />
                <div class="flex flex-col">
                  <span class="text-xs font-black text-white uppercase tracking-widest">{$t('common.social_system')}</span>
                  <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{$t('common.public_profile')}</span>
                </div>
              </div>
              <input type="checkbox" name="socialEnabled" bind:checked={$form.socialEnabled} class="hidden" />
              <div class="w-10 h-6 bg-zinc-800 border border-white/10 relative transition-colors {$form.socialEnabled ? 'bg-primary-500/20 border-primary-500/50' : ''}">
                <div class="absolute top-1 left-1 w-4 h-4 bg-zinc-600 transition-all {$form.socialEnabled ? 'left-5 bg-primary-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]' : ''}"></div>
              </div>
            </label>

            <label class="flex items-center justify-between p-6 bg-zinc-950/50 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
              <div class="flex items-center gap-4">
                <CurrencyEur size={24} weight="duotone" class="text-emerald-400" />
                <div class="flex flex-col">
                  <span class="text-xs font-black text-white uppercase tracking-widest">{$t('common.economy_system')}</span>
                  <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{$t('common.virtual_currency')}</span>
                </div>
              </div>
              <input type="checkbox" name="economyEnabled" bind:checked={$form.economyEnabled} class="hidden" />
              <div class="w-10 h-6 bg-zinc-800 border border-white/10 relative transition-colors {$form.economyEnabled ? 'bg-emerald-500/20 border-emerald-500/50' : ''}">
                <div class="absolute top-1 left-1 w-4 h-4 bg-zinc-600 transition-all {$form.economyEnabled ? 'left-5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''}"></div>
              </div>
            </label>
          </div>
        </section>
      </div>

      <!-- Right: Sticky Sidebar (4 Columns) -->
      <div class="lg:col-span-4">
        <div class="sticky top-32 space-y-8">
          
          <!-- Status Panel -->
          <div class="bento-card !p-8 overflow-hidden relative group">
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-600/10 rounded-none blur-3xl"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-8">
                <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-4 py-2 rounded-none border border-zinc-800 shadow-inner">
                  {$t('schools.status.title')}
                </span>
                <div class="w-12 h-12 bg-emerald-600/20 border border-amber-500/30 rounded-none flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10">
                  <CheckCircle weight="duotone" class="w-6 h-6" />
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                  <span class="text-[10px] font-black text-zinc-500 uppercase">ID</span>
                  <span class="text-[10px] font-bold text-white font-mono">{schoolData?.id.split('-')[0].toUpperCase()}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                  <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('schools.status.last_change')}</span>
                  <span class="text-[10px] font-bold text-emerald-400 uppercase">{$t('schools.status.just_now')}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Help Panel -->
          <div class="bento-card !p-8 relative overflow-hidden bg-emerald-600/5 border-emerald-500/20">
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <Lightbulb weight="duotone" class="w-5 h-5 text-emerald-400" />
                <h3 class="text-[10px] font-black text-emerald-200 uppercase tracking-widest">{$t('schools.guide.title')}</h3>
              </div>
              <p class="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tighter italic">
                {$t('schools.letterhead.text')}
              </p>
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



