<script lang="ts">
    import { Heart, Shield } from "lucide-svelte";
    import { base } from "$app/paths";
    import { fade } from "svelte/transition";
    import SEO from "$lib/components/SEO.svelte";
</script>

<SEO
    title="Apoya el Desarrollo"
    description="Ayuda a mantener ChessNet gratuito y en constante mejora. Tu donación nos permite seguir desarrollando nuevas funcionalidades para profesores de ajedrez."
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

    <!-- Navbar simple -->
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

    <main
        class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
    >
        <div in:fade={{ duration: 800 }}>
            <div
                class="inline-flex items-center justify-center p-3 rounded-2xl bg-pink-500/10 text-pink-500 mb-6 border border-pink-500/20 shadow-lg shadow-pink-500/10"
            >
                <Heart class="w-8 h-8 fill-current" />
            </div>

            <h1
                class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6"
            >
                Apoya el desarrollo
            </h1>

            <p
                class="text-lg text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto"
            >
                ChessNet es un proyecto joven creado con pasión por el ajedrez.
                Tu contribución nos ayuda a mantener los servidores y seguir
                desarrollando nuevas funcionalidades gratuitas para la
                comunidad.
            </p>

            <div
                class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl inline-block max-w-md w-full"
            >
                <!-- Stripe Widget -->
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

            <p class="mt-8 text-sm text-slate-500">
                Pago seguro procesado por Stripe. <br />
                Gracias por ser parte de ChessNet.
            </p>
        </div>
    </main>
</div>
