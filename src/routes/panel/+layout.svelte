<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import { initStore } from "$lib/services/storage";
    import { User, Settings } from "lucide-svelte";
    import AchievementManager from "$lib/components/common/AchievementManager.svelte";

    onMount(() => {
        initStore();
    });

    function goHome() {
        goto(`${base}/panel`);
    }
</script>

<div class="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
    <!-- Top Header -->
    <header class="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50">
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
            <button
                class="flex items-center gap-4 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
                onclick={goHome}
                type="button"
            >
                <h1 class="text-xl font-bold text-white">ChessNet</h1>
                <span
                    class="text-sm text-slate-500 border-l border-slate-700 pl-4"
                    >Sistema de Gestión</span
                >
            </button>

            <div class="flex items-center gap-4">
                <!-- Dev Plan Switcher -->
                <select
                    class="bg-slate-900 border border-slate-700 text-xs text-slate-400 rounded px-2 py-1"
                    onchange={(e) => {
                        const plan = e.currentTarget.value as any;
                        import("$lib/services/storage").then(({ appStore }) => {
                            appStore.update((s) => ({
                                ...s,
                                settings: { ...s.settings, plan },
                            }));
                        });
                    }}
                >
                    <option value="free">Plan Ajedrecista</option>
                    <option value="profe">Plan Profe</option>
                    <option value="club">Plan Club</option>
                </select>
                <button
                    class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                    onclick={() => goto(`${base}/panel/configuracion`)}
                    title="Configuración"
                    type="button"
                >
                    <Settings class="w-4 h-4 text-slate-400" />
                </button>
            </div>
        </div>
    </header>

    <main class="py-6">
        <slot />
    </main>

    <AchievementManager />
</div>
