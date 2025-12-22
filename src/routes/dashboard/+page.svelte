<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import ChessBoard from "$lib/components/ChessBoard.svelte";
    import {
        Layout,
        Users,
        BookOpen,
        Trophy,
        School,
        Target,
        ClipboardCheck,
        BarChart3,
        CreditCard,
        ChevronRight,
        LogOut,
        Settings,
    } from "lucide-svelte";

    let activeTab = "dashboard";

    function logout() {
        goto(`${base}/`);
    }

    const actions = [
        {
            title: "Centros Educativos",
            desc: "Gestionar centros y ubicaciones",
            icon: School,
            color: "text-blue-500",
            hover: "hover:border-blue-500/50",
            link: "centers",
        },
        {
            title: "Estudiantes",
            desc: "Gestionar alumnado e inscripciones",
            icon: Users,
            color: "text-emerald-500",
            hover: "hover:border-emerald-500/50",
            link: "students",
        },
        {
            title: "Clases",
            desc: "Organizar grupos y horarios",
            icon: BookOpen,
            color: "text-purple-500",
            hover: "hover:border-purple-500/50",
            link: "classes",
        },
        {
            title: "Habilidades",
            desc: "Definir temarios y competencias",
            icon: Target,
            color: "text-yellow-500",
            hover: "hover:border-yellow-500/50",
            link: "skills",
        },
        {
            title: "Gestionar Torneos",
            desc: "Organizar competiciones locales",
            icon: Trophy,
            color: "text-orange-500",
            hover: "hover:border-orange-500/50",
            link: "tournaments",
        },
        {
            title: "Control de Asistencia",
            desc: "Pasar lista y estadísticas",
            icon: ClipboardCheck,
            color: "text-pink-500",
            hover: "hover:border-pink-500/50",
            link: "attendance",
        },
        {
            title: "Informes",
            desc: "Reportes y análisis avanzados",
            icon: BarChart3,
            color: "text-cyan-500",
            hover: "hover:border-cyan-500/50",
            link: "reports",
        },
        {
            title: "Sistema de Pagos",
            desc: "Gestionar cobros y facturación",
            icon: CreditCard,
            color: "text-teal-500",
            hover: "hover:border-teal-500/50",
            link: "payments",
            badge: "BETA",
        },
    ];
</script>

<div class="flex h-screen bg-[#0f172a] text-slate-200 font-sans">
    <!-- Sidebar (Dark Theme) -->
    <aside
        class="w-72 bg-[#1e293b] border-r border-slate-700 hidden md:flex flex-col"
    >
        <div class="p-6">
            <h1
                class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2"
            >
                <Layout class="text-blue-400" /> ChessNet
            </h1>
        </div>

        <nav class="mt-4 px-4 space-y-2 flex-1">
            <button
                onclick={() => (activeTab = "dashboard")}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium transition-all {activeTab ===
                'dashboard'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
                <Layout class="w-5 h-5" /> Dashboard
            </button>
            <button
                onclick={() => (activeTab = "lessons")}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium transition-all {activeTab ===
                'lessons'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
                <BookOpen class="w-5 h-5" /> Lecciones
            </button>
            <button
                onclick={() => (activeTab = "students")}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium transition-all {activeTab ===
                'students'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
                <Users class="w-5 h-5" /> Alumnos
            </button>
            <button
                onclick={() => (activeTab = "tournaments")}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium transition-all {activeTab ===
                'tournaments'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
                <Trophy class="w-5 h-5" /> Torneos
            </button>
        </nav>

        <div class="p-4 border-t border-slate-700">
            <button
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all mb-2"
            >
                <Settings class="w-5 h-5" /> Configuración
            </button>
            <button
                onclick={logout}
                class="w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
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

        {#if activeTab === "dashboard"}
            <div class="max-w-7xl mx-auto animation-fade-in">
                <h3 class="text-2xl font-bold text-white mb-6">
                    Acciones Rápidas
                </h3>

                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {#each actions as action}
                        <button
                            class="group flex flex-col items-start p-6 bg-[#1e293b] rounded-2xl border border-slate-700/50 transition-all duration-300 {action.hover} hover:shadow-xl hover:-translate-y-1 relative w-full text-left cursor-pointer"
                        >
                            {#if action.badge}
                                <span
                                    class="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full z-10"
                                    >{action.badge}</span
                                >
                            {:else}
                                <ChevronRight
                                    class="absolute top-6 right-6 w-5 h-5 text-slate-600 group-hover:text-white transition-colors"
                                />
                            {/if}

                            <div
                                class="p-3 rounded-xl bg-slate-800/50 mb-4 group-hover:scale-110 transition-transform duration-300"
                            >
                                <svelte:component
                                    this={action.icon}
                                    class="w-8 h-8 {action.color}"
                                />
                            </div>

                            <h4
                                class="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors"
                            >
                                {action.title}
                            </h4>
                            <p class="text-sm text-slate-400 font-medium">
                                {action.desc}
                            </p>
                        </button>
                    {/each}
                </div>

                <!-- Recent Activity / Stats Section (Optional placeholder to fill space) -->
                <div class="mt-12">
                    <h3 class="text-xl font-bold text-white mb-4">
                        Resumen de Actividad
                    </h3>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div
                            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50"
                        >
                            <p class="text-slate-400 text-sm">Próxima Clase</p>
                            <p class="text-xl font-semibold text-white mt-1">
                                Hoy, 17:00 - Grupo A
                            </p>
                        </div>
                        <div
                            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50"
                        >
                            <p class="text-slate-400 text-sm">Alumnos Nuevos</p>
                            <p
                                class="text-xl font-semibold text-emerald-400 mt-1"
                            >
                                +3 esta semana
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        {:else if activeTab === "lessons"}
            <div
                class="bg-[#1e293b] rounded-3xl p-8 shadow-2xl border border-slate-700"
            >
                <h2 class="text-3xl font-bold text-white mb-8">
                    Tablero de Análisis
                </h2>
                <div class="flex justify-center">
                    <ChessBoard />
                </div>
            </div>
        {:else}
            <div
                class="flex flex-col items-center justify-center h-96 bg-[#1e293b] rounded-3xl border border-slate-700 border-dashed"
            >
                <Trophy class="w-16 h-16 text-slate-600 mb-4" />
                <h3 class="text-xl font-bold text-white">
                    Sección en Desarrollo
                </h3>
                <p class="text-slate-400">
                    Esta funcionalidad estará disponible pronto.
                </p>
            </div>
        {/if}
    </main>
</div>
