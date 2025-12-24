<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        appStore,
        storeActions,
        type Tournament,
        type Match,
    } from "$lib/services/storage";
    import {
        Trophy,
        Users,
        Calendar,
        Plus,
        Swords,
        Trophy as TrophyIcon,
        UserPlus,
        Save,
        ArrowLeft,
        Trash2,
        Flag,
        Monitor,
        Printer,
        Download,
        FileText,
    } from "lucide-svelte";
    import {
        exportStandingsPDF,
        exportPairingsPDF,
    } from "$lib/services/export";
    import { slide, fade } from "svelte/transition";
    import { base } from "$app/paths";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let tournamentId = $page.params.id;
    let tournament: Tournament | undefined;

    // Tabs
    let activeTab: "participants" | "matches" | "standings" = "participants";

    // Manage Participants State
    let studentSearchTerm = "";

    // Derived Data
    $: tournament = store.tournaments.find((t) => t.id === tournamentId);
    $: participants = tournament
        ? store.students.filter((s) => tournament?.participants.includes(s.id))
        : [];
    $: availableStudents = tournament
        ? store.students.filter(
              (s) =>
                  !tournament?.participants.includes(s.id) &&
                  s.name
                      .toLowerCase()
                      .includes(studentSearchTerm.toLowerCase()),
          )
        : [];

    // Matches Logic

    $: rounds = tournament
        ? [...new Set(tournament.matches.map((m) => m.round))].sort(
              (a, b) => a - b,
          )
        : [];

    function finishTournament() {
        if (!tournament) return;
        if (
            confirm(
                "¿Estás seguro de finalizar el torneo? No se podrán crear más rondas.",
            )
        ) {
            storeActions.updateTournament({
                ...tournament,
                status: "Completed",
            });
        }
    }

    function deleteTournament() {
        if (!tournament) return;
        if (
            confirm(
                "ATENCIÓN: ¿Eliminar este torneo y todos sus datos? Esta acción es irreversible.",
            )
        ) {
            storeActions.removeTournament(tournament.id);
            goto(`${base}/panel/torneos`);
        }
    }

    function addParticipant(studentId: string) {
        if (!tournament) return;
        const updatedTournament = {
            ...tournament,
            participants: [...tournament.participants, studentId],
        };
        storeActions.updateTournament(updatedTournament);
    }

    function removeParticipant(studentId: string) {
        if (!tournament) return;
        const updatedTournament = {
            ...tournament,
            participants: tournament.participants.filter(
                (id) => id !== studentId,
            ),
        };
        storeActions.updateTournament(updatedTournament);
    }

    function generatePairings() {
        if (!tournament || participants.length < 2) return;

        const nextRound = rounds.length > 0 ? Math.max(...rounds) + 1 : 1;
        const newMatches: Match[] = [];

        // 1. Calculate Current Points for Pairing
        const playerStats = participants.map((p) => {
            let points = 0;
            tournament?.matches.forEach((m) => {
                if (m.result) {
                    if (m.whiteId === p.id) {
                        if (m.result === "1-0") points += 1;
                        if (m.result === "0.5-0.5") points += 0.5;
                    }
                    if (m.blackId === p.id) {
                        if (m.result === "0-1") points += 1;
                        if (m.result === "0.5-0.5") points += 0.5;
                    }
                }
            });
            return { ...p, points };
        });

        // 2. Sort by Points Descending (Swiss Standard)
        // Add random sort for tie-breaking initial rounds or same scores
        let pool = [...playerStats].sort(
            (a, b) => b.points - a.points || 0.5 - Math.random(),
        );

        // 3. Pairing Loop
        while (pool.length > 0) {
            const p1 = pool.shift()!;

            if (pool.length === 0) {
                // Last player gets a Bye (if odd number)
                newMatches.push({
                    id: crypto.randomUUID(),
                    round: nextRound,
                    whiteId: p1.id,
                    blackId: "BYE",
                    result: "1-0", // Auto-win
                });
                break;
            }

            // Find first opponent in the sorted pool they haven't played against
            let p2Index = 0;
            let foundUnplayed = false;

            for (let i = 0; i < pool.length; i++) {
                const candidate = pool[i];
                const hasPlayed = tournament.matches.some(
                    (m) =>
                        (m.whiteId === p1.id && m.blackId === candidate.id) ||
                        (m.blackId === p1.id && m.whiteId === candidate.id),
                );

                if (!hasPlayed) {
                    p2Index = i;
                    foundUnplayed = true;
                    break;
                }
            }

            // If everyone left has been played, fallback to the first available (Score Group priority)
            // Ideally we would backtrack, but for MVP we allow repeat or suboptimal pairing
            const p2 = pool.splice(p2Index, 1)[0];

            newMatches.push({
                id: crypto.randomUUID(),
                round: nextRound,
                whiteId: p1.id,
                blackId: p2.id,
                result: null,
            });
        }

        const updatedTournament = {
            ...tournament,
            status: "Ongoing" as const,
            matches: [...tournament.matches, ...newMatches],
        };
        storeActions.updateTournament(updatedTournament);
    }

    function updateMatchResult(
        matchId: string,
        result: "1-0" | "0-1" | "0.5-0.5",
    ) {
        if (!tournament) return;

        const updatedMatches = tournament.matches.map((m) =>
            m.id === matchId ? { ...m, result } : m,
        );

        storeActions.updateTournament({
            ...tournament,
            matches: updatedMatches,
        });
    }

    // Standings Logic (with Buchholz Tie-Break)
    $: standings = (() => {
        if (!tournament) return [];

        // Pass 1: Calculate Points
        const pointsMap = new Map<string, number>();
        participants.forEach((p) => pointsMap.set(p.id, 0));
        // Add BYE to map with 0 points (it effectively gives no buchholz, which is standard or customized)
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

        // Pass 2: Calculate Stats & Buchholz
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
                        // Add opponent's points to my Buchholz
                        buchholz += pointsMap.get(opponentId) || 0;
                    }
                });

                return { ...p, points: myPoints, buchholz, games };
            })
            .sort((a, b) => b.points - a.points || b.buchholz - a.buchholz);
    })();

    function getStudentName(id: string) {
        if (id === "BYE") return "Descanso (Bye)";
        return store.students.find((s) => s.id === id)?.name || "Desconocido";
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if !tournament}
        <div class="text-center text-slate-500 mt-20">
            <h2 class="text-2xl font-bold text-white mb-4">
                Torneo no encontrado
            </h2>
            <a
                href="{base}/panel/torneos"
                class="text-emerald-400 hover:underline">Volver a la lista</a
            >
        </div>
    {:else}
        <!-- Header -->
        <div class="mb-8">
            <a
                href="{base}/panel/torneos"
                class="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
            >
                <ArrowLeft class="w-4 h-4 mr-1" /> Volver
            </a>
            <div
                class="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <div class="flex items-center gap-3">
                        <Trophy class="w-10 h-10 text-orange-500" />
                        <h1 class="text-3xl font-bold text-white">
                            {tournament.name}
                        </h1>
                    </div>
                    <div class="flex gap-4 mt-2 text-slate-400 text-sm">
                        <span class="flex items-center gap-1"
                            ><Calendar class="w-4 h-4" />
                            {tournament.date}</span
                        >
                        <span class="flex items-center gap-1"
                            ><Swords class="w-4 h-4" />
                            {tournament.format}</span
                        >
                        <span
                            class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase to-xs font-bold"
                        >
                            {tournament.status === "Ongoing"
                                ? "En Curso"
                                : tournament.status === "Completed"
                                  ? "Finalizado"
                                  : "Próximo"}
                        </span>
                    </div>
                </div>
                <div class="flex gap-2 self-start md:self-center">
                    <a
                        href="{base}/panel/torneos/{tournament.id}/spectator"
                        target="_blank"
                        class="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Monitor class="w-4 h-4" /> Modo Espectador
                    </a>
                    {#if tournament.status === "Ongoing"}
                        <button
                            onclick={finishTournament}
                            class="bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                        >
                            <Flag class="w-4 h-4" /> Finalizar
                        </button>
                    {/if}
                    <button
                        onclick={deleteTournament}
                        class="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Trash2 class="w-4 h-4" /> Eliminar
                    </button>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <div class="flex gap-2 mb-8 border-b border-slate-700">
            <button
                onclick={() => (activeTab = "participants")}
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'participants'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'}"
            >
                Participantes ({participants.length})
            </button>
            <button
                onclick={() => (activeTab = "matches")}
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'matches'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'}"
            >
                Rondas y Partidas
            </button>
            <button
                onclick={() => (activeTab = "standings")}
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'standings'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'}"
            >
                Clasificación
            </button>
        </div>

        <!-- Content -->

        <!-- PARTICIPANTS TAB -->
        {#if activeTab === "participants"}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" transition:fade>
                <!-- List -->
                <div
                    class="lg:col-span-2 bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
                >
                    <div
                        class="p-4 bg-slate-900/50 border-b border-slate-700 font-bold text-slate-300"
                    >
                        Jugadores Inscritos
                    </div>
                    {#if participants.length === 0}
                        <div class="p-12 text-center text-slate-500">
                            No hay jugadores inscritos aún.
                        </div>
                    {:else}
                        <div class="divide-y divide-slate-700">
                            {#each participants as p, i}
                                <div
                                    class="p-4 flex justify-between items-center hover:bg-slate-800/30"
                                >
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="text-slate-500 font-mono text-sm w-6"
                                        >
                                            #{i + 1}
                                        </div>
                                        <div class="font-medium text-white">
                                            {p.name}
                                        </div>
                                        <span
                                            class="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded"
                                            >{p.level}</span
                                        >
                                    </div>
                                    <button
                                        onclick={() => removeParticipant(p.id)}
                                        class="text-slate-500 hover:text-red-400 text-xs font-bold uppercase transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                <!-- Add Panel -->
                <div
                    class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 h-fit"
                >
                    <h3
                        class="font-bold text-white mb-4 flex items-center gap-2"
                    >
                        <UserPlus class="w-5 h-5 text-emerald-400" /> Añadir Jugador
                    </h3>
                    <input
                        bind:value={studentSearchTerm}
                        type="text"
                        placeholder="Buscar alumno..."
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white mb-4 focus:border-emerald-500 outline-none"
                    />
                    <div
                        class="max-h-96 overflow-y-auto custom-scrollbar space-y-2"
                    >
                        {#if availableStudents.length === 0}
                            <div
                                class="text-slate-500 text-sm text-center py-4"
                            >
                                {studentSearchTerm
                                    ? "No encontrado"
                                    : "Busca para añadir"}
                            </div>
                        {:else}
                            {#each availableStudents as s}
                                <button
                                    onclick={() => addParticipant(s.id)}
                                    class="w-full text-left bg-slate-900 hover:bg-slate-700 border border-slate-700/50 p-3 rounded-lg flex justify-between items-center group transition-colors"
                                >
                                    <span class="text-slate-300 text-sm"
                                        >{s.name}</span
                                    >
                                    <Plus
                                        class="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100"
                                    />
                                </button>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        {/if}

        <!-- MATCHES TAB -->
        {#if activeTab === "matches"}
            <div transition:fade>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-white">Partidas</h2>

                    {#if rounds.length > 0}
                        {@const currentRoundNum = Math.max(...rounds)}
                        {@const matchesInRound = tournament.matches.filter(
                            (m) => m.round === currentRoundNum,
                        )}
                        {@const allCompleted = matchesInRound.every(
                            (m) => m.result,
                        )}

                        <div class="flex gap-2 items-center">
                            {#if !allCompleted}
                                <span
                                    class="text-xs text-amber-500 font-bold px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20"
                                >
                                    Ronda {currentRoundNum} en curso
                                </span>
                            {/if}
                            <button
                                onclick={generatePairings}
                                disabled={!allCompleted}
                                class="px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors {allCompleted
                                    ? 'bg-orange-600 hover:bg-orange-500 text-white cursor-pointer'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}"
                                title={!allCompleted
                                    ? "Completa todos los resultados antes de la siguiente ronda"
                                    : "Generar siguiente ronda"}
                            >
                                <Swords class="w-4 h-4" /> Generar Nueva Ronda
                            </button>
                        </div>
                    {:else}
                        <button
                            onclick={generatePairings}
                            class="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
                        >
                            <Swords class="w-4 h-4" /> Generar Primera Ronda
                        </button>
                    {/if}
                </div>

                {#if rounds.length === 0}
                    <div
                        class="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500"
                    >
                        <p>No se han generado rondas todavía.</p>
                        <p class="text-sm mt-2">
                            Asegúrate de tener participantes inscritos.
                        </p>
                    </div>
                {:else}
                    <div class="space-y-8">
                        {#each rounds.slice().reverse() as round}
                            <div
                                class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
                            >
                                <div
                                    class="px-6 py-4 bg-slate-900/50 border-b border-slate-700 font-bold text-orange-400 flex justify-between items-center"
                                >
                                    <span>Ronda {round}</span>
                                    <button
                                        onclick={() =>
                                            exportPairingsPDF(
                                                tournament!,
                                                round - 1,
                                                getStudentName,
                                            )}
                                        class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-600"
                                    >
                                        <Printer class="w-3 h-3" /> Imprimir
                                    </button>
                                </div>
                                <div class="divide-y divide-slate-700">
                                    {#each tournament.matches.filter((m) => m.round === round) as match}
                                        <div
                                            class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center hover:bg-slate-800/30"
                                        >
                                            <!-- White -->
                                            <div
                                                class="flex items-center justify-end gap-3 md:border-r border-slate-700/50 pr-4"
                                            >
                                                <span
                                                    class="font-bold text-white"
                                                    >{getStudentName(
                                                        match.whiteId,
                                                    )}</span
                                                >
                                                <div
                                                    class="w-3 h-3 rounded-full bg-white border border-slate-400"
                                                ></div>
                                            </div>

                                            <!-- Result Controls -->
                                            <div
                                                class="flex justify-center gap-2"
                                            >
                                                <button
                                                    onclick={() =>
                                                        updateMatchResult(
                                                            match.id,
                                                            "1-0",
                                                        )}
                                                    class="px-3 py-1 rounded text-xs font-bold border transition-colors {match.result ===
                                                    '1-0'
                                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                                        : 'border-slate-600 text-slate-400 hover:text-white'}"
                                                >
                                                    1 - 0
                                                </button>
                                                <button
                                                    onclick={() =>
                                                        updateMatchResult(
                                                            match.id,
                                                            "0.5-0.5",
                                                        )}
                                                    class="px-3 py-1 rounded text-xs font-bold border transition-colors {match.result ===
                                                    '0.5-0.5'
                                                        ? 'bg-blue-600 border-blue-600 text-white'
                                                        : 'border-slate-600 text-slate-400 hover:text-white'}"
                                                >
                                                    ½ - ½
                                                </button>
                                                <button
                                                    onclick={() =>
                                                        updateMatchResult(
                                                            match.id,
                                                            "0-1",
                                                        )}
                                                    class="px-3 py-1 rounded text-xs font-bold border transition-colors {match.result ===
                                                    '0-1'
                                                        ? 'bg-red-600 border-red-600 text-white'
                                                        : 'border-slate-600 text-slate-400 hover:text-white'}"
                                                >
                                                    0 - 1
                                                </button>
                                            </div>

                                            <!-- Black -->
                                            <div
                                                class="flex items-center gap-3 md:border-l border-slate-700/50 pl-4"
                                            >
                                                <div
                                                    class="w-3 h-3 rounded-full bg-black border border-slate-600"
                                                ></div>
                                                <span
                                                    class="font-bold text-white"
                                                    >{getStudentName(
                                                        match.blackId,
                                                    )}</span
                                                >
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}

        {#if activeTab === "standings"}
            <div
                class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
                transition:fade
            >
                <div
                    class="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center"
                >
                    <h3 class="font-bold text-slate-300">
                        Tabla de Posiciones
                    </h3>
                    <button
                        onclick={() => {
                            const currentRound =
                                rounds.length > 0 ? Math.max(...rounds) : 0;
                            exportStandingsPDF(
                                tournament!,
                                getStudentName,
                                currentRound,
                                rounds.length || 0,
                            );
                        }}
                        class="bg-orange-600/20 text-orange-400 border border-orange-600/30 hover:bg-orange-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Download class="w-4 h-4" /> Exportar PDF
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead
                            class="bg-slate-900/50 text-slate-400 font-medium text-sm uppercase"
                        >
                            <tr>
                                <th class="p-4 w-16">Pos</th>
                                <th class="p-4">Jugador</th>
                                <th class="p-4 text-center">Partidas</th>
                                <th class="p-4 text-right">Puntos</th>
                                <th
                                    class="p-4 text-right text-xs"
                                    title="Buchholz: Suma de puntos de los rivales"
                                    >Desempate</th
                                >
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-700">
                            {#each standings as p, i}
                                <tr class="hover:bg-slate-800/30">
                                    <td class="p-4 text-slate-500 font-mono">
                                        {#if i === 0}<TrophyIcon
                                                class="w-5 h-5 text-yellow-500 inline"
                                            />{:else}#{i + 1}{/if}
                                    </td>
                                    <td class="p-4 font-bold text-white"
                                        >{p.name}</td
                                    >
                                    <td class="p-4 text-center text-slate-400"
                                        >{p.games}</td
                                    >
                                    <td
                                        class="p-4 text-right text-orange-400 font-bold text-lg"
                                        >{p.points}</td
                                    >
                                    <td
                                        class="p-4 text-right text-slate-500 text-sm font-mono"
                                    >
                                        {p.buchholz}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}
    {/if}
</div>
