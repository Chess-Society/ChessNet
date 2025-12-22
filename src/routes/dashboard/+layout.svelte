<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import { initStore } from "$lib/services/storage";
    import { User } from "lucide-svelte";

    onMount(() => {
        initStore();
    });

    function goHome() {
        goto(`${base}/dashboard`);
    }
</script>

<div class="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
    <!-- Top Header -->
    <header class="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50">
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
            <div
                class="flex items-center gap-4 cursor-pointer"
                onclick={goHome}
            >
                <h1 class="text-xl font-bold text-white">ChessNet</h1>
                <span
                    class="text-sm text-slate-500 border-l border-slate-700 pl-4"
                    >Sistema de Gestión</span
                >
            </div>

            <div class="flex items-center gap-4">
                <button
                    class="bg-[#1e293b] hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                    <User class="w-4 h-4" />
                    <span>andreslgumuzio...</span>
                </button>
            </div>
        </div>
    </header>

    <main class="py-6">
        <slot />
    </main>
</div>
