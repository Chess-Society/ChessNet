<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { appStore, type Tournament } from "$lib/services/storage";
    import { Trophy, Medal, TrendingUp, Users, RefreshCw } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let tournamentId = $page.params.id;
    let tournament: Tournament | undefined;
    let autoRefresh = true;
    let lastUpdate = new Date();

    // Auto-refresh every 10 seconds
    let refreshInterval: ReturnType<typeof setInterval>;

    onMount(() => {
        if (autoRefresh) {
            refreshInterval = setInterval(() => {
                lastUpdate = new Date();
            }, 10000);
        }

        return () => {
            if (refreshInterval) clearInterval(refreshInterval);
        };
    });

    $: tournament = store.tournaments.find((t) => t.id === tournamentId);
    $: participants = tournament
        ? store.students.filter((s) => tournament?.participants.includes(s.id))
        : [];

    // Calculate standings
    $: standings = (() => {
        if (!tournament) return [];

        const pointsMap = new Map<string, number>();
        participants.forEach((p) => pointsMap.set(p.id, 0));
        pointsMap.set("BYE", 0);

        tournament.matches.forEach((m) => {
            if (m.result) {
                const w = pointsMap.get(m.whiteId) || 0;
                const b = pointsMap.get(m.blackId) || 0;

                if (m.result === "1-0") pointsMap.set(m.whiteId, w + 1);
                else if (m.result === "0-1") pointsMap.set(m.blackId, b + 1);
                else if (m.result === "0.5-0.5") {
                    pointsMap.set(m.whiteId, w + 0.5);
                    pointsMap.set(m.blackId, b + 0.5);
                }
            }
        });

        return participants
            .map((p) => {
                const myPoints = pointsMap.get(p.id) || 0;
                let buchholz = 0;
                let games = 0;

                tournament?.matches.forEach((m) => {
                    const isWhite = m.whiteId === p.id;
                    const isBlack = m.blackId === p.id;

                    if (isWhite || isBlack) {
                        games++;
                        const opponentId = isWhite ? m.blackId : m.whiteId;
                        buchholz += pointsMap.get(opponentId) || 0;
                    }
                });

                return {
                    student: p,
                    points: myPoints,
                    buchholz,
                    games,
                };
            })
            .sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                return b.buchholz - a.buchholz;
            });
    })();

    $: currentRound = tournament
        ? Math.max(...tournament.matches.map((m) => m.round), 0)
        : 0;
    $: totalRounds = tournament?.format === "Suizo" ? 5 : 0; // Configurable
</script>

<svelte:head>
    <title
        >{tournament?.name || "Torneo"} - Clasificación en Vivo | ChessNet</title
    >
</svelte:head>

<div
    class="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-4 md:p-8"
>
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-8" transition:fade>
        <div class="text-center mb-6">
            <div class="inline-flex items-center gap-3 mb-4">
                <div
                    class="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl"
                >
                    <Trophy class="w-10 h-10 text-white" />
                </div>
            </div>
            <h1
                class="text-4xl md:text-6xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2"
            >
                {tournament?.name || "Torneo"}
            </h1>
            <p class="text-slate-400 text-lg">
                {tournament?.date
                    ? new Date(tournament.date).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                      })
                    : ""}
            </p>
        </div>

        <!-- Tournament Info Bar -->
        <div class="flex flex-wrap justify-center gap-4 mb-6">
            <div
                class="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
            >
                <span class="text-slate-400 text-sm">Formato:</span>
                <span class="ml-2 font-semibold"
                    >{tournament?.format || "N/A"}</span
                >
            </div>
            <div
                class="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
            >
                <span class="text-slate-400 text-sm">Ronda:</span>
                <span class="ml-2 font-semibold"
                    >{currentRound} / {totalRounds || "?"}</span
                >
            </div>
            <div
                class="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
            >
                <span class="text-slate-400 text-sm">Participantes:</span>
                <span class="ml-2 font-semibold">{participants.length}</span>
            </div>
            <div
                class="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
            >
                <span class="text-slate-400 text-sm">Estado:</span>
                <span class="ml-2 font-semibold capitalize"
                    >{tournament?.status || "N/A"}</span
                >
            </div>
        </div>

        <!-- Auto-refresh indicator -->
        <div
            class="flex justify-center items-center gap-2 text-sm text-slate-500"
        >
            <RefreshCw class="w-4 h-4 {autoRefresh ? 'animate-spin' : ''}" />
            <span>Actualización automática cada 10s</span>
            <span class="text-slate-600"
                >• Última actualización: {lastUpdate.toLocaleTimeString()}</span
            >
        </div>
    </div>

    <!-- Podium (Top 3) -->
    {#if standings.length >= 3}
        <div
            class="max-w-5xl mx-auto mb-8 px-2"
            transition:fly={{ y: 20, delay: 200 }}
        >
            <div class="grid grid-cols-3 gap-2 md:gap-4 items-end">
                <!-- 2nd Place -->
                <div class="text-center">
                    <div class="relative mb-4">
                        <div
                            class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center border-4 border-slate-700"
                        >
                            <span class="text-3xl font-black text-white">2</span
                            >
                        </div>
                        <div class="absolute -top-2 -right-2">
                            <Medal class="w-8 h-8 text-slate-400" />
                        </div>
                    </div>
                    <div
                        class="bg-slate-800/50 border border-slate-700 rounded-lg md:rounded-xl p-2 md:p-4 h-24 md:h-32 flex flex-col justify-center"
                    >
                        <h3
                            class="font-bold text-xs md:text-lg mb-0.5 md:mb-1 truncate px-1"
                        >
                            {standings[1].student.name}
                        </h3>
                        <p
                            class="text-lg md:text-2xl font-black text-slate-400"
                        >
                            {standings[1].points}
                        </p>
                        <p class="text-[10px] md:text-xs text-slate-500">
                            puntos
                        </p>
                    </div>
                </div>

                <!-- 1st Place -->
                <div class="text-center -mt-4 md:-mt-8">
                    <div class="relative mb-4">
                        <div
                            class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-4 border-yellow-500 shadow-lg shadow-yellow-500/50"
                        >
                            <span class="text-4xl font-black text-white">1</span
                            >
                        </div>
                        <div class="absolute -top-2 -right-2">
                            <Trophy class="w-10 h-10 text-yellow-400" />
                        </div>
                    </div>
                    <div
                        class="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-lg md:rounded-xl p-3 md:p-6 h-28 md:h-40 flex flex-col justify-center"
                    >
                        <h3
                            class="font-bold text-sm md:text-xl mb-1 md:mb-2 truncate px-1"
                        >
                            {standings[0].student.name}
                        </h3>
                        <p
                            class="text-2xl md:text-4xl font-black text-yellow-400"
                        >
                            {standings[0].points}
                        </p>
                        <p class="text-xs md:text-sm text-yellow-300">puntos</p>
                    </div>
                </div>

                <!-- 3rd Place -->
                <div class="text-center">
                    <div class="relative mb-4">
                        <div
                            class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center border-4 border-orange-700"
                        >
                            <span class="text-3xl font-black text-white">3</span
                            >
                        </div>
                        <div class="absolute -top-2 -right-2">
                            <Medal class="w-8 h-8 text-orange-400" />
                        </div>
                    </div>
                    <div
                        class="bg-slate-800/50 border border-slate-700 rounded-lg md:rounded-xl p-2 md:p-4 h-24 md:h-32 flex flex-col justify-center"
                    >
                        <h3
                            class="font-bold text-xs md:text-lg mb-0.5 md:mb-1 truncate px-1"
                        >
                            {standings[2].student.name}
                        </h3>
                        <p
                            class="text-lg md:text-2xl font-black text-orange-400"
                        >
                            {standings[2].points}
                        </p>
                        <p class="text-[10px] md:text-xs text-slate-500">
                            puntos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Full Standings Table -->
    <div class="max-w-6xl mx-auto" transition:fly={{ y: 20, delay: 400 }}>
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp class="w-6 h-6 text-emerald-500" />
            Clasificación Completa
        </h2>

        <div
            class="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden"
        >
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-900/50 border-b border-slate-700">
                            <th
                                class="px-6 py-4 text-left text-sm font-semibold text-slate-400"
                                >#</th
                            >
                            <th
                                class="px-6 py-4 text-left text-sm font-semibold text-slate-400"
                                >Jugador</th
                            >
                            <th
                                class="px-6 py-4 text-center text-sm font-semibold text-slate-400"
                                >Puntos</th
                            >
                            <th
                                class="px-6 py-4 text-center text-sm font-semibold text-slate-400"
                                >Buchholz</th
                            >
                            <th
                                class="px-6 py-4 text-center text-sm font-semibold text-slate-400"
                                >Partidas</th
                            >
                        </tr>
                    </thead>
                    <tbody>
                        {#each standings as standing, index}
                            <tr
                                class="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors {index <
                                3
                                    ? 'bg-slate-800/20'
                                    : ''}"
                            >
                                <td class="px-6 py-4">
                                    <span
                                        class="text-2xl font-black {index === 0
                                            ? 'text-yellow-400'
                                            : index === 1
                                              ? 'text-slate-400'
                                              : index === 2
                                                ? 'text-orange-400'
                                                : 'text-slate-600'}"
                                    >
                                        {index + 1}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold"
                                        >
                                            {standing.student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p class="font-semibold text-white">
                                                {standing.student.name}
                                            </p>
                                            {#if standing.student.level}
                                                <p
                                                    class="text-xs text-slate-500"
                                                >
                                                    {standing.student.level}
                                                </p>
                                            {/if}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="text-2xl font-black text-white"
                                        >{standing.points}</span
                                    >
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="text-lg text-slate-400"
                                        >{standing.buchholz.toFixed(1)}</span
                                    >
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="text-lg text-slate-400"
                                        >{standing.games}</span
                                    >
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="max-w-6xl mx-auto mt-12 text-center text-slate-500 text-sm">
        <p>
            Powered by <span class="font-semibold text-emerald-500"
                >ChessNet</span
            >
        </p>
        <p class="mt-1">Gestión profesional de torneos de ajedrez</p>
    </div>
</div>
