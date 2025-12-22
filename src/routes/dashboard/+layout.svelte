<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import {
        Layout,
        Users,
        BookOpen,
        Trophy,
        Settings,
        LogOut,
    } from "lucide-svelte";

    function logout() {
        goto(`${base}/`);
    }

    $: currentPath = $page.url.pathname;
</script>

<div class="flex h-screen bg-[#0f172a] text-slate-200 font-sans">
    <!-- Sidebar (Dark Theme) -->
    <aside
        class="w-72 bg-[#1e293b] border-r border-slate-700 hidden md:flex flex-col flex-shrink-0"
    >
        <div class="p-6">
            <h1
                class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2"
            >
                <Layout class="text-blue-400" /> ChessNet
            </h1>
        </div>

        <nav class="mt-4 px-4 space-y-2 flex-1">
            <a
                href="{base}/dashboard"
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium transition-all {currentPath ===
                    `${base}/dashboard` || currentPath === `${base}/dashboard/`
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
                <Layout class="w-5 h-5" /> Dashboard
            </a>
            <a
                href="{base}/dashboard/lessons"
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium transition-all {currentPath.includes(
                    '/lessons',
                )
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
                <BookOpen class="w-5 h-5" /> Lecciones
            </a>
            <a
                href="{base}/dashboard/students"
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium transition-all {currentPath.includes(
                    '/students',
                )
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
                <Users class="w-5 h-5" /> Alumnos
            </a>
            <a
                href="{base}/dashboard/tournaments"
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium transition-all {currentPath.includes(
                    '/tournaments',
                )
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
                <Trophy class="w-5 h-5" /> Torneos
            </a>
        </nav>

        <div class="p-4 border-t border-slate-700">
            <button
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all mb-2 cursor-pointer"
            >
                <Settings class="w-5 h-5" /> Configuración
            </button>
            <button
                onclick={logout}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
            >
                <LogOut class="w-5 h-5" /> Cerrar Sesión
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <!-- Mobile Header -->
        <header class="flex justify-between items-center md:hidden mb-6">
            <h2 class="text-xl font-bold text-white">ChessNet</h2>
            <button onclick={logout} class="text-sm text-red-400">Salir</button>
        </header>

        <slot />
    </main>
</div>
