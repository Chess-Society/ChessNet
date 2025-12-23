<script lang="ts">
    import type { ComponentType } from "svelte";
    import { fade } from "svelte/transition";

    interface Props {
        icon: ComponentType;
        title: string;
        description: string;
        actionLabel?: string;
        onAction?: () => void;
        secondaryActionLabel?: string;
        onSecondaryAction?: () => void;
    }

    let {
        icon: Icon,
        title,
        description,
        actionLabel,
        onAction,
        secondaryActionLabel,
        onSecondaryAction,
    }: Props = $props();
</script>

<div
    class="flex flex-col items-center justify-center p-12 text-center"
    transition:fade={{ duration: 200 }}
>
    <!-- Icon -->
    <div class="mb-6 relative">
        <div
            class="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl"
        ></div>
        <div
            class="relative p-6 bg-slate-800/50 rounded-2xl border border-slate-700"
        >
            <Icon class="w-16 h-16 text-slate-400" />
        </div>
    </div>

    <!-- Title -->
    <h3 class="text-2xl font-bold text-white mb-3">
        {title}
    </h3>

    <!-- Description -->
    <p class="text-slate-300 max-w-md mb-8">
        {description}
    </p>

    <!-- Actions -->
    {#if actionLabel && onAction}
        <div class="flex flex-col sm:flex-row gap-3">
            <button
                onclick={onAction}
                class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
                {actionLabel}
            </button>

            {#if secondaryActionLabel && onSecondaryAction}
                <button
                    onclick={onSecondaryAction}
                    class="px-6 py-3 bg-slate-800 text-slate-200 font-semibold rounded-xl hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    {secondaryActionLabel}
                </button>
            {/if}
        </div>
    {/if}
</div>
