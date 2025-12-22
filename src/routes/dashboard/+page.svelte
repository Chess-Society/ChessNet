<script lang="ts">
    import { goto } from "$app/navigation";
    import ChessBoard from "$lib/components/ChessBoard.svelte";
    import { Layout, Users, BookOpen, Trophy } from "lucide-svelte";

    let activeTab = "dashboard";

    function logout() {
        goto("/");
    }
</script>

<div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
        class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col"
    >
        <div class="p-6">
            <h1 class="text-2xl font-bold text-primary flex items-center gap-2">
                ChessNet
            </h1>
        </div>
        <nav class="mt-4 px-4 space-y-2 flex-1">
            <button
                onclick={() => (activeTab = "dashboard")}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg font-medium transition cursor-pointer {activeTab ===
                'dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'}"
            >
                <Layout class="w-5 h-5" /> Dashboard
            </button>
            <button
                onclick={() => (activeTab = "lessons")}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg font-medium transition cursor-pointer {activeTab ===
                'lessons'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'}"
            >
                <BookOpen class="w-5 h-5" /> Lecciones / Tablero
            </button>
            <button
                onclick={() => (activeTab = "students")}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg font-medium transition cursor-pointer {activeTab ===
                'students'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'}"
            >
                <Users class="w-5 h-5" /> Alumnos
            </button>
            <button
                onclick={() => (activeTab = "tournaments")}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg font-medium transition cursor-pointer {activeTab ===
                'tournaments'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'}"
            >
                <Trophy class="w-5 h-5" /> Torneos
            </button>
        </nav>
        <div class="p-4 border-t">
            <button
                onclick={logout}
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                >Cerrar Sesión</button
            >
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
        <header
            class="bg-white shadow-sm p-4 flex justify-between items-center lg:hidden"
        >
            <h2 class="text-lg font-semibold text-gray-800">ChessNet</h2>
            <button onclick={logout} class="text-sm text-red-600">Salir</button>
        </header>

        <div class="p-8">
            {#if activeTab === "dashboard"}
                <div class="bg-white rounded-xl shadow p-6 fade-in">
                    <h3 class="text-md font-medium text-gray-500 mb-2">
                        Bienvenido a ChessNet
                    </h3>
                    <p class="text-2xl font-bold text-gray-900">
                        Panel de Control
                    </p>
                    <p class="mt-4 text-gray-600">Resumen de actividad.</p>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div
                            class="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500"
                        >
                            <p class="text-sm text-gray-500">
                                Estudiantes Activos
                            </p>
                            <p class="text-2xl font-bold">24</p>
                        </div>
                        <div
                            class="bg-white p-6 rounded-xl shadow border-l-4 border-green-500"
                        >
                            <p class="text-sm text-gray-500">Clases Hoy</p>
                            <p class="text-2xl font-bold">3</p>
                        </div>
                    </div>
                </div>
            {:else if activeTab === "lessons"}
                <div class="bg-white rounded-xl p-6 shadow">
                    <h2 class="text-2xl font-bold mb-6">Tablero de Análisis</h2>
                    <div class="flex justify-center">
                        <ChessBoard />
                    </div>
                </div>
            {:else}
                <div
                    class="bg-white rounded-xl p-6 shadow flex items-center justify-center h-64"
                >
                    <p class="text-gray-500 text-lg">
                        Sección en construcción para el MVP
                    </p>
                </div>
            {/if}
        </div>
    </main>
</div>
