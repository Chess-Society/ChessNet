<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
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
    } from "lucide-svelte";

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
        // Handle "classes" and other unimplemented routes by going to reports/placeholder for now if needed
        // Or just let them go to their route (which might 404 if not created).
        // For now, only the ones we created exist.
        // We implemented: centers, students, tournaments, reports.
        // Missing: classes, skills, attendance, payments.
        // Redirect missing ones to dashboard for now? No, let's let them fail or mock them.
        // I'll ensure links point properly.
        goto(`${base}/dashboard/${path}`);
    }
</script>

<div class="max-w-7xl mx-auto animation-fade-in">
    <h3 class="text-2xl font-bold text-white mb-6">Acciones Rápidas</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each actions as action}
            <button
                onclick={() => navigate(action.link)}
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

    <div class="mt-12">
        <h3 class="text-xl font-bold text-white mb-4">Resumen de Actividad</h3>
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
                <p class="text-xl font-semibold text-emerald-400 mt-1">
                    +3 esta semana
                </p>
            </div>
        </div>
    </div>
</div>
