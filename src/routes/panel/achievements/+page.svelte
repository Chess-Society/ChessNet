<script lang="ts">
  import { fade } from 'svelte/transition';
  import { MagicWand, Lock, Wrench } from 'phosphor-svelte';
</script>

<svelte:head>
  <title>Logros - ChessNet</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center p-8" in:fade>
  <div class="text-center max-w-lg space-y-8">
    <div class="relative inline-block">
      <div class="absolute inset-0 bg-violet-500/20 blur-3xl animate-pulse rounded-none"></div>
      <div class="relative w-32 h-32 mx-auto bg-zinc-900 border border-violet-500/20 flex items-center justify-center">
        <MagicWand size={56} weight="duotone" class="text-violet-400" />
        <div class="absolute -top-3 -right-3 w-10 h-10 bg-amber-500 flex items-center justify-center">
          <Wrench size={18} weight="fill" class="text-black" />
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-[0.3em]">
        <Lock size={10} weight="fill" /> Sistema en Rework
      </div>
      <h1 class="text-4xl font-black text-white uppercase tracking-tighter italic">
        LOGROS &amp; INSIGNIAS
      </h1>
      <p class="text-zinc-500 text-sm leading-relaxed">
        El sistema de logros está siendo rediseñado completamente para ofrecerte una experiencia mucho más épica. 
        <strong class="text-zinc-300">Próximamente</strong> volverá con nuevas mecánicas, recompensas y categorías.
      </p>
    </div>

    <div class="grid grid-cols-3 gap-4 pt-4">
      {#each ['Combates', 'Rankings', 'Recompensas'] as item}
        <div class="p-4 bg-zinc-950 border border-white/5 flex flex-col items-center gap-2">
          <div class="w-8 h-8 bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Lock size={14} weight="fill" class="text-violet-500/50" />
          </div>
          <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item}</span>
        </div>
      {/each}
    </div>

    <div class="p-4 bg-zinc-950/50 border border-white/5 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
      🔧 En desarrollo — El sistema completo llegará muy pronto
    </div>
  </div>
</div>
