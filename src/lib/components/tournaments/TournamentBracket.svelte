<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { Trophy, Target, Medal } from 'phosphor-svelte';
    import type { LocalTournamentPairing, LocalTournamentPlayer } from '$lib/types/local-tournament';
    import { t } from '$lib/i18n';

    interface Props {
        pairings: LocalTournamentPairing[];
        players: LocalTournamentPlayer[];
        currentRound?: number;
        format?: string;
    }

    let { pairings = [], players = [], currentRound = 1, format = 'knockout' }: Props = $props();

    // Group pairings by round
    let roundsData = $derived.by(() => {
        const rMap = new Map<number, LocalTournamentPairing[]>();
        pairings.forEach(p => {
            if (!rMap.has(p.round_no)) rMap.set(p.round_no, []);
            rMap.get(p.round_no)?.push(p);
        });
        
        const sortedRounds = Array.from(rMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([no, pairs]) => ({
                no,
                pairs: pairs.sort((a, b) => a.board - b.board)
            }));
            
        return sortedRounds;
    });

    const getRoundName = (roundNo: number, totalRounds: number) => {
        if (roundNo === totalRounds) return $t('tournaments.bracket.final') || 'FINAL';
        if (roundNo === totalRounds - 1) return $t('tournaments.bracket.semifinal') || 'SEMIFINALS';
        if (roundNo === totalRounds - 2) return $t('tournaments.bracket.quarterfinal') || 'QUARTERFINALS';
        return `${$t('tournaments.round')} ${roundNo}`;
    };

    let totalRoundsCount = $derived(roundsData.length);
    let winner = $derived.by(() => {
        const lastRound = roundsData[roundsData.length - 1];
        if (!lastRound) return null;
        const finalMatch = lastRound.pairs[0];
        if (!finalMatch || !finalMatch.result) return null;
        
        if (finalMatch.result === '1-0') return { name: finalMatch.white_name, id: finalMatch.white_student_id };
        if (finalMatch.result === '0-1') return { name: finalMatch.black_name, id: finalMatch.black_student_id };
        return null;
    });
</script>

<div class="overflow-x-auto pb-16 pt-8 px-6 scrollbar-premium">
    <div class="flex gap-20 min-w-max items-start justify-center py-12 relative">
        
        {#each roundsData as round, rIndex}
            <div class="flex flex-col gap-12 relative" style="width: 280px;" in:fly={{ x: 30, delay: rIndex * 150, duration: 800 }}>
                <!-- Round Header -->
                <div class="text-center mb-8 relative">
                    <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[40px] font-black text-white/5 select-none pointer-events-none uppercase">
                        R{round.no}
                    </div>
                    <h4 class="text-xs font-black text-violet-400 uppercase tracking-[0.3em] relative z-10">{getRoundName(round.no, totalRoundsCount)}</h4>
                    <div class="w-16 h-1 bg-zinc-800 mx-auto mt-3 rounded-full overflow-hidden border border-white/5">
                        {#if currentRound >= round.no}
                            <div class="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 w-full animate-pulse"></div>
                        {/if}
                    </div>
                </div>

                <!-- Matches in Round -->
                <div class="flex flex-col justify-around h-full grow space-y-12">
                    {#each round.pairs as pairing, pIndex}
                        <div class="relative group">
                            <!-- Match Card -->
                            <div class="bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:border-violet-500/50 group-hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-1 relative z-20">
                                <!-- Board Badge -->
                                <div class="absolute top-0 right-0 px-3 py-1 bg-zinc-950/80 border-l border-b border-zinc-800 rounded-bl-xl text-[8px] font-black text-zinc-600">
                                    BOARD {pairing.board}
                                </div>

                                <!-- Player 1 -->
                                <div class="flex items-center justify-between p-4 border-b border-zinc-800/50 transition-colors {pairing.result === '1-0' ? 'bg-violet-600/5' : ''}">
                                    <div class="flex items-center gap-3 overflow-hidden">
                                        <div class="w-8 h-8 rounded-none bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-black {pairing.result === '1-0' ? 'text-violet-400 border-violet-500/30' : 'text-zinc-600'}">
                                            {pairing.white_name?.[0] || '?'}
                                        </div>
                                        <span class="text-xs font-bold transition-all truncate {pairing.result === '1-0' ? 'text-white' : pairing.result === '0-1' ? 'text-zinc-600 line-through' : 'text-zinc-400'}">
                                            {pairing.white_name || 'TBD'}
                                        </span>
                                    </div>
                                    {#if pairing.result === '1-0'}
                                        <div class="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                                    {/if}
                                </div>

                                <!-- Player 2 -->
                                <div class="flex items-center justify-between p-4 transition-colors {pairing.result === '0-1' ? 'bg-violet-600/5' : ''}">
                                    <div class="flex items-center gap-3 overflow-hidden">
                                        {#if pairing.bye}
                                            <div class="w-8 h-8 rounded-none bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs text-zinc-800 font-black">
                                                -
                                            </div>
                                            <span class="text-xs font-black text-zinc-700 uppercase tracking-widest italic">BYE / VACANTE</span>
                                        {:else}
                                            <div class="w-8 h-8 rounded-none bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-black {pairing.result === '0-1' ? 'text-violet-400 border-violet-500/30' : 'text-zinc-600'}">
                                                {pairing.black_name?.[0] || '?'}
                                            </div>
                                            <span class="text-xs font-bold transition-all truncate {pairing.result === '0-1' ? 'text-white' : pairing.result === '1-0' ? 'text-zinc-600 line-through' : 'text-zinc-400'}">
                                                {pairing.black_name || 'TBD'}
                                            </span>
                                        {/if}
                                    </div>
                                    {#if pairing.result === '0-1' || (pairing.bye && pairing.result === '1-0')}
                                        <div class="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                                    {/if}
                                </div>
                            </div>

                            <!-- Visual Branching Logic (connecting lines) -->
                            {#if rIndex < totalRoundsCount - 1}
                                <!-- Desktop Connections -->
                                <div class="absolute -right-20 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
                                    <svg width="80" height="120" viewBox="0 0 80 120" fill="none" class="overflow-visible">
                                        <path 
                                            d={pairing.board % 2 !== 0 
                                                ? "M 0 60 L 40 60 L 40 120 L 80 120" 
                                                : "M 0 60 L 40 60 L 40 0 L 80 0"} 
                                            stroke="currentColor" 
                                            stroke-width="2" 
                                            class="text-zinc-800 group-hover:text-violet-500/30 transition-colors"
                                        />
                                    </svg>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/each}

        <!-- Champion Zone -->
        {#if winner}
            <div class="flex flex-col items-center gap-6 ml-12 pt-16" in:fade={{ delay: 800, duration: 1000 }}>
                <div class="relative group">
                    <!-- Glow effect -->
                    <div class="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full group-hover:bg-amber-500/40 transition-all duration-1000"></div>
                    
                    <div class="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-600 rounded-[40px] p-0.5 shadow-2xl shadow-amber-500/20 relative z-10 transition-transform group-hover:scale-110">
                        <div class="w-full h-full bg-zinc-950 rounded-[38px] flex items-center justify-center text-amber-500">
                            <Trophy weight="fill" class="w-16 h-16 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                        </div>
                    </div>
                    
                    <!-- Floating Medals -->
                    <div class="absolute -top-4 -right-4 w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-amber-500 shadow-xl z-20 animate-bounce">
                        <Medal weight="bold" class="w-6 h-6" />
                    </div>
                </div>
                
                <div class="text-center space-y-2 relative z-10">
                    <p class="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] drop-shadow-sm">TOURNAMENT CHAMPION</p>
                    <h2 class="text-3xl font-outfit font-black text-white uppercase tracking-tighter drop-shadow-xl">{winner.name}</h2>
                    <div class="flex items-center justify-center gap-2 mt-4">
                        <div class="h-px w-8 bg-zinc-800"></div>
                        <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                        <div class="h-px w-8 bg-zinc-800"></div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .scrollbar-premium::-webkit-scrollbar {
        height: 10px;
    }
    .scrollbar-premium::-webkit-scrollbar-track {
        background: rgba(24, 24, 27, 0.5);
        border-radius: 10px;
    }
    .scrollbar-premium::-webkit-scrollbar-thumb {
        background: #27272a;
        border: 3px solid rgba(24, 24, 27, 0.5);
        border-radius: 10px;
    }
    .scrollbar-premium::-webkit-scrollbar-thumb:hover {
        background: #3f3f46;
    }
    
    /* Ensure matches align nicely with round heights */
    .grow {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
