<script lang="ts">
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { Shield, Home, ArrowLeft } from "lucide-svelte";
    import SEO from "$lib/components/SEO.svelte";
</script>

<SEO
    title="Página no encontrada - Error 404"
    description="La página que buscas no existe o ha sido movida."
/>

<div
    class="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4"
>
    <!-- Background Pattern -->
    <div class="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div
            class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        ></div>
    </div>

    <div class="relative z-10 max-w-2xl mx-auto text-center">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
            <div class="relative group">
                <div
                    class="absolute -inset-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-300"
                ></div>
                <div class="relative bg-slate-900 rounded-2xl p-4">
                    <Shield class="w-16 h-16 text-emerald-500" />
                </div>
            </div>
        </div>

        <!-- Error Code -->
        <h1
            class="text-9xl font-black bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4"
        >
            404
        </h1>

        <!-- Error Message -->
        <h2 class="text-3xl font-bold text-white mb-4">Página no encontrada</h2>
        <p class="text-lg text-slate-300 mb-8 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
            Verifica la URL o regresa al inicio.
        </p>

        <!-- Error Details (for debugging) -->
        {#if $page.status}
            <div
                class="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700 max-w-md mx-auto"
            >
                <p class="text-sm text-slate-400 font-mono">
                    <span class="text-slate-500">Status:</span>
                    {$page.status}
                </p>
                {#if $page.error?.message}
                    <p class="text-sm text-slate-400 font-mono mt-2">
                        <span class="text-slate-500">Error:</span>
                        {$page.error.message}
                    </p>
                {/if}
            </div>
        {/if}

        <!-- Action Buttons -->
        <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
            <a
                href="{base}/"
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300"
            >
                <Home class="w-5 h-5" />
                Ir al Inicio
            </a>
            <button
                onclick={() => window.history.back()}
                class="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-200 font-semibold rounded-xl hover:bg-slate-700 transition-all duration-300"
            >
                <ArrowLeft class="w-5 h-5" />
                Volver Atrás
            </button>
        </div>

        <!-- Helpful Links -->
        <div class="mt-12 pt-8 border-t border-slate-800">
            <p class="text-sm text-slate-400 mb-4">Enlaces útiles:</p>
            <div class="flex flex-wrap gap-4 justify-center text-sm">
                <a
                    href="{base}/#features"
                    class="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Características
                </a>
                <a
                    href="{base}/pricing"
                    class="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Precios
                </a>
                <a
                    href="{base}/roadmap"
                    class="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Hoja de Ruta
                </a>
                <a
                    href="{base}/donate"
                    class="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Donar
                </a>
            </div>
        </div>
    </div>
</div>
