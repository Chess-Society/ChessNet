<script lang="ts">
    interface Props {
        size?: "sm" | "md" | "lg";
        color?: "emerald" | "white" | "slate";
        text?: string;
    }

    let { size = "md", color = "emerald", text }: Props = $props();

    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    const colorClasses = {
        emerald: "border-emerald-500 border-t-transparent",
        white: "border-white border-t-transparent",
        slate: "border-slate-400 border-t-transparent",
    };
</script>

<div class="flex flex-col items-center justify-center gap-3">
    <div
        class="rounded-full animate-spin {sizeClasses[size]} {colorClasses[
            color
        ]}"
        role="status"
        aria-label="Cargando"
    ></div>

    {#if text}
        <p class="text-sm text-slate-400 animate-pulse">
            {text}
        </p>
    {/if}
</div>

<style>
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>
