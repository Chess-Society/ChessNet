<script lang="ts">
    import { Check, X, Shield, Crown, GraduationCap, Zap } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { base } from "$app/paths";
    import SEO from "$lib/components/SEO.svelte";

    const plans = [
        {
            id: "free",
            name: "Profesor",
            price: "Gratis",
            period: "siempre",
            icon: Zap,
            description:
                "Ideal para clases particulares o pequeños grupos extraescolares.",
            features: [
                "1 Centro Educativo",
                "2 Clases activas",
                "10 Alumnos máximo",
                "Control de Asistencia básico",
            ],
            missing: [
                "Gestión de Torneos",
                "Informes de Progreso",
                "Soporte Prioritario",
            ],
            color: "blue",
            cta: "Empezar Gratis",
        },
        {
            id: "profe",
            name: "Academia",
            price: "49€",
            period: "/ año",
            icon: GraduationCap,
            description:
                "Herramientas avanzadas para escuelas en crecimiento y gestión profesional.",
            features: [
                "3 Centros Educativos",
                "10 Clases activas",
                "50 Alumnos",
                "Informes Detallados",
                "Control de Asistencia Avanzado",
                "Exportación de Datos",
            ],
            missing: [
                "Software de Torneos (Swiss)",
                "Marca Blanca / Personalización",
            ],
            highlight: true,
            color: "emerald",
            cta: "Elegir Plan Academia",
        },
        {
            id: "club",
            name: "Club",
            price: "99€",
            period: "/ año",
            icon: Crown,
            description:
                "Potencia tu club con herramientas de competición y gestión masiva.",
            features: [
                "Centros Ilimitados",
                "Clases Ilimitadas",
                "Alumnos Ilimitados",
                "Software de Torneos (Suizo)",
                "Informes y Analíticas",
                "Soporte Prioritario 24/7",
                "Personalización del Dashboard",
            ],
            missing: [],
            color: "purple",
            cta: "Elegir Plan Club",
        },
    ];
</script>

<SEO
    title="Precios (BETA)"
    description="Planes flexibles para academias de ajedrez de todos los tamaños. Desde gratis hasta funciones profesionales. Prueba ChessNet sin compromiso."
/>

<div
    class="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-purple-500/30"
>
    <!-- Navbar simple -->
    <nav class="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <a
            href="{base}/"
            class="flex items-center gap-2 font-bold text-xl tracking-tight group"
        >
            <div class="relative">
                <div
                    class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"
                ></div>
                <div class="relative bg-slate-900 rounded-lg p-1">
                    <Shield class="w-8 h-8 text-emerald-500" />
                </div>
            </div>
            <span
                class="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                >ChessNet</span
            >
        </a>
        <a
            href="{base}/"
            class="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >Volver al Inicio</a
        >
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div class="text-center mb-16" in:fade={{ duration: 800, delay: 200 }}>
            <span
                class="text-emerald-400 font-bold tracking-wider text-sm uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20"
                >Precios de Lanzamiento (BETA)</span
            >
            <h1
                class="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
            >
                Elige la jugada correcta <br class="hidden md:block" /> para tu academia.
            </h1>
            <p class="text-lg text-slate-400 max-w-2xl mx-auto">
                Sin comisiones ocultas. Precios fijos anuales que se adaptan a
                tu crecimiento.
                <span class="text-purple-400"
                    >Garantizamos el precio de renovación de por vida.</span
                >
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {#each plans as plan, i}
                <div
                    in:fly={{ y: 50, duration: 800, delay: 300 + i * 100 }}
                    class="relative p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full
                    {plan.highlight
                        ? 'bg-slate-800/80 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 scale-105 z-10'
                        : 'bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'}"
                >
                    {#if plan.highlight}
                        <div
                            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
                        >
                            Más Popular
                        </div>
                    {/if}

                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-4">
                            <div
                                class="p-3 rounded-2xl bg-{plan.color}-500/10 text-{plan.color}-400"
                            >
                                <svelte:component
                                    this={plan.icon}
                                    class="w-8 h-8"
                                />
                            </div>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-2">
                            {plan.name}
                        </h3>
                        <p class="text-slate-400 text-sm h-10">
                            {plan.description}
                        </p>
                    </div>

                    <div class="mb-8 flex items-baseline gap-1">
                        <span
                            class="text-4xl font-extrabold text-white tracking-tight"
                            >{plan.price}</span
                        >
                        <span class="text-slate-500 font-medium"
                            >{plan.period}</span
                        >
                    </div>

                    <div class="flex-1 space-y-4 mb-8">
                        {#each plan.features as feature}
                            <div class="flex items-start gap-3">
                                <div
                                    class="mt-1 min-w-[1.25rem] h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"
                                >
                                    <Check class="w-3 h-3 text-emerald-400" />
                                </div>
                                <span class="text-slate-200 text-sm"
                                    >{feature}</span
                                >
                            </div>
                        {/each}
                        {#each plan.missing as missing}
                            <div class="flex items-start gap-3 opacity-50">
                                <div
                                    class="mt-1 min-w-[1.25rem] h-5 rounded-full bg-slate-700 flex items-center justify-center"
                                >
                                    <X class="w-3 h-3 text-slate-400" />
                                </div>
                                <span class="text-slate-500 text-sm"
                                    >{missing}</span
                                >
                            </div>
                        {/each}
                    </div>

                    <a
                        href="{base}/dashboard"
                        class="w-full py-4 rounded-xl font-bold text-center transition-all duration-200
                        {plan.highlight
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'}"
                    >
                        {plan.cta}
                    </a>
                </div>
            {/each}
        </div>

        <div class="mt-20 text-center border-t border-slate-800 pt-10">
            <h4 class="text-slate-400 font-medium mb-4">
                Preguntas Frecuentes
            </h4>
            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left"
            >
                <div>
                    <p class="font-bold text-white mb-2">
                        ¿Puedo cambiar de plan?
                    </p>
                    <p class="text-slate-500 text-sm">
                        Sí, puedes mejorar tu plan en cualquier momento pagando
                        solo la diferencia proporcional.
                    </p>
                </div>
                <div>
                    <p class="font-bold text-white mb-2">
                        ¿Qué pasa con mis datos si dejo de pagar?
                    </p>
                    <p class="text-slate-500 text-sm">
                        Tus datos se mantienen seguros durante 1 año. Pasamos tu
                        cuenta al plan gratuito, pero no borramos nada sin
                        avisar.
                    </p>
                </div>
            </div>
        </div>
    </main>
</div>
