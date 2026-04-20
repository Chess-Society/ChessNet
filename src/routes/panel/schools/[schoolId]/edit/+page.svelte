<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
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
    Browser
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { showToast, showError } from '$lib/stores/toast';

  let { data } = $props<{ data: PageData }>();

  const schoolData = $derived(data.school as any);

  let formData = $state({
    name: '',
    city: '',
    country: 'espana',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  onMount(() => {
    if (schoolData) {
      formData = {
        name: schoolData.name || '',
        city: schoolData.city || '',
        country: schoolData.country || 'espana',
        address: schoolData.address || '',
        phone: schoolData.phone || '',
        email: schoolData.email || '',
        website: schoolData.website || ''
      };
    }
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = $t('schools.form.name_required');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = $t('schools.form.invalid_email');
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      isSubmitting = true;
      const response = await fetch(`/api/schools/${schoolData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Update error');
      }

      showToast.success($t('schools.toast_success'));
      await invalidateAll();
      setTimeout(() => {
        goto(`/panel/schools/${schoolData.id}`);
      }, 400);
    } catch (error) {
      showError(error as Error);
    } finally {
      isSubmitting = false;
    }
  };

  const countries = [
    { id: 'espana', label: 'countries.espana', icon: MapPin },
    { id: 'andorra', label: 'countries.andorra', icon: Globe },
    { id: 'mexico', label: 'countries.mexico', icon: Buildings },
    { id: 'argentina', label: 'countries.argentina', icon: Buildings }
  ];
</script>

<svelte:head>
  <title>{$t('schools.edit_title')} - {schoolData?.name || 'School'}</title>
</svelte:head>

<!-- Premium Sticky Header -->
<div class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
  <div class="max-w-[1400px] mx-auto flex items-center justify-between">
    <div class="flex items-center gap-6">
      <button 
        onclick={() => goto(`/panel/schools/${schoolData?.id}`)}
        class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-all active:scale-95 group"
      >
        <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </button>
      <div>
        <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('schools.edit_title')}</h1>
        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{formData.name || '...'}</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button 
        onclick={() => goto(`/panel/schools/${schoolData?.id}`)}
        class="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-none text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
      >
        <X weight="bold" class="w-4 h-4" />
        {$t('common.cancel')}
      </button>
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting}
        class="flex items-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 group"
      >
        {#if isSubmitting}
          <CircleNotch weight="bold" class="w-4 h-4 animate-spin" />
        {:else}
          <FloppyDisk weight="bold" class="w-4 h-4 group-hover:scale-110 transition-transform" />
        {/if}
        {$t('common.save')}
      </button>
    </div>
  </div>
</div>

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
                type="text"
                bind:value={formData.name}
                class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
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
                  bind:value={formData.city}
                  class="glass-input pl-16 pr-8 w-full focus:ring-emerald-500/20 focus:border-emerald-500 bg-zinc-950/50"
                />
              </div>
            </div>
            <div class="space-y-6">
              <span class="glass-label">{$t('schools.form.country_label')}</span>
              <div class="grid grid-cols-2 gap-3">
                {#each countries as c}
                  <button
                    type="button"
                    onclick={() => formData.country = c.id}
                    class="selection-card small {formData.country === c.id ? 'active' : ''}"
                  >
                    <div class="card-icon">
                      <c.icon weight={formData.country === c.id ? "fill" : "duotone"} />
                    </div>
                    <div class="card-content">
                      <span class="card-title">{$t(c.label)}</span>
                    </div>
                    {#if formData.country === c.id}
                      <div class="card-check" in:scale>
                        <Check size={12} weight="bold" />
                      </div>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-6 border-t border-white/5">
            <label for="address" class="glass-label">{$t('schools.form.address_label')}</label>
            <div class="relative group">
              <MapPin weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
              <input
                id="address"
                type="text"
                bind:value={formData.address}
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
                type="tel"
                bind:value={formData.phone}
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
                type="email"
                bind:value={formData.email}
                class="glass-input pl-16 pr-8 w-full focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-950/50"
              />
            </div>
          </div>
          <div class="md:col-span-2 space-y-3">
            <label for="website" class="glass-label">{$t('schools.form.website_label')}</label>
            <div class="relative group">
              <Browser weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <input
                id="website"
                type="url"
                bind:value={formData.website}
                class="glass-input pl-16 pr-8 w-full focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-950/50"
              />
            </div>
          </div>
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
              <div class="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-none flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
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



