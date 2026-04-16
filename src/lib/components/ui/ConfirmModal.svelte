<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { X, Warning, CheckCircle, Info } from 'phosphor-svelte';
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
      btn: 'bg-amber-500 hover:bg-amber-600'
    },
    danger: {
      icon: Warning,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      btn: 'bg-red-500 hover:bg-red-600'
    },
    info: {
      icon: Info,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      btn: 'bg-blue-500 hover:bg-blue-600'
    },
    success: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      btn: 'bg-emerald-500 hover:bg-emerald-600'
    }
  };

  const config = $derived(typeConfig[type]);
</script>

{#if show}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" 
      onclick={handleCancel}
      transition:fade={{ duration: 200 }}
    ></div>

    <!-- Modal Card -->
    <div 
      class="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-32 shadow-2xl overflow-hidden"
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <div class="p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 rounded-2xl {config.bg} {config.color}">
            <config.icon size={24} weight="duotone" />
          </div>
          <div>
            <h3 class="text-xl font-outfit font-bold text-white leading-tight">{title}</h3>
            <p class="text-sm text-slate-500 font-jakarta mt-1 lowercase first-letter:uppercase">{message}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button 
            onclick={handleCancel}
            class="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 font-outfit font-bold text-sm transition-all border border-white/5 active:scale-95"
          >
            {cancelText || $t('common.cancel') || 'Cancel'}
          </button>
          <button 
            onclick={handleConfirm}
            class="flex-1 py-3 px-4 rounded-xl {config.btn} text-white font-outfit font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            {confirmText || $t('common.confirm') || 'Confirm'}
          </button>
        </div>
      </div>

      <!-- Close button top right -->
      <button 
        onclick={handleCancel}
        class="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  </div>
{/if}
