<script lang="ts">
  import { toasts, removeToast } from '$lib/utils/toast';
  import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-svelte';

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-600 border-green-500';
      case 'error': return 'bg-red-600 border-red-500';
      case 'warning': return 'bg-yellow-600 border-yellow-500';
      case 'info': return 'bg-blue-600 border-blue-500';
      default: return 'bg-slate-600 border-slate-500';
    }
  };
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
  {#each $toasts as toast (toast.id)}
    <div 
      class="flex items-center gap-3 p-4 rounded-lg border shadow-lg text-white min-w-80 max-w-96 transform transition-all duration-300 ease-in-out {getColorClasses(toast.type)}"
      role="alert"
      aria-live="polite"
    >
      <svelte:component this={getIcon(toast.type)} class="w-5 h-5 flex-shrink-0" />
      <span class="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        on:click={() => removeToast(toast.id)}
        class="flex-shrink-0 p-1 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Close notification"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>
