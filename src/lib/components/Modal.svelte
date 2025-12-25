<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { X } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";

    export let isOpen = false;
    export let title = "";
    export let size: "sm" | "md" | "lg" | "xl" = "md";

    const dispatch = createEventDispatcher();

    function close() {
        isOpen = false;
        dispatch("close");
    }

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            close();
        }
    }

    const maxWidthClass = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
    }[size];
</script>

{#if isOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div
            class="bg-[#1e293b] border border-slate-700 rounded-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh] {maxWidthClass}"
            transition:scale={{ duration: 200, start: 0.95 }}
            role="document"
        >
            <!-- Header -->
            <div
                class="px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0"
            >
                <h2 class="text-xl font-bold text-white pr-4">{title}</h2>
                <button
                    onclick={close}
                    class="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                    aria-label="Cerrar modal"
                >
                    <X class="w-6 h-6" />
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto custom-scrollbar">
                <slot />
            </div>

            <!-- Footer -->
            {#if $$slots.footer}
                <div
                    class="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3 shrink-0 bg-[#1e293b]/50"
                >
                    <slot name="footer" />
                </div>
            {/if}
        </div>
    </div>
{/if}
