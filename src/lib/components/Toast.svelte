<script lang="ts">
    import { onMount } from "svelte";
    import { fly, fade } from "svelte/transition";
    import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-svelte";
    import { notifications, type Toast } from "$lib/stores/notifications";

    export let toast: Toast;

    const icons = {
        info: Info,
        success: CheckCircle,
        warning: AlertCircle,
        error: XCircle,
    };

    const styles = {
        info: {
            container: "border-blue-500/20 shadow-lg shadow-blue-500/5",
            icon: "text-blue-500",
            bar: "bg-blue-500",
        },
        success: {
            container: "border-emerald-500/20 shadow-lg shadow-emerald-500/5",
            icon: "text-emerald-500",
            bar: "bg-emerald-500",
        },
        warning: {
            container: "border-amber-500/20 shadow-lg shadow-amber-500/5",
            icon: "text-amber-500",
            bar: "bg-amber-500",
        },
        error: {
            container: "border-red-500/20 shadow-lg shadow-red-500/5",
            icon: "text-red-500",
            bar: "bg-red-500",
        },
    };

    $: currentStyle = styles[toast.type];
</script>

<div
    class="pointer-events-auto flex w-full max-w-sm flex-col overflow-hidden rounded-xl border bg-[#0f172a]/90 backdrop-blur-xl ring-1 ring-white/5 {currentStyle.container} transition-all"
    in:fly={{ y: 20, duration: 300, x: 0 }}
    out:fade={{ duration: 200 }}
    role="alert"
>
    <div class="p-4 flex items-start gap-4">
        <div class="flex-shrink-0">
            <svelte:component
                this={icons[toast.type]}
                class="h-6 w-6 {currentStyle.icon}"
            />
        </div>
        <div class="flex-1 pt-0.5">
            <p class="text-sm font-semibold text-white leading-relaxed">
                {toast.message}
            </p>
        </div>
        <div class="flex-shrink-0 flex ml-4">
            <button
                class="inline-flex rounded-md text-slate-400 hover:text-white transition-colors focus:outline-none"
                onclick={() => notifications.remove(toast.id)}
            >
                <X class="h-4 w-4" />
            </button>
        </div>
    </div>
    <!-- Progress bar -->
    {#if toast.duration && toast.duration > 0}
        <div class="h-1 w-full bg-slate-800/50">
            <div
                class="h-full {currentStyle.bar} transition-all duration-linear origin-left"
                style="width: 100%; animation: shrink {toast.duration}ms linear forwards;"
            ></div>
        </div>
    {/if}
</div>

<style>
    @keyframes shrink {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }
</style>
