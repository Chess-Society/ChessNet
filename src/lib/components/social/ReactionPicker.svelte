<script lang="ts">
  import { fade, scale, fly } from 'svelte/transition';
  import { Rocket, Trophy, Lightbulb, Question, WarningCircle, Skull } from 'phosphor-svelte';
  
  interface Props {
    onSelect: (key: string) => void;
    activeReactions?: string[];
  }

  let { onSelect, activeReactions = [] }: Props = $props();
  let hoveredKey = $state<string | null>(null);

  const options = [
    { key: 'brilliant', displayName: 'Brillante', icon: Rocket, color: 'text-cyan-400', label: '!!', bg: 'hover:bg-cyan-500/20' },
    { key: 'great', displayName: 'Gran Jugada', icon: Trophy, color: 'text-emerald-400', label: '!', bg: 'hover:bg-emerald-500/20' },
    { key: 'interesting', displayName: 'Interesante', icon: Lightbulb, color: 'text-violet-400', label: '!?', bg: 'hover:bg-violet-500/20' },
    { key: 'dubious', displayName: 'Dudosa', icon: Question, color: 'text-zinc-400', label: '?!', bg: 'hover:bg-zinc-500/20' },
    { key: 'mistake', displayName: 'Error', icon: WarningCircle, color: 'text-amber-400', label: '?', bg: 'hover:bg-amber-500/20' },
    { key: 'blunder', displayName: 'Grave Error', icon: Skull, color: 'text-red-400', label: '??', bg: 'hover:bg-red-500/20' }
  ];
</script>

<div 
  class="absolute bottom-full left-0 mb-4 flex items-center gap-1 p-1 bg-zinc-950 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-50 rounded-full"
  transition:fly={{ y: 10, duration: 200 }}
>
  {#each options as opt, i}
    {@const Icon = opt.icon}
    <div in:scale={{ delay: i * 30, duration: 200, start: 0.5 }}>
      <button
        onclick={() => onSelect(opt.key)}
        onmouseenter={() => hoveredKey = opt.key}
        onmouseleave={() => hoveredKey = null}
        class="group relative w-10 h-10 flex flex-col items-center justify-center transition-all rounded-full {opt.bg} {activeReactions.includes(opt.key) ? 'bg-white/10 ring-1 ring-white/20' : ''}"
      >
        <Icon size={18} weight="fill" class="{opt.color} group-hover:scale-110 transition-transform duration-300" />
        <span class="absolute -top-1 -right-1 text-[7px] font-black bg-zinc-900 px-1 border border-white/10 {opt.color} rounded-sm shadow-sm">{opt.label}</span>
        
        <!-- Individual Dynamic Tooltip (Only shows if hovered) -->
        {#if hoveredKey === opt.key}
          <div 
            class="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white text-black text-[7px] font-black uppercase tracking-[0.2em] shadow-2xl ring-1 ring-black/5 whitespace-nowrap z-[60]"
            in:fly={{ y: 5, duration: 150 }}
            out:fade={{ duration: 100 }}
          >
            {opt.displayName}
            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
          </div>
        {/if}
      </button>
    </div>
  {/each}
</div>

<style>
  div {
    will-change: transform, opacity;
  }
</style>

