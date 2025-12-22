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
        if (path === "payments" && store.settings.plan === "free") {
            alert(
                `El Sistema de Pagos solo está disponible en los planes Profe y Club.`,
            );
            return;
        }
        goto(`${base}/dashboard/${path}`);
    }

    const today = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    // Derived Stats

    $: totalStudents = store.students.length;
    $: totalRevenue = store.payments.reduce((sum, p) => sum + p.amount, 0);

    // Real Schedule Logic
    const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];
    const currentDayName = days[new Date().getDay()];

    // Find classes that mention today's name in their schedule string
    $: todaysClasses = store.classes.filter((c) =>
        c.schedule.toLowerCase().includes(currentDayName.toLowerCase()),
    );
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <div class="mb-8">
        <div class="flex justify-between items-end">
            <div>
                <h2 class="text-3xl font-bold text-white">Dashboard</h2>
                <p class="text-slate-400 mt-1">
                    Bienvenido de vuelta, profesor.
                </p>
            </div>
            <div class="text-right hidden sm:block">
                <p class="text-sm text-slate-400">Hoy</p>
                <p class="text-xl font-bold text-white capitalize">{today}</p>
            </div>
        </div>
    </div>

    <!-- Stats Grid -->
    <!-- Quick Actions -->
    <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 mb-8">
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
                    Activos
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
                    <Users class="w-3 h-3 mr-1" />
                    Matriculados
                </p>
            </div>
            <div class="bg-emerald-500/10 p-3 rounded-xl">
                <Users class="w-6 h-6 text-emerald-500" />
            </div>
        </div>

        <!-- Grupos / Clases (Moved to pos 3) -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div>
                <p class="text-slate-400 text-sm font-medium">
                    Grupos / Clases
                </p>
                <p class="text-3xl font-bold text-white mt-2">
                    {store.classes.length}
                </p>
                <p class="text-slate-500 text-xs mt-2 font-medium">
                    En funcionamiento
                </p>
            </div>
            <div class="bg-yellow-500/10 p-3 rounded-xl">
                <BookOpen class="w-6 h-6 text-yellow-500" />
            </div>
        </div>

        <!-- Ingresos Totales (New at pos 4) -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div>
                <p class="text-slate-400 text-sm font-medium">
                    Ingresos Totales
                </p>
                <p class="text-3xl font-bold text-white mt-2">
                    {totalRevenue}€
                </p>
                <p
                    class="text-emerald-500 text-xs mt-2 flex items-center font-medium"
                >
                    <TrendingUp class="w-3 h-3 mr-1" />
                    Acumulado
                </p>
            </div>
            <div class="bg-teal-500/10 p-3 rounded-xl">
                <CreditCard class="w-6 h-6 text-teal-500" />
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
                <h3 class="text-lg font-bold text-white">
                    Sesiones de Hoy ({currentDayName})
                </h3>
                <span class="text-xs text-slate-500 flex items-center">
                    <Clock class="w-3 h-3 mr-1" />
                    {todaysClasses.length} programadas hoy
                </span>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {#if todaysClasses.length === 0}
                    <div
                        class="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl"
                    >
                        <Calendar class="w-12 h-12 mb-4 opacity-50" />
                        <p>No hay clases para hoy</p>
                    </div>
                {:else}
                    {#each todaysClasses as cls}
                        <button
                            class="w-full text-left bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center hover:bg-slate-800 transition-colors cursor-pointer"
                            onclick={() => navigate("classes")}
                        >
                            <div>
                                <h4 class="font-bold text-white">{cls.name}</h4>
                                <p
                                    class="text-sm text-slate-400 flex items-center gap-2"
                                >
                                    <Clock class="w-3 h-3" />
                                    {cls.schedule}
                                </p>
                            </div>
                            <div class="text-right">
                                <span
                                    class="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/20"
                                >
                                    {cls.level === "Pawn"
                                        ? "Peón"
                                        : cls.level === "Bishop"
                                          ? "Alfil"
                                          : cls.level === "Rook"
                                            ? "Torre"
                                            : cls.level === "King"
                                              ? "Rey"
                                              : cls.level}
                                </span>
                                <p class="text-xs text-slate-500 mt-1">
                                    {cls.students.length} alumnos
                                </p>
                            </div>
                        </button>
                    {/each}
                {/if}
            </div>
        </div>

        <!-- Actividad Reciente -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 h-80">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">Resumen</h3>
                <Activity class="w-4 h-4 text-slate-500" />
            </div>
            <div class="space-y-4">
                {#if store.students.length > 0}
                    <div class="flex items-center gap-3 text-sm">
                        <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span class="text-slate-300"
                            >{store.students.length} Estudiantes totales</span
                        >
                    </div>
                {/if}
                {#if store.centers.length > 0}
                    <div class="flex items-center gap-3 text-sm">
                        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span class="text-slate-300"
                            >{store.centers.length} Centros gestionados</span
                        >
                    </div>
                {/if}
                {#if store.tournaments.length > 0}
                    <div class="flex items-center gap-3 text-sm">
                        <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span class="text-slate-300"
                            >{store.tournaments.length} Torneos creados</span
                        >
                    </div>
                {/if}
                {#if store.students.length === 0 && store.centers.length === 0}
                    <p class="text-slate-500 text-center mt-10">
                        Sin actividad reciente.
                    </p>
                {/if}
            </div>
        </div>
    </div>

    <!-- Performance (Placeholder) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Rendimiento por Centro -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">Centros Recientes</h3>
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
                {#each store.centers.slice(0, 3) as center}
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
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Estado de clases -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">Clases Principales</h3>
            </div>
            {#if store.classes.length === 0}
                <div class="text-center text-slate-500 mt-8">
                    <p class="text-sm">No hay clases creadas</p>
                </div>
            {:else}
                <div class="space-y-3">
                    {#each store.classes.slice(0, 3) as cls}
                        <div
                            class="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center"
                        >
                            <span class="text-slate-300 text-sm"
                                >{cls.name}</span
                            >
                            <span
                                class="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded"
                                >{cls.level === "Pawn"
                                    ? "Peón"
                                    : cls.level === "Bishop"
                                      ? "Alfil"
                                      : cls.level === "Rook"
                                        ? "Torre"
                                        : cls.level === "King"
                                          ? "Rey"
                                          : cls.level}</span
                            >
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <!-- Quick Actions -->
</div>
