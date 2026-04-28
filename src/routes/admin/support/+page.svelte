<script lang="ts">
  import { fly } from 'svelte/transition';
  import SupportManager from '$lib/components/admin/SupportManager.svelte';
</script>

<div class="space-y-12" in:fly={{ y: 20, duration: 500 }}>
  <div class="flex items-center gap-6">
    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
      03
    </div>
    <div>
      <h2 class="text-6xl font-black font-display uppercase italic tracking-tighter leading-[0.8]">
        CENTRO DE<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">SOPORTE</span>
      </h2>
    </div>
  </div>
  <SupportManager />
</div>
