<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import {
        X,
        User,
        Mail,
        Calendar,
        Trophy,
        Clock,
        TrendingUp,
        Edit3,
        Trash2,
        Share2,
        FileText,
        GraduationCap,
        MapPin,
        Phone,
        Shield,
        DollarSign,
    } from "lucide-svelte";
    import type {
        Student,
        ClassGroup,
        Tournament,
    } from "$lib/services/storage";
    import AchievementBadge from "$lib/components/AchievementBadge.svelte";
    import { achievementsStore } from "$lib/services/achievements";

    // Props
    export let isOpen = false;
    export let student: Student;
    export let studentClass: ClassGroup | undefined = undefined;
    export let centerName: string = "—";
    export let attendanceRate: number = 0;
    export let recentActivity: any[] = []; // Payments, tournaments, etc.

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    function handleEdit() {
        dispatch("edit", student);
    }

    function handleDelete() {
        dispatch("delete", student.id);
    }

    function handleReport() {
        dispatch("report", student);
    }

    function handleShare() {
        dispatch("share", student);
    }

    // Tabs
    let activeTab: "overview" | "history" | "achievements" = "overview";

    // Level Colors
    const levelColors: Record<string, string> = {
        Pawn: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        Bishop: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        Rook: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        King: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    };

    $: levelStyle = levelColors[student.level] || levelColors["Pawn"];

    // Mock Achievements for now (in real app, filter from store)
    $: unlockedAchievements = $achievementsStore
        .filter((a) => Math.random() > 0.7)
        .slice(0, 3); // Just purely visual mock for layout demo if no real data
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
    >
        <!-- Backdrop -->
        <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            transition:fade={{ duration: 200 }}
            role="button"
            tabindex="0"
            onclick={close}
            onkeydown={(e) => {
                if (e.key === "Escape" || e.key === "Enter") close();
            }}
            aria-label="Cerrar modal"
        ></div>

        <!-- Modal Content -->
        <div
            class="relative bg-[#0f172a] border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            transition:fly={{ y: 20, duration: 300 }}
        >
            <!-- Header / Hero -->
            <div
                class="relative h-32 sm:h-40 bg-gradient-to-r from-slate-900 via-[#1e293b] to-slate-900 overflow-hidden"
            >
                <!-- Decorative Elements -->
                <div
                    class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
                ></div>
                <div
                    class="absolute -right-10 -top-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
                ></div>
                <div
                    class="absolute -left-10 bottom-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"
                ></div>

                <div class="absolute top-4 right-4 flex gap-2">
                    <button
                        onclick={close}
                        class="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Profile Info Area -->
            <div
                class="px-6 sm:px-8 pb-6 -mt-12 sm:-mt-16 flex flex-col sm:flex-row gap-6 items-start relative z-10 flex-1 overflow-hidden"
            >
                <!-- Avatar -->
                <div class="flex-shrink-0">
                    <div
                        class="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#1e293b] border-4 border-[#0f172a] shadow-xl flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden group"
                    >
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity"
                        ></div>
                        {student.name.charAt(0)}
                        {#if student.level === "King"}
                            <div class="absolute -top-1 -right-1">
                                <span class="relative flex h-4 w-4">
                                    <span
                                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
                                    ></span>
                                    <span
                                        class="relative inline-flex rounded-full h-4 w-4 bg-amber-500"
                                    ></span>
                                </span>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Main Info -->
                <div class="flex-1 pt-2 sm:pt-16 w-full">
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start gap-4"
                    >
                        <div>
                            <h2
                                class="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3"
                            >
                                {student.name}
                                <span
                                    class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border {levelStyle}"
                                >
                                    {student.level}
                                </span>
                            </h2>
                            <div
                                class="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-slate-400"
                            >
                                <span class="flex items-center gap-1.5">
                                    <Mail class="w-4 h-4 text-slate-500" />
                                    {student.email || "Sin email"}
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <MapPin class="w-4 h-4 text-slate-500" />
                                    {centerName}
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <GraduationCap
                                        class="w-4 h-4 text-slate-500"
                                    />
                                    {studentClass
                                        ? studentClass.name
                                        : "Sin Clase Asignada"}
                                </span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div
                            class="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            <button
                                onclick={handleShare}
                                class="flex-1 sm:flex-none justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border border-slate-700"
                            >
                                <Share2 class="w-4 h-4" />
                                <span class="sm:hidden lg:inline"
                                    >Compartir</span
                                >
                            </button>
                            <button
                                onclick={handleEdit}
                                class="flex-1 sm:flex-none justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                            >
                                <Edit3 class="w-4 h-4" />
                                <span class="sm:hidden lg:inline">Editar</span>
                            </button>
                        </div>
                    </div>

                    <!-- Layout: Sidebar Left / Content Right -->
                    <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Left Sidebar (Stats) -->
                        <div class="space-y-6">
                            <!-- Stats Cards -->
                            <div class="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                <div
                                    class="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl"
                                >
                                    <div class="flex items-center gap-3 mb-2">
                                        <div
                                            class="p-2 rounded-lg bg-pink-500/10 text-pink-400"
                                        >
                                            <Calendar class="w-5 h-5" />
                                        </div>
                                        <span
                                            class="text-slate-400 text-xs font-bold uppercase"
                                            >Asistencia</span
                                        >
                                    </div>
                                    <div class="flex items-end gap-2">
                                        <span
                                            class="text-2xl font-bold text-white"
                                            >{attendanceRate}%</span
                                        >
                                        <span
                                            class="text-xs text-slate-500 mb-1"
                                            >vs 85% media</span
                                        >
                                    </div>
                                    <div
                                        class="w-full bg-slate-700/50 h-1.5 rounded-full mt-3 overflow-hidden"
                                    >
                                        <div
                                            class="bg-pink-500 h-full rounded-full"
                                            style="width: {attendanceRate}%"
                                        ></div>
                                    </div>
                                </div>

                                <div
                                    class="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl"
                                >
                                    <div class="flex items-center gap-3 mb-2">
                                        <div
                                            class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"
                                        >
                                            <DollarSign class="w-5 h-5" />
                                        </div>
                                        <span
                                            class="text-slate-400 text-xs font-bold uppercase"
                                            >Estado Pagos</span
                                        >
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-white font-bold"
                                            >Al Día</span
                                        >
                                        <Shield
                                            class="w-4 h-4 text-emerald-500"
                                        />
                                    </div>
                                    <p class="text-xs text-slate-500 mt-1">
                                        Último pago hace 5 días
                                    </p>
                                </div>
                            </div>

                            <!-- Report Action -->
                            <button
                                onclick={handleReport}
                                class="w-full py-3 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 rounded-xl text-slate-300 transition-all flex items-center justify-center gap-2 text-sm font-medium group"
                            >
                                <FileText
                                    class="w-4 h-4 text-slate-500 group-hover:text-white"
                                />
                                Ver Informe Académico
                            </button>

                            <!-- Delete Zone -->
                            <div class="pt-6 border-t border-slate-800 mt-auto">
                                <button
                                    onclick={handleDelete}
                                    class="text-xs text-red-400 hover:text-red-300 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 class="w-3 h-3" />
                                    Eliminar Estudiante
                                </button>
                            </div>
                        </div>

                        <!-- Right Content (Tabs) -->
                        <div class="lg:col-span-2 min-h-[400px]">
                            <!-- Tab Nav -->
                            <div
                                class="flex gap-6 border-b border-slate-700/50 mb-6"
                            >
                                <button
                                    class="pb-3 text-sm font-medium transition-colors relative {activeTab ===
                                    'overview'
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-300'}"
                                    onclick={() => (activeTab = "overview")}
                                >
                                    Visión General
                                    {#if activeTab === "overview"}<div
                                            class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"
                                            transition:fade
                                        ></div>{/if}
                                </button>
                                <button
                                    class="pb-3 text-sm font-medium transition-colors relative {activeTab ===
                                    'history'
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-300'}"
                                    onclick={() => (activeTab = "history")}
                                >
                                    Historial
                                    {#if activeTab === "history"}<div
                                            class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"
                                            transition:fade
                                        ></div>{/if}
                                </button>
                                <button
                                    class="pb-3 text-sm font-medium transition-colors relative {activeTab ===
                                    'achievements'
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-300'}"
                                    onclick={() => (activeTab = "achievements")}
                                >
                                    Logros
                                    {#if activeTab === "achievements"}<div
                                            class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"
                                            transition:fade
                                        ></div>{/if}
                                </button>
                            </div>

                            <!-- Tab Content -->
                            <div class="relative">
                                {#if activeTab === "overview"}
                                    <div in:fade={{ duration: 200 }}>
                                        <h4
                                            class="text-sm font-bold text-white mb-3"
                                        >
                                            Notas del Profesor
                                        </h4>
                                        <div
                                            class="bg-slate-900/50 rounded-xl p-4 text-sm text-slate-300 leading-relaxed border border-slate-800 min-h-[100px]"
                                        >
                                            {student.notes ||
                                                "No hay notas registradas para este alumno."}
                                        </div>

                                        <h4
                                            class="text-sm font-bold text-white mb-3 mt-6"
                                        >
                                            Próximas Clases
                                        </h4>
                                        {#if studentClass}
                                            <div
                                                class="bg-slate-800/30 rounded-xl p-4 flex items-center justify-between border border-slate-700/50 hover:border-slate-500 transition-colors cursor-default"
                                            >
                                                <div
                                                    class="flex items-center gap-3"
                                                >
                                                    <div
                                                        class="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"
                                                    >
                                                        <Clock
                                                            class="w-5 h-5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p
                                                            class="font-bold text-white"
                                                        >
                                                            {studentClass.schedule}
                                                        </p>
                                                        <p
                                                            class="text-xs text-slate-500"
                                                        >
                                                            Grupo: {studentClass.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    class="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20"
                                                    >Activo</span
                                                >
                                            </div>
                                        {:else}
                                            <p
                                                class="text-slate-500 text-sm italic"
                                            >
                                                Sin clases programadas.
                                            </p>
                                        {/if}
                                    </div>
                                {:else if activeTab === "history"}
                                    <div in:fade={{ duration: 200 }}>
                                        <div class="space-y-4">
                                            {#if recentActivity.length === 0}
                                                <div
                                                    class="text-center py-10 text-slate-500"
                                                >
                                                    <Clock
                                                        class="w-8 h-8 mx-auto mb-2 opacity-50"
                                                    />
                                                    <p>
                                                        No hay actividad
                                                        reciente.
                                                    </p>
                                                </div>
                                            {:else}
                                                {#each recentActivity as item}
                                                    <div
                                                        class="flex gap-4 items-start p-3 hover:bg-slate-800/30 rounded-lg transition-colors"
                                                    >
                                                        <div class="mt-1">
                                                            <div
                                                                class="w-2 h-2 rounded-full bg-slate-500"
                                                            ></div>
                                                        </div>
                                                        <div>
                                                            <p
                                                                class="text-sm text-slate-300"
                                                            >
                                                                {item.description}
                                                            </p>
                                                            <p
                                                                class="text-xs text-slate-500"
                                                            >
                                                                {item.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                {/each}
                                            {/if}
                                        </div>
                                    </div>
                                {:else if activeTab === "achievements"}
                                    <div in:fade={{ duration: 200 }}>
                                        <div
                                            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                        >
                                            <!-- Mock Badges Loop -->
                                            <!-- In real implementation this takes from student.achievements -->
                                            <div
                                                class="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3 border border-slate-700"
                                            >
                                                <div
                                                    class="p-2 bg-yellow-500/10 rounded-full text-yellow-500"
                                                >
                                                    <Trophy class="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p
                                                        class="text-sm font-bold text-white"
                                                    >
                                                        Primer Torneo
                                                    </p>
                                                    <p
                                                        class="text-xs text-slate-400"
                                                    >
                                                        Participó en su primer
                                                        torneo local
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                class="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3 border border-slate-700"
                                            >
                                                <div
                                                    class="p-2 bg-blue-500/10 rounded-full text-blue-500"
                                                >
                                                    <TrendingUp
                                                        class="w-5 h-5"
                                                    />
                                                </div>
                                                <div>
                                                    <p
                                                        class="text-sm font-bold text-white"
                                                    >
                                                        Racha Asistencia
                                                    </p>
                                                    <p
                                                        class="text-xs text-slate-400"
                                                    >
                                                        10 clases seguidas sin
                                                        faltar
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
