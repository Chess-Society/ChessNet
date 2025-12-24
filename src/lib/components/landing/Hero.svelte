<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { ArrowRight, ChevronRight } from "lucide-svelte";

    function login() {
        goto(`${base}/panel`);
    }
</script>

<div class="relative isolate px-6 pt-14 lg:px-8">
    <div
        class="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 text-center z-10 relative"
    >
        <div class="hidden sm:mb-8 sm:flex sm:justify-center">
            <div
                class="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition-all cursor-default"
            >
                Evoluciona tu enseñanza <span
                    class="font-semibold text-emerald-400"
                    ><span class="absolute inset-0" aria-hidden="true"
                    ></span>v1.0 BETA</span
                >
            </div>
        </div>
        <h1
            class="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6 drop-shadow-2xl"
        >
            La plataforma definitiva para <br />
            <span
                class="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x"
                >Profesores de Ajedrez</span
            >
        </h1>
        <p class="mt-6 text-lg leading-8 text-slate-200 max-w-2xl mx-auto">
            Gestiona tus clases particulares, grupos escolares o tu propia
            academia desde un solo lugar. Olvida el papel y profesionaliza tu
            pasión.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
            <button
                onclick={login}
                class="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-2 group"
            >
                Empezar Gratis
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
                <div class="absolute inset-0 flex items-center justify-center">
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

<style>
    .perspective-1000 {
        perspective: 1000px;
    }
</style>
