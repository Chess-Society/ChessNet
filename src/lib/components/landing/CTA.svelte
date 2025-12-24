<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    function login() {
        goto(`${base}/dashboard`);
    }
</script>

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
                Tu enseñanza merece herramientas profesionales.
            </h2>
            <p
                class="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-slate-200"
            >
                Únete a los profesores que ya han dejado atrás el caos de notas
                y hojas de cálculo.
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
