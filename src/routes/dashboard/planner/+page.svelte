<script lang="ts">
    import {
        appStore,
        storeActions,
        type LessonPlan,
        type LessonSegment,
    } from "$lib/services/storage";
    import {
        Plus,
        Clock,
        Trash2,
        Save,
        FileText,
        BookOpen,
        Swords,
        Target,
        Flag,
        Layout,
        Brain,
    } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";

    let planTitle = "Nueva Clase";
    let selectedClassId = "";
    let segments: LessonSegment[] = [];
    let savedPlans: LessonPlan[] = [];

    $: store = $appStore;
    $: savedPlans = store.plans || [];
    $: totalDuration = segments.reduce(
        (acc, curr) => acc + (curr.duration || 0),
        0,
    );

    function getDefaultTitle(type: LessonSegment["type"]): string {
        switch (type) {
            case "opening":
                return "Teoría de Aperturas";
            case "tactics":
                return "Ejercicios de Táctica";
            case "strategy":
                return "Concepto Estratégico";
            case "endgame":
                return "Finales Básicos";
            case "game":
                return "Partidas de Práctica";
            case "analysis":
                return "Análisis de Partidas";
            default:
                return "Actividad";
        }
    }

    function getDefaultDuration(type: LessonSegment["type"]): number {
        switch (type) {
            case "tactics":
                return 15;
            case "opening":
                return 20;
            case "game":
                return 30;
            default:
                return 10;
        }
    }

    function addSegment(type: LessonSegment["type"]) {
        segments = [
            ...segments,
            {
                id: crypto.randomUUID(),
                type,
                title: getDefaultTitle(type),
                duration: getDefaultDuration(type),
                notes: "",
            },
        ];
    }

    function removeSegment(id: string) {
        segments = segments.filter((s) => s.id !== id);
    }

    function handleSave() {
        if (!planTitle) return alert("Por favor, asigna un título a la clase.");
        if (segments.length === 0)
            return alert("Añade al menos una actividad.");

        const newPlan: LessonPlan = {
            id: crypto.randomUUID(),
            title: planTitle,
            classId: selectedClassId || undefined,
            date: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString(),
            segments,
            totalDuration,
        };

        storeActions.addLessonPlan(newPlan);
        alert("Plan de clase guardado correctamente.");

        // Reset or redirect? Let's just reset for now or keep editing.
    }

    function loadPlan(plan: LessonPlan) {
        if (confirm("¿Cargar este plan reemplazará el actual. Continuar?")) {
            planTitle = plan.title;
            segments = [...plan.segments]; // Clone
            selectedClassId = plan.classId || "";
        }
    }

    function deletePlan(id: string, e: Event) {
        e.stopPropagation();
        if (confirm("¿Eliminar este plan guardado?")) {
            storeActions.removeLessonPlan(id);
        }
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
    <!-- Header -->
    <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
    >
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Layout class="w-8 h-8 text-indigo-500" /> Planificador de Clases
            </h1>
            <p class="mt-2 text-slate-400">
                Diseña sesiones de entrenamiento estructuradas y efectivas.
            </p>
        </div>
        <div class="flex items-center gap-4">
            <div
                class="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700 flex items-center gap-2"
            >
                <Clock class="w-5 h-5 text-indigo-400" />
                <span class="text-white font-bold text-lg"
                    >{totalDuration} min</span
                >
            </div>
            <button
                on:click={handleSave}
                class="btn btn-primary bg-indigo-600 hover:bg-indigo-500"
            >
                <Save class="w-5 h-5 mr-2" />
                Guardar Plan
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Builder -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Plan Info -->
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-slate-400 mb-1"
                            for="plan-title">Título de la Sesión</label
                        >
                        <input
                            id="plan-title"
                            bind:value={planTitle}
                            type="text"
                            class="form-input w-full"
                            placeholder="Ej. Dominando el Centro"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-slate-400 mb-1"
                            for="class-select">Asignar a Grupo (Opcional)</label
                        >
                        <select
                            id="class-select"
                            bind:value={selectedClassId}
                            class="form-select w-full"
                        >
                            <option value="">-- Sin asignar --</option>
                            {#each store.classes as cls}
                                <option value={cls.id}>{cls.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>

            <!-- Timeline / Segments -->
            <div class="space-y-4">
                {#if segments.length === 0}
                    <div
                        class="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center text-slate-500"
                    >
                        <Brain class="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Tu cronograma está vacío.</p>
                        <p class="text-sm">
                            Añade actividades desde el panel derecho.
                        </p>
                    </div>
                {:else}
                    {#each segments as segment, i (segment.id)}
                        <div
                            transition:slide
                            class="bg-[#1e293b] border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 relative group hover:border-indigo-500/50 transition-colors"
                        >
                            <!-- Index/Drag Handle -->
                            <div
                                class="hidden md:flex flex-col items-center justify-center w-8 text-slate-600 font-bold text-lg"
                            >
                                {i + 1}
                            </div>

                            <!-- Content -->
                            <div
                                class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4"
                            >
                                <!-- Type & Title -->
                                <div class="md:col-span-7">
                                    <div class="flex items-center gap-2 mb-2">
                                        {#if segment.type === "opening"}
                                            <BookOpen
                                                class="w-4 h-4 text-amber-500"
                                            />
                                        {:else if segment.type === "tactics"}
                                            <Target
                                                class="w-4 h-4 text-red-500"
                                            />
                                        {:else if segment.type === "game"}
                                            <Swords
                                                class="w-4 h-4 text-emerald-500"
                                            />
                                        {:else if segment.type === "endgame"}
                                            <Flag
                                                class="w-4 h-4 text-blue-500"
                                            />
                                        {:else}
                                            <FileText
                                                class="w-4 h-4 text-slate-500"
                                            />
                                        {/if}
                                        <span
                                            class="text-xs font-bold uppercase text-slate-400 tracking-wider"
                                            >{segment.type}</span
                                        >
                                    </div>
                                    <input
                                        bind:value={segment.title}
                                        class="bg-transparent border-0 border-b border-transparent focus:border-indigo-500 text-white font-medium w-full p-0 focus:ring-0 placeholder-slate-600"
                                        placeholder="Título de la actividad"
                                    />
                                    <input
                                        bind:value={segment.notes}
                                        class="bg-transparent text-sm text-slate-400 w-full mt-1 border-0 p-0 focus:ring-0 placeholder-slate-600"
                                        placeholder="Añadir notas..."
                                    />
                                </div>

                                <!-- Duration -->
                                <div
                                    class="md:col-span-5 flex items-center gap-3"
                                >
                                    <div
                                        class="flex items-center bg-slate-800 rounded px-2 py-1 border border-slate-700"
                                    >
                                        <Clock
                                            class="w-4 h-4 text-slate-400 mr-2"
                                        />
                                        <input
                                            type="number"
                                            bind:value={segment.duration}
                                            class="bg-transparent w-12 text-center text-white p-0 border-0 focus:ring-0"
                                        />
                                        <span
                                            class="text-xs text-slate-500 ml-1"
                                            >min</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <!-- Delete Action -->
                            <button
                                on:click={() => removeSegment(segment.id)}
                                class="absolute top-2 right-2 p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>

        <!-- Right: Toolbox -->
        <div class="space-y-6">
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-4">
                    Añadir Actividad
                </h3>
                <div class="grid grid-cols-1 gap-3">
                    <button
                        class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 transition-all text-left group"
                        on:click={() => addSegment("opening")}
                    >
                        <div
                            class="p-2 rounded bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"
                        >
                            <BookOpen class="w-5 h-5" />
                        </div>
                        <div>
                            <div class="font-medium text-white">Apertura</div>
                            <div class="text-xs text-slate-500">
                                Teoría y variantes
                            </div>
                        </div>
                    </button>

                    <button
                        class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-500/50 transition-all text-left group"
                        on:click={() => addSegment("tactics")}
                    >
                        <div
                            class="p-2 rounded bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors"
                        >
                            <Target class="w-5 h-5" />
                        </div>
                        <div>
                            <div class="font-medium text-white">Táctica</div>
                            <div class="text-xs text-slate-500">
                                Puzzles y cálculo
                            </div>
                        </div>
                    </button>

                    <button
                        class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 transition-all text-left group"
                        on:click={() => addSegment("strategy")}
                    >
                        <div
                            class="p-2 rounded bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors"
                        >
                            <Brain class="w-5 h-5" />
                        </div>
                        <div>
                            <div class="font-medium text-white">Estrategia</div>
                            <div class="text-xs text-slate-500">
                                Planes y conceptos
                            </div>
                        </div>
                    </button>

                    <button
                        class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 transition-all text-left group"
                        on:click={() => addSegment("game")}
                    >
                        <div
                            class="p-2 rounded bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors"
                        >
                            <Swords class="w-5 h-5" />
                        </div>
                        <div>
                            <div class="font-medium text-white">Práctica</div>
                            <div class="text-xs text-slate-500">
                                Partidas libres o temáticas
                            </div>
                        </div>
                    </button>

                    <button
                        class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 transition-all text-left group"
                        on:click={() => addSegment("endgame")}
                    >
                        <div
                            class="p-2 rounded bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"
                        >
                            <Flag class="w-5 h-5" />
                        </div>
                        <div>
                            <div class="font-medium text-white">Finales</div>
                            <div class="text-xs text-slate-500">
                                Técnica de finales
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Saved Plans -->
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-4">
                    Planes Guardados
                </h3>
                <div class="space-y-3">
                    {#each savedPlans as plan}
                        <button
                            class="flex items-center justify-between p-3 bg-slate-800 rounded-lg group cursor-pointer hover:bg-slate-750 transition-colors w-full text-left"
                            on:click={() => loadPlan(plan)}
                        >
                            <div>
                                <div class="font-medium text-white text-sm">
                                    {plan.title}
                                </div>
                                <div class="text-xs text-slate-500">
                                    {plan.totalDuration} min • {plan.segments
                                        .length} Actividades
                                </div>
                            </div>
                            <!-- Delete button inside button requires stopping propagation -->
                            <div
                                role="button"
                                tabindex="0"
                                on:click|preventDefault|stopPropagation={(e) =>
                                    deletePlan(plan.id, e)}
                                on:keydown={(e) =>
                                    e.key === "Enter" &&
                                    deletePlan(plan.id, e as any)}
                                class="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 class="w-4 h-4" />
                            </div>
                        </button>
                    {:else}
                        <div class="text-sm text-slate-500 text-center py-4">
                            No hay planes guardados.
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
