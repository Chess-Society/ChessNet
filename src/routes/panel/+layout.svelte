<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { initStore, appStore } from "$lib/services/storage";
    import {
        User,
        Settings,
        LogOut,
        ChevronRight,
        Home,
        LayoutDashboard,
    } from "lucide-svelte";
    import AchievementManager from "$lib/components/common/AchievementManager.svelte";
    import { AuthService } from "$lib/services/auth";

    onMount(() => {
        initStore();
    });

    function goHome() {
        goto(`${base}/panel`);
    }

    async function handleLogout() {
        await AuthService.logout();
        goto(`${base}/login`);
    }

    // Breadcrumbs Logic (Basic)
    $: pathSegments = $page.url.pathname
        .replace(base, "")
        .split("/")
        .filter((p) => p && p !== "panel");
    $: currentPlan = $appStore.settings.plan;

    const translateSegment = (seg: string) => {
        const map: Record<string, string> = {
            alumnos: "Mis Alumnos",
            torneos: "Torneos",
            pagos: "Finanzas",
            clases: "Clases",
            centros: "Centros",
            configuracion: "Configuración",
        };
        return map[seg] || seg;
    };
</script>

<div class="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
    <!-- Top Header -->
    <header
        class="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50"
    >
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
            <!-- Left: Logo & Breadcumbs -->
            <div class="flex items-center gap-6">
                <button
                    class="flex items-center gap-2 cursor-pointer focus:outline-none group"
                    onclick={goHome}
                    type="button"
                >
                    <div
                        class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform"
                    >
                        <LayoutDashboard class="w-5 h-5" />
                    </div>
                    <span
                        class="text-xl font-bold text-white tracking-tight hidden sm:block"
                        >ChessNet</span
                    >
                </button>

                <!-- Breadcrumbs Divider -->
                <div class="hidden md:flex h-6 w-px bg-slate-700"></div>

                <!-- Breadcrumbs -->
                <nav
                    class="hidden md:flex items-center gap-2 text-sm text-slate-500"
                >
                    <button
                        class="hover:text-slate-300 transition-colors"
                        onclick={goHome}
                    >
                        <Home class="w-4 h-4" />
                    </button>
                    {#if pathSegments.length > 0}
                        {#each pathSegments as segment}
                            <ChevronRight class="w-4 h-4 text-slate-700" />
                            <span class="capitalize text-slate-300 font-medium">
                                {translateSegment(segment)}
                            </span>
                        {/each}
                    {:else}
                        <ChevronRight class="w-4 h-4 text-slate-700" />
                        <span class="text-slate-300">Resumen</span>
                    {/if}
                </nav>
            </div>

            <!-- Right: Actions & User -->
            <div class="flex items-center gap-4">
                <!-- Dev Plan Switcher (Styled) -->
                <div
                    class="hidden sm:flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 border border-slate-700/50"
                >
                    <span
                        class="text-[10px] uppercase font-bold text-slate-500 px-2"
                        >Plan</span
                    >
                    <select
                        class="bg-transparent text-xs text-white font-medium border-none focus:ring-0 cursor-pointer py-1"
                        bind:value={$appStore.settings.plan}
                    >
                        <option value="free">Ajedrecista</option>
                        <option value="profe">Profe</option>
                        <option value="club">Club</option>
                    </select>
                </div>

                <!-- User Dropdown -->
                <div class="relative group ml-2">
                    <button
                        class="flex items-center gap-3 hover:bg-slate-800 py-1.5 px-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-700"
                    >
                        <div
                            class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-emerald-500/20 shadow-lg"
                        >
                            AD
                        </div>
                        <div class="hidden md:block text-left">
                            <div
                                class="text-xs font-bold text-white leading-none mb-0.5"
                            >
                                Admin
                            </div>
                            <div
                                class="text-[9px] text-emerald-400 font-bold tracking-wider uppercase"
                            >
                                Online
                            </div>
                        </div>
                    </button>

                    <!-- Dropdown Menu -->
                    <div
                        class="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50 translate-y-2 group-hover:translate-y-0"
                    >
                        <div
                            class="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50 rounded-t-xl"
                        >
                            <p class="text-sm text-white font-bold">
                                Profe de Ajedrez
                            </p>
                            <p class="text-xs text-slate-400 truncate">
                                admin@chessnet.com
                            </p>
                        </div>

                        <div class="py-1">
                            <a
                                href="{base}/panel/configuracion"
                                class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <Settings class="w-4 h-4" />
                                Configuración
                            </a>
                        </div>

                        <div class="py-1 border-t border-slate-700/50">
                            <button
                                onclick={handleLogout}
                                class="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                            >
                                <LogOut class="w-4 h-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <main class="py-6">
        <slot />
    </main>

    <AchievementManager />
</div>
