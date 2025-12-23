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

    const colors = {
        info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
        success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
        warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
        error: "bg-red-500/10 border-red-500/20 text-red-500",
    };

    const iconColors = {
        info: "text-blue-500",
        success: "text-emerald-500",
        warning: "text-amber-500",
        error: "text-red-500",
    };
</script>

<div
    class="pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-xl border bg-[#1e293b] shadow-lg ring-1 ring-black ring-opacity-5 {colors[
        toast.type
    ]
        .replace('bg-', 'border-')
        .replace('text-', 'border-opacity-50 ')}"
    in:fly={{ y: 20, duration: 300 }}
    out:fade={{ duration: 200 }}
    role="alert"
>
    <div class="p-4 flex items-start gap-4">
        <div class="flex-shrink-0">
            <svelte:component
                this={icons[toast.type]}
                class="h-6 w-6 {iconColors[toast.type]}"
            />
        </div>
        <div class="flex-1 w-0 pt-0.5">
            <p class="text-sm font-medium text-white">
                {toast.message}
            </p>
        </div>
        <div class="flex-shrink-0 flex ml-4">
            <button
                class="inline-flex rounded-md text-slate-400 hover:text-white focus:outline-none"
                on:click={() => notifications.remove(toast.id)}
            >
                <X class="h-5 w-5" />
            </button>
        </div>
    </div>
    <!-- Progress bar for timeout could go here -->
    {#if toast.duration && toast.duration > 0}
        <div class="h-1 w-full bg-slate-800">
            <div
                class="h-full {colors[toast.type]
                    .replace('bg-', 'bg-')
                    .split(' ')[0]
                    .replace('/10', '')} transition-all duration-linear"
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
