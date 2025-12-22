<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { Shield, Users, Trophy, Brain, ChevronRight } from "lucide-svelte";

    function login() {
        goto(`${base}/dashboard`);
    }
</script>

<div class="bg-[#0f172a] min-h-screen text-white selection:bg-blue-500/30">
    <!-- Header -->
    <header class="absolute inset-x-0 top-0 z-50">
        <nav
            class="flex items-center justify-between p-6 lg:px-8"
            aria-label="Global"
        >
            <div class="flex lg:flex-1">
                <a
                    href="{base}/"
                    class="-m-1.5 p-1.5 text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2"
                >
                    <Shield class="w-8 h-8 text-blue-400" />
                    ChessNet
                </a>
            </div>
            <div class="hidden lg:flex lg:gap-x-12">
                <a
                    href="#features"
                    class="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors"
                    >Características</a
                >
                <a
                    href="#solutions"
                    class="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors"
                    >Soluciones</a
                >
                <a
                    href="#about"
                    class="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors"
                    >Nosotros</a
                >
            </div>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                <button
                    onclick={login}
                    class="text-sm font-semibold leading-6 text-white px-4 py-2 hover:bg-slate-800 rounded-lg transition-all cursor-pointer border border-transparent hover:border-slate-700"
                    >Log in <span aria-hidden="true">&rarr;</span></button
                >
            </div>
        </nav>
    </header>

    <!-- Hero -->
    <div class="relative isolate px-6 pt-14 lg:px-8">
        <div
            class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
        >
            <div
                class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            ></div>
        </div>

        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
            <h1
                class="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            >
                Plataforma Educativa de <span class="text-blue-400"
                    >Ajedrez Integral</span
                >
            </h1>
            <p class="mt-6 text-lg leading-8 text-slate-400">
                Gestiona tu academia, enseña con herramientas interactivas y
                organiza torneos. Todo en un solo lugar.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <button
                    onclick={login}
                    class="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105 cursor-pointer"
                    >Comenzar Gratis</button
                >
                <a
                    href="#features"
                    class="text-sm font-semibold leading-6 text-white flex items-center gap-1 hover:text-blue-400 transition-colors"
                    >Ver características <ChevronRight class="w-4 h-4" /></a
                >
            </div>
        </div>
    </div>

    <!-- Features Grid -->
    <div
        id="features"
        class="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 bg-[#1e293b]/50 border border-slate-700/50 rounded-3xl mb-24"
    >
        <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base font-semibold leading-7 text-blue-400">
                Todo lo que necesitas
            </h2>
            <p
                class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
                Una suite completa para la enseñanza
            </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl
                class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
            >
                <!-- Feature 1 -->
                <div
                    class="flex flex-col bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors"
                >
                    <dt
                        class="flex items-center gap-x-3 text-base font-semibold leading-7 text-white"
                    >
                        <Users class="h-5 w-5 flex-none text-blue-400" />
                        Gestión de Alumnos
                    </dt>
                    <dd
                        class="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400"
                    >
                        <p class="flex-auto">
                            Organiza clases, controla asistencia y sigue el
                            progreso de cada estudiante con informes detallados.
                        </p>
                    </dd>
                </div>
                <!-- Feature 2 -->
                <div
                    class="flex flex-col bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
                >
                    <dt
                        class="flex items-center gap-x-3 text-base font-semibold leading-7 text-white"
                    >
                        <Brain class="h-5 w-5 flex-none text-emerald-400" />
                        Material Educativo
                    </dt>
                    <dd
                        class="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400"
                    >
                        <p class="flex-auto">
                            Lecciones interactivas, puzzles tácticos y finales.
                            Crea tu propio contenido o usa nuestra biblioteca.
                        </p>
                    </dd>
                </div>
                <!-- Feature 3 -->
                <div
                    class="flex flex-col bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-orange-500/30 transition-colors"
                >
                    <dt
                        class="flex items-center gap-x-3 text-base font-semibold leading-7 text-white"
                    >
                        <Trophy class="h-5 w-5 flex-none text-orange-400" />
                        Torneos y Competición
                    </dt>
                    <dd
                        class="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400"
                    >
                        <p class="flex-auto">
                            Organiza torneos suizos o round-robin fácilmente.
                            Ranking automático y gamificación integrada.
                        </p>
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</div>
