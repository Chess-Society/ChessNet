<script lang="ts">
  import { page } from '$app/stores';
  import { CaretLeft, ArrowsCounterClockwise, Warning, ShieldSlash } from 'phosphor-svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { goto } from '$app/navigation';

  const status = $derived($page.status);
  const message = $derived($page.error?.message || 'Ha ocurrido un error inesperado');
  
  const is500 = $derived(status === 500);
  const is404 = $derived(status === 404);
</script>

<svelte:head>
  <title>Error {status} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 font-jakarta relative overflow-hidden">
  <!-- Background Decorations -->
  <div class="absolute inset-0 z-0">
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-none blur-[128px]"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-none blur-[128px]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
  </div>

  <div class="max-w-xl w-full text-center space-y-12 relative z-10" in:fade>
    <!-- Icon -->
    <div class="relative inline-block" in:scale={{ duration: 600, delay: 200 }}>
      <div class="w-32 h-32 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center shadow-2xl relative z-10">
        {#if is404}
          <ShieldSlash weight="duotone" size={64} class="text-zinc-500" />
        {:else if is500}
          <Warning weight="duotone" size={64} class="text-red-400" />
        {:else}
          <div class="text-4xl font-black text-violet-400 font-outfit">{status}</div>
        {/if}
      </div>
      <div class="absolute -inset-4 bg-violet-600/20 blur-2xl rounded-none -z-10 animate-pulse"></div>
    </div>

    <!-- Text -->
    <div class="space-y-4">
      <h1 class="text-6xl font-black tracking-tighter font-outfit uppercase italic" in:fly={{ y: 20, delay: 300 }}>
        Error {status}
      </h1>
      <p class="text-zinc-400 text-lg font-medium leading-relaxed max-w-md mx-auto" in:fly={{ y: 20, delay: 400 }}>
        {#if is404}
          La página que buscas ha sido movida o no existe en nuestra base de datos actual.
        {:else if is500}
          Nuestro sistema ha encontrado un obstáculo crítico. Estamos trabajando para estabilizar la conexión.
        {:else}
          {message}
        {/if}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4" in:fly={{ y: 20, delay: 500 }}>
      <button 
        onclick={() => history.back()}
        class="flex items-center gap-3 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none text-xs font-black uppercase tracking-widest border border-zinc-800 transition-all group"
      >
        <CaretLeft weight="bold" class="transition-transform group-hover:-translate-x-1" />
        VOLVER ATRÁS
      </button>
      
      <button 
        onclick={() => location.reload()}
        class="flex items-center gap-3 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-none text-xs font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 transition-all active:scale-95 group"
      >
        <ArrowsCounterClockwise weight="bold" class="group-hover:rotate-180 transition-transform duration-500" />
        REINTENTAR
      </button>
    </div>

    {#if is500}
      <div class="pt-12 text-zinc-600 space-y-2" in:fade={{ delay: 800 }}>
        <p class="text-[10px] font-black uppercase tracking-[0.2em]">Detalles Técnicos</p>
        <div class="p-4 bg-zinc-950/50 rounded-none border border-zinc-900/50 font-mono text-[10px] text-zinc-500 break-all select-all">
          {message}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    background-color: #09090b;
  }
</style>

