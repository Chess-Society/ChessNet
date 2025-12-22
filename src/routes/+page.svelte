<script lang="ts">
    import { goto } from "$app/navigation";
    import { Shield, Users, Trophy, Brain, ChevronRight } from "lucide-svelte";

    function login() {
        goto("/dashboard");
    }
</script>

<div class="bg-white">
    <!-- Header -->
    <header class="absolute inset-x-0 top-0 z-50">
        <nav
            class="flex items-center justify-between p-6 lg:px-8"
            aria-label="Global"
        >
            <div class="flex lg:flex-1">
                <a
                    href="/"
                    class="-m-1.5 p-1.5 text-2xl font-bold text-primary flex items-center gap-2"
                >
                    <Shield class="w-8 h-8" />
                    ChessNet
                </a>
            </div>
            <div class="hidden lg:flex lg:gap-x-12">
                <a
                    href="#features"
                    class="text-sm font-semibold leading-6 text-gray-900"
                    >Características</a
                >
                <a
                    href="#solutions"
                    class="text-sm font-semibold leading-6 text-gray-900"
                    >Soluciones</a
                >
                <a
                    href="#about"
                    class="text-sm font-semibold leading-6 text-gray-900"
                    >Nosotros</a
                >
            </div>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                <button
                    onclick={login}
                    class="text-sm font-semibold leading-6 text-gray-900 px-4 py-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
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
                class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            ></div>
        </div>

        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
            <h1
                class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
                Plataforma Educativa de Ajedrez Integral
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">
                Gestiona tu academia, enseña con herramientas interactivas y
                organiza torneos. Todo en un solo lugar.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <button
                    onclick={login}
                    class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition cursor-pointer"
                    >Comenzar Gratis</button
                >
                <a
                    href="#features"
                    class="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1"
                    >Ver características <ChevronRight class="w-4 h-4" /></a
                >
            </div>
        </div>
    </div>

    <!-- Features Grid -->
    <div
        id="features"
        class="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 bg-gray-50 rounded-3xl mb-24"
    >
        <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base font-semibold leading-7 text-primary">
                Todo lo que necesitas
            </h2>
            <p
                class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
                Una suite completa para la enseñanza
            </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl
                class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
            >
                <!-- Feature 1 -->
                <div class="flex flex-col">
                    <dt
                        class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900"
                    >
                        <Users class="h-5 w-5 flex-none text-primary" />
                        Gestión de Alumnos
                    </dt>
                    <dd
                        class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600"
                    >
                        <p class="flex-auto">
                            Organiza clases, controla asistencia y sigue el
                            progreso de cada estudiante con informes detallados.
                        </p>
                    </dd>
                </div>
                <!-- Feature 2 -->
                <div class="flex flex-col">
                    <dt
                        class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900"
                    >
                        <Brain class="h-5 w-5 flex-none text-primary" />
                        Material Educativo
                    </dt>
                    <dd
                        class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600"
                    >
                        <p class="flex-auto">
                            Lecciones interactivas, puzzles tácticos y finales.
                            Crea tu propio contenido o usa nuestra biblioteca.
                        </p>
                    </dd>
                </div>
                <!-- Feature 3 -->
                <div class="flex flex-col">
                    <dt
                        class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900"
                    >
                        <Trophy class="h-5 w-5 flex-none text-primary" />
                        Torneos y Competición
                    </dt>
                    <dd
                        class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600"
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
