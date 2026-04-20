<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { X, Warning, CheckCircle, Info, Trash } from 'phosphor-svelte';
  import { t } from '$lib/i18n';

  let { 
    show = $bindable(false), 
    title = '', 
    message = '', 
    confirmText = null, 
    cancelText = null,
    type = 'warning', // 'warning', 'danger', 'info', 'success'
    onConfirm = () => {},
    onCancel = () => {}
  } = $props<{
    show: boolean;
    title: string;
    message: string;
    confirmText?: string | null;
    cancelText?: string | null;
    type?: 'warning' | 'danger' | 'info' | 'success';
    onConfirm?: () => void;
    onCancel?: () => void;
  }>();

  function handleConfirm() {
    onConfirm();
    show = false;
  }

  function handleCancel() {
    onCancel();
    show = false;
  }

  const typeConfig = {
    warning: {
      icon: Warning,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      glow: 'shadow-amber-900/20',
      btn: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-amber-950',
      border: 'border-amber-500/20'
    },
    danger: {
      icon: Trash,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      glow: 'shadow-red-900/20',
      btn: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white',
      border: 'border-red-500/20'
    },
    info: {
      icon: Info,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
      glow: 'shadow-violet-900/20',
      btn: 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white',
      border: 'border-violet-500/20'
    },
    success: {
      icon: CheckCircle,
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10',
      glow: 'shadow-indigo-900/20',
      btn: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white',
      border: 'border-indigo-500/20'
    }
  };

  const config = $derived(typeConfig[type as keyof typeof typeConfig] || typeConfig.warning);
</script>

{#if show}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop with intense blur -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="absolute inset-0 bg-zinc-950/60 backdrop-blur-xl" 
      onclick={handleCancel}
      transition:fade={{ duration: 300 }}
    ></div>

    <!-- Modal Card -->
    <div 
      class="relative w-full max-w-md bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-none shadow-2xl overflow-hidden ring-1 ring-white/10"
      transition:scale={{ duration: 300, start: 0.95, easing: (t) => t * (2 - t) }}
    >
      <!-- Premium Glow Detail -->
      <div class="absolute -top-24 -left-24 w-48 h-48 {config.bg} blur-[80px] opacity-50"></div>
      
      <div class="p-10 relative">
        <div class="flex flex-col items-center text-center gap-6">
          <div class="w-20 h-20 rounded-none {config.bg} {config.color} {config.border} border flex items-center justify-center shadow-2xl {config.glow}">
            <config.icon size={40} weight="duotone" />
          </div>
          
          <div class="space-y-2">
            <h3 class="text-2xl font-outfit font-bold text-white tracking-tight leading-tight">{title}</h3>
            <p class="text-slate-400 font-jakarta text-[15px] leading-relaxed max-w-[280px] mx-auto">
              {message}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 mt-10">
          <button 
            onclick={handleConfirm}
            class="w-full py-4 px-6 rounded-none {config.btn} font-outfit font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 uppercase tracking-widest"
          >
            {confirmText || $t('common.confirm') || 'Confirm'}
          </button>
          
          <button 
            onclick={handleCancel}
            class="w-full py-4 px-6 rounded-none bg-white/5 hover:bg-white/10 text-slate-400 font-outfit font-bold text-sm transition-all border border-white/5 active:scale-95 uppercase tracking-widest"
          >
            {cancelText || $t('common.cancel') || 'Cancel'}
          </button>
        </div>
      </div>

      <!-- Close button top right -->
      <button 
        onclick={handleCancel}
        class="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-none"
      >
        <X size={20} />
      </button>
    </div>
  </div>
{/if}

<style>
  /* Extra smooth typography */
  h3 {
    text-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }
</style>

