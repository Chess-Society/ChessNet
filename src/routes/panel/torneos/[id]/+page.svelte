<script lang="ts">
    import { page } from "$app/stores";
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import { notifications } from "$lib/stores/notifications";
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
        Medal,
        Clock,
        Target,
        User,
        MoreVertical,
        ChevronRight,
    } from "lucide-svelte";
    import {
        exportStandingsPDF,
        exportPairingsPDF,
    } from "$lib/services/export";
    import { slide, fade, scale, fly } from "svelte/transition";
    import { base } from "$app/paths";
    import ConfirmationModal from "$lib/components/ConfirmationModal.svelte";

    const RESULT_OPTIONS: ("1-0" | "0-1" | "0.5-0.5")[] = [
        "1-0",
        "0.5-0.5",
        "0-1",
    ];

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

    $: currentRound = rounds.length > 0 ? Math.max(...rounds) : 0;

    // Leader logic
    $: leader = standings.length > 0 ? standings[0] : null;

    // Modal State
    let showConfirmModal = false;
    let confirmTitle = "";
    let confirmMessage = "";
    let confirmAction: (() => void) | null = null;
    let confirmType: "danger" | "warning" | "info" = "danger";
    let confirmBtnText = "Confirmar";

    function finishTournament() {
        if (!tournament) return;
        confirmTitle = "¿Finalizar Torneo?";
        confirmMessage =
            "¿Estás seguro de finalizar el torneo? No se podrán crear más rondas y se calcularán los resultados finales.";
        confirmType = "warning";
        confirmBtnText = "Finalizar";
        confirmAction = () => {
            storeActions.updateTournament({
                ...tournament!,
                status: "Completed",
            });
            notifications.success("Torneo finalizado.");
        };
        showConfirmModal = true;
    }

    function deleteTournament() {
        if (!tournament) return;
        confirmTitle = "Eliminar Torneo";
        confirmMessage =
            "ATENCIÓN: ¿Eliminar este torneo y todos sus datos? Esta acción es irreversible.";
        confirmType = "danger";
        confirmBtnText = "Eliminar";
        confirmAction = () => {
            storeActions.removeTournament(tournament!.id);
            goto(`${base}/panel/torneos`);
            notifications.success("Torneo eliminado.");
        };
        showConfirmModal = true;
    }

    function handleConfirmAction() {
        if (confirmAction) confirmAction();
        showConfirmModal = false;
    }

    function addParticipant(studentId: string) {
        if (!tournament) return;
        const updatedTournament = {
            ...tournament,
            participants: [...tournament.participants, studentId],
        };
        storeActions.updateTournament(updatedTournament);
        notifications.success("Jugador añadido");
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
        notifications.success("Jugador eliminado");
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
        activeTab = "matches"; // Switch to matches tab
        notifications.success(`Ronda ${nextRound} generada`);
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

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
        <!-- Top Nav -->
        <a
            href="{base}/panel/torneos"
            class="inline-flex items-center text-slate-400 hover:text-white transition-colors"
        >
            <ArrowLeft class="w-4 h-4 mr-2" /> Volver a Torneos
        </a>

        <!-- Premium Header Panel -->
        <div
            class="bg-[#1e293b] border border-slate-700/50 rounded-3xl p-6 lg:p-8 relative overflow-hidden"
        >
            <!-- Background Decoration -->
            <div
                class="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            ></div>

            <div
                class="relative z-10 flex flex-col md:flex-row justify-between gap-6"
            >
                <!-- Branding & Title -->
                <div class="flex-1">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider mb-4
                        {tournament.status === 'Ongoing'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : tournament.status === 'Completed'
                              ? 'text-slate-400'
                              : 'text-blue-400 border-blue-500/30'}"
                    >
                        <span
                            class="w-2 h-2 rounded-full {tournament.status ===
                            'Ongoing'
                                ? 'bg-emerald-500 animate-pulse'
                                : 'bg-current'}"
                        ></span>
                        {tournament.status === "Ongoing"
                            ? "Torneo En Curso"
                            : tournament.status === "Completed"
                              ? "Torneo Finalizado"
                              : "Inscripción Abierta"}
                    </div>

                    <h1
                        class="text-4xl font-bold text-white mb-4 flex items-center gap-4"
                    >
                        {tournament.name}
                        {#if tournament.status === "Completed"}
                            <Medal class="w-8 h-8 text-yellow-500" />
                        {/if}
                    </h1>

                    <div class="flex flex-wrap gap-4 text-slate-400 text-sm">
                        <div
                            class="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg"
                        >
                            <Calendar class="w-4 h-4 text-slate-500" />
                            {new Date(tournament.date).toLocaleDateString()}
                        </div>
                        <div
                            class="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg"
                        >
                            <Swords class="w-4 h-4 text-slate-500" />
                            {tournament.format}
                        </div>
                        <div
                            class="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg"
                        >
                            <Users class="w-4 h-4 text-slate-500" />
                            {participants.length} Participantes
                        </div>
                    </div>
                </div>

                <!-- Quick Stats / Leader -->
                <div class="flex gap-4">
                    {#if leader}
                        <div
                            class="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 min-w-[160px]"
                        >
                            <div
                                class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2"
                            >
                                Líder Actual
                            </div>
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-yellow-500"
                                >
                                    <Trophy class="w-5 h-5" />
                                </div>
                                <div>
                                    <div class="font-bold text-white text-lg">
                                        {leader.name.split(" ")[0]}
                                    </div>
                                    <div
                                        class="text-xs text-yellow-500 font-medium"
                                    >
                                        {leader.points} Pts
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}

                    <div
                        class="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 min-w-[140px]"
                    >
                        <div
                            class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2"
                        >
                            Rondas Jugadas
                        </div>
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500"
                            >
                                <Clock class="w-5 h-5" />
                            </div>
                            <div>
                                <div class="font-bold text-white text-2xl">
                                    {currentRound}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions Bar -->
            <div class="flex gap-2 mt-8 pt-6 border-t border-slate-700/50">
                <a
                    href="{base}/panel/torneos/{tournament.id}/spectator"
                    target="_blank"
                    class="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors border border-slate-700"
                >
                    <Monitor class="w-4 h-4" /> Modo Pantalla Gigante
                </a>

                <div class="flex-1"></div>

                {#if tournament.status === "Ongoing"}
                    <button
                        onclick={finishTournament}
                        class="bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Flag class="w-4 h-4" /> Finalizar Torneo
                    </button>
                {/if}
                <button
                    onclick={deleteTournament}
                    class="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                    <Trash2 class="w-4 h-4" /> Eliminar
                </button>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Sidebar / Tabs Navigation -->
            <div class="lg:col-span-1 space-y-4">
                <nav class="flex flex-col gap-2">
                    <button
                        onclick={() => (activeTab = "participants")}
                        class="w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group {activeTab ===
                        'participants'
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                            : 'bg-[#1e293b] text-slate-400 hover:bg-slate-800 border border-transparent hover:border-slate-700'}"
                    >
                        <span class="flex items-center gap-3">
                            <Users class="w-5 h-5" />
                            Participantes
                        </span>
                        <span
                            class="text-xs bg-black/20 px-2 py-0.5 rounded-full {activeTab ===
                            'participants'
                                ? 'text-white'
                                : 'text-slate-500'}">{participants.length}</span
                        >
                    </button>
                    <button
                        onclick={() => (activeTab = "matches")}
                        class="w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group {activeTab ===
                        'matches'
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                            : 'bg-[#1e293b] text-slate-400 hover:bg-slate-800 border border-transparent hover:border-slate-700'}"
                    >
                        <span class="flex items-center gap-3">
                            <Swords class="w-5 h-5" />
                            Rondas y Partidas
                        </span>
                        {#if currentRound > 0}
                            <span
                                class="text-xs bg-black/20 px-2 py-0.5 rounded-full {activeTab ===
                                'matches'
                                    ? 'text-white'
                                    : 'text-slate-500'}">R{currentRound}</span
                            >
                        {/if}
                    </button>
                    <button
                        onclick={() => (activeTab = "standings")}
                        class="w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group {activeTab ===
                        'standings'
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                            : 'bg-[#1e293b] text-slate-400 hover:bg-slate-800 border border-transparent hover:border-slate-700'}"
                    >
                        <span class="flex items-center gap-3">
                            <Target class="w-5 h-5" />
                            Clasificación
                        </span>
                    </button>
                </nav>

                <!-- Mini Stats / Info Box -->
                <div
                    class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5 mt-6"
                >
                    <h4 class="text-slate-300 font-bold mb-3 text-sm">
                        Detalles del Formato
                    </h4>
                    <ul class="space-y-3 text-sm text-slate-400">
                        <li
                            class="flex justify-between border-b border-slate-800 pb-2"
                        >
                            <span>Sistema</span>
                            <span class="text-white">{tournament.format}</span>
                        </li>
                        <li
                            class="flex justify-between border-b border-slate-800 pb-2"
                        >
                            <span>Puntuación</span>
                            <span class="text-white">1 / 0.5 / 0</span>
                        </li>
                        <li class="flex justify-between">
                            <span>Desempate</span>
                            <span class="text-white">Buchholz</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Content Area -->
            <div class="lg:col-span-3">
                <!-- PARTICIPANTS TAB -->
                {#if activeTab === "participants"}
                    <div transition:fade={{ duration: 200 }}>
                        <div
                            class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden min-h-[500px] flex flex-col"
                        >
                            <!-- Toolbar -->
                            <div
                                class="p-4 bg-slate-900/50 border-b border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center"
                            >
                                <h2
                                    class="font-bold text-white flex items-center gap-2"
                                >
                                    <Users class="w-5 h-5 text-orange-500" />
                                    Lista de Inscritos
                                </h2>

                                <div
                                    class="bg-slate-900 border border-slate-700 rounded-lg flex items-center px-3 py-2 w-full sm:w-64"
                                >
                                    <UserPlus
                                        class="w-4 h-4 text-slate-500 mr-2"
                                    />
                                    <input
                                        type="text"
                                        bind:value={studentSearchTerm}
                                        placeholder="Buscar para añadir..."
                                        class="bg-transparent border-none focus:outline-none text-white text-sm w-full placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <!-- Search Results Dropdown -->
                            {#if availableStudents.length > 0}
                                <div
                                    class="bg-slate-800 border-b border-slate-700 p-2 max-h-48 overflow-y-auto shadow-inner"
                                >
                                    <div
                                        class="text-xs font-bold text-slate-500 uppercase px-2 mb-2"
                                    >
                                        {studentSearchTerm
                                            ? "Resultados de búsqueda"
                                            : "Alumnos disponibles"}
                                    </div>
                                    <div
                                        class="grid grid-cols-1 sm:grid-cols-2 gap-2"
                                    >
                                        {#each availableStudents as s}
                                            <button
                                                onclick={() => {
                                                    addParticipant(s.id);
                                                    studentSearchTerm = "";
                                                }}
                                                class="flex items-center justify-between p-2 bg-slate-700/50 hover:bg-emerald-600/20 border border-slate-600 hover:border-emerald-500/50 rounded-lg group transition-all"
                                            >
                                                <span
                                                    class="text-sm text-slate-200"
                                                    >{s.name}</span
                                                >
                                                <Plus
                                                    class="w-4 h-4 text-emerald-400"
                                                />
                                            </button>
                                        {/each}
                                    </div>
                                </div>
                            {/if}

                            <!-- List -->
                            <div class="flex-1 overflow-x-auto">
                                {#if participants.length === 0}
                                    <div
                                        class="h-64 flex flex-col items-center justify-center text-slate-500"
                                    >
                                        <Users
                                            class="w-12 h-12 mb-3 opacity-20"
                                        />
                                        <p>
                                            No hay jugadores inscritos todavía.
                                        </p>
                                    </div>
                                {:else}
                                    <table
                                        class="w-full text-left border-collapse"
                                    >
                                        <thead
                                            class="bg-slate-900/30 text-slate-400 text-xs uppercase font-bold tracking-wider"
                                        >
                                            <tr>
                                                <th class="p-4 w-16 text-center"
                                                    >#</th
                                                >
                                                <th class="p-4">Jugador</th>
                                                <th class="p-4 w-32">Nivel</th>
                                                <th class="p-4 w-20 text-center"
                                                    >Acciones</th
                                                >
                                            </tr>
                                        </thead>
                                        <tbody
                                            class="divide-y divide-slate-700/50 text-sm"
                                        >
                                            {#each participants as p, i}
                                                <tr
                                                    class="hover:bg-slate-800/50 transition-colors group"
                                                >
                                                    <td
                                                        class="p-4 text-center text-slate-500 font-mono"
                                                        >{i + 1}</td
                                                    >
                                                    <td
                                                        class="p-4 font-medium text-white flex items-center gap-3"
                                                    >
                                                        <div
                                                            class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300"
                                                        >
                                                            {p.name.charAt(0)}
                                                        </div>
                                                        {p.name}
                                                    </td>
                                                    <td class="p-4">
                                                        <span
                                                            class="px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 text-xs"
                                                        >
                                                            {p.level}
                                                        </span>
                                                    </td>
                                                    <td class="p-4 text-center">
                                                        <button
                                                            onclick={() =>
                                                                removeParticipant(
                                                                    p.id,
                                                                )}
                                                            class="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                                            title="Eliminar del torneo"
                                                        >
                                                            <Trash2
                                                                class="w-4 h-4"
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- MATCHES TAB -->
                {#if activeTab === "matches"}
                    <div transition:fade={{ duration: 200 }}>
                        <!-- Toolbar -->
                        <div
                            class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
                        >
                            <h2
                                class="text-xl font-bold text-white flex items-center gap-2"
                            >
                                <Swords class="w-6 h-6 text-orange-500" />
                                Emparejamientos
                            </h2>

                            {#if rounds.length > 0}
                                {@const currentRoundNum = Math.max(...rounds)}
                                {@const matchesInRound =
                                    tournament.matches.filter(
                                        (m) => m.round === currentRoundNum,
                                    )}
                                {@const allCompleted = matchesInRound.every(
                                    (m) => m.result,
                                )}

                                <div class="flex gap-3 items-center">
                                    {#if !allCompleted}
                                        <div
                                            class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-xs font-bold uppercase animate-pulse"
                                        >
                                            <div
                                                class="w-2 h-2 rounded-full bg-amber-500"
                                            ></div>
                                            Ronda en curso
                                        </div>
                                    {/if}

                                    <button
                                        onclick={generatePairings}
                                        disabled={!allCompleted}
                                        class="px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 {allCompleted
                                            ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/20'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-50'}"
                                    >
                                        <Swords class="w-4 h-4" />
                                        {allCompleted
                                            ? "Siguiente Ronda"
                                            : "Completar Ronda"}
                                    </button>
                                </div>
                            {:else}
                                <button
                                    onclick={generatePairings}
                                    class="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 active:scale-95 btn-bounce"
                                >
                                    <Swords class="w-5 h-5" /> Generar Primera Ronda
                                </button>
                            {/if}
                        </div>

                        {#if rounds.length === 0}
                            <div
                                class="flex flex-col items-center justify-center p-12 bg-[#1e293b] border border-slate-700/50 rounded-2xl border-dashed"
                            >
                                <Swords class="w-16 h-16 text-slate-700 mb-4" />
                                <h3 class="text-xl font-bold text-white mb-2">
                                    Comienza la Acción
                                </h3>
                                <p class="text-slate-400 text-center max-w-sm">
                                    Genera la primera ronda para emparejar a los
                                    jugadores inscritos.
                                </p>
                            </div>
                        {:else}
                            <div class="space-y-8">
                                {#each rounds.slice().reverse() as round}
                                    <div
                                        class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden shadow-xl"
                                    >
                                        <!-- Round Header -->
                                        <div
                                            class="px-6 py-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center"
                                        >
                                            <h3
                                                class="font-bold text-lg text-white flex items-center gap-2"
                                            >
                                                <span
                                                    class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm border border-slate-700"
                                                    >{round}</span
                                                >
                                                Ronda {round}
                                            </h3>
                                            <button
                                                onclick={() =>
                                                    exportPairingsPDF(
                                                        tournament!,
                                                        round - 1,
                                                        getStudentName,
                                                    )}
                                                class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border border-slate-700 hover:bg-slate-800"
                                            >
                                                <Printer class="w-3 h-3" /> Imprimir
                                            </button>
                                        </div>

                                        <!-- Matches Grid -->
                                        <div
                                            class="p-4 grid gap-4 grid-cols-1 md:grid-cols-2"
                                        >
                                            {#each tournament.matches.filter((m) => m.round === round) as match, i (match.id)}
                                                {@const white =
                                                    store.students.find(
                                                        (s) =>
                                                            s.id ===
                                                            match.whiteId,
                                                    )}
                                                {@const black =
                                                    match.blackId === "BYE"
                                                        ? {
                                                              name: "Descanso (Bye)",
                                                              level: "",
                                                          }
                                                        : store.students.find(
                                                              (s) =>
                                                                  s.id ===
                                                                  match.blackId,
                                                          )}

                                                <div
                                                    in:fly={{
                                                        y: 20,
                                                        duration: 400,
                                                        delay: i * 50,
                                                    }}
                                                    class="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
                                                >
                                                    <div
                                                        class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                                    ></div>
                                                    <!-- Compact Layout -->
                                                    <div
                                                        class="relative p-4 flex flex-col gap-4"
                                                    >
                                                        <!-- Players and Actions Container -->
                                                        <div
                                                            class="flex flex-col sm:flex-row items-stretch gap-3"
                                                        >
                                                            <!-- Players Section -->
                                                            <div
                                                                class="flex-1 flex items-center justify-between gap-3 min-w-0"
                                                            >
                                                                <!-- White Player -->
                                                                <div
                                                                    class="flex items-center gap-2 flex-1 min-w-0"
                                                                >
                                                                    <div
                                                                        class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 p-0.5 shadow-lg flex-shrink-0"
                                                                    >
                                                                        <div
                                                                            class="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-black text-sm"
                                                                        >
                                                                            {white
                                                                                ? white
                                                                                      .name[0]
                                                                                : "?"}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        class="flex flex-col min-w-0"
                                                                    >
                                                                        <div
                                                                            class="font-bold text-white text-sm leading-tight truncate"
                                                                            title={white?.name}
                                                                        >
                                                                            {white
                                                                                ? white.name
                                                                                : "Desconocido"}
                                                                        </div>
                                                                        <span
                                                                            class="text-[10px] text-slate-400 uppercase tracking-wide"
                                                                            >Blancas</span
                                                                        >
                                                                    </div>
                                                                </div>

                                                                <!-- VS -->
                                                                <div
                                                                    class="flex-shrink-0 px-2"
                                                                >
                                                                    <span
                                                                        class="text-sm font-black italic text-slate-600"
                                                                        >VS</span
                                                                    >
                                                                </div>

                                                                <!-- Black Player -->
                                                                <div
                                                                    class="flex items-center gap-2 flex-1 min-w-0"
                                                                >
                                                                    <div
                                                                        class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 p-0.5 shadow-lg flex-shrink-0"
                                                                    >
                                                                        <div
                                                                            class="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-black text-sm"
                                                                        >
                                                                            {black
                                                                                ? black
                                                                                      .name[0]
                                                                                : "B"}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        class="flex flex-col min-w-0"
                                                                    >
                                                                        <div
                                                                            class="font-bold text-white text-sm leading-tight truncate"
                                                                            title={black?.name}
                                                                        >
                                                                            {black
                                                                                ? black.name
                                                                                : "Desconocido"}
                                                                        </div>
                                                                        <span
                                                                            class="text-[10px] text-slate-500 uppercase tracking-wide"
                                                                            >Negras</span
                                                                        >
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <!-- Result Buttons -->
                                                            {#if match.blackId !== "BYE"}
                                                                <div
                                                                    class="flex gap-1.5 bg-slate-900/40 p-1 rounded-lg border border-white/5 sm:min-w-[140px]"
                                                                >
                                                                    {#each RESULT_OPTIONS as res}
                                                                        <button
                                                                            onclick={() =>
                                                                                updateMatchResult(
                                                                                    match.id,
                                                                                    res,
                                                                                )}
                                                                            class="flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all duration-200 {match.result ===
                                                                            res
                                                                                ? 'bg-emerald-500 text-white shadow-lg'
                                                                                : 'text-slate-400 hover:text-white hover:bg-white/10'}"
                                                                        >
                                                                            {res ===
                                                                            "0.5-0.5"
                                                                                ? "½"
                                                                                : res}
                                                                        </button>
                                                                    {/each}
                                                                </div>
                                                            {:else}
                                                                <div
                                                                    class="text-center px-3 py-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 rounded-lg border border-emerald-500/20 sm:min-w-[140px]"
                                                                >
                                                                    Bye
                                                                </div>
                                                            {/if}
                                                        </div>
                                                    </div>
                                                    <!-- OLD_CONTENT_START -->
                                                    <div class="hidden">
                                                        <!-- Players Area -->
                                                        <div
                                                            class="flex items-center justify-between gap-4"
                                                        >
                                                            <!-- White Player -->
                                                            <div
                                                                class="flex-1 flex flex-col items-center text-center gap-3"
                                                            >
                                                                <div
                                                                    class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 p-1 shadow-lg shadow-white/5"
                                                                >
                                                                    <div
                                                                        class="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-black text-xl"
                                                                    >
                                                                        {white
                                                                            ? white
                                                                                  .name[0]
                                                                            : "?"}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    class="min-w-0 w-full"
                                                                >
                                                                    <div
                                                                        class="font-bold text-white text-base sm:text-lg leading-tight truncate px-1"
                                                                        title={white?.name}
                                                                    >
                                                                        {white
                                                                            ? white.name
                                                                            : "Desconocido"}
                                                                    </div>
                                                                    <div
                                                                        class="text-[10px] bg-slate-100/10 text-slate-300 px-2 py-0.5 rounded-full inline-block mt-1 font-bold uppercase tracking-wider"
                                                                    >
                                                                        Blancas
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <!-- VS Badge -->
                                                            <div
                                                                class="flex flex-col items-center justify-center z-10"
                                                            >
                                                                <span
                                                                    class="text-2xl font-black italic text-slate-700/50"
                                                                    >VS</span
                                                                >
                                                            </div>

                                                            <!-- Black Player -->
                                                            <div
                                                                class="flex-1 flex flex-col items-center text-center gap-3"
                                                            >
                                                                <div
                                                                    class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 p-1 shadow-lg shadow-black/50"
                                                                >
                                                                    <div
                                                                        class="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-black text-xl"
                                                                    >
                                                                        {black
                                                                            ? black
                                                                                  .name[0]
                                                                            : "B"}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    class="min-w-0 w-full"
                                                                >
                                                                    <div
                                                                        class="font-bold text-white text-base sm:text-lg leading-tight truncate px-1"
                                                                        title={black?.name}
                                                                    >
                                                                        {black
                                                                            ? black.name
                                                                            : "Desconocido"}
                                                                    </div>
                                                                    <div
                                                                        class="text-[10px] bg-black/30 text-slate-400 px-2 py-0.5 rounded-full inline-block mt-1 font-bold uppercase tracking-wider"
                                                                    >
                                                                        Negras
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- Action Buttons -->
                                                        {#if match.blackId !== "BYE"}
                                                            <div
                                                                class="grid grid-cols-3 gap-2 pt-4 border-t border-white/5"
                                                            >
                                                                {#each RESULT_OPTIONS as res}
                                                                    <button
                                                                        onclick={() =>
                                                                            updateMatchResult(
                                                                                match.id,
                                                                                res,
                                                                            )}
                                                                        class="py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 border {match.result ===
                                                                        res
                                                                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02]'
                                                                            : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'}"
                                                                    >
                                                                        {res ===
                                                                        "0.5-0.5"
                                                                            ? "½ - ½"
                                                                            : res}
                                                                    </button>
                                                                {/each}
                                                            </div>
                                                        {:else}
                                                            <div
                                                                class="text-center py-2 pt-4 border-t border-white/5 text-sm text-emerald-400 font-bold"
                                                            >
                                                                Victoria
                                                                Automática (Bye)
                                                            </div>
                                                        {/if}
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

                <!-- STANDINGS TAB -->
                {#if activeTab === "standings"}
                    <div
                        transition:fade={{ duration: 200 }}
                        class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden shadow-xl"
                    >
                        <div
                            class="p-5 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center"
                        >
                            <h3
                                class="font-bold text-white flex items-center gap-2"
                            >
                                <Target class="w-5 h-5 text-orange-500" />
                                Tabla de Posiciones
                            </h3>
                            <button
                                onclick={() => {
                                    const currentRound =
                                        rounds.length > 0
                                            ? Math.max(...rounds)
                                            : 0;
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
                            <table class="w-full text-left border-collapse">
                                <thead
                                    class="bg-slate-900/80 text-slate-400 font-bold text-xs uppercase tracking-wider"
                                >
                                    <tr>
                                        <th class="p-4 w-16 text-center">Pos</th
                                        >
                                        <th class="p-4">Jugador</th>
                                        <th class="p-4 text-center w-24"
                                            >Partidas</th
                                        >
                                        <th class="p-4 text-right w-24"
                                            >Puntos</th
                                        >
                                        <th
                                            class="p-4 text-right text-xs w-24"
                                            title="Buchholz: Suma de puntos de los rivales"
                                            >Tie-Break</th
                                        >
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-700/50">
                                    {#each standings as p, i}
                                        <tr
                                            class="hover:bg-slate-800/40 transition-colors {i <
                                            3
                                                ? 'bg-slate-800/20'
                                                : ''}"
                                        >
                                            <td class="p-4 text-center">
                                                {#if i === 0}
                                                    <div
                                                        class="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 mx-auto flex items-center justify-center border border-yellow-500/30"
                                                    >
                                                        <TrophyIcon
                                                            class="w-4 h-4"
                                                        />
                                                    </div>
                                                {:else if i === 1}
                                                    <div
                                                        class="w-8 h-8 rounded-full bg-slate-400/20 text-slate-300 mx-auto flex items-center justify-center border border-slate-400/30 font-bold text-sm"
                                                    >
                                                        2
                                                    </div>
                                                {:else if i === 2}
                                                    <div
                                                        class="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 mx-auto flex items-center justify-center border border-amber-700/30 font-bold text-sm"
                                                    >
                                                        3
                                                    </div>
                                                {:else}
                                                    <span
                                                        class="text-slate-500 font-mono"
                                                        >#{i + 1}</span
                                                    >
                                                {/if}
                                            </td>
                                            <td class="p-4">
                                                <div
                                                    class="font-bold text-white {i ===
                                                    0
                                                        ? 'text-yellow-500'
                                                        : ''}"
                                                >
                                                    {p.name}
                                                </div>
                                                <div
                                                    class="text-xs text-slate-500"
                                                >
                                                    {p.id !== "BYE"
                                                        ? `Nivel: ${p.level}`
                                                        : ""}
                                                </div>
                                            </td>
                                            <td
                                                class="p-4 text-center text-slate-400 font-medium"
                                                >{p.games}</td
                                            >
                                            <td
                                                class="p-4 text-right font-black text-xl {i ===
                                                0
                                                    ? 'text-yellow-500'
                                                    : 'text-white'}"
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
            </div>
        </div>
    {/if}
</div>

<ConfirmationModal
    bind:isOpen={showConfirmModal}
    title={confirmTitle}
    message={confirmMessage}
    confirmText={confirmBtnText}
    type={confirmType}
    on:confirm={handleConfirmAction}
/>
