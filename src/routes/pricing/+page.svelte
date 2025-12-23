<script lang="ts">
    import {
        Check,
        X,
        Shield,
        Crown,
        GraduationCap,
        Zap,
        Sparkles,
    } from "lucide-svelte";
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
                "Control de Asistencia",
                "Sistema de Logros",
                "Generador de Diplomas",
                "Planificador de Clases",
                "Dashboard Personalizable",
            ],
            missing: [
                "CRM / Gestión de Interesados",
                "Perfiles Públicos para Padres",
                "Gestión de Torneos",
                "Informes Avanzados",
                "Exportación de Datos",
            ],
            color: "blue",
            gradient: "from-blue-500 to-cyan-500",
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
                "Sistema de Logros",
                "Generador de Diplomas",
                "Planificador de Clases",
                "CRM / Gestión de Interesados",
                "Perfiles Públicos para Padres",
                "Informes Detallados",
                "Control de Asistencia Avanzado",
                "Exportación de Datos",
                "Dashboard Personalizable",
            ],
            missing: [
                "Software de Torneos (Swiss)",
                "Centros y Clases Ilimitados",
            ],
            highlight: true,
            color: "emerald",
            gradient: "from-emerald-500 to-teal-500",
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
                "Sistema de Logros",
                "Generador de Diplomas",
                "Planificador de Clases",
                "CRM / Gestión de Interesados",
                "Perfiles Públicos para Padres",
                "Software de Torneos (Suizo)",
                "Informes y Analíticas",
                "Exportación de Datos",
                "Dashboard Personalizable",
                "Soporte Prioritario 24/7",
            ],
            missing: [],
            color: "purple",
            gradient: "from-purple-500 to-pink-500",
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
    <!-- Navbar -->
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
        <!-- Header -->
        <div class="text-center mb-16" in:fade={{ duration: 800, delay: 200 }}>
            <div
                class="inline-flex items-center gap-2 text-emerald-400 font-bold tracking-wider text-sm uppercase bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 mb-6"
            >
                <Sparkles class="w-4 h-4" />
                Precios de Lanzamiento (BETA)
            </div>
            <h1
                class="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
            >
                Elige el plan perfecto <br class="hidden md:block" /> para tu academia
            </h1>
            <p class="text-lg text-slate-400 max-w-2xl mx-auto">
                Sin comisiones ocultas. Precios fijos anuales que se adaptan a
                tu crecimiento.
                <span class="text-purple-400"
                    >Garantizamos el precio de renovación de por vida.</span
                >
            </p>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {#each plans as plan, i}
                <div
                    in:fly={{ y: 50, duration: 800, delay: 300 + i * 100 }}
                    class="relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full shadow-xl
                    {plan.highlight
                        ? 'scale-105 z-10 shadow-emerald-500/20'
                        : 'hover:scale-102'}"
                >
                    {#if plan.highlight}
                        <div
                            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-emerald-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg z-20"
                        >
                            Más Popular
                        </div>
                    {/if}

                    <!-- Colored Header -->
                    <div
                        class="bg-gradient-to-br {plan.gradient} p-8 text-white"
                    >
                        <div class="flex items-center gap-3 mb-3">
                            <div
                                class="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                            >
                                <svelte:component
                                    this={plan.icon}
                                    class="w-6 h-6"
                                />
                            </div>
                            <h3 class="text-2xl font-bold">
                                {plan.name}
                            </h3>
                        </div>
                        <p class="text-white/90 text-sm mb-6">
                            {plan.description}
                        </p>

                        <!-- Price in header -->
                        <div class="flex items-baseline gap-1">
                            <span class="text-5xl font-extrabold tracking-tight"
                                >{plan.price}</span
                            >
                            <span class="text-white/80 font-medium text-lg"
                                >{plan.period}</span
                            >
                        </div>
                    </div>

                    <!-- White Content Section -->
                    <div class="bg-white p-8 flex-1 flex flex-col">
                        <!-- Features -->
                        <div class="flex-1 space-y-3 mb-6">
                            {#each plan.features as feature}
                                <div class="flex items-start gap-3">
                                    <div
                                        class="mt-0.5 min-w-[1.25rem] h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"
                                    >
                                        <Check
                                            class="w-3 h-3 text-emerald-600"
                                        />
                                    </div>
                                    <span
                                        class="text-slate-700 text-sm font-medium"
                                        >{feature}</span
                                    >
                                </div>
                            {/each}
                            {#each plan.missing as missing}
                                <div class="flex items-start gap-3 opacity-40">
                                    <div
                                        class="mt-0.5 min-w-[1.25rem] h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0"
                                    >
                                        <X class="w-3 h-3 text-slate-400" />
                                    </div>
                                    <span class="text-slate-500 text-sm"
                                        >{missing}</span
                                    >
                                </div>
                            {/each}
                        </div>

                        <!-- CTA Button -->
                        <a
                            href="{base}/dashboard"
                            class="w-full py-4 rounded-xl font-bold text-center transition-all duration-200 flex items-center justify-center gap-2
                            {plan.highlight
                                ? 'bg-gradient-to-r ' +
                                  plan.gradient +
                                  ' hover:shadow-lg text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-white'}"
                        >
                            {plan.cta}
                        </a>
                    </div>
                </div>
            {/each}
        </div>

        <!-- FAQ -->
        <div class="mt-20 text-center border-t border-slate-800 pt-16">
            <h4 class="text-2xl font-bold text-white mb-8">
                Preguntas Frecuentes
            </h4>
            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left"
            >
                <div
                    class="bg-[#1e293b] p-6 rounded-xl border border-slate-700"
                >
                    <p
                        class="font-bold text-white mb-2 flex items-center gap-2"
                    >
                        <Check class="w-5 h-5 text-emerald-400" />
                        ¿Puedo cambiar de plan?
                    </p>
                    <p class="text-slate-400 text-sm">
                        Sí, puedes mejorar tu plan en cualquier momento pagando
                        solo la diferencia proporcional.
                    </p>
                </div>
                <div
                    class="bg-[#1e293b] p-6 rounded-xl border border-slate-700"
                >
                    <p
                        class="font-bold text-white mb-2 flex items-center gap-2"
                    >
                        <Shield class="w-5 h-5 text-blue-400" />
                        ¿Qué pasa con mis datos si dejo de pagar?
                    </p>
                    <p class="text-slate-400 text-sm">
                        Tus datos se mantienen seguros durante 1 año. Pasamos tu
                        cuenta al plan gratuito, pero no borramos nada sin
                        avisar.
                    </p>
                </div>
            </div>
        </div>
    </main>
</div>
