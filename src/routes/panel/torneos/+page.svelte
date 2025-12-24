<script lang="ts">
    import { onMount } from "svelte";
    import {
        appStore,
        storeActions,
        checkPlanLimit,
        type Tournament,
    } from "$lib/services/storage";
    import {
        tournamentTemplates,
        type TournamentTemplate,
    } from "$lib/data/tournamentTemplates";
    import {
        Trophy,
        Calendar,
        Users,
        MapPin,
        Plus,
        Medal,
        Sparkles,
        ArrowRight,
        Search,
        Filter,
        Clock,
        CheckCircle2,
        PlayCircle,
    } from "lucide-svelte";
    import { slide, fade, scale } from "svelte/transition";
    import { base } from "$app/paths";
    import { fireConfetti } from "$lib/utils/confetti";
    import { notifications } from "$lib/stores/notifications";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let showForm = false;
    let showTemplateSelection = true;
    let selectedTemplate: TournamentTemplate | null = null;
    let searchTerm = "";
    let filterStatus: "All" | "Upcoming" | "Ongoing" | "Completed" = "All";

    let newTournament: Tournament = {
        id: "",
        name: "",
        date: new Date().toISOString().split("T")[0],
        status: "Upcoming",
        participants: [],
        matches: [],
        format: "Suizo",
    };

    // KPI Stats
    $: totalTournaments = store.tournaments.length;
    $: ongoingTournaments = store.tournaments.filter(
        (t) => t.status === "Ongoing",
    ).length;
    $: completedTournaments = store.tournaments.filter(
        (t) => t.status === "Completed",
    ).length;
    $: totalParticipants = store.tournaments.reduce(
        (acc, t) => acc + t.participants.length,
        0,
    );

    // Filtered Tournaments
    $: filteredTournaments = store.tournaments
        .filter((t) => {
            const matchesSearch = t.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesStatus =
                filterStatus === "All" || t.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

    function handleToggleForm() {
        if (!showForm) {
            // Trying to open
            if (!checkPlanLimit(store, "tournaments")) {
                notifications.warning(
                    `Tu plan actual (${store.settings.plan}) no incluye gestión de torneos. Actualiza al Plan Club.`,
                );
                return;
            }
        }
        showForm = !showForm;
        if (showForm) {
            showTemplateSelection = true;
            selectedTemplate = null;
        }
    }

    function selectTemplate(template: TournamentTemplate) {
        selectedTemplate = template;
        newTournament = {
            ...newTournament,
            name: template.name,
            format: template.format,
        };
        showTemplateSelection = false;
    }

    function skipTemplate() {
        selectedTemplate = null;
        showTemplateSelection = false;
    }

    function handleSubmit() {
        if (!newTournament.name) return;

        const tournamentToAdd = {
            ...newTournament,
            id: crypto.randomUUID(),
        };

        storeActions.addTournament(tournamentToAdd);

        // JUICY
        fireConfetti();
        notifications.success("¡Torneo creado con éxito!");

        // Reset form
        newTournament = {
            id: "",
            name: "",
            date: new Date().toISOString().split("T")[0],
            status: "Upcoming",
            participants: [],
            matches: [],
            format: "Suizo",
        };
        showForm = false;
        showTemplateSelection = true;
        selectedTemplate = null;
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header with KPIs -->
    <div class="space-y-6">
        <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
            <div>
                <h1
                    class="text-3xl font-bold text-white flex items-center gap-3"
                >
                    <Trophy class="w-8 h-8 text-orange-500" />
                    Gestión de Torneos
                </h1>
                <p class="text-slate-400 mt-1">
                    Organiza competiciones de clase mundial para tus alumnos
                </p>
            </div>
            <button
                onclick={handleToggleForm}
                class="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 active:scale-95 btn-bounce"
            >
                <Plus class="w-5 h-5" />
                Nuevo Torneo
            </button>
        </div>

        <!-- KPIs Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
                class="bg-[#1e293b] border border-slate-700/50 p-4 rounded-xl flex items-center gap-4"
            >
                <div class="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Trophy class="w-6 h-6" />
                </div>
                <div>
                    <div class="text-2xl font-bold text-white">
                        {totalTournaments}
                    </div>
                    <div
                        class="text-xs text-slate-400 uppercase font-bold tracking-wider"
                    >
                        Total
                    </div>
                </div>
            </div>
            <div
                class="bg-[#1e293b] border border-slate-700/50 p-4 rounded-xl flex items-center gap-4"
            >
                <div class="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <PlayCircle class="w-6 h-6" />
                </div>
                <div>
                    <div class="text-2xl font-bold text-white">
                        {ongoingTournaments}
                    </div>
                    <div
                        class="text-xs text-slate-400 uppercase font-bold tracking-wider"
                    >
                        En Curso
                    </div>
                </div>
            </div>
            <div
                class="bg-[#1e293b] border border-slate-700/50 p-4 rounded-xl flex items-center gap-4"
            >
                <div class="p-3 rounded-lg bg-orange-500/10 text-orange-400">
                    <Users class="w-6 h-6" />
                </div>
                <div>
                    <div class="text-2xl font-bold text-white">
                        {totalParticipants}
                    </div>
                    <div
                        class="text-xs text-slate-400 uppercase font-bold tracking-wider"
                    >
                        Participantes Históricos
                    </div>
                </div>
            </div>
            <div
                class="bg-[#1e293b] border border-slate-700/50 p-4 rounded-xl flex items-center gap-4"
            >
                <div class="p-3 rounded-lg bg-slate-500/10 text-slate-400">
                    <CheckCircle2 class="w-6 h-6" />
                </div>
                <div>
                    <div class="text-2xl font-bold text-white">
                        {completedTournaments}
                    </div>
                    <div
                        class="text-xs text-slate-400 uppercase font-bold tracking-wider"
                    >
                        Finalizados
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Create Form -->
    {#if showForm}
        <div
            transition:slide
            class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        >
            <div
                class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500"
            ></div>

            {#if showTemplateSelection}
                <!-- Template Selection -->
                <div transition:fade>
                    <div class="flex items-center gap-2 mb-2">
                        <Sparkles class="w-5 h-5 text-yellow-500" />
                        <h3 class="text-lg font-bold text-white">
                            Elige una Plantilla
                        </h3>
                    </div>
                    <p class="text-sm text-slate-400 mb-6">
                        Comienza rápido con una configuración predefinida o crea
                        desde cero
                    </p>

                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
                    >
                        {#each tournamentTemplates as template}
                            <button
                                onclick={() => selectTemplate(template)}
                                class="group text-left p-4 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-{template.color}-500/50 hover:bg-slate-900 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div
                                    class="absolute inset-0 bg-gradient-to-br from-{template.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                ></div>
                                <div
                                    class="flex items-start justify-between mb-2 relative z-10"
                                >
                                    <span class="text-3xl filter drop-shadow-lg"
                                        >{template.icon}</span
                                    >
                                    <ArrowRight
                                        class="w-4 h-4 text-slate-600 group-hover:text-{template.color}-500 group-hover:translate-x-1 transition-all"
                                    />
                                </div>
                                <h4
                                    class="font-semibold text-white mb-1 relative z-10"
                                >
                                    {template.name}
                                </h4>
                                <p
                                    class="text-xs text-slate-400 mb-3 line-clamp-2 relative z-10"
                                >
                                    {template.description}
                                </p>
                                <div
                                    class="flex flex-wrap gap-2 text-xs relative z-10"
                                >
                                    <span
                                        class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700"
                                        >{template.format}</span
                                    >
                                    <span
                                        class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700"
                                        >{template.timeControl}</span
                                    >
                                </div>
                            </button>
                        {/each}
                    </div>

                    <button
                        onclick={skipTemplate}
                        class="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                    >
                        <span>Omitir y crear desde cero</span>
                        <ArrowRight
                            class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                </div>
            {:else}
                <!-- Tournament Form -->
                <div transition:fade>
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-white">
                            {selectedTemplate
                                ? `Configurar: ${selectedTemplate.name}`
                                : "Organizar Nuevo Torneo"}
                        </h3>
                        {#if selectedTemplate}
                            <button
                                onclick={() => {
                                    showTemplateSelection = true;
                                    selectedTemplate = null;
                                }}
                                class="text-xs text-slate-400 hover:text-white underline"
                            >
                                Cambiar Plantilla
                            </button>
                        {/if}
                    </div>

                    <div class="grid gap-6">
                        <div>
                            <label
                                for="tournament-name"
                                class="block text-sm font-medium text-slate-300 mb-2"
                                >Nombre del Torneo</label
                            >
                            <input
                                id="tournament-name"
                                bind:value={newTournament.name}
                                type="text"
                                placeholder="Ej: Torneo de Primavera 2024"
                                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    for="tournament-date"
                                    class="block text-sm font-medium text-slate-300 mb-2"
                                    >Fecha de Inicio</label
                                >
                                <input
                                    id="tournament-date"
                                    bind:value={newTournament.date}
                                    type="date"
                                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label
                                    for="tournament-format"
                                    class="block text-sm font-medium text-slate-300 mb-2"
                                    >Formato de Competición</label
                                >
                                <select
                                    id="tournament-format"
                                    bind:value={newTournament.format}
                                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                >
                                    <option value="Suizo"
                                        >Sistema Suizo (Recomendado)</option
                                    >
                                    <option value="Round Robin"
                                        >Round Robin (Liga)</option
                                    >
                                    <option value="Eliminación"
                                        >Eliminación Directa (Copa)</option
                                    >
                                </select>
                            </div>
                        </div>

                        <div
                            class="flex justify-end gap-3 pt-4 border-t border-slate-700/50"
                        >
                            <button
                                onclick={() => (showForm = false)}
                                class="text-slate-400 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                                >Cancelar</button
                            >
                            <button
                                onclick={handleSubmit}
                                class="bg-orange-600 hover:bg-orange-500 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-900/20 active:scale-95 transition-all w-full md:w-auto"
                                >Crear Torneo</button
                            >
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    <!-- Search & Filters -->
    <div class="flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
            <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            />
            <input
                type="text"
                bind:value={searchTerm}
                placeholder="Buscar torneo por nombre..."
                class="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-500"
            />
        </div>
        <div
            class="flex gap-2 bg-[#1e293b] p-1 rounded-xl border border-slate-700 w-full md:w-auto overflow-x-auto"
        >
            {#each ["All", "Upcoming", "Ongoing", "Completed"] as status}
                <button
                    onclick={() => (filterStatus = status as any)}
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap {filterStatus ===
                    status
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
                >
                    {status === "All"
                        ? "Todos"
                        : status === "Upcoming"
                          ? "Próximos"
                          : status === "Ongoing"
                            ? "En Curso"
                            : "Finalizados"}
                </button>
            {/each}
        </div>
    </div>

    <!-- Tournaments Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#if filteredTournaments.length === 0}
            <div
                class="col-span-full py-20 text-center bg-[#1e293b]/30 rounded-3xl border border-dashed border-slate-700"
            >
                <div
                    class="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Trophy class="w-10 h-10 text-slate-600" />
                </div>
                <h3 class="text-xl font-bold text-white mb-2">
                    {store.tournaments.length === 0
                        ? "Aún no hay torneos"
                        : "No se encontraron torneos"}
                </h3>
                <p class="text-slate-400 mb-6 max-w-sm mx-auto">
                    {store.tournaments.length === 0
                        ? "Crea tu primer torneo para empezar a gestionar emparejamientos y resultados."
                        : "Prueba a cambiar los filtros de búsqueda."}
                </p>
                {#if store.tournaments.length === 0}
                    <button
                        onclick={handleToggleForm}
                        class="bg-slate-800 text-white px-6 py-2 rounded-xl font-medium hover:bg-slate-700 transition-colors"
                    >
                        Crear Primer Torneo
                    </button>
                {/if}
            </div>
        {:else}
            {#each filteredTournaments as tournament (tournament.id)}
                <div
                    transition:scale={{ duration: 200, start: 0.95 }}
                    class="group bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-900/10 transition-all duration-300 flex flex-col relative"
                >
                    <!-- Status Indication Stripe -->
                    <div
                        class="absolute left-0 top-0 bottom-0 w-1 {tournament.status ===
                        'Ongoing'
                            ? 'bg-emerald-500'
                            : tournament.status === 'Completed'
                              ? 'bg-slate-600'
                              : 'bg-blue-500'}"
                    ></div>

                    <div class="p-6 flex-1 flex flex-col">
                        <div class="flex justify-between items-start mb-4">
                            <div class="ml-2">
                                <span
                                    class="text-xs font-bold uppercase tracking-wider mb-1 block
                                    {tournament.status === 'Ongoing'
                                        ? 'text-emerald-400'
                                        : tournament.status === 'Completed'
                                          ? 'text-slate-500'
                                          : 'text-blue-400'}
                                "
                                >
                                    {tournament.status === "Ongoing"
                                        ? "EN CURSO"
                                        : tournament.status === "Completed"
                                          ? "FINALIZADO"
                                          : "PRÓXIMO"}
                                </span>
                                <h3
                                    class="text-xl font-bold text-white group-hover:text-orange-400 transition-colors"
                                >
                                    {tournament.name}
                                </h3>
                            </div>
                            <!-- Icon Badge -->
                            <div
                                class="w-10 h-10 rounded-xl flex items-center justify-center
                                {tournament.status === 'Ongoing'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : tournament.status === 'Completed'
                                      ? 'bg-slate-700/30 text-slate-500'
                                      : 'bg-blue-500/10 text-blue-400'}
                            "
                            >
                                {#if tournament.status === "Completed"}
                                    <CheckCircle2 class="w-5 h-5" />
                                {:else if tournament.status === "Ongoing"}
                                    <PlayCircle class="w-5 h-5" />
                                {:else}
                                    <Calendar class="w-5 h-5" />
                                {/if}
                            </div>
                        </div>

                        <!-- Info Grid -->
                        <div class="grid grid-cols-2 gap-4 mt-auto ml-2">
                            <div
                                class="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/30 p-2 rounded-lg"
                            >
                                <Users class="w-4 h-4 text-slate-500" />
                                <span
                                    >{tournament.participants.length} Jugadores</span
                                >
                            </div>
                            <div
                                class="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/30 p-2 rounded-lg"
                            >
                                <Medal class="w-4 h-4 text-slate-500" />
                                <span>{tournament.format}</span>
                            </div>
                            <div
                                class="col-span-2 flex items-center gap-2 text-sm text-slate-400 bg-slate-900/30 p-2 rounded-lg"
                            >
                                <Calendar class="w-4 h-4 text-slate-500" />
                                <span
                                    >{new Date(
                                        tournament.date,
                                    ).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}</span
                                >
                            </div>
                        </div>

                        <!-- Progress Bar for Ongoing -->
                        {#if tournament.status === "Ongoing"}
                            <div class="mt-4 ml-2">
                                <div
                                    class="flex justify-between text-xs text-slate-400 mb-1"
                                >
                                    <span>Progreso</span>
                                    <span
                                        >{tournament.matches.length > 0
                                            ? "Rondas en juego"
                                            : "Iniciando"}</span
                                    >
                                </div>
                                <div
                                    class="h-1.5 bg-slate-700 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-emerald-500 rounded-full animate-pulse w-2/3"
                                    ></div>
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Footer Action -->
                    <div
                        class="p-4 bg-slate-900/30 border-t border-slate-700/50 mt-auto"
                    >
                        <a
                            href="{base}/panel/torneos/{tournament.id}"
                            class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all
                            {tournament.status === 'Completed'
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                : 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-900/20 active:scale-95'}"
                        >
                            <span
                                >{tournament.status === "Completed"
                                    ? "Ver Resultados"
                                    : "Gestionar Torneo"}</span
                            >
                            <ArrowRight class="w-4 h-4" />
                        </a>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
