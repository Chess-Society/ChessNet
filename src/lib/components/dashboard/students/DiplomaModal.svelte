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
    let instructorName = "El Instructor"; // Could be fetched from user profile
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
        // Optional: close after generating
        // close();
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
            transition:scale={{ duration: 250, start: 0.95 }}
        >
            <!-- Header -->
            <div
                class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white"
            >
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                        <Award class="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold">Generar Diploma</h2>
                        <p class="text-blue-100 text-sm">
                            Premia el esfuerzo de {studentName}
                        </p>
                    </div>
                </div>
                <button
                    on:click={close}
                    class="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X class="w-6 h-6" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
                <!-- Type Selection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Tipo de Diploma</label
                    >
                    <div class="grid grid-cols-2 gap-3">
                        <button
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {type ===
                            'excellence'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'}"
                            on:click={() => (type = "excellence")}
                        >
                            🏆 Excelencia
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {type ===
                            'participation'
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'}"
                            on:click={() => (type = "participation")}
                        >
                            ⭐ Participación
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {type ===
                            'completion'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'}"
                            on:click={() => (type = "completion")}
                        >
                            🎓 Finalización
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all {type ===
                            'tournament'
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'}"
                            on:click={() => (type = "tournament")}
                        >
                            ♛ Torneo
                        </button>
                    </div>
                </div>

                <!-- Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Motivo / Logro</label
                        >
                        <input
                            type="text"
                            bind:value={achievement}
                            placeholder="Ej. Ganador del Torneo de Navidad"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Fecha</label
                        >
                        <input
                            type="date"
                            bind:value={date}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Firma del Instructor</label
                    >
                    <input
                        type="text"
                        bind:value={instructorName}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div
                    class="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600"
                >
                    <div
                        class="flex items-center gap-2 mb-1 text-gray-900 font-medium"
                    >
                        <CheckCircle class="w-4 h-4 text-green-500" />
                        Resumen del Diploma
                    </div>
                    <p>
                        Otorgado a <span class="font-semibold"
                            >{studentName}</span
                        >
                        {#if achievement}por <span class="italic"
                                >"{achievement}"</span
                            >{/if}
                        en fecha {date}.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div
                class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3"
            >
                <button
                    on:click={close}
                    class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                    Cancelar
                </button>
                <button
                    on:click={handleGenerate}
                    class="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                    <Download class="w-4 h-4" />
                    Descargar PDF
                </button>
            </div>
        </div>
    </div>
{/if}
