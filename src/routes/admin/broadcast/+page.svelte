<script lang="ts">
  import { t } from '$lib/i18n';
  import { fly } from 'svelte/transition';
  import BroadcastCenter from '$lib/components/admin/BroadcastCenter.svelte';
</script>

<div class="space-y-12" in:fly={{ y: 20, duration: 500 }}>
  <div class="flex items-center gap-6">
    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
      04
    </div>
    <div>
       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">{$t('admin.broadcast.title')}</h2>
       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
         <span class="w-1.5 h-1.5 bg-primary-500 rounded-none animate-pulse"></span>
         ENVÍO DE COMUNICACIONES GLOBALES
       </p>
    </div>
  </div>
  
  <BroadcastCenter />
</div>
