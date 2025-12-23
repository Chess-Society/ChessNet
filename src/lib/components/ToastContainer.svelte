<script lang="ts">
    import { toasts } from "$lib/stores/toast";
    import { fade, fly } from "svelte/transition";
    import {
        CheckCircle2,
        XCircle,
        Info,
        AlertTriangle,
        X,
    } from "lucide-svelte";

    const icons = {
        success: CheckCircle2,
        error: XCircle,
        info: Info,
        warning: AlertTriangle,
    };

    const colors = {
        success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        error: "bg-red-500/10 border-red-500/30 text-red-400",
        info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    };

    const iconColors = {
        success: "text-emerald-500",
        error: "text-red-500",
        info: "text-blue-500",
        warning: "text-yellow-500",
    };
</script>

<div
    class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md"
    role="region"
    aria-label="Notificaciones"
>
    {#each $toasts as toast (toast.id)}
        {@const Icon = icons[toast.type]}
        <div
            transition:fly={{ y: 50, duration: 300 }}
            class="flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-lg {colors[
                toast.type
            ]}"
            role="alert"
            aria-live="polite"
        >
            <Icon class="w-5 h-5 flex-shrink-0 {iconColors[toast.type]}" />
            <p class="flex-1 text-sm font-medium text-white">
                {toast.message}
            </p>
            <button
                onclick={() => toasts.dismiss(toast.id)}
                class="flex-shrink-0 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
                aria-label="Cerrar notificación"
            >
                <X class="w-4 h-4" />
            </button>
        </div>
    {/each}
</div>
