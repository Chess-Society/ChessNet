<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { AlertTriangle, X } from "lucide-svelte";

    export let isOpen = false;
    export let title = "¿Estás seguro?";
    export let message = "Esta acción no se puede deshacer.";
    export let confirmText = "Eliminar";
    export let cancelText = "Cancelar";
    export let type: "danger" | "warning" | "info" = "danger";

    const dispatch = createEventDispatcher();

    function handleConfirm() {
        dispatch("confirm");
        isOpen = false;
    }

    function handleCancel() {
        dispatch("cancel");
        isOpen = false;
    }

    const colors = {
        danger: {
            bg: "bg-red-500/10",
            text: "text-red-500",
            border: "border-red-500/20",
            btn: "bg-red-600 hover:bg-red-500",
        },
        warning: {
            bg: "bg-amber-500/10",
            text: "text-amber-500",
            border: "border-amber-500/20",
            btn: "bg-amber-600 hover:bg-amber-500",
        },
        info: {
            bg: "bg-blue-500/10",
            text: "text-blue-500",
            border: "border-blue-500/20",
            btn: "bg-blue-600 hover:bg-blue-500",
        },
    };
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center px-4"
        transition:fade={{ duration: 200 }}
    >
        <!-- Backdrop -->
        <button
            class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm w-full h-full cursor-default"
            on:click={handleCancel}
            aria-label="Cerrar modal"
        ></button>

        <!-- Modal Panel -->
        <div
            class="relative bg-[#1e293b] border {colors[type]
                .border} rounded-2xl w-full max-w-md shadow-2xl p-6"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            <div class="flex items-start gap-4">
                <div class="{colors[type].bg} p-3 rounded-xl flex-shrink-0">
                    <AlertTriangle class="w-6 h-6 {colors[type].text}" />
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-white leading-none mt-1">
                        {title}
                    </h3>
                    <p class="text-slate-400 mt-2 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
                <button
                    on:click={handleCancel}
                    class="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {cancelText}
                </button>
                <button
                    on:click={handleConfirm}
                    class="px-5 py-2 {colors[type]
                        .btn} text-white font-bold rounded-lg transition-colors shadow-lg shadow-black/20"
                >
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
{/if}
