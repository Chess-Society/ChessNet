<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import {
        Shield,
        Users,
        Trophy,
        Brain,
        ChevronRight,
        BarChart3,
        School,
        CheckCircle2,
        ArrowRight,
    } from "lucide-svelte";
    import { onMount } from "svelte";

    function login() {
        goto(`${base}/dashboard`);
    }

    let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<div
    class="bg-[#0f172a] min-h-screen text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden"
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

    <!-- Header -->
    <header
        class="fixed inset-x-0 top-0 z-50 transition-all duration-300 {scrollY >
        10
            ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800'
            : 'bg-transparent'}"
    >
        <nav
            class="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto"
            aria-label="Global"
        >
            <div class="flex lg:flex-1">
                <a
                    href="{base}/"
                    class="-m-1.5 p-1.5 text-2xl font-bold flex items-center gap-2 group"
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
                        class="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-extrabold tracking-tight"
                        >ChessNet</span
                    >
                </a>
            </div>
            <div class="hidden lg:flex lg:gap-x-12">
                <a
                    href="#features"
                    class="text-sm font-medium leading-6 text-slate-300 hover:text-white hover:scale-105 transition-all"
                    >Características</a
                >
                <div class="px-2 pt-1.5">
                    <script
                        async
                        src="https://js.stripe.com/v3/buy-button.js"
                    ></script>
                    <stripe-buy-button
                        buy-button-id="buy_btn_1ShDC7RBnPDD6EfRe0xpMg3F"
                        publishable-key="pk_live_51RzKQXRBnPDD6EfRTxX5YwO774aneUhFFobOgN60B6L119zJqahr3xkTIkq9Y4U9yROltHJGfbIREKP8yrLj19cb00gLokkz1l"
                    >
                    </stripe-buy-button>
                </div>
                <a
                    href="#pricing"
                    class="text-sm font-medium leading-6 text-slate-300 hover:text-white hover:scale-105 transition-all flex items-center gap-1"
                    >Precios <span
                        class="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30"
                        >BETA</span
                    ></a
                >
            </div>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
                <button
                    onclick={login}
                    class="text-sm font-semibold leading-6 text-slate-300 hover:text-white px-4 py-2 transition-colors"
                >
                    Iniciar Sesión
                </button>
                <button
                    onclick={login}
                    class="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:scale-105 hover:shadow-emerald-500/40 transition-all duration-300 cursor-pointer border border-transparent"
                >
                    Empezar Gratis
                </button>
            </div>
        </nav>
    </header>

    <!-- Hero -->
    <div class="relative isolate px-6 pt-14 lg:px-8">
        <div
            class="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 text-center z-10 relative"
        >
            <div class="hidden sm:mb-8 sm:flex sm:justify-center">
                <div
                    class="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition-all cursor-default"
                >
                    Gestión integral para escuelas de ajedrez <span
                        class="font-semibold text-emerald-400"
                        ><span class="absolute inset-0" aria-hidden="true"
                        ></span>v1.0 BETA</span
                    >
                </div>
            </div>
            <h1
                class="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6 drop-shadow-2xl"
            >
                Domina la gestión de tu <br />
                <span
                    class="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x"
                    >Academia de Ajedrez</span
                >
            </h1>
            <p class="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                Olvídate de las hojas de cálculo. Centraliza alumnos, clases,
                torneos y pagos en una plataforma diseñada por y para
                ajedrecistas.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <button
                    onclick={login}
                    class="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-2 group"
                >
                    Acceder al Dashboard
                    <ArrowRight
                        class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    />
                </button>
                <a
                    href="#features"
                    class="text-sm font-semibold leading-6 text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                    Ver demo <ChevronRight class="w-4 h-4" />
                </a>
            </div>
        </div>

        <!-- Mockup Visual -->
        <div
            class="relative w-full max-w-6xl mx-auto -mt-20 lg:-mt-32 perspective-1000 opacity-90 hover:opacity-100 transition-opacity duration-700"
        >
            <div
                class="relative rounded-xl bg-slate-900/50 backdrop-blur-xl border border-slate-700 p-2 shadow-2xl transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out origin-top"
            >
                <div
                    class="rounded-lg bg-[#0f172a] overflow-hidden border border-slate-800 h-[300px] md:h-[500px] flex items-center justify-center relative"
                >
                    <!-- A simple generic dashboard representation showing the app structure -->
                    <div
                        class="absolute inset-x-0 top-0 h-12 bg-slate-900 border-b border-slate-700 flex items-center px-4 gap-2"
                    >
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        <div class="ml-4 w-64 h-6 bg-slate-800 rounded"></div>
                    </div>
                    <div
                        class="grid grid-cols-4 gap-4 p-8 w-full mt-12 mx-auto max-w-5xl opacity-50"
                    >
                        <div
                            class="col-span-1 h-32 bg-slate-800 rounded-xl animate-pulse"
                        ></div>
                        <div
                            class="col-span-1 h-32 bg-slate-800 rounded-xl animate-pulse delay-75"
                        ></div>
                        <div
                            class="col-span-1 h-32 bg-slate-800 rounded-xl animate-pulse delay-150"
                        ></div>
                        <div
                            class="col-span-1 h-32 bg-slate-800 rounded-xl animate-pulse delay-200"
                        ></div>
                        <div
                            class="col-span-3 h-64 bg-slate-800 rounded-xl animate-pulse mt-4 delay-300"
                        ></div>
                        <div
                            class="col-span-1 h-64 bg-slate-800 rounded-xl animate-pulse mt-4 delay-500"
                        ></div>
                    </div>
                    <div
                        class="absolute inset-0 flex items-center justify-center"
                    >
                        <button
                            onclick={login}
                            class="bg-slate-900/80 backdrop-blur border border-slate-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-110 transition-transform cursor-pointer shadow-2xl"
                        >
                            Entrar a la Demo Interactiva
                        </button>
                    </div>
                </div>
            </div>
            <!-- Reflection -->
            <div
                class="absolute inset-x-8 -bottom-12 h-12 bg-gradient-to-b from-emerald-500/20 to-transparent blur-2xl -z-10 mx-auto w-3/4"
            ></div>
        </div>
    </div>

    <!-- Features -->
    <div id="features" class="relative py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:text-center mb-16">
                <h2 class="text-base font-semibold leading-7 text-emerald-400">
                    Características Principales
                </h2>
                <p
                    class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                    Todo lo que necesita un club moderno
                </p>
                <p class="mt-6 text-lg leading-8 text-slate-400">
                    Desde pequeñas academias hasta grandes clubes, ChessNet
                    escala contigo.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div
                    class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
                >
                    <div
                        class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                    >
                        <Users class="w-24 h-24 text-blue-500" />
                    </div>
                    <div
                        class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all"
                    >
                        <Users class="w-6 h-6" />
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">
                        Gestión de Alumnos
                    </h3>
                    <p class="text-slate-400 leading-relaxed">
                        Base de datos completa con niveles ELO, historial de
                        clases y notas personalizadas.
                    </p>
                </div>

                <!-- Feature 2 -->
                <div
                    class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
                >
                    <div
                        class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                    >
                        <BarChart3 class="w-24 h-24 text-emerald-500" />
                    </div>
                    <div
                        class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all"
                    >
                        <BarChart3 class="w-6 h-6" />
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">
                        Informes y Asistencia
                    </h3>
                    <p class="text-slate-400 leading-relaxed">
                        Controla la asistencia diaria y visualiza estadísticas
                        de crecimiento y retención.
                    </p>
                </div>

                <!-- Feature 3 -->
                <div
                    class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
                >
                    <div
                        class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                    >
                        <Trophy class="w-24 h-24 text-orange-500" />
                    </div>
                    <div
                        class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all"
                    >
                        <Trophy class="w-6 h-6" />
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">
                        Torneos Internos
                    </h3>
                    <p class="text-slate-400 leading-relaxed">
                        Organiza competiciones, genera emparejamientos y guarda
                        históricos de resultados.
                    </p>
                </div>

                <!-- Feature 4 -->
                <div
                    class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
                >
                    <div
                        class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                    >
                        <School class="w-24 h-24 text-purple-500" />
                    </div>
                    <div
                        class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all"
                    >
                        <School class="w-6 h-6" />
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">
                        Multi-Centro
                    </h3>
                    <p class="text-slate-400 leading-relaxed">
                        ¿Gestionas varias escuelas? Adminístralas todas desde un
                        único panel de control.
                    </p>
                </div>

                <!-- Feature 5 -->
                <div
                    class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
                >
                    <div
                        class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                    >
                        <Brain class="w-24 h-24 text-pink-500" />
                    </div>
                    <div
                        class="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition-all"
                    >
                        <Brain class="w-6 h-6" />
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">
                        Material Didáctico
                    </h3>
                    <p class="text-slate-400 leading-relaxed">
                        Base de datos de habilidades y lecciones para
                        estructurar tu plan de estudios.
                    </p>
                </div>

                <div
                    class="relative group bg-slate-800/30 p-8 rounded-3xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-center"
                >
                    <h3 class="text-xl font-bold text-white mb-2">
                        Más Próximamente
                    </h3>
                    <p class="text-slate-500 text-sm">
                        Estamos trabajando en pagos online, app para padres y
                        mucho más.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Pricing Section -->
    <div id="pricing" class="py-24 sm:py-32 bg-slate-900/30">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl sm:text-center">
                <h2
                    class="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                    Planes diseñados para crecer
                </h2>
                <p class="mt-6 text-lg leading-8 text-slate-400">
                    Elige el plan que mejor se adapte a tu academia. Sin
                    permanencia.
                </p>
            </div>
            <div
                class="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-slate-700 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none"
            >
                <!-- Free -->
                <div class="p-8 sm:p-10 lg:flex-auto">
                    <h3 class="text-2xl font-bold tracking-tight text-white">
                        Ajedrecista (Gratis)
                    </h3>
                    <p class="mt-6 text-base leading-7 text-slate-400">
                        Perfecto para empezar con un pequeño grupo.
                    </p>
                    <div class="mt-10 flex items-center gap-x-4">
                        <h4
                            class="flex-none text-sm font-semibold leading-6 text-emerald-400"
                        >
                            Qué incluye
                        </h4>
                        <div class="h-px flex-auto bg-slate-700"></div>
                    </div>
                    <ul
                        role="list"
                        class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-300 sm:grid-cols-2 sm:gap-6"
                    >
                        <li class="flex gap-x-3">
                            <CheckCircle2
                                class="h-6 w-5 flex-none text-emerald-400"
                            /> 1 Centro
                        </li>
                        <li class="flex gap-x-3">
                            <CheckCircle2
                                class="h-6 w-5 flex-none text-emerald-400"
                            /> 10 Alumnos
                        </li>
                        <li class="flex gap-x-3">
                            <CheckCircle2
                                class="h-6 w-5 flex-none text-emerald-400"
                            /> Control Asistencia
                        </li>
                    </ul>
                </div>
                <div
                    class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0"
                >
                    <div
                        class="rounded-2xl bg-slate-800 py-10 text-center ring-1 ring-inset ring-slate-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16"
                    >
                        <div class="mx-auto max-w-xs px-8">
                            <p class="text-base font-semibold text-slate-400">
                                Para siempre
                            </p>
                            <p
                                class="mt-6 flex items-baseline justify-center gap-x-2"
                            >
                                <span
                                    class="text-5xl font-bold tracking-tight text-white"
                                    >0€</span
                                >
                            </p>
                            <button
                                onclick={login}
                                class="mt-10 block w-full rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                                >Crear cuenta</button
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="mx-auto mt-8 max-w-2xl rounded-3xl ring-1 ring-emerald-500 lg:mx-0 lg:flex lg:max-w-none bg-slate-800/20 relative overflow-hidden"
            >
                <div
                    class="absolute top-0 right-0 p-4 bg-emerald-500 text-white text-xs font-bold uppercase rounded-bl-xl"
                >
                    Recomendado
                </div>
                <!-- Pro -->
                <div class="p-8 sm:p-10 lg:flex-auto">
                    <h3 class="text-2xl font-bold tracking-tight text-white">
                        Profe / Academia
                    </h3>
                    <p class="mt-6 text-base leading-7 text-slate-400">
                        Todo lo necesario para profesionalizar tu enseñanza.
                    </p>
                    <div class="mt-10 flex items-center gap-x-4">
                        <h4
                            class="flex-none text-sm font-semibold leading-6 text-emerald-400"
                        >
                            Todo lo de gratis más...
                        </h4>
                        <div class="h-px flex-auto bg-slate-700"></div>
                    </div>
                    <ul
                        role="list"
                        class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-300 sm:grid-cols-2 sm:gap-6"
                    >
                        <li class="flex gap-x-3">
                            <CheckCircle2
                                class="h-6 w-5 flex-none text-emerald-400"
                            /> 3 Centros
                        </li>
                        <li class="flex gap-x-3">
                            <CheckCircle2
                                class="h-6 w-5 flex-none text-emerald-400"
                            /> 50 Alumnos
                        </li>
                        <li class="flex gap-x-3">
                            <CheckCircle2
                                class="h-6 w-5 flex-none text-emerald-400"
                            /> Informes Avanzados
                        </li>
                        <li class="flex gap-x-3">
                            <CheckCircle2
                                class="h-6 w-5 flex-none text-emerald-400"
                            /> Exportación de Datos
                        </li>
                    </ul>
                </div>
                <div
                    class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0"
                >
                    <div
                        class="rounded-2xl bg-emerald-600/10 py-10 text-center ring-1 ring-inset ring-emerald-500/20 lg:flex lg:flex-col lg:justify-center lg:py-16"
                    >
                        <div class="mx-auto max-w-xs px-8">
                            <p class="text-base font-semibold text-emerald-400">
                                Anual
                            </p>
                            <p
                                class="mt-6 flex items-baseline justify-center gap-x-2"
                            >
                                <span
                                    class="text-5xl font-bold tracking-tight text-white"
                                    >49€</span
                                >
                                <span
                                    class="text-sm font-semibold leading-6 text-slate-400"
                                    >/año</span
                                >
                            </p>
                            <a
                                href="{base}/pricing"
                                class="mt-10 block w-full rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                                >Ver todos los detalles</a
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-12">
                <a
                    href="{base}/pricing"
                    class="text-emerald-400 hover:text-emerald-300 font-medium flex items-center justify-center gap-2 group"
                >
                    Comparar todos los planes (incluido Club) <ArrowRight
                        class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                </a>
            </div>
        </div>
    </div>
    <!-- CTA Section -->
    <div class="relative isolate py-16 sm:py-24">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div
                class="relative overflow-hidden bg-slate-900 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32 border border-slate-800"
            >
                <div
                    class="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 -z-10"
                ></div>
                <h2
                    class="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                    Empieza a profesionalizar tu enseñanza hoy.
                </h2>
                <p
                    class="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-slate-300"
                >
                    Únete a otros profesores que ya ahorran horas de gestión
                    cada semana.
                </p>
                <div class="mt-10 flex justify-center gap-x-6">
                    <button
                        onclick={login}
                        class="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105"
                    >
                        Crear Cuenta Gratis
                    </button>
                </div>

                <!-- Decorative circles -->
                <svg
                    viewBox="0 0 1024 1024"
                    class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                    aria-hidden="true"
                >
                    <circle
                        cx="512"
                        cy="512"
                        r="512"
                        fill="url(#gradient-cta)"
                        fill-opacity="0.2"
                    />
                    <defs>
                        <radialGradient id="gradient-cta">
                            <stop stop-color="#10b981" />
                            <stop offset="1" stop-color="#0f172a" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[#0b1120] border-t border-slate-800">
        <div
            class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8"
        >
            <div class="flex justify-center space-x-6 md:order-2">
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    class="text-slate-400 hover:text-emerald-400">Twitter</a
                >
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    class="text-slate-400 hover:text-emerald-400">GitHub</a
                >
                <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noreferrer"
                    class="text-slate-400 hover:text-emerald-400">Discord</a
                >
            </div>
            <div class="mt-8 md:order-1 md:mt-0">
                <p class="text-center text-xs leading-5 text-slate-500">
                    &copy; {new Date().getFullYear()} ChessNet. Hecho con
                    <span class="text-red-500">❤</span> para el ajedrez.
                </p>
            </div>
        </div>
    </footer>
</div>

<style>
    /* Custom animations usually in global.css but added here for specific impact if needed */
    .perspective-1000 {
        perspective: 1000px;
    }
</style>
