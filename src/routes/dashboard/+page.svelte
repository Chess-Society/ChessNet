<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { appStore } from "$lib/services/storage";
    import {
        School,
        Users,
        BookOpen,
        Trophy,
        Target,
        ClipboardCheck,
        BarChart3,
        CreditCard,
        ChevronRight,
        Activity,
        TrendingUp,
        Calendar,
        Clock,
    } from "lucide-svelte";

    // Suscribirse a los datos reales
    let store = $appStore;
    appStore.subscribe((value) => (store = value));

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

    function navigate(path: string) {
        goto(`${base}/dashboard/${path}`);
    }

    const today = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <div class="mb-8">
        <div class="flex justify-between items-end">
            <div>
                <h2 class="text-3xl font-bold text-white">Dashboard</h2>
                <p class="text-slate-400 mt-1">
                    Bienvenido de vuelta, andreslgumuzio@gmail.com
                </p>
            </div>
            <div class="text-right hidden sm:block">
                <p class="text-sm text-slate-400">Hoy</p>
                <p class="text-xl font-bold text-white capitalize">{today}</p>
            </div>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Centros -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div>
                <p class="text-slate-400 text-sm font-medium">
                    Centros Educativos
                </p>
                <p class="text-3xl font-bold text-white mt-2">
                    {store.centers.length}
                </p>
                <p
                    class="text-emerald-500 text-xs mt-2 flex items-center font-medium"
                >
                    <TrendingUp class="w-3 h-3 mr-1" />
                    +0 este mes
                </p>
            </div>
            <div class="bg-blue-500/10 p-3 rounded-xl">
                <School class="w-6 h-6 text-blue-500" />
            </div>
        </div>

        <!-- Estudiantes -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div>
                <p class="text-slate-400 text-sm font-medium">
                    Estudiantes Activos
                </p>
                <p class="text-3xl font-bold text-white mt-2">
                    {store.students.length}
                </p>
                <p
                    class="text-emerald-500 text-xs mt-2 flex items-center font-medium"
                >
                    <TrendingUp class="w-3 h-3 mr-1" />
                    +0 esta semana
                </p>
            </div>
            <div class="bg-emerald-500/10 p-3 rounded-xl">
                <Users class="w-6 h-6 text-emerald-500" />
            </div>
        </div>

        <!-- Ocupacion -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div>
                <p class="text-slate-400 text-sm font-medium">
                    Ocupación Global
                </p>
                <p class="text-3xl font-bold text-white mt-2">0%</p>
                <p class="text-slate-500 text-xs mt-2 font-medium">
                    0/0 plazas
                </p>
            </div>
            <div class="bg-purple-500/10 p-3 rounded-xl">
                <TrendingUp class="w-6 h-6 text-purple-500" />
            </div>
        </div>

        <!-- Ingresos (Mock) -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div>
                <p class="text-slate-400 text-sm font-medium">
                    Ingresos Mensuales
                </p>
                <p class="text-3xl font-bold text-white mt-2">0,00 €</p>
                <p class="text-slate-500 text-xs mt-2 font-medium">
                    Promedio 0,00 €/clase
                </p>
            </div>
            <div class="bg-yellow-500/10 p-3 rounded-xl">
                <span class="text-xl font-bold text-yellow-500">$</span>
            </div>
        </div>
    </div>

    <!-- Mid Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Sesiones de Hoy -->
        <div
            class="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 p-6 h-80 flex flex-col"
        >
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">Sesiones de Hoy</h3>
                <span class="text-xs text-slate-500 flex items-center">
                    <Clock class="w-3 h-3 mr-1" /> 0 programadas
                </span>
            </div>

            <div
                class="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl"
            >
                <Calendar class="w-12 h-12 mb-4 opacity-50" />
                <p>No hay clases programadas para hoy</p>
            </div>
        </div>

        <!-- Actividad Reciente -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 h-80">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">Actividad Reciente</h3>
                <Activity class="w-4 h-4 text-slate-500" />
            </div>
            <div class="text-center text-slate-500 mt-20">
                <p class="text-sm">No hay actividad reciente</p>
            </div>
        </div>
    </div>

    <!-- Performance (Placeholder) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Rendimiento por Centro -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">
                    Rendimiento por Centro
                </h3>
                <button class="text-xs text-blue-400 hover:text-blue-300"
                    >Ver todos</button
                >
            </div>
            {#if store.centers.length === 0}
                <div
                    class="bg-slate-900/50 p-4 rounded-xl flex items-center justify-between"
                >
                    <div>
                        <p class="text-slate-300 font-medium">Sin centros</p>
                        <p class="text-slate-500 text-xs">
                            Añade tu primer centro
                        </p>
                    </div>
                </div>
            {:else}
                {#each store.centers.slice(0, 2) as center}
                    <div
                        class="bg-slate-900/50 p-4 rounded-xl flex items-center justify-between mb-3 last:mb-0"
                    >
                        <div>
                            <p class="text-slate-300 font-medium">
                                {center.name}
                            </p>
                            <p class="text-slate-500 text-xs">
                                {center.location}
                            </p>
                        </div>
                        <span class="text-emerald-500 text-sm font-bold"
                            >100%</span
                        >
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Estado de clases -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">
                    Estado de las Clases
                </h3>
                <button class="text-xs text-blue-400 hover:text-blue-300"
                    >Ver todas</button
                >
            </div>
            <div class="text-center text-slate-500 mt-8">
                <p class="text-sm">No hay datos suficientes</p>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-8">
        <h3 class="text-xl font-bold text-white mb-6">Acciones Rápidas</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each actions as action}
                <button
                    onclick={() => navigate(action.link)}
                    class="group flex flex-col items-start p-6 bg-[#0f172a] rounded-2xl border border-slate-800 transition-all duration-300 {action.hover} hover:shadow-xl hover:-translate-y-1 relative w-full text-left cursor-pointer"
                >
                    {#if action.badge}
                        <span
                            class="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full z-10"
                            >{action.badge}</span
                        >
                    {/if}
                    <div class="flex justify-between w-full">
                        <svelte:component
                            this={action.icon}
                            class="w-10 h-10 mb-4 {action.color}"
                        />
                        <ChevronRight
                            class="w-5 h-5 text-slate-700 group-hover:text-white transition-colors"
                        />
                    </div>

                    <h4
                        class="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors"
                    >
                        {action.title}
                    </h4>
                    <p
                        class="text-sm text-slate-500 font-medium leading-relaxed"
                    >
                        {action.desc}
                    </p>
                </button>
            {/each}
        </div>
    </div>
</div>
