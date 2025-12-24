<script lang="ts">
    import {
        Shield,
        Calendar,
        Zap,
        Lock,
        BarChart3,
        Cog,
        Smartphone,
        Cloud,
    } from "lucide-svelte";
    import { base } from "$app/paths";
    import { fade, fly } from "svelte/transition";
    import SEO from "$lib/components/SEO.svelte";
</script>

<SEO
    title="Hoja de Ruta 2026+"
    description="Descubre las próximas funcionalidades de ChessNet: autenticación, análisis avanzados, automatización, app móvil y más. Roadmap actualizado para profesores de ajedrez."
/>

<div
    class="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden"
>
    <!-- Background Patterns -->
    <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div
            class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        ></div>
        <div
            class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"
        ></div>
    </div>

    <!-- Floating Orbs -->
    <div
        class="fixed top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none animate-pulse"
    ></div>
    <div
        class="fixed bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none"
    ></div>

    <!-- Navbar -->
    <nav
        class="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto"
    >
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

    <main class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Header -->
        <div class="text-center mb-16" in:fade={{ duration: 800 }}>
            <div
                class="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10"
            >
                <Calendar class="w-8 h-8" />
            </div>

            <h1
                class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
            >
                Hoja de Ruta
            </h1>

            <p
                class="text-lg text-slate-400 leading-relaxed mb-4 max-w-2xl mx-auto"
            >
                El futuro de la gestión de academias de ajedrez
            </p>

            <div
                class="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full border border-yellow-500/20 text-sm font-medium"
            >
                <Zap class="w-4 h-4" />
                Sujeto a cambios según feedback de la comunidad
            </div>
        </div>

        <!-- Timeline -->
        <div class="space-y-8">
            <!-- Q1 2026 -->
            <div in:fly={{ y: 50, duration: 800, delay: 200 }} class="relative">
                <div class="flex items-start gap-6">
                    <div class="flex-shrink-0 w-24 text-right">
                        <span class="text-sm font-bold text-emerald-400"
                            >Q1 2026</span
                        >
                    </div>
                    <div
                        class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
                    >
                        <div class="flex items-center gap-3 mb-4">
                            <div class="p-2 rounded-lg bg-emerald-500/10">
                                <Lock class="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 class="text-xl font-bold text-white">
                                Autenticación y Seguridad
                            </h3>
                        </div>
                        <ul class="space-y-2 text-slate-200">
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-400 mt-1">•</span>
                                <span>Sistema de registro con email</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-400 mt-1">•</span>
                                <span>Autenticación segura (login/logout)</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-400 mt-1">•</span>
                                <span>Recuperación de contraseña</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-400 mt-1">•</span>
                                <span>Gestión de perfil de profesor</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Q2 2026 -->
            <div in:fly={{ y: 50, duration: 800, delay: 300 }} class="relative">
                <div class="flex items-start gap-6">
                    <div class="flex-shrink-0 w-24 text-right">
                        <span class="text-sm font-bold text-blue-400"
                            >Q2 2026</span
                        >
                    </div>
                    <div
                        class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
                    >
                        <div class="flex items-center gap-3 mb-4">
                            <div class="p-2 rounded-lg bg-blue-500/10">
                                <Cloud class="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 class="text-xl font-bold text-white">
                                Mejoras de Gestión
                            </h3>
                        </div>
                        <ul class="space-y-2 text-slate-200">
                            <li class="flex items-start gap-2">
                                <span class="text-blue-400 mt-1">•</span>
                                <span
                                    >Importación masiva de datos (CSV/Excel)</span
                                >
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-blue-400 mt-1">•</span>
                                <span>Plantillas de clases y horarios</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-blue-400 mt-1">•</span>
                                <span
                                    >Sistema de copias de seguridad automáticas</span
                                >
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-blue-400 mt-1">•</span>
                                <span>Historial de cambios y auditoría</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Q3 2026 -->
            <div in:fly={{ y: 50, duration: 800, delay: 400 }} class="relative">
                <div class="flex items-start gap-6">
                    <div class="flex-shrink-0 w-24 text-right">
                        <span class="text-sm font-bold text-purple-400"
                            >Q3 2026</span
                        >
                    </div>
                    <div
                        class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
                    >
                        <div class="flex items-center gap-3 mb-4">
                            <div class="p-2 rounded-lg bg-purple-500/10">
                                <BarChart3 class="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 class="text-xl font-bold text-white">
                                Análisis y Reportes
                            </h3>
                        </div>
                        <ul class="space-y-2 text-slate-200">
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span>Dashboards personalizables</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span>Exportación avanzada (PDF, Excel)</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span>Gráficos de progreso por alumno</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span
                                    >Estadísticas comparativas entre centros</span
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Q4 2026 -->
            <div in:fly={{ y: 50, duration: 800, delay: 500 }} class="relative">
                <div class="flex items-start gap-6">
                    <div class="flex-shrink-0 w-24 text-right">
                        <span class="text-sm font-bold text-orange-400"
                            >Q4 2026</span
                        >
                    </div>
                    <div
                        class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
                    >
                        <div class="flex items-center gap-3 mb-4">
                            <div class="p-2 rounded-lg bg-orange-500/10">
                                <Cog class="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 class="text-xl font-bold text-white">
                                Automatización
                            </h3>
                        </div>
                        <ul class="space-y-2 text-slate-200">
                            <li class="flex items-start gap-2">
                                <span class="text-orange-400 mt-1">•</span>
                                <span>Recordatorios automáticos de pagos</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-orange-400 mt-1">•</span>
                                <span>Generación automática de recibos</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-orange-400 mt-1">•</span>
                                <span
                                    >Integración con herramientas de
                                    contabilidad</span
                                >
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-orange-400 mt-1">•</span>
                                <span>API para integraciones externas</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 2027+ -->
            <div in:fly={{ y: 50, duration: 800, delay: 600 }} class="relative">
                <div class="flex items-start gap-6">
                    <div class="flex-shrink-0 w-24 text-right">
                        <span class="text-sm font-bold text-cyan-400"
                            >2027+</span
                        >
                    </div>
                    <div
                        class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
                    >
                        <div class="flex items-center gap-3 mb-4">
                            <div class="p-2 rounded-lg bg-cyan-500/10">
                                <Smartphone class="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 class="text-xl font-bold text-white">
                                Expansión Profesional
                            </h3>
                        </div>
                        <ul class="space-y-2 text-slate-200">
                            <li class="flex items-start gap-2">
                                <span class="text-cyan-400 mt-1">•</span>
                                <span
                                    >App móvil para gestión sobre la marcha</span
                                >
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-cyan-400 mt-1">•</span>
                                <span>Modo offline con sincronización</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-cyan-400 mt-1">•</span>
                                <span
                                    >Colaboración multi-profesor (mismo centro)</span
                                >
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-cyan-400 mt-1">•</span>
                                <span
                                    >Personalización avanzada (marca blanca para
                                    clubes)</span
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Disclaimer -->
        <div class="mt-16 text-center">
            <div
                class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto"
            >
                <p class="text-slate-400 mb-4">
                    Esta hoja de ruta es orientativa y puede cambiar según las
                    necesidades de los profesores y recursos disponibles.
                </p>
                <p class="text-slate-200">
                    ¿Tienes sugerencias? <a
                        href="https://discord.gg/G7SrFtJHnr"
                        class="text-emerald-400 hover:text-emerald-300 font-medium"
                        >Únete a nuestra comunidad en Discord</a
                    >.
                </p>
            </div>
        </div>
    </main>
</div>
