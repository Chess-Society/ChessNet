<script lang="ts">
    import {
        appStore,
        storeActions,
        type LessonPlan,
        type LessonSegment,
    } from "$lib/services/storage";
    import { notifications } from "$lib/stores/notifications";
    import ConfirmationModal from "$lib/components/ConfirmationModal.svelte";
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
        GripVertical,
        ChevronRight,
        Hourglass,
        Sparkles,
    } from "lucide-svelte";
    import { fade, slide, scale } from "svelte/transition";
    import { flip } from "svelte/animate";

    let planTitle = "Nueva Clase Maestra";
    let selectedClassId = "";
    let segments: LessonSegment[] = [];
    let savedPlans: LessonPlan[] = [];

    $: store = $appStore;
    $: savedPlans = store.plans || [];
    $: totalDuration = segments.reduce(
        (acc, curr) => acc + (curr.duration || 0),
        0,
    );

    // --- Configurations ---
    const SEGMENT_TYPES = {
        opening: {
            label: "Apertura",
            icon: BookOpen,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            hover: "hover:border-amber-500/50",
            defaultDuration: 15,
            defaultTitle: "Teoría de Aperturas",
        },
        tactics: {
            label: "Táctica",
            icon: Target,
            color: "text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            hover: "hover:border-red-500/50",
            defaultDuration: 15,
            defaultTitle: "Ejercicios de Cálculo",
        },
        strategy: {
            label: "Estrategia",
            icon: Brain,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20",
            hover: "hover:border-indigo-500/50",
            defaultDuration: 20,
            defaultTitle: "Conceptos Estratégicos",
        },
        endgame: {
            label: "Finales",
            icon: Flag,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            hover: "hover:border-blue-500/50",
            defaultDuration: 15,
            defaultTitle: "Técnica de Finales",
        },
        game: {
            label: "Práctica",
            icon: Swords,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            hover: "hover:border-emerald-500/50",
            defaultDuration: 30,
            defaultTitle: "Partidas de Entrenamiento",
        },
        analysis: {
            label: "Análisis",
            icon: FileText,
            color: "text-slate-400",
            bg: "bg-slate-500/10",
            border: "border-slate-500/20",
            hover: "hover:border-slate-500/50",
            defaultDuration: 20,
            defaultTitle: "Análisis de Partida",
        },
    };

    function addSegment(type: keyof typeof SEGMENT_TYPES) {
        const config = SEGMENT_TYPES[type];
        segments = [
            ...segments,
            {
                id: crypto.randomUUID(),
                type,
                title: config.defaultTitle,
                duration: config.defaultDuration,
                notes: "",
            },
        ];
        // Scroll to bottom logic could go here
    }

    function removeSegment(id: string) {
        segments = segments.filter((s) => s.id !== id);
    }

    function moveSegment(index: number, direction: "up" | "down") {
        if (direction === "up" && index > 0) {
            const newSegments = [...segments];
            [newSegments[index - 1], newSegments[index]] = [
                newSegments[index],
                newSegments[index - 1],
            ];
            segments = newSegments;
        } else if (direction === "down" && index < segments.length - 1) {
            const newSegments = [...segments];
            [newSegments[index + 1], newSegments[index]] = [
                newSegments[index],
                newSegments[index + 1],
            ];
            segments = newSegments;
        }
    }

    function handleSave() {
        if (!planTitle)
            return notifications.error(
                "Por favor, asigna un título a la clase.",
            );
        if (segments.length === 0)
            return notifications.warning("Añade al menos una actividad.");

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
        notifications.success("Plan de clase guardado con éxito.");
        // Optional: clear or keep
    }

    // Confirm Modal State
    let showConfirmModal = false;
    let confirmTitle = "";
    let confirmMessage = "";
    let confirmAction: () => void = () => {};
    let confirmType: "danger" | "warning" = "danger";

    function loadPlan(plan: LessonPlan) {
        confirmTitle = "¿Cargar plan?";
        confirmMessage =
            "Cargar este plan reemplazará el trabajo actual. ¿Estás seguro?";
        confirmType = "warning";
        confirmAction = () => {
            planTitle = plan.title;
            segments = plan.segments.map((s) => ({
                ...s,
                id: crypto.randomUUID(),
            })); // Regenerate IDs to avoid key conflicts
            selectedClassId = plan.classId || "";
            notifications.success("Plan cargado.");
        };
        showConfirmModal = true;
    }

    function deletePlan(id: string, e: Event) {
        e.stopPropagation();
        confirmTitle = "¿Eliminar plantilla?";
        confirmMessage = "Esta acción es irreversible.";
        confirmType = "danger";
        confirmAction = () => {
            storeActions.removeLessonPlan(id);
            notifications.success("Plantilla eliminada.");
        };
        showConfirmModal = true;
    }

    function handleConfirmAction() {
        if (confirmAction) confirmAction();
        showConfirmModal = false;
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
    <!-- Header Area -->
    <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10"
    >
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Layout class="w-8 h-8 text-indigo-500" />
                Diseñador de Clases
            </h1>
            <p class="mt-2 text-slate-400 max-w-xl">
                Crea el flujo perfecto para tu próxima clase. Arrastra
                conceptos, ajusta tiempos y guarda tus mejores sesiones.
            </p>
        </div>

        <div
            class="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm"
        >
            <div class="px-4 py-2 border-r border-slate-700">
                <div
                    class="text-xs text-slate-500 font-bold uppercase tracking-wider"
                >
                    Duración Total
                </div>
                <div
                    class="text-2xl font-bold text-white flex items-center gap-2"
                >
                    <Hourglass class="w-5 h-5 text-indigo-400" />
                    {totalDuration}
                    <span class="text-sm text-slate-500 font-normal">min</span>
                </div>
            </div>
            <button
                onclick={handleSave}
                class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-indigo-900/20"
            >
                <Save class="w-5 h-5" />
                Guardar
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: The Workbench (8 cols) -->
        <div class="lg:col-span-8 space-y-6">
            <!-- Session Meta -->
            <div
                class="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
            >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label
                            class="text-sm font-semibold text-slate-300 ml-1"
                            for="plan-title">Título de la Sesión</label
                        >
                        <input
                            id="plan-title"
                            bind:value={planTitle}
                            type="text"
                            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-lg placeholder-slate-600"
                            placeholder="Ej. Iniciación a la Defensa Siciliana"
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            class="text-sm font-semibold text-slate-300 ml-1"
                            for="class-select">Asignar a Grupo</label
                        >
                        <select
                            id="class-select"
                            bind:value={selectedClassId}
                            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        >
                            <option value="">-- General (Sin asignar) --</option
                            >
                            {#each store.classes as cls}
                                <option value={cls.id}>{cls.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>

            <!-- The Timeline -->
            <div class="relative min-h-[400px]">
                <!-- Connecting Line -->
                {#if segments.length > 0}
                    <div
                        class="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-800 -z-10"
                    ></div>
                {/if}

                {#if segments.length === 0}
                    <div
                        in:fade
                        class="border-3 border-dashed border-slate-800 rounded-3xl p-16 text-center"
                    >
                        <div
                            class="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <Sparkles
                                class="w-10 h-10 text-indigo-500 opacity-80"
                            />
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">
                            Tu lienzo está en blanco
                        </h3>
                        <p class="text-slate-400 max-w-sm mx-auto">
                            Selecciona módulos del panel derecho para construir
                            tu clase perfecta. ¡Empieza con una Apertura!
                        </p>
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each segments as segment, i (segment.id)}
                            {@const config =
                                SEGMENT_TYPES[
                                    segment.type as keyof typeof SEGMENT_TYPES
                                ] || SEGMENT_TYPES.analysis}

                            <div
                                animate:flip={{ duration: 300 }}
                                transition:slide|local
                                class="relative pl-0 md:pl-0"
                            >
                                <div
                                    class="bg-slate-900 border {config.border} {config.hover} hover:bg-slate-800/80 transition-all duration-200 rounded-2xl p-1 flex items-stretch group shadow-lg"
                                >
                                    <!-- Visual Stripe (Left) -->
                                    <div
                                        class="w-2 rounded-l-xl {config.bg.replace(
                                            '/10',
                                            '/50',
                                        )}"
                                    ></div>

                                    <!-- Drag Handle & Index -->
                                    <div
                                        class="flex flex-col items-center justify-center px-4 py-2 border-r border-slate-800 gap-2"
                                    >
                                        <div
                                            class="text-slate-600 font-bold text-lg font-mono"
                                        >
                                            {(i + 1)
                                                .toString()
                                                .padStart(2, "0")}
                                        </div>
                                        <div
                                            class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <button
                                                onclick={() =>
                                                    moveSegment(i, "up")}
                                                disabled={i === 0}
                                                class="p-1 hover:text-white text-slate-600 disabled:opacity-20"
                                                >▲</button
                                            >
                                            <button
                                                onclick={() =>
                                                    moveSegment(i, "down")}
                                                disabled={i ===
                                                    segments.length - 1}
                                                class="p-1 hover:text-white text-slate-600 disabled:opacity-20"
                                                >▼</button
                                            >
                                        </div>
                                    </div>

                                    <!-- Content -->
                                    <div
                                        class="flex-1 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                                    >
                                        <!-- Icon & Info -->
                                        <div class="md:col-span-7 space-y-2">
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <div
                                                    class="p-1.5 rounded-lg {config.bg} {config.color}"
                                                >
                                                    <svelte:component
                                                        this={config.icon}
                                                        class="w-4 h-4"
                                                    />
                                                </div>
                                                <span
                                                    class="text-xs font-bold uppercase {config.color} tracking-wider"
                                                    >{config.label}</span
                                                >
                                            </div>

                                            <input
                                                bind:value={segment.title}
                                                class="bg-transparent border-0 border-b border-transparent focus:border-indigo-500/50 text-white font-bold text-lg w-full p-0 focus:ring-0 placeholder-slate-600 truncate"
                                                placeholder="Título del segmento..."
                                            />

                                            <input
                                                bind:value={segment.notes}
                                                class="bg-transparent text-sm text-slate-400 w-full p-0 border-0 focus:ring-0 placeholder-slate-600/50"
                                                placeholder="Añadir notas clave (ej. énfasis en desarrollo)..."
                                            />
                                        </div>

                                        <!-- Time Control -->
                                        <div
                                            class="md:col-span-5 flex justify-end items-center gap-4"
                                        >
                                            <div
                                                class="flex items-center gap-3 bg-slate-950/30 rounded-xl px-4 py-2 border border-slate-800"
                                            >
                                                <div class="text-right">
                                                    <span
                                                        class="block text-[10px] text-slate-500 uppercase font-bold"
                                                        >Duración</span
                                                    >
                                                    <div
                                                        class="flex items-baseline gap-1"
                                                    >
                                                        <input
                                                            type="number"
                                                            bind:value={
                                                                segment.duration
                                                            }
                                                            class="bg-transparent w-10 text-right text-white font-mono font-bold p-0 border-0 focus:ring-0"
                                                        />
                                                        <span
                                                            class="text-xs text-slate-500"
                                                            >min</span
                                                        >
                                                    </div>
                                                </div>
                                                <Clock
                                                    class="w-5 h-5 text-slate-600"
                                                />
                                            </div>

                                            <button
                                                onclick={() =>
                                                    removeSegment(segment.id)}
                                                class="p-3 rounded-xl bg-slate-800 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
                                                title="Eliminar segmento"
                                            >
                                                <Trash2 class="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}

                        <!-- Total Sum Visual at Bottom -->
                        <div class="flex justify-center pt-4 opacity-50">
                            <div
                                class="bg-slate-800 px-4 py-1 rounded-full text-xs text-slate-400 border border-slate-700"
                            >
                                Fin de la sesión (~{totalDuration} min)
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Right Column: Toolbox (4 cols) -->
        <div class="lg:col-span-4 space-y-8 sticky top-24">
            <!-- Tools Palette -->
            <div
                class="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
            >
                <h3
                    class="text-lg font-bold text-white mb-4 flex items-center gap-2"
                >
                    <Plus class="w-5 h-5 text-indigo-400" />
                    Bloques
                </h3>
                <div class="grid grid-cols-1 gap-3">
                    {#each Object.entries(SEGMENT_TYPES) as [key, config]}
                        <button
                            onclick={() => addSegment(key as any)}
                            class="group flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 {config.hover} transition-all active:scale-95 text-left"
                        >
                            <div
                                class="w-10 h-10 rounded-full {config.bg} flex items-center justify-center {config.color} group-hover:scale-110 transition-transform"
                            >
                                <svelte:component
                                    this={config.icon}
                                    class="w-5 h-5"
                                />
                            </div>
                            <div class="flex-1">
                                <span
                                    class="block text-white font-bold text-sm group-hover:{config.color} transition-colors"
                                    >{config.label}</span
                                >
                                <span class="text-xs text-slate-500"
                                    >~{config.defaultDuration} min</span
                                >
                            </div>
                            <Plus
                                class="w-4 h-4 text-slate-600 group-hover:text-white"
                            />
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Saved Templates -->
            <div
                class="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
            >
                <h3
                    class="text-lg font-bold text-white mb-4 flex items-center gap-2"
                >
                    <FileText class="w-5 h-5 text-slate-400" />
                    Plantillas Guardadas
                </h3>

                <div
                    class="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
                >
                    {#each savedPlans as plan}
                        <div
                            class="group relative bg-slate-800/30 hover:bg-slate-800 rounded-xl p-3 border border-slate-700/30 hover:border-slate-600 transition-all"
                        >
                            <button
                                class="w-full text-left"
                                onclick={() => loadPlan(plan)}
                            >
                                <div
                                    class="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors"
                                >
                                    {plan.title}
                                </div>
                                <div class="flex items-center gap-2 mt-1">
                                    <span
                                        class="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded"
                                        >{plan.totalDuration} min</span
                                    >
                                    <span class="text-[10px] text-slate-500"
                                        >{plan.segments.length} bloques</span
                                    >
                                </div>
                            </button>

                            <button
                                onclick={(e) => deletePlan(plan.id, e)}
                                class="absolute top-2 right-2 p-1.5 text-slate-600 hover:text-red-400 bg-slate-800/0 hover:bg-slate-900 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                title="Eliminar plantilla"
                            >
                                <Trash2 class="w-3.5 h-3.5" />
                            </button>
                        </div>
                    {:else}
                        <div
                            class="text-center py-6 text-slate-500 text-sm italic"
                        >
                            No hay plantillas guardadas aún.
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<ConfirmationModal
    bind:isOpen={showConfirmModal}
    title={confirmTitle}
    message={confirmMessage}
    confirmText={confirmType === "danger" ? "Eliminar" : "Cargar"}
    type={confirmType}
    on:confirm={handleConfirmAction}
/>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 4px;
    }
</style>
