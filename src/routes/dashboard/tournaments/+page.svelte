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
    // ...

    function handleToggleForm() {
        if (!showForm) {
            // Trying to open
            if (!checkPlanLimit(store, "tournaments")) {
                alert(
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
    import {
        Trophy,
        Calendar,
        Users,
        MapPin,
        Plus,
        Medal,
        Sparkles,
        ArrowRight,
    } from "lucide-svelte";
    import { slide, fade } from "svelte/transition";
    import { base } from "$app/paths";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let showForm = false;
    let showTemplateSelection = true;
    let selectedTemplate: TournamentTemplate | null = null;
    let newTournament: Tournament = {
        id: "",
        name: "",
        date: new Date().toISOString().split("T")[0],
        status: "Upcoming",
        participants: [],
        matches: [],
        format: "Suizo",
    };

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

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy class="w-8 h-8 text-orange-500" /> Torneos
            </h1>
            <p class="mt-2 text-sm text-slate-400">
                Gestiona tus competiciones y ligas locales.
            </p>
        </div>
        <div class="mt-4 sm:mt-0">
            <button
                onclick={handleToggleForm}
                class="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
                <Plus class="w-5 h-5" />
                Nuevo Torneo
            </button>
        </div>
    </div>

    {#if showForm}
        <div
            transition:slide
            class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 mt-6"
        >
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
                                class="group text-left p-4 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-{template.color}-500/50 hover:bg-slate-900 transition-all cursor-pointer"
                            >
                                <div
                                    class="flex items-start justify-between mb-2"
                                >
                                    <span class="text-3xl">{template.icon}</span
                                    >
                                    <ArrowRight
                                        class="w-4 h-4 text-slate-600 group-hover:text-{template.color}-500 group-hover:translate-x-1 transition-all"
                                    />
                                </div>
                                <h4 class="font-semibold text-white mb-1">
                                    {template.name}
                                </h4>
                                <p
                                    class="text-xs text-slate-400 mb-3 line-clamp-2"
                                >
                                    {template.description}
                                </p>
                                <div class="flex flex-wrap gap-2 text-xs">
                                    <span
                                        class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded"
                                        >{template.format}</span
                                    >
                                    <span
                                        class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded"
                                        >{template.timeControl}</span
                                    >
                                </div>
                            </button>
                        {/each}
                    </div>

                    <button
                        onclick={skipTemplate}
                        class="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        Omitir y crear desde cero →
                    </button>
                </div>
            {:else}
                <!-- Tournament Form -->
                <div transition:fade>
                    <h3 class="text-lg font-bold text-white mb-4">
                        {selectedTemplate
                            ? `Configurar: ${selectedTemplate.name}`
                            : "Organizar Nuevo Torneo"}
                    </h3>

                    {#if selectedTemplate}
                        <div
                            class="mb-4 p-3 bg-slate-900/50 border border-slate-700 rounded-lg"
                        >
                            <div
                                class="flex items-center gap-2 text-sm text-slate-300"
                            >
                                <span class="text-2xl"
                                    >{selectedTemplate.icon}</span
                                >
                                <div class="flex-1">
                                    <p class="font-medium">
                                        {selectedTemplate.description}
                                    </p>
                                    <p class="text-xs text-slate-400 mt-1">
                                        {selectedTemplate.idealParticipants} • {selectedTemplate.estimatedDuration}
                                    </p>
                                </div>
                                <button
                                    onclick={() => {
                                        showTemplateSelection = true;
                                        selectedTemplate = null;
                                    }}
                                    class="text-xs text-slate-400 hover:text-white"
                                >
                                    Cambiar
                                </button>
                            </div>
                        </div>
                    {/if}

                    <div class="space-y-4">
                        <div>
                            <label
                                for="tournament-name"
                                class="block text-sm font-medium text-slate-400 mb-1"
                                >Nombre del Torneo</label
                            >
                            <input
                                id="tournament-name"
                                bind:value={newTournament.name}
                                type="text"
                                placeholder="Ej: Torneo de Primavera"
                                class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="tournament-date"
                                    class="block text-sm font-medium text-slate-400 mb-1"
                                    >Fecha</label
                                >
                                <input
                                    id="tournament-date"
                                    bind:value={newTournament.date}
                                    type="date"
                                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label
                                    for="tournament-format"
                                    class="block text-sm font-medium text-slate-400 mb-1"
                                    >Formato</label
                                >
                                <select
                                    id="tournament-format"
                                    bind:value={newTournament.format}
                                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="Suizo">Sistema Suizo</option>
                                    <option value="Round Robin"
                                        >Round Robin (Liga)</option
                                    >
                                    <option value="Eliminación"
                                        >Eliminación Directa</option
                                    >
                                </select>
                            </div>
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button
                                onclick={() => (showForm = false)}
                                class="text-slate-400 hover:text-white px-4 py-2"
                                >Cancelar</button
                            >
                            <button
                                onclick={handleSubmit}
                                class="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium"
                                >Crear Torneo</button
                            >
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#if store.tournaments.length === 0}
            <div
                class="col-span-full py-12 text-center bg-[#1e293b]/50 rounded-3xl border border-dashed border-slate-700"
            >
                <Trophy class="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-white mb-2">
                    No hay torneos activos
                </h3>
                <p class="text-slate-400 mb-6">
                    Organiza tu primer torneo para tus alumnos.
                </p>
            </div>
        {:else}
            {#each store.tournaments as tournament}
                <div
                    class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:border-orange-500/30 transition-all flex flex-col"
                >
                    <div class="flex justify-between items-start mb-4">
                        <div class="bg-orange-500/10 p-3 rounded-xl">
                            <Medal class="w-6 h-6 text-orange-500" />
                        </div>
                        <span
                            class="px-2 py-1 text-xs font-bold rounded-lg uppercase
                            {tournament.status === 'Ongoing'
                                ? 'bg-green-500/10 text-green-400'
                                : tournament.status === 'Completed'
                                  ? 'bg-slate-700/50 text-slate-400'
                                  : 'bg-blue-500/10 text-blue-400'}"
                        >
                            {tournament.status === "Ongoing"
                                ? "En Curso"
                                : tournament.status === "Completed"
                                  ? "Finalizado"
                                  : "Próximo"}
                        </span>
                    </div>

                    <h3 class="text-xl font-bold text-white mb-2">
                        {tournament.name}
                    </h3>

                    <div class="space-y-3 mb-6 flex-1">
                        <div class="flex items-center text-slate-400 text-sm">
                            <Calendar class="w-4 h-4 mr-2 text-slate-500" />
                            {tournament.date}
                        </div>
                        <div class="flex items-center text-slate-400 text-sm">
                            <Trophy class="w-4 h-4 mr-2 text-slate-500" />
                            {tournament.format}
                        </div>
                        <div class="flex items-center text-slate-400 text-sm">
                            <Users class="w-4 h-4 mr-2 text-slate-500" />
                            {tournament.participants.length} Participantes
                        </div>
                    </div>

                    <a
                        href="{base}/dashboard/tournaments/{tournament.id}"
                        class="w-full bg-slate-800 text-slate-300 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:text-white transition-colors cursor-pointer text-center block"
                    >
                        Gestionar
                    </a>
                </div>
            {/each}
        {/if}
    </div>
</div>
