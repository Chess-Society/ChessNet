<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { X, Award, Download, CheckCircle } from "lucide-svelte";
    import {
        generateDiploma,
        type DiplomaOptions,
    } from "$lib/services/pdfGenerator";

    export let isOpen = false;
    export let studentName = "";
    export let centerName = "";

    const dispatch = createEventDispatcher();

    let achievement = "";
    let type: DiplomaOptions["type"] = "excellence";
    let instructorName = "El Instructor";
    let date = new Date().toISOString().split("T")[0];

    function close() {
        dispatch("close");
    }

    function handleGenerate() {
        generateDiploma({
            studentName,
            achievement: achievement || undefined,
            centerName,
            instructorName,
            date,
            type,
        });
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="w-full max-w-lg bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
            transition:scale={{ duration: 250, start: 0.95 }}
        >
            <!-- Header -->
            <div
                class="bg-[#0f172a] p-6 flex justify-between items-center border-b border-slate-700"
            >
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-indigo-500/20 rounded-lg">
                        <Award class="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">
                            Generar Diploma
                        </h2>
                        <p class="text-slate-400 text-sm">
                            Premia el esfuerzo de {studentName}
                        </p>
                    </div>
                </div>
                <button
                    onclick={close}
                    class="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition-colors"
                >
                    <X class="w-6 h-6" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
                <!-- Type Selection -->
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2"
                        >Tipo de Diploma</label
                    >
                    <div class="grid grid-cols-2 gap-3">
                        <button
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {type ===
                            'excellence'
                                ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                : 'border-slate-700 hover:bg-slate-800 text-slate-400'}"
                            onclick={() => (type = "excellence")}
                        >
                            🏆 Excelencia
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {type ===
                            'participation'
                                ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                                : 'border-slate-700 hover:bg-slate-800 text-slate-400'}"
                            onclick={() => (type = "participation")}
                        >
                            ⭐ Participación
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {type ===
                            'completion'
                                ? 'border-green-500 bg-green-500/20 text-green-400'
                                : 'border-slate-700 hover:bg-slate-800 text-slate-400'}"
                            onclick={() => (type = "completion")}
                        >
                            🎓 Finalización
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {type ===
                            'tournament'
                                ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                                : 'border-slate-700 hover:bg-slate-800 text-slate-400'}"
                            onclick={() => (type = "tournament")}
                        >
                            ♛ Torneo
                        </button>
                    </div>
                </div>

                <!-- Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-slate-300 mb-1"
                            >Motivo / Logro</label
                        >
                        <input
                            type="text"
                            bind:value={achievement}
                            placeholder="Ej. Ganador del Torneo de Navidad"
                            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-slate-300 mb-1"
                            >Fecha</label
                        >
                        <input
                            type="date"
                            bind:value={date}
                            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1"
                        >Firma del Instructor</label
                    >
                    <input
                        type="text"
                        bind:value={instructorName}
                        placeholder="El Instructor"
                        class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div
                    class="p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-sm text-slate-300"
                >
                    <div
                        class="flex items-center gap-2 mb-1 text-white font-medium"
                    >
                        <CheckCircle class="w-4 h-4 text-emerald-400" />
                        Resumen del Diploma
                    </div>
                    <p>
                        Otorgado a <span class="font-semibold text-white"
                            >{studentName}</span
                        >
                        {#if achievement}por <span
                                class="italic text-indigo-400"
                                >"{achievement}"</span
                            >{/if}
                        en fecha {date}.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div
                class="p-6 bg-[#0f172a] border-t border-slate-700 flex justify-end gap-3"
            >
                <button
                    onclick={close}
                    class="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onclick={handleGenerate}
                    class="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg transition-all hover:-translate-y-0.5"
                >
                    <Download class="w-4 h-4" />
                    Descargar PDF
                </button>
            </div>
        </div>
    </div>
{/if}
