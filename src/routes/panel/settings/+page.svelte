<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { 
    CaretRight,
    Gear, 
    User as UserIcon, 
    CreditCard, 
    At,
    Camera,
    Check,
    FloppyDisk,
    Sparkle,
    Lock,
    Medal,
    Warning,
    Crown,
    Trash
  } from 'phosphor-svelte';
  import { auth, storage, db } from '$lib/firebase';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { toast } from '$lib/stores/toast';
  import { superForm } from 'sveltekit-superforms';
  import { zod4 as zod } from 'sveltekit-superforms/adapters';
  import { settingsSchema } from '$lib/schemas/settings';
  import { t, loadTranslations } from '$lib/i18n';
  import { appStore } from '$lib/stores/appStore';
  import { uiStore } from '$lib/stores/uiStore';

  let { data } = $props();

  const { form, errors, enhance, message, delayed } = superForm(untrack(() => data.form) as any, {
    validators: zod(settingsSchema as any),
    dataType: 'json',
    onUpdated({ form }) {
      if (form.valid) {
        saved = true;
        toast.success($t('common.synced'));
        setTimeout(() => saved = false, 3000);
      }
    },
    onError({ result }) {
      toast.error(result.error.message || 'Error guardando la configuración');
    }
  });

  let saved = $state(false);
  let isUploading = $state(false);
  let fileInput = $state<HTMLInputElement | null>(null);

  const isAdmin = $derived(data.isAdmin || $appStore.settings.role === 'admin');
  const plan = $derived(isAdmin ? 'premium' : ($appStore.settings.plan || 'free'));
  const isPremium = $derived(plan === 'premium');
  
  let deleteForm = $state<HTMLFormElement | null>(null);

  const handleDeleteAccount = async () => {
    const confirmed = await uiStore.confirm({
      title: $t('settings.delete_account_confirm_title'),
      message: $t('settings.delete_account_confirm_msg'),
      type: 'danger'
    });
    if (!confirmed) return;
    
    await tick();
    deleteForm?.requestSubmit();
  };

  const handleAvatarClick = () => {
    fileInput?.click();
  };

  const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande (máx 2MB)');
      return;
    }

    isUploading = true;
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No autenticado');

      const storageRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      $form.teacherAvatar = url;
      toast.success('Imagen subida correctamente. Recuerda guardar los cambios.');
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      toast.error('Error al subir la imagen');
    } finally {
      isUploading = false;
    }
  };

  onMount(() => {
    loadTranslations(['settings', 'common', 'nav', 'pricing']);
  });

</script>

<svelte:head>
  <title>{$t('settings.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12" transition:fade>
  <form method="POST" action="?/update" use:enhance class="space-y-8 pb-32">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-12">
      <div class="w-12 h-12 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-500">
        <Gear weight="duotone" class="w-7 h-7" />
      </div>
      <div>
        <h1 class="text-3xl font-outfit font-black text-white tracking-tight">{$t('settings.title')}</h1>
        <p class="text-slate-400 font-plus-jakarta text-sm">{$t('settings.subtitle')}</p>
      </div>
    </div>

    <div class="space-y-8">
      <!-- Profile Section -->
      <div class="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <h2 class="text-xl font-outfit font-black text-white mb-10 flex items-center gap-3">
          <UserIcon weight="duotone" class="w-6 h-6 text-violet-500" />
          {$t('settings.profile_title')}
        </h2>

        <div class="flex flex-col md:flex-row gap-12 items-start">
          <div class="relative group">
            <input 
              type="file" 
              accept="image/*" 
              class="hidden" 
              bind:this={fileInput} 
              onchange={handleFileChange}
            />
            
            <button 
              type="button"
              onclick={handleAvatarClick}
              disabled={isUploading}
              class="w-32 h-32 rounded-3xl bg-zinc-950 border border-white/10 flex items-center justify-center text-slate-700 overflow-hidden relative shadow-2xl transition-all duration-500 group-hover:border-violet-500/50 disabled:opacity-50"
            >
              {#if $form.teacherAvatar}
                <img src={$form.teacherAvatar} alt="Avatar" class="w-full h-full object-cover" />
              {:else}
                <UserIcon weight="duotone" class="w-12 h-12" />
              {/if}
              
              <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                {#if isUploading}
                  <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                {:else}
                  <Camera weight="bold" class="w-8 h-8 text-white mb-1" />
                  <span class="text-[8px] font-black uppercase tracking-widest text-white">SUBIR FOTO</span>
                {/if}
              </div>
            </button>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center text-violet-500 shadow-xl">
              <Sparkle weight="fill" class="w-4 h-4" />
            </div>
          </div>

          <div class="flex-grow space-y-6 w-full">
            <div class="space-y-2">
              <label for="teacherName" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                {$t('settings.profile_name')}
              </label>
              <input 
                type="text" 
                id="teacherName"
                name="teacherName"
                bind:value={$form.teacherName}
                class="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:border-violet-500/50 outline-none transition-all placeholder:text-slate-800"
                placeholder="Tu nombre completo"
              />
              {#if $errors.teacherName}<p class="text-[10px] text-red-400 mt-1 uppercase font-bold tracking-tighter">{$errors.teacherName}</p>{/if}
            </div>

            <div class="space-y-2">
              <label for="teacherEmail" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                {$t('settings.profile_email')}
              </label>
              <div class="relative">
                <At weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                <input 
                  type="email" 
                  id="teacherEmail"
                  name="teacherEmail"
                  bind:value={$form.teacherEmail}
                  class="w-full bg-zinc-950/30 border border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm text-slate-500 cursor-not-allowed outline-none transition-all"
                  disabled
                />
              </div>
              <p class="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5 ml-1 opacity-60">
                <Lock weight="bold" class="w-3 h-3" />
                {$t('settings.email_lock_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Section -->
      <div class="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 sm:p-10">
        <h2 class="text-xl font-outfit font-black text-white mb-8 flex items-center gap-3">
          <CreditCard weight="duotone" class="w-6 h-6 text-violet-500" />
          {$t('settings.subscription_title')}
        </h2>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-zinc-950/50 border border-white/5 rounded-2xl group transition-all">
          <div class="flex items-center gap-6">
            <div class="w-14 h-14 {isPremium ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-zinc-800 text-slate-500'} border rounded-2xl flex items-center justify-center shrink-0">
              {#if isPremium}
                <Crown weight="fill" class="w-8 h-8" />
              {:else}
                <Medal weight="duotone" class="w-8 h-8" />
              {/if}
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{$t('settings.current_level')}</p>
              <p class="text-white font-outfit font-black text-2xl uppercase tracking-tighter flex items-center gap-2">
                {$t('settings.plan_prefix')} 
                <span class={isPremium ? 'text-violet-400' : 'text-white'}>
                  {isPremium ? ($t('panel.premiumCoach') || 'PREMIUM') : ($t('settings.plan_free') || 'GRATUITO')}
                </span>
              </p>
            </div>
          </div>
          <a href="/panel/upgrade" class="{isPremium ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' : 'bg-violet-600 text-white hover:bg-violet-500'} h-12 px-8 text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center gap-3 rounded-xl transition-all active:scale-95">
            {isPremium ? ($t('settings.manage_btn')) : ($t('pricing.upgrade_now'))}
            <CaretRight weight="bold" class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-red-500/[0.02] border border-red-500/10 rounded-3xl p-6 sm:p-10">
        <h2 class="text-xl font-outfit font-black text-red-500 mb-8 flex items-center gap-3">
          <Warning weight="duotone" class="w-6 h-6" />
          {$t('settings.danger_zone_title')}
        </h2>
        
        <div class="p-6 bg-red-500/5 rounded-2xl border border-red-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="text-center sm:text-left">
            <p class="text-sm font-bold text-white mb-1">{$t('settings.delete_account_title')}</p>
            <p class="text-[11px] text-slate-500 leading-relaxed max-w-sm">
              {$t('settings.delete_account_desc')}
            </p>
          </div>
          <button 
            type="button"
            onclick={handleDeleteAccount}
            class="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-red-500/20 active:scale-95"
          >
            {$t('settings.delete_account_btn')}
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden form fields -->
    <input type="hidden" name="schoolId" value={$form.schoolId} />
    <input type="hidden" name="teacherAvatar" value={$form.teacherAvatar} />

    <!-- Floating Save Bar -->
    <div class="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <button 
        type="submit"
        disabled={$delayed}
        class="bg-violet-600 hover:bg-violet-500 text-white font-black px-10 py-5 shadow-2xl shadow-violet-600/30 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 pointer-events-auto text-xs rounded-2xl disabled:opacity-50"
      >
        {#if $delayed}
          <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span>{$t('common.saving')}</span>
        {:else if saved}
          <Check weight="bold" class="w-5 h-5 text-emerald-400" />
          <span>{$t('common.synced')}</span>
        {:else}
          <FloppyDisk weight="duotone" class="w-5 h-5" />
          <span>{$t('common.save_changes')}</span>
        {/if}
      </button>
    </div>
  </form>

  <form method="POST" action="?/deleteAccount" bind:this={deleteForm} class="hidden"></form>
</div>
