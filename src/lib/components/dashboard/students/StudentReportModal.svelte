<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, scale } from "svelte/transition";
    import {
        X,
        Printer,
        TrendingUp,
        Calendar,
        Award,
        BookOpen,
        Target,
        BrainCircuit,
    } from "lucide-svelte";
    import type { Student, ClassGroup } from "$lib/services/storage";

    export let isOpen = false;
    export let student: Student;
    export let studentClass: ClassGroup | undefined = undefined;
    export let centerName: string = "—";
    export let stats = {
        attendanceRate: 0,
        classesAttended: 0,
        totalClasses: 0,
    };

    const dispatch = createEventDispatcher();
    const today = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Mock Skills based on Level for visualization
    $: skills = [
        {
            name: "Táctica",
            value:
                student.level === "King"
                    ? 90
                    : student.level === "Rook"
                      ? 70
                      : student.level === "Bishop"
                        ? 50
                        : 30,
            icon: Target,
            color: "text-rose-500",
            bg: "bg-rose-500",
        },
        {
            name: "Estrategia",
            value:
                student.level === "King"
                    ? 85
                    : student.level === "Rook"
                      ? 65
                      : student.level === "Bishop"
                        ? 45
                        : 25,
            icon: BrainCircuit,
            color: "text-blue-500",
            bg: "bg-blue-500",
        },
        {
            name: "Finales",
            value:
                student.level === "King"
                    ? 80
                    : student.level === "Rook"
                      ? 60
                      : student.level === "Bishop"
                        ? 40
                        : 20,
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500",
        },
        {
            name: "Aperturas",
            value:
                student.level === "King"
                    ? 88
                    : student.level === "Rook"
                      ? 68
                      : student.level === "Bishop"
                        ? 48
                        : 28,
            icon: BookOpen,
            color: "text-amber-500",
            bg: "bg-amber-500",
        },
    ];

    function close() {
        dispatch("close");
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:bg-white print:p-0 print:block print:static"
        transition:fade
    >
        <div
            class="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative print:shadow-none print:max-h-none print:w-full print:max-w-none print:rounded-none"
            transition:scale={{ start: 0.95, duration: 200 }}
        >
            <!-- Web Only Header (Close Button) -->
            <div
                class="sticky top-0 right-0 p-4 flex justify-end gap-2 bg-white/80 backdrop-blur-sm border-b border-gray-100 print:hidden z-10"
            >
                <button
                    onclick={() => window.print()}
                    class="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                    <Printer class="w-4 h-4" />
                    Imprimir
                </button>
                <button
                    onclick={close}
                    class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- Report Content -->
            <div class="p-8 print:p-0">
                <!-- Branding Header -->
                <div
                    class="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8"
                >
                    <div>
                        <h1
                            class="text-3xl font-bold text-slate-900 uppercase tracking-tight"
                        >
                            Informe Académico
                        </h1>
                        <p class="text-slate-500 mt-1">
                            Chess Society - Seguimiento de Jugador
                        </p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-slate-900">
                            {today}
                        </div>
                        <div
                            class="text-xs text-slate-500 uppercase tracking-wider mt-1"
                        >
                            Fecha de Emisión
                        </div>
                    </div>
                </div>

                <!-- Student Header -->
                <div
                    class="flex items-center gap-6 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100 print:border-slate-200"
                >
                    <div
                        class="w-20 h-20 bg-slate-800 text-white rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg print:border-slate-300"
                    >
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900">
                            {student.name}
                        </h2>
                        <div class="flex flex-wrap gap-4 mt-2 text-sm">
                            <span
                                class="px-3 py-1 bg-white border border-slate-200 rounded-full font-medium text-slate-600 flex items-center gap-2"
                            >
                                <span
                                    class="w-2 h-2 rounded-full {student.level ===
                                    'King'
                                        ? 'bg-amber-500'
                                        : 'bg-blue-500'}"
                                ></span>
                                Nivel: {student.level}
                            </span>
                            <span
                                class="px-3 py-1 bg-white border border-slate-200 rounded-full font-medium text-slate-600"
                            >
                                Grupo: {studentClass
                                    ? studentClass.name
                                    : "Sin asignar"}
                            </span>
                            <span
                                class="px-3 py-1 bg-white border border-slate-200 rounded-full font-medium text-slate-600"
                            >
                                Centro: {centerName}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-3 gap-6 mb-8 print:grid-cols-3">
                    <div
                        class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center print:border-slate-200"
                    >
                        <div class="text-3xl font-bold text-indigo-600 mb-1">
                            {stats.attendanceRate}%
                        </div>
                        <div
                            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                        >
                            Asistencia Global
                        </div>
                    </div>
                    <div
                        class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center print:border-slate-200"
                    >
                        <div class="text-3xl font-bold text-emerald-600 mb-1">
                            {stats.classesAttended}
                        </div>
                        <div
                            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                        >
                            Clases Asistidas
                        </div>
                    </div>
                    <div
                        class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center print:border-slate-200"
                    >
                        <div class="text-3xl font-bold text-amber-600 mb-1">
                            Activo
                        </div>
                        <div
                            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                        >
                            Estado Actual
                        </div>
                    </div>
                </div>

                <!-- Skills Analysis -->
                <div class="mb-8">
                    <h3
                        class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"
                    >
                        <Award class="w-5 h-5 text-indigo-500" />
                        Evaluación de Habilidades
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {#each skills as skill}
                            <div
                                class="p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors print:border-slate-200"
                            >
                                <div
                                    class="flex justify-between items-center mb-2"
                                >
                                    <div class="flex items-center gap-2">
                                        <svelte:component
                                            this={skill.icon}
                                            class="w-4 h-4 {skill.color}"
                                        />
                                        <span class="font-medium text-slate-700"
                                            >{skill.name}</span
                                        >
                                    </div>
                                    <span
                                        class="text-sm font-bold {skill.color}"
                                        >{skill.value}/100</span
                                    >
                                </div>
                                <div
                                    class="h-2 w-full bg-slate-100 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="{skill.bg} h-full rounded-full print:bg-slate-800"
                                        style="width: {skill.value}%"
                                    ></div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Teacher Notes -->
                <div class="mb-8">
                    <h3
                        class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"
                    >
                        <BookOpen class="w-5 h-5 text-indigo-500" />
                        Observaciones del Profesor
                    </h3>
                    <div
                        class="p-6 bg-slate-50 rounded-xl border-l-4 border-indigo-500 text-slate-700 italic leading-relaxed print:border-slate-300"
                    >
                        "{student.notes ||
                            "El alumno progresa adecuadamente según lo esperado para su nivel. Se recomienda mantener la constancia en la práctica de problemas tácticos."}"
                    </div>
                </div>

                <!-- Footer Signoff -->
                <div class="mt-12 pt-8 border-t border-slate-100 print:mt-20">
                    <div class="flex justify-between items-end">
                        <div class="text-xs text-slate-400">
                            Generado automáticamente por ChessNet Platform.
                        </div>
                        <div class="text-center">
                            <div
                                class="w-48 border-b border-slate-300 mb-2"
                            ></div>
                            <div
                                class="text-xs font-bold text-slate-500 uppercase"
                            >
                                Firma del Instructor
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    @media print {
        @page {
            margin: 0.5cm;
        }

        :global(body) {
            background: white;
            color: black;
        }

        /* Force background colors print */
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    }
</style>
