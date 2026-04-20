<script lang="ts">
    import { fade } from 'svelte/transition';
    import { t } from '$lib/i18n';

    interface Player {
        student_id: string;
        student_name: string;
    }

    interface Pairing {
        white_student_id: string;
        black_student_id: string;
        result?: string;
        bye?: boolean;
        points_white?: number;
        points_black?: number;
    }

    let { players = [], pairings = [] }: { players: Player[], pairings: Pairing[] } = $props();

    // Helper to get result between two players
    const getResult = (p1Id: string, p2Id: string) => {
        if (p1Id === p2Id) return null; // Diagonal
        
        const pairing = pairings.find(p => 
            (p.white_student_id === p1Id && p.black_student_id === p2Id) ||
            (p.white_student_id === p2Id && p.black_student_id === p1Id)
        );

        if (!pairing || pairing.result === undefined) return '';

        const isWhite = pairing.white_student_id === p1Id;
        if (pairing.result === '1/2-1/2') return '½';
        if (pairing.result === '1-0') return isWhite ? '1' : '0';
        if (pairing.result === '0-1') return isWhite ? '0' : '1';
        
        return '';
    };

    // Calculate total points for the crosstable
    const getPoints = (playerId: string) => {
        let pts = 0;
        pairings.forEach(p => {
            if (p.result === undefined && !p.bye) return;
            if (p.white_student_id === playerId) pts += p.points_white || 0;
            if (p.black_student_id === playerId) pts += p.points_black || 0;
        });
        return pts;
    };

    // Sort players by points for the crosstable display (optional, usually by seed or name)
    let sortedPlayers = $derived([...players].sort((a,b) => a.student_name.localeCompare(b.student_name)));
</script>

<div class="overflow-x-auto rounded-[24px] border border-zinc-800 bg-zinc-950/50 backdrop-blur-md" in:fade>
    <table class="w-full text-left border-collapse">
        <thead class="bg-zinc-900/80">
            <tr>
                <th class="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800">#</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800">{$t('tournaments.participants')}</th>
                {#each sortedPlayers as _, i}
                    <th class="px-2 py-4 text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800 w-12">{i + 1}</th>
                {/each}
                <th class="px-6 py-4 text-center text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-zinc-800">{$t('tournaments.points')}</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/50">
            {#each sortedPlayers as p, i}
                <tr class="hover:bg-zinc-800/20 transition-colors group">
                    <td class="px-4 py-4 text-xs font-black text-zinc-600 border-r border-zinc-800/30">{i + 1}</td>
                    <td class="px-6 py-4">
                        <span class="text-sm font-bold text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors">{p.student_name}</span>
                    </td>
                    {#each sortedPlayers as p2, j}
                        <td class="px-2 py-4 text-center border-r border-zinc-800/30 {i === j ? 'bg-zinc-900/50' : ''}">
                            {#if i === j}
                                <div class="w-full h-full flex items-center justify-center">
                                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                                </div>
                            {:else}
                                <span class="text-sm font-black {getResult(p.student_id, p2.student_id) === '1' ? 'text-violet-400' : getResult(p.student_id, p2.student_id) === '0' ? 'text-zinc-600' : 'text-zinc-400'}">
                                    {getResult(p.student_id, p2.student_id)}
                                </span>
                            {/if}
                        </td>
                    {/each}
                    <td class="px-6 py-4 text-center">
                        <span class="text-lg font-black text-amber-400">{getPoints(p.student_id)}</span>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    table {
        border-spacing: 0;
    }
</style>
