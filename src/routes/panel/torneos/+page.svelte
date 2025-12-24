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
    import Modal from "$lib/components/Modal.svelte";
    import EmptyState from "$lib/components/common/EmptyState.svelte";

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

    // Form validation errors
    let formErrors: {
        name?: string;
        date?: string;
    } = {};

    function validateTournamentForm(): boolean {
        formErrors = {};
        let isValid = true;

        if (!newTournament.name || newTournament.name.trim().length < 3) {
            formErrors.name = "El nombre debe tener al menos 3 caracteres";
            isValid = false;
        }

        if (!newTournament.date) {
            formErrors.date = "Selecciona una fecha";
            isValid = false;
        }

        return isValid;
    }

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
            formErrors = {};
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
        if (!validateTournamentForm()) {
            notifications.error(
                "Por favor, corrige los errores del formulario",
            );
            return;
        }

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
        formErrors = {};
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

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
            <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
            />
            <input
                type="text"
                bind:value={searchTerm}
                placeholder="Buscar torneo..."
                class="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-slate-600 transition-all"
            />
        </div>
        <div
            class="flex gap-2 bg-[#1e293b] p-1 rounded-xl border border-slate-700 overflow-x-auto"
        >
            {#each ["All", "Upcoming", "Ongoing", "Completed"] as status}
                <button
                    onclick={() => (filterStatus = status as any)}
                    class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all {filterStatus ===
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

    <!-- Tournaments List -->
    <div class="grid gap-6">
        {#if filteredTournaments.length === 0}
            <EmptyState
                icon={Trophy}
                title="No se encontraron torneos"
                description="Prueba cambiando los filtros o crea tu primer torneo para empezar la competición."
                actionLabel="Crear Torneo"
                on:action={handleToggleForm}
            />
        {:else}
            {#each filteredTournaments as tournament (tournament.id)}
                <div
                    class="group bg-[#1e293b] border border-slate-700/50 rounded-2xl p-0 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-900/10 relative overflow-hidden"
                >
                    <!-- Premium Hover Gradient -->
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    ></div>

                    <!-- Progress Bar for Ongoing -->
                    {#if tournament.status === "Ongoing"}
                        <div
                            class="absolute top-0 left-0 w-full h-1 bg-slate-800"
                        >
                            <div
                                class="h-full bg-gradient-to-r from-orange-500 to-yellow-500 animate-pulse w-1/3"
                            ></div>
                        </div>
                    {/if}

                    <div
                        class="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10"
                    >
                        <!-- Icon Box -->
                        <div
                            class="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                        >
                            {#if tournament.status === "Completed"}
                                <Medal class="w-8 h-8 text-yellow-500" />
                            {:else if tournament.status === "Ongoing"}
                                <PlayCircle class="w-8 h-8 text-emerald-500" />
                            {:else}
                                <Calendar
                                    class="w-8 h-8 text-slate-400 group-hover:text-orange-500 transition-colors"
                                />
                            {/if}
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex flex-wrap items-center gap-3 mb-2">
                                <span
                                    class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border {tournament.status ===
                                    'Ongoing'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : tournament.status === 'Completed'
                                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}"
                                >
                                    {tournament.status === "Ongoing"
                                        ? "En Juego"
                                        : tournament.status === "Completed"
                                          ? "Finalizado"
                                          : "Inscripciones Abiertas"}
                                </span>
                                <span
                                    class="text-slate-500 text-xs flex items-center gap-1"
                                >
                                    <Clock class="w-3 h-3" />
                                    {tournament.format}
                                </span>
                            </div>
                            <h3
                                class="text-xl font-bold text-white mb-1 truncate group-hover:text-orange-400 transition-colors"
                            >
                                {tournament.name}
                            </h3>
                            <div
                                class="flex items-center gap-4 text-sm text-slate-400"
                            >
                                <span class="flex items-center gap-1.5">
                                    <Calendar class="w-4 h-4 text-slate-500" />
                                    {new Date(
                                        tournament.date,
                                    ).toLocaleDateString(undefined, {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <Users class="w-4 h-4 text-slate-500" />
                                    {tournament.participants.length} Participantes
                                </span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div
                            class="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0"
                        >
                            <a
                                href="{base}/panel/torneos/{tournament.id}"
                                class="btn bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                            >
                                {tournament.status === "Completed"
                                    ? "Ver Resultados"
                                    : "Gestionar Panel"}
                                <ArrowRight class="w-4 h-4 ml-2" />
                            </a>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <!-- Create Tournament Modal -->
    <Modal
        bind:isOpen={showForm}
        title={selectedTemplate && !showTemplateSelection
            ? `Configurar: ${selectedTemplate.name}`
            : "Nuevo Torneo"}
        size="lg"
    >
        {#if showTemplateSelection}
            <!-- Template Selection -->
            <div transition:fade>
                <div class="flex items-center gap-2 mb-4">
                    <Sparkles class="w-5 h-5 text-yellow-500" />
                    <p class="text-sm text-slate-400">
                        Comienza rápido con una plantilla o crea desde cero.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    class="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 group border border-dashed border-slate-700 rounded-xl hover:border-slate-500 hover:bg-slate-800/50"
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
                {#if selectedTemplate}
                    <div class="flex justify-end mb-6">
                        <button
                            onclick={() => {
                                showTemplateSelection = true;
                                selectedTemplate = null;
                            }}
                            class="text-xs text-slate-400 hover:text-white underline"
                        >
                            Cambiar Plantilla
                        </button>
                    </div>
                {/if}

                <div class="grid gap-6">
                    <div>
                        <label
                            for="tournament-name"
                            class="block text-sm font-medium text-slate-300 mb-2"
                            >Nombre del Torneo <span class="text-red-400"
                                >*</span
                            ></label
                        >
                        <input
                            id="tournament-name"
                            bind:value={newTournament.name}
                            type="text"
                            placeholder="Ej: Torneo de Primavera 2024"
                            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all {formErrors.name
                                ? 'border-red-500 focus:ring-red-500'
                                : ''}"
                        />
                        {#if formErrors.name}
                            <p
                                class="text-red-400 text-xs mt-1 flex items-center gap-1"
                            >
                                <svg
                                    class="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                {formErrors.name}
                            </p>
                        {/if}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                for="tournament-date"
                                class="block text-sm font-medium text-slate-300 mb-2"
                                >Fecha de Inicio <span class="text-red-400"
                                    >*</span
                                ></label
                            >
                            <input
                                id="tournament-date"
                                bind:value={newTournament.date}
                                type="date"
                                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all {formErrors.date
                                    ? 'border-red-500 focus:ring-red-500'
                                    : ''}"
                            />
                            {#if formErrors.date}
                                <p
                                    class="text-red-400 text-xs mt-1 flex items-center gap-1"
                                >
                                    <svg
                                        class="w-3 h-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    {formErrors.date}
                                </p>
                            {/if}
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

                    <div class="flex justify-end gap-3 pt-6 mt-2">
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
    </Modal>
</div>
