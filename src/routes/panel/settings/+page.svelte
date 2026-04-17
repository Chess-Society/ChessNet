<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { 
    Gear, 
    User as UserIcon, 
    Bell, 
    Shield, 
    CreditCard, 
    At,
    Camera,
    Check,
    FloppyDisk,
    Sparkle,
    Lock,
    Medal
  } from 'phosphor-svelte';
  import { INSIGNIAS } from '$lib/constants/insignias';
  import { t } from '$lib/i18n';
  import { appStore } from '$lib/stores/appStore';
  import { auth } from '$lib/firebase';

  let config = $state({
    teacherName: $appStore.settings.teacherName || auth.currentUser?.displayName || '',
    teacherAvatar: $appStore.settings.teacherAvatar || auth.currentUser?.photoURL || '',
    teacherEmail: $appStore.settings.teacherEmail || auth.currentUser?.email || '',
    featuredInsignias: [...($appStore.settings.featuredInsignias || [])],
    notifications: true,
    theme: 'dark'
  });

  let saved = $state(false);

  // Derived: Unlocked insignias
  const stats = $derived({
    studentsCount: $appStore.students.length,
    classesCount: $appStore.classes.length,
    schoolsCount: $appStore.schools.length,
    completedTournamentsCount: $appStore.localTournaments.filter(t => t.status === 'completed').length
  });

  const availableInsignias = $derived(
    INSIGNIAS.filter(insignia => {
      // Manual/Special insignias
      if (insignia.type === 'special') {
        return $appStore.unlockedInsignias.some(a => a.id === insignia.id);
      }
      // Automatic insignias
      return insignia.condition ? insignia.condition(stats) : false;
    })
  );

  const toggleInsignia = (id: string) => {
    if (config.featuredInsignias.includes(id)) {
      config.featuredInsignias = config.featuredInsignias.filter(i => i !== id);
    } else if (config.featuredInsignias.length < 3) {
      config.featuredInsignias = [...config.featuredInsignias, id];
    }
  };

  const handleSave = () => {
    appStore.updateSettings({
      teacherName: config.teacherName,
      teacherAvatar: config.teacherAvatar,
      teacherEmail: config.teacherEmail,
      featuredInsignias: config.featuredInsignias
    });
    saved = true;
    setTimeout(() => saved = false, 3000);
  };

</script>

<svelte:head>
  <title>{$t('settings.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-8" transition:fade>
  
  <div class="flex items-center gap-4 mb-12">
    <div class="w-14 h-14 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-500 shadow-xl shadow-violet-500/5">
      <Gear weight="duotone" class="w-8 h-8" />
    </div>
    <div>
      <h1 class="text-3xl font-outfit font-extrabold text-white tracking-tight">{$t('settings.title')}</h1>
      <p class="text-slate-400 font-plus-jakarta text-sm">{$t('settings.subtitle')}</p>
    </div>
  </div>

  <div class="space-y-8">
      <!-- Profile Section -->
      <div class="bento-card p-10">
          <h2 class="text-xl font-outfit font-bold text-white mb-10 flex items-center gap-3">
              <UserIcon weight="duotone" class="w-6 h-6 text-violet-500" />
              {$t('settings.profile_title')}
          </h2>

          <div class="flex flex-col md:flex-row gap-12 items-start">
              <div class="relative group">
                  <div class="w-28 h-28 rounded-full bg-zinc-950 border-2 border-white/5 flex items-center justify-center text-slate-700 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-105">
                      {#if config.teacherAvatar}
                          <img src={config.teacherAvatar} alt="Avatar" class="w-full h-full object-cover" />
                      {:else}
                          <UserIcon weight="duotone" class="w-12 h-12" />
                      {/if}
                      <div class="absolute inset-0 bg-violet-600/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera weight="bold" class="w-8 h-8 text-white" />
                      </div>
                  </div>
              </div>

              <div class="flex-grow space-y-8 w-full">
                  <div class="space-y-3">
                      <label for="public-name" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{$t('settings.public_name')}</label>
                      <input 
                        id="public-name"
                        type="text" 
                        bind:value={config.teacherName}
                        placeholder="e.g. GM Academy"
                        class="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-violet-500/50 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                      />
                  </div>

                  <div class="space-y-3">
                      <label for="public-email" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{$t('settings.contact_email')}</label>
                      <div class="relative">
                        <At weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input 
                          id="public-email"
                          type="email" 
                          bind:value={config.teacherEmail}
                          placeholder="contact@academy.com"
                          class="w-full bg-zinc-950/30 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-400 cursor-not-allowed outline-none transition-all placeholder:text-slate-700"
                          disabled
                        />
                      </div>
                      <p class="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5 ml-1 pt-1">
                        <Lock weight="bold" class="w-3 h-3" />
                        {$t('settings.email_lock_desc')}
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <!-- Subscription Section -->
      <div class="bento-card p-10">
          <h2 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
              <CreditCard weight="duotone" class="w-6 h-6 text-violet-500" />
              {$t('settings.subscription_title')}
          </h2>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-zinc-950/50 border border-white/5 rounded-3xl shadow-inner group">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-500">
                  <Sparkle weight="duotone" class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1">{$t('settings.current_level')}</p>
                    <p class="text-white font-outfit font-black text-xl uppercase tracking-tight">{$t('settings.plan_prefix')} {$appStore.settings.plan || 'Free'}</p>
                </div>
              </div>
              <a href="/panel/upgrade" class="btn-pill bg-white text-black py-3 px-8 text-xs font-outfit font-black uppercase tracking-widest shadow-xl hover:bg-zinc-200 inline-flex items-center gap-2 group">
                  {$t('settings.manage_btn')}
                  <Gear weight="bold" class="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
              </a>
          </div>
      </div>

      <!-- Featured Insignias Section -->
      <div class="bento-card p-10">
          <h2 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
              <Medal weight="duotone" class="w-6 h-6 text-violet-500" />
              {$t('settings.featured_insignias_title')}
          </h2>
          <p class="text-xs text-slate-500 mb-8 max-w-lg leading-relaxed">
              {$t('settings.featured_insignias_desc')}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {#each availableInsignias as insignia}
                  {@const isFeatured = config.featuredInsignias.includes(insignia.id)}
                  {@const Icon = insignia.icon}
                  <button 
                    onclick={() => toggleInsignia(insignia.id)}
                    class="relative group p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center
                    {isFeatured 
                      ? 'bg-violet-600/10 border-violet-500/40 shadow-lg shadow-violet-500/10' 
                      : 'bg-zinc-950/40 border-white/5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-white/10'}"
                  >
                      <div class="w-12 h-12 bg-black/60 rounded-xl flex items-center justify-center {insignia.color}">
                          <Icon weight={isFeatured ? 'duotone' : 'regular'} class="w-7 h-7" />
                      </div>
                      <p class="text-[10px] font-black uppercase tracking-tight line-clamp-1">{$t(insignia.titleKey)}</p>
                      
                      {#if isFeatured}
                        <div class="absolute -top-2 -right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center border-2 border-[#1e293b] shadow-lg" transition:scale>
                          <Check weight="bold" class="w-3 h-3 text-white" />
                        </div>
                      {/if}
                  </button>
              {/each}
          </div>
          
          {#if availableInsignias.length === 0}
            <div class="p-8 text-center border border-dashed border-white/5 rounded-2xl bg-black/20">
                <p class="text-xs text-slate-500 italic">{$t('settings.no_insignias')} <a href="/panel/achievements" class="text-violet-400 hover:underline">{$t('settings.insignia_hub_link')}</a></p>
            </div>
          {/if}
      </div>

      <!-- Security Section -->
      <div class="bento-card p-10">
          <h2 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
              <Shield weight="duotone" class="w-6 h-6 text-violet-500" />
              {$t('settings.security_title')}
          </h2>
          
          <div class="space-y-4">
              <div class="flex items-center justify-between p-6 bg-zinc-950/30 rounded-2xl border border-white/5">
                  <div class="max-w-md">
                      <p class="text-sm font-outfit font-bold text-white mb-1">{$t('settings.smart_sync')}</p>
                      <p class="text-[11px] text-slate-500 font-plus-jakarta leading-relaxed">{$t('settings.smart_sync_desc')}</p>
                  </div>
                  <div class="w-12 h-7 bg-violet-600 rounded-full relative shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-violet-400/20">
                      <div class="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg"></div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Floating Save Bar -->
      <div class="sticky bottom-8 flex justify-center z-50 pt-10 pointer-events-none">
          <button 
            onclick={handleSave}
            class="btn-pill bg-violet-600 hover:bg-violet-500 text-white font-outfit font-black px-10 py-5 shadow-violet-flare flex items-center gap-3 transition-all hover:scale-105 active:scale-95 pointer-events-auto"
          >
            {#if saved}
              <Check weight="bold" class="w-5 h-5" />
              {$t('common.synced')}
            {:else}
              <FloppyDisk weight="duotone" class="w-5 h-5" />
              {$t('common.save_changes')}
            {/if}
          </button>
      </div>
  </div>
</div>
