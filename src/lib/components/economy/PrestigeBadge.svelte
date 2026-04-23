<script lang="ts">
	import { Coins, TrendUp } from 'phosphor-svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		nets?: number;
		prestige?: number;
		showIcon?: boolean;
		variant?: 'default' | 'compact' | 'ghost';
	}

	let { 
		nets = 0, 
		prestige = 0, 
		showIcon = true,
		variant = 'default' 
	}: Props = $props();

	// Formatear números grandes (K, M)
	function formatNets(val: number) {
		if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
		if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
		return val.toString();
	}
</script>

{#if variant === 'default'}
	<div class="inline-flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10 group hover:border-violet-500/30 transition-all duration-500 rounded-none">
		{#if showIcon}
			<div class="w-8 h-8 flex items-center justify-center bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
				<Coins weight="fill" size={18} />
			</div>
		{/if}
		<div class="flex flex-col">
			<span class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">BALANCE_NETS</span>
			<div class="flex items-baseline gap-1.5">
				<span class="text-lg font-black font-display italic leading-none text-white">{formatNets(nets)}</span>
				<span class="text-[10px] font-mono font-black text-violet-500 tracking-tighter uppercase">NTS</span>

			</div>
		</div>
	</div>
{:else if variant === 'compact'}
	<div class="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/5 rounded-none">
		<span class="text-[10px] font-black font-display italic text-white">{formatNets(nets)}</span>
		<span class="text-[7px] font-mono font-black text-violet-500 uppercase">NTS</span>
	</div>
{:else}
	<div class="flex items-center gap-1.5 group">
		<Coins weight="bold" size={14} class="text-violet-500 opacity-50 group-hover:opacity-100 transition-opacity" />
		<span class="text-xs font-black font-display italic text-white/80 group-hover:text-white transition-colors">{formatNets(nets)}</span>
	</div>
{/if}

<style>
	/* Animación sutil para el valor si fuera necesario */
</style>
