<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { 
    CaretRight,
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
    Medal,
    Warning
  } from 'phosphor-svelte';
  import { INSIGNIAS } from '$lib/constants/insignias';
  import { t } from '$lib/i18n';
  import { appStore } from '$lib/stores/appStore';
  import { uiStore } from '$lib/stores/uiStore';
  import { auth } from '$lib/firebase';
  import toast from 'svelte-french-toast';
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

  const isDirector = $derived($appStore.settings.role === 'director' || $appStore.settings.role === 'admin');
  const currentSchool = $derived($appStore.schools.find(s => s.id === $appStore.settings.schoolId) || $appStore.schools[0]);

  async function handleToggleGovernance(field: 'socialEnabled' | 'economyEnabled') {
    if (!currentSchool) return;
    
    try {
      const newValue = !currentSchool[field];
      await appStore.updateSchool({
        ...currentSchool,
        [field]: newValue
      });
      toast.success(`Sistema ${field === 'socialEnabled' ? 'social' : 'económico'} ${newValue ? 'activado' : 'desactivado'}`);
    } catch (e: any) {
      toast.error(e.message || "Error al actualizar la gobernanza");
    }
  }

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

  const handleSave = async () => {
    try {
      await appStore.updateSettings({
        teacherName: config.teacherName,
        teacherAvatar: config.teacherAvatar,
        teacherEmail: config.teacherEmail,
        featuredInsignias: config.featuredInsignias
      });
      saved = true;
      setTimeout(() => saved = false, 3000);
    } catch (err: any) {
      toast.error(err?.message || 'Error guardando la configuración');
    }
  };

</script>

<svelte:head>
  <title>{$t('settings.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8" transition:fade>
  
  <div class="flex items-center gap-4 mb-8 sm:mb-12">
    <div class="w-12 h-12 sm:w-14 sm:h-14 bg-violet-600/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-500 shadow-xl shadow-violet-500/5">
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
                  <div class="w-32 h-32 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-slate-700 overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-violet-500/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                      {#if config.teacherAvatar}
                          <img src={config.teacherAvatar} alt="Avatar" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      {:else}
                          <UserIcon weight="duotone" class="w-12 h-12" />
                      {/if}
                      <div class="absolute inset-0 bg-violet-600/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer translate-y-4 group-hover:translate-y-0">
                          <Camera weight="bold" class="w-8 h-8 text-white mb-2" />
                          <span class="text-[8px] font-black uppercase tracking-widest text-white">{$t('common.edit') || 'EDITAR'}</span>
                      </div>
                  </div>
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-white/10 flex items-center justify-center text-violet-500">
                    <Sparkle weight="fill" class="w-4 h-4" />
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
                        class="w-full bg-zinc-950/50 border border-white/5 rounded-none px-5 py-4 text-sm text-white focus:border-violet-500/50 outline-none transition-all placeholder:text-slate-700 shadow-inner"
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
                          class="w-full bg-zinc-950/30 border border-white/5 rounded-none pl-12 pr-5 py-4 text-sm text-slate-400 cursor-not-allowed outline-none transition-all placeholder:text-slate-700"
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

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 bg-zinc-950/50 border border-white/10 rounded-none shadow-inner group hover:border-violet-500/20 transition-all">
              <div class="flex items-center gap-6">
                <div class="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-500 shrink-0">
                  <Sparkle weight="duotone" class="w-7 h-7" />
                </div>
                <div>
                    <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{$t('settings.current_level')}</p>
                    <p class="text-white font-outfit font-black text-2xl lg:text-3xl uppercase tracking-tighter">{$t('settings.plan_prefix')} {$appStore.settings.plan || $t('settings.plan_free')}</p>
                </div>
              </div>
              <a href="/panel/upgrade" class="bg-white text-black h-14 px-10 text-[10px] font-outfit font-black uppercase tracking-[0.2em] shadow-xl hover:bg-violet-100 inline-flex items-center justify-center gap-3 group rounded-none transition-all active:scale-95">
                  {$t('settings.manage_btn')}
                  <CaretRight weight="bold" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                        <div class="absolute -top-1 -right-1 w-8 h-8 bg-violet-600 rounded-none flex items-center justify-center border-4 border-[#09090b] shadow-xl z-20" transition:scale>
                          <Check weight="bold" class="w-4 h-4 text-white" />
                        </div>
                      {/if}

                      {#if !isFeatured && config.featuredInsignias.length >= 3}
                        <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-none z-10"></div>
                      {/if}
                  </button>
              {/each}
          </div>
          
          {#if availableInsignias.length === 0}
            <div class="p-8 text-center border border-dashed border-white/5 rounded-none bg-black/20">
                <p class="text-xs text-slate-500">{$t('settings.no_insignias')} <a href="/panel/achievements" class="text-violet-400 hover:underline">{$t('settings.insignia_hub_link')}</a></p>
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
              <div class="flex items-center justify-between p-6 bg-zinc-950/30 rounded-none border border-white/5 group hover:border-violet-500/30 transition-all">
                  <div class="max-w-md">
                      <p class="text-sm font-outfit font-bold text-white mb-1">{$t('settings.smart_sync')}</p>
                      <p class="text-[11px] text-slate-500 font-plus-jakarta leading-relaxed">{$t('settings.smart_sync_desc')}</p>
                  </div>
                  <div class="w-12 h-6 bg-violet-600 rounded-none relative shadow-[0_0_15px_rgba(139,92,246,0.2)] border border-violet-400/20">
                      <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-none shadow-lg"></div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Governance Section (Only for Directors) -->
      {#if isDirector && currentSchool}
        <div class="bento-card p-6 sm:p-10 border-amber-500/10" in:fade>
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-lg sm:text-xl font-outfit font-bold text-white flex items-center gap-3">
              <Shield weight="duotone" class="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              Gobernanza de Academia
            </h2>
            <div class="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-500 uppercase tracking-widest">
              Control Maestro
            </div>
          </div>
          
          <div class="space-y-6">
            <!-- Social Switch -->
            <div class="flex items-center justify-between p-6 bg-zinc-950/30 rounded-none border border-white/5 group hover:border-violet-500/30 transition-all">
              <div class="max-w-md">
                <p class="text-sm font-outfit font-bold text-white mb-1">Muro Social de Profesores</p>
                <p class="text-[11px] text-slate-500 font-plus-jakarta leading-relaxed">Permite a los profesores compartir posts, análisis y retos en el feed global de la escuela.</p>
              </div>
              <button 
                onclick={() => handleToggleGovernance('socialEnabled')}
                class="w-12 h-6 {currentSchool.socialEnabled ? 'bg-emerald-600' : 'bg-zinc-800'} rounded-none relative transition-colors shadow-lg"
                aria-label="Alternar Muro Social"
              >
                <div class="absolute {currentSchool.socialEnabled ? 'right-1' : 'left-1'} top-1 w-4 h-4 bg-white rounded-none transition-all"></div>
              </button>
            </div>

            <!-- Economy Switch -->
            <div class="flex items-center justify-between p-6 bg-zinc-950/30 rounded-none border border-white/5 group hover:border-amber-500/30 transition-all">
              <div class="max-w-md">
                <p class="text-sm font-outfit font-bold text-white mb-1">Economía de Reconocimiento (Nets)</p>
                <p class="text-[11px] text-slate-500 font-plus-jakarta leading-relaxed">Activa el sistema de hitos, pronósticos académicos y recompensas en Nets para la escuela.</p>
              </div>
              <button 
                onclick={() => handleToggleGovernance('economyEnabled')}
                class="w-12 h-6 {currentSchool.economyEnabled ? 'bg-amber-600' : 'bg-zinc-800'} rounded-none relative transition-colors shadow-lg"
                aria-label="Alternar Economía de Reconocimiento"
              >
                <div class="absolute {currentSchool.economyEnabled ? 'right-1' : 'left-1'} top-1 w-4 h-4 bg-white rounded-none transition-all"></div>
              </button>
            </div>
          </div>

          <div class="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
            <Warning size={16} class="text-amber-500 shrink-0 mt-0.5" />
            <p class="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight">
              Nota: Estos cambios afectan a toda la escuela. Los profesores y alumnos dejarán de ver las funcionalidades sociales o económicas instantáneamente si se desactivan.
            </p>
          </div>
        </div>
      {/if}

      <!-- Danger Zone Section -->
      <div class="bento-card p-6 sm:p-10 border-red-500/10 hover:border-red-500/20">
          <h2 class="text-lg sm:text-xl font-outfit font-bold text-red-500 mb-6 sm:mb-8 flex items-center gap-3">
              <Warning weight="duotone" class="w-5 h-5 sm:w-6 sm:h-6" />
              {$t('settings.danger_zone_title') || 'Zona de Peligro'}
          </h2>
          
          <div class="p-6 bg-red-500/5 rounded-none border border-red-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div class="text-center sm:text-left">
                  <p class="text-sm font-outfit font-bold text-white mb-1">{$t('settings.delete_account_title') || 'Eliminar Mi Cuenta'}</p>
                  <p class="text-[11px] text-slate-500 font-plus-jakarta leading-relaxed max-w-sm">
                      {$t('settings.delete_account_desc') || 'Esta acción es irreversible. Se eliminarán permanentemente todos tus datos, escuelas, alumnos y registros vinculados.'}
                  </p>
              </div>
              <button 
                onclick={async () => {
                  const confirmed = await uiStore.confirm({
                    title: $t('settings.delete_account_confirm_title') || '¿Eliminar cuenta permanentemente?',
                    message: $t('settings.delete_account_confirm_msg') || 'Perderás todos tus registros y acceso a la plataforma. No hay vuelta atrás.',
                    type: 'danger'
                  });
                  if (!confirmed) return;
                  
                  try {
                    await appStore.deleteAccount();
                    await fetch('/api/auth/session', { method: 'DELETE' });
                    window.location.href = '/login';
                  } catch (err: any) {
                    if (err.code === 'auth/requires-recent-login') {
                        toast.error($t('settings.delete_login_required') || 'Por seguridad, debes haber iniciado sesión recientemente para eliminar tu cuenta. Cierra sesión e ingresa de nuevo.');
                    } else {
                        toast.error(err.message);
                    }
                  }
                }}
                class="px-6 py-3 bg-red-500/10 hover:bg-red-50 text-red-500 hover:text-red-600 font-outfit font-black text-[10px] uppercase tracking-widest rounded-none transition-all border border-red-500/20"
              >
                {$t('settings.delete_account_btn') || 'Borrar Todo'}
              </button>
          </div>
      </div>

      <!-- Floating Save Bar -->
      <div class="sticky bottom-4 sm:bottom-8 flex justify-center z-50 pt-10 pointer-events-none pb-[env(safe-area-inset-bottom)]">
          <button 
            onclick={handleSave}
            class="bg-violet-600 hover:bg-violet-500 text-white font-outfit font-black px-8 sm:px-10 py-4 sm:py-5 shadow-violet-flare flex items-center gap-3 transition-all hover:scale-105 active:scale-95 pointer-events-auto text-[10px] sm:text-sm rounded-none"
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

