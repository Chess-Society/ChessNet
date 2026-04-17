<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  onMount(() => {
    if (browser) {
      goto('/panel');
    }
  });
</script>

<div class="min-h-screen bg-zinc-950 flex items-center justify-center">
  <div class="text-center space-y-4">
    <div class="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    <p class="text-slate-400 font-outfit uppercase tracking-[0.3em] text-[10px] font-black italic">Redirigiendo...</p>
  </div>
</div>
