<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { Menu, X, Shield } from "lucide-svelte";
    import SEO from "$lib/components/SEO.svelte";
    import Hero from "$lib/components/landing/Hero.svelte";
    import Features from "$lib/components/landing/Features.svelte";
    import Pricing from "$lib/components/landing/Pricing.svelte";
    import CTA from "$lib/components/landing/CTA.svelte";
    import Footer from "$lib/components/landing/Footer.svelte";

    let scrollY = 0;
    let mobileMenuOpen = false;

    // Close mobile menu on Escape key
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && mobileMenuOpen) {
            mobileMenuOpen = false;
        }
    }
</script>

<svelte:window bind:scrollY onkeydown={handleKeydown} />

<SEO />

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
            <div class="flex lg:hidden">
                <button
                    type="button"
                    class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-400 hover:text-white"
                    onclick={() => (mobileMenuOpen = true)}
                >
                    <span class="sr-only">Abrir menú</span>
                    <Menu class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div class="hidden lg:flex lg:gap-x-12">
                <a
                    href="#features"
                    class="text-sm font-medium leading-6 text-slate-200 hover:text-white hover:scale-105 transition-all"
                    >Características</a
                >
                <a
                    href="{base}/donar"
                    class="text-sm font-medium leading-6 text-slate-200 hover:text-white hover:scale-105 transition-all"
                    >Donar</a
                >
                <a
                    href="#pricing"
                    class="text-sm font-medium leading-6 text-slate-200 hover:text-white hover:scale-105 transition-all flex items-center gap-1"
                    >Precios <span
                        class="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30"
                        >BETA</span
                    ></a
                >
                <a
                    href="{base}/hoja-de-ruta"
                    class="text-sm font-medium leading-6 text-slate-200 hover:text-white hover:scale-105 transition-all"
                    >Hoja de Ruta</a
                >
            </div>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
                <a
                    href="{base}/login"
                    aria-label="Iniciar sesión en ChessNet"
                    class="text-sm font-semibold leading-6 text-slate-200 hover:text-white px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg"
                >
                    Iniciar Sesión
                </a>
                <a
                    href="{base}/login"
                    aria-label="Crear cuenta gratuita en ChessNet"
                    class="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:scale-105 hover:shadow-emerald-500/40 transition-all duration-300 cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    Empezar Gratis
                </a>
            </div>
        </nav>
        <!-- Mobile menu -->
        {#if mobileMenuOpen}
            <div class="lg:hidden" role="dialog" aria-modal="true">
                <div class="fixed inset-0 z-50"></div>
                <div
                    class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#0f172a] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10"
                >
                    <div class="flex items-center justify-between">
                        <a
                            href="{base}/"
                            class="-m-1.5 p-1.5 flex items-center gap-2"
                        >
                            <div class="relative bg-slate-900 rounded-lg p-1">
                                <Shield class="w-8 h-8 text-emerald-500" />
                            </div>
                            <span
                                class="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-extrabold tracking-tight"
                                >ChessNet</span
                            >
                        </a>
                        <button
                            type="button"
                            aria-label="Cerrar menú de navegación"
                            class="-m-2.5 rounded-md p-2.5 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            onclick={() => (mobileMenuOpen = false)}
                        >
                            <span class="sr-only">Cerrar menú</span>
                            <X class="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div class="mt-6 flow-root">
                        <div class="-my-6 divide-y divide-gray-500/10">
                            <div class="space-y-2 py-6">
                                <a
                                    href="#features"
                                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-800"
                                    onclick={() => (mobileMenuOpen = false)}
                                    >Características</a
                                >
                                <a
                                    href="{base}/donar"
                                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-800"
                                    onclick={() => (mobileMenuOpen = false)}
                                    >Donar</a
                                >
                                <a
                                    href="#pricing"
                                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-800 flex items-center justify-between"
                                    onclick={() => (mobileMenuOpen = false)}
                                    >Precios <span
                                        class="ml-2 text-sm bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 font-bold"
                                        >BETA</span
                                    ></a
                                >
                                <a
                                    href="{base}/hoja-de-ruta"
                                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-800"
                                    onclick={() => (mobileMenuOpen = false)}
                                    >Hoja de Ruta</a
                                >
                            </div>
                            <div class="py-6">
                                <a
                                    href="{base}/login"
                                    class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-slate-800 w-full text-left"
                                    >Iniciar Sesión</a
                                >
                                <a
                                    href="{base}/login"
                                    class="mt-4 w-full block text-center rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
                                    >Empezar Gratis</a
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </header>

    <Hero />
    <Features />
    <Pricing />
    <CTA />
    <Footer />
</div>
