<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { CheckCircle2, ArrowRight } from "lucide-svelte";

    function login() {
        goto(`${base}/panel`);
    }
</script>

<div id="pricing" class="py-24 sm:py-32 bg-slate-900/30">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl sm:text-center">
            <h2
                class="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
                Empieza gratis. Crece a tu ritmo.
            </h2>
            <p class="mt-6 text-lg leading-8 text-slate-400">
                Desde tus primeras clases particulares hasta gestionar una gran
                escuela. Sin permanencia.
            </p>
        </div>
        <div
            class="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-slate-700 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none"
        >
            <!-- Free -->
            <div class="p-8 sm:p-10 lg:flex-auto">
                <h3 class="text-2xl font-bold tracking-tight text-white">
                    Profesor (Gratis)
                </h3>
                <p class="mt-6 text-base leading-7 text-slate-400">
                    Ideal para clases particulares o grupos extraescolares.
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
                    class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-200 sm:grid-cols-2 sm:gap-6"
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
                    Academia / Pro
                </h3>
                <p class="mt-6 text-base leading-7 text-slate-400">
                    Herramientas avanzadas para escuelas en crecimiento.
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
                    class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-200 sm:grid-cols-2 sm:gap-6"
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
                            href="{base}/precios"
                            class="mt-10 block w-full rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                            >Ver todos los detalles</a
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-12">
            <a
                href="{base}/precios"
                class="text-emerald-400 hover:text-emerald-300 font-medium flex items-center justify-center gap-2 group"
            >
                Comparar todos los planes (incluido Club) <ArrowRight
                    class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
            </a>
        </div>
    </div>
</div>
