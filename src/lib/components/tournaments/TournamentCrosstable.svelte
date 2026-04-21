<script lang="ts">
    import { fade } from 'svelte/transition';
    import { t } from '$lib/i18n';

    interface Player {
        studentId: string;
        studentName: string;
    }

    interface Pairing {
        whiteStudentId: string;
        blackStudentId: string;
        result?: string;
        bye?: boolean;
        pointsWhite?: number;
        pointsBlack?: number;
    }

    let { players = [], pairings = [] }: { players: Player[], pairings: Pairing[] } = $props();

    // Helper to get result between two players
    const getResult = (p1Id: string, p2Id: string) => {
        if (p1Id === p2Id) return null; // Diagonal
        
        const pairing = pairings.find(p => 
            (p.whiteStudentId === p1Id && p.blackStudentId === p2Id) ||
            (p.whiteStudentId === p2Id && p.blackStudentId === p1Id)
        );

        if (!pairing || pairing.result === undefined) return '';

        const isWhite = pairing.whiteStudentId === p1Id;
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
            if (p.whiteStudentId === playerId) pts += p.pointsWhite || 0;
            if (p.blackStudentId === playerId) pts += p.pointsBlack || 0;
        });
        return pts;
    };

    // Sort players by points for the crosstable display (optional, usually by seed or name)
    let sortedPlayers = $derived([...players].sort((a,b) => a.studentName.localeCompare(b.studentName)));
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
            {#each sortedPlayers as player, i}
                <tr class="border-b border-zinc-800/30 hover:bg-zinc-900/40 transition-colors group">
                    <td class="p-4 text-xs font-black text-zinc-500 tabular-nums">{i + 1}</td>
                    <td class="p-4">
                        <span class="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                            {player.studentName}
                        </span>
                    </td>
                    {#each sortedPlayers as opponent}
                        <td class="p-0 border-x border-zinc-900/30">
                            <div class="h-10 w-10 flex items-center justify-center text-xs font-black tabular-nums">
                                {#if player.studentId === opponent.studentId}
                                    <div class="w-full h-full bg-zinc-900/80"></div>
                                {:else}
                                    {@const res = getResult(player.studentId, opponent.studentId)}
                                    <span class="{res === '1' ? 'text-violet-400' : res === '0' ? 'text-zinc-600' : 'text-zinc-400'}">
                                        {res || '-'}
                                    </span>
                                {/if}
                            </div>
                        </td>
                    {/each}
                    <td class="p-4 text-center">
                        <span class="text-xs font-black text-violet-400 tabular-nums">
                            {getPoints(player.studentId)}
                        </span>
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
