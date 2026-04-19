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
  import InsigniaBadge from '$lib/components/ui/InsigniaBadge.svelte';

  let config = $state({
    teacherName: $appStore.settings.teacherName || auth.currentUser?.displayName || '',
    teacherAvatar: $appStore.settings.teacherAvatar || auth.currentUser?.photoURL || '',
    teacherEmail: $appStore.settings.teacherEmail || auth.currentUser?.email || '',
    featuredInsignias: [...($appStore.settings.featuredInsignias || [])],
    notifications: true,
    theme: $t('common.theme_dark')
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
    INSIGNIAS.filter(insignia => 
      $appStore.unlockedAchievements.some(a => a.id === insignia.id)
    )
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

<div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8" transition:fade>
  
  <div class="flex items-center gap-4 mb-8 sm:mb-12">
    <div class="w-12 h-12 sm:w-14 sm:h-14 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-500 shadow-xl shadow-violet-500/5">
      <Gear weight="duotone" class="w-6 h-6 sm:w-8 sm:h-8" />
    </div>
    <div>
      <h1 class="text-2xl sm:text-3xl font-outfit font-extrabold text-white tracking-tight">{$t('settings.title')}</h1>
      <p class="text-slate-400 font-plus-jakarta text-[11px] sm:text-sm">{$t('settings.subtitle')}</p>
    </div>
  </div>

  <div class="space-y-8">
      <!-- Profile Section -->
      <div class="bento-card p-6 sm:p-10">
          <h2 class="text-lg sm:text-xl font-outfit font-bold text-white mb-6 sm:mb-10 flex items-center gap-3">
              <UserIcon weight="duotone" class="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />
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
                        placeholder={$t('settings.public_name_placeholder')}
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
                          placeholder={$t('settings.contact_email_placeholder')}
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
      <div class="bento-card p-6 sm:p-10">
          <h2 class="text-lg sm:text-xl font-outfit font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
              <CreditCard weight="duotone" class="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />
              {$t('settings.subscription_title')}
          </h2>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 bg-zinc-950/50 border border-white/5 rounded-3xl shadow-inner group">
              <div class="flex items-center gap-5">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-500 shrink-0">
                  <Sparkle weight="duotone" class="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                    <p class="text-[9px] sm:text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1">{$t('settings.current_level')}</p>
                    <p class="text-white font-outfit font-black text-lg sm:text-xl uppercase tracking-tight">{$t('settings.plan_prefix')} {$appStore.settings.plan || $t('settings.plan_free')}</p>
                </div>
              </div>
              <a href="/panel/upgrade" class="btn-pill bg-white text-black py-2.5 sm:py-3 px-6 sm:px-8 text-[10px] sm:text-xs font-outfit font-black uppercase tracking-widest shadow-xl hover:bg-zinc-200 inline-flex items-center justify-center gap-2 group">
                  {$t('settings.manage_btn')}
                  <Gear weight="bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-500" />
              </a>
          </div>
      </div>

      <!-- Featured Insignias Section -->
      <div class="bento-card p-6 sm:p-10">
          <h2 class="text-lg sm:text-xl font-outfit font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
              <Medal weight="duotone" class="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />
              {$t('settings.featured_insignias_title')}
          </h2>
          <p class="text-[11px] sm:text-xs text-slate-500 mb-6 sm:mb-8 max-w-lg leading-relaxed">
              {$t('settings.featured_insignias_desc')}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {#each availableInsignias as insignia}
                  {@const isFeatured = config.featuredInsignias.includes(insignia.id)}
                  <button 
                    onclick={() => toggleInsignia(insignia.id)}
                    class="relative transition-all hover:scale-105 active:scale-95"
                    aria-label="Toggle featured insignia"
                  >
                      <InsigniaBadge {insignia} unlocked={true} size="md" />
                      
                      {#if isFeatured}
                        <div class="absolute -top-1 -right-1 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center border-4 border-[#09090b] shadow-xl z-20" transition:scale>
                          <Check weight="bold" class="w-4 h-4 text-white" />
                        </div>
                      {/if}

                      {#if !isFeatured && config.featuredInsignias.length >= 3}
                        <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-[2rem] z-10"></div>
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
      <div class="bento-card p-6 sm:p-10">
          <h2 class="text-lg sm:text-xl font-outfit font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
              <Shield weight="duotone" class="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />
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
      <div class="sticky bottom-4 sm:bottom-8 flex justify-center z-50 pt-10 pointer-events-none pb-[env(safe-area-inset-bottom)]">
          <button 
            onclick={handleSave}
            class="btn-pill bg-violet-600 hover:bg-violet-500 text-white font-outfit font-black px-8 sm:px-10 py-4 sm:py-5 shadow-violet-flare flex items-center gap-3 transition-all hover:scale-105 active:scale-95 pointer-events-auto text-[10px] sm:text-sm"
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
