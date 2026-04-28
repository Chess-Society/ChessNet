<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';

  onMount(() => {
    goto('/admin/dashboard', { replaceState: true });
  });
</script>

<div class="h-screen w-full flex items-center justify-center bg-[#02040a]" in:fade>
  <div class="flex flex-col items-center gap-8">
     <div class="relative w-16 h-16">
       <div class="absolute inset-0 border-2 border-primary-500/20 rounded-none"></div>
       <div class="absolute inset-0 border-2 border-primary-500 border-t-transparent animate-spin rounded-none"></div>
     </div>
     <p class="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600 animate-pulse">{$t('admin.msg.loading_realtime')}</p>
  </div>
</div>
