<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, scale } from "svelte/transition";
    import type { ComponentType } from "svelte";

    // Props
    export let icon: ComponentType;
    export let title: string;
    export let description: string;
    export let actionLabel: string = "";

    const dispatch = createEventDispatcher();

    function handleAction() {
        dispatch("action");
    }
</script>

<div
    class="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-700/50 bg-slate-800/20"
    in:fade={{ duration: 300 }}
>
    <div
        class="bg-slate-800/50 p-6 rounded-full mb-4 ring-1 ring-slate-700/50"
        in:scale={{ duration: 400, delay: 100 }}
    >
        <svelte:component
            this={icon}
            class="w-12 h-12 text-slate-500 opacity-80"
            strokeWidth={1.5}
        />
    </div>

    <h3 class="text-xl font-bold text-white mb-2 max-w-sm">
        {title}
    </h3>

    <p class="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
        {description}
    </p>

    {#if actionLabel}
        <button
            on:click={handleAction}
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/20 flex items-center gap-2"
        >
            {actionLabel}
        </button>
    {/if}
</div>
